"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { isStrongPassword, isValidEmail } from "@/lib/validation";
import { resolveGhanaPhone } from "@/lib/phone";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export type AuthFormState = { error?: string; ok?: boolean; demoResetPath?: string } | null;

const REG_COOKIE = "sb_reg";
const DEMO_OTP = "123456";

function safeNext(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) return "/";
  return path;
}

async function ip() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not configured");
  return new TextEncoder().encode(value);
}

function identifierWhere(identifier: string) {
  const phone = resolveGhanaPhone(identifier);
  return {
    OR: [
      { email: identifier.toLowerCase() },
      { username: identifier },
      { phone: identifier },
      ...(phone ? [{ phone }] : []),
    ],
  };
}

async function issueSession(user: {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  loyaltyTier: string;
}) {
  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as "USER" | "ADMIN" | "SUB_ADMIN",
    status: user.status as "ACTIVE" | "SUSPENDED",
    loyaltyTier: user.loyaltyTier,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));
  const limited = rateLimit(clientKey(await ip(), "login"), 10, 60_000);
  if (!limited.ok) return { error: "Too many login attempts. Try again shortly." };
  if (!identifier || !password) return { error: "Enter your mobile number and password." };

  const user = await prisma.user.findFirst({ where: identifierWhere(identifier) });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect mobile number or password." };
  }
  if (user.status === "SUSPENDED") {
    return { error: "This account is deactivated. Open account status to reactivate." };
  }

  await issueSession(user);
  await writeAudit({
    actorId: user.id,
    action: "USER_LOGIN",
    entityType: "User",
    entityId: user.id,
    ip: await ip(),
  });
  redirect(next);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  redirect("/");
}

type RegPayload = { phone: string; verified?: boolean };

async function readReg(): Promise<RegPayload | null> {
  const jar = await cookies();
  const token = jar.get(REG_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const phone = String(payload.phone ?? "");
    if (!phone) return null;
    return { phone, verified: Boolean(payload.verified) };
  } catch {
    return null;
  }
}

async function writeReg(data: RegPayload) {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("20m")
    .sign(secret());
  const jar = await cookies();
  jar.set(REG_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 20,
  });
}

export async function registerStartAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const phoneRaw = String(formData.get("phone") ?? "");
  const privacy = String(formData.get("privacy") ?? "");
  const terms = String(formData.get("terms") ?? "");
  const limited = rateLimit(clientKey(await ip(), "register-start"), 8, 60_000);
  if (!limited.ok) return { error: "Too many attempts. Try again shortly." };
  if (!privacy || !terms) return { error: "Accept the Privacy Policy and Terms, and confirm you are 18+." };
  const phone = resolveGhanaPhone(phoneRaw);
  if (!phone) return { error: "Enter a valid Ghana mobile number." };
  const existing = await prisma.user.findFirst({ where: { phone } });
  if (existing) return { error: "This mobile number already has an account. Log in instead." };
  await writeReg({ phone, verified: false });
  return { ok: true };
}

export async function registerVerifyOtpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const otp = String(formData.get("otp") ?? "").trim();
  const pending = await readReg();
  if (!pending) return { error: "Start again from your mobile number." };
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (demo && otp !== DEMO_OTP) return { error: "Incorrect code. Demo OTP is 123456." };
  if (!demo && otp.length !== 6) return { error: "Enter the 6-digit code." };
  await writeReg({ phone: pending.phone, verified: true });
  return { ok: true };
}

export async function registerCompleteAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const pending = await readReg();
  if (!pending?.verified) return { error: "Verify your mobile number first." };
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const emailRaw = String(formData.get("email") ?? "").trim().toLowerCase();
  const email = emailRaw || `${pending.phone.replace(/^0/, "233")}@users.sportbet.test`;
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return { error: "Username must be 3-20 letters, numbers or underscore." };
  if (!isStrongPassword(password)) {
    return { error: "Password must be at least 8 characters and include a letter and a number." };
  }
  if (!isValidEmail(email)) return { error: "Enter a valid email address." };

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }, { phone: pending.phone }] },
  });
  if (existing) return { error: "An account with those details already exists." };

  const user = await prisma.user.create({
    data: {
      email,
      username,
      phone: pending.phone,
      passwordHash: await hashPassword(password),
      role: "USER",
      wallet: { create: { balancePesewas: 0, withdrawablePesewas: 0 } },
    },
  });
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Account created",
      body: "Welcome to SPORTBET. Play only with money you can afford to lose.",
      href: "/me",
    },
  });
  const jar = await cookies();
  jar.set(REG_COOKIE, "", { path: "/", maxAge: 0 });
  await issueSession({ ...user, role: "USER", status: "ACTIVE" });
  redirect("/me");
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  return registerCompleteAction(_prev, formData);
}

export async function deactivateAccountAction(prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  void prev;
  void formData;
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  if (!session) return { error: "Log in first." };
  if (session.role !== "USER") return { error: "Staff accounts cannot be deactivated here." };
  await prisma.user.update({ where: { id: session.id }, data: { status: "SUSPENDED" } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return { ok: true };
}

export async function reactivateAccountAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) return { error: "Enter your mobile number and password." };
  const user = await prisma.user.findFirst({ where: identifierWhere(identifier) });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect details." };
  }
  await prisma.user.update({ where: { id: user.id }, data: { status: "ACTIVE" } });
  await issueSession({ ...user, status: "ACTIVE" });
  redirect("/me");
}

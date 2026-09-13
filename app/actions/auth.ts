"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { isStrongPassword, isValidEmail, normalizeGhanaPhone } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export type AuthFormState = { error?: string; demoResetPath?: string } | null;

function safeNext(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) return "/";
  return path;
}

async function ip() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));
  const limited = rateLimit(clientKey(await ip(), "login"), 10, 60_000);
  if (!limited.ok) return { error: "Too many login attempts. Try again shortly." };
  if (!identifier || !password) return { error: "Enter your email/username and password." };

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { username: identifier }, { phone: identifier }],
    },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect email or password." };
  }
  if (user.status === "SUSPENDED") {
    return { error: "This account has been suspended. Contact support." };
  }

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

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const phoneRaw = String(formData.get("phone") ?? "");
  const limited = rateLimit(clientKey(await ip(), "register"), 8, 60_000);
  if (!limited.ok) return { error: "Too many attempts. Try again shortly." };
  if (!isValidEmail(email)) return { error: "Enter a valid email address." };
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return { error: "Username must be 3-20 letters, numbers or underscore." };
  if (!isStrongPassword(password)) {
    return { error: "Password must be at least 8 characters and include a letter and a number." };
  }
  const phone = phoneRaw ? normalizeGhanaPhone(phoneRaw) : null;
  if (phoneRaw && !phone) return { error: "Enter a valid Ghana mobile number." };

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }, ...(phone ? [{ phone }] : [])] },
  });
  if (existing) return { error: "An account with those details already exists." };

  const user = await prisma.user.create({
    data: {
      email,
      username,
      phone,
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
  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: "USER",
    status: "ACTIVE",
    loyaltyTier: user.loyaltyTier,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
  redirect("/me");
}

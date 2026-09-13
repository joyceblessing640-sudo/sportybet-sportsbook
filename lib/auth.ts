import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const SESSION_COOKIE = "sb_session";
const SESSION_TTL = "7d";

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "SUB_ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  loyaltyTier: string;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    email: user.email,
    username: user.username,
    role: user.role,
    status: user.status,
    loyaltyTier: user.loyaltyTier,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(secret());
}

export async function readSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      email: String(payload.email),
      username: String(payload.username),
      role: payload.role as SessionUser["role"],
      status: payload.status as SessionUser["status"],
      loyaltyTier: String(payload.loyaltyTier ?? "Bronze"),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await readSessionToken(token);
  if (!session) return null;
  if (session.status === "SUSPENDED") return null;
  return session;
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    throw new AuthError("Please log in to continue.", 401);
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.role !== "ADMIN" && session.role !== "SUB_ADMIN") {
    throw new AuthError("Admin access required.", 403);
  }
  return session;
}

export async function requireFullAdmin() {
  const session = await requireUser();
  if (session.role !== "ADMIN") {
    throw new AuthError("Full admin access required.", 403);
  }
  return session;
}

export async function getUserWithWallet(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

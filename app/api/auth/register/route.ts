import { NextRequest } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isStrongPassword, isValidEmail, normalizeGhanaPhone } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";

const schema = z.object({
  email: z.string(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
  } catch {
    return jsonError("Invalid request origin.", 403);
  }
  const limited = rateLimit(clientKey(requestIp(request), "register"), 8, 60_000);
  if (!limited.ok) return jsonError("Too many attempts. Try again shortly.", 429);

  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return jsonError("Check your details and try again.");

  const email = body.data.email.trim().toLowerCase();
  if (!isValidEmail(email)) return jsonError("Enter a valid email address.");
  if (!isStrongPassword(body.data.password)) {
    return jsonError("Password must be at least 8 characters and include a letter and a number.");
  }
  const phone = body.data.phone ? normalizeGhanaPhone(body.data.phone) : null;
  if (body.data.phone && !phone) return jsonError("Enter a valid Ghana mobile number.");

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username: body.data.username },
        ...(phone ? [{ phone }] : []),
      ],
    },
  });
  if (existing) return jsonError("An account with those details already exists.", 409);

  const user = await prisma.user.create({
    data: {
      email,
      username: body.data.username,
      phone,
      passwordHash: await hashPassword(body.data.password),
      role: "USER",
      wallet: { create: { balancePesewas: 0, withdrawablePesewas: 0 } },
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Account created",
      body: "Welcome to SPORTBET. Verify offers before you opt in, and play only with money you can afford to lose.",
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

  await writeAudit({
    actorId: user.id,
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: user.id,
    ip: requestIp(request),
  });

  const res = jsonOk({ user: { id: user.id, email: user.email, username: user.username } }, 201);
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}

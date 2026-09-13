import { NextRequest } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { writeAudit } from "@/lib/audit";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
  } catch {
    return jsonError("Invalid request origin.", 403);
  }
  const limited = rateLimit(clientKey(requestIp(request), "login"), 10, 60_000);
  if (!limited.ok) return jsonError("Too many login attempts. Try again shortly.", 429);

  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return jsonError("Enter your email/username and password.");

  const identifier = body.data.identifier.trim();
  const { resolveGhanaPhone } = await import("@/lib/phone");
  const phone = resolveGhanaPhone(identifier);
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { username: identifier },
        { phone: identifier },
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (!user || !(await verifyPassword(body.data.password, user.passwordHash))) {
    return jsonError("Incorrect email or password.", 401);
  }
  if (user.status === "SUSPENDED") {
    return jsonError("This account has been suspended. Contact support.", 403);
  }

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role as "USER" | "ADMIN" | "SUB_ADMIN",
    status: user.status as "ACTIVE" | "SUSPENDED",
    loyaltyTier: user.loyaltyTier,
  });

  await writeAudit({
    actorId: user.id,
    action: "USER_LOGIN",
    entityType: "User",
    entityId: user.id,
    ip: requestIp(request),
  });

  const res = jsonOk({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      loyaltyTier: user.loyaltyTier,
    },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}

import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isStrongPassword } from "@/lib/validation";
import { writeAudit } from "@/lib/audit";

const schema = z.object({
  token: z.string().min(10),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
  } catch {
    return jsonError("Invalid request origin.", 403);
  }
  const limited = rateLimit(clientKey(requestIp(request), "reset"), 8, 60_000);
  if (!limited.ok) return jsonError("Too many attempts. Try again shortly.", 429);

  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return jsonError("Invalid reset request.");
  if (!isStrongPassword(body.data.password)) {
    return jsonError("Password must be at least 8 characters and include a letter and a number.");
  }

  const tokenHash = createHash("sha256").update(body.data.token).digest("hex");
  const reset = await prisma.passwordReset.findUnique({ where: { tokenHash } });
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return jsonError("This reset link is invalid or has expired.", 400);
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash: await hashPassword(body.data.password) },
    }),
    prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await writeAudit({
    actorId: reset.userId,
    action: "PASSWORD_RESET",
    entityType: "User",
    entityId: reset.userId,
    ip: requestIp(request),
  });

  return jsonOk({ message: "Password updated. You can log in now." });
}

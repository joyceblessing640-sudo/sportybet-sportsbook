import { NextRequest } from "next/server";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/validation";

const schema = z.object({ email: z.string() });

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
  } catch {
    return jsonError("Invalid request origin.", 403);
  }
  const limited = rateLimit(clientKey(requestIp(request), "forgot"), 5, 60_000);
  if (!limited.ok) return jsonError("Too many attempts. Try again shortly.", 429);

  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success || !isValidEmail(body.data.email)) {
    return jsonError("Enter a valid email address.");
  }

  const email = body.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  const generic = {
    message:
      "If that email is registered, a reset link is available. Email delivery is not configured in this environment.",
  };

  if (!user) return jsonOk(generic);

  const token = randomBytes(24).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 60_000),
    },
  });

  return jsonOk({
    ...generic,
    demoResetPath: `/reset-password?token=${token}`,
  });
}

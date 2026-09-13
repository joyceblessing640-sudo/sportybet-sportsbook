import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { createDeposit } from "@/lib/wallet";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { parseGhsToPesewas } from "@/lib/money";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  method: z.enum(["MOBILE_MONEY", "BANK", "CARD"]),
  provider: z.string().optional(),
  amount: z.string(),
  phone: z.string().optional(),
  reference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const limited = rateLimit(clientKey(session.id, "deposit"), 10, 60_000);
    if (!limited.ok) return jsonError("Too many deposit requests.", 429);
    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Check the deposit form and try again.");
    const amountPesewas = parseGhsToPesewas(body.data.amount);
    if (amountPesewas === null) return jsonError("Enter a valid amount.");

    const deposit = await createDeposit({
      userId: session.id,
      method: body.data.method,
      provider: body.data.provider,
      amountPesewas,
      phone: body.data.phone,
      reference: body.data.reference,
      ip: requestIp(request),
    });

    return jsonOk({
      deposit: {
        id: deposit.id,
        publicId: deposit.publicId,
        status: deposit.status,
        reference: deposit.reference,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error(error);
    return jsonError("Could not submit the deposit.", 500);
  }
}

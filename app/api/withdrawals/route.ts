import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { createWithdrawal } from "@/lib/wallet";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { parseGhsToPesewas } from "@/lib/money";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  method: z.enum(["MOBILE_MONEY", "BANK"]),
  provider: z.string().optional(),
  amount: z.string(),
  phone: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const limited = rateLimit(clientKey(session.id, "withdraw"), 8, 60_000);
    if (!limited.ok) return jsonError("Too many withdrawal requests.", 429);
    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Check the withdrawal form and try again.");
    const amountPesewas = parseGhsToPesewas(body.data.amount);
    if (amountPesewas === null) return jsonError("Enter a valid amount.");

    const withdrawal = await createWithdrawal({
      userId: session.id,
      method: body.data.method,
      provider: body.data.provider,
      amountPesewas,
      phone: body.data.phone,
      accountName: body.data.accountName,
      accountNumber: body.data.accountNumber,
      bankName: body.data.bankName,
      ip: requestIp(request),
    });

    return jsonOk({
      withdrawal: {
        id: withdrawal.id,
        publicId: withdrawal.publicId,
        status: withdrawal.status,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error(error);
    return jsonError("Could not submit the withdrawal.", 500);
  }
}

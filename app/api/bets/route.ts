import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { placeBet } from "@/lib/betting";
import { assertSameOrigin, jsonError, jsonOk } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { parseGhsToPesewas } from "@/lib/money";

const schema = z.object({
  type: z.enum(["SINGLE", "MULTI", "SYSTEM"]),
  stake: z.string(),
  outcomeIds: z.array(z.string()).min(1),
  systemK: z.number().int().optional(),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const limited = rateLimit(clientKey(session.id, "bet"), 20, 60_000);
    if (!limited.ok) return jsonError("Too many bets placed. Wait a moment.", 429);

    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Invalid bet slip.");
    const stakePesewas = parseGhsToPesewas(body.data.stake);
    if (stakePesewas === null) return jsonError("Enter a valid stake.");

    const result = await placeBet({
      userId: session.id,
      type: body.data.type,
      stakePesewas,
      outcomeIds: body.data.outcomeIds,
      systemK: body.data.systemK,
    });

    return jsonOk({
      bet: {
        id: result.bet.id,
        publicId: result.bet.publicId,
        status: result.bet.status,
        potentialWinPesewas: result.bet.potentialWinPesewas,
      },
      balancePesewas: result.balancePesewas,
    });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error(error);
    return jsonError("Could not place this bet.", 500);
  }
}

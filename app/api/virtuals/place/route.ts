import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { assertSameOrigin, jsonError, jsonOk } from "@/lib/http";
import { parseGhsToPesewas } from "@/lib/money";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { placeVirtualBet } from "@/lib/virtuals/bets";

const schema = z.object({
  type: z.enum(["SINGLE", "MULTI"]),
  stake: z.string(),
  picks: z
    .array(
      z.object({
        matchId: z.string(),
        marketId: z.enum(["1X2", "1X2-1UP", "1X2-2UP"]),
        selection: z.enum(["1", "X", "2"]),
      }),
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const limited = rateLimit(clientKey(session.id, "virtual-bet"), 20, 60_000);
    if (!limited.ok) return jsonError("Too many bets placed. Wait a moment.", 429);

    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Invalid virtual bet slip.");
    const stakePesewas = parseGhsToPesewas(body.data.stake);
    if (stakePesewas === null) return jsonError("Enter a valid stake.");

    const result = await placeVirtualBet({
      userId: session.id,
      type: body.data.type,
      stakePesewas,
      picks: body.data.picks,
    });

    return jsonOk({
      ticketId: result.ticket.publicId,
      matchIds: result.matchIds,
      potentialWinPesewas: result.ticket.potentialWinPesewas,
      balancePesewas: result.balancePesewas,
    });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error(error);
    return jsonError("Could not place this virtual bet.", 500);
  }
}

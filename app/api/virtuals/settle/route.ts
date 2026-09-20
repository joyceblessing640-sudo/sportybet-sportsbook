import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { assertSameOrigin, jsonError, jsonOk } from "@/lib/http";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { settleVirtualBet } from "@/lib/virtuals/bets";

const schema = z.object({ ticketId: z.string().min(3) });

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const session = await requireUser();
    const limited = rateLimit(clientKey(session.id, "virtual-settle"), 30, 60_000);
    if (!limited.ok) return jsonError("Too many settle attempts. Wait a moment.", 429);

    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Invalid ticket.");

    const result = await settleVirtualBet(session.id, body.data.ticketId);
    return jsonOk({
      ticketId: result.ticket.publicId,
      won: Boolean(result.ticket.won),
      payoutPesewas: result.ticket.payoutPesewas ?? 0,
      balancePesewas: result.balancePesewas,
      results: "results" in result ? result.results : [],
    });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error(error);
    return jsonError("Could not settle this virtual bet.", 500);
  }
}

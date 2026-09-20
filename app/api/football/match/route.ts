import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/http";
import { loadMatchEvents } from "@/lib/football/sync";
import { ensureFootballSynced } from "@/lib/football/sync";
import { getMatchById } from "@/lib/data";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId");
  if (!matchId) return jsonError("matchId is required.");
  await ensureFootballSynced("live");
  const match = await getMatchById(matchId);
  if (!match) return jsonError("Match not found.", 404);
  const events = match.status === "LIVE" || match.status === "HT" || match.status === "FINISHED"
    ? await loadMatchEvents(match.id)
    : [];
  return jsonOk({ match: serializeMatch(match), events });
}

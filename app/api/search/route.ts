import { NextRequest } from "next/server";
import { searchMatches } from "@/lib/data";
import { jsonOk } from "@/lib/http";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const matches = await searchMatches(q);
  return jsonOk({
    matches: matches.map((m) => ({
      id: m.id,
      league: m.league.name,
      home: m.homeTeam.name,
      away: m.awayTeam.name,
      startTime: m.startTime,
      status: m.status,
    })),
  });
}

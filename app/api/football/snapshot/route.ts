import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/http";
import { getHomePayload, getLivePayload } from "@/lib/data";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const scope = request.nextUrl.searchParams.get("scope") === "live" ? "live" : "home";
  if (scope === "live") {
    const data = await getLivePayload();
    return jsonOk({
      live: data.matches.map(serializeMatch),
      error: data.feed.error,
      syncedAt: data.feed.syncedAt,
    });
  }
  const data = await getHomePayload();
  return jsonOk({
    featured: data.featured.map(serializeMatch),
    live: data.live.map(serializeMatch),
    today: data.today.map(serializeMatch),
    upcoming: data.upcoming.map(serializeMatch),
    error: data.feed.error,
    syncedAt: data.feed.syncedAt,
  });
}

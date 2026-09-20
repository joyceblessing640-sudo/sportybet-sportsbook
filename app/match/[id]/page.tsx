import { notFound } from "next/navigation";
import { MatchDetails } from "@/components/match/match-details";
import { getMatchById } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeMatch } from "@/lib/serialize";
import { ensureFootballSynced, loadMatchEvents } from "@/lib/football/sync";

export const dynamic = "force-dynamic";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id.startsWith("af-")) await ensureFootballSynced("live");
  const match = await getMatchById(id);
  if (!match) notFound();
  const session = await getSession();
  const favorite = session
    ? await prisma.favorite.findUnique({
        where: { userId_matchId: { userId: session.id, matchId: match.id } },
      })
    : null;
  const events = match.sport.id === "football" ? await loadMatchEvents(match.id) : [];
  return <MatchDetails match={serializeMatch(match)} favorited={Boolean(favorite)} events={events} />;
}

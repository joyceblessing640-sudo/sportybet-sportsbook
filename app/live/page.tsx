import { MatchRow } from "@/components/betting/match-card";
import { prisma } from "@/lib/db";
import { liveMinute } from "@/lib/audit";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const raw = await prisma.match.findMany({
    where: { status: { in: ["LIVE", "HT"] } },
    include: {
      league: true,
      sport: true,
      homeTeam: true,
      awayTeam: true,
      markets: { include: { outcomes: { where: { active: true }, orderBy: { code: "asc" } } } },
    },
    orderBy: { startTime: "asc" },
  });
  const matches = await Promise.all(
    raw.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );

  return (
    <div>
      <div className="bg-live px-4 py-4 text-white">
        <p className="text-sm font-bold text-odds">Live Betting</p>
        <p className="text-xs text-white/60">In-play demo matches. Clocks are derived from stored kick-off times.</p>
      </div>
      <section className="bg-live">
        {matches.length === 0 ? (
          <p className="px-4 py-10 text-sm text-white/60">No live demo events right now.</p>
        ) : (
          matches.map((match) => <MatchRow key={match.id} match={match} />)
        )}
      </section>
    </div>
  );
}

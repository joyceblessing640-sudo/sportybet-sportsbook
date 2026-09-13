import { SportsView } from "@/components/sports/sports-view";
import { getLeagues, getSports } from "@/lib/data";
import { prisma } from "@/lib/db";
import { liveMinute } from "@/lib/audit";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
  const [sports, leagues, raw] = await Promise.all([
    getSports(),
    getLeagues(),
    prisma.match.findMany({
      where: { status: { in: ["SCHEDULED", "LIVE", "HT"] } },
      include: {
        league: true,
        sport: true,
        homeTeam: true,
        awayTeam: true,
        markets: { include: { outcomes: { where: { active: true }, orderBy: { code: "asc" } } } },
      },
      orderBy: { startTime: "asc" },
      take: 120,
    }),
  ]);
  const matches = await Promise.all(
    raw.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );
  return (
    <SportsView
      sports={sports.map((s) => ({ id: s.id, name: s.name, slug: s.slug }))}
      leagues={leagues.map((l) => ({
        id: l.id,
        name: l.name,
        slug: l.slug,
        sportId: l.sportId,
        country: l.country,
      }))}
      matches={matches}
    />
  );
}

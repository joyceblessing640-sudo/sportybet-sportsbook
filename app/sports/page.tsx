import { SportsView } from "@/components/sports/sports-view";
import { getLeagues, getSports, matchInclude, withClocks } from "@/lib/data";
import { prisma } from "@/lib/db";
import { serializeMatch } from "@/lib/serialize";
import { excludeDemoFootball } from "@/lib/football/query";
import { ensureFootballSynced } from "@/lib/football/sync";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
  await ensureFootballSynced("home");
  const [sports, leagues, raw] = await Promise.all([
    getSports(),
    getLeagues(),
    prisma.match.findMany({
      where: excludeDemoFootball({ status: { in: ["SCHEDULED", "LIVE", "HT"] } }),
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 120,
    }),
  ]);
  const matches = (await withClocks(raw)).map(serializeMatch);
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

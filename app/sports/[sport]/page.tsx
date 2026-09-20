import { notFound } from "next/navigation";
import { SportsView } from "@/components/sports/sports-view";
import { EmptySport } from "@/components/sports/empty-sport";
import { getLeagues, getSports, matchInclude, withClocks } from "@/lib/data";
import { prisma } from "@/lib/db";
import { serializeMatch } from "@/lib/serialize";
import { catalogSport } from "@/lib/constants";
import { excludeDemoFootball } from "@/lib/football/query";
import { ensureFootballSynced } from "@/lib/football/sync";

export const dynamic = "force-dynamic";

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const found = await prisma.sport.findUnique({ where: { slug: sport } });
  if (!found) {
    const catalog = catalogSport(sport);
    if (!catalog || catalog.slug === "home" || catalog.slug === "live" || catalog.slug === "virtuals") notFound();
    return <EmptySport name={catalog.label} />;
  }
  if (found.id === "football") await ensureFootballSynced("home");
  const [sports, leagues, raw] = await Promise.all([
    getSports(),
    getLeagues(),
    prisma.match.findMany({
      where: excludeDemoFootball({ sportId: found.id, status: { in: ["SCHEDULED", "LIVE", "HT"] } }),
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 80,
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
      initialSport={found.id}
    />
  );
}

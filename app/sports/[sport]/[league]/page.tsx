import { notFound } from "next/navigation";
import { LeagueView } from "@/components/sports/league-view";
import { getMatchesByLeague } from "@/lib/data";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ sport: string; league: string }>;
}) {
  const { league } = await params;
  const data = await getMatchesByLeague(league);
  if (!data) notFound();
  return (
    <LeagueView
      league={{ name: data.league.name, country: data.league.country, sport: data.league.sport.name }}
      matches={data.matches.map(serializeMatch)}
    />
  );
}

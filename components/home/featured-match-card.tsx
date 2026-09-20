"use client";

import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { OddsButton } from "@/components/betting/odds-button";
import { TeamLogo } from "@/components/betting/team-logo";
import { formatKickoff12, isGhanaToday, isGhanaTomorrow } from "@/lib/football/time";
import type { ClientMatch } from "@/lib/serialize";

function kickParts(match: ClientMatch) {
  if (match.status === "LIVE" || match.status === "HT") {
    return {
      live: true as const,
      clock: match.clock ?? "Live",
      score: `${match.homeScore} - ${match.awayScore}`,
    };
  }
  const time = formatKickoff12(match.startTime);
  if (isGhanaToday(match.startTime)) return { live: false as const, time, day: "Today" };
  if (isGhanaTomorrow(match.startTime)) return { live: false as const, time, day: "Tomorrow" };
  return {
    live: false as const,
    time,
    day: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Accra",
      day: "2-digit",
      month: "short",
    }).format(new Date(match.startTime)),
  };
}

export function HomeFeaturedMatch({ match }: { match: ClientMatch }) {
  const market = match.markets.find((item) => item.type === "1X2");
  const kick = kickParts(match);
  const leagueName = match.league.name === "La Liga" ? "LaLiga" : match.league.name;
  const showBest = match.isBestOdds || Boolean(market);

  return (
    <article className="w-[88%] min-w-[88%] shrink-0 snap-center overflow-hidden border border-[#e6e8ec] bg-white">
      <div className="flex items-center gap-1.5 pr-2">
        {match.isHot ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 bg-[#e31c23] px-1.5 py-[3px] text-[10px] font-black tracking-wide text-white">
            HOT
            <span aria-hidden>🔥</span>
          </span>
        ) : null}
        {showBest ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 bg-[#12a150] px-1.5 py-[3px] text-[10px] font-black tracking-wide text-white">
            BEST ODDS
            <span aria-hidden>🔥</span>
          </span>
        ) : null}
        <span className="min-w-0 truncate text-[12px] font-semibold text-accent underline decoration-accent decoration-1 underline-offset-2">
          {match.sport.name} - {leagueName}
        </span>
        <Link href={`/match/${match.id}`} aria-label="Match statistics" className="ml-auto shrink-0">
          <BarChart2 className="h-3.5 w-3.5 text-[#c5cad3]" />
        </Link>
      </div>

      <div className="px-3 pb-2.5 pt-2">
        <Link href={`/match/${match.id}`} className="grid grid-cols-3 items-center">
          <div className="flex justify-center">
            <TeamLogo team={match.home} size="xl" />
          </div>
          <div className="text-center">
            {kick.live ? (
              <>
                <p className="text-[20px] font-bold tabular-nums leading-none text-ink">{kick.score}</p>
                <p className="mt-1 text-[12px] font-semibold text-accent">{kick.clock}</p>
              </>
            ) : (
              <p className="flex items-center justify-center gap-2 text-[15px] font-bold leading-none text-ink">
                <span>{kick.time}</span>
                <span className="inline-block h-3.5 w-px shrink-0 bg-[#c5cad3]" aria-hidden />
                <span>{kick.day}</span>
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <TeamLogo team={match.away} size="xl" />
          </div>
        </Link>

        <div className="mt-2 grid grid-cols-3 items-center">
          <p className="truncate px-0.5 text-center text-[12px] font-medium leading-tight text-[#8a9199]">{match.home.name}</p>
          {market ? <p className="text-center text-[13px] font-bold leading-none text-[#12a150]">1X2</p> : <span />}
          <p className="truncate px-0.5 text-center text-[12px] font-medium leading-tight text-[#8a9199]">{match.away.name}</p>
        </div>

        {market ? (
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} spread />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

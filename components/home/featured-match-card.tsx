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
      <div className="flex items-center gap-1 pr-1.5">
        {match.isHot ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 bg-[#e31c23] px-1 py-px text-[8px] font-black tracking-wide text-white min-[412px]:text-[9px]">
            HOT
            <span aria-hidden>🔥</span>
          </span>
        ) : null}
        {showBest ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 bg-[#12a150] px-1 py-px text-[8px] font-black tracking-wide text-white min-[412px]:text-[9px]">
            BEST ODDS
            <span aria-hidden>🔥</span>
          </span>
        ) : null}
        <span className="min-w-0 truncate text-[11px] font-medium tracking-[0.01em] text-accent underline decoration-accent decoration-1 underline-offset-2">
          {match.sport.name} - {leagueName}
        </span>
        <Link href={`/match/${match.id}`} aria-label="Match statistics" className="ml-auto shrink-0">
          <BarChart2 className="h-3 w-3 text-[#c5cad3]" />
        </Link>
      </div>

      <div className="px-2 pb-2 pt-1.5 min-[412px]:px-2.5">
        <Link href={`/match/${match.id}`} className="grid grid-cols-3 items-center">
          <div className="flex justify-center">
            <TeamLogo team={match.home} size="xl" />
          </div>
          <div className="text-center">
            {kick.live ? (
              <>
                <p className="text-[16px] font-bold tabular-nums leading-none text-ink min-[412px]:text-[18px]">{kick.score}</p>
                <p className="mt-0.5 text-[11px] font-medium text-accent">{kick.clock}</p>
              </>
            ) : (
              <p className="flex items-center justify-center gap-1.5 text-[12px] font-semibold leading-none tracking-[0.01em] text-ink min-[375px]:text-[13px]">
                <span>{kick.time}</span>
                <span className="inline-block h-3 w-px shrink-0 bg-[#c5cad3]" aria-hidden />
                <span>{kick.day}</span>
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <TeamLogo team={match.away} size="xl" />
          </div>
        </Link>

        <div className="mt-1.5 grid grid-cols-3 items-center">
          <p className="truncate px-0.5 text-center text-[11px] font-medium leading-tight tracking-[0.01em] text-[#8a9199]">{match.home.name}</p>
          {market ? <p className="text-center text-[11px] font-semibold leading-none tracking-[0.02em] text-[#12a150] min-[412px]:text-[12px]">1X2</p> : <span />}
          <p className="truncate px-0.5 text-center text-[11px] font-medium leading-tight tracking-[0.01em] text-[#8a9199]">{match.away.name}</p>
        </div>

        {market ? (
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} spread />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { BarChart2 } from "lucide-react";
import { OddsButton } from "@/components/betting/odds-button";
import { TeamBadge } from "@/components/betting/team-badge";
import type { ClientMatch } from "@/lib/serialize";

function kickLabel(match: ClientMatch) {
  if (match.status === "LIVE" || match.status === "HT") {
    return match.clock ?? "Live";
  }
  const start = new Date(match.startTime);
  const time = format(start, "HH:mm");
  if (isToday(start)) return `${time} | Today`;
  if (isTomorrow(start)) return `${time} | Tomorrow`;
  return `${time} | ${format(start, "dd MMM")}`;
}

export function HomeFeaturedMatch({ match }: { match: ClientMatch }) {
  const market = match.markets.find((item) => item.type === "1X2") ?? match.markets[0];
  const live = match.status === "LIVE" || match.status === "HT";

  return (
    <article className="w-[92%] min-w-[92%] shrink-0 snap-start bg-white px-3 pb-3 pt-2">
      <div className="mb-2 flex items-center gap-1.5 text-[11px]">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {match.isHot ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 bg-[#e31c23] px-1.5 py-[2px] text-[9px] font-black tracking-wide text-white">
              HOT
              <span aria-hidden>🔥</span>
            </span>
          ) : null}
          {match.isBestOdds ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 bg-[#12a150] px-1.5 py-[2px] text-[9px] font-black tracking-wide text-white">
              BEST ODDS
              <span aria-hidden>🟡</span>
            </span>
          ) : null}
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] bg-header text-[7px] font-black text-white">
            TV
          </span>
          <span className="min-w-0 truncate font-medium text-accent">
            {match.sport.name} - {match.league.country} - {match.league.name === "La Liga" ? "LaLiga" : match.league.name}
          </span>
        </div>
        <BarChart2 className="h-3.5 w-3.5 shrink-0 text-[#c5cad3]" />
      </div>
      <Link href={`/match/${match.id}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <TeamBadge team={match.home} size="lg" />
          <p className="text-[12px] font-medium leading-tight text-[#8a9199]">{match.home.name}</p>
        </div>
        <div className="text-center">
          {live ? (
            <>
              <p className="text-[22px] font-bold tabular-nums text-ink">
                {match.homeScore} - {match.awayScore}
              </p>
              <p className="mt-0.5 text-[12px] font-semibold text-accent">{kickLabel(match)}</p>
            </>
          ) : (
            <p className="text-[16px] font-bold text-ink">{kickLabel(match)}</p>
          )}
          <p className="mt-1.5 text-[13px] font-bold text-[#12a150]">1X2</p>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <TeamBadge team={match.away} size="lg" />
          <p className="text-[12px] font-medium leading-tight text-[#8a9199]">{match.away.name}</p>
        </div>
      </Link>
      {market ? (
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {market.outcomes.slice(0, 3).map((outcome) => (
            <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} spread />
          ))}
        </div>
      ) : null}
    </article>
  );
}

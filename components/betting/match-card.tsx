"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import type { ClientMatch } from "@/lib/serialize";
import { OddsButton } from "./odds-button";
import { TeamBadge } from "./team-badge";
import { cn } from "@/lib/utils";

function marketByType(match: ClientMatch, type: string) {
  return match.markets.find((m) => m.type === type) ?? match.markets[0];
}

export function FeaturedMatchCard({ match }: { match: ClientMatch }) {
  const market = marketByType(match, "1X2") ?? marketByType(match, "ML");
  const live = match.status === "LIVE" || match.status === "HT";

  return (
    <article className="min-w-[300px] snap-start rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(16,24,40,0.06)]">
      <div className="mb-2 flex items-center gap-2 text-[11px] text-[#6b7280]">
        <span className="rounded bg-[#f3f4f6] px-1.5 py-0.5 font-semibold text-[#374151]">{match.league.name}</span>
        {match.isDemo ? <span className="rounded bg-[#fff4cc] px-1.5 py-0.5 font-semibold text-[#8a6d00]">DEMO</span> : null}
        {live ? <span className="rounded bg-brand px-1.5 py-0.5 font-bold uppercase text-white">Hot</span> : null}
        <span className="ml-auto">{live ? match.clock : format(new Date(match.startTime), "dd MMM HH:mm")}</span>
      </div>
      <Link href={`/match/${match.id}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2">
        <div className="flex flex-col items-center gap-1 text-center">
          <TeamBadge team={match.home} />
          <p className="line-clamp-2 text-xs font-medium text-ink">{match.home.shortName}</p>
        </div>
        <div className="text-center">
          {live ? (
            <>
              <p className="text-xl font-black tabular-nums text-brand">
                {match.homeScore} - {match.awayScore}
              </p>
              <p className="text-[11px] font-semibold text-brand">Live {match.clock}</p>
            </>
          ) : (
            <p className="text-sm font-semibold text-[#9aa3b2]">vs</p>
          )}
          <p className="mt-1 text-[11px] font-semibold text-ink">{market?.name ?? "1X2"}</p>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <TeamBadge team={match.away} />
          <p className="line-clamp-2 text-xs font-medium text-ink">{match.away.shortName}</p>
        </div>
      </Link>
      {market ? (
        <div className="mt-1 flex gap-1.5">
          {market.outcomes.map((outcome) => (
            <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} />
          ))}
        </div>
      ) : null}
      <Link
        href={`/match/${match.id}`}
        className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-brand"
      >
        More markets <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

export function MatchRow({ match, marketType = "1X2" }: { match: ClientMatch; marketType?: string }) {
  const market = marketByType(match, marketType) ?? match.markets[0];
  const live = match.status === "LIVE" || match.status === "HT";

  return (
    <div className={cn("border-b border-[#eef0f4] px-3 py-2.5", live ? "bg-transparent" : "bg-white")}>
      <div className="mb-1.5 flex items-center gap-2 text-[11px]">
        <span className={cn("font-medium", live ? "text-white/55" : "text-[#8b93a3]")}>
          {live ? match.clock : format(new Date(match.startTime), "HH:mm")}
        </span>
        <span className={cn("truncate", live ? "text-white/70" : "text-[#8b93a3]")}>{match.league.name}</span>
        {match.isDemo ? <span className="rounded bg-[#fff4cc] px-1 text-[10px] font-bold text-[#8a6d00]">DEMO</span> : null}
        <Link href={`/match/${match.id}`} className={cn("ml-auto", live ? "text-white/50" : "text-[#c0c5d0]")}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(140px,1.1fr)] items-center gap-3">
        <Link href={`/match/${match.id}`} className="min-w-0">
          <p className={cn("truncate text-sm font-medium", live ? "text-white" : "text-ink")}>{match.home.shortName}</p>
          <p className={cn("truncate text-sm font-medium", live ? "text-white" : "text-ink")}>{match.away.shortName}</p>
        </Link>
        {live ? (
          <div className="flex items-center gap-2">
            <div className="w-6 text-right text-sm font-bold text-white">
              <div>{match.homeScore}</div>
              <div>{match.awayScore}</div>
            </div>
            {market ? (
              <div className="flex min-w-0 flex-1 gap-1">
                {market.outcomes.slice(0, 3).map((outcome) => (
                  <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} compact />
                ))}
              </div>
            ) : null}
          </div>
        ) : market ? (
          <div className="flex gap-1">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} compact />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LeagueMatchTable({
  matches,
  marketType,
}: {
  matches: ClientMatch[];
  marketType: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_4px_rgba(16,24,40,0.06)]">
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} marketType={marketType} />
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight, Flame } from "lucide-react";
import type { ClientMatch } from "@/lib/serialize";
import { OddsButton } from "./odds-button";
import { TeamBadge } from "./team-badge";
import { cn } from "@/lib/utils";

function marketByType(match: ClientMatch, type: string) {
  return match.markets.find((m) => m.type === type) ?? match.markets[0];
}

function columnHeaders(marketType: string, outcomes: { label: string }[]) {
  if (marketType === "1X2" || marketType === "DC" || marketType === "FH") {
    return outcomes.slice(0, 3).map((o) => o.label);
  }
  return outcomes.slice(0, 3).map((o) => o.label);
}

export function DateOddsHeader({
  label,
  headers,
  dark,
}: {
  label: string;
  headers: string[];
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-[11px] font-semibold",
        dark ? "text-white/55" : "text-[#8b93a3]",
      )}
    >
      <span className="min-w-0 flex-1 truncate uppercase tracking-wide">{label}</span>
      <div className="grid w-[46%] grid-cols-3 text-center">
        {headers.slice(0, 3).map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
    </div>
  );
}

function Badges({ match }: { match: ClientMatch }) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      {match.isHot ? (
        <span className="inline-flex items-center gap-0.5 rounded bg-[#ed1c24] px-1 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
          <Flame className="h-2.5 w-2.5 fill-white" />
          Hot
        </span>
      ) : null}
      {match.isBestOdds ? (
        <span className="inline-flex items-center rounded bg-[#12a150] px-1 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
          Best Odds
        </span>
      ) : null}
    </span>
  );
}

export function FeaturedMatchCard({ match }: { match: ClientMatch }) {
  const market = marketByType(match, "1X2") ?? marketByType(match, "ML");
  const live = match.status === "LIVE" || match.status === "HT";

  return (
    <article className="min-w-[300px] snap-start rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(16,24,40,0.06)]">
      <div className="mb-2 flex items-center gap-2 text-[11px] text-[#6b7280]">
        <span className="rounded bg-[#f3f4f6] px-1.5 py-0.5 font-semibold text-[#374151]">{match.league.name}</span>
        <Badges match={match} />
        {match.isDemo ? <span className="rounded bg-[#fff4cc] px-1.5 py-0.5 font-semibold text-[#8a6d00]">DEMO</span> : null}
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
      <Link href={`/match/${match.id}`} className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-brand">
        More markets <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

export function MatchRow({
  match,
  marketType = "1X2",
  compactOdds = false,
  onDark = false,
}: {
  match: ClientMatch;
  marketType?: string;
  compactOdds?: boolean;
  onDark?: boolean;
}) {
  const market = marketByType(match, marketType) ?? match.markets[0];
  const live = match.status === "LIVE" || match.status === "HT";
  const kick = live ? match.clock : format(new Date(match.startTime), "HH:mm");
  const leagueLine = `${match.league.country} - ${match.league.name}`;
  const light = !onDark;

  return (
    <div className={cn("border-b px-3 py-2.5", onDark ? "border-white/10 bg-transparent" : "border-[#eef0f4] bg-white")}>
      <div className="mb-1 flex items-center gap-1.5 text-[11px]">
        <Badges match={match} />
        <span className={cn("font-medium", light ? "text-[#6b7280]" : "text-white/70")}>{kick}</span>
        <span className={cn("tabular-nums", light ? "text-[#9aa3b2]" : "text-white/45")}>ID {match.displayId}</span>
        <span className={cn("min-w-0 flex-1 truncate", light ? "text-[#8b93a3]" : "text-white/55")}>{leagueLine}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(132px,0.95fr)] items-center gap-2">
        <Link href={`/match/${match.id}`} className="min-w-0">
          <p className={cn("flex items-center justify-between gap-2 truncate text-sm font-medium", light ? "text-ink" : "text-white")}>
            <span className="truncate">{match.home.shortName}</span>
            {live ? <span className={cn("tabular-nums", light ? "text-ink" : "text-white")}>{match.homeScore}</span> : null}
          </p>
          <p className={cn("flex items-center justify-between gap-2 truncate text-sm font-medium", light ? "text-ink" : "text-white")}>
            <span className="truncate">{match.away.shortName}</span>
            {live ? <span className={cn("tabular-nums", light ? "text-ink" : "text-white")}>{match.awayScore}</span> : null}
          </p>
          <p className={cn("mt-0.5 text-[11px] font-semibold", light ? "text-[#8b93a3]" : "text-white/50")}>
            +{match.extraMarkets}
          </p>
        </Link>
        {market ? (
          <div className="flex gap-1">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <OddsButton
                key={outcome.id}
                match={match}
                marketName={market.name}
                outcome={outcome}
                compact
                hideLabel={compactOdds}
              />
            ))}
          </div>
        ) : (
          <div className="text-right text-xs text-[#9aa3b2]">Locked</div>
        )}
      </div>
    </div>
  );
}

export function MatchList({
  matches,
  marketType,
  dark,
  dateLabel,
}: {
  matches: ClientMatch[];
  marketType: string;
  dark?: boolean;
  dateLabel?: string;
}) {
  const sample = matches[0];
  const market = sample ? marketByType(sample, marketType) ?? sample.markets[0] : null;
  const headers = market ? columnHeaders(marketType, market.outcomes) : ["1", "X", "2"];
  return (
    <div className={dark ? "bg-live text-white" : "overflow-hidden bg-white"}>
      {dateLabel ? <DateOddsHeader label={dateLabel} headers={headers} dark={dark} /> : null}
      {matches.map((match) => (
        <MatchRow key={match.id} match={match} marketType={marketType} compactOdds onDark={dark} />
      ))}
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
  return <MatchList matches={matches} marketType={marketType} dateLabel="Fixtures" />;
}

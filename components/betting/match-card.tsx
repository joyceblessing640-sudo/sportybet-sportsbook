"use client";

import Link from "next/link";
import { format } from "date-fns";
import type { ClientMatch } from "@/lib/serialize";
import { OddsButton } from "./odds-button";
import { TeamBadge } from "./team-badge";
import { cn } from "@/lib/utils";

function marketByType(match: ClientMatch, type: string) {
  return match.markets.find((m) => m.type === type) ?? match.markets[0];
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
        "flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold",
        dark ? "text-white/55" : "text-muted",
      )}
    >
      <span className="min-w-0 flex-1 truncate uppercase tracking-wide">{label}</span>
      <div className="grid w-[48%] max-w-[200px] grid-cols-3 text-center">
        {headers.slice(0, 3).map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
    </div>
  );
}

export function FeaturedMatchCard({ match }: { match: ClientMatch }) {
  return <MatchCard match={match} showOu />;
}

export function MatchCard({
  match,
  marketType = "1X2",
  showOu = false,
  onDark = false,
}: {
  match: ClientMatch;
  marketType?: string;
  showOu?: boolean;
  onDark?: boolean;
}) {
  const market = marketByType(match, marketType) ?? match.markets[0];
  const ou = match.markets.find((m) => m.type === "OU");
  const live = match.status === "LIVE" || match.status === "HT";
  const kick = live ? match.clock : format(new Date(match.startTime), "HH:mm");
  const light = !onDark;

  return (
    <article
      className={cn(
        "card-hover border-b px-3 py-2",
        onDark ? "border-white/10 bg-transparent" : "border-line bg-white",
      )}
    >
      <div className="mb-1 flex items-center gap-1.5 text-[11px]">
        {live ? <span className="live-dot" aria-hidden /> : null}
        {live ? <span className="font-bold uppercase tracking-wide text-brand">Live</span> : null}
        <span className={cn("truncate font-medium", light ? "text-muted" : "text-white/60")}>
          {match.league.country} · {match.league.name}
        </span>
        <span className={cn("ml-auto tabular-nums", light ? "text-muted" : "text-white/55")}>{kick}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(128px,0.95fr)] items-center gap-2">
        <Link href={`/match/${match.id}`} className="min-w-0">
          <p className={cn("flex items-center gap-1.5 truncate text-[13px] font-medium", light ? "text-ink" : "text-white")}>
            <TeamBadge team={match.home} size="sm" />
            <span className="min-w-0 truncate">{match.home.shortName}</span>
            {live ? <span className="ml-auto tabular-nums font-bold">{match.homeScore}</span> : null}
          </p>
          <p className={cn("mt-1 flex items-center gap-1.5 truncate text-[13px] font-medium", light ? "text-ink" : "text-white")}>
            <TeamBadge team={match.away} size="sm" />
            <span className="min-w-0 truncate">{match.away.shortName}</span>
            {live ? <span className="ml-auto tabular-nums font-bold">{match.awayScore}</span> : null}
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
                hideLabel={market.outcomes.length > 2}
              />
            ))}
          </div>
        ) : (
          <p className="text-right text-[11px] text-muted">Locked</p>
        )}
      </div>
      {showOu && ou ? (
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={cn("w-10 shrink-0 text-[10px] font-semibold", light ? "text-muted" : "text-white/50")}>
            {ou.line ?? "O/U"}
          </span>
          <div className="flex min-w-0 flex-1 gap-1">
            {ou.outcomes.slice(0, 2).map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={ou.name} outcome={outcome} compact />
            ))}
          </div>
          <Link href={`/match/${match.id}`} className={cn("shrink-0 text-[11px] font-semibold", light ? "text-brand" : "text-[#8dffb8]")}>
            +{match.extraMarkets}
          </Link>
        </div>
      ) : (
        <Link href={`/match/${match.id}`} className={cn("mt-1 inline-block text-[11px] font-semibold", light ? "text-muted" : "text-white/45")}>
          +{match.extraMarkets} markets
        </Link>
      )}
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
  void compactOdds;
  return <MatchCard match={match} marketType={marketType} onDark={onDark} showOu={!onDark && marketType === "1X2"} />;
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
  const headers = market ? market.outcomes.slice(0, 3).map((o) => o.label) : ["1", "X", "2"];
  return (
    <div className={dark ? "bg-live text-white" : "overflow-hidden rounded-md border border-line bg-white"}>
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

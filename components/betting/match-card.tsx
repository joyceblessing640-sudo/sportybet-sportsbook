"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CountryMark } from "@/components/brand/country-mark";
import type { ClientMatch } from "@/lib/serialize";
import { OddsButton } from "./odds-button";
import { TeamBadge } from "./team-badge";
import { cn } from "@/lib/utils";

function marketByType(match: ClientMatch, type: string) {
  return match.markets.find((m) => m.type === type) ?? match.markets[0];
}

export function groupByLeague(matches: ClientMatch[]) {
  const map = new Map<string, ClientMatch[]>();
  for (const match of matches) {
    const key = `${match.league.country}||${match.league.name}||${match.league.slug}`;
    map.set(key, [...(map.get(key) ?? []), match]);
  }
  return [...map.entries()].map(([key, list]) => {
    const [country, name, slug] = key.split("||");
    return { country, name, slug, matches: list };
  });
}

export function DateOddsHeader({
  label,
  headers,
  dark,
  country,
}: {
  label: string;
  headers: string[];
  dark?: boolean;
  country?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold",
        dark ? "text-white/55" : "bg-[#f7f9f8] text-muted",
      )}
    >
      {country ? <CountryMark country={country} /> : null}
      <span className="min-w-0 flex-1 truncate uppercase tracking-wide">{label}</span>
      <div className="grid w-[9.75rem] grid-cols-3 text-center sm:w-[11rem]">
        {headers.slice(0, 3).map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
    </div>
  );
}

export function FeaturedMatchCard({ match }: { match: ClientMatch }) {
  const market = marketByType(match, "1X2");
  const live = match.status === "LIVE" || match.status === "HT";
  const kick = live ? match.clock : format(new Date(match.startTime), "HH:mm");

  return (
    <article className="card-hover w-[268px] shrink-0 rounded-md border border-line bg-white p-2.5">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px]">
        {live ? <span className="live-dot" aria-hidden /> : null}
        {live ? <span className="font-bold uppercase tracking-wide text-brand">Live</span> : null}
        <CountryMark country={match.league.country} />
        <span className="min-w-0 truncate font-medium text-muted">
          {match.league.country} · {match.league.name}
        </span>
        <span className="ml-auto tabular-nums text-muted">{kick}</span>
      </div>
      <Link href={`/match/${match.id}`} className="block">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <TeamBadge team={match.home} size="sm" />
          <span className="min-w-0 flex-1 truncate">{match.home.shortName}</span>
          {live ? <span className="tabular-nums font-bold">{match.homeScore}</span> : null}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <TeamBadge team={match.away} size="sm" />
          <span className="min-w-0 flex-1 truncate">{match.away.shortName}</span>
          {live ? <span className="tabular-nums font-bold">{match.awayScore}</span> : null}
        </p>
      </Link>
      {market ? (
        <div className="mt-2 flex gap-1">
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
      ) : null}
      <Link href={`/match/${match.id}`} className="mt-1.5 inline-block text-[11px] font-semibold text-brand">
        +{match.extraMarkets} markets
      </Link>
    </article>
  );
}

export function MatchCard({
  match,
  marketType = "1X2",
  showOu = false,
  onDark = false,
  hideLeague = false,
}: {
  match: ClientMatch;
  marketType?: string;
  showOu?: boolean;
  onDark?: boolean;
  hideLeague?: boolean;
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
      {hideLeague ? (
        <div className="mb-1 flex items-center justify-end text-[11px]">
          {live ? <span className="mr-auto flex items-center gap-1.5 font-bold uppercase tracking-wide text-brand"><span className="live-dot" /> Live</span> : null}
          <span className={cn("tabular-nums", light ? "text-muted" : "text-white/55")}>{kick}</span>
        </div>
      ) : (
      <div className="mb-1 flex items-center gap-1.5 text-[11px]">
        {live ? <span className="live-dot" aria-hidden /> : null}
        {live ? <span className="font-bold uppercase tracking-wide text-brand">Live</span> : null}
        <CountryMark country={match.league.country} />
        <span className={cn("min-w-0 truncate font-medium", light ? "text-muted" : "text-white/60")}>
          {match.league.country} · {match.league.name}
        </span>
        <span className={cn("ml-auto tabular-nums", light ? "text-muted" : "text-white/55")}>{kick}</span>
      </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_9.75rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_11rem]">
        <Link href={`/match/${match.id}`} className="min-w-0">
          <p className={cn("flex items-center gap-1.5 truncate text-[13px] font-medium", light ? "text-ink" : "text-white")}>
            <TeamBadge team={match.home} size="sm" />
            <span className="min-w-0 truncate">{match.home.shortName}</span>
          </p>
          <p className={cn("mt-1 flex items-center gap-1.5 truncate text-[13px] font-medium", light ? "text-ink" : "text-white")}>
            <TeamBadge team={match.away} size="sm" />
            <span className="min-w-0 truncate">{match.away.shortName}</span>
          </p>
        </Link>
        {live ? (
          <div className={cn("w-4 text-right text-[13px] font-bold tabular-nums", light ? "text-ink" : "text-white")}>
            <p>{match.homeScore}</p>
            <p className="mt-1">{match.awayScore}</p>
          </div>
        ) : (
          <span className="w-0" />
        )}
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
        <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto_9.75rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_11rem]">
          <Link href={`/match/${match.id}`} className={cn("text-[11px] font-semibold", light ? "text-brand" : "text-[#8dffb8]")}>
            +{match.extraMarkets} markets
          </Link>
          <span className={cn("text-[10px] font-semibold", light ? "text-muted" : "text-white/50")}>{ou.line ?? "O/U"}</span>
          <div className="flex gap-1">
            {ou.outcomes.slice(0, 2).map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={ou.name} outcome={outcome} compact />
            ))}
          </div>
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
  hideLeague = false,
}: {
  match: ClientMatch;
  marketType?: string;
  compactOdds?: boolean;
  onDark?: boolean;
  hideLeague?: boolean;
}) {
  void compactOdds;
  return <MatchCard match={match} marketType={marketType} onDark={onDark} showOu={!onDark && marketType === "1X2"} hideLeague={hideLeague} />;
}

export function MatchList({
  matches,
  marketType,
  dark,
  dateLabel,
  groupLeagues = false,
}: {
  matches: ClientMatch[];
  marketType: string;
  dark?: boolean;
  dateLabel?: string;
  groupLeagues?: boolean;
}) {
  const sample = matches[0];
  const market = sample ? marketByType(sample, marketType) ?? sample.markets[0] : null;
  const headers = market ? market.outcomes.slice(0, 3).map((o) => o.label) : ["1", "X", "2"];
  const groups = groupLeagues ? groupByLeague(matches) : null;

  return (
    <div className={dark ? "bg-live text-white" : "overflow-hidden rounded-md border border-line bg-white"}>
      {dateLabel && groups ? (
        <p className={cn("px-3 py-1 text-[10px] font-semibold uppercase tracking-wide", dark ? "text-white/45" : "text-muted")}>
          {dateLabel}
        </p>
      ) : null}
      {dateLabel && !groups ? <DateOddsHeader label={dateLabel} headers={headers} dark={dark} /> : null}
      {groups
        ? groups.map((group) => (
            <div key={group.slug + group.name}>
              <DateOddsHeader label={group.name} headers={headers} dark={dark} country={group.country} />
              {group.matches.map((match) => (
                <MatchRow key={match.id} match={match} marketType={marketType} compactOdds onDark={dark} hideLeague />
              ))}
            </div>
          ))
        : matches.map((match) => (
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

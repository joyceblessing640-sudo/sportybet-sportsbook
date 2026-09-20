"use client";

import Link from "next/link";
import { formatKickoff } from "@/lib/football/time";
import { BarChart2 } from "lucide-react";
import { CountryMark } from "@/components/brand/country-mark";
import type { ClientMatch } from "@/lib/serialize";
import { OddsButton } from "./odds-button";
import { TeamBadge } from "./team-badge";
import { cn } from "@/lib/utils";

function marketByType(match: ClientMatch, type: string) {
  return match.markets.find((m) => m.type === type);
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
      <div className={cn("grid text-center", headers.length === 2 ? "w-[6.5rem] grid-cols-2" : "w-[9.75rem] grid-cols-3 sm:w-[11rem]")}>
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
  const kick = live ? match.clock : formatKickoff(match.startTime);

  return (
    <article className="bg-white px-3 pb-3 pt-2">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted">
        <CountryMark country={match.league.country} />
        <span className="min-w-0 flex-1 truncate">
          {match.sport.name} - {match.league.country} - {match.league.name}
        </span>
        <BarChart2 className="h-3.5 w-3.5 shrink-0 text-[#c5cad3]" />
      </div>
      <Link href={`/match/${match.id}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex flex-col items-center gap-1 text-center">
          <TeamBadge team={match.home} size="lg" />
          <p className="text-[12px] font-medium leading-tight text-ink">{match.home.shortName}</p>
        </div>
        <div className="text-center">
          {live ? (
            <>
              <p className="text-[22px] font-bold tabular-nums text-ink">
                {match.homeScore} - {match.awayScore}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-accent">
                Live {kick} {match.periodLabel ?? ""}
              </p>
            </>
          ) : (
            <>
              <p className="text-[16px] font-bold text-[#9aa3b2]">VS</p>
              <p className="mt-0.5 text-[11px] text-muted">{kick}</p>
            </>
          )}
          <p className="mt-1 text-[11px] font-bold text-ink">1X2</p>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <TeamBadge team={match.away} size="lg" />
          <p className="text-[12px] font-medium leading-tight text-ink">{match.away.shortName}</p>
        </div>
      </Link>
      {market ? (
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {market.outcomes.slice(0, 3).map((outcome) => (
            <div key={outcome.id} className="text-center">
              <p className="mb-1 text-[11px] text-muted">{outcome.label}</p>
              <OddsButton match={match} marketName={market.name} outcome={outcome} compact hideLabel />
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MatchCard({
  match,
  marketType = "1X2",
  showOu = false,
  onDark = false,
  hideLeague = false,
  showBadges = false,
}: {
  match: ClientMatch;
  marketType?: string;
  showOu?: boolean;
  onDark?: boolean;
  hideLeague?: boolean;
  showBadges?: boolean;
}) {
  const market = marketByType(match, marketType);
  const ou = match.markets.find((m) => m.type === "OU");
  const live = match.status === "LIVE" || match.status === "HT";
  const clock = live ? match.clock : formatKickoff(match.startTime);
  const period =
    live && match.periodLabel && match.periodLabel !== clock && !String(clock ?? "").includes(match.periodLabel)
      ? match.periodLabel
      : null;
  const kick = period ? `${clock} ${period}` : clock;
  const light = !onDark;
  const cols = Math.min(market?.outcomes.length ?? 3, 3);
  const oddsWidth = cols === 2 ? "w-[6.5rem]" : "w-[9.75rem] sm:w-[11rem]";

  return (
    <article
      className={cn(
        "border-b px-3 py-2",
        onDark ? "on-dark border-white/10 bg-transparent" : "border-line bg-white",
      )}
    >
      {showBadges && (match.isHot || match.isBestOdds) ? (
        <div className="mb-1 flex items-center gap-0">
          {match.isHot ? (
            <span className="inline-flex items-center gap-0.5 bg-[#e31c23] px-1.5 py-[1px] text-[9px] font-black tracking-wide text-white">
              HOT
              <span aria-hidden>🔥</span>
            </span>
          ) : null}
          {match.isBestOdds ? (
            <span className="inline-flex items-center gap-0.5 bg-[#12a150] px-1.5 py-[1px] text-[9px] font-black tracking-wide text-white">
              BEST ODDS
              <span aria-hidden>🟡</span>
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="mb-1 flex items-center gap-1.5 text-[11px]">
        <span className={cn("tabular-nums font-semibold", live ? "text-accent" : light ? "text-muted" : "text-white/70")}>
          {kick}
        </span>
        {hideLeague ? null : (
          <span className={cn("min-w-0 truncate", light ? "text-muted" : "text-white/55")}>
            {match.league.country} - {match.league.name}
          </span>
        )}
        <BarChart2 className={cn("ml-auto h-3.5 w-3.5 shrink-0", light ? "text-[#c5cad3]" : "text-white/35")} />
      </div>
      <div
        className={cn(
          "grid items-center gap-2",
          cols === 2
            ? "grid-cols-[minmax(0,1fr)_auto_6.5rem]"
            : "grid-cols-[minmax(0,1fr)_auto_9.75rem] sm:grid-cols-[minmax(0,1fr)_auto_11rem]",
        )}
      >
        <Link href={`/match/${match.id}`} className="min-w-0">
          <p className={cn("truncate text-[13px] font-medium", light ? "text-ink" : "text-white")}>{match.home.shortName}</p>
          <p className={cn("mt-0.5 truncate text-[13px] font-medium", light ? "text-ink" : "text-white")}>{match.away.shortName}</p>
        </Link>
        {live ? (
          <div className={cn("w-4 text-right text-[13px] font-bold tabular-nums", light ? "text-ink" : "text-white")}>
            <p>{match.homeScore}</p>
            <p className="mt-0.5">{match.awayScore}</p>
          </div>
        ) : (
          <span className="w-0" />
        )}
        {market ? (
          <div className={cn("flex gap-1", oddsWidth)}>
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
          <span className="w-0" />
        )}
      </div>
      {showOu && ou ? (
        <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto_9.75rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_11rem]">
          {match.extraMarkets > 0 ? (
            <Link href={`/match/${match.id}`} className={cn("text-[11px] font-semibold", light ? "text-accent" : "text-accent")}>
              +{match.extraMarkets}
            </Link>
          ) : (
            <span />
          )}
          <span className={cn("text-[10px] font-semibold", light ? "text-muted" : "text-white/50")}>{ou.line ?? "O/U"}</span>
          <div className="flex gap-1">
            {ou.outcomes.slice(0, 2).map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={ou.name} outcome={outcome} compact />
            ))}
          </div>
        </div>
      ) : match.extraMarkets > 0 ? (
        <Link href={`/match/${match.id}`} className={cn("mt-0.5 inline-block text-[11px] font-semibold", light ? "text-accent" : "text-accent")}>
          +{match.extraMarkets}
        </Link>
      ) : null}
    </article>
  );
}

export function MatchRow({
  match,
  marketType = "1X2",
  compactOdds = false,
  onDark = false,
  hideLeague = false,
  showBadges = false,
}: {
  match: ClientMatch;
  marketType?: string;
  compactOdds?: boolean;
  onDark?: boolean;
  hideLeague?: boolean;
  showBadges?: boolean;
}) {
  void compactOdds;
  return (
    <MatchCard
      match={match}
      marketType={marketType}
      onDark={onDark}
      showOu={!onDark && marketType === "1X2"}
      hideLeague={hideLeague}
      showBadges={showBadges}
    />
  );
}

export function MatchList({
  matches,
  marketType,
  dark,
  dateLabel,
  groupLeagues = false,
  showBadges = false,
}: {
  matches: ClientMatch[];
  marketType: string;
  dark?: boolean;
  dateLabel?: string;
  groupLeagues?: boolean;
  showBadges?: boolean;
}) {
  const playable =
    marketType === "1X2"
      ? matches
      : matches.filter((match) => match.markets.some((market) => market.type === marketType));
  const sample = playable[0];
  const market = sample ? marketByType(sample, marketType) : null;
  const headers = market ? market.outcomes.slice(0, 3).map((o) => o.label) : marketType === "OU" || marketType === "FHOU" ? ["Over", "Under"] : marketType === "DC" ? ["1X", "12", "X2"] : ["1", "X", "2"];
  const groups = groupLeagues ? groupByLeague(playable) : null;

  if (playable.length === 0) {
    return (
      <div className={dark ? "bg-live text-white" : "overflow-hidden rounded-md border border-line bg-white"}>
        {dateLabel ? <DateOddsHeader label={dateLabel} headers={headers} dark={dark} /> : null}
        <p className={cn("px-3 py-6 text-[13px]", dark ? "text-white/55" : "text-muted")}>No matches available</p>
      </div>
    );
  }

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
                <MatchRow key={match.id} match={match} marketType={marketType} compactOdds onDark={dark} hideLeague showBadges={showBadges} />
              ))}
            </div>
          ))
        : playable.map((match) => (
            <MatchRow key={match.id} match={match} marketType={marketType} compactOdds onDark={dark} showBadges={showBadges} />
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

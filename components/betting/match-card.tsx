"use client";

import Link from "next/link";
import { formatFixtureDay, formatKickoff, formatKickoff12 } from "@/lib/football/time";
import { BarChart2 } from "lucide-react";
import { CountryMark } from "@/components/brand/country-mark";
import type { ClientMatch } from "@/lib/serialize";
import { OddsButton } from "./odds-button";
import { TeamBadge } from "./team-badge";
import { cn } from "@/lib/utils";

function marketByType(match: ClientMatch, type: string) {
  return match.markets.find((m) => m.type === type);
}

function oddsColClass(count: number) {
  return count <= 2 ? "w-[5.5rem] min-[412px]:w-[6rem]" : "w-[8.25rem] min-[412px]:w-[8.75rem]";
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

function groupByDate(matches: ClientMatch[]) {
  const map = new Map<string, ClientMatch[]>();
  for (const match of matches) {
    const key = formatFixtureDay(match.startTime);
    map.set(key, [...(map.get(key) ?? []), match]);
  }
  return [...map.entries()];
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
  const cols = Math.min(headers.length, 3);
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 text-[11px] min-[412px]:px-3",
        dark ? "text-white/55" : "bg-white text-[#6b7280]",
      )}
    >
      {country ? <CountryMark country={country} /> : null}
      <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
      <div className={cn("grid shrink-0 text-center text-[10px] font-medium", cols <= 2 ? "w-[5.5rem] grid-cols-2 min-[412px]:w-[6rem]" : "w-[8.25rem] grid-cols-3 min-[412px]:w-[8.75rem]")}>
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
    <article className="bg-white px-2.5 pb-2.5 pt-1.5 min-[412px]:px-3">
      <div className="mb-1.5 flex items-center gap-1 text-[10px] text-muted">
        <CountryMark country={match.league.country} />
        <span className="min-w-0 flex-1 truncate">
          {match.sport.name} - {match.league.country} - {match.league.name}
        </span>
        <BarChart2 className="h-3 w-3 shrink-0 text-[#c5cad3]" />
      </div>
      <Link href={`/match/${match.id}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5">
        <div className="flex flex-col items-center gap-0.5 text-center">
          <TeamBadge team={match.home} size="lg" />
          <p className="text-[11px] font-medium leading-tight text-ink">{match.home.shortName}</p>
        </div>
        <div className="text-center">
          {live ? (
            <>
              <p className="text-[18px] font-bold tabular-nums text-ink">
                {match.homeScore} - {match.awayScore}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-accent">
                Live {kick} {match.periodLabel ?? ""}
              </p>
            </>
          ) : (
            <>
              <p className="text-[13px] font-bold text-[#9aa3b2]">VS</p>
              <p className="mt-0.5 text-[10px] text-muted">{kick}</p>
            </>
          )}
          <p className="mt-0.5 text-[10px] font-bold text-ink">1X2</p>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-center">
          <TeamBadge team={match.away} size="lg" />
          <p className="text-[11px] font-medium leading-tight text-ink">{match.away.shortName}</p>
        </div>
      </Link>
      {market ? (
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {market.outcomes.slice(0, 3).map((outcome) => (
            <div key={outcome.id} className="text-center">
              <p className="mb-0.5 text-[10px] text-muted">{outcome.label}</p>
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
  onDark = false,
  hideLeague = false,
  showBadges = false,
}: {
  match: ClientMatch;
  marketType?: string;
  onDark?: boolean;
  hideLeague?: boolean;
  showBadges?: boolean;
}) {
  const market = marketByType(match, marketType);
  const oneXTwo = marketByType(match, "1X2");
  const live = match.status === "LIVE" || match.status === "HT";
  const clock = live ? match.clock : formatKickoff12(match.startTime);
  const period =
    live && match.periodLabel && match.periodLabel !== clock && !String(clock ?? "").includes(match.periodLabel)
      ? match.periodLabel
      : null;
  const kick = period ? `${clock} ${period}` : clock;
  const light = !onDark;
  const cols = Math.min(market?.outcomes.length ?? 3, 3);
  const oddsWidth = oddsColClass(cols);
  const showBestOdds = showBadges && (match.isBestOdds || Boolean(oneXTwo));

  return (
    <article
      className={cn(
        "overflow-hidden border-b px-2.5 py-1 min-[412px]:px-3 min-[412px]:py-1.5",
        onDark ? "on-dark border-white/10 bg-transparent" : "border-[#eef0f3] bg-white",
      )}
    >
      <div className="mb-1 flex min-w-0 items-center gap-1 text-[10px] leading-none">
        {showBadges && match.isHot ? (
          <span className="inline-flex shrink-0 items-center gap-px bg-[#e31c23] px-1 py-px text-[8px] font-black tracking-wide text-white">
            HOT
            <span aria-hidden>🔥</span>
          </span>
        ) : null}
        {showBestOdds ? (
          <span className="inline-flex shrink-0 items-center gap-px bg-[#12a150] px-1 py-px text-[8px] font-black tracking-wide text-white">
            BEST ODDS
            <span aria-hidden>🔥</span>
          </span>
        ) : null}
        <span className={cn("shrink-0 tabular-nums", live ? "font-semibold text-accent" : light ? "text-[#8b919a]" : "text-white/70")}>
          {kick}
        </span>
        <span className={cn("shrink-0", light ? "text-[#8b919a]" : "text-white/55")}>ID {match.displayId}</span>
        {hideLeague ? null : (
          <span className={cn("min-w-0 truncate", light ? "text-[#8b919a]" : "text-white/55")}>
            {match.league.country} - {match.league.name}
          </span>
        )}
        <Link href={`/match/${match.id}`} aria-label="Match statistics" className="ml-auto shrink-0">
          <BarChart2 className={cn("h-3 w-3", light ? "text-[#c5cad3]" : "text-white/35")} />
        </Link>
      </div>
      <div className="flex min-w-0 items-center gap-1.5">
        <Link href={`/match/${match.id}`} className="min-w-0 flex-1">
          <p className={cn("truncate text-[12px] leading-[15px]", light ? "text-ink" : "text-white")}>{match.home.name}</p>
          <p className={cn("truncate text-[12px] leading-[15px]", light ? "text-ink" : "text-white")}>{match.away.name}</p>
        </Link>
        {live ? (
          <div className={cn("w-3.5 shrink-0 text-right text-[12px] font-bold leading-[15px] tabular-nums", light ? "text-ink" : "text-white")}>
            <p>{match.homeScore}</p>
            <p>{match.awayScore}</p>
          </div>
        ) : null}
        {market ? (
          <div className={cn("flex shrink-0 gap-[3px]", oddsWidth)}>
            {market.outcomes.slice(0, 3).map((outcome) => (
              <OddsButton
                key={outcome.id}
                match={match}
                marketName={market.name}
                outcome={outcome}
                compact
                hideLabel
              />
            ))}
          </div>
        ) : (
          <span className={cn("shrink-0", oddsWidth)} />
        )}
      </div>
      {match.extraMarkets > 0 ? (
        <Link href={`/match/${match.id}`} className="mt-px inline-block text-[10px] font-semibold leading-none text-accent">
          +{match.extraMarkets} &gt;
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
  groupDates = false,
  showBadges = false,
}: {
  matches: ClientMatch[];
  marketType: string;
  dark?: boolean;
  dateLabel?: string;
  groupLeagues?: boolean;
  groupDates?: boolean;
  showBadges?: boolean;
}) {
  const playable =
    marketType === "1X2"
      ? matches
      : matches.filter((match) => match.markets.some((market) => market.type === marketType));
  const sample = playable[0];
  const market = sample ? marketByType(sample, marketType) : null;
  const headers = market ? market.outcomes.slice(0, 3).map((o) => o.label) : marketType === "OU" || marketType === "FHOU" ? ["Over", "Under"] : marketType === "DC" ? ["1X", "12", "X2"] : ["1", "X", "2"];
  const leagueGroups = groupLeagues ? groupByLeague(playable) : null;
  const dateGroups = !groupLeagues && groupDates ? groupByDate(playable) : null;

  if (playable.length === 0) {
    return (
      <div className={dark ? "bg-live text-white" : "overflow-hidden bg-white"}>
        {dateLabel ? <DateOddsHeader label={dateLabel} headers={headers} dark={dark} /> : null}
        <p className={cn("px-2.5 py-5 text-[12px]", dark ? "text-white/55" : "text-muted")}>No matches available</p>
      </div>
    );
  }

  return (
    <div className={dark ? "bg-live text-white" : "overflow-hidden bg-white"}>
      {dateLabel && leagueGroups ? (
        <p className={cn("px-2.5 py-1 text-[11px] font-medium", dark ? "text-white/45" : "text-[#6b7280]")}>{dateLabel}</p>
      ) : null}
      {dateLabel && !leagueGroups && !dateGroups ? <DateOddsHeader label={dateLabel} headers={headers} dark={dark} /> : null}
      {leagueGroups
        ? leagueGroups.map((group) => (
            <div key={group.slug + group.name}>
              <DateOddsHeader label={group.name} headers={headers} dark={dark} country={group.country} />
              {group.matches.map((match) => (
                <MatchRow key={match.id} match={match} marketType={marketType} compactOdds onDark={dark} hideLeague showBadges={showBadges} />
              ))}
            </div>
          ))
        : dateGroups
          ? dateGroups.map(([day, list]) => (
              <div key={day}>
                <DateOddsHeader label={day} headers={headers} dark={dark} />
                {list.map((match) => (
                  <MatchRow key={match.id} match={match} marketType={marketType} compactOdds onDark={dark} showBadges={showBadges} />
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

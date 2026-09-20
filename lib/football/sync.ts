import { prisma } from "@/lib/db";
import { cacheGet, cachePeek, cacheSet, TTL } from "./cache";
import {
  FootballApiError,
  fetchFixtureEvents,
  fetchFixturesByDateSafe,
  fetchLeaguesCurrent,
  fetchLiveFixtures,
  fetchOddsByFixture,
  hasFootballKey,
  peekOddsByFixture,
} from "./api";
import {
  extraMarketsFromReal,
  fallbackColor,
  fixtureBelongsTo,
  isFeaturedLeague,
  liveClock,
  mapFixtureStatus,
  mapOddsMarkets,
  periodLabel,
  resolveTargetLeagues,
  resolveLeaguesFromFixtures,
  sortOddsTargets,
  teamAbbreviation,
} from "./map";
import { ghanaDate } from "./time";
import { FOOTBALL_TZ } from "./types";
import type { ApiFixtureItem, ApiOddsItem, MappedMarket, MatchEvent, ResolvedLeague } from "./types";

const LEAGUE_SETTING = "football_leagues_v1";
const LAST_ERROR_SETTING = "football_last_error";

export type FootballFeedMeta = {
  ok: boolean;
  error: string | null;
  syncedAt: string | null;
};

let inflight: Promise<FootballFeedMeta> | null = null;

function matchId(fixtureId: number) {
  return `af-${fixtureId}`;
}
function teamId(id: number) {
  return `af-team-${id}`;
}
function marketId(fixtureId: number, type: string, line: string | null) {
  const lineKey = (line ?? "std").replace(/\./g, "p").replace(/[^a-zA-Z0-9:_-]/g, "-");
  return `af-${fixtureId}-${type}-${lineKey}`;
}
function outcomeId(fixtureId: number, type: string, line: string | null, code: string) {
  return `${marketId(fixtureId, type, line)}-${code}`;
}

async function readSetting<T>(key: string): Promise<T | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row?.value) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

async function writeSetting(key: string, value: unknown) {
  const encoded = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key },
    update: { value: encoded },
    create: { key, value: encoded },
  });
}

export async function getFootballFeedMeta(): Promise<FootballFeedMeta> {
  const cached = cachePeek<FootballFeedMeta>("football:meta");
  if (cached) return Promise.resolve(cached);
  return readSetting<FootballFeedMeta>("football_meta").then(
    (row) => row ?? { ok: false, error: null, syncedAt: null },
  );
}

async function setMeta(meta: FootballFeedMeta) {
  cacheSet("football:meta", meta, TTL.fixtures);
  await writeSetting("football_meta", meta);
  if (meta.error) await writeSetting(LAST_ERROR_SETTING, meta.error);
}

export async function resolveLeagues(): Promise<ResolvedLeague[]> {
  const memory = cacheGet<ResolvedLeague[]>("football:leagues");
  if (memory?.length) return memory;
  const fromDb = await readSetting<ResolvedLeague[]>(LEAGUE_SETTING);
  if (fromDb?.length) return cacheSet("football:leagues", fromDb, TTL.leagues);

  const rows = await fetchLeaguesCurrent();
  const normalized = rows.map((row) => ({
    id: row.league.id,
    name: row.league.name,
    country: row.country.name,
    type: row.league.type,
    seasons: row.seasons,
  }));
  const resolved = resolveTargetLeagues(normalized);
  if (!resolved.length) throw new FootballApiError("Could not resolve football league IDs from API-Football.");
  cacheSet("football:leagues", resolved, TTL.leagues);
  await writeSetting(LEAGUE_SETTING, resolved);
  return resolved;
}

async function upsertTeam(team: { id: number; name: string; logo?: string | null; code?: string | null }) {
  const id = teamId(team.id);
  const abbreviation = teamAbbreviation(team.name, team.code);
  return prisma.team.upsert({
    where: { id },
    update: {
      name: team.name,
      shortName: team.name,
      abbreviation,
      logoUrl: team.logo ?? undefined,
      externalId: String(team.id),
    },
    create: {
      id,
      name: team.name,
      shortName: team.name,
      abbreviation,
      color: fallbackColor(team.name),
      sportId: "football",
      logoUrl: team.logo ?? undefined,
      externalId: String(team.id),
    },
  });
}

async function upsertLeague(resolved: ResolvedLeague) {
  const existing =
    (await prisma.league.findUnique({ where: { slug: resolved.slug } })) ??
    (await prisma.league.findFirst({ where: { externalId: String(resolved.apiId) } }));
  if (existing) {
    return prisma.league.update({
      where: { id: existing.id },
      data: {
        name: resolved.name,
        country: resolved.country,
        externalId: String(resolved.apiId),
        sportId: "football",
      },
    });
  }
  return prisma.league.create({
    data: {
      sportId: "football",
      name: resolved.name,
      country: resolved.country,
      slug: resolved.slug,
      sortOrder: 50,
      externalId: String(resolved.apiId),
    },
  });
}

async function replaceMarkets(fixtureId: number, matchDbId: string, markets: MappedMarket[]) {
  const keep = markets.map((market) => marketId(fixtureId, market.type, market.line));
  await prisma.market.updateMany({
    where: { matchId: matchDbId, id: { notIn: keep } },
    data: { status: "CLOSED" },
  });
  for (const market of markets) {
    const id = marketId(fixtureId, market.type, market.line);
    await prisma.market.upsert({
      where: { id },
      update: { name: market.name, line: market.line, status: "OPEN", type: market.type },
      create: {
        id,
        matchId: matchDbId,
        type: market.type,
        name: market.name,
        line: market.line,
        status: "OPEN",
      },
    });
    const codes = market.outcomes.map((o) => o.code);
    await prisma.outcome.updateMany({
      where: { marketId: id, code: { notIn: codes } },
      data: { active: false },
    });
    for (const out of market.outcomes) {
      const oid = outcomeId(fixtureId, market.type, market.line, out.code);
      await prisma.outcome.upsert({
        where: { id: oid },
        update: { label: out.label, odds: out.odds, active: true, code: out.code },
        create: {
          id: oid,
          marketId: id,
          code: out.code,
          label: out.label,
          odds: out.odds,
          active: true,
        },
      });
    }
  }
}

async function upsertFixture(item: ApiFixtureItem, leagues: ResolvedLeague[], oddsByFixture: Map<number, ApiOddsItem>) {
  const resolved = leagues.find((league) => league.apiId === item.league.id);
  if (!resolved) return;
  const league = await upsertLeague(resolved);
  await upsertTeam(item.teams.home);
  await upsertTeam(item.teams.away);
  const status = mapFixtureStatus(item.fixture.status.short);
  const featured = isFeaturedLeague(resolved.slug) && status !== "FINISHED" && status !== "CANCELLED";
  const id = matchId(item.fixture.id);
  await prisma.match.upsert({
    where: { id },
    update: {
      leagueId: league.id,
      homeTeamId: teamId(item.teams.home.id),
      awayTeamId: teamId(item.teams.away.id),
      startTime: new Date(item.fixture.date),
      status,
      homeScore: item.goals.home ?? 0,
      awayScore: item.goals.away ?? 0,
      htHomeScore: item.score.halftime.home,
      htAwayScore: item.score.halftime.away,
      elapsed: item.fixture.status.elapsed,
      periodLabel: periodLabel(item.fixture.status.short, item.fixture.status.extra),
      isFeatured: featured,
      isDemo: false,
      externalId: String(item.fixture.id),
      sportId: "football",
    },
    create: {
      id,
      sportId: "football",
      leagueId: league.id,
      homeTeamId: teamId(item.teams.home.id),
      awayTeamId: teamId(item.teams.away.id),
      startTime: new Date(item.fixture.date),
      status,
      homeScore: item.goals.home ?? 0,
      awayScore: item.goals.away ?? 0,
      htHomeScore: item.score.halftime.home,
      htAwayScore: item.score.halftime.away,
      elapsed: item.fixture.status.elapsed,
      periodLabel: periodLabel(item.fixture.status.short, item.fixture.status.extra),
      isFeatured: featured,
      isDemo: false,
      externalId: String(item.fixture.id),
    },
  });
  const markets = mapOddsMarkets(oddsByFixture.get(item.fixture.id));
  if (markets.length) await replaceMarkets(item.fixture.id, id, markets);
  return extraMarketsFromReal(markets);
}

const MAX_ODDS_HTTP = 12;

async function loadOddsMap(items: ApiFixtureItem[], leagues: ResolvedLeague[]) {
  const map = new Map<number, ApiOddsItem>();
  const ranked = sortOddsTargets(items, leagues);
  if (!ranked.length) return map;

  const existing = await prisma.market.findMany({
    where: {
      matchId: { in: ranked.map((item) => matchId(item.fixture.id)) },
      type: "1X2",
      status: "OPEN",
    },
    select: { matchId: true },
  });
  const have1x2 = new Set(existing.map((row) => row.matchId));

  let http = 0;
  for (const item of ranked) {
    const fixtureId = item.fixture.id;
    const live = ["LIVE", "HT"].includes(mapFixtureStatus(item.fixture.status.short));
    const cached = peekOddsByFixture(fixtureId);
    if (cached !== undefined) {
      if (cached) map.set(fixtureId, cached);
      continue;
    }
    // Keep stored prices for scheduled matches; only spend quota on gaps and live.
    if (!live && have1x2.has(matchId(fixtureId))) continue;
    if (http >= MAX_ODDS_HTTP) break;
    http += 1;
    const row = await fetchOddsByFixture(fixtureId, live);
    if (row) map.set(fixtureId, row);
  }
  return map;
}

function mergeLeagues(base: ResolvedLeague[], extra: ResolvedLeague[]) {
  const bySlug = new Map<string, ResolvedLeague>();
  for (const row of [...base, ...extra]) bySlug.set(row.slug, row);
  return [...bySlug.values()];
}

async function persistLeagues(leagues: ResolvedLeague[]) {
  cacheSet("football:leagues", leagues, TTL.leagues);
  await writeSetting(LEAGUE_SETTING, leagues);
  return leagues;
}

async function leaguesForFixtures(items: ApiFixtureItem[]) {
  const cached = cacheGet<ResolvedLeague[]>("football:leagues");
  const fromDb = cached ?? (await readSetting<ResolvedLeague[]>(LEAGUE_SETTING)) ?? [];
  const fromFixtures = resolveLeaguesFromFixtures(items);
  let leagues = mergeLeagues(fromDb, fromFixtures);
  if (!leagues.length) {
    leagues = await resolveLeagues();
  } else {
    await persistLeagues(leagues);
  }
  return leagues;
}

async function syncPayload(mode: "home" | "live") {
  const dates = mode === "live" ? [ghanaDate(0)] : [ghanaDate(0), ghanaDate(1), ghanaDate(2)];
  const [live, ...byDate] = await Promise.all([
    fetchLiveFixtures(FOOTBALL_TZ),
    ...dates.map((date) => fetchFixturesByDateSafe(date, FOOTBALL_TZ)),
  ]);
  const all = [...live, ...byDate.flat()];
  const leagues = await leaguesForFixtures(all);
  const fixtures = new Map<number, ApiFixtureItem>();
  for (const item of all) {
    if (fixtureBelongsTo(item, leagues)) fixtures.set(item.fixture.id, item);
  }
  const odds = await loadOddsMap([...fixtures.values()], leagues);
  for (const item of fixtures.values()) {
    await upsertFixture(item, leagues, odds);
  }
  return fixtures.size;
}

export async function ensureFootballSynced(mode: "home" | "live" = "home"): Promise<FootballFeedMeta> {
  if (!hasFootballKey()) {
    const meta = {
      ok: false,
      error: "Unable to load live matches",
      syncedAt: null,
    };
    cacheSet("football:meta", meta, TTL.error);
    return meta;
  }
  const ttl = mode === "live" ? TTL.live : TTL.fixtures;
  const cached = cacheGet<FootballFeedMeta>(`football:sync:${mode}`);
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      await syncPayload(mode);
      const meta = { ok: true, error: null, syncedAt: new Date().toISOString() };
      cacheSet(`football:sync:${mode}`, meta, ttl);
      await setMeta(meta);
      return meta;
    } catch (error) {
      const message = error instanceof FootballApiError ? error.message : "Unable to load live matches";
      const stale = cachePeek<FootballFeedMeta>("football:meta");
      const meta: FootballFeedMeta = {
        ok: Boolean(stale?.ok),
        error: "Unable to load live matches",
        syncedAt: stale?.syncedAt ?? null,
      };
      cacheSet(`football:sync:${mode}`, meta, TTL.error);
      await setMeta({ ...meta, error: message });
      return meta;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

export async function loadMatchEvents(matchDbId: string): Promise<MatchEvent[]> {
  if (!hasFootballKey()) return [];
  const match = await prisma.match.findUnique({ where: { id: matchDbId }, include: { homeTeam: true } });
  if (!match?.externalId) return [];
  const fixtureId = Number(match.externalId);
  if (!Number.isFinite(fixtureId)) return [];
  try {
    const rows = await fetchFixtureEvents(fixtureId);
    return rows.map((row) => ({
      elapsed: row.time.elapsed,
      extra: row.time.extra,
      team: row.team.name,
      player: row.player.name ?? "",
      type: row.type,
      detail: row.detail,
    }));
  } catch {
    return [];
  }
}

export function liveClockForMatch(match: {
  status: string;
  elapsed?: number | null;
  periodLabel?: string | null;
}) {
  return liveClock(match.status, match.elapsed ?? null);
}

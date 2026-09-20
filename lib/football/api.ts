import { cacheGet, cacheSet, TTL } from "./cache";
import type { ApiEventItem, ApiFixtureItem, ApiOddsItem, ApiPaging } from "./types";

type Envelope<T> = {
  get?: string;
  errors?: Record<string, string> | string[];
  results?: number;
  paging?: ApiPaging;
  response?: T;
};

const MAX_PAGES = 3;

export class FootballApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "FootballApiError";
  }
}

export function hasFootballKey() {
  return Boolean(process.env.API_FOOTBALL_KEY?.trim());
}

function provider(): { base: string; headers: Record<string, string> } {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) throw new FootballApiError("API_FOOTBALL_KEY is not configured.", 503);
  const host = process.env.API_FOOTBALL_HOST?.trim();
  const rapid =
    process.env.API_FOOTBALL_PROVIDER === "rapidapi" ||
    (host ?? "").includes("rapidapi") ||
    host === "api-football-v1.p.rapidapi.com";
  if (rapid) {
    return {
      base: "https://api-football-v1.p.rapidapi.com/v3",
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    };
  }
  return {
    base: (process.env.API_FOOTBALL_BASE_URL ?? "https://v3.football.api-sports.io").replace(/\/$/, ""),
    headers: { "x-apisports-key": key },
  };
}

async function request<T>(path: string, params: Record<string, string | number | undefined>, page = 1): Promise<{ items: T; paging?: ApiPaging }> {
  const { base, headers } = provider();
  const requestHeaders: Record<string, string> = { ...headers, Accept: "application/json" };
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    search.set(key, String(value));
  }
  if (page > 1) search.set("page", String(page));
  const url = `${base}${path}?${search.toString()}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: requestHeaders,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof FootballApiError) throw error;
    throw new FootballApiError("Unable to load live matches", 503);
  }
  if (res.status === 429) throw new FootballApiError("API-Football rate limit reached.", 429);
  if (!res.ok) throw new FootballApiError(`API-Football request failed (${res.status}).`, res.status);
  const body = (await res.json()) as Envelope<T>;
  const errors = body.errors;
  if (Array.isArray(errors) && errors.length) throw new FootballApiError(errors.join(" "));
  if (errors && typeof errors === "object" && Object.keys(errors).length) {
    throw new FootballApiError(Object.values(errors).join(" "));
  }
  return { items: (body.response ?? []) as T, paging: body.paging };
}

async function collect<T>(path: string, params: Record<string, string | number | undefined>, cacheKey: string, ttl: number) {
  const hit = cacheGet<T[]>(cacheKey);
  if (hit) return hit;
  const first = await request<T[]>(path, params, 1);
  const items = [...(first.items ?? [])];
  const total = Math.min(first.paging?.total ?? 1, MAX_PAGES);
  for (let page = 2; page <= total; page += 1) {
    const next = await request<T[]>(path, params, page);
    items.push(...(next.items ?? []));
  }
  return cacheSet(cacheKey, items, ttl);
}

export async function fetchLeaguesCurrent() {
  return collect<{
    league: { id: number; name: string; type: string; logo?: string };
    country: { name: string };
    seasons: { year: number; current: boolean }[];
  }>("/leagues", { current: "true" }, "leagues:current", TTL.leagues);
}

export async function fetchFixturesByDate(date: string, timezone: string) {
  return collect<ApiFixtureItem>(
    "/fixtures",
    { date, timezone },
    `fixtures:${date}:${timezone}`,
    TTL.fixtures,
  );
}

export async function fetchLiveFixtures(timezone: string) {
  return collect<ApiFixtureItem>("/fixtures", { live: "all", timezone }, `live:${timezone}`, TTL.live);
}

export async function fetchOddsByDate(date: string, timezone: string) {
  try {
    return await collect<ApiOddsItem>(
      "/odds",
      { date, timezone },
      `odds:${date}:${timezone}`,
      TTL.odds,
    );
  } catch (error) {
    if (error instanceof FootballApiError && (error.status === 403 || error.status === 404)) return [];
    throw error;
  }
}

export async function fetchFixtureEvents(fixtureId: number) {
  return collect<ApiEventItem>(
    "/fixtures/events",
    { fixture: fixtureId },
    `events:${fixtureId}`,
    TTL.events,
  );
}

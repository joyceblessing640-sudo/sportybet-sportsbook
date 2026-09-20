import { describe, expect, it } from "vitest";
import {
  extraMarketsFromReal,
  liveClock,
  mapFixtureStatus,
  mapOddsMarkets,
  resolveLeaguesFromFixtures,
  resolveTargetLeagues,
  sortOddsTargets,
  teamAbbreviation,
} from "./map";
import type { ApiFixtureItem, ApiOddsItem, ResolvedLeague } from "./types";

describe("mapFixtureStatus", () => {
  it("maps API-Football short codes without inventing states", () => {
    expect(mapFixtureStatus("NS")).toBe("SCHEDULED");
    expect(mapFixtureStatus("1H")).toBe("LIVE");
    expect(mapFixtureStatus("HT")).toBe("HT");
    expect(mapFixtureStatus("2H")).toBe("LIVE");
    expect(mapFixtureStatus("FT")).toBe("FINISHED");
    expect(mapFixtureStatus("PST")).toBe("CANCELLED");
  });
});

describe("liveClock", () => {
  it("uses elapsed minutes from the API", () => {
    expect(liveClock("HT", 45)).toBe("HT");
    expect(liveClock("LIVE", 67)).toBe("67'");
    expect(liveClock("LIVE", 90, 4)).toBe("90+4'");
    expect(liveClock("SCHEDULED", 0)).toBeNull();
  });
});

describe("teamAbbreviation", () => {
  it("prefers API codes then initials", () => {
    expect(teamAbbreviation("Manchester United", "MUN")).toBe("MUN");
    expect(teamAbbreviation("Real Madrid")).toBe("RMX");
  });
});

describe("mapOddsMarkets", () => {
  it("maps 1X2, DC, BTTS, DNB and O/U from a real bookmaker payload", () => {
    const item: ApiOddsItem = {
      fixture: { id: 1 },
      bookmakers: [
        {
          id: 8,
          name: "Bet365",
          bets: [
            {
              id: 1,
              name: "Match Winner",
              values: [
                { value: "Home", odd: "2.10" },
                { value: "Draw", odd: "3.40" },
                { value: "Away", odd: "3.50" },
              ],
            },
            {
              id: 12,
              name: "Double Chance",
              values: [
                { value: "Home/Draw", odd: "1.30" },
                { value: "Home/Away", odd: "1.40" },
                { value: "Draw/Away", odd: "1.72" },
              ],
            },
            {
              id: 8,
              name: "Both Teams Score",
              values: [
                { value: "Yes", odd: "1.80" },
                { value: "No", odd: "2.00" },
              ],
            },
            {
              id: 13,
              name: "Draw No Bet",
              values: [
                { value: "Home", odd: "1.55" },
                { value: "Away", odd: "2.40" },
              ],
            },
            {
              id: 5,
              name: "Goals Over/Under",
              values: [
                { value: "Over 2.5", odd: "1.90" },
                { value: "Under 2.5", odd: "1.95" },
              ],
            },
          ],
        },
      ],
    };
    const markets = mapOddsMarkets(item);
    expect(markets.map((m) => m.type)).toEqual(["1X2", "DC", "BTTS", "DNB", "OU"]);
    expect(markets.find((m) => m.type === "1X2")?.outcomes.map((o) => o.code)).toEqual(["1", "X", "2"]);
    expect(markets.find((m) => m.type === "OU")?.line).toBe("2.5");
    expect(extraMarketsFromReal(markets)).toBeGreaterThan(0);
  });

  it("returns no markets when the bookmaker omits odds", () => {
    expect(mapOddsMarkets(undefined)).toEqual([]);
    expect(mapOddsMarkets({ fixture: { id: 1 }, bookmakers: [] })).toEqual([]);
  });

  it("drops invalid odds instead of inventing prices", () => {
    const item: ApiOddsItem = {
      fixture: { id: 2 },
      bookmakers: [
        {
          id: 8,
          name: "Bet365",
          bets: [
            {
              id: 1,
              name: "Match Winner",
              values: [
                { value: "Home", odd: "0.90" },
                { value: "Draw", odd: "3.00" },
                { value: "Away", odd: "3.10" },
              ],
            },
          ],
        },
      ],
    };
    expect(mapOddsMarkets(item)).toEqual([]);
  });

  it("prefers Over/Under 2.5 when the bookmaker lists several lines", () => {
    const item: ApiOddsItem = {
      fixture: { id: 3 },
      bookmakers: [
        {
          id: 8,
          name: "Bet365",
          bets: [
            {
              id: 1,
              name: "Match Winner",
              values: [
                { value: "Home", odd: "2.10" },
                { value: "Draw", odd: "3.40" },
                { value: "Away", odd: "3.50" },
              ],
            },
            {
              id: 5,
              name: "Goals Over/Under",
              values: [
                { value: "Over 1.5", odd: "1.14" },
                { value: "Under 1.5", odd: "5.50" },
                { value: "Over 2.5", odd: "1.50" },
                { value: "Under 2.5", odd: "2.62" },
              ],
            },
          ],
        },
      ],
    };
    expect(mapOddsMarkets(item).find((m) => m.type === "OU")?.line).toBe("2.5");
  });
});

describe("resolveTargetLeagues", () => {
  it("resolves major leagues from API names and countries, not hardcoded IDs", () => {
    const resolved = resolveTargetLeagues([
      {
        id: 39,
        name: "Premier League",
        country: "England",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 40,
        name: "Championship",
        country: "England",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 140,
        name: "La Liga",
        country: "Spain",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 2,
        name: "UEFA Champions League",
        country: "World",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 3,
        name: "UEFA Europa League",
        country: "World",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 253,
        name: "Major League Soccer",
        country: "USA",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 268,
        name: "Premier League",
        country: "Ghana",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 78,
        name: "Bundesliga",
        country: "Germany",
        seasons: [{ year: 2026, current: true }],
      },
      {
        id: 79,
        name: "2. Bundesliga",
        country: "Germany",
        seasons: [{ year: 2026, current: true }],
      },
    ]);
    expect(resolved.find((l) => l.slug === "premier-league")?.apiId).toBe(39);
    expect(resolved.find((l) => l.slug === "la-liga")?.apiId).toBe(140);
    expect(resolved.find((l) => l.slug === "ucl")?.apiId).toBe(2);
    expect(resolved.find((l) => l.slug === "uel")?.apiId).toBe(3);
    expect(resolved.find((l) => l.slug === "mls")?.apiId).toBe(253);
    expect(resolved.find((l) => l.slug === "ghana-premier-league")?.apiId).toBe(268);
    expect(resolved.find((l) => l.slug === "bundesliga")?.apiId).toBe(78);
  });
});

describe("resolveLeaguesFromFixtures", () => {
  it("picks target league IDs out of a mixed fixture payload", () => {
    const resolved = resolveLeaguesFromFixtures([
      {
        fixture: {
          id: 1,
          date: "2026-09-20T15:00:00+00:00",
          timestamp: 0,
          timezone: "Africa/Accra",
          status: { long: "Not Started", short: "NS", elapsed: null },
        },
        league: { id: 39, name: "Premier League", country: "England", season: 2026 },
        teams: {
          home: { id: 1, name: "Arsenal" },
          away: { id: 2, name: "Chelsea" },
        },
        goals: { home: null, away: null },
        score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
      },
      {
        fixture: {
          id: 2,
          date: "2026-09-20T15:00:00+00:00",
          timestamp: 0,
          timezone: "Africa/Accra",
          status: { long: "Not Started", short: "NS", elapsed: null },
        },
        league: { id: 268, name: "Premier League", country: "Ghana", season: 2026 },
        teams: {
          home: { id: 3, name: "Hearts of Oak" },
          away: { id: 4, name: "Asante Kotoko" },
        },
        goals: { home: null, away: null },
        score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
      },
    ]);
    expect(resolved.find((l) => l.slug === "premier-league")?.apiId).toBe(39);
    expect(resolved.find((l) => l.slug === "ghana-premier-league")?.apiId).toBe(268);
  });
});

function fx(
  id: number,
  leagueId: number,
  country: string,
  name: string,
  short: string,
  timestamp: number,
): ApiFixtureItem {
  return {
    fixture: {
      id,
      date: "2026-09-20T15:00:00+00:00",
      timestamp,
      timezone: "Africa/Accra",
      status: { long: short, short, elapsed: null },
    },
    league: { id: leagueId, name, country, season: 2026 },
    teams: {
      home: { id: id * 10, name: "Home" },
      away: { id: id * 10 + 1, name: "Away" },
    },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  };
}

describe("sortOddsTargets", () => {
  it("skips finished matches and ranks live Premier League first", () => {
    const leagues: ResolvedLeague[] = [
      { slug: "premier-league", name: "Premier League", country: "England", apiId: 39, season: 2026 },
      { slug: "la-liga", name: "La Liga", country: "Spain", apiId: 140, season: 2026 },
      { slug: "ghana-premier-league", name: "Premier League", country: "Ghana", apiId: 268, season: 2026 },
    ];
    const ranked = sortOddsTargets(
      [
        fx(1, 268, "Ghana", "Premier League", "NS", 3),
        fx(2, 140, "Spain", "La Liga", "NS", 2),
        fx(3, 39, "England", "Premier League", "FT", 1),
        fx(4, 39, "England", "Premier League", "1H", 4),
        fx(5, 39, "England", "Premier League", "NS", 5),
      ],
      leagues,
    );
    expect(ranked.map((row) => row.fixture.id)).toEqual([4, 5, 2, 1]);
  });
});

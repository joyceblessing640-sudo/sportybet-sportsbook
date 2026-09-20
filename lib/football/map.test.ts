import { describe, expect, it } from "vitest";
import {
  extraMarketsFromReal,
  liveClock,
  mapFixtureStatus,
  mapOddsMarkets,
  resolveTargetLeagues,
  teamAbbreviation,
} from "./map";
import type { ApiOddsItem } from "./types";

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

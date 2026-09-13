import { extraMarketsCount, isBestOddsMatch, isHotMatch, matchDisplayId } from "./match-meta";

const ONE_X_TWO: Record<string, number> = { "1": 0, X: 1, "2": 2, "1X": 0, "12": 1, X2: 2 };

function sortOutcomes<T extends { code: string }>(type: string, outcomes: T[]) {
  if (type !== "1X2" && type !== "FH" && type !== "DC") return outcomes;
  return [...outcomes].sort((a, b) => (ONE_X_TWO[a.code] ?? 9) - (ONE_X_TWO[b.code] ?? 9));
}

export type ClientTeam = {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  color: string;
};

export type ClientOutcome = {
  id: string;
  code: string;
  label: string;
  odds: number;
};

export type ClientMarket = {
  id: string;
  type: string;
  name: string;
  line: string | null;
  outcomes: ClientOutcome[];
};

export type ClientMatch = {
  id: string;
  status: string;
  clock: string | null;
  startTime: string;
  homeScore: number;
  awayScore: number;
  periodLabel: string | null;
  isDemo: boolean;
  isFeatured: boolean;
  league: { name: string; slug: string; country: string };
  sport: { id: string; name: string; slug: string };
  home: ClientTeam;
  away: ClientTeam;
  markets: ClientMarket[];
  displayId: string;
  extraMarkets: number;
  isHot: boolean;
  isBestOdds: boolean;
};

export function serializeMatch(match: {
  id: string;
  status: string;
  clock?: string | null;
  startTime: Date;
  homeScore: number;
  awayScore: number;
  periodLabel: string | null;
  isDemo: boolean;
  isFeatured: boolean;
  league: { name: string; slug: string; country: string };
  sport: { id: string; name: string; slug: string };
  homeTeam: ClientTeam;
  awayTeam: ClientTeam;
  markets: {
    id: string;
    type: string;
    name: string;
    line: string | null;
    outcomes: ClientOutcome[];
  }[];
}): ClientMatch {
  return {
    id: match.id,
    status: match.status,
    clock: match.clock ?? null,
    startTime: match.startTime.toISOString(),
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    periodLabel: match.periodLabel,
    isDemo: match.isDemo,
    isFeatured: match.isFeatured,
    league: match.league,
    sport: match.sport,
    home: match.homeTeam,
    away: match.awayTeam,
    displayId: matchDisplayId(match.id),
    extraMarkets: extraMarketsCount(
      match.id,
      match.markets.reduce((sum, market) => sum + market.outcomes.length, 0),
    ),
    isHot: isHotMatch(match.status, match.isFeatured),
    isBestOdds: isBestOddsMatch(match.sport.id, match.status),
    markets: match.markets.map((market) => ({
      id: market.id,
      type: market.type,
      name: market.name,
      line: market.line,
      outcomes: sortOutcomes(market.type, market.outcomes).map((o) => ({
        id: o.id,
        code: o.code,
        label: o.label,
        odds: o.odds,
      })),
    })),
  };
}

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
    markets: match.markets.map((market) => ({
      id: market.id,
      type: market.type,
      name: market.name,
      line: market.line,
      outcomes: market.outcomes.map((o) => ({
        id: o.id,
        code: o.code,
        label: o.label,
        odds: o.odds,
      })),
    })),
  };
}

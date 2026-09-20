export const FOOTBALL_TZ = "Africa/Accra";

export const TARGET_LEAGUES = [
  { slug: "premier-league", name: "Premier League", country: "England" },
  { slug: "la-liga", name: "La Liga", country: "Spain" },
  { slug: "serie-a", name: "Serie A", country: "Italy" },
  { slug: "bundesliga", name: "Bundesliga", country: "Germany" },
  { slug: "ligue-1", name: "Ligue 1", country: "France" },
  { slug: "ucl", name: "UEFA Champions League", country: "World" },
  { slug: "uel", name: "UEFA Europa League", country: "World" },
  { slug: "mls", name: "Major League Soccer", country: "USA" },
  { slug: "ghana-premier-league", name: "Premier League", country: "Ghana" },
] as const;

export type TargetLeagueSlug = (typeof TARGET_LEAGUES)[number]["slug"];

export type ResolvedLeague = {
  slug: string;
  name: string;
  country: string;
  apiId: number;
  season: number;
};

export type ApiPaging = { current: number; total: number };

export type ApiTeam = {
  id: number;
  name: string;
  logo?: string | null;
  code?: string | null;
};

export type ApiFixtureItem = {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    timezone: string;
    status: { long: string; short: string; elapsed: number | null; extra?: number | null };
  };
  league: { id: number; name: string; country: string; logo?: string | null; season: number };
  teams: { home: ApiTeam; away: ApiTeam };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
  };
};

export type ApiOddsValue = { value: string; odd: string };
export type ApiBet = { id: number; name: string; values: ApiOddsValue[] };
export type ApiBookmaker = { id: number; name: string; bets: ApiBet[] };
export type ApiOddsItem = {
  fixture: { id: number };
  bookmakers: ApiBookmaker[];
};

export type ApiEventItem = {
  time: { elapsed: number | null; extra: number | null };
  team: { id: number; name: string; logo?: string | null };
  player: { id: number | null; name: string | null };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
};

export type MappedMarket = {
  type: string;
  name: string;
  line: string | null;
  outcomes: { code: string; label: string; odds: number }[];
};

export type MatchEvent = {
  elapsed: number | null;
  extra: number | null;
  team: string;
  player: string;
  type: string;
  detail: string;
};

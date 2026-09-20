export type VirtualTeam = {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  color: string;
};

export type VirtualLeagueId = "popular" | "england" | "spain" | "germany" | "italy" | "ucl" | "other";

export type VirtualLeague = {
  id: VirtualLeagueId;
  name: string;
  country: string;
};

export type VirtualOutcome = {
  id: string;
  code: "1" | "X" | "2";
  label: string;
  odds: number;
};

export type VirtualMarketId = "1X2" | "1X2-1UP" | "1X2-2UP";

export type VirtualMarket = {
  id: VirtualMarketId;
  name: string;
  handicap: number;
  outcomes: VirtualOutcome[];
};

export type VirtualMatch = {
  id: string;
  league: VirtualLeague;
  startTime: string;
  kickClock: string;
  home: VirtualTeam;
  away: VirtualTeam;
  markets: VirtualMarket[];
};

export type SimEventType =
  | "KICK_OFF"
  | "CHANCE"
  | "SHOT"
  | "GOAL"
  | "NO_GOAL"
  | "HT"
  | "SECOND_HALF"
  | "FT";

export type SimEvent = {
  minute: number;
  type: SimEventType;
  team?: "home" | "away";
  label: string;
  homeScore: number;
  awayScore: number;
};

export type Simulation = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  events: SimEvent[];
};

export const VIRTUAL_LEAGUES: VirtualLeague[] = [
  { id: "popular", name: "Popular", country: "International" },
  { id: "england", name: "Premier League", country: "England" },
  { id: "spain", name: "La Liga", country: "Spain" },
  { id: "germany", name: "Bundesliga", country: "Germany" },
  { id: "italy", name: "Serie A", country: "Italy" },
  { id: "ucl", name: "Champions League", country: "Europe" },
  { id: "other", name: "International", country: "International" },
];

export const VIRTUAL_FILTERS: { id: VirtualLeagueId; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "england", label: "England" },
  { id: "spain", label: "Spain" },
  { id: "germany", label: "Germany" },
  { id: "italy", label: "Italy" },
  { id: "ucl", label: "Champions League" },
  { id: "other", label: "Other" },
];

export function leagueLine(league: VirtualLeague) {
  if (league.id === "ucl") return "Champions League";
  if (league.id === "other") return "International";
  if (league.id === "popular") return "Popular";
  return `${league.country} - ${league.name}`;
}

export const VIRTUAL_MARKET_TABS: { id: VirtualMarketId; label: string }[] = [
  { id: "1X2", label: "1X2" },
  { id: "1X2-1UP", label: "1X2 - 1UP" },
  { id: "1X2-2UP", label: "1X2 - 2UP" },
];

const ENGLAND: VirtualTeam[] = [
  t("arsenal", "Arsenal", "ARS", "#ef0107"),
  t("chelsea", "Chelsea", "CHE", "#034694"),
  t("liverpool", "Liverpool", "LIV", "#c8102e"),
  t("man-city", "Manchester City", "MCI", "#6cabdd"),
  t("man-utd", "Manchester United", "MUN", "#da291c"),
  t("tottenham", "Tottenham", "TOT", "#132257"),
  t("newcastle", "Newcastle", "NEW", "#241f20"),
  t("aston-villa", "Aston Villa", "AVL", "#670e36"),
  t("brighton", "Brighton", "BHA", "#005daa"),
  t("west-ham", "West Ham", "WHU", "#7a263a"),
  t("fulham", "Fulham", "FUL", "#000000"),
  t("wolves", "Wolves", "WOL", "#fdb913"),
  t("everton", "Everton", "EVE", "#003399"),
  t("crystal-palace", "Crystal Palace", "CRY", "#1b458f"),
  t("brentford", "Brentford", "BRE", "#e30613"),
  t("forest", "Nottingham Forest", "NFO", "#dd0000"),
];

const SPAIN: VirtualTeam[] = [
  t("real-madrid", "Real Madrid", "RMA", "#ffffff"),
  t("barcelona", "Barcelona", "BAR", "#a50044"),
  t("atletico", "Atletico Madrid", "ATM", "#cb3524"),
  t("sevilla", "Sevilla", "SEV", "#d4a017"),
  t("valencia", "Valencia", "VAL", "#ee3524"),
  t("villarreal", "Villarreal", "VIL", "#ffe667"),
  t("athletic", "Athletic Club", "ATH", "#ee2523"),
  t("sociedad", "Real Sociedad", "RSO", "#0067b1"),
  t("getafe", "Getafe", "GET", "#004fa3"),
  t("malaga", "Malaga", "MAL", "#0d47a1"),
  t("betis", "Real Betis", "BET", "#0bb862"),
  t("celta", "Celta Vigo", "CEL", "#8ac3ee"),
];

const GERMANY: VirtualTeam[] = [
  t("bayern", "Bayern Munich", "BAY", "#dc052d"),
  t("dortmund", "Borussia Dortmund", "BVB", "#fde100"),
  t("leipzig", "RB Leipzig", "RBL", "#dd0741"),
  t("leverkusen", "Bayer Leverkusen", "B04", "#e32221"),
  t("frankfurt", "Eintracht Frankfurt", "SGE", "#e1000f"),
  t("wolfsburg", "Wolfsburg", "WOB", "#65b32e"),
  t("gladbach", "Gladbach", "BMG", "#000000"),
  t("stuttgart", "Stuttgart", "VFB", "#e32219"),
  t("freiburg", "Freiburg", "SCF", "#000000"),
  t("union", "Union Berlin", "FCU", "#eb1923"),
];

const ITALY: VirtualTeam[] = [
  t("inter", "Inter", "INT", "#010e80"),
  t("milan", "AC Milan", "MIL", "#fb090b"),
  t("juventus", "Juventus", "JUV", "#000000"),
  t("napoli", "Napoli", "NAP", "#12a0d7"),
  t("roma", "Roma", "ROM", "#8e1f2f"),
  t("lazio", "Lazio", "LAZ", "#87d8f7"),
  t("atalanta", "Atalanta", "ATA", "#1e71b8"),
  t("fiorentina", "Fiorentina", "FIO", "#482e92"),
  t("torino", "Torino", "TOR", "#8b1a23"),
  t("bologna", "Bologna", "BOL", "#1a1919"),
];

const OTHER: VirtualTeam[] = [
  t("psg", "Paris SG", "PSG", "#004170"),
  t("marseille", "Marseille", "OM", "#2faee0"),
  t("lyon", "Lyon", "OL", "#12233f"),
  t("porto", "Porto", "FCP", "#003087"),
  t("benfica", "Benfica", "SLB", "#ed1c24"),
  t("sporting", "Sporting CP", "SCP", "#008057"),
  t("ajax", "Ajax", "AJA", "#d2122e"),
  t("psv", "PSV", "PSV", "#ed1c24"),
  t("galatasaray", "Galatasaray", "GAL", "#fdb913"),
  t("fenerbahce", "Fenerbahce", "FEN", "#002d72"),
];

function t(id: string, name: string, abbreviation: string, color: string): VirtualTeam {
  return { id, name, shortName: name, abbreviation, color };
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pairTeams(teams: VirtualTeam[], rng: () => number) {
  const pool = [...teams];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const pairs: [VirtualTeam, VirtualTeam][] = [];
  for (let i = 0; i + 1 < pool.length; i += 2) {
    pairs.push([pool[i], pool[i + 1]]);
  }
  return pairs;
}

function price(rng: () => number, base: number, spread: number) {
  const value = base + (rng() - 0.5) * spread;
  return Math.max(110, Math.round(value * 100));
}

function market(
  matchId: string,
  type: VirtualMarketId,
  name: string,
  handicap: number,
  rng: () => number,
): VirtualMarket {
  const homeShift = handicap * 28;
  const home = price(rng, 2.15 - handicap * 0.35, 0.7) - homeShift;
  const draw = price(rng, 3.35 + handicap * 0.12, 0.55);
  const away = price(rng, 3.4 + handicap * 0.45, 0.9) + homeShift;
  const outcomes: VirtualOutcome[] = [
    { id: `${matchId}:${type}:1`, code: "1", label: "1", odds: Math.max(115, home) },
    { id: `${matchId}:${type}:X`, code: "X", label: "X", odds: Math.max(200, draw) },
    { id: `${matchId}:${type}:2`, code: "2", label: "2", odds: Math.max(120, away) },
  ];
  return { id: type, name, handicap, outcomes };
}

function kickClock(index: number) {
  const start = 12 * 60;
  const mins = start + index * 3;
  const hh = String(Math.floor(mins / 60) % 24).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function makeMatch(
  id: string,
  league: VirtualLeague,
  home: VirtualTeam,
  away: VirtualTeam,
  index: number,
  day: string,
): VirtualMatch {
  const rng = mulberry32(hashSeed(`${id}:${day}`));
  return {
    id,
    league,
    startTime: `${day}T${kickClock(index)}:00.000Z`,
    kickClock: kickClock(index),
    home,
    away,
    markets: [
      market(id, "1X2", "1X2", 0, rng),
      market(id, "1X2-1UP", "1X2 - 1UP", 1, rng),
      market(id, "1X2-2UP", "1X2 - 2UP", 2, rng),
    ],
  };
}

export function fixtureDay(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function generateVirtualFixtures(now = new Date()): VirtualMatch[] {
  const day = fixtureDay(now);
  const rng = mulberry32(hashSeed(`instant-football:${day}`));
  const leagues: { league: VirtualLeague; teams: VirtualTeam[] }[] = [
    { league: VIRTUAL_LEAGUES[1], teams: ENGLAND },
    { league: VIRTUAL_LEAGUES[2], teams: SPAIN },
    { league: VIRTUAL_LEAGUES[3], teams: GERMANY },
    { league: VIRTUAL_LEAGUES[4], teams: ITALY },
    { league: VIRTUAL_LEAGUES[6], teams: OTHER },
  ];
  const matches: VirtualMatch[] = [];
  let index = 0;
  for (let round = 0; round < 2; round += 1) {
    for (const group of leagues) {
      for (const [home, away] of pairTeams(group.teams, rng)) {
        matches.push(makeMatch(`vif-${group.league.id}-${index}`, group.league, home, away, index, day));
        index += 1;
      }
    }
    const uclPool = [...ENGLAND.slice(0, 6), ...SPAIN.slice(0, 4), ...GERMANY.slice(0, 3), ...ITALY.slice(0, 3)];
    for (const [home, away] of pairTeams(uclPool, rng).slice(0, 8)) {
      matches.push(makeMatch(`vif-ucl-${index}`, VIRTUAL_LEAGUES[5], home, away, index, day));
      index += 1;
    }
  }
  const getafe = SPAIN.find((team) => team.id === "getafe");
  const malaga = SPAIN.find((team) => team.id === "malaga");
  if (getafe && malaga) {
    matches.unshift(makeMatch("vif-spain-getafe-malaga", VIRTUAL_LEAGUES[2], getafe, malaga, 0, day));
  }
  return matches;
}

export function popularMatchIds(matches: VirtualMatch[]) {
  return matches.filter((_, i) => i % 2 === 0).map((match) => match.id);
}

export function marketById(match: VirtualMatch, marketId: VirtualMarketId) {
  return match.markets.find((market) => market.id === marketId) ?? match.markets[0];
}

export function filterVirtualMatches(matches: VirtualMatch[], league: VirtualLeagueId) {
  if (league === "popular") {
    const popular = new Set(popularMatchIds(matches));
    return matches.filter((match) => popular.has(match.id));
  }
  return matches.filter((match) => match.league.id === league);
}

export function getVirtualMatch(id: string, now = new Date()) {
  return generateVirtualFixtures(now).find((match) => match.id === id) ?? null;
}

export function simulateMatch(matchId: string, now = new Date()): Simulation {
  const match = getVirtualMatch(matchId, now);
  const rng = mulberry32(hashSeed(`sim:${matchId}:${fixtureDay(now)}`));
  const events: SimEvent[] = [];
  let homeScore = 0;
  let awayScore = 0;
  const push = (minute: number, type: SimEventType, label: string, team?: "home" | "away") => {
    events.push({ minute, type, team, label, homeScore, awayScore });
  };

  push(0, "KICK_OFF", "Kick Off");
  const firstHalfChances = 4 + Math.floor(rng() * 3);
  let minute = 4;
  for (let i = 0; i < firstHalfChances; i += 1) {
    minute = Math.min(44, minute + 4 + Math.floor(rng() * 6));
    const team = rng() > 0.48 ? "home" : "away";
    const teamName = team === "home" ? match?.home.shortName ?? "Home" : match?.away.shortName ?? "Away";
    push(minute, "CHANCE", `Chance — ${teamName}`, team);
    if (rng() > 0.35) {
      push(minute, "SHOT", `Shot — ${teamName}`, team);
      if (rng() > 0.62) {
        if (team === "home") homeScore += 1;
        else awayScore += 1;
        push(minute, "GOAL", `GOAL — ${teamName}`, team);
      } else {
        push(minute, "NO_GOAL", `No Goal — ${teamName}`, team);
      }
    }
  }
  push(45, "HT", "Half Time");
  push(46, "SECOND_HALF", "Second Half");
  minute = 50;
  const secondHalfChances = 4 + Math.floor(rng() * 3);
  for (let i = 0; i < secondHalfChances; i += 1) {
    minute = Math.min(90, minute + 4 + Math.floor(rng() * 7));
    const team = rng() > 0.5 ? "home" : "away";
    const teamName = team === "home" ? match?.home.shortName ?? "Home" : match?.away.shortName ?? "Away";
    push(minute, "CHANCE", `Chance — ${teamName}`, team);
    if (rng() > 0.32) {
      push(minute, "SHOT", `Shot — ${teamName}`, team);
      if (rng() > 0.64) {
        if (team === "home") homeScore += 1;
        else awayScore += 1;
        push(minute, "GOAL", `GOAL — ${teamName}`, team);
      } else {
        push(minute, "NO_GOAL", `No Goal — ${teamName}`, team);
      }
    }
  }
  push(90, "FT", "Full Time");
  return { matchId, homeScore, awayScore, events };
}

export function resultCode(homeScore: number, awayScore: number, handicap = 0): "1" | "X" | "2" {
  const home = homeScore + handicap;
  if (home > awayScore) return "1";
  if (home < awayScore) return "2";
  return "X";
}

export function selectionWon(pick: "1" | "X" | "2", homeScore: number, awayScore: number, handicap = 0) {
  return resultCode(homeScore, awayScore, handicap) === pick;
}

export function teamMarkSvg(team: VirtualTeam) {
  const bg = team.color === "#ffffff" ? "#dbe3ef" : team.color;
  const fg = ["#ffffff", "#ffe667", "#fde100", "#fdb913", "#8ac3ee", "#87d8f7"].includes(team.color)
    ? "#111111"
    : "#ffffff";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${bg}"/><text x="32" y="39" text-anchor="middle" font-size="18" font-family="Arial,sans-serif" font-weight="700" fill="${fg}">${team.abbreviation.slice(0, 3)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

import type { VirtualMarket, VirtualMarketId, VirtualOutcome } from "./engine";

export type DemoBoardId = "england" | "spain" | "germany" | "italy" | "champions" | "euros" | "cwc";

export type DemoTeam = {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  color2?: string;
  stars: 1 | 2 | 3;
  mark: "club" | "flag";
  flag?: string;
  logo: string;
};

export type DemoMatch = {
  id: string;
  boardId: DemoBoardId;
  home: DemoTeam;
  away: DemoTeam;
  odds: [number, number, number];
};

export const DEMO_BOARDS: { id: DemoBoardId; label: string; league: string }[] = [
  { id: "england", label: "England", league: "England" },
  { id: "spain", label: "Spain", league: "Spain" },
  { id: "germany", label: "Germany", league: "Germany" },
  { id: "italy", label: "Italy", league: "Italy" },
  { id: "champions", label: "Champions", league: "Champions" },
  { id: "euros", label: "Euros", league: "Euros" },
  { id: "cwc", label: "Club World Cup", league: "Club World Cup" },
];

export const DEMO_MARKET_TABS: { id: VirtualMarketId; label: string }[] = [
  { id: "1X2", label: "1X2" },
  { id: "1X2-1UP", label: "1X2 - 1UP" },
  { id: "1X2-2UP", label: "1X2 - 2UP" },
];

function crest(boardId: DemoBoardId, abbr: string) {
  return `/virtuals/crests/${boardId}-${abbr.toLowerCase()}.png`;
}

function club(
  abbr: string,
  name: string,
  color: string,
  stars: 1 | 2 | 3,
  color2?: string,
): Omit<DemoTeam, "logo"> {
  return {
    id: abbr.toLowerCase(),
    name,
    abbreviation: abbr,
    color,
    color2,
    stars,
    mark: "club",
  };
}

function flag(abbr: string, name: string, flagId: string, stars: 1 | 2 | 3, color = "#1d4ed8"): Omit<DemoTeam, "logo"> {
  return {
    id: abbr.toLowerCase(),
    name,
    abbreviation: abbr,
    color,
    stars,
    mark: "flag",
    flag: flagId,
  };
}

function row(
  boardId: DemoBoardId,
  home: Omit<DemoTeam, "logo">,
  away: Omit<DemoTeam, "logo">,
  o1: number,
  ox: number,
  o2: number,
): DemoMatch {
  return {
    id: `if-${boardId}-${home.abbreviation}-${away.abbreviation}`.toLowerCase(),
    boardId,
    home: { ...home, logo: crest(boardId, home.abbreviation) },
    away: { ...away, logo: crest(boardId, away.abbreviation) },
    odds: [Math.round(o1 * 100), Math.round(ox * 100), Math.round(o2 * 100)],
  };
}

const ENGLAND: DemoMatch[] = [
  row("england", club("COV", "Coventry", "#59a8d8", 1), club("CRY", "Crystal Palace", "#1b458f", 2, "#c8102e"), 2.56, 3.71, 2.56),
  row("england", club("NEW", "Newcastle", "#241f20", 2), club("FUL", "Fulham", "#111111", 2, "#ffffff"), 1.94, 4.02, 3.5),
  row("england", club("BRE", "Brentford", "#e30613", 2), club("EVE", "Everton", "#003399", 2), 2.1, 3.65, 3.33),
  row("england", club("IPS", "Ipswich", "#0033a0", 1), club("HUL", "Hull", "#f5a81c", 2, "#111111"), 2.16, 3.65, 3.2),
  row("england", club("MCI", "Man City", "#6cabdd", 2), club("CHE", "Chelsea", "#034694", 2), 1.8, 4.2, 3.9),
  row("england", club("BOU", "Bournemouth", "#da291c", 2, "#111111"), club("BHA", "Brighton", "#005daa", 2, "#ffffff"), 2.14, 3.61, 3.27),
  row("england", club("MUN", "Man United", "#da291c", 3), club("LEE", "Leeds", "#ffcd00", 2, "#1d428a"), 1.74, 4.25, 4.15),
  row("england", club("AST", "Aston Villa", "#670e36", 2, "#95bfe5"), club("NFO", "Nott'm Forest", "#dd0000", 2), 2.2, 3.85, 2.97),
];

const SPAIN: DemoMatch[] = [
  row("spain", club("FCB", "Barcelona", "#a50044", 3, "#004d98"), club("LEV", "Levante", "#b11313", 1, "#1d4ed8"), 1.36, 5.41, 7.54),
  row("spain", club("ATM", "Atletico", "#cb3524", 2, "#1e3a8a"), club("VIL", "Villarreal", "#ffe667", 2, "#0057b8"), 1.79, 4.03, 4.1),
  row("spain", club("RAC", "Racing", "#0b6e4f", 1), club("CEL", "Celta", "#8ac3ee", 2, "#d6001c"), 2.6, 3.64, 2.56),
  row("spain", club("BIL", "Athletic", "#ee2523", 2, "#ffffff"), club("MCF", "Mallorca", "#e10600", 1, "#111111"), 2.19, 3.55, 3.21),
  row("spain", club("ESP", "Espanyol", "#1e4ea2", 2, "#ffffff"), club("ALA", "Alaves", "#0032a0", 1), 2.2, 3.59, 3.16),
  row("spain", club("RAY", "Rayo", "#ffffff", 2, "#e30613"), club("GET", "Getafe", "#004fa3", 1), 2.07, 3.24, 3.87),
  row("spain", club("RCD", "Deportivo", "#0a4ea2", 1), club("RBB", "Betis", "#0bb862", 2, "#ffffff"), 2.46, 3.69, 2.68),
  row("spain", club("RMA", "Real Madrid", "#ffffff", 3, "#febe10"), club("ELC", "Elche", "#0a8f3c", 1, "#ffffff"), 1.44, 4.96, 6.56),
];

const GERMANY: DemoMatch[] = [
  row("germany", club("PAD", "Paderborn", "#0033a0", 1, "#e30613"), club("VFB", "Stuttgart", "#ffffff", 2, "#e32219"), 2.55, 4.33, 2.35),
  row("germany", club("BMU", "Bayern", "#dc052d", 3), club("KOE", "Koln", "#e30613", 2, "#ffffff"), 1.29, 6.64, 8.1),
  row("germany", club("SGE", "Frankfurt", "#111111", 2, "#e1000f"), club("BVB", "Dortmund", "#fde100", 3, "#111111"), 2.95, 4.05, 2.15),
  row("germany", club("SVE", "Elversberg", "#ffffff", 1, "#0b6e4f"), club("SVW", "Werder", "#1b8a3e", 2), 2.08, 3.87, 3.23),
  row("germany", club("BMG", "Gladbach", "#111111", 2, "#ffffff"), club("TSG", "Hoffenheim", "#1c63b7", 2), 2.37, 4.13, 2.59),
  row("germany", club("SCH", "Schalke", "#004d9e", 2), club("LEV", "Leverkusen", "#e32221", 2, "#111111"), 2.44, 4.03, 2.55),
  row("germany", club("SCF", "Freiburg", "#111111", 2, "#e30613"), club("MAI", "Mainz", "#e30613", 2, "#ffffff"), 1.94, 4.19, 3.4),
  row("germany", club("HSV", "Hamburg", "#005ca9", 2, "#ffffff"), club("RBL", "Leipzig", "#dd0741", 2, "#ffffff"), 2.31, 3.94, 2.76),
];

const ITALY: DemoMatch[] = [
  row("italy", club("JUV", "Juventus", "#111111", 3, "#ffffff"), club("LEC", "Lecce", "#d4a017", 1, "#e30613"), 1.68, 3.89, 5.02),
  row("italy", club("ATA", "Atalanta", "#1e71b8", 2, "#111111"), club("COM", "Como", "#0b3d91", 1, "#ffffff"), 2.87, 3.36, 2.48),
  row("italy", club("VEN", "Venezia", "#111111", 2, "#f5c518"), club("TOR", "Torino", "#8b1a23", 2), 1.95, 3.75, 3.7),
  row("italy", club("PAR", "Parma", "#ffe14d", 1, "#1e3a8a"), club("GEN", "Genoa", "#c8102e", 2, "#003087"), 2.74, 3.39, 2.56),
  row("italy", club("UDI", "Udinese", "#111111", 1, "#ffffff"), club("ACM", "AC Milan", "#fb090b", 3, "#111111"), 3.63, 3.37, 2.09),
  row("italy", club("LAZ", "Lazio", "#87d8f7", 2, "#ffffff"), club("FRO", "Frosinone", "#f5c518", 1, "#1d4ed8"), 2.19, 3.67, 3.12),
  row("italy", club("FIO", "Fiorentina", "#482e92", 2), club("INT", "Inter", "#010e80", 3, "#000000"), 3.6, 3.8, 1.96),
  row("italy", club("MON", "Monza", "#e30613", 2), club("CAG", "Cagliari", "#8b1a23", 1, "#1e3a8a"), 2.19, 3.55, 3.21),
];

const CHAMPIONS: DemoMatch[] = [
  row("champions", club("LIV", "Liverpool", "#c8102e", 2), club("PSG", "Paris SG", "#004170", 3, "#da291c"), 2.15, 4.42, 2.78),
  row("champions", club("MUN", "Man United", "#da291c", 3), club("NAP", "Napoli", "#12a0d7", 2), 1.28, 6.45, 8.69),
  row("champions", club("INT", "Inter", "#010e80", 3), club("POR", "Porto", "#003087", 2), 2.4, 4.07, 2.58),
  row("champions", club("CHE", "Chelsea", "#034694", 2), club("BVB", "Dortmund", "#fde100", 3, "#111111"), 1.51, 5.64, 4.76),
  row("champions", club("RMA", "Real Madrid", "#ffffff", 3, "#febe10"), club("TOT", "Tottenham", "#132257", 2), 1.56, 5.19, 4.64),
  row("champions", club("FCB", "Barcelona", "#a50044", 3, "#004d98"), club("BEN", "Benfica", "#ed1c24", 2), 1.64, 5.16, 4.04),
  row("champions", club("ARS", "Arsenal", "#ef0107", 3), club("ACM", "AC Milan", "#fb090b", 3, "#111111"), 1.63, 4.57, 4.6),
  row("champions", club("BMU", "Bayern", "#dc052d", 3), club("AST", "Aston Villa", "#670e36", 2, "#95bfe5"), 1.47, 5.62, 5.25),
];

const EUROS: DemoMatch[] = [
  row("euros", flag("ENG", "England", "gb-eng", 3, "#c8102e"), flag("FRA", "France", "fr", 3, "#002395"), 2.14, 3.19, 3.73),
  row("euros", flag("ESP", "Spain", "es", 3, "#c60b1e"), flag("GER", "Germany", "de", 3, "#111111"), 2.61, 3.34, 2.72),
  row("euros", flag("NED", "Netherlands", "nl", 3, "#ff4f00"), flag("GEO", "Georgia", "ge", 1, "#e31d1a"), 1.67, 3.7, 5.52),
  row("euros", flag("BEL", "Belgium", "be", 2, "#e30613"), flag("TUR", "Turkiye", "tr", 2, "#e30a17"), 2.16, 3.49, 3.33),
  row("euros", flag("HUN", "Hungary", "hu", 2, "#ce2939"), flag("UKR", "Ukraine", "ua", 2, "#005bbb"), 1.9, 3.84, 3.8),
  row("euros", flag("CZE", "Czechia", "cz", 2, "#d7141a"), flag("POL", "Poland", "pl", 2, "#dc143c"), 1.95, 3.28, 4.31),
  row("euros", flag("SVK", "Slovakia", "sk", 1, "#0b4ea2"), flag("ROU", "Romania", "ro", 2, "#002b7f"), 2.34, 3.15, 3.27),
  row("euros", flag("POR", "Portugal", "pt", 3, "#006600"), flag("DEN", "Denmark", "dk", 2, "#c60c30"), 1.95, 3.72, 3.73),
];

const CWC: DemoMatch[] = [
  row("cwc", club("RMA", "Real Madrid", "#ffffff", 3, "#febe10"), club("CHE", "Chelsea", "#034694", 2), 1.85, 4.05, 3.82),
  row("cwc", club("BOT", "Botafogo", "#111111", 2, "#ffffff"), club("POR", "Porto", "#003087", 2), 2.15, 3.29, 3.57),
  row("cwc", club("MIA", "Inter Miami", "#f7b5cd", 2, "#111111"), club("EST", "Estudiantes", "#e30613", 2), 2.14, 3.17, 3.75),
  row("cwc", club("PSG", "Paris SG", "#004170", 3, "#da291c"), club("MCI", "Man City", "#6cabdd", 3), 2.02, 3.79, 3.43),
  row("cwc", club("RBS", "Salzburg", "#e30613", 2, "#ffffff"), club("WAC", "Wydad", "#e30613", 1), 2.3, 3.17, 3.35),
  row("cwc", club("FLA", "Flamengo", "#e30613", 2, "#111111"), club("INT", "Inter", "#010e80", 3), 2.12, 3.18, 3.77),
  row("cwc", club("RIV", "River Plate", "#ffffff", 2, "#e30613"), club("HIL", "Al Hilal", "#1d4ed8", 2), 2.37, 3.58, 2.86),
  row("cwc", club("BAY", "Bayern", "#dc052d", 3), club("BOC", "Boca", "#0033a0", 2, "#f5c518"), 1.92, 3.82, 3.75),
];

export const DEMO_MATCHES: DemoMatch[] = [
  ...ENGLAND,
  ...SPAIN,
  ...GERMANY,
  ...ITALY,
  ...CHAMPIONS,
  ...EUROS,
  ...CWC,
];

export function boardMatches(boardId: DemoBoardId) {
  return DEMO_MATCHES.filter((match) => match.boardId === boardId);
}

export function getDemoMatch(id: string) {
  return DEMO_MATCHES.find((match) => match.id === id) ?? null;
}

export function getDemoBoard(id: DemoBoardId) {
  return DEMO_BOARDS.find((board) => board.id === id) ?? DEMO_BOARDS[0];
}

export function handicapForMarket(marketId: VirtualMarketId) {
  if (marketId === "1X2-1UP") return 1;
  if (marketId === "1X2-2UP") return 2;
  return 0;
}

export function marketOdds(base: [number, number, number], marketId: VirtualMarketId): [number, number, number] {
  if (marketId === "1X2") return base;
  const up = marketId === "1X2-1UP" ? 1 : 2;
  const [home, draw, away] = base;
  return [
    Math.max(110, Math.round(home * (1 + 0.48 * up))),
    Math.max(200, Math.round(draw * (1 + 0.07 * up))),
    Math.max(110, Math.round(away / (1 + 0.42 * up))),
  ];
}

export function demoOutcomes(match: DemoMatch, marketId: VirtualMarketId): VirtualOutcome[] {
  const [home, draw, away] = marketOdds(match.odds, marketId);
  return [
    { id: `${match.id}:${marketId}:1`, code: "1", label: "1", odds: home },
    { id: `${match.id}:${marketId}:X`, code: "X", label: "X", odds: draw },
    { id: `${match.id}:${marketId}:2`, code: "2", label: "2", odds: away },
  ];
}

export function demoMarkets(match: DemoMatch): VirtualMarket[] {
  return DEMO_MARKET_TABS.map((tab) => ({
    id: tab.id,
    name: tab.label,
    handicap: handicapForMarket(tab.id),
    outcomes: demoOutcomes(match, tab.id),
  }));
}

export function marketName(marketId: VirtualMarketId) {
  return DEMO_MARKET_TABS.find((tab) => tab.id === marketId)?.label ?? marketId;
}

export function demoLeagueLine(boardId: DemoBoardId) {
  return getDemoBoard(boardId).league;
}

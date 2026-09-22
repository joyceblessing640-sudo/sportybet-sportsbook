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
  row("england", club("MCI", "Man City", "#6cabdd", 3), club("ARS", "Arsenal", "#ef0107", 3), 2.668, 2.833, 3.0),
  row("england", club("NEW", "Newcastle", "#241f20", 2), club("LIV", "Liverpool", "#c8102e", 3), 3.53, 3.0, 2.26),
  row("england", club("BHA", "Brighton", "#005daa", 2, "#ffffff"), club("BRE", "Brentford", "#e30613", 2), 2.91, 2.79, 2.79),
  row("england", club("AST", "Aston Villa", "#670e36", 2, "#95bfe5"), club("LEE", "Leeds", "#ffcd00", 2, "#1d428a"), 3.0, 2.833, 2.69),
  row("england", club("EVE", "Everton", "#003399", 2), club("BOU", "Bournemouth", "#da291c", 2, "#111111"), 2.92, 2.8, 2.778),
  row("england", club("CHE", "Chelsea", "#034694", 2), club("SUN", "Sunderland", "#e30613", 2, "#ffffff"), 2.488, 2.9, 3.21),
];

const SPAIN: DemoMatch[] = [
  row("spain", club("OSA", "Osasuna", "#d81e05", 2), club("BIL", "Athletic", "#ee2523", 2, "#ffffff"), 2.55, 2.87, 3.13),
  row("spain", club("GET", "Getafe", "#004fa3", 1), club("RSO", "Real Sociedad", "#1b3f8b", 2), 2.71, 2.82, 2.97),
  row("spain", club("ELC", "Elche", "#0a8f3c", 1, "#ffffff"), club("LEV", "Levante", "#b11313", 1, "#1d4ed8"), 2.85, 2.78, 2.87),
  row("spain", club("SEV", "Sevilla", "#d4a017", 2, "#e30613"), club("ESP", "Espanyol", "#1e4ea2", 2, "#ffffff"), 2.57, 2.87, 3.11),
  row("spain", club("VIL", "Villarreal", "#ffe667", 2, "#0057b8"), club("RBB", "Betis", "#0bb862", 2, "#ffffff"), 2.81, 2.79, 2.9),
  row("spain", club("CEL", "Celta", "#8ac3ee", 2, "#d6001c"), club("ALA", "Alaves", "#0032a0", 1), 2.87, 2.78, 2.84),
  row("spain", club("ATM", "Atletico", "#cb3524", 2, "#1e3a8a"), club("FCB", "Barcelona", "#a50044", 3, "#004d98"), 2.99, 2.82, 2.69),
];

const GERMANY: DemoMatch[] = [
  row("germany", club("BMU", "Bayern", "#dc052d", 3), club("BVB", "Dortmund", "#fde100", 3, "#111111"), 2.4, 2.93, 3.31),
  row("germany", club("WOB", "Wolfsburg", "#65b32e", 2), club("LEV", "Leverkusen", "#e32221", 2, "#111111"), 3.52, 2.99, 2.26),
  row("germany", club("SGE", "Frankfurt", "#111111", 2, "#e1000f"), club("HDH", "Heidenheim", "#e30613", 1, "#1e3a8a"), 1.988, 3.16, 4.2),
  row("germany", club("VFB", "Stuttgart", "#ffffff", 2, "#e32219"), club("BMG", "Gladbach", "#111111", 2, "#ffffff"), 1.99, 3.15, 4.15),
  row("germany", club("MAI", "Mainz", "#e30613", 2, "#ffffff"), club("UNI", "Union Berlin", "#e30613", 2, "#ffffff"), 2.36, 2.95, 3.36),
  row("germany", club("SCF", "Freiburg", "#111111", 2, "#e30613"), club("TSG", "Hoffenheim", "#1c63b7", 2), 2.75, 2.81, 2.94),
  row("germany", club("RBL", "Leipzig", "#dd0741", 2, "#ffffff"), club("STP", "St Pauli", "#8b1a23", 1, "#ffffff"), 2.49, 2.9, 3.19),
];

const ITALY: DemoMatch[] = [
  row("italy", club("JUV", "Juventus", "#111111", 3, "#ffffff"), club("LAZ", "Lazio", "#87d8f7", 2, "#ffffff"), 2.09, 3.09, 3.89),
  row("italy", club("COM", "Como", "#0b3d91", 1, "#ffffff"), club("UDI", "Udinese", "#111111", 1, "#ffffff"), 2.54, 2.88, 3.14),
  row("italy", club("NAP", "Napoli", "#12a0d7", 2), club("GEN", "Genoa", "#c8102e", 2, "#003087"), 3.43, 2.97, 2.31),
  row("italy", club("FIO", "Fiorentina", "#482e92", 2), club("ATA", "Atalanta", "#1e71b8", 2, "#111111"), 3.95, 3.11, 2.06),
  row("italy", club("PAR", "Parma", "#ffe14d", 1, "#1e3a8a"), club("LEC", "Lecce", "#d4a017", 1, "#e30613"), 2.12, 3.07, 3.81),
  row("italy", club("ROM", "Roma", "#8b1a23", 2, "#f5c518"), club("BFC", "Bologna", "#1b458f", 2, "#e30613"), 2.38, 2.94, 3.34),
  row("italy", club("ACM", "AC Milan", "#fb090b", 3, "#111111"), club("CAG", "Cagliari", "#8b1a23", 1, "#1e3a8a"), 2.11, 3.08, 3.84),
];

const CHAMPIONS: DemoMatch[] = [
  row("champions", club("POR", "Porto", "#003087", 2), club("MUN", "Man United", "#da291c", 3), 3.09, 2.866, 2.59),
  row("champions", club("INT", "Inter", "#010e80", 3), club("BMU", "Bayern", "#dc052d", 3), 3.12, 2.87, 2.56),
  row("champions", club("BVB", "Dortmund", "#fde100", 3, "#111111"), club("ARS", "Arsenal", "#ef0107", 3), 2.69, 2.82, 2.99),
  row("champions", club("ATM", "Atletico", "#cb3524", 2, "#1e3a8a"), club("JUV", "Juventus", "#111111", 3, "#ffffff"), 2.34, 2.966, 3.4),
  row("champions", club("TOT", "Tottenham", "#132257", 2), club("ACM", "AC Milan", "#fb090b", 3, "#111111"), 3.11, 2.87, 2.57),
  row("champions", club("PSG", "Paris SG", "#004170", 3, "#da291c"), club("CHE", "Chelsea", "#034694", 2), 1.668, 3.42, 5.86),
  row("champions", club("VCF", "Valencia", "#ee7f2d", 2), club("LIV", "Liverpool", "#c8102e", 3), 3.88, 3.09, 2.09),
];

const EUROS: DemoMatch[] = [
  row("euros", flag("POR", "Portugal", "pt", 3, "#006600"), flag("UKR", "Ukraine", "ua", 2, "#005bbb"), 1.669, 3.41, 5.77),
  row("euros", flag("NED", "Netherlands", "nl", 3, "#ff4f00"), flag("ENG", "England", "gb-eng", 3, "#c8102e"), 3.07, 2.855, 2.61),
  row("euros", flag("SCO", "Scotland", "gb-sct", 2, "#0065bf"), flag("GER", "Germany", "de", 3, "#111111"), 3.41, 2.96, 2.33),
  row("euros", flag("SVK", "Slovakia", "sk", 1, "#0b4ea2"), flag("SUI", "Switzerland", "ch", 2, "#e30a17"), 3.17, 2.89, 2.51),
  row("euros", flag("ROU", "Romania", "ro", 2, "#002b7f"), flag("SVN", "Slovenia", "si", 2, "#0057b8"), 3.1, 2.87, 2.57),
  row("euros", flag("TUR", "Turkiye", "tr", 2, "#e30a17"), flag("CZE", "Czechia", "cz", 2, "#d7141a"), 3.24, 2.91, 2.455),
  row("euros", flag("ALB", "Albania", "al", 1, "#e31c23"), flag("GEO", "Georgia", "ge", 1, "#e31d1a"), 2.4, 2.93, 3.31),
];

const CWC: DemoMatch[] = [
  row("cwc", club("BVB", "Dortmund", "#fde100", 3, "#111111"), club("MIA", "Inter Miami", "#f7b5cd", 2, "#111111"), 2.41, 2.93, 3.29),
  row("cwc", club("BOC", "Boca", "#0033a0", 2, "#f5c518"), club("POR", "Porto", "#003087", 2), 2.56, 2.87, 3.11),
  row("cwc", club("EST", "Estudiantes", "#e30613", 2), club("INT", "Inter", "#010e80", 3), 3.49, 2.99, 2.28),
  row("cwc", club("FLA", "Flamengo", "#e30613", 2, "#111111"), club("ATM", "Atletico", "#cb3524", 2, "#1e3a8a"), 2.54, 2.88, 3.14),
  row("cwc", club("PAL", "Palmeiras", "#006437", 2), club("CHE", "Chelsea", "#034694", 2), 2.94, 2.8, 2.76),
  row("cwc", club("PAC", "Pachuca", "#1b458f", 1), club("AHL", "Al Ahly", "#e30613", 2), 2.55, 2.87, 3.13),
  row("cwc", club("AKL", "Auckland City", "#1d4ed8", 1), club("AIN", "Al Ain", "#6b2d8b", 1), 2.255, 3.0, 3.54),
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

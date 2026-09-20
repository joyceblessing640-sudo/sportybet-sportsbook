import { combineOddsHundredths, MIN_STAKE_PESEWAS, potentialWinPesewas } from "../money";
import { publicId } from "../utils";
import {
  getDemoMatch,
  handicapForMarket,
  marketName,
  type DemoBoardId,
} from "./demo-board";
import { selectionWon, simulateMatch, type VirtualMarketId } from "./engine";
import type { VirtualSlipItem } from "../../store/virtual-slip";

export type DemoTicketPick = {
  matchId: string;
  matchLabel: string;
  league: string;
  boardId: DemoBoardId | string;
  marketId: VirtualMarketId;
  marketName: string;
  selection: "1" | "X" | "2";
  odds: number;
  handicap: number;
  homeName: string;
  awayName: string;
};

export type DemoMatchResult = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  won: boolean;
};

export type DemoTicket = {
  kind: "instant-football-demo";
  id: string;
  publicId: string;
  createdAt: string;
  type: "SINGLE" | "MULTI";
  stakePesewas: number;
  totalOdds: number;
  potentialWinPesewas: number;
  picks: DemoTicketPick[];
  status: "OPEN" | "SETTLED";
  playing?: boolean;
  results?: DemoMatchResult[];
  won?: boolean;
  payoutPesewas?: number;
  demo: true;
};

export const DEMO_TICKETS_KEY = "sb_instant_football_demo_tickets";
export const DEMO_TICKETS_EVENT = "sb-instant-football-demo-tickets";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readDemoTickets(): DemoTicket[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(DEMO_TICKETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DemoTicket[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.kind === "instant-football-demo" && item.id);
  } catch {
    return [];
  }
}

function writeDemoTickets(tickets: DemoTicket[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(DEMO_TICKETS_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event(DEMO_TICKETS_EVENT));
}

export function getDemoTicket(id: string) {
  return readDemoTickets().find((ticket) => ticket.id === id || ticket.publicId === id) ?? null;
}

export function upsertDemoTicket(ticket: DemoTicket) {
  const tickets = readDemoTickets().filter((item) => item.id !== ticket.id);
  tickets.unshift(ticket);
  writeDemoTickets(tickets.slice(0, 40));
  return ticket;
}

export function placeDemoBet(input: {
  type: "SINGLE" | "MULTI";
  stakePesewas: number;
  items: VirtualSlipItem[];
}): DemoTicket {
  if (!Number.isInteger(input.stakePesewas) || input.stakePesewas < MIN_STAKE_PESEWAS) {
    throw new Error("Enter a demo stake of at least GHS 1.00.");
  }
  if (input.items.length === 0) throw new Error("Tap an odd to add a selection.");
  if (input.type === "SINGLE" && input.items.length !== 1) {
    throw new Error("Single bets need one selection.");
  }
  if (input.type === "MULTI" && input.items.length < 2) {
    throw new Error("Add at least two selections for a multi.");
  }

  const picks: DemoTicketPick[] = input.items.map((item) => {
    const match = getDemoMatch(item.matchId);
    return {
      matchId: item.matchId,
      matchLabel: item.matchLabel,
      league: item.league,
      boardId: match?.boardId ?? "england",
      marketId: item.marketId,
      marketName: item.marketName || marketName(item.marketId),
      selection: item.selection,
      odds: item.odds,
      handicap: handicapForMarket(item.marketId),
      homeName: match?.home.name ?? item.matchLabel.split(" vs ")[0] ?? "Home",
      awayName: match?.away.name ?? item.matchLabel.split(" vs ")[1] ?? "Away",
    };
  });

  const totalOdds = combineOddsHundredths(picks.map((pick) => pick.odds));
  const ticket: DemoTicket = {
    kind: "instant-football-demo",
    id: publicId("DEMO"),
    publicId: publicId("IF"),
    createdAt: new Date().toISOString(),
    type: input.type,
    stakePesewas: input.stakePesewas,
    totalOdds,
    potentialWinPesewas: potentialWinPesewas(input.stakePesewas, totalOdds),
    picks,
    status: "OPEN",
    demo: true,
  };
  return upsertDemoTicket(ticket);
}

export function simulateDemoPick(pick: DemoTicketPick, now = new Date()) {
  return simulateMatch(pick.matchId, now, { home: pick.homeName, away: pick.awayName });
}

export function settleDemoTicket(ticket: DemoTicket, now = new Date()): DemoTicket {
  const results = ticket.picks.map((pick) => {
    const sim = simulateDemoPick(pick, now);
    return {
      matchId: pick.matchId,
      homeScore: sim.homeScore,
      awayScore: sim.awayScore,
      won: selectionWon(pick.selection, sim.homeScore, sim.awayScore, pick.handicap),
    };
  });
  const won = results.length > 0 && results.every((item) => item.won);
  return {
    ...ticket,
    status: "SETTLED",
    playing: false,
    results,
    won,
    payoutPesewas: won ? ticket.potentialWinPesewas : 0,
  };
}

export function markDemoTicketPlaying(ticket: DemoTicket) {
  return upsertDemoTicket({ ...ticket, playing: true });
}

export function saveSettledDemoTicket(ticket: DemoTicket, now = new Date()) {
  return upsertDemoTicket(settleDemoTicket(ticket, now));
}

export function subscribeDemoTickets(onChange: () => void) {
  if (!canUseStorage()) return () => {};
  const handler = () => onChange();
  window.addEventListener(DEMO_TICKETS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(DEMO_TICKETS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

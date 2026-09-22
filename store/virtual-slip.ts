"use client";

import { create } from "zustand";
import { combineOddsHundredths, potentialWinPesewas } from "@/lib/money";
import type { VirtualMarketId, VirtualMatch, VirtualOutcome } from "@/lib/virtuals/engine";
import { leagueLine } from "@/lib/virtuals/engine";

export type VirtualSlipItem = {
  matchId: string;
  matchLabel: string;
  league: string;
  marketId: VirtualMarketId;
  marketName: string;
  outcomeId: string;
  selection: "1" | "X" | "2";
  odds: number;
};

const SLIP_KEY = "sb_instant_football_slip";

export function readPersistedSlip() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SLIP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { items?: VirtualSlipItem[]; tab?: "SINGLE" | "MULTI"; stake?: string };
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return {
      items: parsed.items,
      tab: parsed.tab === "MULTI" ? "MULTI" : "SINGLE",
      stake: typeof parsed.stake === "string" && parsed.stake ? parsed.stake : "1.0",
    } as const;
  } catch {
    return null;
  }
}

function persistSlip(state: { items: VirtualSlipItem[]; tab: "SINGLE" | "MULTI"; stake: string }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SLIP_KEY, JSON.stringify(state));
}

type VirtualSlipState = {
  items: VirtualSlipItem[];
  tab: "SINGLE" | "MULTI";
  stake: string;
  toggle: (match: VirtualMatch, marketId: VirtualMarketId, outcome: VirtualOutcome) => void;
  togglePick: (item: VirtualSlipItem) => void;
  remove: (outcomeId: string) => void;
  clear: () => void;
  hydrate: (items: VirtualSlipItem[]) => void;
  setTab: (tab: "SINGLE" | "MULTI") => void;
  setStake: (stake: string) => void;
};

export const useVirtualSlip = create<VirtualSlipState>()((set, get) => {
  const write = (next: Partial<VirtualSlipState>) => {
    set(next);
    const state = get();
    persistSlip({ items: state.items, tab: state.tab, stake: state.stake });
  };

  return {
  items: [],
  tab: "SINGLE",
  stake: "1.0",
  toggle: (match, marketId, outcome) => {
    const current = get().items;
    const existing = current.find((item) => item.outcomeId === outcome.id);
    if (existing) {
      const next = current.filter((item) => item.outcomeId !== outcome.id);
      write({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
      return;
    }
    const market = match.markets.find((item) => item.id === marketId);
    const nextItem: VirtualSlipItem = {
      matchId: match.id,
      matchLabel: `${match.home.shortName} vs ${match.away.shortName}`,
      league: leagueLine(match.league),
      marketId,
      marketName: market?.name ?? marketId,
      outcomeId: outcome.id,
      selection: outcome.code,
      odds: outcome.odds,
    };
    const next = [...current.filter((item) => item.matchId !== match.id), nextItem];
    write({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
  },
  togglePick: (item) => {
    const current = get().items;
    const existing = current.find((row) => row.outcomeId === item.outcomeId);
    if (existing) {
      const next = current.filter((row) => row.outcomeId !== item.outcomeId);
      write({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
      return;
    }
    const next = [...current.filter((row) => row.matchId !== item.matchId), item];
    write({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
  },
  remove: (outcomeId) => {
    const next = get().items.filter((item) => item.outcomeId !== outcomeId);
    write({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
  },
  clear: () => write({ items: [], tab: "SINGLE" }),
  hydrate: (next) => write({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" }),
  setTab: (tab) => write({ tab }),
  setStake: (stake) => write({ stake }),
  };
});

export function virtualSlipSummary(items: VirtualSlipItem[], stakePesewas: number) {
  const totalOdds = combineOddsHundredths(items.map((item) => item.odds));
  const potentialWin = potentialWinPesewas(stakePesewas, totalOdds);
  const maxBonus = Math.round(potentialWin * 0.04);
  return {
    totalOdds,
    potentialWin,
    maxBonus,
    potentialWithBonus: potentialWin + maxBonus,
  };
}

export function selectionLabel(code: "1" | "X" | "2") {
  if (code === "1") return "Home";
  if (code === "2") return "Away";
  return "Draw";
}

export function multipleLabel(count: number) {
  if (count === 2) return "Doubles";
  if (count === 3) return "Trebles";
  if (count > 3) return "Accumulator";
  return "Single";
}

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

export const useVirtualSlip = create<VirtualSlipState>()((set, get) => ({
  items: [],
  tab: "SINGLE",
  stake: "1.0",
  toggle: (match, marketId, outcome) => {
    const current = get().items;
    const existing = current.find((item) => item.outcomeId === outcome.id);
    if (existing) {
      const next = current.filter((item) => item.outcomeId !== outcome.id);
      set({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
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
    set({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
  },
  togglePick: (item) => {
    const current = get().items;
    const existing = current.find((row) => row.outcomeId === item.outcomeId);
    if (existing) {
      const next = current.filter((row) => row.outcomeId !== item.outcomeId);
      set({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
      return;
    }
    const next = [...current.filter((row) => row.matchId !== item.matchId), item];
    set({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
  },
  remove: (outcomeId) => {
    const next = get().items.filter((item) => item.outcomeId !== outcomeId);
    set({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" });
  },
  clear: () => set({ items: [], tab: "SINGLE" }),
  hydrate: (next) => set({ items: next, tab: next.length > 1 ? "MULTI" : "SINGLE" }),
  setTab: (tab) => set({ tab }),
  setStake: (stake) => set({ stake }),
}));

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

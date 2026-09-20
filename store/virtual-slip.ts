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
  setTab: (tab: "SINGLE" | "MULTI") => void;
  setStake: (stake: string) => void;
};

export const useVirtualSlip = create<VirtualSlipState>()((set, get) => ({
  items: [],
  tab: "SINGLE",
  stake: "10",
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
  setTab: (tab) => set({ tab }),
  setStake: (stake) => set({ stake }),
}));

export function virtualSlipSummary(items: VirtualSlipItem[], stakePesewas: number) {
  const totalOdds = combineOddsHundredths(items.map((item) => item.odds));
  return {
    totalOdds,
    potentialWin: potentialWinPesewas(stakePesewas, totalOdds),
  };
}

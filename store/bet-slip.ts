"use client";

import { create } from "zustand";
import type { SlipItem } from "@/lib/slip";
import { combineOddsHundredths, potentialWinPesewas, systemPotentialWin } from "@/lib/money";

export type { SlipItem };

type SlipState = {
  items: SlipItem[];
  tab: "SINGLE" | "MULTI" | "SYSTEM";
  stake: string;
  open: boolean;
  setItems: (items: SlipItem[]) => void;
  setTab: (tab: SlipState["tab"]) => void;
  setStake: (stake: string) => void;
  setOpen: (open: boolean) => void;
};

export const useBetSlip = create<SlipState>()((set) => ({
  items: [],
  tab: "SINGLE",
  stake: "10",
  open: false,
  setItems: (items) => set({ items, tab: items.length > 1 ? "MULTI" : "SINGLE" }),
  setTab: (tab) => set({ tab }),
  setStake: (stake) => set({ stake }),
  setOpen: (open) => set({ open }),
}));

export function slipSummary(items: SlipItem[], tab: SlipState["tab"], stakePesewas: number) {
  const odds = items.map((i) => i.odds);
  if (tab === "SYSTEM" && items.length >= 3) {
    const k = Math.max(2, items.length - 1);
    const sys = systemPotentialWin(stakePesewas, odds, k);
    return {
      totalOdds: sys.avgOdds,
      potentialWin: sys.potentialWinPesewas,
      systemK: k,
      combinationCount: sys.combinationCount,
    };
  }
  const totalOdds = combineOddsHundredths(odds);
  return {
    totalOdds,
    potentialWin: potentialWinPesewas(stakePesewas, totalOdds),
    systemK: null as number | null,
    combinationCount: 1,
  };
}

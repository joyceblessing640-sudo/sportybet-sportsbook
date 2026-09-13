"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ClientMatch, ClientOutcome } from "@/lib/serialize";
import { combineOddsHundredths, potentialWinPesewas, systemPotentialWin } from "@/lib/money";

export type SlipItem = {
  outcomeId: string;
  matchId: string;
  matchLabel: string;
  league: string;
  marketName: string;
  outcomeLabel: string;
  odds: number;
};

type SlipState = {
  items: SlipItem[];
  tab: "SINGLE" | "MULTI" | "SYSTEM";
  stake: string;
  open: boolean;
  addFromMatch: (match: ClientMatch, marketName: string, outcome: ClientOutcome) => void;
  remove: (outcomeId: string) => void;
  clear: () => void;
  setTab: (tab: SlipState["tab"]) => void;
  setStake: (stake: string) => void;
  setOpen: (open: boolean) => void;
};

type PersistedSlip = Pick<SlipState, "items" | "tab" | "stake">;

export const useBetSlip = create<SlipState>()(
  persist(
    (set, get) => ({
      items: [],
      tab: "SINGLE",
      stake: "10",
      open: false,
      addFromMatch: (match, marketName, outcome) => {
        const items = get().items;
        if (items.some((i) => i.outcomeId === outcome.id)) {
          set({ items: items.filter((i) => i.outcomeId !== outcome.id), open: true });
          return;
        }
        const next = [
          ...items.filter((i) => i.matchId !== match.id),
          {
            outcomeId: outcome.id,
            matchId: match.id,
            matchLabel: `${match.home.shortName} vs ${match.away.shortName}`,
            league: match.league.name,
            marketName,
            outcomeLabel: outcome.label,
            odds: outcome.odds,
          },
        ];
        set({
          items: next,
          tab: next.length > 1 ? (get().tab === "SINGLE" ? "MULTI" : get().tab) : "SINGLE",
          open: true,
        });
      },
      remove: (outcomeId) => {
        const items = get().items.filter((i) => i.outcomeId !== outcomeId);
        set({
          items,
          tab: items.length <= 1 ? "SINGLE" : get().tab,
        });
      },
      clear: () => set({ items: [], tab: "SINGLE" }),
      setTab: (tab) => set({ tab }),
      setStake: (stake) => set({ stake }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "sportbet-slip",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state): PersistedSlip => ({
        items: state.items,
        tab: state.tab,
        stake: state.stake,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedSlip | undefined;
        if (!persisted) return currentState;
        if (currentState.items.length > 0) return currentState;
        return {
          ...currentState,
          items: persisted.items ?? currentState.items,
          tab: persisted.tab ?? currentState.tab,
          stake: persisted.stake ?? currentState.stake,
        };
      },
    },
  ),
);

export function BetSlipHydrator() {
  useEffect(() => {
    void useBetSlip.persist.rehydrate();
  }, []);
  return null;
}

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

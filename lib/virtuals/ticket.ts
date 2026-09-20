import type { VirtualMarketId } from "./engine";

export type VirtualTicketSelection = {
  matchId: string;
  matchLabel: string;
  league: string;
  marketId: VirtualMarketId;
  marketName: string;
  selection: "1" | "X" | "2";
  odds: number;
};

export type VirtualTicket = {
  kind: "instant-football";
  publicId: string;
  type: "SINGLE" | "MULTI";
  stakePesewas: number;
  totalOdds: number;
  potentialWinPesewas: number;
  selections: VirtualTicketSelection[];
  settled: boolean;
  won?: boolean;
  payoutPesewas?: number;
};

export function parseVirtualTicket(note: string | null | undefined): VirtualTicket | null {
  if (!note) return null;
  try {
    const parsed = JSON.parse(note) as VirtualTicket;
    if (parsed?.kind !== "instant-football" || !parsed.publicId) return null;
    return parsed;
  } catch {
    return null;
  }
}

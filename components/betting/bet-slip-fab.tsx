"use client";

import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlipItem } from "@/lib/slip";

export function BetSlipFab({ items, onOpen }: { items: SlipItem[]; onOpen: () => void }) {
  return (
    <button
      type="button"
      data-testid="betslip-bar"
      popoverTarget="mobile-betslip"
      popoverTargetAction="show"
      onClick={() => onOpen()}
      aria-label="Open betslip"
      className={cn(
        "fab-pop fixed right-3 z-[45] grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-[0_4px_16px_rgba(18,161,80,0.45)] lg:hidden",
      )}
      style={{ bottom: "calc(4.35rem + env(safe-area-inset-bottom))" }}
    >
      <Ticket className="h-6 w-6" />
      <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-accent">
        {items.length}
      </span>
    </button>
  );
}

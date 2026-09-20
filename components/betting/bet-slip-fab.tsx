"use client";

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
        "fab-pop fixed right-2.5 z-[45] grid h-11 w-11 place-items-center rounded-full bg-accent text-white shadow-[0_4px_16px_rgba(18,161,80,0.45)] min-[412px]:h-12 min-[412px]:w-12 lg:hidden",
      )}
      style={{ bottom: "calc(3.65rem + env(safe-area-inset-bottom))" }}
    >
      <img
        src="/slip/ticket-fab-provided.png"
        alt=""
        width={172}
        height={184}
        className="pointer-events-none h-full w-full object-contain"
        draggable={false}
      />
      <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-white px-0.5 text-[10px] font-bold text-accent">
        {items.length}
      </span>
    </button>
  );
}

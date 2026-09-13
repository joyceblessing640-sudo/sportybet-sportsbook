"use client";

import { formatOdds } from "@/lib/money";
import type { ClientMatch, ClientOutcome } from "@/lib/serialize";
import { useBetSlip } from "@/store/bet-slip";
import { cn } from "@/lib/utils";

export function OddsButton({
  match,
  marketName,
  outcome,
  compact,
}: {
  match: ClientMatch;
  marketName: string;
  outcome: ClientOutcome;
  compact?: boolean;
}) {
  const selected = useBetSlip((s) => s.items.some((i) => i.outcomeId === outcome.id));
  const add = useBetSlip((s) => s.addFromMatch);

  return (
    <button
      type="button"
      data-active={selected}
      onClick={() => add(match, marketName, outcome)}
      className={cn(
        "odds-btn flex min-w-0 flex-1 flex-col items-center justify-center px-1",
        compact ? "h-9 text-[11px]" : "h-11 text-xs",
      )}
    >
      <span className={cn("font-semibold leading-none", selected ? "text-white/90" : "text-[#5b6b63]")}>
        {outcome.label}
      </span>
      <span className="font-bold leading-tight">{formatOdds(outcome.odds)}</span>
    </button>
  );
}

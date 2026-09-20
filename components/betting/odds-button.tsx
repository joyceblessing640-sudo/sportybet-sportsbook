"use client";

import { toggleSlipSelection } from "@/app/actions/slip";
import { formatOdds } from "@/lib/money";
import type { ClientMatch, ClientOutcome } from "@/lib/serialize";
import { useSlipItems } from "@/components/slip-context";
import { cn } from "@/lib/utils";

export function OddsButton({
  match,
  marketName,
  outcome,
  compact,
  hideLabel,
  spread,
}: {
  match: ClientMatch;
  marketName: string;
  outcome: ClientOutcome;
  compact?: boolean;
  hideLabel?: boolean;
  spread?: boolean;
}) {
  const selected = useSlipItems().some((item) => item.outcomeId === outcome.id);
  return (
    <form action={toggleSlipSelection} className="min-w-0 flex-1">
      <input type="hidden" name="outcomeId" value={outcome.id} />
      <button
        type="submit"
        data-active={selected}
        aria-label={`Add ${match.home.shortName} vs ${match.away.shortName} ${marketName} ${outcome.label}`}
        className={cn(
          "odds-btn flex h-full w-full min-w-0 items-center justify-center px-1",
          spread
            ? "h-[30px] flex-row justify-between px-2 text-[13px] min-[412px]:h-8 min-[412px]:px-2.5 min-[412px]:text-[14px]"
            : compact
              ? "h-[22px] text-[12px] min-[412px]:h-6"
              : "h-8 flex-col text-[11px] min-[412px]:h-9",
        )}
      >
        {hideLabel ? null : (
          <span
            className={cn(
              "font-medium leading-none tracking-[0.01em]",
              spread ? "text-[11px]" : "text-[9px]",
              selected ? "text-white/90" : "text-[#5b6b63]",
            )}
          >
            {outcome.label}
          </span>
        )}
        <span className="font-semibold tabular-nums leading-tight tracking-[0.01em]">{formatOdds(outcome.odds)}</span>
      </button>
    </form>
  );
}

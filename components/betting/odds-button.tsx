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
}: {
  match: ClientMatch;
  marketName: string;
  outcome: ClientOutcome;
  compact?: boolean;
  hideLabel?: boolean;
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
          "odds-btn flex h-full w-full min-w-0 flex-col items-center justify-center px-1",
          compact ? "h-9 text-[13px]" : "h-11 text-xs",
        )}
      >
        {hideLabel ? null : (
          <span className={cn("font-semibold leading-none", selected ? "text-white/90" : "text-[#5b6b63]")}>
            {outcome.label}
          </span>
        )}
        <span className="font-bold leading-tight">{formatOdds(outcome.odds)}</span>
      </button>
    </form>
  );
}

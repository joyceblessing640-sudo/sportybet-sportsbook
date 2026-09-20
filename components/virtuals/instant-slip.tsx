"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatGhs, formatOdds, parseGhsToPesewas } from "@/lib/money";
import { placeDemoBet } from "@/lib/virtuals/demo-tickets";
import { cn } from "@/lib/utils";
import { useVirtualSlip, virtualSlipSummary } from "@/store/virtual-slip";

export const INSTANT_SLIP_ID = "instant-football-betslip";

export function openInstantSlip() {
  document.getElementById(INSTANT_SLIP_ID)?.showPopover();
}

export function closeInstantSlip() {
  document.getElementById(INSTANT_SLIP_ID)?.hidePopover();
}

export function InstantSlipPanel() {
  const router = useRouter();
  const { items, tab, stake, setTab, setStake, remove, clear } = useVirtualSlip();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = virtualSlipSummary(items, stakePesewas);
  const invalid = (tab === "SINGLE" && items.length !== 1) || (tab === "MULTI" && items.length < 2);

  function placeDemo() {
    if (items.length === 0) return;
    setError(null);
    if (invalid) return;
    if (!stakePesewas) {
      setError("Enter a demo stake.");
      return;
    }
    setPending(true);
    try {
      const ticket = placeDemoBet({ type: tab, stakePesewas, items });
      clear();
      closeInstantSlip();
      toast.success("Demo bet placed — no real money", { duration: 1800 });
      router.push("/bets");
      return ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place this demo bet.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
        <div>
          <p className="text-[13px] font-semibold tracking-[0.01em] text-ink">Betslip</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#12a150]">Demo · simulated</p>
        </div>
        <div className="flex items-center gap-1">
          {items.length > 0 ? (
            <button type="button" onClick={clear} className="p-2 text-danger" aria-label="Clear all">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
          <button type="button" onClick={closeInstantSlip} className="p-2 text-muted" aria-label="Close bet slip">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="grid grid-cols-2 border-b border-line text-[12px] font-medium tracking-[0.01em]">
        {(["SINGLE", "MULTI"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn("py-1.5 capitalize", tab === item ? "border-b-2 border-brand text-brand" : "text-muted")}
          >
            {item.toLowerCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[13px] font-medium tracking-[0.01em] text-ink">Your slip is empty</p>
            <p className="mt-1 text-[12px] font-normal text-muted">Tap a 1, X or 2 odd to add a demo selection.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.outcomeId} className="border-b border-[#f1f3f7] px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-normal text-muted">{item.league}</p>
                  <p className="truncate text-[12px] font-medium tracking-[0.01em] text-ink">{item.matchLabel}</p>
                  <p className="text-[11px] font-normal text-muted">
                    {item.marketName} · {item.selection}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold tabular-nums tracking-[0.01em] text-odds">{formatOdds(item.odds)}</span>
                  <button type="button" aria-label="Remove selection" className="text-danger" onClick={() => remove(item.outcomeId)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="border-t border-line p-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[12px]">
          <span className="font-normal text-muted">Total odds</span>
          <span className="font-semibold tabular-nums">{items.length ? formatOdds(summary.totalOdds) : "0.00"}</span>
        </div>
        <label className="mb-1.5 block text-[11px] font-medium text-muted">Stake (GHS) · demo</label>
        <Input
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          inputMode="decimal"
          placeholder="10.00"
          className="h-8"
        />
        <div className="mt-1.5 flex items-center justify-between text-[12px]">
          <span className="font-normal text-muted">Potential return</span>
          <span className="font-semibold tabular-nums text-brand">{formatGhs(summary.potentialWin)}</span>
        </div>
        {invalid && items.length > 0 ? (
          <p className="mt-2 text-[11px] text-danger">
            {tab === "SINGLE" ? "Single bets need one selection." : "Add at least two selections for a multi."}
          </p>
        ) : null}
        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        <Button
          type="button"
          variant="green"
          className="mt-2.5 h-9 w-full"
          disabled={pending || items.length === 0 || invalid}
          onClick={placeDemo}
        >
          {pending ? "Placing…" : "Place Bet"}
        </Button>
        <p className="mt-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-muted">
          Demo ticket only · no real-money transaction
        </p>
      </div>
    </section>
  );
}

"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, formatOdds, parseGhsToPesewas } from "@/lib/money";
import type { SlipItem } from "@/lib/slip";
import { cn } from "@/lib/utils";
import { slipSummary, useBetSlip } from "@/store/bet-slip";
import { clearSlipAction, removeSlipSelection } from "@/app/actions/slip";
import { placeBetAction } from "@/app/actions/bet";

export function BetSlipPanel({
  items,
  onClose,
  embedded = false,
}: {
  items: SlipItem[];
  onClose?: () => void;
  embedded?: boolean;
}) {
  const { tab, stake, setTab, setStake } = useBetSlip();
  const { user } = useAuth();
  const [state, action, pending] = useActionState(placeBetAction, null);

  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = useMemo(() => slipSummary(items, tab, stakePesewas), [items, tab, stakePesewas]);
  const invalidCombo =
    (tab === "SINGLE" && items.length !== 1) ||
    (tab === "MULTI" && items.length < 2) ||
    (tab === "SYSTEM" && items.length < 3);

  return (
    <section className={cn("flex h-full flex-col bg-white", embedded && "border-l border-line")}>
      <header className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
        <div>
          <p className="text-[12px] font-bold text-ink">Betslip</p>
          <p className="text-[10px] text-muted">
            {items.length} selection{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {items.length > 0 ? (
            <form action={clearSlipAction}>
              <button type="submit" className="p-2 text-danger" aria-label="Clear all">
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          ) : null}
          {onClose ? (
            <button
              type="button"
              popoverTarget="mobile-betslip"
              popoverTargetAction="hide"
              onClick={onClose}
              className="p-2 text-muted"
              aria-label="Close bet slip"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </header>
      <div className="grid grid-cols-3 border-b border-line text-[11px] font-semibold">
        {(["SINGLE", "MULTI", "SYSTEM"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "py-1.5 capitalize transition-colors duration-150",
              tab === item ? "border-b-2 border-brand text-brand" : "text-muted",
            )}
          >
            {item.toLowerCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[13px] font-semibold text-ink">Your slip is empty</p>
            <p className="mt-1 text-[12px] text-muted">Tap an odd to add a selection. Demo prices only.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.outcomeId} className="sheet-up border-b border-[#f1f3f7] px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-muted">{item.league}</p>
                  <p className="truncate text-[12px] font-semibold text-ink">{item.matchLabel}</p>
                  <p className="text-[11px] text-muted">
                    {item.marketName} · {item.outcomeLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-odds">{formatOdds(item.odds)}</span>
                  <form action={removeSlipSelection}>
                    <input type="hidden" name="outcomeId" value={item.outcomeId} />
                    <button type="submit" aria-label="Remove selection" className="text-danger">
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      <form action={action} className="border-t border-line p-2.5">
        <input type="hidden" name="type" value={tab} />
        <div className="mb-1.5 flex items-center justify-between text-[12px]">
          <span className="text-muted">Total odds</span>
          <span className="font-bold">{items.length ? formatOdds(summary.totalOdds) : "0.00"}</span>
        </div>
        {tab === "SYSTEM" && items.length >= 3 ? (
          <p className="mb-2 text-[11px] text-muted">
            System {summary.systemK}/{items.length} · {summary.combinationCount} combinations
          </p>
        ) : null}
        <label className="mb-1.5 block text-[11px] font-medium text-muted">Stake (GHS)</label>
        <Input name="stake" value={stake} onChange={(e) => setStake(e.target.value)} inputMode="decimal" placeholder="10.00" className="h-8" />
        <div className="mt-1.5 flex items-center justify-between text-[12px]">
          <span className="text-muted">Potential win</span>
          <span className="font-bold text-brand">{formatGhs(summary.potentialWin)}</span>
        </div>
        {invalidCombo && items.length > 0 ? (
          <p className="mt-2 text-[11px] text-danger">
            {tab === "SINGLE" ? "Single bets need one selection." : null}
            {tab === "MULTI" ? "Add at least two selections for a multi." : null}
            {tab === "SYSTEM" ? "System bets need at least three selections." : null}
          </p>
        ) : null}
        {state?.error ? <p className="mt-2 text-xs text-danger">{state.error}</p> : null}
        {user ? (
          <Button type="submit" variant="green" className="mt-2.5 h-9 w-full" disabled={pending || items.length === 0 || invalidCombo}>
            {pending ? "Placing…" : "Place Bet"}
          </Button>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-brand text-brand hover:bg-brand-soft" asChild>
              <Link href="/login?next=/slip">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <Link href="/load-code" className="font-semibold text-brand">
            Booking code
          </Link>
          <div className="flex items-center gap-3">
            {items.length > 0 ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-brand"
                onClick={() => {
                  const text = items
                    .map((item) => `${item.matchLabel} · ${item.marketName} · ${item.outcomeLabel} @ ${formatOdds(item.odds)}`)
                    .join("\n");
                  void navigator.clipboard?.writeText(`SportyBets slip\n${text}\nStake ${stake} GHS`);
                }}
              >
                <Share2 className="h-3 w-3" /> Share
              </button>
            ) : null}
            {items.length > 0 ? (
              <form action={clearSlipAction}>
                <button type="submit" className="font-semibold text-danger">
                  Clear all
                </button>
              </form>
            ) : null}
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted">18+ Play responsibly. Odds calculated on the server.</p>
      </form>
    </section>
  );
}

export function BetSlipBar({ items, onOpen }: { items: SlipItem[]; onOpen: () => void }) {
  const stake = useBetSlip((s) => s.stake);
  const tab = useBetSlip((s) => s.tab);
  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = useMemo(() => slipSummary(items, tab, stakePesewas), [items, tab, stakePesewas]);
  if (items.length === 0) return null;

  return (
    <button
      type="button"
      data-testid="betslip-bar"
      popoverTarget="mobile-betslip"
      popoverTargetAction="show"
      onClick={() => onOpen()}
      className="fixed inset-x-3 z-[45] flex items-center justify-between rounded-md bg-brand px-3 py-2 text-white shadow-lg lg:hidden"
        style={{ bottom: "calc(3.65rem + env(safe-area-inset-bottom))" }}
    >
      <span className="text-[12px] font-semibold">
        {items.length} Bet{items.length === 1 ? "" : "s"} · Potential Win {formatGhs(summary.potentialWin)}
      </span>
      <span className="rounded bg-white/20 px-2 py-1 text-[11px] font-bold">VIEW BETSLIP</span>
    </button>
  );
}

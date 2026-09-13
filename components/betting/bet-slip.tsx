"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, formatOdds, parseGhsToPesewas } from "@/lib/money";
import { cn } from "@/lib/utils";
import { slipSummary, useBetSlip } from "@/store/bet-slip";

export function BetSlipPanel({ onClose, embedded = false }: { onClose?: () => void; embedded?: boolean }) {
  const { items, tab, stake, setTab, setStake, remove, clear } = useBetSlip();
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = useMemo(() => slipSummary(items, tab, stakePesewas), [items, tab, stakePesewas]);
  const invalidCombo =
    (tab === "SINGLE" && items.length !== 1) ||
    (tab === "MULTI" && items.length < 2) ||
    (tab === "SYSTEM" && items.length < 3);

  async function place() {
    if (!user) {
      router.push("/login?next=/");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tab,
          stake,
          outcomeIds: items.map((i) => i.outcomeId),
          systemK: summary.systemK ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Could not place bet.");
        return;
      }
      toast.success(`Bet ${data.bet.publicId} placed.`);
      clear();
      await refresh();
      router.push("/bets");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={cn("flex h-full flex-col bg-white", embedded && "border-l border-[#eceff3]")}>
      <header className="flex items-center justify-between border-b border-[#eceff3] px-3 py-2">
        <div>
          <p className="text-sm font-bold text-ink">Bet Slip</p>
          <p className="text-[11px] text-muted">{items.length} selection{items.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex items-center gap-1">
          {items.length > 0 ? (
            <button type="button" onClick={clear} className="p-2 text-[#8b93a3]" aria-label="Clear slip">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
          {onClose ? (
            <button type="button" onClick={onClose} className="p-2 text-[#8b93a3]" aria-label="Close bet slip">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </header>
      <div className="grid grid-cols-3 border-b border-[#eceff3] text-sm font-semibold">
        {(["SINGLE", "MULTI", "SYSTEM"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "py-2 capitalize",
              tab === item ? "border-b-2 border-brand text-brand" : "text-[#8b93a3]",
            )}
          >
            {item.toLowerCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-ink">Your slip is empty</p>
            <p className="mt-1 text-xs text-muted">Tap any odd to add a selection. Prices shown are demo odds.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.outcomeId} className="border-b border-[#f1f3f7] px-3 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] text-muted">{item.league}</p>
                  <p className="text-sm font-semibold text-ink">{item.matchLabel}</p>
                  <p className="text-xs text-muted">
                    {item.marketName} · {item.outcomeLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-odds">{formatOdds(item.odds)}</span>
                  <button type="button" onClick={() => remove(item.outcomeId)} aria-label="Remove selection">
                    <X className="h-4 w-4 text-[#b0b6c2]" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="border-t border-[#eceff3] p-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted">Total odds</span>
          <span className="font-bold">{items.length ? formatOdds(summary.totalOdds) : "0.00"}</span>
        </div>
        {tab === "SYSTEM" && items.length >= 3 ? (
          <p className="mb-2 text-[11px] text-muted">
            System {summary.systemK}/{items.length} · {summary.combinationCount} combinations
          </p>
        ) : null}
        <label className="mb-2 block text-xs font-medium text-muted">Stake (GHS)</label>
        <Input value={stake} onChange={(e) => setStake(e.target.value)} inputMode="decimal" placeholder="10.00" />
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted">Potential win</span>
          <span className="font-bold text-brand">{formatGhs(summary.potentialWin)}</span>
        </div>
        {invalidCombo && items.length > 0 ? (
          <p className="mt-2 text-[11px] text-brand">
            {tab === "SINGLE" ? "Single bets need one selection." : null}
            {tab === "MULTI" ? "Add at least two selections for a multi." : null}
            {tab === "SYSTEM" ? "System bets need at least three selections." : null}
          </p>
        ) : null}
        {user ? (
          <Button className="mt-3 w-full" disabled={pending || items.length === 0 || invalidCombo} onClick={place}>
            {pending ? "Placing…" : "Place Bet"}
          </Button>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-brand text-brand hover:bg-red-50" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}
        <p className="mt-2 text-center text-[10px] text-muted">18+ Play responsibly. Odds are calculated on the server from stored prices.</p>
      </div>
    </section>
  );
}

export function BetSlipFab() {
  const items = useBetSlip((s) => s.items);
  const setOpen = useBetSlip((s) => s.setOpen);
  const total = items.reduce((acc, item) => acc * (item.odds / 100), 1);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed right-3 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#12a150] text-white shadow-lg xl:hidden"
      style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
      aria-label="Open bet slip"
    >
      <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-brand">
        {items.length}
      </span>
      <span className="text-sm font-black">{items.length ? total.toFixed(2) : "0.00"}</span>
    </button>
  );
}

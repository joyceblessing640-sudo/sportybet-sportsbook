"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, formatOdds, parseGhsToPesewas } from "@/lib/money";
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
  const { user, setUser } = useAuth();
  const { items, tab, stake, setTab, setStake, remove, clear } = useVirtualSlip();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = virtualSlipSummary(items, stakePesewas);
  const invalid = (tab === "SINGLE" && items.length !== 1) || (tab === "MULTI" && items.length < 2);

  async function place(kind: "bet" | "watch") {
    if (items.length === 0) return;
    setError(null);
    if (kind === "watch") {
      closeInstantSlip();
      const ids = items.map((item) => item.matchId).join(",");
      router.push(`/virtuals/instant-football/sim?matches=${encodeURIComponent(ids)}`);
      return;
    }
    if (!user) {
      router.push("/login?next=/virtuals/instant-football");
      return;
    }
    if (invalid) return;
    setPending(true);
    try {
      const res = await fetch("/api/virtuals/place", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: tab,
          stake,
          picks: items.map((item) => ({
            matchId: item.matchId,
            marketId: item.marketId,
            selection: item.selection,
          })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Could not place this virtual bet.");
        return;
      }
      if (user.wallet && typeof data.balancePesewas === "number") {
        setUser({ ...user, wallet: { ...user.wallet, balancePesewas: data.balancePesewas } });
      }
      const ids = (data.matchIds as string[]).join(",");
      clear();
      closeInstantSlip();
      toast.success("Virtual bet placed");
      router.push(
        `/virtuals/instant-football/sim?matches=${encodeURIComponent(ids)}&ticket=${encodeURIComponent(data.ticketId)}`,
      );
    } catch {
      setError("Could not place this virtual bet.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
        <div>
          <p className="text-[12px] font-bold text-ink">Betslip</p>
          <p className="text-[10px] text-muted">
            {items.length} virtual selection{items.length === 1 ? "" : "s"}
          </p>
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
      <div className="grid grid-cols-2 border-b border-line text-[11px] font-semibold">
        {(["SINGLE", "MULTI"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "py-1.5 capitalize",
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
            <p className="mt-1 text-[12px] text-muted">Tap a virtual odd to add a selection.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.outcomeId} className="border-b border-[#f1f3f7] px-2.5 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-muted">{item.league}</p>
                  <p className="truncate text-[12px] font-semibold text-ink">{item.matchLabel}</p>
                  <p className="text-[11px] text-muted">
                    {item.marketName} · {item.selection}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-odds">{formatOdds(item.odds)}</span>
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
          <span className="text-muted">Total odds</span>
          <span className="font-bold">{items.length ? formatOdds(summary.totalOdds) : "0.00"}</span>
        </div>
        <label className="mb-1.5 block text-[11px] font-medium text-muted">Stake (GHS)</label>
        <Input value={stake} onChange={(e) => setStake(e.target.value)} inputMode="decimal" placeholder="10.00" className="h-8" />
        <div className="mt-1.5 flex items-center justify-between text-[12px]">
          <span className="text-muted">Potential win</span>
          <span className="font-bold text-brand">{formatGhs(summary.potentialWin)}</span>
        </div>
        {invalid && items.length > 0 ? (
          <p className="mt-2 text-[11px] text-danger">
            {tab === "SINGLE" ? "Single bets need one selection." : "Add at least two selections for a multi."}
          </p>
        ) : null}
        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        {user ? (
          <Button
            type="button"
            variant="green"
            className="mt-2.5 h-9 w-full"
            disabled={pending || items.length === 0 || invalid}
            onClick={() => void place("bet")}
          >
            {pending ? "Placing…" : "Place Bet"}
          </Button>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-brand text-brand hover:bg-brand-soft" asChild>
              <Link href="/login?next=/virtuals/instant-football">Login</Link>
            </Button>
            <Button type="button" variant="green" disabled={items.length === 0} onClick={() => void place("watch")}>
              Simulate
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { formatOdds, parseGhsToPesewas, toGhs } from "@/lib/money";
import { placeDemoBet } from "@/lib/virtuals/demo-tickets";
import {
  multipleLabel,
  selectionLabel,
  useVirtualSlip,
  virtualSlipSummary,
  type VirtualSlipItem,
} from "@/store/virtual-slip";
import "./instant-slip.css";

export function InstantFootballSlip({ onNextRound }: { onNextRound: () => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const { items, tab, stake, setTab, setStake, remove, clear } = useVirtualSlip();
  const [phase, setPhase] = useState<"dock" | "mini" | "sheet">("dock");
  const [mode, setMode] = useState<"edit" | "confirm" | "submitting">("edit");
  const [viewTab, setViewTab] = useState<"SINGLE" | "MULTI" | "SYSTEM">("SINGLE");
  const [error, setError] = useState<string | null>(null);
  const [flexi, setFlexi] = useState(false);
  const [oneCut, setOneCut] = useState(false);
  const placing = useRef(false);

  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = virtualSlipSummary(items, stakePesewas);
  const invalid =
    (tab === "SINGLE" && items.length !== 1) || (tab === "MULTI" && items.length < 2) || viewTab === "SYSTEM";
  const busy = mode === "submitting";

  useEffect(() => {
    if (items.length > 0 && phase === "dock") {
      setPhase("mini");
      setMode("edit");
    }
    if (items.length === 0 && phase === "mini") {
      setPhase("dock");
      setMode("edit");
    }
    if (items.length === 0 && phase === "sheet" && mode !== "submitting") {
      setMode("edit");
    }
  }, [items.length, phase, mode]);

  useEffect(() => {
    setViewTab(items.length > 1 ? "MULTI" : "SINGLE");
  }, [items.length]);

  function openSheet() {
    setPhase("sheet");
    setMode("edit");
    setError(null);
  }

  function closeSheet() {
    if (busy) return;
    setMode("edit");
    setPhase(items.length > 0 ? "mini" : "dock");
  }

  function closeMini() {
    if (busy) return;
    setPhase("dock");
    setMode("edit");
  }

  function askConfirm() {
    if (items.length === 0 || invalid || !stakePesewas) {
      setError(!stakePesewas ? "Enter a demo stake." : viewTab === "SYSTEM" ? "System bets need more selections." : "Add the required selections.");
      setPhase("sheet");
      return;
    }
    setError(null);
    setPhase("sheet");
    setMode("confirm");
  }

  function cancelConfirm() {
    if (busy) return;
    setMode("edit");
  }

  async function confirmPlace() {
    if (busy || placing.current || items.length === 0 || invalid || !stakePesewas) return;
    placing.current = true;
    setMode("submitting");
    setError(null);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
      const ticket = placeDemoBet({ type: tab, stakePesewas, items });
      clear();
      setPhase("dock");
      setMode("edit");
      router.push(`/virtuals/instant-football/ticket/${ticket.id}`);
    } catch (err) {
      setMode("edit");
      setError(err instanceof Error ? err.message : "Could not place this demo bet.");
    } finally {
      placing.current = false;
    }
  }

  function changeTab(next: "SINGLE" | "MULTI" | "SYSTEM") {
    setViewTab(next);
    if (next !== "SYSTEM") setTab(next);
    setError(null);
  }

  const wallet = user?.wallet?.balancePesewas ?? 0;
  const payLabel = toGhs(stakePesewas || 0);

  return (
    <div className="ifs-root" data-testid="if-slip" data-if-build="if-flow-v13" data-if-phase={phase} data-if-mode={mode}>
      {phase === "sheet" ? (
        <button type="button" className="ifs-backdrop" aria-label="Close betslip" onClick={closeSheet} />
      ) : null}

      {phase === "dock" ? (
        <div className="ifs-dock" data-testid="if-slip-dock">
          <button type="button" className="next" onClick={onNextRound}>
            Next Round
          </button>
          <button type="button" className="slip" onClick={openSheet}>
            Betslip
          </button>
        </div>
      ) : null}

      {phase === "mini" && items.length === 1 ? (
        <SingleMini
          item={items[0]}
          stake={stake}
          odds={formatOdds(summary.totalOdds)}
          payLabel={payLabel}
          onStake={setStake}
          onRemove={() => remove(items[0].outcomeId)}
          onClose={closeMini}
          onExpand={openSheet}
          onPlace={askConfirm}
        />
      ) : null}

      {phase === "mini" && items.length > 1 ? (
        <MultipleMini
          count={items.length}
          odds={formatOdds(summary.totalOdds)}
          onClose={closeMini}
          onExpand={openSheet}
        />
      ) : null}

      {phase === "sheet" ? (
        <section className="ifs-sheet" data-testid="if-slip-sheet" data-if-state={mode} aria-label="Betslip">
          <header className="ifs-sheet-head">
            <div className="ifs-sheet-top">
              <span className="ifs-count">{items.length}</span>
              <button type="button" className="ifs-sheet-name" onClick={closeSheet}>
                Betslip
              </button>
              <button type="button" className="ifs-chevron" aria-label="Collapse betslip" onClick={closeSheet}>
                ▾
              </button>
              <span className="ifs-balance">{formatWallet(wallet)}</span>
            </div>
            <div className="ifs-sheet-tools">
              <button type="button" onClick={clear} disabled={items.length === 0 || busy}>
                ✕ Remove All
              </button>
              <button type="button" onClick={() => toast.message("Demo bet settings · simulated only")}>
                Bet Settings ⚙
              </button>
            </div>
          </header>
          <div className="ifs-tabs">
            {(["SINGLE", "MULTI", "SYSTEM"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-current={viewTab === item ? "true" : undefined}
                disabled={busy}
                onClick={() => changeTab(item)}
              >
                {item === "SINGLE" ? "Single" : item === "MULTI" ? "Multiple" : "System"}
              </button>
            ))}
          </div>
          <div className="ifs-sheet-body">
            {items.length === 0 ? (
              <p className="ifs-empty">Tap a 1, X or 2 odd to add a demo selection.</p>
            ) : (
              items.map((item) => (
                <LivePick key={item.outcomeId} item={item} onRemove={() => remove(item.outcomeId)} disabled={busy} />
              ))
            )}
            {items.length > 0 ? (
              <p className="ifs-bonus">
                <i />
                Add more qualifying selections to boost your bonus
              </p>
            ) : null}
            {invalid && items.length > 0 ? (
              <p className="ifs-warn">
                {viewTab === "SYSTEM"
                  ? "System bets need more selections."
                  : tab === "SINGLE"
                    ? "Single bets need one selection."
                    : "Add at least two selections for a multiple."}
              </p>
            ) : null}
            {error ? <p className="ifs-warn">{error}</p> : null}
            <div className="ifs-totals">
              <div className="ifs-stake-row">
                <span>Total Stake</span>
                <label className="ifs-ghs">
                  GHS
                  <input
                    value={stake}
                    inputMode="decimal"
                    disabled={busy}
                    aria-label="Total stake"
                    onChange={(event) => setStake(event.target.value)}
                  />
                </label>
              </div>
              <div className="ifs-insure">
                <strong>SportyInsure</strong>
                <span className="ifs-insure-i">i</span>
                <label>
                  <input type="checkbox" checked={flexi} disabled={busy} onChange={() => setFlexi((value) => !value)} />
                  Flexi
                </label>
                <label>
                  <input type="checkbox" checked={oneCut} disabled={busy} onChange={() => setOneCut((value) => !value)} />
                  One Cut
                </label>
              </div>
              <div className="ifs-line">
                <span>Total Odds</span>
                <strong>{items.length ? formatOdds(summary.totalOdds) : "0.00"}</strong>
              </div>
              <div className="ifs-line">
                <span>Max Bonus</span>
                <strong>{toGhs(summary.maxBonus)}</strong>
              </div>
              <div className="ifs-pot">
                <span>Potential Win</span>
                <strong>{toGhs(summary.potentialWithBonus)}</strong>
              </div>
            </div>
          </div>
          {mode !== "confirm" ? (
            <div className="ifs-sheet-place-safe">
              <button
                type="button"
                className="ifs-sheet-place"
                data-testid={busy ? "if-submitting" : "if-place-bet"}
                disabled={busy || items.length === 0 || invalid}
                onClick={askConfirm}
              >
                {busy ? (
                  <b>
                    <span className="ifs-spin" />
                    Submitting
                  </b>
                ) : (
                  <>
                    <b>Place Bet</b>
                    <small>About to pay {payLabel}</small>
                  </>
                )}
              </button>
            </div>
          ) : null}
          {mode === "confirm" ? (
            <div className="ifs-confirm-sheet" data-testid="if-confirm">
              <p className="label">Confirm to Pay</p>
              <p className="amount">GHS {payLabel}</p>
              <div className="ifs-confirm-actions-safe">
                <div className="ifs-confirm-actions">
                  <button type="button" className="ifs-cancel" onClick={cancelConfirm}>
                    Cancel
                  </button>
                  <button type="button" className="ifs-ok" data-testid="if-confirm-pay" onClick={() => void confirmPlace()}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function SingleMini({
  item,
  stake,
  odds,
  payLabel,
  onStake,
  onRemove,
  onClose,
  onExpand,
  onPlace,
}: {
  item: VirtualSlipItem;
  stake: string;
  odds: string;
  payLabel: string;
  onStake: (value: string) => void;
  onRemove: () => void;
  onClose: () => void;
  onExpand: () => void;
  onPlace: () => void;
}) {
  return (
    <section className="ifs-mini ifs-mini-single" data-testid="if-slip-single" data-if-state="single">
      <button type="button" className="ifs-mini-close" aria-label="Close betslip" onClick={onClose}>
        ×
      </button>
      <button type="button" className="ifs-mini-pick" onClick={onExpand}>
        <span>
          <SoccerBall />
          {selectionLabel(item.selection)}
          <em> | {item.marketName}</em>
        </span>
        <strong>{formatOdds(item.odds)}</strong>
      </button>
      <div className="ifs-mini-meta">
        <button type="button" className="ifs-mini-remove" aria-label="Remove selection" onClick={onRemove}>
          ×
        </button>
        <button type="button" className="ifs-mini-match" onClick={onExpand}>
          {item.matchLabel.replace(" VS ", " vs ")}
        </button>
        <input value={stake} inputMode="decimal" aria-label="Stake" onChange={(event) => onStake(event.target.value)} />
      </div>
      <div className="ifs-mini-actions-safe">
        <div className="ifs-mini-actions">
          <div className="ifs-mini-win">
            <span>To Win</span>
            <strong>{odds}</strong>
          </div>
          <button type="button" className="ifs-mini-place" data-testid="if-place-bet-mini" onClick={onPlace}>
            <b>Place Bet</b>
            <small>About to pay {payLabel}</small>
          </button>
        </div>
      </div>
    </section>
  );
}

function MultipleMini({
  count,
  odds,
  onClose,
  onExpand,
}: {
  count: number;
  odds: string;
  onClose: () => void;
  onExpand: () => void;
}) {
  return (
    <section className="ifs-mini ifs-mini-multi" data-testid="if-slip-multi" data-if-state="multi">
      <button type="button" className="ifs-mini-close" aria-label="Close betslip" onClick={onClose}>
        ×
      </button>
      <button type="button" className="ifs-mini-bar" onClick={onExpand}>
        <span className="ifs-count">{count}</span>
        <span className="ifs-mini-title">Betslip</span>
        <span className="ifs-mini-kind">
          {multipleLabel(count)} <strong>{odds}</strong>
        </span>
      </button>
      <p className="ifs-bonus">
        <i />
        Add more qualifying selections to boost your bonus
      </p>
    </section>
  );
}

function LivePick({
  item,
  onRemove,
  disabled,
}: {
  item: VirtualSlipItem;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <article className="ifs-live-pick">
      <span className="ifs-live-name">
        <SoccerBall />
        {selectionLabel(item.selection)}
      </span>
      <span className="ifs-live-odds">{formatOdds(item.odds)}</span>
      <div className="ifs-live-match">
        <button type="button" aria-label="Remove selection" disabled={disabled} onClick={onRemove}>
          ×
        </button>
        <span>{item.matchLabel.replace(" VS ", " vs ")}</span>
      </div>
      <span className="ifs-live-market">{item.marketName}</span>
    </article>
  );
}

function SoccerBall() {
  return (
    <svg className="ifs-ball" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1.8 9.6 5.2 13.4 5.6 10.6 8.2l.9 3.8L8 10.4 4.5 12l.9-3.8L2.6 5.6l3.8-.4Z" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function formatWallet(pesewas: number) {
  return `GHS ${(pesewas / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

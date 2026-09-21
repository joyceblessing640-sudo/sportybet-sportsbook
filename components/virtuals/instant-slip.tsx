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
  const prevCount = useRef(0);

  const stakePesewas = parseGhsToPesewas(stake) ?? 0;
  const summary = virtualSlipSummary(items, stakePesewas);
  const invalid =
    (tab === "SINGLE" && items.length !== 1) || (tab === "MULTI" && items.length < 2) || viewTab === "SYSTEM";
  const busy = mode === "submitting";

  useEffect(() => {
    if (prevCount.current === 0 && items.length > 0 && phase === "dock") {
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
    prevCount.current = items.length;
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
    if (busy || items.length === 0 || invalid || !stakePesewas) return;
    setMode("submitting");
    setError(null);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      const ticket = placeDemoBet({ type: tab, stakePesewas, items });
      clear();
      setPhase("dock");
      setMode("edit");
      toast.success(`Ticket #${ticket.ticketNo} has been created successfully.`);
      router.push(`/virtuals/instant-football/ticket/${ticket.id}`);
    } catch (err) {
      setMode("edit");
      setError(err instanceof Error ? err.message : "Could not place this demo bet.");
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
    <div className="ifs-root" data-testid="if-slip">
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
        <section className="ifs-sheet" data-testid="if-slip-sheet" aria-label="Betslip">
          <header className="ifs-sheet-head">
            <div className="ifs-sheet-top">
              <span className="ifs-count">{items.length}</span>
              <span className="ifs-sheet-name">Betslip</span>
              <button type="button" className="ifs-chevron" aria-label="Collapse betslip" onClick={closeSheet}>
                <ChevronDown />
              </button>
              <span className="ifs-balance">{formatWallet(wallet)}</span>
            </div>
            <div className="ifs-sheet-tools">
              <button type="button" onClick={clear} disabled={items.length === 0 || busy}>
                <TrashTiny /> Remove All
              </button>
              <button
                type="button"
                className="ifs-settings"
                onClick={() => toast.message("Demo bet settings · simulated only")}
              >
                Bet Settings <GearTiny />
                <span className="dot" />
              </button>
            </div>
          </header>

          <div className="ifs-tabs">
            {(["SINGLE", "MULTI", "SYSTEM"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-current={viewTab === item ? "true" : undefined}
                onClick={() => changeTab(item)}
                disabled={busy}
              >
                {item === "SINGLE" ? "Single" : item === "MULTI" ? "Multiple" : "System"}
              </button>
            ))}
          </div>

          <div className="ifs-body">
            {items.length === 0 ? (
              <p className="ifs-empty">Tap a 1, X or 2 odd to add a demo selection.</p>
            ) : (
              items.map((item) => (
                <SelectionRow key={item.outcomeId} item={item} onRemove={() => remove(item.outcomeId)} disabled={busy} />
              ))
            )}
            {items.length > 0 ? (
              <p className="ifs-bonus">
                <i />
                Add more qualifying selections to boost your bonus
              </p>
            ) : null}

            <div className="ifs-totals">
              <div className="ifs-stake-row">
                <span>Total Stake</span>
                <label className="ifs-stake-wrap">
                  GHS
                  <input
                    className="ifs-stake-box"
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
                <span aria-hidden>i</span>
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
          </div>

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

          {mode === "confirm" ? (
            <div className="ifs-confirm-layer" data-testid="if-confirm">
              <button type="button" className="ifs-confirm-dim" aria-label="Dismiss confirmation" onClick={cancelConfirm} />
              <div className="ifs-confirm">
                <p className="label">Confirm to Pay</p>
                <p className="amount">GHS{payLabel}</p>
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
    <section className="ifs-mini" data-testid="if-slip-single">
      <div className="ifs-handle">
        <button type="button" className="ifs-close" aria-label="Close betslip" onClick={onClose}>
          ×
        </button>
      </div>
      <button type="button" className="ifs-single-row" onClick={onExpand}>
        <BallIcon />
        <span className="ifs-pick-title">
          {selectionLabel(item.selection)}
          <em> | {item.marketName}</em>
        </span>
        <span className="ifs-pick-odds">{formatOdds(item.odds)}</span>
      </button>
      <div className="ifs-single-match">
        <button type="button" className="ifs-remove" aria-label="Remove selection" onClick={onRemove}>
          ×
        </button>
        <button type="button" className="ifs-match" onClick={onExpand}>
          {item.matchLabel.replace(" vs ", " VS ")}
        </button>
        <input
          className="ifs-stake-box"
          value={stake}
          inputMode="decimal"
          aria-label="Stake"
          onChange={(event) => onStake(event.target.value)}
        />
      </div>
      <div className="ifs-actions">
        <div className="ifs-win">
          <span>To Win</span>
          <strong>{odds}</strong>
        </div>
        <button type="button" className="ifs-place" data-testid="if-place-bet-mini" onClick={onPlace}>
          <b>Place Bet</b>
          <small>About to pay {payLabel}</small>
        </button>
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
    <section className="ifs-mini" data-testid="if-slip-multi">
      <div className="ifs-handle">
        <button type="button" className="ifs-close" aria-label="Close betslip" onClick={onClose}>
          ×
        </button>
      </div>
      <button type="button" className="ifs-multi-bar" onClick={onExpand}>
        <span className="ifs-count">{count}</span>
        <span className="ifs-multi-title">Betslip</span>
        <span className="ifs-multi-meta">
          {multipleLabel(count)}
          <strong>{odds}</strong>
        </span>
      </button>
      <p className="ifs-bonus">
        <i />
        Add more qualifying selections to boost your bonus
      </p>
    </section>
  );
}

function SelectionRow({
  item,
  onRemove,
  disabled,
}: {
  item: VirtualSlipItem;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <article className="ifs-sel">
      <span className="ifs-sel-icon">
        <BallIcon />
      </span>
      <span className="ifs-sel-name">{selectionLabel(item.selection)}</span>
      <span className="ifs-sel-odds">{formatOdds(item.odds)}</span>
      <div className="ifs-sel-match">
        <button type="button" className="ifs-remove" aria-label="Remove selection" disabled={disabled} onClick={onRemove}>
          ×
        </button>
        <span>{item.matchLabel.replace(" vs ", " VS ")}</span>
      </div>
      <span className="ifs-sel-market">{item.marketName}</span>
    </article>
  );
}

function formatWallet(pesewas: number) {
  return `GHS ${(pesewas / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function BallIcon() {
  return (
    <svg className="ifs-ball" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1.8 9.6 5.2 13.4 5.6 10.6 8.2l.9 3.8L8 10.4 4.5 12l.9-3.8L2.6 5.6l3.8-.4Z" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 7.2 9 12l5-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashTiny() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 3h8M4.5 3V2h3v1M3.2 3l.5 7h4.6l.5-7" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function GearTiny() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 1.4v1.4M6.5 10.2v1.4M1.4 6.5h1.4M10.2 6.5h1.4M2.8 2.8l1 1M9.2 9.2l1 1M10.2 2.8l-1 1M3.8 9.2l-1 1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

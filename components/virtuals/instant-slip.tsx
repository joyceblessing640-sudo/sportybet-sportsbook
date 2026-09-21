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

export const IF_ASSET_V = "5";

export const IF_STATES = {
  single: `/virtuals/if-states/1-single.jpg?v=${IF_ASSET_V}`,
  multi: `/virtuals/if-states/2-multi.jpg?v=${IF_ASSET_V}`,
  sheet: `/virtuals/if-states/3-sheet.jpg?v=${IF_ASSET_V}`,
  confirm: `/virtuals/if-states/4-confirm.jpg?v=${IF_ASSET_V}`,
  submitting: `/virtuals/if-states/5-submitting.jpg?v=${IF_ASSET_V}`,
} as const;

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

  useEffect(() => {
    for (const src of Object.values(IF_STATES)) {
      const image = new window.Image();
      image.src = src;
    }
  }, []);

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
      await new Promise((resolve) => window.setTimeout(resolve, 5000));
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
    <div className="ifs-root" data-testid="if-slip" data-if-build="if-sheet-v6" data-if-phase={phase} data-if-mode={mode}>
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
          ) : null}
          {mode === "confirm" ? (
            <div className="ifs-confirm-sheet" data-testid="if-confirm">
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
    <section className="ifs-shot ifs-single-shot" data-testid="if-slip-single" data-if-state="single">
      <img className="ifs-photo" src={IF_STATES.single} alt="" draggable={false} />
      <div className="ifs-overlay">
        <button type="button" className="ifs-hit ifs-hit-close" aria-label="Close betslip" onClick={onClose} />
        <div className="ifs-single-cover">
          <button type="button" className="ifs-single-pick" onClick={onExpand}>
            <span>
              {selectionLabel(item.selection)}
              <em> | {item.marketName}</em>
            </span>
            <strong>{formatOdds(item.odds)}</strong>
          </button>
          <div className="ifs-single-meta">
            <button type="button" className="ifs-single-remove" aria-label="Remove selection" onClick={onRemove}>
              ×
            </button>
            <button type="button" className="ifs-single-match" onClick={onExpand}>
              {item.matchLabel.replace(" vs ", " VS ")}
            </button>
            <input
              value={stake}
              inputMode="decimal"
              aria-label="Stake"
              onChange={(event) => onStake(event.target.value)}
            />
          </div>
        </div>
        <span className="ifs-chip ifs-chip-dark ifs-chip-win">{odds}</span>
        <button type="button" className="ifs-hit ifs-hit-mini-place" data-testid="if-place-bet-mini" onClick={onPlace}>
          <span className="ifs-chip ifs-chip-green ifs-chip-pay">About to pay {payLabel}</span>
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
    <section className="ifs-shot ifs-multi-shot" data-testid="if-slip-multi" data-if-state="multi">
      <img className="ifs-photo" src={IF_STATES.multi} alt="" draggable={false} />
      <div className="ifs-overlay">
        <button type="button" className="ifs-hit ifs-hit-close" aria-label="Close betslip" onClick={onClose} />
        <button type="button" className="ifs-hit ifs-hit-expand" aria-label="Expand betslip" onClick={onExpand} />
        <span className="ifs-chip ifs-chip-count">{count}</span>
        <span className="ifs-chip ifs-chip-multi-meta">
          {multipleLabel(count)} <strong>{odds}</strong>
        </span>
      </div>
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
      <span className="ifs-live-name">{selectionLabel(item.selection)}</span>
      <span className="ifs-live-odds">{formatOdds(item.odds)}</span>
      <div className="ifs-live-match">
        <button type="button" aria-label="Remove selection" disabled={disabled} onClick={onRemove}>
          ×
        </button>
        <span>{item.matchLabel.replace(" vs ", " VS ")}</span>
      </div>
      <span className="ifs-live-market">{item.marketName}</span>
    </article>
  );
}

function formatWallet(pesewas: number) {
  return `GHS ${(pesewas / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

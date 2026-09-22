"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { InstantFootballSlip } from "@/components/virtuals/instant-slip";
import { formatGhs, formatOdds, toGhs } from "@/lib/money";
import {
  DEMO_BOARDS,
  boardMatches,
  demoLeagueLine,
  demoOutcomes,
  marketName,
  type DemoBoardId,
  type DemoMatch,
} from "@/lib/virtuals/demo-board";
import type { VirtualMarketId } from "@/lib/virtuals/engine";
import { readPersistedSlip, useVirtualSlip } from "@/store/virtual-slip";
import "./instant-football.css";

type ShotRow = { top: number; height: number };

type BoardShot = {
  id: DemoBoardId;
  src: string;
  rows: ShotRow[];
  oddLeft: number;
  oddWidth: number;
  oddStep: number;
  tabs?: { id: DemoBoardId; left: number; width: number }[];
};

const BOARD_SHOTS: BoardShot[] = [
  {
    id: "england",
    src: "/virtuals/if-england.jpg",
    rows: [
      { top: 23.8, height: 5.8 },
      { top: 36.6, height: 6.0 },
      { top: 49.5, height: 6.0 },
      { top: 62.6, height: 5.9 },
      { top: 75.5, height: 6.1 },
      { top: 88.6, height: 5.9 },
    ],
    oddLeft: 34.8,
    oddWidth: 20.6,
    oddStep: 20.9,
    tabs: [
      { id: "england", left: 0, width: 16 },
      { id: "spain", left: 16, width: 14 },
      { id: "germany", left: 30, width: 18 },
      { id: "italy", left: 48, width: 14 },
      { id: "champions", left: 62, width: 20 },
    ],
  },
  {
    id: "spain",
    src: "/virtuals/if-spain.jpg",
    rows: [
      { top: 7.9, height: 6.1 },
      { top: 21.2, height: 6.1 },
      { top: 34.5, height: 6.0 },
      { top: 47.8, height: 6.1 },
      { top: 61.2, height: 6.0 },
      { top: 74.5, height: 6.0 },
      { top: 87.7, height: 6.1 },
    ],
    oddLeft: 34.8,
    oddWidth: 20.6,
    oddStep: 20.9,
  },
  {
    id: "germany",
    src: "/virtuals/if-germany.jpg",
    rows: [
      { top: 8.3, height: 6.2 },
      { top: 21.9, height: 6.1 },
      { top: 35.2, height: 6.2 },
      { top: 48.8, height: 6.1 },
      { top: 62.2, height: 6.2 },
      { top: 75.7, height: 6.1 },
      { top: 89.1, height: 6.2 },
    ],
    oddLeft: 34.9,
    oddWidth: 20.6,
    oddStep: 20.9,
  },
  {
    id: "italy",
    src: "/virtuals/if-italy.jpg",
    rows: [
      { top: 14.5, height: 5.7 },
      { top: 27.0, height: 5.6 },
      { top: 39.3, height: 5.7 },
      { top: 51.7, height: 5.7 },
      { top: 64.1, height: 5.7 },
      { top: 76.6, height: 5.6 },
      { top: 88.9, height: 5.7 },
    ],
    oddLeft: 34.9,
    oddWidth: 20.5,
    oddStep: 20.8,
  },
  {
    id: "champions",
    src: "/virtuals/if-champions.jpg",
    rows: [
      { top: 7.4, height: 6.2 },
      { top: 20.9, height: 6.3 },
      { top: 34.5, height: 6.2 },
      { top: 48.0, height: 6.3 },
      { top: 61.6, height: 6.3 },
      { top: 75.2, height: 6.2 },
      { top: 88.8, height: 6.0 },
    ],
    oddLeft: 34.9,
    oddWidth: 20.6,
    oddStep: 20.9,
  },
  {
    id: "euros",
    src: "/virtuals/if-euros.jpg",
    rows: [
      { top: 8.4, height: 6.1 },
      { top: 21.7, height: 6.0 },
      { top: 35.0, height: 6.0 },
      { top: 48.3, height: 6.0 },
      { top: 61.6, height: 6.1 },
      { top: 75.0, height: 6.0 },
      { top: 88.2, height: 6.1 },
    ],
    oddLeft: 34.8,
    oddWidth: 20.6,
    oddStep: 20.9,
  },
  {
    id: "cwc",
    src: "/virtuals/if-cwc.jpg",
    rows: [
      { top: 7.7, height: 6.1 },
      { top: 21.2, height: 6.1 },
      { top: 34.5, height: 6.2 },
      { top: 48.0, height: 6.2 },
      { top: 61.5, height: 6.2 },
      { top: 75.0, height: 6.2 },
      { top: 88.4, height: 6.1 },
    ],
    oddLeft: 34.8,
    oddWidth: 20.6,
    oddStep: 20.9,
  },
];

export function InstantFootballView() {
  const { user } = useAuth();
  const [boardId, setBoardId] = useState<DemoBoardId>("england");
  const [round, setRound] = useState(1);
  const items = useVirtualSlip((state) => state.items);
  const togglePick = useVirtualSlip((state) => state.togglePick);
  const marketId: VirtualMarketId = "1X2";
  const sections = useMemo(
    () => BOARD_SHOTS.map((shot) => ({ ...shot, matches: boardMatches(shot.id) })),
    [],
  );

  useEffect(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    const saved = readPersistedSlip();
    if (saved?.items.length) useVirtualSlip.setState(saved);
  }, []);

  useEffect(() => {
    const nodes = DEMO_BOARDS.map((board) => document.getElementById(`if-section-${board.id}`)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const id = visible?.target.getAttribute("data-league") as DemoBoardId | null;
        if (id) setBoardId(id);
      },
      { root: null, rootMargin: "-44px 0px -58% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  function selectOdd(match: DemoMatch, code: "1" | "X" | "2") {
    const outcome = demoOutcomes(match, marketId).find((item) => item.code === code);
    if (!outcome) return;
    togglePick({
      matchId: match.id,
      matchLabel: `${match.home.abbreviation} vs ${match.away.abbreviation}`,
      league: demoLeagueLine(match.boardId),
      marketId,
      marketName: marketName(marketId),
      outcomeId: outcome.id,
      selection: outcome.code,
      odds: outcome.odds,
    });
  }

  function goToBoard(id: DemoBoardId) {
    setBoardId(id);
    document.getElementById(`if-section-${id}`)?.scrollIntoView({ block: "start" });
  }

  return (
    <div className="if" data-testid="if-board" data-if-build="if-board-v11" data-if-league={boardId}>
      <header className="if-top">
        <Link href="/virtuals" aria-label="Back to Virtuals" className="if-back">
          <ChevronLeft size={24} strokeWidth={2.2} />
        </Link>
        <h1>Instant Football</h1>
        {user ? (
          <Link href="/me" className="if-wallet">
            <span>
              <small>GHS</small>
              <strong>{toGhs(user.wallet?.balancePesewas ?? 0)}</strong>
            </span>
            <Wallet size={18} strokeWidth={2} aria-hidden />
            <span className="sr-only">{formatGhs(user.wallet?.balancePesewas ?? 0)}</span>
          </Link>
        ) : (
          <div className="if-account">
            <Link href="/register">Register</Link>
            <span className="sep">|</span>
            <Link href="/login">Login</Link>
          </div>
        )}
      </header>

      <div className="if-list">
        {sections.map((section) => (
          <section key={section.id} id={`if-section-${section.id}`} className="if-shot" data-league={section.id}>
            <img src={section.src} alt={`${section.id} Instant Football`} draggable={false} />
            {section.tabs?.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="if-shot-tab"
                style={{ left: `${tab.left}%`, width: `${tab.width}%` }}
                aria-label={tab.id}
                onClick={() => goToBoard(tab.id)}
              />
            ))}
            {section.matches.map((match, index) => {
              const row = section.rows[index];
              if (!row) return null;
              const selected = items.find((item) => item.matchId === match.id);
              return demoOutcomes(match, marketId).map((outcome, oddIndex) => {
                const active = selected?.outcomeId === outcome.id;
                return (
                  <button
                    key={outcome.id}
                    type="button"
                    className="if-shot-odd"
                    data-active={active ? "true" : "false"}
                    aria-pressed={active}
                    aria-label={`${match.home.abbreviation} vs ${match.away.abbreviation} ${outcome.code} ${formatOdds(outcome.odds)}`}
                    style={{
                      top: `${row.top}%`,
                      height: `${row.height}%`,
                      left: `${section.oddLeft + oddIndex * section.oddStep}%`,
                      width: `${section.oddWidth}%`,
                    }}
                    onClick={() => selectOdd(match, outcome.code)}
                  >
                    {active ? formatOdds(outcome.odds) : null}
                  </button>
                );
              });
            })}
          </section>
        ))}
      </div>

      <InstantFootballSlip
        onNextRound={() => {
          const next = round + 1;
          setRound(next);
          toast.message(`Demo round ${next} ready`);
        }}
      />
    </div>
  );
}

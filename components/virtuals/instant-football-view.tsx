"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { DemoCrest } from "@/components/virtuals/demo-crest";
import { InstantFootballSlip } from "@/components/virtuals/instant-slip";
import { formatGhs, formatOdds, toGhs } from "@/lib/money";
import {
  DEMO_BOARDS,
  DEMO_MARKET_TABS,
  boardMatches,
  demoLeagueLine,
  demoOutcomes,
  marketName,
  type DemoBoardId,
  type DemoMatch,
} from "@/lib/virtuals/demo-board";
import type { VirtualMarketId } from "@/lib/virtuals/engine";
import { useVirtualSlip } from "@/store/virtual-slip";
import "./instant-football.css";

export function InstantFootballView() {
  const { user } = useAuth();
  const [boardId, setBoardId] = useState<DemoBoardId>("england");
  const [marketId, setMarketId] = useState<VirtualMarketId>("1X2");
  const [bookingBonus, setBookingBonus] = useState(false);
  const [round, setRound] = useState(1);
  const items = useVirtualSlip((state) => state.items);
  const togglePick = useVirtualSlip((state) => state.togglePick);
  const sections = useMemo(
    () => DEMO_BOARDS.map((board) => ({ ...board, matches: boardMatches(board.id) })),
    [],
  );

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
      { root: null, rootMargin: "-126px 0px -58% 0px", threshold: 0 },
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

  async function shareBoard() {
    const url = typeof window !== "undefined" ? window.location.href : "/virtuals/instant-football";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Instant Football demo", url });
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.message("Demo link copied");
    } catch {
      toast.message("Instant Football demo");
    }
  }

  return (
    <div className="if" data-testid="if-board">
      <div className="if-chrome">
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

        <div className="if-leagues-wrap">
          <nav className="if-leagues if-h-scroll" data-testid="if-league-tabs" aria-label="Leagues">
            {DEMO_BOARDS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={boardId === item.id ? "true" : undefined}
                onClick={() => goToBoard(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="if-spark"
            aria-label="Demo stats"
            onClick={() => toast.message("Instant Football is a DEMO simulation. No real-money bets.")}
          >
            <SparkIcon />
            <span className="dot" />
          </button>
        </div>

        <div className="if-tools">
          <span className="if-bb">BB</span>
          <button
            type="button"
            className="if-switch"
            role="switch"
            aria-checked={bookingBonus}
            aria-label="Booking bonus"
            onClick={() => setBookingBonus((value) => !value)}
          >
            <i />
          </button>
          <button type="button" className="if-share" aria-label="Share" onClick={() => void shareBoard()}>
            <ShareNodes />
          </button>
          <div className="if-markets if-h-scroll" data-testid="if-market-tabs">
            {DEMO_MARKET_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-current={marketId === tab.id ? "true" : undefined}
                onClick={() => setMarketId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="if-list">
        {sections.map((section) => (
          <section key={section.id} id={`if-section-${section.id}`} className="if-league" data-league={section.id}>
            <div className="if-league-h">
              <div className="if-league-name">
                <BoardFlag boardId={section.id} />
                <span>{section.league}</span>
                <button
                  type="button"
                  className="if-info"
                  aria-label="Demo information"
                  onClick={() => toast.message("Instant Football is a DEMO simulation. No real-money bets.")}
                >
                  i
                </button>
              </div>
              <div className="if-cols">
                <span>1</span>
                <span>X</span>
                <span>2</span>
              </div>
            </div>
            {section.matches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                marketId={marketId}
                selectedId={items.find((item) => item.matchId === match.id)?.outcomeId}
                onSelect={selectOdd}
              />
            ))}
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

function MatchRow({
  match,
  marketId,
  selectedId,
  onSelect,
}: {
  match: DemoMatch;
  marketId: VirtualMarketId;
  selectedId?: string;
  onSelect: (match: DemoMatch, code: "1" | "X" | "2") => void;
}) {
  const outcomes = demoOutcomes(match, marketId);
  return (
    <article className="if-row">
      <div className="if-teams">
        <div className="if-pair">
          <div className="if-side">
            <DemoCrest team={match.home} size={18} />
            <span className="if-meta">
              <span className="if-abbr">{match.home.abbreviation}</span>
              <Stars value={match.home.stars} />
            </span>
          </div>
          <span className="if-vs">VS</span>
          <div className="if-side if-side-away">
            <span className="if-meta">
              <span className="if-abbr">{match.away.abbreviation}</span>
              <Stars value={match.away.stars} />
            </span>
            <DemoCrest team={match.away} size={18} />
          </div>
        </div>
        <p className="if-more">+71 &gt;</p>
      </div>
      <div className="if-odds">
        {outcomes.map((outcome) => {
          const active = selectedId === outcome.id;
          return (
            <button
              key={outcome.id}
              type="button"
              data-active={active ? "true" : "false"}
              aria-pressed={active}
              aria-label={`${match.home.abbreviation} vs ${match.away.abbreviation} ${outcome.code} ${formatOdds(outcome.odds)}`}
              onClick={() => onSelect(match, outcome.code)}
            >
              {formatOdds(outcome.odds)}
            </button>
          );
        })}
      </div>
    </article>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="if-stars" aria-hidden>
      {[1, 2, 3].map((star) => (
        <span key={star} className={star <= value ? "on" : undefined}>
          ★
        </span>
      ))}
    </span>
  );
}

function ShareNodes() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="4.2" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13.2" cy="4.2" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13.2" cy="13.8" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 8.2 11.4 5.2M6 9.8 11.4 12.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1.5 11.5 5 7.5 8 9.5 14.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M1.5 13.5h13" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BoardFlag({ boardId }: { boardId: DemoBoardId }) {
  if (boardId === "england") return <span className="if-flag if-flag-eng" />;
  if (boardId === "spain") {
    return (
      <span className="if-flag if-flag-esp">
        <span />
        <span />
        <span />
      </span>
    );
  }
  if (boardId === "germany") {
    return (
      <span className="if-flag if-flag-ger">
        <span />
        <span />
        <span />
      </span>
    );
  }
  if (boardId === "italy") {
    return (
      <span className="if-flag if-flag-ita">
        <span />
        <span />
        <span />
      </span>
    );
  }
  if (boardId === "champions") return <span className="if-badge if-badge-ucl">★</span>;
  if (boardId === "euros") return <span className="if-badge if-badge-eur">★</span>;
  return <span className="if-badge if-badge-cwc">W</span>;
}

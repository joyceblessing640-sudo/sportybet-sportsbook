"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Info, Share2 } from "lucide-react";
import { toast } from "sonner";
import { DemoCrest, StarRating } from "@/components/virtuals/demo-crest";
import { InstantSlipPanel, openInstantSlip } from "@/components/virtuals/instant-slip";
import { formatOdds } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  DEMO_BOARDS,
  DEMO_MARKET_TABS,
  boardMatches,
  demoLeagueLine,
  demoOutcomes,
  getDemoBoard,
  marketName,
  type DemoBoardId,
  type DemoMatch,
} from "@/lib/virtuals/demo-board";
import type { VirtualMarketId } from "@/lib/virtuals/engine";
import { useVirtualSlip } from "@/store/virtual-slip";

export function InstantFootballView() {
  const [boardId, setBoardId] = useState<DemoBoardId>("england");
  const [marketId, setMarketId] = useState<VirtualMarketId>("1X2");
  const [bookingBonus, setBookingBonus] = useState(false);
  const [round, setRound] = useState(1);
  const items = useVirtualSlip((state) => state.items);
  const togglePick = useVirtualSlip((state) => state.togglePick);
  const matches = useMemo(() => boardMatches(boardId), [boardId]);
  const board = getDemoBoard(boardId);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("if-page");
    body.classList.add("if-page");
    const prevHtmlHeight = html.style.height;
    const prevBodyOverflow = body.style.overflow;
    html.style.height = "auto";
    body.style.height = "auto";
    body.style.overflow = "visible";
    return () => {
      html.classList.remove("if-page");
      body.classList.remove("if-page");
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = "";
    };
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
    <div className="relative mx-auto max-w-[430px] bg-white">
      <div className="if-page if-board pb-[calc(50px+env(safe-area-inset-bottom))]" data-testid="if-board" data-if-build="page-scroll">
      <header className="sticky top-0 z-30 flex h-11 items-center bg-[#e31837] px-1 text-white">
        <Link href="/virtuals" aria-label="Back to Virtuals" className="grid h-10 w-10 place-items-center">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="flex-1 text-[16px] font-semibold">Instant Football</h1>
        <div className="pr-3 text-[12px] font-semibold">
          <Link href="/register">Register</Link>
          <span className="mx-1.5 text-white/45">|</span>
          <Link href="/login">Login</Link>
        </div>
      </header>

      <div className="if-h-scroll no-scrollbar flex bg-[#2f333b] text-[13px] font-semibold text-white" data-testid="if-league-tabs">
        {DEMO_BOARDS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setBoardId(item.id)}
            className={cn(
              "relative shrink-0 px-3.5 py-2.5 whitespace-nowrap",
              boardId === item.id ? "text-white" : "text-white/80",
            )}
          >
            {item.label}
            {boardId === item.id ? (
              <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-[#12a150]" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-b border-[#eef0f4] px-2.5 py-1.5">
        <span className="inline-flex h-6 items-center rounded-sm bg-[#12a150] px-1.5 text-[11px] font-black tracking-tight text-white">
          BB
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={bookingBonus}
          aria-label="Booking bonus"
          onClick={() => setBookingBonus((value) => !value)}
          className={cn(
            "relative h-[18px] w-[32px] rounded-full transition-colors",
            bookingBonus ? "bg-[#12a150]" : "bg-[#c5cad3]",
          )}
        >
          <span
            className={cn(
              "absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform",
              bookingBonus ? "left-[16px]" : "left-[2px]",
            )}
          />
        </button>
        <button type="button" aria-label="Share" className="grid h-8 w-8 place-items-center text-[#12a150]" onClick={() => void shareBoard()}>
          <Share2 className="h-4 w-4" />
        </button>
        <div className="if-h-scroll no-scrollbar ml-auto flex min-w-0 flex-1 items-end justify-end gap-1 text-[11px] font-semibold text-[#6b7280]" data-testid="if-market-tabs">
          {DEMO_MARKET_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMarketId(tab.id)}
              className={cn(
                "relative min-w-[58px] px-1 pb-1.5 pt-1 text-center",
                marketId === tab.id ? "text-[#12a150]" : "text-[#6b7280]",
              )}
            >
              {tab.label}
              {marketId === tab.id ? (
                <span className="absolute inset-x-1 bottom-0 h-[3px] rounded-t-full bg-[#12a150]" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-[#eef0f4] px-2.5 py-1.5 text-[12px]">
        <BoardFlag boardId={boardId} />
        <span className="font-medium text-[#222]">{board.league}</span>
        <button
          type="button"
          aria-label="Demo information"
          className="grid h-5 w-5 place-items-center text-[#9aa3af]"
          onClick={() => toast.message("Instant Football is a DEMO simulation. No real-money bets.")}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        <span className="ml-auto grid w-[54%] grid-cols-3 text-center text-[11px] font-semibold text-[#8b93a0]">
          <span>1</span>
          <span>X</span>
          <span>2</span>
        </span>
      </div>

      <div className="divide-y divide-[#f1f3f7]">
        {matches.map((match) => (
          <DemoMatchRow
            key={match.id}
            match={match}
            marketId={marketId}
            selectedId={items.find((item) => item.matchId === match.id)?.outcomeId}
            onSelect={selectOdd}
          />
        ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto grid h-[50px] max-w-[430px] grid-cols-2 pb-[env(safe-area-inset-bottom)] text-[15px] font-bold text-white">
        <button
          type="button"
          className="bg-[#2a2d36]"
          onClick={() => {
            const next = round + 1;
            setRound(next);
            toast.message(`Demo round ${next} ready`);
          }}
        >
          Next Round
        </button>
        <button type="button" className="bg-[#12a150]" onClick={openInstantSlip}>
          Betslip
        </button>
      </div>

      <div id="instant-football-betslip" popover="auto" className="betslip-popover">
        <InstantSlipPanel />
      </div>
    </div>
  );
}

function DemoMatchRow({
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
    <article className="flex items-center gap-1 px-2 py-[7px]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center">
          <DemoCrest team={match.home} size={24} />
          <span className="ml-1 truncate text-[13px] font-bold text-[#1a1d24]">{match.home.abbreviation}</span>
          <span className="px-1 text-[10px] font-semibold text-[#9aa3af]">VS</span>
          <span className="truncate text-[13px] font-bold text-[#1a1d24]">{match.away.abbreviation}</span>
          <DemoCrest team={match.away} size={24} />
        </div>
        <div className="mt-0.5 flex items-start">
          <span className="w-[24px]" />
          <StarRating value={match.home.stars} />
          <span className="flex-1" />
          <StarRating value={match.away.stars} />
          <span className="w-[24px]" />
        </div>
        <p className="text-[10px] font-semibold leading-none text-[#8b93a0]">+71 &gt;</p>
      </div>
      <div className="grid w-[54%] shrink-0 grid-cols-3 gap-[5px]">
        {outcomes.map((outcome) => {
          const active = selectedId === outcome.id;
          return (
            <button
              key={outcome.id}
              type="button"
              data-active={active ? "true" : "false"}
              aria-pressed={active}
              aria-label={`${match.home.abbreviation} vs ${match.away.abbreviation} ${outcome.code} ${formatOdds(outcome.odds)}`}
              className="odds-btn min-h-[42px] text-[15px] font-bold"
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

function BoardFlag({ boardId }: { boardId: DemoBoardId }) {
  if (boardId === "england") {
    return (
      <span className="relative h-[14px] w-[18px] overflow-hidden rounded-[2px] bg-white">
        <span className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 bg-[#cf142b]" />
        <span className="absolute inset-y-0 left-1/2 w-[4px] -translate-x-1/2 bg-[#cf142b]" />
      </span>
    );
  }
  if (boardId === "spain") {
    return (
      <span className="flex h-[14px] w-[18px] flex-col overflow-hidden rounded-[2px]">
        <span className="flex-1 bg-[#c60b1e]" />
        <span className="flex-[1.4] bg-[#ffc400]" />
        <span className="flex-1 bg-[#c60b1e]" />
      </span>
    );
  }
  if (boardId === "germany") {
    return (
      <span className="flex h-[14px] w-[18px] flex-col overflow-hidden rounded-[2px]">
        <span className="flex-1 bg-black" />
        <span className="flex-1 bg-[#dd0000]" />
        <span className="flex-1 bg-[#ffce00]" />
      </span>
    );
  }
  if (boardId === "italy") {
    return (
      <span className="flex h-[14px] w-[18px] overflow-hidden rounded-[2px]">
        <span className="flex-1 bg-[#009246]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#ce2b37]" />
      </span>
    );
  }
  if (boardId === "champions") {
    return (
      <span className="grid h-[16px] w-[16px] place-items-center rounded-full bg-[#0b1b4a] text-[8px] text-[#7dd3fc]">
        ★
      </span>
    );
  }
  if (boardId === "euros") {
    return (
      <span className="grid h-[16px] w-[16px] place-items-center rounded-full bg-[#003399] text-[9px] text-[#ffcc00]">
        ★
      </span>
    );
  }
  return (
    <span className="grid h-[16px] w-[16px] place-items-center rounded-full bg-[#c9a227] text-[8px] font-black text-white">
      W
    </span>
  );
}

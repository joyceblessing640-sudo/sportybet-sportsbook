"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DemoCrest } from "@/components/virtuals/demo-crest";
import { formatGhs, formatOdds } from "@/lib/money";
import { cn } from "@/lib/utils";
import { getDemoMatch } from "@/lib/virtuals/demo-board";
import {
  getDemoTicket,
  markDemoTicketPlaying,
  saveSettledDemoTicket,
  simulateDemoPick,
  subscribeDemoTickets,
  type DemoTicket,
  type DemoTicketPick,
} from "@/lib/virtuals/demo-tickets";
import { type SimEvent } from "@/lib/virtuals/engine";

const SPEED_MS = { "1x": 700, "2x": 320 } as const;

export function InstantFootballTicket({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<DemoTicket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setTicket(getDemoTicket(ticketId));
    load();
    setReady(true);
    return subscribeDemoTickets(load);
  }, [ticketId]);

  if (!ready) {
    return <div className="min-h-dvh bg-[#14161a] px-4 py-10 text-center text-white/70">Loading demo ticket…</div>;
  }
  if (!ticket) {
    return (
      <div className="min-h-dvh bg-[#14161a] px-4 py-10 text-center text-white">
        <p className="text-[14px] font-semibold">Demo ticket not found</p>
        <Link href="/bets" className="mt-3 inline-block text-[13px] text-[#7dffb1]">
          Back to Open Bets
        </Link>
      </div>
    );
  }

  return <TicketPlay ticket={ticket} onTicket={setTicket} />;
}

function TicketPlay({ ticket, onTicket }: { ticket: DemoTicket; onTicket: (ticket: DemoTicket) => void }) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(Boolean(ticket.playing || ticket.status === "SETTLED"));
  const [speed, setSpeed] = useState<"1x" | "2x">("1x");
  const [cursor, setCursor] = useState(ticket.status === "SETTLED" ? 999 : 0);

  const pick = ticket.picks[index];
  const match = pick ? getDemoMatch(pick.matchId) : null;
  const sim = useMemo(
    () => (pick ? simulateDemoPick(pick) : null),
    [pick],
  );
  const events = sim?.events ?? [];
  const shown = ticket.status === "SETTLED" ? events : events.slice(0, Math.max(started ? 1 : 0, Math.min(cursor, events.length)));
  const latest = shown.at(-1);
  const finished = Boolean(sim && started && cursor >= events.length);

  useEffect(() => {
    if (!started || !sim || cursor >= events.length) return;
    const latestEvent = events[Math.max(0, cursor - 1)];
    const timer = window.setTimeout(() => setCursor((value) => value + 1), latestEvent?.type === "GOAL" ? SPEED_MS[speed] + 280 : SPEED_MS[speed]);
    return () => window.clearTimeout(timer);
  }, [started, sim, cursor, events, speed]);

  useEffect(() => {
    if (!finished || ticket.status === "SETTLED") return;
    if (index < ticket.picks.length - 1) {
      const timer = window.setTimeout(() => {
        setIndex((value) => value + 1);
        setCursor(1);
      }, 900);
      return () => window.clearTimeout(timer);
    }
    onTicket(saveSettledDemoTicket(ticket));
  }, [finished, index, ticket, onTicket]);

  function kickOff() {
    setStarted(true);
    setCursor(1);
    onTicket(markDemoTicketPlaying(ticket));
  }

  function skipToResult() {
    setStarted(true);
    setIndex(ticket.picks.length - 1);
    setCursor(events.length);
    onTicket(saveSettledDemoTicket(ticket));
  }

  const settled = ticket.status === "SETTLED";

  return (
    <div className="min-h-dvh bg-[#14161a] text-white">
      <header className="sticky top-0 z-20 flex h-11 items-center bg-[#e31837] px-1">
        <Link href="/bets" aria-label="Back to Open Bets" className="grid h-9 w-9 place-items-center">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold">Instant Football</h1>
          <p className="text-[10px] text-white/80">DEMO ticket {ticket.publicId}</p>
        </div>
      </header>

      <div className="px-3 pb-8 pt-3">
        <p className="mb-3 rounded-md bg-[#12a150]/15 px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#7dffb1]">
          Simulated match · no real-money transaction
        </p>

        <article className="rounded-xl bg-[#1f232b] px-3 py-3">
          {ticket.picks.map((row) => (
            <PickLine key={row.matchId + row.selection} pick={row} />
          ))}
          <div className="mt-3 grid grid-cols-3 text-[11px] text-white/55">
            <div>
              Odds
              <p className="font-bold text-white">{formatOdds(ticket.totalOdds)}</p>
            </div>
            <div>
              Stake
              <p className="font-bold text-white">{formatGhs(ticket.stakePesewas)}</p>
            </div>
            <div>
              To win
              <p className="font-bold text-white">{formatGhs(ticket.potentialWinPesewas)}</p>
            </div>
          </div>
        </article>

        {!started ? (
          <button
            type="button"
            className="mt-4 h-12 w-full rounded-md bg-[#12a150] text-[16px] font-bold"
            onClick={kickOff}
          >
            Kick Off
          </button>
        ) : (
          <div className="mt-3 flex gap-2">
            {(["1x", "2x"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSpeed(item)}
                className={cn(
                  "h-9 flex-1 rounded-md text-[13px] font-bold",
                  speed === item ? "bg-[#12a150]" : "bg-[#2a2d36]",
                )}
              >
                {item}
              </button>
            ))}
            <button type="button" className="h-9 flex-1 rounded-md bg-white text-[13px] font-bold text-ink" onClick={skipToResult}>
              Skip to Result
            </button>
          </div>
        )}

        {started && pick && sim ? (
          <div className="mt-4 rounded-2xl bg-[#1f232b] px-3 py-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <TeamSide pick={pick} side="home" />
              <div className="text-center">
                <p className="text-[11px] font-semibold text-white/45">VS</p>
                <p className={cn("mt-1 text-[32px] font-black tabular-nums leading-none", latest?.type === "GOAL" ? "text-[#7dffb1]" : "text-white")}>
                  {latest?.homeScore ?? 0} - {latest?.awayScore ?? 0}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-white/50">{latest ? `${latest.minute}'` : "0'"}</p>
              </div>
              <TeamSide pick={pick} side="away" />
            </div>
            {match ? null : null}
            {ticket.picks.length > 1 ? (
              <p className="mt-2 text-center text-[11px] text-white/45">
                Match {index + 1}/{ticket.picks.length}
              </p>
            ) : null}
          </div>
        ) : null}

        {shown.length > 0 ? (
          <ol className="mt-4 space-y-1.5">
            {shown.map((event: SimEvent, i) => (
              <li
                key={`${event.minute}-${event.type}-${i}`}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-[12px]",
                  event.type === "GOAL" ? "bg-[#12a150] font-bold" : "bg-[#23262e] text-white/85",
                )}
              >
                <span>
                  {event.minute}' {event.label}
                </span>
                <span className="tabular-nums">
                  {event.homeScore}-{event.awayScore}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {settled ? (
          <div className="mt-4 rounded-xl bg-[#1f232b] px-3 py-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/50">Final result · demo</p>
            <p className={cn("mt-1 text-[22px] font-black", ticket.won ? "text-[#7dffb1]" : "text-[#ff8b8b]")}>
              {ticket.won ? "WON" : "LOST"}
            </p>
            <p className="mt-1 text-[13px] text-white/80">
              {ticket.won ? `Demo return ${formatGhs(ticket.payoutPesewas ?? 0)}` : "Demo stake is not paid out"}
            </p>
            {(ticket.results ?? []).map((result) => {
              const row = ticket.picks.find((item) => item.matchId === result.matchId);
              return (
                <p key={result.matchId} className="mt-1 text-[12px] text-white/70">
                  {row?.matchLabel} {result.homeScore}-{result.awayScore} · {result.won ? "won" : "lost"}
                </p>
              );
            })}
            <Link
              href="/virtuals/instant-football"
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md bg-white text-[13px] font-bold text-ink"
            >
              Back to matches
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PickLine({ pick }: { pick: DemoTicketPick }) {
  const match = getDemoMatch(pick.matchId);
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/5 py-2 last:border-0">
      <div className="min-w-0">
        <p className="text-[10px] text-white/45">{pick.league}</p>
        <p className="truncate text-[13px] font-semibold">
          {match?.home.abbreviation ?? pick.homeName} vs {match?.away.abbreviation ?? pick.awayName}
        </p>
        <p className="text-[11px] text-white/55">
          {pick.marketName} · {pick.selection}
        </p>
      </div>
      <span className="text-[13px] font-bold text-[#7dffb1]">{formatOdds(pick.odds)}</span>
    </div>
  );
}

function TeamSide({ pick, side }: { pick: DemoTicketPick; side: "home" | "away" }) {
  const match = getDemoMatch(pick.matchId);
  const team = match?.[side];
  const name = side === "home" ? pick.homeName : pick.awayName;
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      {team ? <DemoCrest team={team} size={48} /> : <span className="h-12 w-12 rounded-full bg-white/10" />}
      <p className="truncate text-[13px] font-bold text-white">{name}</p>
      <p className="text-[11px] font-semibold text-white/55">{team?.abbreviation ?? name.slice(0, 3).toUpperCase()}</p>
    </div>
  );
}

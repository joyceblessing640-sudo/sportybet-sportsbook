"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { DemoCrest } from "@/components/virtuals/demo-crest";
import { formatOdds, toGhs } from "@/lib/money";
import { cn } from "@/lib/utils";
import { getDemoMatch } from "@/lib/virtuals/demo-board";
import {
  getDemoTicket,
  markDemoTicketPlaying,
  readDemoTickets,
  saveSettledDemoTicket,
  simulateDemoPick,
  subscribeDemoTickets,
  type DemoTicket,
  type DemoTicketPick,
} from "@/lib/virtuals/demo-tickets";
import { type SimEvent } from "@/lib/virtuals/engine";
import { selectionLabel, useVirtualSlip } from "@/store/virtual-slip";
import "./instant-ticket.css";

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

  if (!ready || !ticket) {
    return (
      <div className="ift" data-testid="if-open-bets" data-if-build="if-safe-v17">
        <header className="ift-top">
          <Link href="/virtuals/instant-football" aria-label="Back to Instant Football" className="ift-back">
            <ChevronLeft size={24} strokeWidth={2.2} />
          </Link>
          <h1>Instant Football</h1>
        </header>
        <div className="ift-open">
          <BallIcon />
          Open Bets
        </div>
        {ready && !ticket ? (
          <article className="ift-card">
            <p>Demo ticket not found</p>
            <Link href="/virtuals/instant-football" className="ift-reload">
              Back to Instant Football
            </Link>
          </article>
        ) : null}
      </div>
    );
  }

  return <TicketPlay ticket={ticket} onTicket={setTicket} />;
}

function TicketPlay({ ticket, onTicket }: { ticket: DemoTicket; onTicket: (ticket: DemoTicket) => void }) {
  const router = useRouter();
  const { user } = useAuth();
  const hydrate = useVirtualSlip((state) => state.hydrate);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(Boolean(ticket.playing || ticket.status === "SETTLED"));
  const [speed, setSpeed] = useState<"1x" | "2x">("1x");
  const [cursor, setCursor] = useState(ticket.status === "SETTLED" ? 999 : 0);
  const [showDetails, setShowDetails] = useState(true);
  const [openCount, setOpenCount] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const toasted = useRef(false);

  const pick = ticket.picks[index];
  const sim = useMemo(() => (pick ? simulateDemoPick(pick) : null), [pick]);
  const events = sim?.events ?? [];
  const shown = ticket.status === "SETTLED" ? events : events.slice(0, Math.max(started ? 1 : 0, Math.min(cursor, events.length)));
  const latest = shown.at(-1);
  const finished = Boolean(sim && started && cursor >= events.length);
  const settled = ticket.status === "SETTLED";

  useEffect(() => {
    const load = () => setOpenCount(readDemoTickets().filter((item) => item.status === "OPEN").length);
    load();
    return subscribeDemoTickets(load);
  }, []);

  useEffect(() => {
    if (toasted.current || ticket.status !== "OPEN") return;
    toasted.current = true;
    toast.dismiss();
    setShowToast(true);
    const timer = window.setTimeout(() => setShowToast(false), 2600);
    return () => window.clearTimeout(timer);
  }, [ticket]);

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

  function reloadSelections() {
    hydrate(
      ticket.picks.map((row) => ({
        matchId: row.matchId,
        matchLabel: row.matchLabel,
        league: row.league,
        marketId: row.marketId,
        marketName: row.marketName,
        outcomeId: `${row.matchId}:${row.marketId}:${row.selection}`,
        selection: row.selection,
        odds: row.odds,
      })),
    );
    router.push("/virtuals/instant-football");
  }

  return (
    <div className="ift" data-testid="if-open-bets" data-if-build="if-safe-v17">
      <header className="ift-top">
        <Link href="/virtuals/instant-football" aria-label="Back to Instant Football" className="ift-back">
          <ChevronLeft size={24} strokeWidth={2.2} />
        </Link>
        <h1>Instant Football</h1>
        <Link href={user ? "/me" : "/login"} className="ift-wallet">
          <span>
            <small>GHS</small>
            <strong>{toGhs(user?.wallet?.balancePesewas ?? 0)}</strong>
          </span>
          <Wallet size={18} strokeWidth={2} aria-hidden />
        </Link>
      </header>

      <div className="ift-open">
        <BallIcon />
        Open Bets
        <b>{Math.max(openCount, ticket.status === "OPEN" ? 1 : openCount)}</b>
      </div>

      <article className="ift-card">
        <div className="ift-card-head">
          <div>
            <p>
              <span>Ticket ID: {ticket.ticketNo || ticket.publicId}</span>
              {ticket.type === "MULTI" ? "Multiple" : "Single"}
            </p>
          </div>
          <button type="button" className="ift-reload" onClick={reloadSelections}>
            <ReloadArrow />
            Reload Selections
          </button>
        </div>
        {showDetails ? (
          ticket.picks.map((row) => {
            const [home, away] = row.matchLabel.replace(/ VS /i, " vs ").split(" vs ");
            return (
              <div key={row.matchId + row.selection} className="ift-pick">
                <p className="ift-pick-line">
                  {selectionLabel(row.selection)} @<strong>{formatOdds(row.odds)}</strong>
                </p>
                <p className="ift-pick-market">{row.marketName}</p>
                <p className="ift-pick-match">
                  {home} <em>vs</em> {away ?? ""}
                </p>
                <p className="ift-pick-league">League: {row.league}</p>
              </div>
            );
          })
        ) : (
          <p className="ift-pick-match" style={{ margin: "12px 0 4px" }}>
            {ticket.picks.map((row) => row.matchLabel.replace(" VS ", " vs ")).join(", ")}
          </p>
        )}
        <button type="button" className="ift-details" onClick={() => setShowDetails((value) => !value)}>
          {showDetails ? "Hide Match Details ▴" : "Match Details ▾"}
        </button>
        <div className="ift-foot">
          <span>
            Stake <strong>{toGhs(ticket.stakePesewas)}</strong>
          </span>
          <span>
            Pot. Win <strong>{toGhs(ticket.potentialWinPesewas)}</strong>
          </span>
        </div>
      </article>

      {started && pick && sim ? (
        <div className="ift-play">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-[#1f232b] px-3 py-5">
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
          {ticket.picks.length > 1 ? (
            <p className="mt-2 text-center text-[11px] text-white/45">
              Match {index + 1}/{ticket.picks.length}
            </p>
          ) : null}
        </div>
      ) : null}

      {settled ? (
        <div className="ift-play">
          <div className="ift-result" data-testid="demo-result">
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/50">Final result · demo</p>
            <p className={cn("mt-1 text-[22px] font-black", ticket.won ? "text-[#7dffb1]" : "text-[#ff8b8b]")}>
              {ticket.won ? "WON" : "LOST"}
            </p>
            <p className="mt-1 text-[13px] text-white/80">
              {ticket.won ? `Demo return ${toGhs(ticket.payoutPesewas ?? 0)}` : "Demo stake is not paid out"}
            </p>
            {(ticket.results ?? []).map((result) => {
              const row = ticket.picks.find((item) => item.matchId === result.matchId);
              return (
                <p key={result.matchId} className="mt-1 text-[12px] text-white/70">
                  {row?.matchLabel} {result.homeScore}-{result.awayScore} · {result.won ? "won" : "lost"}
                </p>
              );
            })}
          </div>
        </div>
      ) : null}

      {shown.length > 0 ? (
        <ol className="ift-events" style={{ padding: "0 12px 120px" }}>
          {(settled ? shown.filter((event) => event.type === "GOAL" || event.type === "KICK_OFF" || event.type === "FT") : shown).map(
            (event: SimEvent, i) => (
              <li key={`${event.minute}-${event.type}-${i}`} className={event.type === "GOAL" ? "goal" : undefined}>
                <span>
                  {event.minute}' {event.label}
                </span>
                <span>
                  {event.homeScore}-{event.awayScore}
                </span>
              </li>
            ),
          )}
        </ol>
      ) : null}

      {showToast ? (
        <div className="ift-toast" role="status">
          <span>Ticket #{ticket.ticketNo || ticket.publicId} has been created successfully.</span>
          <span className="ift-toast-ok" aria-hidden>
            ✓
          </span>
        </div>
      ) : null}

      <div className="ift-speed-bar">
        <span>
          <ClockIcon /> Simulation Speed
        </span>
        <div className="ift-speeds">
          {(["1x", "2x"] as const).map((item) => (
            <button key={item} type="button" aria-current={speed === item ? "true" : undefined} onClick={() => setSpeed(item)}>
              {item}
            </button>
          ))}
          <button type="button" onClick={skipToResult}>
            Skip
          </button>
        </div>
      </div>

      <div className="ift-dock">
        <button type="button" className="ift-keep" data-testid="if-keep-betting" onClick={() => router.push("/virtuals/instant-football")}>
          Keep Betting
        </button>
        <button type="button" className="ift-kick" data-testid="if-kick-off" disabled={started && !settled} onClick={kickOff}>
          Kick Off
        </button>
      </div>
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

function ReloadArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 12.4c1.5-4.6 5-6.9 10.4-6.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.6 2.6 13.4 5.5 9.6 8.4z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="9" r="5.6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 6.2V9l2 1.4M6.2 1.8h3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1.8 9.6 5.2 13.4 5.6 10.6 8.2l.9 3.8L8 10.4 4.5 12l.9-3.8L2.6 5.6l3.8-.4Z" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

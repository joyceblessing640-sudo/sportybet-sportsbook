"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getDemoMatch } from "@/lib/virtuals/demo-board";
import { simulateMatch, type SimEvent } from "@/lib/virtuals/engine";
import { cn } from "@/lib/utils";
import { DemoCrest } from "@/components/virtuals/demo-crest";

const SPEED_MS = { "1x": 700, "2x": 320 } as const;

export function InstantFootballSim({
  matchIds,
  ticketId,
}: {
  matchIds: string[];
  ticketId: string | null;
}) {
  const ids = matchIds.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState<"1x" | "2x">("1x");
  const [cursor, setCursor] = useState(0);

  const match = useMemo(() => (ids[index] ? getDemoMatch(ids[index]) : null), [ids, index]);
  const sim = useMemo(() => {
    if (!ids[index] || !match) return null;
    return simulateMatch(ids[index], new Date(), { home: match.home.name, away: match.away.name });
  }, [ids, index, match]);
  const events = sim?.events ?? [];
  const shown = events.slice(0, Math.max(started ? 1 : 0, cursor));
  const latest = shown.at(-1);
  const finished = Boolean(sim && started && cursor >= events.length);

  useEffect(() => {
    if (!started || !sim || cursor >= events.length) return;
    const latestEvent = events[Math.max(0, cursor - 1)];
    const timer = window.setTimeout(
      () => setCursor((value) => value + 1),
      latestEvent?.type === "GOAL" ? SPEED_MS[speed] + 280 : SPEED_MS[speed],
    );
    return () => window.clearTimeout(timer);
  }, [started, sim, cursor, events, speed]);

  if (ticketId) {
    return (
      <div className="min-h-dvh bg-[#14161a] px-4 py-10 text-center text-white">
        <p className="text-[14px] font-semibold">Open the demo ticket to Kick Off</p>
        <Link href={`/virtuals/instant-football/ticket/${ticketId}`} className="mt-3 inline-block text-[13px] text-[#7dffb1]">
          View demo ticket
        </Link>
      </div>
    );
  }

  if (!match || !sim) {
    return (
      <div className="min-h-dvh bg-[#14161a] px-4 py-10 text-center text-white">
        <p className="text-[14px] font-semibold">No virtual match selected</p>
        <Link href="/virtuals/instant-football" className="mt-3 inline-block text-[13px] text-[#7dffb1]">
          Back to Instant Football
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#14161a] text-white">
      <header className="sticky top-0 z-20 flex h-11 items-center bg-[#e31837] px-1">
        <Link href="/virtuals/instant-football" aria-label="Back to matches" className="grid h-9 w-9 place-items-center">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold">Instant Football</h1>
          <p className="text-[10px] text-white/80">DEMO / simulated</p>
        </div>
      </header>
      <div className="px-3 pb-6 pt-4">
        {!started ? (
          <button type="button" className="h-12 w-full rounded-md bg-[#12a150] text-[16px] font-bold" onClick={() => { setStarted(true); setCursor(1); }}>
            Kick Off
          </button>
        ) : (
          <div className="flex gap-2">
            {(["1x", "2x"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSpeed(item)}
                className={cn("h-9 flex-1 rounded-md text-[13px] font-bold", speed === item ? "bg-[#12a150]" : "bg-[#2a2d36]")}
              >
                {item}
              </button>
            ))}
            <button type="button" className="h-9 flex-1 rounded-md bg-white text-[13px] font-bold text-ink" onClick={() => setCursor(events.length)}>
              Skip to Result
            </button>
          </div>
        )}
        <div className="mt-4 rounded-2xl bg-[#1f232b] px-3 py-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex min-w-0 flex-col items-center gap-1">
              <DemoCrest team={match.home} size={48} />
              <p className="truncate text-[13px] font-bold">{match.home.name}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-white/45">VS</p>
              <p className={cn("mt-1 text-[32px] font-black tabular-nums leading-none", latest?.type === "GOAL" ? "text-[#7dffb1]" : "text-white")}>
                {latest?.homeScore ?? 0} - {latest?.awayScore ?? 0}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">{latest ? `${latest.minute}'` : "0'"}</p>
            </div>
            <div className="flex min-w-0 flex-col items-center gap-1">
              <DemoCrest team={match.away} size={48} />
              <p className="truncate text-[13px] font-bold">{match.away.name}</p>
            </div>
          </div>
        </div>
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
        {finished ? (
          <div className="mt-4 rounded-xl bg-[#1f232b] px-3 py-3 text-center">
            <p className="text-[14px] font-bold">
              Full Time {sim.homeScore} - {sim.awayScore}
            </p>
            {index < ids.length - 1 ? (
              <button
                type="button"
                className="mt-3 h-9 w-full rounded-md bg-accent text-[13px] font-bold"
                onClick={() => {
                  setIndex((value) => value + 1);
                  setCursor(1);
                }}
              >
                Simulate next match
              </button>
            ) : (
              <Link
                href="/virtuals/instant-football"
                className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md bg-white text-[13px] font-bold text-ink"
              >
                Back to matches
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

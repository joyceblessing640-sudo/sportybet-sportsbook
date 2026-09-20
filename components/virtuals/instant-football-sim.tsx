"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers";
import { formatGhs } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  getVirtualMatch,
  simulateMatch,
  teamMarkSvg,
  type SimEvent,
  type VirtualMatch,
} from "@/lib/virtuals/engine";

function TeamMark({ match, side }: { match: VirtualMatch; side: "home" | "away" }) {
  const team = match[side];
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      {/* Generated crest, not a live-API logo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={teamMarkSvg(team)} alt="" width={56} height={56} className="h-14 w-14 rounded-full" />
      <p className="truncate text-[13px] font-bold text-white">{team.shortName}</p>
      <p className="text-[11px] font-semibold text-white/55">{team.abbreviation}</p>
    </div>
  );
}

export function InstantFootballSim({
  matchIds,
  ticketId,
}: {
  matchIds: string[];
  ticketId: string | null;
}) {
  const { user, setUser } = useAuth();
  const ids = matchIds.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [settled, setSettled] = useState(false);
  const [payout, setPayout] = useState<number | null>(null);

  const match = useMemo(() => (ids[index] ? getVirtualMatch(ids[index]) : null), [ids, index]);
  const sim = useMemo(() => (ids[index] ? simulateMatch(ids[index]) : null), [ids, index]);
  const events = sim?.events ?? [];
  const shown = events.slice(0, Math.max(1, cursor));
  const latest = shown.at(-1);
  const finished = Boolean(sim && cursor >= events.length);

  useEffect(() => {
    setCursor(1);
  }, [index]);

  useEffect(() => {
    if (!sim || cursor >= events.length) return;
    const timer = window.setTimeout(() => setCursor((value) => value + 1), latest?.type === "GOAL" ? 1100 : 650);
    return () => window.clearTimeout(timer);
  }, [sim, cursor, events.length, latest?.type]);

  useEffect(() => {
    if (!finished || !ticketId || settled || !user) return;
    const last = index >= ids.length - 1;
    if (!last) return;
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/virtuals/settle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json().catch(() => null);
      if (cancelled) return;
      if (res.ok && data?.ok) {
        setSettled(true);
        setPayout(data.payoutPesewas ?? 0);
        if (user.wallet && typeof data.balancePesewas === "number") {
          setUser({ ...user, wallet: { ...user.wallet, balancePesewas: data.balancePesewas } });
        }
        toast.success(data.won ? "Virtual bet won" : "Virtual bet settled");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [finished, ticketId, settled, user, index, ids.length, setUser]);

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
      <header className="sticky top-0 z-20 flex h-11 items-center bg-[#1b1d22] px-1">
        <Link href="/virtuals/instant-football" aria-label="Back to matches" className="grid h-9 w-9 place-items-center">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold">Instant Football</h1>
          <p className="text-[10px] text-white/50">Virtual simulation</p>
        </div>
        {ids.length > 1 ? (
          <p className="pr-3 text-[11px] text-white/55">
            {index + 1}/{ids.length}
          </p>
        ) : null}
      </header>

      <div className="px-3 pb-6 pt-5">
        <div className="rounded-2xl bg-[#1f232b] px-3 py-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <TeamMark match={match} side="home" />
            <div className="text-center">
              <p className="text-[11px] font-semibold text-white/45">VS</p>
              <p
                className={cn(
                  "mt-1 text-[32px] font-black tabular-nums leading-none",
                  latest?.type === "GOAL" ? "text-[#7dffb1]" : "text-white",
                )}
              >
                {latest?.homeScore ?? 0} - {latest?.awayScore ?? 0}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">{latest ? `${latest.minute}'` : "0'"}</p>
            </div>
            <TeamMark match={match} side="away" />
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
            <p className="text-[14px] font-bold">Full Time {sim.homeScore} - {sim.awayScore}</p>
            {payout != null ? (
              <p className="mt-1 text-[12px] text-[#7dffb1]">{payout > 0 ? `Won ${formatGhs(payout)}` : "Ticket lost"}</p>
            ) : ticketId && user ? (
              <p className="mt-1 text-[12px] text-white/50">Settling virtual ticket…</p>
            ) : (
              <p className="mt-1 text-[12px] text-white/50">Virtual result from the Instant Football engine</p>
            )}
            {index < ids.length - 1 ? (
              <button
                type="button"
                className="mt-3 h-9 w-full rounded-md bg-accent text-[13px] font-bold"
                onClick={() => setIndex((value) => value + 1)}
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

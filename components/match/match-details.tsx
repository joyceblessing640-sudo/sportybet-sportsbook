"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Star } from "lucide-react";
import { toast } from "sonner";
import { OddsButton } from "@/components/betting/odds-button";
import { TeamBadge } from "@/components/betting/team-badge";
import { MARKET_TABS } from "@/lib/constants";
import { formatKickoffDay } from "@/lib/football/time";
import type { ClientMatch } from "@/lib/serialize";
import type { MatchEvent } from "@/lib/football/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers";

export function MatchDetails({
  match: initial,
  favorited,
  events: initialEvents = [],
}: {
  match: ClientMatch;
  favorited: boolean;
  events?: MatchEvent[];
}) {
  const [match, setMatch] = useState(initial);
  const [events, setEvents] = useState(initialEvents);
  const [tab, setTab] = useState(initial.markets.find((m) => m.type === "1X2")?.type ?? initial.markets[0]?.type ?? "1X2");
  const [saved, setSaved] = useState(favorited);
  const { user } = useAuth();
  const router = useRouter();
  if (match.id !== initial.id) {
    setMatch(initial);
    setEvents(initialEvents);
  }

  useEffect(() => {
    if (match.sport.id !== "football") return;
    let timer = 0;
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch(`/api/football/match?matchId=${encodeURIComponent(match.id)}`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data.ok) {
          if (data.match) setMatch(data.match);
          if (Array.isArray(data.events)) setEvents(data.events);
        }
      } catch {
        /* keep last good snapshot and retry */
      }
      if (cancelled) return;
      timer = window.setTimeout(tick, dataLiveInterval(match.status));
    }
    function dataLiveInterval(status: string) {
      return status === "LIVE" || status === "HT" ? 15_000 : 60_000;
    }
    timer = window.setTimeout(tick, dataLiveInterval(match.status));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [match.id, match.sport.id, match.status]);

  async function toggleFav() {
    if (!user) {
      router.push("/login?next=/match/" + match.id);
      return;
    }
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id }),
    });
    const data = await res.json();
    if (data.ok) setSaved(data.favorite);
    else toast.error(data.error ?? "Could not update favourite.");
  }

  const live = match.status === "LIVE" || match.status === "HT";
  const market = match.markets.find((m) => m.type === tab);
  const availableTabs = MARKET_TABS.filter((t) => match.markets.some((m) => m.type === t.id));

  return (
    <div className="pb-6">
      <header className="flex items-center gap-3 bg-header px-3 py-2.5 text-white">
        <Link href="/sports" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{match.league.name}</p>
          <p className="text-[11px] text-white/70">
            {live ? `Live ${match.clock}` : formatKickoffDay(match.startTime)}
          </p>
        </div>
        <button type="button" onClick={toggleFav} aria-label="Favourite" className="p-1">
          <Star className={cn("h-5 w-5", saved && "fill-white")} />
        </button>
        <Link href="/notifications" aria-label="Notifications" className="p-1">
          <Bell className="h-5 w-5" />
        </Link>
      </header>
      <section className="bg-white px-4 py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <TeamBadge team={match.home} size="md" />
            <p className="text-[13px] font-bold">{match.home.name}</p>
          </div>
          <div className="text-center">
            {live || match.status === "FINISHED" ? (
              <p className="text-[22px] font-bold tabular-nums text-brand">
                {match.homeScore} - {match.awayScore}
              </p>
            ) : (
              <p className="text-[16px] font-bold text-[#9aa3b2]">VS</p>
            )}
            <p className="mt-1 text-[11px] font-semibold uppercase text-muted">{match.status === "FINISHED" ? "FT" : match.status}</p>
            {match.htHomeScore != null && match.htAwayScore != null ? (
              <p className="mt-0.5 text-[10px] text-muted">
                HT {match.htHomeScore}-{match.htAwayScore}
              </p>
            ) : null}
            {match.isDemo ? <p className="mt-1 text-[10px] font-bold text-[#8a6d00]">DEMO MATCH</p> : null}
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamBadge team={match.away} size="md" />
            <p className="text-sm font-bold">{match.away.name}</p>
          </div>
        </div>
      </section>
      {events.length ? (
        <div className="mx-3 mt-3 rounded-md bg-white p-3">
          <p className="mb-2 text-sm font-bold">Match events</p>
          <ul className="space-y-1.5 text-[12px] text-[#374151]">
            {events.map((event, index) => (
              <li key={`${event.elapsed}-${event.player}-${index}`}>
                <span className="font-semibold tabular-nums">
                  {event.elapsed != null ? `${event.elapsed}${event.extra ? `+${event.extra}` : ""}'` : ""}
                </span>{" "}
                {event.team} · {event.player || event.detail} · {event.type}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2">
        {availableTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
              tab === item.id ? "bg-brand text-white" : "bg-[#f3f4f6] text-[#4b5563]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {market ? (
        <div className="m-3 rounded-md bg-white p-3">
          <p className="mb-2 text-sm font-bold">
            {market.name}
            {market.line ? ` (${market.line})` : ""}
          </p>
          <div className={cn("grid gap-2", market.outcomes.length > 3 ? "grid-cols-2" : "grid-cols-3")}>
            {market.outcomes.map((outcome) => (
              <OddsButton key={outcome.id} match={match} marketName={market.name} outcome={outcome} />
            ))}
          </div>
        </div>
      ) : (
        <p className="p-6 text-sm text-muted">No open markets on this match.</p>
      )}
    </div>
  );
}

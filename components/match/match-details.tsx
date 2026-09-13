"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Star } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { OddsButton } from "@/components/betting/odds-button";
import { TeamBadge } from "@/components/betting/team-badge";
import { MARKET_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers";

export function MatchDetails({ match, favorited }: { match: ClientMatch; favorited: boolean }) {
  const [tab, setTab] = useState(match.markets[0]?.type ?? "1X2");
  const [saved, setSaved] = useState(favorited);
  const { user } = useAuth();
  const router = useRouter();
  const live = match.status === "LIVE" || match.status === "HT";
  const market = match.markets.find((m) => m.type === tab) ?? match.markets[0];

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

  return (
    <div className="pb-6">
      <header className="flex items-center gap-3 bg-brand px-3 py-3 text-white">
        <Link href="/sports" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{match.league.name}</p>
          <p className="text-[11px] text-white/70">
            {live ? `Live ${match.clock}` : format(new Date(match.startTime), "EEE dd MMM, HH:mm")}
          </p>
        </div>
        <button type="button" onClick={toggleFav} aria-label="Favourite" className="p-1">
          <Star className={cn("h-5 w-5", saved && "fill-white")} />
        </button>
        <Link href="/notifications" aria-label="Notifications" className="p-1">
          <Bell className="h-5 w-5" />
        </Link>
      </header>
      <section className="bg-white px-4 py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamBadge team={match.home} size="lg" />
            <p className="text-sm font-bold">{match.home.name}</p>
          </div>
          <div className="text-center">
            {live ? (
              <p className="text-3xl font-black tabular-nums text-brand">
                {match.homeScore} - {match.awayScore}
              </p>
            ) : (
              <p className="text-xl font-black text-[#9aa3b2]">VS</p>
            )}
            <p className="mt-1 text-xs font-semibold uppercase text-muted">{match.status}</p>
            {match.isDemo ? <p className="mt-1 text-[10px] font-bold text-[#8a6d00]">DEMO MATCH</p> : null}
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <TeamBadge team={match.away} size="lg" />
            <p className="text-sm font-bold">{match.away.name}</p>
          </div>
        </div>
      </section>
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2">
        {MARKET_TABS.filter((t) => match.markets.some((m) => m.type === t.id)).map((item) => (
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
        <div className="m-3 rounded-xl bg-white p-3">
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

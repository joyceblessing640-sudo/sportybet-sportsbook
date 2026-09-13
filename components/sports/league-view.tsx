"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MatchRow } from "@/components/betting/match-card";
import { MARKET_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

export function LeagueView({
  league,
  matches,
}: {
  league: { name: string; country: string; sport: string };
  matches: ClientMatch[];
}) {
  const [market, setMarket] = useState("1X2");
  const grouped = useMemo(() => {
    const map = new Map<string, ClientMatch[]>();
    for (const match of matches) {
      const day = new Date(match.startTime).toDateString();
      map.set(day, [...(map.get(day) ?? []), match]);
    }
    return [...map.entries()];
  }, [matches]);

  return (
    <div className="pb-6">
      <div className="flex items-center gap-3 bg-brand px-3 py-3 text-white">
        <Link href="/sports" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-sm font-bold">{league.name}</p>
          <p className="text-[11px] text-white/70">
            {league.country} · {league.sport} · DEMO fixtures
          </p>
        </div>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2">
        {MARKET_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMarket(item.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
              market === item.id ? "bg-brand text-white" : "bg-[#f3f4f6] text-[#4b5563]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="space-y-3 p-3">
        {grouped.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-muted">No upcoming demo matches in this league.</div>
        ) : (
          grouped.map(([day, list]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6b7280]">{day}</h2>
              <div className="overflow-hidden rounded-xl bg-white">
            {list.map((match) => (
              <MatchRow key={match.id} match={match} marketType={market} compactOdds />
            ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

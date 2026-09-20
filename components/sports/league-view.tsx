"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MatchRow } from "@/components/betting/match-card";
import { MARKET_TABS } from "@/lib/constants";
import { formatFixtureDay } from "@/lib/football/time";
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
      const day = formatFixtureDay(match.startTime);
      map.set(day, [...(map.get(day) ?? []), match]);
    }
    return [...map.entries()];
  }, [matches]);

  return (
    <div className="pb-6">
      <div className="flex items-center gap-2 bg-header px-2.5 py-2 text-white min-[412px]:px-3">
        <Link href="/sports" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-[13px] font-bold">{league.name}</p>
          <p className="text-[10px] text-white/70">
            {league.country} · {league.sport}
          </p>
        </div>
      </div>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto bg-white px-2.5 py-1.5 min-[412px]:px-3">
        {MARKET_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMarket(item.id)}
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              market === item.id ? "bg-brand text-white" : "bg-[#f3f4f6] text-[#4b5563]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="space-y-2 p-2.5 min-[412px]:p-3">
        {grouped.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-muted">No matches available</div>
        ) : (
          grouped.map(([day, list]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6b7280]">{day}</h2>
              <div className="overflow-hidden rounded-md border border-line bg-white">
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

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MatchRow } from "@/components/betting/match-card";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

export function LiveView({ matches }: { matches: ClientMatch[] }) {
  const [sport, setSport] = useState("live");
  const [market, setMarket] = useState("1X2");
  const visible = useMemo(() => {
    if (sport === "live") return matches;
    if (sport === "vfootball") return [];
    const id = sport === "efootball" ? "esports" : sport;
    return matches.filter((m) => m.sport.id === id);
  }, [matches, sport]);

  return (
    <div className="bg-live text-white">
      <div className="flex items-center gap-1 px-3 py-2">
        <span className="live-dot" />
        <h1 className="text-[13px] font-bold">Live betting</h1>
        <span className="ml-auto text-[11px] text-white/55">{matches.length} events</span>
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 text-[12px] font-semibold">
        {LIVE_SPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSport(tab.id)}
            className={cn("shrink-0 pb-1.5", sport === tab.id ? "border-b-2 border-brand text-white" : "text-white/50")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 pt-2 text-[11px]">
        {LIST_MARKET_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMarket(item.id)}
            className={cn("shrink-0 pb-1.5", market === item.id ? "border-b-2 border-brand text-white" : "text-white/45")}
          >
            {item.label}
          </button>
        ))}
      </div>
      {sport === "vfootball" ? (
        <p className="px-3 py-8 text-[13px] text-white/55">
          Virtual football is not connected.{" "}
          <Link href="/virtuals" className="font-semibold text-[#8dffb8]">
            Open Virtuals
          </Link>
        </p>
      ) : visible.length === 0 ? (
        <p className="px-3 py-8 text-[13px] text-white/55">No live demo events in this sport.</p>
      ) : (
        visible.map((match) => <MatchRow key={match.id} match={match} marketType={market} compactOdds onDark />)
      )}
    </div>
  );
}

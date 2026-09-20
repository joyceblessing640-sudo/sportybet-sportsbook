"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MatchRow } from "@/components/betting/match-card";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

export function LiveBoard({
  matches,
  limit,
  homeLayout = false,
}: {
  matches: ClientMatch[];
  limit?: number;
  homeLayout?: boolean;
}) {
  const [sport, setSport] = useState(homeLayout ? "football" : "live");
  const [market, setMarket] = useState("1X2");
  const visible = useMemo(() => {
    if (sport === "live") return matches;
    if (sport === "vfootball") return [];
    const id = sport === "efootball" ? "esports" : sport;
    return matches.filter((m) => m.sport.id === id);
  }, [matches, sport]);
  const rows = limit ? visible.slice(0, limit) : visible;
  const headers =
    market === "OU" || market === "FHOU"
      ? ["Over", "Under"]
      : market === "DC"
        ? ["1X", "12", "X2"]
        : ["1", "X", "2"];
  const sportTabs = homeLayout ? LIVE_SPORT_TABS.filter((tab) => tab.id !== "live") : LIVE_SPORT_TABS;

  return (
    <section className="bg-live text-white">
      <div className="flex items-end gap-2 px-3 pt-2">
        {homeLayout ? (
          <>
            <p className="shrink-0 pb-1.5 text-[16px] font-bold leading-none">Live</p>
            <span className="mb-[7px] shrink-0 text-white/35">|</span>
          </>
        ) : null}
        <div className="no-scrollbar flex min-w-0 flex-1 gap-3 overflow-x-auto text-[13px] font-semibold">
          {sportTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSport(tab.id)}
              className={cn(
                "shrink-0 pb-1.5 transition-colors duration-150",
                sport === tab.id ? "border-b-2 border-accent text-white" : "text-white/45",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2 px-3">
        <div className="no-scrollbar flex min-w-0 flex-1 gap-3 overflow-x-auto pt-2 text-[12px]">
          {LIST_MARKET_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMarket(item.id)}
              className={cn(
                "shrink-0 pb-1.5 transition-colors duration-150",
                market === item.id ? "border-b-2 border-accent text-white" : "text-white/40",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {homeLayout ? (
          <div className="mb-1.5 flex shrink-0 items-center">
            <span className="mr-2 h-4 w-px bg-white/20" />
            <div className="flex items-center rounded-full bg-[#3a3f46] px-1 py-0.5">
              {["1up", "2up"].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setMarket("AH")}
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-semibold",
                    market === "AH" ? "text-white" : "text-white/80",
                  )}
                >
                  {label}
                  {i === 0 ? <span className="ml-1.5 inline-block h-1 w-1 rounded-full bg-white/85 align-middle" /> : null}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-1.5 flex shrink-0 gap-1">
            {["1up", "2up"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setMarket("AH")}
                className={cn(
                  "rounded-[3px] border px-1.5 py-0.5 text-[10px] font-semibold",
                  market === "AH" ? "border-accent bg-accent/15 text-accent" : "border-accent/80 text-accent",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center px-3 py-1 text-[11px] text-white/45">
        <span className="min-w-0 flex-1" />
        <div className={cn("grid text-center", headers.length === 2 ? "w-[6.5rem] grid-cols-2" : "w-[9.75rem] grid-cols-3")}>
          {headers.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>
      {sport === "vfootball" ? (
        <p className="px-3 py-6 text-[13px] text-white/55">
          Virtual football is not connected.{" "}
          <Link href="/virtuals" className="font-semibold text-accent">
            Open Virtuals
          </Link>
        </p>
      ) : rows.length === 0 ? (
        <p className="px-3 py-6 text-[13px] text-white/55">No live demo events right now.</p>
      ) : (
        rows.map((match) => <MatchRow key={match.id} match={match} marketType={market} compactOdds onDark />)
      )}
    </section>
  );
}

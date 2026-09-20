"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MatchList } from "@/components/betting/match-card";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

const HOME_SPORT_TABS = LIVE_SPORT_TABS.filter((tab) => tab.id !== "live");
const HOME_MARKETS = [...LIST_MARKET_TABS, { id: "AH", label: "Handicap" }];

export function HomeSportsBoard({ matches }: { matches: ClientMatch[] }) {
  const [sport, setSport] = useState("football");
  const [topTab, setTopTab] = useState<"highlights" | "today" | "countries">("highlights");
  const [market, setMarket] = useState("1X2");

  const visible = useMemo(() => {
    return matches.filter((match) => {
      if (sport === "vfootball") return false;
      const id = sport === "efootball" ? "esports" : sport;
      if (match.sport.id !== id) return false;
      if (topTab === "highlights") return match.isFeatured || match.isHot || match.isBestOdds;
      return true;
    });
  }, [matches, sport, topTab]);

  const leagues = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; country: string; sportId: string }>();
    for (const match of matches) {
      map.set(match.league.slug, {
        name: match.league.name,
        slug: match.league.slug,
        country: match.league.country,
        sportId: match.sport.id,
      });
    }
    return [...map.values()];
  }, [matches]);

  return (
    <section className="mt-0 bg-white">
      <div className="flex items-end gap-2 border-b border-line px-3 pt-2">
        <p className="shrink-0 pb-1.5 text-[16px] font-bold leading-none text-ink">Sports</p>
        <span className="mb-[7px] shrink-0 text-[#d1d5db]">|</span>
        <div className="no-scrollbar flex min-w-0 flex-1 gap-3 overflow-x-auto text-[13px] font-semibold">
          {HOME_SPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSport(tab.id)}
              className={cn(
                "shrink-0 pb-1.5 transition-colors duration-150",
                sport === tab.id ? "border-b-2 border-accent text-accent" : "text-[#6b7280]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 border-b border-line text-center text-[13px] font-semibold">
        {(["highlights", "today", "countries"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTopTab(id)}
            className={cn(
              "py-2.5 capitalize",
              topTab === id ? "border-b-2 border-accent text-accent" : "text-[#6b7280]",
            )}
          >
            {id}
          </button>
        ))}
      </div>
      {topTab === "countries" ? (
        <div className="bg-white">
          {leagues.map((league) => (
            <Link
              key={league.slug}
              href={`/sports/${league.sportId}/${league.slug}`}
              className="block border-b border-line px-3 py-3 text-[13px] text-[#374151]"
            >
              {league.country} - {league.name}
            </Link>
          ))}
        </div>
      ) : (
        <>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 pt-2 text-[12px] font-semibold">
            {HOME_MARKETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMarket(item.id)}
                className={cn(
                  "shrink-0 pb-1.5 transition-colors duration-150",
                  market === item.id ? "border-b-2 border-accent text-accent" : "text-[#6b7280]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {sport === "vfootball" ? (
            <p className="px-3 py-6 text-sm text-muted">
              Virtual football is a placeholder. Open{" "}
              <Link href="/virtuals" className="font-semibold text-accent">
                Virtuals
              </Link>
              .
            </p>
          ) : visible.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted">No matches available</p>
          ) : (
            <div className="[&>div]:rounded-none [&>div]:border-x-0 [&>div]:border-t-0">
              <MatchList matches={visible.slice(0, 12)} marketType={market} showBadges />
            </div>
          )}
        </>
      )}
    </section>
  );
}

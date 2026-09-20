"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MatchList } from "@/components/betting/match-card";
import { Input } from "@/components/ui/input";
import type { ClientMatch } from "@/lib/serialize";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type League = { id: string; name: string; slug: string; sportId: string; country: string };
type Sport = { id: string; name: string; slug: string };

export function SportsView({
  sports,
  leagues,
  matches,
  initialSport,
}: {
  sports: Sport[];
  leagues: League[];
  matches: ClientMatch[];
  initialSport?: string;
}) {
  const [query, setQuery] = useState("");
  const [sportId, setSportId] = useState(initialSport ?? "football");
  const [leagueSlug, setLeagueSlug] = useState<string | "all">("all");
  const [market, setMarket] = useState("1X2");
  const [topTab, setTopTab] = useState<"highlights" | "today" | "countries">("today");
  const [sportTab, setSportTab] = useState(initialSport ?? "football");
  const [limit, setLimit] = useState(24);

  const filteredLeagues = leagues.filter((l) => l.sportId === sportId);
  const visible = useMemo(() => {
    return matches.filter((m) => {
      if (topTab === "highlights" && !m.isFeatured && m.status !== "LIVE" && m.status !== "HT") return false;
      const sportFilter = sportTab === "live" ? true : sportTab === "vfootball" ? false : m.sport.id === sportTab;
      if (sportTab === "live") {
        if (m.status !== "LIVE" && m.status !== "HT") return false;
      } else if (!sportFilter && sportTab !== "vfootball") {
        return false;
      }
      if (leagueSlug !== "all" && m.league.slug !== leagueSlug) return false;
      if (query) {
        const hay = `${m.home.name} ${m.away.name} ${m.league.name} ${m.displayId}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [matches, sportTab, leagueSlug, query, topTab]);

  const grouped = useMemo(() => {
    const map = new Map<string, ClientMatch[]>();
    for (const match of visible.slice(0, limit)) {
      const day = format(new Date(match.startTime), "dd/MM eeee");
      map.set(day, [...(map.get(day) ?? []), match]);
    }
    return [...map.entries()];
  }, [visible, limit]);

  const liveCount = matches.filter((m) => m.status === "LIVE" || m.status === "HT").length;

  return (
    <div>
      <div className="bg-header px-3 pb-2 pt-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa3b2]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Teams / Players, Leagues, Game ID"
            className="h-10 pl-9"
          />
        </div>
        <div className="mt-3 grid grid-cols-5 text-center text-[11px] font-medium text-white/90">
          <Link href="/load-code">Load Code</Link>
          <Link href="/virtuals">Virtuals</Link>
          <Link href="/games">Jackpot</Link>
          <Link href="/live">Livescore</Link>
          <Link href="/sports">Results</Link>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto bg-white px-4 pt-3 text-sm font-semibold">
        {LIVE_SPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setSportTab(tab.id === "efootball" ? "esports" : tab.id);
              setLeagueSlug("all");
            }}
            className={cn(
              "shrink-0",
              (sportTab === tab.id || (tab.id === "efootball" && sportTab === "esports"))
                ? "text-odds"
                : tab.id === "live"
                  ? "text-ink"
                  : "text-[#6b7280]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 border-b border-[#eceff3] bg-white text-center text-sm font-semibold">
        {(["highlights", "today", "countries"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTopTab(id)}
            className={cn(
              "py-2.5 capitalize",
              topTab === id ? "border-b-2 border-odds text-odds" : "text-[#6b7280]",
            )}
          >
            {id}
          </button>
        ))}
      </div>

      {topTab === "countries" ? (
        <div className="grid min-h-[50dvh] grid-cols-[38%_1fr] bg-white md:grid-cols-[200px_1fr]">
          <div className="border-r border-[#eceff3]">
            {sports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => {
                  setSportId(sport.id);
                  setSportTab(sport.id);
                  setLeagueSlug("all");
                }}
                className={cn(
                  "block w-full px-3 py-3 text-left text-sm",
                  sportId === sport.id ? "font-semibold text-odds" : "text-[#374151]",
                )}
              >
                {sport.name}
              </button>
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={() => setLeagueSlug("all")}
              className={cn(
                "block w-full px-3 py-3 text-left text-sm",
                leagueSlug === "all" ? "font-semibold text-ink" : "text-[#4b5563]",
              )}
            >
              {sportId === "football" ? "Today's Football" : `All ${sports.find((s) => s.id === sportId)?.name}`}
            </button>
            {filteredLeagues.map((league) => (
              <Link
                key={league.id}
                href={`/sports/${league.sportId}/${league.slug}`}
                className="block px-3 py-3 text-sm text-[#4b5563]"
              >
                {league.country === "England" && league.slug === "premier-league"
                  ? "England Premier League"
                  : `${league.country} - ${league.name}`}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="no-scrollbar flex gap-3 overflow-x-auto bg-white px-3 py-2">
            {LIST_MARKET_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMarket(item.id)}
                className={cn(
                  "shrink-0 pb-1 text-xs font-semibold",
                  market === item.id ? "border-b-2 border-odds text-odds" : "text-[#6b7280]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {sportTab === "vfootball" ? (
            <p className="m-3 rounded-xl bg-white p-6 text-sm text-muted">
              Virtual football is a placeholder. Open <Link href="/virtuals" className="font-semibold text-brand">Virtuals</Link>{" "}
              when a licensed feed is connected.
            </p>
          ) : grouped.length === 0 ? (
            <div className="m-3 rounded-xl bg-white p-8 text-center text-sm text-muted">No demo matches match this filter.</div>
          ) : (
            grouped.map(([day, list]) => (
              <div key={day} className="mb-2 px-3">
                <MatchList matches={list} marketType={market} dateLabel={day} groupLeagues />
              </div>
            ))
          )}
          {visible.length > limit ? (
            <div className="px-3 pb-3">
              <button
                type="button"
                onClick={() => setLimit((n) => n + 24)}
                className="h-9 w-full rounded-md border border-line bg-white text-[12px] font-semibold text-brand"
              >
                Load more matches
              </button>
            </div>
          ) : null}
        </>
      )}
      <p className="px-4 py-3 text-xs text-muted">Live events in this demo: {liveCount}. Search also accepts Game ID.</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MatchRow } from "@/components/betting/match-card";
import { Input } from "@/components/ui/input";
import type { ClientMatch } from "@/lib/serialize";
import { MARKET_TABS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
  const [tab, setTab] = useState<"sports" | "live" | "promos">("sports");

  const filteredLeagues = leagues.filter((l) => l.sportId === sportId);
  const visible = useMemo(() => {
    return matches.filter((m) => {
      if (tab === "live" && m.status !== "LIVE" && m.status !== "HT") return false;
      if (m.sport.id !== sportId && sportId) return false;
      if (leagueSlug !== "all" && m.league.slug !== leagueSlug) return false;
      if (query) {
        const hay = `${m.home.name} ${m.away.name} ${m.league.name}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [matches, sportId, leagueSlug, query, tab]);

  const grouped = useMemo(() => {
    const map = new Map<string, ClientMatch[]>();
    for (const match of visible) {
      const day = new Date(match.startTime).toDateString();
      map.set(day, [...(map.get(day) ?? []), match]);
    }
    return [...map.entries()];
  }, [visible]);

  return (
    <div>
      <div className="bg-brand px-3 pb-3 pt-2">
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
          <Link href="/bets">Load Code</Link>
          <Link href="/virtuals">Virtuals</Link>
          <Link href="/games">Jackpot</Link>
          <Link href="/live">Livescore</Link>
          <Link href="/sports">Results</Link>
        </div>
      </div>
      <div className="flex gap-4 border-b border-[#eceff3] bg-white px-4 text-sm font-semibold">
        {[
          { id: "sports", label: "Sports" },
          { id: "live", label: `Live (${matches.filter((m) => m.status === "LIVE" || m.status === "HT").length})` },
          { id: "promos", label: "Promotions" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as typeof tab)}
            className={cn(
              "py-3",
              tab === item.id ? "border-b-2 border-odds text-odds" : "text-[#6b7280]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "promos" ? (
        <div className="p-4 text-sm text-muted">
          Open the <Link href="/promotions" className="font-semibold text-brand">promotions</Link> page for current demo offers.
        </div>
      ) : (
        <div className="grid min-h-[70dvh] grid-cols-[38%_1fr] bg-white md:grid-cols-[200px_1fr]">
          <div className="border-r border-[#eceff3]">
            {sports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={() => {
                  setSportId(sport.id);
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
                  : league.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {tab !== "promos" ? (
        <div className="mt-3">
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-3">
            {MARKET_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMarket(item.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
                  market === item.id ? "bg-brand text-white" : "bg-white text-[#4b5563]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-3 px-3 pb-4">
            {grouped.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-sm text-muted">
                No demo matches match this filter.
              </div>
            ) : (
              grouped.map(([day, list]) => (
                <section key={day}>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6b7280]">{day}</h2>
                  <div className="overflow-hidden rounded-xl bg-white">
                    {list.map((match) => (
                      <MatchRow key={match.id} match={match} marketType={market} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

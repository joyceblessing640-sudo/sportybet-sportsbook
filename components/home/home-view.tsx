"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CircleDot,
  Gamepad2,
  Plane,
  Radio,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { FeaturedMatchCard, MatchList, MatchRow } from "@/components/betting/match-card";
import { RecommendedCodes } from "@/components/bets/recommended-codes";
import { CRASH_GAMES, HOME_TILES } from "@/lib/games";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const QUICK = [
  { href: "/sports", label: "All Sports", icon: Trophy },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/games/sky-rise", label: "Sky Rise", icon: Plane },
  { href: "/load-code", label: "Load Code", icon: Search },
  { href: "/virtuals", label: "Virtuals", icon: Sparkles },
  { href: "/sports", label: "More", icon: CircleDot },
];

const SPORT_CARDS = [
  { href: "/sports/football", label: "Football", icon: Trophy },
  { href: "/sports/basketball", label: "Basketball", icon: CircleDot },
  { href: "/sports/tennis", label: "Tennis", icon: CircleDot },
  { href: "/sports/ice-hockey", label: "Ice Hockey", icon: CircleDot },
  { href: "/sports/baseball", label: "Baseball", icon: CircleDot },
  { href: "/sports/volleyball", label: "Volleyball", icon: CircleDot },
  { href: "/sports/esports", label: "Esports", icon: Gamepad2 },
  { href: "/sports", label: "More", icon: Sparkles },
];

export function HomeView({
  featured,
  live,
  today,
  upcoming,
}: {
  featured: ClientMatch[];
  live: ClientMatch[];
  today: ClientMatch[];
  upcoming: ClientMatch[];
  promotions: { id: string; title: string; subtitle: string; href: string; theme: string }[];
}) {
  const [homeTab, setHomeTab] = useState<"featured" | "matches" | "games" | "codes" | "virtuals">("games");
  const [chip, setChip] = useState<"today" | "soon" | "epl">("today");
  const [liveMarket, setLiveMarket] = useState("1X2");
  const [liveSport, setLiveSport] = useState("football");

  const chipMatches = useMemo(() => {
    if (chip === "soon") return upcoming;
    if (chip === "epl") return today.filter((m) => m.league.slug === "premier-league");
    return today;
  }, [chip, today, upcoming]);

  const liveFiltered = useMemo(() => {
    if (liveSport === "live") return live;
    return live.filter((m) => m.sport.id === liveSport || (liveSport === "efootball" && m.sport.id === "esports"));
  }, [live, liveSport]);

  return (
    <div className="pb-4">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#ed1c24] via-[#d41420] to-[#191c24] px-4 py-8 text-white sm:block">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">SPORTBET · Bet smart. Win big.</p>
        <h1 className="mt-2 max-w-xl text-3xl font-black leading-tight sm:text-4xl">BET ON YOUR FAVOURITE SPORTS</h1>
        <p className="mt-2 text-sm text-white/80">Big Odds · Fast Payouts · Secure & Trusted</p>
        <Link href="/sports/football" className="mt-4 inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-black text-brand">
          BET NOW
        </Link>
      </section>

      <div className="no-scrollbar flex gap-3 overflow-x-auto bg-white px-3 py-3">
        {HOME_TILES.map((tile) => (
          <Link key={tile.label} href={tile.href} className="w-[72px] shrink-0 text-center">
            <span
              className={cn(
                "mx-auto grid h-[72px] w-[72px] place-items-center rounded-2xl bg-gradient-to-br text-[11px] font-black text-white shadow-sm",
                tile.tone,
              )}
            >
              {tile.kicker}
            </span>
            <span className="mt-1.5 block text-[11px] font-medium leading-tight text-[#374151]">{tile.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1 bg-white px-2 pb-2">
        {QUICK.map((item) => (
          <Link key={item.label} href={item.href} className="flex min-w-0 flex-col items-center gap-1 py-2 text-[11px] text-[#4b5563]">
            <item.icon className={cn("h-5 w-5", item.label === "Sky Rise" ? "text-brand" : "text-[#6b7280]")} />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 pb-3">
        {[
          { id: "today", label: "Today's Football" },
          { id: "soon", label: "Football in next 3 hours" },
          { id: "epl", label: "England Premier League" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setChip(item.id as typeof chip)}
            className={cn(
              "shrink-0 rounded-md border px-3 py-2 text-[11px] font-bold uppercase tracking-wide",
              chip === item.id ? "border-[#12a150] bg-white text-ink" : "border-[#e5e7eb] bg-white text-[#6b7280]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto border-b border-[#eceff3] bg-white px-4 text-sm font-semibold">
        {(["featured", "matches", "games", "codes", "virtuals"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setHomeTab(tab)}
            className={cn(
              "capitalize py-2.5",
              homeTab === tab ? "border-b-2 border-[#12a150] text-[#12a150]" : "text-[#6b7280]",
            )}
          >
            {tab === "featured" ? "Featured" : tab}
          </button>
        ))}
      </div>

      {homeTab === "featured" ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto bg-[#f4f5f7] px-3 py-3">
          {featured.map((match) => (
            <FeaturedMatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : null}
      {homeTab === "matches" ? (
        <MatchList
          matches={chipMatches}
          marketType="1X2"
          dateLabel={format(new Date(), "dd/MM eeee")}
        />
      ) : null}
      {homeTab === "games" ? (
        <div className="bg-white px-3 py-3">
          <div className="mb-3 flex gap-2 overflow-x-auto text-[#9aa3b2]">
            <span className="flex items-center gap-1 rounded-full bg-[#fff1f2] px-2 py-1 text-xs font-semibold text-brand">
              Crash
            </span>
            <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-xs">Arcade</span>
            <span className="rounded-full bg-[#f3f4f6] px-2 py-1 text-xs">Table</span>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto">
            {CRASH_GAMES.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className={cn(
                  "relative h-[148px] w-[168px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br p-3 text-white shadow-sm",
                  game.art,
                )}
              >
                <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[10px]">
                  {game.players} players
                </span>
                <p className="mt-14 text-lg font-black leading-tight">{game.name}</p>
                <p className="text-[11px] text-white/70">{game.tag} · Demo</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {homeTab === "codes" ? <RecommendedCodes matches={featured} /> : null}
      {homeTab === "virtuals" ? (
        <p className="m-3 rounded-xl bg-white p-4 text-sm text-muted">
          Virtual football cycles are not connected.{" "}
          <Link href="/virtuals" className="font-semibold text-brand">
            Open Virtuals
          </Link>
        </p>
      ) : null}

      <div className="px-3 pt-3">
        <p className="mb-2 text-sm font-bold text-ink">Sports</p>
        <div className="grid grid-cols-4 gap-2">
          {SPORT_CARDS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center text-xs font-semibold text-ink shadow-sm"
            >
              <item.icon className="h-5 w-5 text-brand" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="mt-4 bg-live text-white">
        <div className="flex items-center gap-4 overflow-x-auto px-4 py-3 text-sm font-semibold">
          {LIVE_SPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLiveSport(tab.id === "vfootball" ? "vfootball" : tab.id === "efootball" ? "esports" : tab.id)}
              className={cn(liveSport === (tab.id === "efootball" ? "esports" : tab.id) ? "text-odds" : "text-white/55")}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 text-xs">
          {LIST_MARKET_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLiveMarket(item.id)}
              className={cn("shrink-0 pb-2", liveMarket === item.id ? "border-b-2 border-odds font-bold text-white" : "text-white/55")}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-xs">
          <span className="text-white/40">+{live.length}</span>
          <Link href="/live" className="font-semibold text-odds">
            All Live Events {live.length} ›
          </Link>
        </div>
        {liveFiltered.length === 0 ? (
          <p className="px-4 py-8 text-sm text-white/60">No live demo matches in this sport.</p>
        ) : (
          liveFiltered.map((match) => (
            <MatchRow key={match.id} match={match} marketType={liveMarket} compactOdds onDark />
          ))
        )}
      </section>
    </div>
  );
}

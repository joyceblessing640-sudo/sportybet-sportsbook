"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CircleDot,
  Gamepad2,
  Radio,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { FeaturedMatchCard, MatchRow } from "@/components/betting/match-card";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

const QUICK = [
  { href: "/sports", label: "All Sports", icon: Trophy },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/virtuals", label: "Virtuals", icon: Sparkles },
  { href: "/sports?tab=codes", label: "Load Code", icon: Search },
  { href: "/games", label: "Jackpot", icon: Gamepad2 },
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
  promotions,
}: {
  featured: ClientMatch[];
  live: ClientMatch[];
  today: ClientMatch[];
  upcoming: ClientMatch[];
  promotions: { id: string; title: string; subtitle: string; href: string; theme: string }[];
}) {
  const [homeTab, setHomeTab] = useState<"featured" | "matches" | "games" | "codes">("featured");
  const [chip, setChip] = useState<"today" | "soon" | "epl">("today");
  const [liveMarket, setLiveMarket] = useState("1X2");

  const chipMatches = useMemo(() => {
    if (chip === "soon") return upcoming;
    if (chip === "epl") return today.filter((m) => m.league.slug === "premier-league");
    return today;
  }, [chip, today, upcoming]);

  return (
    <div className="pb-4">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ed1c24] via-[#d41420] to-[#191c24] px-4 py-8 text-white">
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/10" />
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">SPORTBET · Bet smart. Win big.</p>
        <h1 className="mt-2 max-w-xl text-3xl font-black leading-tight sm:text-4xl">BET ON YOUR FAVOURITE SPORTS</h1>
        <p className="mt-2 text-sm text-white/80">Big Odds · Fast Payouts · Secure & Trusted</p>
        <Link href="/sports/football" className="mt-4 inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-black text-brand">
          BET NOW
        </Link>
      </section>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3">
        {promotions.map((promo) => (
          <Link
            key={promo.id}
            href={promo.href}
            className={cn(
              "relative min-w-[168px] overflow-hidden rounded-xl p-3 text-white shadow-sm",
              promo.theme === "welcome" && "bg-gradient-to-br from-[#1d4ed8] to-[#0f172a]",
              promo.theme === "boost" && "bg-gradient-to-br from-[#ed1c24] to-[#7f1d1d]",
              promo.theme === "promo" && "bg-gradient-to-br from-[#0f766e] to-[#134e4a]",
            )}
          >
            <p className="text-[10px] uppercase tracking-wide text-white/70">{promo.subtitle}</p>
            <p className="mt-1 text-sm font-black">{promo.title}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2 px-3 py-1 sm:flex sm:grid-cols-none">
        {QUICK.map((item) => (
          <Link key={item.label} href={item.href} className="flex min-w-0 flex-col items-center gap-1 py-2 text-[11px] text-[#4b5563]">
            <item.icon className="h-5 w-5 text-[#6b7280]" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2">
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
              "shrink-0 rounded-md border px-3 py-2 text-xs font-semibold",
              chip === item.id ? "border-brand bg-white text-brand" : "border-[#e5e7eb] bg-white text-[#4b5563]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 py-2 text-sm font-semibold">
        {(["featured", "matches", "games", "codes"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setHomeTab(tab)}
            className={cn(
              "capitalize",
              homeTab === tab ? "text-odds" : "text-[#6b7280]",
              tab === "featured" && homeTab === "featured" && "text-ink",
            )}
          >
            {tab === "featured" ? "Featured" : tab}
          </button>
        ))}
      </div>

      {homeTab === "featured" ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 pb-3">
          {featured.map((match) => (
            <FeaturedMatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : null}
      {homeTab === "matches" ? (
        <div className="mx-3 overflow-hidden rounded-xl bg-white">
          {chipMatches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      ) : null}
      {homeTab === "games" ? (
        <div className="px-3">
          <p className="rounded-xl bg-white p-4 text-sm text-muted">
            Casino games are demo placeholders until a licensed studio is connected.{" "}
            <Link href="/games" className="font-semibold text-brand">
              Open Games
            </Link>
          </p>
        </div>
      ) : null}
      {homeTab === "codes" ? (
        <div className="px-3">
          <p className="rounded-xl bg-white p-4 text-sm text-muted">
            Booking codes let you load a shared multi. Browse recommended slips on{" "}
            <Link href="/bets" className="font-semibold text-brand">
              Open Bets
            </Link>
            .
          </p>
        </div>
      ) : null}

      <div className="px-3 pt-2">
        <p className="mb-2 text-sm font-bold text-ink">Sports</p>
        <div className="grid grid-cols-4 gap-2">
          {SPORT_CARDS.map((item) => (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center text-xs font-semibold text-ink shadow-sm">
              <item.icon className="h-5 w-5 text-brand" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="mt-4 bg-live text-white">
        <div className="flex items-center gap-4 overflow-x-auto px-4 py-3 text-sm font-semibold">
          <span className="text-odds">Live</span>
          <span>Football</span>
          <span className="text-white/50">Basketball</span>
          <span className="text-white/50">Tennis</span>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 text-xs">
          {["1X2", "OU", "DC", "FH"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLiveMarket(id)}
              className={cn("shrink-0 pb-2", liveMarket === id ? "border-b-2 border-white font-bold" : "text-white/60")}
            >
              {id === "OU" ? "Over/Under" : id === "DC" ? "Double Chance" : id === "FH" ? "1st Half" : "1X2"}
            </button>
          ))}
        </div>
        {live.length === 0 ? (
          <p className="px-4 py-8 text-sm text-white/60">No live demo matches at the moment.</p>
        ) : (
          live.map((match) => <MatchRow key={match.id} match={match} marketType={liveMarket} />)
        )}
      </section>
    </div>
  );
}

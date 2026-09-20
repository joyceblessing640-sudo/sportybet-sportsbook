"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FeaturedMatchCard, MatchList } from "@/components/betting/match-card";
import { CountryMark } from "@/components/brand/country-mark";
import { RecommendedCodes } from "@/components/bets/recommended-codes";
import {
  IconAllSports,
  IconCrash,
  IconLiveTv,
  IconLoadCode,
  IconMore,
  IconVirtuals,
} from "@/components/home/shortcut-icons";
import { LiveBoard } from "@/components/live/live-board";
import { CRASH_GAMES } from "@/lib/games";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

const PROMOS = [
  { href: "/games/lucky-numbers", title: "Lucky Numbers", art: "from-[#1e3a5f] via-[#7f1d1d] to-[#111827]", motif: "⚽" },
  { href: "/promotions", title: "Night Cup", art: "from-[#111827] via-[#7c2d12] to-[#1e1b4b]", motif: "🏆" },
  { href: "/games/jet-rush", title: "Jet Rush", art: "from-[#0f766e] via-[#155e75] to-[#111827]", motif: "✈" },
  { href: "/games", title: "Studio Games", art: "from-[#9d174d] via-[#7f1d1d] to-[#111827]", motif: "🎰" },
  { href: "/bets", title: "Quick Slip", art: "from-[#14532d] via-[#166534] to-[#111827]", motif: "●" },
];

const SHORTCUTS = [
  { href: "/sports", label: "All Sports", Icon: IconAllSports },
  { href: "/live", label: "Live", Icon: IconLiveTv },
  { href: "/games/sky-rise", label: "Crash", Icon: IconCrash },
  { href: "/load-code", label: "Load Code", Icon: IconLoadCode },
  { href: "/virtuals", label: "Virtuals", Icon: IconVirtuals },
  { href: "/sports", label: "More", Icon: IconMore },
];

const CONTENT_TABS = ["Matches", "Games", "Codes", "Virtuals"] as const;

export function HomeView({
  featured,
  live,
  today,
  upcoming,
  promotions,
  leagues,
}: {
  featured: ClientMatch[];
  live: ClientMatch[];
  today: ClientMatch[];
  upcoming: ClientMatch[];
  promotions: { id: string; title: string; subtitle: string; href: string; theme: string }[];
  leagues: { name: string; slug: string; country: string }[];
}) {
  void promotions;
  void upcoming;
  const [contentTab, setContentTab] = useState<(typeof CONTENT_TABS)[number]>("Matches");
  const footballToday = useMemo(() => today.filter((m) => m.sport.id === "football"), [today]);
  const featuredMatch = featured[0] ?? live[0] ?? footballToday[0];

  return (
    <div className="bg-[#f4f5f7]">
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2">
        {PROMOS.map((promo) => (
          <Link
            key={promo.title}
            href={promo.href}
            className={cn(
              "relative h-[90px] w-[104px] shrink-0 overflow-hidden rounded-lg bg-gradient-to-br",
              promo.art,
            )}
          >
            <span className="absolute -right-2 -top-3 text-[42px] opacity-40">{promo.motif}</span>
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[12px] font-bold leading-tight text-white">
              {promo.title}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-6 bg-white px-1 pb-2 pt-1">
        {SHORTCUTS.map((item) => {
          const Icon = item.Icon;
          return (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 text-[10px] text-[#374151]">
              <span className="grid h-8 w-8 place-items-center text-[#4b5563]">
                <Icon className="h-[22px] w-[22px]" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-[#f4f5f7] px-3 py-2">
        {[
          { href: "/sports/football", label: "TODAY'S FOOTBALL", border: "border-t-[#e31837]" },
          { href: "/sports", label: "FOOTBALL IN NEXT 3 HOURS", border: "border-t-[#d1d5db]" },
          { href: "/sports/football/premier-league", label: "ENGLAND PREMIER LEAGUE", border: "border-t-[#12a150]" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={cn(
              "h-[54px] w-[124px] shrink-0 rounded-md border border-[#eceff3] border-t-[3px] bg-white px-2 py-1.5 text-[11px] font-bold leading-tight text-ink shadow-[0_1px_3px_rgba(16,24,40,0.08)]",
              card.border,
            )}
          >
            {card.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto bg-white px-3 pt-2.5 text-[14px] font-semibold">
        <span className="shrink-0 text-[15px] font-black text-ink">Featured</span>
        <span className="h-4 w-px shrink-0 bg-[#d1d5db]" />
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setContentTab(tab)}
            className={cn(
              "shrink-0 pb-2 transition-colors duration-150",
              contentTab === tab ? "text-accent" : "text-[#6b7280]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {contentTab === "Matches" ? (
        <>
          <div className="no-scrollbar flex gap-3 overflow-x-auto bg-white px-3 py-2">
            {leagues.map((league) => (
              <Link
                key={league.slug}
                href={`/sports/football/${league.slug}`}
                className="flex shrink-0 flex-col items-center"
                title={league.name}
              >
                <CountryMark country={league.country} className="h-9 w-9 rounded-full text-[10px]" />
              </Link>
            ))}
          </div>
          {featuredMatch ? (
            <FeaturedMatchCard match={featuredMatch} />
          ) : footballToday.length ? (
            <MatchList matches={footballToday.slice(0, 8)} marketType="1X2" groupLeagues />
          ) : (
            <p className="bg-white px-3 py-6 text-sm text-muted">No featured demo matches.</p>
          )}
        </>
      ) : null}
      {contentTab === "Games" ? (
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-3">
          {CRASH_GAMES.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              className={cn(
                "relative h-[100px] w-[132px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br p-2.5 text-white",
                game.art,
              )}
            >
              <p className="mt-8 text-[13px] font-bold">{game.name}</p>
              <p className="text-[10px] text-white/70">{game.tag}</p>
            </Link>
          ))}
        </div>
      ) : null}
      {contentTab === "Codes" ? <RecommendedCodes matches={featured.length ? featured : footballToday} /> : null}
      {contentTab === "Virtuals" ? (
        <p className="bg-white px-3 py-6 text-sm text-muted">
          Virtuals are a placeholder. Open{" "}
          <Link href="/virtuals" className="font-semibold text-accent">
            Virtuals
          </Link>{" "}
          when a licensed feed is connected.
        </p>
      ) : null}

      <LiveBoard matches={live} limit={8} />
    </div>
  );
}

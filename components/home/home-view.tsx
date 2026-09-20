"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFootballSnapshot } from "@/components/football/use-football-snapshot";
import { RecommendedCodes } from "@/components/bets/recommended-codes";
import { HomeFeaturedMatch } from "@/components/home/featured-match-card";
import { HomeSportsBoard } from "@/components/home/home-sports";
import {
  IconAllSports,
  IconAviator,
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
  { href: "/sports/football/premier-league", title: "MCI vs SUN", src: "/home/mci-sun.jpg" },
  { href: "/sports/football/premier-league", title: "FUL vs MUN", src: "/home/ful-mun.jpg" },
  { href: "/games/lucky-numbers", title: "Lucky Numbers", src: "/home/lucky-numbers.jpg" },
  { href: "/sports/football/la-liga", title: "ATM vs RMA", src: "/home/atm-rma.jpg" },
  { href: "/games", title: "TaDa Halloween", src: "/home/tada-halloween.jpg" },
  { href: "/sports/basketball", title: "NBA Night", src: "/home/nba-night.jpg" },
];

const SHORTCUTS = [
  { href: "/sports", label: "All Sports", Icon: IconAllSports },
  { href: "/live", label: "Live", Icon: IconLiveTv },
  { href: "/games/sky-rise", label: "Aviator", Icon: IconAviator },
  { href: "/load-code", label: "Load Code", Icon: IconLoadCode },
  { href: "/virtuals", label: "Virtuals", Icon: IconVirtuals },
  { href: "/sports", label: "More", Icon: IconMore },
];

const CATEGORY_CARDS = [
  { href: "/sports/football", label: "TODAY'S FOOTBALL", border: "border-t-[#e31837]" },
  { href: "/sports", label: "FOOTBALL IN NEXT 3 HOURS", border: "border-t-[#6b2d8c]" },
  { href: "/sports/football/premier-league", label: "ENGLAND PREMIER LEAGUE", border: "border-t-[#12a150]" },
  { href: "/sports/basketball", label: "BASKETBALL", border: "border-t-[#111111]" },
];

const LEAGUE_PILLS = [
  { slug: "la-liga", name: "LaLiga", href: "/sports/football/la-liga", icon: "/home/laliga-mark.png", labeled: true },
  { slug: "premier-league", name: "Premier League", href: "/sports/football/premier-league", icon: "/home/league-pl.png" },
  { slug: "ligue-1", name: "Ligue 1", href: "/sports/football/ligue-1", icon: "/home/league-l1.png" },
  { slug: "football", name: "Football", href: "/sports/football", icon: "/home/league-portugal.png" },
  { slug: "ligue-1-alt", name: "Ligue 1", href: "/sports/football/ligue-1", icon: "/home/league-rooster.png" },
  { slug: "serie-a", name: "Serie A", href: "/sports/football/serie-a", icon: "/home/league-a.png" },
  { slug: "football-alt", name: "Football", href: "/sports/football", icon: "/home/league-player.png" },
];

const CONTENT_TABS = ["Matches", "Games", "Codes", "Virtuals"] as const;

export function HomeView({
  featured,
  live,
  today,
  upcoming,
  promotions,
  leagues,
  feedError = null,
}: {
  featured: ClientMatch[];
  live: ClientMatch[];
  today: ClientMatch[];
  upcoming: ClientMatch[];
  promotions: { id: string; title: string; subtitle: string; href: string; theme: string }[];
  leagues: { name: string; slug: string; country: string }[];
  feedError?: string | null;
}) {
  void promotions;
  void leagues;
  const [contentTab, setContentTab] = useState<(typeof CONTENT_TABS)[number]>("Matches");
  const feed = useFootballSnapshot({ featured, live, today, upcoming, error: feedError, scope: "home" });
  const footballToday = useMemo(
    () => feed.today.filter((m) => m.sport.id === "football"),
    [feed.today],
  );

  const featuredCards = useMemo(() => {
    const scheduled = feed.featured.filter((m) => m.status === "SCHEDULED");
    const first = scheduled[0] ?? feed.featured[0] ?? footballToday[0];
    if (!first) return [];
    const rest = scheduled.filter((m) => m.id !== first.id);
    return [first, ...rest].slice(0, 4);
  }, [feed.featured, footballToday]);

  const sportsMatches = useMemo(() => {
    const seen = new Set<string>();
    const list: ClientMatch[] = [];
    for (const match of [...feed.featured, ...feed.today, ...feed.upcoming]) {
      if (seen.has(match.id)) continue;
      seen.add(match.id);
      list.push(match);
    }
    return list;
  }, [feed.featured, feed.today, feed.upcoming]);

  return (
    <div className="bg-[#f4f5f7]">
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2">
        {PROMOS.map((promo) => (
          <Link
            key={promo.title}
            href={promo.href}
            className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[8px] min-[412px]:h-[66px] min-[412px]:w-[66px] min-[430px]:h-[68px] min-[430px]:w-[68px]"
          >
            <img
              src={promo.src}
              alt={promo.title}
              width={137}
              height={139}
              className="h-full w-full object-cover object-center"
            />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-6 bg-white px-1 pb-2 pt-0.5">
        {SHORTCUTS.map((item) => {
          const Icon = item.Icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-[3px] text-[10px] leading-tight text-[#4b5563]"
            >
              <span className="grid h-8 w-8 place-items-center text-[#374151]">
                <Icon className="h-[22px] w-[22px]" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-[#f4f5f7] px-3 py-2">
        {CATEGORY_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={cn(
              "h-[54px] w-[116px] shrink-0 rounded-md border border-[#eceff3] border-t-[3px] bg-white px-2 py-1.5 text-[11px] font-bold leading-tight text-[#2b3038] shadow-[0_1px_3px_rgba(16,24,40,0.08)] min-[412px]:w-[124px]",
              card.border,
            )}
          >
            {card.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto bg-white px-3 pt-2.5 text-[14px] font-semibold">
        <span className="shrink-0 text-[16px] font-black text-ink">Featured</span>
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
          <div className="no-scrollbar flex items-center gap-3 overflow-x-auto bg-white px-3 pb-3.5 pt-2">
            {LEAGUE_PILLS.map((league, index) => {
              const selected = index === 0;
              return (
                <Link
                  key={league.slug}
                  href={league.href}
                  title={league.name}
                  className={cn(
                    "relative flex shrink-0 items-center justify-center border-[1.5px] border-[#d4d8de] bg-white",
                    selected ? "h-9 gap-1.5 rounded-full px-3" : "h-9 w-[56px] rounded-full",
                  )}
                >
                  <img
                    src={league.icon}
                    alt=""
                    width={selected ? 18 : 24}
                    height={selected ? 18 : 24}
                    className={cn("object-contain object-center", selected ? "h-[18px] w-[18px]" : "h-6 w-6")}
                  />
                  {selected ? (
                    <>
                      <span className="text-[13px] font-semibold leading-none text-ink">{league.name}</span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-[calc(100%-6px)] z-[1] h-3 w-3 -translate-x-1/2 rotate-45 border-b-[1.5px] border-r-[1.5px] border-[#d4d8de] bg-white"
                      />
                    </>
                  ) : null}
                </Link>
              );
            })}
          </div>
          {featuredCards.length ? (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto bg-white px-3 pb-3">
              {featuredCards.map((match) => (
                <HomeFeaturedMatch key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="bg-white px-3 py-6 text-sm text-muted">
              {feed.error ?? "No matches available"}
            </p>
          )}
        </>
      ) : null}
      {contentTab === "Games" ? (
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-3">
          <Link href="/games/lucky-numbers" className="relative h-[100px] w-[132px] shrink-0 overflow-hidden rounded-md">
            <img src="/home/lucky-numbers.jpg" alt="Lucky Numbers" className="h-full w-full object-cover" />
          </Link>
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
      {contentTab === "Codes" ? <RecommendedCodes matches={feed.featured.length ? feed.featured : footballToday} /> : null}
      {contentTab === "Virtuals" ? (
        <p className="bg-white px-3 py-6 text-sm text-muted">
          Virtuals are a placeholder. Open{" "}
          <Link href="/virtuals" className="font-semibold text-accent">
            Virtuals
          </Link>{" "}
          when a licensed feed is connected.
        </p>
      ) : null}

      <LiveBoard matches={feed.live} limit={8} homeLayout feedError={feed.error} />
      <HomeSportsBoard matches={sportsMatches} />
    </div>
  );
}

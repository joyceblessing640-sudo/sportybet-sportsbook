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
import { PromoCarousel } from "@/components/home/promo-carousel";
import { LiveBoard } from "@/components/live/live-board";
import { CRASH_GAMES } from "@/lib/games";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

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
      <PromoCarousel />

      <div className="grid grid-cols-6 bg-white px-0.5 pb-1.5 pt-0 min-[412px]:pb-2">
        {SHORTCUTS.map((item) => {
          const Icon = item.Icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-px text-[8.5px] leading-tight text-[#4b5563] min-[375px]:text-[9px] min-[412px]:text-[10px]"
            >
              <span className="grid h-6 w-6 place-items-center text-[#374151] min-[412px]:h-7 min-[412px]:w-7">
                <Icon className="h-[16px] w-[16px] min-[412px]:h-[18px] min-[412px]:w-[18px]" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto bg-[#f4f5f7] px-2.5 py-1.5 min-[412px]:gap-2 min-[412px]:px-3 min-[412px]:py-2">
        {CATEGORY_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={cn(
              "h-[40px] w-[92px] shrink-0 rounded-md border border-[#eceff3] border-t-[2px] bg-white px-1.5 py-1 text-[9px] font-bold leading-tight text-[#2b3038] shadow-[0_1px_3px_rgba(16,24,40,0.08)] min-[375px]:h-[42px] min-[375px]:w-[98px] min-[375px]:text-[10px] min-[412px]:h-[46px] min-[412px]:w-[108px] min-[430px]:w-[112px]",
              card.border,
            )}
          >
            {card.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto bg-white px-2.5 pt-2 text-[12px] font-semibold min-[412px]:gap-2.5 min-[412px]:px-3 min-[412px]:text-[13px]">
        <span className="shrink-0 text-[13px] font-black text-ink min-[412px]:text-[14px]">Featured</span>
        <span className="h-3 w-px shrink-0 bg-[#d1d5db]" />
        {CONTENT_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setContentTab(tab)}
            className={cn(
              "shrink-0 pb-1.5 transition-colors duration-150",
              contentTab === tab ? "text-accent" : "text-[#6b7280]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {contentTab === "Matches" ? (
        <>
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto bg-white px-2.5 pb-2.5 pt-1.5 min-[412px]:gap-2.5 min-[412px]:px-3">
            {LEAGUE_PILLS.map((league, index) => {
              const selected = index === 0;
              return (
                <Link
                  key={league.slug}
                  href={league.href}
                  title={league.name}
                  className={cn(
                    "relative flex shrink-0 items-center justify-center border-[1.5px] border-[#d4d8de] bg-white",
                    selected ? "h-7 gap-1 rounded-full px-2.5 min-[412px]:h-8 min-[412px]:px-3" : "h-7 w-[44px] rounded-full min-[412px]:h-8 min-[412px]:w-[50px]",
                  )}
                >
                  <img
                    src={league.icon}
                    alt=""
                    width={selected ? 14 : 18}
                    height={selected ? 14 : 18}
                    className={cn("object-contain object-center", selected ? "h-[14px] w-[14px] min-[412px]:h-4 min-[412px]:w-4" : "h-[18px] w-[18px] min-[412px]:h-5 min-[412px]:w-5")}
                  />
                  {selected ? (
                    <>
                      <span className="text-[11px] font-semibold leading-none text-ink min-[412px]:text-[12px]">{league.name}</span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-1/2 top-[calc(100%-5px)] z-[1] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b-[1.5px] border-r-[1.5px] border-[#d4d8de] bg-white"
                      />
                    </>
                  ) : null}
                </Link>
              );
            })}
          </div>
          {featuredCards.length ? (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-1.5 overflow-x-auto bg-white px-2.5 pb-2 min-[412px]:gap-2 min-[412px]:px-3 min-[412px]:pb-2.5">
              {featuredCards.map((match) => (
                <HomeFeaturedMatch key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="bg-white px-2.5 py-5 text-[12px] text-muted">
              {feed.error ?? "No matches available"}
            </p>
          )}
        </>
      ) : null}
      {contentTab === "Games" ? (
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto bg-white px-2.5 py-2 min-[412px]:gap-2 min-[412px]:px-3">
          <Link href="/games/lucky-numbers" className="relative h-[82px] w-[110px] shrink-0 overflow-hidden rounded-md min-[412px]:h-[88px] min-[412px]:w-[118px]">
            <img src="/home/lucky-numbers.jpg" alt="Lucky Numbers" className="h-full w-full object-cover" />
          </Link>
          {CRASH_GAMES.map((game) => (
            <Link
              key={game.id}
              href={game.href}
              className={cn(
                "relative h-[82px] w-[110px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br p-2 text-white min-[412px]:h-[88px] min-[412px]:w-[118px]",
                game.art,
              )}
            >
              <p className="mt-6 text-[12px] font-bold">{game.name}</p>
              <p className="text-[9px] text-white/70">{game.tag}</p>
            </Link>
          ))}
        </div>
      ) : null}
      {contentTab === "Codes" ? <RecommendedCodes matches={feed.featured.length ? feed.featured : footballToday} /> : null}
      {contentTab === "Virtuals" ? (
        <p className="bg-white px-2.5 py-5 text-[12px] text-muted">
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

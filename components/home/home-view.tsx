"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { FeaturedMatchCard, MatchList, MatchRow } from "@/components/betting/match-card";
import { CRASH_GAMES } from "@/lib/games";
import { MORE_SPORTS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";

function SectionHead({ title, href, count }: { title: string; href?: string; count?: number }) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <h2 className="text-[13px] font-bold text-ink">
        {title}
        {typeof count === "number" ? <span className="ml-1 font-medium text-muted">({count})</span> : null}
      </h2>
      {href ? (
        <Link href={href} className="text-[11px] font-semibold text-brand">
          See all
        </Link>
      ) : null}
    </div>
  );
}

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
  const [liveMarket, setLiveMarket] = useState("1X2");
  const footballToday = useMemo(() => today.filter((m) => m.sport.id === "football"), [today]);
  const other = useMemo(() => today.filter((m) => m.sport.id !== "football").slice(0, 8), [today]);

  return (
    <div className="pb-2">
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2">
        {leagues.map((league) => (
          <Link
            key={league.slug}
            href={`/sports/football/${league.slug}`}
            className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
          >
            {league.name}
          </Link>
        ))}
      </div>

      <SectionHead title="Featured matches" href="/sports/football" count={featured.length} />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
        {featured.length === 0 ? (
          <p className="rounded-md bg-white px-3 py-6 text-[13px] text-muted">No featured demo matches.</p>
        ) : (
          featured.map((match) => (
            <div key={match.id} className="min-w-[300px] max-w-[340px] overflow-hidden rounded-md border border-line">
              <FeaturedMatchCard match={match} />
            </div>
          ))
        )}
      </div>

      <section className="mt-1 bg-live text-white">
        <div className="flex items-center justify-between px-3 py-2">
          <h2 className="flex items-center gap-2 text-[13px] font-bold">
            <span className="live-dot" /> Live matches
          </h2>
          <Link href="/live" className="text-[11px] font-semibold text-[#8dffb8]">
            All live {live.length}
          </Link>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 text-[11px]">
          {["1X2", "OU", "DC"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setLiveMarket(id)}
              className={cn("shrink-0 pb-1.5", liveMarket === id ? "border-b-2 border-brand text-white" : "text-white/50")}
            >
              {id === "OU" ? "O/U" : id}
            </button>
          ))}
        </div>
        {live.length === 0 ? (
          <p className="px-3 py-6 text-[13px] text-white/55">No live demo events right now.</p>
        ) : (
          live.slice(0, 6).map((match) => (
            <MatchRow key={match.id} match={match} marketType={liveMarket} compactOdds onDark />
          ))
        )}
      </section>

      <SectionHead title="Today's football" href="/sports/football" count={footballToday.length} />
      {footballToday.length === 0 ? (
        <p className="mx-3 rounded-md bg-white px-3 py-6 text-[13px] text-muted">No football fixtures today.</p>
      ) : (
        <div className="mx-3">
          <MatchList matches={footballToday.slice(0, 12)} marketType="1X2" dateLabel={format(new Date(), "EEE dd MMM")} />
        </div>
      )}

      <SectionHead title="Upcoming matches" href="/sports" count={upcoming.length} />
      {upcoming.length === 0 ? (
        <p className="mx-3 rounded-md bg-white px-3 py-6 text-[13px] text-muted">Nothing kicking off in the next 3 hours.</p>
      ) : (
        <div className="mx-3 overflow-hidden rounded-md border border-line bg-white">
          {upcoming.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      )}

      <SectionHead title="Promotions" href="/promotions" />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
        {promotions.map((promo) => (
          <Link
            key={promo.id}
            href={promo.href}
            className={cn(
              "card-hover min-w-[168px] rounded-md p-3 text-white",
              promo.theme === "welcome" && "bg-gradient-to-br from-[#0e8a44] to-[#0b3d2e]",
              promo.theme === "boost" && "bg-gradient-to-br from-[#1f6b4a] to-[#10241c]",
              promo.theme === "promo" && "bg-gradient-to-br from-[#0f766e] to-[#134e4a]",
            )}
          >
            <p className="text-[10px] uppercase tracking-wide text-white/70">{promo.subtitle}</p>
            <p className="mt-1 text-[13px] font-bold">{promo.title}</p>
            <span className="mt-2 inline-flex rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold">View</span>
          </Link>
        ))}
      </div>

      <SectionHead title="Other sports" href="/sports" />
      <div className="grid grid-cols-3 gap-1.5 px-3 sm:grid-cols-4">
        {MORE_SPORTS.slice(0, 12).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md border border-line bg-white px-2 py-2.5 text-center text-[11px] font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {other.length > 0 ? (
        <div className="mt-3 mx-3 overflow-hidden rounded-md border border-line bg-white">
          {other.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      ) : null}

      <SectionHead title="Games" href="/games" />
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-3">
        {CRASH_GAMES.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className={cn("relative h-[108px] w-[140px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br p-2.5 text-white", game.art)}
          >
            <p className="mt-10 text-[13px] font-bold">{game.name}</p>
            <p className="text-[10px] text-white/70">{game.tag} · Demo</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

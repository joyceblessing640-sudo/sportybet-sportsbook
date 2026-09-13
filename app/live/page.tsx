import Link from "next/link";
import { MatchRow } from "@/components/betting/match-card";
import { prisma } from "@/lib/db";
import { liveMinute } from "@/lib/audit";
import { serializeMatch } from "@/lib/serialize";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const raw = await prisma.match.findMany({
    where: { status: { in: ["LIVE", "HT"] } },
    include: {
      league: true,
      sport: true,
      homeTeam: true,
      awayTeam: true,
      markets: { include: { outcomes: { where: { active: true }, orderBy: { code: "asc" } } } },
    },
    orderBy: { startTime: "asc" },
  });
  const matches = await Promise.all(
    raw.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );

  return (
    <div>
      <div className="flex gap-4 overflow-x-auto bg-live px-4 pt-3 text-sm font-semibold text-white">
        {LIVE_SPORT_TABS.map((tab) => (
          <Link key={tab.id} href={tab.href} className={tab.id === "live" ? "text-odds" : "text-white/55"}>
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto bg-live px-4 pt-2 text-xs text-white/55">
        {LIST_MARKET_TABS.map((item) => (
          <span key={item.id} className={item.id === "1X2" ? "border-b-2 border-odds pb-2 font-bold text-white" : "pb-2"}>
            {item.label}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between bg-live px-4 py-2 text-xs">
        <span className="text-white/40">+{matches.length}</span>
        <span className="font-semibold text-odds">All Live Events {matches.length} ›</span>
      </div>
      <section className="bg-live">
        {matches.length === 0 ? (
          <p className="px-4 py-10 text-sm text-white/60">No live demo events right now.</p>
        ) : (
          matches.map((match) => <MatchRow key={match.id} match={match} compactOdds />)
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getUserBets } from "@/lib/betting";
import { prisma } from "@/lib/db";
import { formatGhs, formatOdds } from "@/lib/money";
import { serializeMatch } from "@/lib/serialize";
import { liveMinute } from "@/lib/audit";
import { RecommendedCodes } from "@/components/bets/recommended-codes";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BetsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const current = tab === "settled" || tab === "history" ? "SETTLED" : tab === "cancelled" ? "CANCELLED" : "OPEN";
  const session = await getSession();
  const data = session ? await getUserBets(session.id, current) : { items: [], total: 0, page: 1, pageSize: 20 };

  const featured = await prisma.match.findMany({
    where: { isFeatured: true, status: { in: ["SCHEDULED", "LIVE", "HT"] } },
    include: {
      league: true,
      sport: true,
      homeTeam: true,
      awayTeam: true,
      markets: { include: { outcomes: { where: { active: true } } } },
    },
    take: 8,
  });
  const codes = await Promise.all(
    featured.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );

  return (
    <div className="min-h-dvh bg-[#f4f5f7]">
      <header className="flex items-center justify-between bg-[#2a2d36] px-3 py-2.5 text-white">
        <Link href="/how-to-play" className="inline-flex items-center gap-1 text-[12px]">
          <CircleHelp className="h-3.5 w-3.5" /> How to Cashout?
        </Link>
        {!session ? (
          <div className="text-[12px] font-semibold">
            <Link href="/register">Register</Link>
            <span className="mx-1.5 text-white/40">|</span>
            <Link href="/login">Login</Link>
          </div>
        ) : (
          <span className="text-[12px] text-white/70">{session.username}</span>
        )}
      </header>
      <div className="grid grid-cols-2 bg-[#e8eaee] text-[14px] font-semibold">
        <Link
          href="/bets"
          className={cn("py-3 text-center", current === "OPEN" ? "bg-white text-ink" : "bg-transparent text-muted")}
        >
          Open Bets
        </Link>
        <Link
          href="/bets?tab=history"
          className={cn("py-3 text-center", current === "SETTLED" ? "bg-white text-ink" : "bg-transparent text-muted")}
        >
          Bet History
        </Link>
      </div>
      {!session ? (
        <div className="bg-white px-6 py-10 text-center">
          <p className="text-[14px] leading-relaxed text-muted">
            Please Log In to see your Open
            <br />
            Bets and Cashout Bets
          </p>
          <Link
            href="/login?next=/bets"
            className="mt-5 inline-flex h-10 items-center rounded-md border border-accent px-10 text-[14px] font-bold text-accent"
          >
            Login
          </Link>
        </div>
      ) : data.items.length === 0 ? (
        <div className="bg-white px-6 py-10 text-center text-sm text-muted">
          No {current === "OPEN" ? "open" : "history"} bets yet.
        </div>
      ) : (
        <div className="space-y-2 p-3">
          {data.items.map((bet) => (
            <article key={bet.id} className="rounded-md bg-white p-3">
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>{bet.publicId}</span>
                <span>{bet.createdAt.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-[11px] font-bold uppercase text-accent">{bet.status}</p>
              <ul className="mt-2 space-y-1 text-[13px]">
                {bet.selections.map((sel) => (
                  <li key={sel.id}>
                    <span className="font-medium">
                      {sel.match.homeTeam.shortName} vs {sel.match.awayTeam.shortName}
                    </span>
                    <span className="text-muted">
                      {" "}
                      · {sel.marketName} · {sel.outcomeLabel} @ {formatOdds(sel.odds)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-3 text-[11px] text-muted">
                <div>
                  Odds
                  <p className="font-bold text-ink">{formatOdds(bet.totalOdds)}</p>
                </div>
                <div>
                  Stake
                  <p className="font-bold text-ink">{formatGhs(bet.stakePesewas)}</p>
                </div>
                <div>
                  To win
                  <p className="font-bold text-ink">{formatGhs(bet.potentialWinPesewas)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <RecommendedCodes matches={codes} />
    </div>
  );
}

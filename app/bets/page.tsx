import Link from "next/link";
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
  const current = tab === "settled" ? "SETTLED" : tab === "cancelled" ? "CANCELLED" : "OPEN";
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
    take: 6,
  });
  const codes = await Promise.all(
    featured.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );

  return (
    <div>
      <header className="flex items-center justify-between bg-ink px-3 py-3 text-white">
        <Link href="/how-to-play" className="text-xs">
          How to Cashout?
        </Link>
        {!session ? (
          <div className="text-xs font-semibold">
            <Link href="/register">Register</Link>
            <span className="mx-2 text-white/40">|</span>
            <Link href="/login">Login</Link>
          </div>
        ) : (
          <span className="text-xs text-white/70">{session.username}</span>
        )}
      </header>
      <div className="grid grid-cols-3 bg-white text-sm font-semibold">
        {[
          { id: "OPEN", label: "Open Bets", href: "/bets" },
          { id: "SETTLED", label: "Settled", href: "/bets?tab=settled" },
          { id: "CANCELLED", label: "Cancelled", href: "/bets?tab=cancelled" },
        ].map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn("py-3 text-center", current === item.id ? "border-b-2 border-brand text-brand" : "text-[#6b7280]")}
          >
            {item.label}
          </Link>
        ))}
      </div>
      {!session ? (
        <div className="bg-white px-6 py-10 text-center">
          <p className="text-sm text-muted">Please log in to see your bets and cashout.</p>
          <Link href="/login?next=/bets" className="mt-4 inline-flex h-10 items-center rounded-md border border-odds px-6 text-sm font-bold text-odds">
            Login
          </Link>
        </div>
      ) : data.items.length === 0 ? (
        <div className="bg-white px-6 py-10 text-center text-sm text-muted">No {current.toLowerCase()} bets yet.</div>
      ) : (
        <div className="space-y-3 p-3">
          {data.items.map((bet) => (
            <article key={bet.id} className="rounded-xl bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{bet.publicId}</span>
                <span>{bet.createdAt.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-xs font-bold uppercase text-brand">{bet.status}</p>
              <ul className="mt-2 space-y-1 text-sm">
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
              <div className="mt-3 grid grid-cols-3 text-xs">
                <div>
                  Odds
                  <p className="font-bold">{formatOdds(bet.totalOdds)}</p>
                </div>
                <div>
                  Stake
                  <p className="font-bold">{formatGhs(bet.stakePesewas)}</p>
                </div>
                <div>
                  To win
                  <p className="font-bold">{formatGhs(bet.potentialWinPesewas)}</p>
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

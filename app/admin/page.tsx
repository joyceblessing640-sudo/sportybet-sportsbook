import { prisma } from "@/lib/db";
import { formatGhs } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [users, bets, deposits, withdrawals, live] = await Promise.all([
    prisma.user.count(),
    prisma.bet.count(),
    prisma.deposit.count({ where: { status: "PENDING" } }),
    prisma.withdrawal.count({ where: { status: "PENDING" } }),
    prisma.match.count({ where: { status: { in: ["LIVE", "HT"] } } }),
  ]);
  const volume = await prisma.bet.aggregate({ _sum: { stakePesewas: true } });

  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Overview</h1>
      <p className="text-sm text-muted">Operational snapshot for this demo environment.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          ["Users", users],
          ["Bets", bets],
          ["Pending deposits", deposits],
          ["Pending withdrawals", withdrawals],
          ["Live matches", live],
          ["Stake volume", formatGhs(volume._sum.stakePesewas ?? 0)],
        ].map(([label, value]) => (
          <article key={String(label)} className="rounded-xl bg-white p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-2xl font-black">{value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

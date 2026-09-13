import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BonusesPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/bonuses");
  const [wallet, promotions] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId: session.id } }),
    prisma.promotion.findMany({ where: { active: true } }),
  ]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Bonuses / Rewards</h1>
      <p className="mt-2 rounded-xl bg-white p-4 text-sm">
        Bonus balance: <strong>GHS {((wallet?.bonusPesewas ?? 0) / 100).toFixed(2)}</strong>
      </p>
      <p className="mt-2 text-xs text-muted">Bonus funds are demo figures and may have wagering rules in a live cashier.</p>
      <div className="mt-4 space-y-3">
        {promotions.map((promo) => (
          <article key={promo.id} className="rounded-xl bg-white p-4">
            <h2 className="font-bold">{promo.title}</h2>
            <p className="mt-1 text-sm text-muted">{promo.body}</p>
            <Link href={promo.href} className="mt-2 inline-block text-sm font-semibold text-brand">
              {promo.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

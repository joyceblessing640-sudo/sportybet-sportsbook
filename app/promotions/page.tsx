import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Promotions</h1>
      <p className="mt-1 text-sm text-muted">
        Offers below are demo copy. They do not guarantee winnings and have not been issued by a licensed operator.
      </p>
      <div className="mt-4 space-y-3">
        {promotions.map((promo) => (
          <article key={promo.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{promo.subtitle}</p>
            <h2 className="mt-1 text-lg font-black">{promo.title}</h2>
            <p className="mt-2 text-sm text-[#4b5563]">{promo.body}</p>
            <Link href={promo.href} className="mt-3 inline-flex text-sm font-bold text-brand">
              {promo.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

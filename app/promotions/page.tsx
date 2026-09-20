import { prisma } from "@/lib/db";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <div className="p-3">
      <h1 className="text-[16px] font-bold">Promotions</h1>
      <p className="mt-1 text-[12px] text-muted">
        Demo offers only. They do not guarantee winnings and are not issued by a licensed operator.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {promotions.map((promo) => (
          <article
            key={promo.id}
            className={cn(
              "card-hover relative overflow-hidden rounded-md p-3 text-white",
              promo.theme === "welcome" && "bg-gradient-to-br from-[#0e8a44] to-[#0b3d2e]",
              promo.theme === "boost" && "bg-gradient-to-br from-[#1f6b4a] to-[#10241c]",
              promo.theme === "promo" && "bg-gradient-to-br from-[#0f766e] to-[#134e4a]",
            )}
          >
            <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
            <span className="pointer-events-none absolute bottom-0 right-8 h-16 w-16 rotate-12 rounded-md bg-white/5" />
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{promo.subtitle}</p>
            <h2 className="mt-1 text-[15px] font-bold">{promo.title}</h2>
            <p className="mt-1.5 line-clamp-3 text-[12px] text-white/80">{promo.body}</p>
            <Link href={promo.href} className="mt-3 inline-flex rounded bg-white px-3 py-1.5 text-[12px] font-bold text-brand">
              {promo.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

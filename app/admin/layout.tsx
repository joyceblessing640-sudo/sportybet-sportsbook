import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/brand/logo";

const LINKS = [
  "overview",
  "users",
  "sports",
  "leagues",
  "matches",
  "markets",
  "odds",
  "bets",
  "deposits",
  "withdrawals",
  "promotions",
  "promo-codes",
  "transactions",
  "notifications",
  "settings",
  "audit-logs",
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUB_ADMIN")) {
    redirect("/login?next=/admin");
  }
  return (
    <div className="min-h-dvh bg-[#f3f4f6]">
      <header className="flex items-center gap-4 bg-ink px-4 py-3 text-white">
        <Logo href="/admin" />
        <p className="text-sm font-semibold">Admin</p>
        <Link href="/" className="ml-auto text-xs text-white/70">
          Back to site
        </Link>
      </header>
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden w-52 shrink-0 border-r border-[#eceff3] bg-white md:block">
          {LINKS.map((link) => (
            <Link
              key={link}
              href={link === "overview" ? "/admin" : `/admin/${link}`}
              className="block px-4 py-2.5 text-sm capitalize text-[#374151] hover:bg-[#f7f8fa]"
            >
              {link.replace("-", " ")}
            </Link>
          ))}
        </aside>
        <div className="min-w-0 flex-1">
          <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-3 py-2 md:hidden">
            {LINKS.map((link) => (
              <Link
                key={link}
                href={link === "overview" ? "/admin" : `/admin/${link}`}
                className="shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1 text-xs capitalize"
              >
                {link.replace("-", " ")}
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers";
import { TOP_NAV } from "@/lib/constants";
import { formatGhs } from "@/lib/money";
import { cn } from "@/lib/utils";

export function Header({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-brand text-white">
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? (
        <p className="bg-[#9b1218] px-3 py-1 text-center text-[10px] font-medium tracking-wide text-white/90">
          DEMO ENVIRONMENT — Sample matches and odds. Not a licensed operator. No real-money payments.
        </p>
      ) : null}
      <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-2 px-3 lg:h-14 lg:px-4">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10 lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {TOP_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/10",
                pathname === item.href && "bg-white/15 text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10"
            onClick={() => router.push("/sports")}
          >
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <>
              <Link href="/notifications" className="relative grid h-9 w-9 place-items-center rounded-md hover:bg-white/10" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {user.unread > 0 ? (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white" />
                ) : null}
              </Link>
              <div className="hidden text-right sm:block">
                <p className="text-[10px] uppercase text-white/70">Balance</p>
                <p className="text-sm font-bold leading-none">{formatGhs(user.wallet?.balancePesewas ?? 0)}</p>
              </div>
              <Button variant="white" size="sm" asChild>
                <Link href="/deposit">Deposit</Link>
              </Button>
              <Link href="/me" className="grid h-9 w-9 place-items-center rounded-full bg-white/15" aria-label="Account">
                <UserRound className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="hidden h-8 items-center rounded-md border border-white px-3 text-xs font-bold sm:inline-flex"
              >
                Join Now
              </Link>
              <Link href="/login" className="inline-flex h-8 items-center rounded-md bg-white px-3 text-xs font-bold text-brand">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

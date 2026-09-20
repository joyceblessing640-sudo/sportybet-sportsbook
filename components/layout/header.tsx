"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers";
import { formatGhs } from "@/lib/money";

export function Header({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-header text-white">
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? (
        <p className="bg-[#07291e] px-3 py-0.5 text-center text-[10px] font-medium tracking-wide text-white/70">
          DEMO — Sample matches and odds. Not a licensed operator. No real-money payments.
        </p>
      ) : null}
      <div className="mx-auto flex h-11 max-w-[1440px] items-center gap-2 px-2 sm:px-3 lg:h-12 lg:px-4">
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/10 lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Logo />
        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/10"
            onClick={() => router.push("/sports")}
          >
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <>
              <Link
                href="/notifications"
                className="relative grid h-8 w-8 place-items-center rounded-md hover:bg-white/10"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {user.unread > 0 ? <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#8dffb8]" /> : null}
              </Link>
              <Link href="/deposit" className="hidden text-right leading-tight sm:block">
                <p className="text-[9px] uppercase tracking-wide text-white/55">Balance</p>
                <p className="text-[13px] font-bold tabular-nums">{formatGhs(user.wallet?.balancePesewas ?? 0)}</p>
              </Link>
              <Button variant="green" size="sm" className="h-7 px-2.5 text-[11px]" asChild>
                <Link href="/deposit">Deposit</Link>
              </Button>
              <Link href="/me" className="grid h-8 w-8 place-items-center rounded-full bg-white/12" aria-label="Account">
                <UserRound className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-7 items-center rounded-md px-2.5 text-[12px] font-semibold text-white/90 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-7 items-center rounded-md bg-brand px-2.5 text-[12px] font-bold text-white hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

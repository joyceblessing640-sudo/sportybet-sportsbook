"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Search, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers";
import { logoutAction } from "@/app/actions/auth";
import { formatGhs } from "@/lib/money";

export function Header({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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
              <Link href="/deposit" className="text-right leading-tight">
                <p className="hidden text-[9px] uppercase tracking-wide text-white/55 sm:block">Balance</p>
                <p className="text-[12px] font-bold tabular-nums sm:text-[13px]">{formatGhs(user.wallet?.balancePesewas ?? 0)}</p>
              </Link>
              <Button variant="green" size="sm" className="h-7 px-2.5 text-[11px]" asChild>
                <Link href="/deposit">Deposit</Link>
              </Button>
              <div ref={wrap} className="relative">
                <button
                  type="button"
                  onClick={() => setMenu((v) => !v)}
                  className="flex h-8 items-center gap-0.5 rounded-full bg-white/12 pl-0.5 pr-1"
                  aria-label="Account menu"
                >
                  <span className="grid h-7 w-7 place-items-center">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
                </button>
                {menu ? (
                  <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-md border border-line bg-white py-1 text-ink shadow-lg">
                    <Link href="/me" onClick={() => setMenu(false)} className="block px-3 py-2 text-[13px] hover:bg-brand-soft">
                      Account
                    </Link>
                    <Link href="/bets" onClick={() => setMenu(false)} className="block px-3 py-2 text-[13px] hover:bg-brand-soft">
                      My Bets
                    </Link>
                    <Link href="/deposit" onClick={() => setMenu(false)} className="block px-3 py-2 text-[13px] hover:bg-brand-soft">
                      Deposit
                    </Link>
                    <Link href="/withdraw" onClick={() => setMenu(false)} className="block px-3 py-2 text-[13px] hover:bg-brand-soft">
                      Withdraw
                    </Link>
                    <form action={logoutAction}>
                      <button type="submit" className="block w-full px-3 py-2 text-left text-[13px] text-danger hover:bg-red-50">
                        Logout
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
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

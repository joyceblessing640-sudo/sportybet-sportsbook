"use client";

import Link from "next/link";
import { ChevronRight, Moon, UserRound } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AccountFooter } from "@/components/account/account-footer";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { formatGhs } from "@/lib/money";

export default function MePage() {
  const { user } = useAuth();

  return (
    <div className="pb-8">
      <section className="bg-ink px-4 pb-5 pt-6 text-white">
        <div className="flex items-center justify-between">
          <Link href={user ? "/me" : "/login"} className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
              <UserRound className="h-6 w-6" />
            </span>
            <div>
              <p className="text-base font-bold">{user ? user.username : "Login to View"}</p>
              <p className="text-xs text-white/60">{user ? `${user.loyaltyTier} tier` : "Join SportyBets"}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/50" />
          </Link>
          <span className="flex items-center gap-1 text-xs text-white/70">
            Dark Mode <Moon className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <p className="text-sm text-white/60">Total Balance</p>
          <p className="text-2xl font-black">{user ? formatGhs(user.wallet?.balancePesewas ?? 0) : "GHS --"}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="green" className="h-12" asChild>
            <Link href="/deposit">Deposit</Link>
          </Button>
          <Button className="h-12 border border-[#12a150] bg-transparent text-[#86efac] hover:bg-white/5" asChild>
            <Link href="/withdraw">Withdraw</Link>
          </Button>
        </div>
        <Link
          href="/promotions"
          className="mt-4 flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-[#7f1d1d] to-[#111827] p-3"
        >
          <div>
            <p className="text-sm font-black">SportyBets Loyalty</p>
            <p className="text-xs text-white/70">{user ? "View your demo tier progress" : "Log in to join"}</p>
          </div>
          <span className="text-xs font-semibold text-[#86efac]">Open</span>
        </Link>
      </section>
      <AccountFooter />
      {user ? (
        <form action={logoutAction} className="bg-ink pb-6 text-center">
          <button type="submit" className="text-sm font-semibold text-white/80">
            Logout
          </button>
        </form>
      ) : null}
      {user?.role === "ADMIN" || user?.role === "SUB_ADMIN" ? (
        <Link href="/admin" className="block bg-ink pb-6 text-center text-sm font-semibold text-[#86efac]">
          Admin dashboard
        </Link>
      ) : null}
    </div>
  );
}

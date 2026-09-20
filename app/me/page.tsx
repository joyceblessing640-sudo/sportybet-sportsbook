"use client";

import Link from "next/link";
import { ChevronRight, UserRound } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AccountFooter } from "@/components/account/account-footer";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { formatGhs } from "@/lib/money";

export default function MePage() {
  const { user } = useAuth();

  return (
    <div className="pb-8">
      <section className="bg-header px-4 pb-4 pt-4 text-white">
        <Link href={user ? "/me" : "/login"} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold">{user ? user.username : "Login to View"}</p>
            <p className="text-[11px] text-white/60">{user ? `${user.loyaltyTier} tier` : "Join SportyBets"}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/50" />
        </Link>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-[12px] text-white/60">Total Balance</p>
          <p className="text-[18px] font-bold tabular-nums">{user ? formatGhs(user.wallet?.balancePesewas ?? 0) : "GHS --"}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="green" className="h-9 text-[13px]" asChild>
            <Link href="/deposit">Deposit</Link>
          </Button>
          <Button className="h-9 border border-[#8dffb8] bg-transparent text-[13px] text-[#8dffb8] hover:bg-white/5" asChild>
            <Link href="/withdraw">Withdraw</Link>
          </Button>
        </div>
        <Link
          href="/promotions"
          className="mt-3 flex items-center justify-between overflow-hidden rounded-md bg-gradient-to-r from-[#0e8a44] to-[#07291e] p-3"
        >
          <div>
            <p className="text-[13px] font-bold">SportyBets Loyalty</p>
            <p className="text-[11px] text-white/70">{user ? "View your demo tier progress" : "Log in to join"}</p>
          </div>
          <span className="text-[11px] font-semibold text-[#8dffb8]">Open</span>
        </Link>
      </section>
      <AccountFooter />
      {user ? (
        <form action={logoutAction} className="bg-header pb-6 text-center">
          <button type="submit" className="text-[13px] font-semibold text-white/80">
            Logout
          </button>
        </form>
      ) : null}
      {user?.role === "ADMIN" || user?.role === "SUB_ADMIN" ? (
        <Link href="/admin" className="block bg-header pb-6 text-center text-[13px] font-semibold text-[#86efac]">
          Admin dashboard
        </Link>
      ) : null}
    </div>
  );
}

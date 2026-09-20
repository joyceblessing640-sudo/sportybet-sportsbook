"use client";

import Link from "next/link";
import { ChevronRight, Moon, UserRound, Wallet, Landmark } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AccountFooter } from "@/components/account/account-footer";
import { useAuth } from "@/components/providers";
import { formatGhs } from "@/lib/money";

export default function MePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-[#1b1d22] pb-8 text-white">
      <section className="px-4 pb-4 pt-5">
        <div className="flex items-start justify-between">
          <Link href={user ? "/me" : "/login"} className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#2e323a]">
              <UserRound className="h-7 w-7 text-white/90" />
            </span>
            <p className="flex items-center gap-1 text-[16px] font-bold">
              {user ? user.username : "Login to View"} <ChevronRight className="h-4 w-4 text-white/50" />
            </p>
          </Link>
          <span className="flex items-center gap-1 pt-1 text-[12px] text-white/70">
            Dark Mode <Moon className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p className="text-[13px] text-white/55">Total Balance</p>
          <p className="text-[22px] font-bold tabular-nums">{user ? formatGhs(user.wallet?.balancePesewas ?? 0) : "GHS --"}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/deposit"
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-md bg-accent text-[15px] font-bold text-white"
          >
            <Wallet className="h-4 w-4" /> Deposit
          </Link>
          <Link
            href="/withdraw"
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-md border border-accent text-[15px] font-bold text-accent"
          >
            <Landmark className="h-4 w-4" /> Withdraw
          </Link>
        </div>
        <Link
          href="/promotions"
          className="relative mt-4 flex h-[52px] items-center justify-between overflow-hidden rounded-md bg-gradient-to-r from-[#3f0d12] via-[#1f2937] to-[#111827] px-3"
        >
          <span className="pointer-events-none absolute -left-2 text-[36px] opacity-30">⚽</span>
          <p className="relative text-[13px] font-bold italic">SportyBets Loyalty</p>
          <span className="relative text-[12px] font-semibold text-accent">{user ? "Open" : "Log in to join"} ›</span>
        </Link>
      </section>
      <AccountFooter />
      {user ? (
        <form action={logoutAction} className="bg-[#111111] pb-4 pt-2 text-center">
          <button type="submit" className="text-[13px] font-semibold text-white/80">
            Logout
          </button>
        </form>
      ) : null}
      {user?.role === "ADMIN" || user?.role === "SUB_ADMIN" ? (
        <Link href="/admin" className="block bg-[#111111] pb-6 text-center text-[13px] font-semibold text-accent">
          Admin dashboard
        </Link>
      ) : null}
    </div>
  );
}

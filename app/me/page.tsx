"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Gift,
  Headphones,
  Info,
  Lightbulb,
  Moon,
  Receipt,
  RefreshCw,
  Share2,
  Ticket,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { formatGhs } from "@/lib/money";

const MENU = [
  { href: "/bets", label: "Daily Streak", icon: Ticket },
  { href: "/support", label: "Customer Service", extra: "Online 24/7", icon: Headphones },
  { href: "/notifications", label: "Notification Center", icon: Bell },
  { href: "/how-to-play", label: "How to Play", icon: Info },
  { href: "/support", label: "Share an Idea", icon: Lightbulb },
  { href: "/how-to-play", label: "Rate Our App", icon: Share2 },
  { href: "/how-to-play", label: "Update App", icon: RefreshCw },
];

export default function MePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

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
              <p className="text-xs text-white/60">{user ? `${user.loyaltyTier} tier` : "Join SPORTBET"}</p>
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
        <Link href="/promotions" className="mt-4 flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-[#7f1d1d] to-[#111827] p-3">
          <div>
            <p className="text-sm font-black">SPORTBET Loyalty</p>
            <p className="text-xs text-white/70">{user ? "View your demo tier progress" : "Log in to join"}</p>
          </div>
          <span className="text-xs font-semibold text-[#86efac]">Open</span>
        </Link>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-white/80">
          <Link href="/bets" className="rounded-xl bg-white/5 py-3">
            <Ticket className="mx-auto mb-1 h-5 w-5" />
            Sports Bet History
          </Link>
          <Link href="/transactions" className="rounded-xl bg-white/5 py-3">
            <Receipt className="mx-auto mb-1 h-5 w-5" />
            Transaction Records
          </Link>
          <Link href="/bonuses" className="rounded-xl bg-white/5 py-3">
            <Gift className="mx-auto mb-1 h-5 w-5" />
            Bonuses / Rewards
          </Link>
        </div>
      </section>
      <div className="bg-white">
        {MENU.map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center gap-3 border-b border-[#f1f3f7] px-4 py-3.5">
            <item.icon className="h-5 w-5 text-[#6b7280]" />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            {item.extra ? <span className="text-xs text-[#9aa3b2]">{item.extra}</span> : null}
            <ChevronRight className="h-4 w-4 text-[#c5cad3]" />
          </Link>
        ))}
        <div className="flex items-center justify-between px-4 py-3 text-xs text-muted">
          <span>18+</span>
          <span>© {new Date().getFullYear()} SPORTBET. All rights reserved.</span>
        </div>
      </div>
      <section className="bg-ink px-4 py-8 text-center text-white">
        <p className="text-lg font-black italic text-brand">SPORTBET</p>
        <p className="mt-2 text-sm text-white/70">An independent demo sportsbook. Not affiliated with any third-party betting brand.</p>
        <p className="mt-3 text-xs text-white/50">Paybill demo: *711*222# · Methods: MTN · Telecel · AirtelTigo · Bank</p>
        <p className="mt-4 text-[11px] leading-relaxed text-white/45">
          Age 18 and above only. Play responsibly. Betting is addictive and can be psychologically harmful. This product is a software demonstration and does not hold a gambling licence.
        </p>
        <div className="mt-3 text-xs text-white/70">
          <Link href="/how-to-play">Terms & How to Play</Link>
        </div>
        {user ? (
          <button type="button" onClick={logout} className="mt-6 text-sm font-semibold text-white/80">
            Logout
          </button>
        ) : null}
        {user?.role === "ADMIN" || user?.role === "SUB_ADMIN" ? (
          <Link href="/admin" className="mt-3 block text-sm font-semibold text-[#86efac]">
            Admin dashboard
          </Link>
        ) : null}
      </section>
    </div>
  );
}

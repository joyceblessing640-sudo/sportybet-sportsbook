"use client";

import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { useAuth, type AuthUser } from "@/components/providers";
import { formatGhs } from "@/lib/money";

type Hit = {
  href: string;
  label: string;
  left: string;
  top: string;
  width: string;
  height: string;
};

const GUEST_HITS: Hit[] = [
  { href: "/login", label: "Login to View", left: "0%", top: "4.5%", width: "62%", height: "9%" },
  { href: "/deposit", label: "Deposit", left: "3%", top: "21.8%", width: "46%", height: "8.2%" },
  { href: "/withdraw", label: "Withdraw", left: "51%", top: "21.8%", width: "46%", height: "8.2%" },
  { href: "/promotions", label: "Sporty Loyalty", left: "3%", top: "32.5%", width: "94%", height: "8.5%" },
  { href: "/bets?tab=history", label: "Sports Bet History", left: "0%", top: "43.5%", width: "34.7%", height: "13.2%" },
  { href: "/transactions", label: "Transaction Records", left: "34.7%", top: "43.5%", width: "30.6%", height: "13.2%" },
  { href: "/rewards", label: "Gifts and Lucky Wheel", left: "65.3%", top: "43.5%", width: "34.7%", height: "13.2%" },
  { href: "/support", label: "Customer Service", left: "0%", top: "59.9%", width: "100%", height: "8.2%" },
  { href: "/how-to-play", label: "How to play", left: "0%", top: "76.3%", width: "100%", height: "8.2%" },
  { href: "/update", label: "Update App", left: "0%", top: "84.5%", width: "100%", height: "8.2%" },
];

const SIGNED_HITS: Hit[] = [
  { href: "/me", label: "Account", left: "0%", top: "3.2%", width: "58%", height: "8%" },
  { href: "/deposit", label: "Deposit", left: "3%", top: "18.7%", width: "46%", height: "6.2%" },
  { href: "/withdraw", label: "Withdraw", left: "51%", top: "18.7%", width: "46%", height: "6.2%" },
  { href: "/promotions", label: "Sporty Loyalty", left: "3%", top: "26.8%", width: "94%", height: "6%" },
  { href: "/bets?tab=history", label: "Sports Bet History", left: "0%", top: "34.7%", width: "34.6%", height: "9.6%" },
  { href: "/transactions", label: "Transaction Records", left: "34.6%", top: "34.7%", width: "30.9%", height: "9.6%" },
  { href: "/rewards", label: "Gifts and Lucky Wheel", left: "65.5%", top: "34.7%", width: "34.5%", height: "9.6%" },
  { href: "/support", label: "Customer Service", left: "0%", top: "58.8%", width: "100%", height: "6%" },
  { href: "/notifications", label: "Notification Center", left: "0%", top: "64.8%", width: "100%", height: "6%" },
  { href: "/how-to-play", label: "How to play", left: "0%", top: "76.8%", width: "100%", height: "6%" },
  { href: "/update", label: "Update App", left: "0%", top: "88.8%", width: "100%", height: "6%" },
];

function DashHits({ hits }: { hits: Hit[] }) {
  return (
    <>
      {hits.map((hit) => (
        <Link
          key={hit.label}
          href={hit.href}
          aria-label={hit.label}
          className="absolute z-[1]"
          style={{ left: hit.left, top: hit.top, width: hit.width, height: hit.height }}
        />
      ))}
    </>
  );
}

function GuestDashboard() {
  return (
    <div className="relative w-full">
      <img
        src="/me/me-guest-provided.png"
        alt=""
        width={1080}
        height={1755}
        className="pointer-events-none block h-auto w-full object-contain"
        draggable={false}
      />
      <DashHits hits={GUEST_HITS} />
    </div>
  );
}

function SignedDashboard({ user }: { user: AuthUser }) {
  return (
    <div className="relative w-full">
      <img
        src="/me/me-signed-provided.png"
        alt=""
        width={899}
        height={2000}
        className="pointer-events-none block h-auto w-full object-contain"
        draggable={false}
      />
      <DashHits hits={SIGNED_HITS} />
      <p
        className="absolute z-[2] truncate text-[14px] font-bold leading-none text-white"
        style={{ left: "22%", top: "4.2%", width: "28%", height: "2.8%", background: "#1b1e27" }}
      >
        {user.username}
      </p>
      <p
        className="absolute z-[2] text-right text-[18px] font-bold leading-none tabular-nums text-white"
        style={{ left: "55%", top: "14.2%", width: "32%", height: "2.2%", background: "#1b1e27" }}
      >
        {formatGhs(user.wallet?.balancePesewas ?? 0)}
      </p>
    </div>
  );
}

export default function MePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-[#1b1d22] pb-8 text-white">
      {user ? <SignedDashboard user={user} /> : <GuestDashboard />}
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

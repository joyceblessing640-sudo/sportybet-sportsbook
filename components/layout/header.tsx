"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "@/components/providers";
import { PESEWAS_PER_GHS } from "@/lib/money";
import "./header.css";

function formatHeaderBalance(pesewas: number) {
  const amount = (pesewas / PESEWAS_PER_GHS).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `GHS ${amount}`;
}

export function Header({ onMenu }: { onMenu?: () => void }) {
  void onMenu;
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="sb-top">
      {user ? null : (
        <div className="sb-top-inner sb-top-inner-photo">
          <img
            src="/header/header-fit-v2.png"
            alt=""
            width={1080}
            height={122}
            className="sb-top-photo"
            draggable={false}
          />
          <Link href="/" className="sb-photo-hit sb-photo-home" aria-label="SportyBet home" />
          <Link href="/sports" className="sb-photo-hit sb-photo-search" aria-label="Search" />
          <Link href="/register" className="sb-photo-hit sb-photo-join" aria-label="Join Now" />
          <Link href="/login" className="sb-photo-hit sb-photo-login" aria-label="Log in" />
        </div>
      )}
      <div className={user ? "sb-top-inner" : "sb-top-inner sb-top-inner-standard"}>
        <Link href="/" className="sb-wordmark" aria-label="SportyBet home">
          <img
            src="/header/wordmark-provided.png"
            alt=""
            width={232}
            height={68}
            className="sb-wordmark-img"
            draggable={false}
          />
        </Link>
        <div className="sb-top-actions">
          <button type="button" className="sb-search" aria-label="Search" onClick={() => router.push("/sports")}>
            <Search size={18} strokeWidth={2.2} />
          </button>
          {user ? (
            <Link href="/me" className="sb-balance" aria-label={formatHeaderBalance(user.wallet?.balancePesewas ?? 0)}>
              <HeaderAvatar />
              <span>{formatHeaderBalance(user.wallet?.balancePesewas ?? 0)}</span>
            </Link>
          ) : (
            <div className="sb-guest">
              <Link href="/register" className="join">
                Join Now
              </Link>
              <Link href="/login">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderAvatar() {
  return (
    <svg className="sb-avatar" viewBox="0 0 36 36" aria-hidden>
      <defs>
        <linearGradient id="sb-avatar-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f7e3c8" />
          <stop offset="55%" stopColor="#e8c49a" />
          <stop offset="100%" stopColor="#c48a58" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#sb-avatar-sky)" />
      <circle cx="18" cy="14.5" r="6.2" fill="#2b1d16" />
      <path d="M8.5 34c1.8-7.2 5.8-11 9.5-11s7.7 3.8 9.5 11" fill="#1f1612" />
    </svg>
  );
}

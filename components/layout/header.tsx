"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers";
import { formatGhs } from "@/lib/money";

export function Header({ onMenu }: { onMenu?: () => void }) {
  void onMenu;
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-header text-white">
      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? (
        <p className="bg-header-deep px-3 py-0.5 text-center text-[10px] font-medium text-white/80">
          DEMO — Sample matches and odds. Not a licensed operator. No real-money payments.
        </p>
      ) : null}
      <div className="mx-auto flex h-12 max-w-[1440px] items-center gap-2 px-3">
        <Logo />
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center"
            onClick={() => router.push("/sports")}
          >
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <>
              <Link href="/deposit" className="text-right leading-tight">
                <p className="text-[11px] font-bold tabular-nums">{formatGhs(user.wallet?.balancePesewas ?? 0)}</p>
              </Link>
              <Link
                href="/deposit"
                className="inline-flex h-8 items-center rounded-md bg-white px-2.5 text-[12px] font-bold text-header"
              >
                Deposit
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex h-8 items-center rounded-md border border-white px-2.5 text-[12px] font-bold text-white"
              >
                Join Now
              </Link>
              <Link
                href="/login"
                className="inline-flex h-8 items-center rounded-md border border-white bg-white px-3 text-[12px] font-bold text-header"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

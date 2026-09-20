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
      <div className="mx-auto flex h-10 max-w-[1440px] items-center gap-1.5 px-2.5 min-[412px]:h-[42px] min-[412px]:px-3 lg:h-12">
        <Logo />
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="grid h-8 w-8 place-items-center"
            onClick={() => router.push("/sports")}
          >
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <>
              <Link href="/deposit" className="text-right leading-tight">
                <p className="text-[10px] font-bold tabular-nums min-[412px]:text-[11px]">{formatGhs(user.wallet?.balancePesewas ?? 0)}</p>
              </Link>
              <Link
                href="/deposit"
                className="inline-flex h-[26px] items-center rounded-md bg-white px-2 text-[11px] font-bold text-header min-[412px]:h-7 min-[412px]:px-2.5"
              >
                Deposit
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex h-[26px] items-center rounded-md border border-white px-2 text-[11px] font-bold text-white min-[412px]:h-7 min-[412px]:px-2.5"
              >
                Join Now
              </Link>
              <Link
                href="/login"
                className="inline-flex h-[26px] items-center rounded-md border border-white bg-white px-2 text-[11px] font-bold text-header min-[412px]:h-7 min-[412px]:px-2.5"
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

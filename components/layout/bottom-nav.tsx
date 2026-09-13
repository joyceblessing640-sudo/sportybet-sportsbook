"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Home, List, Ticket, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBetSlip } from "@/store/bet-slip";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sports", label: "Menu", icon: List },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/bets", label: "Open Bet", icon: Ticket },
  { href: "/me", label: "Me", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const count = useBetSlip((s) => s.items.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eceff3] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-[#8b93a3]"
            >
              <Icon className={cn("h-5 w-5", active && "text-brand")} />
              <span className={cn(active && "text-brand")}>{item.label}</span>
              {item.href === "/bets" && count > 0 ? (
                <span className="absolute right-[18%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">
                  {count}
                </span>
              ) : null}
              {active ? <span className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t bg-brand" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { Gamepad2, List, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { IconHomeS, IconOpenBets } from "@/components/home/shortcut-icons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "az", label: "AZ Menu", icon: "az" },
  { href: "/games", label: "Games", icon: "games" },
  { href: "/bets", label: "Open Bets", icon: "bets" },
  { href: "/me", label: "Me", icon: "me" },
] as const;

export function BottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-nav pb-[env(safe-area-inset-bottom)] text-white lg:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href !== "az" && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const iconClass = cn("h-[18px] w-[18px]", active ? "text-white" : "text-white/70");
          const inner = (
            <>
              {item.icon === "home" ? <IconHomeS className={iconClass} /> : null}
              {item.icon === "az" ? <List className={iconClass} /> : null}
              {item.icon === "games" ? <Gamepad2 className={iconClass} /> : null}
              {item.icon === "bets" ? <IconOpenBets className={iconClass} /> : null}
              {item.icon === "me" ? <UserRound className={iconClass} /> : null}
              <span className={cn(active ? "text-white" : "text-white/70")}>{item.label}</span>
              {active ? <span className="absolute bottom-0 left-1/2 h-[3px] w-8 -translate-x-1/2 bg-header" /> : null}
            </>
          );
          const className = "relative flex flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium";
          if (item.href === "az") {
            return (
              <button key={item.label} type="button" onClick={onOpenMenu} className={className}>
                {inner}
              </button>
            );
          }
          return (
            <Link key={item.href} href={item.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Radio, Ticket, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBetSlip } from "@/store/bet-slip";
import { useSlipItems } from "@/components/slip-context";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sports", label: "Sports", icon: List },
  { href: "/live", label: "Live", icon: Radio },
  { href: "slip", label: "Betslip", icon: Ticket },
  { href: "/me", label: "Account", icon: UserRound },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const setOpen = useBetSlip((s) => s.setOpen);
  const count = useSlipItems().length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href === "slip"
                ? pathname === "/slip"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          if (item.href === "slip") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setOpen(true)}
                className="relative flex flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium text-[#8b93a3]"
              >
                <Icon className={cn("h-[18px] w-[18px]", active && "text-brand")} />
                <span className={cn(active && "text-brand")}>{item.label}</span>
                {count > 0 ? (
                  <span className="absolute right-[18%] top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand px-1 text-[9px] text-white">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium text-[#8b93a3]"
            >
              <Icon className={cn("h-[18px] w-[18px]", active && "text-brand")} />
              <span className={cn(active && "text-brand")}>{item.label}</span>
              {active ? <span className="absolute bottom-0 left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-t bg-brand" /> : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

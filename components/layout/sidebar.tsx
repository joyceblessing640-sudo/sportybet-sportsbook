"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CircleDot,
  Gamepad2,
  Home,
  Megaphone,
  Radio,
  Sparkles,
  Trophy,
} from "lucide-react";
import { SPORTS_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  home: Home,
  football: Trophy,
  basketball: CircleDot,
  tennis: CircleDot,
  hockey: CircleDot,
  baseball: CircleDot,
  volleyball: CircleDot,
  esports: Gamepad2,
  live: Radio,
  virtuals: Sparkles,
  promos: Megaphone,
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="h-full w-[220px] shrink-0 overflow-y-auto border-r border-[#eceff3] bg-white">
      <nav className="py-2">
        {SPORTS_NAV.map((item) => {
          const Icon = ICONS[item.icon] ?? Trophy;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#2d3340] hover:bg-[#f7f8fa]",
                active && "bg-[#fff2f2] font-semibold text-brand",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-brand" : "text-[#8b93a3]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

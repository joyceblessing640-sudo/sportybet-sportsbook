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
import { MORE_SPORTS, SPORTS_NAV } from "@/lib/constants";
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
    <aside className="h-full w-[220px] shrink-0 overflow-y-auto bg-white">
      <nav className="py-1">
        {SPORTS_NAV.map((item) => {
          const Icon = ICONS[item.icon] ?? Trophy;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#2d3340] transition-colors duration-150 hover:bg-brand-soft",
                active && "bg-brand-soft font-semibold text-brand",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-brand" : "text-[#8b93a3]")} />
              {item.label}
            </Link>
          );
        })}
        <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wide text-muted">More sports</p>
        {MORE_SPORTS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="block px-4 py-1.5 text-[13px] text-[#4b5563] hover:bg-brand-soft hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

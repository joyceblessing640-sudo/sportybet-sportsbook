"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { SportsNav } from "@/components/layout/sports-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { BetSlipBar, BetSlipPanel } from "@/components/betting/bet-slip";
import { useBetSlip } from "@/store/bet-slip";
import type { SlipItem } from "@/lib/slip";

const BARE = ["/login", "/register", "/forgot-password", "/reset-password", "/account", "/admin"];

export function AppShell({ children, slipItems }: { children: ReactNode; slipItems: SlipItem[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const open = useBetSlip((s) => s.open);
  const setOpen = useBetSlip((s) => s.setOpen);
  const bare = BARE.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (bare) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-background">
      <div className="sticky top-0 z-40">
        <Header onMenu={() => setMenuOpen(true)} />
        <SportsNav />
      </div>
      <div className="mx-auto flex max-w-[1440px]">
        <main className="min-w-0 flex-1 bottom-pad">{children}</main>
        <div className="sticky top-[6.5rem] hidden h-[calc(100dvh-6.5rem)] w-[300px] shrink-0 self-start lg:block">
          <BetSlipPanel embedded items={slipItems} />
        </div>
      </div>
      <BottomNav />
      <BetSlipBar items={slipItems} onOpen={() => setOpen(true)} />
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close bet slip" />
          <div className="sheet-up absolute inset-x-0 bottom-0 flex h-[min(82dvh,640px)] flex-col rounded-t-2xl bg-white shadow-2xl">
            <BetSlipPanel items={slipItems} onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="drawer-in relative h-full w-[80%] max-w-xs bg-white shadow-xl">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

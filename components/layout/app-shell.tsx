"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { BetSlipFab, BetSlipPanel } from "@/components/betting/bet-slip";
import { useBetSlip } from "@/store/bet-slip";
import { cn } from "@/lib/utils";

const BARE = ["/login", "/register", "/forgot-password", "/reset-password", "/admin"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const open = useBetSlip((s) => s.open);
  const setOpen = useBetSlip((s) => s.setOpen);
  const bare = BARE.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (bare) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-[#f4f5f7]">
      <Header onMenu={() => setMenuOpen(true)} />
      <div className="mx-auto flex max-w-[1440px]">
        <div className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] lg:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 bottom-pad">{children}</main>
        <div className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-[320px] shrink-0 xl:block">
          <BetSlipPanel embedded />
        </div>
      </div>
      <BottomNav />
      <BetSlipFab />
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="relative h-full w-[80%] max-w-xs bg-white shadow-xl">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
      {open ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close bet slip" />
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex h-[min(82dvh,640px)] flex-col rounded-t-2xl bg-white shadow-2xl",
            )}
          >
            <BetSlipPanel onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { SportsNav } from "@/components/layout/sports-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { BetSlipFab } from "@/components/betting/bet-slip-fab";
import { BetSlipPanel } from "@/components/betting/bet-slip";
import type { SlipItem } from "@/lib/slip";

const BARE = ["/login", "/register", "/forgot-password", "/reset-password", "/account", "/admin"];
const HIDE_TOP = ["/me", "/bets", "/virtuals"];
export const MOBILE_SLIP_ID = "mobile-betslip";

export function openMobileSlip() {
  document.getElementById(MOBILE_SLIP_ID)?.showPopover();
}

export function closeMobileSlip() {
  document.getElementById(MOBILE_SLIP_ID)?.hidePopover();
}

export function AppShell({ children, slipItems }: { children: ReactNode; slipItems: SlipItem[] }) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const bare = BARE.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const hideTop = HIDE_TOP.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      closeMobileSlip();
      setMenuOpen(false);
    }
  }, [pathname]);

  if (bare) return <>{children}</>;

  return (
    <div className="min-h-dvh bg-background">
      {hideTop ? null : (
        <div className="sticky top-0 z-40">
          <Header />
          <div className="hidden lg:block">
            <SportsNav />
          </div>
        </div>
      )}
      <div className="mx-auto flex max-w-[1440px]">
        <main className="min-w-0 flex-1 bottom-pad">
          {children}
          <SiteFooter />
        </main>
        <div className="sticky top-[5.75rem] hidden h-[calc(100dvh-5.75rem)] w-[300px] shrink-0 self-start lg:block">
          <BetSlipPanel embedded items={slipItems} />
        </div>
      </div>
      <BottomNav onOpenMenu={() => setMenuOpen(true)} />
      {hideTop ? null : <BetSlipFab key={slipItems.length} items={slipItems} onOpen={openMobileSlip} />}
      <div id={MOBILE_SLIP_ID} popover="auto" data-testid="betslip-sheet" className="betslip-popover lg:hidden">
        <BetSlipPanel items={slipItems} onClose={closeMobileSlip} />
      </div>
      {menuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="drawer-in relative h-full w-[80%] max-w-xs bg-white shadow-xl">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

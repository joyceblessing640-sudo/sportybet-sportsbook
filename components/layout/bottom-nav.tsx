"use client";

import Link from "next/link";
import { useId } from "react";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "az", label: "AZ Menu", icon: "az" },
  { href: "/games", label: "Games", icon: "games" },
  { href: "/bets", label: "Open Bets", icon: "bets" },
  { href: "/me", label: "Me", icon: "me" },
] as const;

export function BottomNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const gid = useId();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-black pb-[env(safe-area-inset-bottom)] text-white lg:hidden">
      <div className="grid h-14 grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href !== "az" && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const inner = (
            <>
              <span className="relative grid h-7 w-7 place-items-center">
                {item.icon === "home" ? <IconHomeS className="h-[26px] w-[26px] text-white" /> : null}
                {item.icon === "az" ? <IconAzMenu className="h-[24px] w-[24px] text-[#d6d6d6]" /> : null}
                {item.icon === "games" ? <IconGames gid={gid} className="h-[28px] w-[28px]" /> : null}
                {item.icon === "bets" ? <IconOpenBets className="h-[26px] w-[26px] text-[#c8c8c8]" /> : null}
                {item.icon === "me" ? (
                  <>
                    <IconMe className="h-[24px] w-[24px] text-[#c2c2c2]" />
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#e31837]" />
                  </>
                ) : null}
              </span>
              {item.icon === "home" ? (
                <span className="sr-only">Home</span>
              ) : (
                <span className="mt-[2px] text-[11px] font-normal leading-none text-[#b5b5b5]">{item.label}</span>
              )}
              {active ? <span className="absolute bottom-0 left-[4px] h-[4px] w-[52px] bg-[#e31837]" /> : null}
            </>
          );
          const className = "relative flex flex-col items-center pt-2";
          if (item.href === "az") {
            return (
              <button key={item.label} type="button" onClick={onOpenMenu} className={className} aria-label="AZ Menu">
                {inner}
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function IconHomeS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.15 6.55c-.92-1.62-2.62-2.52-5.05-2.52-3.82 0-6.22 2.12-6.22 4.95 0 2.52 1.72 3.92 5.12 4.72l1.68.44c1.92.5 2.62 1.12 2.62 2.12 0 1.32-1.32 2.22-3.32 2.22-2.02 0-3.52-.82-4.22-2.42l-2.72.96c1.02 2.92 3.82 4.42 7.02 4.42 4.22 0 6.62-2.32 6.62-5.32 0-2.62-1.72-4.12-5.32-5.02l-1.68-.44c-1.82-.46-2.52-1.02-2.52-2.02 0-1.16 1.06-2.02 2.82-2.02 1.62 0 2.82.72 3.42 2.02l2.72-.82Z" />
    </svg>
  );
}

function IconAzMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M5 7.4h14" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
      <path d="M5 16.6h14" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" />
    </svg>
  );
}

function IconGames({ className, gid }: { className?: string; gid: string }) {
  const fill = `${gid}-gp`;
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={fill} x1="16" y1="8" x2="16" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A074FF" />
          <stop offset="1" stopColor="#6C3EE8" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${fill})`}
        d="M9.6 10.2h12.8c2.55 0 4.55 1.55 5.35 3.95.7 2.1.35 4.55-1.05 6.15-1.05 1.2-2.55 1.9-4.15 1.9H9.45c-1.6 0-3.1-.7-4.15-1.9-1.4-1.6-1.75-4.05-1.05-6.15.8-2.4 2.8-3.95 5.35-3.95Z"
      />
      <path fill="#3F1F9E" d="M10.35 14.05h2.55v1.7H10.35v2.55H8.65v-2.55H6.1v-1.7h2.55v-2.55h1.7v2.55Z" />
      <circle cx="21.15" cy="14.35" r="1.7" fill="#5EE7FF" />
      <circle cx="23.85" cy="17.85" r="1.7" fill="#FFD24A" />
    </svg>
  );
}

function IconOpenBets({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 3.6a8.4 8.4 0 0 1 8.4 8.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path fill="currentColor" d="M18.7 10.05 21.95 13.4l1.05-4.05Z" />
      <path d="M12 20.4A8.4 8.4 0 0 1 3.6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path fill="currentColor" d="M5.3 13.95 2.05 10.6 1 14.65Z" />
      <path d="M12 7.6v8.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="M9.7 9.35c.5-.95 1.35-1.4 2.35-1.4 1.45 0 2.4.75 2.4 1.85 0 1-.85 1.55-2.5 1.95-1.7.4-2.55 1.15-2.55 2.25 0 1.2 1 2.05 2.6 2.05 1.1 0 1.95-.4 2.45-1.25"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <circle cx="12" cy="7.9" r="3.7" />
      <path d="M4.85 19.85c.25-4.05 3.25-6.45 7.15-6.45s6.9 2.4 7.15 6.45c.03.42-.32.75-.75.75H5.6c-.43 0-.78-.33-.75-.75Z" />
    </svg>
  );
}

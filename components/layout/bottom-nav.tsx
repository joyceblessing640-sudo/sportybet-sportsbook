"use client";

import Link from "next/link";
import { useId } from "react";
import { usePathname } from "next/navigation";
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
              <span className="relative grid h-6 w-6 place-items-center">
                {item.icon === "home" ? <IconHomeS className="h-[22px] w-[22px] text-white" /> : null}
                {item.icon === "az" ? <IconAzMenu className="h-[22px] w-[22px] text-[#d8d8d8]" /> : null}
                {item.icon === "games" ? <IconGames gid={gid} className="h-[24px] w-[24px]" /> : null}
                {item.icon === "bets" ? (
                  <>
                    <IconOpenBets className="h-[22px] w-[22px] text-[#cfcfcf]" />
                    <span className="absolute -right-[7px] -top-[5px] grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[#e31837] px-[3px] text-[9px] font-bold leading-none text-white">
                      3
                    </span>
                  </>
                ) : null}
                {item.icon === "me" ? (
                  <>
                    <IconMe className="h-[22px] w-[22px] text-[#c4c4c4]" />
                    <span className="absolute -right-[3px] -top-[2px] h-[7px] w-[7px] rounded-full bg-[#e31837]" />
                  </>
                ) : null}
              </span>
              {item.icon === "home" ? (
                <span className="sr-only">Home</span>
              ) : (
                <span className="mt-[3px] text-[11px] font-normal leading-none text-[#b3b3b3]">{item.label}</span>
              )}
              {active ? <span className="absolute bottom-0 left-[6px] h-[3px] w-[50px] bg-[#e31837]" /> : null}
            </>
          );
          const className = "relative flex flex-col items-center pt-[9px]";
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
      <path d="M4.5 7.25h15" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
      <path d="M4.5 12h15" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
      <path d="M4.5 16.75h15" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" />
    </svg>
  );
}

function IconGames({ className, gid }: { className?: string; gid: string }) {
  const fill = `${gid}-gp`;
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={fill} x1="16" y1="7" x2="16" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9B6DFF" />
          <stop offset="1" stopColor="#6B3FE8" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${fill})`}
        d="M11.2 9.4h9.6c3.9 0 6.7 2.05 7.55 5.35.55 2.15.15 4.7-1.2 6.35-1.1 1.35-2.75 2.1-4.55 2.1H9.4c-1.8 0-3.45-.75-4.55-2.1-1.35-1.65-1.75-4.2-1.2-6.35C4.5 11.45 7.3 9.4 11.2 9.4Z"
      />
      <path fill="#4E2DB8" d="M10.15 14.05h2.35v1.55H10.15v2.35H8.6v-2.35H6.25v-1.55H8.6v-2.35h1.55v2.35Z" />
      <circle cx="21.05" cy="14.15" r="1.55" fill="#5EE7FF" />
      <circle cx="23.55" cy="17.35" r="1.55" fill="#FFD24A" />
    </svg>
  );
}

function IconOpenBets({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M16.85 6.35A7.15 7.15 0 0 1 19.6 14.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16.2 4.85 17.15 7.9l-3.1.15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15 17.65A7.15 7.15 0 0 1 4.4 9.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.8 19.15 6.85 16.1l3.1-.15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.55v8.9M9.85 9.45c.45-.85 1.2-1.2 2.15-1.2 1.45 0 2.35.75 2.35 1.85 0 1.05-.85 1.6-2.45 1.95-1.7.35-2.55 1.05-2.55 2.15 0 1.2.95 2.05 2.55 2.05 1.05 0 1.85-.35 2.3-1.15"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <circle cx="12" cy="8.05" r="3.55" />
      <path d="M5.2 19.6c.2-3.85 3.05-6.15 6.8-6.15s6.6 2.3 6.8 6.15c.02.45-.35.8-.8.8H6c-.45 0-.82-.35-.8-.8Z" />
    </svg>
  );
}

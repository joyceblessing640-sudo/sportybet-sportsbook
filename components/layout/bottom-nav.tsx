"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./bottom-nav.css";

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
    <nav className="bn" aria-label="Primary">
      <div className="bn-row">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : item.href !== "az" && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const inner = (
            <>
              <span className="bn-icon">
                {item.icon === "home" ? (
                  <img
                    src="/nav/home-s.png"
                    alt=""
                    width={22}
                    height={26}
                    className="bn-s"
                    draggable={false}
                  />
                ) : null}
                {item.icon === "az" ? <IconAzMenu className="bn-menu" /> : null}
                {item.icon === "games" ? (
                  <img
                    src="/nav/games-icon.jpg"
                    alt=""
                    width={26}
                    height={18}
                    className="bn-games bn-games-img"
                    draggable={false}
                  />
                ) : null}
                {item.icon === "bets" ? (
                  <>
                    <IconOpenBets className="bn-bets" />
                    <span className="bn-badge">3</span>
                  </>
                ) : null}
                {item.icon === "me" ? (
                  <>
                    <IconMe className="bn-me" />
                    <span className="bn-dot" />
                  </>
                ) : null}
              </span>
              <span className="bn-label">{item.label}</span>
              {active ? <span className="bn-indicator" /> : null}
            </>
          );
          if (item.href === "az") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onOpenMenu}
                className="bn-item"
                aria-label="AZ Menu"
                data-active="false"
              >
                {inner}
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bn-item"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : "false"}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function IconAzMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} fill="currentColor" aria-hidden>
      <rect x="1" y="0.4" width="22" height="3.2" rx="1.15" />
      <rect x="1" y="6.4" width="22" height="3.2" rx="1.15" />
      <rect x="1" y="12.4" width="22" height="3.2" rx="1.15" />
    </svg>
  );
}

function IconOpenBets({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M16.7 5.15A8.05 8.05 0 0 1 20.1 12.1"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <path fill="currentColor" d="M19.05 4.2 16.2 7.55l4.35.15Z" />
      <path
        d="M7.3 18.85A8.05 8.05 0 0 1 3.9 11.9"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <path fill="currentColor" d="M4.95 19.8 7.8 16.45l-4.35-.15Z" />
      <path
        d="M9.55 9.15c.55-1.05 1.5-1.55 2.6-1.55 1.55 0 2.55.8 2.55 1.95 0 1.05-.85 1.6-2.55 2.05-1.85.5-2.8 1.25-2.8 2.45 0 1.35 1.15 2.25 2.9 2.25 1.2 0 2.15-.45 2.7-1.35"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M12.15 7.05v10.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconMe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <circle cx="12" cy="7.05" r="4.35" />
      <path d="M4.7 20.35c.2-4.35 3.35-6.55 7.3-6.55s7.1 2.2 7.3 6.55c.02.4-.32.7-.74.7H5.44c-.42 0-.76-.3-.74-.7Z" />
    </svg>
  );
}

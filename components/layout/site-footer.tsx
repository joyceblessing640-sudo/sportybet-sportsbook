"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function GhanaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      <rect width="24" height="16" rx="1.2" fill="#ce1126" />
      <rect y="5.33" width="24" height="5.34" fill="#fcd116" />
      <rect y="10.67" width="24" height="5.33" fill="#006b3f" />
      <path fill="#111" d="M12 5.7 12.95 8.4h2.7L13.6 10.05l.9 2.7L12 11.1l-2.5 1.65.9-2.7-2.05-1.65h2.7Z" />
    </svg>
  );
}

const SOCIAL = [
  { label: "Facebook", href: "/support", left: "29.2%", width: "8.2%" },
  { label: "X", href: "/support", left: "37.6%", width: "8.2%" },
  { label: "Instagram", href: "/support", left: "46.0%", width: "8.2%" },
  { label: "Telegram", href: "/support", left: "54.4%", width: "8.2%" },
  { label: "YouTube", href: "/support", left: "62.8%", width: "8.2%" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const fabVisible = !["/me", "/bets", "/virtuals"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-3 bg-[#e8eaed] px-3 py-2.5 text-[11px] text-[#4b5563] sm:px-4">
        <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
          <GhanaFlag className="h-3.5 w-5 shrink-0 rounded-[1px] shadow-sm" />
          18+
        </span>
        <p className="min-w-0 text-right leading-tight">© {year} SportyBets. All rights reserved.</p>
      </div>

      <footer className="bg-[#1b1d22] text-center text-white">
        <div className="relative mx-auto w-full max-w-[420px]">
          <img
            src="/footer/footer-provided.png"
            alt=""
            width={1080}
            height={1350}
            className="block h-auto w-full object-contain"
            draggable={false}
          />
          {SOCIAL.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="absolute"
              style={{ left: item.left, width: item.width, top: "32.5%", height: "6.5%" }}
            />
          ))}
          <Link
            href="/legal/terms"
            className="absolute"
            style={{ left: "32%", width: "23%", top: "87.5%", height: "4.5%" }}
          >
            <span className="sr-only">Terms & Conditions</span>
          </Link>
          <Link
            href="/about"
            className="absolute"
            style={{ left: "55%", width: "13%", top: "87.5%", height: "4.5%" }}
          >
            <span className="sr-only">About Us</span>
          </Link>
        </div>
      </footer>

      <div className="bg-[#1b1d22] px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "h-10 w-full rounded-md bg-[#3a3f46] text-[14px] font-bold text-white",
            fabVisible && "max-lg:pr-16",
          )}
        >
          Back to Top
        </button>
      </div>
    </div>
  );
}

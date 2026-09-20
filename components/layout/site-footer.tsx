"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
      <path d="M14.2 8.4V6.7c0-.7.5-1.1 1.2-1.1h1.1V3h-2.2C11.8 3 11 5 11 6.6v1.8H9v2.6h2V21h3.2v-10h2.1l.3-2.6h-2.4Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
      <path d="M4 4h4.1l4.2 6.1L17.2 4H20l-6.3 8.4L20.4 20h-4.1l-4.6-6.6L6.8 20H4l6.7-8.8L4 4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 2.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 2A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm5.15-3.55a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
      <path d="M19.7 5.3 3.9 11.3c-1.1.4-1.1 1 0 1.3l4 1.2 1.6 4.8c.2.6.1.8.7.8.4 0 .6-.2.8-.4l2.3-2.2 3.9 2.9c.7.5 1.3.2 1.5-.7L21 6.2c.3-1.1-.4-1.6-1.3-.9ZM8.7 13.5l7.8-4.8-6.1 5.8-.2 2.2-1.5-3.2Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
      <path d="M21.6 8.1a2.7 2.7 0 0 0-1.9-1.9C18 6 12 6 12 6s-6 0-7.7.2a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 3.9 2.7 2.7 0 0 0 1.9 1.9C6 18 12 18 12 18s6 0 7.7-.2a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-3.9ZM10 14.8V9.2L15.2 12 10 14.8Z" />
    </svg>
  );
}

const SOCIAL = [
  { label: "Facebook", href: "/support", bg: "bg-[#1877f2]", Icon: FacebookIcon },
  { label: "X", href: "/support", bg: "bg-black", Icon: XIcon },
  { label: "Instagram", href: "/support", bg: "bg-[#e4405f]", Icon: InstagramIcon },
  { label: "Telegram", href: "/support", bg: "bg-[#2aa1de]", Icon: TelegramIcon },
  { label: "YouTube", href: "/support", bg: "bg-[#ff0000]", Icon: YouTubeIcon },
] as const;

const PAYMENTS = [
  { id: "at", label: "at" },
  { id: "mtn", label: "MTN" },
  { id: "telecel", label: "telecel" },
  { id: "visa", label: "VISA" },
  { id: "mastercard", label: "MC" },
  { id: "bank", label: "Bank" },
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

      <footer className="bg-[#1b1d22] px-4 pb-4 pt-9 text-center text-white">
        <div className="mx-auto flex max-w-[420px] flex-col items-center">
          <div className="flex items-center gap-3">
            <Logo split />
            <span className="h-8 w-px bg-white/25" />
            <p className="text-left text-[11px] font-semibold leading-tight text-white/80">
              Demo sportsbook
              <br />
              Football · Live · Virtuals
            </p>
          </div>

          <p className="mt-6 text-[13px] text-white/55">Independent demo betting platform</p>

          <div className="mt-5 flex items-center justify-center gap-2.5">
            {SOCIAL.map((item) => {
              const Icon = item.Icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className={`grid h-9 w-9 place-items-center rounded-full ${item.bg}`}
                >
                  <Icon />
                </Link>
              );
            })}
          </div>

          <p className="mt-7 text-[12px] text-white/50">Paybill:</p>
          <p className="mt-1 text-[22px] font-black tracking-wide">*000*18#</p>
          <p className="mt-0.5 text-[10px] text-white/35">Demo short code · no real airtime billed</p>

          <p className="mt-6 text-[12px] text-white/50">Payment methods</p>
          <div className="mt-2.5 grid w-full max-w-[340px] grid-cols-3 gap-2">
            {PAYMENTS.map((item) => (
              <span
                key={item.id}
                className="grid h-11 place-items-center rounded-md bg-[#2a2e36] text-[13px] font-bold tracking-wide text-white/90"
              >
                {item.id === "mastercard" ? (
                  <span className="inline-flex items-center">
                    <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
                    <span className="-ml-2 h-4 w-4 rounded-full bg-[#f79e1b]/90" />
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-[360px] text-[11px] leading-relaxed text-white/45">
            Age 18 and above only. Play Responsibly. Betting is addictive and can be psychologically harmful. SportyBets
            is a software demonstration and is not licensed by any gaming commission. Not affiliated with any third-party
            betting brand.
          </p>

          <p className="mt-6 text-[12px] font-medium text-white/70">
            <Link href="/legal/terms" className="underline-offset-2 hover:underline">
              Terms & Conditions
            </Link>
            <span className="px-2 text-white/30">|</span>
            <Link href="/about" className="underline-offset-2 hover:underline">
              About Us
            </Link>
          </p>
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

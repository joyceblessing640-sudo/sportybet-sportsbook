import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  dark = false,
}: {
  className?: string;
  href?: string;
  dark?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-1.5 shrink-0", className)} aria-label="SportyBets home">
      <span
        className={cn(
          "grid h-7 w-7 place-items-center rounded-md font-black",
          dark ? "bg-brand text-white" : "bg-white/15 text-white",
        )}
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <circle cx="16" cy="16" r="13" fill="currentColor" opacity="0.14" />
          <path
            d="M16 5.5c-2.2 3.1-3.4 6.6-3.4 10.5S13.8 23.4 16 26.5c2.2-3.1 3.4-6.6 3.4-10.5S18.2 8.6 16 5.5Z"
            fill="currentColor"
            opacity="0.4"
          />
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
      <span className={cn("text-[17px] font-black tracking-tight leading-none", dark ? "text-ink" : "text-white")}>
        Sporty<span className={dark ? "text-brand" : "text-[#8dffb8]"}>Bets</span>
      </span>
    </Link>
  );
}

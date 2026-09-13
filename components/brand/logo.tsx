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
    <Link href={href} className={cn("flex items-center gap-1.5 shrink-0", className)} aria-label="SPORTBET home">
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-md font-black italic",
          dark ? "bg-brand text-white" : "bg-white text-brand",
        )}
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
          <circle cx="16" cy="16" r="13" fill="currentColor" opacity="0.12" />
          <path
            d="M16 5.5c-2.2 3.1-3.4 6.6-3.4 10.5S13.8 23.4 16 26.5c2.2-3.1 3.4-6.6 3.4-10.5S18.2 8.6 16 5.5Z"
            fill="currentColor"
            opacity="0.35"
          />
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M6 12.5h20M6 19.5h20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.7"
          />
        </svg>
      </span>
      <span className={cn("text-[20px] font-black italic tracking-tight leading-none", dark ? "text-brand" : "text-white")}>
        SPORT<span className={dark ? "text-ink" : "text-white"}>BET</span>
      </span>
    </Link>
  );
}

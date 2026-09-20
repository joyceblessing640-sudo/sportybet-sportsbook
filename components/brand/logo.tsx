import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  dark = false,
  split = false,
}: {
  className?: string;
  href?: string;
  dark?: boolean;
  split?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex shrink-0 items-center", className)} aria-label="SportyBets home">
      {split ? (
        <span className="text-[22px] font-black italic leading-none tracking-[-0.04em]">
          <span className="text-header">Sporty</span>
          <span className="text-white">Bets</span>
        </span>
      ) : (
        <span
          className={cn(
            "text-[21px] font-black italic leading-none tracking-[-0.04em]",
            dark ? "text-header" : "text-white",
          )}
        >
          SportyBets
        </span>
      )}
    </Link>
  );
}

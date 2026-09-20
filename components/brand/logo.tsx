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
        <span className="text-[18px] font-black italic leading-none tracking-[-0.04em] min-[412px]:text-[19px] lg:text-[22px]">
          <span className="text-header">Sporty</span>
          <span className="text-white">Bets</span>
        </span>
      ) : (
        <span
          className={cn(
            "text-[17px] font-black italic leading-none tracking-[-0.04em] min-[412px]:text-[18px] lg:text-[21px]",
            dark ? "text-header" : "text-white",
          )}
        >
          SportyBets
        </span>
      )}
    </Link>
  );
}

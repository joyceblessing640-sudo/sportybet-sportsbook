"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ClientTeam } from "@/lib/serialize";

export function TeamLogo({
  team,
  size = "md",
}: {
  team: ClientTeam;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [failed, setFailed] = useState(false);
  const dim =
    size === "sm"
      ? "h-4 w-4 text-[7px]"
      : size === "xl"
        ? "h-9 w-9 text-[11px] min-[412px]:h-10 min-[412px]:w-10"
        : size === "lg"
          ? "h-8 w-8 text-[10px] min-[412px]:h-9 min-[412px]:w-9"
          : "h-7 w-7 text-[10px]";
  const px = size === "sm" ? 16 : size === "xl" ? 40 : size === "lg" ? 36 : 28;

  if (team.logoUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- API crests need object-contain and an onError fallback
      <img
        src={team.logoUrl}
        alt=""
        width={px}
        height={px}
        className={cn("shrink-0 object-contain object-center", dim)}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-black text-white shadow-sm ring-2 ring-white",
        dim,
      )}
      style={{ background: team.color }}
      aria-hidden
    >
      {team.abbreviation.slice(0, 3)}
    </span>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ClientTeam } from "@/lib/serialize";

export function TeamLogo({
  team,
  size = "md",
}: {
  team: ClientTeam;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const dim = size === "sm" ? "h-5 w-5 text-[8px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-[11px]";
  const px = size === "sm" ? 20 : size === "lg" ? 48 : 36;

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

import { cn } from "@/lib/utils";
import type { ClientTeam } from "@/lib/serialize";

export function TeamBadge({ team, size = "md" }: { team: ClientTeam; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-5 w-5 text-[8px]" : size === "lg" ? "h-14 w-14 text-base" : "h-9 w-9 text-[11px]";
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

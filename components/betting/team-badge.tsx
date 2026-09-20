"use client";

import { TeamLogo } from "@/components/betting/team-logo";
import type { ClientTeam } from "@/lib/serialize";

export function TeamBadge({ team, size = "md" }: { team: ClientTeam; size?: "sm" | "md" | "lg" }) {
  return <TeamLogo team={team} size={size} />;
}

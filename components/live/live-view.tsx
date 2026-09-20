"use client";

import { LiveBoard } from "@/components/live/live-board";
import type { ClientMatch } from "@/lib/serialize";

export function LiveView({ matches }: { matches: ClientMatch[] }) {
  return (
    <div className="min-h-[calc(100dvh-8rem)] bg-live">
      <LiveBoard matches={matches} />
    </div>
  );
}

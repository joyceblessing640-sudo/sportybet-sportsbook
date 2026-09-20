"use client";

import { LiveBoard } from "@/components/live/live-board";
import { useFootballSnapshot } from "@/components/football/use-football-snapshot";
import type { ClientMatch } from "@/lib/serialize";

export function LiveView({ matches, feedError = null }: { matches: ClientMatch[]; feedError?: string | null }) {
  const feed = useFootballSnapshot({ live: matches, error: feedError, scope: "live" });
  return (
    <div className="min-h-[calc(100dvh-8rem)] bg-live">
      <LiveBoard matches={feed.live} feedError={feed.error} />
    </div>
  );
}

import { MatchCardSkeleton, LeagueChipSkeleton } from "@/components/betting/skeletons";

export default function Loading() {
  return (
    <div className="min-h-[calc(100dvh-8.5rem)] bg-live p-3">
      <LeagueChipSkeleton />
      <MatchCardSkeleton count={6} />
    </div>
  );
}

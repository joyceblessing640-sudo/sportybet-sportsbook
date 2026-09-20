import { MatchCardSkeleton, LeagueChipSkeleton } from "@/components/betting/skeletons";

export default function Loading() {
  return (
    <div className="space-y-3 py-2">
      <LeagueChipSkeleton />
      <div className="px-3">
        <MatchCardSkeleton count={5} />
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function MatchCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-6">
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-4" />
        </div>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid grid-cols-[1fr_140px] gap-3 border-t border-line px-3 py-2.5">
          <div>
            <Skeleton className="mb-2 h-3 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LeagueChipSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden px-3 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-24 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

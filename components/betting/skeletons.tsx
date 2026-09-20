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
        <div key={i} className="grid grid-cols-[minmax(0,1fr)_8.25rem] gap-1.5 border-t border-line px-2.5 py-1">
          <div>
            <Skeleton className="mb-1 h-2.5 w-40" />
            <Skeleton className="mb-1 h-3.5 w-28" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-1 h-2.5 w-10" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 flex-1" />
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

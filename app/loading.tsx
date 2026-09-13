import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-28 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-20 w-40" />
        <Skeleton className="h-20 w-40" />
        <Skeleton className="h-20 w-40" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

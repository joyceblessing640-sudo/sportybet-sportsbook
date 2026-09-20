export default function LiveLoading() {
  return (
    <div className="min-h-[calc(100dvh-8rem)] bg-live">
      <div className="flex gap-3 px-3 pt-3">
        <div className="h-4 w-10 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-3 space-y-2 px-3 pb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[1fr_9.75rem] gap-3 border-b border-white/10 py-2">
            <div>
              <div className="mb-2 h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
              <div className="mt-1.5 h-3 w-28 animate-pulse rounded bg-white/10" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-8 flex-1 animate-pulse rounded bg-white/10" />
              <div className="h-8 flex-1 animate-pulse rounded bg-white/10" />
              <div className="h-8 flex-1 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

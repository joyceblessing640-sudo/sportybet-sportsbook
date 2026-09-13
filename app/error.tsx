"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-black">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">{error.message || "Please try again."}</p>
      <button type="button" onClick={reset} className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-bold text-white">
        Retry
      </button>
    </div>
  );
}

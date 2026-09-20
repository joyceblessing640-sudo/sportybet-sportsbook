import { cn } from "@/lib/utils";

export function SparkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#e31837" d="M12 1.4 14.6 9.4 22.6 12 14.6 14.6 12 22.6 9.4 14.6 1.4 12 9.4 9.4Z" />
    </svg>
  );
}

export function LeagueMark({
  kind,
  className,
}: {
  kind: "pl" | "l1" | "bolt" | "bird" | "a" | "player";
  className?: string;
}) {
  const common = cn("h-7 w-7 text-[#6b7280]", className);
  if (kind === "pl") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
        <path d="M7.2 16.8h9.6v1.8H7.2Zm.9-2.2.9-8.2h6l.9 8.2Zm3.9-9.2 1.3 1.2h1.8L12 3.8 8.9 6.6h1.8L12 5.4Z" />
      </svg>
    );
  }
  if (kind === "l1") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M10 5.5c2.4 0 3.4 1.2 3.4 3.1 0 1.7-1 2.6-2.6 3.4L8.2 19h3.2L16.6 8.4c.3-1.8-.6-4.4-4.6-4.4-2.6 0-4.6 1.4-4.6 3.6h2.4c0-.9.7-1.5 1.8-1.5Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "bolt") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
        <path d="M13.2 3 6.4 13.2h4.2L8.8 21 17.6 10.2h-4.4L13.2 3Z" />
      </svg>
    );
  }
  if (kind === "bird") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden>
        <path d="M16.5 4.8c-2 1.2-3.1 3.2-3.3 5.4-1.6-1-3.6-1.6-6.2-1.6v2.2c2.6 0 4.4.6 5.6 1.6-.6 2.3-2.2 4.2-4.8 5.5l1.1 2c3.4-1.6 5.4-4.1 6.2-7.1 1.1.4 2.4.5 4 .3l.3-2.2c-1.2.1-2.3 0-3.2-.3.1-1.6.8-3 2.2-4.1l-1.9-1.7Z" />
      </svg>
    );
  }
  if (kind === "a") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="m12 5 6.4 14h-2.6l-1.2-2.8H9.4L8.2 19H5.6L12 5Zm0 4.4-1.8 4.2h3.6L12 9.4Z" fill="#3b82f6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="#f4c6c6" />
      <path d="M10 16.5c1.2 1.6 2.8 2.2 4.4 1.4M9 8.2c1.4-1 3.4-1 4.8.2" stroke="#c2413b" strokeWidth="1.6" />
      <circle cx="9.2" cy="11.4" r="1.3" fill="#1f2937" />
    </svg>
  );
}

import { cn } from "@/lib/utils";

export function SportIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const cls = cn("h-5 w-5", className);
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.8Z" fill="currentColor" />
        </svg>
      );
    case "football":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 8.2 14.4 10l-.9 2.8h-3L9.6 10 12 8.2Z" fill="currentColor" />
          <path d="M8 7.2 12 4.8l4 2.4M4.8 13.2l3.2-1M19.2 13.2l-3.2-1M9.2 19.2l.8-3.2M14.8 19.2l-.8-3.2" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "live":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          <path d="M7.2 7.2a6.8 6.8 0 0 0 0 9.6M16.8 7.2a6.8 6.8 0 0 1 0 9.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "basketball":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 3v18M3 12h18M6 6c3.4 3.2 3.4 8.8 0 12M18 6c-3.4 3.2-3.4 8.8 0 12" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "tennis":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M5 8c4 1.2 6.2 4.6 7 9.4M19 8c-4 1.2-6.2 4.6-7 9.4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "esports":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <rect x="3.5" y="8" width="17" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 12.5h2.2M9.1 11.4v2.2M15.2 12.2h.1M17 12.2h.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "virtuals":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <path d="M5 17 12 5l7 12H5Z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="13.2" r="1.6" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}

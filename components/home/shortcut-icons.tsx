import { cn } from "@/lib/utils";

export function IconAllSports({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="8.2" cy="14.2" r="5.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 9.1c1.3 1.3 2.1 3.1 2.1 5.1s-.8 3.8-2.1 5.1M3.1 14.2h10.2M4.4 11.1c1.3.6 2.6.9 3.8.9s2.5-.3 3.8-.9M4.4 17.3c1.3-.6 2.6-.9 3.8-.9s2.5.3 3.8.9" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="15.6" cy="9.4" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.6 5v8.8M11.2 9.4h8.8M12.6 6.6c.9 1.7 1.9 2.8 3 2.8s2.1-1.1 3-2.8M12.6 12.2c.9-1.7 1.9-2.8 3-2.8s2.1 1.1 3 2.8" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10.6" cy="6.2" r="3.05" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.2 4.7c1.4.7 3.4.7 4.8 0M8.2 7.7c1.4-.7 3.4-.7 4.8 0" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function IconLiveTv({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="5.5" width="18" height="13.5" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9.4v5.4l5.2-2.7L10 9.4Z" fill="currentColor" />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCrash({ className }: { className?: string }) {
  return <IconAviator className={className} />;
}

export function IconAviator({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-[#d0122d]", className)} fill="currentColor" aria-hidden>
      <path d="M2.8 12.2 21.2 5.4c.55-.2.95.45.62.92L14.4 20.8c-.28.4-.9.32-1.06-.14l-1.7-5.1-5.5-1.55c-.85-.24-.95-1.35-.14-1.72l.8-.4Z" />
      <path d="M11.2 14.7 15.4 8.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.2 13.2h6.4" stroke="#fff" strokeWidth="1.15" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export function IconLoadCode({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="7.2" r="2.35" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6.4" cy="16.6" r="2.35" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="16.6" r="2.35" stroke="currentColor" strokeWidth="1.8" />
      <path d="m10.2 8.8-2.4 5.3M13.8 8.8l2.4 5.3M8.7 16.6h6.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconVirtuals({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M3.8 6.2 12 20.2 20.2 6.2" stroke="currentColor" strokeWidth="2.05" strokeLinejoin="round" />
      <path d="M7.6 6.2 12 14.4 16.4 6.2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMore({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7.8" cy="12" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
      <circle cx="16.2" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function IconHomeS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.2 6.6c-.9-1.6-2.6-2.5-5-2.5-3.8 0-6.2 2.1-6.2 4.9 0 2.5 1.7 3.9 5.1 4.7l1.7.45c1.9.5 2.6 1.1 2.6 2.1 0 1.3-1.3 2.2-3.3 2.2-2 0-3.5-.8-4.2-2.4l-2.7.95c1 2.9 3.8 4.4 7 4.4 4.2 0 6.6-2.3 6.6-5.3 0-2.6-1.7-4.1-5.3-5l-1.7-.45c-1.8-.45-2.5-1-2.5-2 0-1.15 1.05-2 2.8-2 1.6 0 2.8.7 3.4 2l2.7-.8Z" />
    </svg>
  );
}

export function IconOpenBets({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M7.2 6.4A7.2 7.2 0 1 1 5 12.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M5 6.2v4.2h4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 9.2v4l2.6 1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconFootball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.2 14.4 9l-.8 2.8h-3.2L9.6 9 12 7.2Z" fill="currentColor" />
      <path d="m14.4 9 3.3.4M9.6 9l-3.3.4M13.6 11.8l1.7 3.1M10.4 11.8 8.7 14.9M12 16.2v2.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

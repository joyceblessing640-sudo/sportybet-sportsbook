import { cn } from "@/lib/utils";

export function IconAllSports({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconLiveTv({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="2.5" y="6" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 6 12 2.8 16 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCrash({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("text-[#c81e3a]", className)} fill="currentColor" aria-hidden>
      <path d="M21 4.2 13.8 11l2.6 6.2-1.8.8-2.2-5.1-2.9 2.8v3.3h-1.6v-3.3l-3.4-3.4H2.8V11h3.3l4.6-4.5L21 4.2Z" />
    </svg>
  );
}

export function IconLoadCode({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="6.5" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12h3.2M14.8 7.6l-2.2 3.2M14.8 16.4l-2.2-3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconVirtuals({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M4 6.5 12 20 20 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M8.2 6.5h7.6" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function IconMore({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.2" cy="13.2" r="1.05" fill="currentColor" />
      <circle cx="15.8" cy="13.2" r="1.05" fill="currentColor" />
      <path d="M8.6 16.1c1 1.2 2.1 1.8 3.4 1.8s2.4-.6 3.4-1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

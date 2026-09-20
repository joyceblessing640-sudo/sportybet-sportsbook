"use client";

import Link from "next/link";

export function InstantFootballView() {
  return (
    <div className="relative bg-white">
      <Link href="/virtuals" aria-label="Back to Virtuals" className="absolute left-0 top-0 z-10 h-12 w-12" />
      {/* Exact Instant Football image. Not edited. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/virtuals/if-england.jpg" alt="Instant Football" className="block h-auto w-full max-w-full" />
    </div>
  );
}

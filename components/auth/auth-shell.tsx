"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <span aria-hidden className="text-base leading-none">
            🇬🇭
          </span>
          Ghana
        </p>
        <Link href="/" aria-label="Close" className="grid h-9 w-9 place-items-center text-[#6b7280]">
          <X className="h-5 w-5" />
        </Link>
      </header>
      <div className="flex flex-1 flex-col px-5 pb-8">{children}</div>
    </div>
  );
}

export function PhoneField({
  id = "phone",
  name = "phone",
  defaultValue,
  autoFocus,
  required,
}: {
  id?: string;
  name?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex h-12 items-center rounded-md border border-[#d7dbe2] bg-white focus-within:border-[#12a150]">
      <span className="shrink-0 border-r border-[#e5e7eb] px-3 text-sm text-[#6b7280]">+233</span>
      <input
        id={id}
        name={name}
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="Mobile Number"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        required={required}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#9aa3b2]"
      />
    </label>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm font-semibold text-[#12a150]">
      {children}
    </Link>
  );
}

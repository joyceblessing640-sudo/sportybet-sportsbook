"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MORE_SPORTS, PRIMARY_SPORTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SportsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="border-b border-white/10 bg-[#0f4a38] text-white">
      <div className="mx-auto flex max-w-[1440px] items-stretch">
        <nav className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto">
          {PRIMARY_SPORTS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "relative shrink-0 px-3 py-2 text-[12px] font-semibold text-white/80 transition-colors duration-200 hover:text-white",
                  active && "text-white",
                )}
              >
                {item.label}
                {active ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-[#8dffb8]" /> : null}
              </Link>
            );
          })}
        </nav>
        <div ref={wrap} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-full items-center gap-1 px-3 text-[12px] font-semibold text-white/85 hover:text-white"
          >
            More <span className="hidden sm:inline">Sports</span>{" "}
            <ChevronDown className={cn("inline h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} />
          </button>
          {open ? (
            <div className="absolute right-0 top-full z-40 w-[min(92vw,280px)] rounded-b-md border border-line bg-white py-1 shadow-lg">
              {MORE_SPORTS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-[13px] text-ink hover:bg-brand-soft hover:text-brand"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

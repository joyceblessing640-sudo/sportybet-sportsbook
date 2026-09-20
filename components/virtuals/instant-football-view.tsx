"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BOARDS = [
  { id: "england", label: "England", src: "/virtuals/if-england.jpg", status: false },
  { id: "spain", label: "Spain", src: "/virtuals/if-spain.jpg", status: true },
  { id: "germany", label: "Germany", src: "/virtuals/if-germany.jpg", status: true },
  { id: "italy", label: "Italy", src: "/virtuals/if-italy.jpg", status: false },
  { id: "champions", label: "Champions", src: "/virtuals/if-champions.jpg", status: false },
  { id: "euros", label: "Euros", src: "/virtuals/if-euros.jpg", status: true },
  { id: "cwc", label: "Club World Cup", src: "/virtuals/if-cwc.jpg", status: true },
] as const;

type BoardId = (typeof BOARDS)[number]["id"];

export function InstantFootballView() {
  const [tab, setTab] = useState<BoardId>("england");
  const board = BOARDS.find((item) => item.id === tab) ?? BOARDS[0];
  const tabTop = board.status ? "10.15%" : "6.45%";
  const backTop = board.status ? "3.5%" : "0.35%";

  return (
    <div className="relative bg-white">
      {/* Exact Instant Football screenshots. Files are not edited. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={board.src} alt={`Instant Football ${board.label}`} className="block h-auto w-full max-w-full" />
      <Link
        href="/virtuals"
        aria-label="Back to Virtuals"
        className="absolute left-0 z-10 w-[12%]"
        style={{ top: backTop, height: "6.2%" }}
      />
      <nav
        className="no-scrollbar absolute left-0 right-0 z-10 flex overflow-x-auto bg-[#2f333b]"
        style={{ top: tabTop, height: "5.5%" }}
      >
        {BOARDS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "h-full shrink-0 px-3 text-[13px] font-semibold leading-none",
              tab === item.id ? "border-b-[3px] border-[#12a150] text-white" : "text-white/85",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

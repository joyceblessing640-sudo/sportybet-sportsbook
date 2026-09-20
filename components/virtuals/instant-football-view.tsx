"use client";

import { useState } from "react";
import Link from "next/link";
import { InstantSlipPanel, INSTANT_SLIP_ID, openInstantSlip } from "@/components/virtuals/instant-slip";

const BOARDS = [
  {
    id: "england",
    label: "England",
    src: "/virtuals/if-england.jpg",
    status: false,
    tabs: ["england", "spain", "germany", "italy", "champions"],
  },
  {
    id: "spain",
    label: "Spain",
    src: "/virtuals/if-spain.jpg",
    status: true,
    tabs: ["england", "spain", "germany", "italy", "champions"],
  },
  {
    id: "germany",
    label: "Germany",
    src: "/virtuals/if-germany.jpg",
    status: true,
    tabs: ["england", "spain", "germany", "italy", "champions"],
  },
  {
    id: "italy",
    label: "Italy",
    src: "/virtuals/if-italy.jpg",
    status: false,
    tabs: ["spain", "germany", "italy", "champions", "euros"],
  },
  {
    id: "champions",
    label: "Champions",
    src: "/virtuals/if-champions.jpg",
    status: false,
    tabs: ["spain", "germany", "italy", "champions", "euros"],
  },
  {
    id: "euros",
    label: "Euros",
    src: "/virtuals/if-euros.jpg",
    status: false,
    tabs: ["germany", "italy", "champions", "euros", "cwc"],
  },
  {
    id: "cwc",
    label: "Club World Cup",
    src: "/virtuals/if-cwc.jpg",
    status: true,
    tabs: ["italy", "champions", "euros", "cwc"],
  },
] as const;

type BoardId = (typeof BOARDS)[number]["id"];

export function InstantFootballView() {
  const [tab, setTab] = useState<BoardId>("england");
  const board = BOARDS.find((item) => item.id === tab) ?? BOARDS[0];
  const headerTop = board.status ? "4.2%" : "0%";
  const headerHeight = board.status ? "5.4%" : "5.8%";
  const tabTop = board.status ? "9.8%" : "5.8%";
  const tabHeight = board.status ? "5.6%" : "6.2%";
  const footerTop = board.status ? "92.2%" : "93.6%";

  return (
    <div className="relative bg-white">
      {/* Exact Instant Football screenshots. Files are not edited. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={board.src} alt={`Instant Football ${board.label}`} className="block h-auto w-full max-w-full" />

      <Link
        href="/virtuals"
        aria-label="Back to Virtuals"
        className="absolute left-0 z-10 w-[14%]"
        style={{ top: headerTop, height: headerHeight }}
      />
      <Link
        href="/register"
        aria-label="Register"
        className="absolute z-10 w-[18%]"
        style={{ top: headerTop, height: headerHeight, right: "16%" }}
      />
      <Link
        href="/login"
        aria-label="Login"
        className="absolute right-0 z-10 w-[16%]"
        style={{ top: headerTop, height: headerHeight }}
      />

      <div className="absolute left-0 right-0 z-10 flex" style={{ top: tabTop, height: tabHeight }}>
        {board.tabs.map((id) => (
          <button
            key={id}
            type="button"
            aria-label={BOARDS.find((item) => item.id === id)?.label}
            onClick={() => setTab(id)}
            className="h-full flex-1"
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Next Round"
        className="absolute left-0 z-10 w-1/2"
        style={{ top: footerTop, bottom: 0 }}
      />
      <button
        type="button"
        aria-label="Open betslip"
        onClick={openInstantSlip}
        className="absolute right-0 z-10 w-1/2"
        style={{ top: footerTop, bottom: 0 }}
      />

      <div id={INSTANT_SLIP_ID} popover="auto" className="betslip-popover">
        <InstantSlipPanel />
      </div>
    </div>
  );
}

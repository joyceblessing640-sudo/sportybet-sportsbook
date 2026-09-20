"use client";

import { useState } from "react";
import { ChevronDown, Share2 } from "lucide-react";
import type { ClientMatch } from "@/lib/serialize";
import { formatOdds } from "@/lib/money";
import { loadCodeAction } from "@/app/actions/slip";
import { format } from "date-fns";
import { IconFootball } from "@/components/home/shortcut-icons";
import { cn } from "@/lib/utils";

export function RecommendedCodes({ matches }: { matches: ClientMatch[] }) {
  const [open, setOpen] = useState(true);
  const codes = [
    { code: "SB7K2Q", picks: matches.slice(0, 4) },
    { code: "D5P6AF", picks: matches.slice(2, 6) },
  ].filter((c) => c.picks.length > 0);

  if (codes.length === 0) return null;

  return (
    <section className="bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-2.5 text-left text-[14px] font-bold"
      >
        <span className="text-accent">★</span> Recommended Football Codes
        <ChevronDown className={cn("ml-auto h-4 w-4 text-muted transition-transform duration-200", !open && "-rotate-90")} />
      </button>
      {open ? (
        <div>
          {codes.map((code) => {
            const outcomeIds = code.picks
              .map((match) => (match.markets.find((m) => m.type === "1X2") ?? match.markets[0])?.outcomes[0]?.id)
              .filter(Boolean)
              .join(",");
            const total = Math.round(
              code.picks.reduce((acc, match) => {
                const o = (match.markets.find((m) => m.type === "1X2") ?? match.markets[0])?.outcomes[0];
                return acc * ((o?.odds ?? 100) / 100);
              }, 1) * 100,
            );
            return (
              <article key={code.code} className="border-t border-[#f1f3f7]">
                <div className="flex items-center bg-[#e7f5ee] px-3 py-2 text-[13px]">
                  <span className="font-black tracking-wide">{code.code}</span>
                  <span className="ml-auto text-[12px] text-[#4b5563]">
                    Folds: <strong className="text-ink">{code.picks.length}</strong>
                  </span>
                  <span className="ml-4 text-[12px] text-[#4b5563]">
                    Odds: <strong className="text-ink">{formatOdds(total)}</strong>
                  </span>
                </div>
                <ul className="px-3">
                  {code.picks.map((match) => {
                    const market = match.markets.find((m) => m.type === "1X2") ?? match.markets[0];
                    const o = market?.outcomes[0];
                    return (
                      <li key={match.id} className="flex items-start gap-2 border-b border-[#f3f4f6] py-2 last:border-0">
                        <IconFootball className="mt-0.5 h-4 w-4 shrink-0 text-[#9aa3b2]" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-semibold text-ink">
                            {o?.label ?? "Home"} @{o ? formatOdds(o.odds) : "—"} | {market?.name ?? "1X2"}
                          </span>
                          <span className="block text-[11px] text-muted">
                            {match.home.shortName} vs {match.away.shortName}
                          </span>
                        </span>
                        <span className="shrink-0 text-[11px] text-muted">
                          {format(new Date(match.startTime), "dd/MM HH:mm")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-center justify-between px-3 py-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent"
                    onClick={() => {
                      void navigator.clipboard?.writeText(code.code);
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5" /> Share
                  </button>
                  <form action={loadCodeAction}>
                    <input type="hidden" name="outcomeIds" value={outcomeIds} />
                    <button type="submit" className="rounded-md bg-accent px-3 py-1.5 text-[13px] font-bold text-white">
                      Add to Betslip
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

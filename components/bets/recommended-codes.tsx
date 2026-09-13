"use client";

import { useBetSlip } from "@/store/bet-slip";
import type { ClientMatch } from "@/lib/serialize";
import { formatOdds } from "@/lib/money";
import { toast } from "sonner";

export function RecommendedCodes({ matches }: { matches: ClientMatch[] }) {
  const add = useBetSlip((s) => s.addFromMatch);
  const setOpen = useBetSlip((s) => s.setOpen);
  const codes = [
    { code: "SB7K2Q", picks: matches.slice(0, 3) },
    { code: "D5P6AF", picks: matches.slice(3, 6) },
  ].filter((c) => c.picks.length > 0);

  function load(code: (typeof codes)[number]) {
    for (const match of code.picks) {
      const market = match.markets.find((m) => m.type === "1X2") ?? match.markets[0];
      const outcome = market?.outcomes[0];
      if (market && outcome) add(match, market.name, outcome);
    }
    setOpen(true);
    toast.success(`Loaded demo code ${code.code}`);
  }

  if (codes.length === 0) return null;

  return (
    <section className="p-3">
      <h2 className="mb-2 text-sm font-bold">Recommended Football Codes</h2>
      <p className="mb-3 text-xs text-muted">Demo booking codes built from featured sample matches.</p>
      <div className="space-y-3">
        {codes.map((code) => (
          <article key={code.code} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#e7f7ee] px-3 py-2 text-sm">
              <span className="font-black">{code.code}</span>
              <span className="text-xs">
                Folds: {code.picks.length} · Odds:{" "}
                {formatOdds(
                  Math.round(
                    code.picks.reduce((acc, match) => {
                      const o = (match.markets.find((m) => m.type === "1X2") ?? match.markets[0])?.outcomes[0];
                      return acc * ((o?.odds ?? 100) / 100);
                    }, 1) * 100,
                  ),
                )}
              </span>
            </div>
            <ul className="px-3 py-2 text-xs text-[#4b5563]">
              {code.picks.map((match) => (
                <li key={match.id} className="py-1">
                  Home @ {match.home.shortName} vs {match.away.shortName}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => load(code)}
              className="w-full bg-brand py-2 text-sm font-bold text-white"
            >
              Add to Betslip
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

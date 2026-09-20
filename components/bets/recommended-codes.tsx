import type { ClientMatch } from "@/lib/serialize";
import { formatOdds } from "@/lib/money";
import { loadCodeAction } from "@/app/actions/slip";

export function RecommendedCodes({ matches }: { matches: ClientMatch[] }) {
  const codes = [
    { code: "SB7K2Q", picks: matches.slice(0, 3) },
    { code: "D5P6AF", picks: matches.slice(3, 6) },
  ].filter((c) => c.picks.length > 0);

  if (codes.length === 0) return null;

  return (
    <section className="p-3">
      <h2 className="mb-2 text-sm font-bold">Recommended Football Codes</h2>
      <p className="mb-3 text-xs text-muted">Demo booking codes built from featured sample matches.</p>
      <div className="space-y-3">
        {codes.map((code) => {
          const outcomeIds = code.picks
            .map((match) => (match.markets.find((m) => m.type === "1X2") ?? match.markets[0])?.outcomes[0]?.id)
            .filter(Boolean)
            .join(",");
          return (
            <article key={code.code} className="overflow-hidden rounded-md border border-line bg-white">
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
              <form action={loadCodeAction}>
                <input type="hidden" name="outcomeIds" value={outcomeIds} />
                <button type="submit" className="w-full bg-brand py-2 text-sm font-bold text-white">
                  Add to Betslip
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}

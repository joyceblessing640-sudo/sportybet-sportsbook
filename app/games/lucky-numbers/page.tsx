"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function draw() {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 9) + 1);
}

export default function LuckyNumbersPage() {
  const [picks, setPicks] = useState([1, 2, 3]);
  const [result, setResult] = useState<number[] | null>(null);

  const matched = useMemo(() => {
    if (!result) return 0;
    return picks.filter((n, i) => n === result[i]).length;
  }, [picks, result]);

  return (
    <div className="p-4">
      <Link href="/games" className="text-sm font-semibold text-brand">
        ‹ Games
      </Link>
      <h1 className="mt-3 text-xl font-black">Lucky Numbers</h1>
      <p className="mt-1 text-sm text-muted">
        Pick three digits and watch a demo draw. There is no stake and no payout in this environment.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {picks.map((n, i) => (
          <select
            key={i}
            value={n}
            onChange={(e) => {
              const next = [...picks];
              next[i] = Number(e.target.value);
              setPicks(next);
              setResult(null);
            }}
            className="h-14 rounded-xl bg-white text-center text-xl font-black"
          >
            {Array.from({ length: 9 }, (_, d) => (
              <option key={d + 1} value={d + 1}>
                {d + 1}
              </option>
            ))}
          </select>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setResult(draw())}
        className="mt-4 h-12 w-full rounded-md bg-brand text-sm font-bold text-white"
      >
        Draw (demo)
      </button>
      {result ? (
        <div className="mt-4 rounded-xl bg-white p-4 text-center">
          <p className="text-xs text-muted">Drawn</p>
          <p className="mt-1 text-3xl font-black tracking-[0.3em]">{result.join(" ")}</p>
          <p className="mt-2 text-sm">{matched} matching position{matched === 1 ? "" : "s"} · no prize credited</p>
        </div>
      ) : null}
    </div>
  );
}

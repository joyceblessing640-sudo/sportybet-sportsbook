"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CRASH_GAMES } from "@/lib/games";

function roundMultiplier() {
  const r = Math.random();
  if (r < 0.35) return 1 + Math.random() * 0.8;
  if (r < 0.75) return 1.5 + Math.random() * 2.5;
  return 3 + Math.random() * 8;
}

export function CrashDemo({ gameId }: { gameId: string }) {
  const game = CRASH_GAMES.find((g) => g.id === gameId) ?? CRASH_GAMES[0];
  const [mult, setMult] = useState(1);
  const [phase, setPhase] = useState<"wait" | "run" | "crash">("wait");
  const [crashAt, setCrashAt] = useState(2);
  const [round, setRound] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const wait = window.setTimeout(() => {
      if (cancelled) return;
      const target = roundMultiplier();
      setCrashAt(target);
      setPhase("run");
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = (now - start) / 1000;
        const value = Math.pow(1.06, elapsed * 8);
        if (value >= target) {
          setMult(target);
          setPhase("crash");
          return;
        }
        setMult(value);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 1400);
    return () => {
      cancelled = true;
      window.clearTimeout(wait);
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameId, round]);

  return (
    <div className="p-4">
      <Link href="/games" className="text-sm font-semibold text-brand">
        ‹ Games
      </Link>
      <article className={`mt-3 overflow-hidden rounded-2xl bg-gradient-to-br ${game.art} p-4 text-white`}>
        <p className="text-[11px] uppercase tracking-wide text-white/70">{game.tag} · Demo</p>
        <h1 className="mt-1 text-2xl font-black">{game.name}</h1>
        <p className="mt-1 text-sm text-white/75">{game.blurb}</p>
        <div className="relative mt-6 h-48 overflow-hidden rounded-xl bg-black/35">
          <div
            className="absolute bottom-6 left-6 text-4xl"
            style={{ transform: `translate(${Math.min(mult * 28, 220)}px, ${-Math.min(mult * 22, 140)}px)` }}
          >
            ✈️
          </div>
          <p className="absolute inset-x-0 top-6 text-center text-4xl font-black tabular-nums">
            {phase === "crash" ? "FLEW AWAY" : `${mult.toFixed(2)}x`}
          </p>
          {phase === "crash" ? (
            <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80">Crashed at {crashAt.toFixed(2)}x</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => {
            setPhase("wait");
            setMult(1);
            setRound((n) => n + 1);
          }}
          disabled={phase !== "crash"}
          className="mt-4 h-11 w-full rounded-md bg-white text-sm font-bold text-ink disabled:opacity-60"
        >
          {phase === "crash" ? "Watch next round" : phase === "wait" ? "Starting…" : "Watching (no stake)"}
        </button>
        <p className="mt-3 text-[11px] text-white/70">
          Visual demo only. Cash-out betting is disabled. Original game — not affiliated with any licensed crash studio.
        </p>
      </article>
    </div>
  );
}

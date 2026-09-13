"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";

const PRIZES = ["No prize this spin", "Demo sticker", "Better luck next time", "Free demo spin"];

export default function RewardsPage() {
  const [gifts] = useState(0);
  const [spins, setSpins] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  function spin() {
    setSpinning(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
      setSpins((n) => n + 1);
      setSpinning(false);
    }, 900);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Gifts & Lucky Wheel</h1>
      <p className="mt-1 text-sm text-muted">Demo rewards. Spins never credit the wallet.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <article className="rounded-xl bg-white p-4 text-center">
          <Gift className="mx-auto h-6 w-6 text-brand" />
          <p className="mt-2 text-2xl font-black">{gifts}</p>
          <p className="text-xs text-muted">Gifts</p>
        </article>
        <article className="rounded-xl bg-white p-4 text-center">
          <p className="text-2xl font-black">{spins}</p>
          <p className="text-xs text-muted">Lucky Wheel spins</p>
        </article>
      </div>
      {gifts === 0 ? (
        <p className="mt-4 rounded-xl bg-white p-4 text-sm text-muted">No gifts waiting. Check promotions after a demo deposit is approved.</p>
      ) : null}
      <div className="mt-4 rounded-xl bg-white p-6 text-center">
        <div className={`mx-auto grid h-36 w-36 place-items-center rounded-full border-8 border-[#12a150] bg-[#e7f7ee] text-sm font-bold ${spinning ? "animate-spin" : ""}`}>
          SPIN
        </div>
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="mt-4 h-11 w-full rounded-md bg-[#12a150] text-sm font-bold text-white"
        >
          {spinning ? "Spinning…" : "Spin lucky wheel"}
        </button>
        {result ? <p className="mt-3 text-sm font-semibold">{result}</p> : null}
      </div>
      <Link href="/promotions" className="mt-4 block text-center text-sm font-semibold text-brand">
        View promotions
      </Link>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { loadBookingCodeAction } from "@/app/actions/slip";
import { RecommendedCodes } from "@/components/bets/recommended-codes";
import type { ClientMatch } from "@/lib/serialize";

export function LoadCodeForm({ matches }: { matches: ClientMatch[] }) {
  const [state, action, pending] = useActionState(loadBookingCodeAction, null);
  return (
    <div className="p-4">
      <h1 className="text-[16px] font-bold">Load Code</h1>
      <p className="mt-1 text-[12px] text-muted">Paste a booking code to fill the bet slip. Demo codes are listed below.</p>
      <form action={action} className="mt-4 flex gap-2">
        <input
          name="code"
          placeholder="e.g. SB7K2Q"
          className="h-11 flex-1 rounded-md border border-[#d7dbe2] px-3 text-sm uppercase outline-none focus:border-[#12a150]"
        />
        <button type="submit" disabled={pending} className="h-11 rounded-md bg-[#12a150] px-4 text-sm font-bold text-white">
          {pending ? "Loading…" : "Load"}
        </button>
      </form>
      {state?.error ? <p className="mt-2 text-sm text-danger">{state.error}</p> : null}
      <RecommendedCodes matches={matches} />
    </div>
  );
}

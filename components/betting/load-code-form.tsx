"use client";

import { useActionState } from "react";
import { loadBookingCodeAction } from "@/app/actions/slip";
import { RecommendedCodes } from "@/components/bets/recommended-codes";
import type { ClientMatch } from "@/lib/serialize";

export function LoadCodeForm({ matches }: { matches: ClientMatch[] }) {
  const [state, action, pending] = useActionState(loadBookingCodeAction, null);
  return (
    <div className="p-4">
      <h1 className="sr-only">Load Code</h1>
      <div className="relative w-full">
        <img
          src="/codes/booking-code-provided.png"
          alt=""
          width={1080}
          height={260}
          className="block h-auto w-full object-contain object-left"
          draggable={false}
        />
        <form action={action} className="absolute inset-0">
          <label className="sr-only" htmlFor="booking-code-input">
            Booking Code
          </label>
          <input
            id="booking-code-input"
            name="code"
            autoComplete="off"
            placeholder=""
            className="absolute bg-transparent uppercase text-ink outline-none"
            style={{ left: "5.5%", top: "42%", width: "66%", height: "48%" }}
          />
          <button
            type="submit"
            disabled={pending}
            aria-label={pending ? "Loading" : "Load"}
            className="absolute bg-transparent"
            style={{ left: "72%", top: "42%", width: "23%", height: "48%" }}
          />
        </form>
      </div>
      {state?.error ? <p className="mt-2 text-sm text-danger">{state.error}</p> : null}
      <RecommendedCodes matches={matches} />
    </div>
  );
}

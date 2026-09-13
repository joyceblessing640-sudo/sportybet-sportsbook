"use client";

import { useActionState } from "react";
import { AuthLink, AuthShell, PhoneField } from "@/components/auth/auth-shell";
import { deactivateAccountAction, reactivateAccountAction } from "@/app/actions/auth";
import { useAuth } from "@/components/providers";

export default function AccountStatusPage() {
  const { user } = useAuth();
  const [offState, offAction, offPending] = useActionState(deactivateAccountAction, null);
  const [onState, onAction, onPending] = useActionState(reactivateAccountAction, null);

  return (
    <AuthShell>
      <h1 className="mt-6 text-center text-2xl font-black">Account status</h1>
      <p className="mt-2 text-center text-sm text-muted">
        Deactivate pauses login. Reactivate with the same mobile number and password. This is a demo control, not a licensed
        self-exclusion register.
      </p>
      {user ? (
        <form action={offAction} className="mt-8">
          {offState?.error ? <p className="mb-3 text-sm text-brand">{offState.error}</p> : null}
          {offState?.ok ? <p className="mb-3 text-sm text-[#12a150]">Account deactivated. You have been signed out.</p> : null}
          <button type="submit" disabled={offPending} className="h-12 w-full rounded-md bg-brand text-sm font-bold text-white">
            {offPending ? "Working…" : "Deactivate this account"}
          </button>
        </form>
      ) : (
        <form action={onAction} className="mt-8 space-y-3">
          <PhoneField name="identifier" required />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-sm outline-none focus:border-[#12a150]"
          />
          {onState?.error ? <p className="text-sm text-brand">{onState.error}</p> : null}
          <button type="submit" disabled={onPending} className="h-12 w-full rounded-md bg-[#12a150] text-sm font-bold text-white">
            {onPending ? "Working…" : "Reactivate and log in"}
          </button>
        </form>
      )}
      <p className="mt-6 text-center">
        <AuthLink href="/login">Back to login</AuthLink>
      </p>
    </AuthShell>
  );
}

"use client";

import { useActionState, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLink, AuthShell, PhoneField } from "@/components/auth/auth-shell";
import { loginAction } from "@/app/actions/auth";
import { DEMO_PHONE_LOCAL } from "@/lib/phone";

const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function LoginForm() {
  const next = useSearchParams().get("next") || "/";
  const [state, action, pending] = useActionState(loginAction, null);
  const [phone, setPhone] = useState(DEMO ? DEMO_PHONE_LOCAL : "");
  const [password, setPassword] = useState(DEMO ? "DemoPass123!" : "");
  const ready = useMemo(() => phone.replace(/\D/g, "").length >= 9 && password.length > 0, [phone, password]);

  return (
    <AuthShell>
      <form action={action} method="post" className="flex flex-1 flex-col pt-6">
        <input type="hidden" name="next" value={next} />
        <div className="space-y-3">
          <div className="flex h-12 items-center rounded-md border border-[#d7dbe2] bg-white focus-within:border-[#12a150]">
            <span className="shrink-0 border-r border-[#e5e7eb] px-3 text-sm text-[#6b7280]">+233</span>
            <input
              name="identifier"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#9aa3b2]"
            />
          </div>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-sm outline-none placeholder:text-[#9aa3b2] focus:border-[#12a150]"
          />
        </div>
        {state?.error ? <p className="mt-3 text-sm text-danger">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending || !ready}
          className="mt-6 h-12 w-full rounded-md bg-[#d1d5db] text-sm font-bold text-white disabled:opacity-100 enabled:bg-[#12a150]"
        >
          {pending ? "Signing in…" : "Login"}
        </button>
        <div className="mt-4 flex items-center justify-between">
          <AuthLink href="/forgot-password">Forgot Password?</AuthLink>
          <AuthLink href="/register">Create Account</AuthLink>
        </div>
        <div className="mt-8 flex items-center gap-3 text-xs text-[#9aa3b2]">
          <span className="h-px flex-1 bg-[#eceff3]" />
          or
          <span className="h-px flex-1 bg-[#eceff3]" />
        </div>
        <p className="mt-4 text-center text-sm text-[#9aa3b2]">
          To deactivate or reactivate your account{" "}
          <AuthLink href="/account/status">click here</AuthLink>
        </p>
        {DEMO ? (
          <p className="mt-8 rounded-lg bg-[#fff8e6] p-3 text-xs text-[#8a6d00]">
            Demo login: +233 240000001 / DemoPass123! (email demo@sportbet.test also works)
          </p>
        ) : null}
      </form>
    </AuthShell>
  );
}

export function LoginFallback() {
  return (
    <AuthShell>
      <PhoneField />
    </AuthShell>
  );
}

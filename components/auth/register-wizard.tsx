"use client";

import { useActionState, useState } from "react";
import { AuthLink, AuthShell } from "@/components/auth/auth-shell";
import { registerCompleteAction, registerStartAction, registerVerifyOtpAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "account", label: "Account Info" },
  { id: "otp", label: "OTP Verification" },
  { id: "personal", label: "Personal Info" },
] as const;

type Step = (typeof STEPS)[number]["id"];

function AccountStep({
  action,
  error,
  pending,
}: {
  action: (formData: FormData) => void;
  error?: string;
  pending: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);
  const ready = phone.replace(/\D/g, "").length >= 9 && privacy && terms;
  return (
    <form action={action} className="mt-10 space-y-4">
      <div className="flex h-12 items-center rounded-md border border-[#d7dbe2] bg-white focus-within:border-[#12a150]">
        <span className="shrink-0 border-r border-[#e5e7eb] px-3 text-sm text-[#6b7280]">+233</span>
        <input
          name="phone"
          inputMode="numeric"
          required
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#9aa3b2]"
        />
      </div>
      <label className="flex items-start gap-2 text-[13px] leading-snug text-[#4b5563]">
        <input
          type="checkbox"
          name="privacy"
          value="1"
          checked={privacy}
          onChange={(e) => setPrivacy(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 accent-[#12a150]"
        />
        <span>
          I agree to the <AuthLink href="/legal/privacy">Privacy Policy</AuthLink> and confirm all the information I have
          given is true
        </span>
      </label>
      <label className="flex items-start gap-2 text-[13px] leading-snug text-[#4b5563]">
        <input
          type="checkbox"
          name="terms"
          value="1"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 accent-[#12a150]"
        />
        <span>
          I agree to the <AuthLink href="/legal/terms">Terms & Conditions</AuthLink> and confirm that I am at least
          eighteen (18) or older
        </span>
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={pending || !ready}
        className="h-12 w-full rounded-md bg-[#d1d5db] text-sm font-bold text-white disabled:opacity-100 enabled:bg-[#12a150]"
      >
        {pending ? "Sending code…" : "Next"}
      </button>
    </form>
  );
}

export function RegisterWizard() {
  const [startState, startAction, startPending] = useActionState(registerStartAction, null);
  const [otpState, otpAction, otpPending] = useActionState(registerVerifyOtpAction, null);
  const [doneState, doneAction, donePending] = useActionState(registerCompleteAction, null);

  const step: Step = otpState?.ok ? "personal" : startState?.ok ? "otp" : "account";
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <AuthShell>
      <h1 className="mt-10 text-center text-[22px] font-bold leading-tight text-[#1a1d24]">
        Join SportyBets
        <br />
        with your mobile number
      </h1>
      <ol className="relative mx-auto mt-8 flex w-full max-w-sm justify-between text-[11px] text-[#9aa3b2]">
        <span className="absolute left-6 right-6 top-2 h-px bg-[#e5e7eb]" />
        {STEPS.map((item, index) => (
          <li key={item.id} className="relative z-[1] flex w-20 flex-col items-center gap-1">
            <span
              className={cn(
                "h-4 w-4 rounded-full border-2 bg-white",
                index < stepIndex ? "border-[#12a150] bg-[#12a150]" : "border-[#d1d5db]",
                index === stepIndex && "border-[#9aa3b2]",
              )}
            />
            <span className={cn(index === stepIndex && "font-medium text-[#6b7280]")}>{item.label}</span>
          </li>
        ))}
      </ol>

      {step === "account" ? (
        <AccountStep action={startAction} error={startState?.error} pending={startPending} />
      ) : null}

      {step === "otp" ? (
        <form action={otpAction} className="mt-10 space-y-4">
          <p className="text-center text-sm text-muted">Enter the 6-digit code sent to your mobile. Demo code is 123456.</p>
          <input
            name="otp"
            inputMode="numeric"
            maxLength={6}
            required
            placeholder="OTP"
            className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-center text-lg tracking-[0.4em] outline-none focus:border-[#12a150]"
          />
          {otpState?.error ? <p className="text-sm text-danger">{otpState.error}</p> : null}
          <button type="submit" disabled={otpPending} className="h-12 w-full rounded-md bg-[#12a150] text-sm font-bold text-white">
            {otpPending ? "Checking…" : "Verify"}
          </button>
        </form>
      ) : null}

      {step === "personal" ? (
        <form action={doneAction} className="mt-10 space-y-3">
          <input
            name="username"
            required
            minLength={3}
            placeholder="Username"
            className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-sm outline-none focus:border-[#12a150]"
          />
          <input
            name="email"
            type="email"
            placeholder="Email (optional)"
            className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-sm outline-none focus:border-[#12a150]"
          />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-sm outline-none focus:border-[#12a150]"
          />
          {doneState?.error ? <p className="text-sm text-danger">{doneState.error}</p> : null}
          <button type="submit" disabled={donePending} className="h-12 w-full rounded-md bg-[#12a150] text-sm font-bold text-white">
            {donePending ? "Creating…" : "Create Account"}
          </button>
        </form>
      ) : null}

      <p className="mt-8 text-center text-sm">
        Already have an account? <AuthLink href="/login">Log In</AuthLink>
      </p>
    </AuthShell>
  );
}

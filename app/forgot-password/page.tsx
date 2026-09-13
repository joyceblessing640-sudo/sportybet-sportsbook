"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { AuthLink, AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  const [link, setLink] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email") ?? "") }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error ?? "Request failed.");
      return;
    }
    toast.success(data.message);
    if (data.demoResetPath) setLink(data.demoResetPath);
  }

  return (
    <AuthShell>
      <h1 className="mt-8 text-center text-2xl font-black">Forgot password</h1>
      <p className="mt-2 text-center text-sm text-muted">
        Enter the email on your account. This demo does not send SMS or email — it prints a reset link.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="h-12 w-full rounded-md border border-[#d7dbe2] px-3 text-sm outline-none focus:border-[#12a150]"
        />
        <button type="submit" disabled={pending} className="h-12 w-full rounded-md bg-[#12a150] text-sm font-bold text-white">
          {pending ? "Sending…" : "Continue"}
        </button>
      </form>
      {link ? (
        <p className="mt-4 break-all rounded-lg bg-[#f3f4f6] p-3 text-sm">
          Demo reset link:{" "}
          <Link href={link} className="font-semibold text-[#12a150]">
            {link}
          </Link>
        </p>
      ) : null}
      <p className="mt-6 text-center">
        <AuthLink href="/login">Back to login</AuthLink>
      </p>
    </AuthShell>
  );
}

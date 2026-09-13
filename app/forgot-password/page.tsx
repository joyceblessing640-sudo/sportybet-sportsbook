"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

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
    <div className="flex min-h-dvh flex-col bg-brand">
      <div className="px-4 py-4">
        <Logo />
      </div>
      <form onSubmit={onSubmit} className="mt-auto rounded-t-3xl bg-white px-5 py-8">
        <h1 className="text-2xl font-black">Forgot password</h1>
        <p className="mt-1 text-sm text-muted">We will generate a reset token. Email sending is not configured in this demo.</p>
        <div className="mt-5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <Button className="mt-5 w-full" disabled={pending}>
          {pending ? "Sending…" : "Continue"}
        </Button>
        {link ? (
          <p className="mt-4 break-all rounded-lg bg-[#f3f4f6] p-3 text-sm">
            Demo reset link:{" "}
            <Link href={link} className="font-semibold text-brand">
              {link}
            </Link>
          </p>
        ) : null}
        <Link href="/login" className="mt-4 block text-center text-sm font-semibold text-brand">
          Back to login
        </Link>
      </form>
    </div>
  );
}

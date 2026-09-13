"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        username: String(form.get("username") ?? ""),
        phone: String(form.get("phone") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error ?? "Could not create account.");
      return;
    }
    await refresh();
    router.push("/me");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />
        <Link href="/login" className="text-sm font-semibold text-white">
          Login
        </Link>
      </div>
      <form onSubmit={onSubmit} className="mt-auto rounded-t-3xl bg-white px-5 py-8">
        <h1 className="text-2xl font-black">Join SPORTBET</h1>
        <p className="mt-1 text-sm text-muted">18+ only. You must be legally allowed to bet in your location.</p>
        <div className="mt-5 grid gap-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required minLength={3} />
          </div>
          <div>
            <Label htmlFor="phone">Ghana mobile (optional)</Label>
            <Input id="phone" name="phone" placeholder="024XXXXXXX" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
          </div>
        </div>
        <Button className="mt-5 w-full" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </Button>
        <p className="mt-4 text-center text-xs text-muted">
          By registering you confirm you are 18+ and accept responsible play. Betting can be addictive.
        </p>
      </form>
    </div>
  );
}

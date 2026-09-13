"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <div className="flex min-h-dvh flex-col bg-brand">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />
        <Link href="/login" className="text-sm font-semibold text-white">
          Login
        </Link>
      </div>
      <form action={action} method="post" className="mt-auto rounded-t-3xl bg-white px-5 py-8">
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
        {state?.error ? <p className="mt-3 text-sm text-brand">{state.error}</p> : null}
        <Button type="submit" className="mt-5 w-full" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </Button>
        <p className="mt-4 text-center text-xs text-muted">
          By registering you confirm you are 18+ and accept responsible play. Betting can be addictive.
        </p>
      </form>
    </div>
  );
}

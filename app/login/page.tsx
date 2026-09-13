"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth";

const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

function LoginForm() {
  const next = useSearchParams().get("next") || "/";
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-dvh flex-col bg-brand">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />
        <Link href="/" className="text-sm font-semibold text-white">
          Home
        </Link>
      </div>
      <form action={action} method="post" className="mt-auto rounded-t-3xl bg-white px-5 py-8">
        <input type="hidden" name="next" value={next} />
        <h1 className="text-2xl font-black">Login</h1>
        <p className="mt-1 text-sm text-muted">Use your SPORTBET email, username or phone.</p>
        <div className="mt-5">
          <Label htmlFor="identifier">Email / Username</Label>
          <Input
            id="identifier"
            name="identifier"
            autoComplete="username"
            defaultValue={DEMO ? "demo@sportbet.test" : ""}
            placeholder="you@email.com"
            required
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={DEMO ? "DemoPass123!" : ""}
            required
          />
        </div>
        <Link href="/forgot-password" className="mt-2 inline-block text-sm font-semibold text-brand">
          Forgot password?
        </Link>
        {state?.error ? <p className="mt-3 text-sm text-brand">{state.error}</p> : null}
        <Button type="submit" className="mt-5 w-full" disabled={pending}>
          {pending ? "Signing in…" : "Login"}
        </Button>
        <p className="mt-4 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="font-semibold text-brand">
            Register
          </Link>
        </p>
        <p className="mt-6 rounded-lg bg-[#fff8e6] p-3 text-xs text-[#8a6d00]">
          Demo accounts: demo@sportbet.test / DemoPass123! · admin@sportbet.test / AdminPass123!
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

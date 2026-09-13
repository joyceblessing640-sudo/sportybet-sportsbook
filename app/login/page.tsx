"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";

const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const { refresh } = useAuth();
  const [pending, setPending] = useState(false);
  const [identifier, setIdentifier] = useState(DEMO ? "demo@sportbet.test" : "");
  const [password, setPassword] = useState(DEMO ? "DemoPass123!" : "");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Enter your email/username and password.");
      return;
    }
    setPending(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error ?? "Login failed.");
      return;
    }
    await refresh();
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />
        <Link href="/" className="text-sm font-semibold text-white">
          Home
        </Link>
      </div>
      <form onSubmit={onSubmit} className="mt-auto rounded-t-3xl bg-white px-5 py-8" noValidate>
        <h1 className="text-2xl font-black">Login</h1>
        <p className="mt-1 text-sm text-muted">Use your SPORTBET email, username or phone.</p>
        <div className="mt-5">
          <Label htmlFor="identifier">Email / Username</Label>
          <Input
            id="identifier"
            name="identifier"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div className="mt-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Link href="/forgot-password" className="mt-2 inline-block text-sm font-semibold text-brand">
          Forgot password?
        </Link>
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

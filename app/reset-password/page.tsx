"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: String(form.get("password") ?? "") }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error ?? "Reset failed.");
      return;
    }
    toast.success(data.message);
    router.push("/login");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand">
      <div className="px-4 py-4">
        <Logo />
      </div>
      <form onSubmit={onSubmit} className="mt-auto rounded-t-3xl bg-white px-5 py-8">
        <h1 className="text-2xl font-black">Reset password</h1>
        <div className="mt-5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>
        <Button className="mt-5 w-full" disabled={pending || !token}>
          {pending ? "Updating…" : "Update password"}
        </Button>
        {!token ? <p className="mt-3 text-sm text-brand">Missing reset token.</p> : null}
        <Link href="/login" className="mt-4 block text-center text-sm font-semibold text-brand">
          Back to login
        </Link>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

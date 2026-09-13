"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";

export default function SupportPage() {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) toast.error(data.error ?? "Could not send.");
    else {
      toast.success(data.message);
      e.currentTarget.reset();
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Customer Service</h1>
      <p className="mt-1 text-sm text-muted">Demo support desk. Messages are stored for operations review.</p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-xl bg-white p-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={user?.email ?? ""} required />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            className="h-28 w-full rounded-md border border-[#d7dbe2] p-3 text-sm"
          />
        </div>
        <Button disabled={pending}>{pending ? "Sending…" : "Send"}</Button>
      </form>
    </div>
  );
}

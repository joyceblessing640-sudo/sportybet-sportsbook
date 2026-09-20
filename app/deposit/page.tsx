"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, MIN_DEPOSIT_PESEWAS } from "@/lib/money";
import { PROVIDERS } from "@/lib/validation";
import { depositAction } from "@/app/actions/cashier";
import { cn } from "@/lib/utils";

export default function DepositPage() {
  const { user } = useAuth();
  const [method, setMethod] = useState<"MOBILE_MONEY" | "BANK" | "CARD">("MOBILE_MONEY");
  const [state, action, pending] = useActionState(depositAction, null);

  return (
    <div>
      <header className="flex items-center gap-3 bg-header px-3 py-2.5 text-white">
        <Link href="/me" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-sm font-bold">Deposit</h1>
        <Link href="/support" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Link>
      </header>
      <form action={action} method="post" className="p-4">
        <input type="hidden" name="method" value={method} />
        <div className="grid grid-cols-3 gap-2">
          {(["MOBILE_MONEY", "BANK", "CARD"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={cn(
                "rounded-lg border bg-white py-2 text-xs font-semibold",
                method === id ? "border-brand text-brand" : "border-[#e5e7eb] text-[#4b5563]",
              )}
            >
              {id === "MOBILE_MONEY" ? "Mobile Money" : id === "BANK" ? "Bank" : "Card"}
            </button>
          ))}
        </div>
        {method === "MOBILE_MONEY" ? (
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="provider">Mobile provider</Label>
              <select
                id="provider"
                name="provider"
                defaultValue="MTN"
                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-sm"
              >
                {PROVIDERS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.hint})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" defaultValue={user?.phone ?? ""} placeholder="024XXXXXXX" />
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm text-muted">
            Bank and card rails are not connected. Submit a demo request and an admin can mark it after a real provider confirms payment.
          </p>
        )}
        <div className="mt-4">
          <Label htmlFor="amount">Amount (GHS)</Label>
          <Input id="amount" name="amount" defaultValue="50" inputMode="decimal" />
          <p className="mt-1 text-xs text-muted">Minimum {formatGhs(MIN_DEPOSIT_PESEWAS)}</p>
        </div>
        <div className="mt-3">
          <Label htmlFor="reference">Payment reference (optional)</Label>
          <Input id="reference" name="reference" />
        </div>
        <div className="mt-4 rounded-xl bg-white p-3 text-sm">
          <p>
            Available balance: <strong>{formatGhs(user?.wallet?.balancePesewas ?? 0)}</strong>
          </p>
          <p className="mt-1 text-xs text-muted">
            Deposits stay <strong>Pending</strong> until payment is confirmed by operations. This demo never marks a deposit successful from the browser.
          </p>
        </div>
        {state?.error ? <p className="mt-3 text-sm text-danger">{state.error}</p> : null}
        <Button type="submit" className="mt-4 w-full" disabled={pending}>
          {pending ? "Submitting…" : "Deposit"}
        </Button>
      </form>
    </div>
  );
}

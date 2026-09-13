"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, MIN_WITHDRAW_PESEWAS } from "@/lib/money";
import { PROVIDERS } from "@/lib/validation";
import { withdrawAction } from "@/app/actions/cashier";
import { cn } from "@/lib/utils";

export default function WithdrawPage() {
  const { user } = useAuth();
  const [method, setMethod] = useState<"MOBILE_MONEY" | "BANK">("MOBILE_MONEY");
  const [state, action, pending] = useActionState(withdrawAction, null);
  const withdrawable = user?.wallet?.withdrawablePesewas ?? 0;

  return (
    <div>
      <header className="flex items-center gap-3 bg-brand px-3 py-3 text-white">
        <Link href="/me" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-sm font-bold">Withdraw</h1>
        <Link href="/support" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Link>
      </header>
      <div className="grid grid-cols-2 bg-white text-sm font-semibold">
        {(["MOBILE_MONEY", "BANK"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={cn("py-3", method === id ? "border-b-2 border-brand text-brand" : "text-[#6b7280]")}
          >
            {id === "MOBILE_MONEY" ? "Mobile Money" : "Bank"}
          </button>
        ))}
      </div>
      <form action={action} method="post" className="p-4">
        <input type="hidden" name="method" value={method} />
        {method === "MOBILE_MONEY" ? (
          <>
            <Label htmlFor="provider">Mobile provider</Label>
            <select
              id="provider"
              name="provider"
              defaultValue="MTN"
              className="mb-3 h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-sm"
            >
              {PROVIDERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" className="mb-3" defaultValue={user?.phone ?? ""} />
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="bankName">Bank</Label>
              <Input id="bankName" name="bankName" />
            </div>
            <div>
              <Label htmlFor="accountName">Account name</Label>
              <Input id="accountName" name="accountName" />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account number</Label>
              <Input id="accountNumber" name="accountNumber" />
            </div>
          </div>
        )}
        <div className="mt-3">
          <Label htmlFor="amount">Amount (GHS)</Label>
          <Input id="amount" name="amount" defaultValue="20" inputMode="decimal" />
        </div>
        <div className="mt-3 rounded-xl bg-white p-3 text-sm">
          <p>Available balance: {formatGhs(user?.wallet?.balancePesewas ?? 0)}</p>
          <p>Withdrawable balance: {formatGhs(withdrawable)}</p>
        </div>
        <p className="mt-3 text-xs text-muted">
          Minimum withdrawal is {formatGhs(MIN_WITHDRAW_PESEWAS)}. Requests stay pending until operations confirms them. Withdrawals are not instant.
        </p>
        {state?.error ? <p className="mt-3 text-sm text-brand">{state.error}</p> : null}
        <Button type="submit" className="mt-4 w-full" disabled={pending}>
          {pending ? "Submitting…" : "Withdraw"}
        </Button>
      </form>
    </div>
  );
}

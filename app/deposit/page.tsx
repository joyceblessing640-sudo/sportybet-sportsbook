"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, MIN_DEPOSIT_PESEWAS, parseGhsToPesewas } from "@/lib/money";
import { PROVIDERS, detectProvider, normalizeGhanaPhone } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function DepositPage() {
  const { user, refresh } = useAuth();
  const [method, setMethod] = useState<"MOBILE_MONEY" | "BANK" | "CARD">("MOBILE_MONEY");
  const [provider, setProvider] = useState("MTN");
  const [picker, setPicker] = useState(false);
  const [amount, setAmount] = useState("50");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [reference, setReference] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ publicId: string; status: string; reference: string | null } | null>(null);

  const amountPesewas = parseGhsToPesewas(amount);
  const phoneOk = method !== "MOBILE_MONEY" || Boolean(normalizeGhanaPhone(phone));
  const valid = amountPesewas !== null && amountPesewas >= MIN_DEPOSIT_PESEWAS && phoneOk;

  const mismatch = useMemo(() => {
    if (method !== "MOBILE_MONEY") return false;
    const detected = detectProvider(phone);
    return Boolean(detected && detected !== provider);
  }, [method, phone, provider]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid || mismatch) return;
    setPending(true);
    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, provider, amount, phone, reference }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error ?? "Deposit failed.");
      return;
    }
    await refresh();
    setResult(data.deposit);
  }

  return (
    <div>
      <header className="flex items-center gap-3 bg-brand px-3 py-3 text-white">
        <Link href="/me" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-sm font-bold">Deposit</h1>
        <Link href="/support" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Link>
      </header>
      <form onSubmit={onSubmit} className="p-4">
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
              <Label>Mobile provider</Label>
              <button type="button" onClick={() => setPicker(true)} className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-left text-sm">
                {PROVIDERS.find((p) => p.id === provider)?.name}
              </button>
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="024XXXXXXX" />
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm text-muted">
            Bank and card rails are not connected. Submit a demo request and an admin can mark it after a real provider confirms payment.
          </p>
        )}
        <div className="mt-4">
          <Label htmlFor="amount">Amount (GHS)</Label>
          <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
          <p className="mt-1 text-xs text-muted">Minimum {formatGhs(MIN_DEPOSIT_PESEWAS)}</p>
        </div>
        <div className="mt-3">
          <Label htmlFor="reference">Payment reference (optional)</Label>
          <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} />
        </div>
        {mismatch ? <p className="mt-2 text-xs text-brand">That number does not match the selected network.</p> : null}
        <div className="mt-4 rounded-xl bg-white p-3 text-sm">
          <p>
            Available balance: <strong>{formatGhs(user?.wallet?.balancePesewas ?? 0)}</strong>
          </p>
          <p className="mt-1 text-xs text-muted">
            Deposits stay <strong>Pending</strong> until the payment is confirmed. This demo never marks a deposit successful from the browser.
          </p>
        </div>
        <Button className="mt-4 w-full" disabled={!valid || mismatch || pending}>
          {pending ? "Submitting…" : "Deposit"}
        </Button>
      </form>
      {picker ? (
        <div className="fixed inset-0 z-50">
          <button className="absolute inset-0 bg-black/40" onClick={() => setPicker(false)} aria-label="Close" />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4">
            <p className="mb-3 font-bold">Select provider</p>
            {PROVIDERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="flex w-full items-center justify-between border-b border-[#f1f3f7] py-3 text-left"
                onClick={() => {
                  setProvider(item.id);
                  setPicker(false);
                }}
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted">{item.hint}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {result ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#b45309]">{result.status}</p>
            <h2 className="mt-2 text-lg font-black">Deposit submitted</h2>
            <p className="mt-2 text-sm text-muted">
              Your deposit {result.publicId} is waiting for confirmation. Status updates only after backend review.
            </p>
            <p className="mt-2 text-xs text-muted">Ref: {result.reference}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="ghost" asChild>
                <Link href="/transactions">Transaction</Link>
              </Button>
              <Button asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

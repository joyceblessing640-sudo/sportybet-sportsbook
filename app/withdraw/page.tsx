"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, MIN_WITHDRAW_PESEWAS, parseGhsToPesewas } from "@/lib/money";
import { PROVIDERS, detectProvider, normalizeGhanaPhone } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function WithdrawPage() {
  const { user, refresh } = useAuth();
  const [tab, setTab] = useState<"MOBILE_MONEY" | "BANK">("MOBILE_MONEY");
  const [provider, setProvider] = useState("MTN");
  const [picker, setPicker] = useState(false);
  const [amount, setAmount] = useState("20");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ publicId: string; status: string } | null>(null);

  const withdrawable = user?.wallet?.withdrawablePesewas ?? 0;
  const amountPesewas = parseGhsToPesewas(amount);
  const phoneOk = tab !== "MOBILE_MONEY" || Boolean(normalizeGhanaPhone(phone));
  const bankOk = tab !== "BANK" || (accountName.length > 1 && accountNumber.length > 4 && bankName.length > 1);
  const exceeds = amountPesewas !== null && amountPesewas > withdrawable;
  const tooSmall = amountPesewas !== null && amountPesewas < MIN_WITHDRAW_PESEWAS;
  const valid = amountPesewas !== null && !exceeds && !tooSmall && phoneOk && bankOk;

  const mismatch = useMemo(() => {
    if (tab !== "MOBILE_MONEY") return false;
    const detected = detectProvider(phone);
    return Boolean(detected && detected !== provider);
  }, [tab, phone, provider]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid || mismatch) return;
    setPending(true);
    const res = await fetch("/api/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: tab,
        provider,
        amount,
        phone,
        accountName,
        accountNumber,
        bankName,
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok || !data.ok) {
      toast.error(data.error ?? "Withdrawal failed.");
      return;
    }
    await refresh();
    setResult(data.withdrawal);
  }

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
            onClick={() => setTab(id)}
            className={cn("py-3", tab === id ? "border-b-2 border-brand text-brand" : "text-[#6b7280]")}
          >
            {id === "MOBILE_MONEY" ? "Mobile Money" : "Bank"}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="p-4">
        {tab === "MOBILE_MONEY" ? (
          <>
            <Label>Mobile provider</Label>
            <button type="button" onClick={() => setPicker(true)} className="mb-3 h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-left text-sm">
              {PROVIDERS.find((p) => p.id === provider)?.name}
            </button>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" className="mb-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="bankName">Bank</Label>
              <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="accountName">Account name</Label>
              <Input id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account number</Label>
              <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
          </div>
        )}
        <div className="mt-3">
          <Label htmlFor="amount">Amount (GHS)</Label>
          <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
        </div>
        <div className="mt-3 rounded-xl bg-white p-3 text-sm">
          <p>Available balance: {formatGhs(user?.wallet?.balancePesewas ?? 0)}</p>
          <p>Withdrawable balance: {formatGhs(withdrawable)}</p>
        </div>
        {tooSmall ? <p className="mt-2 text-xs text-brand">Minimum withdrawal is {formatGhs(MIN_WITHDRAW_PESEWAS)}.</p> : null}
        {exceeds ? <p className="mt-2 text-xs text-brand">Amount cannot exceed your withdrawable balance.</p> : null}
        {mismatch ? <p className="mt-2 text-xs text-brand">Phone number does not match the selected provider.</p> : null}
        <Button className="mt-4 w-full" disabled={!valid || mismatch || pending}>
          {pending ? "Submitting…" : "Withdraw"}
        </Button>
        <p className="mt-3 text-xs text-muted">
          Withdrawals are not instant. Your request stays pending until operations confirms it. Do not treat this demo as a live cashier.
        </p>
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
            <h2 className="mt-2 text-lg font-black">Pending</h2>
            <p className="mt-2 text-sm text-muted">
              Your withdrawal request {result.publicId} has been submitted and is waiting for confirmation.
            </p>
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

"use client";

import { useActionState, useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/components/providers";
import { formatGhs, MIN_DEPOSIT_PESEWAS, toGhs } from "@/lib/money";
import { PROVIDERS, normalizeGhanaPhone } from "@/lib/validation";
import { depositAction } from "@/app/actions/cashier";
import { cn } from "@/lib/utils";

function HitButton({
  onTrigger,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { onTrigger: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const cb = useRef(onTrigger);
  cb.current = onTrigger;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = () => cb.current();
    el.addEventListener("click", fn, true);
    return () => el.removeEventListener("click", fn, true);
  }, []);
  return <button {...props} ref={ref} type="button" />;
}

type Method = "MOBILE_MONEY" | "BANK" | "CARD";
type ProviderId = (typeof PROVIDERS)[number]["id"];

const QUICK_AMOUNTS = [2, 5, 10, 50, 100] as const;

const PROVIDER_LABEL: Record<ProviderId, string> = {
  MTN: "MTN Mobile Money",
  AIRTELTIGO: "AirtelTigo",
  TELECEL: "Telecel",
};

function maskPhone(phone: string) {
  const normalized = normalizeGhanaPhone(phone);
  if (!normalized) return "+233";
  return `+233 ${normalized.slice(1, 3)}***${normalized.slice(-3)}`;
}

function addAmount(current: string, add: number) {
  const n = Number.parseFloat(current);
  const base = Number.isFinite(n) ? n : 0;
  const next = Math.round((base + add) * 100) / 100;
  return Number.isInteger(next) ? String(next) : next.toFixed(2);
}

export default function DepositPage() {
  const { user } = useAuth();
  const [method, setMethod] = useState<Method>("MOBILE_MONEY");
  const [provider, setProvider] = useState<ProviderId>("MTN");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [amount, setAmount] = useState("50");
  const [state, action, pending] = useActionState(depositAction, null);

  const phone = user?.phone ?? "";
  const providerName = PROVIDER_LABEL[provider];
  const chips = useMemo(
    () =>
      QUICK_AMOUNTS.map((value, index) => ({
        value,
        left: `${3.2 + index * 19.2}%`,
        width: "17.6%",
      })),
    [],
  );

  if (method !== "MOBILE_MONEY") {
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
          <p className="mt-4 rounded-xl bg-white p-4 text-sm text-muted">
            Bank and card rails are not connected. Submit a demo request and an admin can mark it after a real provider confirms payment.
          </p>
          <div className="mt-4">
            <Label htmlFor="amount">Amount (GHS)</Label>
            <Input id="amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
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

  return (
    <div className="bg-white">
      <div className="relative mx-auto w-full max-w-[430px]">
        <img
          src="/cashier/deposit-provided.png"
          alt=""
          width={923}
          height={1430}
          className="pointer-events-none block h-auto w-full object-contain"
          draggable={false}
        />

        <Link href="/me" aria-label="Back" className="absolute z-[1]" style={{ left: "0%", top: "0%", width: "18%", height: "8%" }} />
        <Link href="/support" aria-label="Help" className="absolute z-[1]" style={{ left: "76%", top: "0%", width: "12%", height: "8%" }} />
        <Link href="/" aria-label="Home" className="absolute z-[1]" style={{ left: "88%", top: "0%", width: "12%", height: "8%" }} />

        <HitButton aria-label="Mobile Money" className="absolute z-[1]" style={{ left: "0%", top: "8.4%", width: "33%", height: "7.2%" }} onTrigger={() => setMethod("MOBILE_MONEY")} />
        <HitButton aria-label="Paybill" className="absolute z-[1]" style={{ left: "33%", top: "8.4%", width: "33%", height: "7.2%" }} onTrigger={() => setMethod("BANK")} />
        <HitButton aria-label="Card" className="absolute z-[1]" style={{ left: "66%", top: "8.4%", width: "34%", height: "7.2%" }} onTrigger={() => setMethod("CARD")} />

        <p
          className="pointer-events-none absolute z-[2] flex items-center overflow-hidden text-[14px] font-medium leading-none text-[#5b6168]"
          style={{ left: "16.8%", top: "21.6%", width: "68%", height: "3.8%", background: "#f2f3f5" }}
        >
          {maskPhone(phone)}
        </p>

        <HitButton
          aria-label="Switch payment method"
          className="absolute z-[1]"
          style={{ left: "3.5%", top: "29.8%", width: "93%", height: "7.6%" }}
          onTrigger={() => setPickerOpen(true)}
        />
        {provider !== "MTN" ? (
          <p
            className="pointer-events-none absolute z-[2] flex items-center overflow-hidden truncate text-[14px] font-semibold leading-none text-[#2b3036]"
            style={{ left: "17.5%", top: "31.6%", width: "48%", height: "4%", background: "#ffffff" }}
          >
            {providerName}
          </p>
        ) : null}

        <p
          className="pointer-events-none absolute z-[2] flex items-center justify-end overflow-hidden text-[12px] leading-none text-[#5b6168]"
          style={{ left: "48%", top: "39.8%", width: "47%", height: "3.2%", background: "#fafafa" }}
        >
          Balance (GHS) {toGhs(user?.wallet?.balancePesewas ?? 0)}
        </p>

        <form action={action} method="post">
          <input type="hidden" name="method" value={method} />
          <input type="hidden" name="provider" value={provider} />
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="reference" value="" />
          <label className="sr-only" htmlFor="deposit-amount">
            Amount (GHS)
          </label>
          <input
            id="deposit-amount"
            name="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="absolute z-[2] border-0 bg-white px-3 text-[16px] font-semibold text-[#111] outline-none"
            style={{ left: "5%", top: "45.2%", width: "90%", height: "6.8%" }}
          />
          <button
            type="submit"
            disabled={pending}
            aria-label={pending ? "Submitting" : "Top Up Now"}
            className="absolute z-[1]"
            style={{ left: "3.5%", top: "63.4%", width: "93%", height: "7.8%" }}
          />
        </form>

        {chips.map((chip) => (
          <HitButton
            key={chip.value}
            aria-label={`Add ${chip.value}`}
            className="absolute z-[1]"
            style={{ left: chip.left, top: "54%", width: chip.width, height: "6.4%" }}
            onTrigger={() => setAmount((current) => addAmount(current, chip.value))}
          />
        ))}

        {pickerOpen ? (
          <div className="absolute inset-0 z-[4]">
            <HitButton aria-label="Close payment methods" className="absolute inset-0" onTrigger={() => setPickerOpen(false)} />
            <div className="absolute overflow-hidden bg-[#fafafa] shadow-md" style={{ left: "3.5%", top: "37.6%", width: "93%" }}>
              <div className="relative w-full">
                <img
                  src="/cashier/payment-methods-provided.png"
                  alt=""
                  width={1080}
                  height={437}
                  className="pointer-events-none block h-auto w-full object-contain"
                  draggable={false}
                />
                <span className="absolute bg-[#fafafa]" style={{ left: "3.2%", top: "7%", width: "8.5%", height: "16%" }} />
                {(["MTN", "AIRTELTIGO", "TELECEL"] as const).map((id, index) => {
                  const top = index === 0 ? "0%" : index === 1 ? "31%" : "65%";
                  const height = index === 0 ? "31%" : index === 1 ? "34%" : "35%";
                  return (
                    <HitButton
                      key={id}
                      aria-label={PROVIDER_LABEL[id]}
                      aria-pressed={provider === id}
                      className="absolute z-[1]"
                      style={{ left: "0%", top, width: "100%", height }}
                      onTrigger={() => {
                        setProvider(id);
                        setPickerOpen(false);
                      }}
                    >
                      {provider === id ? (
                        <svg viewBox="0 0 24 24" className="absolute top-[28%] h-[44%] w-[8%]" style={{ left: "4.2%" }} aria-hidden="true">
                          <path fill="#16a34a" d="M9.2 16.2 4.8 11.8l1.4-1.4 3 3 8-8 1.4 1.4z" />
                        </svg>
                      ) : null}
                    </HitButton>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {state?.error ? <p className="mx-auto max-w-[430px] px-4 pb-4 text-sm text-danger">{state.error}</p> : null}
    </div>
  );
}

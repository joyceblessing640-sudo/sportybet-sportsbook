"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createDeposit, createWithdrawal } from "@/lib/wallet";
import { parseGhsToPesewas } from "@/lib/money";
import { AuthError } from "@/lib/auth";
import { headers } from "next/headers";

export type CashierState = { error?: string } | null;

async function ipFromHeaders() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
}

export async function depositAction(_prev: CashierState, formData: FormData): Promise<CashierState> {
  const session = await getSession();
  if (!session) redirect("/login?next=/deposit");

  const methodRaw = String(formData.get("method") ?? "MOBILE_MONEY");
  const method = methodRaw === "BANK" || methodRaw === "CARD" ? methodRaw : "MOBILE_MONEY";
  const amountPesewas = parseGhsToPesewas(String(formData.get("amount") ?? ""));
  if (amountPesewas === null) return { error: "Enter a valid amount." };

  try {
    const deposit = await createDeposit({
      userId: session.id,
      method,
      provider: String(formData.get("provider") ?? "") || undefined,
      amountPesewas,
      phone: String(formData.get("phone") ?? ""),
      reference: String(formData.get("reference") ?? "") || undefined,
      ip: await ipFromHeaders(),
    });
    redirect(`/deposit/status/${deposit.publicId}`);
  } catch (error) {
    if (error instanceof AuthError) return { error: error.message };
    throw error;
  }
}

export async function withdrawAction(_prev: CashierState, formData: FormData): Promise<CashierState> {
  const session = await getSession();
  if (!session) redirect("/login?next=/withdraw");

  const methodRaw = String(formData.get("method") ?? "MOBILE_MONEY");
  const method = methodRaw === "BANK" ? "BANK" : "MOBILE_MONEY";
  const amountPesewas = parseGhsToPesewas(String(formData.get("amount") ?? ""));
  if (amountPesewas === null) return { error: "Enter a valid amount." };

  try {
    const withdrawal = await createWithdrawal({
      userId: session.id,
      method,
      provider: String(formData.get("provider") ?? "") || undefined,
      amountPesewas,
      phone: String(formData.get("phone") ?? ""),
      accountName: String(formData.get("accountName") ?? "") || undefined,
      accountNumber: String(formData.get("accountNumber") ?? "") || undefined,
      bankName: String(formData.get("bankName") ?? "") || undefined,
      ip: await ipFromHeaders(),
    });
    redirect(`/withdraw/status/${withdrawal.publicId}`);
  } catch (error) {
    if (error instanceof AuthError) return { error: error.message };
    throw error;
  }
}

"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider, type AuthUser } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";
import { SlipProvider } from "@/components/slip-context";
import type { SlipItem } from "@/lib/slip";

export function ClientRoot({
  initialUser,
  slipItems,
  children,
}: {
  initialUser: AuthUser | null;
  slipItems: SlipItem[];
  children: ReactNode;
}) {
  return (
    <AuthProvider key={initialUser?.id ?? "guest"} initialUser={initialUser}>
      <SlipProvider items={slipItems}>
        <AppShell slipItems={slipItems}>{children}</AppShell>
        <Toaster position="top-center" richColors />
      </SlipProvider>
    </AuthProvider>
  );
}

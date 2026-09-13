"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider, type AuthUser } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";

export function ClientRoot({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: ReactNode;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <AppShell>{children}</AppShell>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

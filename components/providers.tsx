"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  loyaltyTier: string;
  phone?: string | null;
  unread: number;
  wallet: {
    balancePesewas: number;
    withdrawablePesewas: number;
    bonusPesewas: number;
  } | null;
};

const AuthContext = createContext<{
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  refresh: () => Promise<void>;
}>({ user: null, setUser: () => {}, refresh: async () => {} });

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const value = useMemo(
    () => ({
      user,
      setUser,
      refresh: async () => {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        setUser(data.user ?? null);
      },
    }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

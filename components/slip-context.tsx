"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SlipItem } from "@/lib/slip";

const SlipContext = createContext<SlipItem[]>([]);

export function SlipProvider({ items, children }: { items: SlipItem[]; children: ReactNode }) {
  return <SlipContext.Provider value={items}>{children}</SlipContext.Provider>;
}

export function useSlipItems() {
  return useContext(SlipContext);
}

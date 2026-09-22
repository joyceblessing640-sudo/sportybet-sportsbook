"use client";

import { useEffect } from "react";
import { BUILD_ID } from "@/lib/build-id";

const RELOADED_FOR = "sb-reloaded-for-build";

export function BuildRefresh() {
  useEffect(() => {
    let stopped = false;

    async function check() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok || stopped) return;
        const { build } = (await res.json()) as { build?: string };
        if (stopped || !build || build === BUILD_ID) return;
        // Guard against a reload loop when the fresh document still reports an old id.
        if (sessionStorage.getItem(RELOADED_FOR) === build) return;
        sessionStorage.setItem(RELOADED_FOR, build);
        window.location.reload();
      } catch {
        // Offline or blocked: keep showing the page we already have.
      }
    }

    void check();
    document.addEventListener("visibilitychange", check);
    window.addEventListener("pageshow", check);
    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("pageshow", check);
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { ClientMatch } from "@/lib/serialize";

export function useFootballSnapshot(initial: {
  featured?: ClientMatch[];
  live: ClientMatch[];
  today?: ClientMatch[];
  upcoming?: ClientMatch[];
  error?: string | null;
  scope?: "home" | "live";
}) {
  const [featured, setFeatured] = useState(initial.featured ?? []);
  const [live, setLive] = useState(initial.live);
  const [today, setToday] = useState(initial.today ?? []);
  const [upcoming, setUpcoming] = useState(initial.upcoming ?? []);
  const [error, setError] = useState<string | null>(initial.error ?? null);
  const scope = initial.scope ?? "home";
  const failStreak = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    async function tick() {
      try {
        const res = await fetch(`/api/football/snapshot?scope=${scope}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (!data.ok) throw new Error(data.error ?? "feed");
        failStreak.current = 0;
        if (Array.isArray(data.featured)) setFeatured(data.featured);
        if (Array.isArray(data.live)) setLive(data.live);
        if (Array.isArray(data.today)) setToday(data.today);
        if (Array.isArray(data.upcoming)) setUpcoming(data.upcoming);
        setError(typeof data.error === "string" ? data.error : null);
        const hasLive = (data.live as ClientMatch[] | undefined)?.some(
          (match) => match.status === "LIVE" || match.status === "HT",
        );
        timer = window.setTimeout(tick, hasLive || scope === "live" ? 60_000 : 90_000);
      } catch {
        if (cancelled) return;
        failStreak.current += 1;
        setError("Unable to load live matches");
        const wait = Math.min(60_000, 8_000 * failStreak.current);
        timer = window.setTimeout(tick, wait);
      }
    }

    timer = window.setTimeout(tick, 20_000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [scope]);

  return { featured, live, today, upcoming, error };
}

import { afterEach, describe, expect, it, vi } from "vitest";
import { cacheGet, cachePeek, cacheSet } from "./cache";

describe("football cache", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns cached values until TTL expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-20T12:00:00Z"));
    cacheSet("fixtures:test", [1, 2], 1_000);
    expect(cacheGet<number[]>("fixtures:test")).toEqual([1, 2]);
    vi.setSystemTime(new Date("2026-09-20T12:00:00.999Z"));
    expect(cacheGet<number[]>("fixtures:test")).toEqual([1, 2]);
    vi.setSystemTime(new Date("2026-09-20T12:00:01.050Z"));
    expect(cacheGet<number[]>("fixtures:test")).toBeUndefined();
    expect(cachePeek<number[]>("fixtures:test")).toBeUndefined();
  });
});

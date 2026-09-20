import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchOddsByFixture, hasFootballKey, peekOddsByFixture } from "./api";

describe("hasFootballKey", () => {
  it("never treats a blank key as configured", () => {
    const previous = process.env.API_FOOTBALL_KEY;
    delete process.env.API_FOOTBALL_KEY;
    expect(hasFootballKey()).toBe(false);
    process.env.API_FOOTBALL_KEY = "   ";
    expect(hasFootballKey()).toBe(false);
    if (previous == null) delete process.env.API_FOOTBALL_KEY;
    else process.env.API_FOOTBALL_KEY = previous;
  });
});

describe("fetchOddsByFixture", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("caches an empty provider row instead of inventing prices", async () => {
    process.env.API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY?.trim() || "test-key";
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        errors: [],
        results: 0,
        paging: { current: 1, total: 1 },
        response: [],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    const first = await fetchOddsByFixture(9_000_001);
    const second = await fetchOddsByFixture(9_000_001);
    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(peekOddsByFixture(9_000_001)).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

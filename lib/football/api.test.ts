import { describe, expect, it } from "vitest";
import { hasFootballKey } from "./api";

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

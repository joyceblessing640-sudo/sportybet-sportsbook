import { describe, expect, it } from "vitest";
import {
  combineOddsHundredths,
  parseGhsToPesewas,
  potentialWinPesewas,
  systemCombinations,
  systemPotentialWin,
} from "../lib/money";
import { detectProvider, normalizeGhanaPhone } from "../lib/validation";

describe("money", () => {
  it("parses GHS amounts to pesewas", () => {
    expect(parseGhsToPesewas("10")).toBe(1000);
    expect(parseGhsToPesewas("10.50")).toBe(1050);
    expect(parseGhsToPesewas("10.999")).toBeNull();
    expect(parseGhsToPesewas("-1")).toBeNull();
  });

  it("combines odds and potential win on the server formula", () => {
    expect(combineOddsHundredths([320, 222])).toBe(710);
    expect(potentialWinPesewas(1000, 320)).toBe(3200);
  });

  it("builds system combinations", () => {
    expect(systemCombinations([1, 2, 3], 2)).toHaveLength(3);
    const sys = systemPotentialWin(3000, [200, 200, 200], 2);
    expect(sys.combinationCount).toBe(3);
    expect(sys.potentialWinPesewas).toBeGreaterThan(0);
  });
});

describe("ghana phone", () => {
  it("normalizes local and international formats", () => {
    expect(normalizeGhanaPhone("0241234567")).toBe("0241234567");
    expect(normalizeGhanaPhone("+233241234567")).toBe("0241234567");
    expect(normalizeGhanaPhone("123")).toBeNull();
  });

  it("detects mobile money networks", () => {
    expect(detectProvider("0241234567")).toBe("MTN");
    expect(detectProvider("0201234567")).toBe("TELECEL");
    expect(detectProvider("0271234567")).toBe("AIRTELTIGO");
  });
});

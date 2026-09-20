import { describe, expect, it } from "vitest";
import { excludeDemoFootball } from "./query";

describe("excludeDemoFootball", () => {
  it("keeps non-football demo fixtures but hides football demo rows from production UI", () => {
    expect(excludeDemoFootball({ status: "LIVE" })).toEqual({
      AND: [{ status: "LIVE" }, { NOT: { sportId: "football", isDemo: true } }],
    });
  });
});

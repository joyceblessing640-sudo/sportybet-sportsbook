import { describe, expect, it } from "vitest";
import { formatFixtureDay, formatKickoff, formatKickoff12, ghanaDate, startOfGhanaDay, ymdInZone } from "./time";
import { FOOTBALL_TZ } from "./types";

describe("football timezone", () => {
  it("formats kickoff in Africa/Accra rather than treating a UTC offset as already-local", () => {
    expect(formatKickoff("2026-09-20T16:00:00+00:00")).toBe("16:00");
    expect(formatKickoff("2026-09-20T16:00:00+01:00")).toBe("15:00");
  });

  it("formats compact list kickoffs and date headers without changing the Accra instant", () => {
    expect(formatKickoff12("2026-09-20T13:00:00+00:00")).toBe("1:00PM");
    expect(formatFixtureDay("2026-09-20T13:00:00+00:00")).toBe("Sunday, 09/20");
  });

  it("computes Ghana calendar dates in Accra", () => {
    const ymd = ghanaDate(0);
    expect(ymd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(ymdInZone(startOfGhanaDay(0), FOOTBALL_TZ)).toBe(ymd);
  });
});

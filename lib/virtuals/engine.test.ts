import { describe, expect, it } from "vitest";
import {
  filterVirtualMatches,
  generateVirtualFixtures,
  getVirtualMatch,
  leagueLine,
  marketById,
  resultCode,
  selectionWon,
  simulateMatch,
} from "./engine";

const DAY = new Date("2026-09-20T12:00:00.000Z");

describe("virtual Instant Football engine", () => {
  it("builds a long day-stable virtual fixture list, not live football fixtures", () => {
    const first = generateVirtualFixtures(DAY);
    const second = generateVirtualFixtures(DAY);
    expect(first.length).toBeGreaterThan(50);
    expect(first.map((match) => match.id)).toEqual(second.map((match) => match.id));
    expect(first.every((match) => match.id.startsWith("vif-"))).toBe(true);
    expect(first.some((match) => match.home.name === "Getafe" && match.away.name === "Malaga")).toBe(true);
  });

  it("filters Popular, country leagues, and Champions League separately", () => {
    const all = generateVirtualFixtures(DAY);
    const popular = filterVirtualMatches(all, "popular");
    const spain = filterVirtualMatches(all, "spain");
    const ucl = filterVirtualMatches(all, "ucl");
    expect(popular.length).toBeGreaterThan(20);
    expect(spain.every((match) => match.league.id === "spain")).toBe(true);
    expect(ucl.every((match) => match.league.id === "ucl")).toBe(true);
    expect(leagueLine(spain[0].league)).toBe("Spain - La Liga");
    expect(leagueLine(ucl[0].league)).toBe("Champions League");
  });

  it("prices 1X2, 1UP, and 2UP markets on every virtual match", () => {
    const match = generateVirtualFixtures(DAY)[0];
    const oneXTwo = marketById(match, "1X2");
    const oneUp = marketById(match, "1X2-1UP");
    expect(oneXTwo.outcomes.map((o) => o.code)).toEqual(["1", "X", "2"]);
    expect(oneUp.handicap).toBe(1);
    expect(oneXTwo.outcomes.every((o) => o.odds >= 115)).toBe(true);
  });

  it("simulates Kick Off through Full Time and updates the score on GOAL", () => {
    const match = generateVirtualFixtures(DAY)[0];
    const sim = simulateMatch(match.id, DAY);
    expect(sim.events[0]?.type).toBe("KICK_OFF");
    expect(sim.events.some((event) => event.type === "HT")).toBe(true);
    expect(sim.events.some((event) => event.type === "SECOND_HALF")).toBe(true);
    expect(sim.events.at(-1)?.type).toBe("FT");
    const lastGoal = [...sim.events].reverse().find((event) => event.type === "GOAL");
    if (lastGoal) {
      expect(lastGoal.homeScore + lastGoal.awayScore).toBeGreaterThan(0);
      expect(sim.homeScore).toBe(lastGoal.homeScore);
      expect(sim.awayScore).toBe(lastGoal.awayScore);
    }
    expect(sim.homeScore).toBe(sim.events.at(-1)?.homeScore);
    expect(getVirtualMatch(match.id, DAY)?.id).toBe(match.id);
  });

  it("settles 1X2 and handicap picks from the simulated score", () => {
    expect(resultCode(2, 1)).toBe("1");
    expect(resultCode(1, 1)).toBe("X");
    expect(resultCode(0, 2)).toBe("2");
    expect(selectionWon("1", 0, 0, 1)).toBe(true);
    expect(selectionWon("X", 0, 1, 1)).toBe(true);
    expect(selectionWon("2", 0, 2, 1)).toBe(true);
  });
});

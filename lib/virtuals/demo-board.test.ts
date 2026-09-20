import { describe, expect, it } from "vitest";
import {
  DEMO_MATCHES,
  boardMatches,
  demoOutcomes,
  getDemoMatch,
  handicapForMarket,
  marketOdds,
} from "./demo-board";
import { settleDemoTicket, type DemoTicket } from "./demo-tickets";
import { selectionWon, simulateMatch } from "./engine";

describe("Instant Football demo board", () => {
  it("recreates the seven reference boards with clickable 1X2 prices", () => {
    expect(DEMO_MATCHES).toHaveLength(56);
    expect(boardMatches("england")).toHaveLength(8);
    expect(boardMatches("cwc")).toHaveLength(8);
    const cov = getDemoMatch("if-england-cov-cry");
    expect(cov?.odds).toEqual([256, 371, 256]);
    expect(getDemoMatch("if-spain-fcb-lev")?.odds).toEqual([136, 541, 754]);
    expect(getDemoMatch("if-germany-bmu-koe")?.odds).toEqual([129, 664, 810]);
    expect(getDemoMatch("if-italy-juv-lec")?.odds).toEqual([168, 389, 502]);
    expect(getDemoMatch("if-champions-liv-psg")?.odds).toEqual([215, 442, 278]);
    expect(getDemoMatch("if-euros-eng-fra")?.odds).toEqual([214, 319, 373]);
    expect(getDemoMatch("if-cwc-rma-che")?.odds).toEqual([185, 405, 382]);
    expect(DEMO_MATCHES.every((match) => match.home.logo.includes("/virtuals/crests/") && match.away.logo.includes("/virtuals/crests/"))).toBe(true);
  });

  it("builds 1UP and 2UP markets from the 1X2 board", () => {
    const match = getDemoMatch("if-england-mun-lee");
    expect(match).toBeTruthy();
    const oneUp = demoOutcomes(match!, "1X2-1UP");
    expect(oneUp.map((item) => item.code)).toEqual(["1", "X", "2"]);
    expect(handicapForMarket("1X2-2UP")).toBe(2);
    const shifted = marketOdds(match!.odds, "1X2-1UP");
    expect(shifted[0]).toBeGreaterThan(match!.odds[0]);
  });
});

describe("Instant Football demo tickets", () => {
  it("settles a demo ticket from the simulated score without wallet movement", () => {
    const ticket: DemoTicket = {
      kind: "instant-football-demo",
      id: "DEMOTEST",
      publicId: "IFTEST",
      createdAt: "2026-09-20T12:00:00.000Z",
      type: "SINGLE",
      stakePesewas: 1000,
      totalOdds: 256,
      potentialWinPesewas: 2560,
      picks: [
        {
          matchId: "if-england-cov-cry",
          matchLabel: "COV vs CRY",
          league: "England",
          boardId: "england",
          marketId: "1X2",
          marketName: "1X2",
          selection: "1",
          odds: 256,
          handicap: 0,
          homeName: "Coventry",
          awayName: "Crystal Palace",
        },
      ],
      status: "OPEN",
      demo: true,
    };
    const settled = settleDemoTicket(ticket, new Date("2026-09-20T12:00:00.000Z"));
    const sim = simulateMatch("if-england-cov-cry", new Date("2026-09-20T12:00:00.000Z"), {
      home: "Coventry",
      away: "Crystal Palace",
    });
    expect(settled.status).toBe("SETTLED");
    expect(settled.results?.[0]?.homeScore).toBe(sim.homeScore);
    expect(settled.won).toBe(selectionWon("1", sim.homeScore, sim.awayScore, 0));
    expect(settled.payoutPesewas).toBe(settled.won ? 2560 : 0);
  });
});

import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEMO_MATCHES,
  boardMatches,
  demoOutcomes,
  getDemoMatch,
  handicapForMarket,
  marketOdds,
} from "./demo-board";
import { combineOddsHundredths, potentialWinPesewas } from "../money";
import { placeDemoBet, settleDemoTicket, type DemoTicket } from "./demo-tickets";
import { selectionWon, simulateMatch } from "./engine";

describe("Instant Football demo board", () => {
  it("builds seven clickable Instant Football boards from demo match data", () => {
    expect(DEMO_MATCHES).toHaveLength(56);
    expect(boardMatches("england")).toHaveLength(8);
    expect(boardMatches("cwc")).toHaveLength(8);
    const mun = getDemoMatch("if-england-mun-lee");
    expect(mun?.home.abbreviation).toBe("MUN");
    expect(mun?.away.abbreviation).toBe("LEE");
    expect(getDemoMatch("if-spain-fcb-lev")?.odds[0]).toBeGreaterThan(100);
    expect(DEMO_MATCHES.every((match) => match.home.logo.includes("/virtuals/crests/") && match.away.logo.includes("/virtuals/crests/"))).toBe(true);
  });

  it("builds a new round of fixtures without freezing screenshot teams", () => {
    const first = boardMatches("england", 1)[0];
    const next = boardMatches("england", 2)[0];
    expect(next.id).not.toBe(first.id);
    expect(getDemoMatch(next.id)?.id).toBe(next.id);
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
      ticketNo: "1000001",
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

  it("computes multiple odds and a 4% max bonus from the live selections", () => {
    const totalOdds = combineOddsHundredths([438, 208]);
    const potentialWin = potentialWinPesewas(100, totalOdds);
    expect(totalOdds).toBe(911);
    expect(potentialWin + Math.round(potentialWin * 0.04)).toBe(947);
  });

  it("keeps the six Instant Football state screenshots for the live slip", () => {
    const files = [
      "public/virtuals/if-states/1-single.jpg",
      "public/virtuals/if-states/2-multi.jpg",
      "public/virtuals/if-states/3-sheet.jpg",
      "public/virtuals/if-states/4-confirm.jpg",
      "public/virtuals/if-states/5-submitting.jpg",
      "public/virtuals/if-states/6-ticket.jpg",
    ];
    for (const file of files) expect(existsSync(file), file).toBe(true);
  });

  it("places a demo ticket from the current slip instead of screenshot data", () => {
    const ticket = placeDemoBet({
      type: "MULTI",
      stakePesewas: 100,
      items: [
        {
          matchId: "if-england-mun-lee",
          matchLabel: "MUN vs LEE",
          league: "England",
          marketId: "1X2",
          marketName: "1X2",
          outcomeId: "if-england-mun-lee:1X2:1",
          selection: "1",
          odds: 174,
        },
        {
          matchId: "if-england-ast-nfo",
          matchLabel: "AST vs NFO",
          league: "England",
          marketId: "1X2",
          marketName: "1X2",
          outcomeId: "if-england-ast-nfo:1X2:1",
          selection: "1",
          odds: 220,
        },
      ],
    });
    expect(ticket.ticketNo).toMatch(/^\d{7}$/);
    expect(ticket.picks.map((pick) => pick.matchLabel)).toEqual(["MUN vs LEE", "AST vs NFO"]);
    expect(ticket.totalOdds).toBe(Math.round(1.74 * 2.2 * 100));
    expect(ticket.type).toBe("MULTI");
  });
});

import { prisma } from "@/lib/db";
import { AuthError } from "@/lib/auth";
import {
  combineOddsHundredths,
  MAX_STAKE_PESEWAS,
  MIN_STAKE_PESEWAS,
  potentialWinPesewas,
} from "@/lib/money";
import { publicId } from "@/lib/utils";
import {
  getVirtualMatch,
  marketById,
  selectionWon,
  simulateMatch,
  type VirtualMarketId,
} from "./engine";
import { parseVirtualTicket, type VirtualTicket, type VirtualTicketSelection } from "./ticket";

export type PlaceVirtualInput = {
  userId: string;
  type: "SINGLE" | "MULTI";
  stakePesewas: number;
  picks: { matchId: string; marketId: VirtualMarketId; selection: "1" | "X" | "2" }[];
};

export async function placeVirtualBet(input: PlaceVirtualInput) {
  const { userId, type, stakePesewas, picks } = input;
  if (!Number.isInteger(stakePesewas) || stakePesewas < MIN_STAKE_PESEWAS) {
    throw new AuthError(`Minimum stake is GHS ${(MIN_STAKE_PESEWAS / 100).toFixed(2)}.`, 400);
  }
  if (stakePesewas > MAX_STAKE_PESEWAS) {
    throw new AuthError(`Maximum stake is GHS ${(MAX_STAKE_PESEWAS / 100).toFixed(2)}.`, 400);
  }
  if (picks.length === 0) throw new AuthError("Add at least one selection.", 400);
  if (type === "SINGLE" && picks.length !== 1) {
    throw new AuthError("Single bets must have exactly one selection.", 400);
  }
  if (type === "MULTI" && picks.length < 2) {
    throw new AuthError("Multi bets need at least two selections.", 400);
  }

  const matchIds = picks.map((pick) => pick.matchId);
  if (new Set(matchIds).size !== matchIds.length) {
    throw new AuthError("You cannot combine multiple selections from the same virtual match.", 400);
  }

  const selections: VirtualTicketSelection[] = picks.map((pick) => {
    const match = getVirtualMatch(pick.matchId);
    if (!match) throw new AuthError("A virtual match is no longer available.", 409);
    const market = marketById(match, pick.marketId);
    const outcome = market.outcomes.find((item) => item.code === pick.selection);
    if (!outcome) throw new AuthError("A selected odd is no longer available.", 409);
    return {
      matchId: match.id,
      matchLabel: `${match.home.shortName} vs ${match.away.shortName}`,
      league: `${match.league.country} - ${match.league.name}`,
      marketId: market.id,
      marketName: market.name,
      selection: pick.selection,
      odds: outcome.odds,
    };
  });

  const totalOdds = combineOddsHundredths(selections.map((item) => item.odds));
  const potential = potentialWinPesewas(stakePesewas, totalOdds);
  const ticketId = publicId("VIF");

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new AuthError("Wallet not found.", 400);
    if (wallet.balancePesewas < stakePesewas) throw new AuthError("Insufficient balance.", 400);

    const updated = await tx.wallet.updateMany({
      where: { userId, version: wallet.version, balancePesewas: { gte: stakePesewas } },
      data: {
        balancePesewas: { decrement: stakePesewas },
        withdrawablePesewas: { decrement: Math.min(wallet.withdrawablePesewas, stakePesewas) },
        version: { increment: 1 },
      },
    });
    if (updated.count !== 1) throw new AuthError("Could not debit wallet. Try again.", 409);

    const nextWallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
    const ticket: VirtualTicket = {
      kind: "instant-football",
      publicId: ticketId,
      type,
      stakePesewas,
      totalOdds,
      potentialWinPesewas: potential,
      selections,
      settled: false,
    };

    await tx.transaction.create({
      data: {
        publicId: ticketId,
        userId,
        type: "BET_STAKE",
        status: "SUCCESSFUL",
        amountPesewas: -stakePesewas,
        balanceAfter: nextWallet.balancePesewas,
        note: JSON.stringify(ticket),
      },
    });

    return {
      ticket,
      balancePesewas: nextWallet.balancePesewas,
      matchIds: selections.map((item) => item.matchId),
    };
  });
}

export async function settleVirtualBet(userId: string, ticketId: string) {
  return prisma.$transaction(async (tx) => {
    const row = await tx.transaction.findUnique({ where: { publicId: ticketId } });
    if (!row || row.userId !== userId) throw new AuthError("Virtual ticket not found.", 404);
    const ticket = parseVirtualTicket(row.note);
    if (!ticket) throw new AuthError("This is not an Instant Football ticket.", 400);

    if (ticket.settled) {
      const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
      return { ticket, balancePesewas: wallet.balancePesewas };
    }

    const results = ticket.selections.map((pick) => {
      const match = getVirtualMatch(pick.matchId);
      const market = match ? marketById(match, pick.marketId) : { handicap: 0 };
      const sim = simulateMatch(pick.matchId);
      return {
        matchId: pick.matchId,
        homeScore: sim.homeScore,
        awayScore: sim.awayScore,
        won: selectionWon(pick.selection, sim.homeScore, sim.awayScore, market.handicap),
      };
    });

    const won = results.every((item) => item.won);
    const payout = won ? ticket.potentialWinPesewas : 0;
    const nextTicket: VirtualTicket = {
      ...ticket,
      settled: true,
      won,
      payoutPesewas: payout,
    };

    let balancePesewas = (await tx.wallet.findUniqueOrThrow({ where: { userId } })).balancePesewas;

    if (payout > 0) {
      const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });
      await tx.wallet.update({
        where: { userId },
        data: {
          balancePesewas: { increment: payout },
          withdrawablePesewas: { increment: payout },
          version: { increment: 1 },
        },
      });
      const next = await tx.wallet.findUniqueOrThrow({ where: { userId } });
      balancePesewas = next.balancePesewas;
      await tx.transaction.create({
        data: {
          publicId: publicId("TX"),
          userId,
          type: "BET_WIN",
          status: "SUCCESSFUL",
          amountPesewas: payout,
          balanceAfter: next.balancePesewas,
          note: JSON.stringify({ kind: "instant-football-payout", ticketId: ticket.publicId }),
        },
      });
      void wallet;
    }

    await tx.transaction.update({
      where: { id: row.id },
      data: { note: JSON.stringify(nextTicket) },
    });

    return { ticket: nextTicket, balancePesewas, results };
  });
}

import { prisma } from "./db";
import { AuthError } from "./auth";
import {
  combineOddsHundredths,
  MIN_STAKE_PESEWAS,
  MAX_STAKE_PESEWAS,
  potentialWinPesewas,
  systemPotentialWin,
} from "./money";
import { publicId } from "./utils";

export type BetSlipSelection = {
  outcomeId: string;
};

export async function placeBet(input: {
  userId: string;
  type: "SINGLE" | "MULTI" | "SYSTEM";
  stakePesewas: number;
  outcomeIds: string[];
  systemK?: number;
}) {
  const { userId, type, stakePesewas, outcomeIds } = input;

  if (!Number.isInteger(stakePesewas) || stakePesewas < MIN_STAKE_PESEWAS) {
    throw new AuthError(`Minimum stake is GHS ${(MIN_STAKE_PESEWAS / 100).toFixed(2)}.`, 400);
  }
  if (stakePesewas > MAX_STAKE_PESEWAS) {
    throw new AuthError(`Maximum stake is GHS ${(MAX_STAKE_PESEWAS / 100).toFixed(2)}.`, 400);
  }
  if (outcomeIds.length === 0) {
    throw new AuthError("Add at least one selection.", 400);
  }
  if (type === "SINGLE" && outcomeIds.length !== 1) {
    throw new AuthError("Single bets must have exactly one selection.", 400);
  }
  if (type === "MULTI" && outcomeIds.length < 2) {
    throw new AuthError("Multi bets need at least two selections.", 400);
  }
  if (type === "SYSTEM" && outcomeIds.length < 3) {
    throw new AuthError("System bets need at least three selections.", 400);
  }

  const uniqueIds = [...new Set(outcomeIds)];
  if (uniqueIds.length !== outcomeIds.length) {
    throw new AuthError("Duplicate selections are not allowed.", 400);
  }

  return prisma.$transaction(async (tx) => {
    const outcomes = await tx.outcome.findMany({
      where: { id: { in: uniqueIds }, active: true },
      include: {
        market: {
          include: {
            match: { include: { homeTeam: true, awayTeam: true, league: true } },
          },
        },
      },
    });

    if (outcomes.length !== uniqueIds.length) {
      throw new AuthError("One or more selections are no longer available.", 409);
    }

    for (const outcome of outcomes) {
      if (outcome.market.status !== "OPEN") {
        throw new AuthError("A selected market is closed.", 409);
      }
      if (["FINISHED", "CANCELLED"].includes(outcome.market.match.status)) {
        throw new AuthError("A selected match is no longer open for betting.", 409);
      }
    }

    const matchIds = outcomes.map((o) => o.market.matchId);
    if (new Set(matchIds).size !== matchIds.length && type !== "SINGLE") {
      throw new AuthError("You cannot combine multiple selections from the same match.", 400);
    }

    const odds = outcomes.map((o) => o.odds);
    const systemK = input.systemK ?? Math.max(2, outcomes.length - 1);

    let totalOdds: number;
    let potential: number;

    if (type === "SYSTEM") {
      const sys = systemPotentialWin(stakePesewas, odds, systemK);
      if (sys.combinationCount === 0) {
        throw new AuthError("Invalid system combination.", 400);
      }
      totalOdds = sys.avgOdds;
      potential = sys.potentialWinPesewas;
    } else {
      totalOdds = combineOddsHundredths(odds);
      potential = potentialWinPesewas(stakePesewas, totalOdds);
    }

    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new AuthError("Wallet not found.", 400);
    if (wallet.balancePesewas < stakePesewas) {
      throw new AuthError("Insufficient balance.", 400);
    }

    const updated = await tx.wallet.updateMany({
      where: {
        userId,
        version: wallet.version,
        balancePesewas: { gte: stakePesewas },
      },
      data: {
        balancePesewas: { decrement: stakePesewas },
        withdrawablePesewas: {
          decrement: Math.min(wallet.withdrawablePesewas, stakePesewas),
        },
        version: { increment: 1 },
      },
    });

    if (updated.count !== 1) {
      throw new AuthError("Could not debit wallet. Try again.", 409);
    }

    const nextWallet = await tx.wallet.findUniqueOrThrow({ where: { userId } });

    const bet = await tx.bet.create({
      data: {
        publicId: publicId("SB"),
        userId,
        type,
        status: "PENDING",
        stakePesewas,
        totalOdds,
        potentialWinPesewas: potential,
        selections: {
          create: outcomes.map((outcome) => ({
            matchId: outcome.market.matchId,
            outcomeId: outcome.id,
            marketType: outcome.market.type,
            marketName: outcome.market.name,
            outcomeLabel: outcome.label,
            odds: outcome.odds,
            status: "PENDING",
          })),
        },
      },
      include: { selections: true },
    });

    await tx.transaction.create({
      data: {
        publicId: publicId("TX"),
        userId,
        type: "BET_STAKE",
        status: "SUCCESSFUL",
        amountPesewas: -stakePesewas,
        balanceAfter: nextWallet.balancePesewas,
        betId: bet.id,
        note: `Stake for bet ${bet.publicId}`,
      },
    });

    return { bet, balancePesewas: nextWallet.balancePesewas };
  });
}

export async function getUserBets(userId: string, tab: "OPEN" | "SETTLED" | "CANCELLED", page = 1) {
  const take = 20;
  const skip = (page - 1) * take;
  const statusFilter =
    tab === "OPEN"
      ? { status: "PENDING" }
      : tab === "CANCELLED"
        ? { status: { in: ["CANCELLED", "REFUNDED"] } }
        : { status: { in: ["WON", "LOST"] } };

  const [items, total] = await Promise.all([
    prisma.bet.findMany({
      where: { userId, ...statusFilter },
      include: {
        selections: {
          include: {
            match: { include: { homeTeam: true, awayTeam: true, league: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.bet.count({ where: { userId, ...statusFilter } }),
  ]);

  return { items, total, page, pageSize: take };
}

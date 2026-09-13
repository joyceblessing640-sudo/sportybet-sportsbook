import { prisma } from "./db";
import { AuthError } from "./auth";
import { publicId } from "./utils";
import {
  MAX_WITHDRAW_PESEWAS,
  MIN_DEPOSIT_PESEWAS,
  MIN_WITHDRAW_PESEWAS,
} from "./money";
import { detectProvider, normalizeGhanaPhone } from "./validation";
import { writeAudit } from "./audit";

export async function createDeposit(input: {
  userId: string;
  method: "MOBILE_MONEY" | "BANK" | "CARD";
  provider?: string;
  amountPesewas: number;
  phone?: string;
  reference?: string;
  ip?: string | null;
}) {
  if (input.amountPesewas < MIN_DEPOSIT_PESEWAS) {
    throw new AuthError("Amount is below the minimum deposit.", 400);
  }
  if (input.method === "MOBILE_MONEY") {
    const phone = input.phone ? normalizeGhanaPhone(input.phone) : null;
    if (!phone) throw new AuthError("Enter a valid Ghana mobile number.", 400);
    const detected = detectProvider(phone);
    if (input.provider && detected && input.provider !== detected) {
      throw new AuthError("The phone number does not match the selected provider.", 400);
    }
  }

  const deposit = await prisma.deposit.create({
    data: {
      publicId: publicId("DP"),
      userId: input.userId,
      method: input.method,
      provider: input.provider,
      amountPesewas: input.amountPesewas,
      phone: input.phone ? normalizeGhanaPhone(input.phone) : undefined,
      reference: input.reference?.trim() || publicId("REF"),
      status: "PENDING",
    },
  });

  await prisma.transaction.create({
    data: {
      publicId: publicId("TX"),
      userId: input.userId,
      type: "DEPOSIT",
      status: "PENDING",
      amountPesewas: input.amountPesewas,
      depositId: deposit.id,
      reference: deposit.reference,
      note: "Awaiting payment confirmation",
    },
  });

  await writeAudit({
    actorId: input.userId,
    action: "DEPOSIT_CREATED",
    entityType: "Deposit",
    entityId: deposit.id,
    ip: input.ip,
    metadata: { amountPesewas: input.amountPesewas, method: input.method },
  });

  return deposit;
}

export async function createWithdrawal(input: {
  userId: string;
  method: "MOBILE_MONEY" | "BANK";
  provider?: string;
  amountPesewas: number;
  phone?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  ip?: string | null;
}) {
  if (input.amountPesewas < MIN_WITHDRAW_PESEWAS) {
    throw new AuthError("Amount is below the minimum withdrawal.", 400);
  }
  if (input.amountPesewas > MAX_WITHDRAW_PESEWAS) {
    throw new AuthError("Amount exceeds the maximum withdrawal.", 400);
  }

  if (input.method === "MOBILE_MONEY") {
    const phone = input.phone ? normalizeGhanaPhone(input.phone) : null;
    if (!phone) throw new AuthError("Enter a valid Ghana mobile number.", 400);
    if (!input.provider) throw new AuthError("Select a mobile money provider.", 400);
    const detected = detectProvider(phone);
    if (detected && detected !== input.provider) {
      throw new AuthError("The phone number does not match the selected provider.", 400);
    }
  } else {
    if (!input.accountName || !input.accountNumber || !input.bankName) {
      throw new AuthError("Enter complete bank details.", 400);
    }
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId: input.userId } });
    if (!wallet) throw new AuthError("Wallet not found.", 400);
    if (wallet.withdrawablePesewas < input.amountPesewas) {
      throw new AuthError("Amount exceeds your withdrawable balance.", 400);
    }

    const held = await tx.wallet.updateMany({
      where: {
        userId: input.userId,
        version: wallet.version,
        withdrawablePesewas: { gte: input.amountPesewas },
        balancePesewas: { gte: input.amountPesewas },
      },
      data: {
        balancePesewas: { decrement: input.amountPesewas },
        withdrawablePesewas: { decrement: input.amountPesewas },
        version: { increment: 1 },
      },
    });
    if (held.count !== 1) {
      throw new AuthError("Could not reserve funds. Try again.", 409);
    }

    const nextWallet = await tx.wallet.findUniqueOrThrow({ where: { userId: input.userId } });

    const withdrawal = await tx.withdrawal.create({
      data: {
        publicId: publicId("WD"),
        userId: input.userId,
        method: input.method,
        provider: input.provider,
        amountPesewas: input.amountPesewas,
        phone: input.phone ? normalizeGhanaPhone(input.phone) : undefined,
        accountName: input.accountName,
        accountNumber: input.accountNumber,
        bankName: input.bankName,
        status: "PENDING",
      },
    });

    await tx.transaction.create({
      data: {
        publicId: publicId("TX"),
        userId: input.userId,
        type: "WITHDRAWAL",
        status: "PENDING",
        amountPesewas: -input.amountPesewas,
        balanceAfter: nextWallet.balancePesewas,
        withdrawalId: withdrawal.id,
        note: "Withdrawal request submitted and waiting for confirmation",
      },
    });

    await writeAudit({
      actorId: input.userId,
      action: "WITHDRAWAL_CREATED",
      entityType: "Withdrawal",
      entityId: withdrawal.id,
      ip: input.ip,
      metadata: { amountPesewas: input.amountPesewas, method: input.method },
    });

    return withdrawal;
  });
}

export async function reviewDeposit(input: {
  adminId: string;
  depositId: string;
  decision: "APPROVE" | "REJECT";
  note?: string;
  ip?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const deposit = await tx.deposit.findUnique({ where: { id: input.depositId } });
    if (!deposit) throw new AuthError("Deposit not found.", 404);
    if (deposit.status !== "PENDING" && deposit.status !== "PROCESSING") {
      throw new AuthError("This deposit has already been reviewed.", 409);
    }

    if (input.decision === "REJECT") {
      await tx.deposit.update({
        where: { id: deposit.id },
        data: {
          status: "FAILED",
          adminNote: input.note,
          reviewedBy: input.adminId,
          reviewedAt: new Date(),
        },
      });
      await tx.transaction.updateMany({
        where: { depositId: deposit.id },
        data: { status: "FAILED", note: input.note ?? "Deposit rejected" },
      });
      await writeAudit({
        actorId: input.adminId,
        action: "DEPOSIT_REJECTED",
        entityType: "Deposit",
        entityId: deposit.id,
        ip: input.ip,
      });
      return { status: "FAILED" as const };
    }

    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: deposit.userId } });
    await tx.wallet.update({
      where: { userId: deposit.userId },
      data: {
        balancePesewas: { increment: deposit.amountPesewas },
        withdrawablePesewas: { increment: deposit.amountPesewas },
        version: { increment: 1 },
      },
    });
    const next = await tx.wallet.findUniqueOrThrow({ where: { userId: deposit.userId } });
    await tx.deposit.update({
      where: { id: deposit.id },
      data: {
        status: "SUCCESSFUL",
        adminNote: input.note,
        reviewedBy: input.adminId,
        reviewedAt: new Date(),
      },
    });
    await tx.transaction.updateMany({
      where: { depositId: deposit.id },
      data: {
        status: "SUCCESSFUL",
        balanceAfter: next.balancePesewas,
        note: "Deposit confirmed",
      },
    });
    await writeAudit({
      actorId: input.adminId,
      action: "DEPOSIT_APPROVED",
      entityType: "Deposit",
      entityId: deposit.id,
      ip: input.ip,
      metadata: { previousBalance: wallet.balancePesewas },
    });
    return { status: "SUCCESSFUL" as const };
  });
}

export async function reviewWithdrawal(input: {
  adminId: string;
  withdrawalId: string;
  decision: "APPROVE" | "REJECT";
  note?: string;
  ip?: string | null;
}) {
  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({ where: { id: input.withdrawalId } });
    if (!withdrawal) throw new AuthError("Withdrawal not found.", 404);
    if (withdrawal.status !== "PENDING" && withdrawal.status !== "PROCESSING") {
      throw new AuthError("This withdrawal has already been reviewed.", 409);
    }

    if (input.decision === "APPROVE") {
      await tx.withdrawal.update({
        where: { id: withdrawal.id },
        data: {
          status: "SUCCESSFUL",
          adminNote: input.note,
          reviewedBy: input.adminId,
          reviewedAt: new Date(),
        },
      });
      await tx.transaction.updateMany({
        where: { withdrawalId: withdrawal.id },
        data: { status: "SUCCESSFUL", note: "Withdrawal confirmed" },
      });
      await writeAudit({
        actorId: input.adminId,
        action: "WITHDRAWAL_APPROVED",
        entityType: "Withdrawal",
        entityId: withdrawal.id,
        ip: input.ip,
      });
      return { status: "SUCCESSFUL" as const };
    }

    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId: withdrawal.userId } });
    await tx.wallet.update({
      where: { userId: withdrawal.userId },
      data: {
        balancePesewas: { increment: withdrawal.amountPesewas },
        withdrawablePesewas: { increment: withdrawal.amountPesewas },
        version: { increment: 1 },
      },
    });
    const next = await tx.wallet.findUniqueOrThrow({ where: { userId: withdrawal.userId } });
    await tx.withdrawal.update({
      where: { id: withdrawal.id },
      data: {
        status: "FAILED",
        adminNote: input.note,
        reviewedBy: input.adminId,
        reviewedAt: new Date(),
      },
    });
    await tx.transaction.updateMany({
      where: { withdrawalId: withdrawal.id },
      data: {
        status: "FAILED",
        balanceAfter: next.balancePesewas,
        note: input.note ?? "Withdrawal rejected, funds returned",
      },
    });
    await writeAudit({
      actorId: input.adminId,
      action: "WITHDRAWAL_REJECTED",
      entityType: "Withdrawal",
      entityId: withdrawal.id,
      ip: input.ip,
      metadata: { restored: withdrawal.amountPesewas, previous: wallet.balancePesewas },
    });
    return { status: "FAILED" as const };
  });
}

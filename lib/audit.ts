import { prisma } from "./db";

export async function writeAudit(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? undefined,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? undefined,
      metadata: JSON.stringify(input.metadata ?? {}),
      ip: input.ip ?? undefined,
    },
  });
}

export async function liveMinute(startTime: Date, status: string) {
  if (status !== "LIVE" && status !== "HT") return null;
  const elapsed = Math.max(0, Math.floor((Date.now() - startTime.getTime()) / 60000));
  if (status === "HT") return "HT";
  if (elapsed <= 45) return `${Math.min(elapsed, 45)}'`;
  if (elapsed <= 47) return "HT";
  const second = Math.min(elapsed - 47, 45);
  if (second >= 45) return "90+'";
  return `${45 + second}'`;
}

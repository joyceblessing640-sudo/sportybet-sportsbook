import type { AuthUser } from "@/components/providers";
import { getSession } from "./auth";
import { prisma } from "./db";

export async function getAuthPayload(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { wallet: true },
  });
  if (!user || user.status === "SUSPENDED") return null;
  const unread = await prisma.notification.count({
    where: { userId: user.id, read: false },
  });
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    loyaltyTier: user.loyaltyTier,
    phone: user.phone,
    unread,
    wallet: user.wallet
      ? {
          balancePesewas: user.wallet.balancePesewas,
          withdrawablePesewas: user.wallet.withdrawablePesewas,
          bonusPesewas: user.wallet.bonusPesewas,
        }
      : null,
  };
}

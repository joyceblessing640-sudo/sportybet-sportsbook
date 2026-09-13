import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonOk } from "@/lib/http";

export async function GET() {
  const session = await getSession();
  if (!session) return jsonOk({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { wallet: true },
  });
  if (!user) return jsonOk({ user: null });
  const unread = await prisma.notification.count({
    where: { userId: user.id, read: false },
  });
  return jsonOk({
    user: {
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
    },
  });
}

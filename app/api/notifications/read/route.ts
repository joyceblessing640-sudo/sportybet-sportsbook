import { AuthError, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST() {
  try {
    const session = await requireUser();
    await prisma.notification.updateMany({
      where: { userId: session.id, read: false },
      data: { read: true },
    });
    return jsonOk({ read: true });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    return jsonError("Could not update notifications.", 500);
  }
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";

const schema = z.object({ matchId: z.string() });

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Missing match.");
    const existing = await prisma.favorite.findUnique({
      where: { userId_matchId: { userId: session.id, matchId: body.data.matchId } },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return jsonOk({ favorite: false });
    }
    await prisma.favorite.create({
      data: { userId: session.id, matchId: body.data.matchId },
    });
    return jsonOk({ favorite: true });
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    return jsonError("Could not update favourite.", 500);
  }
}

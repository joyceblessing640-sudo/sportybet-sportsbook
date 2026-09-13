"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { readSlipItems, writeSlipItems } from "@/lib/slip";

export async function toggleSlipSelection(formData: FormData) {
  const outcomeId = String(formData.get("outcomeId") ?? "");
  if (!outcomeId) return;
  const outcome = await prisma.outcome.findUnique({
    where: { id: outcomeId },
    include: {
      market: {
        include: {
          match: { include: { homeTeam: true, awayTeam: true, league: true } },
        },
      },
    },
  });
  if (!outcome?.active || outcome.market.status !== "OPEN") return;

  const items = await readSlipItems();
  if (items.some((item) => item.outcomeId === outcome.id)) {
    await writeSlipItems(items.filter((item) => item.outcomeId !== outcome.id));
  } else {
    const next = items.filter((item) => item.matchId !== outcome.market.matchId);
    next.push({
      outcomeId: outcome.id,
      matchId: outcome.market.matchId,
      matchLabel: `${outcome.market.match.homeTeam.shortName} vs ${outcome.market.match.awayTeam.shortName}`,
      league: outcome.market.match.league.name,
      marketName: outcome.market.name,
      outcomeLabel: outcome.label,
      odds: outcome.odds,
    });
    await writeSlipItems(next);
  }
  revalidatePath("/", "layout");
}

export async function removeSlipSelection(formData: FormData) {
  const outcomeId = String(formData.get("outcomeId") ?? "");
  const items = await readSlipItems();
  await writeSlipItems(items.filter((item) => item.outcomeId !== outcomeId));
  revalidatePath("/", "layout");
}

export async function clearSlipAction() {
  await writeSlipItems([]);
  revalidatePath("/", "layout");
}

export async function loadCodeAction(formData: FormData) {
  const ids = String(formData.get("outcomeIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const current = await readSlipItems();
  const next = [...current];
  for (const outcomeId of ids) {
    const outcome = await prisma.outcome.findUnique({
      where: { id: outcomeId },
      include: {
        market: {
          include: {
            match: { include: { homeTeam: true, awayTeam: true, league: true } },
          },
        },
      },
    });
    if (!outcome?.active) continue;
    const filtered = next.filter((item) => item.matchId !== outcome.market.matchId);
    filtered.push({
      outcomeId: outcome.id,
      matchId: outcome.market.matchId,
      matchLabel: `${outcome.market.match.homeTeam.shortName} vs ${outcome.market.match.awayTeam.shortName}`,
      league: outcome.market.match.league.name,
      marketName: outcome.market.name,
      outcomeLabel: outcome.label,
      odds: outcome.odds,
    });
    next.splice(0, next.length, ...filtered);
  }
  await writeSlipItems(next);
  revalidatePath("/", "layout");
}

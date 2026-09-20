"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { excludeDemoFootball } from "@/lib/football/query";
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

export async function loadBookingCodeAction(_prev: { error?: string } | null, formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: "Enter a booking code." };
  if (code !== "SB7K2Q" && code !== "D5P6AF") {
    return { error: "Unknown booking code. Demo codes: SB7K2Q and D5P6AF." };
  }
  const featured = await prisma.match.findMany({
    where: excludeDemoFootball({ isFeatured: true, status: { in: ["SCHEDULED", "LIVE", "HT"] } }),
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      markets: { include: { outcomes: { where: { active: true } } } },
    },
    orderBy: { startTime: "asc" },
    take: 8,
  });
  const picks = code === "D5P6AF" ? featured.slice(3, 6) : featured.slice(0, 3);
  const ids = picks
    .map((match) => (match.markets.find((m) => m.type === "1X2") ?? match.markets[0])?.outcomes[0]?.id)
    .filter(Boolean)
    .join(",");
  const fd = new FormData();
  fd.set("outcomeIds", ids);
  await loadCodeAction(fd);
  redirect("/slip");
}

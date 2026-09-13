"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { placeBet } from "@/lib/betting";
import { parseGhsToPesewas } from "@/lib/money";
import { readSlipItems, writeSlipItems } from "@/lib/slip";
import { revalidatePath } from "next/cache";

export type PlaceBetState = { error?: string } | null;

export async function placeBetAction(_prev: PlaceBetState, formData: FormData): Promise<PlaceBetState> {
  const session = await getSession();
  if (!session) redirect("/login?next=/slip");

  const typeRaw = String(formData.get("type") ?? "SINGLE");
  const type = typeRaw === "MULTI" || typeRaw === "SYSTEM" ? typeRaw : "SINGLE";
  const stakePesewas = parseGhsToPesewas(String(formData.get("stake") ?? ""));
  if (stakePesewas === null) return { error: "Enter a valid stake." };

  const items = await readSlipItems();
  if (items.length === 0) return { error: "Add at least one selection." };

  try {
    await placeBet({
      userId: session.id,
      type,
      stakePesewas,
      outcomeIds: items.map((item) => item.outcomeId),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not place this bet." };
  }

  await writeSlipItems([]);
  revalidatePath("/", "layout");
  redirect("/bets");
}

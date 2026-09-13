import { cookies } from "next/headers";

export type SlipItem = {
  outcomeId: string;
  matchId: string;
  matchLabel: string;
  league: string;
  marketName: string;
  outcomeLabel: string;
  odds: number;
};

export const SLIP_COOKIE = "sb_slip";

export async function readSlipItems(): Promise<SlipItem[]> {
  const jar = await cookies();
  const raw = jar.get(SLIP_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SlipItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.outcomeId === "string");
  } catch {
    return [];
  }
}

export async function writeSlipItems(items: SlipItem[]) {
  const jar = await cookies();
  jar.set(SLIP_COOKIE, JSON.stringify(items), {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });
}

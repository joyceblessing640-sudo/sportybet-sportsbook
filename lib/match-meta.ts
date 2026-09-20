/** Stable 5-digit fixture code shown next to kick-off (demo, not a feed ID). */
export function matchDisplayId(id: string) {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return String(10000 + ((hash >>> 0) % 90000));
}

/** Extra-market count for the +N affordance on a match row. */
export function extraMarketsCount(id: string, outcomeCount: number) {
  const code = Number(matchDisplayId(id));
  return 18 + (code % 72) + Math.min(outcomeCount, 6);
}

export function isHotMatch(status: string, isFeatured: boolean) {
  return isFeatured || status === "LIVE" || status === "HT";
}

export function isBestOddsMatch(sportId: string, status: string) {
  return sportId === "football" && status !== "ENDED";
}

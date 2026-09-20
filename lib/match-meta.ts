/** Stable 5-digit fixture code shown next to kick-off. */
export function matchDisplayId(id: string) {
  const numeric = id.replace(/\D/g, "");
  if (numeric.length >= 5) return numeric.slice(-5);
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return String(10000 + ((hash >>> 0) % 90000));
}

/** Extra-market count for the +N affordance. Uses real outcome counts only. */
export function extraMarketsCount(outcomeCount: number) {
  return Math.max(0, outcomeCount - 3);
}

export function isHotMatch(status: string, isFeatured: boolean) {
  return isFeatured || status === "LIVE" || status === "HT";
}

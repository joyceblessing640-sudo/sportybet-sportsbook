type Entry<T> = { value: T; expiresAt: number };

const store = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key) as Entry<T> | undefined;
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function cachePeek<T>(key: string): T | undefined {
  return (store.get(key) as Entry<T> | undefined)?.value;
}

export const TTL = {
  live: 12_000,
  fixtures: 8 * 60_000,
  odds: 12 * 60_000,
  leagues: 12 * 60 * 60_000,
  events: 20_000,
  error: 20_000,
};

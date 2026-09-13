export const PESEWAS_PER_GHS = 100;
export const MIN_DEPOSIT_PESEWAS = 100; // GHS 1.00
export const MIN_WITHDRAW_PESEWAS = 1000; // GHS 10.00
export const MAX_WITHDRAW_PESEWAS = 5_000_000; // GHS 50,000
export const MIN_STAKE_PESEWAS = 100; // GHS 1.00
export const MAX_STAKE_PESEWAS = 1_000_000; // GHS 10,000

export function toGhs(pesewas: number): string {
  return (pesewas / PESEWAS_PER_GHS).toFixed(2);
}

export function formatGhs(pesewas: number): string {
  return `GHS ${toGhs(pesewas)}`;
}

export function parseGhsToPesewas(input: string): number | null {
  const trimmed = input.trim().replace(/,/g, "");
  if (!trimmed) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * PESEWAS_PER_GHS);
}

export function formatOdds(oddsHundredths: number): string {
  return (oddsHundredths / 100).toFixed(2);
}

export function combineOddsHundredths(odds: number[]): number {
  if (odds.length === 0) return 0;
  let acc = 1;
  for (const o of odds) {
    acc *= o / 100;
  }
  return Math.round(acc * 100);
}

export function potentialWinPesewas(stakePesewas: number, oddsHundredths: number): number {
  if (stakePesewas <= 0 || oddsHundredths <= 0) return 0;
  return Math.floor((stakePesewas * oddsHundredths) / 100);
}

export function systemCombinations<T>(items: T[], choose: number): T[][] {
  if (choose <= 0 || choose > items.length) return [];
  const result: T[][] = [];
  const walk = (start: number, path: T[]) => {
    if (path.length === choose) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < items.length; i += 1) {
      path.push(items[i]);
      walk(i + 1, path);
      path.pop();
    }
  };
  walk(0, []);
  return result;
}

export function systemPotentialWin(
  stakePesewas: number,
  odds: number[],
  systemK: number,
): { combinationCount: number; potentialWinPesewas: number; avgOdds: number } {
  const combos = systemCombinations(odds, systemK);
  if (combos.length === 0) {
    return { combinationCount: 0, potentialWinPesewas: 0, avgOdds: 0 };
  }
  const stakeEach = Math.floor(stakePesewas / combos.length);
  let win = 0;
  let oddsSum = 0;
  for (const combo of combos) {
    const combined = combineOddsHundredths(combo);
    oddsSum += combined;
    win += potentialWinPesewas(stakeEach, combined);
  }
  return {
    combinationCount: combos.length,
    potentialWinPesewas: win,
    avgOdds: Math.round(oddsSum / combos.length),
  };
}

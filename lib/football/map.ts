import type { ApiFixtureItem, ApiOddsItem, MappedMarket, ResolvedLeague } from "./types";
import { TARGET_LEAGUES as LEAGUE_TARGETS } from "./types";

const FEATURED_SLUGS = new Set(["ucl", "premier-league", "la-liga", "uel"]);

export function mapFixtureStatus(short: string): "SCHEDULED" | "LIVE" | "HT" | "FINISHED" | "CANCELLED" {
  const code = short.toUpperCase();
  if (code === "HT") return "HT";
  if (["1H", "2H", "ET", "BT", "P", "LIVE", "INT", "SUSP"].includes(code)) return "LIVE";
  if (["FT", "AET", "PEN"].includes(code)) return "FINISHED";
  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(code)) return "CANCELLED";
  return "SCHEDULED";
}

export function liveClock(status: string, elapsed: number | null | undefined, extra?: number | null) {
  if (status === "HT") return "HT";
  if (status !== "LIVE") return null;
  if (elapsed == null) return "LIVE";
  if (extra && extra > 0) return `${elapsed}+${extra}'`;
  return `${elapsed}'`;
}

export function periodLabel(short: string, extra?: number | null) {
  const code = short.toUpperCase();
  if (code === "HT") return "HT";
  if (code === "1H") return extra ? `1H ${extra}+` : "1H";
  if (code === "2H") return extra ? `2H ${extra}+` : "2H";
  if (code === "ET") return "ET";
  if (code === "P") return "PEN";
  return null;
}

export function teamAbbreviation(name: string, code?: string | null) {
  const trimmed = code?.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  if (trimmed && trimmed.length >= 2) return trimmed.padEnd(3, trimmed[0] ?? "X");
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase().padEnd(3, "X");
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .padEnd(3, "X")
    .slice(0, 3);
}

export function fallbackColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return `hsl(${hue} 55% 38%)`;
}

function parseOdd(raw: string) {
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n <= 1) return null;
  return Math.round(n * 100);
}

function outcome(code: string, label: string, odd: string) {
  const odds = parseOdd(odd);
  if (odds == null) return null;
  return { code, label, odds };
}

function matchWinnerOutcomes(values: { value: string; odd: string }[]) {
  const home = values.find((v) => /^(home)$/i.test(v.value));
  const draw = values.find((v) => /^(draw)$/i.test(v.value));
  const away = values.find((v) => /^(away)$/i.test(v.value));
  if (!home || !draw || !away) return null;
  const mapped = [
    outcome("1", "1", home.odd),
    outcome("X", "X", draw.odd),
    outcome("2", "2", away.odd),
  ];
  if (mapped.some((item) => !item)) return null;
  return mapped as NonNullable<(typeof mapped)[number]>[];
}

export function mapOddsMarkets(item: ApiOddsItem | undefined): MappedMarket[] {
  if (!item?.bookmakers?.length) return [];
  const preferred = item.bookmakers.find((b) => b.id === 8) ?? item.bookmakers.find((b) => b.id === 6) ?? item.bookmakers[0];
  if (!preferred?.bets?.length) return [];

  const markets: MappedMarket[] = [];
  const used = new Set<string>();

  const take = (type: string, name: string, line: string | null, outcomes: MappedMarket["outcomes"] | null) => {
    if (!outcomes || outcomes.length < 2) return;
    const key = `${type}:${line ?? ""}`;
    if (used.has(key)) return;
    used.add(key);
    markets.push({ type, name, line, outcomes });
  };

  for (const bet of preferred.bets) {
    const label = bet.name.trim();
    const values = bet.values ?? [];

    if (/^(match winner|fulltime result|1x2)$/i.test(label)) {
      take("1X2", "1X2", null, matchWinnerOutcomes(values));
      continue;
    }

    if (/double chance/i.test(label)) {
      const oneX = values.find((v) => /home\/draw|1x/i.test(v.value));
      const twelve = values.find((v) => /home\/away|12/i.test(v.value));
      const x2 = values.find((v) => /draw\/away|x2/i.test(v.value));
      if (oneX && twelve && x2) {
        take("DC", "Double Chance", null, [
          outcome("1X", "1X", oneX.odd),
          outcome("12", "12", twelve.odd),
          outcome("X2", "X2", x2.odd),
        ].filter(Boolean) as MappedMarket["outcomes"]);
      }
      continue;
    }

    if (/both teams (to )?score/i.test(label)) {
      const yes = values.find((v) => /^yes$/i.test(v.value));
      const no = values.find((v) => /^no$/i.test(v.value));
      if (yes && no) {
        take("BTTS", "BTTS", null, [
          outcome("YES", "Yes", yes.odd),
          outcome("NO", "No", no.odd),
        ].filter(Boolean) as MappedMarket["outcomes"]);
      }
      continue;
    }

    if (/draw no bet/i.test(label)) {
      const home = values.find((v) => /^home$/i.test(v.value));
      const away = values.find((v) => /^away$/i.test(v.value));
      if (home && away) {
        take("DNB", "Draw No Bet", null, [
          outcome("1", "Home", home.odd),
          outcome("2", "Away", away.odd),
        ].filter(Boolean) as MappedMarket["outcomes"]);
      }
      continue;
    }

    if (/goals over\/under$/i.test(label) || /^over\/under$/i.test(label)) {
      const over = values.find((v) => /^over /i.test(v.value));
      const under = values.find((v) => /^under /i.test(v.value));
      const line = (over ?? under)?.value.replace(/^(over|under)\s+/i, "") ?? null;
      if (over && under && line) {
        take("OU", "Over/Under", line, [
          outcome("OVER", "Over", over.odd),
          outcome("UNDER", "Under", under.odd),
        ].filter(Boolean) as MappedMarket["outcomes"]);
      }
      continue;
    }

    if (/over\/under.*first half|goals over\/under first half/i.test(label)) {
      const over = values.find((v) => /^over /i.test(v.value));
      const under = values.find((v) => /^under /i.test(v.value));
      const line = (over ?? under)?.value.replace(/^(over|under)\s+/i, "") ?? null;
      if (over && under && line) {
        take("FHOU", "1st Half O/U", line, [
          outcome("OVER", "Over", over.odd),
          outcome("UNDER", "Under", under.odd),
        ].filter(Boolean) as MappedMarket["outcomes"]);
      }
      continue;
    }

    if (/first half winner/i.test(label)) {
      take("FH", "First Half", null, matchWinnerOutcomes(values));
      continue;
    }

    if (/asian handicap/i.test(label) && !/first half/i.test(label)) {
      const home = values.find((v) => /home/i.test(v.value));
      const away = values.find((v) => /away/i.test(v.value));
      if (home && away) {
        const line = home.value.replace(/home\s*/i, "").trim() || away.value.replace(/away\s*/i, "").trim();
        take("AH", "Handicap", line || null, [
          outcome("1", "1", home.odd),
          outcome("2", "2", away.odd),
        ].filter(Boolean) as MappedMarket["outcomes"]);
      }
    }
  }

  return markets;
}

export function extraMarketsFromReal(markets: { outcomes: unknown[] }[]) {
  const outcomes = markets.reduce((sum, market) => sum + market.outcomes.length, 0);
  return Math.max(0, outcomes - 3);
}

export function isFeaturedLeague(slug: string) {
  return FEATURED_SLUGS.has(slug);
}

export function resolveTargetLeagues(
  rows: { id: number; name: string; country: string; type?: string; seasons?: { year: number; current: boolean }[] }[],
): ResolvedLeague[] {
  const resolved: ResolvedLeague[] = [];
  for (const target of LEAGUE_TARGETS) {
    const wanted = target.name.toLowerCase();
    const matches = rows.filter((row) => {
      const country = row.country === "England" || row.country === "United Kingdom" ? "England" : row.country;
      const countryOk =
        country.toLowerCase() === target.country.toLowerCase() ||
        (target.country === "World" && ["World", "Europe"].includes(row.country));
      if (!countryOk) return false;
      const name = row.name.toLowerCase();
      if (target.slug === "la-liga") return name.includes("la liga") || name === "primera division";
      if (target.slug === "mls") return name.includes("major league soccer") || name === "mls";
      if (target.slug === "ucl") return name.includes("champions league") && !name.includes("women") && !name.includes("youth");
      if (target.slug === "uel") return name.includes("europa league") && !name.includes("conference");
      return name === wanted || name.includes(wanted);
    });
    const row =
      matches.find((item) => item.name.toLowerCase() === wanted && item.seasons?.some((s) => s.current)) ??
      matches.find((item) => item.name.toLowerCase() === wanted) ??
      matches.find((item) => item.seasons?.some((s) => s.current)) ??
      matches[0];
    if (!row) continue;
    const season = row.seasons?.find((s) => s.current)?.year ?? row.seasons?.[0]?.year;
    if (!season) continue;
    resolved.push({
      slug: target.slug,
      name: target.slug === "la-liga" ? "La Liga" : row.name,
      country: target.country === "World" ? "Europe" : row.country,
      apiId: row.id,
      season,
    });
  }
  return resolved;
}

export function fixtureBelongsTo(item: ApiFixtureItem, leagues: ResolvedLeague[]) {
  return leagues.some((league) => league.apiId === item.league.id);
}

import { prisma } from "./db";
import { liveMinute } from "./audit";
import { excludeDemoFootball } from "./football/query";
import { ensureFootballSynced, getFootballFeedMeta, type FootballFeedMeta } from "./football/sync";
import { startOfGhanaDay } from "./football/time";

export const matchInclude = {
  league: true,
  sport: true,
  homeTeam: true,
  awayTeam: true,
  markets: { include: { outcomes: { where: { active: true }, orderBy: { code: "asc" as const } } } },
};

export type MatchWithRelations = Awaited<ReturnType<typeof getMatchById>>;

export async function getSports() {
  return prisma.sport.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getLeagues(sportId?: string) {
  return prisma.league.findMany({
    where: sportId ? { sportId } : undefined,
    include: { sport: true, _count: { select: { matches: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

const OPEN = { in: ["SCHEDULED", "LIVE", "HT"] };

export async function getHomePayload() {
  const feed = await ensureFootballSynced("home");
  const now = new Date();
  const inThreeHours = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const todayStart = startOfGhanaDay(0);
  const tomorrowStart = startOfGhanaDay(1);

  const [sports, leagues, featured, live, today, upcoming, promotions] = await Promise.all([
    getSports(),
    prisma.league.findMany({
      where: { sportId: "football" },
      orderBy: { sortOrder: "asc" },
      take: 12,
    }),
    prisma.match.findMany({
      where: excludeDemoFootball({ isFeatured: true, status: OPEN }),
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 8,
    }),
    prisma.match.findMany({
      where: excludeDemoFootball({ status: { in: ["LIVE", "HT"] } }),
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 20,
    }),
    prisma.match.findMany({
      where: excludeDemoFootball({
        status: OPEN,
        startTime: { gte: todayStart, lt: tomorrowStart },
      }),
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 40,
    }),
    prisma.match.findMany({
      where: excludeDemoFootball({
        status: "SCHEDULED",
        startTime: { gte: now, lte: inThreeHours },
      }),
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 20,
    }),
    prisma.promotion.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    sports,
    leagues,
    featured: await withClocks(featured),
    live: await withClocks(live),
    today: await withClocks(today),
    upcoming: await withClocks(upcoming),
    promotions,
    feed,
  };
}

export async function getLivePayload() {
  const feed = await ensureFootballSynced("live");
  const matches = await prisma.match.findMany({
    where: excludeDemoFootball({ status: { in: ["LIVE", "HT"] } }),
    include: matchInclude,
    orderBy: { startTime: "asc" },
  });
  return { matches: await withClocks(matches), feed };
}

export async function getMatchesByLeague(slug: string) {
  await ensureFootballSynced("home");
  const league = await prisma.league.findUnique({
    where: { slug },
    include: { sport: true },
  });
  if (!league) return null;
  const matches = await prisma.match.findMany({
    where: excludeDemoFootball({ leagueId: league.id, status: OPEN }),
    include: matchInclude,
    orderBy: { startTime: "asc" },
    take: 80,
  });
  return { league, matches: await withClocks(matches), feed: await getFootballFeedMeta() };
}

export async function getMatchById(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: matchInclude,
  });
  if (!match) return null;
  if (match.sportId === "football" && match.isDemo) return null;
  const [withClock] = await withClocks([match]);
  return withClock;
}

export async function searchMatches(q: string) {
  const query = q.trim();
  if (query.length < 2) return [];
  await ensureFootballSynced("home");
  const matches = await prisma.match.findMany({
    where: excludeDemoFootball({
      status: OPEN,
      OR: [
        { homeTeam: { name: { contains: query } } },
        { awayTeam: { name: { contains: query } } },
        { league: { name: { contains: query } } },
      ],
    }),
    include: matchInclude,
    orderBy: { startTime: "asc" },
    take: 40,
  });
  return withClocks(matches);
}

export async function withClocks<
  T extends { startTime: Date; status: string; elapsed?: number | null },
>(matches: T[]) {
  return Promise.all(
    matches.map(async (match) => ({
      ...match,
      clock: await liveMinute(match.startTime, match.status, match.elapsed),
    })),
  );
}

export function market1x2<T extends { type: string; outcomes: { code: string; odds: number; id: string; label: string }[] }>(
  markets: T[],
) {
  return markets.find((m) => m.type === "1X2");
}

export type { FootballFeedMeta };

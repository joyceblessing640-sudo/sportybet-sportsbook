import { prisma } from "./db";
import { liveMinute } from "./audit";

const matchInclude = {
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

export async function getHomePayload() {
  const now = new Date();
  const inThreeHours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const [sports, leagues, featured, live, today, upcoming, promotions] = await Promise.all([
    getSports(),
    prisma.league.findMany({
      where: { sportId: "football" },
      orderBy: { sortOrder: "asc" },
      take: 12,
    }),
    prisma.match.findMany({
      where: { isFeatured: true, status: { in: ["SCHEDULED", "LIVE", "HT"] } },
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 8,
    }),
    prisma.match.findMany({
      where: { status: { in: ["LIVE", "HT"] } },
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 20,
    }),
    prisma.match.findMany({
      where: {
        status: { in: ["SCHEDULED", "LIVE", "HT"] },
        startTime: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        },
      },
      include: matchInclude,
      orderBy: { startTime: "asc" },
      take: 40,
    }),
    prisma.match.findMany({
      where: {
        status: "SCHEDULED",
        startTime: { gte: now, lte: inThreeHours },
      },
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
  };
}

export async function getMatchesByLeague(slug: string) {
  const league = await prisma.league.findUnique({
    where: { slug },
    include: { sport: true },
  });
  if (!league) return null;
  const matches = await prisma.match.findMany({
    where: { leagueId: league.id, status: { in: ["SCHEDULED", "LIVE", "HT"] } },
    include: matchInclude,
    orderBy: { startTime: "asc" },
    take: 80,
  });
  return { league, matches: await withClocks(matches) };
}

export async function getMatchById(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: matchInclude,
  });
  if (!match) return null;
  const [withClock] = await withClocks([match]);
  return withClock;
}

export async function searchMatches(q: string) {
  const query = q.trim();
  if (query.length < 2) return [];
  const matches = await prisma.match.findMany({
    where: {
      status: { in: ["SCHEDULED", "LIVE", "HT"] },
      OR: [
        { homeTeam: { name: { contains: query } } },
        { awayTeam: { name: { contains: query } } },
        { league: { name: { contains: query } } },
      ],
    },
    include: matchInclude,
    orderBy: { startTime: "asc" },
    take: 40,
  });
  return withClocks(matches);
}

async function withClocks<T extends { startTime: Date; status: string }>(matches: T[]) {
  return Promise.all(
    matches.map(async (match) => ({
      ...match,
      clock: await liveMinute(match.startTime, match.status),
    })),
  );
}

export function market1x2<T extends { type: string; outcomes: { code: string; odds: number; id: string; label: string }[] }>(
  markets: T[],
) {
  return markets.find((m) => m.type === "1X2");
}

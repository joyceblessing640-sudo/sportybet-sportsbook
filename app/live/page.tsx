import { LiveView } from "@/components/live/live-view";
import { prisma } from "@/lib/db";
import { liveMinute } from "@/lib/audit";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const raw = await prisma.match.findMany({
    where: { status: { in: ["LIVE", "HT"] } },
    include: {
      league: true,
      sport: true,
      homeTeam: true,
      awayTeam: true,
      markets: { include: { outcomes: { where: { active: true }, orderBy: { code: "asc" } } } },
    },
    orderBy: { startTime: "asc" },
  });
  const matches = await Promise.all(
    raw.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );
  return <LiveView matches={matches} />;
}

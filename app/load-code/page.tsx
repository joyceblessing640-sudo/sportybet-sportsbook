import { LoadCodeForm } from "@/components/betting/load-code-form";
import { prisma } from "@/lib/db";
import { liveMinute } from "@/lib/audit";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function LoadCodePage() {
  const raw = await prisma.match.findMany({
    where: { isFeatured: true, status: { in: ["SCHEDULED", "LIVE", "HT"] } },
    include: {
      league: true,
      sport: true,
      homeTeam: true,
      awayTeam: true,
      markets: { include: { outcomes: { where: { active: true }, orderBy: { code: "asc" } } } },
    },
    orderBy: { startTime: "asc" },
    take: 8,
  });
  const matches = await Promise.all(
    raw.map(async (m) => serializeMatch({ ...m, clock: await liveMinute(m.startTime, m.status) })),
  );
  return <LoadCodeForm matches={matches} />;
}

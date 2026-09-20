import { LoadCodeForm } from "@/components/betting/load-code-form";
import { prisma } from "@/lib/db";
import { withClocks, matchInclude } from "@/lib/data";
import { serializeMatch } from "@/lib/serialize";
import { excludeDemoFootball } from "@/lib/football/query";
import { ensureFootballSynced } from "@/lib/football/sync";

export const dynamic = "force-dynamic";

export default async function LoadCodePage() {
  await ensureFootballSynced("home");
  const raw = await prisma.match.findMany({
    where: excludeDemoFootball({ isFeatured: true, status: { in: ["SCHEDULED", "LIVE", "HT"] } }),
    include: matchInclude,
    orderBy: { startTime: "asc" },
    take: 8,
  });
  const matches = (await withClocks(raw)).map(serializeMatch);
  return <LoadCodeForm matches={matches} />;
}

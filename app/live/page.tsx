import { LiveView } from "@/components/live/live-view";
import { getLivePayload } from "@/lib/data";
import { serializeMatch } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export default async function LivePage() {
  const data = await getLivePayload();
  return <LiveView matches={data.matches.map(serializeMatch)} feedError={data.feed.error} />;
}

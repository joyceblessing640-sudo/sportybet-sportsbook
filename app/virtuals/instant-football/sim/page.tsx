import { InstantFootballSim } from "@/components/virtuals/instant-football-sim";

export default async function InstantFootballSimPage({
  searchParams,
}: {
  searchParams: Promise<{ matches?: string; ticket?: string }>;
}) {
  const params = await searchParams;
  const matchIds = (params.matches ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return <InstantFootballSim matchIds={matchIds} ticketId={params.ticket ?? null} />;
}

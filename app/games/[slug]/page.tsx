import { CrashDemo } from "@/components/games/crash-demo";
import { CRASH_GAMES } from "@/lib/games";
import { notFound } from "next/navigation";

export default async function CrashGamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = CRASH_GAMES.find((g) => g.id === slug);
  if (!game) notFound();
  return <CrashDemo gameId={game.id} />;
}

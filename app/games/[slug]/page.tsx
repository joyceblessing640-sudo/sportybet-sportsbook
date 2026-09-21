import { CrashDemo } from "@/components/games/crash-demo";
import { GamePlaceholder } from "@/components/games/game-placeholder";
import { findPlayableGame } from "@/lib/games";
import { notFound } from "next/navigation";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findPlayableGame(slug);
  if (!found) notFound();
  if (found.kind === "crash") return <CrashDemo gameId={found.game.id} />;
  return <GamePlaceholder name={found.game.name} />;
}

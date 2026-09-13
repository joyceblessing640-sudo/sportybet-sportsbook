import Link from "next/link";
import { CASINO_GAMES, CRASH_GAMES } from "@/lib/games";

export default function GamesPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Games</h1>
      <p className="mt-1 text-sm text-muted">
        Demo artwork only. Titles are original placeholders and are not real-money games. Licensed studios are not connected.
      </p>
      <h2 className="mt-5 text-sm font-bold">Crash</h2>
      <div className="mt-2 no-scrollbar flex gap-3 overflow-x-auto">
        {CRASH_GAMES.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className={`relative h-[140px] w-[160px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br p-3 text-white ${game.art}`}
          >
            <span className="absolute right-2 top-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px]">{game.players} players</span>
            <p className="mt-12 text-lg font-black">{game.name}</p>
            <p className="text-[11px] text-white/70">Open demo</p>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto">
        {["All", "Slots", "Live Casino", "Table Games"].map((tab) => (
          <span key={tab} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink">
            {tab}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {CASINO_GAMES.map((game) => (
          <article key={game.id} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${game.color} p-4 text-white shadow-sm`}>
            <p className="text-[10px] uppercase tracking-wide text-white/70">{game.category}</p>
            <h2 className="mt-8 text-lg font-black">{game.name}</h2>
            <p className="mt-1 text-[11px] text-white/70">Coming soon · Demo</p>
            <button type="button" disabled className="mt-4 h-8 rounded-md bg-white/20 px-3 text-xs font-bold">
              Unavailable
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

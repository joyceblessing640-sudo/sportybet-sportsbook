import Link from "next/link";
import { CASINO_GAMES, CRASH_GAMES } from "@/lib/games";

export default function GamesPage() {
  return (
    <div className="p-3">
      <h1 className="text-[14px] font-bold">Games</h1>
      <p className="mt-1 text-[12px] text-muted">
        Demo artwork only. Titles are original placeholders and are not real-money games.
      </p>
      <h2 className="mt-4 text-[13px] font-bold">Crash</h2>
      <div className="mt-2 no-scrollbar flex gap-2 overflow-x-auto">
        {CRASH_GAMES.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className={`relative h-[88px] w-[118px] shrink-0 overflow-hidden rounded-md bg-gradient-to-br p-2 text-white ${game.art}`}
          >
            <span className="absolute right-2 top-2 rounded bg-black/35 px-1.5 py-0.5 text-[10px]">{game.players}</span>
            <p className="mt-8 text-[12px] font-bold">{game.name}</p>
            <p className="text-[10px] text-white/70">Open demo</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {["All", "Slots", "Live Casino", "Table Games"].map((tab) => (
          <span key={tab} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-ink">
            {tab}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
        {CASINO_GAMES.map((game) => (
          <article key={game.id} className={`overflow-hidden rounded-md bg-gradient-to-br ${game.color} p-3 text-white`}>
            <p className="text-[10px] uppercase tracking-wide text-white/70">{game.category}</p>
            <h2 className="mt-6 text-[14px] font-bold">{game.name}</h2>
            <p className="mt-1 text-[11px] text-white/70">Coming soon · Demo</p>
            <button type="button" disabled className="mt-3 h-7 rounded bg-white/20 px-2.5 text-[11px] font-bold">
              Unavailable
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

const GAMES = [
  { id: "neon-reels", name: "Neon Reels", category: "Slots", color: "from-[#7c3aed] to-[#1e1b4b]" },
  { id: "gold-spin", name: "Gold Spin", category: "Slots", color: "from-[#f59e0b] to-[#7c2d12]" },
  { id: "live-roulette", name: "Studio Roulette", category: "Live Casino", color: "from-[#dc2626] to-[#111827]" },
  { id: "live-blackjack", name: "Studio Blackjack", category: "Live Casino", color: "from-[#0f766e] to-[#042f2e]" },
  { id: "classic-hold", name: "Hold 'Em Table", category: "Table Games", color: "from-[#1d4ed8] to-[#0f172a]" },
  { id: "baccarat", name: "Salon Baccarat", category: "Table Games", color: "from-[#9d174d] to-[#111827]" },
];

export default function GamesPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Games</h1>
      <p className="mt-1 text-sm text-muted">
        Demo artwork only. These titles are placeholders and are not real-money games. Licensed studios are not connected.
      </p>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {["All", "Slots", "Live Casino", "Table Games"].map((tab) => (
          <span key={tab} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink">
            {tab}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {GAMES.map((game) => (
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

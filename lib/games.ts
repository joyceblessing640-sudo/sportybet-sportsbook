export const CRASH_GAMES = [
  {
    id: "sky-rise",
    name: "Sky Rise",
    tag: "Crash",
    players: 765,
    href: "/games/sky-rise",
    art: "from-[#7f1d1d] via-[#b91c1c] to-[#0f172a]",
    blurb: "Watch the multiplier climb. Demo only — no real-money crash betting.",
  },
  {
    id: "jet-rush",
    name: "Jet Rush",
    tag: "Crash",
    players: 1170,
    href: "/games/jet-rush",
    art: "from-[#0f766e] via-[#155e75] to-[#111827]",
    blurb: "Fast round crash-style demo. Stakes are not accepted in this build.",
  },
  {
    id: "pulse-hero",
    name: "Pulse Hero",
    tag: "Arcade",
    players: 810,
    href: "/games/pulse-hero",
    art: "from-[#7c2d12] via-[#9a3412] to-[#1e1b4b]",
    blurb: "Original arcade placeholder. Licensed studios are not connected.",
  },
] as const;

export const HOME_TILES = [
  { href: "/sports/football/premier-league", label: "Premier League", tone: "from-[#3f0d12] to-[#111827]", kicker: "EPL" },
  { href: "/games/lucky-numbers", label: "Lucky Numbers", tone: "from-[#7f1d1d] to-[#1e1b4b]", kicker: "PICK" },
  { href: "/sports/football/la-liga", label: "La Liga", tone: "from-[#0c4a6e] to-[#111827]", kicker: "ESP" },
  { href: "/games", label: "Hero Cup", tone: "from-[#111827] to-[#7f1d1d]", kicker: "CUP" },
  { href: "/sports/football/bundesliga", label: "Bundesliga", tone: "from-[#1e3a8a] to-[#111827]", kicker: "GER" },
  { href: "/sports/football", label: "All Football", tone: "from-[#14532d] to-[#111827]", kicker: "ALL" },
] as const;

export const CASINO_GAMES = [
  { id: "neon-reels", name: "Neon Reels", category: "Slots", color: "from-[#7c3aed] to-[#1e1b4b]" },
  { id: "gold-spin", name: "Gold Spin", category: "Slots", color: "from-[#f59e0b] to-[#7c2d12]" },
  { id: "live-roulette", name: "Studio Roulette", category: "Live Casino", color: "from-[#dc2626] to-[#111827]" },
  { id: "live-blackjack", name: "Studio Blackjack", category: "Live Casino", color: "from-[#0f766e] to-[#042f2e]" },
  { id: "classic-hold", name: "Hold 'Em Table", category: "Table Games", color: "from-[#1d4ed8] to-[#0f172a]" },
  { id: "baccarat", name: "Salon Baccarat", category: "Table Games", color: "from-[#9d174d] to-[#111827]" },
] as const;

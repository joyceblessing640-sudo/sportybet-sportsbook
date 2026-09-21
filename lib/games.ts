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

export const LOBBY_GAMES = [
  { id: "spin-da-bottle", name: "Spin da Bottle", section: "promotion", art: "/games/spin-da-bottle.jpg" },
  { id: "red-blackjack", name: "Red Blackjack", section: "promotion", art: "/games/red-blackjack.jpg" },
  { id: "sporty-kick", name: "Sporty Kick", section: "promotion", art: "/games/sporty-kick.jpg" },
  { id: "spin-match", name: "Spin Match", section: "promotion", art: "/games/spin-match.jpg" },
  { id: "sporty-hero", name: "Sporty Hero", section: "trending", art: "/games/sporty-hero.jpg" },
  { id: "sporty-kick-trending", name: "Sporty Kick", section: "trending", art: "/games/sporty-kick.jpg", href: "/games/sporty-kick" },
  { id: "spin-match-trending", name: "Spin Match", section: "trending", art: "/games/spin-match.jpg", href: "/games/spin-match" },
  { id: "mines", name: "Mines", section: "trending", art: "/games/mines.jpg" },
  { id: "slingo-day-2-dab", name: "Slingo Day 2 Dab", section: "slingo", art: "/games/slingo-day-2-dab.jpg" },
  { id: "slingo-fire-ice", name: "Slingo Fire & Ice", section: "slingo", art: "/games/slingo-fire-ice.jpg" },
  { id: "slingo-day-of-the-dab", name: "Slingo Day of the Dab", section: "slingo", art: "/games/slingo-day-of-the-dab.jpg" },
  { id: "red-slingo", name: "Red Slingo", section: "slingo", art: "/games/red-slingo.jpg" },
  { id: "bet-jack", name: "Bet Jack", section: "cards", art: "/games/bet-jack.jpg" },
  { id: "holdem-poker", name: "Hold'em Poker", section: "cards", art: "/games/holdem-poker.jpg" },
  { id: "baccarat", name: "Baccarat", section: "cards", art: "/games/baccarat.jpg" },
  { id: "red-blackjack-cards", name: "Red Blackjack", section: "cards", art: "/games/red-blackjack.jpg", href: "/games/red-blackjack" },
] as const;

export const LOBBY_SECTIONS = [
  { id: "promotion", title: "Promotion Games" },
  { id: "trending", title: "Trending For Players Like You" },
  { id: "slingo", title: "Slingo" },
  { id: "cards", title: "Cards" },
] as const;

export function lobbyGameHref(game: (typeof LOBBY_GAMES)[number]) {
  return "href" in game && game.href ? game.href : `/games/${game.id}`;
}

export function findPlayableGame(slug: string) {
  const crash = CRASH_GAMES.find((game) => game.id === slug);
  if (crash) return { kind: "crash" as const, game: crash };
  const lobby = LOBBY_GAMES.find((game) => game.id === slug || lobbyGameHref(game) === `/games/${slug}`);
  if (lobby) return { kind: "lobby" as const, game: lobby };
  return null;
}

export const CASINO_GAMES = [
  { id: "neon-reels", name: "Neon Reels", category: "Slots", color: "from-[#7c3aed] to-[#1e1b4b]" },
  { id: "gold-spin", name: "Gold Spin", category: "Slots", color: "from-[#f59e0b] to-[#7c2d12]" },
  { id: "live-roulette", name: "Studio Roulette", category: "Live Casino", color: "from-[#dc2626] to-[#111827]" },
  { id: "live-blackjack", name: "Studio Blackjack", category: "Live Casino", color: "from-[#0f766e] to-[#042f2e]" },
  { id: "classic-hold", name: "Hold 'Em Table", category: "Table Games", color: "from-[#1d4ed8] to-[#0f172a]" },
  { id: "baccarat", name: "Salon Baccarat", category: "Table Games", color: "from-[#9d174d] to-[#111827]" },
] as const;

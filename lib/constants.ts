export const SPORTS_NAV = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/sports/football", label: "Football", icon: "football" },
  { href: "/live", label: "Live Betting", icon: "live" },
  { href: "/sports/basketball", label: "Basketball", icon: "basketball" },
  { href: "/sports/tennis", label: "Tennis", icon: "tennis" },
  { href: "/sports/esports", label: "eFootball", icon: "esports" },
  { href: "/virtuals", label: "Virtuals", icon: "virtuals" },
  { href: "/sports/ice-hockey", label: "Ice Hockey", icon: "hockey" },
  { href: "/sports/baseball", label: "Baseball", icon: "baseball" },
  { href: "/sports/volleyball", label: "Volleyball", icon: "volleyball" },
  { href: "/promotions", label: "Promotions", icon: "promos" },
] as const;

export const PRIMARY_SPORTS = [
  { href: "/", label: "Home", slug: "home", icon: "home" },
  { href: "/sports/football", label: "Football", slug: "football", icon: "football" },
  { href: "/live", label: "Live", slug: "live", icon: "live" },
  { href: "/sports/basketball", label: "Basketball", slug: "basketball", icon: "basketball" },
  { href: "/sports/tennis", label: "Tennis", slug: "tennis", icon: "tennis" },
  { href: "/sports/esports", label: "eFootball", slug: "esports", icon: "esports" },
  { href: "/virtuals", label: "Virtuals", slug: "virtuals", icon: "virtuals" },
] as const;

export const MORE_SPORTS = [
  { href: "/sports/table-tennis", label: "Table Tennis", slug: "table-tennis" },
  { href: "/sports/volleyball", label: "Volleyball", slug: "volleyball" },
  { href: "/sports/baseball", label: "Baseball", slug: "baseball" },
  { href: "/sports/handball", label: "Handball", slug: "handball" },
  { href: "/sports/ice-hockey", label: "Ice Hockey", slug: "ice-hockey" },
  { href: "/sports/cricket", label: "Cricket", slug: "cricket" },
  { href: "/sports/darts", label: "Darts", slug: "darts" },
  { href: "/sports/mma", label: "MMA", slug: "mma" },
  { href: "/sports/boxing", label: "Boxing", slug: "boxing" },
  { href: "/sports/futsal", label: "Futsal", slug: "futsal" },
  { href: "/sports/rugby", label: "Rugby", slug: "rugby" },
  { href: "/sports/snooker", label: "Snooker", slug: "snooker" },
  { href: "/sports/esports", label: "Counter-Strike", slug: "esports" },
  { href: "/sports/dota-2", label: "Dota 2", slug: "dota-2" },
  { href: "/sports/league-of-legends", label: "League of Legends", slug: "league-of-legends" },
] as const;

export const TOP_NAV = [
  { href: "/", label: "Home" },
  { href: "/sports", label: "Sports" },
  { href: "/live", label: "Live" },
  { href: "/bets", label: "My Bets" },
  { href: "/games", label: "Casino" },
  { href: "/promotions", label: "Promotions" },
] as const;

export const MARKET_TABS = [
  { id: "1X2", label: "1X2" },
  { id: "OU", label: "Over/Under" },
  { id: "DC", label: "Double Chance" },
  { id: "BTTS", label: "BTTS" },
  { id: "AH", label: "Handicap" },
  { id: "FH", label: "First Half" },
  { id: "FHOU", label: "1st Half O/U" },
  { id: "CS", label: "Correct Score" },
] as const;

export const LIST_MARKET_TABS = [
  { id: "1X2", label: "1X2" },
  { id: "OU", label: "O/U" },
  { id: "DC", label: "DC" },
  { id: "FHOU", label: "1st Half O/U" },
  { id: "AH", label: "Handicap" },
  { id: "FH", label: "Hc" },
  { id: "BTTS", label: "1up 2up" },
] as const;

export const LIVE_SPORT_TABS = [
  { id: "live", label: "Live", href: "/live" },
  { id: "football", label: "Football", href: "/sports/football" },
  { id: "vfootball", label: "vFootball", href: "/virtuals" },
  { id: "basketball", label: "Basketball", href: "/sports/basketball" },
  { id: "tennis", label: "Tennis", href: "/sports/tennis" },
  { id: "efootball", label: "eFootball", href: "/sports/esports" },
] as const;

export const PAYMENT_METHODS = ["AT", "MTN", "Telecel", "VISA", "Mastercard", "Bank"] as const;

export function catalogSport(slug: string) {
  return MORE_SPORTS.find((item) => item.slug === slug) ?? PRIMARY_SPORTS.find((item) => item.slug === slug);
}

export const SPORTS_NAV = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/sports/football", label: "Football", icon: "football" },
  { href: "/sports/basketball", label: "Basketball", icon: "basketball" },
  { href: "/sports/tennis", label: "Tennis", icon: "tennis" },
  { href: "/sports/ice-hockey", label: "Ice Hockey", icon: "hockey" },
  { href: "/sports/baseball", label: "Baseball", icon: "baseball" },
  { href: "/sports/volleyball", label: "Volleyball", icon: "volleyball" },
  { href: "/sports/esports", label: "Esports", icon: "esports" },
  { href: "/live", label: "Live Betting", icon: "live" },
  { href: "/virtuals", label: "Virtuals", icon: "virtuals" },
  { href: "/promotions", label: "Promotions", icon: "promos" },
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

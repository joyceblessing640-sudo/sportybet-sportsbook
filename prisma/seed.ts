import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function odds(value: number) {
  return Math.round(value * 100);
}

function minutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60_000);
}

function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60_000);
}

function daysFromNow(days: number, hour = 16) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  await prisma.betSelection.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.deposit.deleteMany();
  await prisma.withdrawal.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.market.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.league.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  const demoHash = await bcrypt.hash("DemoPass123!", 12);
  const adminHash = await bcrypt.hash("AdminPass123!", 12);
  const subHash = await bcrypt.hash("SubAdmin123!", 12);

  const demo = await prisma.user.create({
    data: {
      email: "demo@sportbet.test",
      phone: "0240000001",
      username: "demo_player",
      passwordHash: demoHash,
      role: "USER",
      loyaltyTier: "Silver",
      wallet: {
        create: {
          balancePesewas: 25_000,
          withdrawablePesewas: 18_000,
          bonusPesewas: 5_000,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@sportbet.test",
      phone: "0240000002",
      username: "sportbet_admin",
      passwordHash: adminHash,
      role: "ADMIN",
      loyaltyTier: "Platinum",
      wallet: { create: { balancePesewas: 0, withdrawablePesewas: 0 } },
    },
  });

  await prisma.user.create({
    data: {
      email: "subadmin@sportbet.test",
      phone: "0240000003",
      username: "sportbet_ops",
      passwordHash: subHash,
      role: "SUB_ADMIN",
      loyaltyTier: "Gold",
      wallet: { create: { balancePesewas: 0, withdrawablePesewas: 0 } },
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: "min_deposit_pesewas", value: "100" },
      { key: "min_withdraw_pesewas", value: "1000" },
      { key: "max_withdraw_pesewas", value: "5000000" },
      { key: "min_stake_pesewas", value: "100" },
      { key: "site_name", value: "SPORTBET" },
      { key: "demo_mode", value: "true" },
    ],
  });

  await Promise.all([
    prisma.sport.create({ data: { id: "football", name: "Football", slug: "football", icon: "football", sortOrder: 1 } }),
    prisma.sport.create({ data: { id: "basketball", name: "Basketball", slug: "basketball", icon: "basketball", sortOrder: 2 } }),
    prisma.sport.create({ data: { id: "tennis", name: "Tennis", slug: "tennis", icon: "tennis", sortOrder: 3 } }),
    prisma.sport.create({ data: { id: "ice-hockey", name: "Ice Hockey", slug: "ice-hockey", icon: "hockey", sortOrder: 4 } }),
    prisma.sport.create({ data: { id: "baseball", name: "Baseball", slug: "baseball", icon: "baseball", sortOrder: 5 } }),
    prisma.sport.create({ data: { id: "volleyball", name: "Volleyball", slug: "volleyball", icon: "volleyball", sortOrder: 6 } }),
    prisma.sport.create({ data: { id: "esports", name: "Esports", slug: "esports", icon: "esports", sortOrder: 7 } }),
  ]);

  const leagueDefs = [
    { sportId: "football", name: "Premier League", country: "England", slug: "premier-league", sortOrder: 1 },
    { sportId: "football", name: "La Liga", country: "Spain", slug: "la-liga", sortOrder: 2 },
    { sportId: "football", name: "Serie A", country: "Italy", slug: "serie-a", sortOrder: 3 },
    { sportId: "football", name: "Bundesliga", country: "Germany", slug: "bundesliga", sortOrder: 4 },
    { sportId: "football", name: "Ligue 1", country: "France", slug: "ligue-1", sortOrder: 5 },
    { sportId: "football", name: "Championship", country: "England", slug: "championship", sortOrder: 6 },
    { sportId: "football", name: "UEFA Champions League", country: "Europe", slug: "ucl", sortOrder: 7 },
    { sportId: "football", name: "UEFA Europa League", country: "Europe", slug: "uel", sortOrder: 8 },
    { sportId: "football", name: "MLS", country: "USA", slug: "mls", sortOrder: 9 },
    { sportId: "football", name: "Ghana Premier League", country: "Ghana", slug: "ghana-premier-league", sortOrder: 10 },
    { sportId: "football", name: "Brasileirão Série A", country: "Brazil", slug: "brasileirao", sortOrder: 11 },
    { sportId: "basketball", name: "NBA", country: "USA", slug: "nba", sortOrder: 1 },
    { sportId: "tennis", name: "ATP Tour", country: "International", slug: "atp", sortOrder: 1 },
    { sportId: "ice-hockey", name: "NHL", country: "USA/Canada", slug: "nhl", sortOrder: 1 },
    { sportId: "baseball", name: "MLB", country: "USA", slug: "mlb", sortOrder: 1 },
    { sportId: "volleyball", name: "Nations League", country: "International", slug: "vnl", sortOrder: 1 },
    { sportId: "esports", name: "CS2 Major", country: "International", slug: "cs2", sortOrder: 1 },
  ];

  const leagues = [];
  for (const l of leagueDefs) {
    leagues.push(await prisma.league.create({ data: l }));
  }
  const L = Object.fromEntries(leagues.map((l) => [l.slug, l]));

  const teamDefs: { name: string; short: string; abbr: string; color: string; sportId: string }[] = [
    ["Manchester United", "Man United", "MUN", "#DA291C", "football"],
    ["Manchester City", "Man City", "MCI", "#6CABDD", "football"],
    ["Arsenal", "Arsenal", "ARS", "#EF0107", "football"],
    ["Chelsea", "Chelsea", "CHE", "#034694", "football"],
    ["Liverpool", "Liverpool", "LIV", "#C8102E", "football"],
    ["Tottenham", "Tottenham", "TOT", "#132257", "football"],
    ["Real Madrid", "Real Madrid", "RMA", "#FDB913", "football"],
    ["Barcelona", "Barcelona", "BAR", "#A50044", "football"],
    ["Atletico Madrid", "Atletico", "ATM", "#CE3524", "football"],
    ["Inter Milan", "Inter", "INT", "#010E80", "football"],
    ["AC Milan", "Milan", "MIL", "#FB090B", "football"],
    ["Juventus", "Juventus", "JUV", "#111111", "football"],
    ["Bayern Munich", "Bayern", "BAY", "#DC052D", "football"],
    ["Borussia Dortmund", "Dortmund", "BVB", "#FDE100", "football"],
    ["PSG", "PSG", "PSG", "#004170", "football"],
    ["Marseille", "Marseille", "OM", "#2FAEEA", "football"],
    ["Leeds United", "Leeds", "LEE", "#FFCD00", "football"],
    ["Leicester City", "Leicester", "LEI", "#003090", "football"],
    ["Inter Miami", "Inter Miami", "MIA", "#F7B5CD", "football"],
    ["Nashville SC", "Nashville", "NSH", "#EF3E42", "football"],
    ["Botafogo", "Botafogo", "BOT", "#111111", "football"],
    ["Red Bull Bragantino", "Bragantino", "RBB", "#E10600", "football"],
    ["Santos", "Santos", "SAN", "#111111", "football"],
    ["Cruzeiro", "Cruzeiro", "CRU", "#2B57A7", "football"],
    ["Lakers", "Lakers", "LAL", "#552583", "basketball"],
    ["Celtics", "Celtics", "BOS", "#007A33", "basketball"],
    ["Alcaraz", "Alcaraz", "ALC", "#C8102E", "tennis"],
    ["Sinner", "Sinner", "SIN", "#1D4ED8", "tennis"],
    ["Maple Leafs", "Toronto", "TOR", "#00205B", "ice-hockey"],
    ["Canadiens", "Montreal", "MTL", "#AF1E2D", "ice-hockey"],
    ["Yankees", "Yankees", "NYY", "#132448", "baseball"],
    ["Red Sox", "Red Sox", "BOS", "#BD3039", "baseball"],
    ["Brazil VNL", "Brazil", "BRA", "#009C3B", "volleyball"],
    ["Poland VNL", "Poland", "POL", "#DC143C", "volleyball"],
    ["Natus Vincere", "NAVI", "NAV", "#FFDD00", "esports"],
    ["FaZe Clan", "FaZe", "FAZ", "#E10600", "esports"],
    ["Coventry City", "Coventry City", "COV", "#71B2E3", "football"],
    ["Brighton", "Brighton", "BHA", "#005DAA", "football"],
    ["Lecce", "Lecce", "LEC", "#FFED00", "football"],
    ["Monza", "Monza", "MON", "#C8102E", "football"],
    ["Lille", "Lille", "LIL", "#E01A22", "football"],
    ["Troyes", "Troyes", "TRO", "#0055A4", "football"],
    ["RB Leipzig", "RB Leipzig", "RBL", "#DD0741", "football"],
    ["Wolfsburg", "Wolfsburg", "WOB", "#65B32E", "football"],
  ].map(([name, short, abbr, color, sportId]) => ({ name, short, abbr, color, sportId }));

  const teams = [];
  for (const t of teamDefs) {
    teams.push(
      await prisma.team.create({
        data: {
          name: t.name,
          shortName: t.short,
          abbreviation: t.abbr,
          color: t.color,
          sportId: t.sportId,
        },
      }),
    );
  }
  const byName = Object.fromEntries(teams.map((t) => [t.name, t]));

  function team(name: string) {
    const found = byName[name];
    if (!found) throw new Error(`Missing team ${name}`);
    return found;
  }

  function marketsForFootball(homeOdds: number, drawOdds: number, awayOdds: number) {
    return [
      {
        type: "1X2",
        name: "1X2",
        outcomes: [
          { code: "1", label: "1", odds: odds(homeOdds) },
          { code: "X", label: "X", odds: odds(drawOdds) },
          { code: "2", label: "2", odds: odds(awayOdds) },
        ],
      },
      {
        type: "OU",
        name: "Over/Under 2.5",
        line: "2.5",
        outcomes: [
          { code: "OVER", label: "Over 2.5", odds: odds(1.85) },
          { code: "UNDER", label: "Under 2.5", odds: odds(1.95) },
        ],
      },
      {
        type: "DC",
        name: "Double Chance",
        outcomes: [
          { code: "1X", label: "1X", odds: odds(1.28) },
          { code: "12", label: "12", odds: odds(1.22) },
          { code: "X2", label: "X2", odds: odds(1.42) },
        ],
      },
      {
        type: "BTTS",
        name: "Both Teams To Score",
        outcomes: [
          { code: "YES", label: "Yes", odds: odds(1.72) },
          { code: "NO", label: "No", odds: odds(2.05) },
        ],
      },
      {
        type: "AH",
        name: "Asian Handicap",
        line: "-1",
        outcomes: [
          { code: "HOME", label: "Home -1", odds: odds(2.15) },
          { code: "AWAY", label: "Away +1", odds: odds(1.68) },
        ],
      },
      {
        type: "FH",
        name: "1st Half 1X2",
        outcomes: [
          { code: "1", label: "1", odds: odds(homeOdds + 0.4) },
          { code: "X", label: "X", odds: odds(2.2) },
          { code: "2", label: "2", odds: odds(awayOdds + 0.5) },
        ],
      },
      {
        type: "FHOU",
        name: "1st Half Over/Under 1.5",
        line: "1.5",
        outcomes: [
          { code: "OVER", label: "Over 1.5", odds: odds(1.9) },
          { code: "UNDER", label: "Under 1.5", odds: odds(1.85) },
        ],
      },
      {
        type: "CS",
        name: "Correct Score",
        outcomes: [
          { code: "1-0", label: "1-0", odds: odds(7.5) },
          { code: "2-0", label: "2-0", odds: odds(9.0) },
          { code: "2-1", label: "2-1", odds: odds(8.5) },
          { code: "1-1", label: "1-1", odds: odds(6.5) },
          { code: "0-0", label: "0-0", odds: odds(9.5) },
          { code: "0-1", label: "0-1", odds: odds(8.0) },
          { code: "1-2", label: "1-2", odds: odds(9.0) },
          { code: "0-2", label: "0-2", odds: odds(12.0) },
        ],
      },
    ];
  }

  const matchPlan: {
    league: string;
    home: string;
    away: string;
    start: Date;
    status: string;
    homeScore?: number;
    awayScore?: number;
    featured?: boolean;
    period?: string;
    prices: [number, number, number];
  }[] = [
    {
      league: "la-liga",
      home: "Atletico Madrid",
      away: "Real Madrid",
      start: (() => {
        const d = new Date();
        d.setHours(14, 15, 0, 0);
        return d;
      })(),
      status: "SCHEDULED",
      featured: true,
      prices: [3.5, 3.86, 2.1],
    },
    {
      league: "premier-league",
      home: "Manchester United",
      away: "Manchester City",
      start: hoursFromNow(6),
      status: "SCHEDULED",
      featured: true,
      prices: [3.2, 3.89, 2.22],
    },
    {
      league: "premier-league",
      home: "Arsenal",
      away: "Chelsea",
      start: hoursFromNow(2),
      status: "SCHEDULED",
      featured: true,
      prices: [1.95, 3.6, 3.75],
    },
    {
      league: "premier-league",
      home: "Liverpool",
      away: "Tottenham",
      start: daysFromNow(1, 17),
      status: "SCHEDULED",
      prices: [1.62, 4.2, 5.1],
    },
    {
      league: "mls",
      home: "Inter Miami",
      away: "Nashville SC",
      start: minutesAgo(58),
      status: "LIVE",
      homeScore: 1,
      awayScore: 1,
      featured: true,
      period: "H2",
      prices: [2.35, 2.6, 3.95],
    },
    {
      league: "brasileirao",
      home: "Botafogo",
      away: "Red Bull Bragantino",
      start: minutesAgo(66),
      status: "LIVE",
      homeScore: 1,
      awayScore: 1,
      period: "H2",
      prices: [1.94, 2.45, 8.0],
    },
    {
      league: "brasileirao",
      home: "Santos",
      away: "Cruzeiro",
      start: minutesAgo(45),
      status: "HT",
      homeScore: 2,
      awayScore: 0,
      period: "HT",
      prices: [1.09, 10.0, 30.0],
    },
    {
      league: "la-liga",
      home: "Real Madrid",
      away: "Barcelona",
      start: daysFromNow(2, 20),
      status: "SCHEDULED",
      featured: true,
      prices: [2.15, 3.55, 3.2],
    },
    {
      league: "la-liga",
      home: "Atletico Madrid",
      away: "Barcelona",
      start: hoursFromNow(1.5),
      status: "SCHEDULED",
      prices: [2.7, 3.2, 2.65],
    },
    {
      league: "serie-a",
      home: "Inter Milan",
      away: "AC Milan",
      start: daysFromNow(1, 19),
      status: "SCHEDULED",
      featured: true,
      prices: [2.05, 3.4, 3.55],
    },
    {
      league: "serie-a",
      home: "Juventus",
      away: "Inter Milan",
      start: hoursFromNow(4),
      status: "SCHEDULED",
      prices: [2.4, 3.15, 3.05],
    },
    {
      league: "bundesliga",
      home: "Bayern Munich",
      away: "Borussia Dortmund",
      start: daysFromNow(3, 18),
      status: "SCHEDULED",
      featured: true,
      prices: [1.55, 4.4, 5.4],
    },
    {
      league: "ligue-1",
      home: "PSG",
      away: "Marseille",
      start: daysFromNow(2, 21),
      status: "SCHEDULED",
      prices: [1.4, 4.8, 7.2],
    },
    {
      league: "championship",
      home: "Leeds United",
      away: "Leicester City",
      start: hoursFromNow(0.8),
      status: "SCHEDULED",
      prices: [2.1, 3.3, 3.45],
    },
    {
      league: "ucl",
      home: "Real Madrid",
      away: "Bayern Munich",
      start: daysFromNow(4, 21),
      status: "SCHEDULED",
      featured: true,
      prices: [2.3, 3.45, 3.05],
    },
    {
      league: "uel",
      home: "Arsenal",
      away: "Roma".length ? "AC Milan" : "AC Milan",
      start: daysFromNow(5, 20),
      status: "SCHEDULED",
      prices: [1.7, 3.9, 4.8],
    },
    {
      league: "premier-league",
      home: "Coventry City",
      away: "Brighton",
      start: hoursFromNow(3.2),
      status: "SCHEDULED",
      featured: true,
      prices: [3.93, 3.9, 1.96],
    },
    {
      league: "serie-a",
      home: "Lecce",
      away: "Monza",
      start: hoursFromNow(3.2),
      status: "SCHEDULED",
      prices: [2.89, 3.14, 2.82],
    },
    {
      league: "ligue-1",
      home: "Lille",
      away: "Troyes",
      start: hoursFromNow(3.2),
      status: "SCHEDULED",
      featured: true,
      prices: [1.49, 5.03, 6.76],
    },
    {
      league: "bundesliga",
      home: "RB Leipzig",
      away: "Wolfsburg",
      start: hoursFromNow(3.7),
      status: "SCHEDULED",
      featured: true,
      prices: [1.38, 5.1, 7.4],
    },
  ];

  for (const m of matchPlan) {
    const home = team(m.home);
    const away = team(m.away);
    const created = await prisma.match.create({
      data: {
        sportId: "football",
        leagueId: L[m.league].id,
        homeTeamId: home.id,
        awayTeamId: away.id,
        startTime: m.start,
        status: m.status,
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        periodLabel: m.period,
        isFeatured: Boolean(m.featured),
        isDemo: true,
      },
    });
    for (const market of marketsForFootball(...m.prices)) {
      await prisma.market.create({
        data: {
          matchId: created.id,
          type: market.type,
          name: market.name,
          line: "line" in market ? market.line : undefined,
          outcomes: { create: market.outcomes },
        },
      });
    }
  }

  async function simpleMatch(
    sportId: string,
    leagueSlug: string,
    home: string,
    away: string,
    start: Date,
    status: string,
    prices: [number, number] | [number, number, number],
    scores?: [number, number],
  ) {
    const created = await prisma.match.create({
      data: {
        sportId,
        leagueId: L[leagueSlug].id,
        homeTeamId: team(home).id,
        awayTeamId: team(away).id,
        startTime: start,
        status,
        homeScore: scores?.[0] ?? 0,
        awayScore: scores?.[1] ?? 0,
        isDemo: true,
        isFeatured: false,
      },
    });
    const twoWay = prices.length === 2;
    await prisma.market.create({
      data: {
        matchId: created.id,
        type: twoWay ? "ML" : "1X2",
        name: twoWay ? "Winner" : "1X2",
        outcomes: {
          create: twoWay
            ? [
                { code: "1", label: team(home).shortName, odds: odds(prices[0]) },
                { code: "2", label: team(away).shortName, odds: odds(prices[1]) },
              ]
            : [
                { code: "1", label: "1", odds: odds(prices[0]) },
                { code: "X", label: "X", odds: odds(prices[1]) },
                { code: "2", label: "2", odds: odds(prices[2]!) },
              ],
        },
      },
    });
  }

  await simpleMatch("basketball", "nba", "Lakers", "Celtics", hoursFromNow(8), "SCHEDULED", [1.9, 1.92]);
  await simpleMatch("tennis", "atp", "Alcaraz", "Sinner", hoursFromNow(3), "SCHEDULED", [1.83, 1.97]);
  await simpleMatch("ice-hockey", "nhl", "Maple Leafs", "Canadiens", hoursFromNow(10), "SCHEDULED", [1.75, 3.8, 3.9]);
  await simpleMatch("baseball", "mlb", "Yankees", "Red Sox", daysFromNow(1, 1), "SCHEDULED", [1.7, 2.15]);
  await simpleMatch("volleyball", "vnl", "Brazil VNL", "Poland VNL", hoursFromNow(5), "SCHEDULED", [1.55, 2.4]);
  await simpleMatch("esports", "cs2", "Natus Vincere", "FaZe Clan", hoursFromNow(1), "LIVE", [1.65, 2.2], [1, 0]);

  await prisma.promotion.createMany({
    data: [
      {
        title: "Welcome Bonus",
        subtitle: "First deposit offer",
        body: "New accounts can unlock a matched bonus on the first qualifying deposit. Wagering requirements and game restrictions apply. This is a demo promotion.",
        ctaLabel: "View terms",
        href: "/promotions",
        theme: "welcome",
        sortOrder: 1,
      },
      {
        title: "Daily Boosts",
        subtitle: "Selected football prices",
        body: "Look out for boosted prices on featured football matches. Boosts are limited, odds can change, and boosted selections still settle on the official result.",
        ctaLabel: "See matches",
        href: "/sports/football",
        theme: "boost",
        sortOrder: 2,
      },
      {
        title: "Promotions",
        subtitle: "Acca insurance & reload",
        body: "Weekday reload offers and acca insurance on 5+ fold football multis. Read the full terms before you opt in. Demo environment only.",
        ctaLabel: "Open offers",
        href: "/promotions",
        theme: "promo",
        sortOrder: 3,
      },
    ],
  });

  const welcome = await prisma.promotion.findFirst({ where: { title: "Welcome Bonus" } });
  await prisma.promoCode.create({
    data: {
      code: "WELCOME10",
      promotionId: welcome?.id,
      percentOff: 0,
      maxUses: 500,
      active: true,
      expiresAt: daysFromNow(30),
    },
  });
  await prisma.promoCode.create({
    data: {
      code: "FOOTBALL5",
      percentOff: 0,
      maxUses: 200,
      active: true,
      expiresAt: daysFromNow(14),
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: demo.id,
        title: "Welcome to SPORTBET",
        body: "Your demo account is ready. Matches and odds in this environment are sample data for product testing.",
        href: "/",
      },
      {
        userId: demo.id,
        title: "Deposit reminder",
        body: "Demo deposits stay pending until an admin reviews them. No real money is processed.",
        href: "/deposit",
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Demo user: demo@sportbet.test / DemoPass123!");
  console.log("Admin: admin@sportbet.test / AdminPass123!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

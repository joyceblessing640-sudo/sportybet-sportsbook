"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/components/providers";
import { CountryMark } from "@/components/brand/country-mark";
import { InstantSlipPanel, INSTANT_SLIP_ID, openInstantSlip } from "@/components/virtuals/instant-slip";
import { formatGhs, formatOdds } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  VIRTUAL_FILTERS,
  VIRTUAL_MARKET_TABS,
  filterVirtualMatches,
  generateVirtualFixtures,
  leagueLine,
  marketById,
  teamMarkSvg,
  type VirtualLeagueId,
  type VirtualMarketId,
  type VirtualMatch,
  type VirtualOutcome,
  type VirtualTeam,
} from "@/lib/virtuals/engine";
import { useVirtualSlip } from "@/store/virtual-slip";

function TeamMark({ team }: { team: VirtualTeam }) {
  return (
    // Generated crest, not a live-API logo.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={teamMarkSvg(team)} alt="" width={16} height={16} className="h-4 w-4 shrink-0 rounded-full" />
  );
}

function InstantOdds({
  match,
  marketId,
  outcome,
}: {
  match: VirtualMatch;
  marketId: VirtualMarketId;
  outcome: VirtualOutcome;
}) {
  const selected = useVirtualSlip((state) => state.items.some((item) => item.outcomeId === outcome.id));
  const toggle = useVirtualSlip((state) => state.toggle);
  return (
    <button
      type="button"
      data-active={selected}
      aria-pressed={selected}
      aria-label={`${match.home.shortName} vs ${match.away.shortName} ${marketId} ${outcome.code} ${formatOdds(outcome.odds)}`}
      onClick={() => toggle(match, marketId, outcome)}
      className="odds-btn flex h-[22px] min-w-0 flex-1 items-center justify-center px-0.5 text-[12px] font-bold tabular-nums leading-none min-[412px]:h-6"
    >
      {formatOdds(outcome.odds)}
    </button>
  );
}

function MatchRow({ match, marketId }: { match: VirtualMatch; marketId: VirtualMarketId }) {
  const market = marketById(match, marketId);
  return (
    <article className="overflow-hidden border-b border-[#eef0f3] bg-white px-2.5 py-1 min-[412px]:px-3 min-[412px]:py-1.5">
      <div className="mb-1 flex min-w-0 items-center gap-1 text-[10px] leading-none text-[#8b919a]">
        <CountryMark country={match.league.country} />
        <span className="shrink-0 tabular-nums">{match.kickClock}</span>
        <span className="min-w-0 truncate">{leagueLine(match.league)}</span>
      </div>
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="flex min-w-0 items-center gap-1">
            <TeamMark team={match.home} />
            <span className="truncate text-[12px] leading-[15px] text-ink">{match.home.name}</span>
          </p>
          <p className="flex min-w-0 items-center gap-1">
            <TeamMark team={match.away} />
            <span className="truncate text-[12px] leading-[15px] text-ink">{match.away.name}</span>
          </p>
        </div>
        <div className="flex w-[8.25rem] shrink-0 gap-[3px] min-[412px]:w-[8.75rem]">
          {market.outcomes.map((outcome) => (
            <InstantOdds key={outcome.id} match={match} marketId={market.id} outcome={outcome} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function InstantFootballView() {
  const { user } = useAuth();
  const count = useVirtualSlip((state) => state.items.length);
  const [league, setLeague] = useState<VirtualLeagueId>("popular");
  const [market, setMarket] = useState<VirtualMarketId>("1X2");
  const matches = useMemo(() => generateVirtualFixtures(), []);
  const visible = useMemo(() => filterVirtualMatches(matches, league), [matches, league]);

  return (
    <div className="min-h-dvh bg-[#f4f5f7]">
      <header className="sticky top-0 z-30 bg-header text-white">
        <div className="flex h-11 items-center gap-0.5 px-1 min-[390px]:h-12">
          <Link href="/virtuals" aria-label="Back to Virtuals" className="grid h-9 w-9 place-items-center">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[16px] font-semibold leading-tight">Instant Football</h1>
            <p className="text-[10px] font-medium text-white/75">Virtual simulated matches</p>
          </div>
          {user ? (
            <Link href="/deposit" className="px-1 text-right leading-tight">
              <p className="text-[11px] font-bold tabular-nums">{formatGhs(user.wallet?.balancePesewas ?? 0)}</p>
            </Link>
          ) : (
            <Link href="/login?next=/virtuals/instant-football" className="px-2 text-[11px] font-bold">
              Login
            </Link>
          )}
          <button
            type="button"
            onClick={openInstantSlip}
            aria-label={`Open betslip, ${count} selections`}
            className="relative mr-1 grid h-9 w-9 place-items-center"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M7 4h10l1 16H6L7 4Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 8h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="absolute right-0.5 top-0.5 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-white px-0.5 text-[9px] font-black text-header">
              {count}
            </span>
          </button>
        </div>
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-2 pb-2">
          {VIRTUAL_FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLeague(item.id)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                league === item.id ? "bg-white text-header" : "bg-white/15 text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="sticky top-11 z-20 border-b border-line bg-white min-[390px]:top-12">
        <div className="grid grid-cols-3 text-center text-[11px] font-semibold">
          {VIRTUAL_MARKET_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMarket(item.id)}
              className={cn(
                "py-2",
                market === item.id ? "border-b-2 border-brand text-brand" : "text-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="px-3 py-8 text-center text-[12px] text-muted">No virtual matches in this league.</p>
      ) : (
        <div className="overflow-hidden bg-white">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 text-[11px] text-[#6b7280] min-[412px]:px-3">
            <span className="min-w-0 flex-1 truncate font-medium">Virtual matches</span>
            <div className="grid w-[8.25rem] shrink-0 grid-cols-3 text-center text-[10px] font-medium min-[412px]:w-[8.75rem]">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </div>
          </div>
          {visible.map((match) => (
            <MatchRow key={match.id} match={match} marketId={market} />
          ))}
        </div>
      )}

      <div id={INSTANT_SLIP_ID} popover="auto" className="betslip-popover">
        <InstantSlipPanel />
      </div>
    </div>
  );
}

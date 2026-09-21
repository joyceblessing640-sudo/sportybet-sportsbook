"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MatchRow } from "@/components/betting/match-card";
import { LIST_MARKET_TABS, LIVE_SPORT_TABS } from "@/lib/constants";
import type { ClientMatch } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import "./live-board.css";

export function LiveBoard({
  matches,
  limit,
  homeLayout = false,
  feedError = null,
}: {
  matches: ClientMatch[];
  limit?: number;
  homeLayout?: boolean;
  feedError?: string | null;
}) {
  const [sport, setSport] = useState(homeLayout ? "football" : "live");
  const [market, setMarket] = useState("1X2");
  const visible = useMemo(() => {
    if (sport === "live") return matches;
    if (sport === "vfootball") return [];
    const id = sport === "efootball" ? "esports" : sport;
    return matches.filter((m) => m.sport.id === id);
  }, [matches, sport]);
  const rows = limit ? visible.slice(0, limit) : visible;
  const headers =
    market === "OU" || market === "FHOU"
      ? ["Over", "Under"]
      : market === "DC"
        ? ["1X", "12", "X2"]
        : ["1", "X", "2"];
  const sportTabs = homeLayout ? LIVE_SPORT_TABS.filter((tab) => tab.id !== "live") : LIVE_SPORT_TABS;

  return (
    <section className="live-board">
      <div className="lb-nav">
        <div className="lb-row lb-row-sports">
          {homeLayout ? (
            <>
              <p className="lb-live">Live</p>
              <span className="lb-pipe" aria-hidden />
            </>
          ) : null}
          <div className="lb-scroll" role="tablist" aria-label="Sports">
            {sportTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={sport === tab.id}
                onClick={() => setSport(tab.id)}
                className={cn("lb-tab", sport === tab.id && "is-active")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="lb-row lb-row-markets">
          <div className="lb-scroll" role="tablist" aria-label="Betting markets">
            {LIST_MARKET_TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={market === item.id}
                onClick={() => setMarket(item.id)}
                className={cn("lb-tab", market === item.id && "is-active")}
              >
                {item.label}
              </button>
            ))}
          </div>
          {homeLayout ? (
            <div className="lb-up">
              <span className="lb-up-rule" aria-hidden />
              <div className="lb-up-pill">
                {["1up", "2up"].map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setMarket("AH")}
                    className={cn("lb-up-dot", market === "AH" && "is-on")}
                  >
                    {label}
                    {i === 0 ? <i aria-hidden /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="lb-up lb-up-btns">
              {["1up", "2up"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setMarket("AH")}
                  className={cn("lb-up-chip", market === "AH" && "is-on")}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="lb-headers">
          <span className="lb-headers-grow" />
          <div className={cn("lb-headers-cols", headers.length === 2 ? "lb-cols-2" : "lb-cols-3")}>
            {headers.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
        </div>
      </div>
      {sport === "vfootball" ? (
        <p className="lb-empty">
          Virtual football is not connected.{" "}
          <Link href="/virtuals">Open Virtuals</Link>
        </p>
      ) : rows.length === 0 ? (
        <p className="lb-empty">{feedError ?? "No matches available"}</p>
      ) : (
        rows.map((match) => <MatchRow key={match.id} match={match} marketType={market} compactOdds onDark />)
      )}
    </section>
  );
}

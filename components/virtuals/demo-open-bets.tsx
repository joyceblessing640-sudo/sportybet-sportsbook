"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatGhs, formatOdds } from "@/lib/money";
import { readDemoTickets, subscribeDemoTickets, type DemoTicket } from "@/lib/virtuals/demo-tickets";
import { cn } from "@/lib/utils";

export function DemoOpenBets({ tab }: { tab: "OPEN" | "SETTLED" | "CANCELLED" }) {
  const [tickets, setTickets] = useState<DemoTicket[]>([]);

  useEffect(() => {
    const load = () => setTickets(readDemoTickets());
    load();
    return subscribeDemoTickets(load);
  }, []);

  const visible = tickets.filter((ticket) => (tab === "OPEN" ? ticket.status === "OPEN" : ticket.status === "SETTLED"));
  if (tab === "CANCELLED" || visible.length === 0) return null;

  return (
    <div className="space-y-2 p-3 pb-0">
      <p className="px-0.5 text-[11px] font-bold uppercase tracking-wide text-[#12a150]">
        Instant Football demo {tab === "OPEN" ? "open bets" : "results"}
      </p>
      {visible.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/virtuals/instant-football/ticket/${ticket.id}`}
          className="block rounded-md bg-white p-3"
        >
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>{ticket.publicId}</span>
            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>
          <p className={cn("mt-1 text-[11px] font-bold uppercase", ticket.status === "OPEN" ? "text-accent" : ticket.won ? "text-accent" : "text-danger")}>
            {ticket.status === "OPEN" ? "DEMO OPEN" : ticket.won ? "DEMO WON" : "DEMO LOST"}
          </p>
          <ul className="mt-2 space-y-1 text-[13px]">
            {ticket.picks.map((pick) => (
              <li key={pick.matchId + pick.selection}>
                <span className="font-medium">{pick.matchLabel}</span>
                <span className="text-muted">
                  {" "}
                  · {pick.marketName} · {pick.selection} @ {formatOdds(pick.odds)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-3 text-[11px] text-muted">
            <div>
              Odds
              <p className="font-bold text-ink">{formatOdds(ticket.totalOdds)}</p>
            </div>
            <div>
              Stake
              <p className="font-bold text-ink">{formatGhs(ticket.stakePesewas)}</p>
            </div>
            <div>
              To win
              <p className="font-bold text-ink">{formatGhs(ticket.potentialWinPesewas)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

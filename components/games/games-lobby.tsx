"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { LOBBY_GAMES, lobbyGameHref } from "@/lib/games";
import { cn } from "@/lib/utils";
import "./games-lobby.css";

const HITS = [
  { id: "spin-da-bottle", left: 0.6, top: 16.4, width: 25.5, height: 13.8 },
  { id: "red-blackjack", left: 30.2, top: 16.4, width: 25.4, height: 13.8 },
  { id: "sporty-kick", left: 59.1, top: 16.4, width: 25.9, height: 13.8 },
  { id: "spin-match", left: 88.9, top: 16.4, width: 11.1, height: 13.8 },
  { id: "sporty-hero", left: 0, top: 37.8, width: 12.2, height: 13.8 },
  { id: "sporty-kick-trending", left: 14.2, top: 37.8, width: 25.6, height: 13.8 },
  { id: "spin-match-trending", left: 42.8, top: 37.8, width: 25.6, height: 13.8 },
  { id: "mines", left: 71.4, top: 37.8, width: 25.6, height: 13.8 },
  { id: "slingo-day-2-dab", left: 0, top: 58.9, width: 25.4, height: 13.8 },
  { id: "slingo-fire-ice", left: 28.1, top: 58.9, width: 25.2, height: 13.8 },
  { id: "slingo-day-of-the-dab", left: 57.4, top: 58.9, width: 25.2, height: 13.8 },
  { id: "red-slingo", left: 87.0, top: 58.9, width: 13.0, height: 13.8 },
  { id: "bet-jack", left: 0, top: 83.4, width: 12.1, height: 13.8 },
  { id: "holdem-poker", left: 15.3, top: 83.4, width: 26.3, height: 13.8 },
  { id: "baccarat", left: 44.3, top: 83.4, width: 26.1, height: 13.8 },
  { id: "red-blackjack-cards", left: 73.7, top: 83.4, width: 26.3, height: 13.8 },
] as const;

export function GamesLobby() {
  const [saved, setSaved] = useState<string[]>([]);

  function toggleFav(id: string, event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="gl" data-testid="games-lobby">
      <div className="gl-shot">
        <img src="/games/sportygames-lobby.jpg" alt="SportyGAMES" draggable={false} />
        <Link href="/" className="gl-hit gl-hit-home" aria-label="Home" />
        {HITS.map((hit) => {
          const game = LOBBY_GAMES.find((item) => item.id === hit.id);
          if (!game) return null;
          const href = lobbyGameHref(game);
          const on = saved.includes(game.id);
          return (
            <Link
              key={game.id}
              href={href}
              className="gl-hit"
              style={{
                left: `${hit.left}%`,
                top: `${hit.top}%`,
                width: `${hit.width}%`,
                height: `${hit.height}%`,
              }}
              aria-label={`Open ${game.name}`}
              data-testid={`game-card-${game.id}`}
            >
              <button
                type="button"
                className={cn("gl-heart", on && "is-on")}
                aria-label={on ? `Unfavourite ${game.name}` : `Favourite ${game.name}`}
                onClick={(event) => toggleFav(game.id, event)}
              >
                ♡
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

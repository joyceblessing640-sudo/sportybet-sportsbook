"use client";

import Link from "next/link";
import { useMemo, useState, type MouseEvent } from "react";
import { LOBBY_GAMES, LOBBY_SECTIONS, lobbyGameHref } from "@/lib/games";
import { cn } from "@/lib/utils";
import "./games-lobby.css";

export function GamesLobby() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LOBBY_SECTIONS.map((section) => ({
      ...section,
      games: LOBBY_GAMES.filter((game) => {
        if (game.section !== section.id) return false;
        if (!q) return true;
        return game.name.toLowerCase().includes(q);
      }),
    })).filter((section) => section.games.length > 0);
  }, [query]);

  function toggleFav(id: string, event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="gl" data-testid="games-lobby">
      <header className="gl-top">
        <p>SportyGAMES</p>
        <span>GHS 0.00</span>
      </header>
      <div className="gl-search">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search games"
          aria-label="Search games"
        />
        <Link href="/" className="gl-home">
          Home
        </Link>
      </div>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="gl-sec">
          <div className="gl-sec-h">
            <h2>{section.title}</h2>
            <Link href={`#${section.id}`} className="gl-all">
              Show all
            </Link>
          </div>
          <div className="gl-row">
            {section.games.map((game) => {
              const href = lobbyGameHref(game);
              const on = saved.includes(game.id);
              return (
                <Link
                  key={game.id}
                  href={href}
                  className="gl-card"
                  aria-label={`Open ${game.name}`}
                  data-testid={`game-card-${game.id}`}
                >
                  <img src={game.art} alt={game.name} draggable={false} />
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
        </section>
      ))}
    </div>
  );
}

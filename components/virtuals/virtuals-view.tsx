"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/components/providers";
import { cn } from "@/lib/utils";

const BANNERS = [
  { id: "sim", src: "/virtuals/banner.jpg", href: "/games", alt: "Lead by 2? You win. Half-time up now in SIM." },
  { id: "vfl", src: "/virtuals/vfootball.png", href: "/sports/football", alt: "vFootball scheduled cycles" },
  { id: "ifc", src: "/virtuals/instant-football.png", href: "/virtuals/instant-football", alt: "Instant Football" },
  { id: "wcup", src: "/virtuals/world-cup.png", href: "/sports/football", alt: "Instant World Cup" },
  { id: "gold", src: "/virtuals/golden-virtuals.png", href: "/virtuals", alt: "Golden Virtuals" },
  { id: "leg", src: "/virtuals/legends.png", href: "/sports/football", alt: "Sporty Legends" },
] as const;

const GAMES = [
  { id: "world-cup", tag: "NEW", title: "Instant World Cup", href: "/sports/football", art: "/virtuals/world-cup.png" },
  { id: "scheduled-football", tag: "NEW", title: "Scheduled Football", href: "/sports/football", art: "/virtuals/scheduled-football.png" },
  { id: "instant-football", tag: "POPULAR", title: "Instant Football", href: "/virtuals/instant-football", art: "/virtuals/instant-football.png" },
  { id: "vfootball", tag: "SCHEDULED", title: "vFootball", href: "/sports/football", art: "/virtuals/vfootball.png" },
  { id: "legends", tag: "NEW", title: "Sporty Legends", href: "/sports/football", art: "/virtuals/legends.png" },
  { id: "penalty", tag: "NEW", title: "Sporty Penalty", href: "/sports/football", art: "/virtuals/penalty.png" },
  { id: "african-cup", tag: "NEW", title: "Instant African Cup", href: "/sports/football", art: "/virtuals/african-cup.png" },
  { id: "basketball", tag: "INSTANT", title: "Instant Basketball", href: "/sports/basketball", art: "/virtuals/basketball.png" },
  { id: "dog-racing", tag: "NEW", title: "Instant Dog Racing", href: "/virtuals", art: "/virtuals/dog-racing.png" },
  { id: "sim", tag: "INSTANT", title: "SportySIM", href: "/games", art: "/virtuals/sim.png" },
  { id: "scheduled-virtuals", tag: "", title: "Scheduled Virtuals", href: "/virtuals", art: "/virtuals/scheduled-virtuals.png" },
  { id: "golden-virtuals", tag: "", title: "Golden Virtuals", href: "/virtuals", art: "/virtuals/golden-virtuals.png" },
] as const;

export function VirtualsView() {
  const { user } = useAuth();
  const [slide, setSlide] = useState(0);
  const banner = BANNERS[slide];

  return (
    <div className="min-h-dvh bg-[#1b1d22] text-white">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#1b1d22] px-1 py-2.5">
        <div className="flex items-center">
          <Link href="/" aria-label="Back" className="grid h-9 w-9 place-items-center">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-[17px] font-semibold">Virtuals</h1>
        </div>
        {!user ? (
          <div className="pr-2 text-[12px] font-semibold">
            <Link href="/register">Register</Link>
            <span className="mx-1.5 text-white/35">|</span>
            <Link href="/login">Login</Link>
          </div>
        ) : (
          <Link href="/me" className="pr-3 text-[12px] font-semibold text-white/80">
            {user.username}
          </Link>
        )}
      </header>

      <div className="px-[10px] min-[375px]:px-[11px] min-[390px]:px-3">
        <Link href={banner.href} className="relative block overflow-hidden rounded-[10px]">
          {banner.src === "/virtuals/banner.jpg" ? (
            <span className="relative block aspect-[865/154] w-full">
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 430px) 100vw, 430px"
              />
            </span>
          ) : (
            <span className="relative block aspect-[865/154] w-full overflow-hidden bg-[#14161a]">
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 430px) 100vw, 430px"
              />
            </span>
          )}
        </Link>
        <div className="flex items-center justify-center gap-1.5 py-2">
          {BANNERS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Promo ${index + 1}`}
              onClick={() => setSlide(index)}
              className={cn("h-[7px] w-[7px] rounded-full transition-colors", slide === index ? "bg-white" : "bg-white/30")}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-[10px] pb-3 min-[375px]:px-[11px] min-[390px]:gap-2 min-[390px]:px-3 min-[430px]:gap-2.5">
        {GAMES.map((game) => {
          const instant = game.id === "instant-football";
          const className = "flex flex-col overflow-hidden rounded-[12px] bg-[#2c3038]";
          const inner = (
            <>
              {game.tag ? (
                <p className="flex items-center gap-1 px-2.5 pt-[7px] pb-[5px] text-[10px] font-semibold uppercase tracking-[0.04em] text-white/45">
                  <span className="text-[6px] leading-none">▶</span> {game.tag}
                </p>
              ) : (
                <span className="h-[8px]" />
              )}
              <div className="relative mx-[3px] mb-[3px] overflow-hidden rounded-[10px]" style={{ aspectRatio: "423 / 177" }}>
                <Image
                  src={game.art}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain object-center"
                  sizes="(max-width: 360px) 46vw, (max-width: 430px) 47vw, 210px"
                />
              </div>
            </>
          );
          if (instant) {
            return (
              <a key={game.id} href="/virtuals/instant-football" aria-label="Play Instant Football" className={className}>
                {inner}
              </a>
            );
          }
          return (
            <Link key={game.id} href={game.href} aria-label={`Play ${game.title}`} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

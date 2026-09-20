"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/components/providers";
import { cn } from "@/lib/utils";

const BANNERS = [
  { id: "sim", src: "/virtuals/banner.jpg", href: "/games", alt: "Lead by 2? You win. Half-time up now in SIM." },
  { id: "vfl", src: "/virtuals/vfootball.png", href: "/sports/football", alt: "vFootball", tone: "from-[#0b1b4a] to-[#1e3a8a]", title: "vFootball", kicker: "Scheduled cycles" },
  { id: "ifc", src: "/virtuals/instant-football.png", href: "/sports/football", alt: "Instant Football", tone: "from-[#7f1d1d] to-[#1b1d22]", title: "Instant Football", kicker: "Play a round now" },
  { id: "wcup", src: "/virtuals/world-cup.png", href: "/sports/football", alt: "Instant World Cup", tone: "from-[#0f766e] to-[#1e3a8a]", title: "Instant World Cup", kicker: "Tournament demo" },
  { id: "gold", src: "/virtuals/golden-virtuals.png", href: "/virtuals", alt: "Golden Virtuals", tone: "from-[#3f2a05] to-[#111111]", title: "Golden Virtuals", kicker: "Highlight markets" },
  { id: "leg", src: "/virtuals/legends.png", href: "/sports/football", alt: "Legends", tone: "from-[#14532d] to-[#052e16]", title: "SportyBets Legends", kicker: "Classic matchups" },
] as const;

const GAMES = [
  { id: "world-cup", tag: "NEW", title: "Instant\nWorld Cup", href: "/sports/football", art: "/virtuals/world-cup.png", tone: "from-[#1d4ed8] via-[#0f766e] to-[#7f1d1d]" },
  { id: "scheduled-football", tag: "NEW", title: "Scheduled\nFootball", href: "/sports/football", art: "/virtuals/scheduled-football.png", tone: "from-[#3b0764] via-[#5b21b6] to-[#9a3412]" },
  { id: "instant-football", tag: "POPULAR", title: "Instant\nFootball", href: "/sports/football", art: "/virtuals/instant-football.png", tone: "from-[#7f1d1d] to-[#450a0a]" },
  { id: "vfootball", tag: "SCHEDULED", title: "vFootball", href: "/sports/football", art: "/virtuals/vfootball.png", tone: "from-[#0b1b4a] to-[#1e3a8a]" },
  { id: "legends", tag: "NEW", title: "SportyBets\nLegends", href: "/sports/football", art: "/virtuals/legends.png", tone: "from-[#14532d] to-[#052e16]" },
  { id: "penalty", tag: "NEW", title: "SportyBets\nPenalty", href: "/sports/football", art: "/virtuals/penalty.png", tone: "from-[#3f0d12] to-[#1b1d22]" },
  { id: "african-cup", tag: "NEW", title: "Instant\nAfrican Cup", href: "/sports/football", art: "/virtuals/african-cup.png", tone: "from-[#b45309] via-[#ca8a04] to-[#166534]" },
  { id: "basketball", tag: "INSTANT", title: "Instant\nBasketball", href: "/sports/basketball", art: "/virtuals/basketball.png", tone: "from-[#78350f] to-[#1c1917]" },
  { id: "dog-racing", tag: "NEW", title: "Instant Dog\nRacing", href: "/virtuals", art: "/virtuals/dog-racing.png", tone: "from-[#0f3a5f] to-[#0b1220]" },
  { id: "sim", tag: "INSTANT", title: "SportyBets\nSIM", href: "/games", art: "/virtuals/sim.png", tone: "from-[#3f3f16] to-[#1a1a0a]" },
  { id: "scheduled-virtuals", tag: "", title: "Scheduled\nVirtuals", href: "/virtuals", art: "/virtuals/scheduled-virtuals.png", tone: "from-[#3f2a05] to-[#1c1917]" },
  { id: "golden-virtuals", tag: "", title: "Golden\nVirtuals", href: "/virtuals", art: "/virtuals/golden-virtuals.png", tone: "from-[#111111] to-[#3f2a05]" },
] as const;

function PlayMark() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/85 px-2 py-[3px] text-[11px] font-semibold text-white">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current" aria-hidden>
        <path d="M3 2.2v7.6L10 6 3 2.2Z" />
      </svg>
      Play
    </span>
  );
}

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

      <div className="px-2.5">
        <Link href={banner.href} className="relative block overflow-hidden rounded-lg">
          {banner.src === "/virtuals/banner.jpg" ? (
            <span className="relative block h-[64px] w-full min-[375px]:h-[68px] min-[390px]:h-[72px] min-[412px]:h-[76px] min-[430px]:h-[78px]">
              <Image src={banner.src} alt={banner.alt} fill className="object-cover object-center" sizes="(max-width: 480px) 100vw, 480px" />
            </span>
          ) : (
            <div className={cn("relative flex h-[64px] items-center overflow-hidden bg-gradient-to-r px-3 min-[375px]:h-[68px] min-[390px]:h-[72px] min-[412px]:h-[76px] min-[430px]:h-[78px]", banner.tone)}>
              <div className="relative z-10 max-w-[55%]">
                <p className="text-[15px] font-black leading-tight">{banner.title}</p>
                <p className="mt-0.5 text-[11px] text-white/80">{banner.kicker}</p>
                <span className="mt-2 inline-flex rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase">Play now</span>
              </div>
              <span className="pointer-events-none absolute right-1 top-1/2 h-[90%] w-[48%] -translate-y-1/2">
                <Image src={banner.src} alt="" fill className="object-contain object-right" sizes="200px" />
              </span>
            </div>
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

      <div className="grid grid-cols-2 gap-2 px-2.5 pb-3 min-[430px]:gap-2.5">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            href={game.href}
            className="flex flex-col overflow-hidden rounded-[12px] bg-[#2c3038]"
          >
            {game.tag ? (
              <p className="flex items-center gap-1 px-2.5 pt-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                <span className="text-[7px] leading-none">▶</span> {game.tag}
              </p>
            ) : (
              <span className="h-2" />
            )}
            <div
              className={cn(
                "relative mx-[3px] mb-[3px] flex min-h-[88px] items-end overflow-hidden rounded-[10px] bg-gradient-to-r min-[390px]:min-h-[94px] min-[412px]:min-h-[98px]",
                game.tone,
              )}
            >
              <span className="pointer-events-none absolute -right-0.5 top-1/2 h-[94%] w-[54%] -translate-y-1/2">
                <Image src={game.art} alt="" fill className="object-contain object-right" sizes="160px" />
              </span>
              <div className="relative z-10 flex min-h-[88px] w-[52%] flex-col items-start justify-center gap-2 p-2.5 min-[390px]:min-h-[94px]">
                <h2 className="whitespace-pre-line text-[13px] font-bold leading-[1.15] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] min-[375px]:text-[14px]">
                  {game.title}
                </h2>
                <PlayMark />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

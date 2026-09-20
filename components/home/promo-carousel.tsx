"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PROMO_SET_1 = [
  { href: "/sports/football/premier-league", title: "MCI vs SUN", src: "/home/mci-sun.jpg" },
  { href: "/sports/football/premier-league", title: "FUL vs MUN", src: "/home/ful-mun.jpg" },
  { href: "/games/lucky-numbers", title: "Lucky Numbers", src: "/home/lucky-numbers.jpg" },
  { href: "/sports/football/la-liga", title: "ATM vs RMA", src: "/home/atm-rma.jpg" },
  { href: "/games", title: "TaDa Halloween", src: "/home/tada-halloween.jpg" },
  { href: "/sports/basketball", title: "NBA Night", src: "/home/nba-night.jpg" },
] as const;

const PROMO_SET_2 = [
  { href: "/sports/football/la-liga", title: "One Cut — LaLiga", src: "/home/one-cut-laliga.jpg" },
  { href: "/sports/football/serie-a", title: "AnyWin — Serie A", src: "/home/anywin-serie-a.jpg" },
  { href: "/promotions", title: "Casino Cashback", src: "/home/casino-cashback.jpg" },
  { href: "/sports/football/ligue-1", title: "Flexi — Ligue 1", src: "/home/flexi-ligue-1.jpg" },
  { href: "/bets", title: "AutoBet", src: "/home/autobet.jpg" },
  { href: "/sports", title: "Sports", src: "/home/promo-sports.jpg" },
] as const;

const SETS = [PROMO_SET_1, PROMO_SET_2] as const;
const AXIS = 8;
const SNAP = 0.18;

const CARD_CLASS =
  "relative block h-[48px] w-[48px] shrink-0 overflow-hidden rounded-[6px] min-[375px]:h-[50px] min-[375px]:w-[50px] min-[412px]:h-[54px] min-[412px]:w-[54px] min-[430px]:h-[56px] min-[430px]:w-[56px]";

function PromoPage({
  cards,
  page,
}: {
  cards: readonly { href: string; title: string; src: string }[];
  page: number;
}) {
  return (
    <div
      className="flex w-1/2 shrink-0 gap-1.5 px-2.5 pb-0 pt-1.5 min-[412px]:gap-2 min-[412px]:px-3 min-[412px]:pt-2"
      data-promo-page={page}
    >
      {cards.map((promo) => (
        <Link key={`${page}-${promo.title}`} href={promo.href} className={CARD_CLASS} draggable={false}>
          <img
            src={promo.src}
            alt={promo.title}
            width={137}
            height={139}
            draggable={false}
            className="pointer-events-none h-full w-full object-cover object-center"
          />
        </Link>
      ))}
    </div>
  );
}

export function PromoCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let axis: "h" | "v" | null = null;
    let originX = 0;
    let suppressClick = false;

    const width = () => vp.getBoundingClientRect().width;

    const setX = (x: number, animate: boolean) => {
      track.style.transition = animate ? "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const snap = (next: number, animate: boolean) => {
      const p = next < 0 ? 0 : next > 1 ? 1 : next;
      pageRef.current = p;
      setPage(p);
      setX(-p * width(), animate);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startY = e.clientY;
      lastT = performance.now();
      vel = 0;
      axis = null;
      suppressClick = false;
      originX = -pageRef.current * width();
      track.style.transition = "none";
    };

    const onMove = (e: PointerEvent) => {
      if (pointerId == null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < AXIS && Math.abs(dy) < AXIS) return;
        axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? "h" : "v";
        if (axis === "h") {
          try {
            vp.setPointerCapture(e.pointerId);
          } catch {
            /* vertical page scroll may already own the gesture */
          }
        }
      }
      if (axis !== "h") return;
      if (e.cancelable) e.preventDefault();
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) vel = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = now;
      const w = width();
      let x = originX + dx;
      if (x > 0) x *= 0.28;
      if (x < -w) x = -w + (x + w) * 0.28;
      setX(x, false);
    };

    const finish = (e: PointerEvent) => {
      if (pointerId == null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      const wasHorizontal = axis === "h";
      pointerId = null;
      axis = null;
      if (!wasHorizontal) return;
      suppressClick = Math.abs(dx) > AXIS;
      const w = width();
      let next = pageRef.current;
      if (dx < -w * SNAP || vel < -0.35) next = 1;
      else if (dx > w * SNAP || vel > 0.35) next = 0;
      else next = Math.abs(originX + dx) > w / 2 ? 1 : 0;
      snap(next, true);
    };

    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (axis === "h" && e.cancelable) e.preventDefault();
    };

    const onResize = () => snap(pageRef.current, false);

    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("pointermove", onMove, { passive: false });
    vp.addEventListener("pointerup", finish);
    vp.addEventListener("pointercancel", finish);
    vp.addEventListener("touchmove", onTouchMove, { passive: false });
    vp.addEventListener("click", onClick, true);
    window.addEventListener("resize", onResize);
    snap(pageRef.current, false);

    return () => {
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("pointermove", onMove);
      vp.removeEventListener("pointerup", finish);
      vp.removeEventListener("pointercancel", finish);
      vp.removeEventListener("touchmove", onTouchMove);
      vp.removeEventListener("click", onClick, true);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={viewportRef}
      data-testid="promo-carousel"
      data-promo-set={page}
      className="promo-carousel bg-white"
    >
      <div ref={trackRef} className="promo-carousel-track flex w-[200%]">
        {SETS.map((cards, index) => (
          <PromoPage key={index} cards={cards} page={index} />
        ))}
      </div>
    </div>
  );
}

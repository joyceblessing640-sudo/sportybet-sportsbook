import type { DemoTeam } from "@/lib/virtuals/demo-board";

/** Circular virtual crest. White PNG padding is knocked out so the mark stays visible. */
export function DemoCrest({ team, size = 16 }: { team: DemoTeam; size?: number }) {
  return (
    <span
      className="if-crest"
      aria-hidden
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: team.color,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={team.logo} alt="" draggable={false} />
    </span>
  );
}

export function StarRating({ value }: { value: number }) {
  return (
    <span className="mt-0.5 flex items-center gap-px text-[8px] leading-none">
      {[1, 2, 3].map((star) => (
        <span key={star} className={star <= value ? "text-[#f5c518]" : "text-[#d5d8de]"}>
          ★
        </span>
      ))}
    </span>
  );
}

import type { DemoTeam } from "@/lib/virtuals/demo-board";

/** Small square slot; the crest itself keeps its native ratio via object-fit: contain. */
export function DemoCrest({ team, size = 16 }: { team: DemoTeam; size?: number }) {
  return (
    <span
      className="if-crest"
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        flexShrink: 0,
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      {/* Screenshot crest from the Instant Football board. Never stretch. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={team.logo}
        alt=""
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
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

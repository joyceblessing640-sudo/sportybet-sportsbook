import type { DemoTeam } from "@/lib/virtuals/demo-board";

export function DemoCrest({ team, size = 24 }: { team: DemoTeam; size?: number }) {
  return (
    // Screenshot crest from the Instant Football reference board.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={team.logo}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain object-center"
      style={{ width: size, height: size }}
    />
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

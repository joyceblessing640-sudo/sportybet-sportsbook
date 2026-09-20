import { cn } from "@/lib/utils";
import type { DemoTeam } from "@/lib/virtuals/demo-board";

const FLAGS: Record<string, string[]> = {
  "gb-eng": ["#ffffff", "#cf142b"],
  fr: ["#002395", "#ffffff", "#ed2939"],
  es: ["#c60b1e", "#ffc400", "#c60b1e"],
  de: ["#000000", "#dd0000", "#ffce00"],
  nl: ["#ae1c28", "#ffffff", "#2144a6"],
  ge: ["#ffffff", "#e31d1a"],
  be: ["#000000", "#fae042", "#ed2939"],
  tr: ["#e30a17", "#ffffff"],
  hu: ["#ce2939", "#ffffff", "#477050"],
  ua: ["#005bbb", "#ffd500"],
  cz: ["#d7141a", "#11457e", "#ffffff"],
  pl: ["#ffffff", "#dc143c"],
  sk: ["#ffffff", "#0b4ea2", "#ee1c25"],
  ro: ["#002b7f", "#fcd116", "#ce1126"],
  pt: ["#006600", "#ff0000"],
  dk: ["#c60c30", "#ffffff"],
};

export function DemoCrest({ team, size = 22 }: { team: DemoTeam; size?: number }) {
  if (team.mark === "flag" && team.flag) {
    return <FlagMark flag={team.flag} size={size} title={team.name} />;
  }
  const second = team.color2 ?? "rgba(255,255,255,0.22)";
  return (
    <span
      title={team.name}
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-black/10"
      style={{ width: size, height: size, background: team.color }}
    >
      <span
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ background: second }}
      />
      <span
        className={cn(
          "relative z-[1] font-black leading-none",
          size > 28 ? "text-[10px]" : "text-[6px]",
          team.color === "#ffffff" || team.color === "#ffe667" || team.color === "#fde100" || team.color === "#ffcd00"
            ? "text-black"
            : "text-white",
        )}
      >
        {team.abbreviation.slice(0, 2)}
      </span>
    </span>
  );
}

function FlagMark({ flag, size, title }: { flag: string; size: number; title: string }) {
  const colors = FLAGS[flag] ?? ["#1d4ed8", "#ffffff"];
  return (
    <span
      title={title}
      className="relative inline-block shrink-0 overflow-hidden rounded-full border border-black/10"
      style={{ width: size, height: size }}
    >
      {flag === "gb-eng" ? (
        <span className="absolute inset-0 bg-white">
          <span className="absolute inset-x-0 top-1/2 h-[28%] -translate-y-1/2 bg-[#cf142b]" />
          <span className="absolute inset-y-0 left-1/2 w-[28%] -translate-x-1/2 bg-[#cf142b]" />
        </span>
      ) : colors.length === 3 ? (
        <span className="flex h-full w-full">
          {colors.map((color) => (
            <span key={color} className="h-full flex-1" style={{ background: color }} />
          ))}
        </span>
      ) : (
        <span className="flex h-full w-full flex-col">
          {colors.map((color) => (
            <span key={color} className="w-full flex-1" style={{ background: color }} />
          ))}
        </span>
      )}
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

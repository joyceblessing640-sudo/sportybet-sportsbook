import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  England: "#1d4ed8",
  Spain: "#b91c1c",
  Italy: "#047857",
  Germany: "#111827",
  France: "#1e3a8a",
  USA: "#1d4ed8",
  Brazil: "#15803d",
  Europe: "#0f766e",
  International: "#4b5563",
  "USA/Canada": "#1e3a8a",
};

export function CountryMark({
  country,
  className,
}: {
  country: string;
  className?: string;
}) {
  const letters = country
    .split(/[\s/-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={cn(
        "grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[2px] text-[7px] font-black text-white",
        className,
      )}
        style={{ background: TONES[country] ?? "#e31837" }}
      aria-hidden
    >
      {letters}
    </span>
  );
}

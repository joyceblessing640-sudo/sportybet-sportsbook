import Link from "next/link";
import { SportIcon } from "@/components/brand/sport-icon";

const TILES = [
  { href: "/sports/football", label: "vFootball", icon: "football", copy: "Licensed virtual cycles are not connected." },
  { href: "/sports/basketball", label: "vBasketball", icon: "basketball", copy: "Placeholder until a virtuals feed is added." },
  { href: "/sports/tennis", label: "vTennis", icon: "tennis", copy: "Same betting engine as live sports once enabled." },
];

export default function VirtualsPage() {
  return (
    <div className="p-3">
      <h1 className="text-[16px] font-bold">Virtuals</h1>
      <p className="mt-1 text-[12px] text-muted">
        Original placeholder. This is not a branded virtuals product and no licensed feed is connected.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {TILES.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="card-hover rounded-md border border-line bg-white p-3"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-soft text-brand">
              <SportIcon name={tile.icon} className="h-4 w-4" />
            </span>
            <p className="mt-2 text-[13px] font-bold">{tile.label}</p>
            <p className="mt-1 text-[12px] text-muted">{tile.copy}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

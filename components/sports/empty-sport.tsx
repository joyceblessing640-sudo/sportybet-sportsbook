import Link from "next/link";

export function EmptySport({ name }: { name: string }) {
  return (
    <div className="p-4">
      <h1 className="text-[16px] font-bold text-ink">{name}</h1>
      <p className="mt-2 rounded-md border border-line bg-white p-4 text-[13px] text-muted">
        {name} fixtures are not in this demo feed yet. Markets, odds and settlement will use the same betting engine as
        football once a licensed feed is connected.
      </p>
      <Link href="/sports/football" className="mt-3 inline-block text-[13px] font-semibold text-brand">
        Browse football
      </Link>
    </div>
  );
}

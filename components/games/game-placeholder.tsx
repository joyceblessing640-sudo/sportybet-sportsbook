import Link from "next/link";

export function GamePlaceholder({ name }: { name: string }) {
  return (
    <div className="p-4">
      <Link href="/games" className="text-sm font-semibold text-brand">
        ‹ Games
      </Link>
      <h1 className="mt-3 text-xl font-black">{name}</h1>
      <p className="mt-1 text-sm text-muted">
        Demo placeholder. This title is not a real-money game and no stake is accepted.
      </p>
      <Link
        href="/games"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white"
      >
        Back to Games
      </Link>
    </div>
  );
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatGhs } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function DepositStatusPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/deposit");
  const { publicId } = await params;
  const deposit = await prisma.deposit.findFirst({
    where: { publicId, userId: session.id },
  });
  if (!deposit) notFound();

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-[#b45309]">{deposit.status}</p>
      <h1 className="mt-2 text-2xl font-black">Deposit submitted</h1>
      <p className="mt-3 text-sm text-muted">
        Your deposit {deposit.publicId} for {formatGhs(deposit.amountPesewas)} has been received and is waiting for confirmation. Status only changes after operations or a payment provider confirms it.
      </p>
      <p className="mt-2 text-xs text-muted">Ref: {deposit.reference}</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link href="/transactions" className="rounded-md bg-[#f3f4f6] py-3 text-sm font-semibold">
          Transaction
        </Link>
        <Link href="/" className="rounded-md bg-brand py-3 text-sm font-semibold text-white">
          Home
        </Link>
      </div>
    </div>
  );
}

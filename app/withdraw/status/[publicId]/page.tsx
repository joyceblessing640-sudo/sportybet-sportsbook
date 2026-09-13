import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatGhs } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function WithdrawStatusPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/withdraw");
  const { publicId } = await params;
  const withdrawal = await prisma.withdrawal.findFirst({
    where: { publicId, userId: session.id },
  });
  if (!withdrawal) notFound();

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-[#b45309]">{withdrawal.status}</p>
      <h1 className="mt-2 text-2xl font-black">Pending</h1>
      <p className="mt-3 text-sm text-muted">
        Your withdrawal request {withdrawal.publicId} for {formatGhs(withdrawal.amountPesewas)} has been submitted and is waiting for confirmation. This is not an instant payout.
      </p>
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

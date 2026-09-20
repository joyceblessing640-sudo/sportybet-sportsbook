import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatGhs } from "@/lib/money";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/transactions");
  const items = await prisma.transaction.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-black">Transactions</h1>
      <p className="mt-1 text-sm text-muted">Only your own ledger is shown.</p>
      <div className="mt-4 overflow-hidden rounded-xl bg-white">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No transactions yet.</p>
        ) : (
          items.map((tx) => (
            <article key={tx.id} className="border-b border-[#f1f3f7] px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{tx.type.replace(/_/g, " ")}</span>
                <span className={tx.amountPesewas < 0 ? "font-bold text-danger" : "font-bold text-odds"}>
                  {tx.amountPesewas < 0 ? "-" : "+"}
                  {formatGhs(Math.abs(tx.amountPesewas))}
                </span>
              </div>
              <p className="text-xs text-muted">
                <span
                  className={
                    tx.status === "PENDING"
                      ? "font-bold uppercase text-[#b45309]"
                      : tx.status === "SUCCESSFUL"
                        ? "font-bold text-odds"
                        : ""
                  }
                >
                  {tx.status}
                </span>
                {" · "}
                {tx.publicId} · {tx.createdAt.toLocaleString()}
              </p>
              {tx.note ? <p className="mt-1 text-xs text-[#4b5563]">{tx.note}</p> : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

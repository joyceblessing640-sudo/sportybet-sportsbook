import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { MarkRead } from "@/components/account/mark-read";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/notifications");
  const items = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Notification Center</h1>
        <MarkRead />
      </div>
      <div className="mt-4 overflow-hidden rounded-xl bg-white">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No notifications.</p>
        ) : (
          items.map((n) => (
            <article key={n.id} className="border-b border-[#f1f3f7] px-4 py-3">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-sm text-[#4b5563]">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted">{n.createdAt.toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

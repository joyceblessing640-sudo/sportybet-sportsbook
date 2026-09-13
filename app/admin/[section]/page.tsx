import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatGhs, formatOdds } from "@/lib/money";
import { AdminAction } from "@/components/admin/admin-action";
import { AdminSettings } from "@/components/admin/admin-settings";

export const dynamic = "force-dynamic";

const SECTIONS = [
  "users",
  "sports",
  "leagues",
  "matches",
  "markets",
  "odds",
  "bets",
  "deposits",
  "withdrawals",
  "promotions",
  "promo-codes",
  "transactions",
  "notifications",
  "settings",
  "audit-logs",
] as const;

export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!SECTIONS.includes(section as (typeof SECTIONS)[number])) notFound();

  if (section === "users") {
    const users = await prisma.user.findMany({ include: { wallet: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return (
      <Wrap title="Users">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="p-2">User</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Balance</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">
                  {u.username}
                  <div className="text-xs text-muted">{u.email}</div>
                </td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.status}</td>
                <td className="p-2">{formatGhs(u.wallet?.balancePesewas ?? 0)}</td>
                <td className="p-2">
                  <AdminAction action="TOGGLE_USER" id={u.id} label={u.status === "ACTIVE" ? "Suspend" : "Activate"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wrap>
    );
  }

  if (section === "sports") {
    const sports = await prisma.sport.findMany({ include: { _count: { select: { leagues: true, matches: true } } } });
    return (
      <Wrap title="Sports">
        {sports.map((s) => (
          <p key={s.id} className="border-b px-3 py-2 text-sm">
            {s.name} · {s._count.leagues} leagues · {s._count.matches} matches
          </p>
        ))}
      </Wrap>
    );
  }

  if (section === "leagues") {
    const leagues = await prisma.league.findMany({ include: { sport: true, _count: { select: { matches: true } } }, orderBy: { sortOrder: "asc" } });
    return (
      <Wrap title="Leagues">
        {leagues.map((l) => (
          <p key={l.id} className="border-b px-3 py-2 text-sm">
            {l.name} · {l.sport.name} · {l.country} · {l._count.matches} matches
          </p>
        ))}
      </Wrap>
    );
  }

  if (section === "matches") {
    const matches = await prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true, league: true },
      orderBy: { startTime: "desc" },
      take: 80,
    });
    return (
      <Wrap title="Matches">
        {matches.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-sm">
            <div>
              {m.homeTeam.shortName} vs {m.awayTeam.shortName}
              <div className="text-xs text-muted">
                {m.league.name} · {m.status} · {m.startTime.toLocaleString()}
              </div>
            </div>
            <div className="flex gap-1">
              {["SCHEDULED", "LIVE", "HT", "FINISHED", "CANCELLED"].map((status) => (
                <AdminAction key={status} action="UPDATE_MATCH_STATUS" id={m.id} status={status} label={status} />
              ))}
            </div>
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "markets" || section === "odds") {
    const markets = await prisma.market.findMany({
      include: { match: { include: { homeTeam: true, awayTeam: true } }, outcomes: true },
      take: 60,
    });
    return (
      <Wrap title={section === "odds" ? "Odds" : "Markets"}>
        {markets.map((m) => (
          <div key={m.id} className="border-b px-3 py-2 text-sm">
            <p className="font-medium">
              {m.match.homeTeam.shortName} vs {m.match.awayTeam.shortName} · {m.name}
            </p>
            <p className="text-xs text-muted">
              {m.outcomes.map((o) => `${o.label} ${formatOdds(o.odds)}`).join(" · ")}
            </p>
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "bets") {
    const bets = await prisma.bet.findMany({
      include: { user: true, selections: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return (
      <Wrap title="Bets">
        {bets.map((b) => (
          <div key={b.id} className="border-b px-3 py-2 text-sm">
            {b.publicId} · {b.user.username} · {b.type} · {b.status} · {formatGhs(b.stakePesewas)}
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "deposits") {
    const deposits = await prisma.deposit.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 50 });
    return (
      <Wrap title="Deposits">
        {deposits.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-sm">
            <div>
              {d.publicId} · {d.user.username} · {formatGhs(d.amountPesewas)} · {d.status}
            </div>
            {d.status === "PENDING" || d.status === "PROCESSING" ? (
              <div className="flex gap-1">
                <AdminAction action="REVIEW_DEPOSIT" id={d.id} decision="APPROVE" label="Confirm" />
                <AdminAction action="REVIEW_DEPOSIT" id={d.id} decision="REJECT" label="Fail" />
              </div>
            ) : null}
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "withdrawals") {
    const rows = await prisma.withdrawal.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 50 });
    return (
      <Wrap title="Withdrawals">
        {rows.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-sm">
            <div>
              {d.publicId} · {d.user.username} · {formatGhs(d.amountPesewas)} · {d.status}
            </div>
            {d.status === "PENDING" || d.status === "PROCESSING" ? (
              <div className="flex gap-1">
                <AdminAction action="REVIEW_WITHDRAWAL" id={d.id} decision="APPROVE" label="Confirm" />
                <AdminAction action="REVIEW_WITHDRAWAL" id={d.id} decision="REJECT" label="Reject" />
              </div>
            ) : null}
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "promotions") {
    const rows = await prisma.promotion.findMany({ orderBy: { sortOrder: "asc" } });
    return (
      <Wrap title="Promotions">
        {rows.map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b px-3 py-2 text-sm">
            <span>
              {p.title} · {p.active ? "active" : "off"}
            </span>
            <AdminAction action="TOGGLE_PROMOTION" id={p.id} label={p.active ? "Disable" : "Enable"} />
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "promo-codes") {
    const rows = await prisma.promoCode.findMany({ orderBy: { code: "asc" } });
    return (
      <Wrap title="Promo codes">
        {rows.map((p) => (
          <div key={p.id} className="flex items-center justify-between border-b px-3 py-2 text-sm">
            <span>
              {p.code} · used {p.usedCount}/{p.maxUses} · {p.active ? "active" : "off"}
            </span>
            <AdminAction action="TOGGLE_PROMO_CODE" id={p.id} label={p.active ? "Disable" : "Enable"} />
          </div>
        ))}
      </Wrap>
    );
  }

  if (section === "transactions") {
    const rows = await prisma.transaction.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 80 });
    return (
      <Wrap title="Transactions">
        {rows.map((t) => (
          <p key={t.id} className="border-b px-3 py-2 text-sm">
            {t.publicId} · {t.user.username} · {t.type} · {t.status} · {formatGhs(t.amountPesewas)}
          </p>
        ))}
      </Wrap>
    );
  }

  if (section === "notifications") {
    const rows = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    return (
      <Wrap title="Notifications">
        {rows.map((n) => (
          <p key={n.id} className="border-b px-3 py-2 text-sm">
            {n.title} · {n.read ? "read" : "unread"}
          </p>
        ))}
      </Wrap>
    );
  }

  if (section === "settings") {
    const rows = await prisma.setting.findMany();
    return (
      <Wrap title="Settings">
        <AdminSettings settings={rows} />
      </Wrap>
    );
  }

  const logs = await prisma.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" }, take: 80 });
  return (
    <Wrap title="Audit logs">
      {logs.map((l) => (
        <p key={l.id} className="border-b px-3 py-2 text-xs">
          {l.createdAt.toISOString()} · {l.actor?.username ?? "system"} · {l.action} · {l.entityType} {l.entityId}
        </p>
      ))}
    </Wrap>
  );
}

function Wrap({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="p-4">
      <h1 className="mb-3 text-xl font-black">{title}</h1>
      <div className="overflow-hidden rounded-xl bg-white">{children}</div>
    </div>
  );
}

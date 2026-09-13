import { NextRequest } from "next/server";
import { z } from "zod";
import { AuthError, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reviewDeposit, reviewWithdrawal } from "@/lib/wallet";
import { assertSameOrigin, jsonError, jsonOk, requestIp } from "@/lib/http";
import { writeAudit } from "@/lib/audit";

const schema = z.object({
  action: z.enum([
    "TOGGLE_USER",
    "REVIEW_DEPOSIT",
    "REVIEW_WITHDRAWAL",
    "TOGGLE_PROMOTION",
    "TOGGLE_PROMO_CODE",
    "UPDATE_SETTING",
    "UPDATE_MATCH_STATUS",
  ]),
  id: z.string().optional(),
  decision: z.enum(["APPROVE", "REJECT"]).optional(),
  note: z.string().optional(),
  key: z.string().optional(),
  value: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin();
    const body = schema.safeParse(await request.json().catch(() => null));
    if (!body.success) return jsonError("Invalid admin action.");

    switch (body.data.action) {
      case "TOGGLE_USER": {
        if (!body.data.id) return jsonError("Missing user.");
        const user = await prisma.user.findUnique({ where: { id: body.data.id } });
        if (!user) return jsonError("User not found.", 404);
        if (user.role === "ADMIN" && admin.role !== "ADMIN") {
          return jsonError("Sub-admins cannot change admin accounts.", 403);
        }
        const next = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        await prisma.user.update({ where: { id: user.id }, data: { status: next } });
        await writeAudit({
          actorId: admin.id,
          action: next === "SUSPENDED" ? "USER_SUSPENDED" : "USER_ACTIVATED",
          entityType: "User",
          entityId: user.id,
          ip: requestIp(request),
        });
        return jsonOk({ status: next });
      }
      case "REVIEW_DEPOSIT": {
        if (!body.data.id || !body.data.decision) return jsonError("Missing deposit review data.");
        const result = await reviewDeposit({
          adminId: admin.id,
          depositId: body.data.id,
          decision: body.data.decision,
          note: body.data.note,
          ip: requestIp(request),
        });
        return jsonOk(result);
      }
      case "REVIEW_WITHDRAWAL": {
        if (!body.data.id || !body.data.decision) return jsonError("Missing withdrawal review data.");
        const result = await reviewWithdrawal({
          adminId: admin.id,
          withdrawalId: body.data.id,
          decision: body.data.decision,
          note: body.data.note,
          ip: requestIp(request),
        });
        return jsonOk(result);
      }
      case "TOGGLE_PROMOTION": {
        if (!body.data.id) return jsonError("Missing promotion.");
        const promo = await prisma.promotion.findUnique({ where: { id: body.data.id } });
        if (!promo) return jsonError("Promotion not found.", 404);
        await prisma.promotion.update({
          where: { id: promo.id },
          data: { active: !promo.active },
        });
        await writeAudit({
          actorId: admin.id,
          action: "PROMOTION_TOGGLED",
          entityType: "Promotion",
          entityId: promo.id,
          ip: requestIp(request),
        });
        return jsonOk({ active: !promo.active });
      }
      case "TOGGLE_PROMO_CODE": {
        if (!body.data.id) return jsonError("Missing code.");
        const code = await prisma.promoCode.findUnique({ where: { id: body.data.id } });
        if (!code) return jsonError("Promo code not found.", 404);
        await prisma.promoCode.update({
          where: { id: code.id },
          data: { active: !code.active },
        });
        await writeAudit({
          actorId: admin.id,
          action: "PROMO_CODE_TOGGLED",
          entityType: "PromoCode",
          entityId: code.id,
          ip: requestIp(request),
        });
        return jsonOk({ active: !code.active });
      }
      case "UPDATE_SETTING": {
        if (admin.role !== "ADMIN") return jsonError("Full admin access required.", 403);
        if (!body.data.key || body.data.value === undefined) return jsonError("Missing setting.");
        await prisma.setting.upsert({
          where: { key: body.data.key },
          update: { value: body.data.value },
          create: { key: body.data.key, value: body.data.value },
        });
        await writeAudit({
          actorId: admin.id,
          action: "SETTING_UPDATED",
          entityType: "Setting",
          entityId: body.data.key,
          ip: requestIp(request),
          metadata: { value: body.data.value },
        });
        return jsonOk({ saved: true });
      }
      case "UPDATE_MATCH_STATUS": {
        if (!body.data.id || !body.data.status) return jsonError("Missing match status.");
        await prisma.match.update({
          where: { id: body.data.id },
          data: { status: body.data.status },
        });
        await writeAudit({
          actorId: admin.id,
          action: "MATCH_STATUS_UPDATED",
          entityType: "Match",
          entityId: body.data.id,
          ip: requestIp(request),
          metadata: { status: body.data.status },
        });
        return jsonOk({ status: body.data.status });
      }
      default:
        return jsonError("Unknown action.");
    }
  } catch (error) {
    if (error instanceof AuthError) return jsonError(error.message, error.status);
    console.error(error);
    return jsonError("Admin action failed.", 500);
  }
}

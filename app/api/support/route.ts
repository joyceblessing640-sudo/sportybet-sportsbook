import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/http";
import { isValidEmail } from "@/lib/validation";

const schema = z.object({
  email: z.string(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success || !isValidEmail(body.data.email)) {
    return jsonError("Enter a valid email, subject and message.");
  }
  await prisma.supportTicket.create({
    data: {
      userId: session?.id,
      email: body.data.email.trim().toLowerCase(),
      subject: body.data.subject,
      message: body.data.message,
    },
  });
  return jsonOk({ message: "Ticket received. A specialist will follow up." });
}

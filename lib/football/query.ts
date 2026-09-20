import type { Prisma } from "@prisma/client";

export const OPEN_MATCH_STATUSES = ["SCHEDULED", "LIVE", "HT"] as const;

export function excludeDemoFootball(where: Prisma.MatchWhereInput = {}): Prisma.MatchWhereInput {
  return {
    AND: [where, { NOT: { sportId: "football", isDemo: true } }],
  };
}

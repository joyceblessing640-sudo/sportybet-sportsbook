import { PrismaClient } from "@prisma/client";
import { prepareSqlite, sqliteDatabaseUrl } from "./sqlite-path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

prepareSqlite();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: sqliteDatabaseUrl() } },
  });

globalForPrisma.prisma = prisma;

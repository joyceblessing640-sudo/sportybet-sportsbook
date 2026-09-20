import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

export const SERVERLESS_SQLITE_PATH = "/tmp/sportybet.db";
export const BASELINE_SQLITE_PATH = path.join(process.cwd(), "data", "baseline.sqlite");

export function isServerlessSqliteHost() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function sqliteDatabaseUrl() {
  if (isServerlessSqliteHost()) return `file:${SERVERLESS_SQLITE_PATH}`;
  return process.env.DATABASE_URL?.trim() || "file:./dev.db";
}

export function prepareSqlite() {
  if (!isServerlessSqliteHost()) return;
  if (existsSync(SERVERLESS_SQLITE_PATH)) return;
  if (!existsSync(BASELINE_SQLITE_PATH)) {
    throw new Error("SportyBets baseline database is missing from the deployment.");
  }
  copyFileSync(BASELINE_SQLITE_PATH, SERVERLESS_SQLITE_PATH);
}

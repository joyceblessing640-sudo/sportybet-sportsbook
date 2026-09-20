import { afterEach, describe, expect, it } from "vitest";
import { isServerlessSqliteHost, sqliteDatabaseUrl } from "./sqlite-path";

describe("sqliteDatabaseUrl", () => {
  const previousVercel = process.env.VERCEL;
  const previousLambda = process.env.AWS_LAMBDA_FUNCTION_NAME;
  const previousUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (previousVercel == null) delete process.env.VERCEL;
    else process.env.VERCEL = previousVercel;
    if (previousLambda == null) delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    else process.env.AWS_LAMBDA_FUNCTION_NAME = previousLambda;
    if (previousUrl == null) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousUrl;
  });

  it("uses a writable /tmp sqlite file on Vercel", () => {
    process.env.VERCEL = "1";
    expect(isServerlessSqliteHost()).toBe(true);
    expect(sqliteDatabaseUrl()).toBe("file:/tmp/sportybet.db");
  });

  it("keeps the local DATABASE_URL off Vercel", () => {
    delete process.env.VERCEL;
    delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    process.env.DATABASE_URL = "file:./dev.db";
    expect(isServerlessSqliteHost()).toBe(false);
    expect(sqliteDatabaseUrl()).toBe("file:./dev.db");
  });
});

import { NextRequest, NextResponse } from "next/server";

export function requestIp(request: NextRequest | Request) {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null
  );
}

export function assertSameOrigin(request: NextRequest | Request) {
  if (process.env.NODE_ENV !== "production") return;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return;
  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      throw new Error("Invalid request origin.");
    }
  } catch {
    throw new Error("Invalid request origin.");
  }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function jsonOk<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

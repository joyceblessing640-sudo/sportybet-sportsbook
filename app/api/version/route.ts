import { NextResponse } from "next/server";
import { BUILD_ID } from "@/lib/build-id";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, build: BUILD_ID },
    {
      headers: {
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}

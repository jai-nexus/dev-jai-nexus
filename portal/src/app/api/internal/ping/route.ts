// portal/src/app/api/internal/ping/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    service: "portal",
    lane: "internal",
  });
}

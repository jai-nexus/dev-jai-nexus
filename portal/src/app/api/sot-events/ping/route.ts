import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSotIngestAuthorized } from "@/lib/sotIngestAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const ok = await isSotIngestAuthorized(req);
    if (!ok) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
        ok: true,
        pong: true,
        ts: new Date().toISOString(),
        hasIngestToken: !!process.env.SOT_INGEST_TOKEN, // does NOT reveal token
    });
}

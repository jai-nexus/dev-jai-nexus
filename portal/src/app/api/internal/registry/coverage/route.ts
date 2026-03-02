// portal/src/app/api/internal/registry/coverage/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { computeRegistryCoverage } from "@/lib/registryCoverage";

export async function GET(req: NextRequest) {
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    try {
        const coverage = await computeRegistryCoverage();
        return NextResponse.json({ ok: true, coverage });
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Coverage Unavailable";
        return NextResponse.json({ ok: false, error: "Coverage Unavailable", detail: msg }, { status: 503 });
    }
}

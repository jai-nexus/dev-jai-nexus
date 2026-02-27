// portal/src/app/api/internal/registry/index/route.ts
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { loadRegistryIndexes } from "@/lib/registryIndex";

export async function GET(req: NextRequest) {
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    try {
        const registry = await loadRegistryIndexes();
        return NextResponse.json({ ok: true, registry });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: "Registry Unavailable", detail: e.message },
            { status: 503 }
        );
    }
}

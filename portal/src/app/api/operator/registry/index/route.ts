// portal/src/app/api/operator/registry/index/route.ts
import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/auth";
import { loadRegistryIndexes } from "@/lib/registryIndex";

export async function GET() {
    const session = await getServerAuthSession();
    if (!session?.user) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Calling the library function directly as requested
        const registry = await loadRegistryIndexes();
        return NextResponse.json({ ok: true, registry });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: "Registry Unavailable", detail: e.message },
            { status: 503 }
        );
    }
}

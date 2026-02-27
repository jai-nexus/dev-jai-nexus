import { NextRequest, NextResponse } from "next/server";

const DEV_BYPASS_HEADER = "x-operator-dev-bypass";
const DEV_BYPASS_ENV = "OPERATOR_DEV_BYPASS_TOKEN";
const INTERNAL_TOKEN_ENV = "JAI_INTERNAL_API_TOKEN";

function mustGetInternalToken() {
    const t = (process.env[INTERNAL_TOKEN_ENV] ?? "").trim();
    if (!t) throw new Error(`Missing ${INTERNAL_TOKEN_ENV} on server`);
    return t;
}

function getOrigin(req: NextRequest) {
    return new URL(req.url).origin;
}

function requireDevAccess(req: NextRequest) {
    // Block in production no matter what (v0 safety)
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { ok: false, error: "Operator API disabled in production" },
            { status: 403 }
        );
    }

    // If you set OPERATOR_DEV_BYPASS_TOKEN, require it.
    // If it's not set, allow in dev (fast local iteration).
    const expected = (process.env[DEV_BYPASS_ENV] ?? "").trim();
    if (!expected) return null;

    const presented = (req.headers.get(DEV_BYPASS_HEADER) ?? "").trim();
    if (!presented || presented !== expected) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    return null;
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ syncRunId: string }> }
) {
    try {
        const deny = requireDevAccess(req);
        if (deny) return deny;

        const { syncRunId } = await context.params;

        const id = Number(syncRunId);
        if (!Number.isFinite(id) || id <= 0) {
            return NextResponse.json({ ok: false, error: "Invalid syncRunId" }, { status: 400 });
        }

        const token = mustGetInternalToken();
        const origin = getOrigin(req);

        const res = await fetch(`${origin}/api/internal/agents/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ syncRunId: id }),
            cache: "no-store",
        });

        const contentType = res.headers.get("content-type") || "";
        const payload = contentType.includes("application/json")
            ? await res.json().catch(() => null)
            : await res.text().catch(() => null);

        return NextResponse.json(
            { ok: res.ok, status: res.status, payload },
            { status: res.ok ? 200 : res.status }
        );
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e?.message || "Operator apply failed" },
            { status: 500 }
        );
    }
}

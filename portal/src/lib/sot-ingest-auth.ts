export function requireSotIngestAuth(req: Request): {
    ok: true;
} | {
    ok: false;
    status: number;
    error: string;
} {
    const expectedRaw = process.env.SOT_INGEST_TOKEN ?? "";
    const expected = expectedRaw.trim().replace(/^["'](.+)["']$/, "$1"); // strip quotes just in case

    if (!expected) {
        return { ok: false, status: 500, error: "SOT_INGEST_TOKEN not configured" };
    }

    const auth = req.headers.get("authorization") ?? "";
    const gotRaw = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
    const got = gotRaw.trim().replace(/^["'](.+)["']$/, "$1");

    if (!got) return { ok: false, status: 401, error: "Missing bearer token" };
    if (got !== expected) return { ok: false, status: 401, error: "Unauthorized" };

    return { ok: true };
}

import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { assertInternalToken } from "@/lib/internalAuth";
import crypto from "crypto";

function stripQuotes(s: string) {
    return s.trim().replace(/^["'](.+)["']$/, "$1");
}

function safeEqual(a: string, b: string) {
    const aa = Buffer.from(a);
    const bb = Buffer.from(b);
    if (aa.length !== bb.length) return false;
    return crypto.timingSafeEqual(aa, bb);
}

// Auth: Session OR SOT_INGEST_TOKEN (via x-sot-ingest-token or Bearer) OR internal token
function hasIngestToken(req: NextRequest): boolean {
    const expectedRaw = process.env.SOT_INGEST_TOKEN ?? "";
    const expected = stripQuotes(expectedRaw);
    if (!expected) return false;

    const auth = req.headers.get("authorization") ?? "";
    const bearer = stripQuotes(auth.replace(/^Bearer\s+/i, ""));
    const ingestTokenHeader = stripQuotes(req.headers.get("x-sot-ingest-token") ?? "");

    return safeEqual(bearer, expected) || safeEqual(ingestTokenHeader, expected);
}

async function hasSession(req: NextRequest): Promise<boolean> {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return false;
    const token = await getToken({ req, secret });
    return !!token;
}

export async function isSotIngestAuthorized(req: NextRequest): Promise<boolean> {
    const isIngest = hasIngestToken(req);
    const isInternal = assertInternalToken(req).ok;
    const isSession = await hasSession(req);
    return isIngest || isInternal || isSession;
}

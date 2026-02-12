// portal/src/app/api/dct/slot-bind/route.ts
import { NextRequest, NextResponse } from "next/server";
import { recordSotEvent } from "@/lib/sotEvents";
import { assertInternalToken } from "@/lib/internalAuth";
import {
    DCT_KINDS,
    SlotBindPayloadSchema,
    DctAnchorSchema,
} from "@/lib/contracts/dctV01";
import { isValidDctSlot, normalizeDctSlot } from "@/lib/dctSlots";

const ROUTE_VERSION = "dct-slot-bind:v4";

// Module load fingerprint (proves the module is actually loaded)
console.log("[route-load]", "dct/slot-bind", { ROUTE_VERSION });

type Body = {
    slot?: unknown;
    ideaId?: unknown;
    anchor?: unknown;
    nhId?: unknown;
    repoName?: unknown;
    domainName?: unknown;
};

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

function safeDiagAuth(req: NextRequest) {
    // No secrets; only lengths + “which header exists”
    const expected = (process.env.JAI_INTERNAL_API_TOKEN ?? "").trim();

    const authHeader = (req.headers.get("authorization") ?? "").trim();
    const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.slice(7).trim()
        : "";

    const legacy = (req.headers.get("x-jai-internal-token") ?? "").trim();

    return {
        expectedConfigured: expected.length > 0,
        expectedLen: expected.length,
        hasAuthorizationHeader: authHeader.length > 0,
        bearerTokenLen: bearerToken.length,
        hasLegacyHeader: legacy.length > 0,
        legacyLen: legacy.length,
        // tiny prefixes to confirm you’re sending *something* (still not full secret)
        bearerPrefix: bearerToken.slice(0, 8),
        legacyPrefix: legacy.slice(0, 8),
    };
}

/**
 * GET /api/dct/slot-bind
 * Fingerprint endpoint to prove the running route version.
 * NOTE: We keep this public so you can verify routing without auth/middleware noise.
 */
export function GET() {
    console.log("[route-hit]", "GET /api/dct/slot-bind", { ROUTE_VERSION });
    return NextResponse.json({
        ok: true,
        route: "dct/slot-bind",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
    });
}

/**
 * POST /api/dct/slot-bind
 * Internal (token-protected) endpoint to bind a slot -> ideaId by emitting a DCT SoT event.
 */
export async function POST(req: NextRequest) {
    console.log("[route-hit]", "POST /api/dct/slot-bind", { ROUTE_VERSION });

    const auth = assertInternalToken(req);
    if (!auth.ok) {
        // DEV-only: return safe diagnostics to pinpoint header/env mismatch quickly
        if (process.env.NODE_ENV !== "production") {
            const diag = safeDiagAuth(req);
            console.log("[route-auth-fail]", "dct/slot-bind", { ROUTE_VERSION, diag });

            return NextResponse.json(
                {
                    ok: false,
                    error: "Unauthorized",
                    routeVersion: ROUTE_VERSION,
                    diag,
                },
                { status: 401 },
            );
        }

        return auth.response;
    }

    let body: Body;
    try {
        body = (await req.json()) as Body;
    } catch {
        return badRequest("Invalid JSON");
    }

    const slot = normalizeDctSlot(String(body.slot ?? ""));
    const ideaId = String(body.ideaId ?? "").trim();

    if (!slot) return badRequest("slot is required");
    if (!isValidDctSlot(slot)) return badRequest("slot is invalid (expected dot/slug format)");
    if (!ideaId) return badRequest("ideaId is required");
    if (ideaId.length > 120) return badRequest("ideaId too long");

    // Optional anchor validation (strict, but optional)
    let anchor: unknown = undefined;
    if (body.anchor !== undefined) {
        const parsedAnchor = DctAnchorSchema.safeParse(body.anchor);
        if (!parsedAnchor.success) {
            return badRequest("anchor is invalid", parsedAnchor.error.flatten());
        }
        anchor = parsedAnchor.data;
    }

    const payloadCandidate = {
        type: DCT_KINDS.SLOT_BIND,
        slot,
        ideaId,
        ...(anchor ? { anchor } : {}),
    };

    const parsedPayload = SlotBindPayloadSchema.safeParse(payloadCandidate);
    if (!parsedPayload.success) {
        return badRequest("payload failed validation", parsedPayload.error.flatten());
    }

    const ts = new Date().toISOString();

    const nhId = typeof body.nhId === "string" ? body.nhId : undefined;
    const repoName = typeof body.repoName === "string" ? body.repoName : undefined;
    const domainName = typeof body.domainName === "string" ? body.domainName : undefined;

    const created = await recordSotEvent({
        version: "sot-event-0.1",
        ts,
        source: "operator",
        kind: DCT_KINDS.SLOT_BIND,
        summary: `Bind slot ${slot} → ${ideaId}`,
        nhId,
        repoName,
        domainName,
        payload: parsedPayload.data as any,
    });

    return NextResponse.json({
        ok: true,
        routeVersion: ROUTE_VERSION,
        eventId: created.eventId,
        slot,
        ideaId,
    });
}

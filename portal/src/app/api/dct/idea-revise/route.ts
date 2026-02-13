// portal/src/app/api/dct/idea-revise/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { recordSotEvent } from "@/lib/sotEvents";
import { IdeaRevisePayloadSchema, DCT_KINDS } from "@/lib/contracts/dctV01";

const ROUTE_VERSION = "dct-idea-revise:v2";

function json400(route: string, t0: number, message: string, details?: unknown) {
    return NextResponse.json(
        {
            ok: false,
            route,
            routeVersion: ROUTE_VERSION,
            nodeEnv: process.env.NODE_ENV,
            ms: Date.now() - t0,
            error: message,
            details,
        },
        { status: 400 }
    );
}

function json500(route: string, t0: number, message: string, details?: unknown) {
    return NextResponse.json(
        {
            ok: false,
            route,
            routeVersion: ROUTE_VERSION,
            nodeEnv: process.env.NODE_ENV,
            ms: Date.now() - t0,
            error: message,
            details,
        },
        { status: 500 }
    );
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * POST /api/dct/idea-revise
 * Internal (token-protected) endpoint that emits a dct.idea.revise event.
 *
 * Payload must match IdeaRevisePayloadSchema (discriminated union style).
 */
export async function POST(req: NextRequest) {
    const route = "dct/idea-revise";

    // Internal machine auth (repo pattern)
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const t0 = Date.now();

    // Read raw body text (more robust than req.json() in some Next dev/proxy situations)
    let rawText = "";
    try {
        rawText = await req.text();
    } catch (err: any) {
        return json400(route, t0, "Could not read request body", {
            message: err?.message ?? String(err),
            contentType: req.headers.get("content-type"),
        });
    }

    if (!rawText || rawText.trim().length === 0) {
        return json400(route, t0, "Empty request body", {
            contentType: req.headers.get("content-type"),
        });
    }

    // Parse JSON ourselves so we can return helpful diagnostics
    let raw: unknown;
    try {
        raw = JSON.parse(rawText);
    } catch (err: any) {
        return json400(route, t0, "Invalid JSON body", {
            contentType: req.headers.get("content-type"),
            bodyLen: rawText.length,
            bodyPreview: rawText.slice(0, 200),
            message: err?.message ?? String(err),
        });
    }

    const parsed = IdeaRevisePayloadSchema.safeParse(raw);
    if (!parsed.success) {
        return json400(route, t0, "Invalid payload (IdeaRevisePayloadSchema)", parsed.error.flatten());
    }

    const payload = parsed.data;

    // Require at least one mutation field (revise shouldn't be empty)
    const hasAnyChange =
        payload.text !== undefined ||
        payload.ideaType !== undefined ||
        payload.confidence !== undefined ||
        payload.anchor !== undefined ||
        payload.tags !== undefined;

    if (!hasAnyChange) {
        return json400(route, t0, "No changes provided (empty revise payload)");
    }

    // Ensure idea exists before emitting.
    // We avoid JSON-path filtering; instead scan a bounded set of create events.
    const TAKE = 5000;

    let createEvents: Array<{ payload: unknown; eventId: string }> = [];
    try {
        createEvents = await prisma.sotEvent.findMany({
            where: { kind: DCT_KINDS.IDEA_CREATE },
            orderBy: [{ ts: "desc" }, { eventId: "desc" }],
            take: TAKE,
            select: { payload: true, eventId: true },
        });
    } catch (err: any) {
        return json500(route, t0, "Failed to load create events", {
            message: err?.message ?? String(err),
        });
    }

    const found = createEvents.some((e) => {
        const p = e.payload as unknown;
        if (!isObject(p)) return false;

        // Be tolerant: some older create payloads might not include `type`
        const ideaId = p.ideaId;
        const type = p.type;

        return ideaId === payload.ideaId && (type === undefined || type === DCT_KINDS.IDEA_CREATE);
    });

    if (!found) {
        return json400(route, t0, `Unknown ideaId (no prior create found): ${payload.ideaId}`, {
            checkedCreates: createEvents.length,
            take: TAKE,
        });
    }

    let evt: any;
    try {
        evt = await recordSotEvent({
            ts: new Date().toISOString(),
            source: "portal",
            kind: DCT_KINDS.IDEA_REVISE,
            summary: `DCT revise ${payload.ideaId}`,
            payload,
        });
    } catch (err: any) {
        return json500(route, t0, "Failed to record SoT event", {
            message: err?.message ?? String(err),
        });
    }

    return NextResponse.json({
        ok: true,
        route,
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        ms: Date.now() - t0,
        received: {
            ideaId: payload.ideaId,
            keys: Object.keys(payload).filter((k) => k !== "type" && k !== "ideaId"),
            contentType: req.headers.get("content-type"),
            bodyLen: rawText.length,
        },
        emitted: {
            kind: evt.kind ?? DCT_KINDS.IDEA_REVISE,
            nhId: evt.nhId ?? null,
            ts: evt.ts ?? null,
        },
    });
}

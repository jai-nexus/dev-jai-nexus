// portal/src/app/api/dct/idea-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { recordSotEvent } from "@/lib/sotEvents";
import { IdeaStatusPayloadSchema, DCT_KINDS } from "@/lib/contracts/dctV01";

const ROUTE_VERSION = "dct-idea-status:v1";

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * POST /api/dct/idea-status
 * Internal (token-protected) endpoint that emits a dct.idea.status event.
 *
 * Payload must match IdeaStatusPayloadSchema.
 */
export async function POST(req: NextRequest) {
    // Internal machine auth (repo pattern)
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const t0 = Date.now();

    // Read raw body text (more robust than req.json() in some Next dev/proxy situations)
    let rawText = "";
    try {
        rawText = await req.text();
    } catch (err: any) {
        return badRequest("Could not read request body", {
            message: err?.message ?? String(err),
            contentType: req.headers.get("content-type"),
        });
    }

    if (!rawText || rawText.trim().length === 0) {
        return badRequest("Empty request body", {
            contentType: req.headers.get("content-type"),
            ms: Date.now() - t0,
        });
    }

    // Parse JSON ourselves so we can return helpful diagnostics
    let raw: unknown;
    try {
        raw = JSON.parse(rawText);
    } catch (err: any) {
        return badRequest("Invalid JSON body", {
            contentType: req.headers.get("content-type"),
            bodyLen: rawText.length,
            bodyPreview: rawText.slice(0, 200),
            message: err?.message ?? String(err),
            ms: Date.now() - t0,
        });
    }

    const parsed = IdeaStatusPayloadSchema.safeParse(raw);
    if (!parsed.success) {
        return badRequest("Invalid payload (IdeaStatusPayloadSchema)", parsed.error.flatten());
    }

    const payload = parsed.data;

    // Ensure idea exists before emitting (DB/provider-agnostic)
    const TAKE = 5000;

    const createEvents = await prisma.sotEvent.findMany({
        where: { kind: DCT_KINDS.IDEA_CREATE },
        orderBy: [{ ts: "desc" }, { eventId: "desc" }],
        take: TAKE,
        select: { payload: true, eventId: true },
    });

    const found = createEvents.some((e) => {
        const p = e.payload as unknown;
        if (!isObject(p)) return false;

        // tolerant: old creates might not include `type`
        const ideaId = p.ideaId;
        const type = p.type;

        return ideaId === payload.ideaId && (type === undefined || type === DCT_KINDS.IDEA_CREATE);
    });

    if (!found) {
        return badRequest(`Unknown ideaId (no prior create found): ${payload.ideaId}`, {
            checkedCreates: createEvents.length,
            take: TAKE,
        });
    }

    const evt = await recordSotEvent({
        ts: new Date().toISOString(),
        source: "portal",
        kind: DCT_KINDS.IDEA_STATUS,
        summary: `DCT status ${payload.ideaId} -> ${payload.status}`,
        payload,
    });

    return NextResponse.json({
        ok: true,
        route: "dct/idea-status",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        ms: Date.now() - t0,
        received: {
            ideaId: payload.ideaId,
            status: payload.status,
            hasAnchor: Boolean(payload.anchor),
            contentType: req.headers.get("content-type"),
            bodyLen: rawText.length,
        },
        emitted: {
            kind: evt.kind ?? DCT_KINDS.IDEA_STATUS,
            nhId: evt.nhId ?? null,
            ts: evt.ts ?? null,
        },
    });
}

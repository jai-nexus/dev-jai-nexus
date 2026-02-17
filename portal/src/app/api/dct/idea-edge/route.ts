// portal/src/app/api/dct/idea-edge/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { recordSotEvent } from "@/lib/sotEvents";
import { IdeaEdgePayloadSchema, DCT_KINDS } from "@/lib/contracts/dctV01";

const ROUTE_VERSION = "dct-idea-edge:v1";

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * POST /api/dct/idea-edge
 * Internal (token-protected) endpoint that emits a dct.idea.edge event.
 *
 * Payload must match IdeaEdgePayloadSchema.
 */
export async function POST(req: NextRequest) {
    // Internal machine auth
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const t0 = Date.now();

    // Read raw body text
    let rawText = "";
    try {
        rawText = await req.text();
    } catch (err: unknown) {
        return badRequest("Could not read request body", {
            message: err instanceof Error ? err.message : String(err),
            contentType: req.headers.get("content-type"),
        });
    }

    if (!rawText || rawText.trim().length === 0) {
        return badRequest("Empty request body", {
            contentType: req.headers.get("content-type"),
            ms: Date.now() - t0,
        });
    }

    // Parse JSON ourselves
    let raw: unknown;
    try {
        raw = JSON.parse(rawText);
    } catch (err: unknown) {
        return badRequest("Invalid JSON body", {
            contentType: req.headers.get("content-type"),
            bodyLen: rawText.length,
            bodyPreview: rawText.slice(0, 200),
            message: err instanceof Error ? err.message : String(err),
            ms: Date.now() - t0,
        });
    }

    const parsed = IdeaEdgePayloadSchema.safeParse(raw);
    if (!parsed.success) {
        return badRequest("Invalid payload (IdeaEdgePayloadSchema)", parsed.error.flatten());
    }

    const payload = parsed.data;

    // Optional safety: disallow self-edge (usually accidental)
    if (payload.from === payload.to) {
        return badRequest("Invalid edge: from and to cannot be the same ideaId", {
            from: payload.from,
            to: payload.to,
        });
    }

    // Existence checks (DB/provider-agnostic)
    const TAKE = 5000;

    const createEvents = await prisma.sotEvent.findMany({
        where: { kind: DCT_KINDS.IDEA_CREATE },
        orderBy: [{ ts: "desc" }, { eventId: "desc" }],
        take: TAKE,
        select: { payload: true, eventId: true },
    });

    const ideaExists = (ideaId: string) =>
        createEvents.some((e) => {
            const p = e.payload as unknown;
            if (!isObject(p)) return false;
            const id = p.ideaId as string | undefined;
            const type = p.type as string | undefined;
            return id === ideaId && (type === undefined || type === DCT_KINDS.IDEA_CREATE);
        });

    const fromOk = ideaExists(payload.from);
    const toOk = ideaExists(payload.to);

    if (!fromOk || !toOk) {
        return badRequest("Unknown ideaId in edge (no prior create found)", {
            from: payload.from,
            fromOk,
            to: payload.to,
            toOk,
            checkedCreates: createEvents.length,
            take: TAKE,
        });
    }

    const evt = await recordSotEvent({
        ts: new Date().toISOString(),
        source: "portal",
        kind: DCT_KINDS.IDEA_EDGE,
        summary: `DCT edge ${payload.from} ${payload.relation} ${payload.to}`,
        payload,
    });

    return NextResponse.json({
        ok: true,
        route: "dct/idea-edge",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        ms: Date.now() - t0,
        received: {
            from: payload.from,
            to: payload.to,
            relation: payload.relation,
            confidence: payload.confidence,
            hasAnchor: Boolean(payload.anchor),
            contentType: req.headers.get("content-type"),
            bodyLen: rawText.length,
        },
        emitted: {
            kind: evt.kind ?? DCT_KINDS.IDEA_EDGE,
            nhId: evt.nhId ?? null,
            ts: evt.ts ?? null,
        },
    });
}

// portal/src/app/api/dct/idea/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

const ROUTE_VERSION = "dct-idea:v1";

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

function clampInt(raw: string | null, min: number, max: number, fallback: number) {
    if (!raw) return fallback;
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    const i = Math.floor(n);
    if (i < min) return min;
    if (i > max) return max;
    return i;
}

/**
 * GET /api/dct/idea?ideaId=...
 * Internal (token-protected) endpoint that returns a single projected idea.
 *
 * Optional:
 * - take=1..5000 (default 2000)
 * - includeEdges=true (default false)
 * - includeSlots=true (default true)
 * - includeEvents=true (default false)  (raw events returned; can be big)
 */
export async function GET(req: NextRequest) {
    // Internal machine auth (repo pattern)
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const url = new URL(req.url);

    const ideaId = (url.searchParams.get("ideaId") ?? "").trim();
    if (!ideaId) return badRequest("Missing required query param: ideaId");

    const take = clampInt(url.searchParams.get("take"), 1, 5000, 2000);
    const includeEdges = (url.searchParams.get("includeEdges") ?? "").toLowerCase() === "true";
    const includeSlots = (url.searchParams.get("includeSlots") ?? "true").toLowerCase() !== "false";
    const includeEvents = (url.searchParams.get("includeEvents") ?? "").toLowerCase() === "true";

    // Load DCT events (chronological apply is safest)
    const rawEvents = await prisma.sotEvent.findMany({
        where: { kind: { startsWith: "dct." } },
        orderBy: [{ ts: "asc" }, { eventId: "asc" }],
        take,
    });

    const events: DctEventInput[] = rawEvents.map((e) => ({
        eventId: e.eventId,
        ts: e.ts,
        kind: e.kind,
        source: e.source,
        summary: e.summary,
        payload: e.payload as unknown,
        nhId: e.nhId,
    }));

    const projection = applyDct(events);

    const idea = projection.ideas[ideaId] ?? null;

    // slots that reference this idea (very useful for debugging)
    const slotRefs = includeSlots
        ? Object.entries(projection.slots)
            .filter(([, b]) => b.ideaId === ideaId)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([slot, b]) => ({
                slot,
                ...b,
            }))
        : undefined;

    // edges that touch this idea
    const edgeRefs = includeEdges
        ? projection.edges.filter((e) => e.from === ideaId || e.to === ideaId)
        : undefined;

    return NextResponse.json({
        ok: true,
        route: "dct/idea",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        meta: {
            ideaId,
            found: Boolean(idea),
            take,
            eventsProcessed: projection.metrics.eventsProcessed,
            eventsSkippedInvalidPayload: projection.metrics.eventsSkippedInvalidPayload,
            eventsSkippedKindPayloadMismatch: projection.metrics.eventsSkippedKindPayloadMismatch,
            eventsSkippedUnknownIdea: projection.metrics.eventsSkippedUnknownIdea,
            eventsWithLegacyAnchors: projection.metrics.eventsWithLegacyAnchors,
            slotRefCount: slotRefs?.length ?? 0,
            edgeRefCount: edgeRefs?.length ?? 0,
        },
        idea,
        slotRefs,
        edges: edgeRefs,
        events: includeEvents ? rawEvents : undefined,
    });
}

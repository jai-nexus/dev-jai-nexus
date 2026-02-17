// portal/src/app/api/dct/slots/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

const ROUTE_VERSION = "dct-slots:v1";



/**
 * GET /api/dct/slots
 * Internal (token-protected) endpoint that returns the current slot bindings
 * as projected from the SoT stream (dct.* events).
 */
export async function GET(req: NextRequest) {
    // Internal machine auth
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const url = new URL(req.url);

    // Optional tuning params
    const take = clampInt(url.searchParams.get("take"), 1, 5000, 2000);
    const includeIdeas = (url.searchParams.get("includeIdeas") ?? "").toLowerCase() === "true";
    const includeEvents = (url.searchParams.get("includeEvents") ?? "").toLowerCase() === "true";

    // Load DCT events (chronological apply is usually safest)
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

    const slots = projection.slots;
    const slotEntries = Object.entries(slots).sort(([a], [b]) => a.localeCompare(b));

    return NextResponse.json({
        ok: true,
        route: "dct/slots",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        meta: {
            take,
            slotCount: projection.metrics.slotCount,
            operatingIdeasCount: projection.metrics.operatingIdeasCount,
            eventsProcessed: projection.metrics.eventsProcessed,
            eventsSkippedInvalidPayload: projection.metrics.eventsSkippedInvalidPayload,
            eventsSkippedKindPayloadMismatch: projection.metrics.eventsSkippedKindPayloadMismatch,
            eventsSkippedUnknownIdea: projection.metrics.eventsSkippedUnknownIdea,
            eventsWithLegacyAnchors: projection.metrics.eventsWithLegacyAnchors,
        },
        slots,
        slotEntries: slotEntries.map(([slot, binding]) => ({
            slot,
            ...binding,
            idea: includeIdeas ? projection.ideas[binding.ideaId] ?? null : undefined,
        })),
        events: includeEvents ? rawEvents : undefined,
    });
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

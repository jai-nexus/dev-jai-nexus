// portal/src/app/api/dct/operating-set/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

const ROUTE_VERSION = "dct-operating-set:v1";

function clampInt(raw: string | null, min: number, max: number, fallback: number) {
    if (!raw) return fallback;
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    const i = Math.floor(n);
    if (i < min) return min;
    if (i > max) return max;
    return i;
}

export async function GET(req: NextRequest) {
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const url = new URL(req.url);
    const take = clampInt(url.searchParams.get("take"), 1, 5000, 2000);

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

    // Slot → binding plus resolved idea (or null if missing)
    const operating = Object.entries(projection.slots)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slot, binding]) => ({
            slot,
            ...binding,
            idea: projection.ideas[binding.ideaId] ?? null,
        }));

    return NextResponse.json({
        ok: true,
        route: "dct/operating-set",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        meta: {
            take,
            slotCount: projection.metrics.slotCount,
            operatingIdeasCount: projection.metrics.operatingIdeasCount,
            eventsProcessed: projection.metrics.eventsProcessed,
            eventsWithLegacyAnchors: projection.metrics.eventsWithLegacyAnchors,
            skipped:
                projection.metrics.eventsSkippedInvalidPayload +
                projection.metrics.eventsSkippedKindPayloadMismatch +
                projection.metrics.eventsSkippedUnknownIdea,
        },
        operating,
    });
}

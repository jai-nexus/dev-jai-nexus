// portal/src/app/api/dct/idea-provenance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { recordSotEvent } from "@/lib/sotEvents";
import { z } from "zod";
import {
    DctAnchorSchema,
    DCT_KINDS,
    IdeaRevisePayloadSchema,
    validateAnchorStrict,
    type DctAnchor,
} from "@/lib/contracts/dctV01";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

const ROUTE_VERSION = "dct-idea-provenance:v2";

// Bounded scans (portable; no JSON-path)
const TAKE_CREATES = 5000;
const TAKE_EVENTS = 5000;

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function sanitizeTags(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    const cleaned = raw
        .map((t) => (typeof t === "string" ? t.trim() : ""))
        .filter((t) => t.length > 0);
    return Array.from(new Set(cleaned));
}

function sortTags(tags: string[]): string[] {
    return [...tags].sort((a, b) => a.localeCompare(b));
}

function processAnchor(anchor: DctAnchor): { anchor: DctAnchor; isLegacy: boolean } {
    const strict = validateAnchorStrict(anchor).strict;
    if (!strict) return { anchor: { ...anchor, _legacy: true } as unknown as DctAnchor, isLegacy: true };
    return { anchor, isLegacy: false };
}

const BodySchema = z.object({
    ideaId: z.string().min(1),
    anchor: DctAnchorSchema,
    addTags: z.array(z.string()).optional(),
    removeTags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const t0 = Date.now();

    // Robust body read (matches idea-revise:v2)
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

    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
        return badRequest("Invalid payload (BodySchema)", parsed.error.flatten());
    }

    const ideaId = parsed.data.ideaId.trim();
    const addTags = sanitizeTags(parsed.data.addTags);
    const removeTags = sanitizeTags(parsed.data.removeTags);

    // Anchor strictness + legacy tagging (same semantics as projection)
    const { anchor, isLegacy } = processAnchor(parsed.data.anchor);

    // Ensure idea exists (portable check: scan creates)
    const createEvents = await prisma.sotEvent.findMany({
        where: { kind: DCT_KINDS.IDEA_CREATE },
        orderBy: [{ ts: "desc" }, { eventId: "desc" }],
        take: TAKE_CREATES,
        select: { payload: true },
    });

    const found = createEvents.some((e) => {
        const p = e.payload as unknown;
        return isObject(p) && p.type === DCT_KINDS.IDEA_CREATE && p.ideaId === ideaId;
    });

    if (!found) {
        return badRequest(`Unknown ideaId (no prior create found): ${ideaId}`, {
            checkedCreates: createEvents.length,
            take: TAKE_CREATES,
        });
    }

    // Optional tag modifications: compute from current projected tags
    // (projection-based so removeTags is correct without JSON-path filtering)
    let nextTags: string[] | undefined;

    if (addTags.length > 0 || removeTags.length > 0) {
        const rawEvents = await prisma.sotEvent.findMany({
            where: { kind: { startsWith: "dct." } },
            orderBy: [{ ts: "asc" }, { eventId: "asc" }],
            take: TAKE_EVENTS,
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
        const cur = projection.ideas[ideaId]?.tags ?? [];

        const s = new Set<string>(sanitizeTags(cur));
        for (const t of addTags) s.add(t);
        for (const t of removeTags) s.delete(t);

        const computed = sortTags(Array.from(s));
        const curSorted = sortTags(sanitizeTags(cur));

        // Only include tags if they actually change (keeps event clean)
        if (computed.join("\n") !== curSorted.join("\n")) {
            nextTags = computed;
        }
    }

    // Build revise payload (validate via IdeaRevisePayloadSchema)
    const revisePayloadRaw: unknown = {
        type: DCT_KINDS.IDEA_REVISE,
        ideaId,
        anchor,
        ...(nextTags ? { tags: nextTags } : {}),
    };

    const reviseParsed = IdeaRevisePayloadSchema.safeParse(revisePayloadRaw);
    if (!reviseParsed.success) {
        return badRequest("Internal error: revise payload failed IdeaRevisePayloadSchema", reviseParsed.error.flatten());
    }

    const payload = reviseParsed.data;

    const evt = await recordSotEvent({
        ts: new Date().toISOString(),
        source: "portal",
        kind: DCT_KINDS.IDEA_REVISE,
        summary: `DCT provenance ${ideaId}`,
        payload,
    });

    return NextResponse.json({
        ok: true,
        route: "dct/idea-provenance",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        ms: Date.now() - t0,
        received: {
            ideaId,
            hasAnchor: true,
            anchorLegacy: isLegacy,
            addTags: addTags.length,
            removeTags: removeTags.length,
            tagsChanged: Boolean(nextTags),
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

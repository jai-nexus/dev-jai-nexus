import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { recordSotEvent } from "@/lib/sotEvents";
import { z } from "zod";
import { DctAnchorSchema, DCT_KINDS, IdeaRevisePayloadSchema } from "@/lib/contracts/dctV01";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

const ROUTE_VERSION = "dct-idea-provenance:v1";

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
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

    // robust body read (matches your idea-revise:v2 approach)
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

    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
        return badRequest("Invalid payload (BodySchema)", parsed.error.flatten());
    }

    const { ideaId, anchor, addTags = [], removeTags = [] } = parsed.data;

    // Ensure idea exists (portable check: scan creates)
    const TAKE = 5000;
    const createEvents = await prisma.sotEvent.findMany({
        where: { kind: DCT_KINDS.IDEA_CREATE },
        orderBy: [{ ts: "desc" }, { eventId: "desc" }],
        take: TAKE,
        select: { payload: true },
    });

    const found = createEvents.some((e) => {
        const p = e.payload as unknown;
        return isObject(p) && p.type === DCT_KINDS.IDEA_CREATE && p.ideaId === ideaId;
    });

    if (!found) {
        return badRequest(`Unknown ideaId (no prior create found): ${ideaId}`, {
            checkedCreates: createEvents.length,
            take: TAKE,
        });
    }

    // Optional tag modifications: compute from current projected tags
    // This makes removeTags reliable without inventing a "tagsReplace" mode yet.
    let nextTags: string[] | undefined = undefined;

    if (addTags.length > 0 || removeTags.length > 0) {
        const rawEvents = await prisma.sotEvent.findMany({
            where: { kind: { startsWith: "dct." } },
            orderBy: [{ ts: "asc" }, { eventId: "asc" }],
            take: 5000,
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

        const s = new Set<string>(cur);
        for (const t of addTags) s.add(t);
        for (const t of removeTags) s.delete(t);

        nextTags = Array.from(s);
    }

    // Build revise payload (validate via IdeaRevisePayloadSchema)
    const revisePayloadRaw: any = {
        type: DCT_KINDS.IDEA_REVISE,
        ideaId,
        anchor,
    };
    if (nextTags) revisePayloadRaw.tags = nextTags;

    const reviseParsed = IdeaRevisePayloadSchema.safeParse(revisePayloadRaw);
    if (!reviseParsed.success) {
        return badRequest(
            "Internal error: revise payload failed IdeaRevisePayloadSchema",
            reviseParsed.error.flatten(),
        );
    }

    const payload = reviseParsed.data;

    const evt = await recordSotEvent({
        ts: new Date().toISOString(),
        source: "portal",
        kind: DCT_KINDS.IDEA_REVISE,
        summary: `DCT provenance ${ideaId}`,
        payload: payload as any,
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
            addTags: addTags.length,
            removeTags: removeTags.length,
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

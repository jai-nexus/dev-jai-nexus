// portal/src/app/api/dct/idea-create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { assertInternalToken } from "@/lib/internalAuth";
import { recordSotEvent } from "@/lib/sotEvents";
import { DCT_KINDS, IdeaCreatePayloadSchema, DctAnchorSchema } from "@/lib/contracts/dctV01";

const ROUTE_VERSION = "dct-idea-create:v1";

type Body = {
    ideaId?: unknown;
    text?: unknown;
    ideaType?: unknown;
    status?: unknown;
    confidence?: unknown;
    anchor?: unknown;
    tags?: unknown;
    nhId?: unknown;
    repoName?: unknown;
    domainName?: unknown;
};

function badRequest(message: string, details?: unknown) {
    return NextResponse.json({ ok: false, error: message, details }, { status: 400 });
}

export async function POST(req: NextRequest) {
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    let body: Body;
    try {
        body = (await req.json()) as Body;
    } catch {
        return badRequest("Invalid JSON");
    }

    const ideaId = String(body.ideaId ?? "").trim();
    const text = String(body.text ?? "").trim();

    if (!ideaId) return badRequest("ideaId is required");
    if (ideaId.length > 160) return badRequest("ideaId too long");
    if (!text) return badRequest("text is required");

    // Optional anchor validation (strict-ish, optional)
    let anchor: unknown = undefined;
    if (body.anchor !== undefined) {
        const parsedAnchor = DctAnchorSchema.safeParse(body.anchor);
        if (!parsedAnchor.success) {
            return badRequest("anchor is invalid", parsedAnchor.error.flatten());
        }
        anchor = parsedAnchor.data;
    }

    const payloadCandidate = {
        type: DCT_KINDS.IDEA_CREATE,
        ideaId,
        text,
        ideaType: body.ideaType,
        status: body.status,
        confidence: body.confidence,
        anchor,
        tags: Array.isArray(body.tags) ? body.tags : undefined,
        nhId: typeof body.nhId === "string" ? body.nhId : undefined,
    };

    const parsed = IdeaCreatePayloadSchema.safeParse(payloadCandidate);
    if (!parsed.success) {
        return badRequest("payload failed validation", parsed.error.flatten());
    }

    const ts = new Date().toISOString();
    const repoName = typeof body.repoName === "string" ? body.repoName : undefined;
    const domainName = typeof body.domainName === "string" ? body.domainName : undefined;

    const created = await recordSotEvent({
        version: "sot-event-0.1",
        ts,
        source: "operator",
        kind: DCT_KINDS.IDEA_CREATE,
        summary: `Create idea ${ideaId}`,
        nhId: parsed.data.nhId ?? "",
        repoName,
        domainName,
        payload: parsed.data as any,
    });

    return NextResponse.json({
        ok: true,
        route: "dct/idea-create",
        routeVersion: ROUTE_VERSION,
        eventId: created.eventId,
        ideaId,
    });
}

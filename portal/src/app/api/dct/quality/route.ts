import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertInternalToken } from "@/lib/internalAuth";
import { applyDct, type DctEventInput } from "@/lib/dctProjection";

const ROUTE_VERSION = "dct-quality:v1";

export async function GET(req: NextRequest) {
    const auth = assertInternalToken(req);
    if (!auth.ok) return auth.response;

    const url = new URL(req.url);
    const take = clampInt(url.searchParams.get("take"), 1, 20000, 2000);
    const maxIssues = clampInt(url.searchParams.get("maxIssues"), 1, 500, 50);

    const t0 = Date.now();

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

    // 1) Slot-bound ideas with anchors=0
    const slotBoundNeedsProvenance: Array<{
        slot: string;
        ideaId: string;
        reason: string;
        boundAt: string;
        eventId: string;
    }> = [];

    for (const [slot, binding] of Object.entries(projection.slots)) {
        const idea = projection.ideas[binding.ideaId];
        if (!idea) continue;
        if ((idea.anchors?.length ?? 0) === 0) {
            slotBoundNeedsProvenance.push({
                slot,
                ideaId: binding.ideaId,
                reason: "slot-bound idea has anchors=0",
                boundAt: binding.ts,
                eventId: binding.eventId,
            });
        }
    }

    // 2) Slots referencing missing ideas
    const missingIdeasReferencedBySlots: Array<{
        slot: string;
        ideaId: string;
        boundAt: string;
        eventId: string;
    }> = [];

    for (const [slot, binding] of Object.entries(projection.slots)) {
        if (!projection.ideas[binding.ideaId]) {
            missingIdeasReferencedBySlots.push({
                slot,
                ideaId: binding.ideaId,
                boundAt: binding.ts,
                eventId: binding.eventId,
            });
        }
    }

    // 3) Duplicate anchors per idea (stable JSON match)
    const duplicateAnchors: Array<{
        ideaId: string;
        duplicates: number;
        totalAnchors: number;
    }> = [];

    for (const [ideaId, idea] of Object.entries(projection.ideas)) {
        const anchors = idea.anchors ?? [];
        if (anchors.length < 2) continue;

        const seen = new Set<string>();
        let dups = 0;

        for (const a of anchors) {
            const key = stableStringify(a);
            if (seen.has(key)) dups++;
            else seen.add(key);
        }

        if (dups > 0) {
            duplicateAnchors.push({
                ideaId,
                duplicates: dups,
                totalAnchors: anchors.length,
            });
        }
    }

    duplicateAnchors.sort((a, b) => b.duplicates - a.duplicates || b.totalAnchors - a.totalAnchors);

    const eventsSkipped = {
        invalidPayload: projection.metrics.eventsSkippedInvalidPayload,
        kindMismatch: projection.metrics.eventsSkippedKindPayloadMismatch,
        unknownIdea: projection.metrics.eventsSkippedUnknownIdea,
        legacyAnchors: projection.metrics.eventsWithLegacyAnchors,
    };

    // Suggested actions (deterministic, capped)
    const suggestedActions: Array<
        | { type: "revise_add_anchor"; ideaId: string; hint: string }
        | { type: "investigate_missing_idea"; slot: string; ideaId: string; hint: string }
        | { type: "dedupe_anchors"; ideaId: string; hint: string }
    > = [];

    for (const row of slotBoundNeedsProvenance.slice(0, maxIssues)) {
        suggestedActions.push({
            type: "revise_add_anchor",
            ideaId: row.ideaId,
            hint: `Attach provenance for slot "${row.slot}" (use POST /api/dct/idea-provenance).`,
        });
    }

    for (const row of missingIdeasReferencedBySlots.slice(0, maxIssues)) {
        suggestedActions.push({
            type: "investigate_missing_idea",
            slot: row.slot,
            ideaId: row.ideaId,
            hint: `Slot "${row.slot}" points to missing idea. Create it or re-bind slot.`,
        });
    }

    for (const row of duplicateAnchors.slice(0, maxIssues)) {
        suggestedActions.push({
            type: "dedupe_anchors",
            ideaId: row.ideaId,
            hint: "Idea has duplicate anchors. Consider projection-side dedupe or revise workflow.",
        });
    }

    // Severity logic:
    // - FAIL: governance blockers / corrupted stream
    // - WARN: not blocking, but should be cleaned up
    const fail =
        slotBoundNeedsProvenance.length > 0 ||
        missingIdeasReferencedBySlots.length > 0 ||
        eventsSkipped.invalidPayload > 0 ||
        eventsSkipped.kindMismatch > 0;

    const warn =
        !fail &&
        (eventsSkipped.unknownIdea > 0 ||
            eventsSkipped.legacyAnchors > 0 ||
            duplicateAnchors.length > 0);

    const severity = fail ? "fail" : warn ? "warn" : "pass";

    return NextResponse.json({
        ok: true,
        route: "dct/quality",
        routeVersion: ROUTE_VERSION,
        nodeEnv: process.env.NODE_ENV,
        ms: Date.now() - t0,
        meta: {
            take,
            maxIssues,
            totalIdeas: projection.metrics.totalIdeas,
            activeIdeasCount: projection.metrics.activeIdeasCount,
            operatingIdeasCount: projection.metrics.operatingIdeasCount,
            slotCount: projection.metrics.slotCount,
            edgeCount: projection.metrics.edgeCount,
            eventsProcessed: projection.metrics.eventsProcessed,
        },
        quality: {
            pass: !fail,
            severity,
            counts: {
                slotBoundNeedsProvenance: slotBoundNeedsProvenance.length,
                missingIdeasReferencedBySlots: missingIdeasReferencedBySlots.length,
                duplicateAnchors: duplicateAnchors.length,
                skippedInvalidPayload: eventsSkipped.invalidPayload,
                skippedKindMismatch: eventsSkipped.kindMismatch,
                skippedUnknownIdea: eventsSkipped.unknownIdea,
                eventsWithLegacyAnchors: eventsSkipped.legacyAnchors,
            },
        },
        issues: {
            slotBoundNeedsProvenance: slotBoundNeedsProvenance.slice(0, maxIssues),
            missingIdeasReferencedBySlots: missingIdeasReferencedBySlots.slice(0, maxIssues),
            duplicateAnchors: duplicateAnchors.slice(0, maxIssues),
            eventsSkipped,
        },
        suggestedActions: suggestedActions.slice(0, maxIssues),
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

// stable stringify (for deterministic duplicate detection)
function stableStringify(value: unknown): string {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",")}}`;
}

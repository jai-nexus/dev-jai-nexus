// portal/src/lib/dctProjection.ts
//
// Deterministic Concept Tracking — Pure Projection
//
// applyDct(events) -> DctProjection
//
// INVARIANT: given identical events[], output is identical on every run.
// No randomness, no Date.now(), no side effects.
//
// Hardening guarantees:
// - kind ↔ payload.type must match; mismatch → skip + count
// - Switch on payload.type (not event.kind) — no unsafe casts
// - NaN timestamps sort to epoch 0 (deterministic, never unstable)
// - operatingSet = unique ideas referenced by slot bindings
// - activeIdeas = ideas with status active|promoted (informational)
// - Quality counters for extraction diagnostics
//

import {
    DCT_KIND_PREFIX,
    DctPayloadSchema,
    validateAnchorStrict,
    type DctAnchor,
    type DctIdea,
    type DctProjection,
} from "@/lib/contracts/dctV01";

// ─────────────────────────────────────────────────────────────────────────────
// Input shape — minimal subset of SotEvent needed for projection
// ─────────────────────────────────────────────────────────────────────────────

export type DctEventInput = {
    eventId: string;
    ts: Date | string;
    kind: string;
    source: string;
    summary?: string | null;
    payload?: unknown;
    nhId?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic sort: (ts ASC, eventId ASC)
// NaN timestamps → 0 to prevent unstable ordering
// ─────────────────────────────────────────────────────────────────────────────

function toEpoch(ts: Date | string): number {
    if (ts instanceof Date) {
        const t = ts.getTime();
        return Number.isNaN(t) ? 0 : t;
    }
    const t = new Date(ts).getTime();
    return Number.isNaN(t) ? 0 : t;
}

function deterministicSort(events: DctEventInput[]): DctEventInput[] {
    return [...events].sort((a, b) => {
        const tsDiff = toEpoch(a.ts) - toEpoch(b.ts);
        if (tsDiff !== 0) return tsDiff;
        return a.eventId.localeCompare(b.eventId);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function uniqStrings(arr: string[]): string[] {
    return Array.from(new Set(arr));
}

function removeTag(tags: string[], tag: string): string[] {
    return tags.filter((t) => t !== tag);
}

function rangeKey(r?: { start: number; end: number }): string {
    return r ? `${r.start}-${r.end}` : "";
}

function anchorKey(a: DctAnchor): string {
    // Stable key, no JSON.stringify ordering dependence
    return [
        a.type,
        a.chatId ?? "",
        a.chatExternalId ?? "",
        a.lineNumber ?? "",
        rangeKey(a.lineRange),
        a.filePath ?? "",
        rangeKey(a.fileLineRange),
        a.url ?? "",
        a.urlHash ?? "",
        a._legacy ? "legacy" : "",
    ].join("|");
}

function dedupeAnchors(anchors: DctAnchor[]): DctAnchor[] {
    const seen = new Set<string>();
    const out: DctAnchor[] = [];
    for (const a of anchors) {
        const k = anchorKey(a);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(a);
    }
    return out;
}

function edgeKey(e: {
    from: string;
    to: string;
    relation: string;
    confidence: number;
    anchor?: DctAnchor;
}): string {
    // Dedupe based on the assertion itself (including anchor); ts/eventId are evidence metadata.
    return [
        e.from,
        e.to,
        e.relation,
        e.confidence,
        e.anchor ? anchorKey(e.anchor) : "",
    ].join("|");
}

// ─────────────────────────────────────────────────────────────────────────────
// Core projection
// ─────────────────────────────────────────────────────────────────────────────

export function applyDct(events: DctEventInput[]): DctProjection {
    // 1. Filter to DCT events only
    const dctEvents = events.filter((e) => e.kind.startsWith(DCT_KIND_PREFIX));

    // 2. Deterministic sort
    const sorted = deterministicSort(dctEvents);

    // 3. Build mutable state
    const ideas = new Map<string, DctIdea>();
    const edges: DctProjection["edges"] = [];
    const slots = new Map<
        string,
        { ideaId: string; anchor?: DctAnchor; ts: string; eventId: string }
    >();

    // Edge dedupe (optional but useful for UI)
    const seenEdges = new Set<string>();

    // Quality counters
    let eventsProcessed = 0;
    let eventsSkippedInvalidPayload = 0;
    let eventsSkippedKindPayloadMismatch = 0;
    let eventsSkippedUnknownIdea = 0;
    let eventsWithLegacyAnchors = 0;

    // Helper: validate strict anchor and tag legacy
    function processAnchor(anchor?: DctAnchor): DctAnchor | undefined {
        if (!anchor) return undefined;
        const validStrict = validateAnchorStrict(anchor).strict;
        if (!validStrict) {
            // Tag legacy if mutable (it is from JSON payload so it should be safe to mutate/clone)
            return { ...anchor, _legacy: true };
        }
        return anchor;
    }

    // Canonical rule: if we have at least one anchor, we should not keep "needs-provenance"
    function normalizeNeedsProvenanceTags(tags: string[], anchors: DctAnchor[]): string[] {
        if (anchors.length > 0) return removeTag(tags, "needs-provenance");
        return tags;
    }

    for (const event of sorted) {
        const epoch = toEpoch(event.ts);
        const tsStr =
            epoch === 0
                ? "1970-01-01T00:00:00.000Z"
                : event.ts instanceof Date
                    ? event.ts.toISOString()
                    : String(event.ts);

        // Parse payload via discriminated union
        const parsed = DctPayloadSchema.safeParse(event.payload);
        if (!parsed.success) {
            eventsSkippedInvalidPayload++;
            if (process.env.NODE_ENV !== "production") {
                console.warn(
                    `[dctProjection] Skip ${event.eventId}: invalid payload — ${parsed.error.message}`
                );
            }
            continue;
        }

        const payload = parsed.data;

        // Kind ↔ payload.type consistency guard
        if (event.kind !== payload.type) {
            eventsSkippedKindPayloadMismatch++;
            if (process.env.NODE_ENV !== "production") {
                console.warn(
                    `[dctProjection] Skip ${event.eventId}: kind="${event.kind}" ≠ payload.type="${payload.type}"`
                );
            }
            continue;
        }

        // Tag anchors
        let hasLegacyAnchor = false;
        const processAnchorHelper = (a?: DctAnchor) => {
            const p = processAnchor(a);
            if (p?._legacy) hasLegacyAnchor = true;
            return p;
        };

        eventsProcessed++;

        // Switch on payload.type — no unsafe casts
        switch (payload.type) {
            case "dct.idea.create": {
                const anchor = processAnchorHelper(payload.anchor);
                const anchors = dedupeAnchors(anchor ? [anchor] : []);
                const tags = normalizeNeedsProvenanceTags(payload.tags ?? [], anchors);

                ideas.set(payload.ideaId, {
                    id: payload.ideaId,
                    text: payload.text,
                    type: payload.ideaType,
                    status: payload.status,
                    confidence: payload.confidence,
                    anchors,
                    tags,
                    nhId: payload.nhId,
                    createdAt: tsStr,
                    updatedAt: tsStr,
                });
                break;
            }

            case "dct.idea.revise": {
                const existing = ideas.get(payload.ideaId);
                if (!existing) {
                    eventsSkippedUnknownIdea++;
                    break;
                }

                const anchor = processAnchorHelper(payload.anchor);

                // Tags behavior:
                // - if payload.tags provided: union with existing (ergonomic for "add tag")
                // - else: keep existing
                const mergedTags =
                    payload.tags !== undefined
                        ? uniqStrings([...(existing.tags ?? []), ...payload.tags])
                        : existing.tags ?? [];

                const nextAnchors = anchor
                    ? dedupeAnchors([...existing.anchors, anchor])
                    : existing.anchors;

                const normalizedTags = normalizeNeedsProvenanceTags(mergedTags, nextAnchors);

                ideas.set(payload.ideaId, {
                    ...existing,
                    text: payload.text ?? existing.text,
                    type: payload.ideaType ?? existing.type,
                    confidence: payload.confidence ?? existing.confidence,
                    tags: normalizedTags,
                    anchors: nextAnchors,
                    updatedAt: tsStr,
                });
                break;
            }

            case "dct.idea.status": {
                const existing = ideas.get(payload.ideaId);
                if (!existing) {
                    eventsSkippedUnknownIdea++;
                    break;
                }

                const anchor = processAnchorHelper(payload.anchor);
                const nextAnchors = anchor
                    ? dedupeAnchors([...existing.anchors, anchor])
                    : existing.anchors;

                const normalizedTags = normalizeNeedsProvenanceTags(existing.tags ?? [], nextAnchors);

                ideas.set(payload.ideaId, {
                    ...existing,
                    status: payload.status,
                    tags: normalizedTags,
                    anchors: nextAnchors,
                    updatedAt: tsStr,
                });
                break;
            }

            case "dct.idea.edge": {
                const anchor = processAnchorHelper(payload.anchor);

                const candidate = {
                    from: payload.from,
                    to: payload.to,
                    relation: payload.relation,
                    confidence: payload.confidence,
                    anchor,
                };

                const k = edgeKey(candidate);
                if (!seenEdges.has(k)) {
                    seenEdges.add(k);
                    edges.push({
                        ...candidate,
                        ts: tsStr,
                        eventId: event.eventId,
                    });
                }
                break;
            }

            case "dct.slot.bind": {
                const anchor = processAnchorHelper(payload.anchor);
                slots.set(payload.slot, {
                    ideaId: payload.ideaId,
                    anchor,
                    ts: tsStr,
                    eventId: event.eventId,
                });
                break;
            }
        }

        if (hasLegacyAnchor) {
            eventsWithLegacyAnchors++;
        }
    }

    // 4. Derive active ideas: status active or promoted (informational)
    const activeIdeas = Array.from(ideas.values())
        .filter((i) => i.status === "active" || i.status === "promoted")
        .sort((a, b) => a.id.localeCompare(b.id));

    // 5. Derive operating set: unique ideas referenced by slot bindings
    const operatingIdeaIds = new Set<string>();
    for (const binding of slots.values()) {
        operatingIdeaIds.add(binding.ideaId);
    }
    const operatingSet = Array.from(operatingIdeaIds)
        .sort()
        .map((id) => ideas.get(id))
        .filter((idea): idea is DctIdea => idea !== undefined);

    // 6. Convert maps to plain objects (deterministic key order via sort)
    const ideasObj: Record<string, DctIdea> = {};
    for (const key of Array.from(ideas.keys()).sort()) {
        ideasObj[key] = ideas.get(key)!;
    }

    const slotsObj: DctProjection["slots"] = {};
    for (const key of Array.from(slots.keys()).sort()) {
        slotsObj[key] = slots.get(key)!;
    }

    return {
        ideas: ideasObj,
        edges, // deterministic: sorted events + stable dedupe
        slots: slotsObj,
        operatingSet,
        activeIdeas,
        metrics: {
            totalIdeas: ideas.size,
            activeIdeasCount: activeIdeas.length,
            operatingIdeasCount: operatingSet.length,
            edgeCount: edges.length,
            slotCount: slots.size,
            eventsProcessed,
            eventsSkippedInvalidPayload,
            eventsSkippedKindPayloadMismatch,
            eventsSkippedUnknownIdea,
            eventsWithLegacyAnchors,
        },
    };
}

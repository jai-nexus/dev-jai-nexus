// portal/src/lib/contracts/dctV01.ts
//
// DCT (Deterministic Concept Tracking) v0.1 — Contract Schemas
//
// Every type here is a pure data shape. No DB imports. No side effects.
// These types define the payload shapes stored inside SotEvent.payload
// when SotEvent.kind starts with "dct."
//

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// SoT Event Kinds (used as SotEvent.kind values)
// ─────────────────────────────────────────────────────────────────────────────

export const DCT_KINDS = {
    IDEA_CREATE: "dct.idea.create",
    IDEA_REVISE: "dct.idea.revise",
    IDEA_STATUS: "dct.idea.status",
    IDEA_EDGE: "dct.idea.edge",
    SLOT_BIND: "dct.slot.bind",
} as const;

export type DctKind = (typeof DCT_KINDS)[keyof typeof DCT_KINDS];

export const DCT_KIND_PREFIX = "dct.";

// ─────────────────────────────────────────────────────────────────────────────
// Anchor — pointer into evidence
//
// Legacy (loose): all anchor fields optional beyond `type`.
// Strict: discriminated union requiring minimum fields per type.
// Projection prefers strict; if only legacy passes, accepts but tags.
// ─────────────────────────────────────────────────────────────────────────────

/** Legacy (loose) anchor — accepts anything with a valid type. */
export const DctAnchorLooseSchema = z.object({
    type: z.enum(["chat", "file", "url"]),
    // Chat anchor
    chatId: z.number().optional(),
    chatExternalId: z.string().optional(),
    lineNumber: z.number().optional(),
    lineRange: z.object({ start: z.number(), end: z.number() }).optional(),
    // File anchor
    filePath: z.string().optional(),
    fileLineRange: z.object({ start: z.number(), end: z.number() }).optional(),
    // URL anchor
    url: z.string().optional(),
    urlHash: z.string().optional(),
    // Projection metadata (not in SoT payload generally)
    _legacy: z.boolean().optional(),
});

/** Strict chat anchor: requires chatId OR chatExternalId. */
const StrictChatAnchorSchema = z.object({
    type: z.literal("chat"),
    chatId: z.number().optional(),
    chatExternalId: z.string().optional(),
    lineNumber: z.number().optional(),
    lineRange: z.object({ start: z.number(), end: z.number() }).optional(),
    // these are unused for chat but included for structural compat
    filePath: z.string().optional(),
    fileLineRange: z.object({ start: z.number(), end: z.number() }).optional(),
    url: z.string().optional(),
    urlHash: z.string().optional(),
}).refine(
    (d) => d.chatId !== undefined || (d.chatExternalId !== undefined && d.chatExternalId !== ""),
    { message: "Chat anchor requires chatId or chatExternalId" }
);

/** Strict file anchor: requires filePath AND fileLineRange. */
const StrictFileAnchorSchema = z.object({
    type: z.literal("file"),
    filePath: z.string().min(1),
    fileLineRange: z.object({ start: z.number(), end: z.number() }),
    // unused for file
    chatId: z.number().optional(),
    chatExternalId: z.string().optional(),
    lineNumber: z.number().optional(),
    lineRange: z.object({ start: z.number(), end: z.number() }).optional(),
    url: z.string().optional(),
    urlHash: z.string().optional(),
});

/** Strict URL anchor: requires url. */
const StrictUrlAnchorSchema = z.object({
    type: z.literal("url"),
    url: z.string().min(1),
    urlHash: z.string().optional(),
    // unused for url
    chatId: z.number().optional(),
    chatExternalId: z.string().optional(),
    lineNumber: z.number().optional(),
    lineRange: z.object({ start: z.number(), end: z.number() }).optional(),
    filePath: z.string().optional(),
    fileLineRange: z.object({ start: z.number(), end: z.number() }).optional(),
});

/** Strict anchor — discriminated by type, validates required fields. */
export const DctAnchorStrictSchema = z.union([
    StrictChatAnchorSchema,
    StrictFileAnchorSchema,
    StrictUrlAnchorSchema,
]);

/**
 * Canonical anchor schema used in payloads.
 * Accepts loose input (backward compatible).
 */
export const DctAnchorSchema = DctAnchorLooseSchema;

export type DctAnchor = z.infer<typeof DctAnchorLooseSchema>;

/**
 * Validate an anchor strictly. Returns { strict: true } on pass,
 * { strict: false } on fallback to legacy.
 */
export function validateAnchorStrict(anchor: DctAnchor): { strict: boolean } {
    const result = DctAnchorStrictSchema.safeParse(anchor);
    return { strict: result.success };
}

// ─────────────────────────────────────────────────────────────────────────────
// Idea — canonical statement with provenance
// ─────────────────────────────────────────────────────────────────────────────

export const IdeaTypeEnum = z.enum([
    "decision",
    "definition",
    "goal",
    "plan",
    "rule",
    "observation",
]);
export type IdeaType = z.infer<typeof IdeaTypeEnum>;

export const IdeaStatusEnum = z.enum([
    "active",
    "superseded",
    "deprecated",
    "draft",
    "promoted",
]);
export type IdeaStatus = z.infer<typeof IdeaStatusEnum>;

export const DctIdeaSchema = z.object({
    id: z.string(), // stable ID (e.g. "idea-<hash>")
    text: z.string(),
    type: IdeaTypeEnum,
    status: IdeaStatusEnum,
    confidence: z.number().min(0).max(1),
    anchors: z.array(DctAnchorSchema),
    tags: z.array(z.string()).default([]),
    nhId: z.string().default(""),
    createdAt: z.string(), // ISO timestamp of first creation
    updatedAt: z.string(), // ISO timestamp of latest mutation
});

export type DctIdea = z.infer<typeof DctIdeaSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// IdeaEvent Payloads — one per SoT event kind
// ─────────────────────────────────────────────────────────────────────────────

export const IdeaCreatePayloadSchema = z.object({
    type: z.literal("dct.idea.create"),
    ideaId: z.string(),
    text: z.string(),
    ideaType: IdeaTypeEnum,
    status: IdeaStatusEnum.default("active"),
    confidence: z.number().min(0).max(1).default(0.7),
    anchor: DctAnchorSchema.optional(),
    tags: z.array(z.string()).default([]),
    nhId: z.string().default(""),
});

export type IdeaCreatePayload = z.infer<typeof IdeaCreatePayloadSchema>;

export const IdeaRevisePayloadSchema = z.object({
    type: z.literal("dct.idea.revise"),
    ideaId: z.string(),
    text: z.string().optional(),
    ideaType: IdeaTypeEnum.optional(),
    confidence: z.number().min(0).max(1).optional(),
    anchor: DctAnchorSchema.optional(),
    tags: z.array(z.string()).optional(),
});

export type IdeaRevisePayload = z.infer<typeof IdeaRevisePayloadSchema>;

export const IdeaStatusPayloadSchema = z.object({
    type: z.literal("dct.idea.status"),
    ideaId: z.string(),
    status: IdeaStatusEnum,
    anchor: DctAnchorSchema.optional(), // provenance for status change
});

export type IdeaStatusPayload = z.infer<typeof IdeaStatusPayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Edge — directional relationship between Ideas
// ─────────────────────────────────────────────────────────────────────────────

export const EdgeRelationEnum = z.enum([
    "SUPPORTS",
    "CONTRADICTS",
    "DEPENDS_ON",
    "DEFINES",
    "IMPLEMENTS",
]);
export type EdgeRelation = z.infer<typeof EdgeRelationEnum>;

export const IdeaEdgePayloadSchema = z.object({
    type: z.literal("dct.idea.edge"),
    from: z.string(), // ideaId
    to: z.string(), // ideaId
    relation: EdgeRelationEnum,
    confidence: z.number().min(0).max(1).default(0.8),
    anchor: DctAnchorSchema.optional(), // provenance for edge assertion
});

export type IdeaEdgePayload = z.infer<typeof IdeaEdgePayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// SlotBinding — named "current state" pointer
// ─────────────────────────────────────────────────────────────────────────────

export const SlotBindPayloadSchema = z.object({
    type: z.literal("dct.slot.bind"),
    slot: z.string(), // e.g. "definition.done", "plan.current", "goal.primary"
    ideaId: z.string(),
    anchor: DctAnchorSchema.optional(), // provenance for slot binding
});

export type SlotBindPayload = z.infer<typeof SlotBindPayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Union of all DCT payloads (for generic parsing)
// ─────────────────────────────────────────────────────────────────────────────

export const DctPayloadSchema = z.discriminatedUnion("type", [
    IdeaCreatePayloadSchema,
    IdeaRevisePayloadSchema,
    IdeaStatusPayloadSchema,
    IdeaEdgePayloadSchema,
    SlotBindPayloadSchema,
]);

export type DctPayload = z.infer<typeof DctPayloadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Projected State — output of applyDct()
// ─────────────────────────────────────────────────────────────────────────────

export type DctProjection = {
    ideas: Record<string, DctIdea>;
    edges: Array<{
        from: string;
        to: string;
        relation: EdgeRelation;
        confidence: number;
        anchor?: DctAnchor;
        ts: string;
        eventId: string;
    }>;
    slots: Record<
        string,
        { ideaId: string; anchor?: DctAnchor; ts: string; eventId: string }
    >;
    /** Ideas referenced by current slot bindings (the "truth" set). */
    operatingSet: DctIdea[];
    /** All ideas with status active or promoted (informational). */
    activeIdeas: DctIdea[];
    metrics: {
        totalIdeas: number;
        /** Count of ideas with active/promoted status. */
        activeIdeasCount: number;
        /** Count of unique ideas bound via slots. */
        operatingIdeasCount: number;
        edgeCount: number;
        slotCount: number;
        eventsProcessed: number;
        eventsSkippedInvalidPayload: number;
        eventsSkippedKindPayloadMismatch: number;
        eventsSkippedUnknownIdea: number;
        eventsWithLegacyAnchors: number;
    };
};

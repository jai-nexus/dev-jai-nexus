export type RequestedRole =
    | "ARCHITECT"
    | "BUILDER"
    | "VERIFIER"
    | "LIBRARIAN"
    | "OPERATOR";

export function sanitizeNhLike(input?: string): string | undefined {
    const raw = (input ?? "").trim();
    if (!raw) return undefined;
    if (!/^\d+(\.\d+)*$/.test(raw)) return undefined;
    return raw;
}

export function coerceStringArray(v: unknown): string[] {
    if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
    if (typeof v === "string") return [v];
    return [];
}

export function getAssigneeFromTags(tags: string[]): string | null {
    const hit = tags.find((t) => typeof t === "string" && t.startsWith("assignee:"));
    if (!hit) return null;
    const nh = hit.slice("assignee:".length).trim();
    return sanitizeNhLike(nh) ?? null;
}

export function buildInboxTags(assigneeNhId?: string | null): string[] {
    const tags: string[] = [];
    if (assigneeNhId) tags.push(`assignee:${assigneeNhId}`);
    return tags;
}

const MOTION_TAG_PREFIX = "motion:";

export function buildMotionTag(motionId: string): string {
    return `${MOTION_TAG_PREFIX}${motionId}`;
}

export function getMotionFromTags(tags: string[]): string | null {
    const hit = tags.find((t) => typeof t === "string" && t.startsWith(MOTION_TAG_PREFIX));
    if (!hit) return null;
    const motionId = hit.slice(MOTION_TAG_PREFIX.length).trim();
    return motionId || null;
}

export function deriveRequestedRoleFromAgentKey(agentKey?: string | null): RequestedRole | null {
    const raw = String(agentKey ?? "").toUpperCase();
    if (!raw) return null;
    if (raw.includes("ARCHITECT")) return "ARCHITECT";
    if (raw.includes("BUILDER")) return "BUILDER";
    if (raw.includes("VERIFIER")) return "VERIFIER";
    if (raw.includes("LIBRARIAN")) return "LIBRARIAN";
    if (raw.includes("OPERATOR")) return "OPERATOR";
    return null;
}

export function compactText(input: string | null | undefined, max = 160): string {
    const raw = String(input ?? "").replace(/\s+/g, " ").trim();
    if (!raw) return "—";
    return raw.length > max ? `${raw.slice(0, max - 1)}…` : raw;
}

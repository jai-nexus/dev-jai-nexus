// portal/src/lib/dctSlots.ts
export const DCT_CANONICAL_SLOTS = [
    "goal.primary",
    "plan.current",
    "dod.current",
    "policy.prisma-orm",
    "policy.role-guardrails",
    "policy.sot-envelope",
    "architecture.hosting",
    "architecture.auth",
    "ops.deploy",
    "ops.ci",
    "repo.dev-jai-nexus.health",
    "blocker.current",
] as const;

export type DctCanonicalSlot = (typeof DCT_CANONICAL_SLOTS)[number];

// allow canonical + freeform, but enforce shape
export function isValidDctSlot(slot: string): boolean {
    const s = (slot ?? "").trim();
    if (!s) return false;
    if (s.length > 80) return false;
    // dot-separated tokens, lowercase-ish, digits and hyphens ok
    return /^[a-z0-9]+([.-][a-z0-9]+)*$/.test(s);
}

export function normalizeDctSlot(slot: string): string {
    return (slot ?? "").trim();
}

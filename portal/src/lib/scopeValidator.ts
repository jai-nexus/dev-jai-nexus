/**
 * scopeValidator.ts
 * portal/src/lib/scopeValidator.ts
 *
 * Fix: strip any "org/" prefix on BOTH sides before comparing.
 * agency.yaml stays as-is (bare names are intentional — they're portable).
 */

import { getAgentByNhId } from "./agencyConfig";

/**
 * Strip an optional "org/" prefix so we always compare bare repo names.
 * Also trims + lowercases to avoid casing/whitespace mismatch.
 *   "jai-nexus/dev-jai-nexus"  →  "dev-jai-nexus"
 *   "dev-jai-nexus"            →  "dev-jai-nexus"
 */
function bareRepo(ref: string): string {
    const s = String(ref ?? "").trim();
    const slash = s.lastIndexOf("/");
    const bare = slash === -1 ? s : s.slice(slash + 1);
    return bare.toLowerCase();
}

export type ScopeValidationResult =
    | { valid: true }
    | {
        valid: false;
        error: string;
        invalidRepos: string[]; // repos that failed (as submitted, not normalised)
        allowedScope: string[]; // bare names from agency.yaml (as declared)
        agent: { nh_id: string; agent_key: string; label: string };
    };

export function validateReposAgainstAgentScope(
    agentNhId: string,
    repos: string[]
): ScopeValidationResult {
    const agent = getAgentByNhId(agentNhId);

    if (!agent) {
        return {
            valid: false,
            error: `Agent not found: ${agentNhId}`,
            invalidRepos: repos,
            allowedScope: [],
            agent: { nh_id: agentNhId, agent_key: "", label: "Unknown" },
        };
    }

    const scopeList = Array.isArray(agent.scope) ? agent.scope : [];
    const allowedSet = new Set(scopeList.map(bareRepo));

    const invalidRepos = (repos ?? []).filter((r) => !allowedSet.has(bareRepo(r)));

    if (invalidRepos.length === 0) return { valid: true };

    return {
        valid: false,
        error: `Repos outside agent scope: ${invalidRepos.join(", ")}`,
        invalidRepos,
        allowedScope: scopeList, // as declared in YAML
        agent: {
            nh_id: agent.nh_id,
            agent_key: agent.agent_key ?? "",
            label: agent.label,
        },
    };
}

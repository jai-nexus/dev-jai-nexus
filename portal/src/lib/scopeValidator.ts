/**
 * scopeValidator.ts
 * portal/src/lib/scopeValidator.ts
 *
 * Goal:
 * - Treat repo scope entries canonically.
 * - Allow these to compare equal:
 *   - "repo:dev-jai-nexus"
 *   - "dev-jai-nexus"
 *   - "jai-nexus/dev-jai-nexus"
 * - Ignore non-repo scope entries such as:
 *   - "paths:..."
 *   - "deny:..."
 *   - "actions:..."
 */

import { getAgentByNhId } from "./agencyConfig";

function normalizeRepoRef(input: string): string {
    let s = String(input ?? "").trim().toLowerCase();
    if (!s) return "";

    if (s.startsWith("repo:")) {
        s = s.slice("repo:".length).trim();
    }

    const slash = s.lastIndexOf("/");
    if (slash !== -1) {
        s = s.slice(slash + 1);
    }

    return s.trim();
}

function extractRepoScopeEntries(scope: unknown): string[] {
    if (!Array.isArray(scope)) return [];

    return scope
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .filter((entry) => {
            const lowered = entry.toLowerCase();
            return lowered.startsWith("repo:") || !lowered.includes(":");
        });
}

export type ScopeValidationResult =
    | { valid: true }
    | {
        valid: false;
        error: string;
        invalidRepos: string[];
        allowedScope: string[];
        agent: { nh_id: string; agent_key: string; label: string };
    };

export function validateReposAgainstAgentScope(
    agentNhId: string,
    repos: string[],
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

    const repoScopeEntries = extractRepoScopeEntries(agent.scope);
    const allowedSet = new Set(
        repoScopeEntries
            .map((entry) => normalizeRepoRef(entry))
            .filter(Boolean),
    );

    const invalidRepos = (repos ?? []).filter((repo) => {
        const normalized = normalizeRepoRef(repo);
        if (!normalized) return true;
        return !allowedSet.has(normalized);
    });

    if (invalidRepos.length === 0) {
        return { valid: true };
    }

    return {
        valid: false,
        error: `Repos outside agent scope: ${invalidRepos.join(", ")}`,
        invalidRepos,
        allowedScope: repoScopeEntries,
        agent: {
            nh_id: agent.nh_id,
            agent_key: agent.agent_key ?? "",
            label: agent.label,
        },
    };
}

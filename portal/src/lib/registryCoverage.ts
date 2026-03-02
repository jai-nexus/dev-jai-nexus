// portal/src/lib/registryCoverage.ts
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export type CRL = 0 | 1 | 2 | 3;

export type WildernessReason =
    | "missing_repocard"
    | "missing_dispatch"
    | "dispatch_present_but_repocard_missing"
    | "yaml_parse_error"
    | "repos_config_missing";

export interface WildernessItem {
    repo_id: string;
    org_repo: string;
    wave: number | null;
    status?: string | null;
    reasons: WildernessReason[];
}

export interface CoverageResult {
    total: number;
    crl0: number;
    crl1: number;
    crl2: number;
    crl3: number;
    wave_assigned: number;
    wave_unassigned: number;
    frozen_or_deprecated: number;
    wilderness: WildernessItem[];
}

type ReposYaml = {
    schema_version?: number | string;
    repos?: Array<{
        nh_id?: string;
        repo: string; // e.g. "jai-nexus/dev-jai-nexus" or "jai-nexus"
        status?: string;
        wave?: number | null;
        notes?: string;
    }>;
};

function repoIdFromOrgRepo(orgRepo: string): string {
    // "jai-nexus/dev-jai-nexus" -> "dev-jai-nexus"
    // "jai-nexus" -> "jai-nexus"
    const parts = orgRepo.split("/").filter(Boolean);
    return parts.length >= 2 ? parts[parts.length - 1] : orgRepo;
}

async function listYamlBasenames(dirAbs: string): Promise<Set<string>> {
    try {
        const entries = await fs.readdir(dirAbs, { withFileTypes: true });
        const out = new Set<string>();
        for (const e of entries) {
            if (!e.isFile()) continue;
            const name = e.name;
            if (!name.toLowerCase().endsWith(".yaml") && !name.toLowerCase().endsWith(".yml")) continue;
            out.add(name.replace(/\.(yaml|yml)$/i, ""));
        }
        return out;
    } catch {
        return new Set<string>();
    }
}

function stableSortWilderness(items: WildernessItem[]): WildernessItem[] {
    const severity = (it: WildernessItem) => {
        // more severe first
        if (it.reasons.includes("missing_repocard")) return 0;
        if (it.reasons.includes("dispatch_present_but_repocard_missing")) return 1;
        if (it.reasons.includes("missing_dispatch")) return 2;
        return 3;
    };
    return items
        .slice()
        .sort((a, b) => {
            const sa = severity(a);
            const sb = severity(b);
            if (sa !== sb) return sa - sb;

            // unassigned waves earlier (more “wilderness”)
            const wa = a.wave ?? 999;
            const wb = b.wave ?? 999;
            if (wa !== wb) return wa - wb;

            return a.repo_id.localeCompare(b.repo_id);
        });
}

function isFrozenOrDeprecated(status?: string, notes?: string): boolean {
    const s = (status ?? "").toLowerCase();
    if (s === "frozen") return true;
    const n = (notes ?? "").toLowerCase();
    return n.includes("deprecated");
}

export async function computeRegistryCoverage(): Promise<CoverageResult> {
    // When running via `pnpm -C portal dev`, cwd is usually portal/
    const portalRoot = process.cwd();

    const reposPath = path.join(portalRoot, "config", "repos.yaml");
    const repoCardsDir = path.join(portalRoot, "config", "repo-cards");
    const dispatchDir = path.join(portalRoot, "config", "dispatch");

    let reposYamlText: string;
    try {
        reposYamlText = await fs.readFile(reposPath, "utf8");
    } catch {
        return {
            total: 0,
            crl0: 0,
            crl1: 0,
            crl2: 0,
            crl3: 0,
            wave_assigned: 0,
            wave_unassigned: 0,
            frozen_or_deprecated: 0,
            wilderness: [
                {
                    repo_id: "UNKNOWN",
                    org_repo: "UNKNOWN",
                    wave: null,
                    status: null,
                    reasons: ["repos_config_missing"],
                },
            ],
        };
    }

    let parsed: ReposYaml;
    try {
        parsed = (yaml.load(reposYamlText) as ReposYaml) ?? {};
    } catch {
        return {
            total: 0,
            crl0: 0,
            crl1: 0,
            crl2: 0,
            crl3: 0,
            wave_assigned: 0,
            wave_unassigned: 0,
            frozen_or_deprecated: 0,
            wilderness: [
                {
                    repo_id: "UNKNOWN",
                    org_repo: "UNKNOWN",
                    wave: null,
                    status: null,
                    reasons: ["yaml_parse_error"],
                },
            ],
        };
    }

    const repos = Array.isArray(parsed.repos) ? parsed.repos : [];
    const repoCardSet = await listYamlBasenames(repoCardsDir);
    const dispatchSet = await listYamlBasenames(dispatchDir);

    let crl0 = 0,
        crl1 = 0,
        crl2 = 0,
        crl3 = 0;

    let waveAssigned = 0;
    let waveUnassigned = 0;
    let frozenOrDeprecated = 0;

    const wilderness: WildernessItem[] = [];

    // Deterministic ordering: compute everything in stable repo order
    const stableRepos = repos.slice().sort((a, b) => repoIdFromOrgRepo(a.repo).localeCompare(repoIdFromOrgRepo(b.repo)));

    for (const r of stableRepos) {
        const orgRepo = r.repo;
        const repoId = repoIdFromOrgRepo(orgRepo);

        const wave = typeof r.wave === "number" ? r.wave : null;
        if (wave === null) waveUnassigned++;
        else waveAssigned++;

        if (isFrozenOrDeprecated(r.status, r.notes)) frozenOrDeprecated++;

        const hasRepoCard = repoCardSet.has(repoId);
        const hasDispatch = dispatchSet.has(repoId);

        // CRL rules:
        // - CRL-1 requires RepoCard
        // - CRL-2 requires both RepoCard + DispatchConfig
        // - CRL-3 reserved for traceability later
        let crl: CRL = 0;
        const reasons: WildernessReason[] = [];

        if (hasRepoCard) crl = 1;
        if (hasDispatch && hasRepoCard) crl = 2;

        if (!hasRepoCard) reasons.push("missing_repocard");
        if (hasDispatch && !hasRepoCard) reasons.push("dispatch_present_but_repocard_missing");
        if (hasRepoCard && !hasDispatch) reasons.push("missing_dispatch");

        if (crl === 0) crl0++;
        else if (crl === 1) crl1++;
        else if (crl === 2) crl2++;
        else crl3++;

        if (reasons.length > 0) {
            wilderness.push({
                repo_id: repoId,
                org_repo: orgRepo,
                wave,
                status: r.status ?? null,
                reasons,
            });
        }
    }

    return {
        total: repos.length,
        crl0,
        crl1,
        crl2,
        crl3,
        wave_assigned: waveAssigned,
        wave_unassigned: waveUnassigned,
        frozen_or_deprecated: frozenOrDeprecated,
        wilderness: stableSortWilderness(wilderness),
    };
}

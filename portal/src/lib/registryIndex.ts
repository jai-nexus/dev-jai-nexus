// portal/src/lib/registryIndex.ts
import fs from "node:fs/promises";
import path from "node:path";

export type EngineType = "frontend" | "backend" | "helper";
export type HealthStatus = "PASS" | "FAIL" | "UNKNOWN" | string;

export interface HealthSnapshot {
    ts: string;
    status: HealthStatus;
}

/**
 * NOTE: These interfaces match the JSON your nexus-core generator emits:
 * - domains.index.json: { version, generated_at, domains: { [domain]: { engine, auto_ratify } } }
 * - repos.index.json:   { version, generated_at, repos:   { [repo]:   { primary_domain, secondary_domains, engine, external, apply } } }
 * - agents.index.json:  { version, generated_at, global, by_domain, by_repo }
 */

export interface DomainsIndex {
    version: string;
    generated_at: string;
    domains: Record<
        string,
        {
            engine: EngineType;
            auto_ratify: boolean | Record<string, unknown>;
        }
    >;
}

export interface ReposIndexEntry {
    primary_domain: string;
    secondary_domains: string[];
    engine: EngineType;
    external: boolean;
    apply: boolean;
}

export interface ReposIndex {
    version: string;
    generated_at: string;
    repos: Record<string, ReposIndexEntry>;
}

export interface DomainCouncilEntry {
    engine: EngineType;
    auto_ratify: boolean | Record<string, unknown>;
    proposer?: string;
    executor?: string;
    challenger?: string;
    arbiter?: string;
}

export interface RepoCouncilEntry extends ReposIndexEntry {
    proposer: string;
    executor: string;
    challenger: string;
    arbiter: string;
}

export interface AgentsIndex {
    version: string;
    generated_at: string;
    global: Record<string, string>;
    by_domain: Record<string, DomainCouncilEntry>;
    by_repo: Record<string, RepoCouncilEntry>;
}

export interface RegistryIndexes {
    agents: AgentsIndex;
    repos: ReposIndex;
    domains: DomainsIndex;
    meta: {
        source_root: string;
        files: {
            agents: string;
            repos: string;
            domains: string;
        };
    };
}

export class RegistryIndexError extends Error {
    source_root: string;
    missing?: string[];
    inner?: string;

    constructor(opts: { message: string; source_root: string; missing?: string[]; inner?: string }) {
        super(opts.message);
        this.name = "RegistryIndexError";
        this.source_root = opts.source_root;
        this.missing = opts.missing;
        this.inner = opts.inner;
    }
}

function asErrorMessage(e: unknown): string {
    return e instanceof Error ? e.message : String(e);
}

async function fileExists(p: string): Promise<boolean> {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

function parseJson<T>(raw: string, label: string, sourceRoot: string): T {
    try {
        return JSON.parse(raw) as T;
    } catch (e: unknown) {
        throw new RegistryIndexError({
            message: `Registry index JSON parse failed (${label})`,
            source_root: sourceRoot,
            inner: asErrorMessage(e),
        });
    }
}

function assertPlainObject(x: unknown, label: string, sourceRoot: string): asserts x is Record<string, unknown> {
    if (!x || typeof x !== "object" || Array.isArray(x)) {
        throw new RegistryIndexError({
            message: `Registry index shape invalid (${label}): expected object`,
            source_root: sourceRoot,
        });
    }
}

function assertHasKey(obj: Record<string, unknown>, key: string, label: string, sourceRoot: string) {
    if (!(key in obj)) {
        throw new RegistryIndexError({
            message: `Registry index missing expected key "${key}" (${label})`,
            source_root: sourceRoot,
        });
    }
}

/**
 * Return the dev-jai-nexus repo root even if process.cwd() is:
 * - dev-jai-nexus/portal  (common when running Next)
 * - dev-jai-nexus         (sometimes)
 */
export function getDevRepoRoot(): string {
    const cwd = process.cwd();
    if (path.basename(cwd).toLowerCase() === "portal") return path.resolve(cwd, "..");
    return cwd;
}

/**
 * Expected: <dev-jai-nexus-root>/workspace/jai-nexus/nexus-core/registry
 *
 * IMPORTANT: This path assumes the portal is running from dev-jai-nexus,
 * and nexus-core is present at dev-jai-nexus/workspace/jai-nexus/nexus-core.
 */
export function getRegistryRoot(): string {
    const repoRoot = getDevRepoRoot();
    return path.resolve(repoRoot, "workspace", "jai-nexus", "nexus-core", "registry");
}

/**
 * Loads:
 * - agents.index.json
 * - repos.index.json
 * - domains.index.json
 *
 * Throws RegistryIndexError with source_root + missing filenames.
 */
export async function loadRegistryIndexes(): Promise<RegistryIndexes> {
    const root = getRegistryRoot();

    const agentsPath = path.join(root, "agents.index.json");
    const reposPath = path.join(root, "repos.index.json");
    const domainsPath = path.join(root, "domains.index.json");

    const [hasAgents, hasRepos, hasDomains] = await Promise.all([
        fileExists(agentsPath),
        fileExists(reposPath),
        fileExists(domainsPath),
    ]);

    const missing: string[] = [];
    if (!hasAgents) missing.push("agents.index.json");
    if (!hasRepos) missing.push("repos.index.json");
    if (!hasDomains) missing.push("domains.index.json");

    if (missing.length) {
        throw new RegistryIndexError({
            message: `Registry files missing at ${root}`,
            source_root: root,
            missing,
        });
    }

    try {
        const [agentsRaw, reposRaw, domainsRaw] = await Promise.all([
            fs.readFile(agentsPath, "utf8"),
            fs.readFile(reposPath, "utf8"),
            fs.readFile(domainsPath, "utf8"),
        ]);

        const agents = parseJson<AgentsIndex>(agentsRaw, "agents.index.json", root);
        const repos = parseJson<ReposIndex>(reposRaw, "repos.index.json", root);
        const domains = parseJson<DomainsIndex>(domainsRaw, "domains.index.json", root);

        // Sanity checks: top-level objects
        assertPlainObject(agents, "agents.index.json", root);
        assertPlainObject(repos, "repos.index.json", root);
        assertPlainObject(domains, "domains.index.json", root);

        // Required keys (aligns with generator output)
        assertHasKey(agents as unknown as Record<string, unknown>, "by_repo", "agents.index.json", root);
        assertHasKey(agents as unknown as Record<string, unknown>, "by_domain", "agents.index.json", root);
        assertHasKey(agents as unknown as Record<string, unknown>, "global", "agents.index.json", root);

        assertHasKey(repos as unknown as Record<string, unknown>, "repos", "repos.index.json", root);
        assertHasKey(domains as unknown as Record<string, unknown>, "domains", "domains.index.json", root);

        // Ensure nested shapes are objects (prevents UI crashes)
        if (!agents.by_repo || typeof agents.by_repo !== "object") {
            throw new RegistryIndexError({
                message: `agents.index.json invalid: "by_repo" must be an object`,
                source_root: root,
            });
        }
        if (!repos.repos || typeof repos.repos !== "object") {
            throw new RegistryIndexError({
                message: `repos.index.json invalid: "repos" must be an object`,
                source_root: root,
            });
        }
        if (!domains.domains || typeof domains.domains !== "object") {
            throw new RegistryIndexError({
                message: `domains.index.json invalid: "domains" must be an object`,
                source_root: root,
            });
        }

        return {
            agents,
            repos,
            domains,
            meta: {
                source_root: root,
                files: { agents: agentsPath, repos: reposPath, domains: domainsPath },
            },
        };
    } catch (e: unknown) {
        if (e instanceof RegistryIndexError) throw e;
        throw new RegistryIndexError({
            message: `Registry files missing or corrupted at ${root}`,
            source_root: root,
            inner: asErrorMessage(e),
        });
    }
}

/**
 * Reads: portal/data/runs/health.snapshots.jsonl
 * - line-delimited JSON
 * - keeps LAST entry per repo_id
 * Returns empty object if file missing.
 */
export async function loadLatestHealthSnapshots(): Promise<Record<string, HealthSnapshot>> {
    const repoRoot = getDevRepoRoot();
    const snapshotsPath = path.resolve(repoRoot, "portal", "data", "runs", "health.snapshots.jsonl");

    const results: Record<string, HealthSnapshot> = {};

    let content = "";
    try {
        content = await fs.readFile(snapshotsPath, "utf8");
    } catch {
        return results;
    }

    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

    for (const line of lines) {
        try {
            const data = JSON.parse(line) as {
                repo_id?: unknown;
                ts?: unknown;
                status?: unknown;
            };

            const repoId = typeof data.repo_id === "string" ? data.repo_id : null;
            if (!repoId) continue;

            const ts = typeof data.ts === "string" ? data.ts : new Date().toISOString();
            const status = typeof data.status === "string" && data.status.length ? data.status : "UNKNOWN";

            results[repoId] = { ts, status };
        } catch {
            // ignore malformed lines
        }
    }

    return results;
}

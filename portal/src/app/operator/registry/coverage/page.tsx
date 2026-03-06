// portal/src/app/operator/registry/coverage/page.tsx
import { loadLatestHealthSnapshots, loadRegistryIndexes } from "@/lib/registryIndex";
import { listPanelsForCoverage } from "@/lib/panels/panelStore";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type EngineType = "frontend" | "backend" | "helper";

type RepoIndexEntry = {
    primary_domain: string;
    secondary_domains?: string[];
    engine: EngineType;
    external?: boolean;
    apply?: boolean;
};

type AgentRoles = "proposer" | "executor" | "challenger" | "arbiter";

type AgentsByRepoEntry = Record<AgentRoles, string> & {
    primary_domain: string;
    secondary_domains?: string[];
    engine: EngineType;
    external?: boolean;
    apply?: boolean;
};

type RegistryIndexes = {
    agents: {
        by_repo: Record<string, AgentsByRepoEntry>;
    };
    repos: {
        repos: Record<string, RepoIndexEntry>;
    };
    domains?: unknown;
};

function safeString(v: unknown, fallback = "—") {
    return typeof v === "string" && v.length > 0 ? v : fallback;
}

function safeBool(v: unknown) {
    return v === true;
}

function safeArrayOfString(v: unknown): string[] {
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

function formatIsoDay(ts?: string) {
    if (!ts) return "—";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toISOString().slice(0, 10); // YYYY-MM-DD (stable across server/client)
}

export default async function RegistryCoveragePage() {
    const [registryRaw, health, panels] = await Promise.all([
        loadRegistryIndexes().catch(() => null),
        loadLatestHealthSnapshots(),
        listPanelsForCoverage().catch(() => []),
    ]);

    if (!registryRaw) {
        return (
            <div className="p-8 text-red-400 bg-zinc-950 min-h-screen">
                <h1 className="text-xl font-bold mb-4">Registry Unavailable</h1>
                <p>Could not load registry index files from nexus-core. Ensure registry is generated.</p>
            </div>
        );
    }

    // ---- normalize shapes (handles minor API/loader variations)
    const registry = registryRaw as unknown as RegistryIndexes;

    // repos map can be:
    //  - registry.repos.repos (preferred: repos.index.json full object)
    //  - registry.repos (if loader returns inner map directly)
    const reposMap: Record<string, RepoIndexEntry> =
        (registry as any)?.repos?.repos ??
        ((registry as any)?.repos && typeof (registry as any).repos === "object" ? (registry as any).repos : null) ??
        {};

    // agents map can be:
    //  - registry.agents.by_repo (preferred: agents.index.json)
    //  - registry.agents (if loader returns inner object)
    const agentsByRepo: Record<string, AgentsByRepoEntry> =
        (registry as any)?.agents?.by_repo ??
        ((registry as any)?.agents && typeof (registry as any).agents === "object" ? (registry as any).agents : null) ??
        {};

    const repoIds = Object.keys(reposMap).sort();

    const panelsTotal = panels.length;
    const panelsCompleted = panels.filter((p) => p.completed).length;
    const panelsIncomplete = panels.filter((p) => !p.completed);

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-gray-100">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-sky-400">Workspace Coverage</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Consolidated view of agents, domains, health, and panel completion across all repos.
                    </p>
                </div>
                <div className="text-xs text-gray-500 bg-zinc-900 px-3 py-1 rounded border border-gray-800">
                    Source: nexus-core/registry
                </div>
            </div>

            {/* Panels Completion */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-4">
                    <div className="text-xs text-gray-500 mb-1">Panels discovered</div>
                    <div className="text-2xl font-bold text-gray-200 font-mono">{panelsTotal}</div>
                    <div className="text-xs text-gray-500 mt-2">
                        Scanned from <span className="font-mono">.nexus/motions/*/panels/*</span>
                    </div>
                </div>

                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-4">
                    <div className="text-xs text-gray-500 mb-1">Panels completed</div>
                    <div className="text-2xl font-bold text-emerald-300 font-mono">{panelsCompleted}</div>
                    <div className="text-xs text-gray-500 mt-2">
                        Completed = winner ≠ UNKNOWN AND evidence_plan.commands non-empty
                    </div>
                </div>

                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 p-4">
                    <div className="text-xs text-gray-500 mb-1">Incomplete panels</div>
                    <div className="text-2xl font-bold text-amber-300 font-mono">{panelsIncomplete.length}</div>
                    <div className="text-xs text-gray-500 mt-2">
                        <Link href="/operator/panels" className="text-sky-300 hover:underline">
                            Open panels index →
                        </Link>
                    </div>
                </div>
            </div>

            {panelsIncomplete.length ? (
                <div className="border border-zinc-800 rounded-lg bg-zinc-900/20 p-4 mb-6">
                    <div className="font-semibold text-gray-200 mb-2">Needs attention</div>
                    <div className="text-xs text-gray-500 mb-3">Showing up to 8 incomplete panels.</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {panelsIncomplete.slice(0, 8).map((p) => (
                            <Link
                                key={`${p.motion_id}:${p.panel_id}`}
                                href={p.href}
                                className="text-xs px-3 py-2 rounded border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/40"
                            >
                                <span className="font-mono text-gray-200">{p.motion_id}</span>{" "}
                                <span className="text-gray-500">/</span>{" "}
                                <span className="font-mono text-sky-300">{p.panel_id}</span>{" "}
                                <span className="text-gray-500">·</span>{" "}
                                <span className="font-mono text-gray-400">winner={p.winner}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Existing registry table */}
            {repoIds.length === 0 ? (
                <div className="p-6 border border-gray-800 rounded bg-zinc-900/30 text-gray-300">
                    Registry loaded, but no repos were found in the index.
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-900 text-gray-400 font-medium uppercase tracking-wider border-b border-gray-800">
                            <tr>
                                <th className="px-4 py-3">Repo</th>
                                <th className="px-4 py-3">Engine</th>
                                <th className="px-4 py-3">Primary Domain</th>
                                <th className="px-4 py-3">Secondary Domains</th>
                                <th className="px-4 py-3">Proposer</th>
                                <th className="px-4 py-3">Executor</th>
                                <th className="px-4 py-3">Challenger</th>
                                <th className="px-4 py-3">Arbiter</th>
                                <th className="px-4 py-3 text-center">Ext</th>
                                <th className="px-4 py-3 text-center">Apply</th>
                                <th className="px-4 py-3">Last Health</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-800">
                            {repoIds.map((repoId) => {
                                const repo = reposMap[repoId];
                                const byRepo = agentsByRepo[repoId];

                                // Prefer agents.index.json by_repo role mapping
                                const proposer = safeString(byRepo?.proposer);
                                const executor = safeString(byRepo?.executor);
                                const challenger = safeString(byRepo?.challenger);
                                const arbiter = safeString(byRepo?.arbiter);

                                const engine = safeString(repo?.engine);
                                const primaryDomain = safeString(repo?.primary_domain);
                                const secondaryDomains = safeArrayOfString(repo?.secondary_domains);

                                const external = safeBool(repo?.external ?? (byRepo as any)?.external);
                                const applyAllowed = safeBool(repo?.apply ?? (byRepo as any)?.apply);

                                const healthInfo = health[repoId];
                                const healthStatus = safeString(healthInfo?.status);
                                const statusColor =
                                    healthStatus === "PASS"
                                        ? "text-green-400"
                                        : healthStatus === "FAIL"
                                            ? "text-red-400"
                                            : "text-gray-500";

                                return (
                                    <tr key={repoId} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-200">{repoId}</td>

                                        <td className="px-4 py-3 text-gray-400">{engine}</td>

                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded bg-sky-900/30 text-sky-300 border border-sky-800/50">
                                                {primaryDomain}
                                            </span>
                                        </td>

                                        <td
                                            className="px-4 py-3 text-gray-500 max-w-[150px] truncate"
                                            title={secondaryDomains.join(", ")}
                                        >
                                            {secondaryDomains.length ? secondaryDomains.join(", ") : "—"}
                                        </td>

                                        <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{proposer}</td>
                                        <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{executor}</td>
                                        <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{challenger}</td>
                                        <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{arbiter}</td>

                                        <td className="px-4 py-3 text-center font-mono text-gray-500">{external ? "Y" : "N"}</td>
                                        <td className="px-4 py-3 text-center font-mono text-gray-500">{applyAllowed ? "Y" : "N"}</td>

                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${statusColor}`}>{healthStatus}</span>
                                                {healthInfo?.ts ? (
                                                    <span className="text-[10px] text-gray-600 truncate" suppressHydrationWarning>
                                                        {formatIsoDay(healthInfo.ts)}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// portal/src/app/operator/registry/coverage/page.tsx
import { loadLatestHealthSnapshots, loadRegistryIndexes } from "@/lib/registryIndex";

export const dynamic = "force-dynamic";

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

export default async function RegistryCoveragePage() {
    const [registryRaw, health] = await Promise.all([
        loadRegistryIndexes().catch(() => null),
        loadLatestHealthSnapshots(),
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

    return (
        <div className="p-8 bg-zinc-950 min-h-screen text-gray-100">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-sky-400">Workspace Coverage</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Consolidated view of agents, domains, and health across all repos.
                    </p>
                </div>
                <div className="text-xs text-gray-500 bg-zinc-900 px-3 py-1 rounded border border-gray-800">
                    Source: nexus-core/registry
                </div>
            </div>

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
                                                    <span className="text-[10px] text-gray-600 truncate">
                                                        {new Date(healthInfo.ts).toLocaleDateString()}
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

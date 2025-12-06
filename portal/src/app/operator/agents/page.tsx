// portal/src/app/operator/agents/page.tsx
export const runtime = "nodejs"
export const revalidate = 0

import {
  getAgencyConfig,
  type AgencyAgent,
  type DelegationRule,
} from "@/lib/agencyConfig"

export default function AgentsPage() {
  const agency = getAgencyConfig()

  const agents: AgencyAgent[] = [...agency.agents].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier
    return a.nh_id.localeCompare(b.nh_id)
  })

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">JAI NEXUS · Agency</h1>
        <p className="text-sm text-gray-400 mt-1">
          NH-based agent map for dev.jai.nexus and attached projects.
        </p>

        <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-gray-800 bg-zinc-950 px-4 py-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Owner
            </div>
            <div className="text-sm font-medium">
              {agency.owner.name}{" "}
              <span className="text-gray-500">
                ({agency.owner.handle}, root {agency.owner.nh_root})
              </span>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-sky-900/40 px-2 py-1 text-[11px] font-medium text-sky-200">
            schema v{agency.schema_version.toFixed(1)}
          </span>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">Agents</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-800 bg-zinc-950">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-zinc-950 border-b border-gray-800 text-left">
              <tr>
                <th className="py-2 px-3 text-xs text-gray-400">NH</th>
                <th className="py-2 px-3 text-xs text-gray-400">Agent</th>
                <th className="py-2 px-3 text-xs text-gray-400">Tier</th>
                <th className="py-2 px-3 text-xs text-gray-400">Role</th>
                <th className="py-2 px-3 text-xs text-gray-400">Scope</th>
                <th className="py-2 px-3 text-xs text-gray-400">
                  Delegates to
                </th>
                <th className="py-2 px-3 text-xs text-gray-400">
                  GitHub labels
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent: AgencyAgent) => (
                <tr
                  key={agent.nh_id}
                  className="border-b border-gray-900 hover:bg-zinc-900/60"
                >
                  <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-300">
                    {agent.nh_id}
                    {agent.parent_nh_id && (
                      <span className="ml-1 text-[10px] text-gray-500">
                        (parent {agent.parent_nh_id})
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium">{agent.label}</span>
                      <span className="text-xs text-gray-500">{agent.id}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap text-xs">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                        agent.tier === 0
                          ? "bg-emerald-900/60 text-emerald-200"
                          : agent.tier === 1
                          ? "bg-sky-900/60 text-sky-200"
                          : "bg-purple-900/60 text-purple-200"
                      }`}
                    >
                      Tier {agent.tier}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs max-w-xs">{agent.role}</td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {agent.scope.join(", ")}
                  </td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {agent.delegates_to.length > 0
                      ? agent.delegates_to.join(", ")
                      : "—"}
                  </td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">
                    {agent.github_labels.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Delegation rules</h2>
        <div className="space-y-3">
          {agency.delegation_rules.map((rule: DelegationRule) => (
            <div
              key={rule.id}
              className="rounded-lg border border-gray-800 bg-zinc-950 p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">
                  Rule: {rule.id}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {rule.description.trim()}
              </p>
              <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                {rule.constraints.map((c: string, idx: number) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

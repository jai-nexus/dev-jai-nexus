export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";
import { getAgentConfigurationRegistry } from "@/lib/agents/agentRegistry";
import type {
  AgentRegistryAgent,
  AgentRegistryCapabilityKey,
  AgentRegistryCapabilityState,
  AgentRegistryIdentity,
  AgentRegistryScopeKey,
} from "@/lib/agents/types";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import { getFullRepoRegistry } from "@/lib/controlPlane/repoSurfaceModel";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-gray-100">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-100">{value}</div>
      <p className="mt-2 text-sm text-gray-400">{detail}</p>
    </div>
  );
}

function ToneBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "sky" | "amber" | "emerald" | "rose" | "slate";
}) {
  const toneClass =
    tone === "sky"
      ? "border-sky-800 bg-sky-950 text-sky-200"
      : tone === "amber"
        ? "border-amber-800 bg-amber-950 text-amber-200"
        : tone === "emerald"
          ? "border-emerald-800 bg-emerald-950 text-emerald-200"
          : tone === "rose"
            ? "border-rose-800 bg-rose-950 text-rose-200"
            : "border-gray-800 bg-zinc-900 text-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function capabilityTone(
  state: AgentRegistryCapabilityState,
): "emerald" | "amber" | "rose" {
  if (state === "enabled") return "emerald";
  if (state === "preview_only") return "amber";
  return "rose";
}

function capabilityLabel(key: AgentRegistryCapabilityKey): string {
  if (key === "view_only") return "view only";
  if (key === "draft_plan") return "draft plan";
  if (key === "draft_files_preview") return "draft files";
  if (key === "branch_write") return "branch write";
  if (key === "propose_pr") return "propose PR";
  return "execute runtime";
}

function scopeLabel(scope: AgentRegistryScopeKey): string {
  return scope;
}

function IdentityCard({ identity }: { identity: AgentRegistryIdentity }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-100">{identity.label}</h3>
        <ToneBadge tone={identity.kind === "shared_alias" ? "amber" : "sky"}>
          {identity.kind === "shared_alias" ? "shared alias" : "human operator"}
        </ToneBadge>
        <ToneBadge tone="rose">execution disabled</ToneBadge>
      </div>
      <div className="mt-2 font-mono text-xs text-gray-400">
        {identity.handle}
      </div>
      <p className="mt-3 text-sm text-gray-300">{identity.summary}</p>
      <ul className="mt-3 space-y-1 text-xs text-gray-400">
        {identity.notes.map((note) => (
          <li key={note}>- {note}</li>
        ))}
      </ul>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentRegistryAgent }) {
  const registry = getAgentConfigurationRegistry();
  const scopeEntries = registry.configured_scopes.filter((scope) =>
    agent.configured_scope_keys.includes(scope.key),
  );

  return (
    <div
      id={agent.key}
      className="rounded-xl border border-gray-800 bg-zinc-950 p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-100">{agent.label}</h3>
        <ToneBadge tone="slate">named JAI agent</ToneBadge>
        <ToneBadge tone="rose">execution disabled</ToneBadge>
      </div>
      <div className="mt-2 font-mono text-xs text-gray-400">{agent.handle}</div>
      <p className="mt-3 text-sm text-gray-300">{agent.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {agent.configured_scope_keys.map((scope) => (
          <ToneBadge key={scope} tone="sky">
            {scope}
          </ToneBadge>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-gray-800 bg-black/30 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          Configured scope subset targets
        </div>
        <ul className="mt-2 space-y-2 text-xs text-gray-300">
          {scopeEntries.map((scope) => (
            <li key={`${agent.key}-${scope.key}`}>
              <div className="font-medium text-gray-100">{scope.key}</div>
              <div className="font-mono text-[11px] text-sky-200">
                {scope.repo_full_name}
              </div>
              <div className="text-gray-400">
                surfaces: {scope.surface_labels.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-gray-400">
        {agent.notes.map((note) => (
          <li key={note}>- {note}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AgentsPage() {
  const registry = getAgentConfigurationRegistry();
  const fullRepoRegistry = getFullRepoRegistry();
  const authorityPosture = getControlPlaneAuthorityPosture();

  return (
    <main className="min-h-screen bg-black px-8 py-10 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">JAI NEXUS - Agent Registry</h1>
            <ToneBadge tone="sky">configuration only</ToneBadge>
            <ToneBadge tone="rose">execution disabled in v0</ToneBadge>
          </div>
          <p className="max-w-3xl text-sm text-gray-400">
            Read-only operator registry for human operator identities, shared
            alias posture, and named JAI agent configurations before any live
            execution is enabled.
          </p>
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4 text-sm text-gray-300">
            <p>
              This page shows the configured agent scope subset, not the full
              repo registry. Full repos live in <span className="font-mono">/repos</span>,
              while agent scope keys resolve to a bounded subset of repos and
              surfaces reviewed here.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Named agents"
            value={String(registry.named_agents.length)}
            detail="Separate future JAI identities are visible here before any execution enablement."
          />
          <SummaryCard
            label="Human and alias identities"
            value={String(
              registry.human_operators.length + registry.shared_aliases.length,
            )}
            detail="Human operator and shared alias behavior are explicitly separated from named agents."
          />
          <SummaryCard
            label="Configured scope subset"
            value={String(registry.configured_scope_keys.length)}
            detail="These scope keys are a configured subset, not the full repo registry."
          />
          <SummaryCard
            label="Full repo registry"
            value={String(fullRepoRegistry.length)}
            detail="Actual repos are modeled separately and surfaced on /repos."
          />
          <SummaryCard
            label="Write and execute posture"
            value="disabled"
            detail="branch write, PR proposals, and runtime execution remain off in v0."
          />
        </section>

        <Section
          title="Control-plane authority posture"
          description="Workflow roles, docs-ops levels, disabled authority, and Agent Assets Library status are visible here as read-only control-plane reference."
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">
                  Workflow roles
                </h3>
                <ToneBadge tone="sky">motion-0173 canon</ToneBadge>
                <ToneBadge tone="rose">no authority grant</ToneBadge>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {authorityPosture.workflow_roles.map((role) => (
                  <div
                    key={role.key}
                    className="rounded-lg border border-gray-800 bg-black/30 p-3"
                  >
                    <div className="font-mono text-xs text-sky-200">{role.key}</div>
                    <p className="mt-2 text-sm text-gray-300">{role.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-100">
                    Agent Assets Library
                  </h3>
                  <ToneBadge tone="amber">static material</ToneBadge>
                  <ToneBadge tone="rose">authority: none</ToneBadge>
                </div>
                <div className="mt-3 font-mono text-xs text-sky-200">
                  {authorityPosture.agent_assets.location}
                </div>
                <p className="mt-3 text-sm text-gray-300">
                  {authorityPosture.agent_assets.summary}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-400">
                  <li>- assets do not grant authority</li>
                  <li>- assets do not replace workflow-role canon</li>
                  <li>- assets do not activate docs-ops Level 3, 4, or 5</li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Read-only authority notes
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  {authorityPosture.notes.map((note) => (
                    <li key={note}>- {note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Identity boundaries"
          description="Human operator identities, shared aliases, and named JAI agent identities are intentionally distinct."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {registry.human_operators.map((identity) => (
              <IdentityCard key={identity.id} identity={identity} />
            ))}
            {registry.shared_aliases.map((identity) => (
              <IdentityCard key={identity.id} identity={identity} />
            ))}
            <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-100">
                  Named JAI agent identities
                </h3>
                <ToneBadge tone="slate">future identities</ToneBadge>
                <ToneBadge tone="rose">non-execution in v0</ToneBadge>
              </div>
              <p className="mt-3 text-sm text-gray-300">
                Named agents are separate future identities such as{" "}
                <span className="font-mono">jai-builder@jai.nexus</span>. They
                are visible and configurable here, but none of them can execute
                or mutate repositories in this registry v0 seam.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-400">
                <li>- execution_identity is false for every named agent</li>
                <li>- draft_files is preview only and cannot mutate the repo</li>
                <li>- promotion or runtime execution is not enabled here</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          title="Named JAI agents"
          description="Initial named configurations are registry-only records with explicit capability posture and configured scope subset targets."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {registry.named_agents.map((agent) => (
              <AgentCard key={agent.key} agent={agent} />
            ))}
          </div>
        </Section>

        <Section
          title="Capability matrix"
          description="Capabilities may be view-only or preview-only, while write and execution capability remain explicitly disabled."
        >
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-zinc-950">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Agent
                  </th>
                  {registry.capability_keys.map((capability) => (
                    <th
                      key={capability}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500"
                    >
                      {capabilityLabel(capability)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {registry.named_agents.map((agent) => (
                  <tr key={agent.key}>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-100">{agent.label}</div>
                      <div className="font-mono text-xs text-gray-500">
                        {agent.handle}
                      </div>
                    </td>
                    {registry.capability_keys.map((capability) => (
                      <td key={`${agent.key}-${capability}`} className="px-4 py-3">
                        <ToneBadge
                          tone={capabilityTone(agent.capabilities[capability])}
                        >
                          {agent.capabilities[capability]}
                        </ToneBadge>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="Configured scope subset"
          description="Configured agent scope keys resolve to actual repos and surfaces. They are not the same thing as the full repo registry."
        >
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-zinc-950">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Scope key
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Actual repo
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Surfaces
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {registry.configured_scopes.map((scope) => (
                  <tr key={scope.key}>
                    <td className="px-4 py-3">
                      <ToneBadge tone="sky">{scope.key}</ToneBadge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">
                      {scope.repo_full_name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300">
                      {scope.surface_labels.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {scope.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="Named agent scope matrix"
          description="This matrix shows which configured subset keys each agent can review. It does not grant execution or write power."
        >
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-zinc-950">
            <table className="min-w-full divide-y divide-gray-800 text-sm">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500">
                    Agent
                  </th>
                  {registry.configured_scope_keys.map((scope) => (
                    <th
                      key={scope}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-500"
                    >
                      {scopeLabel(scope)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {registry.named_agents.map((agent) => (
                  <tr key={`${agent.key}-scope`}>
                    <td className="px-4 py-3 font-medium text-gray-100">
                      {agent.label}
                    </td>
                    {registry.configured_scope_keys.map((scope) => (
                      <td key={`${agent.key}-${scope}`} className="px-4 py-3">
                        {agent.configured_scope_keys.includes(scope) ? (
                          <ToneBadge tone="emerald">in scope</ToneBadge>
                        ) : (
                          <span className="text-xs text-gray-600">out</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="Credential posture"
          description="Env variable names are shown for future execution posture only. No values are rendered or committed."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {registry.named_agents.map((agent) => (
              <div
                key={`${agent.key}-credentials`}
                className="rounded-xl border border-gray-800 bg-zinc-950 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-100">
                    {agent.label}
                  </h3>
                  <ToneBadge tone="amber">env names only</ToneBadge>
                </div>
                <ul className="mt-3 space-y-3">
                  {agent.credential_posture.map((credential) => (
                    <li key={credential.key} className="space-y-1">
                      <div className="font-mono text-xs text-sky-200">
                        {credential.env_var}
                      </div>
                      <div className="text-xs text-gray-400">
                        {credential.purpose}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Blocked capabilities"
          description="These remain disabled across the current control-plane posture and are shown here to avoid ambiguity."
        >
          <div className="rounded-xl border border-gray-800 bg-zinc-950 p-4">
            <div className="flex flex-wrap gap-2">
              {authorityPosture.blocked_capabilities.map((capability) => (
                <ToneBadge key={capability} tone="rose">
                  {capability}
                </ToneBadge>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

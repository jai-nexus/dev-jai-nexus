export const runtime = "nodejs";
export const revalidate = 0;

import type { ReactNode } from "react";
import {
  OPERATOR_SAFETY_INVARIANTS,
  OperatorBadge,
  OperatorBlockedAction,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSafetyRail,
  OperatorSectionHeader,
  OperatorStatusChip,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import {
  getAgentConfigurationRegistry,
  getCanonicalActiveAgents,
  getPaletteDraftAgents,
} from "@/lib/agents/agentRegistry";
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
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index={index}
        title={title}
        right={<OperatorBadge tone="readOnly" label="READ-ONLY" />}
      />
      <p className="max-w-5xl text-sm text-slate-400">{description}</p>
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
    <OperatorPanel>
      <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-semibold text-slate-100">
        {value}
      </div>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </OperatorPanel>
  );
}

function capabilityTone(
  state: AgentRegistryCapabilityState,
): OperatorSlateTone {
  if (state === "enabled") return "readOnly";
  if (state === "preview_only") return "pending";
  return "blocked";
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
    <OperatorPanel>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{identity.label}</h3>
        <OperatorStatusChip
          status={identity.kind === "shared_alias" ? "SHARED ALIAS" : "HUMAN OPERATOR"}
          tone={identity.kind === "shared_alias" ? "advisory" : "readOnly"}
        />
        <OperatorBadge tone="blocked" label="EXECUTION DISABLED" />
      </div>
      <div className="mt-2">
        <OperatorIdChip>{identity.handle}</OperatorIdChip>
      </div>
      <p className="mt-3 text-sm text-slate-300">{identity.summary}</p>
      <ul className="mt-3 space-y-1 text-xs text-slate-400">
        {identity.notes.map((note) => (
          <li key={note}>- {note}</li>
        ))}
      </ul>
    </OperatorPanel>
  );
}

function AgentCard({ agent }: { agent: AgentRegistryAgent }) {
  const registry = getAgentConfigurationRegistry();
  const scopeEntries = registry.configured_scopes.filter((scope) =>
    agent.configured_scope_keys.includes(scope.key),
  );

  return (
    <OperatorPanel className="scroll-mt-4">
      <div id={agent.key}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-100">{agent.label}</h3>
          <OperatorStatusChip
            status={
              agent.agent_class === "canonical_active"
                ? "CANONICAL ACTIVE"
                : "PALETTE DRAFT"
            }
            tone={
              agent.agent_class === "canonical_active" ? "canonical" : "advisory"
            }
          />
          {agent.canonical_lane ? (
            <OperatorBadge
              tone={agent.canonical_lane === "governance" ? "readOnly" : "neutral"}
              label={`${agent.canonical_lane} LANE`}
            />
          ) : null}
          <OperatorBadge tone="blocked" label="EXECUTION DISABLED" />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <OperatorIdChip>{agent.handle}</OperatorIdChip>
          {agent.nh_id ? <OperatorIdChip>NH {agent.nh_id}</OperatorIdChip> : null}
        </div>
        <p className="mt-3 text-sm text-slate-300">{agent.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {agent.canonical_key ? (
            <OperatorBadge
              tone="canonical"
              label={`CANONICAL KEY: ${agent.canonical_key}`}
            />
          ) : null}
          {agent.palette_proposed_role ? (
            <OperatorBadge
              tone="advisory"
              label={`PROPOSED ROLE: ${agent.palette_proposed_role}`}
            />
          ) : null}
        </div>
        <OperatorGateCard className="mt-4">
          <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Configured scope subset targets
          </div>
          <div className="mt-2">
            <OperatorBadge
              tone="readOnly"
              label="SCOPE CONFIGURATION IS NOT AUTHORITY"
            />
          </div>
          <ul className="mt-2 space-y-2 text-xs text-slate-300">
            {scopeEntries.map((scope) => (
              <li key={`${agent.key}-${scope.key}`}>
                <div className="flex flex-wrap gap-2">
                  <OperatorIdChip>{scope.key}</OperatorIdChip>
                  <OperatorIdChip>{scope.repo_full_name}</OperatorIdChip>
                </div>
                <div className="mt-1 text-slate-400">
                  surfaces: {scope.surface_labels.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        </OperatorGateCard>
        <ul className="mt-3 space-y-1 text-xs text-slate-400">
          {agent.notes.map((note) => (
            <li key={note}>- {note}</li>
          ))}
        </ul>
      </div>
    </OperatorPanel>
  );
}

function CapabilityMatrix({
  index,
  title,
  description,
  agents,
}: {
  index: string;
  title: string;
  description: string;
  agents: AgentRegistryAgent[];
}) {
  const registry = getAgentConfigurationRegistry();

  return (
    <Section index={index} title={title} description={description}>
      <OperatorPanel className="overflow-x-auto p-0">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500">
                Agent
              </th>
              {registry.capability_keys.map((capability) => (
                <th
                  key={capability}
                  className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500"
                >
                  {capabilityLabel(capability)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {agents.map((agent) => (
              <tr key={`${title}-${agent.key}`}>
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-slate-100">{agent.label}</div>
                  <div className="mt-1">
                    <OperatorIdChip>{agent.handle}</OperatorIdChip>
                  </div>
                </td>
                {registry.capability_keys.map((capability) => (
                  <td key={`${agent.key}-${capability}`} className="px-4 py-3">
                    <OperatorStatusChip
                      status={agent.capabilities[capability]}
                      tone={capabilityTone(agent.capabilities[capability])}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </OperatorPanel>
    </Section>
  );
}

export default function AgentsPage() {
  const registry = getAgentConfigurationRegistry();
  const fullRepoRegistry = getFullRepoRegistry();
  const authorityPosture = getControlPlaneAuthorityPosture();
  const canonicalActiveAgents = getCanonicalActiveAgents();
  const paletteDraftAgents = getPaletteDraftAgents();
  const canonicalExecutionAgents = canonicalActiveAgents.filter(
    (agent) => agent.canonical_lane === "execution",
  );
  const canonicalGovernanceAgents = canonicalActiveAgents.filter(
    (agent) => agent.canonical_lane === "governance",
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <OperatorPanel className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <OperatorBadge tone="gated" label="NON-AUTHORIZING" />
              <OperatorBadge tone="readOnly" label="READ-ONLY REGISTRY" />
              <OperatorBadge tone="canonical" label="CANONICAL BASELINE" />
              <OperatorBadge tone="advisory" label="PALETTE DRAFTS" />
              <OperatorBadge tone="blocked" label="NO EXECUTION" />
              <OperatorBadge tone="blocked" label="NO DISPATCH" />
              <OperatorBadge tone="gated" label="ZERO GATES GRANTED" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
                Operator Slate / Identity and capability posture
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100">
                JAI NEXUS Agent Registry
              </h1>
            </div>
            <p className="max-w-4xl text-sm text-slate-400">
              Read-only operator registry for human identities, canonical active JAI
              agents, and JAI Palette draft agent designs. Configured scope subset keys
              remain visible here, but scope configuration is not identity, permission,
              dispatch authority, or execution authority.
            </p>
            <OperatorGateCard>
              <div className="flex flex-wrap items-center gap-2">
                <OperatorBadge tone="canonical" label="CANONICAL IDENTITY" />
                <OperatorBadge tone="advisory" label="DRAFT DESIGN" />
                <OperatorBadge tone="readOnly" label="CONFIGURED SCOPE" />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Canonical-active records are the accepted identity baseline. Palette
                drafts remain advisory designs and become canonical only through a
                later motion and ratification. Dashboard display does not authorize
                action.
              </p>
            </OperatorGateCard>
          </OperatorPanel>

          <OperatorSafetyRail
            title="Agent Authority Rail"
            invariants={OPERATOR_SAFETY_INVARIANTS}
          >
            <div className="flex flex-wrap gap-2">
              <OperatorBlockedAction>Dispatch model</OperatorBlockedAction>
              <OperatorBlockedAction>Run Agent</OperatorBlockedAction>
              <OperatorBlockedAction>Write branch</OperatorBlockedAction>
            </div>
            <p className="text-xs text-slate-400">
              Agent records are staged configuration and identity references. No
              capability shown here opens an execution gate.
            </p>
          </OperatorSafetyRail>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Canonical active agents"
            value={String(canonicalActiveAgents.length)}
            detail="Stable baseline identities currently treated as canonical active JAI agents."
          />
          <SummaryCard
            label="Palette draft agents"
            value={String(paletteDraftAgents.length)}
            detail="Draft/custom agent designs preserved for JAI Palette and grid composition."
          />
          <SummaryCard
            label="Human and alias identities"
            value={String(registry.human_operators.length + registry.shared_aliases.length)}
            detail="Human operator and shared alias behavior remain distinct from named agents."
          />
          <SummaryCard
            label="Configured scope subset"
            value={String(registry.configured_scope_keys.length)}
            detail="Scope keys stay visible, but they are scope configuration rather than agent identity."
          />
          <SummaryCard
            label="Full repo registry"
            value={String(fullRepoRegistry.length)}
            detail="Actual repos remain modeled separately and surfaced on /repos."
          />
        </section>

        <Section
          index="01"
          title="Identity boundaries"
          description="Human operator identities, shared aliases, canonical active agents, and palette drafts are intentionally separate layers."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {registry.human_operators.map((identity) => (
              <IdentityCard key={identity.id} identity={identity} />
            ))}
            {registry.shared_aliases.map((identity) => (
              <IdentityCard key={identity.id} identity={identity} />
            ))}
            <OperatorPanel>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Registry boundary
                </h3>
                <OperatorBadge tone="readOnly" label="IDENTITY != SCOPE" />
                <OperatorBadge tone="advisory" label="PALETTE != CANON" />
              </div>
              <p className="mt-3 text-sm text-slate-300">
                Configured scope subset keys describe where an identity can review bounded
                work. They do not define whether that identity is canonical active or a
                JAI Palette draft design.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                <li>- execution_identity is false for every named agent in this seam</li>
                <li>- palette drafts do not become canonical without motion and ratification</li>
                <li>- no draft/custom identity gains execution authority here</li>
              </ul>
            </OperatorPanel>
          </div>
        </Section>

        <Section
          index="02"
          title="Canonical active JAI agents - Execution lane"
          description="Execution-lane canonical agents are part of the baseline identity model even though runtime authority remains disabled."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {canonicalExecutionAgents.map((agent) => (
              <AgentCard key={agent.key} agent={agent} />
            ))}
          </div>
        </Section>

        <Section
          index="03"
          title="Canonical active JAI agents - Governance lane"
          description="Governance-lane canonical agents anchor council and motion posture without enabling vote mutation or authority expansion."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {canonicalGovernanceAgents.map((agent) => (
              <AgentCard key={agent.key} agent={agent} />
            ))}
          </div>
        </Section>

        <Section
          index="04"
          title="JAI Palette - Draft agent designs"
          description="Palette draft agents remain available as future design/custom layers for JAI Grid and future ratified agent work."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {paletteDraftAgents.map((agent) => (
              <AgentCard key={agent.key} agent={agent} />
            ))}
          </div>
        </Section>

        <Section
          index="05"
          title="Configured scope subset"
          description="Configured agent scope keys resolve to curated operator targets. They remain visible here as scope configuration and not as identity canon or the full repo registry."
        >
          <OperatorGateCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly" label="CONFIGURED SCOPE" />
              <OperatorBadge tone="gated" label="NOT AN AUTHORITY GRANT" />
            </div>
            <p>
              These five configured scope keys are curated operator targets only. The full
              repo registry lives at <span className="font-mono">/repos</span> and currently
              contains 38 repos.
            </p>
          </OperatorGateCard>
          <OperatorPanel className="overflow-x-auto p-0">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500">
                    Scope key
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500">
                    Actual repo
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500">
                    Surfaces
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500">
                    Meaning
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {registry.configured_scopes.map((scope) => (
                  <tr key={scope.key}>
                    <td className="px-4 py-3">
                      <OperatorStatusChip status={scope.key} tone="readOnly" />
                    </td>
                    <td className="px-4 py-3">
                      <OperatorIdChip>{scope.repo_full_name}</OperatorIdChip>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {scope.surface_labels.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{scope.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </OperatorPanel>
        </Section>

        <CapabilityMatrix
          index="06"
          title="Capability matrix - canonical baseline"
          description="Canonical active agents share the baseline capability posture. Write and execution capability remain disabled."
          agents={canonicalActiveAgents}
        />

        <CapabilityMatrix
          index="07"
          title="Capability matrix - palette draft posture"
          description="Palette draft agents are visible for future design work, but they do not present as canonical active baseline identities."
          agents={paletteDraftAgents}
        />

        <Section
          index="08"
          title="Configured scope coverage matrix"
          description="This matrix shows each agent's configured review subset. It is not the full repo registry, and configured scope keys are curated operator targets rather than the full repo list."
        >
          <OperatorPanel className="overflow-x-auto p-0">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500">
                    Agent
                  </th>
                  {registry.configured_scope_keys.map((scope) => (
                    <th
                      key={scope}
                      className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-500"
                    >
                      {scopeLabel(scope)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {registry.named_agents.map((agent) => (
                  <tr key={`${agent.key}-scope`}>
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {agent.label}
                    </td>
                    {registry.configured_scope_keys.map((scope) => (
                      <td key={`${agent.key}-${scope}`} className="px-4 py-3">
                        {agent.configured_scope_keys.includes(scope) ? (
                          <OperatorStatusChip status="IN SCOPE" tone="readOnly" />
                        ) : (
                          <OperatorStatusChip status="OUT" tone="neutral" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </OperatorPanel>
        </Section>

        <Section
          index="09"
          title="Credential posture"
          description="Env variable names are shown for future execution posture only. No values are rendered or committed."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {registry.named_agents.map((agent) => (
              <OperatorPanel key={`${agent.key}-credentials`}>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">{agent.label}</h3>
                  <OperatorStatusChip
                    status={
                      agent.agent_class === "canonical_active"
                        ? "CANONICAL ACTIVE"
                        : "PALETTE DRAFT"
                    }
                    tone={
                      agent.agent_class === "canonical_active"
                        ? "canonical"
                        : "advisory"
                    }
                  />
                  <OperatorBadge tone="advisory" label="ENV NAMES ONLY" />
                  <OperatorBadge tone="blocked" label="NOT READ IN V0" />
                </div>
                <ul className="mt-3 space-y-3">
                  {agent.credential_posture.map((credential) => (
                    <li key={credential.key} className="space-y-1">
                      <OperatorIdChip>{credential.env_var}</OperatorIdChip>
                      <div className="text-xs text-slate-400">{credential.purpose}</div>
                    </li>
                  ))}
                </ul>
              </OperatorPanel>
            ))}
          </div>
        </Section>

        <Section
          index="10"
          title="Control-plane authority posture"
          description="Workflow roles, docs-ops levels, disabled authority, and Agent Assets Library status remain visible here as read-only control-plane reference."
        >
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <OperatorPanel>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">Workflow roles</h3>
                <OperatorBadge tone="canonical" label="MOTION-0173 CANON" />
                <OperatorBadge tone="gated" label="NO AUTHORITY GRANT" />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {authorityPosture.workflow_roles.map((role) => (
                  <OperatorGateCard key={role.key}>
                    <OperatorStatusChip status={role.key} tone="readOnly" />
                    <p className="mt-2 text-sm text-slate-300">{role.summary}</p>
                  </OperatorGateCard>
                ))}
              </div>
            </OperatorPanel>

            <div className="space-y-4">
              <OperatorPanel>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">
                    Agent Assets Library
                  </h3>
                  <OperatorBadge tone="fixture" label="STATIC MATERIAL" />
                  <OperatorBadge tone="blocked" label="AUTHORITY: NONE" />
                </div>
                <div className="mt-3">
                  <OperatorIdChip>
                    {authorityPosture.agent_assets.location}
                  </OperatorIdChip>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  {authorityPosture.agent_assets.summary}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-400">
                  <li>- assets do not grant authority</li>
                  <li>- assets do not replace workflow-role canon</li>
                  <li>- assets do not activate docs-ops Level 3, 4, or 5</li>
                </ul>
              </OperatorPanel>

              <OperatorPanel>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Read-only authority notes
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {authorityPosture.notes.map((note) => (
                    <li key={note}>- {note}</li>
                  ))}
                </ul>
              </OperatorPanel>
            </div>
          </div>
        </Section>

        <Section
          index="11"
          title="Blocked capabilities"
          description="These remain disabled across the current control-plane posture and are shown here to avoid ambiguity."
        >
          <OperatorPanel>
            <div className="flex flex-wrap gap-2">
              {authorityPosture.blocked_capabilities.map((capability) => (
                <OperatorBadge
                  key={capability}
                  tone="blocked"
                  label={capability}
                />
              ))}
            </div>
          </OperatorPanel>
        </Section>
      </div>
    </main>
  );
}

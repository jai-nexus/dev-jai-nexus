import type { ReactNode } from "react";
import {
  OperatorBadge,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
  type OperatorSlateTone,
} from "@/components/operator/slate";
import { agentRegistryStaticData } from "@/data/operator/agentRegistry";
import { AgentVoteReviewSurface } from "./AgentVoteReviewSurface";
import { PaletteAgentRecommendationSurface } from "./PaletteAgentRecommendationSurface";

function BadgeList({
  items,
  tone = "neutral",
  limit,
}: {
  items: readonly string[];
  tone?: OperatorSlateTone;
  limit?: number;
}) {
  const visibleItems = typeof limit === "number" ? items.slice(0, limit) : items;
  const hiddenCount =
    typeof limit === "number" && items.length > limit ? items.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleItems.map((item) => (
        <OperatorBadge key={item} tone={tone}>
          {item}
        </OperatorBadge>
      ))}
      {hiddenCount > 0 ? (
        <OperatorBadge tone="neutral">+{hiddenCount}</OperatorBadge>
      ) : null}
    </div>
  );
}

function CompactList({
  items,
  limit = 4,
}: {
  items: readonly string[];
  limit?: number;
}) {
  const visibleItems = items.slice(0, limit);
  const hiddenCount = items.length > limit ? items.length - limit : 0;

  return (
    <ul className="space-y-1 text-xs text-slate-400">
      {visibleItems.map((item) => (
        <li key={item}>- {item}</li>
      ))}
      {hiddenCount > 0 ? <li>- +{hiddenCount} more</li> : null}
    </ul>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-semibold text-slate-100">
        {value}
      </div>
    </div>
  );
}

function RegistrySection({
  index,
  title,
  description,
  children,
  right,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <OperatorSectionHeader
        index={index}
        title={title}
        right={right ?? <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>}
      />
      <p className="max-w-5xl text-sm text-slate-400">{description}</p>
      {children}
    </section>
  );
}

const doctrinePhrases = [
  "JAI Agents are staged, not executing.",
  "Agent registry entries do not execute.",
  "Agent lanes do not execute.",
  "Agent votes are evidence, not authority.",
  "Agent votes do not decide.",
  "Quorum is readiness evidence, not approval.",
  "Template expansion is recommendation.",
  "Template instantiation is review.",
  "Agent activation is gated.",
  "Palette recommendation is not creation.",
  "Palette recommendation is not activation.",
  "Palette recommendation is not dispatch.",
  "Palette recommendation is not authority.",
  "Palette recommends staged Agent candidates for review.",
  "Registry visibility is not activation.",
  "DNS/domain status is not runtime authority.",
  "Repo registry status is not execution authority.",
  "Grid displays Agent posture; it does not create or activate Agents.",
  "CONTROL_THREAD decides.",
  "ZERO GATES GRANTED.",
] as const;

const boundaryLabels = [
  "no execution",
  "no activation",
  "no dispatch",
  "no provider/model calls",
  "no API/server-action/DB/Prisma behavior",
  "no GitHub/tool integration",
  "no receipt/canon mutation",
  "no route/motion/gate-state mutation",
  "CONTROL_THREAD decides.",
  "ZERO GATES GRANTED.",
] as const;

export function AgentRegistryStaticSurface() {
  const {
    roleTemplates,
    domainEngines,
    repoDomainScope,
    serviceDomains,
    tierAgentModel,
    projectAgentCandidates,
    paletteRecommendations,
    voteBundles,
  } = agentRegistryStaticData;
  const highRiskRepos = repoDomainScope.filter(
    (repo) => repo.riskTreatment !== "LOW" && repo.riskTreatment !== "MEDIUM",
  );

  return (
    <section className="space-y-7">
      <OperatorPanel className="space-y-4">
        <OperatorSectionHeader
          index="AR"
          title="Agent Registry Overview"
          right={
            <>
              <OperatorBadge tone="readOnly">READ-ONLY</OperatorBadge>
              <OperatorBadge tone="fixture">STATIC DATA</OperatorBadge>
              <OperatorBadge tone="blocked">NON-EXECUTING</OperatorBadge>
              <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
            </>
          }
        />
        <p className="max-w-5xl text-sm text-slate-300">
          Cross-polyrepo JAI Agent Registry static data rendered for operator
          review. Registry visibility is not activation. This page does not add
          activation, dispatch, execution, provider/model calls, GitHub/tool
          integration, persistence, receipts, canon updates, or gate mutation.
        </p>
        <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-7">
          <Stat label="Templates" value={roleTemplates.length} />
          <Stat label="Engines" value={domainEngines.length} />
          <Stat label="Repos" value={repoDomainScope.length} />
          <Stat label="DNS" value={serviceDomains.length} />
          <Stat label="Candidates" value={projectAgentCandidates.length} />
          <Stat label="Palette" value={paletteRecommendations.length} />
          <Stat label="Votes" value={voteBundles.length} />
        </div>
        <OperatorGateCard>
          <div className="grid gap-1.5 text-xs text-slate-300 md:grid-cols-2 xl:grid-cols-4">
            {doctrinePhrases.map((phrase) => (
              <div
                key={phrase}
                className="rounded border border-slate-800 bg-slate-950 px-2 py-1"
              >
                {phrase}
              </div>
            ))}
          </div>
        </OperatorGateCard>
      </OperatorPanel>

      <RegistrySection
        index="AR-01"
        title="Role Templates"
        description="Reusable TEMPLATE records define governed role envelopes. Template expansion is recommendation. Template instantiation is review. Agent activation is gated."
      >
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {roleTemplates.map((template) => (
            <OperatorGateCard key={template.namespace} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <OperatorBadge tone="fixture">TEMPLATE</OperatorBadge>
                <OperatorBadge tone="readOnly">{template.namespace}</OperatorBadge>
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {template.displayName}
              </div>
              <BadgeList items={template.status} tone="blocked" limit={3} />
              <div className="text-xs text-slate-400">
                vote: {template.voteRole}
              </div>
              <div className="text-xs text-slate-400">
                work: {template.workRole}
              </div>
              <CompactList items={template.allowedOutputs} limit={3} />
              <BadgeList items={template.blockedActions} tone="blocked" limit={5} />
              <div className="text-xs text-amber-200">
                {template.sourceDoctrineLabel}
              </div>
            </OperatorGateCard>
          ))}
        </div>
      </RegistrySection>

      <RegistrySection
        index="AR-02"
        title="Domain Engines"
        description="DOMAIN ENGINE records define governed namespaces and collaboration semantics; they do not execute, grant authority, open gates, create receipts, update canon, or dispatch Agents."
      >
        <div className="grid gap-2 lg:grid-cols-2">
          {domainEngines.map((engine) => (
            <OperatorGateCard key={engine.namespace} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <OperatorBadge tone="fixture">DOMAIN ENGINE</OperatorBadge>
                <OperatorBadge tone="readOnly">{engine.namespace}</OperatorBadge>
                <OperatorBadge tone="blocked">{engine.riskPosture}</OperatorBadge>
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {engine.displayName}
              </div>
              <p className="text-xs text-slate-300">{engine.purpose}</p>
              <BadgeList items={engine.allowedAgentTemplates} tone="readOnly" limit={6} />
              <div className="grid gap-3 md:grid-cols-2">
                <CompactList items={engine.expectedArtifacts} limit={3} />
                <CompactList items={engine.reviewExpectations} limit={3} />
              </div>
              <BadgeList items={engine.blockedCapabilities} tone="blocked" limit={6} />
              <div className="text-xs text-slate-400">
                repos: {engine.primaryRepos.join(", ")}
              </div>
              <p className="text-xs text-amber-200">{engine.v0Boundary}</p>
            </OperatorGateCard>
          ))}
        </div>
      </RegistrySection>

      <RegistrySection
        index="AR-03"
        title="Polyrepo Scope Map"
        description="Repo/domain scope records are static registry visibility only. Repo registry status is not execution authority."
      >
        <OperatorPanel className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-950">
              <tr>
                {["Repo", "Tier", "Status", "Engine", "Risk", "Notes"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-slate-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {repoDomainScope.map((repo) => (
                <tr key={repo.repoId}>
                  <td className="px-3 py-2 align-top">
                    <OperatorIdChip>{repo.githubRepo}</OperatorIdChip>
                    <div className="mt-1 text-xs text-slate-500">{repo.role}</div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <OperatorBadge tone="readOnly">{repo.tier}</OperatorBadge>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <OperatorBadge
                      tone={repo.status === "ACTIVE" ? "readOnly" : "blocked"}
                    >
                      {repo.status}
                    </OperatorBadge>
                  </td>
                  <td className="px-3 py-2 align-top text-xs">
                    <div>{repo.primaryDomainEngine}</div>
                    <div className="text-slate-500">
                      {repo.secondaryDomainEngines.join(", ")}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <OperatorBadge
                      tone={
                        repo.riskTreatment === "LOW" ||
                        repo.riskTreatment === "MEDIUM"
                          ? "advisory"
                          : "blocked"
                      }
                    >
                      {repo.riskTreatment}
                    </OperatorBadge>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-400">
                    {repo.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </OperatorPanel>
      </RegistrySection>

      <RegistrySection
        index="AR-04"
        title="DNS / Service Domain Scope"
        description="DNS/domain status is not runtime authority. DOMAIN / READ-ONLY is not activation."
      >
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {serviceDomains.map((domain) => (
            <OperatorGateCard key={domain.domain} className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="readOnly">{domain.status}</OperatorBadge>
                <OperatorBadge tone="fixture">STATIC DATA</OperatorBadge>
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {domain.domain}
              </div>
              <CompactList
                items={[
                  `key: ${domain.key}`,
                  `env: ${domain.env}`,
                  `repo: ${domain.repo}`,
                  `nhID: ${domain.nhID ?? "unknown"}`,
                  `primary: ${domain.primaryEngine}`,
                  `secondary: ${domain.secondaryEngines.join(", ")}`,
                ]}
                limit={6}
              />
              <p className="text-xs text-amber-200">{domain.activationBoundary}</p>
            </OperatorGateCard>
          ))}
        </div>
      </RegistrySection>

      <RegistrySection
        index="AR-05"
        title="Tier Agent Model"
        description="Tier labels group review posture only. Tier does not grant authority, authorize execution, or open gates."
      >
        <div className="grid gap-2 md:grid-cols-3">
          {tierAgentModel.map((tier) => (
            <OperatorGateCard key={tier.tier} className="space-y-2">
              <OperatorBadge tone="readOnly">{tier.tier}</OperatorBadge>
              <p className="text-sm text-slate-300">{tier.description}</p>
              <BadgeList items={tier.typicalEngines} tone="advisory" />
              <p className="text-xs text-amber-200">{tier.boundary}</p>
            </OperatorGateCard>
          ))}
        </div>
      </RegistrySection>

      <RegistrySection
        index="AR-06"
        title="Project-Scoped Agent Candidates"
        description="PROJECT CANDIDATE records are staged for review and not executing. Palette recommendation is not activation."
      >
        <div className="grid gap-2 lg:grid-cols-2">
          {projectAgentCandidates.map((candidate) => (
            <OperatorGateCard key={candidate.candidateId} className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="fixture">PROJECT CANDIDATE</OperatorBadge>
                <OperatorBadge tone="blocked">NOT EXECUTING</OperatorBadge>
                <OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {candidate.displayName}
              </div>
              <OperatorIdChip>{candidate.namespace}</OperatorIdChip>
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="readOnly">{candidate.tier}</OperatorBadge>
                <OperatorBadge tone="readOnly">{candidate.domainEngine}</OperatorBadge>
                <OperatorBadge tone="fixture">{candidate.roleTemplate}</OperatorBadge>
              </div>
              <BadgeList items={candidate.status} tone="blocked" />
              <CompactList
                items={[
                  `repo scope: ${candidate.repoScope.join(", ")}`,
                  `source: ${candidate.recommendationSource}`,
                  `receipt: ${candidate.receiptExpectation}`,
                  `risk: ${candidate.riskPosture}`,
                ]}
                limit={4}
              />
              <BadgeList items={candidate.blockedActions} tone="blocked" limit={6} />
              <CompactList
                items={[...candidate.requiredReviews, ...candidate.requiredGates]}
                limit={5}
              />
              <p className="text-xs text-amber-200">{candidate.activationBoundary}</p>
            </OperatorGateCard>
          ))}
        </div>
      </RegistrySection>

      <PaletteAgentRecommendationSurface />

      <AgentVoteReviewSurface />

      <RegistrySection
        index="AR-09"
        title="High-Risk / Frozen / Deprecated Treatment"
        description="High-risk and frozen records are included to preserve blockers, not to normalize activation."
      >
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {highRiskRepos.map((repo) => (
            <OperatorGateCard key={`risk-${repo.repoId}`} className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <OperatorBadge tone="blocked">{repo.riskTreatment}</OperatorBadge>
                {repo.riskTreatment.includes("FROZEN") ? (
                  <OperatorBadge tone="blocked">FROZEN / LINEAGE</OperatorBadge>
                ) : null}
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {repo.githubRepo}
              </div>
              <p className="text-xs text-slate-400">{repo.notes}</p>
              <CompactList
                items={[
                  `status: ${repo.status}`,
                  `role: ${repo.role}`,
                  `primary engine: ${repo.primaryDomainEngine}`,
                  `secondary engines: ${repo.secondaryDomainEngines.join(", ")}`,
                ]}
                limit={4}
              />
            </OperatorGateCard>
          ))}
        </div>
      </RegistrySection>

      <RegistrySection
        index="AR-10"
        title="Gate / Authority Boundary Rail"
        description="Static registry data does not open gates, dispatch Agents, run tools, or mutate state."
        right={<OperatorBadge tone="blocked">ZERO GATES GRANTED</OperatorBadge>}
      >
        <OperatorPanel>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {boundaryLabels.map((item) => (
              <OperatorBadge key={item} tone="blocked">
                {item}
              </OperatorBadge>
            ))}
          </div>
        </OperatorPanel>
      </RegistrySection>
    </section>
  );
}

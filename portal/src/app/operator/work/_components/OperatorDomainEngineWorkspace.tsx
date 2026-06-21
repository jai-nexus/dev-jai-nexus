"use client";

import { useMemo, useState } from "react";

import {
  OperatorBadge,
  OperatorBlockedAction,
  OperatorContradictionCard,
  OperatorGateCard,
  OperatorIdChip,
  OperatorPanel,
  OperatorSectionHeader,
} from "@/components/operator/slate";
import { agentRegistryStaticData } from "@/data/operator/agentRegistry";

const boundaryPhrases = [
  "Assignment recommendation is not activation.",
  "Registry visibility is not activation.",
  "Work packet is not execution.",
  "Route packet is not routing itself.",
  "Validation is not approval.",
  "Closeout is not acceptance.",
  "CONTROL_THREAD decides.",
  "ZERO GATES GRANTED.",
] as const;

const workspaceLabels = [
  "STAGED",
  "RECOMMENDED",
  "PENDING HUMAN APPROVAL",
  "NOT ACTIVATED",
  "NOT DISPATCHED",
  "NOT EXECUTING",
  "COPY HANDOFF",
  "ZERO GATES GRANTED",
] as const;

const blockedCapabilities = [
  "Agent execution",
  "Agent dispatch",
  "Agent activation",
  "Agent creation",
  "provider/model dispatch",
  "live model calls",
  "GitHub API use",
  "branch/PR automation",
  "receipt creation",
  "canon mutation",
  "route-state mutation",
  "motion-state mutation",
  "gate opening",
] as const;

const domainWorkspaceLanes = [
  {
    laneId: "Q3M7-DOMAIN-FRAMEWORK",
    domain: "framework.nexus",
    engine: "JAI::FORMAT",
    repoLane: "jai-format / jai / docs-nexus",
    focus:
      ".nexus and .jai profile planning, compatibility posture, and reference handoff.",
    workWaveLane: "PROFILE_DRAFT / DOCS_SPEC / ALIGNMENT_REVIEW",
    humanCheckpoint: "CONTROL_THREAD accepts profile doctrine before parser/runtime work.",
  },
  {
    laneId: "Q3M7-DOMAIN-INFRA",
    domain: "infra.nexus",
    engine: "JAI::OPS",
    repoLane: "orchestrator-nexus / api-nexus / runtime-nexus",
    focus:
      "Infrastructure readiness, future work-wave lanes, rollback planning, and blocked execution gates.",
    workWaveLane: "BOUNDARY_REVIEW / VALIDATION_ONLY / FUTURE_GATED_EXECUTION_DESIGN",
    humanCheckpoint: "CONTROL_THREAD reviews security and rollback evidence before any future gate proposal.",
  },
  {
    laneId: "Q3M7-DOMAIN-DEV-JAI",
    domain: "dev.jai.nexus",
    engine: "JAI::DEV",
    repoLane: "dev-jai-nexus / jai-nexus / nexus-core",
    focus:
      "Operator cockpit, work packet handoff, route packet visibility, validation reports, and closeout packets.",
    workWaveLane: "COMPOSE_ONLY_UI / READ_ONLY_UI / QA_DENSITY",
    humanCheckpoint: "CONTROL_THREAD reviews generated packets and manually approves repo execution prompts.",
  },
] as const;

type DomainWorkspaceLaneId = (typeof domainWorkspaceLanes)[number]["laneId"];

const workWaveStages = [
  {
    label: "Work Packets",
    posture: "compose-only scope and task handoff",
    boundary: "Work packet is not execution.",
  },
  {
    label: "Route Packets",
    posture: "recommended route and file boundary handoff",
    boundary: "Route packet is not routing itself.",
  },
  {
    label: "Validation Reports",
    posture: "reported checks and evidence gaps",
    boundary: "Validation is not approval.",
  },
  {
    label: "Closeout Packets",
    posture: "summary, risks, and passalong",
    boundary: "Closeout is not acceptance.",
  },
  {
    label: "CONTROL_THREAD Acceptance",
    posture: "human approval checkpoint",
    boundary: "CONTROL_THREAD decides.",
  },
] as const;

function findEngine(namespace: string) {
  return agentRegistryStaticData.domainEngines.find(
    (engine) => engine.namespace === namespace,
  );
}

function candidatesForEngine(namespace: string) {
  return agentRegistryStaticData.projectAgentCandidates.filter(
    (candidate) => candidate.domainEngine === namespace,
  );
}

function recommendationsForEngine(namespace: string) {
  return agentRegistryStaticData.paletteRecommendations.filter(
    (recommendation) => recommendation.primaryDomainEngine === namespace,
  );
}

function formatList(items: readonly string[]) {
  return items.map((item) => `* ${item}`).join("\n");
}

function buildHandoffPreview(selectedLaneId: string) {
  const lane =
    domainWorkspaceLanes.find((item) => item.laneId === selectedLaneId) ??
    domainWorkspaceLanes[0];
  const engine = findEngine(lane.engine);
  const candidates = candidatesForEngine(lane.engine);
  const recommendations = recommendationsForEngine(lane.engine);

  return `[CONTROL_THREAD  dev-jai-nexus]

Scope:
Q3M7 Operator Domain Engine Workspace v0

Mode:
BROAD-BRANCH / OPERATOR-CONTROL-PLANE / DOMAIN-ENGINE-WORKSPACE / COPY-HANDOFF / HUMAN-APPROVAL / NO-RUNTIME-ACTIVATION / ZERO-GATES-GRANTED

Domain lane:
${lane.domain}

Domain engine:
${lane.engine}${engine ? ` / ${engine.displayName}` : ""}

Repo/domain lane:
${lane.repoLane}

Future work/wave lane:
${lane.workWaveLane}

Purpose:
Represent .nexus domain-engine planning, staged Agent assignment, work/wave planning, and manual CONTROL_THREAD handoff without Agent activation.

Staged Agent assignment:
${formatList(
  candidates.length > 0
    ? candidates.map(
        (candidate) =>
          `${candidate.displayName} (${candidate.namespace}) - ${candidate.status.join(", ")}`,
      )
    : ["No static staged candidates found for this lane."],
)}

Palette recommendation context:
${formatList(
  recommendations.length > 0
    ? recommendations.map(
        (recommendation) =>
          `${recommendation.displayName} - ${recommendation.statusLabels.join(" / ")}`,
      )
    : ["No static Palette recommendations found for this lane."],
)}

Work/wave packet flow:
${formatList(workWaveStages.map((stage) => `${stage.label}: ${stage.posture}`))}

Human approval checkpoint:
${lane.humanCheckpoint}

Boundary rail:
${formatList(boundaryPhrases)}

Blocked capabilities:
${formatList(blockedCapabilities)}

Closeout visibility:
Return branch, commit hash, files changed, summary, operator workflow changes, staged/non-executing posture, validation, risks, recommended next route, and ZERO GATES GRANTED.

ZERO GATES GRANTED.`;
}

function CompactList({ items, limit = 4 }: { items: readonly string[]; limit?: number }) {
  const visible = items.slice(0, limit);
  const remaining = Math.max(0, items.length - visible.length);

  return (
    <ul className="space-y-1 text-xs text-slate-400">
      {visible.map((item) => (
        <li key={item}>- {item}</li>
      ))}
      {remaining > 0 ? <li>- +{remaining} more</li> : null}
    </ul>
  );
}

export function OperatorDomainEngineWorkspace() {
  const [selectedLaneId, setSelectedLaneId] = useState<DomainWorkspaceLaneId>(
    domainWorkspaceLanes[2].laneId,
  );
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const handoffPreview = useMemo(
    () => buildHandoffPreview(selectedLaneId),
    [selectedLaneId],
  );

  const selectedLane =
    domainWorkspaceLanes.find((lane) => lane.laneId === selectedLaneId) ??
    domainWorkspaceLanes[2];
  const selectedEngine = findEngine(selectedLane.engine);
  const selectedCandidates = candidatesForEngine(selectedLane.engine);
  const selectedRecommendations = recommendationsForEngine(selectedLane.engine);

  async function copyHandoff() {
    try {
      await navigator.clipboard.writeText(handoffPreview);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section className="space-y-4">
      <OperatorSectionHeader
        index="Q3M7"
        title="Operator Domain Engine Workspace"
        right={<OperatorBadge tone="composeOnly">COPY HANDOFF / STAGED</OperatorBadge>}
      />

      <OperatorPanel className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {workspaceLabels.map((label) => (
            <OperatorBadge
              key={label}
              tone={label.includes("NOT ") ? "blocked" : "composeOnly"}
            >
              {label}
            </OperatorBadge>
          ))}
        </div>

        <p className="max-w-5xl text-sm text-slate-300">
          Local/static workspace for .nexus domain-engine planning, staged JAI
          Agent assignment, work/wave planning, and copy-ready repo handoff.
          Nothing here activates Agents, dispatches work, creates receipts,
          mutates canon, opens gates, or changes route/motion state.
        </p>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <OperatorContradictionCard>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="blocked">ASSIGNMENT IS NOT ACTIVATION</OperatorBadge>
              <OperatorBadge tone="blocked">NO AGENT DISPATCH</OperatorBadge>
              <OperatorBadge tone="blocked">NO RUNTIME</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
            <ul className="mt-3 grid gap-x-4 gap-y-1 text-xs text-slate-300 md:grid-cols-2">
              {boundaryPhrases.map((phrase) => (
                <li key={phrase}>- {phrase}</li>
              ))}
            </ul>
          </OperatorContradictionCard>

          <OperatorGateCard>
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Blocked workspace capabilities
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {blockedCapabilities.map((capability) => (
                <OperatorBlockedAction key={capability}>
                  {capability}
                </OperatorBlockedAction>
              ))}
            </div>
          </OperatorGateCard>
        </div>

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(30rem,0.85fr)]">
          <div className="space-y-4">
            <OperatorPanel className="space-y-4 bg-slate-950/45">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Domain-engine planning lanes
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Static lane selector for planning posture only. Selection
                    changes local preview text only.
                  </p>
                </div>
                <OperatorBadge tone="readOnly">LOCAL STATE ONLY</OperatorBadge>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                {domainWorkspaceLanes.map((lane) => (
                  <button
                    key={lane.laneId}
                    type="button"
                    onClick={() => {
                      setSelectedLaneId(lane.laneId);
                      setCopyState("idle");
                    }}
                    className={`rounded border p-3 text-left transition ${
                      selectedLaneId === lane.laneId
                        ? "border-sky-600 bg-sky-950/40"
                        : "border-slate-800 bg-slate-950 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      <OperatorBadge tone="composeOnly">RECOMMENDED</OperatorBadge>
                      <OperatorBadge tone="blocked">NOT ACTIVATED</OperatorBadge>
                    </div>
                    <div className="mt-3 font-mono text-xs text-slate-500">
                      {lane.laneId}
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-slate-100">
                      {lane.domain}
                    </h4>
                    <p className="mt-2 text-xs text-slate-400">{lane.focus}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <OperatorIdChip>{lane.engine}</OperatorIdChip>
                      <OperatorBadge tone="readOnly">{lane.workWaveLane}</OperatorBadge>
                    </div>
                  </button>
                ))}
              </div>
            </OperatorPanel>

            <OperatorPanel className="space-y-4 bg-slate-950/45">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Selected lane detail
                </h3>
                <OperatorBadge tone="composeOnly">PENDING HUMAN APPROVAL</OperatorBadge>
                <OperatorBadge tone="blocked">NOT EXECUTING</OperatorBadge>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <OperatorGateCard>
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Domain / repo lane
                  </div>
                  <p className="mt-2 text-sm text-slate-200">
                    {selectedLane.domain}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedLane.repoLane}
                  </p>
                </OperatorGateCard>
                <OperatorGateCard>
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Domain engine
                  </div>
                  <p className="mt-2 text-sm text-slate-200">
                    {selectedEngine?.displayName ?? selectedLane.engine}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedEngine?.purpose ?? selectedLane.focus}
                  </p>
                </OperatorGateCard>
              </div>

              {selectedEngine ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <OperatorGateCard>
                    <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                      Expected artifacts
                    </div>
                    <CompactList items={selectedEngine.expectedArtifacts} />
                  </OperatorGateCard>
                  <OperatorGateCard>
                    <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                      Review expectations
                    </div>
                    <CompactList items={selectedEngine.reviewExpectations} />
                  </OperatorGateCard>
                  <OperatorGateCard>
                    <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                      Blocked capabilities
                    </div>
                    <CompactList items={selectedEngine.blockedCapabilities} />
                  </OperatorGateCard>
                </div>
              ) : null}
            </OperatorPanel>

            <OperatorPanel className="space-y-4 bg-slate-950/45">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Staged Agent assignment
                </h3>
                <OperatorBadge tone="composeOnly">RECOMMENDED</OperatorBadge>
                <OperatorBadge tone="blocked">NOT DISPATCHED</OperatorBadge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {selectedCandidates.length > 0 ? (
                  selectedCandidates.map((candidate) => (
                    <OperatorGateCard key={candidate.candidateId}>
                      <div className="flex flex-wrap gap-1.5">
                        <OperatorBadge tone="composeOnly">
                          {candidate.tier}
                        </OperatorBadge>
                        <OperatorBadge tone="blocked">NOT ACTIVATED</OperatorBadge>
                        <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
                      </div>
                      <h4 className="mt-3 text-sm font-semibold text-slate-100">
                        {candidate.displayName}
                      </h4>
                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        {candidate.namespace}
                      </p>
                      <div className="mt-3">
                        <CompactList items={candidate.requiredReviews} />
                      </div>
                    </OperatorGateCard>
                  ))
                ) : (
                  <OperatorGateCard>
                    <OperatorBadge tone="blocked">NO STATIC CANDIDATE</OperatorBadge>
                    <p className="mt-2 text-sm text-slate-400">
                      No staged Agent candidates are represented for this lane.
                    </p>
                  </OperatorGateCard>
                )}
              </div>
            </OperatorPanel>

            <OperatorPanel className="space-y-4 bg-slate-950/45">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Work/wave planning chain
                </h3>
                <OperatorBadge tone="composeOnly">COPY HANDOFF</OperatorBadge>
                <OperatorBadge tone="blocked">NO ROUTE MUTATION</OperatorBadge>
              </div>
              <div className="grid gap-3 md:grid-cols-5">
                {workWaveStages.map((stage) => (
                  <OperatorGateCard key={stage.label}>
                    <h4 className="text-sm font-semibold text-slate-100">
                      {stage.label}
                    </h4>
                    <p className="mt-2 text-xs text-slate-400">
                      {stage.posture}
                    </p>
                    <p className="mt-3 text-xs text-slate-300">
                      {stage.boundary}
                    </p>
                  </OperatorGateCard>
                ))}
              </div>
            </OperatorPanel>
          </div>

          <div className="space-y-4">
            <OperatorPanel className="space-y-4 bg-slate-950/45">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Copy-ready CONTROL_THREAD handoff
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Local preview only. Copying does not submit, persist, route,
                    dispatch, or create receipts.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <OperatorBadge tone="composeOnly">COPY ONLY</OperatorBadge>
                  <OperatorBadge tone="blocked">NO DISPATCH</OperatorBadge>
                </div>
              </div>

              {selectedRecommendations.length > 0 ? (
                <OperatorGateCard>
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Palette recommendation context
                  </div>
                  <div className="mt-3 space-y-3">
                    {selectedRecommendations.map((recommendation) => (
                      <div key={recommendation.recommendationId}>
                        <p className="text-sm font-semibold text-slate-100">
                          {recommendation.displayName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {recommendation.rationale}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {recommendation.statusLabels.slice(0, 4).map((label) => (
                            <OperatorBadge key={label} tone="composeOnly">
                              {label}
                            </OperatorBadge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </OperatorGateCard>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyHandoff}
                  className="rounded border border-sky-700 bg-sky-950 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:border-sky-500"
                >
                  Copy handoff
                </button>
                <span className="text-xs text-slate-500">
                  {copyState === "copied"
                    ? "Copied to local clipboard only."
                    : copyState === "failed"
                      ? "Clipboard copy unavailable in this browser context."
                      : "No handoff is persisted or dispatched."}
                </span>
              </div>

              <pre className="max-h-[46rem] overflow-auto rounded border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
                {handoffPreview}
              </pre>
            </OperatorPanel>
          </div>
        </div>
      </OperatorPanel>
    </section>
  );
}

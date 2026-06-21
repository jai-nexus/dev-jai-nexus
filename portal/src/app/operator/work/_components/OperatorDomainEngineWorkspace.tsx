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
  "Profile object draft only; not parser/runtime.",
  "Profile sketch only; not parser/runtime.",
  "Static representation only; not API/DB-backed state.",
  "Assignment recommendation is not activation.",
  "Assignment only; not activation.",
  "Registry visibility only; not activation.",
  "Work Packet is not execution.",
  "Route Packet is not route execution.",
  "Validation Report is not approval.",
  "Closeout Packet is not acceptance.",
  "CONTROL_THREAD decides.",
  "ZERO GATES GRANTED.",
] as const;

const workspaceLabels = [
  "PROFILE OBJECT DRAFT ONLY",
  "PROFILE SKETCH ONLY",
  "STATIC REPRESENTATION ONLY",
  "STAGED",
  "RECOMMENDED",
  "PENDING HUMAN APPROVAL",
  "NOT ACTIVATED",
  "NOT DISPATCHED",
  "NOT EXECUTING",
  "COPY HANDOFF",
  "ZERO GATES GRANTED",
] as const;

const profileVocabulary = [
  "work-wave/v0",
  "domain-engine-assignment/v0",
  "agent-assignment-recommendation/v0",
  "agent-activation-request/v0",
  "work-packet/v0",
  "route/v0",
  "validation-report/v0",
  "closeout-packet/v0",
  "repo-lane/v0",
  "agent-domain-engine/v0",
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

const postureDistinctions = [
  {
    label: "Planning",
    statement: "Planning only; not execution.",
  },
  {
    label: "Recommendation",
    statement: "Recommendation only; not routing authority.",
  },
  {
    label: "Request",
    statement: "Request only; not activation.",
  },
  {
    label: "Approval",
    statement: "Validation Report is not approval.",
  },
  {
    label: "Acceptance",
    statement: "Closeout Packet is not acceptance.",
  },
  {
    label: "Execution",
    statement: "ZERO GATES GRANTED.",
  },
] as const;

const profileSketchRows = [
  {
    profile: "domain-engine-assignment/v0",
    localShape: "selected .nexus domain lane + agent-domain-engine/v0 namespace",
    boundary: "Profile sketch only; not parser/runtime.",
  },
  {
    profile: "agent-assignment-recommendation/v0",
    localShape: "staged project Agent candidates + required reviews/gates",
    boundary: "Assignment recommendation is not activation.",
  },
  {
    profile: "agent-activation-request/v0",
    localShape: "blocked future request vocabulary and human approval checkpoint",
    boundary: "Request only; not activation.",
  },
  {
    profile: "work-wave/v0",
    localShape: "Work Packet -> Route Packet -> Validation Report -> Closeout Packet",
    boundary: "Planning only; not execution.",
  },
  {
    profile: "repo-lane/v0",
    localShape: "static repo/domain lane text",
    boundary: "Recommendation only; not routing authority.",
  },
] as const;

const objectDraftKeys = [
  "profile_object_draft_id",
  "object_status",
  "source_route",
  "profile_refs",
  "domain_engine_assignment_v0",
  "agent_assignment_recommendation_v0",
  "agent_activation_request_v0",
  "work_wave_v0",
  "repo_lane_v0",
  "control_thread_acceptance",
  "authority_boundary",
] as const;

const verifierFindings = [
  {
    question: "Object-shape readability",
    finding:
      "Readable with the key list, static profile object draft panel, and JSON-style preview.",
    status: "VERIFIED STATIC",
  },
  {
    question: "Q3M7 vocabulary alignment",
    finding:
      "Object keys align with accepted work-wave, domain-engine-assignment, Agent recommendation, route, validation, closeout, repo-lane, and domain-engine terms.",
    status: "VERIFIED STATIC",
  },
  {
    question: "Activation request posture",
    finding:
      "agent-activation-request/v0 remains blocked_in_v0 with activation_authorized false.",
    status: "BLOCKED IN V0",
  },
  {
    question: "Copy-handoff usefulness",
    finding:
      "Handoff includes profile vocabulary, object-shape context, staged recommendations, work-wave flow, approval checkpoint, blocked capabilities, and closeout visibility.",
    status: "COPY HANDOFF READY",
  },
  {
    question: "Authority rail",
    finding:
      "No label grants parser/runtime, API/DB state, Agent activation, dispatch, execution, receipt creation, canon mutation, route/motion-state mutation, or gate opening.",
    status: "ZERO GATES GRANTED",
  },
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
    approvalNeed: "profile doctrine acceptance",
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
    approvalNeed: "security and rollback evidence review",
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
    approvalNeed: "manual repo execution prompt approval",
    humanCheckpoint: "CONTROL_THREAD reviews generated packets and manually approves repo execution prompts.",
  },
] as const;

type DomainWorkspaceLaneId = (typeof domainWorkspaceLanes)[number]["laneId"];

const workWaveStages = [
  {
    label: "Work Packets",
    profileRef: "work-packet/v0",
    posture: "compose-only scope and task handoff",
    boundary: "Work Packet is not execution.",
  },
  {
    label: "Route Packets",
    profileRef: "route/v0",
    posture: "recommended route and file boundary handoff",
    boundary: "Route Packet is not route execution.",
  },
  {
    label: "Validation Reports",
    profileRef: "validation-report/v0",
    posture: "reported checks and evidence gaps",
    boundary: "Validation Report is not approval.",
  },
  {
    label: "Closeout Packets",
    profileRef: "closeout-packet/v0",
    posture: "summary, risks, and passalong",
    boundary: "Closeout Packet is not acceptance.",
  },
  {
    label: "CONTROL_THREAD Acceptance",
    profileRef: "human-approval checkpoint",
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

function buildProfileObjectDraft(selectedLaneId: string) {
  const lane =
    domainWorkspaceLanes.find((item) => item.laneId === selectedLaneId) ??
    domainWorkspaceLanes[0];
  const engine = findEngine(lane.engine);
  const candidates = candidatesForEngine(lane.engine);

  return {
    profile_object_draft_id: `q3m7-${lane.laneId.toLowerCase()}`,
    object_status: "static_profile_object_draft_only",
    source_route: "/operator/work",
    profile_refs: profileVocabulary,
    domain_engine_assignment_v0: {
      domain: lane.domain,
      agent_domain_engine_v0: lane.engine,
      display_name: engine?.displayName ?? lane.engine,
      repo_lane_v0: lane.repoLane,
      assignment_boundary: "Assignment only; not activation.",
    },
    agent_assignment_recommendation_v0: candidates.map((candidate) => ({
      candidate_id: candidate.candidateId,
      namespace: candidate.namespace,
      role_template: candidate.roleTemplate,
      status: candidate.status,
      required_reviews: candidate.requiredReviews,
      required_gates: candidate.requiredGates,
      boundary: "Assignment recommendation is not activation.",
    })),
    agent_activation_request_v0: {
      status: "blocked_in_v0",
      request_boundary: "Request only; not activation.",
      activation_authorized: false,
    },
    work_wave_v0: {
      lane: lane.workWaveLane,
      stages: workWaveStages.map((stage) => ({
        profile_ref: stage.profileRef,
        label: stage.label,
        posture: stage.posture,
        boundary: stage.boundary,
      })),
    },
    repo_lane_v0: {
      repo_lane: lane.repoLane,
      routing_boundary: "Recommendation only; not routing authority.",
    },
    control_thread_acceptance: {
      required: true,
      approval_need: lane.approvalNeed,
      checkpoint: lane.humanCheckpoint,
      boundary: "CONTROL_THREAD decides.",
    },
    authority_boundary: boundaryPhrases,
  } as const;
}

function buildHandoffPreview(selectedLaneId: string) {
  const lane =
    domainWorkspaceLanes.find((item) => item.laneId === selectedLaneId) ??
    domainWorkspaceLanes[0];
  const engine = findEngine(lane.engine);
  const candidates = candidatesForEngine(lane.engine);
  const recommendations = recommendationsForEngine(lane.engine);
  const profileObjectDraft = buildProfileObjectDraft(selectedLaneId);

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

Profile sketch vocabulary:
${formatList(profileVocabulary)}

Static profile-shape sketch:
${formatList(
  profileSketchRows.map(
    (row) => `${row.profile}: ${row.localShape} / ${row.boundary}`,
  ),
)}

Static profile object draft:
${JSON.stringify(profileObjectDraft, null, 2)}

Verifier review findings:
${formatList(
  verifierFindings.map(
    (finding) => `${finding.question}: ${finding.status} - ${finding.finding}`,
  ),
)}

Planning / recommendation / approval distinctions:
${formatList(postureDistinctions.map((item) => `${item.label}: ${item.statement}`))}

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
${formatList(workWaveStages.map((stage) => `${stage.label} (${stage.profileRef}): ${stage.posture} / ${stage.boundary}`))}

Human approval checkpoint:
${lane.approvalNeed}
${lane.humanCheckpoint}

Copy-handoff checklist:
* Confirm scope and files allowed.
* Confirm files blocked and non-authorizations.
* Confirm validation expectations.
* Confirm closeout requirements.
* Confirm CONTROL_THREAD acceptance remains manual.
* Confirm ZERO GATES GRANTED.

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
  const profileObjectDraft = useMemo(
    () => buildProfileObjectDraft(selectedLaneId),
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

        <OperatorPanel className="space-y-3 bg-slate-950/45">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Planning-to-acceptance posture map
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Compact distinctions for planning, recommendation, request,
                approval, acceptance, and execution boundaries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="composeOnly">HUMAN APPROVAL REQUIRED</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {postureDistinctions.map((item) => (
              <OperatorGateCard key={item.label}>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  {item.label}
                </div>
                <p className="mt-2 text-xs text-slate-300">{item.statement}</p>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

        <OperatorPanel className="space-y-3 bg-slate-950/45">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Static profile sketch vocabulary
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Local display shape only. These labels align the workspace with
                Q3M7 coordination vocabulary without creating parser/runtime
                objects.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">PROFILE SKETCH ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NOT PARSER/RUNTIME</OperatorBadge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profileVocabulary.map((profile) => (
              <OperatorBadge key={profile} tone="readOnly">
                {profile}
              </OperatorBadge>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {profileSketchRows.map((row) => (
              <OperatorGateCard key={row.profile}>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  {row.profile}
                </div>
                <p className="mt-2 text-xs text-slate-300">{row.localShape}</p>
                <p className="mt-3 text-xs text-slate-400">{row.boundary}</p>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

        <OperatorPanel className="space-y-3 bg-slate-950/45">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Static profile object draft
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Local object-shape preview for future profile alignment. It is
                not parsed, persisted, API-backed, or accepted as runtime state.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">PROFILE OBJECT DRAFT ONLY</OperatorBadge>
              <OperatorBadge tone="blocked">NOT API/DB-BACKED STATE</OperatorBadge>
              <OperatorBadge tone="blocked">NOT PARSER/RUNTIME</OperatorBadge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {objectDraftKeys.map((key) => (
              <OperatorBadge key={key} tone="readOnly">
                {key}
              </OperatorBadge>
            ))}
          </div>
          <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
            <OperatorGateCard>
              <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Object boundary
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                <li>- Profile object draft only; not parser/runtime.</li>
                <li>- Static representation only; not API/DB-backed state.</li>
                <li>- Assignment only; not activation.</li>
                <li>- Request only; not activation.</li>
                <li>- CONTROL_THREAD decides.</li>
                <li>- ZERO GATES GRANTED.</li>
              </ul>
            </OperatorGateCard>
            <pre className="max-h-80 overflow-auto rounded border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-200">
              {JSON.stringify(profileObjectDraft, null, 2)}
            </pre>
          </div>
        </OperatorPanel>

        <OperatorPanel className="space-y-3 bg-slate-950/45">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Verifier review summary
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Static review notes for object-shape readability,
                copy-handoff clarity, staged/non-executing semantics, and
                authority-rail correctness.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OperatorBadge tone="readOnly">VERIFIER REVIEW</OperatorBadge>
              <OperatorBadge tone="blocked">NO RUNTIME CHANGE</OperatorBadge>
              <OperatorBadge tone="gated">ZERO GATES GRANTED</OperatorBadge>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {verifierFindings.map((finding) => (
              <OperatorGateCard key={finding.question}>
                <div className="flex flex-wrap gap-1.5">
                  <OperatorBadge
                    tone={
                      finding.status === "BLOCKED IN V0" ? "blocked" : "readOnly"
                    }
                  >
                    {finding.status}
                  </OperatorBadge>
                </div>
                <div className="mt-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                  {finding.question}
                </div>
                <p className="mt-2 text-xs text-slate-300">{finding.finding}</p>
              </OperatorGateCard>
            ))}
          </div>
        </OperatorPanel>

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
                <div className="flex flex-wrap gap-2">
                  <OperatorBadge tone="readOnly">domain-engine-assignment/v0</OperatorBadge>
                  <OperatorBadge tone="readOnly">LOCAL STATE ONLY</OperatorBadge>
                </div>
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
                <OperatorBadge tone="readOnly">repo-lane/v0</OperatorBadge>
                <OperatorBadge tone="readOnly">agent-domain-engine/v0</OperatorBadge>
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
                <OperatorGateCard>
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Human approval checkpoint
                  </div>
                  <p className="mt-2 text-sm text-slate-200">
                    {selectedLane.approvalNeed}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedLane.humanCheckpoint}
                  </p>
                </OperatorGateCard>
                <OperatorGateCard>
                  <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Work/wave lane
                  </div>
                  <p className="mt-2 text-sm text-slate-200">
                    {selectedLane.workWaveLane}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Request only; not activation, routing authority, or
                    execution.
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
                <OperatorBadge tone="readOnly">agent-assignment-recommendation/v0</OperatorBadge>
                <OperatorBadge tone="blocked">agent-activation-request/v0 BLOCKED</OperatorBadge>
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
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                            Required reviews
                          </div>
                          <CompactList items={candidate.requiredReviews} />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                            Required gates
                          </div>
                          <CompactList items={candidate.requiredGates} />
                        </div>
                      </div>
                      <div className="mt-3 border-t border-slate-800 pt-3">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                          Activation boundary
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          {candidate.activationBoundary}
                        </p>
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
                <OperatorBadge tone="readOnly">work-wave/v0</OperatorBadge>
                <OperatorBadge tone="composeOnly">COPY HANDOFF</OperatorBadge>
                <OperatorBadge tone="blocked">NO ROUTE MUTATION</OperatorBadge>
              </div>
              <div className="grid gap-3 md:grid-cols-5">
                {workWaveStages.map((stage) => (
                  <OperatorGateCard key={stage.label}>
                    <OperatorBadge tone="readOnly">{stage.profileRef}</OperatorBadge>
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

              <OperatorGateCard>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
                  Copy-handoff review checklist
                </div>
                <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                  {[
                    "scope and files allowed are explicit",
                    "files blocked and non-authorizations are visible",
                    "validation expectations are review-only",
                    "closeout requirements do not accept themselves",
                    "CONTROL_THREAD acceptance remains manual",
                    "ZERO GATES GRANTED",
                  ].map((item) => (
                    <div key={item}>- {item}</div>
                  ))}
                </div>
              </OperatorGateCard>

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

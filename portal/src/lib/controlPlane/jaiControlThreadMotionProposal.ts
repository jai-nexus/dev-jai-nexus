export const JAI_CONTROL_THREAD_MOTION_PROPOSAL_POSTURE = {
  mode: "APP_LOCAL / LOCAL_STATIC_DISPLAY_DRAFT_METADATA / NON_AUTHORITATIVE",
  exportPosture: "MANUAL_OPERATOR_EXPORT_ONLY",
  controlThreadStatus: "CONTROL_THREAD_REVIEW_REQUIRED",
} as const;

export const MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY = [
  "CONTROL_THREAD remains routing/acceptance/hold authority.",
  "Motion proposal display is not acceptance.",
  "Advisory review is not acceptance.",
  "Council/advisory vote is not binding.",
  "Planning seed is not route execution.",
  "Program/lane proposal is not implementation authorization.",
  "Asset/domain references are candidate references only.",
  "Proposal display does not mutate registry records.",
  "Proposal display does not authorize DNS, registrar, renewal, deployment, public launch, or production gates.",
  "No actual JAI_control_thread runtime activation.",
  "No JAI Council activation.",
  "No JAI Agent activation.",
  "No provider/model/API dispatch.",
  "No GitHub mutation.",
  "No target-repo mutation/import.",
  "No accepted-code import.",
  "No deployment.",
  "No production gates.",
  "No source-of-truth transfer.",
  "No hidden automation.",
  "No timers, polling, or background jobs.",
  "No automatic route execution.",
  "No automatic delivery.",
  "No acceptance authority transfer.",
  "No execution authority transfer.",
] as const;

export const ADVISORY_REVIEW_CANDIDATE_POSTURES = [
  "candidate reviewer",
  "advisory review requested",
  "advisory vote candidate",
  "review pending",
  "review received",
  "disagreement / blocker",
  "consensus candidate",
  "CONTROL_THREAD decision required",
] as const;

export interface EvidenceReference {
  id: string;
  label: string;
  reference: string;
  source_posture: "repo-local" | "route-context-grounded" | "missing";
}

export interface MotionProposalDraft {
  motion_id: string;
  motion_title: string;
  initiating_thread: string;
  operator_request_summary: string;
  proposed_purpose: string;
  scope: string;
  intended_program: string;
  intended_domain: string;
  affected_asset_ids: readonly string[];
  affected_domain_assets: readonly string[];
  affected_domain_concepts: readonly string[];
  affected_engine_groups: readonly string[];
  affected_repos: readonly string[];
  affected_environments: readonly string[];
  proposed_council_reviewers: readonly string[];
  proposed_advisory_agent_roles: readonly string[];
  required_evidence: readonly string[];
  evidence_refs: readonly EvidenceReference[];
  risks: readonly string[];
  blockers: readonly string[];
  non_authorizations: readonly string[];
  requested_control_thread_decision: string;
  recommended_next_planning_seed: string;
  status: string;
  authority_boundary_summary: string;
}

export interface OperatorIntakeDisplay {
  operator_prompt_text_placeholder: string;
  operator_intent_summary: string;
  operator_provided_constraints: readonly string[];
  affected_candidate_references: readonly string[];
  proposed_review_targets: readonly string[];
  evidence_supplied_by_operator: readonly string[];
  missing_evidence: readonly string[];
  draft_only_status: string;
  boundary_copy: readonly string[];
}

export interface CouncilAdvisoryReviewHandoffPreview {
  proposal_id: string;
  proposal_summary: string;
  requested_review_type: string;
  proposed_council_reviewers: readonly string[];
  proposed_advisory_agent_roles: readonly string[];
  review_questions: readonly string[];
  required_evidence: readonly string[];
  risk_questions: readonly string[];
  non_authorizations_to_preserve: readonly string[];
  expected_review_output_shape: readonly string[];
  control_thread_decision_dependency: string;
  boundary_copy: readonly string[];
}

export interface PlanningSeedLaneCandidate {
  lane_id: string;
  thread_target: string;
  repo_target: string;
  scope: string;
  mode: string;
  role: string;
}

export interface MotionToProgramPlanningSeedPreview {
  proposed_program_id: string;
  proposed_program_name: string;
  batch_candidate: string;
  wave_candidate: string;
  lane_candidates: readonly PlanningSeedLaneCandidate[];
  evidence_requirements: readonly string[];
  review_requirements: readonly string[];
  non_authorizations: readonly string[];
  expected_closeout_artifacts: readonly string[];
  boundary_copy: readonly string[];
}

export interface JaiControlThreadMotionProposalSurface {
  posture: typeof JAI_CONTROL_THREAD_MOTION_PROPOSAL_POSTURE;
  operator_intake: OperatorIntakeDisplay;
  motion_proposal_draft: MotionProposalDraft;
  council_advisory_handoff_preview: CouncilAdvisoryReviewHandoffPreview;
  advisory_review_candidate_postures: typeof ADVISORY_REVIEW_CANDIDATE_POSTURES;
  motion_to_program_planning_seed_preview: MotionToProgramPlanningSeedPreview;
  work_waves_taxonomy_mapping: readonly string[];
  asset_domain_registry_relationship: readonly string[];
  authority_boundary_copy: typeof MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY;
}

const repoLocalPlanningEvidence: EvidenceReference = {
  id: "A2",
  label: "JAI Control Thread Motion Proposal Surface Planning v0",
  reference:
    "docs/reference/q3m7-jai-control-thread-motion-proposal-surface-planning-v0.md",
  source_posture: "repo-local",
};

const routeContextEvidence: EvidenceReference = {
  id: "A3-A5",
  label: "A3/A4/A5 accepted baseline",
  reference: "CONTROL_THREAD route context; dedicated repo-local artifacts not required for A7 helper state",
  source_posture: "route-context-grounded",
};

export const OPERATOR_MOTION_PROPOSAL_INTAKE_DISPLAY: OperatorIntakeDisplay = {
  operator_prompt_text_placeholder:
    "Human operator describes a candidate motion request for JAI_control_thread drafting.",
  operator_intent_summary:
    "Draft a governed motion proposal for CONTROL_THREAD review without activating runtime, Council, Agents, providers, GitHub, target repos, deployment, or production gates.",
  operator_provided_constraints: [
    "Human-supervised draft metadata only.",
    "Manual operator export only.",
    "No automatic route execution or delivery.",
    "No provider/model/API dispatch.",
  ],
  affected_candidate_references: [
    "domain-asset-dev-jai-nexus-candidate",
    "domain-concept-dev-jai-nexus-operator",
    "engine-group-frontend-nexus",
    "dev-jai-nexus",
    "environment-dev-jai-nexus-app-local",
  ],
  proposed_review_targets: [
    "JAI Council candidate review",
    "JAI::AUDIT::BOUNDARY_REVIEWER",
    "JAI::DEV::BUILDER",
  ],
  evidence_supplied_by_operator: [
    "A2 planning baseline",
    "A6 asset/domain registry display model",
  ],
  missing_evidence: [
    "CONTROL_THREAD decision receipt",
    "Repo-local A3/A4/A5 source artifacts if later required",
  ],
  draft_only_status: "draft-only; not accepted; not routed",
  boundary_copy: [
    "Operator intake is not parser authority.",
    "Operator intake is not route authority.",
    "Operator intake is not execution authority.",
    "Operator intake is not provider dispatch authority.",
    "Operator intake is not GitHub mutation authority.",
    "Operator intake is not source-of-truth authority.",
  ],
};

export const JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT: MotionProposalDraft = {
  motion_id: "motion-proposal-a7-static-draft-v0",
  motion_title: "JAI Control Thread Motion Proposal Surface",
  initiating_thread: "CONTROL_THREAD / A7",
  operator_request_summary:
    "Prepare a structured, non-authoritative motion proposal draft for Council/advisory review and later CONTROL_THREAD decision.",
  proposed_purpose:
    "Provide a governed display/draft surface for motion proposals without activating JAI_control_thread runtime or advisory agents.",
  scope:
    "Operator prompt/intake display, structured motion proposal preview, Council/advisory handoff preview, advisory vote candidate posture, and motion-to-program planning seed preview.",
  intended_program: "Q3M7Y26 JAI Control Plane Governance and Asset Activation v0",
  intended_domain: "JAI Control Thread / governance surface",
  affected_asset_ids: ["domain-asset-dev-jai-nexus-candidate"],
  affected_domain_assets: ["dev.jai.nexus"],
  affected_domain_concepts: ["domain-concept-dev-jai-nexus-operator"],
  affected_engine_groups: ["engine-group-frontend-nexus", "engine-group-helper-nexus"],
  affected_repos: ["dev-jai-nexus"],
  affected_environments: ["environment-dev-jai-nexus-app-local"],
  proposed_council_reviewers: [
    "Council architecture reviewer candidate",
    "Council governance reviewer candidate",
    "Council boundary reviewer candidate",
  ],
  proposed_advisory_agent_roles: [
    "JAI::CONTROL_THREAD::DRAFT_ASSIST",
    "JAI::AUDIT::BOUNDARY_REVIEWER",
    "JAI::FORMAT::RECEIPT_REVIEWER",
  ],
  required_evidence: [
    "Operator request summary",
    "A2 planning baseline",
    "A6 asset/domain registry display posture",
    "Non-authorization list",
    "CONTROL_THREAD decision receipt before any downstream route",
  ],
  evidence_refs: [repoLocalPlanningEvidence, routeContextEvidence],
  risks: [
    "Advisory review could be mistaken for acceptance.",
    "Planning seed could be mistaken for routed work.",
    "Affected asset references could be mistaken for registry authority.",
  ],
  blockers: [
    "No CONTROL_THREAD acceptance yet.",
    "No Council/advisory review received yet.",
    "No downstream Program/Batch/Wave/Lane route yet.",
  ],
  non_authorizations: [...MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY],
  requested_control_thread_decision:
    "Review draft motion proposal and decide accept, hold, reject, or route to planning.",
  recommended_next_planning_seed:
    "A9 boundary review followed by a CONTROL_THREAD-routed receipt or supervised planning lane if accepted.",
  status: "draft / CONTROL_THREAD review required",
  authority_boundary_summary:
    "Proposal draft is not approval, route execution, implementation authorization, source-of-truth transfer, or production authority.",
};

export const COUNCIL_ADVISORY_REVIEW_HANDOFF_PREVIEW: CouncilAdvisoryReviewHandoffPreview = {
  proposal_id: JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT.motion_id,
  proposal_summary:
    "Candidate handoff for advisory Council/agent review of a structured motion proposal draft.",
  requested_review_type: "advisory governance, boundary, and planning-seed review",
  proposed_council_reviewers:
    JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT.proposed_council_reviewers,
  proposed_advisory_agent_roles:
    JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT.proposed_advisory_agent_roles,
  review_questions: [
    "Is the motion proposal complete enough for CONTROL_THREAD review?",
    "Are affected asset/domain/repo references candidate-only?",
    "Does the planning seed preserve Work/Waves taxonomy boundaries?",
  ],
  required_evidence: JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT.required_evidence,
  risk_questions: [
    "Could advisory vote language be mistaken for acceptance?",
    "Could the planning seed be mistaken for routed work?",
    "Could registry references be mistaken for source-of-truth transfer?",
  ],
  non_authorizations_to_preserve: [...MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY],
  expected_review_output_shape: [
    "advisory findings",
    "risk/blocker list",
    "non-binding vote candidate",
    "CONTROL_THREAD decision recommendation",
  ],
  control_thread_decision_dependency:
    "Council/advisory review cannot bypass CONTROL_THREAD review/accept/hold authority.",
  boundary_copy: [
    "Handoff is candidate/advisory only.",
    "No Council runtime activation.",
    "No JAI Agent activation.",
    "No provider/model/API dispatch.",
    "No binding votes.",
    "No CONTROL_THREAD bypass.",
  ],
};

export const MOTION_TO_PROGRAM_PLANNING_SEED_PREVIEW: MotionToProgramPlanningSeedPreview = {
  proposed_program_id: "q3m7-control-plane-governance-asset-activation-v0",
  proposed_program_name:
    "Q3M7Y26 JAI Control Plane Governance and Asset Activation v0",
  batch_candidate: "A",
  wave_candidate: "A-B",
  lane_candidates: [
    {
      lane_id: "A9",
      thread_target: "CONTROL_THREAD review",
      repo_target: "dev-jai-nexus",
      scope: "JAI Control Thread Motion Proposal Surface Boundary Review v0",
      mode: "REVIEW_ONLY / APP_LOCAL / NON_AUTHORITATIVE",
      role: "JAI::DEV::BUILDER",
    },
    {
      lane_id: "future-receipt-candidate",
      thread_target: "CONTROL_THREAD receipt route",
      repo_target: "dev-jai-nexus",
      scope: "Motion proposal surface acceptance receipt if routed",
      mode: "DOCS_REFERENCE / RECEIPT_ONLY / NO_IMPLEMENTATION",
      role: "JAI::DEV::BUILDER",
    },
  ],
  evidence_requirements: [
    "A7 implementation closeout",
    "focused helper tests",
    "non-authorization scan",
    "CONTROL_THREAD decision receipt before downstream route",
  ],
  review_requirements: [
    "A9 boundary review",
    "CONTROL_THREAD accept/hold/reject decision",
  ],
  non_authorizations: [...MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY],
  expected_closeout_artifacts: [
    "branch",
    "commit",
    "files changed",
    "validation",
    "non-authorization scan",
    "recommended next route",
  ],
  boundary_copy: [
    "Planning seed is not routed work.",
    "Planning seed is not route execution.",
    "Planning seed is not implementation authorization.",
    "Proposal does not create a program, batch, wave, lane, branch, PR, runtime task, deployment, or production gate without separate CONTROL_THREAD route.",
  ],
};

export const JAI_CONTROL_THREAD_MOTION_PROPOSAL_SURFACE: JaiControlThreadMotionProposalSurface = {
  posture: JAI_CONTROL_THREAD_MOTION_PROPOSAL_POSTURE,
  operator_intake: OPERATOR_MOTION_PROPOSAL_INTAKE_DISPLAY,
  motion_proposal_draft: JAI_CONTROL_THREAD_MOTION_PROPOSAL_DRAFT,
  council_advisory_handoff_preview: COUNCIL_ADVISORY_REVIEW_HANDOFF_PREVIEW,
  advisory_review_candidate_postures: ADVISORY_REVIEW_CANDIDATE_POSTURES,
  motion_to_program_planning_seed_preview:
    MOTION_TO_PROGRAM_PLANNING_SEED_PREVIEW,
  work_waves_taxonomy_mapping: [
    "program -> intended_program",
    "batch -> planning seed batch_candidate",
    "wave -> planning seed wave_candidate",
    "lane -> planning seed lane_candidates",
    "thread -> initiating_thread and lane thread_target",
    "repo -> affected_repos and lane repo_target",
    "scope/mode/role -> lane candidate fields",
    "status/evidence/closeout -> draft status, evidence_refs, expected closeout artifacts",
    "CONTROL_THREAD decision posture -> requested_control_thread_decision",
  ],
  asset_domain_registry_relationship: [
    "Affected asset/domain references are candidate references only.",
    "Registry display is not source-of-truth transfer.",
    "Proposal display does not mutate registry records.",
    "Proposal display does not authorize DNS, registrar, renewal, deployment, public launch, or production gates.",
  ],
  authority_boundary_copy: MOTION_PROPOSAL_AUTHORITY_BOUNDARY_COPY,
};

export function buildJaiControlThreadMotionProposalJson(
  surface: JaiControlThreadMotionProposalSurface = JAI_CONTROL_THREAD_MOTION_PROPOSAL_SURFACE,
) {
  return JSON.stringify(surface, null, 2);
}

export function buildJaiControlThreadMotionProposalMarkdown(
  surface: JaiControlThreadMotionProposalSurface = JAI_CONTROL_THREAD_MOTION_PROPOSAL_SURFACE,
) {
  const draft = surface.motion_proposal_draft;
  const handoff = surface.council_advisory_handoff_preview;
  const seed = surface.motion_to_program_planning_seed_preview;

  return [
    `# ${draft.motion_title}`,
    "",
    `Motion id: ${draft.motion_id}`,
    `Status: ${draft.status}`,
    `Initiating thread: ${draft.initiating_thread}`,
    "",
    "## Operator Request",
    draft.operator_request_summary,
    "",
    "## Purpose / Scope",
    draft.proposed_purpose,
    draft.scope,
    "",
    "## Affected References",
    ...draft.affected_domain_assets.map((item) => `- Domain asset: ${item}`),
    ...draft.affected_domain_concepts.map((item) => `- Domain concept: ${item}`),
    ...draft.affected_engine_groups.map((item) => `- Engine group: ${item}`),
    ...draft.affected_repos.map((item) => `- Repo: ${item}`),
    "",
    "## Council / Advisory Handoff",
    `Requested review type: ${handoff.requested_review_type}`,
    ...handoff.proposed_council_reviewers.map((item) => `- Council reviewer: ${item}`),
    ...handoff.proposed_advisory_agent_roles.map((item) => `- Advisory role: ${item}`),
    "",
    "## Motion-To-Program Planning Seed",
    `${seed.proposed_program_id} / ${seed.batch_candidate} / ${seed.wave_candidate}`,
    ...seed.lane_candidates.map(
      (lane) => `- ${lane.lane_id}: ${lane.scope} (${lane.mode}; ${lane.role})`,
    ),
    "",
    "## Non-Authorizations",
    ...surface.authority_boundary_copy.map((item) => `- ${item}`),
  ].join("\n");
}

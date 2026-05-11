import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  DraftWorkPacket,
  DraftWorkPacketSelectionMetadata,
  DraftWorkPacketStatus,
} from "@/lib/agents/workPacketTypes";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";

export const FIRST_OFFICIAL_LOOP_PACKET_ID = "wp-agent-registry-follow-up";

export interface OperatorLoopSelectionCriterion {
  key: string;
  label: string;
  summary: string;
  required: boolean;
  current_candidate_satisfies: boolean;
}

export type LoopCandidateSelectionStatus =
  | "active"
  | "eligible"
  | "deferred"
  | "blocked";

export interface StaticLoopCandidateSwitchingEntry {
  work_packet_id: string;
  selection_status: LoopCandidateSelectionStatus;
  selection_rationale: string;
  metadata_criteria_result: string;
  switching_note: string;
  deliberation_review_href: "/operator/deliberation";
  deliberation_review_note: string;
}

export interface StaticLoopCandidateSwitchingPolicy {
  mode: "static_code_governance_controlled";
  summary: string;
  disallowed: string[];
  review_navigation_note: string;
}

export interface StaticLoopCandidateSwitchingModel {
  active_candidate_id: string;
  eligible_candidate_ids: string[];
  candidates: StaticLoopCandidateSwitchingEntry[];
  switching_policy: StaticLoopCandidateSwitchingPolicy;
}

export interface EligibleCandidateReviewPanel {
  active_candidate_id: string;
  eligible_candidate_ids: string[];
  deferred_candidate_ids: string[];
  blocked_candidate_ids: string[];
  selection_criteria_summary: string;
  switching_policy_summary: string;
  no_selection_mutation_note: string;
}

function criterion(
  key: string,
  label: string,
  summary: string,
  required: boolean,
  current_candidate_satisfies: boolean,
): OperatorLoopSelectionCriterion {
  return { key, label, summary, required, current_candidate_satisfies };
}

export interface OperatorLoopCandidateModel {
  selected_work_packet_id: string;
  deliberation_candidate_id: string;
  candidate_label: string;
  candidate_summary: string;
  selected_status: DraftWorkPacketStatus;
  selected_status_label: string;
  selection_reason: string;
  source_seam: string;
  routing_target: DraftWorkPacket["next_prompt_target"]["target"];
  validation_gate: string;
  human_decision_gate: string;
  authority_boundary: string[];
  assigned_agent_label: string;
  canonical_role_label: string;
  target_repo_full_name: string;
  target_surface_label: string;
  requested_actions: string[];
  selection_criteria: OperatorLoopSelectionCriterion[];
  criteria_summary: string;
  current_candidate_criteria_result: "satisfies_required_criteria";
  static_switching: StaticLoopCandidateSwitchingModel;
  review_panel: EligibleCandidateReviewPanel;
}

export function getFirstOfficialLoopPacket(): DraftWorkPacket {
  const packet = getDraftWorkPackets().find(
    (entry) => entry.packet_id === FIRST_OFFICIAL_LOOP_PACKET_ID,
  );

  if (!packet) {
    throw new Error(
      `First official operator loop packet not found: ${FIRST_OFFICIAL_LOOP_PACKET_ID}`,
    );
  }

  return packet;
}

function statusLabel(status: DraftWorkPacketStatus): string {
  return status.replace(/_/g, " ");
}

function buildAuthorityBoundary(): string[] {
  const authority = getControlPlaneAuthorityPosture();

  return [
    "no provider/model calls",
    "no Agent runtime execution",
    "no branch-write authority",
    "no PR-creation authority",
    "no scheduler",
    "no automation",
    "no API/DB mutation",
    "no hidden persistence",
    "no passalong index",
    "no cross-repo mutation",
    "no docs-nexus mutation",
    "no jai-nexus mutation",
    ...authority.notes.slice(0, 2),
  ];
}

function buildSelectionCriteria(
  metadata: DraftWorkPacketSelectionMetadata,
): OperatorLoopSelectionCriterion[] {
  return [
    criterion(
      "repo_local_preferred",
      "Repo-local preferred",
      "Prefer dev-jai-nexus-local candidates before cross-repo candidates.",
      true,
      metadata.repo_posture === "repo_local",
    ),
    criterion(
      "governance_safe_preferred",
      "Governance-safe preferred",
      "Prefer governance-safe operator seams before implementation-heavy candidates.",
      true,
      metadata.work_class === "governance_safe",
    ),
    criterion(
      "draft_review_only_preferred",
      "Draft/review-only preferred",
      "Prefer view-only, draft-plan, draft-files-preview, or verify actions with no execution enablement.",
      true,
      metadata.requested_action_class === "draft_review_only" ||
        metadata.requested_action_class === "view_only" ||
        metadata.requested_action_class === "preview_only",
    ),
    criterion(
      "validation_gate_required",
      "Validation gate required",
      "Selected candidates must expose clear validation commands.",
      true,
      metadata.has_validation_gate,
    ),
    criterion(
      "human_decision_gate_required",
      "Human decision gate required",
      "Selected candidates must expose a clear human decision gate before any follow-up routing.",
      true,
      metadata.has_human_decision_gate,
    ),
    criterion(
      "no_unauthorized_docs_or_jai_mutation",
      "No unauthorized docs-nexus/jai-nexus mutation",
      "Do not select candidates that imply docs-nexus or jai-nexus mutation unless separately authorized.",
      true,
      metadata.mutation_boundary === "no_mutation",
    ),
    criterion(
      "no_authority_expansion",
      "No authority expansion",
      "No execution, branch-write, PR, provider, scheduler, automation, or mutation authority may be introduced.",
      true,
      metadata.authority_boundary === "planning_review_only",
    ),
    criterion(
      "full_deterministic_chain_required",
      "Full deterministic chain required",
      "Selected candidates must resolve agent, role, repo, surface, source seam, action, allowed output, validation gate, human decision, and next routing target.",
      true,
      metadata.deterministic_chain_complete,
    ),
  ];
}

function satisfiesRequiredCriteria(
  criteria: OperatorLoopSelectionCriterion[],
): boolean {
  return criteria.every(
    (criterion) => !criterion.required || criterion.current_candidate_satisfies,
  );
}

function getSelectionStatus(
  packet: DraftWorkPacket,
  criteria: OperatorLoopSelectionCriterion[],
): LoopCandidateSelectionStatus {
  if (packet.packet_id === FIRST_OFFICIAL_LOOP_PACKET_ID) {
    return "active";
  }

  if (
    satisfiesRequiredCriteria(criteria) &&
    packet.status !== "blocked" &&
    packet.status !== "settled"
  ) {
    return "eligible";
  }

  if (packet.status === "deferred") {
    return "deferred";
  }

  return "blocked";
}

function selectionRationale(
  packet: DraftWorkPacket,
  status: LoopCandidateSelectionStatus,
): string {
  if (status === "active") {
    return "Current default active loop-through candidate selected by settled code/governance control.";
  }

  if (status === "eligible") {
    return "Eligible for future loop-through switching because the packet satisfies the required deterministic selection criteria.";
  }

  if (status === "deferred") {
    return "Deferred as a future loop-through option until seam order, timing, or human-governance readiness changes.";
  }

  return "Not eligible for static switching in the current posture because it remains cross-repo, implementation-heavy, blocked, or otherwise outside the preferred bounded loop criteria.";
}

function criteriaResultLabel(criteria: OperatorLoopSelectionCriterion[]): string {
  const satisfied = criteria.filter(
    (criterion) => criterion.required && criterion.current_candidate_satisfies,
  ).length;
  const required = criteria.filter((criterion) => criterion.required).length;

  return `${satisfied}/${required} required criteria satisfied`;
}

function switchingNote(status: LoopCandidateSelectionStatus): string {
  if (status === "active") {
    return "Active candidate changes only through a later code/governance-controlled seam.";
  }

  if (status === "eligible") {
    return "Eligible candidates may be promoted only by an explicit later code/governance-controlled switch, not by runtime controls.";
  }

  if (status === "deferred") {
    return "Deferred candidates stay visible but cannot become active without an explicit later code/governance-controlled switch.";
  }

  return "Blocked candidates remain excluded from switching until a later code/governance seam changes the bounded conditions.";
}

function deliberationReviewNote(status: LoopCandidateSelectionStatus): string {
  if (status === "active") {
    return "Review navigation opens deliberation context only and keeps this already-active candidate unchanged.";
  }

  if (status === "eligible") {
    return "Review navigation opens deliberation context only and does not promote this eligible candidate to active.";
  }

  if (status === "deferred") {
    return "Review navigation opens deliberation context only and does not change deferred candidate status.";
  }

  return "Review navigation opens deliberation context only and does not change blocked candidate status.";
}

const DELIBERATION_REVIEW_HREF = "/operator/deliberation" as const;

function buildStaticSwitchingModel(): StaticLoopCandidateSwitchingModel {
  const candidates = getDraftWorkPackets().map((packet) => {
    const criteria = buildSelectionCriteria(packet.selection_metadata);
    const selection_status = getSelectionStatus(packet, criteria);

    return {
      work_packet_id: packet.packet_id,
      selection_status,
      selection_rationale: selectionRationale(packet, selection_status),
      metadata_criteria_result: criteriaResultLabel(criteria),
      switching_note: switchingNote(selection_status),
      deliberation_review_href: DELIBERATION_REVIEW_HREF,
      deliberation_review_note: deliberationReviewNote(selection_status),
    };
  });

  return {
    active_candidate_id: FIRST_OFFICIAL_LOOP_PACKET_ID,
    eligible_candidate_ids: candidates
      .filter((candidate) => candidate.selection_status === "eligible")
      .map((candidate) => candidate.work_packet_id),
    candidates,
    switching_policy: {
      mode: "static_code_governance_controlled",
      summary:
        "Loop-through candidate switching remains static/local and may change only through an explicit code-and-governance-controlled seam.",
      disallowed: [
        "runtime operator controls",
        "query or route state switching",
        "API mutation",
        "persistence or passalong index",
        "ranking or scoring engine",
      ],
      review_navigation_note:
        "Agenda-to-deliberation movement is navigation/context only. It does not mutate selected-candidate state, route state, query state, or persistence.",
    },
  };
}

export function getOperatorLoopCandidate(): OperatorLoopCandidateModel {
  const packet = getFirstOfficialLoopPacket();
  const selection_criteria = buildSelectionCriteria(packet.selection_metadata);
  const static_switching = buildStaticSwitchingModel();
  const review_panel: EligibleCandidateReviewPanel = {
    active_candidate_id: static_switching.active_candidate_id,
    eligible_candidate_ids: static_switching.eligible_candidate_ids,
    deferred_candidate_ids: static_switching.candidates
      .filter((candidate) => candidate.selection_status === "deferred")
      .map((candidate) => candidate.work_packet_id),
    blocked_candidate_ids: static_switching.candidates
      .filter((candidate) => candidate.selection_status === "blocked")
      .map((candidate) => candidate.work_packet_id),
    selection_criteria_summary:
      "Repo-local preferred, governance-safe preferred, draft/review-only preferred, validation-gated, human-gated, non-mutating, and authority-disabled.",
    switching_policy_summary: static_switching.switching_policy.summary,
    no_selection_mutation_note:
      static_switching.switching_policy.review_navigation_note,
  };

  return {
    selected_work_packet_id: packet.packet_id,
    deliberation_candidate_id: `candidate-${packet.packet_id}`,
    candidate_label: packet.title,
    candidate_summary: packet.summary,
    selected_status: packet.status,
    selected_status_label: statusLabel(packet.status),
    selection_reason:
      "Selected as the first official deterministic operator-loop proof because it is repo-local to jai-nexus/dev-jai-nexus, governance-safe, draft-only, and human-gated.",
    source_seam: packet.source.label,
    routing_target: packet.next_prompt_target.target,
    validation_gate:
      packet.verification_commands.join(" | ") || "No verification commands listed.",
    human_decision_gate:
      packet.human_gates[0] ?? "Human operator review remains required.",
    authority_boundary: buildAuthorityBoundary(),
    assigned_agent_label: packet.agent.label,
    canonical_role_label:
      packet.canonical_role.canonical_role_label ??
      `palette draft only: ${packet.agent.label}`,
    target_repo_full_name: packet.target.repo_full_name,
    target_surface_label: packet.target.surface.label,
    requested_actions: packet.requested_actions,
    selection_criteria,
    criteria_summary:
      "Future loop-through candidates must stay repo-local preferred, governance-safe, draft/review-only, validation-gated, human-gated, non-mutating, and authority-disabled.",
    current_candidate_criteria_result: "satisfies_required_criteria",
    static_switching,
    review_panel,
  };
}

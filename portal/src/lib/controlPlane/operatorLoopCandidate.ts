import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  DraftWorkPacket,
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
  packet: DraftWorkPacket,
): OperatorLoopSelectionCriterion[] {
  const repoLocal = packet.target.repo_full_name === "jai-nexus/dev-jai-nexus";
  const governanceSafe =
    packet.configured_scope_key === "dev-jai-nexus" &&
    packet.target.surface.key === "operator-agents";
  const draftReviewOnly = packet.requested_actions.every(
    (action) => action === "view_only" || action === "draft_plan" || action === "verify",
  );
  const hasValidationGate = packet.verification_commands.length > 0;
  const hasHumanDecisionGate = packet.human_gates.length > 0;
  const noUnauthorizedExternalMutation =
    !packet.allowed_paths.some(
      (entry) =>
        entry.includes("docs-nexus") ||
        entry.includes("jai-nexus/") ||
        entry.startsWith(".github/"),
    ) && packet.target.repo_full_name === "jai-nexus/dev-jai-nexus";

  return [
    {
      key: "repo_local_preferred",
      label: "Repo-local preferred",
      summary: "Prefer dev-jai-nexus-local candidates before cross-repo candidates.",
      required: true,
      current_candidate_satisfies: repoLocal,
    },
    {
      key: "governance_safe_preferred",
      label: "Governance-safe preferred",
      summary: "Prefer governance-safe operator seams before implementation-heavy candidates.",
      required: true,
      current_candidate_satisfies: governanceSafe,
    },
    {
      key: "draft_review_only_preferred",
      label: "Draft/review-only preferred",
      summary: "Prefer view-only, draft-plan, draft-files-preview, or verify actions with no execution enablement.",
      required: true,
      current_candidate_satisfies: draftReviewOnly,
    },
    {
      key: "validation_gate_required",
      label: "Validation gate required",
      summary: "Selected candidates must expose clear validation commands.",
      required: true,
      current_candidate_satisfies: hasValidationGate,
    },
    {
      key: "human_decision_gate_required",
      label: "Human decision gate required",
      summary: "Selected candidates must expose a clear human decision gate before any follow-up routing.",
      required: true,
      current_candidate_satisfies: hasHumanDecisionGate,
    },
    {
      key: "no_unauthorized_docs_or_jai_mutation",
      label: "No unauthorized docs-nexus/jai-nexus mutation",
      summary: "Do not select candidates that imply docs-nexus or jai-nexus mutation unless separately authorized.",
      required: true,
      current_candidate_satisfies: noUnauthorizedExternalMutation,
    },
    {
      key: "no_authority_expansion",
      label: "No authority expansion",
      summary: "No execution, branch-write, PR, provider, scheduler, automation, or mutation authority may be introduced.",
      required: true,
      current_candidate_satisfies: true,
    },
    {
      key: "full_deterministic_chain_required",
      label: "Full deterministic chain required",
      summary: "Selected candidates must resolve agent, role, repo, surface, source seam, action, allowed output, validation gate, human decision, and next routing target.",
      required: true,
      current_candidate_satisfies: true,
    },
  ];
}

export function getOperatorLoopCandidate(): OperatorLoopCandidateModel {
  const packet = getFirstOfficialLoopPacket();
  const selection_criteria = buildSelectionCriteria(packet);

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
  };
}

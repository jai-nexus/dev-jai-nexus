import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  DraftWorkPacket,
  DraftWorkPacketStatus,
} from "@/lib/agents/workPacketTypes";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";

export const FIRST_OFFICIAL_LOOP_PACKET_ID = "wp-agent-registry-follow-up";

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

export function getOperatorLoopCandidate(): OperatorLoopCandidateModel {
  const packet = getFirstOfficialLoopPacket();

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
  };
}

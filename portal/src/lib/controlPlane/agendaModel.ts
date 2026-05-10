import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  DraftWorkPacket,
  DraftWorkPacketAction,
  DraftWorkPacketStatus,
} from "@/lib/agents/workPacketTypes";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";
import { FIRST_OFFICIAL_LOOP_PACKET_ID } from "@/lib/controlPlane/operatorLoopCandidate";

export interface DeterministicAgendaAuthorityPosture {
  execution_blocked: true;
  branch_write_disabled: true;
  propose_pr_disabled: true;
  execute_runtime_disabled: true;
}

export interface DeterministicAgendaChainCoverage {
  assigned_agent_label: string;
  canonical_role_label: string;
  target_repo_full_name: string;
  target_surface_label: string;
  source_label: string;
  source_motion_id: string | null;
  allowed_output: string;
  validation_gate_summary: string;
  human_decision_summary: string;
  selection_metadata_summary: string;
}

export interface DeterministicAgendaItem {
  packet: DraftWorkPacket;
  authority_posture: DeterministicAgendaAuthorityPosture;
  chain: DeterministicAgendaChainCoverage;
  is_first_official_loop_candidate: boolean;
}

export interface DeterministicAgendaSummary {
  total_items: number;
  status_counts: Record<DraftWorkPacketStatus, number>;
  requested_action_counts: Record<DraftWorkPacketAction, number>;
  repo_count: number;
  surface_count: number;
}

export interface DeterministicAgendaModel {
  summary: DeterministicAgendaSummary;
  items: DeterministicAgendaItem[];
  first_official_loop_candidate: DeterministicAgendaItem;
}

const FIXED_AUTHORITY_POSTURE: DeterministicAgendaAuthorityPosture = {
  execution_blocked: true,
  branch_write_disabled: true,
  propose_pr_disabled: true,
  execute_runtime_disabled: true,
};

function buildAllowedOutput(packet: DraftWorkPacket): string {
  const actionLabels = packet.requested_actions.join(", ");
  return `Deterministic planning/review output only: ${actionLabels}. No repository mutation, no runtime execution, and no PR proposal.`;
}

function buildValidationGateSummary(packet: DraftWorkPacket): string {
  return packet.verification_commands.length > 0
    ? packet.verification_commands.join(" | ")
    : "No verification commands listed.";
}

function buildHumanDecisionSummary(packet: DraftWorkPacket): string {
  return packet.human_gates.length > 0
    ? packet.human_gates[0]
    : "Human operator review remains required.";
}

function buildItem(packet: DraftWorkPacket): DeterministicAgendaItem {
  return {
    packet,
    authority_posture: { ...FIXED_AUTHORITY_POSTURE },
    is_first_official_loop_candidate:
      packet.packet_id === FIRST_OFFICIAL_LOOP_PACKET_ID,
    chain: {
      assigned_agent_label: packet.agent.label,
      canonical_role_label:
        packet.canonical_role.canonical_role_label ??
        `palette draft only: ${packet.agent.label}`,
      target_repo_full_name: packet.target.repo_full_name,
      target_surface_label: packet.target.surface.label,
      source_label: packet.source.label,
      source_motion_id: packet.source.motion_id ?? null,
      allowed_output: buildAllowedOutput(packet),
      validation_gate_summary: buildValidationGateSummary(packet),
      human_decision_summary: buildHumanDecisionSummary(packet),
      selection_metadata_summary: [
        `repo posture: ${packet.selection_metadata.repo_posture}`,
        `work class: ${packet.selection_metadata.work_class}`,
        `action class: ${packet.selection_metadata.requested_action_class}`,
        `mutation boundary: ${packet.selection_metadata.mutation_boundary}`,
        `chain complete: ${packet.selection_metadata.deterministic_chain_complete ? "yes" : "no"}`,
      ].join(" | "),
    },
  };
}

function buildSummary(items: DeterministicAgendaItem[]): DeterministicAgendaSummary {
  const status_counts: Record<DraftWorkPacketStatus, number> = {
    draft: 0,
    ready_for_review: 0,
    blocked: 0,
    deferred: 0,
    settled: 0,
  };
  const requested_action_counts: Record<DraftWorkPacketAction, number> = {
    view_only: 0,
    draft_plan: 0,
    draft_files_preview: 0,
    verify: 0,
  };

  for (const item of items) {
    status_counts[item.packet.status] += 1;
    for (const action of item.packet.requested_actions) {
      requested_action_counts[action] += 1;
    }
  }

  return {
    total_items: items.length,
    status_counts,
    requested_action_counts,
    repo_count: new Set(items.map((item) => item.packet.target.repo_full_name)).size,
    surface_count: new Set(items.map((item) => item.packet.target.surface.key)).size,
  };
}

export function getDeterministicAgendaModel(): DeterministicAgendaModel {
  const packets = getDraftWorkPackets();
  const authorityPosture = getControlPlaneAuthorityPosture();

  void authorityPosture;

  const items = packets.map(buildItem);
  const first_official_loop_candidate = items.find(
    (item) => item.is_first_official_loop_candidate,
  );

  if (!first_official_loop_candidate) {
    throw new Error(
      `First official loop candidate not found in deterministic agenda: ${FIRST_OFFICIAL_LOOP_PACKET_ID}`,
    );
  }

  return {
    summary: buildSummary(items),
    items,
    first_official_loop_candidate,
  };
}

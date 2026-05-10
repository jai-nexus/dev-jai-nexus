import type {
  DeliberationCandidate,
  DeliberationPanelModel,
  DeliberationTranscriptTurn,
} from "@/lib/agents/deliberationTypes";
import { getDeterministicAgendaModel } from "@/lib/controlPlane/agendaModel";
import { getControlPlaneAuthorityPosture } from "@/lib/controlPlane/authorityPosture";

export interface DeliberationPassalongSummary {
  reviewed_motion_or_seam: string;
  selected_packet_id: string | null;
  selected_assigned_agent_label: string | null;
  selected_canonical_role_label: string | null;
  selected_target_repo_full_name: string | null;
  selected_target_surface_label: string | null;
  selected_source_label: string | null;
  selected_requested_actions: string[];
  selected_validation_gate: string | null;
  selected_human_decision_gate: string | null;
  participant_role_summary: string[];
  posture_summary: {
    support: number;
    caution: number;
    defer_or_hold: number;
    recommendation: string;
  };
  evidence_basis_summary: string[];
  strongest_dissent_or_caution: string;
  arbiter_synthesis: string;
  recommended_next_target: "CONTROL_THREAD" | "REPO_EXECUTION" | "ORCHESTRATOR";
  recommended_next_action: string;
  authority_boundary: string[];
  copy_text: string;
}

const CAUTION_PRIORITY = [
  "JAI Challenger",
  "JAI Verifier",
  "JAI Operator",
  "JAI Librarian",
  "JAI Architect",
  "JAI Builder",
  "JAI Proposer",
  "JAI Arbiter",
];

function getRecommendedCandidate(panel: DeliberationPanelModel): DeliberationCandidate {
  const candidate = panel.candidates.find(
    (entry) =>
      entry.candidate_id === panel.transcript_session.recommendation.recommended_candidate_id,
  );

  if (!candidate) {
    throw new Error(
      `Recommended deliberation candidate not found: ${panel.transcript_session.recommendation.recommended_candidate_id}`,
    );
  }

  return candidate;
}

function getAgentTurns(panel: DeliberationPanelModel): DeliberationTranscriptTurn[] {
  return panel.transcript_session.turns.filter((turn) => turn.speaker_kind === "agent");
}

function pickStrongestCaution(turns: DeliberationTranscriptTurn[]): string {
  const cautionTurns = turns.filter((turn) => turn.dissent_or_caution);
  if (cautionTurns.length === 0) {
    return "No strong dissent was raised beyond the standing advisory-only and authority-boundary cautions.";
  }

  const ordered = [...cautionTurns].sort((left, right) => {
    const leftPriority = CAUTION_PRIORITY.indexOf(left.speaker_label);
    const rightPriority = CAUTION_PRIORITY.indexOf(right.speaker_label);
    const normalizedLeft = leftPriority === -1 ? CAUTION_PRIORITY.length : leftPriority;
    const normalizedRight = rightPriority === -1 ? CAUTION_PRIORITY.length : rightPriority;
    if (normalizedLeft !== normalizedRight) {
      return normalizedLeft - normalizedRight;
    }

    return left.order - right.order;
  });

  const selected = ordered[0];
  return `${selected.speaker_label}: ${selected.dissent_or_caution}`;
}

function getArbiterSynthesis(turns: DeliberationTranscriptTurn[]): string {
  const arbiterTurn = turns.find((turn) => turn.speaker_label === "JAI Arbiter");
  if (!arbiterTurn) {
    return "No arbiter synthesis turn is available in this deterministic session.";
  }

  return arbiterTurn.statement.join(" ");
}

function getRecommendedTarget(
  candidate: DeliberationCandidate,
): DeliberationPassalongSummary["recommended_next_target"] {
  if (candidate.source_kind === "work_packet") {
    return "REPO_EXECUTION";
  }

  if (candidate.planned_toolchain_target) {
    return "ORCHESTRATOR";
  }

  return "CONTROL_THREAD";
}

function getRecommendedNextAction(
  target: DeliberationPassalongSummary["recommended_next_target"],
  candidate: DeliberationCandidate,
): string {
  if (target === "REPO_EXECUTION") {
    return `Prepare a bounded repo-execution prompt for ${candidate.title} that preserves copy-only, authority-disabled posture until separately authorized.`;
  }

  if (target === "ORCHESTRATOR") {
    return `Package ${candidate.title} as a planning-only next-step comparison for planned toolchain or future seam routing, without implying integration or execution.`;
  }

  return `Prepare a CONTROL_THREAD passalong for ${candidate.title} that names the bounded next seam, visible cautions, and authority-disabled posture.`;
}

function buildAuthorityBoundary(): string[] {
  const authority = getControlPlaneAuthorityPosture();
  return [
    "deterministic/read-only/copy-only",
    "no provider/model calls",
    "no runtime execution",
    "no branch write",
    "no PR creation",
    "no scheduler",
    "no automation",
    "no API/DB mutation",
    "no hidden persistence",
    ...authority.notes.slice(0, 2),
  ];
}

export function buildDeliberationPassalongSummary(
  panel: DeliberationPanelModel,
): DeliberationPassalongSummary {
  const candidate = getRecommendedCandidate(panel);
  const agenda = getDeterministicAgendaModel();
  const selectedAgendaItem =
    candidate.source_kind === "work_packet"
      ? agenda.items.find(
          (item) => `candidate-${item.packet.packet_id}` === candidate.candidate_id,
        ) ?? null
      : null;
  const turns = getAgentTurns(panel);
  const participant_role_summary = turns.map(
    (turn) => `${turn.speaker_label}: ${turn.role_lens}`,
  );
  const evidence_basis_summary = Array.from(
    new Set(turns.flatMap((turn) => turn.evidence_basis)),
  );
  const strongest_dissent_or_caution = pickStrongestCaution(turns);
  const arbiter_synthesis = getArbiterSynthesis(turns);
  const recommended_next_target = getRecommendedTarget(candidate);
  const recommended_next_action = getRecommendedNextAction(
    recommended_next_target,
    candidate,
  );
  const authority_boundary = buildAuthorityBoundary();
  const posture_summary = {
    support: panel.transcript_session.consensus_summary.support,
    caution: panel.transcript_session.consensus_summary.support_with_caution,
    defer_or_hold:
      panel.transcript_session.consensus_summary.defer +
      panel.transcript_session.consensus_summary.out_of_scope,
    recommendation: panel.transcript_session.recommendation.recommended_title,
  };

  const reviewed_motion_or_seam = `${candidate.source_label} - ${candidate.title}`;
  const selected_packet_id = selectedAgendaItem?.packet.packet_id ?? null;
  const selected_assigned_agent_label = selectedAgendaItem?.packet.agent.label ?? null;
  const selected_canonical_role_label =
    selectedAgendaItem?.packet.canonical_role.canonical_role_label ??
    (selectedAgendaItem ? `palette draft only: ${selectedAgendaItem.packet.agent.label}` : null);
  const selected_target_repo_full_name =
    selectedAgendaItem?.packet.target.repo_full_name ?? candidate.target.repo_full_name;
  const selected_target_surface_label =
    selectedAgendaItem?.packet.target.surface.label ?? candidate.target.surface.label;
  const selected_source_label = selectedAgendaItem?.packet.source.label ?? candidate.source_label;
  const selected_requested_actions =
    selectedAgendaItem?.packet.requested_actions ?? candidate.requested_actions;
  const selected_validation_gate =
    selectedAgendaItem?.chain.validation_gate_summary ??
    (candidate.verification_commands[0] ?? null);
  const selected_human_decision_gate =
    selectedAgendaItem?.chain.human_decision_summary ?? (candidate.human_gates[0] ?? null);

  const copy_text = [
    "PASSALONG - /operator/deliberation - CONTROL_THREAD",
    "",
    "Scope:",
    `- reviewed motion/seam: ${reviewed_motion_or_seam}`,
    `- selected work packet id: ${selected_packet_id ?? "none"}`,
    `- assigned agent: ${selected_assigned_agent_label ?? "none"}`,
    `- canonical role: ${selected_canonical_role_label ?? "none"}`,
    `- target repo: ${selected_target_repo_full_name}`,
    `- target surface: ${selected_target_surface_label}`,
    `- source seam: ${selected_source_label}`,
    `- requested actions: ${selected_requested_actions.join(", ")}`,
    "- deliberation mode: deterministic, advisory-only transcript",
    `- participants: ${turns.map((turn) => turn.speaker_label).join(", ")}`,
    "",
    "Posture:",
    `- support: ${posture_summary.support}`,
    `- caution: ${posture_summary.caution}`,
    `- defer/hold: ${posture_summary.defer_or_hold}`,
    `- recommendation: ${posture_summary.recommendation}`,
    "",
    "Evidence basis:",
    ...evidence_basis_summary.map((basis) => `- ${basis}`),
    `- validation gate: ${selected_validation_gate ?? "none"}`,
    `- human decision gate: ${selected_human_decision_gate ?? "none"}`,
    "",
    "Strongest dissent / caution:",
    `- ${strongest_dissent_or_caution}`,
    "",
    "Arbiter synthesis:",
    `- ${arbiter_synthesis}`,
    "",
    "Authority boundary:",
    ...authority_boundary.map((line) => `- ${line}`),
    "",
    "Recommended next routing:",
    `- target: ${recommended_next_target}`,
    `- next action: ${recommended_next_action}`,
  ].join("\n");

  return {
    reviewed_motion_or_seam,
    selected_packet_id,
    selected_assigned_agent_label,
    selected_canonical_role_label,
    selected_target_repo_full_name,
    selected_target_surface_label,
    selected_source_label,
    selected_requested_actions,
    selected_validation_gate,
    selected_human_decision_gate,
    participant_role_summary,
    posture_summary,
    evidence_basis_summary,
    strongest_dissent_or_caution,
    arbiter_synthesis,
    recommended_next_target,
    recommended_next_action,
    authority_boundary,
    copy_text,
  };
}

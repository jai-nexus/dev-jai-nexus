import { getAgentDeliberationPanel } from "@/lib/agents/deliberationPanel";
import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  ConversationRecord,
  ConversationSourceKind,
} from "@/lib/continuity/types";

const CAPTURE_DATE = "2026-04-28";
const CAPTURED_AT = "2026-04-28T14:00:00.000Z";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function buildConversationArtifactId(
  date: string,
  source: string,
  topic: string,
) {
  return `${date}__${source}__${slugify(topic)}`;
}

export function getConversationSourceKindLabel(sourceKind: ConversationSourceKind) {
  if (sourceKind === "imported_archive") return "Imported archive";
  if (sourceKind === "operator_deliberation") return "Operator deliberation";
  if (sourceKind === "repo_execution") return "Repo execution";
  if (sourceKind === "control_thread") return "Control thread";
  return "Manual capture";
}

export function getSeededConversationRecords(): ConversationRecord[] {
  const panel = getAgentDeliberationPanel();
  const recommendation = panel.transcript_session.recommendation;
  const recommendedCandidate = panel.candidates.find(
    (candidate) => candidate.candidate_id === recommendation.recommended_candidate_id,
  );
  const packets = getDraftWorkPackets();
  const relatedPacket = packets.find(
    (packet) => `candidate-${packet.packet_id}` === recommendation.recommended_candidate_id,
  );

  if (!recommendedCandidate) {
    throw new Error(
      `Recommended deliberation candidate not found: ${recommendation.recommended_candidate_id}`,
    );
  }

  const artifactId = buildConversationArtifactId(
    CAPTURE_DATE,
    "operator-deliberation",
    recommendedCandidate.title,
  );

  return [
    {
      chat_id: artifactId,
      title: `Operator deliberation transcript: ${recommendedCandidate.title}`,
      source_kind: "operator_deliberation",
      source_label: "/operator/deliberation transcript session",
      repo_full_name: recommendedCandidate.target.repo_full_name,
      surface_label: recommendedCandidate.target.surface.label,
      related_motion_ids: ["motion-0169", "motion-0170"],
      related_wave_ids: ["wave-q2m4-customer-portal-intake"],
      related_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
      related_candidate_ids: [recommendedCandidate.candidate_id],
      status: "captured",
      captured_at: CAPTURED_AT,
      artifact_path_preview: `.nexus/chats/${artifactId}.md`,
      summary:
        "Captured transcript record for the current best-next-motion recommendation from the operator deliberation session.",
      decisions: [
        `Recommended next motion title: ${recommendation.suggested_motion_title}.`,
        `Target repo and surface: ${recommendedCandidate.target.repo_full_name} / ${recommendedCandidate.target.surface.label}.`,
        "Next-step output remains copy-only and non-binding.",
      ],
      risks: [
        "No execution authority is implied by this capture.",
        "Wave planning must stay read-only and repo-native in v0.",
      ],
      tasks: [
        "Carry the recommended candidate into a wave plan with nh_id hierarchy.",
        "Preserve the prompt as copy-only guidance for a later operator-authorized motion.",
      ],
      next_prompts: [
        recommendation.prompt_text,
      ],
    },
  ];
}

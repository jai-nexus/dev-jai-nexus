import { getAgentDeliberationPanel } from "@/lib/agents/deliberationPanel";
import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import type {
  ConversationRecord,
  ConversationSourceKind,
} from "@/lib/continuity/types";

const CAPTURE_DATE = "2026-04-28";
const CAPTURED_AT = "2026-04-28T14:00:00.000Z";
const PLANNING_CAPTURED_AT = "2026-04-28T15:10:00.000Z";

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

export function getConversationArtifactPath(chatId: string) {
  return `.nexus/chats/${chatId}.md`;
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
  const planningArtifactId = buildConversationArtifactId(
    CAPTURE_DATE,
    "repo-planning",
    "customer-portal-intake-planning",
  );
  const repoPassalongPrompt = [
    "# Repo-facing passalong for jai-nexus",
    "",
    "Target repo: jai-nexus/jai-nexus",
    "Target surfaces: customer portal / customer console",
    "Planning status: motion-0172 planning only",
    "",
    "Requested next seam:",
    "- convert the current intake planning spine into a jai-nexus execution-scoped motion after operator review",
    "",
    "Required repo framing:",
    "- public-site entry should be considered from jai-nexus/apps/web",
    "- direct customer-console entry should be considered from jai-nexus/apps/app",
    "- customer portal remains a surface/product lane, not a standalone repo",
    "",
    "Planning constraints:",
    "- do not implement Stripe in this planning handoff",
    "- do not implement auth/provider/session middleware in this planning handoff",
    "- do not add DB schema or API routes in this planning handoff",
    "- treat workspace and project creation as conceptual first-session flow only",
    "",
    "Expected first-session thesis:",
    "- visitor/prospect reaches a public-site CTA or direct console entry",
    "- account creation/login will eventually gate the customer console",
    "- user creates or joins a workspace",
    "- user creates a first project and enters the project workspace",
    "- JAI assistant rail suggests the next recommended action",
    "",
    "Operator guardrail: Do not execute unless separately authorized by the operator.",
  ].join("\n");

  return [
    {
      chat_id: artifactId,
      title: `Operator deliberation transcript: ${recommendedCandidate.title}`,
      source_kind: "operator_deliberation",
      source_label: "/operator/deliberation transcript session",
      repo_full_name: recommendedCandidate.target.repo_full_name,
      surface_label: recommendedCandidate.target.surface.label,
      related_motion_ids: ["motion-0169", "motion-0170", "motion-0171"],
      related_wave_ids: ["wave-q2m4-customer-portal-intake"],
      related_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
      related_candidate_ids: [recommendedCandidate.candidate_id],
      status: "captured",
      captured_at: CAPTURED_AT,
      artifact_path_preview: getConversationArtifactPath(artifactId),
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
    {
      chat_id: planningArtifactId,
      title: "Repo planning continuity: customer portal intake planning",
      source_kind: "control_thread",
      source_label: "repo planning continuity capture",
      repo_full_name: recommendedCandidate.target.repo_full_name,
      surface_label: recommendedCandidate.target.surface.label,
      related_motion_ids: ["motion-0169", "motion-0170", "motion-0171", "motion-0172"],
      related_wave_ids: ["wave-q2m4-customer-portal-intake"],
      related_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
      related_candidate_ids: [recommendedCandidate.candidate_id],
      status: "captured",
      captured_at: PLANNING_CAPTURED_AT,
      artifact_path_preview: getConversationArtifactPath(planningArtifactId),
      summary:
        "Repo-facing planning capture that refines the customer portal intake wave into a structured handoff for a later jai-nexus execution seam.",
      decisions: [
        "jai-nexus/jai-nexus remains the actual repo for both public-site and customer-console surfaces.",
        "Customer portal and customer console are treated as product/surface lanes, not standalone repos.",
        "Current seam remains planning-only and does not authorize implementation in jai-nexus.",
      ],
      risks: [
        "Billing and auth assumptions are still planning inputs, not executable implementation decisions.",
        "Workspace/project planning must not be mistaken for DB or API authority.",
      ],
      tasks: [
        "Refine the customer portal intake wave hierarchy and explicit deferrals.",
        "Carry forward a repo-facing passalong prompt for a future jai-nexus execution motion.",
      ],
      next_prompts: [repoPassalongPrompt],
    },
  ];
}

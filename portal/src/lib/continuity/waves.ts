import { getAgentDeliberationPanel } from "@/lib/agents/deliberationPanel";
import { getDraftWorkPackets } from "@/lib/agents/workPackets";
import { getSeededConversationRecords } from "@/lib/continuity/conversations";
import type { WavePlan } from "@/lib/continuity/types";

export function getWaveArtifactPaths(waveId: string) {
  return {
    wave_yaml: `.nexus/waves/${waveId}/wave.yaml`,
    plan_md: `.nexus/waves/${waveId}/plan.md`,
  };
}

export function getSeededWavePlans(): WavePlan[] {
  const panel = getAgentDeliberationPanel();
  const recommendation = panel.transcript_session.recommendation;
  const recommendedCandidate = panel.candidates.find(
    (candidate) => candidate.candidate_id === recommendation.recommended_candidate_id,
  );
  const packets = getDraftWorkPackets();
  const relatedPacket = packets.find(
    (packet) => `candidate-${packet.packet_id}` === recommendation.recommended_candidate_id,
  );
  const conversations = getSeededConversationRecords();
  const relatedConversation = conversations[0];

  if (!recommendedCandidate) {
    throw new Error(
      `Recommended deliberation candidate not found: ${recommendation.recommended_candidate_id}`,
    );
  }

  return [
    {
      wave_id: "wave-q2m4-customer-portal-intake",
      title: "Q2M4 customer portal intake continuity wave",
      status: "planned",
      repo_full_name: recommendedCandidate.target.repo_full_name,
      surface_label: recommendedCandidate.target.surface.label,
      project_label: recommendedCandidate.target.project?.name ?? null,
      related_motion_ids: ["motion-0169", "motion-0170", "motion-0171"],
      related_chat_ids: [relatedConversation.chat_id],
      related_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
      related_candidate_ids: [recommendedCandidate.candidate_id],
      deliberation_route: "/operator/deliberation",
      next_prompt_preview: recommendation.prompt_text,
      artifact_path_preview: getWaveArtifactPaths("wave-q2m4-customer-portal-intake"),
      nodes: [
        {
          nh_id: "0.0",
          title: "Context and framing",
          status: "planned",
          summary:
            "Capture the deliberation transcript outcome as the planning spine for the next customer portal motion.",
          linked_motion_ids: ["motion-0169", "motion-0170", "motion-0171"],
          linked_chat_ids: [relatedConversation.chat_id],
          linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
          linked_candidate_ids: [recommendedCandidate.candidate_id],
          acceptance_notes: [
            "Transcript capture is durable and navigable.",
            "Operator authorization remains required before execution.",
          ],
          children: [],
        },
        {
          nh_id: "1.0",
          title: "Target surface model",
          status: "planned",
          summary:
            "Keep customer-portal represented as a surface under jai-nexus/jai-nexus.",
          linked_motion_ids: ["motion-0167", "motion-0169", "motion-0170", "motion-0171"],
          linked_chat_ids: [relatedConversation.chat_id],
          linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
          linked_candidate_ids: [recommendedCandidate.candidate_id],
          acceptance_notes: [
            "Repo-plus-surface targeting stays explicit.",
            "No standalone customer-portal repo is implied.",
          ],
          children: [
            {
              nh_id: "1.1",
              title: "Customer portal intake map",
              status: "planned",
              summary:
                "Use the current deliberation recommendation as the central planning node.",
              linked_motion_ids: ["motion-0169", "motion-0170", "motion-0171"],
              linked_chat_ids: [relatedConversation.chat_id],
              linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
              linked_candidate_ids: [recommendedCandidate.candidate_id],
              acceptance_notes: [
                "Next motion title and prompt remain copy-only.",
              ],
              children: [
                {
                  nh_id: "1.1.1",
                  title: "Auth/account entry",
                  status: "planned",
                  summary:
                    "Clarify how customer entry points and account identity are framed in the intake path.",
                  linked_motion_ids: ["motion-0170", "motion-0171"],
                  linked_chat_ids: [relatedConversation.chat_id],
                  linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
                  linked_candidate_ids: [recommendedCandidate.candidate_id],
                  acceptance_notes: [
                    "Operator guidance stays planning-only.",
                  ],
                  children: [],
                },
                {
                  nh_id: "1.1.2",
                  title: "Stripe/customer billing assumptions",
                  status: "planned",
                  summary:
                    "Document billing and customer-account assumptions before any implementation authority is considered.",
                  linked_motion_ids: ["motion-0170", "motion-0171"],
                  linked_chat_ids: [relatedConversation.chat_id],
                  linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
                  linked_candidate_ids: [recommendedCandidate.candidate_id],
                  acceptance_notes: [
                    "No payment integration action is enabled from this wave.",
                  ],
                  children: [],
                },
                {
                  nh_id: "1.1.3",
                  title: "Workspace/project creation",
                  status: "planned",
                  summary:
                    "Capture workspace and project creation expectations as planned follow-up questions only.",
                  linked_motion_ids: ["motion-0170", "motion-0171"],
                  linked_chat_ids: [relatedConversation.chat_id],
                  linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
                  linked_candidate_ids: [recommendedCandidate.candidate_id],
                  acceptance_notes: [
                    "Execution authority remains deferred.",
                  ],
                  children: [],
                },
              ],
            },
          ],
        },
        {
          nh_id: "2.0",
          title: "Evidence and gates",
          status: "planned",
          summary:
            "Carry forward the verification commands and evidence expectations from the work packet and deliberation prompt.",
          linked_motion_ids: ["motion-0169", "motion-0170", "motion-0171"],
          linked_chat_ids: [relatedConversation.chat_id],
          linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
          linked_candidate_ids: [recommendedCandidate.candidate_id],
          acceptance_notes: [
            "Typecheck and agency validation remain the minimum repo gates.",
          ],
          children: [],
        },
        {
          nh_id: "3.0",
          title: "Deferred execution authority",
          status: "deferred",
          summary:
            "Any branch writes, PR creation, runtime actions, or execution authority must be opened in a separate later seam.",
          linked_motion_ids: ["motion-0170", "motion-0171"],
          linked_chat_ids: [relatedConversation.chat_id],
          linked_work_packet_ids: relatedPacket ? [relatedPacket.packet_id] : [],
          linked_candidate_ids: [recommendedCandidate.candidate_id],
          acceptance_notes: [
            "This wave remains capture/index/planning only.",
          ],
          children: [],
        },
      ],
    },
  ];
}

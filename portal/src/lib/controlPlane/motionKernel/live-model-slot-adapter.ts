import { MOTION_KERNEL_NON_AUTHORIZATIONS } from "./lifecycle";
import { getMotionKernelModelSlot } from "./model-slots";
import { getJaiRoleSlot } from "./role-slots";
import type {
  DeliberationParticipantOutput,
  ModelSlotDeliberationRequest,
  ModelSlotDeliberationResponse,
  RatificationValue,
  VoteValue,
} from "./types";

const LIVE_INFERENCE_ENV = {
  provider: "JAI_MODEL_SLOT_PROVIDER",
  model: "JAI_MODEL_SLOT_MODEL",
  enabled: "JAI_MODEL_SLOT_LIVE_INFERENCE_ENABLED",
} as const;

export function runManualModelSlotDeliberation(
  request: ModelSlotDeliberationRequest,
): ModelSlotDeliberationResponse {
  const modelSlot = getMotionKernelModelSlot(request.modelSlotId);

  if (modelSlot.inferenceMode === "disabled") {
    return {
      mode: "mock",
      providerConfigured: false,
      participantOutput: createMockDeliberationParticipantOutput({
        ...request,
        operatorPrompt: `${request.operatorPrompt}\nDisabled model slot fallback.`,
      }),
      nonAuthorityDisclaimer:
        "Disabled model slots cannot run live inference; mock advisory output was used.",
    };
  }

  const requestedProvider =
    request.requestedMode === "env_gated_provider" ||
    modelSlot.inferenceMode === "env_gated_live_placeholder";

  if (requestedProvider) {
    return createEnvGatedProviderDeliberationOutput(request);
  }

  return {
    mode: "mock",
    providerConfigured: false,
    participantOutput: createMockDeliberationParticipantOutput(request),
    nonAuthorityDisclaimer:
      "Mock deliberation is manual/operator-triggered and advisory only.",
  };
}

export function createMockDeliberationParticipantOutput(
  request: ModelSlotDeliberationRequest,
): DeliberationParticipantOutput {
  const roleSlot = getJaiRoleSlot(request.roleSlotId);
  const modelSlot = getMotionKernelModelSlot(request.modelSlotId);
  const profile = ROLE_OUTPUT_PROFILES[request.roleSlotId];

  return {
    roleSlotId: roleSlot.id,
    modelSlotId: modelSlot.id,
    critiqueSummary: `${roleSlot.displayName}: ${profile.critique}`,
    voteValue: profile.voteValue,
    ratificationRecommendation: profile.ratificationRecommendation,
    requiredRevisions: profile.requiredRevisions,
    blockers: profile.blockers,
    confidenceReadinessNote: `${profile.confidenceReadinessNote} Prompt preview: ${request.operatorPrompt.slice(0, 120)}`,
    nonAuthorizations: [...MOTION_KERNEL_NON_AUTHORIZATIONS],
    advisoryOnly: true,
  };
}

export function createEnvGatedProviderDeliberationOutput(
  request: ModelSlotDeliberationRequest,
): ModelSlotDeliberationResponse {
  const providerConfigured =
    process.env[LIVE_INFERENCE_ENV.enabled] === "true" &&
    Boolean(process.env[LIVE_INFERENCE_ENV.provider]) &&
    Boolean(process.env[LIVE_INFERENCE_ENV.model]);

  if (!providerConfigured) {
    return {
      mode: "env_gated_provider_unconfigured",
      providerConfigured: false,
      participantOutput: {
        ...createMockDeliberationParticipantOutput(request),
        critiqueSummary:
          "Env-gated provider mode was requested, but live provider configuration is incomplete; mock advisory output is shown instead.",
        voteValue: "blocked",
        ratificationRecommendation: "needs_revision",
        requiredRevisions: [
          `Set ${LIVE_INFERENCE_ENV.enabled}=true only for an operator-triggered live run.`,
          `Configure ${LIVE_INFERENCE_ENV.provider} and ${LIVE_INFERENCE_ENV.model} outside source control; credential checks are server-only in the secure connector.`,
        ],
        blockers: ["Live provider mode is not configured in this environment."],
      },
      nonAuthorityDisclaimer:
        "Provider mode is env-gated and unconfigured; no live model call was made.",
    };
  }

  return {
    mode: "env_gated_provider_unconfigured",
    providerConfigured: true,
    participantOutput: {
      ...createMockDeliberationParticipantOutput(request),
      critiqueSummary:
        "Live provider gate is configured, but this lane intentionally ships no provider SDK call; operator receives mock advisory output.",
      voteValue: "revise",
      ratificationRecommendation: "needs_revision",
      requiredRevisions: [
        "Route a separate provider SDK integration lane before live model calls.",
      ],
      blockers: ["Provider SDK integration is intentionally not implemented."],
    },
    nonAuthorityDisclaimer:
      "Live provider credentials are present but no network call is implemented; output remains advisory.",
  };
}

const ROLE_OUTPUT_PROFILES: Record<
  ModelSlotDeliberationRequest["roleSlotId"],
  {
    critique: string;
    voteValue: VoteValue;
    ratificationRecommendation: RatificationValue;
    requiredRevisions: string[];
    blockers: string[];
    confidenceReadinessNote: string;
  }
> = {
  JAI_CONTROL_THREAD: {
    critique:
      "Routing and authority boundaries are visible; final decision framing must remain with CONTROL_THREAD.",
    voteValue: "approve",
    ratificationRecommendation: "ratified_with_conditions",
    requiredRevisions: [
      "Keep JAI vote separate from CONTROL_THREAD approval in every display.",
    ],
    blockers: [],
    confidenceReadinessNote:
      "Ready for advisory human review if authority copy remains visible.",
  },
  JAI_ORCHESTRATOR_NEXUS: {
    critique:
      "Work packet, wave, lane, and closeout structure can be drafted but must not execute.",
    voteValue: "revise",
    ratificationRecommendation: "needs_revision",
    requiredRevisions: [
      "Label downstream work-packet output as draft-only and non-executable.",
    ],
    blockers: [],
    confidenceReadinessNote:
      "Structurally useful with draft-only warnings preserved.",
  },
  JAI_DEV_JAI_NEXUS: {
    critique:
      "Implementation surface is useful for operator review when kept static/manual.",
    voteValue: "approve",
    ratificationRecommendation: "ratified_for_human_approval",
    requiredRevisions: [],
    blockers: [],
    confidenceReadinessNote:
      "Repo-local implementation fit is acceptable for mock/manual preview.",
  },
  JAI_AUDIT_NEXUS: {
    critique:
      "Authority-boundary language is present, but provider mode must remain env-gated.",
    voteValue: "revise",
    ratificationRecommendation: "needs_revision",
    requiredRevisions: [
      "Show no hidden background execution and no GitHub mutation in the manual run section.",
    ],
    blockers: [],
    confidenceReadinessNote:
      "Advisory readiness depends on preserving non-authorizations.",
  },
  JAI_FORMAT: {
    critique:
      "Output contract includes required vote, ratification, blockers, revisions, and non-authorizations.",
    voteValue: "approve",
    ratificationRecommendation: "ratified_for_human_approval",
    requiredRevisions: [],
    blockers: [],
    confidenceReadinessNote:
      "Vocabulary and schema-shape are consistent with the A1 kernel.",
  },
  JAI_REPO_GENERIC: {
    critique:
      "Repo-local fit is acceptable if validation remains explicit and no repo mutation path is introduced.",
    voteValue: "approve",
    ratificationRecommendation: "ratified_with_conditions",
    requiredRevisions: [
      "Run typecheck, lint, build, and diff checks before merge consideration.",
    ],
    blockers: [],
    confidenceReadinessNote:
      "Ready for manual operator review with validation evidence.",
  },
};

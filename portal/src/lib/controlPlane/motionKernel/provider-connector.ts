import "server-only";

import { createMockDeliberationParticipantOutput } from "./live-model-slot-adapter";
import { normalizeProviderParticipantOutput } from "./provider-output-normalization";
import {
  getSafeProviderStatus,
  getServerProviderCredentialForConnector,
} from "./server-provider-config";
import type {
  ModelSlotDeliberationRequest,
  ProviderDeliberationConnectorResult,
} from "./types";

export async function runSecureProviderDeliberationConnector(
  request: ModelSlotDeliberationRequest,
): Promise<ProviderDeliberationConnectorResult> {
  const status = getSafeProviderStatus();

  if (!status.providerConfigured) {
    return {
      status,
      participantOutput: {
        ...createMockDeliberationParticipantOutput(request),
        critiqueSummary: status.advisoryMessage,
        voteValue: status.liveInferenceEnabled ? "blocked" : "revise",
        ratificationRecommendation: "needs_revision",
        requiredRevisions: [
          "Use mock mode until live provider configuration is complete.",
        ],
        blockers: status.liveInferenceEnabled
          ? ["Provider config is missing or incomplete."]
          : [],
      },
      nonAuthorityDisclaimer:
        "Provider connector returned safe mock fallback; no live provider call was made.",
    };
  }

  if (status.providerName?.toLowerCase() !== "openai") {
    return {
      status: {
        ...status,
        mode: "provider_error",
        advisoryMessage:
          "Configured provider is unsupported by this connector lane.",
      },
      participantOutput: {
        ...createMockDeliberationParticipantOutput(request),
        critiqueSummary:
          "Unsupported provider configuration; advisory fallback requires revision.",
        voteValue: "blocked",
        ratificationRecommendation: "needs_revision",
        requiredRevisions: ["Configure JAI_MODEL_SLOT_PROVIDER=openai."],
        blockers: ["Unsupported provider."],
      },
      nonAuthorityDisclaimer:
        "Unsupported provider did not run and cannot create authority.",
    };
  }

  try {
    const credential = getServerProviderCredentialForConnector();
    if (!credential || !status.modelName) {
      return {
        status: {
          ...status,
          mode: "provider_config_missing",
          advisoryMessage:
            "Provider credential or model name became unavailable at call time.",
        },
        participantOutput: {
          ...createMockDeliberationParticipantOutput(request),
          critiqueSummary:
            "Provider config missing at call time; advisory fallback requires revision.",
          voteValue: "blocked",
          ratificationRecommendation: "needs_revision",
          requiredRevisions: ["Verify server-side provider environment config."],
          blockers: ["Provider config missing at call time."],
        },
        nonAuthorityDisclaimer:
          "Provider connector did not run because config was unavailable.",
      };
    }

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({
      apiKey: credential,
      timeout: 20_000,
    });

    const completion = await client.chat.completions.create({
      model: status.modelName,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Return only JSON for a non-authoritative JAI motion deliberation participant output. Never include secrets. Never claim approval, route authority, execution authority, GitHub mutation authority, or production gate authority.",
        },
        {
          role: "user",
          content: buildProviderPrompt(request),
        },
      ],
    });

    const content = completion.choices[0]?.message.content;
    const rawOutput = safeJsonParse(content);

    return {
      status,
      participantOutput: normalizeProviderParticipantOutput({
        request,
        rawOutput,
      }),
      nonAuthorityDisclaimer:
        "Provider output is normalized server-side and remains advisory only.",
    };
  } catch {
    return {
      status: {
        ...status,
        mode: "provider_error",
        advisoryMessage:
          "Provider call failed or timed out; safe advisory fallback returned.",
      },
      participantOutput: {
        ...createMockDeliberationParticipantOutput(request),
        critiqueSummary:
          "Provider call failed or timed out; advisory fallback requires review.",
        voteValue: "blocked",
        ratificationRecommendation: "needs_revision",
        requiredRevisions: [
          "Review provider availability and retry manually if appropriate.",
        ],
        blockers: ["Provider call failed or timed out."],
      },
      nonAuthorityDisclaimer:
        "Provider error was handled without exposing secrets or retrying in the background.",
    };
  }
}

function buildProviderPrompt(request: ModelSlotDeliberationRequest): string {
  return JSON.stringify({
    outputContract: {
      critiqueSummary: "string",
      voteValue: "approve | reject | abstain | revise | blocked",
      ratificationRecommendation:
        "not_ratified | ratified_for_human_approval | ratified_with_conditions | rejected | needs_revision",
      requiredRevisions: "string[]",
      blockers: "string[]",
      confidenceReadinessNote: "string",
      nonAuthorizations: "string[]",
    },
    motion: {
      id: request.motion.id,
      title: request.motion.title,
      summary: request.motion.summary,
      lifecycleStatus: request.motion.lifecycleStatus,
      controlThreadAuthorityNote: request.motion.controlThread.authorityNote,
      repoThreadAuthorityNote: request.motion.repoThread.authorityNote,
    },
    roleSlotId: request.roleSlotId,
    modelSlotId: request.modelSlotId,
    operatorPrompt: request.operatorPrompt,
    nonAuthorizations: [
      "JAI vote is not CONTROL_THREAD approval.",
      "JAI ratification is not final authority.",
      "Human / CONTROL_THREAD approval remains required.",
      "No autonomous execution.",
      "No GitHub mutation.",
      "No PR creation.",
      "No branch mutation.",
      "No merge action.",
      "No branch deletion.",
      "No production gate opening.",
      "No source-of-truth transfer.",
      "No hidden background execution.",
      "No automatic route execution.",
      "No work-packet execution.",
      "Provider output is advisory only.",
    ],
  });
}

function safeJsonParse(content: string | null | undefined): unknown {
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

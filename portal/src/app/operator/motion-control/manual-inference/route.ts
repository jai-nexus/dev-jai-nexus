import { NextResponse } from "next/server";

import {
  buildDeliberationRunHistoryRecord,
  deriveAdvisoryRatificationRecommendation,
  persistDeliberationRunHistory,
  JAI_ROLE_SLOTS,
  MOTION_KERNEL_MODEL_SLOTS,
  sampleMotionKernelMotions,
  type JaiRoleSlotId,
  type ModelSlotId,
} from "@/lib/controlPlane/motionKernel";
import { createMockDeliberationParticipantOutput } from "@/lib/controlPlane/motionKernel/live-model-slot-adapter";
import { runSecureProviderDeliberationConnector } from "@/lib/controlPlane/motionKernel/provider-connector";
import { getSafeProviderStatus } from "@/lib/controlPlane/motionKernel/server-provider-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ManualInferenceRequestBody {
  motionId?: string;
  roleSlotIds?: JaiRoleSlotId[];
  modelSlotId?: ModelSlotId;
  mode?: "mock" | "env_gated_provider";
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  const motion =
    sampleMotionKernelMotions.find(
      (candidate) => candidate.id === body.motionId,
    ) ?? sampleMotionKernelMotions[1];
  const roleSlotIds = normalizeRoleSlotIds(body.roleSlotIds).length
    ? normalizeRoleSlotIds(body.roleSlotIds)
    : motion.roleSlotIds;
  const modelSlotId = normalizeModelSlotId(body.modelSlotId);
  const requestedMode = normalizeRequestedMode(body.mode);

  const participantResults = await Promise.all(
    roleSlotIds.map(async (roleSlotId) => {
      const deliberationRequest = {
        motion,
        roleSlotId,
        modelSlotId,
        requestedMode,
        operatorPrompt: [
          motion.title,
          motion.summary,
          motion.controlThread.authorityNote,
          motion.repoThread.authorityNote,
        ].join("\n"),
      };

      if (requestedMode === "env_gated_provider") {
        const result =
          await runSecureProviderDeliberationConnector(deliberationRequest);
        return {
          participantOutput: result.participantOutput,
          connectorStatus: result.status,
          nonAuthorityDisclaimer: result.nonAuthorityDisclaimer,
        };
      }

      return {
        participantOutput:
          createMockDeliberationParticipantOutput(deliberationRequest),
        connectorStatus: getSafeProviderStatus(),
        nonAuthorityDisclaimer:
          "Mock mode was selected; no provider connector call was made.",
      };
    }),
  );
  const participantOutputs = participantResults.map(
    (result) => result.participantOutput,
  );
  const aggregateRatification =
    deriveAdvisoryRatificationRecommendation(participantOutputs);
  const providerStatus = getSafeProviderStatus();
  const historyRecord = buildDeliberationRunHistoryRecord({
    motionId: motion.id,
    motionTitle: motion.title,
    sourceMode: getHistorySourceMode(requestedMode, providerStatus.mode),
    connectorStatusSummary: providerStatus,
    participantOutputs,
    aggregateAdvisoryRatification: aggregateRatification,
    evidencePointers: motion.evidencePointers,
    nonAuthorizations: [
      "Stored deliberation is not CONTROL_THREAD approval.",
      "Stored JAI vote is not route authority.",
      "Stored ratification is not final authority.",
      "Stored provider output is not source-of-truth transfer.",
      "Stored evidence pointer is not validation approval.",
      "Stored work-packet draft is not routed work.",
      "Human / CONTROL_THREAD approval remains required.",
      "Persistence does not create execution authority.",
      "Persistence does not create GitHub mutation authority.",
      "Persistence does not create production gate authority.",
      "Persistence does not create source-of-truth authority.",
      "Persistence does not create route authority.",
      "Persistence does not create acceptance authority.",
      "No provider API key persistence.",
      "No provider API key exposure.",
      "No provider secret storage.",
    ],
  });
  const persistedHistoryRecord =
    await persistDeliberationRunHistory(historyRecord);

  return NextResponse.json({
    ok: true,
    persisted: persistedHistoryRecord.persistenceStatus === "persisted",
    operatorTriggeredOnly: true,
    providerStatus,
    persistence: {
      id: persistedHistoryRecord.id,
      status: persistedHistoryRecord.persistenceStatus,
      safeAdvisoryMessage: persistedHistoryRecord.safeAdvisoryMessage,
      createdAt: persistedHistoryRecord.createdAt,
    },
    connectorStatuses: participantResults.map((result) => ({
      roleSlotId: result.participantOutput.roleSlotId,
      status: result.connectorStatus,
      nonAuthorityDisclaimer: result.nonAuthorityDisclaimer,
    })),
    participantOutputs,
    aggregateRatification,
    evidencePointers: motion.evidencePointers,
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
      "Provider connector is server-side only.",
      "Provider mode is disabled by default.",
      "Mock mode remains default.",
      "No provider API key persistence.",
      "No provider API key exposure.",
      "No provider secret storage.",
    ],
  });
}

function normalizeRoleSlotIds(value: unknown): JaiRoleSlotId[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const validIds = new Set(JAI_ROLE_SLOTS.map((slot) => slot.id));
  return value.filter(
    (candidate): candidate is JaiRoleSlotId =>
      typeof candidate === "string" && validIds.has(candidate as JaiRoleSlotId),
  );
}

function normalizeModelSlotId(value: unknown): ModelSlotId {
  const validIds = new Set(MOTION_KERNEL_MODEL_SLOTS.map((slot) => slot.id));
  if (typeof value === "string" && validIds.has(value as ModelSlotId)) {
    return value as ModelSlotId;
  }
  return "model-slot-mock-deliberator";
}

function normalizeRequestedMode(
  value: unknown,
): "mock" | "env_gated_provider" {
  return value === "env_gated_provider" ? "env_gated_provider" : "mock";
}

function getHistorySourceMode(
  requestedMode: "mock" | "env_gated_provider",
  providerMode: ReturnType<typeof getSafeProviderStatus>["mode"],
) {
  if (requestedMode === "mock") {
    return "mock";
  }
  if (providerMode === "provider_configured") {
    return "provider";
  }
  if (providerMode === "provider_disabled") {
    return "provider_disabled";
  }
  return "provider_unavailable";
}

async function parseBody(
  request: Request,
): Promise<ManualInferenceRequestBody> {
  try {
    const value = (await request.json()) as ManualInferenceRequestBody;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

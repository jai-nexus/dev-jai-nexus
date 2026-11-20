import { getServerAuthSession } from "@/auth";
import { evaluateA3InferenceGate } from "@/lib/controlPlane/motionKernel/a3-inference-gates";
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
  type Motion,
} from "@/lib/controlPlane/motionKernel";
import { createMockDeliberationParticipantOutput } from "@/lib/controlPlane/motionKernel/live-model-slot-adapter";
import { getSafeProviderStatus } from "@/lib/controlPlane/motionKernel/server-provider-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ManualInferenceRequestBody {
  motionId?: string;
  roleSlotIds?: JaiRoleSlotId[];
  modelSlotId?: ModelSlotId;
  mode?: "mock" | "env_gated_provider";
  motionBasis?: Motion;
}

function deny(status: number, error: string) {
  return NextResponse.json({
    ok: false, error, persisted: false,
    nonAuthorizations: ["No autonomous execution.", "Human / CONTROL_THREAD approval remains required."],
  }, { status });
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session?.user) return deny(401, "unauthorized");
  const user = session.user;
  if (!("role" in user) || user.role !== "ADMIN" || typeof user.email !== "string" || !user.email.trim()) {
    return deny(403, "forbidden");
  }

  const body = await parseBody(request);
  const requestedMode = body.mode === undefined ? "mock" : body.mode;
  const gate = evaluateA3InferenceGate({ env: process.env, mode: requestedMode, phase: "request" });
  if (!gate.allowed) return deny(gate.status, gate.code.toLowerCase());

  const motion =
    normalizeMotionBasis(body.motionBasis) ??
    sampleMotionKernelMotions.find(
      (candidate) => candidate.id === body.motionId,
    ) ?? sampleMotionKernelMotions[1];
  const roleSlotIds = normalizeRoleSlotIds(body.roleSlotIds).length
    ? normalizeRoleSlotIds(body.roleSlotIds)
    : motion.roleSlotIds;
  const modelSlotId = normalizeModelSlotId(body.modelSlotId);

  const providerStatus = getSafeProviderStatus();
  const participantResults = roleSlotIds.map((roleSlotId) => {
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

    return {
      participantOutput:
        createMockDeliberationParticipantOutput(deliberationRequest),
      connectorStatus: providerStatus,
      nonAuthorityDisclaimer:
        "Mock mode was selected; no provider connector call was made.",
    };
  });
  const participantOutputs = participantResults.map(
    (result) => result.participantOutput,
  );
  const aggregateRatification =
    deriveAdvisoryRatificationRecommendation(participantOutputs);
  const historyRecord = buildDeliberationRunHistoryRecord({
    motionId: motion.id,
    motionTitle: motion.title,
    sourceMode: "mock",
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
  const writeGate = evaluateA3InferenceGate({ env: process.env, mode: requestedMode, phase: "pre_persist" });
  if (!writeGate.allowed) return deny(writeGate.status, writeGate.code.toLowerCase());
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

function normalizeMotionBasis(value: unknown): Motion | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = value as Motion;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.summary !== "string" ||
    !Array.isArray(candidate.roleSlotIds) ||
    !Array.isArray(candidate.evidencePointers) ||
    !candidate.controlThread ||
    !candidate.repoThread ||
    !candidate.ratificationRecommendation ||
    !candidate.humanApprovalDecision ||
    !candidate.downstreamDrafts ||
    !candidate.closeoutPlaceholder
  ) {
    return null;
  }
  return candidate;
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

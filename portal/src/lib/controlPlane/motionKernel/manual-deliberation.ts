import { MOTION_KERNEL_NON_AUTHORIZATIONS } from "./lifecycle";
import { runManualModelSlotDeliberation } from "./live-model-slot-adapter";
import { deriveAdvisoryRatificationRecommendation } from "./ratification-summary";
import type {
  JaiRoleSlotId,
  ManualDeliberationRun,
  ManualDeliberationRunResult,
  ModelSlotId,
  Motion,
} from "./types";

export function createManualDeliberationRunPreview({
  motion,
  roleSlotIds = motion.roleSlotIds,
  modelSlotId = "model-slot-mock-deliberator",
  requestedMode = "mock",
}: {
  motion: Motion;
  roleSlotIds?: JaiRoleSlotId[];
  modelSlotId?: ModelSlotId;
  requestedMode?: ManualDeliberationRun["requestedMode"];
}): ManualDeliberationRunResult {
  const run: ManualDeliberationRun = {
    id: `manual-deliberation-${motion.id}`,
    motionId: motion.id,
    roleSlotIds,
    modelSlotId,
    requestedMode,
    operatorTriggeredOnly: true,
    persisted: false,
  };

  const participantOutputs = roleSlotIds.map((roleSlotId) =>
    runManualModelSlotDeliberation({
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
    }).participantOutput,
  );

  return {
    run,
    participantOutputs,
    aggregateRatification:
      deriveAdvisoryRatificationRecommendation(participantOutputs),
    nonAuthorizations: [
      ...MOTION_KERNEL_NON_AUTHORIZATIONS,
      "JAI vote is not CONTROL_THREAD approval.",
      "No automatic route execution.",
      "No work-packet execution.",
    ],
  };
}

export function summarizeManualDeliberationRun(
  result: ManualDeliberationRunResult,
): string {
  return [
    `Manual run: ${result.run.id}`,
    `Motion: ${result.run.motionId}`,
    `Mode: ${result.run.requestedMode}`,
    `Persisted: ${result.run.persisted ? "yes" : "no"}`,
    `Aggregate advisory ratification: ${result.aggregateRatification.value}`,
    result.aggregateRatification.summary,
    "This summary does not approve, route, execute, mutate GitHub, or open production gates.",
  ].join("\n");
}

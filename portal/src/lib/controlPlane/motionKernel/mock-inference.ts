import { getMotionKernelModelSlot } from "./model-slots";
import { getJaiRoleSlot } from "./role-slots";
import type { MockInferenceRequest, MockInferenceResponse } from "./types";

const LIVE_INFERENCE_GATE = "JAI_MOTION_KERNEL_LIVE_INFERENCE_ENABLED";

export function runManualMotionKernelInference(
  request: MockInferenceRequest,
): MockInferenceResponse {
  const roleSlot = getJaiRoleSlot(request.roleSlotId);
  const modelSlot = getMotionKernelModelSlot(request.modelSlotId);

  if (modelSlot.inferenceMode === "env_gated_live_placeholder") {
    const liveEnabled = process.env[LIVE_INFERENCE_GATE] === "true";
    if (!liveEnabled) {
      return {
        mode: "env_gated_live_placeholder_blocked",
        summary:
          "Live inference placeholder is disabled; mock posture remains active.",
        reasoning: [
          "No provider credentials are required.",
          "No live model call was made.",
          "No hidden background execution is available.",
        ],
        nonAuthorityDisclaimer: modelSlot.nonAuthorityDisclaimer,
      };
    }
  }

  return {
    mode: "mock",
    summary: `${roleSlot.displayName} mock deliberation for ${request.motionId}`,
    reasoning: [
      `Lens: ${roleSlot.requiredLens}`,
      `Prompt preview: ${request.operatorPrompt.slice(0, 160)}`,
      "This mock inference is manual/operator-triggered preview data only.",
    ],
    nonAuthorityDisclaimer:
      "Mock inference is advisory and cannot approve, route, execute, mutate GitHub, or open production gates.",
  };
}

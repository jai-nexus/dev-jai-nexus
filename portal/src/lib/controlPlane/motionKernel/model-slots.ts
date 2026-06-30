import type { ModelSlot } from "./types";

export const MOTION_KERNEL_MODEL_SLOTS: ModelSlot[] = [
  {
    id: "model-slot-mock-deliberator",
    displayName: "Mock Deliberator",
    providerFamily: "mock",
    enabled: true,
    compatibleRoleSlots: [
      "JAI_CONTROL_THREAD",
      "JAI_ORCHESTRATOR_NEXUS",
      "JAI_DEV_JAI_NEXUS",
      "JAI_AUDIT_NEXUS",
      "JAI_FORMAT",
      "JAI_REPO_GENERIC",
    ],
    inferenceMode: "mock",
    manualOperatorTriggeredOnly: true,
    mockInferenceEnabled: true,
    nonAuthorityDisclaimer:
      "Mock model-slot output is fixture inference only and carries no authority.",
  },
  {
    id: "model-slot-env-gated-live-placeholder",
    displayName: "Env-Gated Live Placeholder",
    providerFamily: "operator_configured",
    providerKey: "JAI_MODEL_SLOT_PROVIDER",
    modelName: "JAI_MODEL_SLOT_MODEL",
    enabled: false,
    compatibleRoleSlots: [
      "JAI_CONTROL_THREAD",
      "JAI_ORCHESTRATOR_NEXUS",
      "JAI_DEV_JAI_NEXUS",
      "JAI_AUDIT_NEXUS",
      "JAI_FORMAT",
      "JAI_REPO_GENERIC",
    ],
    inferenceMode: "env_gated_live_placeholder",
    manualOperatorTriggeredOnly: true,
    mockInferenceEnabled: true,
    envGate: "JAI_MODEL_SLOT_LIVE_INFERENCE_ENABLED",
    nonAuthorityDisclaimer:
      "Live inference is disabled unless explicitly env-gated; it still cannot execute, mutate GitHub, or create authority.",
  },
  {
    id: "model-slot-disabled-reference",
    displayName: "Disabled Reference Slot",
    providerFamily: "none",
    enabled: false,
    compatibleRoleSlots: [],
    inferenceMode: "disabled",
    manualOperatorTriggeredOnly: true,
    mockInferenceEnabled: false,
    nonAuthorityDisclaimer:
      "Disabled slots are visible for registry shape only and cannot infer.",
  },
];

export function getMotionKernelModelSlot(id: ModelSlot["id"]): ModelSlot {
  const slot = MOTION_KERNEL_MODEL_SLOTS.find((candidate) => candidate.id === id);
  if (!slot) {
    throw new Error(`Unknown model slot: ${id}`);
  }
  return slot;
}

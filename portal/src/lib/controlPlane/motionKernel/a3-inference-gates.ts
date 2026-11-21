export type A3InferenceEnvironment = Record<string, string | undefined>;
export type A3InferenceMode = "mock" | "env_gated_provider";
export type A3GatePhase = "request" | "provider_dispatch" | "pre_persist";
export type A3GateDecision =
  | { allowed: true; code: "MOCK_ONLY_ALLOWED" }
  | {
      allowed: false;
      status: 403 | 503;
      code: "PROVIDER_SPEND_NOT_AUTHORIZED" | "MANUAL_INFERENCE_DISABLED"
        | "MANUAL_INFERENCE_WRITES_DISABLED" | "INVALID_INFERENCE_CONFIGURATION";
    };

export function evaluateA3InferenceGate({ env, mode, phase }: {
  env: A3InferenceEnvironment;
  mode: A3InferenceMode;
  phase: A3GatePhase;
}): A3GateDecision {
  const killSwitch = (env.JAI_MANUAL_INFERENCE_KILL_SWITCH ?? "ON").trim().toUpperCase();
  const spend = env.JAI_LAYER2_AUTHORIZED_API_SPEND_USD ?? "0.00";
  const writes = env.JAI_MANUAL_INFERENCE_WRITES_ENABLED ?? "false";
  if ((killSwitch !== "ON" && killSwitch !== "OFF") ||
      !/^\d+(?:\.\d{1,2})?$/.test(spend) || !Number.isFinite(Number(spend)) ||
      (writes !== "true" && writes !== "false") ||
      (mode !== "mock" && mode !== "env_gated_provider") ||
      (phase !== "request" && phase !== "provider_dispatch" && phase !== "pre_persist")) {
    return { allowed: false, status: 503, code: "INVALID_INFERENCE_CONFIGURATION" };
  }

  // The ratified Layer 2 ceiling is $0.00 regardless of operator configuration.
  if (mode === "env_gated_provider" || phase === "provider_dispatch") {
    return { allowed: false, status: 403, code: "PROVIDER_SPEND_NOT_AUTHORIZED" };
  }
  if (killSwitch === "ON") {
    return { allowed: false, status: 503, code: "MANUAL_INFERENCE_DISABLED" };
  }
  if (phase === "pre_persist" && writes !== "true") {
    return { allowed: false, status: 503, code: "MANUAL_INFERENCE_WRITES_DISABLED" };
  }
  return { allowed: true, code: "MOCK_ONLY_ALLOWED" };
}

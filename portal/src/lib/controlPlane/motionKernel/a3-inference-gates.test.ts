import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { compileFunction } from "node:vm";
import ts from "typescript";
import { evaluateA3InferenceGate, type A3GatePhase, type A3InferenceEnvironment } from "./a3-inference-gates";
import { createMockDeliberationParticipantOutput } from "./live-model-slot-adapter";
import { JAI_ROLE_SLOTS } from "./role-slots";
import { MOTION_KERNEL_MODEL_SLOTS } from "./model-slots";
import { sampleMotionKernelMotions } from "./sample-motions";
import { deriveAdvisoryRatificationRecommendation } from "./ratification-summary";

const enabled = { JAI_MANUAL_INFERENCE_KILL_SWITCH: "OFF", JAI_MANUAL_INFERENCE_WRITES_ENABLED: "true" };
const fakeConfig = {
  ...enabled, JAI_LAYER2_AUTHORIZED_API_SPEND_USD: "200.00", JAI_MODEL_SLOT_LIVE_INFERENCE_ENABLED: "true",
  JAI_MODEL_SLOT_API_KEY: "test-only", JAI_MODEL_SLOT_PROVIDER: "openai", JAI_MODEL_SLOT_MODEL: "test-model",
};
const phases: A3GatePhase[] = ["request", "provider_dispatch", "pre_persist"];

test("provider mode and dispatch always reject spend, including positive overrides", () => {
  const denial = { allowed: false, status: 403, code: "PROVIDER_SPEND_NOT_AUTHORIZED" };
  for (const env of [{}, enabled, fakeConfig, { ...fakeConfig, JAI_MANUAL_INFERENCE_KILL_SWITCH: "ON" }]) {
    for (const phase of phases) assert.deepEqual(evaluateA3InferenceGate({ env, mode: "env_gated_provider", phase }), denial);
    assert.deepEqual(evaluateA3InferenceGate({ env, mode: "mock", phase: "provider_dispatch" }), denial);
  }
});

test("mock requests default to disabled and writes require literal true", () => {
  const evaluate = (env: A3InferenceEnvironment, phase: A3GatePhase) => evaluateA3InferenceGate({ env, mode: "mock", phase });
  for (const env of [{}, { ...enabled, JAI_MANUAL_INFERENCE_KILL_SWITCH: "ON" }]) {
    for (const phase of ["pre_persist", "request"] as const)
      assert.deepEqual(evaluate(env, phase), { allowed: false, status: 503, code: "MANUAL_INFERENCE_DISABLED" });
  }
  for (const writes of [undefined, "false"]) {
    const env = { JAI_MANUAL_INFERENCE_KILL_SWITCH: " off ", JAI_MANUAL_INFERENCE_WRITES_ENABLED: writes };
    assert.deepEqual(evaluate(env, "request"), { allowed: true, code: "MOCK_ONLY_ALLOWED" });
    assert.deepEqual(evaluate(env, "pre_persist"), { allowed: false, status: 503, code: "MANUAL_INFERENCE_WRITES_DISABLED" });
  }
  assert.deepEqual(evaluate(enabled, "pre_persist"), { allowed: true, code: "MOCK_ONLY_ALLOWED" });
});

test("malformed configuration fails closed at each phase", () => {
  for (const [key, values] of Object.entries({
    JAI_LAYER2_AUTHORIZED_API_SPEND_USD: ["", "-1", "1e2", "1.234", "NaN", "Infinity", " "],
    JAI_MANUAL_INFERENCE_WRITES_ENABLED: ["", "TRUE", " true ", "1"],
    JAI_MANUAL_INFERENCE_KILL_SWITCH: ["", "false", "disabled"],
  })) {
    for (const value of values) for (const phase of phases) {
      assert.deepEqual(evaluateA3InferenceGate({ env: { ...enabled, [key]: value }, mode: "mock", phase }),
        { allowed: false, status: 503, code: "INVALID_INFERENCE_CONFIGURATION" });
    }
  }
});

// Load the production module with only these imports available. Database, auth and SDK
// modules have no fallback to the installed implementation in these local drills.
function loadWithFixtures<T>(file: string, imports: Record<string, unknown>, env: A3InferenceEnvironment): T {
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  compileFunction(outputText, ["exports", "require", "process"])(exports, (id: string) => {
    assert.ok(Object.hasOwn(imports, id), `Unexpected import: ${id}`);
    return imports[id];
  }, { env });
  return exports as T;
}

type ConfigModule = typeof import("./server-provider-config");
type ConnectorModule = typeof import("./provider-connector");
type RouteModule = typeof import("../../../app/operator/motion-control/manual-inference/route");
const kernel = "@/lib/controlPlane/motionKernel";

test("connector checks spend independently even with a configured status and full synthetic credentials", async () => {
  const env = { ...fakeConfig };
  const config = loadWithFixtures<ConfigModule>("./server-provider-config.ts", { "server-only": {} }, env);
  const status = config.getSafeProviderStatus();
  assert.deepEqual(status, { liveInferenceEnabled: false, providerConfigured: false, providerKeyPresent: true,
    providerName: "openai", modelName: "test-model", mode: "provider_disabled",
    advisoryMessage: "Provider inference is blocked because Layer 2 API spend is not authorized." });
  let credentials = 0, sdkLoads = 0;
  const connector = loadWithFixtures<ConnectorModule>("./provider-connector.ts", {
    "server-only": {}, "./a3-inference-gates": { evaluateA3InferenceGate },
    "./live-model-slot-adapter": { createMockDeliberationParticipantOutput },
    "./provider-output-normalization": {},
    "./server-provider-config": {
      getSafeProviderStatus: () => ({ ...status, providerConfigured: true }),
      getServerProviderCredentialForConnector: () => { credentials++; return env.JAI_MODEL_SLOT_API_KEY; },
    },
    get openai() { sdkLoads++; throw new Error("SDK import attempted"); },
  }, env);
  const result = await connector.runSecureProviderDeliberationConnector({
    motion: sampleMotionKernelMotions[1], modelSlotId: "model-slot-mock-deliberator",
    roleSlotId: JAI_ROLE_SLOTS[0].id, requestedMode: "env_gated_provider", operatorPrompt: "local drill",
  });
  assert.match(result.nonAuthorityDisclaimer, /no live provider call/);
  assert.equal(credentials, 0);
  assert.equal(sdkLoads, 0);
});

type User = { role?: string; email?: string };
const admin: User = { role: "ADMIN", email: "admin@example.test" };

async function post(user: User | null, mode = "mock", override: A3InferenceEnvironment = {},
  beforePersist?: (env: A3InferenceEnvironment) => void) {
  const env = { ...fakeConfig, ...override };
  const calls = { auth: 0, body: 0, participant: 0, persist: 0, provider: 0 };
  const config = loadWithFixtures<ConfigModule>("./server-provider-config.ts", { "server-only": {} }, env);
  const route = loadWithFixtures<RouteModule>("../../../app/operator/motion-control/manual-inference/route.ts", {
    "@/auth": { getServerAuthSession: async () => { calls.auth++; return user && { user }; } },
    "next/server": { NextResponse: Response },
    [kernel + "/a3-inference-gates"]: { evaluateA3InferenceGate },
    [kernel + "/server-provider-config"]: config,
    [kernel + "/provider-connector"]: { runSecureProviderDeliberationConnector: () => { calls.provider++; throw Error("dispatch"); } },
    [kernel + "/live-model-slot-adapter"]: {
      createMockDeliberationParticipantOutput(input: Parameters<typeof createMockDeliberationParticipantOutput>[0]) {
        calls.participant++;
        return createMockDeliberationParticipantOutput(input);
      },
    },
    [kernel]: {
      JAI_ROLE_SLOTS, MOTION_KERNEL_MODEL_SLOTS, sampleMotionKernelMotions, deriveAdvisoryRatificationRecommendation,
      buildDeliberationRunHistoryRecord: (record: unknown) => { beforePersist?.(env); return record; },
      persistDeliberationRunHistory: async () => { calls.persist++; return { id: "drill", persistenceStatus: "persisted" }; },
    },
  }, env);
  const request = new Request("http://local.test/inference?role=ADMIN", { method: "POST", headers: { "x-role": "ADMIN" } });
  request.json = async () => { calls.body++; return { mode, role: "ADMIN", roleSlotIds: [JAI_ROLE_SLOTS[0].id] }; };
  const response = await route.POST(request);
  const body = await response.json();
  assert.ok(body.nonAuthorizations.length);
  assert.equal(calls.auth, 1);
  assert.equal(calls.provider, 0);
  return { calls, status: response.status, body };
}

test("missing session, non-admin and unidentified admin are rejected before body access", async () => {
  for (const user of [null, { ...admin, role: "AGENT" }, { email: admin.email }, { ...admin, email: "  " }]) {
    const { status, body, calls } = await post(user);
    assert.equal(status, user ? 403 : 401);
    assert.equal(body.error, user ? "forbidden" : "unauthorized");
    assert.equal(body.persisted, false);
    assert.deepEqual(calls, { auth: 1, body: 0, participant: 0, persist: 0, provider: 0 });
  }
});

test("request denials precede deliberation", async () => {
  for (const [mode, kill, status, code] of [
    ["env_gated_provider", "OFF", 403, "provider_spend_not_authorized"],
    ["mock", "ON", 503, "manual_inference_disabled"],
    ["mock", "bad", 503, "invalid_inference_configuration"],
  ] as const) {
    const result = await post(admin, mode, { JAI_MANUAL_INFERENCE_KILL_SWITCH: kill });
    assert.equal(result.status, status);
    assert.equal(result.body.error, code);
    assert.equal(result.body.persisted, false);
    assert.equal(result.calls.participant, 0);
    assert.equal(result.calls.persist, 0);
  }
});

test("pre-persistence recheck observes kill and write switches after deliberation", async () => {
  for (const [key, value, code] of [
    ["JAI_MANUAL_INFERENCE_KILL_SWITCH", "ON", "manual_inference_disabled"],
    ["JAI_MANUAL_INFERENCE_WRITES_ENABLED", "false", "manual_inference_writes_disabled"],
  ]) {
    const result = await post(admin, "mock", {}, env => { env[key] = value; });
    assert.equal(result.status, 503);
    assert.equal(result.body.error, code);
    assert.equal(result.body.persisted, false);
    assert.equal(result.calls.participant, 1);
    assert.equal(result.calls.persist, 0);
  }
});

test("admin mock deliberation reaches the advisory persistence spy once", async () => {
  const { calls, status, body } = await post(admin);
  assert.equal(status, 200);
  assert.equal(body.persisted, true);
  assert.equal(body.persistence.id, "drill");
  assert.equal(body.participantOutputs.length, 1);
  assert.ok(body.nonAuthorizations.includes("Human / CONTROL_THREAD approval remains required."));
  assert.deepEqual(calls, { auth: 1, body: 1, participant: 1, persist: 1, provider: 0 });
});

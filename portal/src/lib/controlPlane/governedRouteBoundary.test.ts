import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function assertIncludesAll(source: string, expected: string[]) {
  for (const value of expected) {
    assert.ok(source.includes(value), `Expected source to include: ${value}`);
  }
}

function assertOrdered(source: string, first: string, second: string) {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);
  assert.ok(firstIndex >= 0, `Expected source to include: ${first}`);
  assert.ok(secondIndex >= 0, `Expected source to include: ${second}`);
  assert.ok(
    firstIndex < secondIndex,
    `Expected "${first}" to appear before "${second}".`,
  );
}

function assertNoPositiveAuthorityClaims(source: string) {
  const forbiddenClaims = [
    "activation authorized",
    "approval granted",
    "automatic delivery enabled",
    "automatic route execution enabled",
    "CONTROL_THREAD acceptance transferred",
    "deployment authorized",
    "execution authority granted",
    "GitHub mutation authorized",
    "Linear mutation authorized",
    "production gate opened",
    "provider dispatch authorized",
    "public launch authorized",
    "route authority granted",
    "source-of-truth transfer authorized",
    "target-repo import authorized",
  ];

  for (const claim of forbiddenClaims) {
    assert.equal(
      source.includes(claim),
      false,
      `Expected route boundary source to exclude positive claim: ${claim}`,
    );
  }
}

const passalongCollectionRoute = readSource(
  "../../app/operator/control-thread/passalongs/route.ts",
);
const passalongDetailRoute = readSource(
  "../../app/operator/control-thread/passalongs/[passalongId]/route.ts",
);
const manualInferenceRoute = readSource(
  "../../app/operator/motion-control/manual-inference/route.ts",
);
const motionIntakeRoute = readSource(
  "../../app/operator/motion-control/motion-intake/route.ts",
);
const providerConnector = readSource(
  "./motionKernel/provider-connector.ts",
);
const providerConfig = readSource("./motionKernel/server-provider-config.ts");
const passalongPersistenceBoundary = readSource(
  "./threadMemory/passalong-persistence-boundary.ts",
);

function testPassalongPersistenceRouteBoundary() {
  assertIncludesAll(passalongCollectionRoute, [
    "export async function GET()",
    "export async function POST(request: Request)",
    "buildPersistedPassalongInput",
    "Passalong field boundary validation blocked persistence; no record was saved.",
    "nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS]",
    "persistPassalongRecord(candidate.value)",
  ]);
  assertOrdered(
    passalongCollectionRoute,
    "if (!candidate.ok || !candidate.value)",
    "persistPassalongRecord(candidate.value)",
  );
  assertIncludesAll(passalongDetailRoute, [
    "export async function PATCH",
    "export function GET()",
    "supports PATCH only",
    "It does not send, route, execute, or approve passalongs.",
    "nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS]",
    "{ status: 405 }",
  ]);
  assertIncludesAll(passalongPersistenceBoundary, [
    "Persisted passalong record is app-local and non-authoritative.",
    "Persisted passalong record is not source of truth.",
    "Persisted route status is not route authority.",
    "CONTROL_THREAD remains authority.",
    "No automatic passalong sending.",
    "No automatic route execution.",
    "No JAI Agent activation.",
    "No target-repo import.",
    "No GitHub mutation.",
    "No deployment.",
    "No production gate opening.",
    "No source-of-truth transfer.",
  ]);
  assertNoPositiveAuthorityClaims(passalongCollectionRoute);
  assertNoPositiveAuthorityClaims(passalongDetailRoute);
}

function testMotionIntakeBoundary() {
  assertIncludesAll(motionIntakeRoute, [
    "export async function GET()",
    "export async function POST(request: Request)",
    "Missing motion intake draft. No motion was persisted, routed, approved, or executed.",
    "Persisted motion is not approved work.",
    "Persisted motion is not routed work.",
    "Persisted motion is not CONTROL_THREAD acceptance.",
    "Persisted target thread is not route authority.",
    "CONTROL_THREAD remains authority.",
    "Linear remains a temporary mirror only.",
    "No autonomous execution.",
    "No GitHub mutation.",
    "No production gate opening.",
    "No source-of-truth transfer.",
    "No auto-submit to agents.",
    "No auto-run deliberation.",
    "No auto-route work.",
    "No work-packet execution.",
    "No provider API key persistence.",
    "No provider API key exposure.",
    "No provider secret storage.",
  ]);
  assertOrdered(
    motionIntakeRoute,
    "if (!body.draft)",
    "persistMotionIntakeRecord(record)",
  );
  assertNoPositiveAuthorityClaims(motionIntakeRoute);
}

function testManualInferenceProviderDisabledBoundary() {
  assertIncludesAll(manualInferenceRoute, [
    'value === "env_gated_provider" ? "env_gated_provider" : "mock"',
    'nonAuthorityDisclaimer:\n          "Mock mode was selected; no provider connector call was made."',
    "Provider output is advisory only.",
    "Provider connector is server-side only.",
    "Provider mode is disabled by default.",
    "Mock mode remains default.",
    "No automatic route execution.",
    "No hidden background execution.",
    "No work-packet execution.",
    "No provider API key persistence.",
    "No provider API key exposure.",
    "No provider secret storage.",
  ]);
  assertOrdered(
    manualInferenceRoute,
    'if (requestedMode === "env_gated_provider")',
    "createMockDeliberationParticipantOutput(deliberationRequest)",
  );
  assertIncludesAll(providerConfig, [
    'mode: "provider_disabled"',
    "Live provider inference is disabled; mock mode remains default.",
    'mode: "provider_config_missing"',
    "Live provider inference is enabled but required provider config is missing.",
  ]);
  assertNoPositiveAuthorityClaims(manualInferenceRoute);
}

function testProviderConnectorSafeFallbackBoundary() {
  assertIncludesAll(providerConnector, [
    "if (!status.providerConfigured)",
    "Provider connector returned safe mock fallback; no live provider call was made.",
    "Unsupported provider did not run and cannot create authority.",
    "Provider connector did not run because config was unavailable.",
    "Provider error was handled without exposing secrets or retrying in the background.",
    "Provider output is normalized server-side and remains advisory only.",
    "Never include secrets.",
    "Never claim approval, route authority, execution authority, GitHub mutation authority, or production gate authority.",
    "JAI vote is not CONTROL_THREAD approval.",
    "JAI ratification is not final authority.",
    "Human / CONTROL_THREAD approval remains required.",
    "No autonomous execution.",
    "No GitHub mutation.",
    "No production gate opening.",
    "No source-of-truth transfer.",
    "No hidden background execution.",
    "No automatic route execution.",
    "Provider output is advisory only.",
  ]);
  assertOrdered(
    providerConnector,
    "if (!status.providerConfigured)",
    'await import("openai")',
  );
  assertNoPositiveAuthorityClaims(providerConnector);
}

function testNoExternalSystemRouteClaims() {
  const combinedRouteSources = [
    passalongCollectionRoute,
    passalongDetailRoute,
    manualInferenceRoute,
    motionIntakeRoute,
    providerConnector,
  ].join("\n");

  assertIncludesAll(combinedRouteSources, [
    "No GitHub mutation.",
    "No automatic route execution.",
    "No source-of-truth transfer.",
  ]);
  assertNoPositiveAuthorityClaims(combinedRouteSources);
}

testPassalongPersistenceRouteBoundary();
testMotionIntakeBoundary();
testManualInferenceProviderDisabledBoundary();
testProviderConnectorSafeFallbackBoundary();
testNoExternalSystemRouteClaims();

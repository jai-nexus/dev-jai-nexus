import assert from "node:assert/strict";

import {
  assertFixturesAreSecretFree,
  createJsonRequest,
  invalidPassalongPayload,
  missingMotionDraftPayload,
  mockDefaultManualInferencePayload,
  providerConfigMissingManualInferencePayload,
  providerDisabledManualInferencePayload,
  syntheticMotionIntakePayload,
  syntheticPassalongPayload,
} from "./routeHarness/fixtures";
import {
  assertNoLiveProviderDispatch,
  createProviderConfigMissingSeam,
  createProviderDisabledSeam,
} from "./routeHarness/provider-seam";
import {
  assertPersistenceUnavailable,
  createDeliberationHistoryPersistenceUnavailable,
  createMotionIntakePersistenceUnavailable,
  createPassalongPersistenceUnavailableList,
  createPassalongPersistenceUnavailableWrite,
} from "./routeHarness/persistence-seam";
import {
  assertNoExternalMutationAuthority,
  assertNoForbiddenAuthorityClaims,
  assertRouteResponseHasNonAuthorizations,
  assertRouteResponseStatus,
  jsonRouteResponse,
  readRouteResponse,
} from "./routeHarness/route-response";

async function testSyntheticRequestFixtures() {
  assertFixturesAreSecretFree();

  const passalongRequest = createJsonRequest(
    "/operator/control-thread/passalongs",
    syntheticPassalongPayload,
  );
  assert.equal(passalongRequest.method, "POST");
  assert.equal(new URL(passalongRequest.url).host, "local.test");
  assert.deepEqual(await passalongRequest.json(), syntheticPassalongPayload);

  const motionRequest = createJsonRequest(
    "/operator/motion-control/motion-intake",
    syntheticMotionIntakePayload,
  );
  assert.deepEqual(await motionRequest.json(), syntheticMotionIntakePayload);

  const manualInferenceRequest = createJsonRequest(
    "/operator/motion-control/manual-inference",
    mockDefaultManualInferencePayload,
  );
  assert.deepEqual(
    await manualInferenceRequest.json(),
    mockDefaultManualInferencePayload,
  );

  assertNoForbiddenAuthorityClaims([
    invalidPassalongPayload,
    missingMotionDraftPayload,
    providerDisabledManualInferencePayload,
    providerConfigMissingManualInferencePayload,
  ]);
}

async function testRouteResponseHelpers() {
  const snapshot = await readRouteResponse(
    jsonRouteResponse(
      {
        ok: false,
        error:
          "Missing motion intake draft. No motion was persisted, routed, approved, or executed.",
        nonAuthorizations: [
          "CONTROL_THREAD remains authority.",
          "No autonomous execution.",
          "No GitHub mutation.",
          "No Linear mutation.",
          "No target-repo import.",
          "No production gate opening.",
          "No source-of-truth transfer.",
          "No automatic route execution.",
          "No automatic delivery.",
        ],
      },
      400,
    ),
  );

  assertRouteResponseStatus(snapshot, 400);
  assertRouteResponseHasNonAuthorizations(snapshot);
  assertNoExternalMutationAuthority(snapshot);
}

async function testProviderSeams() {
  const providerDisabled = createProviderDisabledSeam();
  assert.equal(providerDisabled.status.mode, "provider_disabled");
  assert.equal(providerDisabled.providerDispatchAttempted, false);
  assert.equal(providerDisabled.networkAccessRequired, false);
  assertNoLiveProviderDispatch(providerDisabled);
  assertNoForbiddenAuthorityClaims(providerDisabled);

  const providerConfigMissing = createProviderConfigMissingSeam();
  assert.equal(providerConfigMissing.status.mode, "provider_config_missing");
  assert.equal(providerConfigMissing.providerDispatchAttempted, false);
  assert.equal(providerConfigMissing.networkAccessRequired, false);
  assertNoLiveProviderDispatch(providerConfigMissing);
  assertNoForbiddenAuthorityClaims(providerConfigMissing);
}

async function testPersistenceUnavailableSeams() {
  const passalongList = createPassalongPersistenceUnavailableList();
  assertPersistenceUnavailable(passalongList);
  assertNoForbiddenAuthorityClaims(passalongList);

  const passalongWrite = createPassalongPersistenceUnavailableWrite();
  assertPersistenceUnavailable(passalongWrite);
  assertNoForbiddenAuthorityClaims(passalongWrite);

  const motionIntake = createMotionIntakePersistenceUnavailable();
  assertPersistenceUnavailable(motionIntake);
  assert.equal(motionIntake.record.authorityState, "non_authoritative");
  assertNoForbiddenAuthorityClaims(motionIntake);

  const deliberationHistory =
    createDeliberationHistoryPersistenceUnavailable();
  assertPersistenceUnavailable(deliberationHistory);
  assert.equal(deliberationHistory.persisted, false);
  assertNoForbiddenAuthorityClaims(deliberationHistory);
}

await testSyntheticRequestFixtures();
await testRouteResponseHelpers();
await testProviderSeams();
await testPersistenceUnavailableSeams();

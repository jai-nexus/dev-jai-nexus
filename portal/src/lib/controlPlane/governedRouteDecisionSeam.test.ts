import assert from "node:assert/strict";

import {
  assertFixturesAreSecretFree,
  missingMotionDraftPayload,
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
  readStringArrayField,
} from "./routeHarness/route-response";
import {
  decideManualInferenceRun,
  buildManualInferenceHistoryInput,
} from "./routeDecisions/manualInferenceRouteDecisions";
import {
  decideMotionIntakeCreate,
  decideMotionIntakeList,
} from "./routeDecisions/motionIntakeRouteDecisions";
import {
  decidePassalongCollectionCreate,
  decidePassalongCollectionList,
  decidePassalongDetailMethodNotAllowed,
  decidePassalongDetailPatch,
} from "./routeDecisions/passalongRouteDecisions";
import {
  MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
  MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
  MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
} from "./routeDecisions/routeDecisionNonAuthorizations";

function assertExactKeys(value: unknown, expectedKeys: string[]) {
  assert.ok(value && typeof value === "object");
  assert.deepEqual(Object.keys(value).sort(), [...expectedKeys].sort());
}

function assertExactNonAuthorizations(
  value: unknown,
  expected: readonly string[],
) {
  assert.ok(value && typeof value === "object");
  assert.deepEqual(
    (value as { nonAuthorizations?: unknown }).nonAuthorizations,
    expected,
  );
}

async function assertDecisionSnapshot(
  decision: { status: number; body: unknown },
  expectedStatus: number,
) {
  const snapshot = await readRouteResponse(
    jsonRouteResponse(decision.body, decision.status),
  );
  assertRouteResponseStatus(snapshot, expectedStatus);
  assertRouteResponseHasNonAuthorizations(snapshot);
  assertNoExternalMutationAuthority(snapshot);
  return snapshot;
}

async function testPassalongDecisions() {
  const listDecision = decidePassalongCollectionList(
    createPassalongPersistenceUnavailableList(),
  );
  const listSnapshot = await assertDecisionSnapshot(listDecision, 200);
  assert.equal(
    (listSnapshot.body as { ok?: boolean }).ok,
    false,
  );
  assertExactNonAuthorizations(
    listSnapshot.body,
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  );

  const invalidCreateDecision = decidePassalongCollectionCreate({
    candidate: {
      ok: false,
      value: null,
      errors: ["Synthetic passalong input is invalid."],
    },
  });
  const invalidCreateSnapshot = await assertDecisionSnapshot(
    invalidCreateDecision,
    400,
  );
  assert.equal(
    (invalidCreateSnapshot.body as { error?: string }).error,
    "Passalong field boundary validation blocked persistence; no record was saved.",
  );
  assertExactKeys(invalidCreateSnapshot.body, [
    "ok",
    "error",
    "errors",
    "nonAuthorizations",
  ]);
  assert.equal("record" in invalidCreateDecision.body, false);
  assert.equal("persistence" in invalidCreateDecision.body, false);
  assert.deepEqual(invalidCreateDecision.body, {
    ok: false,
    error:
      "Passalong field boundary validation blocked persistence; no record was saved.",
    errors: ["Synthetic passalong input is invalid."],
    nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
  });

  const writeDecision = decidePassalongCollectionCreate({
    candidate: {
      ok: true,
      value: syntheticPassalongPayload.passalongRecord,
      errors: [],
    },
    persistenceResult: createPassalongPersistenceUnavailableWrite(),
  });
  const writeSnapshot = await assertDecisionSnapshot(writeDecision, 400);
  assertExactNonAuthorizations(
    writeSnapshot.body,
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  );

  const methodDecision = decidePassalongDetailMethodNotAllowed();
  const methodSnapshot = await assertDecisionSnapshot(methodDecision, 405);
  assertExactNonAuthorizations(
    methodSnapshot.body,
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  );

  const patchDecision = decidePassalongDetailPatch(
    createPassalongPersistenceUnavailableWrite(),
  );
  const patchSnapshot = await assertDecisionSnapshot(patchDecision, 400);
  assertExactNonAuthorizations(
    patchSnapshot.body,
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  );
}

async function testMotionIntakeDecisions() {
  const listDecision = decideMotionIntakeList({
    records: [syntheticMotionIntakePayload.draft],
    motionBases: [
      {
        title: syntheticMotionIntakePayload.draft.title,
        advisoryOnly: true,
      },
    ],
  });
  const listSnapshot = await assertDecisionSnapshot(listDecision, 200);
  assert.equal(
    (listSnapshot.body as { ok?: boolean }).ok,
    true,
  );
  assertExactNonAuthorizations(
    listSnapshot.body,
    MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
  );

  const missingDraftDecision = decideMotionIntakeCreate({
    draftPresent: Boolean(
      (missingMotionDraftPayload as { draft?: unknown }).draft,
    ),
  });
  const missingDraftSnapshot = await assertDecisionSnapshot(
    missingDraftDecision,
    400,
  );
  assert.equal(
    (missingDraftSnapshot.body as { error?: string }).error,
    "Missing motion intake draft. No motion was persisted, routed, approved, or executed.",
  );
  assertExactNonAuthorizations(
    missingDraftSnapshot.body,
    MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
  );

  const persistenceResult = createMotionIntakePersistenceUnavailable();
  assertPersistenceUnavailable(persistenceResult);
  const createDecision = decideMotionIntakeCreate({
    draftPresent: true,
    persistenceResult,
    motionBasis: {
      title: syntheticMotionIntakePayload.draft.title,
      advisoryOnly: true,
    },
  });
  const createSnapshot = await assertDecisionSnapshot(createDecision, 200);
  assertExactKeys(createSnapshot.body, [
    "ok",
    "record",
    "motionBasis",
    "nonAuthorizations",
  ]);
  assert.equal("persistence" in createDecision.body, false);
  assert.deepEqual(createDecision.body, {
    ok: true,
    record: persistenceResult.record,
    motionBasis: {
      title: syntheticMotionIntakePayload.draft.title,
      advisoryOnly: true,
    },
    nonAuthorizations: [...MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS],
  });
}

async function testManualInferenceDecision() {
  const providerDisabled = createProviderDisabledSeam();
  assertNoLiveProviderDispatch(providerDisabled);

  const providerConfigMissing = createProviderConfigMissingSeam();
  assertNoLiveProviderDispatch(providerConfigMissing);

  const historyPersistence = createDeliberationHistoryPersistenceUnavailable();
  assertPersistenceUnavailable(historyPersistence);

  const participantOutputs = [
    {
      roleSlotId:
        providerDisabledManualInferencePayload.roleSlotIds?.[0] ??
        "jai-counsel",
      voteValue: "abstain",
      confidenceReadinessNote: "Synthetic advisory output only.",
      nonAuthorizations: [...MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS],
    },
    {
      roleSlotId:
        providerDisabledManualInferencePayload.roleSlotIds?.[1] ??
        "jai-builder",
      voteValue: "revise",
      confidenceReadinessNote: "Second synthetic advisory output only.",
      nonAuthorizations: [...MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS],
    },
  ];
  const aggregateRatification = {
    recommendation: "hold",
    advisoryOnly: true,
  };
  const evidencePointers =
    providerConfigMissingManualInferencePayload.motionBasis?.evidencePointers ??
    [];

  const historyInput = buildManualInferenceHistoryInput({
    motionId:
      providerConfigMissingManualInferencePayload.motionBasis?.id ??
      "a41-route-decision-fixture",
    motionTitle:
      providerConfigMissingManualInferencePayload.motionBasis?.title ??
      "A41 route decision fixture",
    sourceMode: providerConfigMissing.status.mode,
    provider: providerConfigMissing,
    participantOutputs,
    aggregateRatification,
    evidencePointers,
  });
  assert.equal(historyInput.sourceMode, "provider_config_missing");
  assert.equal(
    historyInput.connectorStatusSummary,
    providerConfigMissing.status,
  );
  assert.deepEqual(
    historyInput.nonAuthorizations,
    MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
  );
  assertNoForbiddenAuthorityClaims(historyInput);

  const connectorStatuses = [
    {
      roleSlotId: participantOutputs[0].roleSlotId,
      status: providerDisabled.status,
      nonAuthorityDisclaimer: "Synthetic disabled connector disclaimer.",
    },
    {
      roleSlotId: participantOutputs[1].roleSlotId,
      status: providerConfigMissing.status,
      nonAuthorityDisclaimer: "Synthetic missing-config connector disclaimer.",
    },
  ];

  const decision = decideManualInferenceRun({
    provider: providerDisabled,
    historyPersistence,
    participantOutputs,
    connectorStatuses,
    aggregateRatification,
    evidencePointers,
  });
  const snapshot = await assertDecisionSnapshot(decision, 200);
  assert.equal(
    (snapshot.body as { persisted?: boolean }).persisted,
    false,
  );
  assert.equal(
    (snapshot.body as { operatorTriggeredOnly?: boolean })
      .operatorTriggeredOnly,
    true,
  );
  assert.deepEqual(
    (snapshot.body as { connectorStatuses?: unknown }).connectorStatuses,
    connectorStatuses,
  );
  assert.notDeepEqual(connectorStatuses[0], connectorStatuses[1]);
  assertExactNonAuthorizations(
    snapshot.body,
    MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
  );
}

function testNonAuthorizations() {
  const nonAuthorizations = readStringArrayField(
    {
      nonAuthorizations: [...MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS],
    },
    "nonAuthorizations",
  );
  assert.ok(
    nonAuthorizations.includes(
      "Human / CONTROL_THREAD approval remains required.",
    ),
  );
  assert.ok(nonAuthorizations.includes("No automatic route execution."));
  assertNoForbiddenAuthorityClaims(nonAuthorizations);
}

assertFixturesAreSecretFree();
await testPassalongDecisions();
await testMotionIntakeDecisions();
await testManualInferenceDecision();
testNonAuthorizations();

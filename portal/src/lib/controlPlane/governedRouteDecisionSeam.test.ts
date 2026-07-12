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
  ROUTE_DECISION_NON_AUTHORIZATIONS,
} from "./routeDecisions/routeDecisionNonAuthorizations";

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

  const invalidCreateDecision = decidePassalongCollectionCreate({
    candidate: {
      ok: false,
      value: null,
      errors: ["Synthetic passalong input is invalid."],
    },
    nonAuthorizations: ROUTE_DECISION_NON_AUTHORIZATIONS,
  });
  const invalidCreateSnapshot = await assertDecisionSnapshot(
    invalidCreateDecision,
    400,
  );
  assert.equal(
    (invalidCreateSnapshot.body as { error?: string }).error,
    "Passalong field boundary validation blocked persistence; no record was saved.",
  );

  const writeDecision = decidePassalongCollectionCreate({
    candidate: {
      ok: true,
      value: syntheticPassalongPayload.passalongRecord,
      errors: [],
    },
    persistenceResult: createPassalongPersistenceUnavailableWrite(),
  });
  await assertDecisionSnapshot(writeDecision, 400);

  const methodDecision = decidePassalongDetailMethodNotAllowed(
    ROUTE_DECISION_NON_AUTHORIZATIONS,
  );
  await assertDecisionSnapshot(methodDecision, 405);

  const patchDecision = decidePassalongDetailPatch(
    createPassalongPersistenceUnavailableWrite(),
  );
  await assertDecisionSnapshot(patchDecision, 400);
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
    nonAuthorizations: ROUTE_DECISION_NON_AUTHORIZATIONS,
  });
  const listSnapshot = await assertDecisionSnapshot(listDecision, 200);
  assert.equal(
    (listSnapshot.body as { ok?: boolean }).ok,
    true,
  );

  const missingDraftDecision = decideMotionIntakeCreate({
    draftPresent: Boolean(
      (missingMotionDraftPayload as { draft?: unknown }).draft,
    ),
    nonAuthorizations: ROUTE_DECISION_NON_AUTHORIZATIONS,
  });
  const missingDraftSnapshot = await assertDecisionSnapshot(
    missingDraftDecision,
    400,
  );
  assert.equal(
    (missingDraftSnapshot.body as { error?: string }).error,
    "Missing motion intake draft. No motion was persisted, routed, approved, or executed.",
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
  await assertDecisionSnapshot(createDecision, 200);
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
      nonAuthorizations: [...ROUTE_DECISION_NON_AUTHORIZATIONS],
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
    nonAuthorizations: ROUTE_DECISION_NON_AUTHORIZATIONS,
  });
  assert.equal(historyInput.sourceMode, "provider_config_missing");
  assert.equal(
    historyInput.connectorStatusSummary,
    providerConfigMissing.status,
  );
  assertNoForbiddenAuthorityClaims(historyInput);

  const decision = decideManualInferenceRun({
    provider: providerDisabled,
    historyPersistence,
    participantOutputs,
    aggregateRatification,
    evidencePointers,
    nonAuthorizations: ROUTE_DECISION_NON_AUTHORIZATIONS,
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
}

function testNonAuthorizations() {
  const nonAuthorizations = readStringArrayField(
    {
      nonAuthorizations: [...ROUTE_DECISION_NON_AUTHORIZATIONS],
    },
    "nonAuthorizations",
  );
  assert.ok(nonAuthorizations.includes("CONTROL_THREAD remains authority."));
  assert.ok(nonAuthorizations.includes("No automatic route execution."));
  assertNoForbiddenAuthorityClaims(nonAuthorizations);
}

assertFixturesAreSecretFree();
await testPassalongDecisions();
await testMotionIntakeDecisions();
await testManualInferenceDecision();
testNonAuthorizations();

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
} from "./routeHarness/route-response";
import type {
  ManualInferenceHistoryPersistenceResult,
  ManualInferenceProviderResult,
} from "./routeContracts/adapters/manualInference";
import type { MotionIntakePersistenceResult } from "./routeContracts/adapters/motionIntake";
import type {
  PassalongListResult,
  PassalongWriteResult,
} from "./routeContracts/adapters/passalong";
import {
  MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
} from "./routeContracts/manualInferenceHistory";
import {
  MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
} from "./routeContracts/manualInferenceResponses";
import {
  MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
} from "./routeContracts/motionIntakeResponses";
import {
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
} from "./routeContracts/passalongResponses";
import {
  buildManualInferenceHistoryInput,
  decideManualInferenceRun,
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
  const listSeam = createPassalongPersistenceUnavailableList();
  assertPersistenceUnavailable(listSeam);
  const listResult = {
    kind: "unavailable",
    records: [],
    safeMessage: listSeam.persistence.safeMessage,
    errors: listSeam.errors,
  } satisfies PassalongListResult<unknown>;
  const listDecision = decidePassalongCollectionList(listResult);
  const listSnapshot = await assertDecisionSnapshot(listDecision, 200);
  assert.deepEqual(
    (listSnapshot.body as { nonAuthorizations: string[] }).nonAuthorizations,
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  );

  const invalidCreateDecision = decidePassalongCollectionCreate({
    candidate: {
      ok: false,
      value: null,
      errors: ["Synthetic passalong input is invalid."],
    },
  });
  const invalidSnapshot = await assertDecisionSnapshot(
    invalidCreateDecision,
    400,
  );
  assert.equal("record" in invalidCreateDecision.body, false);
  assert.equal("persistence" in invalidCreateDecision.body, false);
  assert.deepEqual(
    (invalidSnapshot.body as { nonAuthorizations: string[] })
      .nonAuthorizations,
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  );

  const writeSeam = createPassalongPersistenceUnavailableWrite();
  assertPersistenceUnavailable(writeSeam);
  const writeResult = {
    kind: "unavailable",
    record: null,
    errors: writeSeam.errors,
    safeMessage: writeSeam.persistence.safeMessage,
  } satisfies PassalongWriteResult<unknown>;
  const writeDecision = decidePassalongCollectionCreate({
    candidate: {
      ok: true,
      value: syntheticPassalongPayload.passalongRecord,
      errors: [],
    },
    persistenceResult: writeResult,
  });
  await assertDecisionSnapshot(writeDecision, 400);

  await assertDecisionSnapshot(
    decidePassalongDetailMethodNotAllowed(),
    405,
  );
  await assertDecisionSnapshot(decidePassalongDetailPatch(writeResult), 400);
}

async function testMotionIntakeDecisions() {
  const motionBasis = {
    title: syntheticMotionIntakePayload.draft.title,
    advisoryOnly: true,
  };
  const listDecision = decideMotionIntakeList({
    records: [syntheticMotionIntakePayload.draft],
    motionBases: [motionBasis],
  });
  const listSnapshot = await assertDecisionSnapshot(listDecision, 200);
  assert.deepEqual(
    (listSnapshot.body as { nonAuthorizations: string[] }).nonAuthorizations,
    MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
  );

  assert.equal(
    Boolean((missingMotionDraftPayload as { draft?: unknown }).draft),
    false,
  );
  await assertDecisionSnapshot(
    decideMotionIntakeCreate({ draftPresent: false }),
    400,
  );

  const persistenceSeam = createMotionIntakePersistenceUnavailable();
  assertPersistenceUnavailable(persistenceSeam);
  const persistenceResult = {
    kind: "blocked_preview",
    record: persistenceSeam.record,
    safeMessage: persistenceSeam.persistence.safeMessage,
  } satisfies MotionIntakePersistenceResult<typeof persistenceSeam.record>;
  const createDecision = decideMotionIntakeCreate({
    draftPresent: true,
    persistenceResult,
    motionBasis,
  });
  const createSnapshot = await assertDecisionSnapshot(createDecision, 200);
  assert.equal("persistence" in createDecision.body, false);
  assert.deepEqual(
    (createSnapshot.body as { nonAuthorizations: string[] })
      .nonAuthorizations,
    MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
  );
}

async function testManualInferenceDecision() {
  const disabledSeam = createProviderDisabledSeam();
  const configMissingSeam = createProviderConfigMissingSeam();
  assertNoLiveProviderDispatch(disabledSeam);
  assertNoLiveProviderDispatch(configMissingSeam);

  type ParticipantOutput = {
    roleSlotId: string;
    voteValue: string;
    nonAuthorizations: string[];
  };
  const participantOutputs: ParticipantOutput[] = [
    {
      roleSlotId:
        providerDisabledManualInferencePayload.roleSlotIds?.[0] ??
        "jai-counsel",
      voteValue: "abstain",
      nonAuthorizations: [
        ...MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
      ],
    },
    {
      roleSlotId: "jai-builder",
      voteValue: "revise",
      nonAuthorizations: [
        ...MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
      ],
    },
  ];
  const providerDisabled = {
    kind: "provider_disabled",
    status: disabledSeam.status,
    nonAuthorityDisclaimer: disabledSeam.nonAuthorityDisclaimer,
    dispatchAttempted: false,
    networkAccessRequired: false,
  } satisfies ManualInferenceProviderResult<
    typeof disabledSeam.status,
    ParticipantOutput
  >;
  const providerConfigurationMissing = {
    kind: "provider_configuration_missing",
    status: configMissingSeam.status,
    nonAuthorityDisclaimer: configMissingSeam.nonAuthorityDisclaimer,
    dispatchAttempted: false,
    networkAccessRequired: false,
  } satisfies ManualInferenceProviderResult<
    typeof configMissingSeam.status,
    ParticipantOutput
  >;

  const historySeam = createDeliberationHistoryPersistenceUnavailable();
  assertPersistenceUnavailable(historySeam);
  const historyPersistence = {
    kind: "blocked",
    persisted: false,
    previewId: historySeam.persistence.id,
    status: "blocked",
    safeAdvisoryMessage: historySeam.persistence.safeAdvisoryMessage,
    createdAt: "1970-01-01T00:00:00.000Z",
  } satisfies ManualInferenceHistoryPersistenceResult;
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
      "a44-route-decision-fixture",
    motionTitle:
      providerConfigMissingManualInferencePayload.motionBasis?.title ??
      "A44 route decision fixture",
    sourceMode: "provider_unavailable",
    provider: providerConfigurationMissing,
    participantOutputs,
    aggregateRatification,
    evidencePointers,
  });
  assert.deepEqual(
    historyInput.nonAuthorizations,
    MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
  );
  assertNoForbiddenAuthorityClaims(historyInput);

  const connectorStatuses = [
    {
      roleSlotId: participantOutputs[0].roleSlotId,
      status: disabledSeam.status,
      nonAuthorityDisclaimer: "Synthetic disabled connector disclaimer.",
    },
    {
      roleSlotId: participantOutputs[1].roleSlotId,
      status: configMissingSeam.status,
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
  assert.deepEqual(
    (snapshot.body as { connectorStatuses: unknown }).connectorStatuses,
    connectorStatuses,
  );
  assert.deepEqual(
    (snapshot.body as { nonAuthorizations: string[] }).nonAuthorizations,
    MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
  );
}

assertFixturesAreSecretFree();
await testPassalongDecisions();
await testMotionIntakeDecisions();
await testManualInferenceDecision();

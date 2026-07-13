import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { MANUAL_INFERENCE_ORACLE } from "./routeContractOracles/manualInference";
import { MOTION_INTAKE_ORACLE } from "./routeContractOracles/motionIntake";
import { PASSALONG_ORACLE } from "./routeContractOracles/passalong";
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
  MANUAL_INFERENCE_HISTORY_SOURCE_MODES,
} from "./routeContracts/manualInferenceHistory";
import {
  MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
} from "./routeContracts/manualInferenceResponses";
import type { ManualInferenceConnectorStatus } from "./routeContracts/manualInferenceResponses";
import {
  MOTION_INTAKE_MISSING_DRAFT_ERROR,
  MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
} from "./routeContracts/motionIntakeResponses";
import {
  PASSALONG_DETAIL_METHOD_NOT_ALLOWED_ERROR,
  PASSALONG_INVALID_CREATE_ERROR,
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
import { assertNoForbiddenAuthorityClaims } from "./routeHarness/route-response";

interface SyntheticProviderStatus {
  mode: string;
  advisoryMessage: string;
}

interface SyntheticParticipantOutput {
  roleSlotId: string;
  voteValue: string;
}

const passalongRecord = {
  id: "a44-passalong-record",
  advisoryOnly: true,
};
const motionRecord = {
  id: "a44-motion-record",
  authorityState: "non_authoritative",
};
const motionBasis = {
  id: motionRecord.id,
  advisoryOnly: true,
};

const passalongListAvailable = {
  kind: "available",
  records: [passalongRecord],
  safeMessage: "Synthetic passalong list is available.",
} satisfies PassalongListResult<typeof passalongRecord>;

const passalongListUnavailable = {
  kind: "unavailable",
  records: [],
  safeMessage: "Synthetic passalong list is unavailable.",
  errors: ["Synthetic list unavailable."],
} satisfies PassalongListResult<typeof passalongRecord>;

const passalongWriteSucceeded = {
  kind: "succeeded",
  record: passalongRecord,
  errors: [],
  safeMessage: "Synthetic passalong write succeeded.",
} satisfies PassalongWriteResult<typeof passalongRecord>;

const passalongWriteFailed = {
  kind: "failed",
  record: null,
  errors: ["Synthetic passalong write failed."],
  safeMessage: "Synthetic passalong write failed safely.",
} satisfies PassalongWriteResult<typeof passalongRecord>;

const passalongWriteUnavailable = {
  kind: "unavailable",
  record: null,
  errors: ["Synthetic persistence unavailable."],
  safeMessage: "Synthetic passalong persistence is unavailable.",
} satisfies PassalongWriteResult<typeof passalongRecord>;

const motionPersisted = {
  kind: "persisted",
  record: motionRecord,
} satisfies MotionIntakePersistenceResult<typeof motionRecord>;

const motionBlockedPreview = {
  kind: "blocked_preview",
  record: motionRecord,
  safeMessage: "Synthetic motion persistence is blocked.",
} satisfies MotionIntakePersistenceResult<typeof motionRecord>;

const motionUnavailablePreview = {
  kind: "unavailable_preview",
  record: motionRecord,
  safeMessage: "Synthetic motion persistence is unavailable.",
} satisfies MotionIntakePersistenceResult<typeof motionRecord>;

const disabledStatus: SyntheticProviderStatus = {
  mode: "provider_disabled",
  advisoryMessage: "Synthetic provider is disabled.",
};
const configMissingStatus: SyntheticProviderStatus = {
  mode: "provider_config_missing",
  advisoryMessage: "Synthetic provider configuration is missing.",
};
const errorStatus: SyntheticProviderStatus = {
  mode: "provider_error",
  advisoryMessage: "Synthetic provider did not dispatch.",
};
const executedStatus: SyntheticProviderStatus = {
  mode: "provider_configured",
  advisoryMessage: "Synthetic provider execution result only.",
};

const participantOutputs: SyntheticParticipantOutput[] = [
  { roleSlotId: "jai-counsel", voteValue: "abstain" },
  { roleSlotId: "jai-builder", voteValue: "revise" },
];

const providerDisabled = {
  kind: "provider_disabled",
  status: disabledStatus,
  nonAuthorityDisclaimer: "Synthetic disabled provider disclaimer.",
  dispatchAttempted: false,
  networkAccessRequired: false,
} satisfies ManualInferenceProviderResult<
  SyntheticProviderStatus,
  SyntheticParticipantOutput
>;

const providerConfigurationMissing = {
  kind: "provider_configuration_missing",
  status: configMissingStatus,
  nonAuthorityDisclaimer: "Synthetic config-missing provider disclaimer.",
  dispatchAttempted: false,
  networkAccessRequired: false,
} satisfies ManualInferenceProviderResult<
  SyntheticProviderStatus,
  SyntheticParticipantOutput
>;

const providerNotDispatchedError = {
  kind: "provider_not_dispatched_error",
  status: errorStatus,
  nonAuthorityDisclaimer: "Synthetic non-dispatched provider disclaimer.",
  dispatchAttempted: false,
  networkAccessRequired: false,
  reason: "Synthetic unsupported provider.",
} satisfies ManualInferenceProviderResult<
  SyntheticProviderStatus,
  SyntheticParticipantOutput
>;

const providerExecuted = {
  kind: "provider_executed",
  status: executedStatus,
  participantOutput: participantOutputs[0],
  nonAuthorityDisclaimer: "Synthetic executed-result disclaimer.",
  dispatchAttempted: true,
  networkAccessRequired: true,
  outcome: "succeeded",
} satisfies ManualInferenceProviderResult<
  SyntheticProviderStatus,
  SyntheticParticipantOutput
>;

const historyPersisted = {
  kind: "persisted",
  persisted: true,
  durableId: "a44-history-durable",
  status: "persisted",
  safeAdvisoryMessage: "Synthetic history persisted.",
  createdAt: "2026-07-12T00:00:00.000Z",
} satisfies ManualInferenceHistoryPersistenceResult;

const historyBlocked = {
  kind: "blocked",
  persisted: false,
  previewId: "a44-history-blocked-preview",
  status: "blocked",
  safeAdvisoryMessage: "Synthetic history persistence blocked.",
  createdAt: "2026-07-12T00:00:01.000Z",
} satisfies ManualInferenceHistoryPersistenceResult;

const historyUnavailable = {
  kind: "unavailable",
  persisted: false,
  previewId: "a44-history-unavailable-preview",
  status: "blocked",
  safeAdvisoryMessage: "Synthetic history persistence unavailable.",
  createdAt: "2026-07-12T00:00:02.000Z",
  reason: "Synthetic database unavailable.",
} satisfies ManualInferenceHistoryPersistenceResult;

function assertExactKeys(value: object, expected: readonly string[]) {
  assert.deepEqual(Object.keys(value).sort(), [...expected].sort());
}

function assertPassalongParity() {
  assert.equal(
    PASSALONG_INVALID_CREATE_ERROR,
    PASSALONG_ORACLE.errors.invalidCreate,
  );
  assert.equal(
    PASSALONG_DETAIL_METHOD_NOT_ALLOWED_ERROR,
    PASSALONG_ORACLE.errors.detailMethodNotAllowed,
  );
  assert.deepEqual(
    PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
    PASSALONG_ORACLE.nonAuthorizations,
  );

  const availableList = decidePassalongCollectionList(
    passalongListAvailable,
  );
  assert.equal(availableList.status, PASSALONG_ORACLE.statuses.list);
  assertExactKeys(availableList.body, PASSALONG_ORACLE.keys.list);
  assert.deepEqual(availableList.body, {
    ok: true,
    records: [passalongRecord],
    persistence: {
      available: true,
      safeMessage: passalongListAvailable.safeMessage,
    },
    nonAuthorizations: [...PASSALONG_ORACLE.nonAuthorizations],
  });

  const unavailableList = decidePassalongCollectionList(
    passalongListUnavailable,
  );
  assert.equal(unavailableList.status, PASSALONG_ORACLE.statuses.list);
  assertExactKeys(unavailableList.body, PASSALONG_ORACLE.keys.list);
  assert.deepEqual(unavailableList.body, {
    ok: false,
    records: [],
    persistence: {
      available: false,
      safeMessage: passalongListUnavailable.safeMessage,
    },
    nonAuthorizations: [...PASSALONG_ORACLE.nonAuthorizations],
  });

  const invalidCreate = decidePassalongCollectionCreate({
    candidate: {
      ok: false,
      value: null,
      errors: ["Synthetic validation error."],
    },
  });
  assert.equal(
    invalidCreate.status,
    PASSALONG_ORACLE.statuses.invalidCreate,
  );
  assertExactKeys(invalidCreate.body, PASSALONG_ORACLE.keys.invalidCreate);
  assert.equal("record" in invalidCreate.body, false);
  assert.equal("persistence" in invalidCreate.body, false);
  assert.deepEqual(invalidCreate.body, {
    ok: false,
    error: PASSALONG_ORACLE.errors.invalidCreate,
    errors: ["Synthetic validation error."],
    nonAuthorizations: [...PASSALONG_ORACLE.nonAuthorizations],
  });

  assertPassalongWriteDecision(
    decidePassalongCollectionCreate({
      candidate: { ok: true, value: { id: "input" }, errors: [] },
      persistenceResult: passalongWriteSucceeded,
    }),
    PASSALONG_ORACLE.statuses.writeSucceeded,
    passalongRecord,
    [],
    PASSALONG_ORACLE.availability.succeeded,
    passalongWriteSucceeded.safeMessage,
  );
  assertPassalongWriteDecision(
    decidePassalongCollectionCreate({
      candidate: { ok: true, value: { id: "input" }, errors: [] },
      persistenceResult: passalongWriteFailed,
    }),
    PASSALONG_ORACLE.statuses.writeFailed,
    null,
    passalongWriteFailed.errors,
    PASSALONG_ORACLE.availability.failed,
    passalongWriteFailed.safeMessage,
  );
  assertPassalongWriteDecision(
    decidePassalongCollectionCreate({
      candidate: { ok: true, value: { id: "input" }, errors: [] },
      persistenceResult: passalongWriteUnavailable,
    }),
    PASSALONG_ORACLE.statuses.writeFailed,
    null,
    passalongWriteUnavailable.errors,
    PASSALONG_ORACLE.availability.unavailable,
    passalongWriteUnavailable.safeMessage,
  );

  const methodNotAllowed = decidePassalongDetailMethodNotAllowed();
  assert.equal(
    methodNotAllowed.status,
    PASSALONG_ORACLE.statuses.detailMethodNotAllowed,
  );
  assertExactKeys(
    methodNotAllowed.body,
    PASSALONG_ORACLE.keys.detailMethodNotAllowed,
  );
  assert.deepEqual(methodNotAllowed.body, {
    ok: false,
    error: PASSALONG_ORACLE.errors.detailMethodNotAllowed,
    nonAuthorizations: [...PASSALONG_ORACLE.nonAuthorizations],
  });

  assertPassalongWriteDecision(
    decidePassalongDetailPatch(passalongWriteSucceeded),
    PASSALONG_ORACLE.statuses.writeSucceeded,
    passalongRecord,
    [],
    PASSALONG_ORACLE.availability.succeeded,
    passalongWriteSucceeded.safeMessage,
  );
  assertPassalongWriteDecision(
    decidePassalongDetailPatch(passalongWriteFailed),
    PASSALONG_ORACLE.statuses.writeFailed,
    null,
    passalongWriteFailed.errors,
    PASSALONG_ORACLE.availability.failed,
    passalongWriteFailed.safeMessage,
  );
  assertPassalongWriteDecision(
    decidePassalongDetailPatch(passalongWriteUnavailable),
    PASSALONG_ORACLE.statuses.writeFailed,
    null,
    passalongWriteUnavailable.errors,
    PASSALONG_ORACLE.availability.unavailable,
    passalongWriteUnavailable.safeMessage,
  );
}

function assertPassalongWriteDecision(
  decision: { status: 200 | 400; body: object },
  status: 200 | 400,
  record: typeof passalongRecord | null,
  errors: string[],
  available: boolean,
  safeMessage: string,
) {
  assert.equal(decision.status, status);
  assertExactKeys(decision.body, PASSALONG_ORACLE.keys.write);
  assert.deepEqual(decision.body, {
    ok: status === 200,
    record,
    errors,
    persistence: { available, safeMessage },
    nonAuthorizations: [...PASSALONG_ORACLE.nonAuthorizations],
  });
}

function assertMotionIntakeParity() {
  assert.equal(
    MOTION_INTAKE_MISSING_DRAFT_ERROR,
    MOTION_INTAKE_ORACLE.missingDraftError,
  );
  assert.deepEqual(
    MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
    MOTION_INTAKE_ORACLE.nonAuthorizations,
  );

  const list = decideMotionIntakeList({
    records: [motionRecord],
    motionBases: [motionBasis],
  });
  assert.equal(list.status, MOTION_INTAKE_ORACLE.statuses.list);
  assertExactKeys(list.body, MOTION_INTAKE_ORACLE.keys.list);
  assert.deepEqual(list.body, {
    ok: true,
    records: [motionRecord],
    motionBases: [motionBasis],
    nonAuthorizations: [...MOTION_INTAKE_ORACLE.nonAuthorizations],
  });

  const missing = decideMotionIntakeCreate({ draftPresent: false });
  assert.equal(missing.status, MOTION_INTAKE_ORACLE.statuses.missingDraft);
  assertExactKeys(missing.body, MOTION_INTAKE_ORACLE.keys.missingDraft);
  assert.deepEqual(missing.body, {
    ok: false,
    error: MOTION_INTAKE_ORACLE.missingDraftError,
    nonAuthorizations: [...MOTION_INTAKE_ORACLE.nonAuthorizations],
  });

  for (const persistenceResult of [
    motionPersisted,
    motionBlockedPreview,
    motionUnavailablePreview,
  ]) {
    const created = decideMotionIntakeCreate({
      draftPresent: true,
      persistenceResult,
      motionBasis,
    });
    assert.equal(
      created.status,
      MOTION_INTAKE_ORACLE.statuses.createSucceeded,
    );
    assertExactKeys(
      created.body,
      MOTION_INTAKE_ORACLE.keys.createSucceeded,
    );
    assert.equal("persistence" in created.body, false);
    assert.deepEqual(created.body, {
      ok: true,
      record: motionRecord,
      motionBasis,
      nonAuthorizations: [...MOTION_INTAKE_ORACLE.nonAuthorizations],
    });
  }
}

function assertManualInferenceParity() {
  assert.deepEqual(
    MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
    MANUAL_INFERENCE_ORACLE.responseNonAuthorizations,
  );
  assert.deepEqual(
    MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
    MANUAL_INFERENCE_ORACLE.historyNonAuthorizations,
  );
  assert.deepEqual(
    MANUAL_INFERENCE_HISTORY_SOURCE_MODES,
    MANUAL_INFERENCE_ORACLE.historySourceModes,
  );

  const connectorStatuses: Array<
    ManualInferenceConnectorStatus<SyntheticProviderStatus>
  > = [
    {
      roleSlotId: participantOutputs[0].roleSlotId,
      status: disabledStatus,
      nonAuthorityDisclaimer: "First synthetic connector disclaimer.",
    },
    {
      roleSlotId: participantOutputs[1].roleSlotId,
      status: configMissingStatus,
      nonAuthorityDisclaimer: "Second synthetic connector disclaimer.",
    },
  ];
  const aggregateRatification = {
    recommendation: "hold",
    advisoryOnly: true,
  };
  const evidencePointers = [{ id: "a44-evidence", ref: "local://a44" }];

  const decision = decideManualInferenceRun({
    provider: providerDisabled,
    historyPersistence: historyBlocked,
    participantOutputs,
    connectorStatuses,
    aggregateRatification,
    evidencePointers,
  });
  assert.equal(decision.status, MANUAL_INFERENCE_ORACLE.status);
  assertExactKeys(decision.body, MANUAL_INFERENCE_ORACLE.responseKeys);
  assertExactKeys(
    decision.body.persistence,
    MANUAL_INFERENCE_ORACLE.persistenceKeys,
  );
  for (const connectorStatus of decision.body.connectorStatuses) {
    assertExactKeys(
      connectorStatus,
      MANUAL_INFERENCE_ORACLE.connectorStatusKeys,
    );
  }
  assert.deepEqual(decision.body, {
    ok: true,
    persisted: false,
    operatorTriggeredOnly: true,
    providerStatus: disabledStatus,
    persistence: {
      id: historyBlocked.previewId,
      status: "blocked",
      safeAdvisoryMessage: historyBlocked.safeAdvisoryMessage,
      createdAt: historyBlocked.createdAt,
    },
    connectorStatuses,
    participantOutputs,
    aggregateRatification,
    evidencePointers,
    nonAuthorizations: [
      ...MANUAL_INFERENCE_ORACLE.responseNonAuthorizations,
    ],
  });
  assert.notDeepEqual(
    decision.body.connectorStatuses[0],
    decision.body.connectorStatuses[1],
  );

  const historyInput = buildManualInferenceHistoryInput({
    motionId: "a44-motion",
    motionTitle: "A44 synthetic motion",
    sourceMode: "provider_unavailable",
    provider: providerConfigurationMissing,
    participantOutputs,
    aggregateRatification,
    evidencePointers,
  });
  assertExactKeys(historyInput, MANUAL_INFERENCE_ORACLE.historyKeys);
  assert.deepEqual(historyInput, {
    motionId: "a44-motion",
    motionTitle: "A44 synthetic motion",
    sourceMode: "provider_unavailable",
    connectorStatusSummary: configMissingStatus,
    participantOutputs,
    aggregateAdvisoryRatification: aggregateRatification,
    evidencePointers,
    nonAuthorizations: [
      ...MANUAL_INFERENCE_ORACLE.historyNonAuthorizations,
    ],
  });

  for (const historyPersistence of [
    historyPersisted,
    historyBlocked,
    historyUnavailable,
  ]) {
    const mapped = decideManualInferenceRun({
      provider: providerDisabled,
      historyPersistence,
      participantOutputs,
      connectorStatuses,
      aggregateRatification,
      evidencePointers,
    });
    assert.equal(mapped.body.persisted, historyPersistence.persisted);
    assert.equal(
      mapped.body.persistence.id,
      historyPersistence.kind === "persisted"
        ? historyPersistence.durableId
        : historyPersistence.previewId,
    );
    assert.equal(mapped.body.persistence.status, historyPersistence.status);
  }

  for (const provider of [
    providerDisabled,
    providerConfigurationMissing,
    providerNotDispatchedError,
    providerExecuted,
  ]) {
    const mapped = decideManualInferenceRun({
      provider,
      historyPersistence: historyBlocked,
      participantOutputs,
      connectorStatuses,
      aggregateRatification,
      evidencePointers,
    });
    assert.equal(mapped.body.providerStatus, provider.status);
  }

  assert.equal(providerDisabled.dispatchAttempted, false);
  assert.equal(providerConfigurationMissing.networkAccessRequired, false);
  assert.equal(providerNotDispatchedError.dispatchAttempted, false);
  assert.equal(providerExecuted.dispatchAttempted, true);
  assert.equal(providerExecuted.networkAccessRequired, true);
  assertNoForbiddenAuthorityClaims([decision, historyInput]);
}

function assertOracleIsolation() {
  const oracleSources = [
    readSource("./routeContractOracles/passalong.ts"),
    readSource("./routeContractOracles/motionIntake.ts"),
    readSource("./routeContractOracles/manualInference.ts"),
  ];
  for (const source of oracleSources) {
    for (const forbidden of [
      " from ",
      "routeContracts",
      "routeDecisions",
      "app/operator",
      "next/server",
      "server-only",
      "@/lib/prisma",
      "process.env",
      "openai",
    ]) {
      assert.equal(
        source.includes(forbidden),
        false,
        `Expected oracle source to exclude: ${forbidden}`,
      );
    }
  }

  const productionSources = [
    readSource("./routeContracts/passalongResponses.ts"),
    readSource("./routeContracts/motionIntakeResponses.ts"),
    readSource("./routeContracts/manualInferenceResponses.ts"),
    readSource("./routeContracts/manualInferenceHistory.ts"),
    readSource("./routeDecisions/passalongRouteDecisions.ts"),
    readSource("./routeDecisions/motionIntakeRouteDecisions.ts"),
    readSource("./routeDecisions/manualInferenceRouteDecisions.ts"),
  ];
  for (const source of productionSources) {
    assert.equal(source.includes("routeContractOracles"), false);
  }
}

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

assertPassalongParity();
assertMotionIntakeParity();
assertManualInferenceParity();
assertOracleIsolation();

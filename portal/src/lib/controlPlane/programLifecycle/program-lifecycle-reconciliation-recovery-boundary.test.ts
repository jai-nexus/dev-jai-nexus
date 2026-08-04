import assert from "node:assert/strict";

import {
  PROGRAM_LIFECYCLE_FAULT_CLASSIFICATIONS,
  PROGRAM_LIFECYCLE_RECONCILIATION_RESULT_KINDS,
  PROGRAM_LIFECYCLE_ROLLBACK_CLASSIFICATIONS,
  reconcileProgramLifecycleFaultAndRehearseRollback,
  type ProgramLifecycleReconciliationRecoveryResult,
} from "./program-lifecycle-reconciliation-recovery-boundary";
import {
  ProgramActivationSupersessionRollbackConfirmedError,
  createProgramActivationSupersessionService,
  type ProgramActivationSupersessionAdapter,
  type ProgramActivationSupersessionTransaction,
} from "./program-activation-supersession-boundary";
import type { PersistedProgramLifecycleRecord } from "./program-lifecycle-persistence-boundary";
import type { ProgramTransitionReceiptCommandInput } from "./program-transition-receipt-boundary";

const CREATED_AT = "2026-07-30T00:00:00.000Z";
const UPDATED_AT = "2026-07-30T01:00:00.000Z";
const LATER_AT = "2026-07-30T02:00:00.000Z";
const ACTIVE = "OPEN_FOR_BATCH_PLANNING_ONLY" as const;
const NOT_ROUTED = "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN" as const;
const HOLD = "UNRESOLVED_HOLD" as const;
const RESULT_KEYS = [
  "kind",
  "faultClassification",
  "rollbackClassification",
  "expectedStableRecords",
  "observedRecords",
  "rehearsedRollbackRecords",
  "expectedActiveProgram",
  "observedActiveProgram",
  "recoveryPlan",
  "authorityEffect",
  "mutationAuthorized",
  "mutationPerformed",
  "capabilityCredit",
] as const;
const REVIEW_CHECKLIST = [
  "VERIFY_AUTHORITATIVE_PERSISTED_SNAPSHOT",
  "REVIEW_DETECTED_FAULT_CLASSIFICATION",
  "REVIEW_TRANSACTION_AND_TRANSITION_RECEIPT_EVIDENCE",
  "REVIEW_ROLLBACK_REHEARSAL",
  "OBTAIN_SEPARATE_REPAIR_AUTHORIZATION",
] as const;

function record(
  programId: string,
  programCode: string,
  overrides: Partial<PersistedProgramLifecycleRecord> = {},
): PersistedProgramLifecycleRecord {
  return {
    programId,
    programCode,
    programTitle: `Program ${programCode}`,
    lifecycleState: NOT_ROUTED,
    lifecycleVersion: 1,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    ...overrides,
  };
}

function expectedRecords(): PersistedProgramLifecycleRecord[] {
  return [
    record("q3m7y26-p3", "Q3M7Y26-P3", { lifecycleState: "CLOSED_ACCEPTED" }),
    record("q3m7y26-p1", "Q3M7Y26-P1", {
      lifecycleState: ACTIVE,
      lifecycleVersion: 2,
    }),
    record("q3m7y26-p2", "Q3M7Y26-P2"),
  ];
}

function cloneRecords(
  records: readonly PersistedProgramLifecycleRecord[],
): PersistedProgramLifecycleRecord[] {
  return records.map((value) => ({ ...value }));
}

function envelope(
  overrides: Partial<{
    expectedStableRecords: unknown;
    observedRecords: unknown;
    rehearsedRollbackRecords: unknown;
  }> = {},
): Record<string, unknown> {
  const expected = expectedRecords();
  return {
    expectedStableRecords: expected,
    observedRecords: cloneRecords(expected),
    rehearsedRollbackRecords: null,
    ...overrides,
  };
}

function evaluate(overrides: Parameters<typeof envelope>[0] = {}) {
  return reconcileProgramLifecycleFaultAndRehearseRollback(envelope(overrides));
}

function assertFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") {
    return;
  }
  assert.equal(Object.isFrozen(value), true);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.hasOwn(descriptor, "value")) {
      assertFrozen(descriptor.value);
    }
  }
}

function assertCommonContract(result: ProgramLifecycleReconciliationRecoveryResult): void {
  assert.deepEqual(Reflect.ownKeys(result), RESULT_KEYS);
  assert.equal(result.authorityEffect, "NONE");
  assert.equal(result.mutationAuthorized, false);
  assert.equal(result.mutationPerformed, false);
  assert.equal(result.capabilityCredit, "NONE");
  assert.doesNotThrow(() => JSON.stringify(result));
  assertFrozen(result);
}

function assertNullKeys(
  result: ProgramLifecycleReconciliationRecoveryResult,
  expectedNullKeys: readonly (typeof RESULT_KEYS)[number][],
): void {
  assert.deepEqual(
    RESULT_KEYS.filter((key) => result[key] === null),
    expectedNullKeys,
  );
}

function assertCanonicalInvalidInput(
  result: ProgramLifecycleReconciliationRecoveryResult,
): void {
  assert.equal(result.kind, "INVALID_INPUT");
  assertCommonContract(result);
  assertNullKeys(result, [
    "faultClassification",
    "rollbackClassification",
    "expectedStableRecords",
    "observedRecords",
    "rehearsedRollbackRecords",
    "expectedActiveProgram",
    "observedActiveProgram",
    "recoveryPlan",
  ]);
}

function observedWith(
  transform: (records: PersistedProgramLifecycleRecord[]) => PersistedProgramLifecycleRecord[],
): PersistedProgramLifecycleRecord[] {
  return transform(cloneRecords(expectedRecords()));
}

function testVocabulariesAndResultKinds(): void {
  assert.deepEqual(PROGRAM_LIFECYCLE_FAULT_CLASSIFICATIONS, [
    "INVALID_OBSERVED_SNAPSHOT",
    "PROGRAM_SET_MISMATCH",
    "MULTIPLE_ACTIVE_PROGRAMS",
    "ZERO_ACTIVE_PROGRAMS",
    "ACTIVE_PROGRAM_MISMATCH",
    "LIFECYCLE_VERSION_REGRESSION",
    "RECORD_DRIFT",
    "NO_FAULT",
  ]);
  assert.deepEqual(PROGRAM_LIFECYCLE_ROLLBACK_CLASSIFICATIONS, [
    "NOT_APPLICABLE",
    "NOT_SUPPLIED",
    "INVALID_REHEARSAL",
    "MISMATCH",
    "EXACT_MATCH",
  ]);
  assert.deepEqual(PROGRAM_LIFECYCLE_RECONCILIATION_RESULT_KINDS, [
    "INVALID_INPUT",
    "NO_FAULT_DETECTED",
    "FAULT_DETECTED_ROLLBACK_UNPROVEN",
    "FAULT_DETECTED_ROLLBACK_REHEARSED",
  ]);
  assertFrozen(PROGRAM_LIFECYCLE_FAULT_CLASSIFICATIONS);
  assertFrozen(PROGRAM_LIFECYCLE_ROLLBACK_CLASSIFICATIONS);
  assertFrozen(PROGRAM_LIFECYCLE_RECONCILIATION_RESULT_KINDS);

  const results = [
    reconcileProgramLifecycleFaultAndRehearseRollback(null),
    evaluate(),
    evaluate({ observedRecords: [{ invalid: true }] }),
    evaluate({
      observedRecords: observedWith((records) => records.slice(1)),
      rehearsedRollbackRecords: expectedRecords(),
    }),
  ];
  assert.deepEqual(results.map((result) => result.kind), PROGRAM_LIFECYCLE_RECONCILIATION_RESULT_KINDS);
  for (const result of results) assertCommonContract(result);
  assertCanonicalInvalidInput(results[0]!);
  assertNullKeys(results[1]!, ["rehearsedRollbackRecords"]);
  assertNullKeys(results[2]!, [
    "observedRecords",
    "rehearsedRollbackRecords",
    "observedActiveProgram",
  ]);
  assertNullKeys(results[3]!, []);
  assert.ok(results[1]?.expectedStableRecords);
  assert.ok(results[1]?.observedRecords);
  assert.equal(results[1]?.rehearsedRollbackRecords, null);
  assert.ok(results[1]?.expectedActiveProgram);
  assert.ok(results[1]?.observedActiveProgram);
  assert.ok(results[1]?.recoveryPlan);
  assert.equal(results[2]?.observedRecords, null);
  assert.equal(results[2]?.rehearsedRollbackRecords, null);
  assert.ok(results[3]?.rehearsedRollbackRecords);
}

function testFaultClassificationsAndPrecedence(): void {
  const invalidObserved = evaluate({ observedRecords: [{ invalid: true }] });
  assert.equal(invalidObserved.faultClassification, "INVALID_OBSERVED_SNAPSHOT");

  const missing = evaluate({ observedRecords: observedWith((records) => records.slice(1)) });
  assert.equal(missing.faultClassification, "PROGRAM_SET_MISMATCH");
  const additional = evaluate({
    observedRecords: observedWith((records) => [
      ...records,
      record("q3m7y26-p4", "Q3M7Y26-P4"),
    ]),
  });
  assert.equal(additional.faultClassification, "PROGRAM_SET_MISMATCH");
  const substitution = evaluate({
    observedRecords: observedWith((records) => records.map((value) =>
      value.programId === "q3m7y26-p2"
        ? record("q3m7y26-p4", "Q3M7Y26-P4")
        : value,
    )),
  });
  assert.equal(substitution.faultClassification, "PROGRAM_SET_MISMATCH");

  const multiple = evaluate({
    observedRecords: observedWith((records) => records.map((value) =>
      value.programId === "q3m7y26-p2" ? { ...value, lifecycleState: ACTIVE } : value,
    )),
  });
  assert.equal(multiple.faultClassification, "MULTIPLE_ACTIVE_PROGRAMS");
  const zero = evaluate({
    observedRecords: observedWith((records) => records.map((value) =>
      value.programId === "q3m7y26-p1" ? { ...value, lifecycleState: HOLD } : value,
    )),
  });
  assert.equal(zero.faultClassification, "ZERO_ACTIVE_PROGRAMS");
  const activeMismatch = evaluate({
    observedRecords: observedWith((records) => records.map((value) => {
      if (value.programId === "q3m7y26-p1") return { ...value, lifecycleState: HOLD };
      if (value.programId === "q3m7y26-p2") return { ...value, lifecycleState: ACTIVE };
      return value;
    })),
  });
  assert.equal(activeMismatch.faultClassification, "ACTIVE_PROGRAM_MISMATCH");
  const regression = evaluate({
    observedRecords: observedWith((records) => records.map((value) =>
      value.programId === "q3m7y26-p1" ? { ...value, lifecycleVersion: 1 } : value,
    )),
  });
  assert.equal(regression.faultClassification, "LIFECYCLE_VERSION_REGRESSION");

  for (const [field, replacement] of [
    ["lifecycleState", "CLOSED_ACCEPTED"],
    ["programCode", "Q3M7Y26-P20"],
    ["programTitle", "Changed title"],
    ["createdAt", "2026-07-29T23:00:00.000Z"],
    ["updatedAt", LATER_AT],
    ["lifecycleVersion", 3],
  ] as const) {
    const drift = evaluate({
      observedRecords: observedWith((records) => records.map((value) =>
        value.programId === "q3m7y26-p2" ? { ...value, [field]: replacement } : value,
      )),
    });
    assert.equal(drift.faultClassification, "RECORD_DRIFT", field);
  }
  assert.equal(evaluate().faultClassification, "NO_FAULT");

  const setBeforeMultiple = evaluate({
    observedRecords: observedWith((records) => [
      ...records.map((value) => ({ ...value, lifecycleState: ACTIVE })),
      record("q3m7y26-p4", "Q3M7Y26-P4"),
    ]),
  });
  assert.equal(setBeforeMultiple.faultClassification, "PROGRAM_SET_MISMATCH");
  const multipleBeforeRegression = evaluate({
    observedRecords: observedWith((records) => records.map((value) =>
      value.programId === "q3m7y26-p2"
        ? { ...value, lifecycleState: ACTIVE, lifecycleVersion: 0 }
        : value,
    )),
  });
  assert.equal(multipleBeforeRegression.faultClassification, "MULTIPLE_ACTIVE_PROGRAMS");
  const zeroBeforeRegression = evaluate({
    observedRecords: observedWith((records) => records.map((value) =>
      value.programId === "q3m7y26-p1"
        ? { ...value, lifecycleState: HOLD, lifecycleVersion: 1 }
        : value,
    )),
  });
  assert.equal(zeroBeforeRegression.faultClassification, "ZERO_ACTIVE_PROGRAMS");
  const activeBeforeRegression = evaluate({
    observedRecords: observedWith((records) => records.map((value) => {
      if (value.programId === "q3m7y26-p1") return { ...value, lifecycleState: HOLD, lifecycleVersion: 1 };
      if (value.programId === "q3m7y26-p2") return { ...value, lifecycleState: ACTIVE };
      return value;
    })),
  });
  assert.equal(activeBeforeRegression.faultClassification, "ACTIVE_PROGRAM_MISMATCH");
}

function testInvalidExpectedAndObservedIdentity(): void {
  const zeroActiveExpected = expectedRecords().map((value) => ({ ...value, lifecycleState: HOLD }));
  assert.equal(evaluate({ expectedStableRecords: zeroActiveExpected }).kind, "INVALID_INPUT");
  const multipleExpected = expectedRecords().map((value) => ({ ...value, lifecycleState: ACTIVE }));
  assert.equal(evaluate({ expectedStableRecords: multipleExpected }).kind, "INVALID_INPUT");
  assert.equal(evaluate({ expectedStableRecords: [{ invalid: true }] }).kind, "INVALID_INPUT");

  const duplicateExpectedId = expectedRecords();
  duplicateExpectedId[1] = {
    ...duplicateExpectedId[1]!,
    programId: duplicateExpectedId[0]!.programId,
  };
  assert.equal(evaluate({ expectedStableRecords: duplicateExpectedId }).kind, "INVALID_INPUT");
  const duplicateExpectedCode = expectedRecords();
  duplicateExpectedCode[1] = {
    ...duplicateExpectedCode[1]!,
    programCode: duplicateExpectedCode[0]!.programCode,
  };
  assert.equal(evaluate({ expectedStableRecords: duplicateExpectedCode }).kind, "INVALID_INPUT");

  const duplicateId = expectedRecords();
  duplicateId[1] = { ...duplicateId[1]!, programId: duplicateId[0]!.programId };
  assert.equal(evaluate({ observedRecords: duplicateId }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  const duplicateCode = expectedRecords();
  duplicateCode[1] = { ...duplicateCode[1]!, programCode: duplicateCode[0]!.programCode };
  assert.equal(evaluate({ observedRecords: duplicateCode }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
}

function testRollbackClassifications(): void {
  assert.equal(evaluate().rollbackClassification, "NOT_APPLICABLE");
  const fault = observedWith((records) => records.slice(1));
  assert.equal(evaluate({ observedRecords: fault }).rollbackClassification, "NOT_SUPPLIED");
  assert.equal(evaluate({ observedRecords: fault, rehearsedRollbackRecords: {} }).rollbackClassification, "INVALID_REHEARSAL");
  const mismatch = evaluate({ observedRecords: fault, rehearsedRollbackRecords: fault });
  assert.equal(mismatch.rollbackClassification, "MISMATCH");
  assert.equal(mismatch.kind, "FAULT_DETECTED_ROLLBACK_UNPROVEN");
  const exact = evaluate({ observedRecords: fault, rehearsedRollbackRecords: expectedRecords() });
  assert.equal(exact.rollbackClassification, "EXACT_MATCH");
  assert.equal(exact.kind, "FAULT_DETECTED_ROLLBACK_REHEARSED");
}

function testNoFaultRehearsalValidation(): void {
  const nullRehearsal = evaluate({ rehearsedRollbackRecords: null });
  assert.equal(nullRehearsal.kind, "NO_FAULT_DETECTED");
  assert.equal(nullRehearsal.faultClassification, "NO_FAULT");
  assert.equal(nullRehearsal.rollbackClassification, "NOT_APPLICABLE");
  assert.equal(nullRehearsal.rehearsedRollbackRecords, null);

  const validRehearsal = evaluate({ rehearsedRollbackRecords: expectedRecords() });
  assert.equal(validRehearsal.kind, "NO_FAULT_DETECTED");
  assert.equal(validRehearsal.faultClassification, "NO_FAULT");
  assert.equal(validRehearsal.rollbackClassification, "NOT_APPLICABLE");
  assert.equal(validRehearsal.rehearsedRollbackRecords, null);

  const assertRejected = (rehearsal: unknown): void => {
    let result: ProgramLifecycleReconciliationRecoveryResult | null = null;
    assert.doesNotThrow(() => {
      result = evaluate({ rehearsedRollbackRecords: rehearsal });
    });
    assertCanonicalInvalidInput(result!);
  };

  assertRejected({});
  assertRejected([{ invalid: true }, ...expectedRecords().slice(1)]);

  const transparentProxy = new Proxy(expectedRecords(), {});
  assertRejected(transparentProxy);
  let proxyTrapCalls = 0;
  const trappedProxy = new Proxy(expectedRecords(), {
    getPrototypeOf() {
      proxyTrapCalls += 1;
      return Array.prototype;
    },
    ownKeys() {
      proxyTrapCalls += 1;
      return [];
    },
  });
  assertRejected(trappedProxy);
  assert.equal(proxyTrapCalls, 0);
  const revoked = Proxy.revocable(expectedRecords(), {});
  revoked.revoke();
  assertRejected(revoked.proxy);

  let getterCalls = 0;
  const accessorIndexed = expectedRecords();
  Object.defineProperty(accessorIndexed, "1", {
    enumerable: true,
    get() {
      getterCalls += 1;
      return expectedRecords()[1];
    },
  });
  assertRejected(accessorIndexed);
  assert.equal(getterCalls, 0);

  const symbolKeyed = expectedRecords();
  Object.defineProperty(symbolKeyed, Symbol("unexpected"), { value: true });
  assertRejected(symbolKeyed);
  const extraProperty = expectedRecords() as PersistedProgramLifecycleRecord[] & { extra?: boolean };
  extraProperty.extra = true;
  assertRejected(extraProperty);
  const sparse = expectedRecords();
  delete sparse[1];
  assertRejected(sparse);

  class SnapshotArray extends Array<unknown> {}
  assertRejected(new SnapshotArray(...expectedRecords()));
  const customPrototype = expectedRecords();
  Object.setPrototypeOf(customPrototype, { marker: true });
  assertRejected(customPrototype);
  const nullPrototype = expectedRecords();
  Object.setPrototypeOf(nullPrototype, null);
  assertRejected(nullPrototype);
  const cyclic: unknown[] = [];
  cyclic.push(cyclic);
  assertRejected(cyclic);
}

function testCanonicalReportAndRecoveryPlan(): void {
  const cases = [
    {
      result: evaluate({ observedRecords: [{ invalid: true }] }),
      fault: "INVALID_OBSERVED_SNAPSHOT",
      affectedProgramIds: [],
      observedActiveProgram: null,
      findings: [],
    },
    {
      result: evaluate({ observedRecords: observedWith((records) => records.slice(1)) }),
      fault: "PROGRAM_SET_MISMATCH",
      affectedProgramIds: ["q3m7y26-p3"],
      observedActiveProgram: { programId: "q3m7y26-p1", lifecycleState: ACTIVE },
      findings: [{ programId: "q3m7y26-p3", fields: ["PROGRAM_MISSING"] }],
    },
    {
      result: evaluate({
        observedRecords: observedWith((records) => records.map((value) =>
          value.programId === "q3m7y26-p2"
            ? { ...value, lifecycleState: ACTIVE }
            : value,
        )),
      }),
      fault: "MULTIPLE_ACTIVE_PROGRAMS",
      affectedProgramIds: ["q3m7y26-p1", "q3m7y26-p2"],
      observedActiveProgram: null,
      findings: [{ programId: "q3m7y26-p2", fields: ["lifecycleState"] }],
    },
    {
      result: evaluate({
        observedRecords: observedWith((records) => records.map((value) =>
          value.programId === "q3m7y26-p1"
            ? { ...value, lifecycleState: HOLD }
            : value,
        )),
      }),
      fault: "ZERO_ACTIVE_PROGRAMS",
      affectedProgramIds: ["q3m7y26-p1"],
      observedActiveProgram: null,
      findings: [{ programId: "q3m7y26-p1", fields: ["lifecycleState"] }],
    },
    {
      result: evaluate({
        observedRecords: observedWith((records) => records.map((value) => {
          if (value.programId === "q3m7y26-p1") return { ...value, lifecycleState: HOLD };
          if (value.programId === "q3m7y26-p2") return { ...value, lifecycleState: ACTIVE };
          return value;
        })),
      }),
      fault: "ACTIVE_PROGRAM_MISMATCH",
      affectedProgramIds: ["q3m7y26-p1", "q3m7y26-p2"],
      observedActiveProgram: { programId: "q3m7y26-p2", lifecycleState: ACTIVE },
      findings: [
        { programId: "q3m7y26-p1", fields: ["lifecycleState"] },
        { programId: "q3m7y26-p2", fields: ["lifecycleState"] },
      ],
    },
    {
      result: evaluate({
        observedRecords: observedWith((records) => records.map((value) =>
          value.programId === "q3m7y26-p1"
            ? { ...value, lifecycleVersion: 1 }
            : value,
        )),
      }),
      fault: "LIFECYCLE_VERSION_REGRESSION",
      affectedProgramIds: ["q3m7y26-p1"],
      observedActiveProgram: { programId: "q3m7y26-p1", lifecycleState: ACTIVE },
      findings: [{ programId: "q3m7y26-p1", fields: ["lifecycleVersion"] }],
    },
    {
      result: evaluate({
        observedRecords: observedWith((records) => records.map((value) =>
          value.programId === "q3m7y26-p2"
            ? { ...value, programTitle: "Changed", updatedAt: LATER_AT }
            : value,
        )),
      }),
      fault: "RECORD_DRIFT",
      affectedProgramIds: ["q3m7y26-p2"],
      observedActiveProgram: { programId: "q3m7y26-p1", lifecycleState: ACTIVE },
      findings: [{
        programId: "q3m7y26-p2",
        fields: ["programTitle", "updatedAt"],
      }],
    },
  ] as const;

  for (const candidate of cases) {
    const plan = candidate.result.recoveryPlan;
    assert.equal(candidate.result.faultClassification, candidate.fault);
    assertCommonContract(candidate.result);
    assert.ok(plan);
    assert.equal(plan.posture, "HUMAN_REVIEW_REQUIRED");
    assert.equal(plan.executionAuthorized, false);
    assert.equal(plan.faultClassification, candidate.fault);
    assert.deepEqual(plan.expectedActiveProgram, {
      programId: "q3m7y26-p1",
      lifecycleState: ACTIVE,
    });
    assert.deepEqual(plan.observedActiveProgram, candidate.observedActiveProgram);
    assert.deepEqual(candidate.result.observedActiveProgram, candidate.observedActiveProgram);
    assert.deepEqual(plan.affectedProgramIds, candidate.affectedProgramIds);
    assert.deepEqual(plan.findings, candidate.findings);
    assert.deepEqual(plan.reviewChecklist, REVIEW_CHECKLIST);
    assert.equal(plan.reviewChecklist.at(-1), "OBTAIN_SEPARATE_REPAIR_AUTHORIZATION");
  }

  const noFault = evaluate();
  assert.equal(noFault.recoveryPlan?.posture, "NO_ACTION_REQUIRED");
  assert.equal(noFault.recoveryPlan?.executionAuthorized, false);
  assert.deepEqual(noFault.recoveryPlan?.affectedProgramIds, []);
  assert.deepEqual(noFault.recoveryPlan?.findings, []);
  assert.deepEqual(noFault.recoveryPlan?.reviewChecklist, []);
}

function testCallerIsolationAndImmutability(): void {
  const expected = expectedRecords();
  const observed = cloneRecords(expected);
  observed[2] = { ...observed[2]!, programTitle: "Observed drift" };
  const rehearsal = cloneRecords(expected);
  const input = {
    expectedStableRecords: expected,
    observedRecords: observed,
    rehearsedRollbackRecords: rehearsal,
  };
  const expectedReferences = [...expected];
  const observedReferences = [...observed];
  const rehearsalReferences = [...rehearsal];
  const before = JSON.stringify(input);
  const result = reconcileProgramLifecycleFaultAndRehearseRollback(input);
  assert.equal(result.kind, "FAULT_DETECTED_ROLLBACK_REHEARSED");
  assert.equal(JSON.stringify(input), before);
  assert.equal(input.expectedStableRecords, expected);
  assert.equal(input.observedRecords, observed);
  assert.equal(input.rehearsedRollbackRecords, rehearsal);
  for (let index = 0; index < expected.length; index += 1) {
    assert.equal(expected[index], expectedReferences[index]);
    assert.equal(observed[index], observedReferences[index]);
    assert.equal(rehearsal[index], rehearsalReferences[index]);
  }

  for (const callerNode of [
    input,
    expected,
    observed,
    rehearsal,
    ...expected,
    ...observed,
    ...rehearsal,
  ]) {
    assert.equal(Object.isFrozen(callerNode), false);
    assert.equal(Object.isExtensible(callerNode), true);
  }

  assert.notEqual(result.expectedStableRecords, expected);
  assert.notEqual(result.observedRecords, observed);
  assert.notEqual(result.rehearsedRollbackRecords, rehearsal);
  for (const [returned, caller] of [
    [result.expectedStableRecords, expected],
    [result.observedRecords, observed],
    [result.rehearsedRollbackRecords, rehearsal],
  ] as const) {
    assert.ok(returned);
    assert.deepEqual(returned.map((value) => value.programId), [
      "q3m7y26-p1",
      "q3m7y26-p2",
      "q3m7y26-p3",
    ]);
    const callerById = new Map(caller.map((value) => [value.programId, value]));
    for (const returnedRecord of returned) {
      assert.notEqual(returnedRecord, callerById.get(returnedRecord.programId));
    }
  }

  assertFrozen(result);
  const returnedBefore = JSON.stringify(result);
  (expected[1] as { programTitle: string | null }).programTitle = "Caller mutation";
  (observed[1] as { programTitle: string | null }).programTitle = "Observed caller mutation";
  (rehearsal[1] as { programTitle: string | null }).programTitle = "Rehearsal caller mutation";
  assert.equal(JSON.stringify(result), returnedBefore);

  const frozenExpected = Object.freeze(expectedRecords().map((value) => Object.freeze(value)));
  const frozenObserved = Object.freeze(cloneRecords(frozenExpected).map((value) => Object.freeze(value)));
  const frozenInput = Object.freeze({
    expectedStableRecords: frozenExpected,
    observedRecords: frozenObserved,
    rehearsedRollbackRecords: null,
  });
  const frozenResult = reconcileProgramLifecycleFaultAndRehearseRollback(frozenInput);
  assert.equal(frozenResult.kind, "NO_FAULT_DETECTED");
  assert.equal(Object.isFrozen(frozenInput), true);
  assert.equal(Object.isFrozen(frozenExpected), true);
  assert.equal(Object.isFrozen(frozenExpected[0]), true);
}

function testAdversarialInputs(): void {
  const missingRequired = envelope();
  delete missingRequired.rehearsedRollbackRecords;
  assertCanonicalInvalidInput(
    reconcileProgramLifecycleFaultAndRehearseRollback(missingRequired),
  );
  const unexpectedEnumerable = envelope();
  unexpectedEnumerable.unexpected = true;
  assertCanonicalInvalidInput(
    reconcileProgramLifecycleFaultAndRehearseRollback(unexpectedEnumerable),
  );

  let getterCalls = 0;
  const accessorRoot: Record<string, unknown> = {
    observedRecords: expectedRecords(),
    rehearsedRollbackRecords: null,
  };
  Object.defineProperty(accessorRoot, "expectedStableRecords", {
    enumerable: true,
    get() { getterCalls += 1; return expectedRecords(); },
  });
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(accessorRoot).kind, "INVALID_INPUT");
  assert.equal(getterCalls, 0);

  const rootWithSymbol = envelope();
  rootWithSymbol[Symbol("unexpected") as unknown as string] = true;
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(rootWithSymbol).kind, "INVALID_INPUT");
  const nonEnumerableRoot = envelope();
  Object.defineProperty(nonEnumerableRoot, "unexpected", { value: true });
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(nonEnumerableRoot).kind, "INVALID_INPUT");
  const hiddenRequired = envelope();
  Object.defineProperty(hiddenRequired, "observedRecords", { value: expectedRecords(), enumerable: false });
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(hiddenRequired).kind, "INVALID_INPUT");

  const transparentProxy = new Proxy(envelope(), {});
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(transparentProxy).kind, "INVALID_INPUT");
  const hostileProxy = new Proxy(envelope(), {
    ownKeys() { throw new Error("must not reflect"); },
  });
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(hostileProxy).kind, "INVALID_INPUT");
  const revocable = Proxy.revocable(envelope(), {});
  revocable.revoke();
  assert.equal(reconcileProgramLifecycleFaultAndRehearseRollback(revocable.proxy).kind, "INVALID_INPUT");

  const proxiedObserved = new Proxy(expectedRecords(), {});
  assert.equal(evaluate({ observedRecords: proxiedObserved }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  const proxiedRecord = new Proxy(expectedRecords()[0]!, {});
  assert.equal(evaluate({ observedRecords: [proxiedRecord, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  const revokedRecord = Proxy.revocable(expectedRecords()[0]!, {});
  revokedRecord.revoke();
  assert.equal(evaluate({ observedRecords: [revokedRecord.proxy, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  const proxiedRehearsal = new Proxy(expectedRecords(), {});
  const fault = observedWith((records) => records.slice(1));
  assert.equal(evaluate({ observedRecords: fault, rehearsedRollbackRecords: proxiedRehearsal }).rollbackClassification, "INVALID_REHEARSAL");

  const sparse = expectedRecords();
  delete sparse[1];
  assert.equal(evaluate({ expectedStableRecords: sparse }).kind, "INVALID_INPUT");
  const extraPropertyArray = expectedRecords() as PersistedProgramLifecycleRecord[] & { extra?: boolean };
  extraPropertyArray.extra = true;
  assert.equal(evaluate({ expectedStableRecords: extraPropertyArray }).kind, "INVALID_INPUT");
  const accessorIndexed = expectedRecords();
  getterCalls = 0;
  Object.defineProperty(accessorIndexed, "1", {
    enumerable: true,
    get() { getterCalls += 1; return expectedRecords()[1]; },
  });
  assert.equal(evaluate({ expectedStableRecords: accessorIndexed }).kind, "INVALID_INPUT");
  assert.equal(getterCalls, 0);
  class SnapshotArray extends Array<unknown> {}
  const subclassed = new SnapshotArray(...expectedRecords());
  assert.equal(evaluate({ expectedStableRecords: subclassed }).kind, "INVALID_INPUT");
  const customPrototypeArray = expectedRecords();
  Object.setPrototypeOf(customPrototypeArray, { marker: true });
  assert.equal(evaluate({ expectedStableRecords: customPrototypeArray }).kind, "INVALID_INPUT");
  const nullPrototypeArray = expectedRecords();
  Object.setPrototypeOf(nullPrototypeArray, null);
  assert.equal(evaluate({ expectedStableRecords: nullPrototypeArray }).kind, "INVALID_INPUT");

  const customPrototypeRecord = Object.assign(Object.create({ marker: true }), expectedRecords()[0]);
  assert.equal(evaluate({ observedRecords: [customPrototypeRecord, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  const nullPrototypeRecord = Object.assign(Object.create(null), expectedRecords()[0]);
  assert.equal(evaluate({ observedRecords: [nullPrototypeRecord, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");

  getterCalls = 0;
  const accessorRecord = { ...expectedRecords()[0] };
  Object.defineProperty(accessorRecord, "programTitle", {
    enumerable: true,
    get() { getterCalls += 1; return "Unexpected"; },
  });
  assert.equal(evaluate({ observedRecords: [accessorRecord, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  assert.equal(getterCalls, 0);
  const symbolRecord = { ...expectedRecords()[0], [Symbol("unexpected")]: true };
  assert.equal(evaluate({ observedRecords: [symbolRecord, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
  const hiddenRecord = { ...expectedRecords()[0] };
  Object.defineProperty(hiddenRecord, "programTitle", { value: hiddenRecord.programTitle, enumerable: false });
  assert.equal(evaluate({ observedRecords: [hiddenRecord, ...expectedRecords().slice(1)] }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");

  const cyclic: unknown[] = [];
  cyclic.push(cyclic);
  assert.equal(evaluate({ observedRecords: cyclic }).faultClassification, "INVALID_OBSERVED_SNAPSHOT");
}

function c7Command(records: readonly PersistedProgramLifecycleRecord[]): ProgramTransitionReceiptCommandInput {
  const candidateProgramId = "q3m7y26-p1";
  return {
    idempotencyKey: "c14-rollback-rehearsal-key",
    candidateProgramId,
    expectedSupersededProgramId: "q3m7y26-p2",
    governingMotions: [{
      motionId: "c14-governing-motion",
      subjectProgramId: candidateProgramId,
      ratificationState: "RATIFIED",
      decisionState: "PASS",
      mainAcceptanceState: "ACCEPTED_ON_MAIN",
      freshnessState: "CURRENT",
    }],
    receipts: [
      {
        receiptType: "MAIN_STATE_RECEIPT",
        receiptInstanceId: "c14-main-state-receipt",
        subjectProgramId: candidateProgramId,
        issuanceState: "ISSUED",
        integrityState: "VERIFIED",
        authenticityState: "VERIFIED",
        issuerAuthorityState: "ESTABLISHED",
        freshnessState: "CURRENT",
      },
      {
        receiptType: "PROGRAM_OPENING_RECEIPT",
        receiptInstanceId: "c14-program-opening-receipt",
        subjectProgramId: candidateProgramId,
        issuanceState: "ISSUED",
        integrityState: "VERIFIED",
        authenticityState: "VERIFIED",
        issuerAuthorityState: "ESTABLISHED",
        freshnessState: "CURRENT",
      },
    ],
    expectedLifecycleVersions: records
      .map((value) => ({ programId: value.programId, lifecycleVersion: value.lifecycleVersion }))
      .sort((left, right) => left.programId.localeCompare(right.programId)),
  };
}

async function testC7RollbackRehearsalIntegration(): Promise<void> {
  const baseline = [
    record("q3m7y26-p1", "Q3M7Y26-P1", { lifecycleVersion: 0 }),
    record("q3m7y26-p2", "Q3M7Y26-P2", {
      lifecycleState: ACTIVE,
      lifecycleVersion: 0,
    }),
  ];
  let authoritative = cloneRecords(baseline);
  let faultInjectedWorkingCopy: PersistedProgramLifecycleRecord[] | null = null;
  let transactionCalls = 0;
  let mutationCalls = 0;
  let receiptWrites = 0;
  const adapter: ProgramActivationSupersessionAdapter = {
    async transaction<Result>(
      operation: (transaction: ProgramActivationSupersessionTransaction) => Promise<Result>,
    ): Promise<Result> {
      transactionCalls += 1;
      const working = cloneRecords(authoritative);
      return operation({
        async listLockedProgramLifecycleRecords() {
          return cloneRecords(working);
        },
        async findProgramTransitionReceiptSetByIdempotencyKeyHash() {
          return null;
        },
        async setProgramLifecycleState(programId, expectedState, expectedVersion, nextState) {
          const index = working.findIndex((value) => value.programId === programId);
          assert.ok(index >= 0);
          assert.equal(working[index]?.lifecycleState, expectedState);
          assert.equal(working[index]?.lifecycleVersion, expectedVersion);
          working[index] = {
            ...working[index]!,
            lifecycleState: nextState,
            lifecycleVersion: expectedVersion + 1,
            updatedAt: LATER_AT,
          };
          mutationCalls += 1;
          faultInjectedWorkingCopy = cloneRecords(working);
          throw new ProgramActivationSupersessionRollbackConfirmedError();
        },
        async insertProgramTransitionReceiptSet() {
          receiptWrites += 1;
          throw new Error("receipt insertion must not be reached");
        },
      });
    },
  };
  const before = JSON.stringify(authoritative);
  const c7Result = await createProgramActivationSupersessionService(adapter).execute(
    c7Command(baseline),
  );
  assert.deepEqual(c7Result, {
    kind: "UNAVAILABLE",
    writeEffect: "NONE",
    classification: "ROLLBACK_CONFIRMED",
    records: [],
  });
  assert.equal(mutationCalls, 1);
  assert.ok(faultInjectedWorkingCopy);
  assert.equal(JSON.stringify(authoritative), before);
  assert.equal(receiptWrites, 0);

  const callsBeforeC14 = { transactionCalls, mutationCalls, receiptWrites };
  const reconciliation = reconcileProgramLifecycleFaultAndRehearseRollback({
    expectedStableRecords: baseline,
    observedRecords: faultInjectedWorkingCopy,
    rehearsedRollbackRecords: authoritative,
  });
  assert.equal(reconciliation.kind, "FAULT_DETECTED_ROLLBACK_REHEARSED");
  assert.equal(reconciliation.faultClassification, "ZERO_ACTIVE_PROGRAMS");
  assert.equal(reconciliation.rollbackClassification, "EXACT_MATCH");
  assert.deepEqual({ transactionCalls, mutationCalls, receiptWrites }, callsBeforeC14);
  assert.equal(JSON.stringify(authoritative), before);
  assertCommonContract(reconciliation);
  authoritative = cloneRecords(authoritative);
}

async function run(): Promise<void> {
  testVocabulariesAndResultKinds();
  testFaultClassificationsAndPrecedence();
  testInvalidExpectedAndObservedIdentity();
  testRollbackClassifications();
  testNoFaultRehearsalValidation();
  testCanonicalReportAndRecoveryPlan();
  testCallerIsolationAndImmutability();
  testAdversarialInputs();
  await testC7RollbackRehearsalIntegration();
}

await run();

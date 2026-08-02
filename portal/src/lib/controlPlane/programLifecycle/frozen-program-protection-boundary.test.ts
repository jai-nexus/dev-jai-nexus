import assert from "node:assert/strict";

import {
  evaluateFrozenProgramProtection,
  FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES,
  type FrozenProgramProtectionResult,
} from "./frozen-program-protection-boundary";
import { PROGRAM_BINDING_CONTRACT_VERSION } from "./program-binding-propagation-boundary";

const EXPECTED_ACTION_CLASSES = [
  "LIFECYCLE_MUTATION",
  "DOWNSTREAM_MUTATION",
] as const;
const ACTIVE_PROGRAM_ID =
  "jai-governance-intelligence-main-state-operating-loop-v0";
const FROZEN_PROGRAM_IDS = [
  "jai-five-slot-compounded-reasoning-shadow-kernel-v0",
  "jai-founder-developer-workflow-pilot-v0",
  "jai-agent-council-bounded-activation-pilot-v0",
] as const;
const NON_ACTIVE_TARGET_ID = "jai-non-active-state-target-v0";
const RESULT_KEYS = [
  "kind",
  "classificationOnly",
  "sourcePosture",
  "authorityEffect",
  "mutationCredit",
  "mutationAuthorized",
  "mutationPerformed",
  "attemptedAction",
  "guardResult",
] as const;
const EXPECTED_KINDS = [
  "INVALID_INPUT",
  "INVALID_EXPECTED_SNAPSHOT",
  "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT",
  "CROSS_PROGRAM_SUBSTITUTION",
  "STALE_LIFECYCLE_VERSION",
  "LIFECYCLE_VERSION_MISMATCH",
  "GOVERNING_MOTION_MISMATCH",
  "CONTRACT_VERSION_MISMATCH",
  "MULTIPLE_ACTIVE_PROGRAMS",
  "ZERO_ACTIVE_PROGRAM",
  "ACTIVE_PROGRAM_MISMATCH",
  "NON_ACTIVE_PROGRAM_ACTION_REJECTED",
  "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED",
] as const;
const ATTEMPTED_ACTION_KEYS = ["programId", "actionClass"] as const;

function bindingWith(
  values: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    programId: ACTIVE_PROGRAM_ID,
    lifecycleVersion: 3,
    governingMotionId: "motion-0248",
    contractVersion: PROGRAM_BINDING_CONTRACT_VERSION,
    ...values,
  };
}

function record(
  programId: string,
  lifecycleState = "OPEN_FOR_BATCH_PLANNING_ONLY",
): Record<string, unknown> {
  return { programId, lifecycleState };
}

function guardInputWith(
  values: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    portfolio: [record(ACTIVE_PROGRAM_ID)],
    expectedBinding: bindingWith(),
    candidateBinding: bindingWith(),
    ...values,
  };
}

function inputWith(
  values: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    guardInput: guardInputWith(),
    attemptedProgramId: ACTIVE_PROGRAM_ID,
    actionClass: "LIFECYCLE_MUTATION",
    ...values,
  };
}

function assertCommon(result: FrozenProgramProtectionResult): void {
  assert.equal(result.classificationOnly, true);
  assert.equal(result.sourcePosture, "SUPPLIED_EXPECTED_SNAPSHOT");
  assert.equal(result.authorityEffect, "NONE");
  assert.equal(result.mutationCredit, "NONE");
  assert.equal(result.mutationAuthorized, false);
  assert.equal(result.mutationPerformed, false);
}

function assertDeepFrozen(value: unknown): void {
  if (value === null || typeof value !== "object") {
    return;
  }
  assert.equal(Object.isFrozen(value), true);
  for (const key of Reflect.ownKeys(value)) {
    assertDeepFrozen((value as Record<PropertyKey, unknown>)[key]);
  }
}

function assertKind(input: unknown, kind: FrozenProgramProtectionResult["kind"]) {
  const result = evaluateFrozenProgramProtection(input);
  assert.equal(result.kind, kind);
  assertCommon(result);
  return result;
}

function assertNonActiveClassification(
  result: FrozenProgramProtectionResult,
  programId: string,
  actionClass: (typeof EXPECTED_ACTION_CLASSES)[number],
): void {
  assert.equal(result.kind, "NON_ACTIVE_PROGRAM_ACTION_REJECTED");
  assert.equal(result.guardResult?.kind, "GUARD_SATISFIED");
  assert.equal(result.guardResult?.guardSatisfied, true);
  assert.deepEqual(result.attemptedAction, { programId, actionClass });
  assert.deepEqual(Reflect.ownKeys(result.attemptedAction ?? {}), ATTEMPTED_ACTION_KEYS);
  assert.equal(Object.isFrozen(result.attemptedAction), true);
  assert.equal(result.mutationCredit, "NONE");
  assert.equal(result.mutationAuthorized, false);
  assert.equal(result.mutationPerformed, false);
}

function testActionClassContractAndCanonicalFrozenProgramMatrix() {
  assert.deepEqual(FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES, EXPECTED_ACTION_CLASSES);
  assert.equal(Object.isFrozen(FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES), true);
  assert.equal(FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES.length, 2);

  for (const actionClass of EXPECTED_ACTION_CLASSES) {
    const active = assertKind(
      inputWith({ actionClass }),
      "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED",
    );
    assert.deepEqual(active.attemptedAction, {
      programId: ACTIVE_PROGRAM_ID,
      actionClass,
    });
    assert.equal(active.guardResult?.kind, "GUARD_SATISFIED");
    assert.equal(active.guardResult?.guardSatisfied, true);
    assert.deepEqual(Reflect.ownKeys(active.attemptedAction ?? {}), ATTEMPTED_ACTION_KEYS);
    assert.equal(Object.isFrozen(active.attemptedAction), true);
    for (const programId of FROZEN_PROGRAM_IDS) {
      const result = assertKind(
        inputWith({
          attemptedProgramId: programId,
          actionClass,
          guardInput: guardInputWith({
            portfolio: [
              record(ACTIVE_PROGRAM_ID),
              record(programId, "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN"),
            ],
          }),
        }),
        "NON_ACTIVE_PROGRAM_ACTION_REJECTED",
      );
      assertNonActiveClassification(result, programId, actionClass);
    }
  }
}

function testSuppliedNonActiveStateMatrixAndUnknownTarget() {
  for (const actionClass of EXPECTED_ACTION_CLASSES) {
    for (const lifecycleState of [
      "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
      "UNRESOLVED_HOLD",
      "CLOSED_ACCEPTED",
      "CLOSED_NO_GO",
      "CANCELLED",
      "FAILED",
    ]) {
      const result = assertKind(
        inputWith({
          actionClass,
          attemptedProgramId: NON_ACTIVE_TARGET_ID,
          guardInput: guardInputWith({
            portfolio: [
              record(ACTIVE_PROGRAM_ID),
              record(NON_ACTIVE_TARGET_ID, lifecycleState),
            ],
          }),
        }),
        "NON_ACTIVE_PROGRAM_ACTION_REJECTED",
      );
      assertNonActiveClassification(
        result,
        NON_ACTIVE_TARGET_ID,
        actionClass,
      );
    }
    const unknown = assertKind(
      inputWith({ attemptedProgramId: "jai-unknown-program-v0", actionClass }),
      "NON_ACTIVE_PROGRAM_ACTION_REJECTED",
    );
    assertNonActiveClassification(unknown, "jai-unknown-program-v0", actionClass);
    assertKind(
      inputWith({ guardInput: guardInputWith({ portfolio: [] }), actionClass }),
      "ZERO_ACTIVE_PROGRAM",
    );
  }
}

function testLocalAttemptValidation() {
  for (const attemptedProgramId of [
    null,
    "",
    " \t\n",
    "Q3M7Y26-P1",
    "q3m7y26_p1",
    "q3m7y26/p1",
    "-jai-governance-intelligence-main-state-operating-loop-v0",
    "jai-governance-intelligence-main-state-operating-loop-v0-",
    "jai-governance--intelligence-main-state-operating-loop-v0",
    "caf\u00e9-program",
    "jai-governance-intelligence-main-state-operating-loop-v0\u0000",
  ]) {
    const result = assertKind(inputWith({ attemptedProgramId }), "INVALID_INPUT");
    assert.equal(result.guardResult?.kind, "GUARD_SATISFIED");
    assert.equal(result.attemptedAction, null);
  }
  for (const actionClass of [
    null,
    "LIFECYCLE_MUTATION ",
    "DOWNSTREAM_MUTATION_EXTRA",
    "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED",
  ]) {
    const result = assertKind(inputWith({ actionClass }), "INVALID_INPUT");
    assert.equal(result.guardResult?.kind, "GUARD_SATISFIED");
    assert.equal(result.attemptedAction, null);
  }
}

function testC10FailureLiftingAndPrecedence() {
  const cases: readonly [Readonly<Record<string, unknown>>, string][] = [
    [{ guardInput: {} }, "INVALID_INPUT"],
    [{ guardInput: guardInputWith({ expectedBinding: {} }) }, "INVALID_EXPECTED_SNAPSHOT"],
    [{ guardInput: guardInputWith({ candidateBinding: null }) }, "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT"],
    [{ guardInput: guardInputWith({ candidateBinding: bindingWith({ programId: "different-program-v0" }) }) }, "CROSS_PROGRAM_SUBSTITUTION"],
    [{ guardInput: guardInputWith({ candidateBinding: bindingWith({ lifecycleVersion: 2 }) }) }, "STALE_LIFECYCLE_VERSION"],
    [{ guardInput: guardInputWith({ candidateBinding: bindingWith({ lifecycleVersion: 4 }) }) }, "LIFECYCLE_VERSION_MISMATCH"],
    [{ guardInput: guardInputWith({ candidateBinding: bindingWith({ governingMotionId: "other-motion" }) }) }, "GOVERNING_MOTION_MISMATCH"],
    [{ guardInput: guardInputWith({ candidateBinding: bindingWith({ contractVersion: "other" }) }) }, "CONTRACT_VERSION_MISMATCH"],
    [{ guardInput: guardInputWith({ portfolio: [record(ACTIVE_PROGRAM_ID), record("another-active-program-v0")] }) }, "MULTIPLE_ACTIVE_PROGRAMS"],
    [{ guardInput: guardInputWith({ portfolio: [] }) }, "ZERO_ACTIVE_PROGRAM"],
    [{ guardInput: guardInputWith({ portfolio: [record("another-active-program-v0")] }) }, "ACTIVE_PROGRAM_MISMATCH"],
  ];
  for (const [values, kind] of cases) {
    const result = assertKind(
      inputWith({ attemptedProgramId: "invalid_", actionClass: "invalid", ...values }),
      kind as FrozenProgramProtectionResult["kind"],
    );
    assert.equal(result.attemptedAction, null);
    assert.ok(result.guardResult);
    assert.equal(result.guardResult.kind, kind);
    assert.equal(result.guardResult.guardSatisfied, false);
  }
}

function testStrictRootContract() {
  const valid = inputWith();
  const nullPrototype = Object.assign(Object.create(null), valid);
  assertKind(nullPrototype, "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED");
  let accessorReads = 0;
  const accessor = inputWith();
  Object.defineProperty(accessor, "guardInput", {
    enumerable: true,
    get() {
      accessorReads += 1;
      return valid.guardInput;
    },
  });
  const symbol = inputWith();
  Object.defineProperty(symbol, Symbol("unexpected"), { enumerable: true, value: true });
  const nonEnumerableExtra = inputWith();
  Object.defineProperty(nonEnumerableExtra, "unexpected", { enumerable: false, value: true });
  const nonEnumerableRequired = inputWith();
  Object.defineProperty(nonEnumerableRequired, "actionClass", {
    enumerable: false,
    value: nonEnumerableRequired.actionClass,
  });
  const customPrototype = Object.assign(Object.create({ inherited: true }), valid);
  let transparentTrapReads = 0;
  const transparentProxy = new Proxy(valid, {
    getPrototypeOf() {
      transparentTrapReads += 1;
      return Object.prototype;
    },
    ownKeys() {
      transparentTrapReads += 1;
      return Reflect.ownKeys(valid);
    },
  });
  let trappedProxyReads = 0;
  const trappedProxy = new Proxy(valid, {
    getPrototypeOf() {
      trappedProxyReads += 1;
      throw new TypeError("unsafe");
    },
  });
  const revoked = Proxy.revocable(inputWith(), {});
  revoked.revoke();
  for (const malformed of [
    null,
    1,
    [],
    { guardInput: valid.guardInput, attemptedProgramId: ACTIVE_PROGRAM_ID },
    { ...valid, extra: true },
    accessor,
    symbol,
    nonEnumerableExtra,
    nonEnumerableRequired,
    customPrototype,
    transparentProxy,
    trappedProxy,
    new Proxy(valid, { ownKeys: () => { throw new TypeError("unsafe"); } }),
    revoked.proxy,
  ]) {
    assert.doesNotThrow(() => assertKind(malformed, "INVALID_INPUT"));
  }
  assert.equal(accessorReads, 0);
  assert.equal(transparentTrapReads, 0);
  assert.equal(trappedProxyReads, 0);

  const invalidRoot = assertKind({}, "INVALID_INPUT");
  assert.equal(invalidRoot.guardResult, null);
  assert.equal(invalidRoot.attemptedAction, null);
}

function testNestedC10DelegationWithoutInvocation() {
  let expectedAccessorReads = 0;
  const expectedAccessor = Object.defineProperty({}, "programId", {
    enumerable: true,
    get() {
      expectedAccessorReads += 1;
      return ACTIVE_PROGRAM_ID;
    },
  });
  let candidateAccessorReads = 0;
  const candidateAccessor = Object.defineProperty({}, "programId", {
    enumerable: true,
    get() {
      candidateAccessorReads += 1;
      return ACTIVE_PROGRAM_ID;
    },
  });

  const expectedResult = assertKind(
    inputWith({ guardInput: guardInputWith({ expectedBinding: expectedAccessor }) }),
    "INVALID_EXPECTED_SNAPSHOT",
  );
  const candidateResult = assertKind(
    inputWith({ guardInput: guardInputWith({ candidateBinding: candidateAccessor }) }),
    "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT",
  );
  assert.equal(expectedResult.guardResult?.kind, "INVALID_EXPECTED_SNAPSHOT");
  assert.equal(candidateResult.guardResult?.kind, "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT");
  assert.equal(expectedAccessorReads, 0);
  assert.equal(candidateAccessorReads, 0);

  for (const expectedBinding of [
    () => undefined,
    Symbol("expected"),
    new Proxy(bindingWith(), {}),
  ]) {
    const result = assertKind(
      inputWith({ guardInput: guardInputWith({ expectedBinding }) }),
      "INVALID_EXPECTED_SNAPSHOT",
    );
    assert.equal(result.guardResult?.kind, "INVALID_EXPECTED_SNAPSHOT");
  }
  for (const candidateBinding of [
    () => undefined,
    Symbol("candidate"),
    new Proxy(bindingWith(), {}),
  ]) {
    const result = assertKind(
      inputWith({ guardInput: guardInputWith({ candidateBinding }) }),
      "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT",
    );
    assert.equal(result.guardResult?.kind, "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT");
  }
}

function testResultSchemaFreezeAndDetachment() {
  const results = [
    evaluateFrozenProgramProtection({}),
    evaluateFrozenProgramProtection(inputWith({ guardInput: {} })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ expectedBinding: {} }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ candidateBinding: null }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ candidateBinding: bindingWith({ programId: "different-program-v0" }) }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ candidateBinding: bindingWith({ lifecycleVersion: 2 }) }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ candidateBinding: bindingWith({ lifecycleVersion: 4 }) }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ candidateBinding: bindingWith({ governingMotionId: "other-motion" }) }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ candidateBinding: bindingWith({ contractVersion: "other" }) }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ portfolio: [record(ACTIVE_PROGRAM_ID), record("another-active-program-v0")] }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ portfolio: [] }) })),
    evaluateFrozenProgramProtection(inputWith({ guardInput: guardInputWith({ portfolio: [record("another-active-program-v0")] }) })),
    evaluateFrozenProgramProtection(inputWith({ attemptedProgramId: "another-program-v0" })),
    evaluateFrozenProgramProtection(inputWith()),
  ];
  assert.deepEqual(
    [...new Set(results.map((result) => result.kind))].sort(),
    [...EXPECTED_KINDS].sort(),
  );
  for (const result of results) {
    assertCommon(result);
    assert.deepEqual(Reflect.ownKeys(result), RESULT_KEYS);
    assertDeepFrozen(result);
    if (result.guardResult === null) {
      assert.equal(result.kind, "INVALID_INPUT");
      assert.equal(result.attemptedAction, null);
    } else if (
      result.kind === "NON_ACTIVE_PROGRAM_ACTION_REJECTED" ||
      result.kind === "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED"
    ) {
      assert.ok(result.attemptedAction);
    } else {
      assert.equal(result.attemptedAction, null);
    }
  }
}

function testCallerNonMutationAndDetachment() {
  const caller = inputWith({
    guardInput: guardInputWith({
      portfolio: [record("another-program-v0", "CLOSED_ACCEPTED"), record(ACTIVE_PROGRAM_ID)],
    }),
  });
  const guardInput = caller.guardInput as Record<string, unknown>;
  const portfolio = guardInput.portfolio as readonly object[];
  const records = [...portfolio];
  const expectedBinding = guardInput.expectedBinding;
  const candidateBinding = guardInput.candidateBinding;
  const before = structuredClone(caller);
  const result = assertKind(caller, "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED");

  assert.deepEqual(caller, before);
  assert.strictEqual(caller.guardInput, guardInput);
  assert.strictEqual(guardInput.portfolio, portfolio);
  for (const [index, value] of records.entries()) {
    assert.strictEqual((guardInput.portfolio as readonly object[])[index], value);
  }
  assert.strictEqual(guardInput.expectedBinding, expectedBinding);
  assert.strictEqual(guardInput.candidateBinding, candidateBinding);
  assert.equal(Object.isFrozen(caller), false);
  assert.equal(Object.isFrozen(guardInput), false);
  assert.equal(Object.isFrozen(portfolio), false);
  for (const value of portfolio) {
    assert.equal(Object.isFrozen(value), false);
  }
  assert.equal(Object.isFrozen(expectedBinding), false);
  assert.equal(Object.isFrozen(candidateBinding), false);
  assert.notEqual(result.guardResult?.activeProgram, records[1]);
  assert.notEqual(result.guardResult?.bindingComparison?.expectedBinding, expectedBinding);
  assert.notEqual(result.guardResult?.bindingComparison?.candidateBinding, candidateBinding);
  assertDeepFrozen(result);

  (portfolio[1] as Record<string, unknown>).programId = "changed-program-v0";
  (expectedBinding as Record<string, unknown>).programId = "changed-program-v0";
  (candidateBinding as Record<string, unknown>).programId = "changed-program-v0";
  assert.equal(result.guardResult?.activeProgram?.programId, ACTIVE_PROGRAM_ID);
  assert.equal(
    result.guardResult?.bindingComparison?.expectedBinding?.programId,
    ACTIVE_PROGRAM_ID,
  );
}

function run() {
  testActionClassContractAndCanonicalFrozenProgramMatrix();
  testSuppliedNonActiveStateMatrixAndUnknownTarget();
  testLocalAttemptValidation();
  testC10FailureLiftingAndPrecedence();
  testStrictRootContract();
  testNestedC10DelegationWithoutInvocation();
  testResultSchemaFreezeAndDetachment();
  testCallerNonMutationAndDetachment();
}

run();

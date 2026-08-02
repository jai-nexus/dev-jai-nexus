import assert from "node:assert/strict";

import {
  evaluateDownstreamActiveProgramGuard,
  type DownstreamActiveProgramGuardResult,
} from "./downstream-active-program-guard";
import {
  PROGRAM_BINDING_CONTRACT_VERSION,
  type ProgramBindingComparisonResult,
} from "./program-binding-propagation-boundary";

const expectedBinding = {
  programId: "q3m7y26-p1",
  lifecycleVersion: 3,
  governingMotionId: "motion-0248",
  contractVersion: PROGRAM_BINDING_CONTRACT_VERSION,
};

const RESULT_KEYS = [
  "kind",
  "classificationOnly",
  "sourcePosture",
  "authorityEffect",
  "mutationAuthorized",
  "mutationPerformed",
  "guardSatisfied",
  "activeProgram",
  "bindingComparison",
] as const;

function bindingWith(
  values: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return { ...expectedBinding, ...values };
}

function record(
  programId: string,
  lifecycleState = "OPEN_FOR_BATCH_PLANNING_ONLY",
): Record<string, unknown> {
  return { programId, lifecycleState };
}

function inputWith(
  values: Readonly<Record<string, unknown>> = {},
): Record<string, unknown> {
  return {
    portfolio: [record(expectedBinding.programId)],
    expectedBinding: bindingWith(),
    candidateBinding: bindingWith(),
    ...values,
  };
}

function assertCommonBoundary(
  result: DownstreamActiveProgramGuardResult,
): void {
  assert.equal(result.classificationOnly, true);
  assert.equal(result.sourcePosture, "SUPPLIED_EXPECTED_SNAPSHOT");
  assert.equal(result.authorityEffect, "NONE");
  assert.equal(result.mutationAuthorized, false);
  assert.equal(result.mutationPerformed, false);
  assert.equal(result.guardSatisfied, result.kind === "GUARD_SATISFIED");
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

function assertKind(input: unknown, kind: DownstreamActiveProgramGuardResult["kind"]) {
  const result = evaluateDownstreamActiveProgramGuard(input);
  assert.equal(result.kind, kind);
  assertCommonBoundary(result);
  return result;
}

function testExactTopLevelContract() {
  const valid = inputWith();
  assert.equal(assertKind(valid, "GUARD_SATISFIED").kind, "GUARD_SATISFIED");

  const nullPrototype = Object.assign(Object.create(null), valid);
  assert.equal(
    assertKind(nullPrototype, "GUARD_SATISFIED").kind,
    "GUARD_SATISFIED",
  );

  let accessorReads = 0;
  const accessor = inputWith();
  Object.defineProperty(accessor, "portfolio", {
    enumerable: true,
    get() {
      accessorReads += 1;
      return valid.portfolio;
    },
  });
  const withSymbol = inputWith();
  Object.defineProperty(withSymbol, Symbol("unexpected"), {
    enumerable: true,
    value: "unexpected",
  });
  const customPrototype = Object.create({ inherited: true }) as Record<string, unknown>;
  Object.assign(customPrototype, valid);
  const withNonEnumerableExtra = inputWith();
  Object.defineProperty(withNonEnumerableExtra, "unexpected", {
    enumerable: false,
    value: "unexpected",
  });
  const withNonEnumerableRequired = inputWith();
  Object.defineProperty(withNonEnumerableRequired, "candidateBinding", {
    enumerable: false,
    value: withNonEnumerableRequired.candidateBinding,
  });

  const revoked = Proxy.revocable(inputWith(), {});
  revoked.revoke();
  for (const malformed of [
    null,
    [],
    { portfolio: valid.portfolio, expectedBinding: valid.expectedBinding },
    { ...valid, extra: true },
    accessor,
    withSymbol,
    customPrototype,
    withNonEnumerableExtra,
    withNonEnumerableRequired,
    new Proxy(valid, {}),
    new Proxy(valid, {
      ownKeys() {
        throw new TypeError("unsafe");
      },
    }),
    revoked.proxy,
  ]) {
    assert.doesNotThrow(() => assertKind(malformed, "INVALID_INPUT"));
  }
  assert.equal(accessorReads, 0);
}

function testNestedSnapshotsRemainDelegated() {
  let expectedAccessorReads = 0;
  const expectedAccessor = Object.defineProperties({}, {
    programId: {
      enumerable: true,
      get() {
        expectedAccessorReads += 1;
        return expectedBinding.programId;
      },
    },
    lifecycleVersion: { enumerable: true, value: expectedBinding.lifecycleVersion },
    governingMotionId: { enumerable: true, value: expectedBinding.governingMotionId },
    contractVersion: { enumerable: true, value: expectedBinding.contractVersion },
  });
  let candidateAccessorReads = 0;
  const candidateAccessor = Object.defineProperties({}, {
    programId: {
      enumerable: true,
      get() {
        candidateAccessorReads += 1;
        return expectedBinding.programId;
      },
    },
    lifecycleVersion: { enumerable: true, value: expectedBinding.lifecycleVersion },
    governingMotionId: { enumerable: true, value: expectedBinding.governingMotionId },
    contractVersion: { enumerable: true, value: expectedBinding.contractVersion },
  });

  assertKind(
    inputWith({ expectedBinding: expectedAccessor }),
    "INVALID_EXPECTED_SNAPSHOT",
  );
  assertKind(
    inputWith({ candidateBinding: candidateAccessor }),
    "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT",
  );
  assert.equal(expectedAccessorReads, 0);
  assert.equal(candidateAccessorReads, 0);

  for (const expectedSnapshot of [
    () => undefined,
    Symbol("expected"),
    new Proxy(bindingWith(), {}),
  ]) {
    assertKind(
      inputWith({ expectedBinding: expectedSnapshot }),
      "INVALID_EXPECTED_SNAPSHOT",
    );
  }
  for (const candidateSnapshot of [
    () => undefined,
    Symbol("candidate"),
    new Proxy(bindingWith(), {}),
  ]) {
    assertKind(
      inputWith({ candidateBinding: candidateSnapshot }),
      "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT",
    );
  }
}

function testSoleActiveProgramAndDetachment() {
  const caller = inputWith();
  const result = assertKind(caller, "GUARD_SATISFIED");
  assert.deepEqual(result.activeProgram, {
    programId: expectedBinding.programId,
    lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
  });
  assert.ok(result.bindingComparison);
  assert.equal(result.bindingComparison.kind, "EXACT_MATCH");
  assert.notEqual(
    result.activeProgram,
    (caller.portfolio as Record<string, unknown>[])[0],
  );
  assert.notEqual(result.bindingComparison.expectedBinding, caller.expectedBinding);
  assert.notEqual(result.bindingComparison.candidateBinding, caller.candidateBinding);
  assertDeepFrozen(result);

  (caller.portfolio as Record<string, unknown>[])[0].programId = "changed-program";
  (caller.expectedBinding as Record<string, unknown>).programId = "changed-program";
  assert.equal(result.activeProgram?.programId, expectedBinding.programId);
  assert.equal(
    result.bindingComparison.expectedBinding?.programId,
    expectedBinding.programId,
  );
  assert.equal(Object.isFrozen(caller), false);
  assert.equal(Object.isFrozen(caller.portfolio), false);
}

function testZeroAndInactiveStates() {
  assertKind(inputWith({ portfolio: [] }), "ZERO_ACTIVE_PROGRAM");
  for (const lifecycleState of [
    "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
    "UNRESOLVED_HOLD",
    "CLOSED_ACCEPTED",
    "CLOSED_NO_GO",
    "CANCELLED",
    "FAILED",
  ]) {
    assertKind(
      inputWith({ portfolio: [record(expectedBinding.programId, lifecycleState)] }),
      "ZERO_ACTIVE_PROGRAM",
    );
  }
}

function testMultipleAndMismatchedPrograms() {
  const first = assertKind(
    inputWith({
      portfolio: [record("q3m7y26-p3"), record("q3m7y26-p2")],
    }),
    "MULTIPLE_ACTIVE_PROGRAMS",
  );
  const second = assertKind(
    inputWith({
      portfolio: [record("q3m7y26-p2"), record("q3m7y26-p3")],
    }),
    "MULTIPLE_ACTIVE_PROGRAMS",
  );
  assert.deepEqual(first, second);
  assertKind(
    inputWith({ portfolio: [record("q3m7y26-p2")] }),
    "ACTIVE_PROGRAM_MISMATCH",
  );
  assertKind(
    inputWith({
      portfolio: [
        record(expectedBinding.programId, "UNRESOLVED_HOLD"),
        record("q3m7y26-p2"),
      ],
    }),
    "ACTIVE_PROGRAM_MISMATCH",
  );
  assertKind(
    inputWith({ portfolio: [record("Q3M7Y26-P1")] }),
    "ACTIVE_PROGRAM_MISMATCH",
  );
}

function testBindingMismatchPrecedence() {
  const cases: readonly [Readonly<Record<string, unknown>>, string][] = [
    [{ expectedBinding: { programId: "invalid" } }, "INVALID_EXPECTED_SNAPSHOT"],
    [{ candidateBinding: null }, "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT"],
    [{ candidateBinding: bindingWith({ programId: "q3m7y26-p2" }) }, "CROSS_PROGRAM_SUBSTITUTION"],
    [{ candidateBinding: bindingWith({ lifecycleVersion: 2 }) }, "STALE_LIFECYCLE_VERSION"],
    [{ candidateBinding: bindingWith({ lifecycleVersion: 4 }) }, "LIFECYCLE_VERSION_MISMATCH"],
    [{ candidateBinding: bindingWith({ governingMotionId: "other-motion" }) }, "GOVERNING_MOTION_MISMATCH"],
    [{ candidateBinding: bindingWith({ contractVersion: "other-contract" }) }, "CONTRACT_VERSION_MISMATCH"],
  ];
  for (const [values, kind] of cases) {
    const result = assertKind(
      inputWith({
        portfolio: [],
        ...values,
      }),
      kind as DownstreamActiveProgramGuardResult["kind"],
    );
    assert.ok(result.bindingComparison);
    assert.equal(result.bindingComparison.kind, kind);
  }
}

function testCombinedDefectPrecedence() {
  assertKind({ portfolio: [] }, "INVALID_INPUT");
  assertKind(
    inputWith({
      portfolio: [{ programId: "duplicate", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" }, { programId: "duplicate", lifecycleState: "CLOSED_ACCEPTED" }],
    }),
    "INVALID_INPUT",
  );
  assertKind(
    inputWith({
      portfolio: [record("q3m7y26-p2"), record("q3m7y26-p3")],
      candidateBinding: bindingWith({ lifecycleVersion: 2 }),
    }),
    "STALE_LIFECYCLE_VERSION",
  );
  assertKind(
    inputWith({
      portfolio: [record("q3m7y26-p2")],
      candidateBinding: bindingWith({ governingMotionId: "other-motion" }),
    }),
    "GOVERNING_MOTION_MISMATCH",
  );
}

function testC2PrecedesC9WithoutReadingC9Accessors() {
  let expectedAccessorReads = 0;
  let candidateAccessorReads = 0;
  const expectedAccessor = Object.defineProperty({}, "programId", {
    enumerable: true,
    get() {
      expectedAccessorReads += 1;
      return "unexpected";
    },
  });
  const candidateAccessor = Object.defineProperty({}, "programId", {
    enumerable: true,
    get() {
      candidateAccessorReads += 1;
      return "unexpected";
    },
  });

  assertKind(
    inputWith({
      portfolio: [{ programId: "duplicate", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" }, { programId: "duplicate", lifecycleState: "CLOSED_ACCEPTED" }],
      expectedBinding: expectedAccessor,
      candidateBinding: candidateAccessor,
    }),
    "INVALID_INPUT",
  );
  assert.equal(expectedAccessorReads, 0);
  assert.equal(candidateAccessorReads, 0);
}

function testMalformedPortfolioEvidenceFailsClosed() {
  for (const portfolio of [
    null,
    {},
    [{ programId: "q3m7y26-p1", lifecycleState: "UNKNOWN" }],
    [{ programId: "q3m7y26-p1", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY", extra: true }],
    [{ programId: "q3m7y26-p1", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" }, { programId: "q3m7y26-p1", lifecycleState: "CLOSED_ACCEPTED" }],
  ]) {
    assertKind(inputWith({ portfolio }), "INVALID_INPUT");
  }
}

function testEveryResultRetainsTheBoundary() {
  const results = [
    evaluateDownstreamActiveProgramGuard({}),
    evaluateDownstreamActiveProgramGuard(inputWith({ expectedBinding: {} })),
    evaluateDownstreamActiveProgramGuard(inputWith({ candidateBinding: null })),
    evaluateDownstreamActiveProgramGuard(inputWith({ candidateBinding: bindingWith({ programId: "q3m7y26-p2" }) })),
    evaluateDownstreamActiveProgramGuard(inputWith({ candidateBinding: bindingWith({ lifecycleVersion: 2 }) })),
    evaluateDownstreamActiveProgramGuard(inputWith({ candidateBinding: bindingWith({ lifecycleVersion: 4 }) })),
    evaluateDownstreamActiveProgramGuard(inputWith({ candidateBinding: bindingWith({ governingMotionId: "other-motion" }) })),
    evaluateDownstreamActiveProgramGuard(inputWith({ candidateBinding: bindingWith({ contractVersion: "other-contract" }) })),
    evaluateDownstreamActiveProgramGuard(inputWith({ portfolio: [record("q3m7y26-p2"), record("q3m7y26-p3")] })),
    evaluateDownstreamActiveProgramGuard(inputWith({ portfolio: [] })),
    evaluateDownstreamActiveProgramGuard(inputWith({ portfolio: [record("q3m7y26-p2")] })),
    evaluateDownstreamActiveProgramGuard(inputWith()),
  ];
  assert.equal(new Set(results.map((result) => result.kind)).size, 12);
  for (const result of results) {
    assertCommonBoundary(result);
    assertDeepFrozen(result);
    assert.deepEqual(Reflect.ownKeys(result), RESULT_KEYS);
    if (result.kind === "INVALID_INPUT") {
      assert.equal(result.activeProgram, null);
      assert.equal(result.bindingComparison, null);
      continue;
    }
    assert.ok(result.bindingComparison);
    if (
      result.kind === "MULTIPLE_ACTIVE_PROGRAMS" ||
      result.kind === "ZERO_ACTIVE_PROGRAM"
    ) {
      assert.equal(result.activeProgram, null);
    } else {
      assert.ok(result.activeProgram);
    }
  }
}

function testBindingEvidenceDoesNotAlias() {
  const result = assertKind(inputWith(), "GUARD_SATISFIED");
  const comparison = result.bindingComparison as ProgramBindingComparisonResult;
  assert.ok(comparison.expectedBinding);
  assert.ok(comparison.candidateBinding);
  assert.equal(Object.isFrozen(comparison), true);
  assert.equal(Object.isFrozen(comparison.expectedBinding), true);
  assert.equal(Object.isFrozen(comparison.candidateBinding), true);
}

function testCompleteCallerNonMutation() {
  const caller = inputWith({
    portfolio: [
      record("q3m7y26-p2", "CLOSED_ACCEPTED"),
      record(expectedBinding.programId),
    ],
  });
  const portfolio = caller.portfolio;
  const portfolioRecords = [...(portfolio as readonly object[])];
  const callerExpectedBinding = caller.expectedBinding;
  const callerCandidateBinding = caller.candidateBinding;
  const before = structuredClone(caller);
  evaluateDownstreamActiveProgramGuard(caller);

  assert.deepEqual(caller, before);
  assert.strictEqual(caller.portfolio, portfolio);
  for (const [index, portfolioRecord] of portfolioRecords.entries()) {
    assert.strictEqual((caller.portfolio as readonly object[])[index], portfolioRecord);
  }
  assert.strictEqual(caller.expectedBinding, callerExpectedBinding);
  assert.strictEqual(caller.candidateBinding, callerCandidateBinding);
  assert.equal(Object.isFrozen(caller), false);
  assert.equal(Object.isFrozen(caller.portfolio), false);
  for (const portfolioRecord of caller.portfolio as readonly object[]) {
    assert.equal(Object.isFrozen(portfolioRecord), false);
  }
  assert.equal(Object.isFrozen(caller.expectedBinding), false);
  assert.equal(Object.isFrozen(caller.candidateBinding), false);
}

function run() {
  testExactTopLevelContract();
  testNestedSnapshotsRemainDelegated();
  testSoleActiveProgramAndDetachment();
  testZeroAndInactiveStates();
  testMultipleAndMismatchedPrograms();
  testBindingMismatchPrecedence();
  testCombinedDefectPrecedence();
  testC2PrecedesC9WithoutReadingC9Accessors();
  testMalformedPortfolioEvidenceFailsClosed();
  testEveryResultRetainsTheBoundary();
  testBindingEvidenceDoesNotAlias();
  testCompleteCallerNonMutation();
}

run();

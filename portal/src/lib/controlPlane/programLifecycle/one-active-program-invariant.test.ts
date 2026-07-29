import assert from "node:assert/strict";

import {
  PROGRAM_LIFECYCLE_STATES,
  evaluateOneActiveProgramInvariant,
  type ProgramStateRecord,
} from "./one-active-program-invariant";

const inactiveProgram: ProgramStateRecord = {
  programId: "Q3M7Y26-P2",
  lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
};
const activeProgram: ProgramStateRecord = {
  programId: "Q3M7Y26-P1",
  lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
};

function expectInvalid(value: unknown) {
  assert.deepEqual(evaluateOneActiveProgramInvariant(value), {
    kind: "INVALID_INPUT",
    invariantHolds: false,
    guardedActionEligible: false,
    activeProgramIds: [],
  });
}

function testLifecycleVocabularyIsExactAndRuntimeImmutable() {
  const expected = [
    "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
    "OPEN_FOR_BATCH_PLANNING_ONLY",
    "UNRESOLVED_HOLD",
    "CLOSED_ACCEPTED",
    "CLOSED_NO_GO",
    "CANCELLED",
    "FAILED",
  ];

  assert.deepEqual(PROGRAM_LIFECYCLE_STATES, expected);
  assert.equal(PROGRAM_LIFECYCLE_STATES.length, 7);
  assert.equal(Object.isFrozen(PROGRAM_LIFECYCLE_STATES), true);
  assert.throws(
    () => {
      // Test-only cast: production consumers retain the readonly vocabulary type.
      (PROGRAM_LIFECYCLE_STATES as unknown as string[]).push("UNEXPECTED_STATE");
    },
    TypeError,
  );
  assert.deepEqual(PROGRAM_LIFECYCLE_STATES, expected);
}

function testZeroActivePrograms() {
  assert.deepEqual(evaluateOneActiveProgramInvariant([inactiveProgram]), {
    kind: "ZERO_ACTIVE",
    invariantHolds: true,
    guardedActionEligible: false,
    activeProgramIds: [],
  });
}

function testOneActiveProgram() {
  assert.deepEqual(evaluateOneActiveProgramInvariant([inactiveProgram, activeProgram]), {
    kind: "ONE_ACTIVE",
    invariantHolds: true,
    guardedActionEligible: true,
    activeProgramId: "Q3M7Y26-P1",
    activeProgramIds: ["Q3M7Y26-P1"],
  });
}

function testMultipleActiveProgramsFailClosedInSortedOrder() {
  assert.deepEqual(
    evaluateOneActiveProgramInvariant([
      { programId: "Q3M7Y26-P3", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
      activeProgram,
    ]),
    {
      kind: "MULTIPLE_ACTIVE",
      invariantHolds: false,
      guardedActionEligible: false,
      activeProgramIds: ["Q3M7Y26-P1", "Q3M7Y26-P3"],
    },
  );
}

function testInputOrderDoesNotChangeResults() {
  const first = evaluateOneActiveProgramInvariant([
    activeProgram,
    { programId: "Q3M7Y26-P3", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
    inactiveProgram,
  ]);
  const second = evaluateOneActiveProgramInvariant([
    inactiveProgram,
    { programId: "Q3M7Y26-P3", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
    activeProgram,
  ]);

  assert.deepEqual(first, second);
}

function testInvalidIdentifiersAndStatesFailClosed() {
  expectInvalid([
    activeProgram,
    { programId: "Q3M7Y26-P1", lifecycleState: "CLOSED_ACCEPTED" },
  ]);
  expectInvalid([{ programId: "", lifecycleState: "CLOSED_ACCEPTED" }]);
  expectInvalid([{ programId: " \t\n", lifecycleState: "CLOSED_ACCEPTED" }]);
  expectInvalid([{ programId: "Q3M7Y26-P2", lifecycleState: "OPEN" }]);
}

function testMalformedAndUnexpectedInputFailClosed() {
  expectInvalid(null);
  expectInvalid({ programId: "Q3M7Y26-P1", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" });
  expectInvalid([null]);
  expectInvalid(["Q3M7Y26-P1"]);
  expectInvalid([
    {
      programId: "Q3M7Y26-P1",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
      authority: "unexpected",
    },
  ]);
}

function testHeldAndTerminalStatesAreInactive() {
  const records = PROGRAM_LIFECYCLE_STATES
    .filter((state) => state !== "OPEN_FOR_BATCH_PLANNING_ONLY")
    .map((lifecycleState, index) => ({
      programId: `Q3M7Y26-P${index + 2}`,
      lifecycleState,
    }));

  assert.equal(evaluateOneActiveProgramInvariant(records).kind, "ZERO_ACTIVE");
}

function testCallerInputRemainsUnchanged() {
  const records = [
    { programId: "Q3M7Y26-P3", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
    activeProgram,
  ];
  const before = structuredClone(records);

  evaluateOneActiveProgramInvariant(records);

  assert.deepEqual(records, before);
}

function run() {
  testLifecycleVocabularyIsExactAndRuntimeImmutable();
  testZeroActivePrograms();
  testOneActiveProgram();
  testMultipleActiveProgramsFailClosedInSortedOrder();
  testInputOrderDoesNotChangeResults();
  testInvalidIdentifiersAndStatesFailClosed();
  testMalformedAndUnexpectedInputFailClosed();
  testHeldAndTerminalStatesAreInactive();
  testCallerInputRemainsUnchanged();
}

run();

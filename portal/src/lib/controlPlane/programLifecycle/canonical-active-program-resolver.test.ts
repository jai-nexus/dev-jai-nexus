import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  resolveCanonicalActiveProgram,
  type CanonicalActiveProgramResolverResult,
} from "./canonical-active-program-resolver";
import {
  PROGRAM_LIFECYCLE_STATES,
  type ProgramLifecycleState,
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
  assert.deepEqual(resolveCanonicalActiveProgram(value), {
    kind: "INVALID_INPUT",
    invariantHolds: false,
    guardedActionEligible: false,
    activeProgramIds: [],
    activeProgram: null,
  });
}

function testZeroActivePrograms() {
  assert.deepEqual(resolveCanonicalActiveProgram([inactiveProgram]), {
    kind: "ZERO_ACTIVE",
    invariantHolds: true,
    guardedActionEligible: false,
    activeProgramIds: [],
    activeProgram: null,
  });
}

function testOneActiveProgram() {
  assert.deepEqual(
    resolveCanonicalActiveProgram([inactiveProgram, activeProgram]),
    {
      kind: "ONE_ACTIVE",
      invariantHolds: true,
      guardedActionEligible: true,
      activeProgramId: "Q3M7Y26-P1",
      activeProgramIds: ["Q3M7Y26-P1"],
      activeProgram: {
        programId: "Q3M7Y26-P1",
        lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
      },
    },
  );
}

function testActiveSnapshotIsFrozenAndDoesNotAliasCaller() {
  const callerRecord = {
    programId: "Q3M7Y26-P1",
    lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" as ProgramLifecycleState,
  };
  const result = resolveCanonicalActiveProgram([callerRecord]);

  assert.equal(result.kind, "ONE_ACTIVE");
  if (result.kind !== "ONE_ACTIVE") {
    return;
  }

  assert.notEqual(result.activeProgram, callerRecord);
  assert.equal(Object.isFrozen(result.activeProgram), true);
  assert.deepEqual(Object.keys(result.activeProgram), [
    "programId",
    "lifecycleState",
  ]);

  callerRecord.programId = "Q3M7Y26-P9";
  callerRecord.lifecycleState = "CLOSED_ACCEPTED";

  assert.deepEqual(result.activeProgram, {
    programId: "Q3M7Y26-P1",
    lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
  });
  assert.equal(Object.isFrozen(callerRecord), false);
}

function testMultipleActiveProgramsAreSorted() {
  assert.deepEqual(
    resolveCanonicalActiveProgram([
      { programId: "Q3M7Y26-P3", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
      activeProgram,
    ]),
    {
      kind: "MULTIPLE_ACTIVE",
      invariantHolds: false,
      guardedActionEligible: false,
      activeProgramIds: ["Q3M7Y26-P1", "Q3M7Y26-P3"],
      activeProgram: null,
    },
  );
}

function testInputOrderDoesNotChangeResult() {
  const first = resolveCanonicalActiveProgram([
    inactiveProgram,
    activeProgram,
  ]);
  const second = resolveCanonicalActiveProgram([
    activeProgram,
    inactiveProgram,
  ]);

  assert.deepEqual(first, second);
}

function testInvalidInputsFailClosed() {
  expectInvalid([
    activeProgram,
    { programId: "Q3M7Y26-P1", lifecycleState: "CLOSED_ACCEPTED" },
  ]);
  expectInvalid(null);
  expectInvalid([{ programId: "Q3M7Y26-P2", lifecycleState: "OPEN" }]);
  expectInvalid([{ programId: "", lifecycleState: "CLOSED_ACCEPTED" }]);
  expectInvalid([{ programId: " \t\n", lifecycleState: "CLOSED_ACCEPTED" }]);
}

function testHeldAndTerminalStatesRemainInactive() {
  const records = PROGRAM_LIFECYCLE_STATES
    .filter((state) => state !== "OPEN_FOR_BATCH_PLANNING_ONLY")
    .map((lifecycleState, index) => ({
      programId: `Q3M7Y26-P${index + 2}`,
      lifecycleState,
    }));

  assert.equal(resolveCanonicalActiveProgram(records).kind, "ZERO_ACTIVE");
}

function testCallerInputRemainsUnchanged() {
  const records = [
    inactiveProgram,
    activeProgram,
  ];
  const before = structuredClone(records);

  resolveCanonicalActiveProgram(records);

  assert.deepEqual(records, before);
}

function testReconciliationDriftFailsClosed() {
  let programIdReadCount = 0;
  const unstableRecord = Object.defineProperties({}, {
    programId: {
      enumerable: true,
      get() {
        programIdReadCount += 1;
        return programIdReadCount <= 5 ? "Q3M7Y26-P1" : "Q3M7Y26-P2";
      },
    },
    lifecycleState: {
      enumerable: true,
      value: "OPEN_FOR_BATCH_PLANNING_ONLY",
    },
  });

  expectInvalid([unstableRecord]);
}

function testProductionDependencyBoundary() {
  const source = readFileSync(
    new URL("./canonical-active-program-resolver.ts", import.meta.url),
    "utf8",
  );
  const imports = [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)]
    .map((match) => match[1]);

  assert.deepEqual(imports, ["./one-active-program-invariant"]);
  for (const prohibited of [
    "server-only",
    "node:",
    "prisma",
    "fetch(",
    "process.env",
    "Date.",
    "Math.random",
    "linear",
    "authentication",
    "provider",
    "customer",
    "council",
    "deployment",
  ]) {
    assert.ok(
      !source.toLowerCase().includes(prohibited.toLowerCase()),
      `Production source must exclude ${prohibited}`,
    );
  }
}

function assertResultKind(
  result: CanonicalActiveProgramResolverResult,
  kind: CanonicalActiveProgramResolverResult["kind"],
) {
  assert.equal(result.kind, kind);
}

function run() {
  testZeroActivePrograms();
  testOneActiveProgram();
  testActiveSnapshotIsFrozenAndDoesNotAliasCaller();
  testMultipleActiveProgramsAreSorted();
  testInputOrderDoesNotChangeResult();
  testInvalidInputsFailClosed();
  testHeldAndTerminalStatesRemainInactive();
  testCallerInputRemainsUnchanged();
  testReconciliationDriftFailsClosed();
  testProductionDependencyBoundary();
  assertResultKind(resolveCanonicalActiveProgram([]), "ZERO_ACTIVE");
}

run();

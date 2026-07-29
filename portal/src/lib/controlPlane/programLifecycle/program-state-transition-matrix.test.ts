import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  PROGRAM_STATE_TRANSITION_MATRIX,
  PROGRAM_TRANSITION_ACTIONS,
  PROGRAM_TRANSITION_REASON_CODES,
  evaluateProgramStateTransition,
} from "./program-state-transition-matrix";
import { PROGRAM_LIFECYCLE_STATES } from "./one-active-program-invariant";

const [
  notRouted,
  openForBatchPlanning,
  unresolvedHold,
  closedAccepted,
  closedNoGo,
  cancelled,
  failed,
] = PROGRAM_LIFECYCLE_STATES;

const expectedMappings = [
  [notRouted, "OPEN_FOR_BATCH_PLANNING", openForBatchPlanning, "B1-TR-027", "FRESH_MAIN_STATE_RECEIPT"],
  [openForBatchPlanning, "PLACE_ON_HOLD", unresolvedHold, "B1-TR-028", "CONTROL_DISPOSITION_EVIDENCE"],
  [openForBatchPlanning, "CLOSE_ACCEPTED", closedAccepted, "B1-TR-030", "ACCEPTED_DECISION"],
  [openForBatchPlanning, "CLOSE_NO_GO", closedNoGo, "B1-TR-031", "ACCEPTED_DECISION"],
  [openForBatchPlanning, "CANCEL", cancelled, "B1-TR-032", "ACCEPTED_DECISION"],
  [openForBatchPlanning, "FAIL", failed, "B1-TR-033", "ACCEPTED_DECISION"],
  [unresolvedHold, "REOPEN_FOR_BATCH_PLANNING", openForBatchPlanning, "B1-TR-029", "FRESH_MAIN_STATE_RECEIPT"],
  [unresolvedHold, "CLOSE_ACCEPTED", closedAccepted, "B1-TR-034", "ACCEPTED_DECISION"],
  [unresolvedHold, "CLOSE_NO_GO", closedNoGo, "B1-TR-035", "ACCEPTED_DECISION"],
  [unresolvedHold, "CANCEL", cancelled, "B1-TR-036", "ACCEPTED_DECISION"],
  [unresolvedHold, "FAIL", failed, "B1-TR-037", "ACCEPTED_DECISION"],
] as const;

function expectInvalid(value: unknown) {
  assert.deepEqual(evaluateProgramStateTransition(value), {
    kind: "INVALID_INPUT",
    allowed: false,
    sourceState: null,
    action: null,
    targetState: null,
    transitionId: null,
    preconditionClass: null,
    evidenceRequirementClass: null,
    separateAuthorityRequired: null,
    invalidTransitionBehavior: "FAIL_CLOSED",
    reasonCode: "INVALID_INPUT",
    authorityGranted: false,
    transitionPerformed: false,
  });
}

function testActionVocabularyIsExactAndFrozen() {
  assert.deepEqual(PROGRAM_TRANSITION_ACTIONS, [
    "OPEN_FOR_BATCH_PLANNING",
    "PLACE_ON_HOLD",
    "REOPEN_FOR_BATCH_PLANNING",
    "CLOSE_ACCEPTED",
    "CLOSE_NO_GO",
    "CANCEL",
    "FAIL",
  ]);
  assert.equal(Object.isFrozen(PROGRAM_TRANSITION_ACTIONS), true);
  assert.throws(
    () => {
      (PROGRAM_TRANSITION_ACTIONS as unknown as string[]).push("UNLISTED");
    },
    TypeError,
  );
  assert.equal(PROGRAM_TRANSITION_ACTIONS.length, 7);
  assert.deepEqual(PROGRAM_TRANSITION_ACTIONS, [
    "OPEN_FOR_BATCH_PLANNING",
    "PLACE_ON_HOLD",
    "REOPEN_FOR_BATCH_PLANNING",
    "CLOSE_ACCEPTED",
    "CLOSE_NO_GO",
    "CANCEL",
    "FAIL",
  ]);
  assert.deepEqual(PROGRAM_TRANSITION_REASON_CODES, [
    "LISTED_B1_PROGRAM_TRANSITION",
    "UNLISTED_B1_PROGRAM_TRANSITION",
    "INVALID_INPUT",
  ]);
  assert.equal(Object.isFrozen(PROGRAM_TRANSITION_REASON_CODES), true);
}

function testC1StateVocabularyAndMatrixShape() {
  assert.equal(PROGRAM_LIFECYCLE_STATES.length, 7);
  assert.equal(PROGRAM_STATE_TRANSITION_MATRIX.length, 49);
  assert.equal(Object.isFrozen(PROGRAM_STATE_TRANSITION_MATRIX), true);
  assert.equal(
    new Set(
      PROGRAM_STATE_TRANSITION_MATRIX.map((row) => `${row.sourceState}\u0000${row.action}`),
    ).size,
    49,
  );

  for (let stateIndex = 0; stateIndex < PROGRAM_LIFECYCLE_STATES.length; stateIndex += 1) {
    for (let actionIndex = 0; actionIndex < PROGRAM_TRANSITION_ACTIONS.length; actionIndex += 1) {
      const row = PROGRAM_STATE_TRANSITION_MATRIX[
        stateIndex * PROGRAM_TRANSITION_ACTIONS.length + actionIndex
      ];
      assert.equal(row.sourceState, PROGRAM_LIFECYCLE_STATES[stateIndex]);
      assert.equal(row.action, PROGRAM_TRANSITION_ACTIONS[actionIndex]);
      assert.equal(Object.isFrozen(row), true);
    }
  }
}

function testAllowedMappingsAndAllOtherRecognizedPairs() {
  const allowedRows = PROGRAM_STATE_TRANSITION_MATRIX.filter((row) => row.kind === "ALLOWED");
  const deniedRows = PROGRAM_STATE_TRANSITION_MATRIX.filter((row) => row.kind === "DENIED");

  assert.equal(allowedRows.length, 11);
  assert.equal(deniedRows.length, 38);
  assert.deepEqual(
    allowedRows.map((row) => [
      row.sourceState,
      row.action,
      row.targetState,
      row.transitionId,
      row.evidenceRequirementClass,
    ]),
    expectedMappings,
  );

  for (const row of PROGRAM_STATE_TRANSITION_MATRIX) {
    const result = evaluateProgramStateTransition({
      sourceState: row.sourceState,
      action: row.action,
    });
    assert.equal(result, row);
    assert.equal(result.authorityGranted, false);
    assert.equal(result.transitionPerformed, false);
    assert.equal(result.invalidTransitionBehavior, "FAIL_CLOSED");
    if (row.kind === "DENIED") {
      assert.equal(row.targetState, null);
      assert.equal(row.transitionId, null);
      assert.equal(row.reasonCode, "UNLISTED_B1_PROGRAM_TRANSITION");
    }
  }
}

function testTerminalStatesHaveNoAllowedOutgoingAction() {
  for (const sourceState of [closedAccepted, closedNoGo, cancelled, failed]) {
    for (const action of PROGRAM_TRANSITION_ACTIONS) {
      const result = evaluateProgramStateTransition({ sourceState, action });
      assert.equal(result.kind, "DENIED");
      assert.equal(result.allowed, false);
    }
  }
}

function testInvalidInputsFailClosed() {
  expectInvalid({ sourceState: "UNKNOWN", action: "OPEN_FOR_BATCH_PLANNING" });
  expectInvalid({ sourceState: notRouted, action: "UNKNOWN" });
  expectInvalid({ sourceState: notRouted });
  expectInvalid({ sourceState: notRouted, action: "OPEN_FOR_BATCH_PLANNING", extra: true });
  expectInvalid({
    sourceState: notRouted,
    action: "OPEN_FOR_BATCH_PLANNING",
    [Symbol("extra")]: true,
  });
  expectInvalid(Object.defineProperties({}, {
    sourceState: {
      enumerable: true,
      get() {
        throw new Error("accessor must not be read");
      },
    },
    action: {
      enumerable: true,
      value: "OPEN_FOR_BATCH_PLANNING",
    },
  }));
  expectInvalid([]);
  expectInvalid(null);
  expectInvalid("not a request");
}

function testValidValuesArePreservedAndCallerRemainsUnchanged() {
  const request = {
    sourceState: notRouted,
    action: "OPEN_FOR_BATCH_PLANNING" as const,
  };
  const before = structuredClone(request);
  const first = evaluateProgramStateTransition(request);
  const second = evaluateProgramStateTransition(request);

  assert.equal(first, second);
  assert.equal(first.sourceState, request.sourceState);
  assert.equal(first.action, request.action);
  assert.deepEqual(request, before);
  assert.equal(Object.isFrozen(request), false);
}

function testProductionDependencyBoundary() {
  const source = readFileSync(
    new URL("./program-state-transition-matrix.ts", import.meta.url),
    "utf8",
  );
  const imports = [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)]
    .map((match) => match[1]);

  assert.deepEqual(imports, ["./one-active-program-invariant"]);
  assert.ok(source.includes("PROGRAM_LIFECYCLE_STATES"));
  assert.ok(!source.includes("NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN"));
  for (const prohibited of [
    "canonical-active-program-resolver",
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
    "agent",
    "council",
    "deployment",
    "persistence",
  ]) {
    assert.ok(
      !source.toLowerCase().includes(prohibited.toLowerCase()),
      `Production source must exclude ${prohibited}`,
    );
  }
}

function run() {
  testActionVocabularyIsExactAndFrozen();
  testC1StateVocabularyAndMatrixShape();
  testAllowedMappingsAndAllOtherRecognizedPairs();
  testTerminalStatesHaveNoAllowedOutgoingAction();
  testInvalidInputsFailClosed();
  testValidValuesArePreservedAndCallerRemainsUnchanged();
  testProductionDependencyBoundary();
}

run();

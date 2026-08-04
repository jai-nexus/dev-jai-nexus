import { types as nodeTypes } from "node:util";

import {
  evaluateOneActiveProgramInvariant,
} from "./one-active-program-invariant";
import {
  resolveCanonicalActiveProgram,
  type CanonicalActiveProgramSnapshot,
} from "./canonical-active-program-resolver";
import {
  validatePersistedProgramLifecycleRecord,
  type PersistedProgramLifecycleRecord,
} from "./program-lifecycle-persistence-boundary";

export const PROGRAM_LIFECYCLE_FAULT_CLASSIFICATIONS = Object.freeze([
  "INVALID_OBSERVED_SNAPSHOT",
  "PROGRAM_SET_MISMATCH",
  "MULTIPLE_ACTIVE_PROGRAMS",
  "ZERO_ACTIVE_PROGRAMS",
  "ACTIVE_PROGRAM_MISMATCH",
  "LIFECYCLE_VERSION_REGRESSION",
  "RECORD_DRIFT",
  "NO_FAULT",
] as const);

export const PROGRAM_LIFECYCLE_ROLLBACK_CLASSIFICATIONS = Object.freeze([
  "NOT_APPLICABLE",
  "NOT_SUPPLIED",
  "INVALID_REHEARSAL",
  "MISMATCH",
  "EXACT_MATCH",
] as const);

export const PROGRAM_LIFECYCLE_RECONCILIATION_RESULT_KINDS = Object.freeze([
  "INVALID_INPUT",
  "NO_FAULT_DETECTED",
  "FAULT_DETECTED_ROLLBACK_UNPROVEN",
  "FAULT_DETECTED_ROLLBACK_REHEARSED",
] as const);

export type ProgramLifecycleFaultClassification =
  (typeof PROGRAM_LIFECYCLE_FAULT_CLASSIFICATIONS)[number];
export type ProgramLifecycleRollbackClassification =
  (typeof PROGRAM_LIFECYCLE_ROLLBACK_CLASSIFICATIONS)[number];
export type ProgramLifecycleReconciliationResultKind =
  (typeof PROGRAM_LIFECYCLE_RECONCILIATION_RESULT_KINDS)[number];

const ROOT_KEYS = [
  "expectedStableRecords",
  "observedRecords",
  "rehearsedRollbackRecords",
] as const;
const RECORD_KEYS = [
  "programId",
  "programCode",
  "programTitle",
  "lifecycleState",
  "lifecycleVersion",
  "createdAt",
  "updatedAt",
] as const;
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
const REVIEW_CHECKLIST = Object.freeze([
  "VERIFY_AUTHORITATIVE_PERSISTED_SNAPSHOT",
  "REVIEW_DETECTED_FAULT_CLASSIFICATION",
  "REVIEW_TRANSACTION_AND_TRANSITION_RECEIPT_EVIDENCE",
  "REVIEW_ROLLBACK_REHEARSAL",
  "OBTAIN_SEPARATE_REPAIR_AUTHORIZATION",
] as const);
type DifferenceField =
  | (typeof RECORD_KEYS)[number]
  | "PROGRAM_MISSING"
  | "PROGRAM_ADDITIONAL";

export type ProgramLifecycleRecordDifference = Readonly<{
  readonly programId: string;
  readonly fields: readonly DifferenceField[];
}>;

export type ProgramLifecycleRecoveryPlan = Readonly<{
  readonly posture: "NO_ACTION_REQUIRED" | "HUMAN_REVIEW_REQUIRED";
  readonly executionAuthorized: false;
  readonly faultClassification: ProgramLifecycleFaultClassification;
  readonly affectedProgramIds: readonly string[];
  readonly expectedActiveProgram: CanonicalActiveProgramSnapshot | null;
  readonly observedActiveProgram: CanonicalActiveProgramSnapshot | null;
  readonly findings: readonly ProgramLifecycleRecordDifference[];
  readonly reviewChecklist: readonly string[];
}>;

export type ProgramLifecycleReconciliationRecoveryResult = Readonly<{
  readonly kind: ProgramLifecycleReconciliationResultKind;
  readonly faultClassification: ProgramLifecycleFaultClassification | null;
  readonly rollbackClassification: ProgramLifecycleRollbackClassification | null;
  readonly expectedStableRecords: readonly PersistedProgramLifecycleRecord[] | null;
  readonly observedRecords: readonly PersistedProgramLifecycleRecord[] | null;
  readonly rehearsedRollbackRecords: readonly PersistedProgramLifecycleRecord[] | null;
  readonly expectedActiveProgram: CanonicalActiveProgramSnapshot | null;
  readonly observedActiveProgram: CanonicalActiveProgramSnapshot | null;
  readonly recoveryPlan: ProgramLifecycleRecoveryPlan | null;
  readonly authorityEffect: "NONE";
  readonly mutationAuthorized: false;
  readonly mutationPerformed: false;
  readonly capabilityCredit: "NONE";
}>;

type ParsedSnapshot = Readonly<{
  readonly records: readonly PersistedProgramLifecycleRecord[];
  readonly activeResult: ReturnType<typeof evaluateOneActiveProgramInvariant>;
  readonly activeProgram: CanonicalActiveProgramSnapshot | null;
}>;

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function freezeDeep<Value>(value: Value): Value {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.hasOwn(descriptor, "value")) {
      freezeDeep(descriptor.value);
    }
  }
  return Object.freeze(value);
}

function readExactDataObject(
  input: unknown,
  expectedKeys: readonly string[],
): Readonly<Record<string, unknown>> | null {
  if (
    typeof input !== "object" ||
    input === null ||
    nodeTypes.isProxy(input) ||
    Array.isArray(input) ||
    Object.getPrototypeOf(input) !== Object.prototype
  ) {
    return null;
  }
  const keys = Reflect.ownKeys(input);
  if (
    keys.length !== expectedKeys.length ||
    keys.some((key) => typeof key !== "string") ||
    !expectedKeys.every((key) => keys.includes(key))
  ) {
    return null;
  }
  const values: Record<string, unknown> = {};
  for (const key of expectedKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (
      !descriptor ||
      !Object.hasOwn(descriptor, "value") ||
      descriptor.enumerable !== true
    ) {
      return null;
    }
    values[key] = descriptor.value;
  }
  return values;
}

function readDenseOrdinaryArray(input: unknown): readonly unknown[] | null {
  if (
    nodeTypes.isProxy(input) ||
    !Array.isArray(input) ||
    Object.getPrototypeOf(input) !== Array.prototype
  ) {
    return null;
  }
  const lengthDescriptor = Object.getOwnPropertyDescriptor(input, "length");
  if (
    !lengthDescriptor ||
    !Object.hasOwn(lengthDescriptor, "value") ||
    typeof lengthDescriptor.value !== "number" ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    lengthDescriptor.value < 0
  ) {
    return null;
  }
  const length = lengthDescriptor.value;
  const keys = Reflect.ownKeys(input);
  if (keys.length !== length + 1 || keys[length] !== "length") {
    return null;
  }
  const values: unknown[] = [];
  for (let index = 0; index < length; index += 1) {
    const key = String(index);
    if (keys[index] !== key) {
      return null;
    }
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (
      !descriptor ||
      !Object.hasOwn(descriptor, "value") ||
      descriptor.enumerable !== true
    ) {
      return null;
    }
    values.push(descriptor.value);
  }
  return values;
}

function parseSnapshot(input: unknown): ParsedSnapshot | null {
  const values = readDenseOrdinaryArray(input);
  if (!values) {
    return null;
  }
  const programIds = new Set<string>();
  const programCodes = new Set<string>();
  const records: PersistedProgramLifecycleRecord[] = [];
  for (const value of values) {
    if (!readExactDataObject(value, RECORD_KEYS)) {
      return null;
    }
    const record = validatePersistedProgramLifecycleRecord(value);
    if (
      !record ||
      programIds.has(record.programId) ||
      programCodes.has(record.programCode)
    ) {
      return null;
    }
    programIds.add(record.programId);
    programCodes.add(record.programCode);
    records.push(record);
  }
  records.sort((left, right) => compareStrings(left.programId, right.programId));
  const projections = records.map((record) => ({
    programId: record.programId,
    lifecycleState: record.lifecycleState,
  }));
  const activeResult = evaluateOneActiveProgramInvariant(projections);
  if (activeResult.kind === "INVALID_INPUT") {
    return null;
  }
  const resolved = resolveCanonicalActiveProgram(projections);
  const activeProgram = resolved.kind === "ONE_ACTIVE" ? resolved.activeProgram : null;
  return Object.freeze({
    records: Object.freeze(records),
    activeResult,
    activeProgram,
  });
}

function recordsEqual(
  expected: readonly PersistedProgramLifecycleRecord[],
  actual: readonly PersistedProgramLifecycleRecord[],
): boolean {
  return expected.length === actual.length && expected.every((record, index) => {
    const candidate = actual[index];
    return candidate !== undefined && RECORD_KEYS.every((key) => record[key] === candidate[key]);
  });
}

function sameProgramSet(
  expected: readonly PersistedProgramLifecycleRecord[],
  observed: readonly PersistedProgramLifecycleRecord[],
): boolean {
  return expected.length === observed.length && expected.every(
    (record, index) => observed[index]?.programId === record.programId,
  );
}

function recordDifferences(
  expected: readonly PersistedProgramLifecycleRecord[],
  observed: readonly PersistedProgramLifecycleRecord[],
): readonly ProgramLifecycleRecordDifference[] {
  const expectedById = new Map(expected.map((record) => [record.programId, record]));
  const observedById = new Map(observed.map((record) => [record.programId, record]));
  const programIds = [...new Set([...expectedById.keys(), ...observedById.keys()])]
    .sort(compareStrings);
  const findings: ProgramLifecycleRecordDifference[] = [];
  for (const programId of programIds) {
    const expectedRecord = expectedById.get(programId);
    const observedRecord = observedById.get(programId);
    let fields: DifferenceField[];
    if (!observedRecord) {
      fields = ["PROGRAM_MISSING"];
    } else if (!expectedRecord) {
      fields = ["PROGRAM_ADDITIONAL"];
    } else {
      fields = RECORD_KEYS.filter((key) => expectedRecord[key] !== observedRecord[key]);
    }
    if (fields.length > 0) {
      findings.push(Object.freeze({
        programId,
        fields: Object.freeze(fields),
      }));
    }
  }
  return Object.freeze(findings);
}

function classifyFault(
  expected: ParsedSnapshot,
  observed: ParsedSnapshot | null,
): ProgramLifecycleFaultClassification {
  if (!observed) {
    return "INVALID_OBSERVED_SNAPSHOT";
  }
  if (!sameProgramSet(expected.records, observed.records)) {
    return "PROGRAM_SET_MISMATCH";
  }
  if (observed.activeResult.kind === "MULTIPLE_ACTIVE") {
    return "MULTIPLE_ACTIVE_PROGRAMS";
  }
  if (observed.activeResult.kind === "ZERO_ACTIVE") {
    return "ZERO_ACTIVE_PROGRAMS";
  }
  if (
    observed.activeResult.kind !== "ONE_ACTIVE" ||
    expected.activeResult.kind !== "ONE_ACTIVE" ||
    observed.activeResult.activeProgramId !== expected.activeResult.activeProgramId
  ) {
    return "ACTIVE_PROGRAM_MISMATCH";
  }
  if (expected.records.some((record, index) => {
    const candidate = observed.records[index];
    return candidate !== undefined && candidate.lifecycleVersion < record.lifecycleVersion;
  })) {
    return "LIFECYCLE_VERSION_REGRESSION";
  }
  return recordsEqual(expected.records, observed.records) ? "NO_FAULT" : "RECORD_DRIFT";
}

function affectedProgramIds(
  fault: ProgramLifecycleFaultClassification,
  expected: ParsedSnapshot,
  observed: ParsedSnapshot | null,
  findings: readonly ProgramLifecycleRecordDifference[],
): readonly string[] {
  if (!observed || fault === "INVALID_OBSERVED_SNAPSHOT") {
    return Object.freeze([]);
  }
  if (fault === "MULTIPLE_ACTIVE_PROGRAMS") {
    return Object.freeze([...observed.activeResult.activeProgramIds].sort(compareStrings));
  }
  if (fault === "ZERO_ACTIVE_PROGRAMS") {
    return Object.freeze(expected.activeResult.kind === "ONE_ACTIVE" ? [expected.activeResult.activeProgramId] : []);
  }
  if (fault === "ACTIVE_PROGRAM_MISMATCH") {
    const ids = [
      expected.activeResult.kind === "ONE_ACTIVE" ? expected.activeResult.activeProgramId : null,
      observed.activeResult.kind === "ONE_ACTIVE" ? observed.activeResult.activeProgramId : null,
    ].filter((value): value is string => value !== null);
    return Object.freeze([...new Set(ids)].sort(compareStrings));
  }
  return Object.freeze(findings.map((finding) => finding.programId).sort(compareStrings));
}

function recoveryPlan(
  fault: ProgramLifecycleFaultClassification,
  expected: ParsedSnapshot,
  observed: ParsedSnapshot | null,
): ProgramLifecycleRecoveryPlan {
  const findings = observed ? recordDifferences(expected.records, observed.records) : Object.freeze([]);
  const noFault = fault === "NO_FAULT";
  return freezeDeep({
    posture: noFault ? "NO_ACTION_REQUIRED" : "HUMAN_REVIEW_REQUIRED",
    executionAuthorized: false,
    faultClassification: fault,
    affectedProgramIds: noFault
      ? Object.freeze([])
      : affectedProgramIds(fault, expected, observed, findings),
    expectedActiveProgram: expected.activeProgram,
    observedActiveProgram: observed?.activeProgram ?? null,
    findings: noFault ? Object.freeze([]) : findings,
    reviewChecklist: noFault ? Object.freeze([]) : REVIEW_CHECKLIST,
  });
}

function invalidInput(): ProgramLifecycleReconciliationRecoveryResult {
  return freezeDeep({
    kind: "INVALID_INPUT",
    faultClassification: null,
    rollbackClassification: null,
    expectedStableRecords: null,
    observedRecords: null,
    rehearsedRollbackRecords: null,
    expectedActiveProgram: null,
    observedActiveProgram: null,
    recoveryPlan: null,
    authorityEffect: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
    capabilityCredit: "NONE",
  });
}

function result(
  kind: ProgramLifecycleReconciliationResultKind,
  faultClassification: ProgramLifecycleFaultClassification,
  rollbackClassification: ProgramLifecycleRollbackClassification,
  expected: ParsedSnapshot,
  observed: ParsedSnapshot | null,
  rehearsal: ParsedSnapshot | null,
): ProgramLifecycleReconciliationRecoveryResult {
  const value = {
    kind,
    faultClassification,
    rollbackClassification,
    expectedStableRecords: expected.records,
    observedRecords: observed?.records ?? null,
    rehearsedRollbackRecords: rehearsal?.records ?? null,
    expectedActiveProgram: expected.activeProgram,
    observedActiveProgram: observed?.activeProgram ?? null,
    recoveryPlan: recoveryPlan(faultClassification, expected, observed),
    authorityEffect: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
    capabilityCredit: "NONE",
  } as const;
  if (!RESULT_KEYS.every((key) => Object.hasOwn(value, key))) {
    return invalidInput();
  }
  return freezeDeep(value);
}

/**
 * Classifies supplied lifecycle snapshots and an in-memory rollback rehearsal.
 * It performs no transition, persistence, repair, request, or authority action.
 */
export function reconcileProgramLifecycleFaultAndRehearseRollback(
  input: unknown,
): ProgramLifecycleReconciliationRecoveryResult {
  try {
    const root = readExactDataObject(input, ROOT_KEYS);
    if (!root) {
      return invalidInput();
    }
    const expected = parseSnapshot(root.expectedStableRecords);
    if (
      !expected ||
      expected.activeResult.kind !== "ONE_ACTIVE" ||
      !expected.activeProgram ||
      expected.activeProgram.programId !== expected.activeResult.activeProgramId
    ) {
      return invalidInput();
    }
    const observed = parseSnapshot(root.observedRecords);
    const fault = classifyFault(expected, observed);
    if (fault === "NO_FAULT") {
      if (
        root.rehearsedRollbackRecords !== null &&
        !parseSnapshot(root.rehearsedRollbackRecords)
      ) {
        return invalidInput();
      }
      return result(
        "NO_FAULT_DETECTED",
        fault,
        "NOT_APPLICABLE",
        expected,
        observed,
        null,
      );
    }
    if (root.rehearsedRollbackRecords === null) {
      return result(
        "FAULT_DETECTED_ROLLBACK_UNPROVEN",
        fault,
        "NOT_SUPPLIED",
        expected,
        observed,
        null,
      );
    }
    const rehearsal = parseSnapshot(root.rehearsedRollbackRecords);
    if (!rehearsal) {
      return result(
        "FAULT_DETECTED_ROLLBACK_UNPROVEN",
        fault,
        "INVALID_REHEARSAL",
        expected,
        observed,
        null,
      );
    }
    const exactMatch = recordsEqual(expected.records, rehearsal.records);
    return result(
      exactMatch
        ? "FAULT_DETECTED_ROLLBACK_REHEARSED"
        : "FAULT_DETECTED_ROLLBACK_UNPROVEN",
      fault,
      exactMatch ? "EXACT_MATCH" : "MISMATCH",
      expected,
      observed,
      rehearsal,
    );
  } catch {
    return invalidInput();
  }
}

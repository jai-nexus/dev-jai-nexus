import {
  PROGRAM_LIFECYCLE_STATES,
  evaluateOneActiveProgramInvariant,
  type ProgramLifecycleState,
} from "./one-active-program-invariant";
import {
  evaluateProgramActivationEligibility,
} from "./program-activation-eligibility-gate";
import {
  evaluateProgramStateTransition,
} from "./program-state-transition-matrix";
import {
  MAX_PROGRAM_LIFECYCLE_VERSION,
  validatePersistedProgramLifecycleRecord,
  type PersistedProgramLifecycleRecord,
  type ProgramLifecycleWriteEffect,
} from "./program-lifecycle-persistence-boundary";
import {
  createProgramTransitionReceiptSetDraft,
  parseProgramTransitionReceiptCommand,
  receiptSetMatchesCanonicalCommand,
  validateProgramTransitionReceiptSet,
  type ProgramLifecycleTransitionReceipt,
  type ProgramTransitionReceiptSet,
  type ProgramTransitionReceiptSetDraft,
} from "./program-transition-receipt-boundary";

const COMMAND_KEYS = [
  "candidateProgramId",
  "expectedSupersededProgramId",
  "governingMotions",
  "receipts",
  "expectedLifecycleVersions",
] as const;
const EXPECTED_LIFECYCLE_VERSION_KEYS = [
  "programId",
  "lifecycleVersion",
] as const;
const GOVERNING_MOTION_KEYS = [
  "motionId",
  "subjectProgramId",
  "ratificationState",
  "decisionState",
  "mainAcceptanceState",
  "freshnessState",
] as const;
const RECEIPT_KEYS = [
  "receiptType",
  "receiptInstanceId",
  "subjectProgramId",
  "issuanceState",
  "integrityState",
  "authenticityState",
  "issuerAuthorityState",
  "freshnessState",
] as const;
const [NOT_ROUTED_STATE, OPEN_STATE, HOLD_STATE] = PROGRAM_LIFECYCLE_STATES;
const PROGRAM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ProgramActivationSupersessionGoverningMotion {
  readonly motionId: string;
  readonly subjectProgramId: string;
  readonly ratificationState: "RATIFIED" | "NOT_RATIFIED";
  readonly decisionState: "PASS" | "NON_PASS";
  readonly mainAcceptanceState: "ACCEPTED_ON_MAIN" | "NOT_ACCEPTED_ON_MAIN";
  readonly freshnessState: "CURRENT" | "STALE" | "UNAVAILABLE";
}

export interface ProgramActivationSupersessionReceipt {
  readonly receiptType: "MAIN_STATE_RECEIPT" | "PROGRAM_OPENING_RECEIPT";
  readonly receiptInstanceId: string;
  readonly subjectProgramId: string;
  readonly issuanceState: "NOT_ISSUED" | "ISSUED" | "INVALID";
  readonly integrityState: "UNVERIFIED" | "VERIFIED" | "INVALID";
  readonly authenticityState: "NOT_ESTABLISHED" | "VERIFIED" | "INVALID";
  readonly issuerAuthorityState: "NOT_ESTABLISHED" | "ESTABLISHED" | "INVALID";
  readonly freshnessState: "CURRENT" | "STALE" | "UNAVAILABLE";
}

export interface ExpectedProgramLifecycleVersion {
  readonly programId: string;
  readonly lifecycleVersion: number;
}

export interface ProgramActivationSupersessionCommand {
  readonly candidateProgramId: string;
  readonly expectedSupersededProgramId: string | null;
  readonly governingMotions: readonly ProgramActivationSupersessionGoverningMotion[];
  readonly receipts: readonly ProgramActivationSupersessionReceipt[];
  readonly expectedLifecycleVersions: readonly ExpectedProgramLifecycleVersion[];
}

export interface ProgramActivationSupersessionTransaction {
  readonly listLockedProgramLifecycleRecords: () => Promise<unknown>;
  readonly findProgramTransitionReceiptSetByIdempotencyKeyHash: (
    idempotencyKeyHash: string,
  ) => Promise<unknown | null>;
  readonly setProgramLifecycleState: (
    programId: string,
    expectedLifecycleState: ProgramLifecycleState,
    expectedLifecycleVersion: number,
    lifecycleState: ProgramLifecycleState,
  ) => Promise<void>;
  readonly insertProgramTransitionReceiptSet: (
    receiptSet: ProgramTransitionReceiptSetDraft,
  ) => Promise<unknown>;
}

export interface ProgramActivationSupersessionAdapter {
  readonly transaction: <Result>(
    operation: (transaction: ProgramActivationSupersessionTransaction) => Promise<Result>,
  ) => Promise<Result>;
}

export type ProgramActivationSupersessionRejectionReason =
  | "INVALID_COMMAND"
  | "INVALID_PERSISTED_ROWS"
  | "MULTIPLE_ACTIVE_PROGRAMS"
  | "STALE_STATE"
  | "VERSION_EXHAUSTED"
  | "CANDIDATE_MISSING"
  | "CANDIDATE_ALREADY_ACTIVE"
  | "CANDIDATE_STATE_INVALID"
  | "C3_CLASSIFICATION_MISMATCH"
  | "C4_INELIGIBLE"
  | "PROJECTED_PORTFOLIO_INVALID"
  | "EXPECTED_OPERATION_MISMATCH"
  | "IDEMPOTENCY_CONFLICT";

export type ProgramActivationSupersessionUnavailableClassification =
  | "ADAPTER_UNAVAILABLE"
  | "ADAPTER_ERROR"
  | "CONCURRENCY_CONFLICT"
  | "MALFORMED_STORED_RECEIPT"
  | "RECEIPT_PERSISTENCE_FAILURE"
  | "UNIQUE_KEY_CONFLICT"
  | "AMBIGUOUS_POST_WRITE_EFFECT"
  | "MALFORMED_TRANSACTION_RESULT"
  | "ROLLBACK_CONFIRMED";

export type ProgramActivationSupersessionResult =
  | {
      readonly kind: "COMMITTED";
      readonly writeEffect: "CONFIRMED";
      readonly candidateProgramId: string;
      readonly supersededProgramId: string | null;
      readonly records: readonly PersistedProgramLifecycleRecord[];
      readonly receiptSet: ProgramTransitionReceiptSet;
    }
  | {
      readonly kind: "REPLAYED";
      readonly writeEffect: "NONE";
      readonly receiptSet: ProgramTransitionReceiptSet;
      readonly records: readonly [];
    }
  | {
      readonly kind: "REJECTED";
      readonly writeEffect: "NONE";
      readonly reason: ProgramActivationSupersessionRejectionReason;
      readonly records: readonly [];
    }
  | {
      readonly kind: "UNAVAILABLE";
      readonly writeEffect: Extract<ProgramLifecycleWriteEffect, "NONE" | "UNKNOWN">;
      readonly classification: ProgramActivationSupersessionUnavailableClassification;
      readonly records: readonly [];
    };

export interface ProgramActivationSupersessionService {
  readonly execute: (input: unknown) => Promise<ProgramActivationSupersessionResult>;
}

export class ProgramActivationSupersessionUnavailableError extends Error {
  constructor() {
    super("Program lifecycle transaction is unavailable.");
    this.name = "ProgramActivationSupersessionUnavailableError";
  }
}

export class ProgramActivationSupersessionRollbackConfirmedError extends Error {
  constructor() {
    super("Program lifecycle transaction rollback is confirmed.");
    this.name = "ProgramActivationSupersessionRollbackConfirmedError";
  }
}

export class ProgramActivationSupersessionConcurrencyConflictError extends Error {
  constructor() {
    super("Program lifecycle compare-and-swap did not match.");
    this.name = "ProgramActivationSupersessionConcurrencyConflictError";
  }
}

export class ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError extends Error {
  constructor() {
    super("Program lifecycle compare-and-swap conflict was rolled back.");
    this.name = "ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError";
  }
}

export class ProgramTransitionReceiptPersistenceError extends Error {
  constructor() {
    super("Program transition receipt persistence failed.");
    this.name = "ProgramTransitionReceiptPersistenceError";
  }
}

export class ProgramTransitionReceiptMalformedStoredError extends Error {
  constructor() {
    super("Stored program transition receipt is malformed.");
    this.name = "ProgramTransitionReceiptMalformedStoredError";
  }
}

export class ProgramTransitionReceiptUniqueKeyConflictError extends Error {
  constructor() {
    super("Program transition receipt key hash already exists.");
    this.name = "ProgramTransitionReceiptUniqueKeyConflictError";
  }
}

export class ProgramTransitionReceiptRollbackConfirmedConflictError extends Error {
  constructor() {
    super("Program transition receipt conflict was rolled back.");
    this.name = "ProgramTransitionReceiptRollbackConfirmedConflictError";
  }
}

export class ProgramTransitionReceiptAmbiguousPostWriteError extends Error {
  constructor() {
    super("Program transition receipt write effect is ambiguous.");
    this.name = "ProgramTransitionReceiptAmbiguousPostWriteError";
  }
}

class ProgramActivationSupersessionPostStateError extends Error {
  constructor() {
    super("Program lifecycle transaction post-state is invalid.");
    this.name = "ProgramActivationSupersessionPostStateError";
  }
}

type ExecutionPlan =
  | {
      readonly kind: "OPEN_CANDIDATE";
      readonly candidate: PersistedProgramLifecycleRecord;
      readonly supersededProgram: null;
    }
  | {
      readonly kind: "HOLD_AND_OPEN";
      readonly candidate: PersistedProgramLifecycleRecord;
      readonly supersededProgram: PersistedProgramLifecycleRecord;
    };

function readExactDataObject(
  input: unknown,
  expectedKeys: readonly string[],
): Readonly<Record<string, unknown>> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
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
    if (!descriptor || !Object.hasOwn(descriptor, "value")) {
      return null;
    }
    values[key] = descriptor.value;
  }
  return values;
}

function readExactArray(input: unknown): readonly unknown[] | null {
  if (!Array.isArray(input)) {
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
    if (!descriptor || !Object.hasOwn(descriptor, "value")) {
      return null;
    }
    values.push(descriptor.value);
  }
  return values;
}

function isNonWhitespaceString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCanonicalProgramId(value: unknown): value is string {
  return typeof value === "string" && PROGRAM_ID_PATTERN.test(value);
}

function isLifecycleVersion(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_PROGRAM_LIFECYCLE_VERSION
  );
}

function parseExpectedLifecycleVersions(
  input: unknown,
): readonly ExpectedProgramLifecycleVersion[] | null {
  const values = readExactArray(input);
  if (!values) {
    return null;
  }

  const expectedVersions: ExpectedProgramLifecycleVersion[] = [];
  let previousProgramId: string | null = null;
  for (const value of values) {
    const fields = readExactDataObject(value, EXPECTED_LIFECYCLE_VERSION_KEYS);
    if (
      !fields ||
      !isCanonicalProgramId(fields.programId) ||
      !isLifecycleVersion(fields.lifecycleVersion) ||
      (previousProgramId !== null && previousProgramId >= fields.programId)
    ) {
      return null;
    }
    expectedVersions.push(Object.freeze({
      programId: fields.programId,
      lifecycleVersion: fields.lifecycleVersion,
    }));
    previousProgramId = fields.programId;
  }
  return Object.freeze(expectedVersions);
}

function parseGoverningMotions(
  input: unknown,
): readonly ProgramActivationSupersessionGoverningMotion[] | null {
  const values = readExactArray(input);
  if (!values) {
    return null;
  }

  const motions: ProgramActivationSupersessionGoverningMotion[] = [];
  for (const value of values) {
    const fields = readExactDataObject(value, GOVERNING_MOTION_KEYS);
    if (
      !fields ||
      !isNonWhitespaceString(fields.motionId) ||
      !isCanonicalProgramId(fields.subjectProgramId) ||
      (fields.ratificationState !== "RATIFIED" && fields.ratificationState !== "NOT_RATIFIED") ||
      (fields.decisionState !== "PASS" && fields.decisionState !== "NON_PASS") ||
      (fields.mainAcceptanceState !== "ACCEPTED_ON_MAIN" &&
        fields.mainAcceptanceState !== "NOT_ACCEPTED_ON_MAIN") ||
      (fields.freshnessState !== "CURRENT" &&
        fields.freshnessState !== "STALE" &&
        fields.freshnessState !== "UNAVAILABLE")
    ) {
      return null;
    }
    motions.push(Object.freeze({
      motionId: fields.motionId,
      subjectProgramId: fields.subjectProgramId,
      ratificationState: fields.ratificationState,
      decisionState: fields.decisionState,
      mainAcceptanceState: fields.mainAcceptanceState,
      freshnessState: fields.freshnessState,
    }));
  }
  return Object.freeze(motions);
}

function parseReceipts(
  input: unknown,
): readonly ProgramActivationSupersessionReceipt[] | null {
  const values = readExactArray(input);
  if (!values) {
    return null;
  }

  const receipts: ProgramActivationSupersessionReceipt[] = [];
  for (const value of values) {
    const fields = readExactDataObject(value, RECEIPT_KEYS);
    if (
      !fields ||
      !isNonWhitespaceString(fields.receiptInstanceId) ||
      !isCanonicalProgramId(fields.subjectProgramId) ||
      (fields.receiptType !== "MAIN_STATE_RECEIPT" &&
        fields.receiptType !== "PROGRAM_OPENING_RECEIPT") ||
      (fields.issuanceState !== "NOT_ISSUED" &&
        fields.issuanceState !== "ISSUED" &&
        fields.issuanceState !== "INVALID") ||
      (fields.integrityState !== "UNVERIFIED" &&
        fields.integrityState !== "VERIFIED" &&
        fields.integrityState !== "INVALID") ||
      (fields.authenticityState !== "NOT_ESTABLISHED" &&
        fields.authenticityState !== "VERIFIED" &&
        fields.authenticityState !== "INVALID") ||
      (fields.issuerAuthorityState !== "NOT_ESTABLISHED" &&
        fields.issuerAuthorityState !== "ESTABLISHED" &&
        fields.issuerAuthorityState !== "INVALID") ||
      (fields.freshnessState !== "CURRENT" &&
        fields.freshnessState !== "STALE" &&
        fields.freshnessState !== "UNAVAILABLE")
    ) {
      return null;
    }
    receipts.push(Object.freeze({
      receiptType: fields.receiptType,
      receiptInstanceId: fields.receiptInstanceId,
      subjectProgramId: fields.subjectProgramId,
      issuanceState: fields.issuanceState,
      integrityState: fields.integrityState,
      authenticityState: fields.authenticityState,
      issuerAuthorityState: fields.issuerAuthorityState,
      freshnessState: fields.freshnessState,
    }));
  }
  return Object.freeze(receipts);
}

export function parseProgramActivationSupersessionCommand(
  input: unknown,
): ProgramActivationSupersessionCommand | null {
  try {
    const fields = readExactDataObject(input, COMMAND_KEYS);
    if (
      !fields ||
      !isCanonicalProgramId(fields.candidateProgramId) ||
      (fields.expectedSupersededProgramId !== null &&
        (!isCanonicalProgramId(fields.expectedSupersededProgramId) ||
          fields.expectedSupersededProgramId === fields.candidateProgramId))
    ) {
      return null;
    }

    const governingMotions = parseGoverningMotions(fields.governingMotions);
    const receipts = parseReceipts(fields.receipts);
    const expectedLifecycleVersions = parseExpectedLifecycleVersions(
      fields.expectedLifecycleVersions,
    );
    if (!governingMotions || !receipts || !expectedLifecycleVersions) {
      return null;
    }
    if (
      fields.expectedSupersededProgramId !== null &&
      !expectedLifecycleVersions.some(
        (value) => value.programId === fields.expectedSupersededProgramId,
      )
    ) {
      return null;
    }
    return Object.freeze({
      candidateProgramId: fields.candidateProgramId,
      expectedSupersededProgramId: fields.expectedSupersededProgramId,
      governingMotions,
      receipts,
      expectedLifecycleVersions,
    });
  } catch {
    return null;
  }
}

function parsePersistedRows(
  input: unknown,
): readonly PersistedProgramLifecycleRecord[] | null {
  try {
    const values = readExactArray(input);
    if (!values) {
      return null;
    }

    const programIds = new Set<string>();
    const programCodes = new Set<string>();
    const records: PersistedProgramLifecycleRecord[] = [];
    for (const value of values) {
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

    const invariant = evaluateOneActiveProgramInvariant(
      records.map((record) => ({
        programId: record.programId,
        lifecycleState: record.lifecycleState,
      })),
    );
    if (invariant.kind === "INVALID_INPUT") {
      return null;
    }

    return Object.freeze(
      records.sort((left, right) =>
        left.programId < right.programId ? -1 : left.programId > right.programId ? 1 : 0,
      ),
    );
  } catch {
    return null;
  }
}

function rejected(
  reason: ProgramActivationSupersessionRejectionReason,
): ProgramActivationSupersessionResult {
  return Object.freeze({
    kind: "REJECTED",
    writeEffect: "NONE",
    reason,
    records: Object.freeze([]) as readonly [],
  });
}

function unavailable(
  classification: ProgramActivationSupersessionUnavailableClassification,
  writeEffect: Extract<ProgramLifecycleWriteEffect, "NONE" | "UNKNOWN">,
): ProgramActivationSupersessionResult {
  return Object.freeze({
    kind: "UNAVAILABLE",
    writeEffect,
    classification,
    records: Object.freeze([]) as readonly [],
  });
}

function replayed(receiptSet: ProgramTransitionReceiptSet): ProgramActivationSupersessionResult {
  return Object.freeze({
    kind: "REPLAYED",
    writeEffect: "NONE",
    receiptSet,
    records: Object.freeze([]) as readonly [],
  });
}

function receiptSetMatchesDraft(
  receiptSet: ProgramTransitionReceiptSet,
  draft: ProgramTransitionReceiptSetDraft,
): boolean {
  return receiptSet.command.commandId === draft.command.commandId &&
    receiptSet.command.idempotencyKeyHash === draft.command.idempotencyKeyHash &&
    receiptSet.command.requestFingerprint === draft.command.requestFingerprint &&
    receiptSet.command.fingerprintVersion === draft.command.fingerprintVersion &&
    receiptSet.command.candidateProgramId === draft.command.candidateProgramId &&
    receiptSet.command.operationKind === draft.command.operationKind &&
    receiptSet.command.supersededProgramId === draft.command.supersededProgramId &&
    receiptSet.command.expectedReceiptCount === draft.command.expectedReceiptCount &&
    receiptSet.receipts.length === draft.receipts.length &&
    receiptSet.receipts.every((receipt, index) => {
      const expected = draft.receipts[index];
      return expected !== undefined &&
        receipt.receiptId === expected.receiptId &&
        receipt.commandId === expected.commandId &&
        receipt.receiptOrdinal === expected.receiptOrdinal &&
        receipt.transitionId === expected.transitionId &&
        receipt.lifecycleAxisId === expected.lifecycleAxisId &&
        receipt.subjectProgramId === expected.subjectProgramId &&
        receipt.sourceState === expected.sourceState &&
        receipt.resultState === expected.resultState &&
        receipt.sourceLifecycleVersion === expected.sourceLifecycleVersion &&
        receipt.resultLifecycleVersion === expected.resultLifecycleVersion;
    });
}

function isOpeningTransition(state: ProgramLifecycleState): boolean {
  const result = evaluateProgramStateTransition({
    sourceState: state,
    action: "OPEN_FOR_BATCH_PLANNING",
  });
  return (
    result.kind === "ALLOWED" &&
    result.transitionId === "B1-TR-027" &&
    result.targetState === OPEN_STATE &&
    result.authorityGranted === false &&
    result.transitionPerformed === false
  );
}

function isHoldTransition(state: ProgramLifecycleState): boolean {
  const result = evaluateProgramStateTransition({
    sourceState: state,
    action: "PLACE_ON_HOLD",
  });
  return (
    result.kind === "ALLOWED" &&
    result.transitionId === "B1-TR-028" &&
    result.targetState === HOLD_STATE &&
    result.authorityGranted === false &&
    result.transitionPerformed === false
  );
}

function hasEligibleEvidence(
  command: ProgramActivationSupersessionCommand,
  records: readonly PersistedProgramLifecycleRecord[],
): boolean {
  const result = evaluateProgramActivationEligibility({
    candidateProgramId: command.candidateProgramId,
    portfolio: records.map((record) => ({
      programId: record.programId,
      lifecycleState: record.lifecycleState,
    })),
    governingMotions: command.governingMotions,
    receipts: command.receipts,
  });
  return (
    result.kind === "ELIGIBLE" &&
    result.transitionId === "B1-TR-027" &&
    result.activationAuthorized === false &&
    result.activationPerformed === false
  );
}

function replaceLifecycleState(
  records: readonly PersistedProgramLifecycleRecord[],
  programId: string,
  lifecycleState: ProgramLifecycleState,
): readonly PersistedProgramLifecycleRecord[] {
  return Object.freeze(
    records.map((record) =>
      record.programId === programId
        ? Object.freeze({ ...record, lifecycleState })
        : record,
    ),
  );
}

function expectedVersionsMatch(
  expectedVersions: readonly ExpectedProgramLifecycleVersion[],
  records: readonly PersistedProgramLifecycleRecord[],
): boolean {
  return (
    expectedVersions.length === records.length &&
    records.every((record, index) =>
      expectedVersions[index]?.programId === record.programId &&
      expectedVersions[index]?.lifecycleVersion === record.lifecycleVersion,
    )
  );
}

function planCanIncrementVersions(plan: ExecutionPlan): boolean {
  return (
    plan.candidate.lifecycleVersion < MAX_PROGRAM_LIFECYCLE_VERSION &&
    (!plan.supersededProgram ||
      plan.supersededProgram.lifecycleVersion < MAX_PROGRAM_LIFECYCLE_VERSION)
  );
}

function derivePlan(
  command: ProgramActivationSupersessionCommand,
  records: readonly PersistedProgramLifecycleRecord[],
): ExecutionPlan | ProgramActivationSupersessionRejectionReason {
  const invariant = evaluateOneActiveProgramInvariant(
    records.map((record) => ({
      programId: record.programId,
      lifecycleState: record.lifecycleState,
    })),
  );
  if (invariant.kind === "INVALID_INPUT") {
    return "INVALID_PERSISTED_ROWS";
  }
  if (invariant.kind === "MULTIPLE_ACTIVE") {
    return "MULTIPLE_ACTIVE_PROGRAMS";
  }

  const candidates = records.filter(
    (record) => record.programId === command.candidateProgramId,
  );
  if (candidates.length !== 1) {
    return "CANDIDATE_MISSING";
  }
  const candidate = candidates[0];
  if (candidate.lifecycleState === OPEN_STATE) {
    return "CANDIDATE_ALREADY_ACTIVE";
  }
  if (candidate.lifecycleState !== NOT_ROUTED_STATE) {
    return "CANDIDATE_STATE_INVALID";
  }
  if (!isOpeningTransition(candidate.lifecycleState)) {
    return "C3_CLASSIFICATION_MISMATCH";
  }

  if (invariant.kind === "ZERO_ACTIVE") {
    if (!hasEligibleEvidence(command, records)) {
      return "C4_INELIGIBLE";
    }
    return Object.freeze({
      kind: "OPEN_CANDIDATE",
      candidate,
      supersededProgram: null,
    });
  }

  const supersededProgram = records.find(
    (record) => record.programId === invariant.activeProgramId,
  );
  if (!supersededProgram || supersededProgram.programId === candidate.programId) {
    return "CANDIDATE_ALREADY_ACTIVE";
  }
  if (!isHoldTransition(supersededProgram.lifecycleState)) {
    return "C3_CLASSIFICATION_MISMATCH";
  }

  const projectedRecords = replaceLifecycleState(
    records,
    supersededProgram.programId,
    HOLD_STATE,
  );
  const projectedInvariant = evaluateOneActiveProgramInvariant(
    projectedRecords.map((record) => ({
      programId: record.programId,
      lifecycleState: record.lifecycleState,
    })),
  );
  if (projectedInvariant.kind !== "ZERO_ACTIVE") {
    return "PROJECTED_PORTFOLIO_INVALID";
  }
  if (!hasEligibleEvidence(command, projectedRecords)) {
    return "C4_INELIGIBLE";
  }
  return Object.freeze({
    kind: "HOLD_AND_OPEN",
    candidate,
    supersededProgram,
  });
}

function planMatchesExpectedOperation(
  plan: ExecutionPlan,
  command: ProgramActivationSupersessionCommand,
): boolean {
  return plan.kind === "OPEN_CANDIDATE"
    ? command.expectedSupersededProgramId === null
    : command.expectedSupersededProgramId === plan.supersededProgram.programId;
}

function timestampIsNotEarlier(previous: string, next: string): boolean {
  return new Date(next).getTime() >= new Date(previous).getTime();
}

function expectedLifecycleState(
  plan: ExecutionPlan,
  record: PersistedProgramLifecycleRecord,
): ProgramLifecycleState {
  if (record.programId === plan.candidate.programId) {
    return OPEN_STATE;
  }
  if (
    plan.supersededProgram &&
    record.programId === plan.supersededProgram.programId
  ) {
    return HOLD_STATE;
  }
  return record.lifecycleState;
}

function expectedLifecycleVersion(
  plan: ExecutionPlan,
  record: PersistedProgramLifecycleRecord,
): number {
  return record.programId === plan.candidate.programId ||
    (plan.supersededProgram && record.programId === plan.supersededProgram.programId)
    ? record.lifecycleVersion + 1
    : record.lifecycleVersion;
}

function postStateMatches(
  plan: ExecutionPlan,
  before: readonly PersistedProgramLifecycleRecord[],
  after: readonly PersistedProgramLifecycleRecord[],
): boolean {
  if (before.length !== after.length) {
    return false;
  }

  return before.every((previous) => {
    const next = after.find((record) => record.programId === previous.programId);
    const expectedState = expectedLifecycleState(plan, previous);
    const expectedVersion = expectedLifecycleVersion(plan, previous);
    const isMutated = expectedState !== previous.lifecycleState;
    return (
      next !== undefined &&
      previous.programCode === next.programCode &&
      previous.programTitle === next.programTitle &&
      previous.createdAt === next.createdAt &&
      next.lifecycleState === expectedState &&
      next.lifecycleVersion === expectedVersion &&
      (isMutated
        ? timestampIsNotEarlier(previous.updatedAt, next.updatedAt)
        : previous.updatedAt === next.updatedAt)
    );
  });
}

function committedResult(
  plan: ExecutionPlan,
  before: readonly PersistedProgramLifecycleRecord[],
  after: readonly PersistedProgramLifecycleRecord[],
  receiptSet: ProgramTransitionReceiptSet,
): ProgramActivationSupersessionResult | null {
  const invariant = evaluateOneActiveProgramInvariant(
    after.map((record) => ({
      programId: record.programId,
      lifecycleState: record.lifecycleState,
    })),
  );
  const candidate = after.find((record) => record.programId === plan.candidate.programId);
  const superseded = plan.supersededProgram
    ? after.find((record) => record.programId === plan.supersededProgram?.programId)
    : null;
  if (
    invariant.kind !== "ONE_ACTIVE" ||
    invariant.activeProgramId !== plan.candidate.programId ||
    !candidate ||
    candidate.lifecycleState !== OPEN_STATE ||
    (plan.supersededProgram && (!superseded || superseded.lifecycleState !== HOLD_STATE)) ||
    !postStateMatches(plan, before, after)
  ) {
    return null;
  }

  return Object.freeze({
    kind: "COMMITTED",
    writeEffect: "CONFIRMED",
    candidateProgramId: plan.candidate.programId,
    supersededProgramId: plan.supersededProgram?.programId ?? null,
    records: Object.freeze([...after]),
    receiptSet,
  });
}

function isPlan(value: ExecutionPlan | ProgramActivationSupersessionRejectionReason): value is ExecutionPlan {
  return typeof value === "object" && value !== null;
}

function failureClassification(
  error: unknown,
): ProgramActivationSupersessionUnavailableClassification {
  return error instanceof ProgramActivationSupersessionUnavailableError
    ? "ADAPTER_UNAVAILABLE"
    : "ADAPTER_ERROR";
}

/**
 * Produces a complete all-or-nothing lifecycle-state result from an injected
 * transaction. It derives portfolio data and persists a complete receipt set
 * inside that transaction; it grants no authority and invokes no operation by itself.
 */
export function createProgramActivationSupersessionService(
  adapter: ProgramActivationSupersessionAdapter,
): ProgramActivationSupersessionService {
  return Object.freeze({
    async execute(input: unknown): Promise<ProgramActivationSupersessionResult> {
      const receiptCommand = parseProgramTransitionReceiptCommand(input);
      if (!receiptCommand) {
        return rejected("INVALID_COMMAND");
      }
      const command = receiptCommand.command;

      let mutationInvocationBegan = false;
      let successfulMutationCount = 0;
      let expectedResult: ProgramActivationSupersessionResult | null = null;
      try {
        const returnedResult = await adapter.transaction(async (transaction) => {
          const before = parsePersistedRows(
            await transaction.listLockedProgramLifecycleRecords(),
          );
          if (!before) {
            expectedResult = rejected("INVALID_PERSISTED_ROWS");
            return expectedResult;
          }

          const storedReceiptSet = await transaction
            .findProgramTransitionReceiptSetByIdempotencyKeyHash(
              receiptCommand.idempotencyKeyHash,
            );
          if (storedReceiptSet !== null) {
            const receiptSet = validateProgramTransitionReceiptSet(storedReceiptSet);
            if (!receiptSet) {
              throw new ProgramTransitionReceiptMalformedStoredError();
            }
            expectedResult = receiptSetMatchesCanonicalCommand(receiptSet, receiptCommand)
              ? replayed(receiptSet)
              : rejected("IDEMPOTENCY_CONFLICT");
            return expectedResult;
          }

          if (!expectedVersionsMatch(command.expectedLifecycleVersions, before)) {
            expectedResult = rejected("STALE_STATE");
            return expectedResult;
          }

          const plan = derivePlan(command, before);
          if (!isPlan(plan)) {
            expectedResult = rejected(plan);
            return expectedResult;
          }
          if (!planMatchesExpectedOperation(plan, command)) {
            expectedResult = rejected("EXPECTED_OPERATION_MISMATCH");
            return expectedResult;
          }
          if (!planCanIncrementVersions(plan)) {
            expectedResult = rejected("VERSION_EXHAUSTED");
            return expectedResult;
          }

          if (plan.kind === "HOLD_AND_OPEN") {
            mutationInvocationBegan = true;
            await transaction.setProgramLifecycleState(
              plan.supersededProgram.programId,
              plan.supersededProgram.lifecycleState,
              plan.supersededProgram.lifecycleVersion,
              HOLD_STATE,
            );
            successfulMutationCount += 1;
          }
          mutationInvocationBegan = true;
          await transaction.setProgramLifecycleState(
            plan.candidate.programId,
            plan.candidate.lifecycleState,
            plan.candidate.lifecycleVersion,
            OPEN_STATE,
          );
          successfulMutationCount += 1;

          const after = parsePersistedRows(
            await transaction.listLockedProgramLifecycleRecords(),
          );
          if (!after) {
            throw new ProgramActivationSupersessionPostStateError();
          }
          const candidateBefore = before.find(
            (record) => record.programId === plan.candidate.programId,
          );
          const candidateAfter = after.find(
            (record) => record.programId === plan.candidate.programId,
          );
          const supersededBefore = plan.supersededProgram
            ? before.find((record) => record.programId === plan.supersededProgram?.programId) ?? null
            : null;
          const supersededAfter = plan.supersededProgram
            ? after.find((record) => record.programId === plan.supersededProgram?.programId) ?? null
            : null;
          if (!candidateBefore || !candidateAfter) {
            throw new ProgramActivationSupersessionPostStateError();
          }
          const draft = createProgramTransitionReceiptSetDraft({
            command: receiptCommand,
            candidateBefore,
            candidateAfter,
            supersededBefore,
            supersededAfter,
          });
          if (!draft) {
            throw new ProgramActivationSupersessionPostStateError();
          }
          const receiptSet = validateProgramTransitionReceiptSet(
            await transaction.insertProgramTransitionReceiptSet(draft),
          );
          if (!receiptSet || !receiptSetMatchesDraft(receiptSet, draft)) {
            throw new ProgramTransitionReceiptPersistenceError();
          }
          const committed = committedResult(plan, before, after, receiptSet);
          if (!committed) {
            throw new ProgramActivationSupersessionPostStateError();
          }
          expectedResult = committed;
          return committed;
        });

        if (!expectedResult || returnedResult !== expectedResult) {
          return unavailable(
            "MALFORMED_TRANSACTION_RESULT",
            mutationInvocationBegan ? "UNKNOWN" : "NONE",
          );
        }
        return expectedResult;
      } catch (error) {
        if (error instanceof ProgramActivationSupersessionRollbackConfirmedError) {
          return unavailable("ROLLBACK_CONFIRMED", "NONE");
        }
        if (error instanceof ProgramTransitionReceiptRollbackConfirmedConflictError) {
          return unavailable("UNIQUE_KEY_CONFLICT", "NONE");
        }
        if (error instanceof ProgramTransitionReceiptUniqueKeyConflictError) {
          return unavailable(
            "UNIQUE_KEY_CONFLICT",
            successfulMutationCount === 0 ? "NONE" : "UNKNOWN",
          );
        }
        if (error instanceof ProgramTransitionReceiptPersistenceError) {
          return unavailable(
            "RECEIPT_PERSISTENCE_FAILURE",
            successfulMutationCount === 0 ? "NONE" : "UNKNOWN",
          );
        }
        if (error instanceof ProgramTransitionReceiptMalformedStoredError) {
          return unavailable("MALFORMED_STORED_RECEIPT", "NONE");
        }
        if (error instanceof ProgramTransitionReceiptAmbiguousPostWriteError) {
          return unavailable("AMBIGUOUS_POST_WRITE_EFFECT", "UNKNOWN");
        }
        if (error instanceof ProgramActivationSupersessionConcurrencyConflictError) {
          return unavailable(
            "CONCURRENCY_CONFLICT",
            successfulMutationCount === 0 ? "NONE" : "UNKNOWN",
          );
        }
        if (
          error instanceof
          ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError
        ) {
          return unavailable("CONCURRENCY_CONFLICT", "NONE");
        }
        if (error instanceof ProgramActivationSupersessionPostStateError) {
          return unavailable("MALFORMED_TRANSACTION_RESULT", "UNKNOWN");
        }
        return unavailable(
          failureClassification(error),
          mutationInvocationBegan ? "UNKNOWN" : "NONE",
        );
      }
    },
  });
}

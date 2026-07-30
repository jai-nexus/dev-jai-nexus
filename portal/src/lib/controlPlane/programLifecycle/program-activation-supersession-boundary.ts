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
  validatePersistedProgramLifecycleRecord,
  type PersistedProgramLifecycleRecord,
  type ProgramLifecycleWriteEffect,
} from "./program-lifecycle-persistence-boundary";

const COMMAND_KEYS = [
  "candidateProgramId",
  "governingMotions",
  "receipts",
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

export interface ProgramActivationSupersessionCommand {
  readonly candidateProgramId: string;
  readonly governingMotions: readonly ProgramActivationSupersessionGoverningMotion[];
  readonly receipts: readonly ProgramActivationSupersessionReceipt[];
}

export interface ProgramActivationSupersessionTransaction {
  readonly listLockedProgramLifecycleRecords: () => Promise<unknown>;
  readonly setProgramLifecycleState: (
    programId: string,
    lifecycleState: ProgramLifecycleState,
  ) => Promise<void>;
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
  | "CANDIDATE_MISSING"
  | "CANDIDATE_ALREADY_ACTIVE"
  | "CANDIDATE_STATE_INVALID"
  | "C3_CLASSIFICATION_MISMATCH"
  | "C4_INELIGIBLE"
  | "PROJECTED_PORTFOLIO_INVALID";

export type ProgramActivationSupersessionUnavailableClassification =
  | "ADAPTER_UNAVAILABLE"
  | "ADAPTER_ERROR"
  | "MALFORMED_TRANSACTION_RESULT"
  | "ROLLBACK_CONFIRMED";

export type ProgramActivationSupersessionResult =
  | {
      readonly kind: "COMMITTED";
      readonly writeEffect: "CONFIRMED";
      readonly candidateProgramId: string;
      readonly supersededProgramId: string | null;
      readonly records: readonly PersistedProgramLifecycleRecord[];
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

function parseCommand(input: unknown): ProgramActivationSupersessionCommand | null {
  try {
    const fields = readExactDataObject(input, COMMAND_KEYS);
    if (!fields || !isCanonicalProgramId(fields.candidateProgramId)) {
      return null;
    }

    const governingMotions = parseGoverningMotions(fields.governingMotions);
    const receipts = parseReceipts(fields.receipts);
    if (!governingMotions || !receipts) {
      return null;
    }
    return Object.freeze({
      candidateProgramId: fields.candidateProgramId,
      governingMotions,
      receipts,
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
    const isMutated = expectedState !== previous.lifecycleState;
    return (
      next !== undefined &&
      previous.programCode === next.programCode &&
      previous.programTitle === next.programTitle &&
      previous.createdAt === next.createdAt &&
      next.lifecycleState === expectedState &&
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
 * transaction. It derives portfolio data inside that transaction and does not
 * grant authority, issue a receipt, or invoke this operation by itself.
 */
export function createProgramActivationSupersessionService(
  adapter: ProgramActivationSupersessionAdapter,
): ProgramActivationSupersessionService {
  return Object.freeze({
    async execute(input: unknown): Promise<ProgramActivationSupersessionResult> {
      const command = parseCommand(input);
      if (!command) {
        return rejected("INVALID_COMMAND");
      }

      let mutationInvocationBegan = false;
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

          const plan = derivePlan(command, before);
          if (!isPlan(plan)) {
            expectedResult = rejected(plan);
            return expectedResult;
          }

          if (plan.kind === "HOLD_AND_OPEN") {
            mutationInvocationBegan = true;
            await transaction.setProgramLifecycleState(
              plan.supersededProgram.programId,
              HOLD_STATE,
            );
          }
          mutationInvocationBegan = true;
          await transaction.setProgramLifecycleState(plan.candidate.programId, OPEN_STATE);

          const after = parsePersistedRows(
            await transaction.listLockedProgramLifecycleRecords(),
          );
          const committed = after ? committedResult(plan, before, after) : null;
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

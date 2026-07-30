import { resolveCanonicalActiveProgram } from "./canonical-active-program-resolver";
import {
  evaluateProgramStateTransition,
  type ProgramStateTransitionResult,
} from "./program-state-transition-matrix";

export const PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES = Object.freeze([
  "INVALID_INPUT",
  "ACTIVE_PROGRAM_PRESENT",
  "MULTIPLE_ACTIVE_PROGRAMS",
  "CANDIDATE_NOT_FOUND",
  "CANDIDATE_TRANSITION_NOT_LISTED",
  "GOVERNING_MOTION_MISSING",
  "GOVERNING_MOTION_CONFLICT",
  "GOVERNING_MOTION_SUBJECT_MISMATCH",
  "GOVERNING_MOTION_NOT_RATIFIED",
  "GOVERNING_MOTION_NON_PASS",
  "GOVERNING_MOTION_NOT_ACCEPTED_ON_MAIN",
  "GOVERNING_MOTION_NOT_CURRENT",
  "MAIN_STATE_RECEIPT_MISSING",
  "MAIN_STATE_RECEIPT_DUPLICATE",
  "PROGRAM_OPENING_RECEIPT_MISSING",
  "PROGRAM_OPENING_RECEIPT_DUPLICATE",
  "RECEIPT_SUBJECT_MISMATCH",
  "RECEIPT_INSTANCE_ID_MISSING",
  "RECEIPT_NOT_ISSUED",
  "RECEIPT_INTEGRITY_NOT_VERIFIED",
  "RECEIPT_AUTHENTICITY_NOT_VERIFIED",
  "RECEIPT_ISSUER_AUTHORITY_NOT_ESTABLISHED",
  "RECEIPT_NOT_CURRENT",
  "ALL_PREREQUISITES_SATISFIED",
] as const);

export type ProgramActivationEligibilityReasonCode =
  (typeof PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES)[number];

export type IneligibleProgramActivationReasonCode = Exclude<
  ProgramActivationEligibilityReasonCode,
  "INVALID_INPUT" | "ALL_PREREQUISITES_SATISFIED"
>;

export interface EligibleProgramActivationResult {
  readonly kind: "ELIGIBLE";
  readonly eligible: true;
  readonly classificationOnly: true;
  readonly reasonCodes: readonly ["ALL_PREREQUISITES_SATISFIED"];
  readonly transitionId: "B1-TR-027";
  readonly activationAuthorized: false;
  readonly activationPerformed: false;
}

export interface IneligibleProgramActivationResult {
  readonly kind: "INELIGIBLE";
  readonly eligible: false;
  readonly classificationOnly: true;
  readonly reasonCodes: readonly [
    IneligibleProgramActivationReasonCode,
    ...IneligibleProgramActivationReasonCode[],
  ];
  readonly transitionId: null;
  readonly activationAuthorized: false;
  readonly activationPerformed: false;
}

export interface InvalidProgramActivationInputResult {
  readonly kind: "INVALID_INPUT";
  readonly eligible: false;
  readonly classificationOnly: true;
  readonly reasonCodes: readonly ["INVALID_INPUT"];
  readonly transitionId: null;
  readonly activationAuthorized: false;
  readonly activationPerformed: false;
}

export type ProgramActivationEligibilityResult =
  | EligibleProgramActivationResult
  | IneligibleProgramActivationResult
  | InvalidProgramActivationInputResult;

type GoverningMotionRecord = {
  readonly motionId: string;
  readonly subjectProgramId: string;
  readonly ratificationState: "RATIFIED" | "NOT_RATIFIED";
  readonly decisionState: "PASS" | "NON_PASS";
  readonly mainAcceptanceState: "ACCEPTED_ON_MAIN" | "NOT_ACCEPTED_ON_MAIN";
  readonly freshnessState: "CURRENT" | "STALE" | "UNAVAILABLE";
};

type ReceiptRecord = {
  readonly receiptType: "MAIN_STATE_RECEIPT" | "PROGRAM_OPENING_RECEIPT";
  readonly receiptInstanceId: string;
  readonly subjectProgramId: string;
  readonly issuanceState: "NOT_ISSUED" | "ISSUED" | "INVALID";
  readonly integrityState: "UNVERIFIED" | "VERIFIED" | "INVALID";
  readonly authenticityState: "NOT_ESTABLISHED" | "VERIFIED" | "INVALID";
  readonly issuerAuthorityState: "NOT_ESTABLISHED" | "ESTABLISHED" | "INVALID";
  readonly freshnessState: "CURRENT" | "STALE" | "UNAVAILABLE";
};

type ProgramStateTransitionSourceState =
  Exclude<ProgramStateTransitionResult["sourceState"], null>;

type PortfolioRecord = {
  readonly programId: string;
  readonly lifecycleState: ProgramStateTransitionSourceState;
};

type ActivationEligibilityInput = {
  readonly candidateProgramId: string;
  readonly portfolioRecords: readonly PortfolioRecord[];
  readonly governingMotions: readonly GoverningMotionRecord[];
  readonly receipts: readonly ReceiptRecord[];
};

const TOP_LEVEL_KEYS = [
  "candidateProgramId",
  "portfolio",
  "governingMotions",
  "receipts",
] as const;
const PORTFOLIO_RECORD_KEYS = ["programId", "lifecycleState"] as const;
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

const INVALID_INPUT_RESULT: InvalidProgramActivationInputResult = Object.freeze({
  kind: "INVALID_INPUT",
  eligible: false,
  classificationOnly: true,
  reasonCodes: Object.freeze(["INVALID_INPUT"] as const),
  transitionId: null,
  activationAuthorized: false,
  activationPerformed: false,
} as const);

const ELIGIBLE_RESULT: EligibleProgramActivationResult = Object.freeze({
  kind: "ELIGIBLE",
  eligible: true,
  classificationOnly: true,
  reasonCodes: Object.freeze(["ALL_PREREQUISITES_SATISFIED"] as const),
  transitionId: "B1-TR-027",
  activationAuthorized: false,
  activationPerformed: false,
} as const);

function isNonWhitespaceString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasOnlyExpectedDataKeys(
  input: object,
  expectedKeys: readonly string[],
  ordered: boolean,
): Record<string, unknown> | null {
  const keys = Reflect.ownKeys(input);
  if (keys.length !== expectedKeys.length) {
    return null;
  }

  for (let index = 0; index < expectedKeys.length; index += 1) {
    const expectedKey = expectedKeys[index];
    if (ordered ? keys[index] !== expectedKey : !keys.includes(expectedKey)) {
      return null;
    }
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
  const lengthValue = lengthDescriptor?.value;
  if (
    !lengthDescriptor ||
    !Object.hasOwn(lengthDescriptor, "value") ||
    typeof lengthValue !== "number" ||
    !Number.isSafeInteger(lengthValue) ||
    lengthValue < 0
  ) {
    return null;
  }

  const length = lengthValue;
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

function parsePortfolioRecords(input: unknown): readonly PortfolioRecord[] | null {
  const values = readExactArray(input);
  if (!values) {
    return null;
  }

  const records: PortfolioRecord[] = [];
  for (const value of values) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return null;
    }
    const fields = hasOnlyExpectedDataKeys(value, PORTFOLIO_RECORD_KEYS, false);
    if (
      !fields ||
      !isNonWhitespaceString(fields.programId) ||
      typeof fields.lifecycleState !== "string"
    ) {
      return null;
    }
    records.push({
      programId: fields.programId,
      lifecycleState: fields.lifecycleState as ProgramStateTransitionSourceState,
    });
  }

  return records;
}

function parseGoverningMotions(
  input: unknown,
): readonly GoverningMotionRecord[] | null {
  const values = readExactArray(input);
  if (!values) {
    return null;
  }

  const records: GoverningMotionRecord[] = [];
  for (const value of values) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return null;
    }
    const fields = hasOnlyExpectedDataKeys(value, GOVERNING_MOTION_KEYS, false);
    if (
      !fields ||
      !isNonWhitespaceString(fields.motionId) ||
      !isNonWhitespaceString(fields.subjectProgramId) ||
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
    records.push({
      motionId: fields.motionId,
      subjectProgramId: fields.subjectProgramId,
      ratificationState: fields.ratificationState,
      decisionState: fields.decisionState,
      mainAcceptanceState: fields.mainAcceptanceState,
      freshnessState: fields.freshnessState,
    });
  }

  return records;
}

function parseReceipts(input: unknown): readonly ReceiptRecord[] | null {
  const values = readExactArray(input);
  if (!values) {
    return null;
  }

  const records: ReceiptRecord[] = [];
  for (const value of values) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return null;
    }
    const fields = hasOnlyExpectedDataKeys(value, RECEIPT_KEYS, false);
    if (
      !fields ||
      typeof fields.receiptInstanceId !== "string" ||
      typeof fields.subjectProgramId !== "string" ||
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
    records.push({
      receiptType: fields.receiptType,
      receiptInstanceId: fields.receiptInstanceId,
      subjectProgramId: fields.subjectProgramId,
      issuanceState: fields.issuanceState,
      integrityState: fields.integrityState,
      authenticityState: fields.authenticityState,
      issuerAuthorityState: fields.issuerAuthorityState,
      freshnessState: fields.freshnessState,
    });
  }

  return records;
}

function parseInput(input: unknown): ActivationEligibilityInput | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  const fields = hasOnlyExpectedDataKeys(input, TOP_LEVEL_KEYS, true);
  if (!fields || !isNonWhitespaceString(fields.candidateProgramId)) {
    return null;
  }

  const portfolioRecords = parsePortfolioRecords(fields.portfolio);
  const governingMotions = parseGoverningMotions(fields.governingMotions);
  const receipts = parseReceipts(fields.receipts);
  if (!portfolioRecords || !governingMotions || !receipts) {
    return null;
  }

  return {
    candidateProgramId: fields.candidateProgramId,
    portfolioRecords,
    governingMotions,
    receipts,
  };
}

function addReason(
  reasons: Set<IneligibleProgramActivationReasonCode>,
  reason: IneligibleProgramActivationReasonCode,
) {
  reasons.add(reason);
}

function evaluateGoverningMotionRequirements(
  motions: readonly GoverningMotionRecord[],
  candidateProgramId: string,
  reasons: Set<IneligibleProgramActivationReasonCode>,
) {
  if (motions.length === 0) {
    addReason(reasons, "GOVERNING_MOTION_MISSING");
    return;
  }
  if (motions.length !== 1) {
    addReason(reasons, "GOVERNING_MOTION_CONFLICT");
  }

  for (const motion of motions) {
    if (motion.subjectProgramId !== candidateProgramId) {
      addReason(reasons, "GOVERNING_MOTION_SUBJECT_MISMATCH");
    }
    if (motion.ratificationState !== "RATIFIED") {
      addReason(reasons, "GOVERNING_MOTION_NOT_RATIFIED");
    }
    if (motion.decisionState !== "PASS") {
      addReason(reasons, "GOVERNING_MOTION_NON_PASS");
    }
    if (motion.mainAcceptanceState !== "ACCEPTED_ON_MAIN") {
      addReason(reasons, "GOVERNING_MOTION_NOT_ACCEPTED_ON_MAIN");
    }
    if (motion.freshnessState !== "CURRENT") {
      addReason(reasons, "GOVERNING_MOTION_NOT_CURRENT");
    }
  }
}

function evaluateReceiptValues(
  receipt: ReceiptRecord,
  reasons: Set<IneligibleProgramActivationReasonCode>,
) {
  if (!isNonWhitespaceString(receipt.receiptInstanceId)) {
    addReason(reasons, "RECEIPT_INSTANCE_ID_MISSING");
  }
  if (receipt.issuanceState !== "ISSUED") {
    addReason(reasons, "RECEIPT_NOT_ISSUED");
  }
  if (receipt.integrityState !== "VERIFIED") {
    addReason(reasons, "RECEIPT_INTEGRITY_NOT_VERIFIED");
  }
  if (receipt.authenticityState !== "VERIFIED") {
    addReason(reasons, "RECEIPT_AUTHENTICITY_NOT_VERIFIED");
  }
  if (receipt.issuerAuthorityState !== "ESTABLISHED") {
    addReason(reasons, "RECEIPT_ISSUER_AUTHORITY_NOT_ESTABLISHED");
  }
  if (receipt.freshnessState !== "CURRENT") {
    addReason(reasons, "RECEIPT_NOT_CURRENT");
  }
}

function evaluateReceiptRequirements(
  receipts: readonly ReceiptRecord[],
  candidateProgramId: string,
  reasons: Set<IneligibleProgramActivationReasonCode>,
) {
  for (const receipt of receipts) {
    if (receipt.subjectProgramId !== candidateProgramId) {
      addReason(reasons, "RECEIPT_SUBJECT_MISMATCH");
    }
    evaluateReceiptValues(receipt, reasons);
  }

  const requirements = [
    ["MAIN_STATE_RECEIPT", "MAIN_STATE_RECEIPT_MISSING", "MAIN_STATE_RECEIPT_DUPLICATE"],
    [
      "PROGRAM_OPENING_RECEIPT",
      "PROGRAM_OPENING_RECEIPT_MISSING",
      "PROGRAM_OPENING_RECEIPT_DUPLICATE",
    ],
  ] as const;

  for (const [receiptType, missingReason, duplicateReason] of requirements) {
    const candidateBound = receipts.filter(
      (receipt) =>
        receipt.receiptType === receiptType &&
        receipt.subjectProgramId === candidateProgramId,
    );

    if (candidateBound.length === 0) {
      addReason(reasons, missingReason);
      continue;
    }
    if (candidateBound.length > 1) {
      addReason(reasons, duplicateReason);
    }
  }
}

function createIneligibleResult(
  reasons: Set<IneligibleProgramActivationReasonCode>,
): IneligibleProgramActivationResult | InvalidProgramActivationInputResult {
  const orderedReasons = PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES.filter(
    (reason): reason is IneligibleProgramActivationReasonCode =>
      reason !== "INVALID_INPUT" &&
      reason !== "ALL_PREREQUISITES_SATISFIED" &&
      reasons.has(reason),
  );

  if (orderedReasons.length === 0) {
    return INVALID_INPUT_RESULT;
  }

  const [firstReason, ...remainingReasons] = orderedReasons;
  const reasonCodes = Object.freeze([
    firstReason,
    ...remainingReasons,
  ] as [
    IneligibleProgramActivationReasonCode,
    ...IneligibleProgramActivationReasonCode[],
  ]);

  return Object.freeze({
    kind: "INELIGIBLE",
    eligible: false,
    classificationOnly: true,
    reasonCodes,
    transitionId: null,
    activationAuthorized: false,
    activationPerformed: false,
  } as const);
}

/**
 * Classifies supplied synthetic evidence without issuing a receipt, changing a
 * Program state, or granting activation authority.
 */
export function evaluateProgramActivationEligibility(
  input: unknown,
): ProgramActivationEligibilityResult {
  try {
    const parsed = parseInput(input);
    if (!parsed) {
      return INVALID_INPUT_RESULT;
    }

    const resolverResult = resolveCanonicalActiveProgram(parsed.portfolioRecords);
    if (resolverResult.kind === "INVALID_INPUT") {
      return INVALID_INPUT_RESULT;
    }

    const reasons = new Set<IneligibleProgramActivationReasonCode>();
    if (resolverResult.kind === "ONE_ACTIVE") {
      addReason(reasons, "ACTIVE_PROGRAM_PRESENT");
    }
    if (resolverResult.kind === "MULTIPLE_ACTIVE") {
      addReason(reasons, "MULTIPLE_ACTIVE_PROGRAMS");
    }

    const candidates = parsed.portfolioRecords.filter(
      (record) => record.programId === parsed.candidateProgramId,
    );
    if (candidates.length !== 1) {
      addReason(reasons, "CANDIDATE_NOT_FOUND");
    } else {
      const transitionResult = evaluateProgramStateTransition({
        sourceState: candidates[0].lifecycleState,
        action: "OPEN_FOR_BATCH_PLANNING",
      });
      if (transitionResult.kind === "INVALID_INPUT") {
        return INVALID_INPUT_RESULT;
      }

      if (
        transitionResult.kind !== "ALLOWED" ||
        transitionResult.transitionId !== "B1-TR-027" ||
        transitionResult.evidenceRequirementClass !== "FRESH_MAIN_STATE_RECEIPT" ||
        transitionResult.authorityGranted !== false ||
        transitionResult.transitionPerformed !== false
      ) {
        addReason(reasons, "CANDIDATE_TRANSITION_NOT_LISTED");
      }
    }

    evaluateGoverningMotionRequirements(
      parsed.governingMotions,
      parsed.candidateProgramId,
      reasons,
    );
    evaluateReceiptRequirements(parsed.receipts, parsed.candidateProgramId, reasons);

    return reasons.size === 0 ? ELIGIBLE_RESULT : createIneligibleResult(reasons);
  } catch {
    return INVALID_INPUT_RESULT;
  }
}

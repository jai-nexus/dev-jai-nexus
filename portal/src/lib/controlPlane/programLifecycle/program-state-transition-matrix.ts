import {
  PROGRAM_LIFECYCLE_STATES,
  type ProgramLifecycleState,
} from "./one-active-program-invariant";

export const PROGRAM_TRANSITION_ACTIONS = Object.freeze([
  "OPEN_FOR_BATCH_PLANNING",
  "PLACE_ON_HOLD",
  "REOPEN_FOR_BATCH_PLANNING",
  "CLOSE_ACCEPTED",
  "CLOSE_NO_GO",
  "CANCEL",
  "FAIL",
] as const);

export type ProgramTransitionAction = (typeof PROGRAM_TRANSITION_ACTIONS)[number];

export const PROGRAM_TRANSITION_REASON_CODES = Object.freeze([
  "LISTED_B1_PROGRAM_TRANSITION",
  "UNLISTED_B1_PROGRAM_TRANSITION",
  "INVALID_INPUT",
] as const);

export type ProgramTransitionReasonCode =
  (typeof PROGRAM_TRANSITION_REASON_CODES)[number];

export type ProgramTransitionEvidenceRequirementClass =
  | "FRESH_MAIN_STATE_RECEIPT"
  | "CONTROL_DISPOSITION_EVIDENCE"
  | "ACCEPTED_DECISION";

export type ProgramStateTransitionMatrixRow =
  | AllowedProgramStateTransitionMatrixRow
  | DeniedProgramStateTransitionMatrixRow;

export interface AllowedProgramStateTransitionMatrixRow {
  readonly kind: "ALLOWED";
  readonly allowed: true;
  readonly sourceState: ProgramLifecycleState;
  readonly action: ProgramTransitionAction;
  readonly targetState: ProgramLifecycleState;
  readonly transitionId: string;
  readonly preconditionClass: "PROGRAM_TRANSITION_AUTHORITY";
  readonly evidenceRequirementClass: ProgramTransitionEvidenceRequirementClass;
  readonly separateAuthorityRequired: true;
  readonly invalidTransitionBehavior: "FAIL_CLOSED";
  readonly reasonCode: "LISTED_B1_PROGRAM_TRANSITION";
  readonly authorityGranted: false;
  readonly transitionPerformed: false;
}

export interface DeniedProgramStateTransitionMatrixRow {
  readonly kind: "DENIED";
  readonly allowed: false;
  readonly sourceState: ProgramLifecycleState;
  readonly action: ProgramTransitionAction;
  readonly targetState: null;
  readonly transitionId: null;
  readonly preconditionClass: null;
  readonly evidenceRequirementClass: null;
  readonly separateAuthorityRequired: null;
  readonly invalidTransitionBehavior: "FAIL_CLOSED";
  readonly reasonCode: "UNLISTED_B1_PROGRAM_TRANSITION";
  readonly authorityGranted: false;
  readonly transitionPerformed: false;
}

export interface InvalidProgramStateTransitionResult {
  readonly kind: "INVALID_INPUT";
  readonly allowed: false;
  readonly sourceState: null;
  readonly action: null;
  readonly targetState: null;
  readonly transitionId: null;
  readonly preconditionClass: null;
  readonly evidenceRequirementClass: null;
  readonly separateAuthorityRequired: null;
  readonly invalidTransitionBehavior: "FAIL_CLOSED";
  readonly reasonCode: "INVALID_INPUT";
  readonly authorityGranted: false;
  readonly transitionPerformed: false;
}

export type ProgramStateTransitionResult =
  | ProgramStateTransitionMatrixRow
  | InvalidProgramStateTransitionResult;

interface ProgramStateTransitionRequest {
  readonly sourceState: ProgramLifecycleState;
  readonly action: ProgramTransitionAction;
}

interface AllowedTransitionDefinition {
  readonly sourceState: ProgramLifecycleState;
  readonly action: ProgramTransitionAction;
  readonly targetState: ProgramLifecycleState;
  readonly transitionId: string;
  readonly evidenceRequirementClass: ProgramTransitionEvidenceRequirementClass;
}

const [
  notRouted,
  openForBatchPlanning,
  unresolvedHold,
  closedAccepted,
  closedNoGo,
  cancelled,
  failed,
] = PROGRAM_LIFECYCLE_STATES;

const [
  openForBatchPlanningAction,
  placeOnHold,
  reopenForBatchPlanning,
  closeAccepted,
  closeNoGo,
  cancel,
  fail,
] = PROGRAM_TRANSITION_ACTIONS;

const ALLOWED_TRANSITION_DEFINITIONS: readonly AllowedTransitionDefinition[] = [
  {
    sourceState: notRouted,
    action: openForBatchPlanningAction,
    targetState: openForBatchPlanning,
    transitionId: "B1-TR-027",
    evidenceRequirementClass: "FRESH_MAIN_STATE_RECEIPT",
  },
  {
    sourceState: openForBatchPlanning,
    action: placeOnHold,
    targetState: unresolvedHold,
    transitionId: "B1-TR-028",
    evidenceRequirementClass: "CONTROL_DISPOSITION_EVIDENCE",
  },
  {
    sourceState: unresolvedHold,
    action: reopenForBatchPlanning,
    targetState: openForBatchPlanning,
    transitionId: "B1-TR-029",
    evidenceRequirementClass: "FRESH_MAIN_STATE_RECEIPT",
  },
  {
    sourceState: openForBatchPlanning,
    action: closeAccepted,
    targetState: closedAccepted,
    transitionId: "B1-TR-030",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: openForBatchPlanning,
    action: closeNoGo,
    targetState: closedNoGo,
    transitionId: "B1-TR-031",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: openForBatchPlanning,
    action: cancel,
    targetState: cancelled,
    transitionId: "B1-TR-032",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: openForBatchPlanning,
    action: fail,
    targetState: failed,
    transitionId: "B1-TR-033",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: unresolvedHold,
    action: closeAccepted,
    targetState: closedAccepted,
    transitionId: "B1-TR-034",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: unresolvedHold,
    action: closeNoGo,
    targetState: closedNoGo,
    transitionId: "B1-TR-035",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: unresolvedHold,
    action: cancel,
    targetState: cancelled,
    transitionId: "B1-TR-036",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
  {
    sourceState: unresolvedHold,
    action: fail,
    targetState: failed,
    transitionId: "B1-TR-037",
    evidenceRequirementClass: "ACCEPTED_DECISION",
  },
];

function pairKey(sourceState: ProgramLifecycleState, action: ProgramTransitionAction): string {
  return `${sourceState}\u0000${action}`;
}

const ALLOWED_TRANSITIONS_BY_PAIR = new Map<string, AllowedTransitionDefinition>(
  ALLOWED_TRANSITION_DEFINITIONS.map((definition) => [
    pairKey(definition.sourceState, definition.action),
    definition,
  ] as const),
);

function createMatrixRow(
  sourceState: ProgramLifecycleState,
  action: ProgramTransitionAction,
): ProgramStateTransitionMatrixRow {
  const allowedTransition = ALLOWED_TRANSITIONS_BY_PAIR.get(pairKey(sourceState, action));
  if (allowedTransition) {
    return Object.freeze({
      kind: "ALLOWED",
      allowed: true,
      sourceState,
      action,
      targetState: allowedTransition.targetState,
      transitionId: allowedTransition.transitionId,
      preconditionClass: "PROGRAM_TRANSITION_AUTHORITY",
      evidenceRequirementClass: allowedTransition.evidenceRequirementClass,
      separateAuthorityRequired: true,
      invalidTransitionBehavior: "FAIL_CLOSED",
      reasonCode: "LISTED_B1_PROGRAM_TRANSITION",
      authorityGranted: false,
      transitionPerformed: false,
    } as const);
  }

  return Object.freeze({
    kind: "DENIED",
    allowed: false,
    sourceState,
    action,
    targetState: null,
    transitionId: null,
    preconditionClass: null,
    evidenceRequirementClass: null,
    separateAuthorityRequired: null,
    invalidTransitionBehavior: "FAIL_CLOSED",
    reasonCode: "UNLISTED_B1_PROGRAM_TRANSITION",
    authorityGranted: false,
    transitionPerformed: false,
  } as const);
}

export const PROGRAM_STATE_TRANSITION_MATRIX: readonly ProgramStateTransitionMatrixRow[] =
  Object.freeze(
    PROGRAM_LIFECYCLE_STATES.flatMap((sourceState) =>
      PROGRAM_TRANSITION_ACTIONS.map((action) => createMatrixRow(sourceState, action)),
    ),
  );

const MATRIX_BY_PAIR = new Map<string, ProgramStateTransitionMatrixRow>(
  PROGRAM_STATE_TRANSITION_MATRIX.map((row) => [
    pairKey(row.sourceState, row.action),
    row,
  ] as const),
);

const INVALID_INPUT_RESULT: InvalidProgramStateTransitionResult = Object.freeze({
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
} as const);

function isExactProgramStateTransitionRequest(
  input: unknown,
): input is ProgramStateTransitionRequest {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return false;
  }

  const keys = Reflect.ownKeys(input);
  if (
    keys.length !== 2 ||
    !keys.includes("sourceState") ||
    !keys.includes("action")
  ) {
    return false;
  }

  const sourceStateDescriptor = Object.getOwnPropertyDescriptor(input, "sourceState");
  const actionDescriptor = Object.getOwnPropertyDescriptor(input, "action");
  if (
    !sourceStateDescriptor ||
    !actionDescriptor ||
    !Object.hasOwn(sourceStateDescriptor, "value") ||
    !Object.hasOwn(actionDescriptor, "value")
  ) {
    return false;
  }

  return (
    typeof sourceStateDescriptor.value === "string" &&
    PROGRAM_LIFECYCLE_STATES.includes(
      sourceStateDescriptor.value as ProgramLifecycleState,
    ) &&
    typeof actionDescriptor.value === "string" &&
    PROGRAM_TRANSITION_ACTIONS.includes(
      actionDescriptor.value as ProgramTransitionAction,
    )
  );
}

/**
 * Classifies a Program state/action pair against the B1-listed matrix. It
 * neither performs a transition nor grants any authority.
 */
export function evaluateProgramStateTransition(
  input: unknown,
): ProgramStateTransitionResult {
  try {
    if (!isExactProgramStateTransitionRequest(input)) {
      return INVALID_INPUT_RESULT;
    }

    return (
      MATRIX_BY_PAIR.get(pairKey(input.sourceState, input.action)) ??
      INVALID_INPUT_RESULT
    );
  } catch {
    return INVALID_INPUT_RESULT;
  }
}

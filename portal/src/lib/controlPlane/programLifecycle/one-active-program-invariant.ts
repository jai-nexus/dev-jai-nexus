export const PROGRAM_LIFECYCLE_STATES = Object.freeze([
  "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
  "OPEN_FOR_BATCH_PLANNING_ONLY",
  "UNRESOLVED_HOLD",
  "CLOSED_ACCEPTED",
  "CLOSED_NO_GO",
  "CANCELLED",
  "FAILED",
] as const);

export type ProgramLifecycleState = (typeof PROGRAM_LIFECYCLE_STATES)[number];

export interface ProgramStateRecord {
  readonly programId: string;
  readonly lifecycleState: ProgramLifecycleState;
}

export type OneActiveProgramInvariantResult =
  | {
      readonly kind: "ZERO_ACTIVE";
      readonly invariantHolds: true;
      readonly guardedActionEligible: false;
      readonly activeProgramIds: readonly [];
    }
  | {
      readonly kind: "ONE_ACTIVE";
      readonly invariantHolds: true;
      readonly guardedActionEligible: true;
      readonly activeProgramId: string;
      readonly activeProgramIds: readonly [string];
    }
  | {
      readonly kind: "MULTIPLE_ACTIVE";
      readonly invariantHolds: false;
      readonly guardedActionEligible: false;
      readonly activeProgramIds: readonly string[];
    }
  | {
      readonly kind: "INVALID_INPUT";
      readonly invariantHolds: false;
      readonly guardedActionEligible: false;
      readonly activeProgramIds: readonly [];
    };

const ACTIVE_PROGRAM_STATE = "OPEN_FOR_BATCH_PLANNING_ONLY";
const RECORD_KEYS = ["programId", "lifecycleState"] as const;

function isProgramLifecycleState(value: unknown): value is ProgramLifecycleState {
  return (
    typeof value === "string" &&
    PROGRAM_LIFECYCLE_STATES.includes(value as ProgramLifecycleState)
  );
}

function isExactProgramStateRecord(value: unknown): value is ProgramStateRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== RECORD_KEYS.length || !RECORD_KEYS.every((key) => Object.hasOwn(record, key))) {
    return false;
  }

  return (
    typeof record.programId === "string" &&
    record.programId.trim().length > 0 &&
    isProgramLifecycleState(record.lifecycleState)
  );
}

function invalidInput(): OneActiveProgramInvariantResult {
  return {
    kind: "INVALID_INPUT",
    invariantHolds: false,
    guardedActionEligible: false,
    activeProgramIds: [],
  };
}

/**
 * Evaluates the one-active-Program portfolio invariant without changing a
 * Program state or granting lifecycle, routing, or execution authority.
 */
export function evaluateOneActiveProgramInvariant(
  input: unknown,
): OneActiveProgramInvariantResult {
  try {
    if (!Array.isArray(input)) {
      return invalidInput();
    }

    const seenProgramIds = new Set<string>();
    const activeProgramIds: string[] = [];

    for (const value of input) {
      if (!isExactProgramStateRecord(value) || seenProgramIds.has(value.programId)) {
        return invalidInput();
      }

      seenProgramIds.add(value.programId);
      if (value.lifecycleState === ACTIVE_PROGRAM_STATE) {
        activeProgramIds.push(value.programId);
      }
    }

    activeProgramIds.sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

    if (activeProgramIds.length === 0) {
      return {
        kind: "ZERO_ACTIVE",
        invariantHolds: true,
        guardedActionEligible: false,
        activeProgramIds: [],
      };
    }

    if (activeProgramIds.length === 1) {
      return {
        kind: "ONE_ACTIVE",
        invariantHolds: true,
        guardedActionEligible: true,
        activeProgramId: activeProgramIds[0],
        activeProgramIds: [activeProgramIds[0]],
      };
    }

    return {
      kind: "MULTIPLE_ACTIVE",
      invariantHolds: false,
      guardedActionEligible: false,
      activeProgramIds,
    };
  } catch {
    return invalidInput();
  }
}

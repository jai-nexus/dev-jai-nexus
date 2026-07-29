import {
  evaluateOneActiveProgramInvariant,
  type OneActiveProgramInvariantResult,
  type ProgramLifecycleState,
  type ProgramStateRecord,
} from "./one-active-program-invariant";

export interface CanonicalActiveProgramSnapshot {
  readonly programId: string;
  readonly lifecycleState: ProgramLifecycleState;
}

type InvariantResultOfKind<
  Kind extends OneActiveProgramInvariantResult["kind"],
> = Extract<OneActiveProgramInvariantResult, { readonly kind: Kind }>;

export type CanonicalActiveProgramResolverResult =
  | (InvariantResultOfKind<"ZERO_ACTIVE"> & {
      readonly activeProgram: null;
    })
  | (InvariantResultOfKind<"ONE_ACTIVE"> & {
      readonly activeProgram: CanonicalActiveProgramSnapshot;
    })
  | (InvariantResultOfKind<"MULTIPLE_ACTIVE"> & {
      readonly activeProgram: null;
    })
  | (InvariantResultOfKind<"INVALID_INPUT"> & {
      readonly activeProgram: null;
    });

function invalidInput(): CanonicalActiveProgramResolverResult {
  return {
    kind: "INVALID_INPUT",
    invariantHolds: false,
    guardedActionEligible: false,
    activeProgramIds: [],
    activeProgram: null,
  };
}

function hasProgramId(
  value: unknown,
  programId: string,
): value is ProgramStateRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    (value as Partial<ProgramStateRecord>).programId === programId
  );
}

/**
 * Resolves a frozen snapshot of the sole active Program. Eligibility is
 * inherited contract data only and grants no action or authority.
 */
export function resolveCanonicalActiveProgram(
  input: unknown,
): CanonicalActiveProgramResolverResult {
  try {
    const invariantResult = evaluateOneActiveProgramInvariant(input);
    if (invariantResult.kind !== "ONE_ACTIVE") {
      return {
        ...invariantResult,
        activeProgram: null,
      };
    }

    if (!Array.isArray(input)) {
      return invalidInput();
    }

    const matchingRecords = input.filter((value) =>
      hasProgramId(value, invariantResult.activeProgramId),
    );
    if (matchingRecords.length !== 1) {
      return invalidInput();
    }

    const matchingRecord = matchingRecords[0];
    const selectedRecordResult = evaluateOneActiveProgramInvariant([
      matchingRecord,
    ]);
    if (
      selectedRecordResult.kind !== "ONE_ACTIVE" ||
      selectedRecordResult.activeProgramId !== invariantResult.activeProgramId
    ) {
      return invalidInput();
    }

    const snapshotCandidate = {
      programId: matchingRecord.programId,
      lifecycleState: matchingRecord.lifecycleState,
    };
    const snapshotResult = evaluateOneActiveProgramInvariant([
      snapshotCandidate,
    ]);
    if (
      snapshotResult.kind !== "ONE_ACTIVE" ||
      snapshotResult.activeProgramId !== invariantResult.activeProgramId
    ) {
      return invalidInput();
    }

    const finalInvariantResult = evaluateOneActiveProgramInvariant(input);
    if (
      finalInvariantResult.kind !== "ONE_ACTIVE" ||
      finalInvariantResult.activeProgramId !== invariantResult.activeProgramId
    ) {
      return invalidInput();
    }

    return {
      ...invariantResult,
      activeProgram: Object.freeze(snapshotCandidate),
    };
  } catch {
    return invalidInput();
  }
}

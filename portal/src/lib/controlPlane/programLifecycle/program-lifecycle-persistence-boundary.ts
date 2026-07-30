import {
  PROGRAM_LIFECYCLE_STATES,
  evaluateOneActiveProgramInvariant,
  type OneActiveProgramInvariantResult,
  type ProgramLifecycleState,
} from "./one-active-program-invariant";

const INITIAL_PROGRAM_LIFECYCLE_STATE = PROGRAM_LIFECYCLE_STATES[0] as (
  typeof PROGRAM_LIFECYCLE_STATES
)[0];
const CREATE_INPUT_KEYS = ["programId", "programCode", "programTitle"] as const;
const PERSISTED_ROW_KEYS = [
  "programId",
  "programCode",
  "programTitle",
  "lifecycleState",
  "lifecycleVersion",
  "createdAt",
  "updatedAt",
] as const;
const PROGRAM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROGRAM_CODE_PATTERN = /^[A-Z][A-Z0-9]*-P[1-9][0-9]*$/;
export const MAX_PROGRAM_LIFECYCLE_VERSION = 2_147_483_647;

export interface InitialProgramLifecycleCreateInput {
  readonly programId: string;
  readonly programCode: string;
  readonly programTitle: string | null;
}

export interface InitialProgramLifecycleRecord
  extends InitialProgramLifecycleCreateInput {
  readonly lifecycleState: typeof INITIAL_PROGRAM_LIFECYCLE_STATE;
  readonly lifecycleVersion: 0;
}

export interface PersistedProgramLifecycleRecord
  extends InitialProgramLifecycleCreateInput {
  readonly lifecycleState: ProgramLifecycleState;
  readonly lifecycleVersion: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ProgramLifecyclePersistenceAdapter {
  readonly list: () => Promise<unknown>;
  readonly findByProgramId: (programId: string) => Promise<unknown | null>;
  readonly insertInitialProgram: (
    record: InitialProgramLifecycleRecord,
  ) => Promise<unknown>;
}

export type ProgramLifecyclePersistenceFailureClassification =
  | "ADAPTER_UNAVAILABLE"
  | "ADAPTER_ERROR";

export type ProgramLifecycleWriteEffect = "NONE" | "CONFIRMED" | "UNKNOWN";

export class ProgramLifecyclePersistenceUnavailableError extends Error {
  constructor() {
    super("Program lifecycle persistence is unavailable.");
    this.name = "ProgramLifecyclePersistenceUnavailableError";
  }
}

export class ProgramLifecyclePersistenceConflictError extends Error {
  readonly conflict: "PROGRAM_ID" | "PROGRAM_CODE";

  constructor(conflict: "PROGRAM_ID" | "PROGRAM_CODE") {
    super("Program lifecycle identity already exists.");
    this.name = "ProgramLifecyclePersistenceConflictError";
    this.conflict = conflict;
  }
}

export type ProgramLifecyclePersistenceListResult =
  | {
      readonly kind: "LISTED";
      readonly available: true;
      readonly records: readonly PersistedProgramLifecycleRecord[];
      readonly invariant: Exclude<
        OneActiveProgramInvariantResult,
        { readonly kind: "INVALID_INPUT" | "MULTIPLE_ACTIVE" }
      >;
    }
  | {
      readonly kind: "INVALID_PERSISTED_ROWS";
      readonly available: false;
      readonly records: readonly [];
      readonly invariant: null;
    }
  | {
      readonly kind: "UNAVAILABLE";
      readonly available: false;
      readonly classification: ProgramLifecyclePersistenceFailureClassification;
      readonly records: readonly [];
      readonly invariant: null;
    };

export type ProgramLifecyclePersistenceFindResult =
  | {
      readonly kind: "FOUND";
      readonly available: true;
      readonly record: PersistedProgramLifecycleRecord;
    }
  | {
      readonly kind: "NOT_FOUND";
      readonly available: true;
      readonly record: null;
    }
  | {
      readonly kind: "INVALID_INPUT" | "INVALID_PERSISTED_ROW";
      readonly available: false;
      readonly record: null;
    }
  | {
      readonly kind: "UNAVAILABLE";
      readonly available: false;
      readonly classification: ProgramLifecyclePersistenceFailureClassification;
      readonly record: null;
    };

export type ProgramLifecyclePersistenceInsertResult =
  | {
      readonly kind: "INSERTED";
      readonly available: true;
      readonly writeEffect: "CONFIRMED";
      readonly record: PersistedProgramLifecycleRecord;
    }
  | {
      readonly kind:
        | "INVALID_INPUT"
        | "DUPLICATE_PROGRAM_ID"
        | "DUPLICATE_PROGRAM_CODE"
        | "INVALID_PERSISTED_ROWS";
      readonly available: false;
      readonly writeEffect: "NONE";
      readonly record: null;
    }
  | {
      readonly kind: "INVALID_INSERT_RESULT";
      readonly available: false;
      readonly writeEffect: "UNKNOWN";
      readonly record: null;
    }
  | {
      readonly kind: "UNAVAILABLE";
      readonly available: false;
      readonly classification: ProgramLifecyclePersistenceFailureClassification;
      readonly writeEffect: "NONE" | "UNKNOWN";
      readonly record: null;
    };

export interface ProgramLifecyclePersistenceService {
  readonly list: () => Promise<ProgramLifecyclePersistenceListResult>;
  readonly findByProgramId: (
    programId: unknown,
  ) => Promise<ProgramLifecyclePersistenceFindResult>;
  readonly insertInitialProgram: (
    input: unknown,
  ) => Promise<ProgramLifecyclePersistenceInsertResult>;
}

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

function isCanonicalProgramId(value: unknown): value is string {
  return typeof value === "string" && PROGRAM_ID_PATTERN.test(value);
}

function isCanonicalProgramCode(value: unknown): value is string {
  return typeof value === "string" && PROGRAM_CODE_PATTERN.test(value);
}

function normalizeProgramTitle(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function isStoredProgramTitle(value: unknown): value is string | null {
  return (
    value === null ||
    (typeof value === "string" && value.length > 0 && value === value.trim())
  );
}

function isCanonicalUtcIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const timestamp = new Date(value);
  return !Number.isNaN(timestamp.getTime()) && timestamp.toISOString() === value;
}

function isProgramLifecycleVersion(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_PROGRAM_LIFECYCLE_VERSION
  );
}

function isProgramLifecycleState(value: unknown): value is ProgramLifecycleState {
  return (
    typeof value === "string" &&
    PROGRAM_LIFECYCLE_STATES.includes(value as ProgramLifecycleState)
  );
}

function freezeInitialRecord(
  input: InitialProgramLifecycleCreateInput,
): InitialProgramLifecycleRecord {
  return Object.freeze({
    programId: input.programId,
    programCode: input.programCode,
    programTitle: input.programTitle,
    lifecycleState: INITIAL_PROGRAM_LIFECYCLE_STATE,
    lifecycleVersion: 0,
  });
}

function freezePersistedRecord(
  record: PersistedProgramLifecycleRecord,
): PersistedProgramLifecycleRecord {
  return Object.freeze({
    programId: record.programId,
    programCode: record.programCode,
    programTitle: record.programTitle,
    lifecycleState: record.lifecycleState,
    lifecycleVersion: record.lifecycleVersion,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

export function validateInitialProgramLifecycleCreateInput(
  input: unknown,
): InitialProgramLifecycleCreateInput | null {
  try {
    const values = readExactDataObject(input, CREATE_INPUT_KEYS);
    if (!values || !isCanonicalProgramId(values.programId) || !isCanonicalProgramCode(values.programCode)) {
      return null;
    }

    const programTitle = normalizeProgramTitle(values.programTitle);
    if (programTitle === undefined) {
      return null;
    }

    return Object.freeze({
      programId: values.programId,
      programCode: values.programCode,
      programTitle,
    });
  } catch {
    return null;
  }
}

export function validatePersistedProgramLifecycleRecord(
  input: unknown,
): PersistedProgramLifecycleRecord | null {
  try {
    const values = readExactDataObject(input, PERSISTED_ROW_KEYS);
    if (
      !values ||
      !isCanonicalProgramId(values.programId) ||
      !isCanonicalProgramCode(values.programCode) ||
      !isStoredProgramTitle(values.programTitle) ||
      !isProgramLifecycleState(values.lifecycleState) ||
      !isProgramLifecycleVersion(values.lifecycleVersion) ||
      !isCanonicalUtcIsoTimestamp(values.createdAt) ||
      !isCanonicalUtcIsoTimestamp(values.updatedAt)
    ) {
      return null;
    }

    return freezePersistedRecord({
      programId: values.programId,
      programCode: values.programCode,
      programTitle: values.programTitle,
      lifecycleState: values.lifecycleState,
      lifecycleVersion: values.lifecycleVersion,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
    });
  } catch {
    return null;
  }
}

function parsePersistedRows(
  input: unknown,
): {
  readonly records: readonly PersistedProgramLifecycleRecord[];
  readonly invariant: Exclude<
    OneActiveProgramInvariantResult,
    { readonly kind: "INVALID_INPUT" | "MULTIPLE_ACTIVE" }
  >;
} | null {
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
  if (invariant.kind === "INVALID_INPUT" || invariant.kind === "MULTIPLE_ACTIVE") {
    return null;
  }

  const sortedRecords = records.sort((left, right) =>
    left.programId < right.programId ? -1 : left.programId > right.programId ? 1 : 0,
  );
  return Object.freeze({
    records: Object.freeze(sortedRecords),
    invariant,
  });
}

function failureClassification(
  error: unknown,
): ProgramLifecyclePersistenceFailureClassification {
  return error instanceof ProgramLifecyclePersistenceUnavailableError
    ? "ADAPTER_UNAVAILABLE"
    : "ADAPTER_ERROR";
}

function unavailableListResult(
  error: unknown,
): ProgramLifecyclePersistenceListResult {
  return {
    kind: "UNAVAILABLE",
    available: false,
    classification: failureClassification(error),
    records: [],
    invariant: null,
  };
}

function unavailableFindResult(
  error: unknown,
): ProgramLifecyclePersistenceFindResult {
  return {
    kind: "UNAVAILABLE",
    available: false,
    classification: failureClassification(error),
    record: null,
  };
}

function unavailableInsertResult(
  error: unknown,
  writeEffect: "NONE" | "UNKNOWN",
): ProgramLifecyclePersistenceInsertResult {
  return {
    kind: "UNAVAILABLE",
    available: false,
    classification: failureClassification(error),
    writeEffect,
    record: null,
  };
}

function initialRecordMatches(
  expected: InitialProgramLifecycleRecord,
  actual: PersistedProgramLifecycleRecord,
): boolean {
  return (
    expected.programId === actual.programId &&
    expected.programCode === actual.programCode &&
    expected.programTitle === actual.programTitle &&
    expected.lifecycleState === actual.lifecycleState &&
    actual.lifecycleVersion === 0
  );
}

/**
 * Creates the effect-free persistence core. Persisted rows carry only
 * Program identity and lifecycle data; their existence establishes no
 * acceptance, receipt, authority, or activation fact.
 */
export function createProgramLifecyclePersistenceService(
  adapter: ProgramLifecyclePersistenceAdapter,
): ProgramLifecyclePersistenceService {
  return Object.freeze({
    async list(): Promise<ProgramLifecyclePersistenceListResult> {
      try {
        const parsed = parsePersistedRows(await adapter.list());
        if (!parsed) {
          return {
            kind: "INVALID_PERSISTED_ROWS",
            available: false,
            records: [],
            invariant: null,
          };
        }
        return {
          kind: "LISTED",
          available: true,
          records: parsed.records,
          invariant: parsed.invariant,
        };
      } catch (error) {
        return unavailableListResult(error);
      }
    },

    async findByProgramId(
      programId: unknown,
    ): Promise<ProgramLifecyclePersistenceFindResult> {
      if (!isCanonicalProgramId(programId)) {
        return {
          kind: "INVALID_INPUT",
          available: false,
          record: null,
        };
      }

      try {
        const value = await adapter.findByProgramId(programId);
        if (value === null) {
          return {
            kind: "NOT_FOUND",
            available: true,
            record: null,
          };
        }

        const record = validatePersistedProgramLifecycleRecord(value);
        if (!record || record.programId !== programId) {
          return {
            kind: "INVALID_PERSISTED_ROW",
            available: false,
            record: null,
          };
        }
        return {
          kind: "FOUND",
          available: true,
          record,
        };
      } catch (error) {
        return unavailableFindResult(error);
      }
    },

    async insertInitialProgram(
      input: unknown,
    ): Promise<ProgramLifecyclePersistenceInsertResult> {
      const createInput = validateInitialProgramLifecycleCreateInput(input);
      if (!createInput) {
        return {
          kind: "INVALID_INPUT",
          available: false,
          writeEffect: "NONE",
          record: null,
        };
      }

      let insertInvocationBegan = false;
      try {
        const existingRows = parsePersistedRows(await adapter.list());
        if (!existingRows) {
          return {
            kind: "INVALID_PERSISTED_ROWS",
            available: false,
            writeEffect: "NONE",
            record: null,
          };
        }
        if (existingRows.records.some((record) => record.programId === createInput.programId)) {
          return {
            kind: "DUPLICATE_PROGRAM_ID",
            available: false,
            writeEffect: "NONE",
            record: null,
          };
        }
        if (existingRows.records.some((record) => record.programCode === createInput.programCode)) {
          return {
            kind: "DUPLICATE_PROGRAM_CODE",
            available: false,
            writeEffect: "NONE",
            record: null,
          };
        }

        const initialRecord = freezeInitialRecord(createInput);
        insertInvocationBegan = true;
        const persistedRecord = validatePersistedProgramLifecycleRecord(
          await adapter.insertInitialProgram(initialRecord),
        );
        if (!persistedRecord || !initialRecordMatches(initialRecord, persistedRecord)) {
          return {
            kind: "INVALID_INSERT_RESULT",
            available: false,
            writeEffect: "UNKNOWN",
            record: null,
          };
        }
        return {
          kind: "INSERTED",
          available: true,
          writeEffect: "CONFIRMED",
          record: persistedRecord,
        };
      } catch (error) {
        if (error instanceof ProgramLifecyclePersistenceConflictError) {
          return {
            kind:
              error.conflict === "PROGRAM_ID"
                ? "DUPLICATE_PROGRAM_ID"
                : "DUPLICATE_PROGRAM_CODE",
            available: false,
            writeEffect: "NONE",
            record: null,
          };
        }
        return unavailableInsertResult(
          error,
          insertInvocationBegan ? "UNKNOWN" : "NONE",
        );
      }
    },
  });
}

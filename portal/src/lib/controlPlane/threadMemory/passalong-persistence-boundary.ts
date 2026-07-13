import { PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS } from "../routeContracts/passalongResponses";
import { THREAD_MEMORY_NON_AUTHORIZATIONS, THREAD_MEMORY_RECORDS } from "./sample-data";
import type {
  ControlThreadId,
  PassalongArchiveState,
  PassalongRecord,
  PassalongRedactionState,
  PassalongRouteStatus,
  PersistedPassalongRecord,
  SandboxImportAdoptionPosture,
} from "./types";
import {
  PASSALONG_ARCHIVE_STATES,
  PASSALONG_REDACTION_STATES,
  PASSALONG_ROUTE_STATUSES,
  SANDBOX_IMPORT_ADOPTION_POSTURES,
} from "./types";

export const PASSALONG_PERSISTENCE_SCHEMA_VERSION = "v0" as const;

export { PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS } from "../routeContracts/passalongResponses";

const FIELD_LIMITS = {
  passalongId: 120,
  threadLabel: 120,
  scope: 220,
  mode: 160,
  summary: 1200,
  requestedDecision: 1200,
  authorityBoundary: 600,
  sandboxPosture: 320,
  manualOperatorNote: 1000,
  evidencePointer: 300,
  nonAuthorization: 260,
} as const;

const SECRET_RISK_PATTERNS = [
  /api[_-]?key\s*[:=]/i,
  /secret\s*[:=]/i,
  /token\s*[:=]/i,
  /password\s*[:=]/i,
  /private key/i,
  /BEGIN RSA/i,
  /BEGIN OPENSSH/i,
  /DATABASE_URL/i,
  /connection string/i,
  /postgres:\/\//i,
  /mysql:\/\//i,
  /mongodb:\/\//i,
  /sk-[A-Za-z0-9]{12,}/,
  /raw \.env/i,
  /chain-of-thought/i,
  /private reasoning/i,
  /target repo source/i,
  /production telemetry/i,
] as const;

export type PersistedPassalongCreateInput = Omit<
  PersistedPassalongRecord,
  "id" | "createdAt" | "updatedAt" | "archivedAt" | "deletedAt" | "schemaVersion"
> & {
  archivedAt?: string | null;
  deletedAt?: string | null;
};

export type PersistedPassalongPatchInput = Partial<
  Pick<
    PersistedPassalongRecord,
    | "routeStatus"
    | "archiveState"
    | "manualOperatorNote"
    | "redactionState"
    | "summary"
    | "requestedDecision"
    | "scope"
    | "mode"
    | "evidencePointers"
    | "authorityBoundary"
    | "nonAuthorizations"
    | "sandboxPosture"
    | "importAdoptionPosture"
  >
>;

export interface BoundaryValidationResult<T> {
  ok: boolean;
  value?: T;
  errors: string[];
}

export function buildPersistedPassalongInput(
  record: PassalongRecord,
): BoundaryValidationResult<PersistedPassalongCreateInput> {
  const sourceThreadLabel = getThreadLabel(record.sourceThread);
  const targetThreadLabel = getThreadLabel(record.targetThread);
  const sandboxPosture = record.sandboxTargetId
    ? "sandbox-nexus candidate; not sandbox activation"
    : null;

  return validatePersistedPassalongCreateInput({
    passalongId: record.passalongId,
    sourceThreadId: record.sourceThread,
    targetThreadId: record.targetThread,
    sourceThreadLabel,
    targetThreadLabel,
    scope: record.scope,
    mode: record.mode,
    summary: record.summary,
    evidencePointers: record.evidencePointers,
    requestedDecision: record.requestedDecision,
    routeStatus: record.status,
    authorityBoundary: record.authorityBoundary,
    nonAuthorizations: constrainStringArray(
      record.nonAuthorizations.length
        ? record.nonAuthorizations
        : [...THREAD_MEMORY_NON_AUTHORIZATIONS],
      FIELD_LIMITS.nonAuthorization,
      "nonAuthorizations",
    ),
    sandboxPosture,
    importAdoptionPosture: record.sandboxImportAdoptionPosture ?? null,
    manualOperatorNote: null,
    archiveState: "active",
    redactionState: "not_required",
  });
}

export function validatePersistedPassalongCreateInput(
  input: unknown,
): BoundaryValidationResult<PersistedPassalongCreateInput> {
  if (!input || typeof input !== "object") {
    return fail("Passalong payload must be an object.");
  }

  const candidate = input as Record<string, unknown>;
  const passalongId = constrainedText(
    candidate.passalongId,
    FIELD_LIMITS.passalongId,
    "passalongId",
  );
  const sourceThreadId = readThreadId(candidate.sourceThreadId, "sourceThreadId");
  const targetThreadId = readThreadId(candidate.targetThreadId, "targetThreadId");
  const routeStatus = readRouteStatus(candidate.routeStatus);
  const archiveState = readArchiveState(candidate.archiveState);
  const redactionState = readRedactionState(candidate.redactionState);
  const importAdoptionPosture = readImportAdoptionPosture(
    candidate.importAdoptionPosture,
  );

  const errors = [
    ...passalongId.errors,
    ...sourceThreadId.errors,
    ...targetThreadId.errors,
    ...routeStatus.errors,
    ...archiveState.errors,
    ...redactionState.errors,
    ...importAdoptionPosture.errors,
  ];

  const value = {
    passalongId: passalongId.value ?? "",
    sourceThreadId: sourceThreadId.value ?? "thread-control-thread",
    targetThreadId: targetThreadId.value ?? "thread-control-thread",
    sourceThreadLabel:
      constrainedText(
        candidate.sourceThreadLabel,
        FIELD_LIMITS.threadLabel,
        "sourceThreadLabel",
      ).value ?? "",
    targetThreadLabel:
      constrainedText(
        candidate.targetThreadLabel,
        FIELD_LIMITS.threadLabel,
        "targetThreadLabel",
      ).value ?? "",
    scope:
      constrainedText(candidate.scope, FIELD_LIMITS.scope, "scope").value ?? "",
    mode: constrainedText(candidate.mode, FIELD_LIMITS.mode, "mode").value ?? "",
    summary:
      constrainedText(candidate.summary, FIELD_LIMITS.summary, "summary")
        .value ?? "",
    evidencePointers: constrainStringArray(
      candidate.evidencePointers,
      FIELD_LIMITS.evidencePointer,
      "evidencePointers",
    ),
    requestedDecision:
      constrainedText(
        candidate.requestedDecision,
        FIELD_LIMITS.requestedDecision,
        "requestedDecision",
      ).value ?? "",
    routeStatus: routeStatus.value ?? "draft",
    authorityBoundary:
      constrainedText(
        candidate.authorityBoundary,
        FIELD_LIMITS.authorityBoundary,
        "authorityBoundary",
      ).value ?? "Persisted passalong record is not CONTROL_THREAD acceptance.",
    nonAuthorizations: constrainStringArray(
      candidate.nonAuthorizations,
      FIELD_LIMITS.nonAuthorization,
      "nonAuthorizations",
    ),
    sandboxPosture: nullableConstrainedText(
      candidate.sandboxPosture,
      FIELD_LIMITS.sandboxPosture,
      "sandboxPosture",
    ),
    importAdoptionPosture: importAdoptionPosture.value ?? null,
    manualOperatorNote: nullableConstrainedText(
      candidate.manualOperatorNote,
      FIELD_LIMITS.manualOperatorNote,
      "manualOperatorNote",
    ),
    archiveState: archiveState.value ?? "active",
    redactionState: redactionState.value ?? "not_required",
    archivedAt: null,
    deletedAt: null,
  } satisfies PersistedPassalongCreateInput;

  errors.push(
    ...collectTextValidationErrors([
      ["sourceThreadLabel", value.sourceThreadLabel],
      ["targetThreadLabel", value.targetThreadLabel],
      ["scope", value.scope],
      ["mode", value.mode],
      ["summary", value.summary],
      ["requestedDecision", value.requestedDecision],
      ["authorityBoundary", value.authorityBoundary],
      ["sandboxPosture", value.sandboxPosture],
      ["manualOperatorNote", value.manualOperatorNote],
      ...value.evidencePointers.map(
        (pointer, index) => [`evidencePointers[${index}]`, pointer] as const,
      ),
    ]),
  );

  if (value.redactionState === "blocked_secret_risk") {
    errors.push(
      "blocked_secret_risk cannot be persisted; redact the content before saving.",
    );
  }

  if (value.nonAuthorizations.length === 0) {
    value.nonAuthorizations = [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS];
  }

  return errors.length ? { ok: false, errors } : { ok: true, value, errors: [] };
}

export function validatePersistedPassalongPatchInput(
  input: unknown,
): BoundaryValidationResult<PersistedPassalongPatchInput> {
  if (!input || typeof input !== "object") {
    return fail("Patch payload must be an object.");
  }

  const candidate = input as Record<string, unknown>;
  const patch: PersistedPassalongPatchInput = {};
  const errors: string[] = [];

  if ("routeStatus" in candidate) {
    const routeStatus = readRouteStatus(candidate.routeStatus);
    errors.push(...routeStatus.errors);
    if (routeStatus.value) patch.routeStatus = routeStatus.value;
  }

  if ("archiveState" in candidate) {
    const archiveState = readArchiveState(candidate.archiveState);
    errors.push(...archiveState.errors);
    if (archiveState.value) patch.archiveState = archiveState.value;
  }

  if ("redactionState" in candidate) {
    const redactionState = readRedactionState(candidate.redactionState);
    errors.push(...redactionState.errors);
    if (redactionState.value) patch.redactionState = redactionState.value;
  }

  for (const [field, limit] of [
    ["scope", FIELD_LIMITS.scope],
    ["mode", FIELD_LIMITS.mode],
    ["summary", FIELD_LIMITS.summary],
    ["requestedDecision", FIELD_LIMITS.requestedDecision],
    ["authorityBoundary", FIELD_LIMITS.authorityBoundary],
    ["sandboxPosture", FIELD_LIMITS.sandboxPosture],
    ["manualOperatorNote", FIELD_LIMITS.manualOperatorNote],
  ] as const) {
    if (field in candidate) {
      const value =
        field === "sandboxPosture" || field === "manualOperatorNote"
          ? nullableConstrainedText(candidate[field], limit, field)
          : constrainedText(candidate[field], limit, field).value;
      if (typeof value === "string" || value === null) {
        patch[field] = value as never;
      }
    }
  }

  if ("evidencePointers" in candidate) {
    patch.evidencePointers = constrainStringArray(
      candidate.evidencePointers,
      FIELD_LIMITS.evidencePointer,
      "evidencePointers",
    );
  }

  if ("nonAuthorizations" in candidate) {
    patch.nonAuthorizations = constrainStringArray(
      candidate.nonAuthorizations,
      FIELD_LIMITS.nonAuthorization,
      "nonAuthorizations",
    );
  }

  if ("importAdoptionPosture" in candidate) {
    const posture = readImportAdoptionPosture(candidate.importAdoptionPosture);
    errors.push(...posture.errors);
    patch.importAdoptionPosture = posture.value ?? null;
  }

  errors.push(
    ...collectTextValidationErrors(
      Object.entries(patch)
        .filter(
          ([field, value]) =>
            typeof value === "string" ||
            (Array.isArray(value) &&
              (field === "evidencePointers" || field === "nonAuthorizations")),
        )
        .flatMap(([field, value]) =>
          Array.isArray(value)
            ? value.map((item, index) => [`${field}[${index}]`, item] as const)
            : [[field, value] as const],
        ),
    ),
  );

  if (patch.redactionState === "blocked_secret_risk") {
    errors.push(
      "blocked_secret_risk cannot be persisted; redact the content before saving.",
    );
  }

  return errors.length ? { ok: false, errors } : { ok: true, value: patch, errors: [] };
}

export function persistedRecordToPassalongRecord(
  record: PersistedPassalongRecord,
): PassalongRecord {
  return {
    passalongId: record.passalongId,
    sourceThread: record.sourceThreadId,
    targetThread: record.targetThreadId,
    scope: record.scope,
    mode: record.mode,
    summary: record.summary,
    evidencePointers: record.evidencePointers,
    requestedDecision: record.requestedDecision,
    status: record.routeStatus,
    createdTimestamp: record.createdAt,
    authorityBoundary: record.authorityBoundary,
    nonAuthorizations: record.nonAuthorizations,
    sandboxTargetId: record.sandboxPosture ? "sandbox-nexus" : undefined,
    sandboxImportAdoptionPosture: record.importAdoptionPosture ?? undefined,
    sandboxOutputInvolved: Boolean(record.importAdoptionPosture),
  };
}

function getThreadLabel(threadId: ControlThreadId): string {
  return (
    THREAD_MEMORY_RECORDS.find((record) => record.threadId === threadId)
      ?.threadLabel ?? threadId
  );
}

function readThreadId(
  value: unknown,
  field: string,
): BoundaryValidationResult<ControlThreadId> {
  if (
    typeof value === "string" &&
    THREAD_MEMORY_RECORDS.some((record) => record.threadId === value)
  ) {
    return { ok: true, value: value as ControlThreadId, errors: [] };
  }
  return fail(`${field} must be a known control-thread id.`);
}

function readRouteStatus(
  value: unknown,
): BoundaryValidationResult<PassalongRouteStatus> {
  if (
    typeof value === "string" &&
    PASSALONG_ROUTE_STATUSES.includes(value as PassalongRouteStatus)
  ) {
    return { ok: true, value: value as PassalongRouteStatus, errors: [] };
  }
  return fail("routeStatus must use the A16 bounded status vocabulary.");
}

function readArchiveState(
  value: unknown,
): BoundaryValidationResult<PassalongArchiveState> {
  if (
    typeof value === "string" &&
    PASSALONG_ARCHIVE_STATES.includes(value as PassalongArchiveState)
  ) {
    return { ok: true, value: value as PassalongArchiveState, errors: [] };
  }
  return fail("archiveState must be active, archived, or marked_for_delete.");
}

function readRedactionState(
  value: unknown,
): BoundaryValidationResult<PassalongRedactionState> {
  if (
    typeof value === "string" &&
    PASSALONG_REDACTION_STATES.includes(value as PassalongRedactionState)
  ) {
    return { ok: true, value: value as PassalongRedactionState, errors: [] };
  }
  return fail("redactionState must use the bounded redaction-state vocabulary.");
}

function readImportAdoptionPosture(
  value: unknown,
): BoundaryValidationResult<SandboxImportAdoptionPosture | null> {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null, errors: [] };
  }
  if (
    typeof value === "string" &&
    SANDBOX_IMPORT_ADOPTION_POSTURES.includes(
      value as SandboxImportAdoptionPosture,
    )
  ) {
    return {
      ok: true,
      value: value as SandboxImportAdoptionPosture,
      errors: [],
    };
  }
  return fail("importAdoptionPosture must use the bounded posture vocabulary.");
}

function constrainedText(
  value: unknown,
  limit: number,
  field: string,
): BoundaryValidationResult<string> {
  if (typeof value !== "string") {
    return fail(`${field} must be text.`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return fail(`${field} must not be empty.`);
  }
  if (trimmed.length > limit) {
    return fail(`${field} exceeds ${limit} characters.`);
  }
  return { ok: true, value: trimmed, errors: [] };
}

function nullableConstrainedText(
  value: unknown,
  limit: number,
  field: string,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const result = constrainedText(value, limit, field);
  return result.ok ? result.value ?? null : null;
}

function constrainStringArray(
  value: unknown,
  limit: number,
  field: string,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.slice(0, limit))
    .slice(0, 24)
    .map((item, index) =>
      item.length > limit
        ? `${field}[${index}] exceeded ${limit} characters and was truncated.`
        : item,
    );
}

function collectTextValidationErrors(
  entries: readonly (readonly [string, string | null])[],
): string[] {
  return entries.flatMap(([field, value]) => {
    if (!value) return [];
    if (SECRET_RISK_PATTERNS.some((pattern) => pattern.test(value))) {
      return [
        `${field} contains secret-risk or excluded content. Redact before saving.`,
      ];
    }
    return [];
  });
}

function fail<T = never>(message: string): BoundaryValidationResult<T> {
  return { ok: false, errors: [message] };
}

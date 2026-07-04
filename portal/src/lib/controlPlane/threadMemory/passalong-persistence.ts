import "server-only";

import {
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  PASSALONG_PERSISTENCE_SCHEMA_VERSION,
  type PersistedPassalongPatchInput,
  validatePersistedPassalongCreateInput,
  validatePersistedPassalongPatchInput,
} from "./passalong-persistence-boundary";
import type {
  ControlThreadId,
  PassalongArchiveState,
  PassalongPersistenceStatus,
  PassalongRedactionState,
  PassalongRouteStatus,
  PersistedPassalongRecord,
  SandboxImportAdoptionPosture,
} from "./types";

type PassalongPersistenceRow = {
  id: string;
  passalong_id: string;
  source_thread_id: string;
  target_thread_id: string;
  source_thread_label: string;
  target_thread_label: string;
  scope: string;
  mode: string;
  summary: string;
  evidence_pointers: unknown;
  requested_decision: string;
  route_status: string;
  created_at: Date;
  updated_at: Date;
  authority_boundary: string;
  non_authorizations: unknown;
  sandbox_posture: string | null;
  import_adoption_posture: string | null;
  manual_operator_note: string | null;
  archive_state: string;
  archived_at: Date | null;
  deleted_at: Date | null;
  redaction_state: string;
  schema_version: string;
};

export interface PassalongPersistenceListResult
  extends PassalongPersistenceStatus {
  records: PersistedPassalongRecord[];
}

export interface PassalongPersistenceWriteResult
  extends PassalongPersistenceStatus {
  record: PersistedPassalongRecord | null;
  errors: string[];
}

export async function listPersistedPassalongRecords(
  limit = 25,
): Promise<PassalongPersistenceListResult> {
  try {
    const prisma = await loadPrisma();
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const rows = await prisma.$queryRaw<PassalongPersistenceRow[]>`
      SELECT
        "id",
        "passalong_id",
        "source_thread_id",
        "target_thread_id",
        "source_thread_label",
        "target_thread_label",
        "scope",
        "mode",
        "summary",
        "evidence_pointers",
        "requested_decision",
        "route_status",
        "created_at",
        "updated_at",
        "authority_boundary",
        "non_authorizations",
        "sandbox_posture",
        "import_adoption_posture",
        "manual_operator_note",
        "archive_state",
        "archived_at",
        "deleted_at",
        "redaction_state",
        "schema_version"
      FROM "control_thread_passalong_records"
      ORDER BY "created_at" DESC
      LIMIT ${safeLimit}
    `;

    return {
      available: true,
      safeMessage:
        "App-local passalong persistence is available; records remain non-authoritative.",
      nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
      records: rows.map(rowToRecord),
    };
  } catch {
    return unavailableListResult();
  }
}

export async function persistPassalongRecord(
  input: unknown,
): Promise<PassalongPersistenceWriteResult> {
  const validation = validatePersistedPassalongCreateInput(input);
  if (!validation.ok || !validation.value) {
    return validationBlockedResult(validation.errors);
  }

  const record = validation.value;

  try {
    const prisma = await loadPrisma();
    const id = `control-thread-passalong-${crypto.randomUUID()}`;
    const insertedRows = await prisma.$queryRaw<PassalongPersistenceRow[]>`
      INSERT INTO "control_thread_passalong_records" (
        "id",
        "passalong_id",
        "source_thread_id",
        "target_thread_id",
        "source_thread_label",
        "target_thread_label",
        "scope",
        "mode",
        "summary",
        "evidence_pointers",
        "requested_decision",
        "route_status",
        "authority_boundary",
        "non_authorizations",
        "sandbox_posture",
        "import_adoption_posture",
        "manual_operator_note",
        "archive_state",
        "archived_at",
        "deleted_at",
        "redaction_state",
        "schema_version"
      )
      VALUES (
        ${id},
        ${record.passalongId},
        ${record.sourceThreadId},
        ${record.targetThreadId},
        ${record.sourceThreadLabel},
        ${record.targetThreadLabel},
        ${record.scope},
        ${record.mode},
        ${record.summary},
        ${JSON.stringify(record.evidencePointers)}::jsonb,
        ${record.requestedDecision},
        ${record.routeStatus},
        ${record.authorityBoundary},
        ${JSON.stringify(record.nonAuthorizations)}::jsonb,
        ${record.sandboxPosture},
        ${record.importAdoptionPosture},
        ${record.manualOperatorNote},
        ${record.archiveState},
        ${record.archivedAt ? new Date(record.archivedAt) : null},
        ${record.deletedAt ? new Date(record.deletedAt) : null},
        ${record.redactionState},
        ${PASSALONG_PERSISTENCE_SCHEMA_VERSION}
      )
      ON CONFLICT ("passalong_id") DO UPDATE SET
        "source_thread_id" = EXCLUDED."source_thread_id",
        "target_thread_id" = EXCLUDED."target_thread_id",
        "source_thread_label" = EXCLUDED."source_thread_label",
        "target_thread_label" = EXCLUDED."target_thread_label",
        "scope" = EXCLUDED."scope",
        "mode" = EXCLUDED."mode",
        "summary" = EXCLUDED."summary",
        "evidence_pointers" = EXCLUDED."evidence_pointers",
        "requested_decision" = EXCLUDED."requested_decision",
        "route_status" = EXCLUDED."route_status",
        "updated_at" = CURRENT_TIMESTAMP,
        "authority_boundary" = EXCLUDED."authority_boundary",
        "non_authorizations" = EXCLUDED."non_authorizations",
        "sandbox_posture" = EXCLUDED."sandbox_posture",
        "import_adoption_posture" = EXCLUDED."import_adoption_posture",
        "manual_operator_note" = EXCLUDED."manual_operator_note",
        "archive_state" = EXCLUDED."archive_state",
        "archived_at" = EXCLUDED."archived_at",
        "deleted_at" = EXCLUDED."deleted_at",
        "redaction_state" = EXCLUDED."redaction_state",
        "schema_version" = EXCLUDED."schema_version"
      RETURNING *
    `;

    return {
      available: true,
      safeMessage:
        "App-local passalong record saved. It remains non-authoritative.",
      nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
      record: insertedRows[0] ? rowToRecord(insertedRows[0]) : null,
      errors: [],
    };
  } catch {
    return {
      available: false,
      safeMessage:
        "Passalong persistence is unavailable; no database write was completed.",
      nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
      record: null,
      errors: ["Persistence table or database access is unavailable."],
    };
  }
}

export async function updatePersistedPassalongRecord(
  passalongId: string,
  input: unknown,
): Promise<PassalongPersistenceWriteResult> {
  const validation = validatePersistedPassalongPatchInput(input);
  if (!validation.ok || !validation.value) {
    return validationBlockedResult(validation.errors);
  }

  try {
    const existing = await findPersistedPassalongRecord(passalongId);
    if (!existing) {
      return validationBlockedResult([
        "No persisted app-local passalong record exists for this id.",
      ]);
    }

    const now = new Date().toISOString();
    const patch = validation.value;
    const next = mergePatch(existing, patch, now);
    const prisma = await loadPrisma();
    const rows = await prisma.$queryRaw<PassalongPersistenceRow[]>`
      UPDATE "control_thread_passalong_records"
      SET
        "scope" = ${next.scope},
        "mode" = ${next.mode},
        "summary" = ${next.summary},
        "evidence_pointers" = ${JSON.stringify(next.evidencePointers)}::jsonb,
        "requested_decision" = ${next.requestedDecision},
        "route_status" = ${next.routeStatus},
        "updated_at" = CURRENT_TIMESTAMP,
        "authority_boundary" = ${next.authorityBoundary},
        "non_authorizations" = ${JSON.stringify(next.nonAuthorizations)}::jsonb,
        "sandbox_posture" = ${next.sandboxPosture},
        "import_adoption_posture" = ${next.importAdoptionPosture},
        "manual_operator_note" = ${next.manualOperatorNote},
        "archive_state" = ${next.archiveState},
        "archived_at" = ${next.archivedAt ? new Date(next.archivedAt) : null},
        "deleted_at" = ${next.deletedAt ? new Date(next.deletedAt) : null},
        "redaction_state" = ${next.redactionState},
        "schema_version" = ${PASSALONG_PERSISTENCE_SCHEMA_VERSION}
      WHERE "passalong_id" = ${passalongId}
      RETURNING *
    `;

    return {
      available: true,
      safeMessage:
        "App-local passalong record metadata updated. It remains non-authoritative.",
      nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
      record: rows[0] ? rowToRecord(rows[0]) : null,
      errors: [],
    };
  } catch {
    return {
      available: false,
      safeMessage:
        "Passalong persistence update is unavailable; no database write was completed.",
      nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
      record: null,
      errors: ["Persistence table or database access is unavailable."],
    };
  }
}

async function findPersistedPassalongRecord(
  passalongId: string,
): Promise<PersistedPassalongRecord | null> {
  const prisma = await loadPrisma();
  const rows = await prisma.$queryRaw<PassalongPersistenceRow[]>`
    SELECT
      "id",
      "passalong_id",
      "source_thread_id",
      "target_thread_id",
      "source_thread_label",
      "target_thread_label",
      "scope",
      "mode",
      "summary",
      "evidence_pointers",
      "requested_decision",
      "route_status",
      "created_at",
      "updated_at",
      "authority_boundary",
      "non_authorizations",
      "sandbox_posture",
      "import_adoption_posture",
      "manual_operator_note",
      "archive_state",
      "archived_at",
      "deleted_at",
      "redaction_state",
      "schema_version"
    FROM "control_thread_passalong_records"
    WHERE "passalong_id" = ${passalongId}
    LIMIT 1
  `;
  return rows[0] ? rowToRecord(rows[0]) : null;
}

function mergePatch(
  existing: PersistedPassalongRecord,
  patch: PersistedPassalongPatchInput,
  now: string,
): PersistedPassalongRecord {
  const archiveState = patch.archiveState ?? existing.archiveState;
  return {
    ...existing,
    ...patch,
    archiveState,
    archivedAt:
      archiveState === "archived"
        ? existing.archivedAt ?? now
        : archiveState === "active"
          ? null
          : existing.archivedAt,
    deletedAt:
      archiveState === "marked_for_delete"
        ? existing.deletedAt ?? now
        : archiveState === "active"
          ? null
          : existing.deletedAt,
    updatedAt: now,
    schemaVersion: PASSALONG_PERSISTENCE_SCHEMA_VERSION,
  };
}

function rowToRecord(row: PassalongPersistenceRow): PersistedPassalongRecord {
  return {
    id: row.id,
    passalongId: row.passalong_id,
    sourceThreadId: readThreadId(row.source_thread_id),
    targetThreadId: readThreadId(row.target_thread_id),
    sourceThreadLabel: row.source_thread_label,
    targetThreadLabel: row.target_thread_label,
    scope: row.scope,
    mode: row.mode,
    summary: row.summary,
    evidencePointers: readStringArray(row.evidence_pointers),
    requestedDecision: row.requested_decision,
    routeStatus: readRouteStatus(row.route_status),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    authorityBoundary: row.authority_boundary,
    nonAuthorizations: readStringArray(row.non_authorizations),
    sandboxPosture: row.sandbox_posture,
    importAdoptionPosture: readImportAdoptionPosture(row.import_adoption_posture),
    manualOperatorNote: row.manual_operator_note,
    archiveState: readArchiveState(row.archive_state),
    archivedAt: row.archived_at?.toISOString() ?? null,
    deletedAt: row.deleted_at?.toISOString() ?? null,
    redactionState: readRedactionState(row.redaction_state),
    schemaVersion: PASSALONG_PERSISTENCE_SCHEMA_VERSION,
  };
}

async function loadPrisma() {
  const prismaModule = await import("@/lib/prisma");
  return prismaModule.prisma;
}

function unavailableListResult(): PassalongPersistenceListResult {
  return {
    available: false,
    safeMessage:
      "App-local passalong persistence is unavailable; static sample records remain visible as fallback only.",
    nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
    records: [],
  };
}

function validationBlockedResult(
  errors: string[],
): PassalongPersistenceWriteResult {
  return {
    available: false,
    safeMessage:
      "Passalong persistence blocked by field-boundary validation; no record was saved.",
    nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
    record: null,
    errors,
  };
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function readThreadId(value: string): ControlThreadId {
  if (
    value === "thread-control-thread" ||
    value === "thread-exploration" ||
    value === "thread-dev-jai-nexus" ||
    value === "thread-sandbox-nexus" ||
    value === "thread-repo-generic" ||
    value === "thread-future-jai-agent-slot"
  ) {
    return value;
  }
  return "thread-control-thread";
}

function readRouteStatus(value: string): PassalongRouteStatus {
  if (
    value === "draft" ||
    value === "queued" ||
    value === "needs_review" ||
    value === "recommended" ||
    value === "approved_for_manual_passalong" ||
    value === "sent_manually" ||
    value === "held" ||
    value === "rejected" ||
    value === "archived"
  ) {
    return value;
  }
  return "draft";
}

function readArchiveState(value: string): PassalongArchiveState {
  if (
    value === "active" ||
    value === "archived" ||
    value === "marked_for_delete"
  ) {
    return value;
  }
  return "active";
}

function readRedactionState(value: string): PassalongRedactionState {
  if (
    value === "not_required" ||
    value === "pending_review" ||
    value === "redacted" ||
    value === "blocked_secret_risk"
  ) {
    return value;
  }
  return "not_required";
}

function readImportAdoptionPosture(
  value: string | null,
): SandboxImportAdoptionPosture | null {
  if (
    value === "discard" ||
    value === "archive" ||
    value === "iterate" ||
    value === "keep_as_example" ||
    value === "promote_to_import_candidate"
  ) {
    return value;
  }
  return null;
}

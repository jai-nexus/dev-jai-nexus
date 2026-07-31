import "server-only";

import {
  ProgramActivationSupersessionConcurrencyConflictError,
  ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError,
  ProgramTransitionReceiptRollbackConfirmedConflictError,
  createProgramActivationSupersessionService,
  type ProgramActivationSupersessionResult,
} from "./program-activation-supersession-boundary";
import type { ProgramLifecycleState } from "./one-active-program-invariant";
import type { ProgramTransitionReceiptSetDraft } from "./program-transition-receipt-boundary";

type ProgramLifecycleSqlRow = { program_id: string; program_code: string; program_title: string | null; lifecycle_state: string; lifecycle_version: number; created_at: Date; updated_at: Date };
type ProgramTransitionCommandSqlRow = { command_id: string; idempotency_key_hash: string; request_fingerprint: string; fingerprint_version: string; candidate_program_id: string; operation_kind: string; superseded_program_id: string | null; expected_receipt_count: number; created_at: Date };
type ProgramTransitionReceiptSqlRow = { receipt_id: string; command_id: string; receipt_ordinal: number; receipt_class_id: string; receipt_class_name: string; transition_id: string; lifecycle_axis_id: string; subject_program_id: string; source_state: string; result_state: string; source_lifecycle_version: number; result_lifecycle_version: number; issuance_state: string; integrity_state: string; authenticity_state: string; issuer_authority_state: string; created_at: Date };

const PROGRAM_LIFECYCLE_SELECT = `SELECT "program_id", "program_code", "program_title", "lifecycle_state", "lifecycle_version", "created_at", "updated_at" FROM "program_lifecycle_records"`;
const COMMAND_SELECT = `SELECT "command_id", "idempotency_key_hash", "request_fingerprint", "fingerprint_version", "candidate_program_id", "operation_kind", "superseded_program_id", "expected_receipt_count", "created_at" FROM "program_transition_commands"`;
const RECEIPT_SELECT = `SELECT "receipt_id", "command_id", "receipt_ordinal", "receipt_class_id", "receipt_class_name", "transition_id", "lifecycle_axis_id", "subject_program_id", "source_state", "result_state", "source_lifecycle_version", "result_lifecycle_version", "issuance_state", "integrity_state", "authenticity_state", "issuer_authority_state", "created_at" FROM "program_lifecycle_transition_receipts"`;

function lifecycleRecord(row: ProgramLifecycleSqlRow) { return { programId: row.program_id, programCode: row.program_code, programTitle: row.program_title, lifecycleState: row.lifecycle_state, lifecycleVersion: row.lifecycle_version, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() }; }
function commandRecord(row: ProgramTransitionCommandSqlRow) { return { commandId: row.command_id, idempotencyKeyHash: row.idempotency_key_hash, requestFingerprint: row.request_fingerprint, fingerprintVersion: row.fingerprint_version, candidateProgramId: row.candidate_program_id, operationKind: row.operation_kind, supersededProgramId: row.superseded_program_id, expectedReceiptCount: row.expected_receipt_count, createdAt: row.created_at.toISOString() }; }
function receiptRecord(row: ProgramTransitionReceiptSqlRow) { return { receiptId: row.receipt_id, commandId: row.command_id, receiptOrdinal: row.receipt_ordinal, receiptClassId: row.receipt_class_id, receiptClassName: row.receipt_class_name, transitionId: row.transition_id, lifecycleAxisId: row.lifecycle_axis_id, subjectProgramId: row.subject_program_id, sourceState: row.source_state, resultState: row.result_state, sourceLifecycleVersion: row.source_lifecycle_version, resultLifecycleVersion: row.result_lifecycle_version, issuanceState: row.issuance_state, integrityState: row.integrity_state, authenticityState: row.authenticity_state, issuerAuthorityState: row.issuer_authority_state, createdAt: row.created_at.toISOString() }; }
function unique(error: unknown): boolean { return typeof error === "object" && error !== null && ((error as { code?: unknown }).code === "P2002" || (error as { meta?: { code?: unknown } }).meta?.code === "23505"); }
async function loadPrisma() { const { Prisma, prisma } = await import("../../prisma"); return { Prisma, prisma }; }

function createServerProgramActivationSupersessionService() {
  return createProgramActivationSupersessionService({
    async transaction(operation) {
      const { Prisma, prisma } = await loadPrisma();
      try {
        return await prisma.$transaction(async (transaction) => operation({
          async listLockedProgramLifecycleRecords() {
            const rows = await transaction.$queryRaw<ProgramLifecycleSqlRow[]>(Prisma.sql`${Prisma.raw(PROGRAM_LIFECYCLE_SELECT)} ORDER BY "program_id" ASC FOR UPDATE`);
            return rows.map(lifecycleRecord);
          },
          async findProgramTransitionReceiptSetByIdempotencyKeyHash(keyHash: string) {
            const commands = await transaction.$queryRaw<ProgramTransitionCommandSqlRow[]>(Prisma.sql`${Prisma.raw(COMMAND_SELECT)} WHERE "idempotency_key_hash" = ${keyHash} FOR UPDATE`);
            if (commands.length === 0) return null;
            if (commands.length !== 1) return commands;
            const receipts = await transaction.$queryRaw<ProgramTransitionReceiptSqlRow[]>(Prisma.sql`${Prisma.raw(RECEIPT_SELECT)} WHERE "command_id" = ${commands[0].command_id} ORDER BY "receipt_ordinal" ASC FOR UPDATE`);
            return { command: commandRecord(commands[0]), receipts: receipts.map(receiptRecord) };
          },
          async setProgramLifecycleState(programId: string, expectedLifecycleState: ProgramLifecycleState, expectedLifecycleVersion: number, lifecycleState: ProgramLifecycleState) {
            const rows = await transaction.$queryRaw<ProgramLifecycleSqlRow[]>(Prisma.sql`
              UPDATE "program_lifecycle_records" SET "lifecycle_state" = ${lifecycleState}, "lifecycle_version" = "lifecycle_version" + 1, "updated_at" = CURRENT_TIMESTAMP
              WHERE "program_id" = ${programId} AND "lifecycle_state" = ${expectedLifecycleState} AND "lifecycle_version" = ${expectedLifecycleVersion}
              RETURNING "program_id", "program_code", "program_title", "lifecycle_state", "lifecycle_version", "created_at", "updated_at"`);
            if (rows.length !== 1) throw new ProgramActivationSupersessionConcurrencyConflictError();
          },
          async insertProgramTransitionReceiptSet(receiptSet: ProgramTransitionReceiptSetDraft) {
            const commands = await transaction.$queryRaw<ProgramTransitionCommandSqlRow[]>(Prisma.sql`
              INSERT INTO "program_transition_commands" ("command_id", "idempotency_key_hash", "request_fingerprint", "fingerprint_version", "candidate_program_id", "operation_kind", "superseded_program_id", "expected_receipt_count")
              VALUES (${receiptSet.command.commandId}, ${receiptSet.command.idempotencyKeyHash}, ${receiptSet.command.requestFingerprint}, ${receiptSet.command.fingerprintVersion}, ${receiptSet.command.candidateProgramId}, ${receiptSet.command.operationKind}, ${receiptSet.command.supersededProgramId}, ${receiptSet.command.expectedReceiptCount})
              RETURNING "command_id", "idempotency_key_hash", "request_fingerprint", "fingerprint_version", "candidate_program_id", "operation_kind", "superseded_program_id", "expected_receipt_count", "created_at"`);
            if (commands.length !== 1) return commands;
            const inserted: ProgramTransitionReceiptSqlRow[] = [];
            for (const receipt of receiptSet.receipts) {
              const rows = await transaction.$queryRaw<ProgramTransitionReceiptSqlRow[]>(Prisma.sql`
                INSERT INTO "program_lifecycle_transition_receipts" ("receipt_id", "command_id", "receipt_ordinal", "receipt_class_id", "receipt_class_name", "transition_id", "lifecycle_axis_id", "subject_program_id", "source_state", "result_state", "source_lifecycle_version", "result_lifecycle_version", "issuance_state", "integrity_state", "authenticity_state", "issuer_authority_state")
                VALUES (${receipt.receiptId}, ${receipt.commandId}, ${receipt.receiptOrdinal}, ${receipt.receiptClassId}, ${receipt.receiptClassName}, ${receipt.transitionId}, ${receipt.lifecycleAxisId}, ${receipt.subjectProgramId}, ${receipt.sourceState}, ${receipt.resultState}, ${receipt.sourceLifecycleVersion}, ${receipt.resultLifecycleVersion}, ${receipt.issuanceState}, ${receipt.integrityState}, ${receipt.authenticityState}, ${receipt.issuerAuthorityState})
                RETURNING "receipt_id", "command_id", "receipt_ordinal", "receipt_class_id", "receipt_class_name", "transition_id", "lifecycle_axis_id", "subject_program_id", "source_state", "result_state", "source_lifecycle_version", "result_lifecycle_version", "issuance_state", "integrity_state", "authenticity_state", "issuer_authority_state", "created_at"`);
              if (rows.length !== 1) return rows;
              inserted.push(rows[0]);
            }
            return { command: commandRecord(commands[0]), receipts: inserted.map(receiptRecord) };
          },
        }));
      } catch (error) {
        if (error instanceof ProgramActivationSupersessionConcurrencyConflictError) throw new ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError();
        if (unique(error)) throw new ProgramTransitionReceiptRollbackConfirmedConflictError();
        throw error;
      }
    },
  });
}

export async function executeProgramActivationSupersession(input: unknown): Promise<ProgramActivationSupersessionResult> { return createServerProgramActivationSupersessionService().execute(input); }

import "server-only";

import {
  ProgramActivationSupersessionConcurrencyConflictError,
  ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError,
  createProgramActivationSupersessionService,
  type ProgramActivationSupersessionResult,
} from "./program-activation-supersession-boundary";
import type { ProgramLifecycleState } from "./one-active-program-invariant";

type ProgramLifecycleSqlRow = {
  program_id: string;
  program_code: string;
  program_title: string | null;
  lifecycle_state: string;
  lifecycle_version: number;
  created_at: Date;
  updated_at: Date;
};

const PROGRAM_LIFECYCLE_SELECT = `
  SELECT
    "program_id",
    "program_code",
    "program_title",
    "lifecycle_state",
    "lifecycle_version",
    "created_at",
    "updated_at"
  FROM "program_lifecycle_records"
`;

function rowToBoundaryRecord(row: ProgramLifecycleSqlRow) {
  return {
    programId: row.program_id,
    programCode: row.program_code,
    programTitle: row.program_title,
    lifecycleState: row.lifecycle_state,
    lifecycleVersion: row.lifecycle_version,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function loadPrisma() {
  const { Prisma, prisma } = await import("../../prisma");
  return { Prisma, prisma };
}

function createServerProgramActivationSupersessionService() {
  return createProgramActivationSupersessionService({
    async transaction(operation) {
      const { Prisma, prisma } = await loadPrisma();
      try {
        return await prisma.$transaction(async (transaction) =>
          operation({
            async listLockedProgramLifecycleRecords() {
              const rows = await transaction.$queryRaw<ProgramLifecycleSqlRow[]>(
                Prisma.sql`${Prisma.raw(PROGRAM_LIFECYCLE_SELECT)} ORDER BY "program_id" ASC FOR UPDATE`,
              );
              return rows.map(rowToBoundaryRecord);
            },

            async setProgramLifecycleState(
              programId: string,
              expectedLifecycleState: ProgramLifecycleState,
              expectedLifecycleVersion: number,
              lifecycleState: ProgramLifecycleState,
            ) {
              const rows = await transaction.$queryRaw<ProgramLifecycleSqlRow[]>(
                Prisma.sql`
                  UPDATE "program_lifecycle_records"
                  SET
                    "lifecycle_state" = ${lifecycleState},
                    "lifecycle_version" = "lifecycle_version" + 1,
                    "updated_at" = CURRENT_TIMESTAMP
                  WHERE
                    "program_id" = ${programId} AND
                    "lifecycle_state" = ${expectedLifecycleState} AND
                    "lifecycle_version" = ${expectedLifecycleVersion}
                  RETURNING
                    "program_id",
                    "program_code",
                    "program_title",
                    "lifecycle_state",
                    "lifecycle_version",
                    "created_at",
                    "updated_at"
                `,
              );
              if (rows.length !== 1) {
                throw new ProgramActivationSupersessionConcurrencyConflictError();
              }
            },
          }),
        );
      } catch (error) {
        if (error instanceof ProgramActivationSupersessionConcurrencyConflictError) {
          throw new ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError();
        }
        throw error;
      }
    },
  });
}

export async function executeProgramActivationSupersession(
  input: unknown,
): Promise<ProgramActivationSupersessionResult> {
  return createServerProgramActivationSupersessionService().execute(input);
}

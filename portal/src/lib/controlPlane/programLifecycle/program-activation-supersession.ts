import "server-only";

import {
  createProgramActivationSupersessionService,
  type ProgramActivationSupersessionResult,
} from "./program-activation-supersession-boundary";
import type { ProgramLifecycleState } from "./one-active-program-invariant";

type ProgramLifecycleSqlRow = {
  program_id: string;
  program_code: string;
  program_title: string | null;
  lifecycle_state: string;
  created_at: Date;
  updated_at: Date;
};

const PROGRAM_LIFECYCLE_SELECT = `
  SELECT
    "program_id",
    "program_code",
    "program_title",
    "lifecycle_state",
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
      return prisma.$transaction(async (transaction) =>
        operation({
          async listLockedProgramLifecycleRecords() {
            const rows = await transaction.$queryRaw<ProgramLifecycleSqlRow[]>(
              Prisma.sql`${Prisma.raw(PROGRAM_LIFECYCLE_SELECT)} ORDER BY "program_id" ASC FOR UPDATE`,
            );
            return rows.map(rowToBoundaryRecord);
          },

          async setProgramLifecycleState(
            programId: string,
            lifecycleState: ProgramLifecycleState,
          ) {
            const rows = await transaction.$queryRaw<ProgramLifecycleSqlRow[]>(
              Prisma.sql`
                UPDATE "program_lifecycle_records"
                SET
                  "lifecycle_state" = ${lifecycleState},
                  "updated_at" = CURRENT_TIMESTAMP
                WHERE "program_id" = ${programId}
                RETURNING
                  "program_id",
                  "program_code",
                  "program_title",
                  "lifecycle_state",
                  "created_at",
                  "updated_at"
              `,
            );
            if (rows.length !== 1) {
              throw new Error("Program lifecycle row was not uniquely updated.");
            }
          },
        }),
      );
    },
  });
}

export async function executeProgramActivationSupersession(
  input: unknown,
): Promise<ProgramActivationSupersessionResult> {
  return createServerProgramActivationSupersessionService().execute(input);
}

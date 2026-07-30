import "server-only";

import {
  createProgramLifecyclePersistenceService,
  type InitialProgramLifecycleRecord,
  type ProgramLifecyclePersistenceFindResult,
  type ProgramLifecyclePersistenceInsertResult,
  type ProgramLifecyclePersistenceListResult,
} from "./program-lifecycle-persistence-boundary";

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

function createServerPersistenceService() {
  return createProgramLifecyclePersistenceService({
    async list() {
      const { Prisma, prisma } = await loadPrisma();
      const rows = await prisma.$queryRaw<ProgramLifecycleSqlRow[]>(
        Prisma.sql`${Prisma.raw(PROGRAM_LIFECYCLE_SELECT)} ORDER BY "program_id" ASC`,
      );
      return rows.map(rowToBoundaryRecord);
    },

    async findByProgramId(programId: string) {
      const { Prisma, prisma } = await loadPrisma();
      const rows = await prisma.$queryRaw<ProgramLifecycleSqlRow[]>(
        Prisma.sql`${Prisma.raw(PROGRAM_LIFECYCLE_SELECT)} WHERE "program_id" = ${programId} LIMIT 1`,
      );
      return rows[0] ? rowToBoundaryRecord(rows[0]) : null;
    },

    async insertInitialProgram(record: InitialProgramLifecycleRecord) {
      const { Prisma, prisma } = await loadPrisma();
      const rows = await prisma.$queryRaw<ProgramLifecycleSqlRow[]>(
        Prisma.sql`
          INSERT INTO "program_lifecycle_records" (
            "program_id",
            "program_code",
            "program_title",
            "lifecycle_state"
          )
          VALUES (
            ${record.programId},
            ${record.programCode},
            ${record.programTitle},
            ${record.lifecycleState}
          )
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
      return rows[0] ? rowToBoundaryRecord(rows[0]) : null;
    },
  });
}

export async function listPersistedProgramLifecycleRecords(): Promise<ProgramLifecyclePersistenceListResult> {
  return createServerPersistenceService().list();
}

export async function findPersistedProgramLifecycleRecord(
  programId: unknown,
): Promise<ProgramLifecyclePersistenceFindResult> {
  return createServerPersistenceService().findByProgramId(programId);
}

export async function insertInitialProgramLifecycleRecord(
  input: unknown,
): Promise<ProgramLifecyclePersistenceInsertResult> {
  return createServerPersistenceService().insertInitialProgram(input);
}

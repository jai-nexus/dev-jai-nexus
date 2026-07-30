import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import {
  PROGRAM_LIFECYCLE_STATES,
  type ProgramLifecycleState,
} from "./one-active-program-invariant";
import {
  ProgramLifecyclePersistenceConflictError,
  ProgramLifecyclePersistenceUnavailableError,
  createProgramLifecyclePersistenceService,
  validateInitialProgramLifecycleCreateInput,
  validatePersistedProgramLifecycleRecord,
  type InitialProgramLifecycleRecord,
  type PersistedProgramLifecycleRecord,
  type ProgramLifecyclePersistenceAdapter,
} from "./program-lifecycle-persistence-boundary";

const PROGRAM_ID = "jai-governance-intelligence-main-state-operating-loop-v0";
const PROGRAM_CODE = "Q3M7Y26-P1";
const CREATED_AT = "2026-07-30T04:00:00.000Z";
const UPDATED_AT = "2026-07-30T04:00:00.000Z";

function createInput(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    programId: PROGRAM_ID,
    programCode: PROGRAM_CODE,
    programTitle: "Program One",
    ...overrides,
  };
}

function persistedRecord(
  overrides: Partial<PersistedProgramLifecycleRecord> = {},
): PersistedProgramLifecycleRecord {
  return {
    programId: PROGRAM_ID,
    programCode: PROGRAM_CODE,
    programTitle: "Program One",
    lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
    lifecycleVersion: 0,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    ...overrides,
  };
}

function createFakeAdapter(initialRows: unknown[] = []) {
  const rows = [...initialRows];
  const inserted: InitialProgramLifecycleRecord[] = [];
  const adapter: ProgramLifecyclePersistenceAdapter = {
    async list() {
      return rows;
    },
    async findByProgramId(programId: string) {
      return (
        rows.find(
          (row) =>
            typeof row === "object" &&
            row !== null &&
            !Array.isArray(row) &&
            Object.getOwnPropertyDescriptor(row, "programId")?.value === programId,
        ) ?? null
      );
    },
    async insertInitialProgram(record: InitialProgramLifecycleRecord) {
      inserted.push(record);
      const row = persistedRecord({
        programId: record.programId,
        programCode: record.programCode,
        programTitle: record.programTitle,
        lifecycleState: record.lifecycleState,
      });
      rows.push(row);
      return row;
    },
  };
  return { adapter, inserted, rows };
}

function expectInvalidCreateInput(value: unknown) {
  assert.equal(validateInitialProgramLifecycleCreateInput(value), null);
}

function testExactC1LifecycleReuse() {
  assert.deepEqual(PROGRAM_LIFECYCLE_STATES, [
    "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
    "OPEN_FOR_BATCH_PLANNING_ONLY",
    "UNRESOLVED_HOLD",
    "CLOSED_ACCEPTED",
    "CLOSED_NO_GO",
    "CANCELLED",
    "FAILED",
  ]);
  assert.equal(PROGRAM_LIFECYCLE_STATES.length, 7);
}

function testSchemaAndMigrationContracts() {
  const schema = readFileSync(
    new URL("../../../../prisma/schema.prisma", import.meta.url),
    "utf8",
  );
  const migration = readFileSync(
    new URL(
      "../../../../prisma/migrations/20260730040000_add_program_lifecycle_persistence/migration.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const versionMigration = readFileSync(
    new URL(
      "../../../../prisma/migrations/20260730070000_add_program_lifecycle_version/migration.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const expectedStates = [...PROGRAM_LIFECYCLE_STATES];
  const prismaEnum = schema.match(
    /enum PersistedProgramLifecycleState \{([\s\S]*?)\n\}/,
  )?.[1];
  const model = schema.match(/model ProgramLifecycleRecord \{([\s\S]*?)\n\}/)?.[1];
  const migrationEnum = migration.match(
    /CREATE TYPE "program_lifecycle_state" AS ENUM \(([\s\S]*?)\);/,
  )?.[1];

  assert.ok(prismaEnum);
  assert.ok(model);
  assert.ok(migrationEnum);
  const prismaStates = prismaEnum
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[A-Z]/.test(line))
    .map((line) => line.match(/@map\("([^"]+)"\)/)?.[1] ?? line.split(/\s+/)[0]);
  const migrationStates = migrationEnum.match(/'([^']+)'/g)?.map((value) =>
    value.slice(1, -1),
  );
  const modelFields = model
    .split("\n")
    .filter((line) => /^  [a-z]/.test(line))
    .map((line) => line.trim().replace(/\s+/g, " "));

  assert.deepEqual(prismaStates, expectedStates);
  assert.deepEqual(migrationStates, expectedStates);
  assert.deepEqual(
    modelFields,
    [
      'programId String @id @map("program_id")',
      'programCode String @unique @map("program_code")',
      'programTitle String? @map("program_title")',
      'lifecycleState PersistedProgramLifecycleState @default(NOT_ROUTED_NOT_OPEN_DOWNSTREAM_FROZEN) @map("lifecycle_state")',
      'lifecycleVersion Int @default(0) @map("lifecycle_version")',
      'createdAt DateTime @default(now()) @map("created_at")',
      'updatedAt DateTime @default(now()) @updatedAt @map("updated_at")',
    ],
  );
  assert.match(prismaEnum, /@@map\("program_lifecycle_state"\)/);
  assert.match(model, /@@map\("program_lifecycle_records"\)/);
  assert.match(model, /@@index\(\[lifecycleState\]\)/);
  const partialActiveIndexes = migration.match(
    /CREATE UNIQUE INDEX "program_lifecycle_records_single_open_program_idx"[\s\S]*?WHERE "lifecycle_state" = 'OPEN_FOR_BATCH_PLANNING_ONLY';/g,
  );
  assert.equal(partialActiveIndexes?.length, 1);
  assert.match(migration, /"program_id" ~ '\^\[a-z0-9\]\+\(-\[a-z0-9\]\+\)\*\$'/);
  assert.match(migration, /"program_code" ~ '\^\[A-Z\]\[A-Z0-9\]\*-P\[1-9\]\[0-9\]\*\$'/);
  assert.match(migration, /program_title_format_check/);
  assert.equal(
    (migration.match(/\b(?:INSERT|UPDATE|DELETE)\b/gi) ?? []).length,
    0,
  );
  assert.equal(/seed|backfill/i.test(migration), false);
  assert.equal(
    createHash("sha256").update(migration).digest("hex"),
    "6959b9d410d7d5ab1d18a1b947c420f36a0caa7284632caa16dc1141d70f8735",
  );
  assert.match(
    versionMigration,
    /ADD COLUMN "lifecycle_version" INTEGER NOT NULL DEFAULT 0/,
  );
  assert.match(
    versionMigration,
    /program_lifecycle_records_lifecycle_version_nonnegative_check/,
  );
  assert.match(versionMigration, /CHECK \("lifecycle_version" >= 0\)/);
  assert.equal(
    (versionMigration.match(/\b(?:INSERT|UPDATE|DELETE|TRUNCATE|DROP)\b/gi) ?? []).length,
    0,
  );
  for (const forbiddenField of [
    "repositoryId",
    "batchId",
    "waveId",
    "laneId",
    "linearId",
    "githubId",
    "supersession",
    "receipt",
    "authority",
    "transition",
    "deletedAt",
  ]) {
    assert.equal(modelFields.some((field) => field.startsWith(forbiddenField)), false);
  }
}

function testCreateInputValidationAndTitleNormalization() {
  assert.deepEqual(validateInitialProgramLifecycleCreateInput(createInput()), {
    programId: PROGRAM_ID,
    programCode: PROGRAM_CODE,
    programTitle: "Program One",
  });
  assert.deepEqual(
    validateInitialProgramLifecycleCreateInput(
      createInput({ programTitle: "  Program  One  " }),
    ),
    {
      programId: PROGRAM_ID,
      programCode: PROGRAM_CODE,
      programTitle: "Program  One",
    },
  );
  assert.deepEqual(
    validateInitialProgramLifecycleCreateInput(createInput({ programTitle: null })),
    {
      programId: PROGRAM_ID,
      programCode: PROGRAM_CODE,
      programTitle: null,
    },
  );

  expectInvalidCreateInput(createInput({ programId: ` ${PROGRAM_ID}` }));
  expectInvalidCreateInput(createInput({ programId: PROGRAM_ID.toUpperCase() }));
  expectInvalidCreateInput(createInput({ programCode: ` ${PROGRAM_CODE}` }));
  expectInvalidCreateInput(createInput({ programCode: PROGRAM_CODE.toLowerCase() }));
  expectInvalidCreateInput(createInput({ programTitle: " \t\n " }));
  expectInvalidCreateInput({ programId: PROGRAM_ID, programCode: PROGRAM_CODE });
  expectInvalidCreateInput(createInput({ unexpected: true }));
  expectInvalidCreateInput(createInput({ lifecycleState: "CLOSED_ACCEPTED" }));
  expectInvalidCreateInput([createInput()]);
  expectInvalidCreateInput(null);
  expectInvalidCreateInput("program");
}

function testCanonicalUtcIsoTimestampValidation() {
  const valid = validatePersistedProgramLifecycleRecord(persistedRecord());
  assert.notEqual(valid, null);

  for (const timestamp of [
    ` ${CREATED_AT}`,
    "2026-07-30",
    "2026-07-30T04:00:00+00:00",
    "2026-02-30T04:00:00.000Z",
    "not-a-timestamp",
    7,
    null,
    new Date(CREATED_AT),
  ]) {
    assert.equal(
      validatePersistedProgramLifecycleRecord({
        ...persistedRecord(),
        createdAt: timestamp,
      }),
      null,
    );
    assert.equal(
      validatePersistedProgramLifecycleRecord({
        ...persistedRecord(),
        updatedAt: timestamp,
      }),
      null,
    );
  }
}

function testLifecycleVersionValidation() {
  assert.equal(
    validatePersistedProgramLifecycleRecord(persistedRecord({ lifecycleVersion: 0 }))
      ?.lifecycleVersion,
    0,
  );
  for (const lifecycleVersion of [
    -1,
    0.5,
    2_147_483_648,
    Number.MAX_SAFE_INTEGER + 1,
    Number.NaN,
    Infinity,
    "0",
    null,
  ]) {
    assert.equal(
      validatePersistedProgramLifecycleRecord({
        ...persistedRecord(),
        lifecycleVersion,
      }),
      null,
    );
  }
}

function testDescriptorAndProxyInputsFailClosedWithoutGetterReads() {
  let getterReads = 0;
  const accessorInput = Object.defineProperties({}, {
    programId: {
      enumerable: true,
      get() {
        getterReads += 1;
        return PROGRAM_ID;
      },
    },
    programCode: { enumerable: true, value: PROGRAM_CODE },
    programTitle: { enumerable: true, value: "Program One" },
  });
  expectInvalidCreateInput(accessorInput);
  assert.equal(getterReads, 0);

  const symbolInput = createInput();
  Object.defineProperty(symbolInput, Symbol("unexpected"), {
    enumerable: true,
    value: true,
  });
  expectInvalidCreateInput(symbolInput);

  const proxyInput = new Proxy({}, {
    ownKeys() {
      throw new Error("proxy trap");
    },
  });
  expectInvalidCreateInput(proxyInput);
}

async function testValidInitialCreationAndImmutableSnapshot() {
  const fake = createFakeAdapter();
  const service = createProgramLifecyclePersistenceService(fake.adapter);
  const input = createInput({ programTitle: "  Program  One  " });
  const before = structuredClone(input);
  const result = await service.insertInitialProgram(input);

  assert.equal(result.kind, "INSERTED");
  if (result.kind !== "INSERTED") {
    return;
  }
  assert.equal(result.writeEffect, "CONFIRMED");
  assert.deepEqual(result.record, persistedRecord({ programTitle: "Program  One" }));
  assert.equal(Object.isFrozen(result.record), true);
  assert.deepEqual(fake.inserted, [
    {
      programId: PROGRAM_ID,
      programCode: PROGRAM_CODE,
      programTitle: "Program  One",
      lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
      lifecycleVersion: 0,
    },
  ]);
  assert.deepEqual(input, before);
  assert.equal(Object.isFrozen(input), false);
}

async function testDuplicatesAndInvalidLifecycleInputFailClosed() {
  const existing = persistedRecord();
  const duplicateId = await createProgramLifecyclePersistenceService(
    createFakeAdapter([existing]).adapter,
  ).insertInitialProgram(createInput({ programCode: "Q3M7Y26-P2" }));
  assert.equal(duplicateId.kind, "DUPLICATE_PROGRAM_ID");
  assert.equal(duplicateId.writeEffect, "NONE");

  const duplicateCode = await createProgramLifecyclePersistenceService(
    createFakeAdapter([existing]).adapter,
  ).insertInitialProgram(createInput({ programId: "jai-governance-intelligence-follow-up-v0" }));
  assert.equal(duplicateCode.kind, "DUPLICATE_PROGRAM_CODE");
  assert.equal(duplicateCode.writeEffect, "NONE");

  const invalidLifecycle = await createProgramLifecyclePersistenceService(
    createFakeAdapter().adapter,
  ).insertInitialProgram(createInput({ lifecycleState: "CLOSED_ACCEPTED" }));
  assert.equal(invalidLifecycle.kind, "INVALID_INPUT");
  assert.equal(invalidLifecycle.writeEffect, "NONE");
}

async function testPersistedRowsFailClosedAndReadsRemainDeterministic() {
  const malformed = await createProgramLifecyclePersistenceService(
    createFakeAdapter([{ programId: PROGRAM_ID }]).adapter,
  ).list();
  assert.equal(malformed.kind, "INVALID_PERSISTED_ROWS");

  const invalidState = await createProgramLifecyclePersistenceService(
    createFakeAdapter([persistedRecord({ lifecycleState: "OPEN" as ProgramLifecycleState })]).adapter,
  ).list();
  assert.equal(invalidState.kind, "INVALID_PERSISTED_ROWS");

  const duplicateIdentity = await createProgramLifecyclePersistenceService(
    createFakeAdapter([
      persistedRecord(),
      persistedRecord({ programCode: "Q3M7Y26-P2" }),
    ]).adapter,
  ).list();
  assert.equal(duplicateIdentity.kind, "INVALID_PERSISTED_ROWS");

  const multipleActive = await createProgramLifecyclePersistenceService(
    createFakeAdapter([
      persistedRecord({
        lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
      }),
      persistedRecord({
        programId: "jai-governance-intelligence-second-v0",
        programCode: "Q3M7Y26-P2",
        lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
      }),
    ]).adapter,
  ).list();
  assert.equal(multipleActive.kind, "INVALID_PERSISTED_ROWS");

  const zero = await createProgramLifecyclePersistenceService(
    createFakeAdapter([persistedRecord()]).adapter,
  ).list();
  assert.equal(zero.kind, "LISTED");
  if (zero.kind === "LISTED") {
    assert.equal(zero.invariant.kind, "ZERO_ACTIVE");
  }

  const first = persistedRecord({
    programId: "jai-governance-intelligence-alpha-v0",
    programCode: "Q3M7Y26-P2",
  });
  const second = persistedRecord({
    lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
  });
  const one = await createProgramLifecyclePersistenceService(
    createFakeAdapter([second, first]).adapter,
  ).list();
  assert.equal(one.kind, "LISTED");
  if (one.kind === "LISTED") {
    assert.equal(one.invariant.kind, "ONE_ACTIVE");
    assert.deepEqual(one.records.map((record) => record.programId), [
      "jai-governance-intelligence-alpha-v0",
      PROGRAM_ID,
    ]);
    assert.equal(Object.isFrozen(one.records), true);
  }
}

async function testFindAndAdapterFailureClassifications() {
  const fake = createFakeAdapter([persistedRecord()]);
  const service = createProgramLifecyclePersistenceService(fake.adapter);
  const found = await service.findByProgramId(PROGRAM_ID);
  assert.equal(found.kind, "FOUND");
  const missing = await service.findByProgramId("jai-governance-intelligence-unknown-v0");
  assert.equal(missing.kind, "NOT_FOUND");
  const invalid = await service.findByProgramId(` ${PROGRAM_ID}`);
  assert.equal(invalid.kind, "INVALID_INPUT");

  const unavailableAdapter: ProgramLifecyclePersistenceAdapter = {
    async list() {
      throw new ProgramLifecyclePersistenceUnavailableError();
    },
    async findByProgramId() {
      throw new ProgramLifecyclePersistenceUnavailableError();
    },
    async insertInitialProgram() {
      throw new ProgramLifecyclePersistenceUnavailableError();
    },
  };
  const unavailable = createProgramLifecyclePersistenceService(unavailableAdapter);
  const unavailableList = await unavailable.list();
  assert.deepEqual(unavailableList, {
    kind: "UNAVAILABLE",
    available: false,
    classification: "ADAPTER_UNAVAILABLE",
    records: [],
    invariant: null,
  });
  const unavailableInsert = await unavailable.insertInitialProgram(createInput());
  assert.equal(unavailableInsert.kind, "UNAVAILABLE");
  if (unavailableInsert.kind === "UNAVAILABLE") {
    assert.equal(unavailableInsert.classification, "ADAPTER_UNAVAILABLE");
    assert.equal(unavailableInsert.writeEffect, "NONE");
  }

  const adapterError: ProgramLifecyclePersistenceAdapter = {
    async list() {
      throw new Error("adapter error");
    },
    async findByProgramId() {
      throw new Error("adapter error");
    },
    async insertInitialProgram() {
      throw new ProgramLifecyclePersistenceConflictError("PROGRAM_ID");
    },
  };
  const errored = createProgramLifecyclePersistenceService(adapterError);
  const errorList = await errored.list();
  assert.equal(errorList.kind, "UNAVAILABLE");
  if (errorList.kind === "UNAVAILABLE") {
    assert.equal(errorList.classification, "ADAPTER_ERROR");
  }

  const conflictAdapter: ProgramLifecyclePersistenceAdapter = {
    async list() {
      return [];
    },
    async findByProgramId() {
      return null;
    },
    async insertInitialProgram() {
      throw new ProgramLifecyclePersistenceConflictError("PROGRAM_CODE");
    },
  };
  const conflict = await createProgramLifecyclePersistenceService(
    conflictAdapter,
  ).insertInitialProgram(createInput());
  assert.equal(conflict.kind, "DUPLICATE_PROGRAM_CODE");
  assert.equal(conflict.writeEffect, "NONE");

  const malformedInsertAdapter: ProgramLifecyclePersistenceAdapter = {
    async list() {
      return [];
    },
    async findByProgramId() {
      return null;
    },
    async insertInitialProgram() {
      return { malformed: true };
    },
  };
  const malformedInsert = await createProgramLifecyclePersistenceService(
    malformedInsertAdapter,
  ).insertInitialProgram(createInput());
  assert.equal(malformedInsert.kind, "INVALID_INSERT_RESULT");
  assert.equal(malformedInsert.writeEffect, "UNKNOWN");

  const postInsertErrorAdapter: ProgramLifecyclePersistenceAdapter = {
    async list() {
      return [];
    },
    async findByProgramId() {
      return null;
    },
    async insertInitialProgram() {
      throw new Error("adapter error after insert invocation");
    },
  };
  const postInsertError = await createProgramLifecyclePersistenceService(
    postInsertErrorAdapter,
  ).insertInitialProgram(createInput());
  assert.equal(postInsertError.kind, "UNAVAILABLE");
  if (postInsertError.kind === "UNAVAILABLE") {
    assert.equal(postInsertError.classification, "ADAPTER_ERROR");
    assert.equal(postInsertError.writeEffect, "UNKNOWN");
  }
}

function testPersistenceSurfaceIsBounded() {
  const boundarySource = readFileSync(
    new URL("./program-lifecycle-persistence-boundary.ts", import.meta.url),
    "utf8",
  );
  const serverSource = readFileSync(
    new URL("./program-lifecycle-persistence.ts", import.meta.url),
    "utf8",
  );

  assert.match(boundarySource, /from "\.\/one-active-program-invariant"/);
  assert.equal(boundarySource.includes("canonical-active-program-resolver"), false);
  assert.equal(boundarySource.includes("program-activation"), false);
  const deprecatedWriteField = ["write", "Occurred"].join("");
  assert.equal(boundarySource.includes(deprecatedWriteField), false);
  assert.match(serverSource, /^import "server-only";/);
  assert.match(serverSource, /await import\("\.\.\/\.\.\/prisma"\)/);
  assert.match(serverSource, /\$queryRaw/);
  assert.match(serverSource, /INSERT INTO "program_lifecycle_records"/);
  assert.match(serverSource, /"lifecycle_version"/);
  const insertColumns = serverSource.match(
    /INSERT INTO "program_lifecycle_records" \(([\s\S]*?)\)\s*VALUES/,
  )?.[1];
  assert.ok(insertColumns);
  assert.equal(insertColumns.includes("lifecycle_version"), false);
  for (const prohibited of [
    "ON CONFLICT",
    "UPDATE ",
    "DELETE ",
    "$transaction",
    "programLifecycleRecord.upsert",
    "fetch(",
    "process.env",
    "linear",
    "github",
  ]) {
    assert.equal(serverSource.toLowerCase().includes(prohibited.toLowerCase()), false);
  }
}

async function run() {
  testExactC1LifecycleReuse();
  testSchemaAndMigrationContracts();
  testCreateInputValidationAndTitleNormalization();
  testCanonicalUtcIsoTimestampValidation();
  testLifecycleVersionValidation();
  testDescriptorAndProxyInputsFailClosedWithoutGetterReads();
  await testValidInitialCreationAndImmutableSnapshot();
  await testDuplicatesAndInvalidLifecycleInputFailClosed();
  await testPersistedRowsFailClosedAndReadsRemainDeterministic();
  await testFindAndAdapterFailureClassifications();
  testPersistenceSurfaceIsBounded();
}

void run();

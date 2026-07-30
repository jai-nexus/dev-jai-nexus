import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  ProgramActivationSupersessionRollbackConfirmedError,
  ProgramActivationSupersessionUnavailableError,
  createProgramActivationSupersessionService,
  type ProgramActivationSupersessionAdapter,
  type ProgramActivationSupersessionCommand,
} from "./program-activation-supersession-boundary";
import type { PersistedProgramLifecycleRecord } from "./program-lifecycle-persistence-boundary";

const CANDIDATE_ID = "c6-candidate-program";
const ACTIVE_ID = "c6-active-program";
const OTHER_ID = "c6-other-program";
const CREATED_AT = "2026-07-30T04:00:00.000Z";
const UPDATED_AT = "2026-07-30T04:00:00.000Z";
const MUTATED_UPDATED_AT = "2026-07-30T04:00:01.000Z";

type FakeFault =
  | "NONE"
  | "BEFORE_FIRST_UPDATE"
  | "BETWEEN_HOLD_AND_OPEN"
  | "AFTER_SECOND_UPDATE"
  | "CONFIRMED_ROLLBACK"
  | "MALFORMED_POST_STATE"
  | "MALFORMED_TRANSACTION_RESULT";

type PostStateTransformer = (
  records: readonly PersistedProgramLifecycleRecord[],
) => unknown;

function record(
  overrides: Partial<PersistedProgramLifecycleRecord> = {},
): PersistedProgramLifecycleRecord {
  return {
    programId: CANDIDATE_ID,
    programCode: "Q3M7Y26-P1",
    programTitle: "C6 Candidate",
    lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    ...overrides,
  };
}

function command(
  overrides: Partial<ProgramActivationSupersessionCommand> = {},
): ProgramActivationSupersessionCommand {
  return {
    candidateProgramId: CANDIDATE_ID,
    governingMotions: [
      {
        motionId: "c6-governing-motion",
        subjectProgramId: CANDIDATE_ID,
        ratificationState: "RATIFIED",
        decisionState: "PASS",
        mainAcceptanceState: "ACCEPTED_ON_MAIN",
        freshnessState: "CURRENT",
      },
    ],
    receipts: [
      {
        receiptType: "MAIN_STATE_RECEIPT",
        receiptInstanceId: "c6-main-state-receipt",
        subjectProgramId: CANDIDATE_ID,
        issuanceState: "ISSUED",
        integrityState: "VERIFIED",
        authenticityState: "VERIFIED",
        issuerAuthorityState: "ESTABLISHED",
        freshnessState: "CURRENT",
      },
      {
        receiptType: "PROGRAM_OPENING_RECEIPT",
        receiptInstanceId: "c6-program-opening-receipt",
        subjectProgramId: CANDIDATE_ID,
        issuanceState: "ISSUED",
        integrityState: "VERIFIED",
        authenticityState: "VERIFIED",
        issuerAuthorityState: "ESTABLISHED",
        freshnessState: "CURRENT",
      },
    ],
    ...overrides,
  };
}

function cloneRecord(
  value: PersistedProgramLifecycleRecord,
): PersistedProgramLifecycleRecord {
  return { ...value };
}

function createFakeAdapter(
  initialRecords: readonly PersistedProgramLifecycleRecord[],
  fault: FakeFault = "NONE",
  postStateTransformer: PostStateTransformer | null = null,
) {
  let committedRecords = initialRecords.map(cloneRecord);
  let transactionCalls = 0;
  let lockReads = 0;
  let mutationCalls = 0;

  const adapter: ProgramActivationSupersessionAdapter = {
    async transaction(operation) {
      transactionCalls += 1;
      const workingRecords = committedRecords.map(cloneRecord);
      const result = await operation({
        async listLockedProgramLifecycleRecords() {
          lockReads += 1;
          if (fault === "MALFORMED_POST_STATE" && lockReads === 2) {
            return [workingRecords[0]];
          }
          if (postStateTransformer && lockReads === 2) {
            return postStateTransformer(workingRecords.map(cloneRecord));
          }
          return workingRecords.map(cloneRecord);
        },
        async setProgramLifecycleState(programId, lifecycleState) {
          mutationCalls += 1;
          if (fault === "BEFORE_FIRST_UPDATE" && mutationCalls === 1) {
            throw new ProgramActivationSupersessionRollbackConfirmedError();
          }

          const index = workingRecords.findIndex(
            (item) => item.programId === programId,
          );
          if (index < 0) {
            throw new Error("fake transaction program was not found");
          }
          workingRecords[index] = {
            ...workingRecords[index],
            lifecycleState,
            updatedAt: MUTATED_UPDATED_AT,
          };

          if (fault === "BETWEEN_HOLD_AND_OPEN" && mutationCalls === 1) {
            throw new Error("fake transaction fault after hold");
          }
          if (fault === "CONFIRMED_ROLLBACK") {
            throw new ProgramActivationSupersessionRollbackConfirmedError();
          }
          if (fault === "AFTER_SECOND_UPDATE" && mutationCalls === 2) {
            throw new Error("fake transaction fault before commit");
          }
        },
      });

      committedRecords = workingRecords;
      if (fault === "MALFORMED_TRANSACTION_RESULT") {
        return Object.freeze({}) as typeof result;
      }
      return result;
    },
  };

  return {
    adapter,
    get committedRecords() {
      return committedRecords.map(cloneRecord);
    },
    get transactionCalls() {
      return transactionCalls;
    },
    get lockReads() {
      return lockReads;
    },
    get mutationCalls() {
      return mutationCalls;
    },
  };
}

async function testZeroActiveActivation() {
  const fake = createFakeAdapter([
    record(),
    record({
      programId: OTHER_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "CLOSED_ACCEPTED",
    }),
  ]);
  const sourceCommand = command();
  const beforeCommand = structuredClone(sourceCommand);
  const result = await createProgramActivationSupersessionService(fake.adapter).execute(
    sourceCommand,
  );

  assert.equal(result.kind, "COMMITTED");
  if (result.kind !== "COMMITTED") {
    return;
  }
  assert.equal(result.writeEffect, "CONFIRMED");
  assert.equal(result.candidateProgramId, CANDIDATE_ID);
  assert.equal(result.supersededProgramId, null);
  assert.deepEqual(
    result.records.map((item) => item.programId),
    [CANDIDATE_ID, OTHER_ID],
  );
  assert.equal(
    result.records.find((item) => item.programId === CANDIDATE_ID)?.lifecycleState,
    "OPEN_FOR_BATCH_PLANNING_ONLY",
  );
  assert.equal(
    result.records.find((item) => item.programId === CANDIDATE_ID)?.updatedAt,
    MUTATED_UPDATED_AT,
  );
  assert.equal(
    result.records.find((item) => item.programId === OTHER_ID)?.updatedAt,
    UPDATED_AT,
  );
  assert.equal(Object.isFrozen(result.records), true);
  assert.equal(Object.isFrozen(result.records[0]), true);
  assert.deepEqual(sourceCommand, beforeCommand);
  assert.equal(fake.transactionCalls, 1);
  assert.equal(fake.lockReads, 2);
  assert.equal(fake.mutationCalls, 1);
}

async function testOneActiveAtomicSupersession() {
  const activeSource = {
    ...record({
      programId: ACTIVE_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
    }),
  };
  const fake = createFakeAdapter([record(), activeSource]);
  const result = await createProgramActivationSupersessionService(fake.adapter).execute(
    command(),
  );

  assert.equal(result.kind, "COMMITTED");
  if (result.kind !== "COMMITTED") {
    return;
  }
  assert.equal(result.supersededProgramId, ACTIVE_ID);
  assert.equal(
    result.records.find((item) => item.programId === ACTIVE_ID)?.lifecycleState,
    "UNRESOLVED_HOLD",
  );
  assert.equal(
    result.records.find((item) => item.programId === CANDIDATE_ID)?.lifecycleState,
    "OPEN_FOR_BATCH_PLANNING_ONLY",
  );
  assert.equal(
    result.records.filter((item) => item.lifecycleState === "OPEN_FOR_BATCH_PLANNING_ONLY").length,
    1,
  );
  assert.equal(
    result.records.find((item) => item.programId === CANDIDATE_ID)?.updatedAt,
    MUTATED_UPDATED_AT,
  );
  assert.equal(
    result.records.find((item) => item.programId === ACTIVE_ID)?.updatedAt,
    MUTATED_UPDATED_AT,
  );
  assert.equal(fake.mutationCalls, 2);
  assert.equal(
    fake.committedRecords.filter(
      (item) => item.lifecycleState === "OPEN_FOR_BATCH_PLANNING_ONLY",
    ).length,
    1,
  );

  activeSource.programTitle = "changed outside the result";
  assert.equal(
    result.records.find((item) => item.programId === ACTIVE_ID)?.programTitle,
    "C6 Candidate",
  );
}

async function testRejectionsRequestNoWrite() {
  const cases: Array<{
    readonly name: string;
    readonly rows: readonly PersistedProgramLifecycleRecord[];
    readonly value: unknown;
    readonly reason: string;
  }> = [
    {
      name: "candidate missing",
      rows: [record({ programId: OTHER_ID, programCode: "Q3M7Y26-P2" })],
      value: command(),
      reason: "CANDIDATE_MISSING",
    },
    {
      name: "candidate already active",
      rows: [record({ lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" })],
      value: command(),
      reason: "CANDIDATE_ALREADY_ACTIVE",
    },
    {
      name: "candidate held",
      rows: [record({ lifecycleState: "UNRESOLVED_HOLD" })],
      value: command(),
      reason: "CANDIDATE_STATE_INVALID",
    },
    {
      name: "candidate closed accepted",
      rows: [record({ lifecycleState: "CLOSED_ACCEPTED" })],
      value: command(),
      reason: "CANDIDATE_STATE_INVALID",
    },
    {
      name: "candidate closed no go",
      rows: [record({ lifecycleState: "CLOSED_NO_GO" })],
      value: command(),
      reason: "CANDIDATE_STATE_INVALID",
    },
    {
      name: "candidate cancelled",
      rows: [record({ lifecycleState: "CANCELLED" })],
      value: command(),
      reason: "CANDIDATE_STATE_INVALID",
    },
    {
      name: "candidate failed",
      rows: [record({ lifecycleState: "FAILED" })],
      value: command(),
      reason: "CANDIDATE_STATE_INVALID",
    },
    {
      name: "C4 ineligibility",
      rows: [record()],
      value: command({
        governingMotions: [
          {
            ...command().governingMotions[0],
            ratificationState: "NOT_RATIFIED",
          },
        ],
      }),
      reason: "C4_INELIGIBLE",
    },
  ];

  for (const testCase of cases) {
    const fake = createFakeAdapter(testCase.rows);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      testCase.value,
    );
    assert.equal(result.kind, "REJECTED", testCase.name);
    if (result.kind === "REJECTED") {
      assert.equal(result.reason, testCase.reason, testCase.name);
      assert.equal(result.writeEffect, "NONE", testCase.name);
    }
    assert.equal(fake.mutationCalls, 0, testCase.name);
  }
}

async function testMalformedPortfoliosAndEvidenceFailClosed() {
  const malformedRows = createFakeAdapter([
    record(),
    record({ programCode: "Q3M7Y26-P2" }),
  ]);
  const malformedResult = await createProgramActivationSupersessionService(
    malformedRows.adapter,
  ).execute(command());
  assert.deepEqual(malformedResult, {
    kind: "REJECTED",
    writeEffect: "NONE",
    reason: "INVALID_PERSISTED_ROWS",
    records: [],
  });
  assert.equal(malformedRows.mutationCalls, 0);

  const multipleActiveRows = createFakeAdapter([
    record({ lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" }),
    record({
      programId: ACTIVE_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
    }),
  ]);
  const multipleActive = await createProgramActivationSupersessionService(
    multipleActiveRows.adapter,
  ).execute(command());
  assert.equal(multipleActive.kind, "REJECTED");
  if (multipleActive.kind === "REJECTED") {
    assert.equal(multipleActive.reason, "MULTIPLE_ACTIVE_PROGRAMS");
  }
  assert.equal(multipleActiveRows.mutationCalls, 0);

  const invalidEvidenceAdapter = createFakeAdapter([record()]);
  const invalidEvidence = await createProgramActivationSupersessionService(
    invalidEvidenceAdapter.adapter,
  ).execute({
    candidateProgramId: CANDIDATE_ID,
    governingMotions: [{ motionId: "missing fields" }],
    receipts: [],
  });
  assert.equal(invalidEvidence.kind, "REJECTED");
  if (invalidEvidence.kind === "REJECTED") {
    assert.equal(invalidEvidence.reason, "INVALID_COMMAND");
  }
  assert.equal(invalidEvidenceAdapter.transactionCalls, 0);
  assert.equal(invalidEvidenceAdapter.mutationCalls, 0);
}

async function assertInvalidCommand(value: unknown, name: string) {
  const fake = createFakeAdapter([record()]);
  const result = await createProgramActivationSupersessionService(fake.adapter).execute(
    value,
  );
  assert.equal(result.kind, "REJECTED", name);
  if (result.kind === "REJECTED") {
    assert.equal(result.reason, "INVALID_COMMAND", name);
    assert.equal(result.writeEffect, "NONE", name);
  }
  assert.equal(fake.transactionCalls, 0, name);
  assert.equal(fake.mutationCalls, 0, name);
}

async function testCommandHardening() {
  const paddedMotion = {
    ...command().governingMotions[0],
    subjectProgramId: ` ${CANDIDATE_ID}`,
  };
  const paddedReceipt = {
    ...command().receipts[0],
    subjectProgramId: `${CANDIDATE_ID} `,
  };
  const topAccessor = { ...command() };
  let topGetterReads = 0;
  Object.defineProperty(topAccessor, "candidateProgramId", {
    enumerable: true,
    get() {
      topGetterReads += 1;
      return CANDIDATE_ID;
    },
  });
  const nestedAccessor = { ...command().governingMotions[0] };
  let nestedGetterReads = 0;
  Object.defineProperty(nestedAccessor, "subjectProgramId", {
    enumerable: true,
    get() {
      nestedGetterReads += 1;
      return CANDIDATE_ID;
    },
  });
  const sparseMotions = new Array<unknown>(1);
  const extendedReceipts = [...command().receipts] as unknown[];
  Object.defineProperty(extendedReceipts, "unexpected", {
    enumerable: true,
    value: true,
  });

  const invalidCases: Array<readonly [string, unknown]> = [
    ["noncanonical candidate", command({ candidateProgramId: "C6-CANDIDATE" })],
    ["padded candidate", command({ candidateProgramId: ` ${CANDIDATE_ID} ` })],
    ["wrong candidate type", { ...command(), candidateProgramId: 1 }],
    ["unknown top-level field", { ...command(), unexpected: true }],
    ["unknown nested motion field", command({ governingMotions: [{ ...command().governingMotions[0], unexpected: true }] as never })],
    ["unknown nested receipt field", command({ receipts: [{ ...command().receipts[0], unexpected: true }] as never })],
    ["padded motion subject", command({ governingMotions: [paddedMotion] })],
    ["padded receipt subject", command({ receipts: [paddedReceipt, command().receipts[1]] })],
    ["top-level accessor", topAccessor],
    ["nested accessor", command({ governingMotions: [nestedAccessor] })],
    ["top-level symbol", { ...command(), [Symbol("unexpected")]: true }],
    ["nested symbol", command({ receipts: [{ ...command().receipts[0], [Symbol("unexpected")]: true }] as never })],
    ["proxy trap", new Proxy(command(), { ownKeys() { throw new Error("blocked"); } })],
    ["sparse motions", { ...command(), governingMotions: sparseMotions }],
    ["extended receipts", { ...command(), receipts: extendedReceipts }],
  ];

  for (const [name, value] of invalidCases) {
    await assertInvalidCommand(value, name);
  }
  assert.equal(topGetterReads, 0);
  assert.equal(nestedGetterReads, 0);
}

async function testPostStateCoherenceFailures() {
  const zeroActiveRows = [
    record(),
    record({
      programId: OTHER_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "CLOSED_ACCEPTED",
    }),
  ];
  const transforms: Array<readonly [string, PostStateTransformer]> = [
    [
      "unrelated lifecycle drift",
      (rows) => rows.map((item) =>
        item.programId === OTHER_ID ? { ...item, lifecycleState: "FAILED" } : item,
      ),
    ],
    ["added row", (rows) => [...rows, record({ programId: "c6-added", programCode: "Q3M7Y26-P3" })]],
    ["removed row", (rows) => [rows[0]]],
    [
      "substituted row",
      (rows) => rows.map((item) =>
        item.programId === OTHER_ID
          ? { ...item, programId: "c6-substituted", programCode: "Q3M7Y26-P3" }
          : item,
      ),
    ],
    [
      "program code drift",
      (rows) => rows.map((item) =>
        item.programId === CANDIDATE_ID ? { ...item, programCode: "Q3M7Y26-P3" } : item,
      ),
    ],
    [
      "program title drift",
      (rows) => rows.map((item) =>
        item.programId === CANDIDATE_ID ? { ...item, programTitle: "Changed title" } : item,
      ),
    ],
    [
      "created timestamp drift",
      (rows) => rows.map((item) =>
        item.programId === CANDIDATE_ID
          ? { ...item, createdAt: "2026-07-30T04:00:02.000Z" }
          : item,
      ),
    ],
    [
      "backwards mutated timestamp",
      (rows) => rows.map((item) =>
        item.programId === CANDIDATE_ID
          ? { ...item, updatedAt: "2026-07-30T03:59:59.000Z" }
          : item,
      ),
    ],
    [
      "untouched timestamp drift",
      (rows) => rows.map((item) =>
        item.programId === OTHER_ID ? { ...item, updatedAt: MUTATED_UPDATED_AT } : item,
      ),
    ],
  ];

  for (const [name, transform] of transforms) {
    const fake = createFakeAdapter(zeroActiveRows, "NONE", transform);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      command(),
    );
    assert.equal(result.kind, "UNAVAILABLE", name);
    if (result.kind === "UNAVAILABLE") {
      assert.equal(result.classification, "MALFORMED_TRANSACTION_RESULT", name);
      assert.equal(result.writeEffect, "UNKNOWN", name);
    }
    assert.equal(fake.mutationCalls, 1, name);
  }
}

async function testFaultEffectsAndNoPartialSuccess() {
  const supersessionRows = [
    record(),
    record({
      programId: ACTIVE_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
    }),
  ];

  for (const fault of [
    "BEFORE_FIRST_UPDATE",
    "CONFIRMED_ROLLBACK",
  ] as const) {
    const fake = createFakeAdapter(supersessionRows, fault);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      command(),
    );
    assert.equal(result.kind, "UNAVAILABLE");
    if (result.kind === "UNAVAILABLE") {
      assert.equal(result.classification, "ROLLBACK_CONFIRMED");
      assert.equal(result.writeEffect, "NONE");
    }
    assert.equal(
      fake.committedRecords.filter(
        (item) => item.lifecycleState === "OPEN_FOR_BATCH_PLANNING_ONLY",
      ).length,
      1,
    );
  }

  for (const fault of [
    "BETWEEN_HOLD_AND_OPEN",
    "AFTER_SECOND_UPDATE",
    "MALFORMED_POST_STATE",
    "MALFORMED_TRANSACTION_RESULT",
  ] as const) {
    const fake = createFakeAdapter(supersessionRows, fault);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      command(),
    );
    assert.equal(result.kind, "UNAVAILABLE");
    if (result.kind === "UNAVAILABLE") {
      assert.equal(result.writeEffect, "UNKNOWN");
      if (
        fault === "MALFORMED_POST_STATE" ||
        fault === "MALFORMED_TRANSACTION_RESULT"
      ) {
        assert.equal(result.classification, "MALFORMED_TRANSACTION_RESULT");
      }
    }
    assert.notEqual(result.kind, "COMMITTED");
  }
}

async function testAdapterFailuresAreFailClosed() {
  const unavailableAdapter: ProgramActivationSupersessionAdapter = {
    async transaction() {
      throw new ProgramActivationSupersessionUnavailableError();
    },
  };
  const unavailable = await createProgramActivationSupersessionService(
    unavailableAdapter,
  ).execute(command());
  assert.deepEqual(unavailable, {
    kind: "UNAVAILABLE",
    writeEffect: "NONE",
    classification: "ADAPTER_UNAVAILABLE",
    records: [],
  });

  const erroredAdapter: ProgramActivationSupersessionAdapter = {
    async transaction() {
      throw new Error("adapter error before operation");
    },
  };
  const errored = await createProgramActivationSupersessionService(
    erroredAdapter,
  ).execute(command());
  assert.equal(errored.kind, "UNAVAILABLE");
  if (errored.kind === "UNAVAILABLE") {
    assert.equal(errored.classification, "ADAPTER_ERROR");
    assert.equal(errored.writeEffect, "NONE");
  }
}

function testStaticBoundaryAndServerSeams() {
  const boundarySource = readFileSync(
    new URL("./program-activation-supersession-boundary.ts", import.meta.url),
    "utf8",
  );
  const serverSource = readFileSync(
    new URL("./program-activation-supersession.ts", import.meta.url),
    "utf8",
  );

  assert.match(boundarySource, /from "\.\/one-active-program-invariant"/);
  assert.match(boundarySource, /from "\.\/program-state-transition-matrix"/);
  assert.match(boundarySource, /from "\.\/program-activation-eligibility-gate"/);
  assert.match(boundarySource, /from "\.\/program-lifecycle-persistence-boundary"/);
  assert.equal(
    boundarySource.includes("NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN"),
    false,
  );
  assert.equal(serverSource.startsWith('import "server-only";'), true);
  assert.equal((serverSource.match(/\$transaction/g) ?? []).length, 1);
  assert.match(serverSource, /FOR UPDATE/);
  assert.match(serverSource, /UPDATE "program_lifecycle_records"/);
  assert.match(serverSource, /\$\{programId\}/);
  assert.match(serverSource, /\$\{lifecycleState\}/);
  assert.match(serverSource, /"updated_at" = CURRENT_TIMESTAMP/);
  for (const prohibited of [
    "INSERT INTO",
    "ON CONFLICT",
    "DELETE ",
    "fetch(",
    "process.env",
    "provider",
    "outbox",
    "event",
    "schema.prisma",
    "migrations/",
  ]) {
    assert.equal(serverSource.toLowerCase().includes(prohibited.toLowerCase()), false);
  }
  for (const reserved of [
    ["expected", "Version"].join(""),
    ["state", "Version"].join(""),
    ["finger", "print"].join(""),
    ["idempot", "ency"].join(""),
    ["retry"].join(""),
  ]) {
    assert.equal(boundarySource.includes(reserved), false);
    assert.equal(serverSource.includes(reserved), false);
  }
}

async function run() {
  await testZeroActiveActivation();
  await testOneActiveAtomicSupersession();
  await testRejectionsRequestNoWrite();
  await testMalformedPortfoliosAndEvidenceFailClosed();
  await testCommandHardening();
  await testPostStateCoherenceFailures();
  await testFaultEffectsAndNoPartialSuccess();
  await testAdapterFailuresAreFailClosed();
  testStaticBoundaryAndServerSeams();
}

void run();

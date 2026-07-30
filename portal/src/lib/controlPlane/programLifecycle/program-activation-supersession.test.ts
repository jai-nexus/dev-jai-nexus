import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  ProgramActivationSupersessionConcurrencyConflictError,
  ProgramActivationSupersessionRollbackConfirmedError,
  ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError,
  ProgramActivationSupersessionUnavailableError,
  createProgramActivationSupersessionService,
  type ProgramActivationSupersessionAdapter,
  type ProgramActivationSupersessionCommand,
  type ProgramActivationSupersessionTransaction,
} from "./program-activation-supersession-boundary";
import {
  MAX_PROGRAM_LIFECYCLE_VERSION,
  type PersistedProgramLifecycleRecord,
} from "./program-lifecycle-persistence-boundary";

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
  | "CAS_MISS"
  | "CAS_MISS_AFTER_HOLD"
  | "CONFIRMED_CAS_MISS"
  | "CONFIRMED_CAS_MISS_AFTER_HOLD"
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
    lifecycleVersion: 0,
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
    expectedLifecycleVersions: [{
      programId: CANDIDATE_ID,
      lifecycleVersion: 0,
    }],
    ...overrides,
  };
}

function commandForRecords(
  records: readonly PersistedProgramLifecycleRecord[],
  overrides: Partial<ProgramActivationSupersessionCommand> = {},
): ProgramActivationSupersessionCommand {
  return command({
    ...overrides,
    expectedLifecycleVersions: records
      .map((item) => ({
        programId: item.programId,
        lifecycleVersion: item.lifecycleVersion,
      }))
      .sort((left, right) => left.programId.localeCompare(right.programId)),
  });
}

function withExpectedVersions(
  value: ProgramActivationSupersessionCommand,
  records: readonly PersistedProgramLifecycleRecord[],
): ProgramActivationSupersessionCommand {
  return commandForRecords(records, value);
}

function commandForCandidate(
  candidateProgramId: string,
  records: readonly PersistedProgramLifecycleRecord[],
): ProgramActivationSupersessionCommand {
  const base = command();
  return commandForRecords(records, {
    candidateProgramId,
    governingMotions: base.governingMotions.map((motion) => ({
      ...motion,
      subjectProgramId: candidateProgramId,
    })),
    receipts: base.receipts.map((receipt) => ({
      ...receipt,
      subjectProgramId: candidateProgramId,
    })),
  });
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
        async setProgramLifecycleState(
          programId,
          expectedLifecycleState,
          expectedLifecycleVersion,
          lifecycleState,
        ) {
          mutationCalls += 1;
          if (fault === "BEFORE_FIRST_UPDATE" && mutationCalls === 1) {
            throw new ProgramActivationSupersessionRollbackConfirmedError();
          }
          if (fault === "CAS_MISS" && mutationCalls === 1) {
            throw new ProgramActivationSupersessionConcurrencyConflictError();
          }
          if (fault === "CAS_MISS_AFTER_HOLD" && mutationCalls === 2) {
            throw new ProgramActivationSupersessionConcurrencyConflictError();
          }
          if (fault === "CONFIRMED_CAS_MISS" && mutationCalls === 1) {
            throw new ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError();
          }
          if (
            fault === "CONFIRMED_CAS_MISS_AFTER_HOLD" &&
            mutationCalls === 2
          ) {
            throw new ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError();
          }

          const index = workingRecords.findIndex(
            (item) => item.programId === programId,
          );
          if (index < 0) {
            throw new ProgramActivationSupersessionConcurrencyConflictError();
          }
          if (
            workingRecords[index].lifecycleState !== expectedLifecycleState ||
            workingRecords[index].lifecycleVersion !== expectedLifecycleVersion
          ) {
            throw new ProgramActivationSupersessionConcurrencyConflictError();
          }
          workingRecords[index] = {
            ...workingRecords[index],
            lifecycleState,
            lifecycleVersion: expectedLifecycleVersion + 1,
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

function createSerializedFakeAdapter(
  initialRecords: readonly PersistedProgramLifecycleRecord[],
) {
  const fake = createFakeAdapter(initialRecords);
  let queue = Promise.resolve();
  let transactionsStarted = 0;

  const adapter: ProgramActivationSupersessionAdapter = {
    async transaction<Result>(
      operation: (transaction: ProgramActivationSupersessionTransaction) => Promise<Result>,
    ): Promise<Result> {
      transactionsStarted += 1;
      const previous = queue;
      let release!: () => void;
      queue = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        return await fake.adapter.transaction(operation);
      } finally {
        release();
      }
    },
  };

  return {
    adapter,
    get committedRecords() {
      return fake.committedRecords;
    },
    get transactionsStarted() {
      return transactionsStarted;
    },
  };
}

async function testZeroActiveActivation() {
  const zeroActiveRecords = [
    record(),
    record({
      programId: OTHER_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "CLOSED_ACCEPTED",
    }),
  ];
  const fake = createFakeAdapter(zeroActiveRecords);
  const sourceCommand = command();
  const beforeCommand = structuredClone(sourceCommand);
  const result = await createProgramActivationSupersessionService(fake.adapter).execute(
    withExpectedVersions(sourceCommand, zeroActiveRecords),
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
    result.records.find((item) => item.programId === CANDIDATE_ID)?.lifecycleVersion,
    1,
  );
  assert.equal(
    result.records.find((item) => item.programId === OTHER_ID)?.updatedAt,
    UPDATED_AT,
  );
  assert.equal(
    result.records.find((item) => item.programId === OTHER_ID)?.lifecycleVersion,
    0,
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
  const supersessionRecords = [record(), activeSource];
  const fake = createFakeAdapter(supersessionRecords);
  const result = await createProgramActivationSupersessionService(fake.adapter).execute(
    commandForRecords(supersessionRecords),
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
  assert.equal(
    result.records.find((item) => item.programId === CANDIDATE_ID)?.lifecycleVersion,
    1,
  );
  assert.equal(
    result.records.find((item) => item.programId === ACTIVE_ID)?.lifecycleVersion,
    1,
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
      withExpectedVersions(testCase.value as ProgramActivationSupersessionCommand, testCase.rows),
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
  ).execute(commandForRecords(multipleActiveRows.committedRecords));
  assert.equal(multipleActive.kind, "REJECTED");
  if (multipleActive.kind === "REJECTED") {
    assert.equal(multipleActive.reason, "MULTIPLE_ACTIVE_PROGRAMS");
    assert.equal(multipleActive.writeEffect, "NONE");
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
  const expectedAccessor = { ...command().expectedLifecycleVersions[0] };
  let expectedGetterReads = 0;
  Object.defineProperty(expectedAccessor, "lifecycleVersion", {
    enumerable: true,
    get() {
      expectedGetterReads += 1;
      return 0;
    },
  });
  const sparseExpectedVersions = new Array<unknown>(1);
  const extendedExpectedVersions = [...command().expectedLifecycleVersions] as unknown[];
  Object.defineProperty(extendedExpectedVersions, "unexpected", {
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
    ["expected version accessor", { ...command(), expectedLifecycleVersions: [expectedAccessor] }],
    ["expected version symbol", { ...command(), expectedLifecycleVersions: [{ ...command().expectedLifecycleVersions[0], [Symbol("unexpected")]: true }] }],
    ["expected version proxy", { ...command(), expectedLifecycleVersions: [new Proxy(command().expectedLifecycleVersions[0], { ownKeys() { throw new Error("blocked"); } })] }],
    ["sparse expected versions", { ...command(), expectedLifecycleVersions: sparseExpectedVersions }],
    ["extended expected versions", { ...command(), expectedLifecycleVersions: extendedExpectedVersions }],
  ];

  for (const [name, value] of invalidCases) {
    await assertInvalidCommand(value, name);
  }
  assert.equal(topGetterReads, 0);
  assert.equal(nestedGetterReads, 0);
  assert.equal(expectedGetterReads, 0);
}

async function testExpectationVectorsAndDeterministicCompetition() {
  const alternateCandidate = record({
    programId: OTHER_ID,
    programCode: "Q3M7Y26-P2",
  });
  const initialRecords = [record(), alternateCandidate];
  const serialized = createSerializedFakeAdapter(initialRecords);
  const service = createProgramActivationSupersessionService(serialized.adapter);
  const firstCommand = commandForCandidate(CANDIDATE_ID, initialRecords);
  const beforeFirstCommand = structuredClone(firstCommand);
  const competingCommand = commandForCandidate(OTHER_ID, initialRecords);
  const firstExecution = service.execute(firstCommand);
  const competingExecution = service.execute(competingCommand);
  const [first, competing] = await Promise.all([firstExecution, competingExecution]);

  assert.equal(serialized.transactionsStarted, 2);
  assert.deepEqual(firstCommand, beforeFirstCommand);
  assert.equal(
    [first, competing].filter((result) => result.kind === "COMMITTED").length,
    1,
  );
  assert.equal(
    [first, competing].filter(
      (result) =>
        result.kind === "REJECTED" &&
        result.reason === "STALE_STATE" &&
        result.writeEffect === "NONE",
    ).length,
    1,
  );
  assert.equal(
    serialized.committedRecords.filter(
      (item) => item.lifecycleState === "OPEN_FOR_BATCH_PLANNING_ONLY",
    ).length,
    1,
  );
  assert.equal(
    serialized.committedRecords.find((item) => item.programId === CANDIDATE_ID)
      ?.lifecycleVersion,
    1,
  );
  assert.equal(
    serialized.committedRecords.find((item) => item.programId === OTHER_ID)
      ?.lifecycleVersion,
    0,
  );
  assert.equal(
    serialized.committedRecords.some((item) => item.lifecycleState === "UNRESOLVED_HOLD"),
    false,
  );

  const replay = await service.execute(firstCommand);
  assert.equal(replay.kind, "REJECTED");
  if (replay.kind === "REJECTED") {
    assert.equal(replay.reason, "STALE_STATE");
  }

  const freshCommand = commandForCandidate(OTHER_ID, serialized.committedRecords);
  const later = await service.execute(freshCommand);
  assert.equal(later.kind, "COMMITTED");
  assert.equal(
    serialized.committedRecords.filter(
      (item) => item.lifecycleState === "OPEN_FOR_BATCH_PLANNING_ONLY",
    ).length,
    1,
  );

  const staleRecords = [record(), alternateCandidate];
  const complete = commandForCandidate(CANDIDATE_ID, staleRecords);
  const malformedCases: Array<readonly [string, unknown, "INVALID_COMMAND" | "STALE_STATE"]> = [
    [
      "missing expectation",
      { ...complete, expectedLifecycleVersions: [complete.expectedLifecycleVersions[0]] },
      "STALE_STATE",
    ],
    [
      "extra expectation",
      {
        ...complete,
        expectedLifecycleVersions: [
          ...complete.expectedLifecycleVersions,
          { programId: "c6-zextra", lifecycleVersion: 0 },
        ],
      },
      "STALE_STATE",
    ],
    [
      "substituted expectation",
      {
        ...complete,
        expectedLifecycleVersions: [
          complete.expectedLifecycleVersions[0],
          { programId: "c6-substitute", lifecycleVersion: 0 },
        ],
      },
      "STALE_STATE",
    ],
    [
      "candidate version mismatch",
      {
        ...complete,
        expectedLifecycleVersions: complete.expectedLifecycleVersions.map((item) =>
          item.programId === CANDIDATE_ID ? { ...item, lifecycleVersion: 1 } : item,
        ),
      },
      "STALE_STATE",
    ],
    [
      "unrelated version mismatch",
      {
        ...complete,
        expectedLifecycleVersions: complete.expectedLifecycleVersions.map((item) =>
          item.programId === OTHER_ID ? { ...item, lifecycleVersion: 1 } : item,
        ),
      },
      "STALE_STATE",
    ],
    [
      "duplicate expectation",
      {
        ...complete,
        expectedLifecycleVersions: [
          complete.expectedLifecycleVersions[0],
          complete.expectedLifecycleVersions[0],
        ],
      },
      "INVALID_COMMAND",
    ],
    [
      "unsorted expectation",
      {
        ...complete,
        expectedLifecycleVersions: [...complete.expectedLifecycleVersions].reverse(),
      },
      "INVALID_COMMAND",
    ],
  ];
  for (const [name, value, reason] of malformedCases) {
    const staleFake = createFakeAdapter(staleRecords);
    const result = await createProgramActivationSupersessionService(staleFake.adapter).execute(
      value,
    );
    assert.equal(result.kind, "REJECTED", name);
    if (result.kind === "REJECTED") {
      assert.equal(result.reason, reason, name);
    }
    assert.equal(staleFake.mutationCalls, 0, name);
  }

  const activeRows = [
    record(),
    record({
      programId: ACTIVE_ID,
      programCode: "Q3M7Y26-P3",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
    }),
  ];
  const activeMismatch = commandForCandidate(CANDIDATE_ID, activeRows);
  const activeMismatchFake = createFakeAdapter(activeRows);
  const activeMismatchResult = await createProgramActivationSupersessionService(
    activeMismatchFake.adapter,
  ).execute({
    ...activeMismatch,
    expectedLifecycleVersions: activeMismatch.expectedLifecycleVersions.map((item) =>
      item.programId === ACTIVE_ID ? { ...item, lifecycleVersion: 1 } : item,
    ),
  });
  assert.equal(activeMismatchResult.kind, "REJECTED");
  if (activeMismatchResult.kind === "REJECTED") {
    assert.equal(activeMismatchResult.reason, "STALE_STATE");
  }
  assert.equal(activeMismatchFake.mutationCalls, 0);

  const stalePrecedenceRows = [record()];
  const stalePrecedence = commandForRecords(stalePrecedenceRows);
  const stalePrecedenceFake = createFakeAdapter(stalePrecedenceRows);
  const stalePrecedenceResult = await createProgramActivationSupersessionService(
    stalePrecedenceFake.adapter,
  ).execute({
    ...stalePrecedence,
    governingMotions: [{
      ...stalePrecedence.governingMotions[0],
      ratificationState: "NOT_RATIFIED",
    }],
    expectedLifecycleVersions: [{ programId: CANDIDATE_ID, lifecycleVersion: 1 }],
  });
  assert.equal(stalePrecedenceResult.kind, "REJECTED");
  if (stalePrecedenceResult.kind === "REJECTED") {
    assert.equal(stalePrecedenceResult.reason, "STALE_STATE");
  }
  assert.equal(stalePrecedenceFake.mutationCalls, 0);

  for (const version of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, Number.NaN, Infinity, "0"] as const) {
    await assertInvalidCommand(
      {
        ...command(),
        expectedLifecycleVersions: [{ programId: CANDIDATE_ID, lifecycleVersion: version }],
      },
      `invalid expected version ${String(version)}`,
    );
  }

  const exhausted = createFakeAdapter([
    record({ lifecycleVersion: MAX_PROGRAM_LIFECYCLE_VERSION }),
  ]);
  const exhaustedResult = await createProgramActivationSupersessionService(
    exhausted.adapter,
  ).execute(commandForRecords(exhausted.committedRecords));
  assert.equal(exhaustedResult.kind, "REJECTED");
  if (exhaustedResult.kind === "REJECTED") {
    assert.equal(exhaustedResult.reason, "VERSION_EXHAUSTED");
    assert.equal(exhaustedResult.writeEffect, "NONE");
  }
  assert.equal(exhausted.mutationCalls, 0);

  const exhaustedActive = createFakeAdapter([
    record(),
    record({
      programId: ACTIVE_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
      lifecycleVersion: MAX_PROGRAM_LIFECYCLE_VERSION,
    }),
  ]);
  const exhaustedActiveResult = await createProgramActivationSupersessionService(
    exhaustedActive.adapter,
  ).execute(commandForRecords(exhaustedActive.committedRecords));
  assert.deepEqual(exhaustedActiveResult, {
    kind: "REJECTED",
    writeEffect: "NONE",
    reason: "VERSION_EXHAUSTED",
    records: [],
  });
  assert.equal(exhaustedActive.mutationCalls, 0);

  const unrelatedMaximumRows = [
    record(),
    record({
      programId: OTHER_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "CLOSED_ACCEPTED",
      lifecycleVersion: MAX_PROGRAM_LIFECYCLE_VERSION,
    }),
  ];
  const unrelatedMaximum = createFakeAdapter(unrelatedMaximumRows);
  const unrelatedMaximumResult = await createProgramActivationSupersessionService(
    unrelatedMaximum.adapter,
  ).execute(commandForRecords(unrelatedMaximumRows));
  assert.equal(unrelatedMaximumResult.kind, "COMMITTED");
  if (unrelatedMaximumResult.kind === "COMMITTED") {
    assert.equal(
      unrelatedMaximumResult.records.find((item) => item.programId === OTHER_ID)
        ?.lifecycleVersion,
      MAX_PROGRAM_LIFECYCLE_VERSION,
    );
  }
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
    [
      "unchanged mutated version",
      (rows) => rows.map((item) =>
        item.programId === CANDIDATE_ID ? { ...item, lifecycleVersion: 0 } : item,
      ),
    ],
    [
      "mutated version increment greater than one",
      (rows) => rows.map((item) =>
        item.programId === CANDIDATE_ID ? { ...item, lifecycleVersion: 2 } : item,
      ),
    ],
    [
      "unrelated version drift",
      (rows) => rows.map((item) =>
        item.programId === OTHER_ID ? { ...item, lifecycleVersion: 1 } : item,
      ),
    ],
  ];

  for (const [name, transform] of transforms) {
    const fake = createFakeAdapter(zeroActiveRows, "NONE", transform);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      commandForRecords(zeroActiveRows),
    );
    assert.equal(result.kind, "UNAVAILABLE", name);
    if (result.kind === "UNAVAILABLE") {
      assert.equal(result.classification, "MALFORMED_TRANSACTION_RESULT", name);
      assert.equal(result.writeEffect, "UNKNOWN", name);
    }
    assert.equal(fake.mutationCalls, 1, name);
  }

  const supersessionRows = [
    record(),
    record({
      programId: ACTIVE_ID,
      programCode: "Q3M7Y26-P2",
      lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY",
    }),
    record({
      programId: OTHER_ID,
      programCode: "Q3M7Y26-P3",
      lifecycleState: "CLOSED_ACCEPTED",
    }),
  ];
  for (const [name, transform] of [
    [
      "superseded version unchanged",
      (rows: readonly PersistedProgramLifecycleRecord[]) => rows.map((item) =>
        item.programId === ACTIVE_ID ? { ...item, lifecycleVersion: 0 } : item,
      ),
    ],
    [
      "superseded version increment greater than one",
      (rows: readonly PersistedProgramLifecycleRecord[]) => rows.map((item) =>
        item.programId === ACTIVE_ID ? { ...item, lifecycleVersion: 2 } : item,
      ),
    ],
  ] as const) {
    const fake = createFakeAdapter(supersessionRows, "NONE", transform);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      commandForRecords(supersessionRows),
    );
    assert.deepEqual(result, {
      kind: "UNAVAILABLE",
      writeEffect: "UNKNOWN",
      classification: "MALFORMED_TRANSACTION_RESULT",
      records: [],
    }, name);
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
      commandForRecords(supersessionRows),
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

  for (const [fault, writeEffect] of [
    ["CAS_MISS", "NONE"],
    ["CAS_MISS_AFTER_HOLD", "UNKNOWN"],
  ] as const) {
    const fake = createFakeAdapter(supersessionRows, fault);
    const before = JSON.stringify(fake.committedRecords);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      commandForRecords(supersessionRows),
    );
    assert.equal(result.kind, "UNAVAILABLE");
    if (result.kind === "UNAVAILABLE") {
      assert.equal(result.classification, "CONCURRENCY_CONFLICT");
      assert.equal(result.writeEffect, writeEffect);
    }
    assert.equal(JSON.stringify(fake.committedRecords), before);
  }

  for (const fault of [
    "CONFIRMED_CAS_MISS",
    "CONFIRMED_CAS_MISS_AFTER_HOLD",
  ] as const) {
    const fake = createFakeAdapter(supersessionRows, fault);
    const before = JSON.stringify(fake.committedRecords);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      commandForRecords(supersessionRows),
    );
    assert.deepEqual(result, {
      kind: "UNAVAILABLE",
      writeEffect: "NONE",
      classification: "CONCURRENCY_CONFLICT",
      records: [],
    });
    assert.equal(JSON.stringify(fake.committedRecords), before);
  }

  for (const fault of [
    "BETWEEN_HOLD_AND_OPEN",
    "AFTER_SECOND_UPDATE",
    "MALFORMED_POST_STATE",
    "MALFORMED_TRANSACTION_RESULT",
  ] as const) {
    const fake = createFakeAdapter(supersessionRows, fault);
    const result = await createProgramActivationSupersessionService(fake.adapter).execute(
      commandForRecords(supersessionRows),
    );
    assert.equal(result.kind, "UNAVAILABLE");
    if (result.kind === "UNAVAILABLE") {
      assert.equal(result.writeEffect, "UNKNOWN");
      if (
        fault === "MALFORMED_POST_STATE" ||
        fault === "MALFORMED_TRANSACTION_RESULT"
      ) {
        assert.equal(result.classification, "MALFORMED_TRANSACTION_RESULT");
      } else {
        assert.equal(result.classification, "ADAPTER_ERROR");
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
  assert.match(
    serverSource,
    /ProgramActivationSupersessionRollbackConfirmedConcurrencyConflictError/,
  );
  assert.ok(
    serverSource.indexOf("catch (error)") > serverSource.indexOf("await prisma.$transaction"),
  );
  assert.match(
    serverSource,
    /catch \(error\)[\s\S]*ProgramActivationSupersessionConcurrencyConflictError[\s\S]*RollbackConfirmedConcurrencyConflictError/,
  );
  assert.match(serverSource, /FOR UPDATE/);
  assert.match(serverSource, /UPDATE "program_lifecycle_records"/);
  assert.match(serverSource, /\$\{programId\}/);
  assert.match(serverSource, /\$\{expectedLifecycleState\}/);
  assert.match(serverSource, /\$\{expectedLifecycleVersion\}/);
  assert.match(serverSource, /\$\{lifecycleState\}/);
  assert.match(serverSource, /"lifecycle_version" = "lifecycle_version" \+ 1/);
  assert.match(serverSource, /"lifecycle_version" = \$\{expectedLifecycleVersion\}/);
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
  await testExpectationVectorsAndDeterministicCompetition();
  await testPostStateCoherenceFailures();
  await testFaultEffectsAndNoPartialSuccess();
  await testAdapterFailuresAreFailClosed();
  testStaticBoundaryAndServerSeams();
}

void run();

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES,
  evaluateProgramActivationEligibility,
  type IneligibleProgramActivationReasonCode,
} from "./program-activation-eligibility-gate";

const candidateProgramId = "synthetic-c4-program-candidate";
const otherProgramId = "synthetic-c4-program-other";
const thirdProgramId = "synthetic-c4-program-third";
const notRoutedState = "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN";

type SyntheticPortfolioRecord = {
  programId: string;
  lifecycleState: string;
};

type SyntheticMotion = {
  motionId: string;
  subjectProgramId: string;
  ratificationState: string;
  decisionState: string;
  mainAcceptanceState: string;
  freshnessState: string;
};

type SyntheticReceipt = {
  receiptType: string;
  receiptInstanceId: string;
  subjectProgramId: string;
  issuanceState: string;
  integrityState: string;
  authenticityState: string;
  issuerAuthorityState: string;
  freshnessState: string;
};

type SyntheticInput = {
  candidateProgramId: string;
  portfolio: unknown;
  governingMotions: SyntheticMotion[];
  receipts: SyntheticReceipt[];
};

function createPortfolio(
  candidateState = notRoutedState,
  otherState = "CLOSED_ACCEPTED",
): SyntheticPortfolioRecord[] {
  return [
    { programId: candidateProgramId, lifecycleState: candidateState },
    { programId: otherProgramId, lifecycleState: otherState },
  ];
}

function createGoverningMotion(
  overrides: Partial<SyntheticMotion> = {},
): SyntheticMotion {
  return {
    motionId: "synthetic-c4-motion-opening",
    subjectProgramId: candidateProgramId,
    ratificationState: "RATIFIED",
    decisionState: "PASS",
    mainAcceptanceState: "ACCEPTED_ON_MAIN",
    freshnessState: "CURRENT",
    ...overrides,
  };
}

function createReceipt(
  receiptType: "MAIN_STATE_RECEIPT" | "PROGRAM_OPENING_RECEIPT",
  overrides: Partial<SyntheticReceipt> = {},
): SyntheticReceipt {
  return {
    receiptType,
    receiptInstanceId:
      receiptType === "MAIN_STATE_RECEIPT"
        ? "synthetic-c4-main-state-receipt"
        : "synthetic-c4-program-opening-receipt",
    subjectProgramId: candidateProgramId,
    issuanceState: "ISSUED",
    integrityState: "VERIFIED",
    authenticityState: "VERIFIED",
    issuerAuthorityState: "ESTABLISHED",
    freshnessState: "CURRENT",
    ...overrides,
  };
}

function createEligibleInput(
  overrides: Partial<SyntheticInput> = {},
): SyntheticInput {
  return {
    candidateProgramId: overrides.candidateProgramId ?? candidateProgramId,
    portfolio: overrides.portfolio ?? createPortfolio(),
    governingMotions: overrides.governingMotions ?? [createGoverningMotion()],
    receipts: overrides.receipts ?? [
      createReceipt("MAIN_STATE_RECEIPT"),
      createReceipt("PROGRAM_OPENING_RECEIPT"),
    ],
  };
}

function expectInvalid(value: unknown) {
  const result = evaluateProgramActivationEligibility(value);
  assert.deepEqual(result, {
    kind: "INVALID_INPUT",
    eligible: false,
    classificationOnly: true,
    reasonCodes: ["INVALID_INPUT"],
    transitionId: null,
    activationAuthorized: false,
    activationPerformed: false,
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.reasonCodes), true);
}

function expectIneligible(
  value: unknown,
  expectedReasonCodes: readonly IneligibleProgramActivationReasonCode[],
) {
  const result = evaluateProgramActivationEligibility(value);
  assert.equal(result.kind, "INELIGIBLE");
  if (result.kind !== "INELIGIBLE") {
    return;
  }
  assert.deepEqual(result, {
    kind: "INELIGIBLE",
    eligible: false,
    classificationOnly: true,
    reasonCodes: expectedReasonCodes,
    transitionId: null,
    activationAuthorized: false,
    activationPerformed: false,
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.reasonCodes), true);
}

function replaceReceipt(
  input: SyntheticInput,
  receiptType: "MAIN_STATE_RECEIPT" | "PROGRAM_OPENING_RECEIPT",
  overrides: Partial<SyntheticReceipt>,
): SyntheticInput {
  return createEligibleInput({
    ...input,
    receipts: input.receipts.map((receipt) =>
      receipt.receiptType === receiptType
        ? { ...receipt, ...overrides }
        : receipt,
    ),
  });
}

function testReasonCodeVocabularyIsExactAndFrozen() {
  assert.deepEqual(PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES, [
    "INVALID_INPUT",
    "ACTIVE_PROGRAM_PRESENT",
    "MULTIPLE_ACTIVE_PROGRAMS",
    "CANDIDATE_NOT_FOUND",
    "CANDIDATE_TRANSITION_NOT_LISTED",
    "GOVERNING_MOTION_MISSING",
    "GOVERNING_MOTION_CONFLICT",
    "GOVERNING_MOTION_SUBJECT_MISMATCH",
    "GOVERNING_MOTION_NOT_RATIFIED",
    "GOVERNING_MOTION_NON_PASS",
    "GOVERNING_MOTION_NOT_ACCEPTED_ON_MAIN",
    "GOVERNING_MOTION_NOT_CURRENT",
    "MAIN_STATE_RECEIPT_MISSING",
    "MAIN_STATE_RECEIPT_DUPLICATE",
    "PROGRAM_OPENING_RECEIPT_MISSING",
    "PROGRAM_OPENING_RECEIPT_DUPLICATE",
    "RECEIPT_SUBJECT_MISMATCH",
    "RECEIPT_INSTANCE_ID_MISSING",
    "RECEIPT_NOT_ISSUED",
    "RECEIPT_INTEGRITY_NOT_VERIFIED",
    "RECEIPT_AUTHENTICITY_NOT_VERIFIED",
    "RECEIPT_ISSUER_AUTHORITY_NOT_ESTABLISHED",
    "RECEIPT_NOT_CURRENT",
    "ALL_PREREQUISITES_SATISFIED",
  ]);
  assert.equal(PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES.length, 24);
  assert.equal(Object.isFrozen(PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES), true);
  assert.throws(
    () => {
      (PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES as unknown as string[]).push(
        "UNLISTED_REASON",
      );
    },
    TypeError,
  );
  assert.equal(PROGRAM_ACTIVATION_ELIGIBILITY_REASON_CODES.length, 24);
}

function testFullySyntheticEligibleFixture() {
  const result = evaluateProgramActivationEligibility(createEligibleInput());
  assert.deepEqual(result, {
    kind: "ELIGIBLE",
    eligible: true,
    classificationOnly: true,
    reasonCodes: ["ALL_PREREQUISITES_SATISFIED"],
    transitionId: "B1-TR-027",
    activationAuthorized: false,
    activationPerformed: false,
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.reasonCodes), true);
}

function testC2PortfolioOutcomesAndCandidateBinding() {
  expectIneligible(
    createEligibleInput({
      portfolio: createPortfolio(undefined, "OPEN_FOR_BATCH_PLANNING_ONLY"),
    }),
    ["ACTIVE_PROGRAM_PRESENT"],
  );
  expectIneligible(
    createEligibleInput({
      portfolio: [
        { programId: candidateProgramId, lifecycleState: notRoutedState },
        { programId: otherProgramId, lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
        { programId: thirdProgramId, lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY" },
      ],
    }),
    ["MULTIPLE_ACTIVE_PROGRAMS"],
  );
  expectInvalid(
    createEligibleInput({
      portfolio: [
        { programId: candidateProgramId, lifecycleState: "CLOSED_ACCEPTED" },
        { programId: candidateProgramId, lifecycleState: notRoutedState },
      ],
    }),
  );
  const missingCandidateId = "synthetic-c4-program-missing";
  expectIneligible(
    createEligibleInput({
      candidateProgramId: missingCandidateId,
      governingMotions: [
        createGoverningMotion({ subjectProgramId: missingCandidateId }),
      ],
      receipts: [
        createReceipt("MAIN_STATE_RECEIPT", { subjectProgramId: missingCandidateId }),
        createReceipt("PROGRAM_OPENING_RECEIPT", { subjectProgramId: missingCandidateId }),
      ],
    }),
    ["CANDIDATE_NOT_FOUND"],
  );
}

function testCandidateItselfActiveAggregatesTransitionFailure() {
  expectIneligible(
    createEligibleInput({
      portfolio: createPortfolio("OPEN_FOR_BATCH_PLANNING_ONLY"),
    }),
    ["ACTIVE_PROGRAM_PRESENT", "CANDIDATE_TRANSITION_NOT_LISTED"],
  );
}

function testAggregatesMissingCandidateAndEvidenceFailures() {
  expectIneligible(
    createEligibleInput({ candidateProgramId: "synthetic-c4-program-missing" }),
    [
      "CANDIDATE_NOT_FOUND",
      "GOVERNING_MOTION_SUBJECT_MISMATCH",
      "MAIN_STATE_RECEIPT_MISSING",
      "PROGRAM_OPENING_RECEIPT_MISSING",
      "RECEIPT_SUBJECT_MISMATCH",
    ],
  );
}

function testAggregatesActiveCandidateAndAbsentEvidence() {
  expectIneligible(
    createEligibleInput({
      portfolio: createPortfolio("OPEN_FOR_BATCH_PLANNING_ONLY"),
      governingMotions: [],
      receipts: [],
    }),
    [
      "ACTIVE_PROGRAM_PRESENT",
      "CANDIDATE_TRANSITION_NOT_LISTED",
      "GOVERNING_MOTION_MISSING",
      "MAIN_STATE_RECEIPT_MISSING",
      "PROGRAM_OPENING_RECEIPT_MISSING",
    ],
  );
}

function testCandidateTransitionMustBeB1OpeningTransition() {
  expectIneligible(
    createEligibleInput({ portfolio: createPortfolio("UNRESOLVED_HOLD") }),
    ["CANDIDATE_TRANSITION_NOT_LISTED"],
  );
  for (const terminalState of [
    "CLOSED_ACCEPTED",
    "CLOSED_NO_GO",
    "CANCELLED",
    "FAILED",
  ]) {
    expectIneligible(
      createEligibleInput({ portfolio: createPortfolio(terminalState) }),
      ["CANDIDATE_TRANSITION_NOT_LISTED"],
    );
  }
}

function testGoverningMotionRequirements() {
  const input = createEligibleInput();
  expectIneligible(
    createEligibleInput({ governingMotions: [] }),
    ["GOVERNING_MOTION_MISSING"],
  );
  expectIneligible(
    createEligibleInput({
      governingMotions: [
        createGoverningMotion(),
        createGoverningMotion({ motionId: "synthetic-c4-motion-duplicate" }),
      ],
    }),
    ["GOVERNING_MOTION_CONFLICT"],
  );
  expectIneligible(
    createEligibleInput({
      governingMotions: [createGoverningMotion({ subjectProgramId: otherProgramId })],
    }),
    ["GOVERNING_MOTION_SUBJECT_MISMATCH"],
  );
  expectIneligible(
    createEligibleInput({
      governingMotions: [createGoverningMotion({ ratificationState: "NOT_RATIFIED" })],
    }),
    ["GOVERNING_MOTION_NOT_RATIFIED"],
  );
  expectIneligible(
    createEligibleInput({
      governingMotions: [createGoverningMotion({ decisionState: "NON_PASS" })],
    }),
    ["GOVERNING_MOTION_NON_PASS"],
  );
  expectIneligible(
    createEligibleInput({
      governingMotions: [
        createGoverningMotion({ mainAcceptanceState: "NOT_ACCEPTED_ON_MAIN" }),
      ],
    }),
    ["GOVERNING_MOTION_NOT_ACCEPTED_ON_MAIN"],
  );
  for (const freshnessState of ["STALE", "UNAVAILABLE"]) {
    expectIneligible(
      createEligibleInput({
        governingMotions: [createGoverningMotion({ freshnessState })],
      }),
      ["GOVERNING_MOTION_NOT_CURRENT"],
    );
  }

  assert.equal(input.governingMotions.length, 1);
}

function testRequiredReceiptRequirements() {
  const base = createEligibleInput();
  const requirements = [
    ["MAIN_STATE_RECEIPT", "MAIN_STATE_RECEIPT_MISSING", "MAIN_STATE_RECEIPT_DUPLICATE"],
    [
      "PROGRAM_OPENING_RECEIPT",
      "PROGRAM_OPENING_RECEIPT_MISSING",
      "PROGRAM_OPENING_RECEIPT_DUPLICATE",
    ],
  ] as const;

  for (const [receiptType, missingReason, duplicateReason] of requirements) {
    expectIneligible(
      createEligibleInput({
        receipts: base.receipts.filter((receipt) => receipt.receiptType !== receiptType),
      }),
      [missingReason],
    );
    expectIneligible(
      createEligibleInput({
        receipts: [
          ...base.receipts,
          createReceipt(receiptType, {
            receiptInstanceId: `synthetic-c4-duplicate-${receiptType}`,
          }),
        ],
      }),
      [duplicateReason],
    );
    expectIneligible(
      replaceReceipt(base, receiptType, { subjectProgramId: otherProgramId }),
      [missingReason, "RECEIPT_SUBJECT_MISMATCH"],
    );
    for (const receiptInstanceId of ["", " \t\n"]) {
      expectIneligible(
        replaceReceipt(base, receiptType, { receiptInstanceId }),
        ["RECEIPT_INSTANCE_ID_MISSING"],
      );
    }
    for (const issuanceState of ["NOT_ISSUED", "INVALID"]) {
      expectIneligible(
        replaceReceipt(base, receiptType, { issuanceState }),
        ["RECEIPT_NOT_ISSUED"],
      );
    }
    for (const integrityState of ["UNVERIFIED", "INVALID"]) {
      expectIneligible(
        replaceReceipt(base, receiptType, { integrityState }),
        ["RECEIPT_INTEGRITY_NOT_VERIFIED"],
      );
    }
    for (const authenticityState of ["NOT_ESTABLISHED", "INVALID"]) {
      expectIneligible(
        replaceReceipt(base, receiptType, { authenticityState }),
        ["RECEIPT_AUTHENTICITY_NOT_VERIFIED"],
      );
    }
    for (const issuerAuthorityState of ["NOT_ESTABLISHED", "INVALID"]) {
      expectIneligible(
        replaceReceipt(base, receiptType, { issuerAuthorityState }),
        ["RECEIPT_ISSUER_AUTHORITY_NOT_ESTABLISHED"],
      );
    }
    for (const freshnessState of ["STALE", "UNAVAILABLE"]) {
      expectIneligible(
        replaceReceipt(base, receiptType, { freshnessState }),
        ["RECEIPT_NOT_CURRENT"],
      );
    }
  }
}

function testWrongSubjectReceiptValuesStillAggregate() {
  expectIneligible(
    createEligibleInput({
      receipts: [
        createReceipt("MAIN_STATE_RECEIPT", {
          subjectProgramId: otherProgramId,
          issuanceState: "NOT_ISSUED",
        }),
        createReceipt("PROGRAM_OPENING_RECEIPT"),
      ],
    }),
    [
      "MAIN_STATE_RECEIPT_MISSING",
      "RECEIPT_SUBJECT_MISMATCH",
      "RECEIPT_NOT_ISSUED",
    ],
  );
}

function testReasonOrderAndDeduplication() {
  const badMotions = [
    createGoverningMotion({
      motionId: "synthetic-c4-motion-other",
      subjectProgramId: otherProgramId,
      ratificationState: "NOT_RATIFIED",
      decisionState: "NON_PASS",
      mainAcceptanceState: "NOT_ACCEPTED_ON_MAIN",
      freshnessState: "STALE",
    }),
    createGoverningMotion({
      motionId: "synthetic-c4-motion-candidate",
      ratificationState: "NOT_RATIFIED",
      decisionState: "NON_PASS",
      mainAcceptanceState: "NOT_ACCEPTED_ON_MAIN",
      freshnessState: "UNAVAILABLE",
    }),
  ];
  const badReceipts = [
    createReceipt("MAIN_STATE_RECEIPT", {
      receiptInstanceId: "",
      issuanceState: "NOT_ISSUED",
      integrityState: "UNVERIFIED",
      authenticityState: "NOT_ESTABLISHED",
      issuerAuthorityState: "NOT_ESTABLISHED",
      freshnessState: "STALE",
    }),
    createReceipt("PROGRAM_OPENING_RECEIPT", {
      receiptInstanceId: " \t",
      issuanceState: "INVALID",
      integrityState: "INVALID",
      authenticityState: "INVALID",
      issuerAuthorityState: "INVALID",
      freshnessState: "UNAVAILABLE",
    }),
  ];
  const expected = [
    "GOVERNING_MOTION_CONFLICT",
    "GOVERNING_MOTION_SUBJECT_MISMATCH",
    "GOVERNING_MOTION_NOT_RATIFIED",
    "GOVERNING_MOTION_NON_PASS",
    "GOVERNING_MOTION_NOT_ACCEPTED_ON_MAIN",
    "GOVERNING_MOTION_NOT_CURRENT",
    "RECEIPT_INSTANCE_ID_MISSING",
    "RECEIPT_NOT_ISSUED",
    "RECEIPT_INTEGRITY_NOT_VERIFIED",
    "RECEIPT_AUTHENTICITY_NOT_VERIFIED",
    "RECEIPT_ISSUER_AUTHORITY_NOT_ESTABLISHED",
    "RECEIPT_NOT_CURRENT",
  ] as const;
  const first = evaluateProgramActivationEligibility(
    createEligibleInput({ governingMotions: badMotions, receipts: badReceipts }),
  );
  const second = evaluateProgramActivationEligibility(
    createEligibleInput({
      governingMotions: [...badMotions].reverse(),
      receipts: [...badReceipts].reverse(),
    }),
  );

  assert.equal(first.kind, "INELIGIBLE");
  assert.equal(second.kind, "INELIGIBLE");
  assert.deepEqual(first, second);
  if (first.kind !== "INELIGIBLE") {
    return;
  }
  assert.deepEqual(first.reasonCodes, expected);
  assert.equal(new Set(first.reasonCodes).size, first.reasonCodes.length);
}

function testDescriptorSnapshotBoundaryAndDeepNonFreezing() {
  let proxyGetCount = 0;
  const proxyRecord = new Proxy(
    { programId: candidateProgramId, lifecycleState: notRoutedState },
    {
      get(target, property, receiver) {
        proxyGetCount += 1;
        return Reflect.get(target, property, receiver);
      },
    },
  );
  const input = createEligibleInput({
    portfolio: [proxyRecord, { programId: otherProgramId, lifecycleState: "CLOSED_ACCEPTED" }],
  });
  const result = evaluateProgramActivationEligibility(input);
  assert.equal(result.kind, "ELIGIBLE");
  assert.equal(proxyGetCount, 0);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(input.portfolio), false);
  assert.equal(Object.isFrozen(input.governingMotions), false);
  assert.equal(Object.isFrozen(input.receipts), false);
  assert.equal(Object.isFrozen(proxyRecord), false);
  assert.equal(Object.isFrozen(input.governingMotions[0]), false);
  assert.equal(Object.isFrozen(input.receipts[0]), false);
  assert.equal(Object.isFrozen(input.receipts[1]), false);
}

function testInvalidInputHardening() {
  const eligible = createEligibleInput();
  expectInvalid(
    createEligibleInput({
      candidateProgramId: " \t\n",
    }),
  );
  expectInvalid(
    createEligibleInput({
      governingMotions: [createGoverningMotion({ motionId: " \t\n" })],
    }),
  );
  expectInvalid(
    createEligibleInput({
      governingMotions: [createGoverningMotion({ ratificationState: "UNKNOWN" })],
    }),
  );
  expectInvalid(
    createEligibleInput({
      governingMotions: [
        { ...createGoverningMotion(), unexpected: true } as unknown as SyntheticMotion,
      ],
    }),
  );
  const { freshnessState: omittedFreshnessState, ...motionWithoutFreshnessState } =
    createGoverningMotion();
  assert.equal(omittedFreshnessState, "CURRENT");
  expectInvalid(
    createEligibleInput({
      governingMotions: [motionWithoutFreshnessState as unknown as SyntheticMotion],
    }),
  );
  expectInvalid(
    createEligibleInput({ candidateProgramId: 7 as unknown as string }),
  );
  expectInvalid(
    createEligibleInput({
      governingMotions: [
        createGoverningMotion({ motionId: 7 as unknown as string }),
      ],
    }),
  );
  expectInvalid(
    createEligibleInput({
      receipts: [
        createReceipt("MAIN_STATE_RECEIPT", { issuanceState: "UNKNOWN" }),
        createReceipt("PROGRAM_OPENING_RECEIPT"),
      ],
    }),
  );
  expectIneligible(
    createEligibleInput({
      receipts: [
        createReceipt("MAIN_STATE_RECEIPT", { issuanceState: "INVALID" }),
        createReceipt("PROGRAM_OPENING_RECEIPT"),
      ],
    }),
    ["RECEIPT_NOT_ISSUED"],
  );
  expectInvalid({ ...eligible, unexpected: true });
  expectInvalid({ ...eligible, [Symbol("synthetic-c4-extra")]: true });

  let topLevelAccessorRead = false;
  const topLevelAccessorInput = Object.defineProperties({}, {
    candidateProgramId: {
      enumerable: true,
      get() {
        topLevelAccessorRead = true;
        return candidateProgramId;
      },
    },
    portfolio: { enumerable: true, value: createPortfolio() },
    governingMotions: { enumerable: true, value: [createGoverningMotion()] },
    receipts: {
      enumerable: true,
      value: [
        createReceipt("MAIN_STATE_RECEIPT"),
        createReceipt("PROGRAM_OPENING_RECEIPT"),
      ],
    },
  });
  expectInvalid(topLevelAccessorInput);
  assert.equal(topLevelAccessorRead, false);

  expectInvalid({
    portfolio: createPortfolio(),
    candidateProgramId,
    governingMotions: [createGoverningMotion()],
    receipts: [
      createReceipt("MAIN_STATE_RECEIPT"),
      createReceipt("PROGRAM_OPENING_RECEIPT"),
    ],
  });
  expectInvalid({
    candidateProgramId,
    portfolio: createPortfolio(),
    governingMotions: [createGoverningMotion()],
  });

  const paddedId = ` ${candidateProgramId} `;
  const paddedResult = evaluateProgramActivationEligibility(
    createEligibleInput({
      candidateProgramId: paddedId,
      portfolio: [
        { programId: paddedId, lifecycleState: notRoutedState },
        { programId: otherProgramId, lifecycleState: "CLOSED_ACCEPTED" },
      ],
      governingMotions: [createGoverningMotion({ subjectProgramId: paddedId })],
      receipts: [
        createReceipt("MAIN_STATE_RECEIPT", { subjectProgramId: paddedId }),
        createReceipt("PROGRAM_OPENING_RECEIPT", { subjectProgramId: paddedId }),
      ],
    }),
  );
  assert.equal(paddedResult.kind, "ELIGIBLE");

  const symbolCases: Array<[keyof SyntheticInput, object]> = [
    [
      "portfolio",
      Object.assign(
        { programId: candidateProgramId, lifecycleState: notRoutedState },
        { [Symbol("synthetic-c4-portfolio")]: true },
      ),
    ],
    [
      "governingMotions",
      Object.assign(createGoverningMotion(), { [Symbol("synthetic-c4-motion")]: true }),
    ],
    [
      "receipts",
      Object.assign(createReceipt("MAIN_STATE_RECEIPT"), { [Symbol("synthetic-c4-receipt")]: true }),
    ],
  ];
  for (const [field, record] of symbolCases) {
    const input = createEligibleInput();
    if (field === "portfolio") {
      input.portfolio = [record, { programId: otherProgramId, lifecycleState: "CLOSED_ACCEPTED" }];
    } else if (field === "governingMotions") {
      input.governingMotions = [record as SyntheticMotion];
    } else {
      input.receipts = [record as SyntheticReceipt, createReceipt("PROGRAM_OPENING_RECEIPT")];
    }
    expectInvalid(input);
  }

  for (const [field, record] of [
    ["portfolio", { programId: candidateProgramId, lifecycleState: notRoutedState }],
    ["governingMotions", createGoverningMotion()],
    ["receipts", createReceipt("MAIN_STATE_RECEIPT")],
  ] as const) {
    let accessorRead = false;
    Object.defineProperty(record, "programId" in record ? "programId" : "motionId" in record ? "motionId" : "receiptInstanceId", {
      enumerable: true,
      get() {
        accessorRead = true;
        return "synthetic-c4-accessor";
      },
    });
    const input = createEligibleInput();
    if (field === "portfolio") {
      input.portfolio = [record, { programId: otherProgramId, lifecycleState: "CLOSED_ACCEPTED" }];
    } else if (field === "governingMotions") {
      input.governingMotions = [record as SyntheticMotion];
    } else {
      input.receipts = [record as SyntheticReceipt, createReceipt("PROGRAM_OPENING_RECEIPT")];
    }
    expectInvalid(input);
    assert.equal(accessorRead, false);
  }

  const sparsePortfolio = createPortfolio();
  delete sparsePortfolio[1];
  expectInvalid(createEligibleInput({ portfolio: sparsePortfolio }));
  const accessorMotions = [createGoverningMotion()];
  Object.defineProperty(accessorMotions, "0", {
    enumerable: true,
    configurable: true,
    get() {
      throw new Error("array accessor must remain unread");
    },
  });
  expectInvalid(createEligibleInput({ governingMotions: accessorMotions }));
  for (const field of ["portfolio", "governingMotions", "receipts"] as const) {
    const input = createEligibleInput();
    const array = field === "portfolio"
      ? createPortfolio()
      : field === "governingMotions"
        ? [createGoverningMotion()]
        : [createReceipt("MAIN_STATE_RECEIPT"), createReceipt("PROGRAM_OPENING_RECEIPT")];
    Object.defineProperty(array, "extra", { value: true });
    if (field === "portfolio") {
      input.portfolio = array;
    } else if (field === "governingMotions") {
      input.governingMotions = array as SyntheticMotion[];
    } else {
      input.receipts = array as SyntheticReceipt[];
    }
    expectInvalid(input);
  }

  const duplicateOwnKeyEquivalent = new Proxy(createEligibleInput(), {
    ownKeys() {
      return ["candidateProgramId", "candidateProgramId"];
    },
  });
  expectInvalid(duplicateOwnKeyEquivalent);
}

function testNoCallerMutationAndDeepNonFreezing() {
  const input = createEligibleInput();
  const before = structuredClone(input);
  const result = evaluateProgramActivationEligibility(input);
  assert.equal(result.kind, "ELIGIBLE");
  assert.deepEqual(input, before);
  assert.equal(Object.isFrozen(input), false);
  assert.equal(Object.isFrozen(input.portfolio), false);
  assert.equal(Object.isFrozen(input.governingMotions), false);
  assert.equal(Object.isFrozen(input.receipts), false);
  assert.equal(Object.isFrozen((input.portfolio as SyntheticPortfolioRecord[])[0]), false);
  assert.equal(Object.isFrozen(input.governingMotions[0]), false);
  assert.equal(Object.isFrozen(input.receipts[0]), false);
  assert.equal(Object.isFrozen(input.receipts[1]), false);
}

function testNoResultAuthorizesOrPerformsActivation() {
  const results = [
    evaluateProgramActivationEligibility(createEligibleInput()),
    evaluateProgramActivationEligibility(
      createEligibleInput({ portfolio: createPortfolio("UNRESOLVED_HOLD") }),
    ),
    evaluateProgramActivationEligibility(null),
  ];

  for (const result of results) {
    assert.equal(result.classificationOnly, true);
    assert.equal(result.activationAuthorized, false);
    assert.equal(result.activationPerformed, false);
    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result.reasonCodes), true);
  }
}

function testProductionDependencyAndLiteralBoundary() {
  const source = readFileSync(
    new URL("./program-activation-eligibility-gate.ts", import.meta.url),
    "utf8",
  );
  const fromImports = [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  const sideEffectImports = [
    ...source.matchAll(/^\s*import\s+["']([^"']+)["'];?\s*$/gm),
  ].map((match) => match[1]);

  assert.deepEqual(fromImports, [
    "./canonical-active-program-resolver",
    "./program-state-transition-matrix",
  ]);
  assert.deepEqual(sideEffectImports, []);
  assert.equal(/\bimport\s*\(/.test(source), false);
  assert.equal(/\brequire\s*\(/.test(source), false);
  assert.equal(/\bMath\s*\.\s*random\b/.test(source), false);
  assert.equal(/\bDate\s*(?:\.|\()/.test(source), false);
  assert.equal(/\bnew\s+Date\s*\(/.test(source), false);
  for (const lifecycleState of [
    "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN",
    "OPEN_FOR_BATCH_PLANNING_ONLY",
    "UNRESOLVED_HOLD",
    "CLOSED_ACCEPTED",
    "CLOSED_NO_GO",
    "CANCELLED",
    "FAILED",
  ]) {
    assert.equal(source.includes(lifecycleState), false);
  }
  for (const prohibited of [
    "server-only",
    "node:",
    "readFile",
    "process.env",
    "setTimeout",
    "setInterval",
    "localStorage",
    "sessionStorage",
    "WebSocket",
    "XMLHttpRequest",
    "crypto",
    "prisma",
    "fetch(",
    "database",
    "filesystem",
    "network",
    "github",
    "linear",
    "authentication",
    "customer",
    "agent",
    "council",
    "provider",
    "deployment",
    "persistence",
  ]) {
    assert.equal(
      source.toLowerCase().includes(prohibited.toLowerCase()),
      false,
      `Production source must exclude ${prohibited}`,
    );
  }
}

function run() {
  testReasonCodeVocabularyIsExactAndFrozen();
  testFullySyntheticEligibleFixture();
  testC2PortfolioOutcomesAndCandidateBinding();
  testCandidateItselfActiveAggregatesTransitionFailure();
  testAggregatesMissingCandidateAndEvidenceFailures();
  testAggregatesActiveCandidateAndAbsentEvidence();
  testCandidateTransitionMustBeB1OpeningTransition();
  testGoverningMotionRequirements();
  testRequiredReceiptRequirements();
  testWrongSubjectReceiptValuesStillAggregate();
  testReasonOrderAndDeduplication();
  testDescriptorSnapshotBoundaryAndDeepNonFreezing();
  testInvalidInputHardening();
  testNoCallerMutationAndDeepNonFreezing();
  testNoResultAuthorizesOrPerformsActivation();
  testProductionDependencyAndLiteralBoundary();
}

run();

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { encode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

import {
  LOCAL_OPERATING_LOOP_FINDING_ORDER,
  LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS,
  LOCAL_OPERATING_LOOP_PAGEHIDE_COPY,
  LOCAL_OPERATING_LOOP_PHASE_COPY,
  LOCAL_OPERATING_LOOP_PROOF_VERIFICATION_BOUNDARY,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL,
  LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
  LOCAL_OPERATING_LOOP_RESTORED_COPY,
  LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY,
  LOCAL_OPERATING_LOOP_TERMINAL_PRESENTATION_UNAVAILABLE_COPY,
  applyLocalOperatingLoopBrowserLifecycle,
  canonicalizeLocalOperatingLoopValue,
  classifyLocalOperatingLoopClientResponse,
  createFounderSafeLocalOperatingLoopTerminalPresentation,
  createLocalOperatingLoopProofStatus,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopRecommendationExplanation,
  createLocalOperatingLoopRecoveryNotice,
  createLocalOperatingLoopStructuralRemediations,
  createLocalOperatingLoopUiState,
  deriveLocalOperatingLoopRecommendation,
  hashLocalOperatingLoopCanonicalValue,
  invalidateLocalOperatingLoopUiState,
  parseLocalOperatingLoopAction,
  recoverLocalOperatingLoopClientFailure,
  recoverLocalOperatingLoopStructuralFailure,
  shouldApplyLocalOperatingLoopResponse,
  shouldSuspendLocalOperatingLoopForUnstagedDraft,
  type LocalOperatingLoopAction,
  type LocalOperatingLoopContentHasher,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopResponse,
  type LocalOperatingLoopSuccessResponse,
  type LocalOperatingLoopUiState,
} from "./local-operating-loop";
import { createLocalOperatingLoopHandler } from "./local-operating-loop-handler";

const SYNTHETIC_SECRET =
  "synthetic-local-loop-test-secret-with-no-production-authority";
const ADMIN_EMAIL = "founder@example.com";
const routeUrl =
  "http://local.test/api/operator/motion-control/local-operating-loop";
const SYNTHETIC_VALIDATION_PROOF =
  `local-loop.validation.v1.${"c".repeat(64)}`;
const SYNTHETIC_DELIBERATION_PROOF =
  `local-loop.deliberation.v1.${"d".repeat(64)}`;

const genuineGoInput: LocalOperatingLoopInput = {
  motionId: "motion-local-loop-go-fixture",
  title: "Founder local operating loop",
  summary:
    "This complete local-shadow fixture demonstrates deterministic validation, deliberation, and explicit human decision.",
  targetRepo: "dev-jai-nexus",
  targetThreads: ["JAI_CONTROL_THREAD", "JAI_DEV_JAI_NEXUS"],
  evidencePointers: [
    "portal/src/lib/controlPlane/motionKernel/local-operating-loop.test.ts",
  ],
};

const needsRevisionInput: LocalOperatingLoopInput = {
  ...genuineGoInput,
  title: "Short",
  summary: "Too short.",
  evidencePointers: [],
};

const blockedInput: LocalOperatingLoopInput = {
  ...needsRevisionInput,
  targetRepo: "other-repo",
  targetThreads: ["JAI_DEV_JAI_NEXUS"],
};

function clientResponseExpectation(
  request: LocalOperatingLoopAction,
  currentInput: LocalOperatingLoopInput = request.input,
) {
  return {
    request,
    requestProjectionKey:
      createLocalOperatingLoopProjectionKey(request.input),
    currentProjectionKey:
      createLocalOperatingLoopProjectionKey(currentInput),
  };
}

async function classifyClientResponse(
  value: unknown,
  request: LocalOperatingLoopAction = validationRequest(genuineGoInput),
) {
  return classifyLocalOperatingLoopClientResponse(
    value,
    clientResponseExpectation(request),
  );
}

function validationRequest(
  input: LocalOperatingLoopInput,
): LocalOperatingLoopAction {
  return { action: "VALIDATE", input };
}

function deliberationRequest(
  input: LocalOperatingLoopInput,
): LocalOperatingLoopAction {
  return {
    action: "DELIBERATE",
    input,
    validationProof: SYNTHETIC_VALIDATION_PROOF,
  };
}

function decisionRequest(
  input: LocalOperatingLoopInput,
  decision: "ACCEPT" | "HOLD" | "REJECT",
): LocalOperatingLoopAction {
  return {
    action: "DECIDE",
    input,
    decision,
    deliberationProof: SYNTHETIC_DELIBERATION_PROOF,
  };
}

function requestForSuccessResponse(
  response: LocalOperatingLoopSuccessResponse,
  input: LocalOperatingLoopInput,
): LocalOperatingLoopAction {
  if (response.state === "VALIDATED") {
    return validationRequest(input);
  }
  if (response.state === "AWAITING_DECISION") {
    return deliberationRequest(input);
  }
  return decisionRequest(input, response.decision);
}

function mutableClone(value: unknown): Record<string, unknown> {
  return structuredClone(value) as Record<string, unknown>;
}

function nestedRecord(
  value: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const nested = value[key];
  assert.equal(typeof nested, "object");
  assert.notEqual(nested, null);
  assert.equal(Array.isArray(nested), false);
  return nested as Record<string, unknown>;
}

function differentSha256(value: unknown): string {
  assert.equal(typeof value, "string");
  assert.match(value as string, /^[a-f0-9]{64}$/);
  const text = value as string;
  return `${text.startsWith("0") ? "1" : "0"}${text.slice(1)}`;
}

function acceptedUiState(projectionKey: string): LocalOperatingLoopUiState {
  const motionFingerprint = "a".repeat(64);
  const candidatePacketHash = "b".repeat(64);
  return {
    projectionKey,
    state: "ACCEPTED",
    validationProof: `local-loop.validation.v1.${"c".repeat(64)}`,
    deliberationProof: `local-loop.deliberation.v1.${"d".repeat(64)}`,
    recommendation: "GO",
    findingCodes: [],
    workPacket: {
      packet_id: `local-shadow-work-packet-${candidatePacketHash.slice(0, 24)}`,
      packet_version: "local-shadow-work-packet.v1",
      status: "PROPOSED_ONLY",
      base_sha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
      motion_id: genuineGoInput.motionId,
      motion_fingerprint: motionFingerprint,
      title: genuineGoInput.title,
      summary: genuineGoInput.summary,
      target_repo: genuineGoInput.targetRepo,
      target_threads: [...genuineGoInput.targetThreads],
      evidence_pointers: [...genuineGoInput.evidencePointers],
      proposed_by: ADMIN_EMAIL,
      decision_scope: "GENERATE_WORK_PACKET_ONLY",
      execution_authority_granted: false,
      non_authorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
    },
    artifact: {
      artifact_id: `local-shadow-decision-artifact-${candidatePacketHash.slice(0, 24)}`,
      artifact_version: "local-shadow-decision-artifact.v1",
      base_sha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
      motion_id: genuineGoInput.motionId,
      motion_fingerprint: motionFingerprint,
      recommendation: "GO",
      finding_codes: [],
      decision: "ACCEPT",
      actor: ADMIN_EMAIL,
      candidate_packet_hash: candidatePacketHash,
      receipt_authority: "DEMONSTRATION_ONLY",
      persistence: "NONE",
      program_effect: "NONE",
      not_a_control_thread_acceptance_receipt: true,
      decision_scope: "GENERATE_WORK_PACKET_ONLY",
      execution_authority_granted: false,
    },
    activeRequestId: 41,
  };
}

function terminalUiState(
  decision: "ACCEPT" | "HOLD" | "REJECT",
): LocalOperatingLoopUiState {
  const state = acceptedUiState(`terminal-${decision.toLowerCase()}`);
  assert.ok(state.artifact);
  return {
    ...state,
    state:
      decision === "ACCEPT"
        ? "ACCEPTED"
        : decision === "HOLD"
          ? "HELD"
          : "REJECTED",
    workPacket: decision === "ACCEPT" ? state.workPacket : null,
    artifact: {
      ...state.artifact,
      decision,
    },
    activeRequestId: null,
  };
}

async function testStrictStructuralValidationAndNormalization() {
  const parsed = parseLocalOperatingLoopAction({
    action: "VALIDATE",
    input: {
      ...genuineGoInput,
      title: "  Cafe\u0301 founder loop  ",
      summary: "  First line \t\r\nSecond line\t  ",
      evidencePointers: ["  evidence\u0301  "],
    },
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) {
    return;
  }
  assert.equal(parsed.value.input.title, "Café founder loop");
  assert.equal(parsed.value.input.summary, "First line\nSecond line");
  assert.deepEqual(parsed.value.input.evidencePointers, ["evidencé"]);

  const incomplete = parseLocalOperatingLoopAction({
    action: "VALIDATE",
    input: { motionId: "missing-everything-else" },
  });
  assert.equal(incomplete.ok, false);

  const duplicateThreads = parseLocalOperatingLoopAction({
    action: "VALIDATE",
    input: {
      ...genuineGoInput,
      targetThreads: ["JAI_CONTROL_THREAD", "JAI_CONTROL_THREAD"],
    },
  });
  assert.equal(duplicateThreads.ok, false);

  const duplicateEvidenceAfterNormalization =
    parseLocalOperatingLoopAction({
      action: "VALIDATE",
      input: {
        ...genuineGoInput,
        evidencePointers: ["same evidence", " same evidence \r\n"],
      },
    });
  assert.equal(duplicateEvidenceAfterNormalization.ok, false);

  const multilineSingleLineField = parseLocalOperatingLoopAction({
    action: "VALIDATE",
    input: {
      ...genuineGoInput,
      targetRepo: "dev-jai-nexus\nother-repo",
    },
  });
  assert.equal(multilineSingleLineField.ok, false);
}

async function testRejectsEveryAuthorityBearingOrUnknownFieldClass() {
  const prohibitedFields = [
    "actor",
    "role",
    "authority",
    "approval",
    "state",
    "recommendation",
    "packet",
    "receipt",
    "downstreamDraft",
    "humanApprovalDecision",
  ] as const;

  for (const field of prohibitedFields) {
    assert.equal(
      parseLocalOperatingLoopAction({
        action: "VALIDATE",
        input: genuineGoInput,
        [field]: "client-supplied",
      }).ok,
      false,
      `root field ${field} must be rejected`,
    );
    assert.equal(
      parseLocalOperatingLoopAction({
        action: "VALIDATE",
        input: {
          ...genuineGoInput,
          [field]: "client-supplied",
        },
      }).ok,
      false,
      `input field ${field} must be rejected`,
    );
  }
}

async function testExactDeterministicRecommendationMapping() {
  assert.deepEqual(deriveLocalOperatingLoopRecommendation(genuineGoInput), {
    recommendation: "GO",
    findingCodes: [],
    advisoryOnly: true,
  });

  assert.deepEqual(
    deriveLocalOperatingLoopRecommendation({
      ...genuineGoInput,
      title: "Short",
      summary: "Too short.",
      targetRepo: "other-repo",
      targetThreads: ["JAI_DEV_JAI_NEXUS"],
      evidencePointers: [],
    }),
    {
      recommendation: "BLOCKED",
      findingCodes: [
        "TARGET_REPO_OUT_OF_SCOPE",
        "CONTROL_THREAD_REQUIRED",
        "TITLE_TOO_SHORT",
        "SUMMARY_TOO_SHORT",
        "EVIDENCE_REQUIRED",
      ],
      advisoryOnly: true,
    },
  );

  assert.deepEqual(
    deriveLocalOperatingLoopRecommendation({
      ...genuineGoInput,
      title: "Short",
      summary: "Too short.",
      evidencePointers: [],
    }),
    {
      recommendation: "NEEDS_REVISION",
      findingCodes: [
        "TITLE_TOO_SHORT",
        "SUMMARY_TOO_SHORT",
        "EVIDENCE_REQUIRED",
      ],
      advisoryOnly: true,
    },
  );
}

async function testExplainableRecommendationSnapshotsForGoNeedsRevisionAndBlocked() {
  assert.deepEqual(
    createLocalOperatingLoopRecommendationExplanation({
      motion: genuineGoInput,
      recommendation: "GO",
      findingCodes: [],
    }),
    {
      status: "CURRENT",
      summary:
        "The server-derived recommendation found no semantic blocker or revision requirement. An explicit ADMIN local-shadow decision is still required.",
      findings: [],
    },
  );

  assert.deepEqual(
    createLocalOperatingLoopRecommendationExplanation({
      motion: needsRevisionInput,
      recommendation: "NEEDS_REVISION",
      findingCodes: [
        "TITLE_TOO_SHORT",
        "SUMMARY_TOO_SHORT",
        "EVIDENCE_REQUIRED",
      ],
    }),
    {
      status: "CURRENT",
      summary:
        "The server-derived recommendation found no blocker, but one or more bounded fields require revision before an ADMIN local-shadow acceptance decision.",
      findings: [
        {
          code: "TITLE_TOO_SHORT",
          label: "Title needs more detail",
          sourceFact:
            "Title length: 5 Unicode code points; required minimum: 8.",
          remediation: "Provide at least 8 Unicode code points.",
          severity: "REVISION",
        },
        {
          code: "SUMMARY_TOO_SHORT",
          label: "Purpose and summary need more detail",
          sourceFact:
            "Purpose and summary length: 10 Unicode code points; required minimum: 40.",
          remediation: "Provide at least 40 Unicode code points.",
          severity: "REVISION",
        },
        {
          code: "EVIDENCE_REQUIRED",
          label: "Evidence is required",
          sourceFact:
            "Evidence-pointer count: 0; required minimum: 1.",
          remediation: "Provide at least one evidence pointer.",
          severity: "REVISION",
        },
      ],
    },
  );

  assert.deepEqual(
    createLocalOperatingLoopRecommendationExplanation({
      motion: blockedInput,
      recommendation: "BLOCKED",
      findingCodes: [...LOCAL_OPERATING_LOOP_FINDING_ORDER],
    }),
    {
      status: "CURRENT",
      summary:
        "The server-derived recommendation found an authority or repository-scope blocker that must be resolved before an ADMIN local-shadow acceptance decision.",
      findings: [
        {
          code: "TARGET_REPO_OUT_OF_SCOPE",
          label: "Target repository is outside the authorized scope",
          sourceFact:
            "Target repository is within dev-jai-nexus scope: no.",
          remediation: "Select dev-jai-nexus.",
          severity: "BLOCKER",
        },
        {
          code: "CONTROL_THREAD_REQUIRED",
          label: "CONTROL_THREAD participation is required",
          sourceFact: "JAI_CONTROL_THREAD is included: no.",
          remediation: "Include JAI_CONTROL_THREAD.",
          severity: "BLOCKER",
        },
        {
          code: "TITLE_TOO_SHORT",
          label: "Title needs more detail",
          sourceFact:
            "Title length: 5 Unicode code points; required minimum: 8.",
          remediation: "Provide at least 8 Unicode code points.",
          severity: "REVISION",
        },
        {
          code: "SUMMARY_TOO_SHORT",
          label: "Purpose and summary need more detail",
          sourceFact:
            "Purpose and summary length: 10 Unicode code points; required minimum: 40.",
          remediation: "Provide at least 40 Unicode code points.",
          severity: "REVISION",
        },
        {
          code: "EVIDENCE_REQUIRED",
          label: "Evidence is required",
          sourceFact:
            "Evidence-pointer count: 0; required minimum: 1.",
          remediation: "Provide at least one evidence pointer.",
          severity: "REVISION",
        },
      ],
    },
  );
}

async function testRecommendationExplanationRequiresCompleteApplicableFindingGraph() {
  const incompleteCases = [
    {
      motion: needsRevisionInput,
      recommendation: "GO" as const,
      findingCodes: [],
    },
    {
      motion: blockedInput,
      recommendation: "BLOCKED" as const,
      findingCodes: ["TARGET_REPO_OUT_OF_SCOPE"],
    },
    {
      motion: needsRevisionInput,
      recommendation: "NEEDS_REVISION" as const,
      findingCodes: ["TITLE_TOO_SHORT"],
    },
  ];

  for (const input of incompleteCases) {
    const explanation =
      createLocalOperatingLoopRecommendationExplanation(input);
    assert.equal(explanation.status, "NOT_CURRENT");
    assert.deepEqual(
      explanation.findings.map((finding) => finding.code),
      [null],
    );
  }

  const complete = createLocalOperatingLoopRecommendationExplanation({
    motion: blockedInput,
    recommendation: "BLOCKED",
    findingCodes: [...LOCAL_OPERATING_LOOP_FINDING_ORDER],
  });
  assert.equal(complete.status, "CURRENT");
  assert.deepEqual(
    complete.findings.map((finding) => finding.code),
    [...LOCAL_OPERATING_LOOP_FINDING_ORDER],
  );

  const duplicateComplete =
    createLocalOperatingLoopRecommendationExplanation({
      motion: blockedInput,
      recommendation: "BLOCKED",
      findingCodes: [
        ...LOCAL_OPERATING_LOOP_FINDING_ORDER,
        "CONTROL_THREAD_REQUIRED",
        "EVIDENCE_REQUIRED",
      ],
    });
  assert.equal(duplicateComplete.status, "CURRENT");
  assert.deepEqual(
    duplicateComplete.findings.map((finding) => finding.code),
    [...LOCAL_OPERATING_LOOP_FINDING_ORDER],
  );

  const findingsWithoutRecommendation =
    createLocalOperatingLoopRecommendationExplanation({
      motion: needsRevisionInput,
      recommendation: null,
      findingCodes: [
        "TITLE_TOO_SHORT",
        "SUMMARY_TOO_SHORT",
        "EVIDENCE_REQUIRED",
      ],
    });
  assert.equal(findingsWithoutRecommendation.status, "NOT_CURRENT");
  assert.deepEqual(
    findingsWithoutRecommendation.findings.map((finding) => finding.code),
    [null],
  );
}

async function testFindingExplanationsBindToCanonicalSourceAndPrecedence() {
  const precedenceInput: LocalOperatingLoopInput = {
    ...genuineGoInput,
    targetThreads: ["JAI_DEV_JAI_NEXUS"],
    evidencePointers: [],
  };
  const explanation =
    createLocalOperatingLoopRecommendationExplanation({
      motion: precedenceInput,
      recommendation: "BLOCKED",
      findingCodes: [
        "EVIDENCE_REQUIRED",
        "CONTROL_THREAD_REQUIRED",
      ],
    });
  assert.equal(explanation.status, "CURRENT");
  assert.deepEqual(
    explanation.findings.map((finding) => finding.code),
    ["CONTROL_THREAD_REQUIRED", "EVIDENCE_REQUIRED"],
  );
  assert.deepEqual(
    explanation.findings.map((finding) => finding.severity),
    ["BLOCKER", "REVISION"],
  );
  assert.deepEqual(
    explanation.findings.map((finding) => finding.sourceFact),
    [
      "JAI_CONTROL_THREAD is included: no.",
      "Evidence-pointer count: 0; required minimum: 1.",
    ],
  );

  const inconsistent =
    createLocalOperatingLoopRecommendationExplanation({
      motion: genuineGoInput,
      recommendation: "NEEDS_REVISION",
      findingCodes: ["TITLE_TOO_SHORT"],
    });
  assert.equal(inconsistent.status, "NOT_CURRENT");
  assert.equal(inconsistent.findings[0]?.code, null);
}

async function testSemanticRemediationIsAllowlistedOrderedAndDeduplicated() {
  const explanation =
    createLocalOperatingLoopRecommendationExplanation({
      motion: needsRevisionInput,
      recommendation: "NEEDS_REVISION",
      findingCodes: [
        "EVIDENCE_REQUIRED",
        "TITLE_TOO_SHORT",
        "SUMMARY_TOO_SHORT",
        "TITLE_TOO_SHORT",
        "EVIDENCE_REQUIRED",
      ],
    });
  assert.deepEqual(
    explanation.findings.map((finding) => finding.code),
    ["TITLE_TOO_SHORT", "SUMMARY_TOO_SHORT", "EVIDENCE_REQUIRED"],
  );
  assert.deepEqual(
    explanation.findings.map((finding) => finding.remediation),
    [
      "Provide at least 8 Unicode code points.",
      "Provide at least 40 Unicode code points.",
      "Provide at least one evidence pointer.",
    ],
  );
  assert.equal(
    new Set(explanation.findings.map((finding) => finding.code)).size,
    explanation.findings.length,
  );
}

async function testUnknownFindingFailsClosedToGenericSemanticGuidance() {
  const unknownCode = "UNKNOWN_RAW_FINDING_WITH_PRIVATE_VALUE";
  const explanation =
    createLocalOperatingLoopRecommendationExplanation({
      motion: genuineGoInput,
      recommendation: "GO",
      findingCodes: [unknownCode, { raw: "private-motion-value" }],
    });
  assert.deepEqual(explanation, {
    status: "NOT_CURRENT",
    summary:
      "The semantic explanation is not current. Validate and deliberate the active motion again.",
    findings: [
      {
        code: null,
        label: "Semantic guidance is not current",
        sourceFact:
          "The current semantic findings could not be matched safely to the active canonical projection.",
        remediation: "Validate and deliberate the active motion again.",
        severity: "FAIL_CLOSED",
      },
    ],
  });
  assert.doesNotMatch(
    JSON.stringify(explanation),
    /UNKNOWN_RAW_FINDING_WITH_PRIVATE_VALUE|private-motion-value/,
  );
}

async function testProofStatusIsProjectionBoundFounderReadableAndRedacted() {
  const projectionKey =
    createLocalOperatingLoopProjectionKey(genuineGoInput);
  const draft = createLocalOperatingLoopUiState(projectionKey);
  const validated: LocalOperatingLoopUiState = {
    ...draft,
    state: "VALIDATED",
    validationProof: SYNTHETIC_VALIDATION_PROOF,
  };
  const awaiting: LocalOperatingLoopUiState = {
    ...validated,
    state: "AWAITING_DECISION",
    deliberationProof: SYNTHETIC_DELIBERATION_PROOF,
    recommendation: "GO",
  };
  const accepted: LocalOperatingLoopUiState = {
    ...acceptedUiState(projectionKey),
    activeRequestId: null,
  };
  const statuses = [
    createLocalOperatingLoopProofStatus({
      state: draft,
      currentProjectionKey: projectionKey,
    }),
    createLocalOperatingLoopProofStatus({
      state: validated,
      currentProjectionKey: projectionKey,
    }),
    createLocalOperatingLoopProofStatus({
      state: awaiting,
      currentProjectionKey: projectionKey,
    }),
    createLocalOperatingLoopProofStatus({
      state: accepted,
      currentProjectionKey: projectionKey,
    }),
  ];

  assert.deepEqual(
    statuses.map((status) => status.code),
    [
      "NOT_ESTABLISHED",
      "STRUCTURE_CURRENT",
      "DELIBERATION_CURRENT",
      "DECISION_CURRENT",
    ],
  );
  assert.deepEqual(
    statuses.map((status) => status.label),
    [
      "Not established",
      "Structure current",
      "Deliberation current",
      "Decision current",
    ],
  );
  assert.ok(
    statuses.every(
      (status) =>
        status.verificationBoundary ===
        LOCAL_OPERATING_LOOP_PROOF_VERIFICATION_BOUNDARY,
    ),
  );
  const founderCopy = JSON.stringify(statuses);
  assert.doesNotMatch(
    founderCopy,
    new RegExp(
      [
        SYNTHETIC_VALIDATION_PROOF,
        SYNTHETIC_DELIBERATION_PROOF,
        ADMIN_EMAIL,
        "a".repeat(64),
        "b".repeat(64),
        genuineGoInput.motionId,
      ].join("|"),
    ),
  );
  assert.match(founderCopy, /HMAC authenticity remains server-bound/);
  assert.doesNotMatch(founderCopy, /browser verified/i);
}

async function testPendingRequestsPreserveCurrentPriorTransition() {
  const projectionKey =
    createLocalOperatingLoopProjectionKey(genuineGoInput);
  const pendingValidation: LocalOperatingLoopUiState = {
    ...createLocalOperatingLoopUiState(projectionKey),
    activeRequestId: 101,
  };
  const pendingDeliberation: LocalOperatingLoopUiState = {
    ...createLocalOperatingLoopUiState(projectionKey),
    state: "VALIDATED",
    validationProof: SYNTHETIC_VALIDATION_PROOF,
    activeRequestId: 102,
  };
  const awaitingDecision: LocalOperatingLoopUiState = {
    ...pendingDeliberation,
    state: "AWAITING_DECISION",
    deliberationProof: SYNTHETIC_DELIBERATION_PROOF,
    recommendation: "GO",
  };

  assert.equal(
    createLocalOperatingLoopProofStatus({
      state: pendingValidation,
      currentProjectionKey: projectionKey,
    }).code,
    "NOT_ESTABLISHED",
  );
  assert.equal(
    createLocalOperatingLoopProofStatus({
      state: pendingDeliberation,
      currentProjectionKey: projectionKey,
    }).code,
    "STRUCTURE_CURRENT",
  );

  for (const [index, decision] of [
    "ACCEPT",
    "HOLD",
    "REJECT",
  ].entries()) {
    const pendingDecision: LocalOperatingLoopUiState = {
      ...awaitingDecision,
      activeRequestId: 103 + index,
    };
    const proofStatus = createLocalOperatingLoopProofStatus({
      state: pendingDecision,
      currentProjectionKey: projectionKey,
    });
    assert.equal(
      proofStatus.code,
      "DELIBERATION_CURRENT",
      `${decision} must preserve the current deliberation proof`,
    );

    const explanation =
      createLocalOperatingLoopRecommendationExplanation({
        motion: genuineGoInput,
        recommendation:
          proofStatus.code === "DELIBERATION_CURRENT" ||
          proofStatus.code === "DECISION_CURRENT"
            ? pendingDecision.recommendation
            : null,
        findingCodes: pendingDecision.findingCodes,
      });
    assert.equal(
      explanation.status,
      "CURRENT",
      `${decision} must preserve the current recommendation explanation`,
    );
  }

  assert.equal(
    createLocalOperatingLoopProofStatus({
      state: acceptedUiState(projectionKey),
      currentProjectionKey: projectionKey,
    }).code,
    "NOT_CURRENT",
  );
}

async function testProofStatusReturnsNotCurrentForInconsistentState() {
  const projectionKey =
    createLocalOperatingLoopProjectionKey(genuineGoInput);
  const incomplete: LocalOperatingLoopUiState = {
    ...createLocalOperatingLoopUiState(projectionKey),
    state: "VALIDATED",
  };
  const staleDraft: LocalOperatingLoopUiState = {
    ...createLocalOperatingLoopUiState(projectionKey),
    recommendation: "GO",
  };
  const cases = [
    createLocalOperatingLoopProofStatus({
      state: incomplete,
      currentProjectionKey: projectionKey,
    }),
    createLocalOperatingLoopProofStatus({
      state: staleDraft,
      currentProjectionKey: projectionKey,
    }),
    createLocalOperatingLoopProofStatus({
      state: createLocalOperatingLoopUiState(projectionKey),
      currentProjectionKey: "different-projection",
    }),
    createLocalOperatingLoopProofStatus({
      state: createLocalOperatingLoopUiState(projectionKey),
      currentProjectionKey: projectionKey,
      requiresFreshValidation: true,
    }),
  ];
  assert.ok(cases.every((status) => status.code === "NOT_CURRENT"));
  assert.ok(cases.every((status) => status.label === "Not current"));
}

async function testFounderSafeTerminalPresentationSnapshots() {
  const common = {
    recommendation: "GO",
    findingCount: 0,
    workPacketExecutionAuthority: false,
    artifactCount: 1,
    receiptAuthority: "DEMONSTRATION_ONLY",
    persistence: "NONE",
    programEffect: "NONE",
    notAControlThreadAcceptanceReceipt: true,
    decisionScope: "GENERATE_WORK_PACKET_ONLY",
    artifactExecutionAuthority: false,
  } as const;

  assert.deepEqual(
    createFounderSafeLocalOperatingLoopTerminalPresentation(
      terminalUiState("ACCEPT"),
    ),
    {
      terminalState: "ACCEPTED",
      decision: "ACCEPT",
      ...common,
      workPacketCount: 1,
      workPacketStatus: "PROPOSED_ONLY",
    },
  );
  assert.deepEqual(
    createFounderSafeLocalOperatingLoopTerminalPresentation(
      terminalUiState("HOLD"),
    ),
    {
      terminalState: "HELD",
      decision: "HOLD",
      ...common,
      workPacketCount: 0,
      workPacketStatus: "NONE",
    },
  );
  assert.deepEqual(
    createFounderSafeLocalOperatingLoopTerminalPresentation(
      terminalUiState("REJECT"),
    ),
    {
      terminalState: "REJECTED",
      decision: "REJECT",
      ...common,
      workPacketCount: 0,
      workPacketStatus: "NONE",
    },
  );
}

async function testFounderSafeTerminalPresentationRejectsIncoherentState() {
  const accepted = terminalUiState("ACCEPT");
  const held = terminalUiState("HOLD");
  assert.ok(accepted.artifact);
  const malformedStates: LocalOperatingLoopUiState[] = [
    { ...accepted, workPacket: null },
    { ...held, workPacket: accepted.workPacket },
    { ...accepted, artifact: null },
    {
      ...accepted,
      artifact: { ...accepted.artifact, decision: "HOLD" },
    },
    {
      ...accepted,
      artifact: {
        ...accepted.artifact,
        persistence: "DURABLE",
      } as unknown as LocalOperatingLoopUiState["artifact"],
    },
  ];

  for (const state of malformedStates) {
    assert.equal(
      createFounderSafeLocalOperatingLoopTerminalPresentation(state),
      null,
    );
  }
  assert.equal(
    LOCAL_OPERATING_LOOP_TERMINAL_PRESENTATION_UNAVAILABLE_COPY,
    "The terminal local-shadow summary is unavailable because its state is not coherent. Reset and complete the active motion again.",
  );
}

async function testFounderSafeTerminalPresentationExcludesSensitiveKeys() {
  const sourceState = terminalUiState("ACCEPT");
  assert.ok(sourceState.workPacket);
  assert.ok(sourceState.artifact);
  const presentation =
    createFounderSafeLocalOperatingLoopTerminalPresentation(sourceState);
  assert.ok(presentation);

  const keys = collectNestedKeys(presentation);
  const forbiddenKeys = new Set([
    "actor",
    "proposer",
    "proposed_by",
    "packetId",
    "packet_id",
    "id",
    "artifactId",
    "artifact_id",
    "motionId",
    "motion_id",
    "otherId",
    "other_id",
    "baseSha",
    "base_sha",
    "commitSha",
    "fingerprint",
    "motionFingerprint",
    "motion_fingerprint",
    "candidatePacketHash",
    "candidate_packet_hash",
    "validationProof",
    "deliberationProof",
    "projectionKey",
    "title",
    "summary",
    "motion",
    "evidencePointers",
    "evidence_pointers",
    "targetThreads",
    "target_threads",
    "targetRepo",
    "target_repo",
    "nonAuthorizations",
    "non_authorizations",
    "request",
    "response",
    "cookies",
    "cookie",
    "tokens",
    "token",
    "secrets",
    "secret",
    "credentials",
    "credential",
  ]);
  assert.deepEqual(
    keys.filter((key) => forbiddenKeys.has(key)),
    [],
  );

  const serialized = JSON.stringify(presentation);
  const sensitiveValues = [
    ADMIN_EMAIL,
    sourceState.workPacket.packet_id,
    sourceState.artifact.artifact_id,
    LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    sourceState.artifact.motion_id,
    sourceState.artifact.motion_fingerprint,
    sourceState.artifact.candidate_packet_hash,
    sourceState.validationProof,
    sourceState.deliberationProof,
    sourceState.workPacket.title,
    sourceState.workPacket.summary,
    sourceState.workPacket.target_repo,
    ...sourceState.workPacket.target_threads,
    ...sourceState.workPacket.evidence_pointers,
    ...sourceState.workPacket.non_authorizations,
  ].filter((value): value is string => typeof value === "string");
  for (const value of sensitiveValues) {
    assert.equal(serialized.includes(value), false, value);
  }
}

async function testTerminalUiContainsNoRawJsonSink() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(
    panelSource,
    /createFounderSafeLocalOperatingLoopTerminalPresentation\(uiState\)/,
  );
  assert.match(panelSource, /function TerminalPresentation/);
  assert.match(panelSource, /<dl/);
  assert.match(panelSource, />\s*Terminal local-shadow summary\s*</);
  assert.doesNotMatch(panelSource, /JsonOutput/);
  assert.doesNotMatch(panelSource, /<pre/);
  assert.doesNotMatch(panelSource, /value=\{projectionKey\}/);
  assert.doesNotMatch(
    panelSource,
    /JSON\.stringify\((?:value|uiState\.(?:workPacket|artifact))/,
  );
  assert.match(
    panelSource,
    /Current canonical projection is internally bound; raw key withheld\./,
  );
}

async function testUnstagedDraftChangesSuspendOnlySelectedComposedProjection() {
  const composedMotionId = "local-composed-motion-20260721123456";
  assert.equal(
    shouldSuspendLocalOperatingLoopForUnstagedDraft({
      selectedMotionId: composedMotionId,
      composedMotionId,
      composedMotionHasUnstagedChanges: true,
    }),
    true,
  );
  assert.equal(
    shouldSuspendLocalOperatingLoopForUnstagedDraft({
      selectedMotionId: composedMotionId,
      composedMotionId,
      composedMotionHasUnstagedChanges: false,
    }),
    false,
  );
  for (const selectedMotionId of [
    "motion-sample-go",
    "persisted-motion-intake-example",
  ]) {
    assert.equal(
      shouldSuspendLocalOperatingLoopForUnstagedDraft({
        selectedMotionId,
        composedMotionId,
        composedMotionHasUnstagedChanges: true,
      }),
      false,
    );
  }
  assert.equal(
    shouldSuspendLocalOperatingLoopForUnstagedDraft({
      selectedMotionId: composedMotionId,
      composedMotionId: null,
      composedMotionHasUnstagedChanges: true,
    }),
    false,
  );
}

async function testComposerEditsNeverAutoStage() {
  const composerSource = source(
    "src/app/operator/motion-control/NativeMotionIntakeComposer.tsx",
  );
  const updateStart = composerSource.indexOf("function updateDraft");
  const stageStart = composerSource.indexOf(
    "function stageComposedMotion",
    updateStart,
  );
  assert.ok(updateStart >= 0);
  assert.ok(stageStart > updateStart);
  const updateSource = composerSource.slice(updateStart, stageStart);
  assert.match(updateSource, /setDraft\(/);
  assert.match(updateSource, /if \(composedMotion\)/);
  assert.match(
    updateSource,
    /setComposedMotionHasUnstagedChanges\(true\)/,
  );
  assert.doesNotMatch(
    updateSource,
    /buildComposedMotionBasis|setComposedMotion\(|setSelectedMotionId\(|fetch\(|persistMotionDraft|stageComposedMotion\(/,
  );
}

async function testUnstagedComposerGateUnmountsLoopAndIsAccessible() {
  const composerSource = source(
    "src/app/operator/motion-control/NativeMotionIntakeComposer.tsx",
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(
    composerSource,
    /shouldSuspendLocalOperatingLoopForUnstagedDraft\(\{/,
  );
  assert.match(composerSource, /\{suspendLocalOperatingLoop \? \(/);
  assert.match(
    composerSource,
    /aria-labelledby="unstaged-draft-changes-heading"/,
  );
  assert.match(composerSource, /role="alert"/);
  assert.match(composerSource, />\s*Unstaged draft changes\s*</);
  assert.match(
    composerSource,
    /visible composer no longer matches the previously staged\s+canonical projection/,
  );
  assert.match(
    composerSource,
    /Prior local-shadow output was cleared from\s+view/,
  );
  assert.match(
    composerSource,
    /Stage composed motion locally before validation can resume/,
  );
  assert.match(
    composerSource,
    /full manual text revert still requires explicit restaging/,
  );
  assert.equal(
    (composerSource.match(/<LocalOperatingLoopPanel/g) ?? []).length,
    1,
  );
  assert.match(
    composerSource,
    /\) : \(\s*<LocalOperatingLoopPanel selectedMotion=\{selectedMotion\} \/>/,
  );

  const stageStart = composerSource.indexOf("function stageComposedMotion");
  const persistStart = composerSource.indexOf(
    "async function persistMotionDraft",
    stageStart,
  );
  const stageSource = composerSource.slice(stageStart, persistStart);
  assert.match(stageSource, /buildComposedMotionBasis\(\{ draft \}\)/);
  assert.match(
    stageSource,
    /setComposedMotionHasUnstagedChanges\(false\)/,
  );
  assert.match(
    composerSource,
    /setComposedMotion\(null\);\s+setComposedMotionHasUnstagedChanges\(false\)/,
  );
  assert.match(panelSource, /key=\{projectionKey\}/);
}

async function testExistingAbortInvalidationAndRecoveryContractsRemainIntact() {
  const projectionKey =
    createLocalOperatingLoopProjectionKey(genuineGoInput);
  const terminal = terminalUiState("ACCEPT");
  assert.deepEqual(
    recoverLocalOperatingLoopClientFailure(terminal),
    createLocalOperatingLoopUiState(terminal.projectionKey),
  );
  assert.deepEqual(
    invalidateLocalOperatingLoopUiState(
      terminal,
      `${projectionKey}-changed`,
    ),
    createLocalOperatingLoopUiState(`${projectionKey}-changed`),
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: `${projectionKey}-changed`,
      responseProjectionKey: projectionKey,
      currentRequestId: 8,
      responseRequestId: 8,
    }),
    false,
  );

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(panelSource, /abortAndReleaseActiveRequest/);
  assert.match(panelSource, /controller\?\.abort\(\)/);
  assert.match(panelSource, /applyLocalOperatingLoopBrowserLifecycle/);
  assert.match(panelSource, /recoverLocalOperatingLoopClientFailure/);
  assert.match(panelSource, /recoverLocalOperatingLoopStructuralFailure/);
  assert.match(panelSource, /shouldApplyLocalOperatingLoopResponse/);
}

async function testCanonicalChangeClearsExplainabilityAndProofStatus() {
  const projectionKey =
    createLocalOperatingLoopProjectionKey(genuineGoInput);
  const changedInput = {
    ...genuineGoInput,
    title: `${genuineGoInput.title} changed`,
  };
  const changedProjectionKey =
    createLocalOperatingLoopProjectionKey(changedInput);
  const populated: LocalOperatingLoopUiState = {
    ...createLocalOperatingLoopUiState(projectionKey),
    state: "AWAITING_DECISION",
    validationProof: SYNTHETIC_VALIDATION_PROOF,
    deliberationProof: SYNTHETIC_DELIBERATION_PROOF,
    recommendation: "GO",
  };
  const reset = invalidateLocalOperatingLoopUiState(
    populated,
    changedProjectionKey,
  );
  assert.deepEqual(
    reset,
    createLocalOperatingLoopUiState(changedProjectionKey),
  );
  assert.deepEqual(
    createLocalOperatingLoopRecommendationExplanation({
      motion: changedInput,
      recommendation: reset.recommendation,
      findingCodes: reset.findingCodes,
    }),
    {
      status: "NOT_ESTABLISHED",
      summary:
        "No current server-derived recommendation is available. Validate and deliberate the active motion.",
      findings: [],
    },
  );
  assert.equal(
    createLocalOperatingLoopProofStatus({
      state: reset,
      currentProjectionKey: changedProjectionKey,
    }).code,
    "NOT_ESTABLISHED",
  );
}

async function testRecommendationExplanationRemainsServerDerived() {
  const pureSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const explanationStart = pureSource.indexOf(
    "export function createLocalOperatingLoopRecommendationExplanation",
  );
  const explanationEnd = pureSource.indexOf(
    "const localOperatingLoopProofStatusCopy",
    explanationStart,
  );
  assert.ok(explanationStart >= 0);
  assert.ok(explanationEnd > explanationStart);
  assert.doesNotMatch(
    pureSource.slice(explanationStart, explanationEnd),
    /deriveLocalOperatingLoopRecommendation/,
  );
  assert.doesNotMatch(
    panelSource,
    /deriveLocalOperatingLoopRecommendation/,
  );
  assert.match(
    panelSource,
    /\{uiState\.recommendation \?\? "not deliberated"\}/,
  );
  assert.match(
    panelSource,
    /createLocalOperatingLoopRecommendationExplanation\(\{/,
  );
}

async function testStructuralRemediationRemainsDistinctFromSemanticGuidance() {
  const structural = createLocalOperatingLoopStructuralRemediations([
    { path: "input.title", code: "too_small" },
  ]);
  const semanticInput = {
    ...genuineGoInput,
    title: "Short",
  };
  const semantic = createLocalOperatingLoopRecommendationExplanation({
    motion: semanticInput,
    recommendation: "NEEDS_REVISION",
    findingCodes: ["TITLE_TOO_SHORT"],
  });
  assert.deepEqual(structural, [
    {
      id: "title",
      field: "Title",
      message: "Provide a single-line motion title within 240 characters.",
    },
  ]);
  assert.equal(
    semantic.findings[0]?.remediation,
    "Provide at least 8 Unicode code points.",
  );
  assert.notEqual(
    structural[0]?.message,
    semantic.findings[0]?.remediation,
  );
}

async function testD5FailClosedCoherenceRemainsIntact() {
  const projectionKey =
    createLocalOperatingLoopProjectionKey(genuineGoInput);
  assert.deepEqual(
    recoverLocalOperatingLoopClientFailure(acceptedUiState(projectionKey)),
    createLocalOperatingLoopUiState(projectionKey),
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: "changed-projection",
      responseProjectionKey: projectionKey,
      currentRequestId: 17,
      responseRequestId: 17,
    }),
    false,
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(panelSource, /abortAndReleaseActiveRequest/);
  assert.match(
    panelSource,
    /await classifyLocalOperatingLoopClientResponse/,
  );
  assert.ok(
    (panelSource.match(/if \(!responseStillOwned\(\)\)/g) ?? [])
      .length >= 5,
  );
}

async function testExplainabilityPanelAccessibleStaticWiring() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(panelSource, />\s*Why this recommendation\s*</);
  assert.match(panelSource, />\s*Proof-chain status\s*</);
  assert.match(
    panelSource,
    /aria-labelledby="local-operating-loop-recommendation-explanation-heading"/,
  );
  assert.match(
    panelSource,
    /aria-labelledby="local-operating-loop-proof-status-heading"/,
  );
  assert.match(
    panelSource,
    /aria-label="Deterministic semantic findings"/,
  );
  assert.match(panelSource, /<ol/);
  assert.match(panelSource, /\{finding\.sourceFact\}/);
  assert.match(panelSource, /\{finding\.remediation\}/);
  assert.match(panelSource, /\{proofStatus\.verificationBoundary\}/);
  assert.doesNotMatch(
    panelSource,
    /Copy explanation|Export explanation|Download receipt/,
  );
}

async function testProductionDependencyIsolation() {
  const pureSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.deepEqual(importSpecifiers(pureSource), ["zod"]);
  assert.doesNotMatch(
    pureSource,
    /from\s+["'][^"']*(node:|next-auth|prisma|github|linear|agent|council)/i,
  );
  assert.doesNotMatch(pureSource, /process\.env/);
  assert.doesNotMatch(
    panelSource,
    /local-operating-loop-handler|\/route|node:|process\.env|next-auth|prisma/i,
  );
  assert.doesNotMatch(panelSource, /crypto\.subtle|createHmac|timingSafeEqual/);
  assert.match(
    pureSource,
    /HMAC authenticity remains server-bound/,
  );
}

async function testStructuralValidationPrecedesSemanticDeliberation() {
  const structurallyValidButSemanticallyIncompleteInput = {
    ...genuineGoInput,
    title: "Short",
    summary: "Too short.",
    evidencePointers: [],
  };
  const handler = createAdminHandler();
  const validation = await readResponse(
    await handler(
      jsonRequest({
        action: "VALIDATE",
        input: structurallyValidButSemanticallyIncompleteInput,
      }),
    ),
  );
  assert.equal(validation.status, 200);
  const validationBody = successBody(validation.body);
  assert.equal(validationBody.state, "VALIDATED");
  assert.equal("recommendation" in validationBody, false);
  assert.equal("findingCodes" in validationBody, false);
  assert.equal("candidatePacketHash" in validationBody, false);
  if (validationBody.state !== "VALIDATED") {
    throw new Error("Expected structurally VALIDATED response.");
  }

  const deliberation = await readResponse(
    await handler(
      jsonRequest({
        action: "DELIBERATE",
        input: structurallyValidButSemanticallyIncompleteInput,
        validationProof: validationBody.validationProof,
      }),
    ),
  );
  assert.equal(deliberation.status, 200);
  const deliberationBody = successBody(deliberation.body);
  assert.equal(deliberationBody.state, "AWAITING_DECISION");
  if (deliberationBody.state !== "AWAITING_DECISION") {
    throw new Error("Expected semantic deliberation response.");
  }
  assert.equal(deliberationBody.recommendation, "NEEDS_REVISION");
  assert.deepEqual(deliberationBody.findingCodes, [
    "TITLE_TOO_SHORT",
    "SUMMARY_TOO_SHORT",
    "EVIDENCE_REQUIRED",
  ]);
}

async function testPhaseCopyDistinguishesStructureFromSemantics() {
  assert.equal(
    LOCAL_OPERATING_LOOP_PHASE_COPY.DRAFT,
    "Ready for structural validation. This checks request shape only.",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_PHASE_COPY.VALIDATING,
    "Checking request structure only.",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_PHASE_COPY.VALIDATED,
    "Structure validated. No semantic recommendation has been produced.",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_PHASE_COPY.DELIBERATING,
    "Running server-side semantic deliberation to derive a recommendation.",
  );
  assert.match(
    LOCAL_OPERATING_LOOP_PHASE_COPY.AWAITING_DECISION,
    /server-derived recommendation before an ADMIN decision/,
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_PHASE_COPY.ACCEPTED,
    "Accepted locally for proposed Work Packet generation only.",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY,
    "Structural validation found fields that need correction. The selected motion remains available and the local shadow returned to DRAFT.",
  );
}

async function testSafeDeterministicStructuralRemediation() {
  const issues = [
    { path: "input.evidencePointers.1", code: "custom" },
    { path: "input.title", code: "too_small" },
    { path: "input.motionId", code: "invalid_type" },
    { path: "input.summary", code: "too_big" },
    { path: "input.targetRepo", code: "custom" },
    { path: "input.targetThreads.2", code: "invalid_enum_value" },
    { path: "action", code: "invalid_union_discriminator" },
    { path: "secret.token", code: "raw-sensitive-code" },
    { path: "input.title", code: "custom" },
  ];
  const expected = [
    {
      id: "motion-id",
      field: "Motion identifier",
      message: "Provide a single-line motion identifier.",
    },
    {
      id: "title",
      field: "Title",
      message: "Provide a single-line motion title within 240 characters.",
    },
    {
      id: "summary",
      field: "Summary",
      message: "Provide a motion summary between 1 and 4,000 characters.",
    },
    {
      id: "target-repository",
      field: "Target repository",
      message: "Provide a single-line target repository within 200 characters.",
    },
    {
      id: "target-threads",
      field: "Target threads",
      message:
        "Choose one to six unique target threads from the available options.",
    },
    {
      id: "evidence-pointers",
      field: "Evidence pointers",
      message: "Use no more than 20 unique, non-empty evidence pointers.",
    },
    {
      id: "action",
      field: "Action",
      message: "Choose validation, deliberation, or an ADMIN decision.",
    },
    {
      id: "request",
      field: "Motion request",
      message:
        "Review the motion structure and remove unsupported fields before retrying.",
    },
  ];

  const remediations =
    createLocalOperatingLoopStructuralRemediations(issues);
  assert.deepEqual(remediations, expected);
  assert.deepEqual(
    createLocalOperatingLoopStructuralRemediations([...issues].reverse()),
    expected,
  );
  assert.deepEqual(
    createLocalOperatingLoopStructuralRemediations(undefined),
    [expected.at(-1)],
  );
  const founderCopy = JSON.stringify(remediations);
  assert.doesNotMatch(
    founderCopy,
    /input\.|secret|too_small|invalid_type|raw-sensitive-code/,
  );
}

async function testStructuralFailureRecoversDraftPresentationState() {
  const projectionKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const populatedState = {
    ...createLocalOperatingLoopUiState(projectionKey),
    state: "AWAITING_DECISION" as const,
    validationProof: "validation-proof",
    deliberationProof: "deliberation-proof",
    recommendation: "GO" as const,
    findingCodes: ["EVIDENCE_REQUIRED" as const],
    activeRequestId: 41,
  };

  assert.deepEqual(
    recoverLocalOperatingLoopStructuralFailure(populatedState),
    createLocalOperatingLoopUiState(projectionKey),
  );
  assert.equal(populatedState.state, "AWAITING_DECISION");
  assert.equal(populatedState.projectionKey, projectionKey);
}

async function testAuthenticationIdentityFailuresClearDerivedStateAndExposeFixedReauthControl() {
  const projectionKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const populatedState = acceptedUiState(projectionKey);
  const expected = [
    ["UNAUTHENTICATED", "authentication-expired"],
    ["ADMIN_REQUIRED", "admin-identity-required"],
    ["ACTOR_EMAIL_REQUIRED", "actor-identity-required"],
  ] as const;
  const messages = new Set<string>();

  for (const [code, id] of expected) {
    const notice = createLocalOperatingLoopRecoveryNotice(code);
    assert.equal(notice.id, id);
    assert.equal(notice.requiresReauthentication, true);
    messages.add(notice.message);
    assert.deepEqual(
      recoverLocalOperatingLoopClientFailure(populatedState),
      createLocalOperatingLoopUiState(projectionKey),
    );
  }

  const actualFailureHandlers = [
    {
      code: "UNAUTHENTICATED",
      handler: createLocalOperatingLoopHandler({
        readSecret: () => SYNTHETIC_SECRET,
        authenticate: async () => ({ authenticated: false }),
      }),
    },
    {
      code: "ADMIN_REQUIRED",
      handler: createLocalOperatingLoopHandler({
        readSecret: () => SYNTHETIC_SECRET,
        authenticate: async () => ({
          authenticated: true,
          role: "AGENT",
          email: "agent@example.com",
        }),
      }),
    },
    {
      code: "ACTOR_EMAIL_REQUIRED",
      handler: createLocalOperatingLoopHandler({
        readSecret: () => SYNTHETIC_SECRET,
        authenticate: async () => ({
          authenticated: true,
          role: "ADMIN",
          email: " \r\n ",
        }),
      }),
    },
  ] as const;

  for (const { code, handler } of actualFailureHandlers) {
    const result = await readResponse(
      await handler(
        jsonRequest({ action: "VALIDATE", input: genuineGoInput }),
      ),
    );
    const classification = await classifyClientResponse(result.body);
    assert.equal(classification.kind, "RECOVERY", code);
    if (classification.kind !== "RECOVERY") {
      throw new Error(`Expected ${code} recovery classification.`);
    }
    assert.equal(classification.code, code);
    assert.equal(
      createLocalOperatingLoopRecoveryNotice(classification.code)
        .requiresReauthentication,
      true,
    );
  }

  assert.equal(messages.size, expected.length);
  assert.equal(
    LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF,
    "/login?next=%2Foperator%2Fmotion-control",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL,
    "Sign in again",
  );
}

async function testSecretRotationInvalidProofForcesRevalidation() {
  const handler = createAdminHandler();
  const proofChain = await buildProofChain(handler, genuineGoInput);
  const rotatedSecretHandler = createAdminHandler({
    secret: `${SYNTHETIC_SECRET}-rotated`,
  });
  const result = await decide(
    rotatedSecretHandler,
    genuineGoInput,
    "ACCEPT",
    proofChain.deliberationProof,
  );
  assert.equal(result.status, 409);
  const classification = await classifyClientResponse(
    result.body,
    decisionRequest(genuineGoInput, "ACCEPT"),
  );
  assert.equal(classification.kind, "RECOVERY");
  if (classification.kind !== "RECOVERY") {
    throw new Error("Expected INVALID_PROOF recovery classification.");
  }
  assert.equal(classification.code, "INVALID_PROOF");
  assert.equal(
    createLocalOperatingLoopRecoveryNotice(classification.code).id,
    "proof-invalid",
  );

  const projectionKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  assert.deepEqual(
    recoverLocalOperatingLoopClientFailure(acceptedUiState(projectionKey)),
    createLocalOperatingLoopUiState(projectionKey),
  );
}

async function testUnavailableProofServiceClearsStaleProofAndOutputs() {
  const handler = createLocalOperatingLoopHandler({
    readSecret: () => " ",
    authenticate: async () => ({
      authenticated: true,
      role: "ADMIN",
      email: ADMIN_EMAIL,
    }),
  });
  const result = await readResponse(
    await handler(jsonRequest({ action: "VALIDATE", input: genuineGoInput })),
  );
  assert.equal(result.status, 503);
  const classification = await classifyClientResponse(result.body);
  assert.equal(classification.kind, "RECOVERY");
  if (classification.kind !== "RECOVERY") {
    throw new Error("Expected proof-service recovery classification.");
  }
  assert.equal(classification.code, "SERVER_SECRET_UNAVAILABLE");
  assert.equal(
    createLocalOperatingLoopRecoveryNotice(classification.code).id,
    "proof-service-unavailable",
  );

  const projectionKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const recovered = recoverLocalOperatingLoopClientFailure(
    acceptedUiState(projectionKey),
  );
  assert.deepEqual(recovered, createLocalOperatingLoopUiState(projectionKey));
  assert.equal(recovered.validationProof, null);
  assert.equal(recovered.deliberationProof, null);
  assert.equal(recovered.workPacket, null);
  assert.equal(recovered.artifact, null);
}

async function testAbortAndLateResponseSuppressionRemainDeterministic() {
  const firstKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const secondKey = createLocalOperatingLoopProjectionKey({
    ...genuineGoInput,
    summary: `${genuineGoInput.summary} Changed safely.`,
  });
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: firstKey,
      responseProjectionKey: firstKey,
      currentRequestId: null,
      responseRequestId: 10,
    }),
    false,
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: firstKey,
      responseProjectionKey: firstKey,
      currentRequestId: 11,
      responseRequestId: 10,
    }),
    false,
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: secondKey,
      responseProjectionKey: firstKey,
      currentRequestId: 10,
      responseRequestId: 10,
    }),
    false,
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: firstKey,
      responseProjectionKey: firstKey,
      currentRequestId: 10,
      responseRequestId: 10,
    }),
    true,
  );
}

async function testBrowserRestoreForcesFreshDraftState() {
  const projectionKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const populatedState = acceptedUiState(projectionKey);
  assert.deepEqual(
    applyLocalOperatingLoopBrowserLifecycle(populatedState, {
      type: "PAGEHIDE",
    }),
    createLocalOperatingLoopUiState(projectionKey),
  );
  assert.deepEqual(
    applyLocalOperatingLoopBrowserLifecycle(populatedState, {
      type: "PAGESHOW",
      persisted: true,
    }),
    createLocalOperatingLoopUiState(projectionKey),
  );
  assert.equal(
    applyLocalOperatingLoopBrowserLifecycle(populatedState, {
      type: "PAGESHOW",
      persisted: false,
    }),
    populatedState,
  );
  assert.match(LOCAL_OPERATING_LOOP_PAGEHIDE_COPY, /Fresh structural validation/);
  assert.match(LOCAL_OPERATING_LOOP_RESTORED_COPY, /Fresh structural validation/);
}

async function testPageHideAndPersistedPageShowResetLifecycleIsWired() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(
    panelSource,
    /window\.addEventListener\("pagehide", handlePageHide\)/,
  );
  assert.match(
    panelSource,
    /window\.addEventListener\("pageshow", handlePageShow\)/,
  );
  assert.match(panelSource, /if \(!event\.persisted\) \{\s+return;/);
  assert.match(
    panelSource,
    /window\.removeEventListener\("pagehide", handlePageHide\)/,
  );
  assert.match(
    panelSource,
    /window\.removeEventListener\("pageshow", handlePageShow\)/,
  );
  assert.match(panelSource, /controller\?\.abort\(\)/);
  assert.match(panelSource, /activeRequestId\.current = null/);
}

async function testEveryCanonicalFieldInvalidatesAllDerivedState() {
  const originalKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const populatedState = acceptedUiState(originalKey);
  const changedInputs: LocalOperatingLoopInput[] = [
    { ...genuineGoInput, motionId: `${genuineGoInput.motionId}-changed` },
    { ...genuineGoInput, title: `${genuineGoInput.title} changed` },
    { ...genuineGoInput, summary: `${genuineGoInput.summary} Changed.` },
    { ...genuineGoInput, targetRepo: "other-repository" },
    {
      ...genuineGoInput,
      targetThreads: [
        ...genuineGoInput.targetThreads,
        "JAI_AUDIT_NEXUS",
      ],
    },
    {
      ...genuineGoInput,
      evidencePointers: [
        ...genuineGoInput.evidencePointers,
        "second-evidence-pointer",
      ],
    },
  ];

  for (const changedInput of changedInputs) {
    const changedKey = createLocalOperatingLoopProjectionKey(changedInput);
    assert.notEqual(changedKey, originalKey);
    assert.deepEqual(
      invalidateLocalOperatingLoopUiState(populatedState, changedKey),
      createLocalOperatingLoopUiState(changedKey),
    );
  }
  assert.equal(
    new Set(changedInputs.map(createLocalOperatingLoopProjectionKey)).size,
    changedInputs.length,
  );
}

async function testAcceptedPacketAndArtifactDoNotSurviveInvalidation() {
  const originalKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const accepted = acceptedUiState(originalKey);
  assert.ok(accepted.workPacket);
  assert.ok(accepted.artifact);

  const recovered = recoverLocalOperatingLoopClientFailure(accepted);
  assert.equal(recovered.state, "DRAFT");
  assert.equal(recovered.workPacket, null);
  assert.equal(recovered.artifact, null);
  assert.equal(recovered.recommendation, null);
  assert.deepEqual(recovered.findingCodes, []);

  const changedKey = createLocalOperatingLoopProjectionKey({
    ...genuineGoInput,
    title: `${genuineGoInput.title} changed`,
  });
  const invalidated = invalidateLocalOperatingLoopUiState(
    accepted,
    changedKey,
  );
  assert.equal(invalidated.state, "DRAFT");
  assert.equal(invalidated.workPacket, null);
  assert.equal(invalidated.artifact, null);
}

async function testHoldAndRejectNeverProduceWorkPacket() {
  const handler = createAdminHandler();
  const proofChain = await buildProofChain(handler, genuineGoInput);
  for (const decision of ["HOLD", "REJECT"] as const) {
    const result = await decide(
      handler,
      genuineGoInput,
      decision,
      proofChain.deliberationProof,
    );
    assert.equal(result.status, 200);
    const body = successBody(result.body);
    assert.equal("workPacket" in body ? body.workPacket : undefined, null);
    const classification = await classifyClientResponse(
      result.body,
      decisionRequest(genuineGoInput, decision),
    );
    assert.equal(classification.kind, "SUCCESS");
    if (classification.kind !== "SUCCESS") {
      throw new Error(`Expected ${decision} client response.`);
    }
    assert.equal(
      classification.response.state,
      decision === "HOLD" ? "HELD" : "REJECTED",
    );
  }
}

async function testNoProofStateUsesBrowserStorage() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const pureSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  assert.doesNotMatch(
    `${panelSource}\n${pureSource}`,
    /localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore/,
  );
  assert.doesNotMatch(
    panelSource,
    /[?&](?:proof|recommendation|packet|artifact)=/i,
  );
}

async function testRecoveryControlsAreAccessibleAndPhaseSpecific() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.equal((panelSource.match(/<a\b/g) ?? []).length, 1);
  assert.match(
    panelSource,
    /href=\{LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF\}/,
  );
  assert.match(
    panelSource,
    /\{LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL\}/,
  );
  assert.match(
    panelSource,
    /aria-labelledby="local-operating-loop-recovery-heading"/,
  );
  assert.match(panelSource, /role="alert"/);
  assert.doesNotMatch(panelSource, /window\.location|router\.push|signIn\(/);

  const notices = [
    "UNAUTHENTICATED",
    "ADMIN_REQUIRED",
    "ACTOR_EMAIL_REQUIRED",
    "SERVER_SECRET_UNAVAILABLE",
    "INVALID_PROOF",
  ].map(createLocalOperatingLoopRecoveryNotice);
  assert.equal(new Set(notices.map((notice) => notice.id)).size, notices.length);
  assert.equal(
    new Set(notices.map((notice) => notice.heading)).size,
    notices.length,
  );

  const rawServerText = "raw server secret should never be displayed";
  const unknown = await classifyClientResponse({
    ok: false,
    error: {
      code: "UNKNOWN_SERVER_CODE",
      message: rawServerText,
    },
    nonAuthorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
  });
  assert.equal(unknown.kind, "RECOVERY");
  if (unknown.kind !== "RECOVERY") {
    throw new Error("Expected generic recovery classification.");
  }
  const genericCopy = JSON.stringify(
    createLocalOperatingLoopRecoveryNotice(unknown.code),
  );
  assert.doesNotMatch(genericCopy, /raw server secret|UNKNOWN_SERVER_CODE/);
  assert.equal(
    createLocalOperatingLoopRecoveryNotice("INVALID_JSON").id,
    "generic-fail-closed",
  );
  assert.equal(
    (await classifyClientResponse({
      ok: true,
      state: "UNKNOWN",
      secret: "must-not-render",
    })).kind,
    "RECOVERY",
  );
}

async function testD4ValidationAndDeliberationUxContractRemainsIntact() {
  assert.equal(
    LOCAL_OPERATING_LOOP_PHASE_COPY.VALIDATED,
    "Structure validated. No semantic recommendation has been produced.",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY,
    "Structural validation found fields that need correction. The selected motion remains available and the local shadow returned to DRAFT.",
  );
  assert.deepEqual(
    createLocalOperatingLoopStructuralRemediations([
      { path: "input.title", code: "too_small" },
      { path: "unknown.path", code: "custom" },
    ]),
    [
      {
        id: "title",
        field: "Title",
        message: "Provide a single-line motion title within 240 characters.",
      },
      {
        id: "request",
        field: "Motion request",
        message:
          "Review the motion structure and remove unsupported fields before retrying.",
      },
    ],
  );

  const handler = createAdminHandler();
  const validation = await readResponse(
    await handler(jsonRequest({ action: "VALIDATE", input: genuineGoInput })),
  );
  const classification = await classifyClientResponse(validation.body);
  assert.equal(classification.kind, "SUCCESS");
  if (classification.kind !== "SUCCESS") {
    throw new Error("Expected validated client response.");
  }
  assert.equal(classification.response.state, "VALIDATED");
  if (classification.response.state !== "VALIDATED") {
    throw new Error("Expected VALIDATED client response.");
  }

  const deliberation = await readResponse(
    await handler(
      jsonRequest({
        action: "DELIBERATE",
        input: genuineGoInput,
        validationProof: classification.response.validationProof,
      }),
    ),
  );
  const deliberationClassification = await classifyClientResponse(
    deliberation.body,
    deliberationRequest(genuineGoInput),
  );
  assert.equal(deliberationClassification.kind, "SUCCESS");
  if (
    deliberationClassification.kind !== "SUCCESS" ||
    deliberationClassification.response.state !== "AWAITING_DECISION"
  ) {
    throw new Error("Expected AWAITING_DECISION client response.");
  }

  const accepted = await decide(
    handler,
    genuineGoInput,
    "ACCEPT",
    deliberationClassification.response.deliberationProof,
  );
  const acceptedClassification = await classifyClientResponse(
    accepted.body,
    decisionRequest(genuineGoInput, "ACCEPT"),
  );
  assert.equal(acceptedClassification.kind, "SUCCESS");
  if (acceptedClassification.kind !== "SUCCESS") {
    throw new Error("Expected ACCEPTED client response.");
  }
  assert.equal(acceptedClassification.response.state, "ACCEPTED");

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(
    panelSource,
    /remediationHeadingRef\.current\?\.focus\(\)/,
  );
  assert.match(
    panelSource,
    /createLocalOperatingLoopStructuralRemediations\(/,
  );
}

async function testAuthenticationAndSecretPrecedeBodyParsing() {
  let authenticateCalls = 0;
  const missingSecretBody = bodyTrackingRequest();
  const missingSecretHandler = createLocalOperatingLoopHandler({
    readSecret: () => "   ",
    authenticate: async () => {
      authenticateCalls += 1;
      return { authenticated: true, role: "ADMIN", email: ADMIN_EMAIL };
    },
  });
  const missingSecret = await readResponse(
    await missingSecretHandler(missingSecretBody.request),
  );
  assert.equal(missingSecret.status, 503);
  assert.equal(missingSecretBody.readCount(), 0);
  assert.equal(authenticateCalls, 0);
  assert.equal(missingSecret.cacheControl, "no-store");

  const missingTokenBody = bodyTrackingRequest();
  const missingTokenHandler = createLocalOperatingLoopHandler({
    readSecret: () => SYNTHETIC_SECRET,
    authenticate: async () => ({ authenticated: false }),
  });
  const missingToken = await readResponse(
    await missingTokenHandler(missingTokenBody.request),
  );
  assert.equal(missingToken.status, 401);
  assert.equal(missingTokenBody.readCount(), 0);

  const agentBody = bodyTrackingRequest();
  const agentHandler = createLocalOperatingLoopHandler({
    readSecret: () => SYNTHETIC_SECRET,
    authenticate: async () => ({
      authenticated: true,
      role: "AGENT",
      email: "agent@example.com",
    }),
  });
  assert.equal(
    (await readResponse(await agentHandler(agentBody.request))).status,
    403,
  );
  assert.equal(agentBody.readCount(), 0);

  const missingActorBody = bodyTrackingRequest();
  const missingActorHandler = createLocalOperatingLoopHandler({
    readSecret: () => SYNTHETIC_SECRET,
    authenticate: async () => ({
      authenticated: true,
      role: "ADMIN",
      email: " \r\n ",
    }),
  });
  assert.equal(
    (await readResponse(await missingActorHandler(missingActorBody.request)))
      .status,
    403,
  );
  assert.equal(missingActorBody.readCount(), 0);

  const adminHandler = createAdminHandler({
    email: "  FOUNDER@EXAMPLE.COM  ",
  });
  const admin = await readResponse(
    await adminHandler(jsonRequest({ action: "VALIDATE", input: genuineGoInput })),
  );
  assert.equal(admin.status, 200);
  assert.equal(successBody(admin.body).actor, ADMIN_EMAIL);
}

async function testActualNextAuthJwtIntegration() {
  const jwt = await encode({
    secret: SYNTHETIC_SECRET,
    token: {
      email: "  FOUNDER@EXAMPLE.COM  ",
      role: "ADMIN",
    },
    maxAge: 60,
  });
  const request = new NextRequest(routeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: `next-auth.session-token=${jwt}`,
    },
    body: JSON.stringify({ action: "VALIDATE", input: genuineGoInput }),
  });
  const handler = createLocalOperatingLoopHandler({
    readSecret: () => SYNTHETIC_SECRET,
    authenticate: async (candidate, secret) => {
      const token = await getToken({
        req: candidate as NextRequest,
        secret,
      });
      return token
        ? {
            authenticated: true,
            role: token.role,
            email: token.email,
          }
        : { authenticated: false };
    },
  });
  const response = await readResponse(await handler(request));
  assert.equal(response.status, 200);
  assert.equal(successBody(response.body).actor, ADMIN_EMAIL);

  const missingToken = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ malformed and intentionally unread ",
      }),
    ),
  );
  assert.equal(missingToken.status, 401);

  const invalidToken = await readResponse(
    await handler(
      new NextRequest(routeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "next-auth.session-token=not-a-valid-jwt",
        },
        body: "{ malformed and intentionally unread ",
      }),
    ),
  );
  assert.equal(invalidToken.status, 401);
}

async function testClientIdentitySpoofResistance() {
  const handler = createAdminHandler();
  const actorSpoof = await readResponse(
    await handler(
      jsonRequest({
        action: "VALIDATE",
        input: genuineGoInput,
        actor: "attacker@example.com",
      }),
    ),
  );
  assert.equal(actorSpoof.status, 400);

  const roleSpoof = await readResponse(
    await handler(
      jsonRequest({
        action: "VALIDATE",
        input: genuineGoInput,
        role: "ADMIN",
      }),
    ),
  );
  assert.equal(roleSpoof.status, 400);
}

async function testProofProgressionAndInvalidProofClasses() {
  const handler = createAdminHandler();
  const valid = await buildProofChain(handler, genuineGoInput);

  const acceptWithoutProof = await readResponse(
    await handler(
      jsonRequest({
        action: "DECIDE",
        input: genuineGoInput,
        decision: "ACCEPT",
      }),
    ),
  );
  assert.equal(acceptWithoutProof.status, 400);

  const malformed = await decide(handler, genuineGoInput, "ACCEPT", "bad");
  assert.equal(malformed.status, 409);

  const staleSecretHandler = createAdminHandler({
    secret: `${SYNTHETIC_SECRET}-rotated`,
  });
  const stale = await decide(
    staleSecretHandler,
    genuineGoInput,
    "ACCEPT",
    valid.deliberationProof,
  );
  assert.equal(stale.status, 409);

  const staleVersion = await decide(
    handler,
    genuineGoInput,
    "ACCEPT",
    valid.deliberationProof.replace(
      "local-loop.deliberation.v1.",
      "local-loop.deliberation.v0.",
    ),
  );
  assert.equal(staleVersion.status, 409);

  const tamperedProof = `${valid.deliberationProof.slice(0, -1)}${
    valid.deliberationProof.endsWith("0") ? "1" : "0"
  }`;
  const tampered = await decide(
    handler,
    genuineGoInput,
    "ACCEPT",
    tamperedProof,
  );
  assert.equal(tampered.status, 409);

  const crossActorHandler = createAdminHandler({
    email: "other-admin@example.com",
  });
  const crossActor = await decide(
    crossActorHandler,
    genuineGoInput,
    "ACCEPT",
    valid.deliberationProof,
  );
  assert.equal(crossActor.status, 409);

  const crossState = await decide(
    handler,
    genuineGoInput,
    "ACCEPT",
    valid.validationProof,
  );
  assert.equal(crossState.status, 409);

  const mutatedInput = {
    ...genuineGoInput,
    title: `${genuineGoInput.title} changed`,
  };
  const mutated = await decide(
    handler,
    mutatedInput,
    "ACCEPT",
    valid.deliberationProof,
  );
  assert.equal(mutated.status, 409);

  const changedRecommendation = await decide(
    handler,
    {
      ...genuineGoInput,
      targetRepo: "other-repo",
    },
    "ACCEPT",
    valid.deliberationProof,
  );
  assert.equal(changedRecommendation.status, 409);

  const invalidValidationProof = await readResponse(
    await handler(
      jsonRequest({
        action: "DELIBERATE",
        input: genuineGoInput,
        validationProof: valid.deliberationProof,
      }),
    ),
  );
  assert.equal(invalidValidationProof.status, 409);
}

async function testRejectsNonGoAcceptance() {
  const handler = createAdminHandler();
  const needsRevisionInput = {
    ...genuineGoInput,
    evidencePointers: [],
  };
  const needsRevision = await buildProofChain(handler, needsRevisionInput);
  assert.equal(needsRevision.recommendation, "NEEDS_REVISION");
  assert.equal(
    (
      await decide(
        handler,
        needsRevisionInput,
        "ACCEPT",
        needsRevision.deliberationProof,
      )
    ).status,
    409,
  );

  const blockedInput = {
    ...genuineGoInput,
    targetRepo: "other-repo",
  };
  const blocked = await buildProofChain(handler, blockedInput);
  assert.equal(blocked.recommendation, "BLOCKED");
  assert.equal(
    (
      await decide(
        handler,
        blockedInput,
        "ACCEPT",
        blocked.deliberationProof,
      )
    ).status,
    409,
  );
}

async function testTerminalDecisionSemanticsAndDeterministicReplay() {
  const handler = createAdminHandler();
  const proofChain = await buildProofChain(handler, genuineGoInput);

  for (const decision of ["HOLD", "REJECT"] as const) {
    const result = await decide(
      handler,
      genuineGoInput,
      decision,
      proofChain.deliberationProof,
    );
    assert.equal(result.status, 200);
    const body = successBody(result.body);
    assert.equal(
      body.state,
      decision === "HOLD" ? "HELD" : "REJECTED",
    );
    assert.equal("workPacket" in body ? body.workPacket : undefined, null);
    assertArtifactBoundary(
      "artifact" in body ? body.artifact : undefined,
    );
  }

  const first = await decide(
    handler,
    genuineGoInput,
    "ACCEPT",
    proofChain.deliberationProof,
  );
  const replay = await decide(
    handler,
    genuineGoInput,
    "ACCEPT",
    proofChain.deliberationProof,
  );
  assert.equal(first.status, 200);
  assert.equal(first.text, replay.text);
  const accepted = successBody(first.body);
  assert.equal(accepted.state, "ACCEPTED");
  if (accepted.state !== "ACCEPTED") {
    throw new Error("Expected ACCEPTED response.");
  }
  assert.ok(accepted.workPacket);
  assert.equal(accepted.workPacket.execution_authority_granted, false);
  assert.equal(accepted.workPacket.status, "PROPOSED_ONLY");
  assertArtifactBoundary(accepted.artifact);
}

async function buildSuccessResponseFixtures(
  input: LocalOperatingLoopInput,
) {
  const handler = createAdminHandler();
  const validationResult = await readResponse(
    await handler(jsonRequest({ action: "VALIDATE", input })),
  );
  assert.equal(validationResult.status, 200);
  const validated = successBody(validationResult.body);
  if (validated.state !== "VALIDATED") {
    throw new Error("Expected VALIDATED response fixture.");
  }

  const deliberationResult = await readResponse(
    await handler(
      jsonRequest({
        action: "DELIBERATE",
        input,
        validationProof: validated.validationProof,
      }),
    ),
  );
  assert.equal(deliberationResult.status, 200);
  const awaitingDecision = successBody(deliberationResult.body);
  if (awaitingDecision.state !== "AWAITING_DECISION") {
    throw new Error("Expected AWAITING_DECISION response fixture.");
  }

  const acceptedResult = await decide(
    handler,
    input,
    "ACCEPT",
    awaitingDecision.deliberationProof,
  );
  assert.equal(acceptedResult.status, 200);
  const accepted = successBody(acceptedResult.body);
  if (accepted.state !== "ACCEPTED") {
    throw new Error("Expected ACCEPTED response fixture.");
  }

  const heldResult = await decide(
    handler,
    input,
    "HOLD",
    awaitingDecision.deliberationProof,
  );
  assert.equal(heldResult.status, 200);
  const held = successBody(heldResult.body);
  if (held.state !== "HELD") {
    throw new Error("Expected HELD response fixture.");
  }

  const rejectedResult = await decide(
    handler,
    input,
    "REJECT",
    awaitingDecision.deliberationProof,
  );
  assert.equal(rejectedResult.status, 200);
  const rejected = successBody(rejectedResult.body);
  if (rejected.state !== "REJECTED") {
    throw new Error("Expected REJECTED response fixture.");
  }

  return { validated, awaitingDecision, accepted, held, rejected };
}

async function buildNonAcceptResponseFixtures(
  input: LocalOperatingLoopInput,
) {
  const handler = createAdminHandler();
  const validationResult = await readResponse(
    await handler(jsonRequest({ action: "VALIDATE", input })),
  );
  assert.equal(validationResult.status, 200);
  const validated = successBody(validationResult.body);
  if (validated.state !== "VALIDATED") {
    throw new Error("Expected non-accept VALIDATED response fixture.");
  }

  const deliberationResult = await readResponse(
    await handler(
      jsonRequest({
        action: "DELIBERATE",
        input,
        validationProof: validated.validationProof,
      }),
    ),
  );
  assert.equal(deliberationResult.status, 200);
  const awaitingDecision = successBody(deliberationResult.body);
  if (awaitingDecision.state !== "AWAITING_DECISION") {
    throw new Error("Expected non-accept AWAITING_DECISION fixture.");
  }

  const heldResult = await decide(
    handler,
    input,
    "HOLD",
    awaitingDecision.deliberationProof,
  );
  assert.equal(heldResult.status, 200);
  const held = successBody(heldResult.body);
  if (held.state !== "HELD") {
    throw new Error("Expected non-accept HELD response fixture.");
  }

  const rejectedResult = await decide(
    handler,
    input,
    "REJECT",
    awaitingDecision.deliberationProof,
  );
  assert.equal(rejectedResult.status, 200);
  const rejected = successBody(rejectedResult.body);
  if (rejected.state !== "REJECTED") {
    throw new Error("Expected non-accept REJECTED response fixture.");
  }

  return { validated, awaitingDecision, held, rejected };
}

async function testBindsEveryResponseToExactRequestedTransition() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);
  const transitions: Array<{
    name: string;
    request: LocalOperatingLoopAction;
    response: LocalOperatingLoopSuccessResponse;
  }> = [
    {
      name: "VALIDATE to VALIDATED",
      request: validationRequest(genuineGoInput),
      response: fixtures.validated,
    },
    {
      name: "DELIBERATE to AWAITING_DECISION",
      request: deliberationRequest(genuineGoInput),
      response: fixtures.awaitingDecision,
    },
    {
      name: "DECIDE ACCEPT to ACCEPTED",
      request: decisionRequest(genuineGoInput, "ACCEPT"),
      response: fixtures.accepted,
    },
    {
      name: "DECIDE HOLD to HELD",
      request: decisionRequest(genuineGoInput, "HOLD"),
      response: fixtures.held,
    },
    {
      name: "DECIDE REJECT to REJECTED",
      request: decisionRequest(genuineGoInput, "REJECT"),
      response: fixtures.rejected,
    },
  ];

  for (const [requestIndex, requested] of transitions.entries()) {
    for (const [responseIndex, returned] of transitions.entries()) {
      assert.equal(
        (
          await classifyClientResponse(
            returned.response,
            requested.request,
          )
        ).kind,
        requestIndex === responseIndex ? "SUCCESS" : "RECOVERY",
        `${requested.name} with ${returned.name} response`,
      );
    }
  }
}

async function testAcceptsServerNormalizedResponsesWithoutProjectionDrift() {
  const rawInput: LocalOperatingLoopInput = {
    motionId: "  motion-normalized-fixture  ",
    title: "  Cafe\u0301 founder loop  ",
    summary:
      "  First complete line with trailing space   \r\nSecond complete line with a tab\t  \r\nThird complete line.  ",
    targetRepo: "  dev-jai-nexus  ",
    targetThreads: ["JAI_CONTROL_THREAD", "JAI_DEV_JAI_NEXUS"],
    evidencePointers: ["  evidence\u0301 pointer  "],
  };
  const parsed = parseLocalOperatingLoopAction(validationRequest(rawInput));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) {
    throw new Error("Expected the normalization fixture to parse.");
  }
  assert.notEqual(
    canonicalizeLocalOperatingLoopValue(parsed.value.input),
    canonicalizeLocalOperatingLoopValue(rawInput),
  );
  assert.equal(parsed.value.input.title, "Caf\u00e9 founder loop");
  assert.equal(
    parsed.value.input.summary,
    "First complete line with trailing space\nSecond complete line with a tab\nThird complete line.",
  );
  assert.equal(parsed.value.input.targetRepo, "dev-jai-nexus");

  const fixtures = await buildSuccessResponseFixtures(rawInput);
  for (const [name, response] of Object.entries(fixtures)) {
    assert.equal(
      (
        await classifyClientResponse(
          response,
          requestForSuccessResponse(response, rawInput),
        )
      ).kind,
      "SUCCESS",
      `normalized ${name}`,
    );
    assert.deepEqual(response.input, parsed.value.input, name);
  }
}

async function testRejectsRecommendationAndFindingContradictions() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);

  const awaitingRecommendation = mutableClone(fixtures.awaitingDecision);
  awaitingRecommendation.recommendation = "NEEDS_REVISION";
  assert.equal(
    (
      await classifyClientResponse(
        awaitingRecommendation,
        deliberationRequest(genuineGoInput),
      )
    ).kind,
    "RECOVERY",
  );

  const awaitingFindings = mutableClone(fixtures.awaitingDecision);
  awaitingFindings.findingCodes = ["EVIDENCE_REQUIRED"];
  assert.equal(
    (
      await classifyClientResponse(
        awaitingFindings,
        deliberationRequest(genuineGoInput),
      )
    ).kind,
    "RECOVERY",
  );

  const pairedFindings = mutableClone(fixtures.accepted);
  pairedFindings.findingCodes = ["EVIDENCE_REQUIRED"];
  nestedRecord(pairedFindings, "artifact").finding_codes = [
    "EVIDENCE_REQUIRED",
  ];
  assert.equal(
    (
      await classifyClientResponse(
        pairedFindings,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
  );

  const pairedRecommendation = mutableClone(fixtures.accepted);
  pairedRecommendation.recommendation = "NEEDS_REVISION";
  nestedRecord(pairedRecommendation, "artifact").recommendation =
    "NEEDS_REVISION";
  assert.equal(
    (
      await classifyClientResponse(
        pairedRecommendation,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
  );
}

async function testVerifiesContentDerivedFingerprintsAndIds() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);

  const coordinatedMotionFingerprint = mutableClone(fixtures.accepted);
  const falseMotionFingerprint = differentSha256(
    coordinatedMotionFingerprint.motionFingerprint,
  );
  coordinatedMotionFingerprint.motionFingerprint = falseMotionFingerprint;
  nestedRecord(
    coordinatedMotionFingerprint,
    "workPacket",
  ).motion_fingerprint = falseMotionFingerprint;
  nestedRecord(
    coordinatedMotionFingerprint,
    "artifact",
  ).motion_fingerprint = falseMotionFingerprint;
  assert.equal(
    (
      await classifyClientResponse(
        coordinatedMotionFingerprint,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
  );

  const falseRecommendationFingerprint = mutableClone(fixtures.accepted);
  falseRecommendationFingerprint.recommendationFingerprint = differentSha256(
    falseRecommendationFingerprint.recommendationFingerprint,
  );
  assert.equal(
    (
      await classifyClientResponse(
        falseRecommendationFingerprint,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
  );

  const coordinatedCandidate = mutableClone(fixtures.accepted);
  const artifact = nestedRecord(coordinatedCandidate, "artifact");
  const falseCandidateHash = differentSha256(
    artifact.candidate_packet_hash,
  );
  artifact.candidate_packet_hash = falseCandidateHash;
  nestedRecord(coordinatedCandidate, "workPacket").packet_id =
    `local-shadow-work-packet-${falseCandidateHash.slice(0, 24)}`;
  assert.equal(
    (
      await classifyClientResponse(
        coordinatedCandidate,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
  );

  const falseArtifactId = mutableClone(fixtures.accepted);
  const falseArtifact = nestedRecord(falseArtifactId, "artifact");
  const artifactId = falseArtifact.artifact_id;
  assert.equal(typeof artifactId, "string");
  falseArtifact.artifact_id = `local-shadow-decision-${differentSha256(
    `${(artifactId as string).slice(-24)}${"0".repeat(40)}`,
  ).slice(0, 24)}`;
  assert.equal(
    (
      await classifyClientResponse(
        falseArtifactId,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
  );

  const goWithoutCandidate = mutableClone(fixtures.awaitingDecision);
  goWithoutCandidate.candidatePacketHash = null;
  assert.equal(
    (
      await classifyClientResponse(
        goWithoutCandidate,
        deliberationRequest(genuineGoInput),
      )
    ).kind,
    "RECOVERY",
  );

  const needsRevisionInput = {
    ...genuineGoInput,
    evidencePointers: [],
  };
  const needsRevision = await buildNonAcceptResponseFixtures(
    needsRevisionInput,
  );
  const nonGoWithCandidate = mutableClone(needsRevision.awaitingDecision);
  nonGoWithCandidate.candidatePacketHash = "a".repeat(64);
  assert.equal(
    (
      await classifyClientResponse(
        nonGoWithCandidate,
        deliberationRequest(needsRevisionInput),
      )
    ).kind,
    "RECOVERY",
  );

  const unavailableHasher: LocalOperatingLoopContentHasher = async () => {
    throw new Error("Browser SHA-256 is unavailable.");
  };
  assert.equal(
    (
      await classifyLocalOperatingLoopClientResponse(
        fixtures.validated,
        clientResponseExpectation(validationRequest(genuineGoInput)),
        unavailableHasher,
      )
    ).kind,
    "RECOVERY",
  );
}

async function testRejectsFullyCoordinatedFalseEvidenceGraphs() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);
  const candidatePacketDomain =
    "jai-nexus/local-operating-loop/candidate-packet/v1";
  const recommendationDomain =
    "jai-nexus/local-operating-loop/recommendation/v1";
  const artifactDomain =
    "jai-nexus/local-operating-loop/decision-artifact/v1";

  function packetMaterial(input: {
    motionFingerprint: string;
    actor: string;
    motion: LocalOperatingLoopInput;
  }) {
    return {
      packet_version: "local-shadow-work-packet.v1",
      status: "PROPOSED_ONLY",
      base_sha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
      motion_id: input.motion.motionId,
      motion_fingerprint: input.motionFingerprint,
      title: input.motion.title,
      summary: input.motion.summary,
      target_repo: input.motion.targetRepo,
      target_threads: [...input.motion.targetThreads],
      evidence_pointers: [...input.motion.evidencePointers],
      proposed_by: input.actor,
      decision_scope: "GENERATE_WORK_PACKET_ONLY",
      execution_authority_granted: false,
      non_authorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
    };
  }

  function artifactMaterial(input: {
    motion: LocalOperatingLoopInput;
    motionFingerprint: string;
    recommendation: "GO" | "NEEDS_REVISION" | "BLOCKED";
    findingCodes: string[];
    decision: "ACCEPT" | "HOLD" | "REJECT";
    actor: string;
    candidatePacketHash: string | null;
  }) {
    return {
      artifact_version: "local-shadow-decision-artifact.v1",
      base_sha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
      motion_id: input.motion.motionId,
      motion_fingerprint: input.motionFingerprint,
      recommendation: input.recommendation,
      finding_codes: input.findingCodes,
      decision: input.decision,
      actor: input.actor,
      candidate_packet_hash: input.candidatePacketHash,
      receipt_authority: "DEMONSTRATION_ONLY",
      persistence: "NONE",
      program_effect: "NONE",
      not_a_control_thread_acceptance_receipt: true,
      decision_scope: "GENERATE_WORK_PACKET_ONLY",
      execution_authority_granted: false,
    };
  }

  async function artifactId(material: unknown) {
    const digest = await hashLocalOperatingLoopCanonicalValue(
      artifactDomain,
      material,
    );
    return `local-shadow-decision-${digest.slice(0, 24)}`;
  }

  const falseMotionGraph = mutableClone(fixtures.accepted);
  const falseMotionPacket = nestedRecord(falseMotionGraph, "workPacket");
  const falseMotionArtifact = nestedRecord(falseMotionGraph, "artifact");
  const falseMotionFingerprint = differentSha256(
    falseMotionGraph.motionFingerprint,
  );
  falseMotionGraph.motionFingerprint = falseMotionFingerprint;
  falseMotionPacket.motion_fingerprint = falseMotionFingerprint;
  falseMotionArtifact.motion_fingerprint = falseMotionFingerprint;
  const falseMotionPacketMaterial = packetMaterial({
    motion: fixtures.accepted.input,
    actor: fixtures.accepted.actor,
    motionFingerprint: falseMotionFingerprint,
  });
  const falseMotionCandidateHash =
    await hashLocalOperatingLoopCanonicalValue(
      candidatePacketDomain,
      falseMotionPacketMaterial,
    );
  falseMotionPacket.packet_id =
    `local-shadow-work-packet-${falseMotionCandidateHash.slice(0, 24)}`;
  falseMotionArtifact.candidate_packet_hash = falseMotionCandidateHash;
  const falseMotionArtifactMaterial = artifactMaterial({
    motion: fixtures.accepted.input,
    motionFingerprint: falseMotionFingerprint,
    recommendation: fixtures.accepted.recommendation,
    findingCodes: [...fixtures.accepted.findingCodes],
    decision: fixtures.accepted.decision,
    actor: fixtures.accepted.actor,
    candidatePacketHash: falseMotionCandidateHash,
  });
  falseMotionArtifact.artifact_id = await artifactId(
    falseMotionArtifactMaterial,
  );
  assert.notEqual(
    falseMotionFingerprint,
    fixtures.accepted.motionFingerprint,
  );
  assert.equal(falseMotionGraph.motionFingerprint, falseMotionFingerprint);
  assert.deepEqual(falseMotionPacket, {
    packet_id: `local-shadow-work-packet-${falseMotionCandidateHash.slice(0, 24)}`,
    ...falseMotionPacketMaterial,
  });
  assert.deepEqual(falseMotionArtifact, {
    artifact_id: await artifactId(falseMotionArtifactMaterial),
    ...falseMotionArtifactMaterial,
  });
  assert.equal(
    (
      await classifyClientResponse(
        falseMotionGraph,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
    "coordinated false motion-fingerprint graph",
  );

  const falseCandidateGraph = mutableClone(fixtures.accepted);
  const falseCandidatePacket = nestedRecord(
    falseCandidateGraph,
    "workPacket",
  );
  const falseCandidateArtifact = nestedRecord(
    falseCandidateGraph,
    "artifact",
  );
  const validPacketMaterial = packetMaterial({
    motion: fixtures.accepted.input,
    actor: fixtures.accepted.actor,
    motionFingerprint: fixtures.accepted.motionFingerprint,
  });
  const validCandidateHash = await hashLocalOperatingLoopCanonicalValue(
    candidatePacketDomain,
    validPacketMaterial,
  );
  const falseCandidateHash = differentSha256(validCandidateHash);
  falseCandidatePacket.packet_id =
    `local-shadow-work-packet-${falseCandidateHash.slice(0, 24)}`;
  falseCandidateArtifact.candidate_packet_hash = falseCandidateHash;
  const falseCandidateArtifactMaterial = artifactMaterial({
    motion: fixtures.accepted.input,
    motionFingerprint: fixtures.accepted.motionFingerprint,
    recommendation: fixtures.accepted.recommendation,
    findingCodes: [...fixtures.accepted.findingCodes],
    decision: fixtures.accepted.decision,
    actor: fixtures.accepted.actor,
    candidatePacketHash: falseCandidateHash,
  });
  falseCandidateArtifact.artifact_id = await artifactId(
    falseCandidateArtifactMaterial,
  );
  assert.equal(
    validCandidateHash,
    fixtures.accepted.artifact.candidate_packet_hash,
  );
  assert.notEqual(falseCandidateHash, validCandidateHash);
  assert.deepEqual(falseCandidatePacket, {
    packet_id: `local-shadow-work-packet-${falseCandidateHash.slice(0, 24)}`,
    ...validPacketMaterial,
  });
  assert.deepEqual(falseCandidateArtifact, {
    artifact_id: await artifactId(falseCandidateArtifactMaterial),
    ...falseCandidateArtifactMaterial,
  });
  assert.equal(
    (
      await classifyClientResponse(
        falseCandidateGraph,
        decisionRequest(genuineGoInput, "ACCEPT"),
      )
    ).kind,
    "RECOVERY",
    "coordinated false candidate-hash graph",
  );

  const falseRecommendationGraph = mutableClone(fixtures.held);
  const falseRecommendationArtifact = nestedRecord(
    falseRecommendationGraph,
    "artifact",
  );
  const falseRecommendation = "NEEDS_REVISION" as const;
  const falseFindingCodes = ["EVIDENCE_REQUIRED"];
  const falseRecommendationFingerprint =
    await hashLocalOperatingLoopCanonicalValue(recommendationDomain, {
      recommendation: falseRecommendation,
      findingCodes: falseFindingCodes,
    });
  falseRecommendationGraph.recommendation = falseRecommendation;
  falseRecommendationGraph.findingCodes = falseFindingCodes;
  falseRecommendationGraph.recommendationFingerprint =
    falseRecommendationFingerprint;
  falseRecommendationGraph.workPacket = null;
  falseRecommendationArtifact.recommendation = falseRecommendation;
  falseRecommendationArtifact.finding_codes = falseFindingCodes;
  falseRecommendationArtifact.candidate_packet_hash = null;
  const falseRecommendationArtifactMaterial = artifactMaterial({
    motion: fixtures.held.input,
    motionFingerprint: fixtures.held.motionFingerprint,
    recommendation: falseRecommendation,
    findingCodes: falseFindingCodes,
    decision: fixtures.held.decision,
    actor: fixtures.held.actor,
    candidatePacketHash: null,
  });
  falseRecommendationArtifact.artifact_id = await artifactId(
    falseRecommendationArtifactMaterial,
  );
  assert.deepEqual(
    deriveLocalOperatingLoopRecommendation(fixtures.held.input),
    { recommendation: "GO", findingCodes: [], advisoryOnly: true },
  );
  assert.equal(falseRecommendationGraph.workPacket, null);
  assert.equal(falseRecommendationArtifact.candidate_packet_hash, null);
  assert.equal(
    falseRecommendationGraph.recommendationFingerprint,
    await hashLocalOperatingLoopCanonicalValue(recommendationDomain, {
      recommendation: falseRecommendation,
      findingCodes: falseFindingCodes,
    }),
  );
  assert.deepEqual(falseRecommendationArtifact, {
    artifact_id: await artifactId(falseRecommendationArtifactMaterial),
    ...falseRecommendationArtifactMaterial,
  });
  assert.equal(
    (
      await classifyClientResponse(
        falseRecommendationGraph,
        decisionRequest(genuineGoInput, "HOLD"),
      )
    ).kind,
    "RECOVERY",
    "coordinated false recommendation/findings graph",
  );
}

async function testClassifiesValidNonGoTerminalResponses() {
  const go = await buildSuccessResponseFixtures(genuineGoInput);
  assert.equal(go.awaitingDecision.recommendation, "GO");
  assert.match(go.awaitingDecision.candidatePacketHash ?? "", /^[a-f0-9]{64}$/);
  assert.equal(
    (
      await classifyClientResponse(
        go.awaitingDecision,
        deliberationRequest(genuineGoInput),
      )
    ).kind,
    "SUCCESS",
  );

  const cases: Array<{
    name: string;
    input: LocalOperatingLoopInput;
    recommendation: "NEEDS_REVISION" | "BLOCKED";
  }> = [
    {
      name: "needs revision",
      input: { ...genuineGoInput, evidencePointers: [] },
      recommendation: "NEEDS_REVISION",
    },
    {
      name: "blocked",
      input: { ...genuineGoInput, targetRepo: "other-repo" },
      recommendation: "BLOCKED",
    },
  ];

  for (const item of cases) {
    const fixtures = await buildNonAcceptResponseFixtures(item.input);
    assert.equal(
      fixtures.awaitingDecision.recommendation,
      item.recommendation,
      item.name,
    );
    assert.equal(fixtures.awaitingDecision.candidatePacketHash, null, item.name);
    assert.equal(
      (
        await classifyClientResponse(
          fixtures.awaitingDecision,
          deliberationRequest(item.input),
        )
      ).kind,
      "SUCCESS",
      `${item.name} awaiting`,
    );
    assert.equal(
      (
        await classifyClientResponse(
          fixtures.held,
          decisionRequest(item.input, "HOLD"),
        )
      ).kind,
      "SUCCESS",
      `${item.name} hold`,
    );
    assert.equal(
      (
        await classifyClientResponse(
          fixtures.rejected,
          decisionRequest(item.input, "REJECT"),
        )
      ).kind,
      "SUCCESS",
      `${item.name} reject`,
    );
  }
}

async function testSuppressesResponsesThatBecomeStaleDuringAsyncClassification() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);

  async function classifyAfterOwnershipChange(
    invalidation: "PROJECTION" | "REQUEST",
  ) {
    let releaseHashing: (() => void) | undefined;
    let markHashingStarted: (() => void) | undefined;
    const hashingBlocked = new Promise<void>((resolve) => {
      releaseHashing = resolve;
    });
    const hashingStarted = new Promise<void>((resolve) => {
      markHashingStarted = resolve;
    });
    const delayedHasher: LocalOperatingLoopContentHasher = async (
      domain,
      value,
    ) => {
      markHashingStarted?.();
      await hashingBlocked;
      return hashLocalOperatingLoopCanonicalValue(domain, value);
    };
    const requestId = 7;
    const responseProjectionKey =
      createLocalOperatingLoopProjectionKey(genuineGoInput);
    let currentProjectionKey = responseProjectionKey;
    let currentRequestId: number | null = requestId;
    const classificationPromise =
      classifyLocalOperatingLoopClientResponse(
        fixtures.validated,
        clientResponseExpectation(validationRequest(genuineGoInput)),
        delayedHasher,
      );

    await hashingStarted;
    if (invalidation === "PROJECTION") {
      currentProjectionKey = createLocalOperatingLoopProjectionKey({
        ...genuineGoInput,
        title: `${genuineGoInput.title} changed`,
      });
    } else {
      currentRequestId = requestId + 1;
    }
    releaseHashing?.();
    const classification = await classificationPromise;
    assert.equal(classification.kind, "SUCCESS");
    assert.equal(
      shouldApplyLocalOperatingLoopResponse({
        currentProjectionKey,
        responseProjectionKey,
        currentRequestId,
        responseRequestId: requestId,
      }),
      false,
    );
  }

  await classifyAfterOwnershipChange("PROJECTION");
  await classifyAfterOwnershipChange("REQUEST");
}

async function testRejectsSemanticallyIncoherentSuccessPayloads() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);
  for (const [name, response] of Object.entries(fixtures)) {
    assert.equal(
      (
        await classifyClientResponse(
          response,
          requestForSuccessResponse(response, genuineGoInput),
        )
      ).kind,
      "SUCCESS",
      `valid ${name}`,
    );
  }

  const changedInput = {
    ...genuineGoInput,
    title: `${genuineGoInput.title} changed`,
  };
  assert.equal(
    (
      await classifyLocalOperatingLoopClientResponse(
        fixtures.validated,
        clientResponseExpectation(
          validationRequest(genuineGoInput),
          changedInput,
        ),
      )
    ).kind,
    "RECOVERY",
    "current projection mismatch",
  );
  assert.equal(
    (
      await classifyLocalOperatingLoopClientResponse(fixtures.validated, {
        ...clientResponseExpectation(validationRequest(genuineGoInput)),
        requestProjectionKey:
          createLocalOperatingLoopProjectionKey(changedInput),
      })
    ).kind,
    "RECOVERY",
    "request projection mismatch",
  );

  const mutations: Array<{
    name: string;
    source: LocalOperatingLoopSuccessResponse;
    mutate: (response: Record<string, unknown>) => void;
  }> = [
    {
      name: "response input",
      source: fixtures.validated,
      mutate: (response) => {
        nestedRecord(response, "input").title = changedInput.title;
      },
    },
    {
      name: "response repository",
      source: fixtures.validated,
      mutate: (response) => {
        nestedRecord(response, "input").targetRepo = "other-repo";
      },
    },
    {
      name: "top actor",
      source: fixtures.accepted,
      mutate: (response) => {
        response.actor = "other-founder@example.com";
      },
    },
    {
      name: "top motion fingerprint",
      source: fixtures.accepted,
      mutate: (response) => {
        response.motionFingerprint = differentSha256(
          response.motionFingerprint,
        );
      },
    },
    {
      name: "validation proof format",
      source: fixtures.validated,
      mutate: (response) => {
        response.validationProof = "validation-proof";
      },
    },
    {
      name: "deliberation proof format",
      source: fixtures.awaitingDecision,
      mutate: (response) => {
        response.deliberationProof = "deliberation-proof";
      },
    },
    {
      name: "recommendation fingerprint format",
      source: fixtures.accepted,
      mutate: (response) => {
        response.recommendationFingerprint = "recommendation-fingerprint";
      },
    },
    {
      name: "accepted non-GO recommendation",
      source: fixtures.accepted,
      mutate: (response) => {
        response.recommendation = "NEEDS_REVISION";
      },
    },
    {
      name: "top finding codes",
      source: fixtures.accepted,
      mutate: (response) => {
        response.findingCodes = ["EVIDENCE_REQUIRED"];
      },
    },
    {
      name: "terminal decision",
      source: fixtures.accepted,
      mutate: (response) => {
        response.decision = "HOLD";
      },
    },
    {
      name: "accepted packet missing",
      source: fixtures.accepted,
      mutate: (response) => {
        response.workPacket = null;
      },
    },
    {
      name: "held packet present",
      source: fixtures.held,
      mutate: (response) => {
        response.workPacket = structuredClone(fixtures.accepted.workPacket);
      },
    },
    {
      name: "packet motion id",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").motion_id = "other-motion";
      },
    },
    {
      name: "packet motion fingerprint",
      source: fixtures.accepted,
      mutate: (response) => {
        const packet = nestedRecord(response, "workPacket");
        packet.motion_fingerprint = differentSha256(
          packet.motion_fingerprint,
        );
      },
    },
    {
      name: "packet title",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").title = "Other title";
      },
    },
    {
      name: "packet summary",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").summary = "Other summary";
      },
    },
    {
      name: "packet repository",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").target_repo = "other-repo";
      },
    },
    {
      name: "packet target threads",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").target_threads = [
          "JAI_CONTROL_THREAD",
        ];
      },
    },
    {
      name: "packet evidence pointers",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").evidence_pointers = [];
      },
    },
    {
      name: "packet actor",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "workPacket").proposed_by =
          "other-founder@example.com";
      },
    },
    {
      name: "packet id",
      source: fixtures.accepted,
      mutate: (response) => {
        const packet = nestedRecord(response, "workPacket");
        const artifact = nestedRecord(response, "artifact");
        packet.packet_id = `local-shadow-work-packet-${differentSha256(
          artifact.candidate_packet_hash,
        ).slice(0, 24)}`;
      },
    },
    {
      name: "artifact id format",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "artifact").artifact_id =
          `local-shadow-decision-artifact-${"a".repeat(24)}`;
      },
    },
    {
      name: "artifact motion id",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "artifact").motion_id = "other-motion";
      },
    },
    {
      name: "artifact motion fingerprint",
      source: fixtures.accepted,
      mutate: (response) => {
        const artifact = nestedRecord(response, "artifact");
        artifact.motion_fingerprint = differentSha256(
          artifact.motion_fingerprint,
        );
      },
    },
    {
      name: "artifact recommendation",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "artifact").recommendation =
          "NEEDS_REVISION";
      },
    },
    {
      name: "artifact findings",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "artifact").finding_codes = [
          "EVIDENCE_REQUIRED",
        ];
      },
    },
    {
      name: "artifact decision",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "artifact").decision = "HOLD";
      },
    },
    {
      name: "artifact actor",
      source: fixtures.accepted,
      mutate: (response) => {
        nestedRecord(response, "artifact").actor =
          "other-founder@example.com";
      },
    },
    {
      name: "candidate packet hash",
      source: fixtures.accepted,
      mutate: (response) => {
        const artifact = nestedRecord(response, "artifact");
        artifact.candidate_packet_hash = differentSha256(
          artifact.candidate_packet_hash,
        );
      },
    },
  ];

  for (const { name, source: response, mutate } of mutations) {
    const request = requestForSuccessResponse(response, genuineGoInput);
    const candidate = mutableClone(response);
    mutate(candidate);
    assert.equal(
      (await classifyClientResponse(candidate, request)).kind,
      "RECOVERY",
      name,
    );
  }
}

async function testRejectsNonStringResponseEnums() {
  const fixtures = await buildSuccessResponseFixtures(genuineGoInput);
  const targets: Array<{
    name: string;
    source: LocalOperatingLoopSuccessResponse;
    expected: string;
    set: (response: Record<string, unknown>, value: unknown) => void;
  }> = [
    {
      name: "validated state",
      source: fixtures.validated,
      expected: "VALIDATED",
      set: (response, value) => {
        response.state = value;
      },
    },
    {
      name: "awaiting state",
      source: fixtures.awaitingDecision,
      expected: "AWAITING_DECISION",
      set: (response, value) => {
        response.state = value;
      },
    },
    {
      name: "recommendation",
      source: fixtures.accepted,
      expected: "GO",
      set: (response, value) => {
        response.recommendation = value;
      },
    },
    {
      name: "terminal state",
      source: fixtures.accepted,
      expected: "ACCEPTED",
      set: (response, value) => {
        response.state = value;
      },
    },
    {
      name: "decision",
      source: fixtures.accepted,
      expected: "ACCEPT",
      set: (response, value) => {
        response.decision = value;
      },
    },
    {
      name: "packet version",
      source: fixtures.accepted,
      expected: "local-shadow-work-packet.v1",
      set: (response, value) => {
        nestedRecord(response, "workPacket").packet_version = value;
      },
    },
    {
      name: "packet status",
      source: fixtures.accepted,
      expected: "PROPOSED_ONLY",
      set: (response, value) => {
        nestedRecord(response, "workPacket").status = value;
      },
    },
    {
      name: "packet decision scope",
      source: fixtures.accepted,
      expected: "GENERATE_WORK_PACKET_ONLY",
      set: (response, value) => {
        nestedRecord(response, "workPacket").decision_scope = value;
      },
    },
    {
      name: "artifact version",
      source: fixtures.accepted,
      expected: "local-shadow-decision-artifact.v1",
      set: (response, value) => {
        nestedRecord(response, "artifact").artifact_version = value;
      },
    },
    {
      name: "artifact recommendation",
      source: fixtures.accepted,
      expected: "GO",
      set: (response, value) => {
        nestedRecord(response, "artifact").recommendation = value;
      },
    },
    {
      name: "artifact decision",
      source: fixtures.accepted,
      expected: "ACCEPT",
      set: (response, value) => {
        nestedRecord(response, "artifact").decision = value;
      },
    },
    {
      name: "artifact receipt authority",
      source: fixtures.accepted,
      expected: "DEMONSTRATION_ONLY",
      set: (response, value) => {
        nestedRecord(response, "artifact").receipt_authority = value;
      },
    },
    {
      name: "artifact persistence",
      source: fixtures.accepted,
      expected: "NONE",
      set: (response, value) => {
        nestedRecord(response, "artifact").persistence = value;
      },
    },
    {
      name: "artifact program effect",
      source: fixtures.accepted,
      expected: "NONE",
      set: (response, value) => {
        nestedRecord(response, "artifact").program_effect = value;
      },
    },
    {
      name: "artifact decision scope",
      source: fixtures.accepted,
      expected: "GENERATE_WORK_PACKET_ONLY",
      set: (response, value) => {
        nestedRecord(response, "artifact").decision_scope = value;
      },
    },
  ];

  for (const target of targets) {
    const request = requestForSuccessResponse(
      target.source,
      genuineGoInput,
    );
    const invalidValues: unknown[] = [
      [target.expected],
      [[target.expected]],
      { value: target.expected },
      1,
      true,
      null,
    ];
    for (const invalidValue of invalidValues) {
      const candidate = mutableClone(target.source);
      target.set(candidate, invalidValue);
      assert.equal(
        (await classifyClientResponse(candidate, request)).kind,
        "RECOVERY",
        `${target.name}: ${JSON.stringify(invalidValue)}`,
      );
    }
  }
}

async function testAstralUnicodeLimitsMatchDtoAndClientClassifier() {
  const astral = "\u{1F680}";
  const exactInputs: Array<{
    name: string;
    exact: LocalOperatingLoopInput;
    over: LocalOperatingLoopInput;
  }> = [
    {
      name: "motion id",
      exact: { ...genuineGoInput, motionId: `m${astral.repeat(159)}` },
      over: { ...genuineGoInput, motionId: `m${astral.repeat(160)}` },
    },
    {
      name: "title",
      exact: { ...genuineGoInput, title: `t${astral.repeat(239)}` },
      over: { ...genuineGoInput, title: `t${astral.repeat(240)}` },
    },
    {
      name: "summary",
      exact: { ...genuineGoInput, summary: `s${astral.repeat(3999)}` },
      over: { ...genuineGoInput, summary: `s${astral.repeat(4000)}` },
    },
    {
      name: "target repository",
      exact: { ...genuineGoInput, targetRepo: `r${astral.repeat(199)}` },
      over: { ...genuineGoInput, targetRepo: `r${astral.repeat(200)}` },
    },
    {
      name: "evidence pointer",
      exact: {
        ...genuineGoInput,
        evidencePointers: [`e${astral.repeat(499)}`],
      },
      over: {
        ...genuineGoInput,
        evidencePointers: [`e${astral.repeat(500)}`],
      },
    },
  ];

  for (const boundary of exactInputs) {
    assert.equal(
      parseLocalOperatingLoopAction({
        action: "VALIDATE",
        input: boundary.exact,
      }).ok,
      true,
      `${boundary.name} exact DTO limit`,
    );
    assert.equal(
      parseLocalOperatingLoopAction({
        action: "VALIDATE",
        input: boundary.over,
      }).ok,
      false,
      `${boundary.name} over DTO limit`,
    );
  }

  const unicodeGoInput: LocalOperatingLoopInput = {
    ...genuineGoInput,
    motionId: `m${astral.repeat(159)}`,
    title: `t${astral.repeat(239)}`,
    summary: `s${astral.repeat(3999)}`,
    evidencePointers: [`e${astral.repeat(499)}`],
  };
  const fixtures = await buildSuccessResponseFixtures(unicodeGoInput);
  for (const [name, response] of Object.entries(fixtures)) {
    assert.equal(
      (
        await classifyClientResponse(
          response,
          requestForSuccessResponse(response, unicodeGoInput),
        )
      ).kind,
      "SUCCESS",
      `valid Unicode ${name}`,
    );
  }
  for (const state of ["ACCEPTED", "HELD", "REJECTED"] as const) {
    const response =
      state === "ACCEPTED"
        ? fixtures.accepted
        : state === "HELD"
          ? fixtures.held
          : fixtures.rejected;
    assert.equal(
      (
        await classifyClientResponse(
          response,
          requestForSuccessResponse(response, unicodeGoInput),
        )
      ).kind,
      "SUCCESS",
      `valid Unicode ${state}`,
    );
  }

  for (const boundary of exactInputs) {
    const overResponse = mutableClone(fixtures.validated);
    overResponse.input = structuredClone(boundary.over);
    assert.equal(
      (
        await classifyLocalOperatingLoopClientResponse(
          overResponse,
          clientResponseExpectation(validationRequest(boundary.over)),
        )
      ).kind,
      "RECOVERY",
      `${boundary.name} over client limit`,
    );
  }
}

async function testUnknownRecoveryCodesUseOwnPropertyFallback() {
  const generic = createLocalOperatingLoopRecoveryNotice(
    "UNKNOWN_RECOVERY_CODE",
  );
  const prototypeNames = [
    "__proto__",
    "constructor",
    "prototype",
    "toString",
    "valueOf",
    "hasOwnProperty",
  ];

  for (const code of prototypeNames) {
    assert.deepEqual(
      createLocalOperatingLoopRecoveryNotice(code),
      generic,
      code,
    );
    const classification = await classifyClientResponse({
      ok: false,
      error: { code, message: "must never reach founder-visible copy" },
      nonAuthorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
    });
    assert.equal(classification.kind, "RECOVERY", code);
    if (classification.kind !== "RECOVERY") {
      throw new Error(`Expected ${code} recovery classification.`);
    }
    assert.deepEqual(
      createLocalOperatingLoopRecoveryNotice(classification.code),
      generic,
      code,
    );
  }

  assert.equal(
    createLocalOperatingLoopRecoveryNotice("UNAUTHENTICATED").id,
    "authentication-expired",
  );
}

async function testFullCanonicalKeyInvalidationAndStaleSuppression() {
  const firstKey = createLocalOperatingLoopProjectionKey(genuineGoInput);
  const titleChangedKey = createLocalOperatingLoopProjectionKey({
    ...genuineGoInput,
    title: `${genuineGoInput.title} changed`,
  });
  const evidenceChangedKey = createLocalOperatingLoopProjectionKey({
    ...genuineGoInput,
    evidencePointers: [...genuineGoInput.evidencePointers, "second pointer"],
  });
  assert.notEqual(firstKey, titleChangedKey);
  assert.notEqual(firstKey, evidenceChangedKey);

  const populatedState = {
    ...createLocalOperatingLoopUiState(firstKey),
    state: "AWAITING_DECISION" as const,
    validationProof: "validation-proof",
    deliberationProof: "deliberation-proof",
    recommendation: "GO" as const,
    activeRequestId: 7,
  };
  assert.equal(
    invalidateLocalOperatingLoopUiState(populatedState, firstKey),
    populatedState,
  );
  assert.deepEqual(
    invalidateLocalOperatingLoopUiState(populatedState, titleChangedKey),
    createLocalOperatingLoopUiState(titleChangedKey),
  );

  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: firstKey,
      responseProjectionKey: firstKey,
      currentRequestId: 7,
      responseRequestId: 7,
    }),
    true,
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: titleChangedKey,
      responseProjectionKey: firstKey,
      currentRequestId: 7,
      responseRequestId: 7,
    }),
    false,
  );
  assert.equal(
    shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: firstKey,
      responseProjectionKey: firstKey,
      currentRequestId: 8,
      responseRequestId: 7,
    }),
    false,
  );
}

async function testProductionSourceAndImportIsolation() {
  const pureSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const handlerSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop-handler.ts",
  );
  const routeSource = source(
    "src/app/api/operator/motion-control/local-operating-loop/route.ts",
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const composerSource = source(
    "src/app/operator/motion-control/NativeMotionIntakeComposer.tsx",
  );
  const workflowSource = source("../.github/workflows/portal-ci-guardrails.yml");

  assert.deepEqual(importSpecifiers(pureSource), ["zod"]);
  assert.doesNotMatch(pureSource, /node:|process\.env|next-auth|@\/auth/);
  assert.doesNotMatch(pureSource, /\bString\(value\)/);
  assert.match(pureSource, /Object\.prototype\.hasOwnProperty\.call\(/);

  assert.deepEqual(importSpecifiers(handlerSource), [
    "node:crypto",
    "./local-operating-loop",
  ]);
  assert.match(handlerSource, /timingSafeEqual\(/);
  assert.doesNotMatch(
    handlerSource,
    /from\s+["'][^"']*(prisma|provider|filesystem|github|linear|agent|council)/i,
  );
  assert.doesNotMatch(handlerSource, /\bfetch\(/);

  assert.deepEqual(importSpecifiers(routeSource), [
    "next/server",
    "next-auth/jwt",
    "@/lib/controlPlane/motionKernel/local-operating-loop-handler",
  ]);
  assert.match(routeSource, /runtime = "nodejs"/);
  assert.match(routeSource, /dynamic = "force-dynamic"/);
  assert.match(routeSource, /getToken/);
  assert.doesNotMatch(routeSource, /@\/auth|getServerAuthSession|prisma/i);

  assert.doesNotMatch(
    panelSource,
    /local-operating-loop-handler|\/route|node:|process\.env|next-auth|prisma/i,
  );
  assert.match(
    panelSource,
    /"\/api\/operator\/motion-control\/local-operating-loop"/,
  );
  assert.match(panelSource, /createLocalOperatingLoopProjectionKey/);
  assert.match(panelSource, /shouldApplyLocalOperatingLoopResponse/);
  assert.match(panelSource, /key=\{projectionKey\}/);
  assert.match(panelSource, /abortAndReleaseActiveRequest/);
  assert.match(panelSource, /controller\?\.abort\(\)/);
  assert.match(panelSource, /classifyLocalOperatingLoopClientResponse/);
  assert.match(
    panelSource,
    /await classifyLocalOperatingLoopClientResponse/,
  );
  assert.match(panelSource, /request: requestBody/);
  assert.match(panelSource, /requestProjectionKey,/);
  assert.match(panelSource, /currentProjectionKey: projectionKey/);
  const classificationIndex = panelSource.indexOf(
    "await classifyLocalOperatingLoopClientResponse",
  );
  assert.ok(classificationIndex >= 0);
  assert.ok(
    panelSource.indexOf("if (!responseStillOwned())", classificationIndex) >
      classificationIndex,
  );
  assert.match(panelSource, /recoverLocalOperatingLoopClientFailure/);
  assert.match(
    panelSource,
    /createLocalOperatingLoopStructuralRemediations\(/,
  );
  assert.match(
    panelSource,
    /recoverLocalOperatingLoopStructuralFailure\(/,
  );
  assert.match(panelSource, /role="alert"/);
  assert.match(panelSource, /aria-live="assertive"/);
  assert.match(panelSource, /tabIndex=\{-1\}/);
  assert.match(
    panelSource,
    /remediationHeadingRef\.current\?\.focus\(\)/,
  );
  assert.doesNotMatch(panelSource, /issue\.(?:path|code)/);
  assert.doesNotMatch(
    panelSource,
    /deriveLocalOperatingLoopRecommendation/,
  );
  assert.doesNotMatch(panelSource, /error\.message|console\.|responseText\}/);

  assert.match(
    composerSource,
    /import \{ LocalOperatingLoopPanel \} from "\.\/LocalOperatingLoopPanel"/,
  );
  assert.match(
    composerSource,
    /<LocalOperatingLoopPanel selectedMotion=\{selectedMotion\} \/>/,
  );

  assert.match(workflowSource, /local-operating-loop\.ts/);
  assert.match(workflowSource, /local-operating-loop\.test\.ts/);
  assert.doesNotMatch(
    `${pureSource}\n${handlerSource}\n${routeSource}\n${panelSource}`,
    /@\/lib\/controlPlane\/motionKernel["']/,
  );
}

function createAdminHandler(input?: {
  secret?: string;
  email?: string;
}) {
  return createLocalOperatingLoopHandler({
    readSecret: () => input?.secret ?? SYNTHETIC_SECRET,
    authenticate: async () => ({
      authenticated: true,
      role: "ADMIN",
      email: input?.email ?? ADMIN_EMAIL,
    }),
  });
}

async function buildProofChain(
  handler: ReturnType<typeof createAdminHandler>,
  input: LocalOperatingLoopInput,
) {
  const validation = await readResponse(
    await handler(jsonRequest({ action: "VALIDATE", input })),
  );
  assert.equal(validation.status, 200);
  const validationBody = successBody(validation.body);
  assert.equal(validationBody.state, "VALIDATED");
  if (validationBody.state !== "VALIDATED") {
    throw new Error("Expected VALIDATED response.");
  }

  const deliberation = await readResponse(
    await handler(
      jsonRequest({
        action: "DELIBERATE",
        input,
        validationProof: validationBody.validationProof,
      }),
    ),
  );
  assert.equal(deliberation.status, 200);
  const deliberationBody = successBody(deliberation.body);
  assert.equal(deliberationBody.state, "AWAITING_DECISION");
  if (deliberationBody.state !== "AWAITING_DECISION") {
    throw new Error("Expected AWAITING_DECISION response.");
  }

  return {
    validationProof: validationBody.validationProof,
    deliberationProof: deliberationBody.deliberationProof,
    recommendation: deliberationBody.recommendation,
  };
}

async function decide(
  handler: ReturnType<typeof createAdminHandler>,
  input: LocalOperatingLoopInput,
  decision: "ACCEPT" | "HOLD" | "REJECT",
  deliberationProof: string,
) {
  return readResponse(
    await handler(
      jsonRequest({
        action: "DECIDE",
        input,
        decision,
        deliberationProof,
      }),
    ),
  );
}

function jsonRequest(body: unknown): Request {
  return new Request(routeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function bodyTrackingRequest() {
  let reads = 0;
  return {
    request: {
      json: async () => {
        reads += 1;
        throw new Error("Body must not be read.");
      },
    } as unknown as Request,
    readCount: () => reads,
  };
}

async function readResponse(response: Response) {
  const text = await response.text();
  return {
    status: response.status,
    cacheControl: response.headers.get("Cache-Control"),
    text,
    body: JSON.parse(text) as LocalOperatingLoopResponse,
  };
}

function successBody(
  body: LocalOperatingLoopResponse,
): LocalOperatingLoopSuccessResponse {
  assert.equal(body.ok, true);
  return body;
}

function assertArtifactBoundary(
  artifact:
    | Extract<
        LocalOperatingLoopSuccessResponse,
        { state: "ACCEPTED" | "HELD" | "REJECTED" }
      >["artifact"]
    | undefined,
) {
  assert.ok(artifact);
  assert.equal(artifact.receipt_authority, "DEMONSTRATION_ONLY");
  assert.equal(artifact.persistence, "NONE");
  assert.equal(artifact.program_effect, "NONE");
  assert.equal(artifact.not_a_control_thread_acceptance_receipt, true);
  assert.equal(artifact.decision_scope, "GENERATE_WORK_PACKET_ONLY");
  assert.equal(artifact.execution_authority_granted, false);
}

function source(path: string): string {
  return readFileSync(path, "utf8");
}

function collectNestedKeys(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectNestedKeys(item));
  }
  if (typeof value !== "object" || value === null) {
    return [];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, nested]) => [key, ...collectNestedKeys(nested)],
  );
}

function importSpecifiers(value: string): string[] {
  return [...value.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
}

assert.equal(
  canonicalizeLocalOperatingLoopValue({ b: 2, a: 1 }),
  '{"a":1,"b":2}',
);
await testStrictStructuralValidationAndNormalization();
await testRejectsEveryAuthorityBearingOrUnknownFieldClass();
await testExactDeterministicRecommendationMapping();
await testExplainableRecommendationSnapshotsForGoNeedsRevisionAndBlocked();
await testRecommendationExplanationRequiresCompleteApplicableFindingGraph();
await testFindingExplanationsBindToCanonicalSourceAndPrecedence();
await testSemanticRemediationIsAllowlistedOrderedAndDeduplicated();
await testUnknownFindingFailsClosedToGenericSemanticGuidance();
await testProofStatusIsProjectionBoundFounderReadableAndRedacted();
await testPendingRequestsPreserveCurrentPriorTransition();
await testProofStatusReturnsNotCurrentForInconsistentState();
await testFounderSafeTerminalPresentationSnapshots();
await testFounderSafeTerminalPresentationRejectsIncoherentState();
await testFounderSafeTerminalPresentationExcludesSensitiveKeys();
await testTerminalUiContainsNoRawJsonSink();
await testUnstagedDraftChangesSuspendOnlySelectedComposedProjection();
await testComposerEditsNeverAutoStage();
await testUnstagedComposerGateUnmountsLoopAndIsAccessible();
await testExistingAbortInvalidationAndRecoveryContractsRemainIntact();
await testCanonicalChangeClearsExplainabilityAndProofStatus();
await testRecommendationExplanationRemainsServerDerived();
await testStructuralRemediationRemainsDistinctFromSemanticGuidance();
await testD5FailClosedCoherenceRemainsIntact();
await testExplainabilityPanelAccessibleStaticWiring();
await testProductionDependencyIsolation();
await testStructuralValidationPrecedesSemanticDeliberation();
await testPhaseCopyDistinguishesStructureFromSemantics();
await testSafeDeterministicStructuralRemediation();
await testStructuralFailureRecoversDraftPresentationState();
await testAuthenticationIdentityFailuresClearDerivedStateAndExposeFixedReauthControl();
await testSecretRotationInvalidProofForcesRevalidation();
await testUnavailableProofServiceClearsStaleProofAndOutputs();
await testAbortAndLateResponseSuppressionRemainDeterministic();
await testBrowserRestoreForcesFreshDraftState();
await testPageHideAndPersistedPageShowResetLifecycleIsWired();
await testEveryCanonicalFieldInvalidatesAllDerivedState();
await testAcceptedPacketAndArtifactDoNotSurviveInvalidation();
await testHoldAndRejectNeverProduceWorkPacket();
await testNoProofStateUsesBrowserStorage();
await testRecoveryControlsAreAccessibleAndPhaseSpecific();
await testD4ValidationAndDeliberationUxContractRemainsIntact();
await testAuthenticationAndSecretPrecedeBodyParsing();
await testActualNextAuthJwtIntegration();
await testClientIdentitySpoofResistance();
await testProofProgressionAndInvalidProofClasses();
await testRejectsNonGoAcceptance();
await testTerminalDecisionSemanticsAndDeterministicReplay();
await testBindsEveryResponseToExactRequestedTransition();
await testAcceptsServerNormalizedResponsesWithoutProjectionDrift();
await testRejectsRecommendationAndFindingContradictions();
await testVerifiesContentDerivedFingerprintsAndIds();
await testRejectsFullyCoordinatedFalseEvidenceGraphs();
await testClassifiesValidNonGoTerminalResponses();
await testSuppressesResponsesThatBecomeStaleDuringAsyncClassification();
await testRejectsSemanticallyIncoherentSuccessPayloads();
await testRejectsNonStringResponseEnums();
await testAstralUnicodeLimitsMatchDtoAndClientClassifier();
await testUnknownRecoveryCodesUseOwnPropertyFallback();
await testFullCanonicalKeyInvalidationAndStaleSuppression();
await testProductionSourceAndImportIsolation();

console.log("local-operating-loop.test.ts: PASS");

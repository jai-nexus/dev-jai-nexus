import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { encode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

import {
  LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_COPY_STATUS_COPY,
  LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_HEADING,
  LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
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
  beginLocalOperatingLoopDecisionConfirmation,
  canonicalizeLocalOperatingLoopValue,
  cancelLocalOperatingLoopDecisionConfirmation,
  classifyLocalOperatingLoopClientResponse,
  claimLocalOperatingLoopBoundaryReceiptCopyAttempt,
  claimLocalOperatingLoopDecisionConfirmation,
  clearLocalOperatingLoopBoundaryReceiptCopyState,
  clearLocalOperatingLoopDecisionConfirmation,
  createFounderSafeLocalOperatingLoopTerminalPresentation,
  createLocalOperatingLoopBoundaryReceipt,
  createLocalOperatingLoopBoundaryReceiptCopyState,
  createLocalOperatingLoopDecisionConfirmationPresentation,
  createLocalOperatingLoopProofStatus,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopRecommendationExplanation,
  createLocalOperatingLoopRecoveryNotice,
  createLocalOperatingLoopStructuralRemediations,
  createLocalOperatingLoopUiState,
  deriveLocalOperatingLoopRecommendation,
  hashLocalOperatingLoopCanonicalValue,
  invalidateLocalOperatingLoopUiState,
  isLocalOperatingLoopDecisionConfirmationCurrent,
  parseLocalOperatingLoopAction,
  recoverLocalOperatingLoopClientFailure,
  recoverLocalOperatingLoopStructuralFailure,
  serializeLocalOperatingLoopBoundaryReceipt,
  settleLocalOperatingLoopBoundaryReceiptCopyAttempt,
  shouldApplyLocalOperatingLoopResponse,
  shouldSuspendLocalOperatingLoopForUnstagedDraft,
  type LocalOperatingLoopAction,
  type LocalOperatingLoopContentHasher,
  type LocalOperatingLoopDecisionConfirmationContext,
  type LocalOperatingLoopDecisionConfirmationState,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopResponse,
  type LocalOperatingLoopSuccessResponse,
  type LocalOperatingLoopTerminalPresentation,
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

function terminalPresentation(
  decision: "ACCEPT" | "HOLD" | "REJECT",
) {
  const presentation =
    createFounderSafeLocalOperatingLoopTerminalPresentation(
      terminalUiState(decision),
    );
  assert.ok(presentation);
  return presentation;
}

function expectedBoundaryReceiptText(
  presentation: LocalOperatingLoopTerminalPresentation,
): string {
  return [
    LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_HEADING,
    "receipt_version: founder-readable-local-shadow-boundary-receipt.v1",
    "evidence_scope: FOUNDER_VISIBLE_REDACTED_TERMINAL_ONLY",
    "redaction_scope: EXPORT_PAYLOAD_ONLY",
    "underlying_transport_redacted: false",
    `terminal_state: ${presentation.terminalState}`,
    `decision: ${presentation.decision}`,
    `recommendation: ${presentation.recommendation}`,
    `finding_count: ${presentation.findingCount}`,
    `work_packet_count: ${presentation.workPacketCount}`,
    `work_packet_status: ${presentation.workPacketStatus}`,
    "work_packet_content: REDACTED_NOT_EXPORTED",
    "work_packet_execution_authority: false",
    "artifact_count: 1",
    "receipt_authority: DEMONSTRATION_ONLY",
    "terminal_response_persistence_claim: NONE",
    "program_effect_claim: NONE",
    "not_control_thread_acceptance_receipt: true",
    "decision_scope: GENERATE_WORK_PACKET_ONLY",
    "artifact_execution_authority: false",
    "server_hmac_authenticity: NOT_BROWSER_VERIFIED",
    "transport_redaction: NOT_CLAIMED",
    "external_persistence_effect: UNVERIFIED",
    "provider_effect: UNVERIFIED",
    "github_effect: UNVERIFIED",
    "linear_effect: UNVERIFIED",
    "agent_council_effect: UNVERIFIED",
    "customer_effect: UNVERIFIED",
    "execution_effect: UNVERIFIED",
    "deployment_effect: UNVERIFIED",
    "export_method: USER_INITIATED_LOCAL_CLIPBOARD",
    "clipboard_write_status: NOT_INCLUDED_IN_EXPORTED_RECEIPT",
    "clipboard_retention: OUTSIDE_APPLICATION_CONTROL",
    "copy_control_network_dispatch: STATICALLY_EXCLUDED",
    "copy_control_application_persistence: STATICALLY_EXCLUDED",
    "copy_control_file_download: STATICALLY_EXCLUDED",
    "verification_scope: CLIENT_COHERENCE_AND_STATIC_COPY_CONTROL_ISOLATION_ONLY",
    "receipt_authenticity: NOT_PROVIDED",
    "authority_granted: false",
    "",
  ].join("\n");
}

function decisionConfirmationContext(
  motion: LocalOperatingLoopInput = genuineGoInput,
): LocalOperatingLoopDecisionConfirmationContext {
  const projectionKey = createLocalOperatingLoopProjectionKey(motion);
  const recommendation = deriveLocalOperatingLoopRecommendation(motion);
  return {
    motion,
    currentProjectionKey: projectionKey,
    state: {
      ...createLocalOperatingLoopUiState(projectionKey),
      state: "AWAITING_DECISION",
      validationProof: SYNTHETIC_VALIDATION_PROOF,
      deliberationProof: SYNTHETIC_DELIBERATION_PROOF,
      recommendation: recommendation.recommendation,
      findingCodes: recommendation.findingCodes,
    },
  };
}

function callWithoutThrow<T>(operation: () => T): T {
  let result: T | undefined;
  assert.doesNotThrow(() => {
    result = operation();
  });
  return result as T;
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

async function testBoundaryReceiptSnapshotsForAcceptHoldAndReject() {
  for (const decision of ["ACCEPT", "HOLD", "REJECT"] as const) {
    const presentation = terminalPresentation(decision);
    const receipt = createLocalOperatingLoopBoundaryReceipt(presentation);
    assert.ok(receipt);
    assert.deepEqual(
      {
        terminal_state: receipt.terminal_state,
        decision: receipt.decision,
        recommendation: receipt.recommendation,
        finding_count: receipt.finding_count,
        work_packet_count: receipt.work_packet_count,
        work_packet_status: receipt.work_packet_status,
      },
      {
        terminal_state: presentation.terminalState,
        decision: presentation.decision,
        recommendation: presentation.recommendation,
        finding_count: presentation.findingCount,
        work_packet_count: presentation.workPacketCount,
        work_packet_status: presentation.workPacketStatus,
      },
    );
    assert.equal(
      serializeLocalOperatingLoopBoundaryReceipt(presentation),
      expectedBoundaryReceiptText(presentation),
      decision,
    );
  }
}

async function testBoundaryReceiptSerializationIsDeterministicAndLfNormalized() {
  const presentation = terminalPresentation("ACCEPT");
  const first = serializeLocalOperatingLoopBoundaryReceipt(presentation);
  const second = serializeLocalOperatingLoopBoundaryReceipt(
    structuredClone(presentation),
  );
  assert.equal(first, second);
  assert.ok(first);
  assert.ok(second);
  assert.equal(first.startsWith("\uFEFF"), false);
  assert.equal(first.includes("\r"), false);
  assert.equal(first.endsWith("\n"), true);
  assert.equal(first.endsWith("\n\n"), false);
  assert.equal(Buffer.from(first, "utf8").equals(Buffer.from(second, "utf8")), true);

  const sourceVariant = terminalUiState("ACCEPT");
  assert.ok(sourceVariant.workPacket);
  assert.ok(sourceVariant.artifact);
  sourceVariant.workPacket.title = "Different motion title never exported";
  sourceVariant.workPacket.summary =
    "Different motion summary never exported";
  sourceVariant.workPacket.proposed_by = "different-founder@example.com";
  sourceVariant.artifact.actor = "different-founder@example.com";
  sourceVariant.artifact.motion_id = "different-motion-id";
  const equivalentPresentation =
    createFounderSafeLocalOperatingLoopTerminalPresentation(sourceVariant);
  assert.deepEqual(equivalentPresentation, presentation);
  assert.equal(
    serializeLocalOperatingLoopBoundaryReceipt(equivalentPresentation),
    first,
  );
  assert.doesNotMatch(first, /Date|timestamp|uuid|digest|signature|filename/i);
}

async function testBoundaryReceiptRejectsMalformedAndIncoherentPresentationsWithoutThrowing() {
  const accepted = terminalPresentation("ACCEPT") as unknown as Record<
    string,
    unknown
  >;
  const held = terminalPresentation("HOLD") as unknown as Record<
    string,
    unknown
  >;
  const rejected = terminalPresentation("REJECT") as unknown as Record<
    string,
    unknown
  >;
  const changed = (key: string, value: unknown) => ({
    ...accepted,
    [key]: value,
  });
  const malformed: unknown[] = [
    undefined,
    null,
    "terminal",
    1,
    true,
    [],
    {},
    { ...accepted, unexpected: "source-field" },
    changed("terminalState", "TERMINAL"),
    changed("decision", "HOLD"),
    changed("recommendation", "UNKNOWN"),
    changed("recommendation", "NEEDS_REVISION"),
    changed("findingCount", 1),
    changed("workPacketCount", 0),
    changed("workPacketStatus", "NONE"),
    changed("findingCount", -1),
    changed("findingCount", 0.5),
    changed("findingCount", Number.NaN),
    changed("findingCount", LOCAL_OPERATING_LOOP_FINDING_ORDER.length + 1),
    changed("workPacketCount", 2),
    changed("workPacketStatus", "DURABLE"),
    changed("workPacketExecutionAuthority", true),
    changed("artifactCount", 0),
    changed("receiptAuthority", "AUTHORITATIVE"),
    changed("persistence", "DURABLE"),
    changed("programEffect", "OPENED"),
    changed("notAControlThreadAcceptanceReceipt", false),
    changed("decisionScope", "EXECUTE_WORK_PACKET"),
    changed("artifactExecutionAuthority", true),
    { ...held, workPacketCount: 1 },
    { ...held, workPacketStatus: "PROPOSED_ONLY" },
    { ...rejected, workPacketCount: 1 },
    { ...rejected, workPacketStatus: "PROPOSED_ONLY" },
    { ...held, recommendation: "BLOCKED", findingCount: 0 },
    { ...held, recommendation: "GO", findingCount: 1 },
  ];

  for (const key of Object.keys(accepted)) {
    const missing = { ...accepted };
    delete missing[key];
    malformed.push(missing);
  }

  malformed.push(Object.assign(Object.create({ actor: "inherited" }), accepted));
  const inheritedTerminal = Object.create({ terminalState: "ACCEPTED" }) as Record<
    string,
    unknown
  >;
  Object.assign(inheritedTerminal, accepted);
  delete inheritedTerminal.terminalState;
  malformed.push(inheritedTerminal);
  const symbolExtra = { ...accepted };
  Object.defineProperty(symbolExtra, Symbol("private"), {
    value: "symbol-source-value",
    enumerable: true,
  });
  malformed.push(symbolExtra);
  const nonEnumerableExtra = { ...accepted };
  Object.defineProperty(nonEnumerableExtra, "privateSource", {
    value: "non-enumerable-source-value",
    enumerable: false,
  });
  malformed.push(nonEnumerableExtra);
  const accessorValue = { ...accepted };
  Object.defineProperty(accessorValue, "terminalState", {
    get: () => "ACCEPTED",
    enumerable: true,
  });
  malformed.push(accessorValue);
  const revocable = Proxy.revocable({ ...accepted }, {});
  revocable.revoke();
  malformed.push(revocable.proxy);

  for (const value of malformed) {
    assert.equal(
      callWithoutThrow(() => createLocalOperatingLoopBoundaryReceipt(value)),
      null,
    );
    assert.equal(
      callWithoutThrow(() => serializeLocalOperatingLoopBoundaryReceipt(value)),
      null,
    );
  }
}

async function testBoundaryReceiptUsesSingleValidatedDescriptorSnapshot() {
  const safePresentation = terminalPresentation("ACCEPT");
  const expectedReceipt =
    createLocalOperatingLoopBoundaryReceipt(safePresentation);
  const expectedSerialized = expectedBoundaryReceiptText(safePresentation);
  assert.ok(expectedReceipt);

  const expectedKeys = Reflect.ownKeys(safePresentation) as string[];
  const safeDescriptors =
    Object.getOwnPropertyDescriptors(safePresentation);
  const forbiddenActor = "d8r1-private-actor@example.com";
  const newlineInjection = "ACCEPTED\nactor: d8r1-injected@example.com";

  type DescriptorProxyOptions = {
    ownKeys?: () => Array<string | symbol>;
    getPrototypeOf?: () => object | null;
    descriptorFor?: (
      key: string,
      descriptor: PropertyDescriptor | undefined,
      readCount: number,
    ) => PropertyDescriptor | undefined;
    getValue?: (key: string | symbol, readCount: number) => unknown;
  };

  function createDescriptorProxy(options: DescriptorProxyOptions = {}) {
    const calls = {
      descriptor: new Map<string, number>(),
      get: 0,
      ownKeys: 0,
      prototype: 0,
    };
    const proxy = new Proxy(Object.create(null) as Record<string, unknown>, {
      getPrototypeOf() {
        calls.prototype += 1;
        return options.getPrototypeOf ? options.getPrototypeOf() : null;
      },
      ownKeys() {
        calls.ownKeys += 1;
        return options.ownKeys ? options.ownKeys() : [...expectedKeys];
      },
      getOwnPropertyDescriptor(_target, property) {
        const key = String(property);
        const readCount = (calls.descriptor.get(key) ?? 0) + 1;
        calls.descriptor.set(key, readCount);
        const safeDescriptor =
          typeof property === "string"
            ? safeDescriptors[property]
            : undefined;
        const descriptor = safeDescriptor
          ? { ...safeDescriptor, configurable: true }
          : undefined;
        return options.descriptorFor
          ? options.descriptorFor(key, descriptor, readCount)
          : descriptor;
      },
      get(_target, property) {
        calls.get += 1;
        return options.getValue
          ? options.getValue(property, calls.get)
          : forbiddenActor;
      },
    });
    return { calls, proxy };
  }

  function assertSingleDescriptorCapture(
    calls: ReturnType<typeof createDescriptorProxy>["calls"],
  ) {
    assert.equal(calls.prototype, 1);
    assert.equal(calls.ownKeys, 1);
    assert.equal(calls.get, 0);
    assert.deepEqual(
      expectedKeys.map((key) => [key, calls.descriptor.get(key)]),
      expectedKeys.map((key) => [key, 1]),
    );
  }

  function assertFailsClosed(factory: () => unknown) {
    assert.equal(
      callWithoutThrow(() =>
        createLocalOperatingLoopBoundaryReceipt(factory()),
      ),
      null,
    );
    assert.equal(
      callWithoutThrow(() =>
        serializeLocalOperatingLoopBoundaryReceipt(factory()),
      ),
      null,
    );
  }

  const actorProxy = createDescriptorProxy({
    getValue: () => forbiddenActor,
  });
  const actorReceipt = createLocalOperatingLoopBoundaryReceipt(
    actorProxy.proxy,
  );
  assert.deepEqual(actorReceipt, expectedReceipt);
  assert.ok(actorReceipt);
  assert.equal(JSON.stringify(actorReceipt).includes(forbiddenActor), false);
  assertSingleDescriptorCapture(actorProxy.calls);

  const actorSerializationProxy = createDescriptorProxy({
    getValue: () => forbiddenActor,
  });
  const actorSerialized = serializeLocalOperatingLoopBoundaryReceipt(
    actorSerializationProxy.proxy,
  );
  assert.equal(actorSerialized, expectedSerialized);
  assert.ok(actorSerialized);
  assert.equal(actorSerialized.includes(forbiddenActor), false);
  assertSingleDescriptorCapture(actorSerializationProxy.calls);

  const statefulReadProxy = createDescriptorProxy({
    getValue: (property, readCount) =>
      readCount === 1 && typeof property === "string"
        ? safePresentation[
            property as keyof LocalOperatingLoopTerminalPresentation
          ]
        : newlineInjection,
  });
  const statefulSerialized =
    serializeLocalOperatingLoopBoundaryReceipt(statefulReadProxy.proxy);
  assert.equal(statefulSerialized, expectedSerialized);
  assert.ok(statefulSerialized);
  assert.equal(statefulSerialized.includes(newlineInjection), false);
  assert.equal(statefulSerialized.includes(forbiddenActor), false);
  assertSingleDescriptorCapture(statefulReadProxy.calls);

  assertFailsClosed(
    () =>
      createDescriptorProxy({
        descriptorFor: (key, descriptor) =>
          key === "terminalState" && descriptor
            ? { ...descriptor, value: newlineInjection }
            : descriptor,
      }).proxy,
  );

  const rawTrapMarker = "d8r1-private-trap-value";
  assertFailsClosed(
    () =>
      new Proxy(Object.create(null), {
        getPrototypeOf() {
          throw new Error(rawTrapMarker);
        },
      }),
  );
  assertFailsClosed(
    () =>
      new Proxy(Object.create(null), {
        getPrototypeOf: () => null,
        ownKeys() {
          throw new Error(rawTrapMarker);
        },
      }),
  );
  assertFailsClosed(
    () =>
      new Proxy(Object.create(null), {
        getPrototypeOf: () => null,
        ownKeys: () => [...expectedKeys],
        getOwnPropertyDescriptor() {
          throw new Error(rawTrapMarker);
        },
      }),
  );
  assertFailsClosed(
    () =>
      new Proxy(Object.create(null), {
        getPrototypeOf: () =>
          "malformed-prototype" as unknown as object,
      }),
  );
  assertFailsClosed(
    () =>
      new Proxy(Object.create(null), {
        getPrototypeOf: () => null,
        ownKeys: () => [expectedKeys[0], expectedKeys[0]],
      }),
  );

  let changingKeyRead = 0;
  const changingKeyProxy = new Proxy(Object.create(null), {
    getPrototypeOf: () => null,
    ownKeys() {
      changingKeyRead += 1;
      return changingKeyRead === 1
        ? expectedKeys.slice(1)
        : [...expectedKeys, "unexpectedKey"];
    },
  });
  assert.equal(
    callWithoutThrow(() =>
      createLocalOperatingLoopBoundaryReceipt(changingKeyProxy),
    ),
    null,
  );
  assert.equal(
    callWithoutThrow(() =>
      serializeLocalOperatingLoopBoundaryReceipt(changingKeyProxy),
    ),
    null,
  );
  assert.equal(changingKeyRead, 2);

  assertFailsClosed(
    () =>
      createDescriptorProxy({
        ownKeys: () => [...expectedKeys, Symbol("private")],
      }).proxy,
  );
  assertFailsClosed(
    () =>
      createDescriptorProxy({
        descriptorFor: (key, descriptor) =>
          key === "terminalState" ? undefined : descriptor,
      }).proxy,
  );
  assertFailsClosed(
    () =>
      createDescriptorProxy({
        descriptorFor: (key, descriptor) =>
          key === "terminalState" && descriptor
            ? { ...descriptor, enumerable: false }
            : descriptor,
      }).proxy,
  );
  assertFailsClosed(
    () =>
      createDescriptorProxy({
        descriptorFor: (key, descriptor) =>
          key === "terminalState" && descriptor
            ? {
                configurable: true,
                enumerable: true,
                get: () => newlineInjection,
              }
            : descriptor,
      }).proxy,
  );

  function createMutatingSourceProxy() {
    const sourcePresentation = {
      ...safePresentation,
    } as Record<string, unknown>;
    let descriptorReads = 0;
    let propertyReads = 0;
    const proxy = new Proxy(sourcePresentation, {
      getOwnPropertyDescriptor(target, property) {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
        descriptorReads += 1;
        if (descriptorReads === expectedKeys.length) {
          target.terminalState = newlineInjection;
        }
        return descriptor;
      },
      get(target, property, receiver) {
        propertyReads += 1;
        return Reflect.get(target, property, receiver);
      },
    });
    return {
      get descriptorReads() {
        return descriptorReads;
      },
      get propertyReads() {
        return propertyReads;
      },
      proxy,
      sourcePresentation,
    };
  }

  const mutatingReceiptSource = createMutatingSourceProxy();
  assert.deepEqual(
    createLocalOperatingLoopBoundaryReceipt(mutatingReceiptSource.proxy),
    expectedReceipt,
  );
  assert.equal(
    mutatingReceiptSource.sourcePresentation.terminalState,
    newlineInjection,
  );
  assert.equal(mutatingReceiptSource.descriptorReads, expectedKeys.length);
  assert.equal(mutatingReceiptSource.propertyReads, 0);

  const mutatingSerializedSource = createMutatingSourceProxy();
  assert.equal(
    serializeLocalOperatingLoopBoundaryReceipt(
      mutatingSerializedSource.proxy,
    ),
    expectedSerialized,
  );
  assert.equal(mutatingSerializedSource.descriptorReads, expectedKeys.length);
  assert.equal(mutatingSerializedSource.propertyReads, 0);

  const moduleSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const parserStart = moduleSource.indexOf(
    "function parseLocalOperatingLoopBoundaryReceiptInput(",
  );
  const receiptStart = moduleSource.indexOf(
    "export function createLocalOperatingLoopBoundaryReceipt(",
    parserStart,
  );
  const serializerStart = moduleSource.indexOf(
    "export function serializeLocalOperatingLoopBoundaryReceipt(",
    receiptStart,
  );
  assert.ok(parserStart >= 0);
  assert.ok(receiptStart > parserStart);
  assert.ok(serializerStart > receiptStart);
  const parserSource = moduleSource.slice(parserStart, receiptStart);
  const receiptSource = moduleSource.slice(receiptStart, serializerStart);
  assert.equal(
    (parserSource.match(/Reflect\.ownKeys\(value\)/g) ?? []).length,
    1,
  );
  assert.equal(
    (parserSource.match(/Object\.getOwnPropertyDescriptor\(value, key\)/g) ?? [])
      .length,
    1,
  );
  assert.doesNotMatch(parserSource, /Object\.getOwnPropertyDescriptors/);
  assert.doesNotMatch(parserSource, /\bvalue(?:\.|\[)/);
  assert.match(receiptSource, /const snapshot =/);
  assert.match(receiptSource, /terminal_state: snapshot\.terminalState/);
  assert.doesNotMatch(receiptSource, /\bvalue(?:\.|\[)/);
}

async function testBoundaryReceiptExcludesSensitiveKeysAndSourceValues() {
  const state = terminalUiState("ACCEPT");
  assert.ok(state.workPacket);
  assert.ok(state.artifact);
  const seededValues = [
    "d8-founder+private@example.com",
    "d8-motion-private-id",
    "D8 private motion title",
    "D8 private motion summary",
    "jai-nexus/private-repository",
    "JAI_PRIVATE_TARGET_THREAD",
    "https://evidence.invalid/private-pointer",
    "local-shadow-work-packet-private-id",
    "local-shadow-decision-artifact-private-id",
    "8".repeat(40),
    "1".repeat(64),
    "2".repeat(64),
    "3".repeat(64),
    `local-loop.validation.v1.${"4".repeat(64)}`,
    `local-loop.deliberation.v1.${"5".repeat(64)}`,
    "d8-secret-private-value",
    "d8-token-private-value",
    "d8-cookie-private-value",
  ] as const;

  state.projectionKey = "d8-private-projection-key";
  state.validationProof = seededValues[13];
  state.deliberationProof = seededValues[14];
  state.workPacket.proposed_by = seededValues[0];
  state.workPacket.motion_id = seededValues[1];
  state.workPacket.title = seededValues[2];
  state.workPacket.summary = seededValues[3];
  state.workPacket.target_repo = seededValues[4];
  state.workPacket.target_threads = [
    seededValues[5] as unknown as (typeof state.workPacket.target_threads)[number],
  ];
  state.workPacket.evidence_pointers = [seededValues[6]];
  state.workPacket.packet_id = seededValues[7];
  state.workPacket.base_sha = seededValues[9] as typeof state.workPacket.base_sha;
  state.workPacket.motion_fingerprint = seededValues[10];
  state.artifact.actor = seededValues[0];
  state.artifact.motion_id = seededValues[1];
  state.artifact.artifact_id = seededValues[8];
  state.artifact.base_sha = seededValues[9] as typeof state.artifact.base_sha;
  state.artifact.motion_fingerprint = seededValues[10];
  state.artifact.candidate_packet_hash = seededValues[12];

  const presentation =
    createFounderSafeLocalOperatingLoopTerminalPresentation(state);
  assert.ok(presentation);
  const receipt = createLocalOperatingLoopBoundaryReceipt(presentation);
  const serialized =
    serializeLocalOperatingLoopBoundaryReceipt(presentation);
  assert.ok(receipt);
  assert.ok(serialized);

  const forbiddenKeys = new Set([
    "actor",
    "proposer",
    "email",
    "motionId",
    "motion_id",
    "title",
    "summary",
    "purpose",
    "scope",
    "requestedOutcome",
    "risks",
    "constraints",
    "repository",
    "targetRepo",
    "targetThreads",
    "evidencePointers",
    "projectionKey",
    "packetId",
    "packet_id",
    "artifactId",
    "artifact_id",
    "baseSha",
    "base_sha",
    "headSha",
    "commitSha",
    "motionFingerprint",
    "recommendationFingerprint",
    "candidatePacketHash",
    "validationProof",
    "deliberationProof",
    "token",
    "cookie",
    "secret",
    "credentials",
    "request",
    "response",
    "url",
    "userAgent",
  ]);
  assert.deepEqual(
    collectNestedKeys(receipt).filter((key) => forbiddenKeys.has(key)),
    [],
  );

  const founderVisibleMaterial = [
    JSON.stringify(receipt),
    serialized,
    JSON.stringify(LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_COPY_STATUS_COPY),
    source("src/app/operator/motion-control/LocalOperatingLoopPanel.tsx"),
  ].join("\n");
  for (const value of [...seededValues, state.projectionKey]) {
    assert.equal(founderVisibleMaterial.includes(value), false, value);
  }

  assert.equal(
    serializeLocalOperatingLoopBoundaryReceipt({
      ...presentation,
      actor: seededValues[0],
      request: { token: seededValues[16] },
    }),
    null,
  );
}

async function testBoundaryReceiptSeparatesTerminalClaimsFromUnverifiedExternalEffects() {
  const receipt = createLocalOperatingLoopBoundaryReceipt(
    terminalPresentation("HOLD"),
  );
  assert.ok(receipt);
  assert.equal(receipt.terminal_response_persistence_claim, "NONE");
  assert.equal(receipt.program_effect_claim, "NONE");
  for (const effect of [
    receipt.external_persistence_effect,
    receipt.provider_effect,
    receipt.github_effect,
    receipt.linear_effect,
    receipt.agent_council_effect,
    receipt.customer_effect,
    receipt.execution_effect,
    receipt.deployment_effect,
  ]) {
    assert.equal(effect, "UNVERIFIED");
  }
  const serialized = serializeLocalOperatingLoopBoundaryReceipt(
    terminalPresentation("HOLD"),
  );
  assert.ok(serialized);
  assert.match(serialized, /terminal_response_persistence_claim: NONE\n/);
  assert.match(serialized, /external_persistence_effect: UNVERIFIED\n/);
  assert.doesNotMatch(serialized, /external_persistence_effect: NONE/);
}

async function testBoundaryReceiptNeverClaimsTransportRedactionOrProofAuthenticity() {
  const receipt = createLocalOperatingLoopBoundaryReceipt(
    terminalPresentation("REJECT"),
  );
  assert.ok(receipt);
  assert.equal(receipt.underlying_transport_redacted, false);
  assert.equal(receipt.transport_redaction, "NOT_CLAIMED");
  assert.equal(receipt.server_hmac_authenticity, "NOT_BROWSER_VERIFIED");
  assert.equal(receipt.receipt_authenticity, "NOT_PROVIDED");
  assert.equal(receipt.authority_granted, false);
  const serialized = serializeLocalOperatingLoopBoundaryReceipt(
    terminalPresentation("REJECT"),
  );
  assert.ok(serialized);
  assert.doesNotMatch(
    serialized,
    /validationProof|deliberationProof|HMAC material|SIGNED|AUTHENTICATED/,
  );
  assert.match(serialized, /transport_redaction: NOT_CLAIMED/);
  assert.match(serialized, /receipt_authenticity: NOT_PROVIDED/);
}

async function testBoundaryReceiptCopyControlIsTerminalOnlyAndReceiptOnly() {
  const draft = createLocalOperatingLoopUiState("draft-projection");
  assert.equal(
    createFounderSafeLocalOperatingLoopTerminalPresentation(draft),
    null,
  );
  assert.equal(createLocalOperatingLoopBoundaryReceipt(draft), null);
  assert.equal(serializeLocalOperatingLoopBoundaryReceipt(draft), null);

  for (const decision of ["ACCEPT", "HOLD", "REJECT"] as const) {
    assert.ok(
      serializeLocalOperatingLoopBoundaryReceipt(
        terminalPresentation(decision),
      ),
    );
  }

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const copyRegion = boundedSource(
    panelSource,
    "// D8_BOUNDARY_RECEIPT_COPY_CONTROL_START",
    "// D8_BOUNDARY_RECEIPT_COPY_CONTROL_END",
  );
  assert.match(
    panelSource,
    /createLocalOperatingLoopBoundaryReceipt\(terminalPresentation\)/,
  );
  assert.match(
    panelSource,
    /serializeLocalOperatingLoopBoundaryReceipt\(terminalPresentation\)/,
  );
  assert.equal(
    panelSource.match(/Copy redacted boundary receipt/g)?.length,
    1,
  );
  assert.match(copyRegion, /navigator\.clipboard\.writeText\(receiptText\)/);
  assert.doesNotMatch(
    copyRegion,
    /writeText\((?:uiState|terminalPresentation|boundaryReceipt|response|request)/,
  );
  assert.ok(
    panelSource.indexOf("function TerminalPresentation") <
      panelSource.indexOf("Copy redacted boundary receipt"),
  );
}

async function testBoundaryReceiptCopyLifecycleIsSingleFlightAndStaleSafe() {
  const initial = createLocalOperatingLoopBoundaryReceiptCopyState();
  assert.deepEqual(initial, { status: "IDLE", attemptId: 0 });

  const first = claimLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: initial,
    clipboardAvailable: true,
  });
  assert.equal(first.shouldWrite, true);
  assert.equal(first.attemptId, 1);
  assert.deepEqual(first.state, { status: "COPYING", attemptId: 1 });

  const duplicate = claimLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: first.state,
    clipboardAvailable: true,
  });
  assert.equal(duplicate.shouldWrite, false);
  assert.equal(duplicate.attemptId, null);
  assert.equal(duplicate.state, first.state);

  assert.equal(
    settleLocalOperatingLoopBoundaryReceiptCopyAttempt({
      state: first.state,
      attemptId: 999,
      receiptIsCurrent: true,
      outcome: "COPIED",
    }),
    first.state,
  );
  const copied = settleLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: first.state,
    attemptId: 1,
    receiptIsCurrent: true,
    outcome: "COPIED",
  });
  assert.deepEqual(copied, { status: "COPIED", attemptId: 1 });

  const second = claimLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: copied,
    clipboardAvailable: true,
  });
  assert.deepEqual(second.state, { status: "COPYING", attemptId: 2 });
  assert.equal(
    settleLocalOperatingLoopBoundaryReceiptCopyAttempt({
      state: second.state,
      attemptId: 1,
      receiptIsCurrent: true,
      outcome: "FAILED",
    }),
    second.state,
  );
  const stale = settleLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: second.state,
    attemptId: 2,
    receiptIsCurrent: false,
    outcome: "COPIED",
  });
  assert.deepEqual(stale, { status: "IDLE", attemptId: 3 });
}

async function testBoundaryReceiptCopyFailureIsFixedFailClosedAndAccessible() {
  const unavailable = claimLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: createLocalOperatingLoopBoundaryReceiptCopyState(),
    clipboardAvailable: false,
  });
  assert.deepEqual(unavailable.state, {
    status: "UNAVAILABLE",
    attemptId: 1,
  });
  assert.equal(unavailable.shouldWrite, false);
  assert.equal(
    LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_COPY_STATUS_COPY.UNAVAILABLE,
    "Clipboard export is unavailable in this browser context. No fallback was attempted.",
  );

  const claimed = claimLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: createLocalOperatingLoopBoundaryReceiptCopyState(),
    clipboardAvailable: true,
  });
  assert.ok(claimed.attemptId);
  const failed = settleLocalOperatingLoopBoundaryReceiptCopyAttempt({
    state: claimed.state,
    attemptId: claimed.attemptId,
    receiptIsCurrent: true,
    outcome: "FAILED",
  });
  assert.equal(failed.status, "FAILED");
  assert.equal(
    LOCAL_OPERATING_LOOP_BOUNDARY_RECEIPT_COPY_STATUS_COPY.FAILED,
    "The browser did not confirm the clipboard write. No fallback was attempted.",
  );

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const previewRegion = panelSource.slice(
    panelSource.indexOf("function BoundaryReceiptPreview"),
  );
  assert.match(previewRegion, /<article/);
  assert.match(previewRegion, />\s*Redacted boundary receipt\s*</);
  assert.match(previewRegion, /type="button"/);
  assert.match(
    previewRegion,
    /aria-describedby="local-operating-loop-boundary-receipt-privacy-warning"/,
  );
  assert.match(previewRegion, /aria-busy=/);
  assert.match(previewRegion, /role=\{alertStatus \? "alert" : "status"\}/);
  assert.match(previewRegion, /aria-live=\{alertStatus \? "assertive" : "polite"\}/);
  assert.match(previewRegion, /Clipboard unavailable/);
  assert.doesNotMatch(previewRegion, /\.focus\(/);
  assert.doesNotMatch(previewRegion, /console\./);
}

async function testBoundaryReceiptCopyUsesNoNetworkStorageDownloadOrFallbackPrimitive() {
  const moduleSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const receiptRegion = boundedSource(
    moduleSource,
    "// D8_BOUNDARY_RECEIPT_SOURCE_START",
    "// D8_BOUNDARY_RECEIPT_SOURCE_END",
  );
  const copyRegion = boundedSource(
    panelSource,
    "// D8_BOUNDARY_RECEIPT_COPY_CONTROL_START",
    "// D8_BOUNDARY_RECEIPT_COPY_CONTROL_END",
  );
  const previewRegion = panelSource.slice(
    panelSource.indexOf("function BoundaryReceiptPreview"),
  );
  const d8Source = [receiptRegion, copyRegion, previewRegion].join("\n");
  const forbiddenPatterns = [
    /fetch\s*\(/,
    /XMLHttpRequest/,
    /WebSocket/,
    /EventSource/,
    /sendBeacon/,
    /localStorage/,
    /sessionStorage/,
    /indexedDB/i,
    /caches\./,
    /document\.cookie/,
    /\bfs\b/,
    /Blob\s*\(/,
    /URL\.createObjectURL/,
    /window\.open/,
    /navigator\.share/,
    /showSaveFilePicker/,
    /clipboard\.readText/,
    /permissions\.query/,
    /execCommand/,
    /<textarea/,
    /<pre/,
    /<a[^>]+download/,
    /JSON\.stringify/,
    /providerClient|modelClient|githubClient|linearClient/i,
  ];
  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(d8Source, pattern);
  }
  assert.match(copyRegion, /window\.isSecureContext/);
  assert.match(copyRegion, /navigator\.clipboard\.writeText\(receiptText\)/);
  assert.match(copyRegion, /catch\s*\{[\s\S]*clipboardAvailable = false/);
  assert.equal(copyRegion.includes("await"), false);
}

async function testBoundaryReceiptResetInvalidationAndLifecycleClearCopyStatus() {
  for (const state of [
    { status: "COPYING", attemptId: 7 },
    { status: "COPIED", attemptId: 8 },
    { status: "UNAVAILABLE", attemptId: 9 },
    { status: "FAILED", attemptId: 10 },
  ] as const) {
    const cleared = clearLocalOperatingLoopBoundaryReceiptCopyState(state);
    assert.deepEqual(cleared, {
      status: "IDLE",
      attemptId: state.attemptId + 1,
    });
  }
  assert.deepEqual(
    clearLocalOperatingLoopBoundaryReceiptCopyState({
      status: "COPYING",
      attemptId: Number.MAX_SAFE_INTEGER,
    }),
    { status: "IDLE", attemptId: 1 },
  );

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(
    panelSource,
    /<BoundaryReceiptPreview\s+key=\{boundaryReceiptText\}/,
  );
  assert.match(
    panelSource,
    /mountedRef\.current = false/,
  );
  assert.match(
    panelSource,
    /clearLocalOperatingLoopBoundaryReceiptCopyState\(\s*copyStateRef\.current/,
  );
  assert.match(
    panelSource,
    /\{hasTerminalState \? \([\s\S]*terminalPresentation \? \(/,
  );
  assert.match(
    panelSource,
    /<LocalOperatingLoopProjectionPanel\s+key=\{projectionKey\}/,
  );
}

async function testD7DecisionConfirmationAndD2ThroughD6ContractsRemainFrozen() {
  assert.equal(
    LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    "jai-local-operating-loop.v1",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    "a0e7b76af02899659529355773bf293d58269897",
  );
  const context = decisionConfirmationContext();
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: clearLocalOperatingLoopDecisionConfirmation(),
    context,
    decision: "ACCEPT",
  });
  assert.ok(reviewing);
  const presentation =
    createLocalOperatingLoopDecisionConfirmationPresentation({
      confirmation: reviewing,
      context,
    });
  assert.ok(presentation);
  assert.equal(presentation.heading, "Review ACCEPT decision");
  assert.equal(presentation.proofStatus, "Deliberation current");
  assert.match(presentation.confirmLabel, /^Confirm ACCEPT/);
  const claimed = claimLocalOperatingLoopDecisionConfirmation({
    confirmation: reviewing,
    context,
  });
  assert.ok(claimed);
  assert.equal(claimed.phase, "CLAIMED");

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  for (const copy of [
    "Review ACCEPT",
    "Review HOLD",
    "Review REJECT",
    "Cancel decision",
  ]) {
    assert.match(panelSource, new RegExp(copy));
  }
  assert.match(panelSource, /event\.key === "Escape"/);
  assert.match(panelSource, /confirmationHeadingRef\.current\?\.focus\(\)/);
  assert.match(panelSource, /claimLocalOperatingLoopDecisionConfirmation/);

  const moduleSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const receiptRegion = boundedSource(
    moduleSource,
    "// D8_BOUNDARY_RECEIPT_SOURCE_START",
    "// D8_BOUNDARY_RECEIPT_SOURCE_END",
  );
  assert.doesNotMatch(
    receiptRegion,
    /parseLocalOperatingLoopAction|deriveLocalOperatingLoopRecommendation|hashLocalOperatingLoopCanonicalValue|buildLocalOperatingLoopWorkPacket|classifyLocalOperatingLoopClientResponse/,
  );
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

async function testDecisionConfirmationRequiresCurrentDeliberationAndProjection() {
  const context = decisionConfirmationContext();
  const idle = clearLocalOperatingLoopDecisionConfirmation();
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: idle,
    context,
    decision: "HOLD",
  });
  assert.ok(reviewing);
  assert.equal(reviewing.phase, "REVIEWING");

  const ineligibleContexts: LocalOperatingLoopDecisionConfirmationContext[] = [
    {
      ...context,
      currentProjectionKey: `${context.currentProjectionKey}-changed`,
    },
    {
      ...context,
      state: {
        ...context.state,
        state: "VALIDATED",
        deliberationProof: null,
        recommendation: null,
        findingCodes: [],
      },
    },
    {
      ...context,
      state: { ...context.state, activeRequestId: 41 },
    },
    {
      ...context,
      state: { ...context.state, validationProof: "malformed-proof" },
    },
    { ...context, requiresFreshValidation: true },
    {
      ...context,
      state: {
        ...context.state,
        workPacket: acceptedUiState("populated-output").workPacket,
      },
    },
    {
      ...context,
      state: {
        ...context.state,
        artifact: acceptedUiState("populated-output").artifact,
      },
    },
  ];

  for (const ineligibleContext of ineligibleContexts) {
    assert.equal(
      beginLocalOperatingLoopDecisionConfirmation({
        confirmation: idle,
        context: ineligibleContext,
        decision: "HOLD",
      }),
      null,
    );
  }
  assert.equal(
    beginLocalOperatingLoopDecisionConfirmation({
      confirmation: reviewing,
      context,
      decision: "REJECT",
    }),
    null,
  );
}

async function testAcceptConfirmationRequiresExactGo() {
  const idle = clearLocalOperatingLoopDecisionConfirmation();
  const go = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: idle,
    context: decisionConfirmationContext(genuineGoInput),
    decision: "ACCEPT",
  });
  assert.ok(go);
  assert.equal(go.basis.recommendation, "GO");

  for (const motion of [needsRevisionInput, blockedInput]) {
    assert.equal(
      beginLocalOperatingLoopDecisionConfirmation({
        confirmation: idle,
        context: decisionConfirmationContext(motion),
        decision: "ACCEPT",
      }),
      null,
    );
  }
}

async function testHoldAndRejectConfirmationRemainEligibleForNonGo() {
  for (const motion of [genuineGoInput, needsRevisionInput, blockedInput]) {
    const context = decisionConfirmationContext(motion);
    for (const decision of ["HOLD", "REJECT"] as const) {
      const confirmation = beginLocalOperatingLoopDecisionConfirmation({
        confirmation: clearLocalOperatingLoopDecisionConfirmation(),
        context,
        decision,
      });
      assert.ok(confirmation);
      assert.equal(confirmation.phase, "REVIEWING");
      assert.equal(confirmation.basis.decision, decision);
      assert.equal(confirmation.basis.recommendation, context.state.recommendation);
    }
  }
}

async function testDecisionConfirmationBindsProjectionProofRecommendationAndFindings() {
  const context = decisionConfirmationContext(needsRevisionInput);
  const confirmation = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: clearLocalOperatingLoopDecisionConfirmation(),
    context,
    decision: "HOLD",
  });
  assert.ok(confirmation);
  assert.deepEqual(confirmation.basis, {
    projectionKey: context.currentProjectionKey,
    validationProof: SYNTHETIC_VALIDATION_PROOF,
    deliberationProof: SYNTHETIC_DELIBERATION_PROOF,
    recommendation: "NEEDS_REVISION",
    findingCodes: [
      "TITLE_TOO_SHORT",
      "SUMMARY_TOO_SHORT",
      "EVIDENCE_REQUIRED",
    ],
    decision: "HOLD",
  });
}

async function testDecisionConfirmationInvalidatesOnEveryBasisChange() {
  const context = decisionConfirmationContext(needsRevisionInput);
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: clearLocalOperatingLoopDecisionConfirmation(),
    context,
    decision: "HOLD",
  });
  assert.ok(reviewing);

  const changedConfirmations: LocalOperatingLoopDecisionConfirmationState[] = [
    {
      ...reviewing,
      basis: {
        ...reviewing.basis,
        projectionKey: `${reviewing.basis.projectionKey}-changed`,
      },
    },
    {
      ...reviewing,
      basis: {
        ...reviewing.basis,
        validationProof: `local-loop.validation.v1.${"e".repeat(64)}`,
      },
    },
    {
      ...reviewing,
      basis: {
        ...reviewing.basis,
        deliberationProof: `local-loop.deliberation.v1.${"f".repeat(64)}`,
      },
    },
    {
      ...reviewing,
      basis: { ...reviewing.basis, recommendation: "BLOCKED" },
    },
    {
      ...reviewing,
      basis: {
        ...reviewing.basis,
        findingCodes: reviewing.basis.findingCodes.slice(1),
      },
    },
    {
      ...reviewing,
      basis: {
        ...reviewing.basis,
        findingCodes: [...reviewing.basis.findingCodes].reverse(),
      },
    },
    {
      ...reviewing,
      basis: { ...reviewing.basis, decision: "REJECT" },
    },
  ];

  for (const changed of changedConfirmations) {
    assert.equal(
      isLocalOperatingLoopDecisionConfirmationCurrent({
        confirmation: changed,
        context,
      }),
      false,
    );
    assert.equal(
      claimLocalOperatingLoopDecisionConfirmation({
        confirmation: changed,
        context,
      }),
      null,
    );
  }
}

async function testDecisionConfirmationPresentationSnapshotsForAcceptHoldAndReject() {
  const cases = [
    {
      decision: "ACCEPT" as const,
      motion: genuineGoInput,
      recommendation: "GO" as const,
      confirmLabel: "Confirm ACCEPT — propose packet only",
      consequences: [
        "Server recomputation must remain GO.",
        "One PROPOSED_ONLY, non-executable Work Packet and one demonstration-only, non-persistent artifact may be returned.",
        "Neither creates Control-Thread acceptance or execution authority.",
      ],
      submittingCopy: "Submitting ACCEPT local-shadow decision...",
    },
    {
      decision: "HOLD" as const,
      motion: needsRevisionInput,
      recommendation: "NEEDS_REVISION" as const,
      confirmLabel: "Confirm HOLD — no packet",
      consequences: [
        "Zero Work Packets and one demonstration-only, non-persistent artifact may be returned.",
        "HOLD does not pause or mutate external work.",
      ],
      submittingCopy: "Submitting HOLD local-shadow decision...",
    },
    {
      decision: "REJECT" as const,
      motion: blockedInput,
      recommendation: "BLOCKED" as const,
      confirmLabel: "Confirm REJECT — no packet",
      consequences: [
        "Zero Work Packets and one demonstration-only, non-persistent artifact may be returned.",
        "REJECT does not cancel or mutate external work.",
      ],
      submittingCopy: "Submitting REJECT local-shadow decision...",
    },
  ];
  const nonAuthorizations = [
    "Local shadow only.",
    "Not Control-Thread acceptance.",
    "Not a durable receipt.",
    "No persistence.",
    "No routing or execution.",
    "No deployment or customer effect.",
    "No provider authority.",
    "No Agent or Council authority.",
    "No Batch or Program exit.",
    "No JAI activation.",
  ];

  for (const testCase of cases) {
    const context = decisionConfirmationContext(testCase.motion);
    const reviewing = beginLocalOperatingLoopDecisionConfirmation({
      confirmation: clearLocalOperatingLoopDecisionConfirmation(),
      context,
      decision: testCase.decision,
    });
    assert.ok(reviewing);
    assert.deepEqual(
      createLocalOperatingLoopDecisionConfirmationPresentation({
        confirmation: reviewing,
        context,
      }),
      {
        phase: "REVIEWING",
        heading: `Review ${testCase.decision} decision`,
        description:
          "Review the intended local-shadow decision and its bounded effects before confirming.",
        decision: testCase.decision,
        recommendation: testCase.recommendation,
        proofStatus: "Deliberation current",
        confirmLabel: testCase.confirmLabel,
        consequences: testCase.consequences,
        nonAuthorizations,
        submittingCopy: null,
      },
    );

    const claimed = claimLocalOperatingLoopDecisionConfirmation({
      confirmation: reviewing,
      context,
    });
    assert.ok(claimed);
    assert.equal(
      createLocalOperatingLoopDecisionConfirmationPresentation({
        confirmation: claimed,
        context,
      })?.submittingCopy,
      testCase.submittingCopy,
    );
  }
}

async function testDecisionConfirmationPresentationIsRedactedAndNonAuthoritative() {
  const context = decisionConfirmationContext(needsRevisionInput);
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: clearLocalOperatingLoopDecisionConfirmation(),
    context,
    decision: "HOLD",
  });
  assert.ok(reviewing);
  const presentation =
    createLocalOperatingLoopDecisionConfirmationPresentation({
      confirmation: reviewing,
      context,
    });
  assert.ok(presentation);
  assert.deepEqual(
    collectNestedKeys(presentation).filter((key) =>
      [
        "basis",
        "projectionKey",
        "validationProof",
        "deliberationProof",
        "findingCodes",
        "motion",
        "request",
        "response",
        "workPacket",
        "artifact",
      ].includes(key),
    ),
    [],
  );

  const serialized = JSON.stringify(presentation);
  for (const sensitiveValue of [
    context.currentProjectionKey,
    SYNTHETIC_VALIDATION_PROOF,
    SYNTHETIC_DELIBERATION_PROOF,
    context.motion.motionId,
    context.motion.title,
    context.motion.summary,
    context.motion.targetRepo,
    ...context.motion.targetThreads,
    ...context.motion.evidencePointers,
    ...context.state.findingCodes,
  ]) {
    assert.equal(serialized.includes(sensitiveValue), false, sensitiveValue);
  }
  assert.match(serialized, /Not Control-Thread acceptance/);
  assert.match(serialized, /No routing or execution/);
  assert.match(serialized, /No JAI activation/);

  const unknownFindingContext: LocalOperatingLoopDecisionConfirmationContext = {
    ...context,
    state: {
      ...context.state,
      findingCodes: [
        "RAW_UNKNOWN_FINDING_WITH_PRIVATE_VALUE",
      ] as unknown as LocalOperatingLoopUiState["findingCodes"],
    },
  };
  assert.equal(
    beginLocalOperatingLoopDecisionConfirmation({
      confirmation: clearLocalOperatingLoopDecisionConfirmation(),
      context: unknownFindingContext,
      decision: "HOLD",
    }),
    null,
  );
}

async function testDecisionConfirmationClaimIsSingleUse() {
  const context = decisionConfirmationContext();
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: clearLocalOperatingLoopDecisionConfirmation(),
    context,
    decision: "ACCEPT",
  });
  assert.ok(reviewing);
  const claimed = claimLocalOperatingLoopDecisionConfirmation({
    confirmation: reviewing,
    context,
  });
  assert.ok(claimed);
  assert.equal(claimed.phase, "CLAIMED");
  assert.equal(
    claimLocalOperatingLoopDecisionConfirmation({
      confirmation: claimed,
      context,
    }),
    null,
  );
  assert.equal(
    cancelLocalOperatingLoopDecisionConfirmation(claimed),
    claimed,
  );
  assert.deepEqual(clearLocalOperatingLoopDecisionConfirmation(), {
    phase: "IDLE",
    basis: null,
  });

  const changedContext = {
    ...context,
    state: {
      ...context.state,
      deliberationProof: `local-loop.deliberation.v1.${"e".repeat(64)}`,
    },
  };
  assert.equal(
    isLocalOperatingLoopDecisionConfirmationCurrent({
      confirmation: claimed,
      context: changedContext,
    }),
    false,
  );

  const pendingContext = {
    ...context,
    state: { ...context.state, activeRequestId: 77 },
  };
  assert.equal(
    isLocalOperatingLoopDecisionConfirmationCurrent({
      confirmation: claimed,
      context: pendingContext,
    }),
    true,
  );
  assert.deepEqual(
    createLocalOperatingLoopDecisionConfirmationPresentation({
      confirmation: claimed,
      context: pendingContext,
    }),
    {
      phase: "CLAIMED",
      heading: "Review ACCEPT decision",
      description:
        "Review the intended local-shadow decision and its bounded effects before confirming.",
      decision: "ACCEPT",
      recommendation: "GO",
      proofStatus: "Deliberation current",
      confirmLabel: "Confirm ACCEPT — propose packet only",
      consequences: [
        "Server recomputation must remain GO.",
        "One PROPOSED_ONLY, non-executable Work Packet and one demonstration-only, non-persistent artifact may be returned.",
        "Neither creates Control-Thread acceptance or execution authority.",
      ],
      nonAuthorizations: [
        "Local shadow only.",
        "Not Control-Thread acceptance.",
        "Not a durable receipt.",
        "No persistence.",
        "No routing or execution.",
        "No deployment or customer effect.",
        "No provider authority.",
        "No Agent or Council authority.",
        "No Batch or Program exit.",
        "No JAI activation.",
      ],
      submittingCopy: "Submitting ACCEPT local-shadow decision...",
    },
  );
}

async function testReviewButtonsNeverDirectlySubmitDecision() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const controlsStart = panelSource.indexOf(
    '{uiState.state === "AWAITING_DECISION"',
  );
  const confirmationStart = panelSource.indexOf(
    "{confirmationPresentation ? (",
    controlsStart,
  );
  assert.ok(controlsStart >= 0);
  assert.ok(confirmationStart > controlsStart);
  const reviewControlsSource = panelSource.slice(
    controlsStart,
    confirmationStart,
  );

  for (const decision of ["ACCEPT", "HOLD", "REJECT"] as const) {
    assert.match(reviewControlsSource, new RegExp(`Review ${decision}`));
    assert.match(
      reviewControlsSource,
      new RegExp(`beginDecisionReview\\("${decision}"\\)`),
    );
  }
  assert.equal(
    (reviewControlsSource.match(/beginDecisionReview\(/g) ?? []).length,
    3,
  );
  assert.doesNotMatch(reviewControlsSource, /submitAction\(/);
  assert.doesNotMatch(
    panelSource,
    /onClick=\{\(\) => submitAction\("(?:ACCEPT|HOLD|REJECT)"\)\}/,
  );
}

async function testConfirmedPathSubmitsOnlyTheMatchingExistingDecision() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const confirmStart = panelSource.indexOf(
    "function confirmReviewedDecision()",
  );
  const renderStart = panelSource.indexOf("\n  return (", confirmStart);
  assert.ok(confirmStart >= 0);
  assert.ok(renderStart > confirmStart);
  const confirmSource = panelSource.slice(confirmStart, renderStart);
  assert.match(
    confirmSource,
    /decisionConfirmationRef\.current\.phase !== "REVIEWING"/,
  );
  const refClaimIndex = confirmSource.indexOf(
    "decisionConfirmationRef.current = claimed",
  );
  const stateClaimIndex = confirmSource.indexOf(
    "setDecisionConfirmation(claimed)",
  );
  const submitIndex = confirmSource.indexOf(
    "void submitAction(claimed.basis.decision)",
  );
  assert.ok(refClaimIndex >= 0);
  assert.ok(stateClaimIndex > refClaimIndex);
  assert.ok(submitIndex > stateClaimIndex);
  assert.equal(
    (panelSource.match(/submitAction\(claimed\.basis\.decision\)/g) ?? [])
      .length,
    1,
  );

  const requestBuilderStart = panelSource.indexOf(
    "function buildRequestBody(",
  );
  assert.ok(requestBuilderStart >= 0);
  const requestBuilderSource = panelSource.slice(requestBuilderStart);
  assert.match(requestBuilderSource, /action: "DECIDE"/);
  assert.match(requestBuilderSource, /decision: action/);

  for (const decision of ["ACCEPT", "HOLD", "REJECT"] as const) {
    const context = decisionConfirmationContext();
    const reviewing = beginLocalOperatingLoopDecisionConfirmation({
      confirmation: clearLocalOperatingLoopDecisionConfirmation(),
      context,
      decision,
    });
    assert.ok(reviewing);
    const claimed = claimLocalOperatingLoopDecisionConfirmation({
      confirmation: reviewing,
      context,
    });
    assert.ok(claimed);
    assert.equal(claimed.basis.decision, decision);
  }
}

async function testCancelAndEscapeDoNotSubmitOrMutateLoop() {
  const context = decisionConfirmationContext(needsRevisionInput);
  const stateSnapshot = structuredClone(context.state);
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: clearLocalOperatingLoopDecisionConfirmation(),
    context,
    decision: "HOLD",
  });
  assert.ok(reviewing);
  assert.deepEqual(cancelLocalOperatingLoopDecisionConfirmation(reviewing), {
    phase: "IDLE",
    basis: null,
  });
  assert.deepEqual(context.state, stateSnapshot);

  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const cancelStart = panelSource.indexOf(
    "const cancelDecisionConfirmationAndRestoreFocus",
  );
  const abortStart = panelSource.indexOf(
    "function abortAndReleaseActiveRequest()",
    cancelStart,
  );
  assert.ok(cancelStart >= 0);
  assert.ok(abortStart > cancelStart);
  const cancelSource = panelSource.slice(cancelStart, abortStart);
  assert.match(
    cancelSource,
    /cancelLocalOperatingLoopDecisionConfirmation\(current\)/,
  );
  assert.match(cancelSource, /window\.requestAnimationFrame/);
  assert.match(
    cancelSource,
    /reviewButtonRefs\.current\[originDecision\]\?\.focus\(\)/,
  );
  assert.doesNotMatch(
    cancelSource,
    /submitAction\(|fetch\(|setUiState\(|setStatusMessage\(/,
  );

  const escapeStart = panelSource.indexOf(
    "const handleEscape = (event: KeyboardEvent)",
  );
  const escapeEnd = panelSource.indexOf(
    "useEffect(() => {\n    if (structuralRemediations.length",
    escapeStart,
  );
  assert.ok(escapeStart >= 0);
  assert.ok(escapeEnd > escapeStart);
  const escapeSource = panelSource.slice(escapeStart, escapeEnd);
  assert.match(escapeSource, /event\.key === "Escape"/);
  assert.match(escapeSource, /event\.preventDefault\(\)/);
  assert.match(
    escapeSource,
    /cancelDecisionConfirmationAndRestoreFocus\(\)/,
  );
  assert.doesNotMatch(escapeSource, /submitAction\(|fetch\(/);
}

async function testResetRecoveryLifecycleAndUnmountClearConfirmation() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const composerSource = source(
    "src/app/operator/motion-control/NativeMotionIntakeComposer.tsx",
  );
  assert.ok(
    (panelSource.match(/clearDecisionConfirmation\(\);/g) ?? []).length >= 5,
  );
  assert.match(
    panelSource,
    /function failClosed[\s\S]*?clearDecisionConfirmation\(\)/,
  );
  assert.match(
    panelSource,
    /classification\.kind === "STRUCTURAL_FAILURE"[\s\S]*?clearDecisionConfirmation\(\)/,
  );
  assert.match(
    panelSource,
    /classification\.response\.state === "ACCEPTED"[\s\S]*?clearDecisionConfirmation\(\)/,
  );
  assert.match(panelSource, /type: "PAGEHIDE"/);
  assert.match(panelSource, /type: "PAGESHOW"; persisted: boolean/);
  assert.match(
    panelSource,
    /decisionConfirmationRef\.current =\s*clearLocalOperatingLoopDecisionConfirmation\(\)/,
  );
  assert.match(
    composerSource,
    /\{suspendLocalOperatingLoop \? \([\s\S]*?\) : \(\s*<LocalOperatingLoopPanel/,
  );
  assert.match(panelSource, /key=\{projectionKey\}/);
  assert.deepEqual(clearLocalOperatingLoopDecisionConfirmation(), {
    phase: "IDLE",
    basis: null,
  });

  const current = decisionConfirmationContext().state;
  assert.deepEqual(
    recoverLocalOperatingLoopClientFailure(current),
    createLocalOperatingLoopUiState(current.projectionKey),
  );
}

async function testDecisionConfirmationAccessibleStaticWiring() {
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  assert.match(
    panelSource,
    /aria-labelledby="local-operating-loop-decision-confirmation-heading"/,
  );
  assert.match(
    panelSource,
    /aria-describedby="local-operating-loop-decision-confirmation-description"/,
  );
  assert.match(
    panelSource,
    /aria-busy=\{confirmationPresentation\.phase === "CLAIMED"\}/,
  );
  assert.match(panelSource, /ref=\{confirmationHeadingRef\}/);
  assert.match(panelSource, /confirmationHeadingRef\.current\?\.focus\(\)/);
  assert.match(panelSource, /tabIndex=\{-1\}/);
  assert.match(panelSource, /aria-live="polite"/);
  assert.match(panelSource, /role="status"/);
  assert.match(
    panelSource,
    /disabled=\{confirmationPresentation\.phase === "CLAIMED"\}/,
  );
  assert.match(panelSource, /Review ACCEPT/);
  assert.match(panelSource, /Review HOLD/);
  assert.match(panelSource, /Review REJECT/);
  assert.match(panelSource, /\{confirmationPresentation\.confirmLabel\}/);
  assert.match(panelSource, />\s*Cancel decision\s*</);
  assert.doesNotMatch(panelSource, /aria-modal/);
  assert.doesNotMatch(panelSource, /role="dialog"/);
}

async function testExistingServerNonGoAcceptanceAndRecoveryRemainFailClosed() {
  const handler = createAdminHandler();
  for (const motion of [needsRevisionInput, blockedInput]) {
    const proofChain = await buildProofChain(handler, motion);
    assert.notEqual(proofChain.recommendation, "GO");
    const result = await decide(
      handler,
      motion,
      "ACCEPT",
      proofChain.deliberationProof,
    );
    assert.equal(result.status, 409);

    const context = decisionConfirmationContext(motion);
    assert.deepEqual(
      recoverLocalOperatingLoopClientFailure(context.state),
      createLocalOperatingLoopUiState(context.currentProjectionKey),
    );
  }
}

async function testD5D6FrozenContractsAndProductionIsolationRemainIntact() {
  assert.equal(
    LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    "jai-local-operating-loop.v1",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    "a0e7b76af02899659529355773bf293d58269897",
  );

  const pureSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop.ts",
  );
  const panelSource = source(
    "src/app/operator/motion-control/LocalOperatingLoopPanel.tsx",
  );
  const handlerSource = source(
    "src/lib/controlPlane/motionKernel/local-operating-loop-handler.ts",
  );
  const routeSource = source(
    "src/app/api/operator/motion-control/local-operating-loop/route.ts",
  );
  const composerSource = source(
    "src/app/operator/motion-control/NativeMotionIntakeComposer.tsx",
  );
  assert.deepEqual(importSpecifiers(pureSource), ["zod"]);
  assert.doesNotMatch(
    `${pureSource}\n${panelSource}`,
    /from\s+["'][^"']*(provider|prisma|github|linear|agent|council|registry)/i,
  );
  assert.doesNotMatch(
    panelSource,
    /local-operating-loop-handler|\/route|node:|process\.env|next-auth|prisma/i,
  );

  const confirmationStart = pureSource.indexOf(
    "const localOperatingLoopDecisionConfirmationCopy",
  );
  const packetStart = pureSource.indexOf(
    "export function buildLocalOperatingLoopPacketMaterial",
    confirmationStart,
  );
  assert.ok(confirmationStart >= 0);
  assert.ok(packetStart > confirmationStart);
  const confirmationSource = pureSource.slice(
    confirmationStart,
    packetStart,
  );
  assert.doesNotMatch(
    confirmationSource,
    /deriveLocalOperatingLoopRecommendation|createHmac|crypto\.subtle|fetch\(/,
  );
  assert.doesNotMatch(
    `${confirmationSource}\n${panelSource.slice(
      panelSource.indexOf("function beginDecisionReview"),
      panelSource.indexOf("\n  return ("),
    )}`,
    /clipboard|download|copy\/export|serialized packet|boundary receipt/i,
  );
  assert.doesNotMatch(
    `${confirmationSource}\n${panelSource.slice(
      panelSource.indexOf("function beginDecisionReview"),
      panelSource.indexOf("\n  return ("),
    )}`,
    /navigator\.clipboard|document\.execCommand|new Blob|createObjectURL|localStorage|sessionStorage|indexedDB|sendBeacon|window\.open|dispatchProvider|invokeProvider|providerClient|persistMotion|registryMutation/i,
  );
  assert.match(
    pureSource,
    /HMAC authenticity remains server-bound/,
  );
  assert.match(
    panelSource,
    /await classifyLocalOperatingLoopClientResponse/,
  );
  assert.match(
    composerSource,
    /shouldSuspendLocalOperatingLoopForUnstagedDraft/,
  );
  assert.match(handlerSource, /timingSafeEqual\(/);
  assert.match(routeSource, /getToken/);
}

async function testMalformedDecisionConfirmationStatesFailClosedWithoutThrowing() {
  const context = decisionConfirmationContext(needsRevisionInput);
  const idle = clearLocalOperatingLoopDecisionConfirmation();
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: idle,
    context,
    decision: "HOLD",
  });
  assert.ok(reviewing);
  const claimed = claimLocalOperatingLoopDecisionConfirmation({
    confirmation: reviewing,
    context,
  });
  assert.ok(claimed);
  const basis = reviewing.basis;
  const unknownDecision = "UNKNOWN_DECISION_PRIVATE_VALUE";
  const unknownFinding = "UNKNOWN_FINDING_PRIVATE_VALUE";
  const missingBasisKey = {
    decision: basis.decision,
    deliberationProof: basis.deliberationProof,
    findingCodes: basis.findingCodes,
    recommendation: basis.recommendation,
    validationProof: basis.validationProof,
  };

  const malformedFixtures: Array<{
    label: string;
    value: unknown;
    privateMarker?: string;
  }> = [
    { label: "undefined", value: undefined },
    { label: "null", value: null },
    { label: "boolean", value: true },
    { label: "number", value: 17 },
    {
      label: "string",
      value: "MALFORMED_CONFIRMATION_PRIVATE_VALUE",
      privateMarker: "MALFORMED_CONFIRMATION_PRIVATE_VALUE",
    },
    { label: "array", value: [] },
    { label: "empty record", value: {} },
    {
      label: "unknown phase",
      value: { phase: "UNKNOWN", basis: null },
    },
    { label: "missing phase", value: { basis: null } },
    { label: "missing basis", value: { phase: "IDLE" } },
    {
      label: "unexpected IDLE key",
      value: { phase: "IDLE", basis: null, extra: true },
    },
    {
      label: "IDLE non-null basis",
      value: { phase: "IDLE", basis: {} },
    },
    {
      label: "REVIEWING null basis",
      value: { phase: "REVIEWING", decision: "HOLD", basis: null },
    },
    {
      label: "REVIEWING primitive basis",
      value: { phase: "REVIEWING", decision: "HOLD", basis: 3 },
    },
    {
      label: "CLAIMED array basis",
      value: { phase: "CLAIMED", decision: "HOLD", basis: [] },
    },
    {
      label: "unknown decision",
      value: {
        phase: "REVIEWING",
        decision: unknownDecision,
        basis: { ...basis, decision: unknownDecision },
      },
      privateMarker: unknownDecision,
    },
    {
      label: "mismatched decision",
      value: { ...reviewing, decision: "REJECT" },
    },
    {
      label: "missing basis key",
      value: { ...reviewing, basis: missingBasisKey },
    },
    {
      label: "extra basis key",
      value: { ...reviewing, basis: { ...basis, extra: true } },
    },
    {
      label: "non-string projection key",
      value: { ...reviewing, basis: { ...basis, projectionKey: 42 } },
    },
    {
      label: "malformed validation proof",
      value: {
        ...reviewing,
        basis: { ...basis, validationProof: "malformed-validation" },
      },
    },
    {
      label: "malformed deliberation proof",
      value: {
        ...reviewing,
        basis: { ...basis, deliberationProof: "malformed-deliberation" },
      },
    },
    {
      label: "unknown recommendation",
      value: {
        ...reviewing,
        basis: { ...basis, recommendation: "EXECUTE" },
      },
    },
    {
      label: "non-array finding codes",
      value: { ...reviewing, basis: { ...basis, findingCodes: "TITLE" } },
    },
    {
      label: "duplicate finding codes",
      value: {
        ...reviewing,
        basis: {
          ...basis,
          findingCodes: ["TITLE_TOO_SHORT", "TITLE_TOO_SHORT"],
        },
      },
    },
    {
      label: "unknown finding code",
      value: {
        ...reviewing,
        basis: { ...basis, findingCodes: [unknownFinding] },
      },
      privateMarker: unknownFinding,
    },
    {
      label: "unexpected REVIEWING key",
      value: { ...reviewing, extra: true },
    },
    {
      label: "missing CLAIMED decision",
      value: { phase: "CLAIMED", basis: claimed.basis },
    },
  ];

  for (const fixture of malformedFixtures) {
    const malformed =
      fixture.value as LocalOperatingLoopDecisionConfirmationState;
    assert.deepEqual(
      callWithoutThrow(() =>
        cancelLocalOperatingLoopDecisionConfirmation(malformed),
      ),
      idle,
      fixture.label,
    );
    assert.equal(
      callWithoutThrow(() =>
        beginLocalOperatingLoopDecisionConfirmation({
          confirmation: malformed,
          context,
          decision: "HOLD",
        }),
      ),
      null,
      fixture.label,
    );
    assert.equal(
      callWithoutThrow(() =>
        claimLocalOperatingLoopDecisionConfirmation({
          confirmation: malformed,
          context,
        }),
      ),
      null,
      fixture.label,
    );
    assert.equal(
      callWithoutThrow(() =>
        isLocalOperatingLoopDecisionConfirmationCurrent({
          confirmation: malformed,
          context,
        }),
      ),
      false,
      fixture.label,
    );
    const presentation = callWithoutThrow(() =>
      createLocalOperatingLoopDecisionConfirmationPresentation({
        confirmation: malformed,
        context,
      }),
    );
    assert.equal(presentation, null, fixture.label);
    if (fixture.privateMarker) {
      assert.equal(
        JSON.stringify(presentation).includes(fixture.privateMarker),
        false,
        fixture.label,
      );
    }
  }

  assert.deepEqual(
    callWithoutThrow(clearLocalOperatingLoopDecisionConfirmation),
    idle,
  );
  assert.equal(
    isLocalOperatingLoopDecisionConfirmationCurrent({
      confirmation: idle,
      context,
    }),
    true,
  );
  assert.deepEqual(
    cancelLocalOperatingLoopDecisionConfirmation(reviewing),
    idle,
  );
  assert.equal(
    cancelLocalOperatingLoopDecisionConfirmation(claimed),
    claimed,
  );
}

async function testMalformedDecisionConfirmationContextsAndEnvelopesFailClosed() {
  const context = decisionConfirmationContext(needsRevisionInput);
  const idle = clearLocalOperatingLoopDecisionConfirmation();
  const reviewing = beginLocalOperatingLoopDecisionConfirmation({
    confirmation: idle,
    context,
    decision: "HOLD",
  });
  assert.ok(reviewing);
  const state = context.state;
  const stateWithoutValidationProof = {
    activeRequestId: state.activeRequestId,
    artifact: state.artifact,
    deliberationProof: state.deliberationProof,
    findingCodes: state.findingCodes,
    projectionKey: state.projectionKey,
    recommendation: state.recommendation,
    state: state.state,
    workPacket: state.workPacket,
  };
  const privateContextMarker = "MALFORMED_CONTEXT_PRIVATE_VALUE";

  const malformedContexts: Array<{ label: string; value: unknown }> = [
    { label: "undefined context", value: undefined },
    { label: "null context", value: null },
    { label: "boolean context", value: false },
    { label: "number context", value: 9 },
    { label: "string context", value: privateContextMarker },
    { label: "array context", value: [] },
    { label: "empty context", value: {} },
    {
      label: "missing current projection",
      value: { motion: context.motion, state },
    },
    {
      label: "unexpected context key",
      value: { ...context, extra: true },
    },
    {
      label: "non-string current projection",
      value: { ...context, currentProjectionKey: 11 },
    },
    { label: "null motion", value: { ...context, motion: null } },
    { label: "array motion", value: { ...context, motion: [] } },
    {
      label: "motion with extra key",
      value: { ...context, motion: { ...context.motion, extra: true } },
    },
    {
      label: "motion requiring normalization",
      value: {
        ...context,
        motion: { ...context.motion, title: `  ${context.motion.title}  ` },
      },
    },
    { label: "null state", value: { ...context, state: null } },
    { label: "array state", value: { ...context, state: [] } },
    {
      label: "state missing key",
      value: { ...context, state: stateWithoutValidationProof },
    },
    {
      label: "state with extra key",
      value: { ...context, state: { ...state, extra: true } },
    },
    {
      label: "state non-string projection",
      value: { ...context, state: { ...state, projectionKey: 22 } },
    },
    {
      label: "state wrong phase",
      value: { ...context, state: { ...state, state: "DRAFT" } },
    },
    {
      label: "state malformed validation proof",
      value: {
        ...context,
        state: { ...state, validationProof: "bad-validation" },
      },
    },
    {
      label: "state malformed deliberation proof",
      value: {
        ...context,
        state: { ...state, deliberationProof: "bad-deliberation" },
      },
    },
    {
      label: "state unknown recommendation",
      value: { ...context, state: { ...state, recommendation: "EXECUTE" } },
    },
    {
      label: "state non-array findings",
      value: { ...context, state: { ...state, findingCodes: "TITLE" } },
    },
    {
      label: "state duplicate findings",
      value: {
        ...context,
        state: {
          ...state,
          findingCodes: ["TITLE_TOO_SHORT", "TITLE_TOO_SHORT"],
        },
      },
    },
    {
      label: "state unknown finding",
      value: {
        ...context,
        state: { ...state, findingCodes: [privateContextMarker] },
      },
    },
    {
      label: "state populated Work Packet",
      value: { ...context, state: { ...state, workPacket: {} } },
    },
    {
      label: "state populated artifact",
      value: { ...context, state: { ...state, artifact: {} } },
    },
    {
      label: "state malformed request ID",
      value: { ...context, state: { ...state, activeRequestId: "7" } },
    },
    {
      label: "state non-positive request ID",
      value: { ...context, state: { ...state, activeRequestId: 0 } },
    },
    {
      label: "malformed freshness flag",
      value: { ...context, requiresFreshValidation: "yes" },
    },
  ];

  for (const fixture of malformedContexts) {
    const malformed =
      fixture.value as LocalOperatingLoopDecisionConfirmationContext;
    assert.equal(
      callWithoutThrow(() =>
        beginLocalOperatingLoopDecisionConfirmation({
          confirmation: idle,
          context: malformed,
          decision: "HOLD",
        }),
      ),
      null,
      fixture.label,
    );
    assert.equal(
      callWithoutThrow<
        ReturnType<typeof claimLocalOperatingLoopDecisionConfirmation>
      >(
        (): ReturnType<
          typeof claimLocalOperatingLoopDecisionConfirmation
        > =>
          claimLocalOperatingLoopDecisionConfirmation({
            confirmation: reviewing,
            context: malformed,
          }),
      ),
      null,
      fixture.label,
    );
    assert.equal(
      callWithoutThrow<boolean>(() =>
        isLocalOperatingLoopDecisionConfirmationCurrent({
          confirmation: reviewing,
          context: malformed,
        }),
      ),
      false,
      fixture.label,
    );
    const presentation: ReturnType<
      typeof createLocalOperatingLoopDecisionConfirmationPresentation
    > = callWithoutThrow(
      (): ReturnType<
        typeof createLocalOperatingLoopDecisionConfirmationPresentation
      > =>
        createLocalOperatingLoopDecisionConfirmationPresentation({
          confirmation: reviewing,
          context: malformed,
        }),
    );
    assert.equal(presentation, null, fixture.label);
    assert.equal(
      JSON.stringify(presentation).includes(privateContextMarker),
      false,
      fixture.label,
    );
  }

  const malformedBeginEnvelopes: unknown[] = [
    undefined,
    null,
    true,
    23,
    "MALFORMED_BEGIN_ENVELOPE",
    [],
    {},
    { confirmation: idle, context },
    { confirmation: idle, context, decision: "EXECUTE" },
    { confirmation: idle, context, decision: "HOLD", extra: true },
  ];
  for (const malformed of malformedBeginEnvelopes) {
    assert.equal(
      callWithoutThrow(() =>
        beginLocalOperatingLoopDecisionConfirmation(malformed as never),
      ),
      null,
    );
  }

  const malformedOperationEnvelopes: unknown[] = [
    undefined,
    null,
    false,
    29,
    "MALFORMED_OPERATION_ENVELOPE",
    [],
    {},
    { confirmation: reviewing },
    { context },
    { confirmation: reviewing, context, extra: true },
  ];
  for (const malformed of malformedOperationEnvelopes) {
    assert.equal(
      callWithoutThrow(() =>
        claimLocalOperatingLoopDecisionConfirmation(malformed as never),
      ),
      null,
    );
    assert.equal(
      callWithoutThrow(() =>
        isLocalOperatingLoopDecisionConfirmationCurrent(malformed as never),
      ),
      false,
    );
    assert.equal(
      callWithoutThrow(() =>
        createLocalOperatingLoopDecisionConfirmationPresentation(
          malformed as never,
        ),
      ),
      null,
    );
  }

  const serverNormalizableContext = decisionConfirmationContext({
    ...genuineGoInput,
    title: `  ${genuineGoInput.title}  `,
    summary: `${genuineGoInput.summary}\r\n`,
  });
  assert.ok(
    beginLocalOperatingLoopDecisionConfirmation({
      confirmation: idle,
      context: serverNormalizableContext,
      decision: "HOLD",
    }),
  );
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

function boundedSource(
  value: string,
  startMarker: string,
  endMarker: string,
): string {
  const start = value.indexOf(startMarker);
  const end = value.indexOf(endMarker);
  assert.ok(start >= 0, startMarker);
  assert.ok(end > start, endMarker);
  return value.slice(start, end + endMarker.length);
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
await testBoundaryReceiptSnapshotsForAcceptHoldAndReject();
await testBoundaryReceiptSerializationIsDeterministicAndLfNormalized();
await testBoundaryReceiptRejectsMalformedAndIncoherentPresentationsWithoutThrowing();
await testBoundaryReceiptUsesSingleValidatedDescriptorSnapshot();
await testBoundaryReceiptExcludesSensitiveKeysAndSourceValues();
await testBoundaryReceiptSeparatesTerminalClaimsFromUnverifiedExternalEffects();
await testBoundaryReceiptNeverClaimsTransportRedactionOrProofAuthenticity();
await testBoundaryReceiptCopyControlIsTerminalOnlyAndReceiptOnly();
await testBoundaryReceiptCopyLifecycleIsSingleFlightAndStaleSafe();
await testBoundaryReceiptCopyFailureIsFixedFailClosedAndAccessible();
await testBoundaryReceiptCopyUsesNoNetworkStorageDownloadOrFallbackPrimitive();
await testBoundaryReceiptResetInvalidationAndLifecycleClearCopyStatus();
await testD7DecisionConfirmationAndD2ThroughD6ContractsRemainFrozen();
await testTerminalUiContainsNoRawJsonSink();
await testUnstagedDraftChangesSuspendOnlySelectedComposedProjection();
await testComposerEditsNeverAutoStage();
await testUnstagedComposerGateUnmountsLoopAndIsAccessible();
await testExistingAbortInvalidationAndRecoveryContractsRemainIntact();
await testDecisionConfirmationRequiresCurrentDeliberationAndProjection();
await testAcceptConfirmationRequiresExactGo();
await testHoldAndRejectConfirmationRemainEligibleForNonGo();
await testDecisionConfirmationBindsProjectionProofRecommendationAndFindings();
await testDecisionConfirmationInvalidatesOnEveryBasisChange();
await testDecisionConfirmationPresentationSnapshotsForAcceptHoldAndReject();
await testDecisionConfirmationPresentationIsRedactedAndNonAuthoritative();
await testDecisionConfirmationClaimIsSingleUse();
await testReviewButtonsNeverDirectlySubmitDecision();
await testConfirmedPathSubmitsOnlyTheMatchingExistingDecision();
await testCancelAndEscapeDoNotSubmitOrMutateLoop();
await testResetRecoveryLifecycleAndUnmountClearConfirmation();
await testDecisionConfirmationAccessibleStaticWiring();
await testExistingServerNonGoAcceptanceAndRecoveryRemainFailClosed();
await testD5D6FrozenContractsAndProductionIsolationRemainIntact();
await testMalformedDecisionConfirmationStatesFailClosedWithoutThrowing();
await testMalformedDecisionConfirmationContextsAndEnvelopesFailClosed();
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

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { encode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

import {
  LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS,
  LOCAL_OPERATING_LOOP_PAGEHIDE_COPY,
  LOCAL_OPERATING_LOOP_PHASE_COPY,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF,
  LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL,
  LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
  LOCAL_OPERATING_LOOP_RESTORED_COPY,
  LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY,
  applyLocalOperatingLoopBrowserLifecycle,
  canonicalizeLocalOperatingLoopValue,
  classifyLocalOperatingLoopClientResponse,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopRecoveryNotice,
  createLocalOperatingLoopStructuralRemediations,
  createLocalOperatingLoopUiState,
  deriveLocalOperatingLoopRecommendation,
  invalidateLocalOperatingLoopUiState,
  parseLocalOperatingLoopAction,
  recoverLocalOperatingLoopClientFailure,
  recoverLocalOperatingLoopStructuralFailure,
  shouldApplyLocalOperatingLoopResponse,
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
  const classification = classifyLocalOperatingLoopClientResponse(result.body);
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
  const classification = classifyLocalOperatingLoopClientResponse(result.body);
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
    const classification = classifyLocalOperatingLoopClientResponse(
      result.body,
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
  const unknown = classifyLocalOperatingLoopClientResponse({
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
    classifyLocalOperatingLoopClientResponse({
      ok: true,
      state: "UNKNOWN",
      secret: "must-not-render",
    }).kind,
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
  const classification = classifyLocalOperatingLoopClientResponse(
    validation.body,
  );
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
  const deliberationClassification =
    classifyLocalOperatingLoopClientResponse(deliberation.body);
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
  const acceptedClassification = classifyLocalOperatingLoopClientResponse(
    accepted.body,
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
await testFullCanonicalKeyInvalidationAndStaleSuppression();
await testProductionSourceAndImportIsolation();

console.log("local-operating-loop.test.ts: PASS");

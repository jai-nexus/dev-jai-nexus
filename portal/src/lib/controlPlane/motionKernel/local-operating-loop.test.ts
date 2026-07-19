import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { encode, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

import {
  canonicalizeLocalOperatingLoopValue,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopUiState,
  deriveLocalOperatingLoopRecommendation,
  invalidateLocalOperatingLoopUiState,
  parseLocalOperatingLoopAction,
  shouldApplyLocalOperatingLoopResponse,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopResponse,
  type LocalOperatingLoopSuccessResponse,
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
  assert.match(panelSource, /activeAbortController\.current\?\.abort\(\)/);

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
await testAuthenticationAndSecretPrecedeBodyParsing();
await testActualNextAuthJwtIntegration();
await testClientIdentitySpoofResistance();
await testProofProgressionAndInvalidProofClasses();
await testRejectsNonGoAcceptance();
await testTerminalDecisionSemanticsAndDeterministicReplay();
await testFullCanonicalKeyInvalidationAndStaleSuppression();
await testProductionSourceAndImportIsolation();

console.log("local-operating-loop.test.ts: PASS");

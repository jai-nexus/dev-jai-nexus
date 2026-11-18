import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { evaluateDownstreamActiveProgramGuard } from "../programLifecycle/downstream-active-program-guard";
import { adaptLocalShadowTerminalToBatchBContract } from "./batch-b-lifecycle-contract-adapter";
import {
  createLocalOperatingLoopBoundaryReceipt,
  createLocalOperatingLoopTerminalPresentation,
  LOCAL_SHADOW_PROGRAM_SNAPSHOT,
  type AdaptedReceiptFields,
  buildLocalOperatingLoopPacketMaterial,
  buildLocalOperatingLoopWorkPacket,
  canonicalizeLocalOperatingLoopValue,
  deriveLocalOperatingLoopRecommendation,
  LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
  LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS,
  LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
  normalizeLocalOperatingLoopActorEmail,
  parseLocalOperatingLoopAction,
  type LocalOperatingLoopArtifact,
  type LocalOperatingLoopErrorResponse,
  type LocalOperatingLoopFindingCode,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopRecommendation,
  type LocalOperatingLoopResponse,
} from "./local-operating-loop";

const PROOF_SUBKEY_DOMAIN =
  "jai-nexus/local-operating-loop/proof-subkey/v1";
const VALIDATION_PROOF_PREFIX = "local-loop.validation.v1.";
const DELIBERATION_PROOF_PREFIX = "local-loop.deliberation.v1.";
const terminalStates = { ACCEPT: "ACCEPTED", HOLD: "HELD", REJECT: "REJECTED" } as const;
const PROOF_MAC_PATTERN = /^[a-f0-9]{64}$/;

type LocalOperatingLoopAuthentication =
  | { authenticated: false }
  | {
      authenticated: true;
      role: unknown;
      email: unknown;
    };

type LocalOperatingLoopHandlerDependencies = {
  readSecret: () => string | undefined;
  authenticate: (
    request: Request,
    secret: string,
  ) => Promise<LocalOperatingLoopAuthentication>;
};

type ProgramCommitment = Pick<
  typeof LOCAL_SHADOW_PROGRAM_SNAPSHOT,
  "program_lifecycle_id" | "snapshot_version" | "snapshot_hash" | "binding_posture"
>;

function checkProgramSnapshot(value: unknown) {
  const expected = LOCAL_SHADOW_PROGRAM_SNAPSHOT;
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { error: "INVALID_EXPECTED_SNAPSHOT" } as const;
  }
  const snapshot = value as Record<string, unknown>;
  if (
    snapshot.base_sha !== expected.base_sha ||
    snapshot.snapshot_hash !== expected.snapshot_hash ||
    snapshot.snapshot_version !== expected.snapshot_version ||
    snapshot.binding_posture !== expected.binding_posture ||
    snapshot.authority_granted !== false
  ) {
    return { error: "INVALID_EXPECTED_SNAPSHOT" } as const;
  }

  const guard = evaluateDownstreamActiveProgramGuard({
    portfolio: snapshot.portfolio,
    expectedBinding: {
      programId: expected.program_lifecycle_id,
      lifecycleVersion: expected.snapshot_version,
      governingMotionId: expected.governing_motion_id,
      contractVersion: expected.contract_version,
    },
    candidateBinding: {
      programId: snapshot.program_lifecycle_id,
      lifecycleVersion: snapshot.snapshot_version,
      governingMotionId: snapshot.governing_motion_id,
      contractVersion: snapshot.contract_version,
    },
  });
  if (
    guard.kind !== "GUARD_SATISFIED" ||
    snapshot.active_program_count !== expected.active_program_count ||
    !Array.isArray(snapshot.portfolio) ||
    snapshot.portfolio.length !== expected.portfolio.length ||
    Object.keys(snapshot).length !== Object.keys(expected).length
  ) {
    return { error: "INELIGIBLE" } as const;
  }
  const commitment: ProgramCommitment = {
    program_lifecycle_id: expected.program_lifecycle_id,
    snapshot_version: expected.snapshot_version,
    snapshot_hash: expected.snapshot_hash,
    binding_posture: expected.binding_posture,
  };
  return { commitment } as const;
}

type ProofEnvelope = {
  program: ProgramCommitment;
  proofKind: "VALIDATION" | "DELIBERATION";
  contractVersion: typeof LOCAL_OPERATING_LOOP_CONTRACT_VERSION;
  baseSha: typeof LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA;
  currentState: "VALIDATED" | "AWAITING_DECISION";
  permittedNextAction: "DELIBERATE" | "DECIDE";
  motionFingerprint: string;
  recommendation: LocalOperatingLoopRecommendation | null;
  findingCodes: LocalOperatingLoopFindingCode[];
  recommendationFingerprint: string | null;
  actor: string;
  role: "ADMIN";
  candidatePacketHash: string | null;
  nonAuthorizationScopeHash: string;
};

export function createLocalOperatingLoopHandler(
  dependencies: LocalOperatingLoopHandlerDependencies,
) {
  // A proof is redeemable once on its issuing worker. Eviction and worker
  // restart invalidate outstanding proofs without persistent or network state.
  const outstanding = new Map<string, string>();
  function issueProof(prefix: string, envelope: ProofEnvelope, secret: string) {
    const nonce = randomBytes(16).toString("hex");
    const proof = signProof(prefix, envelope, secret, nonce);
    if (outstanding.size >= 4096) {
      const oldest = outstanding.keys().next();
      if (!oldest.done) outstanding.delete(oldest.value);
    }
    outstanding.set(proof, nonce);
    return proof;
  }
  function redeemProof(
    proof: string,
    prefix: string,
    envelope: ProofEnvelope,
    secret: string,
  ) {
    const nonce = outstanding.get(proof);
    if (!nonce || !verifyProof(proof, prefix, envelope, secret, nonce)) return false;
    return outstanding.delete(proof);
  }

  return async function handleLocalOperatingLoopRequest(
    request: Request,
  ): Promise<Response> {
    const secret = dependencies.readSecret() ?? "";
    if (!secret.trim()) {
      return errorResponse(
        503,
        "SERVER_SECRET_UNAVAILABLE",
        "Local operating-loop proof service is unavailable.",
      );
    }

    let authentication: LocalOperatingLoopAuthentication;
    try {
      authentication = await dependencies.authenticate(request, secret);
    } catch {
      authentication = { authenticated: false };
    }
    if (!authentication.authenticated) {
      return errorResponse(
        401,
        "UNAUTHENTICATED",
        "An authenticated session is required.",
      );
    }
    if (authentication.role !== "ADMIN") {
      return errorResponse(
        403,
        "ADMIN_REQUIRED",
        "An ADMIN session is required.",
      );
    }

    const actor = normalizeLocalOperatingLoopActorEmail(authentication.email);
    if (!actor) {
      return errorResponse(
        403,
        "ACTOR_EMAIL_REQUIRED",
        "A normalized session email is required.",
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(
        400,
        "INVALID_JSON",
        "The request body must be valid JSON.",
      );
    }

    const parsed = parseLocalOperatingLoopAction(body);
    if (!parsed.ok) {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The request body does not match the local operating-loop contract.",
        parsed.issues,
      );
    }

    const binding = checkProgramSnapshot(parsed.value.programSnapshot);
    if (binding.error) {
      return errorResponse(
        409,
        binding.error,
        "The Program 1 documentary binding is unavailable or ineligible.",
      );
    }
    const program = binding.commitment;
    const input = parsed.value.input;
    const motionFingerprint = hashCanonicalValue(
      "jai-nexus/local-operating-loop/motion/v1",
      input,
    );
    const nonAuthorizationScopeHash = hashCanonicalValue(
      "jai-nexus/local-operating-loop/non-authorization-scope/v1",
      LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS,
    );

    if (parsed.value.action === "VALIDATE") {
      const envelope = buildValidationEnvelope({
        program,
        actor,
        motionFingerprint,
        nonAuthorizationScopeHash,
      });
      return successResponse({
        ok: true,
        contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
        baseSha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
        state: "VALIDATED",
        actor,
        input,
        motionFingerprint,
        validationProof: issueProof(
          VALIDATION_PROOF_PREFIX,
          envelope,
          secret,
        ),
        nonAuthorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
      });
    }

    if (parsed.value.action === "DELIBERATE") {
      const validationEnvelope = buildValidationEnvelope({
        program,
        actor,
        motionFingerprint,
        nonAuthorizationScopeHash,
      });
      if (
        !redeemProof(
          parsed.value.validationProof,
          VALIDATION_PROOF_PREFIX,
          validationEnvelope,
          secret,
        )
      ) {
        return invalidProofResponse();
      }

      const deliberation = buildDeliberationValues({
        program,
        input,
        actor,
        motionFingerprint,
        nonAuthorizationScopeHash,
      });
      return successResponse({
        ok: true,
        contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
        baseSha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
        state: "AWAITING_DECISION",
        actor,
        input,
        motionFingerprint,
        recommendation: deliberation.recommendation,
        findingCodes: deliberation.findingCodes,
        recommendationFingerprint:
          deliberation.recommendationFingerprint,
        candidatePacketHash: deliberation.candidatePacketHash,
        deliberationProof: issueProof(
          DELIBERATION_PROOF_PREFIX,
          deliberation.envelope,
          secret,
        ),
        nonAuthorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
      });
    }

    const deliberation = buildDeliberationValues({
      program,
      input,
      actor,
      motionFingerprint,
      nonAuthorizationScopeHash,
    });
    if (
      !redeemProof(
        parsed.value.deliberationProof,
        DELIBERATION_PROOF_PREFIX,
        deliberation.envelope,
        secret,
      )
    ) {
      return invalidProofResponse();
    }

    if (
      parsed.value.decision === "ACCEPT" &&
      deliberation.recommendation !== "GO"
    ) {
      return errorResponse(
        409,
        "ACCEPT_REQUIRES_GO",
        "Only a server-derived GO recommendation may be accepted.",
      );
    }

    const workPacket =
      parsed.value.decision === "ACCEPT" &&
      deliberation.recommendation === "GO" &&
      deliberation.candidatePacketHash
        ? buildLocalOperatingLoopWorkPacket({
            packetHash: deliberation.candidatePacketHash,
            material: buildLocalOperatingLoopPacketMaterial({
              motion: input,
              actor,
              motionFingerprint,
            }),
          })
        : null;
    const artifact = buildDecisionArtifact({
      input,
      actor,
      decision: parsed.value.decision,
      recommendation: deliberation.recommendation,
      findingCodes: deliberation.findingCodes,
      motionFingerprint,
      candidatePacketHash: deliberation.candidatePacketHash,
    });

    const state = terminalStates[parsed.value.decision];
    const terminalPresentation = createLocalOperatingLoopTerminalPresentation({
      state,
      artifact,
      workPacket,
      recommendation: deliberation.recommendation,
      findingCodes: deliberation.findingCodes,
    });
    const adapted = adaptLocalShadowTerminalToBatchBContract({
      contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
      terminalPresentation,
      boundaryReceipt: createLocalOperatingLoopBoundaryReceipt(terminalPresentation),
    });
    if (adapted.kind !== "ADAPTED") {
      return errorResponse(409, "D9_ADAPTER_BLOCKED", "The D9 terminal receipt is blocked.");
    }
    const adaptedReceipt: AdaptedReceiptFields = {
      kind: adapted.kind,
      adapter_version: adapted.adapterVersion,
      binding_posture: program.binding_posture,
      authority_granted: LOCAL_SHADOW_PROGRAM_SNAPSHOT.authority_granted,
      boundary_receipt_classification: adapted.boundaryReceiptClassification,
      ui_output_classification: adapted.uiOutputClassification,
      work_packet_classification: adapted.workPacketClassification,
      packet_version: adapted.workPacketVersion,
    };
    return successResponse({
      ok: true,
      contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
      baseSha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
      state,
      adaptedReceipt,
      actor,
      input,
      motionFingerprint,
      recommendation: deliberation.recommendation,
      findingCodes: deliberation.findingCodes,
      recommendationFingerprint: deliberation.recommendationFingerprint,
      decision: parsed.value.decision,
      workPacket,
      artifact,
      nonAuthorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
    });
  };
}

function buildValidationEnvelope(input: {
  program: ProgramCommitment;
  actor: string;
  motionFingerprint: string;
  nonAuthorizationScopeHash: string;
}): ProofEnvelope {
  return {
    program: input.program,
    proofKind: "VALIDATION",
    contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    baseSha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    currentState: "VALIDATED",
    permittedNextAction: "DELIBERATE",
    motionFingerprint: input.motionFingerprint,
    recommendation: null,
    findingCodes: [],
    recommendationFingerprint: null,
    actor: input.actor,
    role: "ADMIN",
    candidatePacketHash: null,
    nonAuthorizationScopeHash: input.nonAuthorizationScopeHash,
  };
}

function buildDeliberationValues(input: {
  program: ProgramCommitment;
  input: LocalOperatingLoopInput;
  actor: string;
  motionFingerprint: string;
  nonAuthorizationScopeHash: string;
}) {
  const { recommendation, findingCodes } =
    deriveLocalOperatingLoopRecommendation(input.input);
  const recommendationFingerprint = hashCanonicalValue(
    "jai-nexus/local-operating-loop/recommendation/v1",
    { recommendation, findingCodes },
  );
  const packetMaterial =
    recommendation === "GO"
      ? buildLocalOperatingLoopPacketMaterial({
          motion: input.input,
          actor: input.actor,
          motionFingerprint: input.motionFingerprint,
        })
      : null;
  const candidatePacketHash = packetMaterial
    ? hashCanonicalValue(
        "jai-nexus/local-operating-loop/candidate-packet/v1",
        packetMaterial,
      )
    : null;
  const envelope: ProofEnvelope = {
    program: input.program,
    proofKind: "DELIBERATION",
    contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    baseSha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    currentState: "AWAITING_DECISION",
    permittedNextAction: "DECIDE",
    motionFingerprint: input.motionFingerprint,
    recommendation,
    findingCodes,
    recommendationFingerprint,
    actor: input.actor,
    role: "ADMIN",
    candidatePacketHash,
    nonAuthorizationScopeHash: input.nonAuthorizationScopeHash,
  };

  return {
    recommendation,
    findingCodes,
    recommendationFingerprint,
    candidatePacketHash,
    envelope,
  };
}

function buildDecisionArtifact(input: {
  input: LocalOperatingLoopInput;
  actor: string;
  decision: "ACCEPT" | "HOLD" | "REJECT";
  recommendation: LocalOperatingLoopRecommendation;
  findingCodes: LocalOperatingLoopFindingCode[];
  motionFingerprint: string;
  candidatePacketHash: string | null;
}): LocalOperatingLoopArtifact {
  const artifactMaterial = {
    artifact_version: "local-shadow-decision-artifact.v1" as const,
    base_sha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    motion_id: input.input.motionId,
    motion_fingerprint: input.motionFingerprint,
    recommendation: input.recommendation,
    finding_codes: input.findingCodes,
    decision: input.decision,
    actor: input.actor,
    candidate_packet_hash: input.candidatePacketHash,
    receipt_authority: "DEMONSTRATION_ONLY" as const,
    persistence: "NONE" as const,
    program_effect: "NONE" as const,
    not_a_control_thread_acceptance_receipt: true as const,
    decision_scope: "GENERATE_WORK_PACKET_ONLY" as const,
    execution_authority_granted: false as const,
  };
  const artifactHash = hashCanonicalValue(
    "jai-nexus/local-operating-loop/decision-artifact/v1",
    artifactMaterial,
  );
  return {
    artifact_id: `local-shadow-decision-${artifactHash.slice(0, 24)}`,
    ...artifactMaterial,
  };
}

function hashCanonicalValue(domain: string, value: unknown): string {
  return createHash("sha256")
    .update(domain)
    .update("\0")
    .update(canonicalizeLocalOperatingLoopValue(value))
    .digest("hex");
}

function deriveProofSubkey(secret: string): Buffer {
  return createHmac("sha256", secret)
    .update(PROOF_SUBKEY_DOMAIN)
    .digest();
}

function signProof(
  prefix: string,
  envelope: ProofEnvelope,
  secret: string,
  nonce: string,
): string {
  const mac = createHmac("sha256", deriveProofSubkey(secret))
    .update(nonce)
    .update(canonicalizeLocalOperatingLoopValue(envelope))
    .digest("hex");
  return `${prefix}${mac}`;
}

function verifyProof(
  proof: string,
  prefix: string,
  envelope: ProofEnvelope,
  secret: string,
  nonce: string,
): boolean {
  if (!proof.startsWith(prefix)) {
    return false;
  }
  const presentedHex = proof.slice(prefix.length);
  if (!PROOF_MAC_PATTERN.test(presentedHex)) {
    return false;
  }

  const expected = signProof(prefix, envelope, secret, nonce).slice(prefix.length);
  const presentedBuffer = Buffer.from(presentedHex, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return (
    presentedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(presentedBuffer, expectedBuffer)
  );
}

function invalidProofResponse(): Response {
  return errorResponse(
    409,
    "INVALID_PROOF",
    "The transition proof is invalid for the current canonical state.",
  );
}

function successResponse(body: LocalOperatingLoopResponse): Response {
  return jsonResponse(body, 200);
}

function errorResponse(
  status: number,
  code: LocalOperatingLoopErrorResponse["error"]["code"],
  message: string,
  issues?: Array<{ path: string; code: string }>,
): Response {
  return jsonResponse(
    {
      ok: false,
      workPackets: [],
      error: {
        code,
        message,
        ...(issues ? { issues } : {}),
      },
      nonAuthorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
    },
    status,
  );
}

function jsonResponse(
  body: LocalOperatingLoopResponse,
  status: number,
): Response {
  return new Response(canonicalizeLocalOperatingLoopValue(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

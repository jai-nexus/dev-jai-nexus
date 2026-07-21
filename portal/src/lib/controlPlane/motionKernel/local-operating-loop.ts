import { z } from "zod";

export const LOCAL_OPERATING_LOOP_CONTRACT_VERSION =
  "jai-local-operating-loop.v1" as const;
export const LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA =
  "a0e7b76af02899659529355773bf293d58269897" as const;

export const LOCAL_OPERATING_LOOP_TARGET_THREADS = [
  "JAI_CONTROL_THREAD",
  "JAI_ORCHESTRATOR_NEXUS",
  "JAI_DEV_JAI_NEXUS",
  "JAI_AUDIT_NEXUS",
  "JAI_FORMAT",
  "JAI_REPO_GENERIC",
] as const;

export const LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS = [
  "Local-shadow output is demonstration-only.",
  "No CONTROL_THREAD acceptance is created.",
  "No execution authority is granted.",
  "No Program, Batch, Wave, or Lane progression is created.",
  "No provider, model, Agent, or Council is activated.",
  "No persistence, filesystem, GitHub, Linear, or outbound network action occurs.",
  "No automatic Codex invocation, routing, deployment, or production gate occurs.",
] as const;

export type LocalOperatingLoopTargetThread =
  (typeof LOCAL_OPERATING_LOOP_TARGET_THREADS)[number];

export type LocalOperatingLoopInput = {
  motionId: string;
  title: string;
  summary: string;
  targetRepo: string;
  targetThreads: LocalOperatingLoopTargetThread[];
  evidencePointers: string[];
};

export type LocalOperatingLoopRecommendation =
  | "GO"
  | "NEEDS_REVISION"
  | "BLOCKED";

export type LocalOperatingLoopFindingCode =
  | "TARGET_REPO_OUT_OF_SCOPE"
  | "CONTROL_THREAD_REQUIRED"
  | "TITLE_TOO_SHORT"
  | "SUMMARY_TOO_SHORT"
  | "EVIDENCE_REQUIRED";

export type LocalOperatingLoopDecision = "ACCEPT" | "HOLD" | "REJECT";

export type LocalOperatingLoopState =
  | "DRAFT"
  | "VALIDATED"
  | "AWAITING_DECISION"
  | "ACCEPTED"
  | "HELD"
  | "REJECTED";

export type LocalOperatingLoopAction =
  | {
      action: "VALIDATE";
      input: LocalOperatingLoopInput;
    }
  | {
      action: "DELIBERATE";
      input: LocalOperatingLoopInput;
      validationProof: string;
    }
  | {
      action: "DECIDE";
      input: LocalOperatingLoopInput;
      decision: LocalOperatingLoopDecision;
      deliberationProof: string;
    };

export type LocalOperatingLoopRecommendationResult = {
  recommendation: LocalOperatingLoopRecommendation;
  findingCodes: LocalOperatingLoopFindingCode[];
  advisoryOnly: true;
};

export type LocalOperatingLoopWorkPacket = {
  packet_id: string;
  packet_version: "local-shadow-work-packet.v1";
  status: "PROPOSED_ONLY";
  base_sha: typeof LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA;
  motion_id: string;
  motion_fingerprint: string;
  title: string;
  summary: string;
  target_repo: string;
  target_threads: LocalOperatingLoopTargetThread[];
  evidence_pointers: string[];
  proposed_by: string;
  decision_scope: "GENERATE_WORK_PACKET_ONLY";
  execution_authority_granted: false;
  non_authorizations: string[];
};

export type LocalOperatingLoopArtifact = {
  artifact_id: string;
  artifact_version: "local-shadow-decision-artifact.v1";
  base_sha: typeof LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA;
  motion_id: string;
  motion_fingerprint: string;
  recommendation: LocalOperatingLoopRecommendation;
  finding_codes: LocalOperatingLoopFindingCode[];
  decision: LocalOperatingLoopDecision;
  actor: string;
  candidate_packet_hash: string | null;
  receipt_authority: "DEMONSTRATION_ONLY";
  persistence: "NONE";
  program_effect: "NONE";
  not_a_control_thread_acceptance_receipt: true;
  decision_scope: "GENERATE_WORK_PACKET_ONLY";
  execution_authority_granted: false;
};

export type LocalOperatingLoopSuccessResponse =
  | {
      ok: true;
      contractVersion: typeof LOCAL_OPERATING_LOOP_CONTRACT_VERSION;
      baseSha: typeof LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA;
      state: "VALIDATED";
      actor: string;
      input: LocalOperatingLoopInput;
      motionFingerprint: string;
      validationProof: string;
      nonAuthorizations: string[];
    }
  | {
      ok: true;
      contractVersion: typeof LOCAL_OPERATING_LOOP_CONTRACT_VERSION;
      baseSha: typeof LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA;
      state: "AWAITING_DECISION";
      actor: string;
      input: LocalOperatingLoopInput;
      motionFingerprint: string;
      recommendation: LocalOperatingLoopRecommendation;
      findingCodes: LocalOperatingLoopFindingCode[];
      recommendationFingerprint: string;
      candidatePacketHash: string | null;
      deliberationProof: string;
      nonAuthorizations: string[];
    }
  | {
      ok: true;
      contractVersion: typeof LOCAL_OPERATING_LOOP_CONTRACT_VERSION;
      baseSha: typeof LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA;
      state: "ACCEPTED" | "HELD" | "REJECTED";
      actor: string;
      input: LocalOperatingLoopInput;
      motionFingerprint: string;
      recommendation: LocalOperatingLoopRecommendation;
      findingCodes: LocalOperatingLoopFindingCode[];
      recommendationFingerprint: string;
      decision: LocalOperatingLoopDecision;
      workPacket: LocalOperatingLoopWorkPacket | null;
      artifact: LocalOperatingLoopArtifact;
      nonAuthorizations: string[];
    };

export type LocalOperatingLoopErrorResponse = {
  ok: false;
  error: {
    code:
      | "SERVER_SECRET_UNAVAILABLE"
      | "UNAUTHENTICATED"
      | "ADMIN_REQUIRED"
      | "ACTOR_EMAIL_REQUIRED"
      | "INVALID_JSON"
      | "INVALID_REQUEST"
      | "INVALID_PROOF"
      | "ACCEPT_REQUIRES_GO";
    message: string;
    issues?: Array<{ path: string; code: string }>;
  };
  nonAuthorizations: string[];
};

export type LocalOperatingLoopResponse =
  | LocalOperatingLoopSuccessResponse
  | LocalOperatingLoopErrorResponse;

export type LocalOperatingLoopUiState = {
  projectionKey: string;
  state: LocalOperatingLoopState;
  validationProof: string | null;
  deliberationProof: string | null;
  recommendation: LocalOperatingLoopRecommendation | null;
  findingCodes: LocalOperatingLoopFindingCode[];
  workPacket: LocalOperatingLoopWorkPacket | null;
  artifact: LocalOperatingLoopArtifact | null;
  activeRequestId: number | null;
};

export type LocalOperatingLoopPresentationPhase =
  | LocalOperatingLoopState
  | "VALIDATING"
  | "DELIBERATING";

export const LOCAL_OPERATING_LOOP_PHASE_COPY: Readonly<
  Record<LocalOperatingLoopPresentationPhase, string>
> = {
  DRAFT: "Ready for structural validation. This checks request shape only.",
  VALIDATING: "Checking request structure only.",
  VALIDATED:
    "Structure validated. No semantic recommendation has been produced.",
  DELIBERATING:
    "Running server-side semantic deliberation to derive a recommendation.",
  AWAITING_DECISION:
    "Semantic deliberation complete. Review the server-derived recommendation before an ADMIN decision.",
  ACCEPTED: "Accepted locally for proposed Work Packet generation only.",
  HELD: "Local-shadow state advanced to HELD.",
  REJECTED: "Local-shadow state advanced to REJECTED.",
};

export const LOCAL_OPERATING_LOOP_STRUCTURAL_FAILURE_COPY =
  "Structural validation found fields that need correction. The selected motion remains available and the local shadow returned to DRAFT.";

export type LocalOperatingLoopStructuralRemediation = {
  id: string;
  field: string;
  message: string;
};

const localOperatingLoopStructuralRemediationRules = [
  {
    id: "motion-id",
    field: "Motion identifier",
    pathPrefix: "input.motionId",
    message: "Provide a single-line motion identifier.",
  },
  {
    id: "title",
    field: "Title",
    pathPrefix: "input.title",
    message: "Provide a single-line motion title within 240 characters.",
  },
  {
    id: "summary",
    field: "Summary",
    pathPrefix: "input.summary",
    message: "Provide a motion summary between 1 and 4,000 characters.",
  },
  {
    id: "target-repository",
    field: "Target repository",
    pathPrefix: "input.targetRepo",
    message: "Provide a single-line target repository within 200 characters.",
  },
  {
    id: "target-threads",
    field: "Target threads",
    pathPrefix: "input.targetThreads",
    message:
      "Choose one to six unique target threads from the available options.",
  },
  {
    id: "evidence-pointers",
    field: "Evidence pointers",
    pathPrefix: "input.evidencePointers",
    message: "Use no more than 20 unique, non-empty evidence pointers.",
  },
  {
    id: "action",
    field: "Action",
    pathPrefix: "action",
    message: "Choose validation, deliberation, or an ADMIN decision.",
  },
] as const;

const localOperatingLoopGenericRemediation = {
  id: "request",
  field: "Motion request",
  message:
    "Review the motion structure and remove unsupported fields before retrying.",
} as const;

export const LOCAL_OPERATING_LOOP_REAUTHENTICATION_HREF =
  "/login?next=%2Foperator%2Fmotion-control" as const;
export const LOCAL_OPERATING_LOOP_REAUTHENTICATION_LABEL =
  "Sign in again" as const;
export const LOCAL_OPERATING_LOOP_PAGEHIDE_COPY =
  "Navigation cleared the local shadow. Fresh structural validation is required." as const;
export const LOCAL_OPERATING_LOOP_RESTORED_COPY =
  "Restored browser state was cleared. Fresh structural validation is required." as const;

export type LocalOperatingLoopRecoveryNotice = {
  id: string;
  heading: string;
  message: string;
  statusMessage: string;
  requiresReauthentication: boolean;
};

const localOperatingLoopGenericRecoveryNotice = {
  id: "generic-fail-closed",
  heading: "Fresh validation required",
  message:
    "The local shadow could not continue safely. Review the selected motion and validate it again.",
  statusMessage:
    "Local shadow returned to DRAFT. Fresh structural validation is required.",
  requiresReauthentication: false,
} as const satisfies LocalOperatingLoopRecoveryNotice;

const localOperatingLoopRecoveryNotices = {
  UNAUTHENTICATED: {
    id: "authentication-expired",
    heading: "Authentication required",
    message:
      "Your session is missing or expired. Reauthenticate, then validate the selected motion again.",
    statusMessage:
      "Local shadow returned to DRAFT because authentication is required.",
    requiresReauthentication: true,
  },
  ADMIN_REQUIRED: {
    id: "admin-identity-required",
    heading: "ADMIN identity required",
    message:
      "This session does not have the required ADMIN identity. Reauthenticate with an ADMIN account, then validate again.",
    statusMessage:
      "Local shadow returned to DRAFT because an ADMIN identity is required.",
    requiresReauthentication: true,
  },
  ACTOR_EMAIL_REQUIRED: {
    id: "actor-identity-required",
    heading: "Usable actor identity required",
    message:
      "This ADMIN session has no usable actor identity. Reauthenticate, then validate the selected motion again.",
    statusMessage:
      "Local shadow returned to DRAFT because a usable actor identity is required.",
    requiresReauthentication: true,
  },
  SERVER_SECRET_UNAVAILABLE: {
    id: "proof-service-unavailable",
    heading: "Proof service unavailable",
    message:
      "The local proof service is unavailable. Validate again after the service is restored.",
    statusMessage:
      "Local shadow returned to DRAFT because the proof service is unavailable.",
    requiresReauthentication: false,
  },
  INVALID_PROOF: {
    id: "proof-invalid",
    heading: "Proof no longer valid",
    message:
      "The proof is stale, expired, rotated, or does not match this motion. Validate again from DRAFT.",
    statusMessage:
      "Local shadow returned to DRAFT because the proof is no longer valid.",
    requiresReauthentication: false,
  },
  INVALID_JSON: localOperatingLoopGenericRecoveryNotice,
  ACCEPT_REQUIRES_GO: localOperatingLoopGenericRecoveryNotice,
} as const satisfies Record<
  Exclude<
    LocalOperatingLoopErrorResponse["error"]["code"],
    "INVALID_REQUEST"
  >,
  LocalOperatingLoopRecoveryNotice
>;

export type LocalOperatingLoopClientResponseClassification =
  | {
      kind: "SUCCESS";
      response: LocalOperatingLoopSuccessResponse;
    }
  | {
      kind: "STRUCTURAL_FAILURE";
      issues: LocalOperatingLoopErrorResponse["error"]["issues"];
    }
  | {
      kind: "RECOVERY";
      code: unknown;
    };

export type LocalOperatingLoopClientResponseExpectation = {
  request: unknown;
  requestProjectionKey: string;
  currentProjectionKey: string;
};

export type LocalOperatingLoopContentHasher = (
  domain: string,
  value: unknown,
) => Promise<string>;

const LOCAL_OPERATING_LOOP_MOTION_HASH_DOMAIN =
  "jai-nexus/local-operating-loop/motion/v1";
const LOCAL_OPERATING_LOOP_RECOMMENDATION_HASH_DOMAIN =
  "jai-nexus/local-operating-loop/recommendation/v1";
const LOCAL_OPERATING_LOOP_CANDIDATE_PACKET_HASH_DOMAIN =
  "jai-nexus/local-operating-loop/candidate-packet/v1";
const LOCAL_OPERATING_LOOP_ARTIFACT_HASH_DOMAIN =
  "jai-nexus/local-operating-loop/decision-artifact/v1";

export type LocalOperatingLoopBrowserLifecycleEvent =
  | { type: "PAGEHIDE" }
  | { type: "PAGESHOW"; persisted: boolean };

const targetThreadSchema = z.enum(LOCAL_OPERATING_LOOP_TARGET_THREADS);
const proofSchema = z.string().min(1).max(200).regex(/^[a-z0-9.-]+$/);

const localOperatingLoopInputSchema = z
  .object({
    motionId: normalizedTextSchema({ min: 1, max: 160, singleLine: true }),
    title: normalizedTextSchema({ min: 1, max: 240, singleLine: true }),
    summary: normalizedTextSchema({ min: 1, max: 4000 }),
    targetRepo: normalizedTextSchema({ min: 1, max: 200, singleLine: true }),
    targetThreads: z
      .array(targetThreadSchema)
      .min(1)
      .max(6)
      .superRefine(rejectDuplicates),
    evidencePointers: z
      .array(normalizedTextSchema({ min: 1, max: 500 }))
      .max(20)
      .superRefine(rejectDuplicates),
  })
  .strict();

const localOperatingLoopActionSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("VALIDATE"),
      input: localOperatingLoopInputSchema,
    })
    .strict(),
  z
    .object({
      action: z.literal("DELIBERATE"),
      input: localOperatingLoopInputSchema,
      validationProof: proofSchema,
    })
    .strict(),
  z
    .object({
      action: z.literal("DECIDE"),
      input: localOperatingLoopInputSchema,
      decision: z.enum(["ACCEPT", "HOLD", "REJECT"]),
      deliberationProof: proofSchema,
    })
    .strict(),
]);

export function parseLocalOperatingLoopAction(
  value: unknown,
):
  | { ok: true; value: LocalOperatingLoopAction }
  | {
      ok: false;
      issues: Array<{ path: string; code: string }>;
    } {
  const result = localOperatingLoopActionSchema.safeParse(value);
  if (result.success) {
    return { ok: true, value: result.data };
  }

  return {
    ok: false,
    issues: result.error.issues
      .map((issue) => ({
        path: issue.path.join(".") || "$",
        code: issue.code,
      }))
      .sort((left, right) =>
        `${left.path}:${left.code}`.localeCompare(
          `${right.path}:${right.code}`,
          "en",
        ),
      ),
  };
}

export function normalizeLocalOperatingLoopString(value: string): string {
  return value
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .trim();
}

export function normalizeLocalOperatingLoopActorEmail(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = normalizeLocalOperatingLoopString(value).toLowerCase();
  if (
    normalized.length === 0 ||
    normalized.length > 320 ||
    normalized.includes("\n")
  ) {
    return null;
  }
  return normalized;
}

export function canonicalizeLocalOperatingLoopValue(value: unknown): string {
  return JSON.stringify(sortCanonicalValue(value));
}

export function deriveLocalOperatingLoopRecommendation(
  input: LocalOperatingLoopInput,
): LocalOperatingLoopRecommendationResult {
  const findingCodes: LocalOperatingLoopFindingCode[] = [];

  if (input.targetRepo !== "dev-jai-nexus") {
    findingCodes.push("TARGET_REPO_OUT_OF_SCOPE");
  }
  if (!input.targetThreads.includes("JAI_CONTROL_THREAD")) {
    findingCodes.push("CONTROL_THREAD_REQUIRED");
  }
  if (characterLength(input.title) < 8) {
    findingCodes.push("TITLE_TOO_SHORT");
  }
  if (characterLength(input.summary) < 40) {
    findingCodes.push("SUMMARY_TOO_SHORT");
  }
  if (input.evidencePointers.length === 0) {
    findingCodes.push("EVIDENCE_REQUIRED");
  }

  const recommendation = findingCodes.some((code) =>
    ["TARGET_REPO_OUT_OF_SCOPE", "CONTROL_THREAD_REQUIRED"].includes(code),
  )
    ? "BLOCKED"
    : findingCodes.length > 0
      ? "NEEDS_REVISION"
      : "GO";

  return {
    recommendation,
    findingCodes,
    advisoryOnly: true,
  };
}

export function buildLocalOperatingLoopPacketMaterial(input: {
  motion: LocalOperatingLoopInput;
  actor: string;
  motionFingerprint: string;
}) {
  return {
    packet_version: "local-shadow-work-packet.v1" as const,
    status: "PROPOSED_ONLY" as const,
    base_sha: LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA,
    motion_id: input.motion.motionId,
    motion_fingerprint: input.motionFingerprint,
    title: input.motion.title,
    summary: input.motion.summary,
    target_repo: input.motion.targetRepo,
    target_threads: [...input.motion.targetThreads],
    evidence_pointers: [...input.motion.evidencePointers],
    proposed_by: input.actor,
    decision_scope: "GENERATE_WORK_PACKET_ONLY" as const,
    execution_authority_granted: false as const,
    non_authorizations: [...LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS],
  };
}

export function buildLocalOperatingLoopWorkPacket(input: {
  packetHash: string;
  material: ReturnType<typeof buildLocalOperatingLoopPacketMaterial>;
}): LocalOperatingLoopWorkPacket {
  return {
    packet_id: `local-shadow-work-packet-${input.packetHash.slice(0, 24)}`,
    ...input.material,
  };
}

export function createLocalOperatingLoopProjectionKey(
  input: LocalOperatingLoopInput,
): string {
  return canonicalizeLocalOperatingLoopValue(input);
}

export function createLocalOperatingLoopUiState(
  projectionKey: string,
): LocalOperatingLoopUiState {
  return {
    projectionKey,
    state: "DRAFT",
    validationProof: null,
    deliberationProof: null,
    recommendation: null,
    findingCodes: [],
    workPacket: null,
    artifact: null,
    activeRequestId: null,
  };
}

export function recoverLocalOperatingLoopStructuralFailure(
  state: LocalOperatingLoopUiState,
): LocalOperatingLoopUiState {
  return createLocalOperatingLoopUiState(state.projectionKey);
}

export function createLocalOperatingLoopStructuralRemediations(
  issues: LocalOperatingLoopErrorResponse["error"]["issues"],
): LocalOperatingLoopStructuralRemediation[] {
  const selectedRuleIds = new Set<string>();
  let includeGenericRemediation = !issues || issues.length === 0;

  for (const issue of issues ?? []) {
    const rule = localOperatingLoopStructuralRemediationRules.find(
      (candidate) =>
        issue.path === candidate.pathPrefix ||
        issue.path.startsWith(`${candidate.pathPrefix}.`),
    );
    if (rule) {
      selectedRuleIds.add(rule.id);
    } else {
      includeGenericRemediation = true;
    }
  }

  const remediations: LocalOperatingLoopStructuralRemediation[] =
    localOperatingLoopStructuralRemediationRules
      .filter((rule) => selectedRuleIds.has(rule.id))
      .map((rule) => ({
        id: rule.id,
        field: rule.field,
        message: rule.message,
      }));

  if (includeGenericRemediation) {
    remediations.push(localOperatingLoopGenericRemediation);
  }
  return remediations;
}

export function createLocalOperatingLoopRecoveryNotice(
  code: unknown,
): LocalOperatingLoopRecoveryNotice {
  if (
    typeof code === "string" &&
    Object.prototype.hasOwnProperty.call(
      localOperatingLoopRecoveryNotices,
      code,
    )
  ) {
    return localOperatingLoopRecoveryNotices[
      code as keyof typeof localOperatingLoopRecoveryNotices
    ];
  }
  return localOperatingLoopGenericRecoveryNotice;
}

export function recoverLocalOperatingLoopClientFailure(
  state: LocalOperatingLoopUiState,
): LocalOperatingLoopUiState {
  return createLocalOperatingLoopUiState(state.projectionKey);
}

export function applyLocalOperatingLoopBrowserLifecycle(
  state: LocalOperatingLoopUiState,
  event: LocalOperatingLoopBrowserLifecycleEvent,
): LocalOperatingLoopUiState {
  if (event.type === "PAGEHIDE" || event.persisted) {
    return createLocalOperatingLoopUiState(state.projectionKey);
  }
  return state;
}

export async function classifyLocalOperatingLoopClientResponse(
  value: unknown,
  expectation: LocalOperatingLoopClientResponseExpectation,
  contentHasher: LocalOperatingLoopContentHasher =
    hashLocalOperatingLoopCanonicalValue,
): Promise<LocalOperatingLoopClientResponseClassification> {
  if (!isRecord(value)) {
    return { kind: "RECOVERY", code: null };
  }

  if (value.ok === false) {
    if (
      !hasExactKeys(value, ["error", "nonAuthorizations", "ok"]) ||
      !hasExactNonAuthorizations(value.nonAuthorizations) ||
      !isRecord(value.error) ||
      typeof value.error.code !== "string" ||
      typeof value.error.message !== "string" ||
      !hasOnlyKeys(value.error, ["code", "issues", "message"])
    ) {
      return { kind: "RECOVERY", code: null };
    }

    if (value.error.code === "INVALID_REQUEST") {
      if (
        value.error.issues !== undefined &&
        !isLocalOperatingLoopIssueArray(value.error.issues)
      ) {
        return { kind: "RECOVERY", code: null };
      }
      return {
        kind: "STRUCTURAL_FAILURE",
        issues: value.error.issues,
      };
    }
    return { kind: "RECOVERY", code: value.error.code };
  }

  if (value.ok === true) {
    try {
      if (
        await isSafeLocalOperatingLoopSuccessResponse(
          value,
          expectation,
          contentHasher,
        )
      ) {
        return {
          kind: "SUCCESS",
          response: value as LocalOperatingLoopSuccessResponse,
        };
      }
    } catch {
      return { kind: "RECOVERY", code: null };
    }
  }

  return { kind: "RECOVERY", code: null };
}

export function invalidateLocalOperatingLoopUiState(
  state: LocalOperatingLoopUiState,
  projectionKey: string,
): LocalOperatingLoopUiState {
  return state.projectionKey === projectionKey
    ? state
    : createLocalOperatingLoopUiState(projectionKey);
}

export function shouldApplyLocalOperatingLoopResponse(input: {
  currentProjectionKey: string;
  responseProjectionKey: string;
  currentRequestId: number | null;
  responseRequestId: number;
}): boolean {
  return (
    input.currentProjectionKey === input.responseProjectionKey &&
    input.currentRequestId === input.responseRequestId
  );
}

async function isSafeLocalOperatingLoopSuccessResponse(
  value: Record<string, unknown>,
  expectation: LocalOperatingLoopClientResponseExpectation,
  contentHasher: LocalOperatingLoopContentHasher,
): Promise<boolean> {
  const expectedRequest = parseLocalOperatingLoopExpectedRequest(expectation);
  if (
    !expectedRequest ||
    value.contractVersion !== LOCAL_OPERATING_LOOP_CONTRACT_VERSION ||
    value.baseSha !== LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA ||
    typeof value.actor !== "string" ||
    normalizeLocalOperatingLoopActorEmail(value.actor) !== value.actor ||
    !isSafeLocalOperatingLoopInput(value.input) ||
    canonicalizeLocalOperatingLoopValue(value.input) !==
      canonicalizeLocalOperatingLoopValue(expectedRequest.input) ||
    !matchesLocalOperatingLoopRequestedTransition(expectedRequest, value) ||
    !isLocalOperatingLoopSha256(value.motionFingerprint) ||
    !hasExactNonAuthorizations(value.nonAuthorizations)
  ) {
    return false;
  }

  const expectedMotionFingerprint = await contentHasher(
    LOCAL_OPERATING_LOOP_MOTION_HASH_DOMAIN,
    value.input,
  );
  if (value.motionFingerprint !== expectedMotionFingerprint) {
    return false;
  }

  if (value.state === "VALIDATED") {
    return (
      hasExactKeys(value, [
        "actor",
        "baseSha",
        "contractVersion",
        "input",
        "motionFingerprint",
        "nonAuthorizations",
        "ok",
        "state",
        "validationProof",
      ]) && isLocalOperatingLoopValidationProof(value.validationProof)
    );
  }

  if (value.state === "AWAITING_DECISION") {
    if (
      !hasExactKeys(value, [
        "actor",
        "baseSha",
        "candidatePacketHash",
        "contractVersion",
        "deliberationProof",
        "findingCodes",
        "input",
        "motionFingerprint",
        "nonAuthorizations",
        "ok",
        "recommendation",
        "recommendationFingerprint",
        "state",
      ]) ||
      !isLocalOperatingLoopRecommendation(value.recommendation) ||
      !isLocalOperatingLoopFindingCodeArray(value.findingCodes) ||
      !isLocalOperatingLoopSha256(value.recommendationFingerprint) ||
      !isLocalOperatingLoopDeliberationProof(value.deliberationProof)
    ) {
      return false;
    }
    const expected = await buildLocalOperatingLoopIntegrityEvidence({
      input: value.input,
      actor: value.actor,
      motionFingerprint: expectedMotionFingerprint,
      contentHasher,
    });
    return (
      value.recommendation === expected.recommendation &&
      hasExactArrayValues(value.findingCodes, expected.findingCodes) &&
      value.recommendationFingerprint ===
        expected.recommendationFingerprint &&
      value.candidatePacketHash === expected.candidatePacketHash
    );
  }

  if (!isLocalOperatingLoopTerminalState(value.state)) {
    return false;
  }
  const expectedDecision =
    value.state === "ACCEPTED"
      ? "ACCEPT"
      : value.state === "HELD"
        ? "HOLD"
        : "REJECT";
  if (
    !hasExactKeys(value, [
      "actor",
      "artifact",
      "baseSha",
      "contractVersion",
      "decision",
      "findingCodes",
      "input",
      "motionFingerprint",
      "nonAuthorizations",
      "ok",
      "recommendation",
      "recommendationFingerprint",
      "state",
      "workPacket",
    ]) ||
    value.decision !== expectedDecision ||
    !isLocalOperatingLoopRecommendation(value.recommendation) ||
    !isLocalOperatingLoopFindingCodeArray(value.findingCodes) ||
    !isLocalOperatingLoopSha256(value.recommendationFingerprint)
  ) {
    return false;
  }

  const expected = await buildLocalOperatingLoopIntegrityEvidence({
    input: value.input,
    actor: value.actor,
    motionFingerprint: expectedMotionFingerprint,
    contentHasher,
  });
  if (
    value.recommendation !== expected.recommendation ||
    !hasExactArrayValues(value.findingCodes, expected.findingCodes) ||
    value.recommendationFingerprint !== expected.recommendationFingerprint
  ) {
    return false;
  }

  const artifactMaterial = buildLocalOperatingLoopArtifactIntegrityMaterial({
    input: value.input,
    actor: value.actor,
    decision: expectedDecision,
    recommendation: expected.recommendation,
    findingCodes: expected.findingCodes,
    motionFingerprint: expectedMotionFingerprint,
    candidatePacketHash: expected.candidatePacketHash,
  });
  const expectedArtifactId = `local-shadow-decision-${(
    await contentHasher(
      LOCAL_OPERATING_LOOP_ARTIFACT_HASH_DOMAIN,
      artifactMaterial,
    )
  ).slice(0, 24)}`;

  const artifact = value.artifact;
  if (
    !isSafeLocalOperatingLoopArtifact(artifact, {
      input: value.input,
      actor: value.actor,
      motionFingerprint: expectedMotionFingerprint,
      recommendation: expected.recommendation,
      findingCodes: expected.findingCodes,
      decision: expectedDecision,
      candidatePacketHash: expected.candidatePacketHash,
      artifactId: expectedArtifactId,
    })
  ) {
    return false;
  }

  if (value.state === "ACCEPTED") {
    return (
      expected.recommendation === "GO" &&
      isLocalOperatingLoopSha256(expected.candidatePacketHash) &&
      isSafeLocalOperatingLoopWorkPacket(value.workPacket, {
        input: value.input,
        actor: value.actor,
        motionFingerprint: expectedMotionFingerprint,
        candidatePacketHash: expected.candidatePacketHash,
      })
    );
  }

  return value.workPacket === null;
}

function parseLocalOperatingLoopExpectedRequest(
  expectation: LocalOperatingLoopClientResponseExpectation,
): LocalOperatingLoopAction | null {
  if (
    !isRecord(expectation.request) ||
    !Object.prototype.hasOwnProperty.call(expectation.request, "input")
  ) {
    return null;
  }
  let rawProjectionKey: string;
  try {
    rawProjectionKey = canonicalizeLocalOperatingLoopValue(
      expectation.request.input,
    );
  } catch {
    return null;
  }
  if (
    expectation.requestProjectionKey !== rawProjectionKey ||
    expectation.currentProjectionKey !== rawProjectionKey
  ) {
    return null;
  }
  const parsed = parseLocalOperatingLoopAction(expectation.request);
  return parsed.ok ? parsed.value : null;
}

function matchesLocalOperatingLoopRequestedTransition(
  request: LocalOperatingLoopAction,
  response: Record<string, unknown>,
): boolean {
  if (request.action === "VALIDATE") {
    return response.state === "VALIDATED";
  }
  if (request.action === "DELIBERATE") {
    return response.state === "AWAITING_DECISION";
  }
  const expectedState =
    request.decision === "ACCEPT"
      ? "ACCEPTED"
      : request.decision === "HOLD"
        ? "HELD"
        : "REJECTED";
  return (
    response.state === expectedState &&
    response.decision === request.decision
  );
}

async function buildLocalOperatingLoopIntegrityEvidence(input: {
  input: LocalOperatingLoopInput;
  actor: string;
  motionFingerprint: string;
  contentHasher: LocalOperatingLoopContentHasher;
}) {
  const { recommendation, findingCodes } =
    deriveLocalOperatingLoopRecommendation(input.input);
  const recommendationFingerprint = await input.contentHasher(
    LOCAL_OPERATING_LOOP_RECOMMENDATION_HASH_DOMAIN,
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
    ? await input.contentHasher(
        LOCAL_OPERATING_LOOP_CANDIDATE_PACKET_HASH_DOMAIN,
        packetMaterial,
      )
    : null;
  return {
    recommendation,
    findingCodes,
    recommendationFingerprint,
    candidatePacketHash,
  };
}

function buildLocalOperatingLoopArtifactIntegrityMaterial(input: {
  input: LocalOperatingLoopInput;
  actor: string;
  decision: LocalOperatingLoopDecision;
  recommendation: LocalOperatingLoopRecommendation;
  findingCodes: LocalOperatingLoopFindingCode[];
  motionFingerprint: string;
  candidatePacketHash: string | null;
}) {
  return {
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
}

export async function hashLocalOperatingLoopCanonicalValue(
  domain: string,
  value: unknown,
): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error("Browser SHA-256 is unavailable.");
  }
  const encoded = new TextEncoder().encode(
    `${domain}\0${canonicalizeLocalOperatingLoopValue(value)}`,
  );
  const digest = await subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function isSafeLocalOperatingLoopInput(
  value: unknown,
): value is LocalOperatingLoopInput {
  const parsed = parseLocalOperatingLoopAction({
    action: "VALIDATE",
    input: value,
  });
  return (
    parsed.ok &&
    canonicalizeLocalOperatingLoopValue(parsed.value.input) ===
      canonicalizeLocalOperatingLoopValue(value)
  );
}

function isSafeLocalOperatingLoopWorkPacket(
  value: unknown,
  expected: {
    input: LocalOperatingLoopInput;
    actor: string;
    motionFingerprint: string;
    candidatePacketHash: string;
  },
): value is LocalOperatingLoopWorkPacket {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      "base_sha",
      "decision_scope",
      "evidence_pointers",
      "execution_authority_granted",
      "motion_fingerprint",
      "motion_id",
      "non_authorizations",
      "packet_id",
      "packet_version",
      "proposed_by",
      "status",
      "summary",
      "target_repo",
      "target_threads",
      "title",
    ])
  ) {
    return false;
  }
  return (
    value.packet_id ===
      `local-shadow-work-packet-${expected.candidatePacketHash.slice(0, 24)}` &&
    isLocalOperatingLoopPacketId(value.packet_id) &&
    value.packet_version === "local-shadow-work-packet.v1" &&
    value.status === "PROPOSED_ONLY" &&
    value.base_sha === LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA &&
    value.motion_id === expected.input.motionId &&
    value.motion_fingerprint === expected.motionFingerprint &&
    value.title === expected.input.title &&
    value.summary === expected.input.summary &&
    value.target_repo === expected.input.targetRepo &&
    isLocalOperatingLoopTargetThreadArray(value.target_threads) &&
    hasExactArrayValues(value.target_threads, expected.input.targetThreads) &&
    isSafeLocalOperatingLoopTextArray(value.evidence_pointers, 20, 500) &&
    hasExactArrayValues(
      value.evidence_pointers,
      expected.input.evidencePointers,
    ) &&
    value.proposed_by === expected.actor &&
    value.decision_scope === "GENERATE_WORK_PACKET_ONLY" &&
    value.execution_authority_granted === false &&
    hasExactNonAuthorizations(value.non_authorizations)
  );
}

function isSafeLocalOperatingLoopArtifact(
  value: unknown,
  expected: {
    input: LocalOperatingLoopInput;
    actor: string;
    motionFingerprint: string;
    recommendation: LocalOperatingLoopRecommendation;
    findingCodes: LocalOperatingLoopFindingCode[];
    decision: LocalOperatingLoopDecision;
    candidatePacketHash: string | null;
    artifactId: string;
  },
): value is LocalOperatingLoopArtifact {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      "actor",
      "artifact_id",
      "artifact_version",
      "base_sha",
      "candidate_packet_hash",
      "decision",
      "decision_scope",
      "execution_authority_granted",
      "finding_codes",
      "motion_fingerprint",
      "motion_id",
      "not_a_control_thread_acceptance_receipt",
      "persistence",
      "program_effect",
      "receipt_authority",
      "recommendation",
    ])
  ) {
    return false;
  }
  return (
    value.artifact_id === expected.artifactId &&
    isLocalOperatingLoopArtifactId(value.artifact_id) &&
    value.artifact_version === "local-shadow-decision-artifact.v1" &&
    value.base_sha === LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA &&
    value.motion_id === expected.input.motionId &&
    value.motion_fingerprint === expected.motionFingerprint &&
    value.recommendation === expected.recommendation &&
    isLocalOperatingLoopFindingCodeArray(value.finding_codes) &&
    hasExactArrayValues(value.finding_codes, expected.findingCodes) &&
    value.decision === expected.decision &&
    value.actor === expected.actor &&
    value.candidate_packet_hash === expected.candidatePacketHash &&
    value.receipt_authority === "DEMONSTRATION_ONLY" &&
    value.persistence === "NONE" &&
    value.program_effect === "NONE" &&
    value.not_a_control_thread_acceptance_receipt === true &&
    value.decision_scope === "GENERATE_WORK_PACKET_ONLY" &&
    value.execution_authority_granted === false
  );
}

function isLocalOperatingLoopIssueArray(
  value: unknown,
): value is Array<{ path: string; code: string }> {
  return (
    Array.isArray(value) &&
    value.every(
      (issue) =>
        isRecord(issue) &&
        hasExactKeys(issue, ["code", "path"]) &&
        typeof issue.path === "string" &&
        typeof issue.code === "string",
    )
  );
}

function isLocalOperatingLoopRecommendation(
  value: unknown,
): value is LocalOperatingLoopRecommendation {
  return (
    typeof value === "string" &&
    ["GO", "NEEDS_REVISION", "BLOCKED"].includes(value)
  );
}

function isLocalOperatingLoopFindingCodeArray(
  value: unknown,
): value is LocalOperatingLoopFindingCode[] {
  const allowed = new Set<LocalOperatingLoopFindingCode>([
    "TARGET_REPO_OUT_OF_SCOPE",
    "CONTROL_THREAD_REQUIRED",
    "TITLE_TOO_SHORT",
    "SUMMARY_TOO_SHORT",
    "EVIDENCE_REQUIRED",
  ]);
  return (
    Array.isArray(value) &&
    new Set(value).size === value.length &&
    value.every(
      (finding): finding is LocalOperatingLoopFindingCode =>
        typeof finding === "string" &&
        allowed.has(finding as LocalOperatingLoopFindingCode),
    )
  );
}

function isLocalOperatingLoopTargetThreadArray(
  value: unknown,
): value is LocalOperatingLoopTargetThread[] {
  const allowed = new Set<string>(LOCAL_OPERATING_LOOP_TARGET_THREADS);
  return (
    Array.isArray(value) &&
    value.length >= 1 &&
    value.length <= 6 &&
    new Set(value).size === value.length &&
    value.every((thread) => typeof thread === "string" && allowed.has(thread))
  );
}

function isLocalOperatingLoopTerminalState(
  value: unknown,
): value is "ACCEPTED" | "HELD" | "REJECTED" {
  return (
    typeof value === "string" &&
    ["ACCEPTED", "HELD", "REJECTED"].includes(value)
  );
}

function isSafeLocalOperatingLoopText(
  value: unknown,
  maximum: number,
): value is string {
  return (
    typeof value === "string" &&
    characterLength(value) > 0 &&
    characterLength(value) <= maximum &&
    normalizeLocalOperatingLoopString(value) === value
  );
}

function isSafeLocalOperatingLoopTextArray(
  value: unknown,
  maximumItems: number,
  maximumLength: number,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maximumItems &&
    new Set(value).size === value.length &&
    value.every((item) =>
      isSafeLocalOperatingLoopText(item, maximumLength),
    )
  );
}

function isLocalOperatingLoopSha256(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[a-f0-9]{64}$/.test(value)
  );
}

function isLocalOperatingLoopValidationProof(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^local-loop\.validation\.v1\.[a-f0-9]{64}$/.test(value)
  );
}

function isLocalOperatingLoopDeliberationProof(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^local-loop\.deliberation\.v1\.[a-f0-9]{64}$/.test(value)
  );
}

function isLocalOperatingLoopPacketId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^local-shadow-work-packet-[a-f0-9]{24}$/.test(value)
  );
}

function isLocalOperatingLoopArtifactId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^local-shadow-decision-[a-f0-9]{24}$/.test(value)
  );
}

function hasExactArrayValues(
  value: readonly unknown[],
  expected: readonly unknown[],
): boolean {
  return (
    value.length === expected.length &&
    value.every((item, index) => item === expected[index])
  );
}

function hasExactNonAuthorizations(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length === LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS.length &&
    value.every(
      (item, index) => item === LOCAL_OPERATING_LOOP_NON_AUTHORIZATIONS[index],
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expected: string[],
): boolean {
  return (
    Object.keys(value).sort().join("\n") ===
    [...expected].sort().join("\n")
  );
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowed: string[],
): boolean {
  const allowedKeys = new Set(allowed);
  return Object.keys(value).every((key) => allowedKeys.has(key));
}

function normalizedTextSchema(input: {
  min: number;
  max: number;
  singleLine?: boolean;
}) {
  return z
    .string()
    .transform(normalizeLocalOperatingLoopString)
    .superRefine((value, context) => {
      const length = characterLength(value);
      if (length < input.min) {
        context.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: input.min,
          type: "string",
          inclusive: true,
        });
      }
      if (length > input.max) {
        context.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: input.max,
          type: "string",
          inclusive: true,
        });
      }
      if (input.singleLine && value.includes("\n")) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Expected a single normalized line.",
        });
      }
    });
}

function rejectDuplicates(
  values: string[],
  context: z.RefinementCtx,
): void {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index],
        message: "Duplicate normalized value.",
      });
    }
    seen.add(value);
  });
}

function characterLength(value: string): number {
  return [...value].length;
}

function sortCanonicalValue(value: unknown): unknown {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Canonical values require finite numbers.");
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortCanonicalValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) =>
          left < right ? -1 : left > right ? 1 : 0,
        )
        .map(([key, nestedValue]) => [
          key,
          sortCanonicalValue(nestedValue),
        ]),
    );
  }
  throw new TypeError("Unsupported canonical value.");
}

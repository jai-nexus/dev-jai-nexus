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

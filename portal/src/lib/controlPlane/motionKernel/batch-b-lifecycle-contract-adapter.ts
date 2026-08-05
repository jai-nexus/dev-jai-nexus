import { types } from "node:util";

import {
  LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
  createLocalOperatingLoopBoundaryReceipt,
  type LocalOperatingLoopBoundaryReceipt,
  type LocalOperatingLoopTerminalPresentation,
} from "./local-operating-loop";

export const BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION =
  "d9-batch-b-lifecycle-contract-adapter/v1" as const;

export const BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS = Object.freeze([
  "INVALID_INPUT",
  "CONTRACT_VERSION_MISMATCH",
  "LOCAL_TERMINAL_INCOHERENT",
  "BOUNDARY_RECEIPT_INCOHERENT",
  "ADAPTED",
] as const);

export type BatchBLifecycleContractAdapterResultKind =
  (typeof BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS)[number];

export type BatchBLifecycleContractAdapterInput = {
  contractVersion: string;
  terminalPresentation: LocalOperatingLoopTerminalPresentation;
  boundaryReceipt: LocalOperatingLoopBoundaryReceipt;
};

type AdaptedTerminalState =
  LocalOperatingLoopTerminalPresentation["terminalState"];
type AdaptedDecision = LocalOperatingLoopTerminalPresentation["decision"];
type AdaptedRecommendation =
  LocalOperatingLoopTerminalPresentation["recommendation"];

type BatchBLifecycleContractAdapterResultBase = {
  readonly kind: BatchBLifecycleContractAdapterResultKind;
  readonly adapterVersion: typeof BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION;
  readonly localContractVersion:
    | typeof LOCAL_OPERATING_LOOP_CONTRACT_VERSION
    | string
    | null;
  readonly terminalState: AdaptedTerminalState | null;
  readonly decision: AdaptedDecision | null;
  readonly recommendation: AdaptedRecommendation | null;
  readonly workPacketCount: 0 | 1 | null;
  readonly workPacketVersion: "local-shadow-work-packet.v1" | null;
  readonly workPacketStatus: "PROPOSED_ONLY" | null;
  readonly workPacketDecisionScope: "GENERATE_WORK_PACKET_ONLY" | null;
  readonly workPacketExecutionAuthority: false | null;
  readonly workPacketClassification: "B9-NR-002 / NON_RECEIPT" | null;
  readonly boundaryReceiptClassification:
    | "B9-CLASS-014 / DEMONSTRATION_RECEIPT"
    | null;
  readonly uiOutputClassification: "B9-NR-009 / NON_RECEIPT" | null;
  readonly b9InvalidClaimId: "B9-INV-011" | null;
  readonly b9InvalidClaim:
    | "Local-shadow ACCEPTED is governance acceptance"
    | null;
  readonly b9InvalidClaimResponse: "INVALID / FAIL_CLOSED" | null;
  readonly governanceAcceptanceEstablished: false;
  readonly canonicalReceiptIssuance: "NOT_ISSUED";
  readonly receiptIntegrity: "UNVERIFIED";
  readonly receiptAuthenticity: "NOT_ESTABLISHED";
  readonly b1LifecycleEffect: "NONE";
  readonly authorityEffect: "NONE";
  readonly mutationAuthorized: false;
  readonly mutationPerformed: false;
};

export type BatchBLifecycleContractAdapterResult =
  | (BatchBLifecycleContractAdapterResultBase & {
      readonly kind:
        | "INVALID_INPUT"
        | "CONTRACT_VERSION_MISMATCH"
        | "LOCAL_TERMINAL_INCOHERENT"
        | "BOUNDARY_RECEIPT_INCOHERENT";
      readonly terminalState: null;
      readonly decision: null;
      readonly recommendation: null;
      readonly workPacketCount: null;
      readonly workPacketVersion: null;
      readonly workPacketStatus: null;
      readonly workPacketDecisionScope: null;
      readonly workPacketExecutionAuthority: null;
      readonly workPacketClassification: null;
      readonly boundaryReceiptClassification: null;
      readonly uiOutputClassification: null;
      readonly b9InvalidClaimId: null;
      readonly b9InvalidClaim: null;
      readonly b9InvalidClaimResponse: null;
    })
  | (BatchBLifecycleContractAdapterResultBase & {
      readonly kind: "ADAPTED";
      readonly localContractVersion: typeof LOCAL_OPERATING_LOOP_CONTRACT_VERSION;
      readonly terminalState: AdaptedTerminalState;
      readonly decision: AdaptedDecision;
      readonly recommendation: AdaptedRecommendation;
      readonly workPacketCount: 0 | 1;
      readonly boundaryReceiptClassification: "B9-CLASS-014 / DEMONSTRATION_RECEIPT";
      readonly uiOutputClassification: "B9-NR-009 / NON_RECEIPT";
      readonly b9InvalidClaimId: "B9-INV-011" | null;
      readonly b9InvalidClaim:
        | "Local-shadow ACCEPTED is governance acceptance"
        | null;
      readonly b9InvalidClaimResponse: "INVALID / FAIL_CLOSED" | null;
    });

const INPUT_KEYS = Object.freeze([
  "contractVersion",
  "terminalPresentation",
  "boundaryReceipt",
] as const);

const TERMINAL_PRESENTATION_KEYS = Object.freeze([
  "terminalState",
  "decision",
  "recommendation",
  "findingCount",
  "workPacketCount",
  "workPacketStatus",
  "workPacketExecutionAuthority",
  "artifactCount",
  "receiptAuthority",
  "persistence",
  "programEffect",
  "notAControlThreadAcceptanceReceipt",
  "decisionScope",
  "artifactExecutionAuthority",
] as const);

const BOUNDARY_RECEIPT_KEYS = Object.freeze([
  "heading",
  "receipt_version",
  "evidence_scope",
  "redaction_scope",
  "underlying_transport_redacted",
  "terminal_state",
  "decision",
  "recommendation",
  "finding_count",
  "work_packet_count",
  "work_packet_status",
  "work_packet_content",
  "work_packet_execution_authority",
  "artifact_count",
  "receipt_authority",
  "terminal_response_persistence_claim",
  "program_effect_claim",
  "not_control_thread_acceptance_receipt",
  "decision_scope",
  "artifact_execution_authority",
  "server_hmac_authenticity",
  "transport_redaction",
  "external_persistence_effect",
  "provider_effect",
  "github_effect",
  "linear_effect",
  "agent_council_effect",
  "customer_effect",
  "execution_effect",
  "deployment_effect",
  "export_method",
  "clipboard_write_status",
  "clipboard_retention",
  "copy_control_network_dispatch",
  "copy_control_application_persistence",
  "copy_control_file_download",
  "verification_scope",
  "receipt_authenticity",
  "authority_granted",
] as const satisfies ReadonlyArray<keyof LocalOperatingLoopBoundaryReceipt>);

const TERMINAL_NUMBER_KEYS = new Set<string>([
  "findingCount",
  "workPacketCount",
  "artifactCount",
]);
const TERMINAL_BOOLEAN_KEYS = new Set<string>([
  "workPacketExecutionAuthority",
  "notAControlThreadAcceptanceReceipt",
  "artifactExecutionAuthority",
]);
const RECEIPT_NUMBER_KEYS = new Set<string>([
  "finding_count",
  "work_packet_count",
  "artifact_count",
]);
const RECEIPT_BOOLEAN_KEYS = new Set<string>([
  "underlying_transport_redacted",
  "work_packet_execution_authority",
  "not_control_thread_acceptance_receipt",
  "artifact_execution_authority",
  "authority_granted",
]);

type SafeAdapterInput = {
  contractVersion: string;
  terminalPresentation: LocalOperatingLoopTerminalPresentation;
  boundaryReceipt: LocalOperatingLoopBoundaryReceipt;
};

function readExactPlainDataRecord(
  value: unknown,
  keys: readonly string[],
): Record<string, unknown> | null {
  if (
    typeof value !== "object" ||
    value === null ||
    types.isProxy(value) ||
    Array.isArray(value)
  ) {
    return null;
  }

  try {
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      return null;
    }
    const ownKeys = Reflect.ownKeys(value);
    if (
      ownKeys.length !== keys.length ||
      ownKeys.some(
        (key) => typeof key !== "string" || !keys.includes(key),
      )
    ) {
      return null;
    }

    const snapshot: Record<string, unknown> = Object.create(null);
    for (const key of keys) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (
        descriptor === undefined ||
        descriptor.enumerable !== true ||
        !Object.prototype.hasOwnProperty.call(descriptor, "value") ||
        Object.prototype.hasOwnProperty.call(descriptor, "get") ||
        Object.prototype.hasOwnProperty.call(descriptor, "set")
      ) {
        return null;
      }
      snapshot[key] = descriptor.value;
    }
    return snapshot;
  } catch {
    return null;
  }
}

function hasRequiredPrimitiveTypes(
  record: Record<string, unknown>,
  keys: readonly string[],
  numberKeys: ReadonlySet<string>,
  booleanKeys: ReadonlySet<string>,
): boolean {
  return keys.every((key) => {
    const value = record[key];
    if (numberKeys.has(key)) {
      return (
        typeof value === "number" &&
        Number.isSafeInteger(value) &&
        value >= 0
      );
    }
    if (booleanKeys.has(key)) {
      return typeof value === "boolean";
    }
    return typeof value === "string";
  });
}

function parseAdapterInput(value: unknown): SafeAdapterInput | null {
  const input = readExactPlainDataRecord(value, INPUT_KEYS);
  if (!input || typeof input.contractVersion !== "string") {
    return null;
  }

  const terminalPresentation = readExactPlainDataRecord(
    input.terminalPresentation,
    TERMINAL_PRESENTATION_KEYS,
  );
  const boundaryReceipt = readExactPlainDataRecord(
    input.boundaryReceipt,
    BOUNDARY_RECEIPT_KEYS,
  );
  if (
    !terminalPresentation ||
    !boundaryReceipt ||
    !hasRequiredPrimitiveTypes(
      terminalPresentation,
      TERMINAL_PRESENTATION_KEYS,
      TERMINAL_NUMBER_KEYS,
      TERMINAL_BOOLEAN_KEYS,
    ) ||
    !hasRequiredPrimitiveTypes(
      boundaryReceipt,
      BOUNDARY_RECEIPT_KEYS,
      RECEIPT_NUMBER_KEYS,
      RECEIPT_BOOLEAN_KEYS,
    )
  ) {
    return null;
  }

  return {
    contractVersion: input.contractVersion,
    terminalPresentation:
      terminalPresentation as LocalOperatingLoopTerminalPresentation,
    boundaryReceipt: boundaryReceipt as LocalOperatingLoopBoundaryReceipt,
  };
}

function createFailureResult(
  kind: Exclude<BatchBLifecycleContractAdapterResultKind, "ADAPTED">,
  localContractVersion: string | null,
): BatchBLifecycleContractAdapterResult {
  return Object.freeze({
    kind,
    adapterVersion: BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION,
    localContractVersion,
    terminalState: null,
    decision: null,
    recommendation: null,
    workPacketCount: null,
    workPacketVersion: null,
    workPacketStatus: null,
    workPacketDecisionScope: null,
    workPacketExecutionAuthority: null,
    workPacketClassification: null,
    boundaryReceiptClassification: null,
    uiOutputClassification: null,
    b9InvalidClaimId: null,
    b9InvalidClaim: null,
    b9InvalidClaimResponse: null,
    governanceAcceptanceEstablished: false,
    canonicalReceiptIssuance: "NOT_ISSUED",
    receiptIntegrity: "UNVERIFIED",
    receiptAuthenticity: "NOT_ESTABLISHED",
    b1LifecycleEffect: "NONE",
    authorityEffect: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
  });
}

function boundaryReceiptMatches(
  actual: LocalOperatingLoopBoundaryReceipt,
  expected: LocalOperatingLoopBoundaryReceipt,
): boolean {
  return BOUNDARY_RECEIPT_KEYS.every((key) =>
    Object.is(actual[key], expected[key]),
  );
}

export function adaptLocalShadowTerminalToBatchBContract(
  input: unknown,
): BatchBLifecycleContractAdapterResult {
  const parsed = parseAdapterInput(input);
  if (!parsed) {
    return createFailureResult("INVALID_INPUT", null);
  }

  if (parsed.contractVersion !== LOCAL_OPERATING_LOOP_CONTRACT_VERSION) {
    return createFailureResult(
      "CONTRACT_VERSION_MISMATCH",
      parsed.contractVersion,
    );
  }

  const expectedReceipt = createLocalOperatingLoopBoundaryReceipt(
    parsed.terminalPresentation,
  );
  if (!expectedReceipt) {
    return createFailureResult(
      "LOCAL_TERMINAL_INCOHERENT",
      LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    );
  }

  if (!boundaryReceiptMatches(parsed.boundaryReceipt, expectedReceipt)) {
    return createFailureResult(
      "BOUNDARY_RECEIPT_INCOHERENT",
      LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    );
  }

  const hasWorkPacket = parsed.terminalPresentation.terminalState === "ACCEPTED";
  return Object.freeze({
    kind: "ADAPTED",
    adapterVersion: BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION,
    localContractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    terminalState: parsed.terminalPresentation.terminalState,
    decision: parsed.terminalPresentation.decision,
    recommendation: parsed.terminalPresentation.recommendation,
    workPacketCount: hasWorkPacket ? 1 : 0,
    workPacketVersion: hasWorkPacket
      ? "local-shadow-work-packet.v1"
      : null,
    workPacketStatus: hasWorkPacket ? "PROPOSED_ONLY" : null,
    workPacketDecisionScope: hasWorkPacket
      ? "GENERATE_WORK_PACKET_ONLY"
      : null,
    workPacketExecutionAuthority: hasWorkPacket ? false : null,
    workPacketClassification: hasWorkPacket
      ? "B9-NR-002 / NON_RECEIPT"
      : null,
    boundaryReceiptClassification:
      "B9-CLASS-014 / DEMONSTRATION_RECEIPT",
    uiOutputClassification: "B9-NR-009 / NON_RECEIPT",
    b9InvalidClaimId: hasWorkPacket ? "B9-INV-011" : null,
    b9InvalidClaim: hasWorkPacket
      ? "Local-shadow ACCEPTED is governance acceptance"
      : null,
    b9InvalidClaimResponse: hasWorkPacket
      ? "INVALID / FAIL_CLOSED"
      : null,
    governanceAcceptanceEstablished: false,
    canonicalReceiptIssuance: "NOT_ISSUED",
    receiptIntegrity: "UNVERIFIED",
    receiptAuthenticity: "NOT_ESTABLISHED",
    b1LifecycleEffect: "NONE",
    authorityEffect: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
  });
}

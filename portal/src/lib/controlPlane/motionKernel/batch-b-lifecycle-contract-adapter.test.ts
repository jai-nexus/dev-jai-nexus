import assert from "node:assert/strict";

import {
  BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS,
  BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION,
  adaptLocalShadowTerminalToBatchBContract,
  type BatchBLifecycleContractAdapterInput,
  type BatchBLifecycleContractAdapterResult,
} from "./batch-b-lifecycle-contract-adapter";
import {
  LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
  createLocalOperatingLoopBoundaryReceipt,
  type LocalOperatingLoopBoundaryReceipt,
  type LocalOperatingLoopTerminalPresentation,
} from "./local-operating-loop";

const RESULT_KEYS = [
  "kind",
  "adapterVersion",
  "localContractVersion",
  "terminalState",
  "decision",
  "recommendation",
  "workPacketCount",
  "workPacketVersion",
  "workPacketStatus",
  "workPacketDecisionScope",
  "workPacketExecutionAuthority",
  "workPacketClassification",
  "boundaryReceiptClassification",
  "uiOutputClassification",
  "b9InvalidClaimId",
  "b9InvalidClaim",
  "b9InvalidClaimResponse",
  "governanceAcceptanceEstablished",
  "canonicalReceiptIssuance",
  "receiptIntegrity",
  "receiptAuthenticity",
  "b1LifecycleEffect",
  "authorityEffect",
  "mutationAuthorized",
  "mutationPerformed",
] as const;

function terminalPresentation(
  terminalState: "ACCEPTED" | "HELD" | "REJECTED",
  recommendation: LocalOperatingLoopTerminalPresentation["recommendation"] =
    terminalState === "ACCEPTED"
      ? "GO"
      : terminalState === "HELD"
        ? "NEEDS_REVISION"
        : "BLOCKED",
): LocalOperatingLoopTerminalPresentation {
  const accepted = terminalState === "ACCEPTED";
  return {
    terminalState,
    decision:
      terminalState === "ACCEPTED"
        ? "ACCEPT"
        : terminalState === "HELD"
          ? "HOLD"
          : "REJECT",
    recommendation,
    findingCount: recommendation === "GO" ? 0 : 1,
    workPacketCount: accepted ? 1 : 0,
    workPacketStatus: accepted ? "PROPOSED_ONLY" : "NONE",
    workPacketExecutionAuthority: false,
    artifactCount: 1,
    receiptAuthority: "DEMONSTRATION_ONLY",
    persistence: "NONE",
    programEffect: "NONE",
    notAControlThreadAcceptanceReceipt: true,
    decisionScope: "GENERATE_WORK_PACKET_ONLY",
    artifactExecutionAuthority: false,
  };
}

function inputFor(
  terminalState: "ACCEPTED" | "HELD" | "REJECTED" = "ACCEPTED",
  recommendation?: LocalOperatingLoopTerminalPresentation["recommendation"],
): BatchBLifecycleContractAdapterInput {
  const presentation = terminalPresentation(terminalState, recommendation);
  const receipt = createLocalOperatingLoopBoundaryReceipt(presentation);
  assert.ok(receipt);
  return {
    contractVersion: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    terminalPresentation: presentation,
    boundaryReceipt: receipt,
  };
}

function literalCompatibilityInput(): BatchBLifecycleContractAdapterInput {
  return {
    contractVersion: "jai-local-operating-loop.v1",
    terminalPresentation: {
      terminalState: "ACCEPTED",
      decision: "ACCEPT",
      recommendation: "GO",
      findingCount: 0,
      workPacketCount: 1,
      workPacketStatus: "PROPOSED_ONLY",
      workPacketExecutionAuthority: false,
      artifactCount: 1,
      receiptAuthority: "DEMONSTRATION_ONLY",
      persistence: "NONE",
      programEffect: "NONE",
      notAControlThreadAcceptanceReceipt: true,
      decisionScope: "GENERATE_WORK_PACKET_ONLY",
      artifactExecutionAuthority: false,
    },
    boundaryReceipt: {
      heading: "JAI NEXUS — LOCAL-SHADOW BOUNDARY RECEIPT",
      receipt_version: "founder-readable-local-shadow-boundary-receipt.v1",
      evidence_scope: "FOUNDER_VISIBLE_REDACTED_TERMINAL_ONLY",
      redaction_scope: "EXPORT_PAYLOAD_ONLY",
      underlying_transport_redacted: false,
      terminal_state: "ACCEPTED",
      decision: "ACCEPT",
      recommendation: "GO",
      finding_count: 0,
      work_packet_count: 1,
      work_packet_status: "PROPOSED_ONLY",
      work_packet_content: "REDACTED_NOT_EXPORTED",
      work_packet_execution_authority: false,
      artifact_count: 1,
      receipt_authority: "DEMONSTRATION_ONLY",
      terminal_response_persistence_claim: "NONE",
      program_effect_claim: "NONE",
      not_control_thread_acceptance_receipt: true,
      decision_scope: "GENERATE_WORK_PACKET_ONLY",
      artifact_execution_authority: false,
      server_hmac_authenticity: "NOT_BROWSER_VERIFIED",
      transport_redaction: "NOT_CLAIMED",
      external_persistence_effect: "UNVERIFIED",
      provider_effect: "UNVERIFIED",
      github_effect: "UNVERIFIED",
      linear_effect: "UNVERIFIED",
      agent_council_effect: "UNVERIFIED",
      customer_effect: "UNVERIFIED",
      execution_effect: "UNVERIFIED",
      deployment_effect: "UNVERIFIED",
      export_method: "USER_INITIATED_LOCAL_CLIPBOARD",
      clipboard_write_status: "NOT_INCLUDED_IN_EXPORTED_RECEIPT",
      clipboard_retention: "OUTSIDE_APPLICATION_CONTROL",
      copy_control_network_dispatch: "STATICALLY_EXCLUDED",
      copy_control_application_persistence: "STATICALLY_EXCLUDED",
      copy_control_file_download: "STATICALLY_EXCLUDED",
      verification_scope:
        "CLIENT_COHERENCE_AND_STATIC_COPY_CONTROL_ISOLATION_ONLY",
      receipt_authenticity: "NOT_PROVIDED",
      authority_granted: false,
    },
  };
}

function mutableRecord(value: object): Record<PropertyKey, unknown> {
  return value as Record<PropertyKey, unknown>;
}

function assertCommonResultContract(
  result: BatchBLifecycleContractAdapterResult,
): void {
  assert.deepEqual(Reflect.ownKeys(result), RESULT_KEYS);
  assert.equal(result.adapterVersion, BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION);
  assert.equal(result.governanceAcceptanceEstablished, false);
  assert.equal(result.canonicalReceiptIssuance, "NOT_ISSUED");
  assert.equal(result.receiptIntegrity, "UNVERIFIED");
  assert.equal(result.receiptAuthenticity, "NOT_ESTABLISHED");
  assert.equal(result.b1LifecycleEffect, "NONE");
  assert.equal(result.authorityEffect, "NONE");
  assert.equal(result.mutationAuthorized, false);
  assert.equal(result.mutationPerformed, false);
  assert.equal(Object.isFrozen(result), true);
}

function assertFailureNullability(
  result: BatchBLifecycleContractAdapterResult,
): void {
  assert.notEqual(result.kind, "ADAPTED");
  assert.equal(result.terminalState, null);
  assert.equal(result.decision, null);
  assert.equal(result.recommendation, null);
  assert.equal(result.workPacketCount, null);
  assert.equal(result.workPacketVersion, null);
  assert.equal(result.workPacketStatus, null);
  assert.equal(result.workPacketDecisionScope, null);
  assert.equal(result.workPacketExecutionAuthority, null);
  assert.equal(result.workPacketClassification, null);
  assert.equal(result.boundaryReceiptClassification, null);
  assert.equal(result.uiOutputClassification, null);
  assert.equal(result.b9InvalidClaimId, null);
  assert.equal(result.b9InvalidClaim, null);
  assert.equal(result.b9InvalidClaimResponse, null);
}

function testResultVocabularyAndPrecedence(): void {
  assert.equal(
    BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_VERSION,
    "d9-batch-b-lifecycle-contract-adapter/v1",
  );
  assert.equal(
    LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
    "jai-local-operating-loop.v1",
  );
  assert.deepEqual(BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS, [
    "INVALID_INPUT",
    "CONTRACT_VERSION_MISMATCH",
    "LOCAL_TERMINAL_INCOHERENT",
    "BOUNDARY_RECEIPT_INCOHERENT",
    "ADAPTED",
  ]);
  assert.equal(
    Object.isFrozen(BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS),
    true,
  );

  const invalid = adaptLocalShadowTerminalToBatchBContract(null);
  assert.equal(invalid.kind, "INVALID_INPUT");
  assert.equal(invalid.localContractVersion, null);

  const invalidBeforeVersion = inputFor();
  Object.defineProperty(invalidBeforeVersion, "extra", {
    enumerable: true,
    value: "unexpected",
  });
  invalidBeforeVersion.contractVersion = "wrong-version";
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(invalidBeforeVersion).kind,
    "INVALID_INPUT",
  );

  const mismatch = inputFor();
  mismatch.contractVersion = "jai-local-operating-loop.v0";
  mismatch.terminalPresentation.decision = "HOLD";
  mutableRecord(mismatch.boundaryReceipt).authority_granted = true;
  const mismatchResult = adaptLocalShadowTerminalToBatchBContract(mismatch);
  assert.equal(mismatchResult.kind, "CONTRACT_VERSION_MISMATCH");
  assert.equal(mismatchResult.localContractVersion, "jai-local-operating-loop.v0");

  const terminalIncoherent = inputFor();
  terminalIncoherent.terminalPresentation.decision = "HOLD";
  mutableRecord(terminalIncoherent.boundaryReceipt).authority_granted = true;
  const terminalIncoherentResult =
    adaptLocalShadowTerminalToBatchBContract(terminalIncoherent);
  assert.equal(terminalIncoherentResult.kind, "LOCAL_TERMINAL_INCOHERENT");
  assert.equal(
    terminalIncoherentResult.localContractVersion,
    "jai-local-operating-loop.v1",
  );

  const receiptIncoherent = inputFor();
  mutableRecord(receiptIncoherent.boundaryReceipt).authority_granted = true;
  const receiptIncoherentResult =
    adaptLocalShadowTerminalToBatchBContract(receiptIncoherent);
  assert.equal(receiptIncoherentResult.kind, "BOUNDARY_RECEIPT_INCOHERENT");
  assert.equal(
    receiptIncoherentResult.localContractVersion,
    "jai-local-operating-loop.v1",
  );

  const adapted = adaptLocalShadowTerminalToBatchBContract(inputFor());
  assert.equal(adapted.kind, "ADAPTED");
  assert.equal(adapted.localContractVersion, "jai-local-operating-loop.v1");

  for (const result of [
    invalid,
    mismatchResult,
    terminalIncoherentResult,
    receiptIncoherentResult,
    adapted,
  ]) {
    assertCommonResultContract(result);
    if (result.kind !== "ADAPTED") {
      assertFailureNullability(result);
    }
  }
}

function testTerminalMappingsAndAuthorityBoundaries(): void {
  const accepted = adaptLocalShadowTerminalToBatchBContract(
    inputFor("ACCEPTED"),
  );
  assert.equal(accepted.kind, "ADAPTED");
  assert.equal(accepted.terminalState, "ACCEPTED");
  assert.equal(accepted.decision, "ACCEPT");
  assert.equal(accepted.recommendation, "GO");
  assert.equal(accepted.workPacketCount, 1);
  assert.equal(accepted.workPacketVersion, "local-shadow-work-packet.v1");
  assert.equal(accepted.workPacketStatus, "PROPOSED_ONLY");
  assert.equal(accepted.workPacketDecisionScope, "GENERATE_WORK_PACKET_ONLY");
  assert.equal(accepted.workPacketExecutionAuthority, false);
  assert.equal(accepted.workPacketClassification, "B9-NR-002 / NON_RECEIPT");
  assert.equal(accepted.b9InvalidClaimId, "B9-INV-011");
  assert.equal(
    accepted.b9InvalidClaim,
    "Local-shadow ACCEPTED is governance acceptance",
  );
  assert.equal(accepted.b9InvalidClaimResponse, "INVALID / FAIL_CLOSED");

  for (const [terminalState, decision, recommendation] of [
    ["HELD", "HOLD", "NEEDS_REVISION"],
    ["REJECTED", "REJECT", "BLOCKED"],
  ] as const) {
    const result = adaptLocalShadowTerminalToBatchBContract(
      inputFor(terminalState, recommendation),
    );
    assert.equal(result.kind, "ADAPTED");
    assert.equal(result.terminalState, terminalState);
    assert.equal(result.decision, decision);
    assert.equal(result.recommendation, recommendation);
    assert.equal(result.workPacketCount, 0);
    assert.equal(result.workPacketVersion, null);
    assert.equal(result.workPacketStatus, null);
    assert.equal(result.workPacketDecisionScope, null);
    assert.equal(result.workPacketExecutionAuthority, null);
    assert.equal(result.workPacketClassification, null);
    assert.equal(result.b9InvalidClaimId, null);
    assert.equal(result.b9InvalidClaim, null);
    assert.equal(result.b9InvalidClaimResponse, null);
    assertCommonResultContract(result);
  }

  for (const result of [
    accepted,
    adaptLocalShadowTerminalToBatchBContract(inputFor("HELD")),
    adaptLocalShadowTerminalToBatchBContract(inputFor("REJECTED")),
  ]) {
    assert.equal(result.boundaryReceiptClassification, "B9-CLASS-014 / DEMONSTRATION_RECEIPT");
    assert.equal(result.uiOutputClassification, "B9-NR-009 / NON_RECEIPT");
    assert.equal(result.governanceAcceptanceEstablished, false);
    assert.equal(result.canonicalReceiptIssuance, "NOT_ISSUED");
    assert.equal(result.receiptIntegrity, "UNVERIFIED");
    assert.equal(result.receiptAuthenticity, "NOT_ESTABLISHED");
    assert.equal(result.b1LifecycleEffect, "NONE");
    assert.equal(result.authorityEffect, "NONE");
    assert.equal(result.mutationAuthorized, false);
    assert.equal(result.mutationPerformed, false);
  }
}

function testIndependentLiteralCompatibilityOracle(): void {
  const result = adaptLocalShadowTerminalToBatchBContract(
    literalCompatibilityInput(),
  );
  assert.deepEqual(result, {
    kind: "ADAPTED",
    adapterVersion: "d9-batch-b-lifecycle-contract-adapter/v1",
    localContractVersion: "jai-local-operating-loop.v1",
    terminalState: "ACCEPTED",
    decision: "ACCEPT",
    recommendation: "GO",
    workPacketCount: 1,
    workPacketVersion: "local-shadow-work-packet.v1",
    workPacketStatus: "PROPOSED_ONLY",
    workPacketDecisionScope: "GENERATE_WORK_PACKET_ONLY",
    workPacketExecutionAuthority: false,
    workPacketClassification: "B9-NR-002 / NON_RECEIPT",
    boundaryReceiptClassification: "B9-CLASS-014 / DEMONSTRATION_RECEIPT",
    uiOutputClassification: "B9-NR-009 / NON_RECEIPT",
    b9InvalidClaimId: "B9-INV-011",
    b9InvalidClaim: "Local-shadow ACCEPTED is governance acceptance",
    b9InvalidClaimResponse: "INVALID / FAIL_CLOSED",
    governanceAcceptanceEstablished: false,
    canonicalReceiptIssuance: "NOT_ISSUED",
    receiptIntegrity: "UNVERIFIED",
    receiptAuthenticity: "NOT_ESTABLISHED",
    b1LifecycleEffect: "NONE",
    authorityEffect: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
  });
  assertCommonResultContract(result);
}

function testMalformedAndHostileInputs(): void {
  const cyclicArray: unknown[] = [];
  cyclicArray.push(cyclicArray);
  const malformedValues: unknown[] = [
    undefined,
    null,
    true,
    "input",
    1,
    [],
    new Array(3),
    cyclicArray,
    new (class extends Array<unknown> {})(),
    Object.create(null),
    Object.create({ inherited: true }),
  ];
  for (const value of malformedValues) {
    assert.doesNotThrow(() => adaptLocalShadowTerminalToBatchBContract(value));
    assert.equal(
      adaptLocalShadowTerminalToBatchBContract(value).kind,
      "INVALID_INPUT",
    );
  }

  const symbolRoot = inputFor();
  mutableRecord(symbolRoot)[Symbol("extra")] = true;
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(symbolRoot).kind,
    "INVALID_INPUT",
  );

  const hiddenRoot = inputFor();
  Object.defineProperty(hiddenRoot, "hidden", { value: true });
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(hiddenRoot).kind,
    "INVALID_INPUT",
  );

  const hiddenRequired = inputFor();
  Object.defineProperty(hiddenRequired, "contractVersion", {
    enumerable: false,
    value: LOCAL_OPERATING_LOOP_CONTRACT_VERSION,
  });
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(hiddenRequired).kind,
    "INVALID_INPUT",
  );

  let getterReads = 0;
  const accessorRoot = inputFor();
  Object.defineProperty(accessorRoot, "contractVersion", {
    enumerable: true,
    get() {
      getterReads += 1;
      return LOCAL_OPERATING_LOOP_CONTRACT_VERSION;
    },
  });
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(accessorRoot).kind,
    "INVALID_INPUT",
  );
  assert.equal(getterReads, 0);

  const nestedSymbol = inputFor();
  mutableRecord(nestedSymbol.terminalPresentation)[Symbol("extra")] = true;
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(nestedSymbol).kind,
    "INVALID_INPUT",
  );

  const nestedAccessor = inputFor();
  Object.defineProperty(nestedAccessor.boundaryReceipt, "heading", {
    enumerable: true,
    get() {
      getterReads += 1;
      return "not-read";
    },
  });
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(nestedAccessor).kind,
    "INVALID_INPUT",
  );
  assert.equal(getterReads, 0);

  const customNested = inputFor();
  customNested.terminalPresentation = Object.assign(
    Object.create({ custom: true }),
    customNested.terminalPresentation,
  );
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(customNested).kind,
    "INVALID_INPUT",
  );

  const cyclic = inputFor() as unknown as Record<string, unknown>;
  cyclic.terminalPresentation = cyclic;
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(cyclic).kind,
    "INVALID_INPUT",
  );
}

function testProxyRejectionWithoutTrapInvocation(): void {
  const transparent = new Proxy(inputFor(), {});
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(transparent).kind,
    "INVALID_INPUT",
  );

  let trapCalls = 0;
  const trapped = new Proxy(inputFor(), {
    ownKeys() {
      trapCalls += 1;
      throw new Error("ownKeys must not run");
    },
    getOwnPropertyDescriptor() {
      trapCalls += 1;
      throw new Error("descriptor trap must not run");
    },
    getPrototypeOf() {
      trapCalls += 1;
      throw new Error("prototype trap must not run");
    },
  });
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(trapped).kind,
    "INVALID_INPUT",
  );
  assert.equal(trapCalls, 0);

  const revocable = Proxy.revocable(inputFor(), {});
  revocable.revoke();
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(revocable.proxy).kind,
    "INVALID_INPUT",
  );

  const nestedProxy = inputFor();
  nestedProxy.terminalPresentation = new Proxy(
    nestedProxy.terminalPresentation,
    {
      ownKeys() {
        trapCalls += 1;
        throw new Error("nested trap must not run");
      },
    },
  );
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(nestedProxy).kind,
    "INVALID_INPUT",
  );
  assert.equal(trapCalls, 0);
}

type IsolationCase = {
  readonly expectedKind: BatchBLifecycleContractAdapterResult["kind"];
  readonly createInput: () => BatchBLifecycleContractAdapterInput;
};

function descriptorShape(value: object): ReadonlyArray<{
  key: PropertyKey;
  enumerable: boolean;
  configurable: boolean;
  writable: boolean | null;
  dataProperty: boolean;
}> {
  return Reflect.ownKeys(value).map((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    assert.ok(descriptor);
    return {
      key,
      enumerable: descriptor.enumerable ?? false,
      configurable: descriptor.configurable ?? false,
      writable: "writable" in descriptor ? descriptor.writable ?? false : null,
      dataProperty: "value" in descriptor,
    };
  });
}

function isolationCases(): readonly IsolationCase[] {
  return [
    {
      expectedKind: "INVALID_INPUT",
      createInput() {
        const input = inputFor();
        Object.defineProperty(input.terminalPresentation, "unexpected", {
          configurable: true,
          enumerable: true,
          value: "invalid-object-shaped-graph",
          writable: true,
        });
        return input;
      },
    },
    {
      expectedKind: "CONTRACT_VERSION_MISMATCH",
      createInput() {
        const input = inputFor();
        input.contractVersion = "caller-supplied-version-mismatch";
        return input;
      },
    },
    {
      expectedKind: "LOCAL_TERMINAL_INCOHERENT",
      createInput() {
        const input = inputFor();
        input.terminalPresentation.decision = "HOLD";
        return input;
      },
    },
    {
      expectedKind: "BOUNDARY_RECEIPT_INCOHERENT",
      createInput() {
        const input = inputFor();
        mutableRecord(input.boundaryReceipt).authority_granted = true;
        return input;
      },
    },
    {
      expectedKind: "ADAPTED",
      createInput() {
        return inputFor();
      },
    },
  ];
}

function testCallerIsolationAndDeterminismAcrossAllKinds(): void {
  for (const isolationCase of isolationCases()) {
    const input = isolationCase.createInput();
    const terminalReference = input.terminalPresentation;
    const receiptReference = input.boundaryReceipt;
    const contentBefore = structuredClone(input);
    const rootShapeBefore = descriptorShape(input);
    const terminalShapeBefore = descriptorShape(input.terminalPresentation);
    const receiptShapeBefore = descriptorShape(input.boundaryReceipt);

    const first = adaptLocalShadowTerminalToBatchBContract(input);
    const second = adaptLocalShadowTerminalToBatchBContract(input);
    assert.equal(first.kind, isolationCase.expectedKind);
    assert.deepEqual(first, second);
    assert.notEqual(first, second);
    assertCommonResultContract(first);
    assertCommonResultContract(second);

    assert.equal(input.terminalPresentation, terminalReference);
    assert.equal(input.boundaryReceipt, receiptReference);
    assert.deepEqual(input, contentBefore);
    assert.deepEqual(descriptorShape(input), rootShapeBefore);
    assert.deepEqual(
      descriptorShape(input.terminalPresentation),
      terminalShapeBefore,
    );
    assert.deepEqual(descriptorShape(input.boundaryReceipt), receiptShapeBefore);
    assert.equal(Object.isFrozen(input), false);
    assert.equal(Object.isFrozen(input.terminalPresentation), false);
    assert.equal(Object.isFrozen(input.boundaryReceipt), false);
    assert.equal(Object.isExtensible(input), true);
    assert.equal(Object.isExtensible(input.terminalPresentation), true);
    assert.equal(Object.isExtensible(input.boundaryReceipt), true);

    const firstBeforeCallerMutation = structuredClone(first);
    input.contractVersion = `${input.contractVersion}-later-caller-mutation`;
    input.terminalPresentation.recommendation = "BLOCKED";
    mutableRecord(input.boundaryReceipt).recommendation = "BLOCKED";
    assert.deepEqual(first, firstBeforeCallerMutation);

    const frozenInput = isolationCase.createInput();
    const frozenContentBefore = structuredClone(frozenInput);
    const frozenTerminalReference = Object.freeze(
      frozenInput.terminalPresentation,
    );
    const frozenReceiptReference = Object.freeze(frozenInput.boundaryReceipt);
    Object.freeze(frozenInput);
    const frozenResult = adaptLocalShadowTerminalToBatchBContract(frozenInput);
    assert.equal(frozenResult.kind, isolationCase.expectedKind);
    assertCommonResultContract(frozenResult);
    assert.equal(frozenInput.terminalPresentation, frozenTerminalReference);
    assert.equal(frozenInput.boundaryReceipt, frozenReceiptReference);
    assert.deepEqual(frozenInput, frozenContentBefore);
    assert.equal(Object.isFrozen(frozenInput), true);
    assert.equal(Object.isFrozen(frozenInput.terminalPresentation), true);
    assert.equal(Object.isFrozen(frozenInput.boundaryReceipt), true);
    assert.equal(Object.isExtensible(frozenInput), false);
    assert.equal(Object.isExtensible(frozenInput.terminalPresentation), false);
    assert.equal(Object.isExtensible(frozenInput.boundaryReceipt), false);
  }
}

function testReceiptAndTerminalMismatchCoverage(): void {
  const receiptMutations: Array<
    (receipt: LocalOperatingLoopBoundaryReceipt) => void
  > = [
    (receipt) => {
      receipt.terminal_state = "HELD";
    },
    (receipt) => {
      receipt.decision = "HOLD";
    },
    (receipt) => {
      receipt.work_packet_count = 0;
    },
    (receipt) => {
      mutableRecord(receipt).receipt_authenticity = "NOT_BROWSER_VERIFIED";
    },
    (receipt) => {
      mutableRecord(receipt).authority_granted = true;
    },
  ];

  for (const mutate of receiptMutations) {
    const input = inputFor();
    mutate(input.boundaryReceipt);
    assert.equal(
      adaptLocalShadowTerminalToBatchBContract(input).kind,
      "BOUNDARY_RECEIPT_INCOHERENT",
    );
  }

  const unknownTerminal = inputFor();
  mutableRecord(unknownTerminal.terminalPresentation).terminalState = "CLOSED_ACCEPTED";
  assert.equal(
    adaptLocalShadowTerminalToBatchBContract(unknownTerminal).kind,
    "LOCAL_TERMINAL_INCOHERENT",
  );
}

function run(): void {
  testResultVocabularyAndPrecedence();
  testTerminalMappingsAndAuthorityBoundaries();
  testIndependentLiteralCompatibilityOracle();
  testMalformedAndHostileInputs();
  testProxyRejectionWithoutTrapInvocation();
  testCallerIsolationAndDeterminismAcrossAllKinds();
  testReceiptAndTerminalMismatchCoverage();
}

run();

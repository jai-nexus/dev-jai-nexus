import assert from "node:assert/strict";
import { BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS } from "./batch-b-lifecycle-contract-adapter";
import { createLocalOperatingLoopHandler } from "./local-operating-loop-handler";
import {
  classifyLocalOperatingLoopClientResponse,
  createAdaptedBoundaryReceipt,
  createLocalOperatingLoopProjectionKey,
  createLocalOperatingLoopTerminalPresentation,
  D9_PACKET_CLASS,
  D9_RECEIPT_CLASS,
  D9_UI_CLASS,
  LOCAL_SHADOW_BINDING_POSTURE,
  LOCAL_SHADOW_PACKET_VERSION,
  LOCAL_SHADOW_PROGRAM_SNAPSHOT as snapshot,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopResponse,
} from "./local-operating-loop";

const input: LocalOperatingLoopInput = {
  motionId: "private-motion-id",
  title: "Review the documentary projection",
  summary: "Verify deterministic local-shadow decisions for the single projected Program.",
  targetRepo: "dev-jai-nexus",
  targetThreads: ["JAI_CONTROL_THREAD"],
  evidencePointers: ["private-evidence-pointer"],
};
const handler = createLocalOperatingLoopHandler({
  readSecret: () => "local-shadow-test-key",
  authenticate: async () => ({ authenticated: true, role: "ADMIN", email: "private@example.test" }),
});

async function post(action: Record<string, unknown>, programSnapshot: unknown) {
  const response = await handler(new Request("http://local.test/loop", {
    method: "POST",
    body: JSON.stringify({ input, ...action, programSnapshot }),
  }));
  return await response.json() as LocalOperatingLoopResponse;
}

function assertBlocked(result: LocalOperatingLoopResponse, codes: string[]) {
  assert.equal(result.ok, false);
  assert.ok(codes.includes(result.error.code), result.error.code);
  assert.deepEqual(result.workPackets, []);
  for (const key of ["workPacket", "adaptedReceipt", "boundaryReceipt", "artifact"]) {
    assert.ok(!Object.hasOwn(result, key), key);
  }
}

async function validate() {
  const result = await post({ action: "VALIDATE" }, snapshot);
  assert.ok(result.ok && result.state === "VALIDATED");
  return { action: "DELIBERATE", validationProof: result.validationProof };
}

async function deliberate() {
  const result = await post(await validate(), snapshot);
  assert.ok(result.ok && result.state === "AWAITING_DECISION");
  return { action: "DECIDE", deliberationProof: result.deliberationProof };
}

const frozen = "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN";
const active = snapshot.portfolio[0];
const otherPrograms = [
  "jai-five-slot-compounded-reasoning-shadow-kernel-v0",
  "jai-founder-developer-workflow-pilot-v0",
  "jai-agent-council-bounded-activation-pilot-v0",
  "unknown-program",
];
const invalidSnapshots = [
  undefined, null, [], {}, "invalid",
  { ...snapshot, base_sha: "0".repeat(40) },
  { ...snapshot, snapshot_hash: "0".repeat(40) },
  { ...snapshot, snapshot_version: 0 },
  { ...snapshot, active_program_count: 0 },
  { ...snapshot, active_program_count: 2 },
  { ...snapshot, portfolio: [] },
  { ...snapshot, portfolio: [active, { ...active, programId: otherPrograms[0] }] },
  { ...snapshot, portfolio: [{ ...active, lifecycleState: frozen }] },
  { ...snapshot, portfolio: [{ ...active, lifecycleState: "CLOSED_ACCEPTED" }] },
  { ...snapshot, binding_posture: undefined },
  { ...snapshot, binding_posture: "LIVE_AUTHORITATIVE" },
  { ...snapshot, binding_posture: "DB_BOUND" },
  { ...snapshot, authority_granted: true },
  { ...snapshot, governing_motion_id: "motion-0000" },
  { ...snapshot, contract_version: "other-contract" },
  { ...snapshot, unexpected: true },
  ...otherPrograms.map(programId => ({
    ...snapshot, program_lifecycle_id: programId, portfolio: [{ ...active, programId }],
  })),
];
for (const candidate of invalidSnapshots) {
  assertBlocked(await post({ action: "VALIDATE" }, candidate), ["INELIGIBLE", "INVALID_EXPECTED_SNAPSHOT"]);
}

const tampered = [
  { program_lifecycle_id: otherPrograms[0] },
  { snapshot_version: snapshot.snapshot_version + 1 },
  { snapshot_hash: "f".repeat(40) },
  { binding_posture: "LIVE_AUTHORITATIVE" },
];
for (const change of tampered) {
  const candidate = { ...snapshot, ...change };
  assertBlocked(await post(await validate(), candidate), ["INELIGIBLE", "INVALID_EXPECTED_SNAPSHOT"]);
  for (const decision of ["ACCEPT", "HOLD", "REJECT"]) {
    assertBlocked(await post({ ...await deliberate(), decision }, candidate),
      ["INELIGIBLE", "INVALID_EXPECTED_SNAPSHOT"]);
  }
}

const next = await validate();
assertBlocked(await post({ ...next, validationProof: next.validationProof.slice(0, -1) }, snapshot), ["INVALID_PROOF"]);
const attempts = await Promise.all([post(next, snapshot), post(next, snapshot)]);
assert.equal(attempts.filter(result => result.ok).length, 1);
assertBlocked(attempts.find(result => !result.ok)!, ["INVALID_PROOF"]);

for (const decision of ["ACCEPT", "HOLD", "REJECT"] as const) {
  const request = { ...await deliberate(), decision, input, programSnapshot: snapshot };
  const terminal = await post(request, snapshot);
  assert.ok(terminal.ok && "adaptedReceipt" in terminal);
  assertBlocked(await post(request, snapshot), ["INVALID_PROOF"]);
  const presentation = createLocalOperatingLoopTerminalPresentation(terminal);
  assert.ok(presentation);
  const { adaptedReceipt } = terminal;
  const accepted = decision === "ACCEPT";
  assert.equal(presentation.workPacketCount, accepted ? 1 : 0);
  assert.equal(adaptedReceipt.binding_posture, LOCAL_SHADOW_BINDING_POSTURE);
  assert.equal(adaptedReceipt.authority_granted, false);
  assert.equal(adaptedReceipt.boundary_receipt_classification, D9_RECEIPT_CLASS);
  assert.equal(adaptedReceipt.ui_output_classification, D9_UI_CLASS);
  assert.equal(adaptedReceipt.work_packet_classification, accepted ? D9_PACKET_CLASS : null);
  assert.equal(adaptedReceipt.packet_version, accepted ? LOCAL_SHADOW_PACKET_VERSION : null);

  let getterReads = 0;
  const unsafeFields = Object.defineProperty({ ...adaptedReceipt }, "binding_posture", {
    enumerable: true,
    get() { getterReads++; return input.title; },
  });
  assert.equal(createAdaptedBoundaryReceipt(presentation, unsafeFields), null);
  assert.equal(getterReads, 0);
  const key = createLocalOperatingLoopProjectionKey(input);
  const expectation = { request, requestProjectionKey: key, currentProjectionKey: key };
  for (const kind of BATCH_B_LIFECYCLE_CONTRACT_ADAPTER_RESULT_KINDS) {
    const fields = { ...adaptedReceipt, kind };
    const classified = await classifyLocalOperatingLoopClientResponse(
      { ...terminal, adaptedReceipt: fields }, expectation);
    const exported = createAdaptedBoundaryReceipt(presentation, fields);
    if (kind !== "ADAPTED") {
      assert.equal(classified.kind, "RECOVERY");
      assert.equal(exported, null);
      continue;
    }
    assert.equal(classified.kind, "SUCCESS");
    assert.ok(exported);
    for (const value of [D9_RECEIPT_CLASS, D9_UI_CLASS, LOCAL_SHADOW_BINDING_POSTURE,
      "authority_granted: false", ...(accepted ? [D9_PACKET_CLASS, LOCAL_SHADOW_PACKET_VERSION] : [])]) {
      assert.ok(exported.text.includes(value), value);
    }
    for (const privateValue of [input.motionId, input.title, input.evidencePointers[0],
      terminal.actor, terminal.motionFingerprint, request.deliberationProof, snapshot.snapshot_hash]) {
      assert.ok(!exported.text.includes(privateValue));
    }
    assert.equal(exported.text.includes("\r"), false);
  }
}
console.log("PASS local-shadow Program guard, single-use proofs and adapted receipt export");

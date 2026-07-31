import assert from "node:assert/strict";

import {
  PROGRAM_TRANSITION_RECEIPT_CLASS,
  PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION,
  deriveProgramTransitionCommandId,
  deriveProgramTransitionReceiptId,
  fingerprintProgramTransitionCommand,
  hashProgramTransitionIdempotencyKey,
  parseProgramTransitionReceiptCommand,
  receiptSetMatchesCanonicalCommand,
  validateProgramTransitionReceiptSet,
  type ProgramTransitionReceiptCommandInput,
} from "./program-transition-receipt-boundary";

const CANDIDATE = "c8-candidate-program";
const ACTIVE = "c8-active-program";
const CREATED = "2026-07-30T19:00:00.000Z";
function command(overrides: Partial<ProgramTransitionReceiptCommandInput> = {}): ProgramTransitionReceiptCommandInput {
  return { idempotencyKey: "c8-key-001", candidateProgramId: CANDIDATE, expectedSupersededProgramId: null, governingMotions: [{ motionId: "c8-motion", subjectProgramId: CANDIDATE, ratificationState: "RATIFIED", decisionState: "PASS", mainAcceptanceState: "ACCEPTED_ON_MAIN", freshnessState: "CURRENT" }], receipts: [{ receiptType: "MAIN_STATE_RECEIPT", receiptInstanceId: "c8-main", subjectProgramId: CANDIDATE, issuanceState: "ISSUED", integrityState: "VERIFIED", authenticityState: "VERIFIED", issuerAuthorityState: "ESTABLISHED", freshnessState: "CURRENT" }, { receiptType: "PROGRAM_OPENING_RECEIPT", receiptInstanceId: "c8-opening", subjectProgramId: CANDIDATE, issuanceState: "ISSUED", integrityState: "VERIFIED", authenticityState: "VERIFIED", issuerAuthorityState: "ESTABLISHED", freshnessState: "CURRENT" }], expectedLifecycleVersions: [{ programId: ACTIVE, lifecycleVersion: 0 }, { programId: CANDIDATE, lifecycleVersion: 0 }], ...overrides };
}
function set(hold = false) {
  const parsed = parseProgramTransitionReceiptCommand(command({ expectedSupersededProgramId: hold ? ACTIVE : null })); assert.ok(parsed); if (!parsed) throw new Error("invalid fixture");
  const commandRecord = { commandId: parsed.commandId, idempotencyKeyHash: parsed.idempotencyKeyHash, requestFingerprint: parsed.requestFingerprint, fingerprintVersion: PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION, candidateProgramId: CANDIDATE, operationKind: hold ? "HOLD_AND_OPEN" : "OPEN_CANDIDATE", supersededProgramId: hold ? ACTIVE : null, expectedReceiptCount: hold ? 2 : 1, createdAt: CREATED };
  const row = (ordinal: 1 | 2, transitionId: "B1-TR-027" | "B1-TR-028", subjectProgramId: string, sourceState: string, resultState: string) => ({ receiptId: deriveProgramTransitionReceiptId(parsed.commandId, ordinal, transitionId, subjectProgramId), commandId: parsed.commandId, receiptOrdinal: ordinal, receiptClassId: PROGRAM_TRANSITION_RECEIPT_CLASS.id, receiptClassName: PROGRAM_TRANSITION_RECEIPT_CLASS.name, transitionId, lifecycleAxisId: "B1-AX-08", subjectProgramId, sourceState, resultState, sourceLifecycleVersion: 0, resultLifecycleVersion: 1, issuanceState: "ISSUED", integrityState: "UNVERIFIED", authenticityState: "NOT_ESTABLISHED", issuerAuthorityState: "NOT_ESTABLISHED", createdAt: CREATED });
  return { command: commandRecord, receipts: hold ? [row(1, "B1-TR-028", ACTIVE, "OPEN_FOR_BATCH_PLANNING_ONLY", "UNRESOLVED_HOLD"), row(2, "B1-TR-027", CANDIDATE, "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", "OPEN_FOR_BATCH_PLANNING_ONLY")] : [row(1, "B1-TR-027", CANDIDATE, "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", "OPEN_FOR_BATCH_PLANNING_ONLY")] };
}
function testFingerprintsAndGoldenVectors() {
  const parsed = parseProgramTransitionReceiptCommand(command()); assert.ok(parsed); if (!parsed) return;
  assert.equal(parsed.fingerprintVersion, "c8-transition-command/v3");
  assert.equal(parsed.commandId, deriveProgramTransitionCommandId(parsed.idempotencyKeyHash));
  assert.equal(parsed.idempotencyKeyHash, "556292de93a38c1ee8919c078103bd9661b08aa9a6cb0e7d076f8b24391bbce0");
  assert.equal(hashProgramTransitionIdempotencyKey("c8-key-001"), "556292de93a38c1ee8919c078103bd9661b08aa9a6cb0e7d076f8b24391bbce0");
  assert.equal(parsed.requestFingerprint, "a008625051cb1f2c41a4ef58c3fbcd511f00a9aad3ab42837c09eaac0ad00500");
  assert.equal(fingerprintProgramTransitionCommand(command()), "a008625051cb1f2c41a4ef58c3fbcd511f00a9aad3ab42837c09eaac0ad00500");
  assert.equal(parsed.commandId, "ptc-v1-41c62f082e0fd95b1c52b27da96ffcf5e5b46a4f85c16880e1ddda19cc43e951");
  assert.equal(deriveProgramTransitionReceiptId(parsed.commandId, 1, "B1-TR-027", CANDIDATE), "ptr-v1-ed32314e0f00706bd38d0c14ac19c108cadf680f3909614b1bbd3a5e462c585b");
  assert.equal(deriveProgramTransitionReceiptId(parsed.commandId, 1, "B1-TR-028", ACTIVE), "ptr-v1-36125fffae6808f4de991ac464c7218282cd13c62414c0d28cf01fdbecd8b941");
  assert.equal(deriveProgramTransitionReceiptId(parsed.commandId, 2, "B1-TR-027", CANDIDATE), "ptr-v1-79bcd656d664a7371ac583ba1feb10e5b64c67c2ad60fbde382d0aebf260f3c1");
  assert.notEqual(fingerprintProgramTransitionCommand(command({ governingMotions: [{ ...command().governingMotions[0], motionId: "\ud800" }] })), fingerprintProgramTransitionCommand(command({ governingMotions: [{ ...command().governingMotions[0], motionId: "\ufffd" }] })));
  assert.equal(JSON.stringify(parsed).includes("c8-key-001"), false);
}
function testReceiptSetExactness() {
  assert.equal(validateProgramTransitionReceiptSet(set())?.receipts.length, 1);
  assert.equal(validateProgramTransitionReceiptSet(set(true))?.receipts.length, 2);
  for (const malformed of [{ ...set(), receipts: [] }, { ...set(true), receipts: [set(true).receipts[0], set(true).receipts[0]] }, { ...set(true), receipts: [set(true).receipts[1], set(true).receipts[0]] }, { ...set(true), receipts: [set(true).receipts[0], { ...set(true).receipts[1], subjectProgramId: ACTIVE }] }, { ...set(true), command: { ...set(true).command, supersededProgramId: "c8-other-program" } }, { ...set(), command: { ...set().command, operationKind: "HOLD_AND_OPEN", expectedReceiptCount: 1 } }]) assert.equal(validateProgramTransitionReceiptSet(malformed), null);
  const boundedVersion = set(); boundedVersion.receipts[0] = { ...boundedVersion.receipts[0], sourceLifecycleVersion: 2, resultLifecycleVersion: 3, receiptId: deriveProgramTransitionReceiptId(boundedVersion.command.commandId, 1, "B1-TR-027", CANDIDATE) }; assert.ok(validateProgramTransitionReceiptSet(boundedVersion));
  const parsed = parseProgramTransitionReceiptCommand(command()); assert.ok(parsed); if (parsed) assert.equal(receiptSetMatchesCanonicalCommand(validateProgramTransitionReceiptSet(boundedVersion)!, parsed), false);
  const holdCommand = parseProgramTransitionReceiptCommand(command({ expectedSupersededProgramId: ACTIVE })); assert.ok(holdCommand); if (holdCommand) assert.equal(receiptSetMatchesCanonicalCommand(validateProgramTransitionReceiptSet(set(true))!, holdCommand), true);
  const overflow = set(); overflow.receipts[0] = { ...overflow.receipts[0], sourceLifecycleVersion: 2_147_483_647, resultLifecycleVersion: 2_147_483_648 }; assert.equal(validateProgramTransitionReceiptSet(overflow), null);
}
function run() { testFingerprintsAndGoldenVectors(); testReceiptSetExactness(); }
run();

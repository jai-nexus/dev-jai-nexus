import { createHash } from "node:crypto";

import {
  PROGRAM_LIFECYCLE_STATES,
  type ProgramLifecycleState,
} from "./one-active-program-invariant";
import type {
  ExpectedProgramLifecycleVersion,
  ProgramActivationSupersessionCommand,
  ProgramActivationSupersessionGoverningMotion,
  ProgramActivationSupersessionReceipt,
} from "./program-activation-supersession-boundary";
import { parseProgramActivationSupersessionCommand } from "./program-activation-supersession-boundary";
import type { PersistedProgramLifecycleRecord } from "./program-lifecycle-persistence-boundary";

const INPUT_KEYS = ["idempotencyKey", "candidateProgramId", "expectedSupersededProgramId", "governingMotions", "receipts", "expectedLifecycleVersions"] as const;
const COMMAND_KEYS = ["commandId", "idempotencyKeyHash", "requestFingerprint", "fingerprintVersion", "candidateProgramId", "operationKind", "supersededProgramId", "expectedReceiptCount", "createdAt"] as const;
const RECEIPT_KEYS = ["receiptId", "commandId", "receiptOrdinal", "receiptClassId", "receiptClassName", "transitionId", "lifecycleAxisId", "subjectProgramId", "sourceState", "resultState", "sourceLifecycleVersion", "resultLifecycleVersion", "issuanceState", "integrityState", "authenticityState", "issuerAuthorityState", "createdAt"] as const;
const BUNDLE_KEYS = ["command", "receipts"] as const;
const KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const HASH_PATTERN = /^[0-9a-f]{64}$/;
const PROGRAM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMMAND_ID_PATTERN = /^ptc-v1-[0-9a-f]{64}$/;
const RECEIPT_ID_PATTERN = /^ptr-v1-[0-9a-f]{64}$/;
const MAX_VERSION = 2_147_483_647;
const NOT_ROUTED = "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN" as const;
const OPEN = "OPEN_FOR_BATCH_PLANNING_ONLY" as const;
const HOLD = "UNRESOLVED_HOLD" as const;

export const PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION = "c8-transition-command/v3" as const;
export const PROGRAM_TRANSITION_COMMAND_ID_VERSION = "ptc-v1" as const;
export const PROGRAM_TRANSITION_RECEIPT_ID_VERSION = "ptr-v1" as const;
export const PROGRAM_TRANSITION_RECEIPT_CLASS = Object.freeze({ id: "B9-CLASS-011", name: "LIFECYCLE_TRANSITION_RECEIPT" } as const);

export type ProgramTransitionOperationKind = "OPEN_CANDIDATE" | "HOLD_AND_OPEN";
export interface ProgramTransitionReceiptCommandInput extends ProgramActivationSupersessionCommand { readonly idempotencyKey: string; }
export interface CanonicalProgramTransitionReceiptCommand {
  readonly command: ProgramActivationSupersessionCommand;
  readonly commandId: string;
  readonly idempotencyKeyHash: string;
  readonly requestFingerprint: string;
  readonly fingerprintVersion: typeof PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION;
  readonly expectedOperationKind: ProgramTransitionOperationKind;
  readonly expectedReceiptCount: 1 | 2;
}
export interface ProgramTransitionCommandRecord {
  readonly commandId: string;
  readonly idempotencyKeyHash: string;
  readonly requestFingerprint: string;
  readonly fingerprintVersion: typeof PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION;
  readonly candidateProgramId: string;
  readonly operationKind: ProgramTransitionOperationKind;
  readonly supersededProgramId: string | null;
  readonly expectedReceiptCount: 1 | 2;
  readonly createdAt: string;
}
export interface ProgramLifecycleTransitionReceipt {
  readonly receiptId: string;
  readonly commandId: string;
  readonly receiptOrdinal: 1 | 2;
  readonly receiptClassId: typeof PROGRAM_TRANSITION_RECEIPT_CLASS.id;
  readonly receiptClassName: typeof PROGRAM_TRANSITION_RECEIPT_CLASS.name;
  readonly transitionId: "B1-TR-027" | "B1-TR-028";
  readonly lifecycleAxisId: "B1-AX-08";
  readonly subjectProgramId: string;
  readonly sourceState: typeof NOT_ROUTED | typeof OPEN;
  readonly resultState: typeof OPEN | typeof HOLD;
  readonly sourceLifecycleVersion: number;
  readonly resultLifecycleVersion: number;
  readonly issuanceState: "ISSUED";
  readonly integrityState: "UNVERIFIED";
  readonly authenticityState: "NOT_ESTABLISHED";
  readonly issuerAuthorityState: "NOT_ESTABLISHED";
  readonly createdAt: string;
}
export interface ProgramTransitionReceiptSet { readonly command: ProgramTransitionCommandRecord; readonly receipts: readonly ProgramLifecycleTransitionReceipt[]; }
export type ProgramTransitionReceiptSetDraft = Readonly<{ readonly command: Omit<ProgramTransitionCommandRecord, "createdAt">; readonly receipts: readonly Omit<ProgramLifecycleTransitionReceipt, "createdAt">[] }>;
export type ProgramTransitionReceiptB10Compatibility = Readonly<{ readonly b9ClassPair: "EXACT"; readonly subjectBinding: "UNAVAILABLE_REQUIRED_B10_SUBJECT_COORDINATES"; readonly integrityBinding: "UNAVAILABLE_REQUIRED_B10_INTEGRITY_MATERIAL"; readonly authorityEffect: "NONE" }>;

function exactObject(input: unknown, keys: readonly string[]): Readonly<Record<string, unknown>> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return null;
  const own = Reflect.ownKeys(input);
  if (own.length !== keys.length || own.some((key) => typeof key !== "string") || !keys.every((key) => own.includes(key))) return null;
  const result: Record<string, unknown> = {};
  for (const key of keys) { const descriptor = Object.getOwnPropertyDescriptor(input, key); if (!descriptor || !Object.hasOwn(descriptor, "value")) return null; result[key] = descriptor.value; }
  return result;
}
function exactArray(input: unknown): readonly unknown[] | null {
  if (!Array.isArray(input)) return null;
  const length = Object.getOwnPropertyDescriptor(input, "length")?.value;
  const own = Reflect.ownKeys(input);
  if (typeof length !== "number" || !Number.isSafeInteger(length) || length < 0 || own.length !== length + 1 || own[length] !== "length") return null;
  const result: unknown[] = [];
  for (let index = 0; index < length; index += 1) { const descriptor = Object.getOwnPropertyDescriptor(input, String(index)); if (own[index] !== String(index) || !descriptor || !Object.hasOwn(descriptor, "value")) return null; result.push(descriptor.value); }
  return result;
}
function canonicalProgramId(value: unknown): value is string { return typeof value === "string" && PROGRAM_ID_PATTERN.test(value); }
function hash(value: string): string { return createHash("sha256").update(value, "ascii").digest("hex"); }
// UTF-16 code-unit hex avoids replacement-character collapse for lone surrogates.
function encodeString(value: string): string { let bytes = ""; for (let index = 0; index < value.length; index += 1) bytes += value.charCodeAt(index).toString(16).padStart(4, "0"); return `${value.length}:${bytes}`; }
function encode(tag: string, values: readonly string[]): string { return `${encodeString(tag)}${values.map(encodeString).join("")}`; }
function validVersion(value: unknown): value is number { return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_VERSION; }
function timestamp(value: unknown): value is string { return typeof value === "string" && !Number.isNaN(new Date(value).getTime()) && new Date(value).toISOString() === value; }
function state(value: unknown): value is ProgramLifecycleState { return typeof value === "string" && PROGRAM_LIFECYCLE_STATES.includes(value as ProgramLifecycleState); }
function motion(value: ProgramActivationSupersessionGoverningMotion): string { return encode("motion/v1", [value.motionId, value.subjectProgramId, value.ratificationState, value.decisionState, value.mainAcceptanceState, value.freshnessState]); }
function prerequisite(value: ProgramActivationSupersessionReceipt): string { return encode("prerequisite-receipt/v1", [value.receiptType, value.receiptInstanceId, value.subjectProgramId, value.issuanceState, value.integrityState, value.authenticityState, value.issuerAuthorityState, value.freshnessState]); }
function expected(value: ExpectedProgramLifecycleVersion): string { return encode("expected-version/v1", [value.programId, String(value.lifecycleVersion)]); }

export function fingerprintProgramTransitionCommand(command: ProgramActivationSupersessionCommand): string {
  return hash(encode(PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION, [command.candidateProgramId, command.expectedSupersededProgramId ?? "expected-superseded:null", ...command.governingMotions.map(motion).sort(), "motions-end", ...command.receipts.map(prerequisite).sort(), "receipts-end", ...command.expectedLifecycleVersions.map(expected)]));
}
export function hashProgramTransitionIdempotencyKey(key: string): string { return hash(encode("c8-idempotency-key/v2", [key])); }
export function deriveProgramTransitionCommandId(keyHash: string): string { return `${PROGRAM_TRANSITION_COMMAND_ID_VERSION}-${hash(encode("c8-transition-command-id/v1", [keyHash]))}`; }
export function deriveProgramTransitionReceiptId(commandId: string, ordinal: number, transitionId: string, subjectProgramId: string): string { return `${PROGRAM_TRANSITION_RECEIPT_ID_VERSION}-${hash(encode("c8-transition-receipt-id/v2", [commandId, String(ordinal), transitionId, subjectProgramId]))}`; }

export function parseProgramTransitionReceiptCommand(input: unknown): CanonicalProgramTransitionReceiptCommand | null {
  try {
    const fields = exactObject(input, INPUT_KEYS);
    if (!fields || typeof fields.idempotencyKey !== "string" || !KEY_PATTERN.test(fields.idempotencyKey)) return null;
    const command = parseProgramActivationSupersessionCommand({ candidateProgramId: fields.candidateProgramId, expectedSupersededProgramId: fields.expectedSupersededProgramId, governingMotions: fields.governingMotions, receipts: fields.receipts, expectedLifecycleVersions: fields.expectedLifecycleVersions });
    if (!command) return null;
    const keyHash = hashProgramTransitionIdempotencyKey(fields.idempotencyKey);
    const expectedOperationKind = command.expectedSupersededProgramId === null ? "OPEN_CANDIDATE" : "HOLD_AND_OPEN";
    return Object.freeze({ command, commandId: deriveProgramTransitionCommandId(keyHash), idempotencyKeyHash: keyHash, requestFingerprint: fingerprintProgramTransitionCommand(command), fingerprintVersion: PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION, expectedOperationKind, expectedReceiptCount: expectedOperationKind === "OPEN_CANDIDATE" ? 1 : 2 });
  } catch { return null; }
}

function validCommand(input: unknown): ProgramTransitionCommandRecord | null {
  const fields = exactObject(input, COMMAND_KEYS);
  if (!fields || typeof fields.commandId !== "string" || !COMMAND_ID_PATTERN.test(fields.commandId) || typeof fields.idempotencyKeyHash !== "string" || !HASH_PATTERN.test(fields.idempotencyKeyHash) || fields.commandId !== deriveProgramTransitionCommandId(fields.idempotencyKeyHash) || typeof fields.requestFingerprint !== "string" || !HASH_PATTERN.test(fields.requestFingerprint) || fields.fingerprintVersion !== PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION || !canonicalProgramId(fields.candidateProgramId) || (fields.operationKind !== "OPEN_CANDIDATE" && fields.operationKind !== "HOLD_AND_OPEN") || (fields.expectedReceiptCount !== 1 && fields.expectedReceiptCount !== 2) || !timestamp(fields.createdAt)) return null;
  if ((fields.operationKind === "OPEN_CANDIDATE" && (fields.expectedReceiptCount !== 1 || fields.supersededProgramId !== null)) || (fields.operationKind === "HOLD_AND_OPEN" && (fields.expectedReceiptCount !== 2 || !canonicalProgramId(fields.supersededProgramId) || fields.supersededProgramId === fields.candidateProgramId))) return null;
  return Object.freeze({ commandId: fields.commandId, idempotencyKeyHash: fields.idempotencyKeyHash, requestFingerprint: fields.requestFingerprint, fingerprintVersion: PROGRAM_TRANSITION_RECEIPT_FINGERPRINT_VERSION, candidateProgramId: fields.candidateProgramId, operationKind: fields.operationKind, supersededProgramId: fields.supersededProgramId as string | null, expectedReceiptCount: fields.expectedReceiptCount, createdAt: fields.createdAt });
}
export function validateProgramLifecycleTransitionReceipt(input: unknown): ProgramLifecycleTransitionReceipt | null {
  try {
    const fields = exactObject(input, RECEIPT_KEYS);
    if (!fields || typeof fields.receiptId !== "string" || !RECEIPT_ID_PATTERN.test(fields.receiptId) || typeof fields.commandId !== "string" || !COMMAND_ID_PATTERN.test(fields.commandId) || (fields.receiptOrdinal !== 1 && fields.receiptOrdinal !== 2) || fields.receiptClassId !== PROGRAM_TRANSITION_RECEIPT_CLASS.id || fields.receiptClassName !== PROGRAM_TRANSITION_RECEIPT_CLASS.name || (fields.transitionId !== "B1-TR-027" && fields.transitionId !== "B1-TR-028") || fields.lifecycleAxisId !== "B1-AX-08" || !canonicalProgramId(fields.subjectProgramId) || !state(fields.sourceState) || !state(fields.resultState) || !validVersion(fields.sourceLifecycleVersion) || !validVersion(fields.resultLifecycleVersion) || fields.resultLifecycleVersion !== fields.sourceLifecycleVersion + 1 || fields.resultLifecycleVersion > MAX_VERSION || fields.issuanceState !== "ISSUED" || fields.integrityState !== "UNVERIFIED" || fields.authenticityState !== "NOT_ESTABLISHED" || fields.issuerAuthorityState !== "NOT_ESTABLISHED" || !timestamp(fields.createdAt) || fields.receiptId !== deriveProgramTransitionReceiptId(fields.commandId, fields.receiptOrdinal, fields.transitionId, fields.subjectProgramId)) return null;
    if ((fields.transitionId === "B1-TR-027" && (fields.sourceState !== NOT_ROUTED || fields.resultState !== OPEN)) || (fields.transitionId === "B1-TR-028" && (fields.sourceState !== OPEN || fields.resultState !== HOLD))) return null;
    return Object.freeze({ receiptId: fields.receiptId, commandId: fields.commandId, receiptOrdinal: fields.receiptOrdinal, receiptClassId: PROGRAM_TRANSITION_RECEIPT_CLASS.id, receiptClassName: PROGRAM_TRANSITION_RECEIPT_CLASS.name, transitionId: fields.transitionId, lifecycleAxisId: "B1-AX-08", subjectProgramId: fields.subjectProgramId, sourceState: fields.sourceState as typeof NOT_ROUTED | typeof OPEN, resultState: fields.resultState as typeof OPEN | typeof HOLD, sourceLifecycleVersion: fields.sourceLifecycleVersion, resultLifecycleVersion: fields.resultLifecycleVersion, issuanceState: "ISSUED", integrityState: "UNVERIFIED", authenticityState: "NOT_ESTABLISHED", issuerAuthorityState: "NOT_ESTABLISHED", createdAt: fields.createdAt });
  } catch { return null; }
}
export function validateProgramTransitionReceiptSet(input: unknown): ProgramTransitionReceiptSet | null {
  const fields = exactObject(input, BUNDLE_KEYS); const command = fields ? validCommand(fields.command) : null; const raw = fields ? exactArray(fields.receipts) : null;
  if (!command || !raw || raw.length !== command.expectedReceiptCount) return null;
  const receipts = raw.map(validateProgramLifecycleTransitionReceipt); if (receipts.some((receipt) => !receipt)) return null;
  const valid = receipts as ProgramLifecycleTransitionReceipt[];
  if (valid.some((receipt, index) => receipt.commandId !== command.commandId || receipt.receiptOrdinal !== index + 1) || new Set(valid.map((receipt) => receipt.subjectProgramId)).size !== valid.length) return null;
  const candidate = valid.find((receipt) => receipt.transitionId === "B1-TR-027");
  const hold = valid.find((receipt) => receipt.transitionId === "B1-TR-028");
  if (!candidate || candidate.subjectProgramId !== command.candidateProgramId || candidate.sourceState !== NOT_ROUTED || candidate.resultState !== OPEN || (command.operationKind === "OPEN_CANDIDATE" && (valid.length !== 1 || hold || candidate.receiptOrdinal !== 1)) || (command.operationKind === "HOLD_AND_OPEN" && (!hold || valid.length !== 2 || hold.receiptOrdinal !== 1 || candidate.receiptOrdinal !== 2 || hold.subjectProgramId !== command.supersededProgramId || hold.subjectProgramId === candidate.subjectProgramId))) return null;
  return Object.freeze({ command: Object.freeze(command), receipts: Object.freeze([...valid]) });
}
export function createProgramTransitionReceiptSetDraft(input: Readonly<{ readonly command: CanonicalProgramTransitionReceiptCommand; readonly candidateBefore: PersistedProgramLifecycleRecord; readonly candidateAfter: PersistedProgramLifecycleRecord; readonly supersededBefore: PersistedProgramLifecycleRecord | null; readonly supersededAfter: PersistedProgramLifecycleRecord | null; }>): ProgramTransitionReceiptSetDraft | null {
  const { command, candidateBefore, candidateAfter, supersededBefore, supersededAfter } = input;
  if (!canonicalProgramId(candidateBefore.programId) || candidateBefore.programId !== command.command.candidateProgramId || candidateAfter.programId !== candidateBefore.programId || candidateBefore.lifecycleState !== NOT_ROUTED || candidateAfter.lifecycleState !== OPEN || !validVersion(candidateBefore.lifecycleVersion) || candidateBefore.lifecycleVersion >= MAX_VERSION || candidateAfter.lifecycleVersion !== candidateBefore.lifecycleVersion + 1) return null;
  const rows: Omit<ProgramLifecycleTransitionReceipt, "createdAt">[] = [];
  if (supersededBefore || supersededAfter) {
    if (!supersededBefore || !supersededAfter || !canonicalProgramId(supersededBefore.programId) || supersededBefore.programId === candidateBefore.programId || supersededAfter.programId !== supersededBefore.programId || supersededBefore.lifecycleState !== OPEN || supersededAfter.lifecycleState !== HOLD || !validVersion(supersededBefore.lifecycleVersion) || supersededBefore.lifecycleVersion >= MAX_VERSION || supersededAfter.lifecycleVersion !== supersededBefore.lifecycleVersion + 1) return null;
    rows.push(Object.freeze({ receiptId: deriveProgramTransitionReceiptId(command.commandId, 1, "B1-TR-028", supersededBefore.programId), commandId: command.commandId, receiptOrdinal: 1, receiptClassId: PROGRAM_TRANSITION_RECEIPT_CLASS.id, receiptClassName: PROGRAM_TRANSITION_RECEIPT_CLASS.name, transitionId: "B1-TR-028", lifecycleAxisId: "B1-AX-08", subjectProgramId: supersededBefore.programId, sourceState: OPEN, resultState: HOLD, sourceLifecycleVersion: supersededBefore.lifecycleVersion, resultLifecycleVersion: supersededAfter.lifecycleVersion, issuanceState: "ISSUED", integrityState: "UNVERIFIED", authenticityState: "NOT_ESTABLISHED", issuerAuthorityState: "NOT_ESTABLISHED" }));
  }
  const ordinal = rows.length + 1 as 1 | 2;
  rows.push(Object.freeze({ receiptId: deriveProgramTransitionReceiptId(command.commandId, ordinal, "B1-TR-027", candidateBefore.programId), commandId: command.commandId, receiptOrdinal: ordinal, receiptClassId: PROGRAM_TRANSITION_RECEIPT_CLASS.id, receiptClassName: PROGRAM_TRANSITION_RECEIPT_CLASS.name, transitionId: "B1-TR-027", lifecycleAxisId: "B1-AX-08", subjectProgramId: candidateBefore.programId, sourceState: NOT_ROUTED, resultState: OPEN, sourceLifecycleVersion: candidateBefore.lifecycleVersion, resultLifecycleVersion: candidateAfter.lifecycleVersion, issuanceState: "ISSUED", integrityState: "UNVERIFIED", authenticityState: "NOT_ESTABLISHED", issuerAuthorityState: "NOT_ESTABLISHED" }));
  const isHoldAndOpen = rows.length === 2;
  return Object.freeze({ command: Object.freeze({ commandId: command.commandId, idempotencyKeyHash: command.idempotencyKeyHash, requestFingerprint: command.requestFingerprint, fingerprintVersion: command.fingerprintVersion, candidateProgramId: command.command.candidateProgramId, operationKind: isHoldAndOpen ? "HOLD_AND_OPEN" : "OPEN_CANDIDATE", supersededProgramId: supersededBefore?.programId ?? null, expectedReceiptCount: rows.length as 1 | 2 }), receipts: Object.freeze(rows) });
}
export function receiptSetMatchesCanonicalCommand(set: ProgramTransitionReceiptSet, command: CanonicalProgramTransitionReceiptCommand): boolean {
  if (set.command.idempotencyKeyHash !== command.idempotencyKeyHash || set.command.requestFingerprint !== command.requestFingerprint || set.command.fingerprintVersion !== command.fingerprintVersion || set.command.commandId !== command.commandId || set.command.candidateProgramId !== command.command.candidateProgramId || set.command.operationKind !== command.expectedOperationKind || set.command.supersededProgramId !== command.command.expectedSupersededProgramId || set.command.expectedReceiptCount !== command.expectedReceiptCount || set.command.expectedReceiptCount !== set.receipts.length) return false;
  const expectedSubjects = command.expectedOperationKind === "HOLD_AND_OPEN"
    ? [command.command.expectedSupersededProgramId, command.command.candidateProgramId]
    : [command.command.candidateProgramId];
  if (set.receipts.some((receipt, index) => receipt.subjectProgramId !== expectedSubjects[index])) return false;
  const expectedVersions = new Map(command.command.expectedLifecycleVersions.map((value) => [value.programId, value.lifecycleVersion]));
  if (expectedVersions.size !== command.command.expectedLifecycleVersions.length) return false;
  return set.receipts.every((receipt) => expectedVersions.get(receipt.subjectProgramId) === receipt.sourceLifecycleVersion && receipt.resultLifecycleVersion === receipt.sourceLifecycleVersion + 1);
}
export function classifyProgramTransitionReceiptB10Compatibility(): ProgramTransitionReceiptB10Compatibility { return Object.freeze({ b9ClassPair: "EXACT", subjectBinding: "UNAVAILABLE_REQUIRED_B10_SUBJECT_COORDINATES", integrityBinding: "UNAVAILABLE_REQUIRED_B10_INTEGRITY_MATERIAL", authorityEffect: "NONE" }); }

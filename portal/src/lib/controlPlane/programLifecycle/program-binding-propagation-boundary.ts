import { MAX_PROGRAM_LIFECYCLE_VERSION } from "./program-lifecycle-persistence-boundary";

const BINDING_KEYS = [
  "programId",
  "lifecycleVersion",
  "governingMotionId",
  "contractVersion",
] as const;
const ENVELOPE_INPUT_KEYS = ["artifactClass", "binding", "payload"] as const;
const ENVELOPE_KEYS = [
  "envelopeVersion",
  "artifactClass",
  "binding",
  "payload",
  "sourcePosture",
  "authorityEffect",
] as const;
const COMPLETE_SET_KEYS = [
  "envelopeSetVersion",
  "binding",
  "envelopes",
  "sourcePosture",
  "authorityEffect",
] as const;
const PROGRAM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/;

export const PROGRAM_BINDING_CONTRACT_VERSION = "jai-program-binding.v1" as const;
export const PROGRAM_BINDING_ENVELOPE_VERSION =
  "jai-program-binding-envelope.v1" as const;
export const PROGRAM_BINDING_ENVELOPE_SET_VERSION =
  "jai-program-binding-envelope-set.v1" as const;
export const MAX_GOVERNING_MOTION_ID_LENGTH = 256;

export const PROGRAM_BINDING_ARTIFACT_CLASSES = Object.freeze([
  "CONTROL_PLANE_REQUEST",
  "DECISION",
  "WORK_PACKET",
  "RECEIPT",
] as const);

export type ProgramBindingArtifactClass =
  (typeof PROGRAM_BINDING_ARTIFACT_CLASSES)[number];

export interface ProgramBindingSnapshot {
  readonly programId: string;
  readonly lifecycleVersion: number;
  readonly governingMotionId: string;
  readonly contractVersion: typeof PROGRAM_BINDING_CONTRACT_VERSION;
}

export interface ProgramBindingComparisonSnapshot {
  readonly programId: string;
  readonly lifecycleVersion: number;
  readonly governingMotionId: string;
  readonly contractVersion: string;
}

export interface ProgramBindingJsonObject {
  readonly [key: string]: ProgramBindingJsonValue;
}

export type ProgramBindingJsonValue =
  | null
  | boolean
  | number
  | string
  | readonly ProgramBindingJsonValue[]
  | ProgramBindingJsonObject;

export interface ProgramBindingEnvelope {
  readonly envelopeVersion: typeof PROGRAM_BINDING_ENVELOPE_VERSION;
  readonly artifactClass: ProgramBindingArtifactClass;
  readonly binding: ProgramBindingSnapshot;
  readonly payload: ProgramBindingJsonValue;
  readonly sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT";
  readonly authorityEffect: "NONE";
}

export interface ProgramBindingEnvelopeSet {
  readonly envelopeSetVersion: typeof PROGRAM_BINDING_ENVELOPE_SET_VERSION;
  readonly binding: ProgramBindingSnapshot;
  readonly envelopes: readonly ProgramBindingEnvelope[];
  readonly sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT";
  readonly authorityEffect: "NONE";
}

export type ProgramBindingComparisonResult =
  | {
      readonly kind: "INVALID_EXPECTED_SNAPSHOT";
      readonly structurallyEqual: false;
      readonly expectedBinding: null;
      readonly candidateBinding: null;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT";
      readonly structurallyEqual: false;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: null;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "CROSS_PROGRAM_SUBSTITUTION";
      readonly structurallyEqual: false;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: ProgramBindingComparisonSnapshot;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "STALE_LIFECYCLE_VERSION";
      readonly structurallyEqual: false;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: ProgramBindingComparisonSnapshot;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "LIFECYCLE_VERSION_MISMATCH";
      readonly structurallyEqual: false;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: ProgramBindingComparisonSnapshot;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "GOVERNING_MOTION_MISMATCH";
      readonly structurallyEqual: false;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: ProgramBindingComparisonSnapshot;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "CONTRACT_VERSION_MISMATCH";
      readonly structurallyEqual: false;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: ProgramBindingComparisonSnapshot;
      readonly authorityEffect: "NONE";
    }
  | {
      readonly kind: "EXACT_MATCH";
      readonly structurallyEqual: true;
      readonly expectedBinding: ProgramBindingSnapshot;
      readonly candidateBinding: ProgramBindingComparisonSnapshot;
      readonly authorityEffect: "NONE";
    };

function isStructuredCloneable(value: unknown): boolean {
  if (typeof structuredClone !== "function") {
    return false;
  }

  try {
    structuredClone(value);
    return true;
  } catch {
    return false;
  }
}

function readExactPlainDataObject(
  input: unknown,
  expectedKeys: readonly string[],
): Readonly<Record<string, unknown>> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  try {
    const prototype = Object.getPrototypeOf(input);
    if (prototype !== Object.prototype && prototype !== null) {
      return null;
    }

    const keys = Reflect.ownKeys(input);
    if (
      keys.length !== expectedKeys.length ||
      keys.some((key) => typeof key !== "string") ||
      !expectedKeys.every((key) => keys.includes(key))
    ) {
      return null;
    }

    const values: Record<string, unknown> = {};
    for (const key of expectedKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (
        !descriptor ||
        !Object.hasOwn(descriptor, "value") ||
        !descriptor.enumerable
      ) {
        return null;
      }
      values[key] = descriptor.value;
    }

    return isStructuredCloneable(input) ? values : null;
  } catch {
    return null;
  }
}

function readExactArray(input: unknown): readonly unknown[] | null {
  if (!Array.isArray(input)) {
    return null;
  }

  try {
    if (Object.getPrototypeOf(input) !== Array.prototype) {
      return null;
    }
    const lengthDescriptor = Object.getOwnPropertyDescriptor(input, "length");
    if (
      !lengthDescriptor ||
      !Object.hasOwn(lengthDescriptor, "value") ||
      typeof lengthDescriptor.value !== "number" ||
      !Number.isSafeInteger(lengthDescriptor.value) ||
      lengthDescriptor.value < 0
    ) {
      return null;
    }

    const length = lengthDescriptor.value;
    const keys = Reflect.ownKeys(input);
    if (keys.length !== length + 1 || keys[length] !== "length") {
      return null;
    }

    const values: unknown[] = [];
    for (let index = 0; index < length; index += 1) {
      const key = String(index);
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (
        keys[index] !== key ||
        !descriptor ||
        !Object.hasOwn(descriptor, "value") ||
        !descriptor.enumerable
      ) {
        return null;
      }
      values.push(descriptor.value);
    }

    return isStructuredCloneable(input) ? values : null;
  } catch {
    return null;
  }
}

function isCanonicalProgramId(value: unknown): value is string {
  return typeof value === "string" && PROGRAM_ID_PATTERN.test(value);
}

function isLifecycleVersion(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= MAX_PROGRAM_LIFECYCLE_VERSION
  );
}

function isCanonicalGoverningMotionId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_GOVERNING_MOTION_ID_LENGTH &&
    value === value.trim() &&
    value === value.normalize("NFC") &&
    !CONTROL_CHARACTER_PATTERN.test(value)
  );
}

function isComparableContractVersion(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_GOVERNING_MOTION_ID_LENGTH &&
    value === value.trim() &&
    !CONTROL_CHARACTER_PATTERN.test(value)
  );
}

function isArtifactClass(value: unknown): value is ProgramBindingArtifactClass {
  return (
    typeof value === "string" &&
    PROGRAM_BINDING_ARTIFACT_CLASSES.includes(value as ProgramBindingArtifactClass)
  );
}

function freezeBinding(
  binding: ProgramBindingSnapshot,
): ProgramBindingSnapshot {
  return Object.freeze({
    programId: binding.programId,
    lifecycleVersion: binding.lifecycleVersion,
    governingMotionId: binding.governingMotionId,
    contractVersion: binding.contractVersion,
  });
}

function bindingsEqual(
  left: ProgramBindingComparisonSnapshot,
  right: ProgramBindingComparisonSnapshot,
): boolean {
  return (
    left.programId === right.programId &&
    left.lifecycleVersion === right.lifecycleVersion &&
    left.governingMotionId === right.governingMotionId &&
    left.contractVersion === right.contractVersion
  );
}

/**
 * Parses one supplied, structural Program binding. It neither discovers a
 * Program source nor grants routing, lifecycle, or execution authority.
 */
export function parseProgramBindingSnapshot(
  input: unknown,
): ProgramBindingSnapshot | null {
  try {
    const values = readExactPlainDataObject(input, BINDING_KEYS);
    if (
      !values ||
      !isCanonicalProgramId(values.programId) ||
      !isLifecycleVersion(values.lifecycleVersion) ||
      !isCanonicalGoverningMotionId(values.governingMotionId) ||
      values.contractVersion !== PROGRAM_BINDING_CONTRACT_VERSION
    ) {
      return null;
    }

    return freezeBinding({
      programId: values.programId,
      lifecycleVersion: values.lifecycleVersion,
      governingMotionId: values.governingMotionId,
      contractVersion: PROGRAM_BINDING_CONTRACT_VERSION,
    });
  } catch {
    return null;
  }
}

function parseProgramBindingComparisonSnapshot(
  input: unknown,
): ProgramBindingComparisonSnapshot | null {
  try {
    const values = readExactPlainDataObject(input, BINDING_KEYS);
    if (
      !values ||
      !isCanonicalProgramId(values.programId) ||
      !isLifecycleVersion(values.lifecycleVersion) ||
      !isCanonicalGoverningMotionId(values.governingMotionId) ||
      !isComparableContractVersion(values.contractVersion)
    ) {
      return null;
    }

    return Object.freeze({
      programId: values.programId,
      lifecycleVersion: values.lifecycleVersion,
      governingMotionId: values.governingMotionId,
      contractVersion: values.contractVersion,
    });
  } catch {
    return null;
  }
}

/**
 * Compares two supplied snapshots in the route-defined fail-closed order.
 * "Stale" is relative only to the supplied expected snapshot.
 */
export function compareProgramBindingSnapshots(
  expectedInput: unknown,
  candidateInput: unknown,
): ProgramBindingComparisonResult {
  const expectedBinding = parseProgramBindingSnapshot(expectedInput);
  if (!expectedBinding) {
    return Object.freeze({
      kind: "INVALID_EXPECTED_SNAPSHOT",
      structurallyEqual: false,
      expectedBinding: null,
      candidateBinding: null,
      authorityEffect: "NONE",
    });
  }

  const candidateBinding = parseProgramBindingComparisonSnapshot(candidateInput);
  if (!candidateBinding) {
    return Object.freeze({
      kind: "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT",
      structurallyEqual: false,
      expectedBinding,
      candidateBinding: null,
      authorityEffect: "NONE",
    });
  }

  const base = {
    structurallyEqual: false as const,
    expectedBinding,
    candidateBinding,
    authorityEffect: "NONE" as const,
  };
  if (candidateBinding.programId !== expectedBinding.programId) {
    return Object.freeze({ kind: "CROSS_PROGRAM_SUBSTITUTION", ...base });
  }
  if (candidateBinding.lifecycleVersion < expectedBinding.lifecycleVersion) {
    return Object.freeze({ kind: "STALE_LIFECYCLE_VERSION", ...base });
  }
  if (candidateBinding.lifecycleVersion > expectedBinding.lifecycleVersion) {
    return Object.freeze({ kind: "LIFECYCLE_VERSION_MISMATCH", ...base });
  }
  if (candidateBinding.governingMotionId !== expectedBinding.governingMotionId) {
    return Object.freeze({ kind: "GOVERNING_MOTION_MISMATCH", ...base });
  }
  if (candidateBinding.contractVersion !== expectedBinding.contractVersion) {
    return Object.freeze({ kind: "CONTRACT_VERSION_MISMATCH", ...base });
  }

  return Object.freeze({
    kind: "EXACT_MATCH",
    structurallyEqual: true,
    expectedBinding,
    candidateBinding,
    authorityEffect: "NONE",
  });
}

function cloneJsonValue(
  input: unknown,
  ancestors: ReadonlySet<object> = new Set<object>(),
): ProgramBindingJsonValue | null {
  if (
    input === null ||
    typeof input === "boolean" ||
    typeof input === "string"
  ) {
    return input;
  }
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : null;
  }
  if (typeof input !== "object") {
    return null;
  }
  if (ancestors.has(input)) {
    return null;
  }

  const nextAncestors = new Set(ancestors);
  nextAncestors.add(input);

  if (Array.isArray(input)) {
    const values = readExactArray(input);
    if (!values) {
      return null;
    }
    const cloned: ProgramBindingJsonValue[] = [];
    for (const value of values) {
      const copy = cloneJsonValue(value, nextAncestors);
      if (copy === null && value !== null) {
        return null;
      }
      cloned.push(copy);
    }
    return Object.freeze(cloned);
  }

  try {
    const prototype = Object.getPrototypeOf(input);
    if (prototype !== Object.prototype && prototype !== null) {
      return null;
    }
    const keys = Reflect.ownKeys(input);
    if (keys.some((key) => typeof key !== "string")) {
      return null;
    }

    const stringKeys = keys.filter((key): key is string => typeof key === "string");
    const sortedKeys = stringKeys.sort((left, right) =>
      left < right ? -1 : left > right ? 1 : 0,
    );
    const cloned = Object.create(null) as Record<string, ProgramBindingJsonValue>;
    for (const key of sortedKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (
        !descriptor ||
        !Object.hasOwn(descriptor, "value") ||
        !descriptor.enumerable
      ) {
        return null;
      }
      const copy = cloneJsonValue(descriptor.value, nextAncestors);
      if (copy === null && descriptor.value !== null) {
        return null;
      }
      Object.defineProperty(cloned, key, {
        value: copy,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return isStructuredCloneable(input) ? Object.freeze(cloned) : null;
  } catch {
    return null;
  }
}

function isDeepFrozenJson(input: unknown): input is ProgramBindingJsonValue {
  if (
    input === null ||
    typeof input === "boolean" ||
    typeof input === "string" ||
    (typeof input === "number" && Number.isFinite(input))
  ) {
    return true;
  }
  if (typeof input !== "object" || !Object.isFrozen(input)) {
    return false;
  }

  const clone = cloneJsonValue(input);
  if (clone === null && input !== null) {
    return false;
  }
  if (Array.isArray(input)) {
    return input.every((value) => isDeepFrozenJson(value));
  }

  return Reflect.ownKeys(input).every((key) => {
    if (typeof key !== "string") {
      return false;
    }
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor || !Object.hasOwn(descriptor, "value") || !descriptor.enumerable) {
      return false;
    }
    return isDeepFrozenJson(descriptor.value);
  });
}

function isCanonicalJsonPayload(input: unknown): boolean {
  const cloned = cloneJsonValue(input);
  if (cloned === null && input !== null) {
    return false;
  }
  try {
    return JSON.stringify(input) === JSON.stringify(cloned);
  } catch {
    return false;
  }
}

function createEnvelope(
  artifactClass: ProgramBindingArtifactClass,
  binding: ProgramBindingSnapshot,
  payload: ProgramBindingJsonValue,
): ProgramBindingEnvelope {
  return Object.freeze({
    envelopeVersion: PROGRAM_BINDING_ENVELOPE_VERSION,
    artifactClass,
    binding: freezeBinding(binding),
    payload,
    sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT",
    authorityEffect: "NONE",
  });
}

/**
 * Creates one detached envelope for a route-supplied binding and JSON-safe
 * payload. The constants are set by this boundary, not caller input.
 */
export function createProgramBindingEnvelope(
  input: unknown,
): ProgramBindingEnvelope | null {
  try {
    const values = readExactPlainDataObject(input, ENVELOPE_INPUT_KEYS);
    if (!values || !isArtifactClass(values.artifactClass)) {
      return null;
    }

    const binding = parseProgramBindingSnapshot(values.binding);
    const payload = cloneJsonValue(values.payload);
    if (!binding || (payload === null && values.payload !== null)) {
      return null;
    }

    return createEnvelope(values.artifactClass, binding, payload);
  } catch {
    return null;
  }
}

function validateCanonicalFrozenEnvelope(
  input: unknown,
): ProgramBindingEnvelope | null {
  try {
    if (typeof input !== "object" || input === null || !Object.isFrozen(input)) {
      return null;
    }
    const values = readExactPlainDataObject(input, ENVELOPE_KEYS);
    if (
      !values ||
      values.envelopeVersion !== PROGRAM_BINDING_ENVELOPE_VERSION ||
      !isArtifactClass(values.artifactClass) ||
      values.sourcePosture !== "SUPPLIED_EXPECTED_SNAPSHOT" ||
      values.authorityEffect !== "NONE" ||
      !isDeepFrozenJson(values.payload) ||
      !isCanonicalJsonPayload(values.payload) ||
      typeof values.binding !== "object" ||
      values.binding === null ||
      !Object.isFrozen(values.binding)
    ) {
      return null;
    }

    const binding = parseProgramBindingSnapshot(values.binding);
    if (!binding) {
      return null;
    }

    const payload = cloneJsonValue(values.payload);
    if (payload === null && values.payload !== null) {
      return null;
    }
    return createEnvelope(values.artifactClass, binding, payload);
  } catch {
    return null;
  }
}

/**
 * Returns deterministic JSON for a canonical, frozen envelope. The serializer
 * is structural only and does not authenticate, issue, or apply the envelope.
 */
export function serializeProgramBindingEnvelope(input: unknown): string | null {
  const envelope = validateCanonicalFrozenEnvelope(input);
  if (!envelope) {
    return null;
  }

  return JSON.stringify({
    envelopeVersion: envelope.envelopeVersion,
    artifactClass: envelope.artifactClass,
    binding: {
      programId: envelope.binding.programId,
      lifecycleVersion: envelope.binding.lifecycleVersion,
      governingMotionId: envelope.binding.governingMotionId,
      contractVersion: envelope.binding.contractVersion,
    },
    payload: envelope.payload,
    sourcePosture: envelope.sourcePosture,
    authorityEffect: envelope.authorityEffect,
  });
}

/**
 * Requires exactly one frozen envelope of each artifact class with an exact
 * common binding. The returned set is cloned, sorted, and detached again.
 */
export function createCompleteProgramBindingEnvelopeSet(
  input: unknown,
): ProgramBindingEnvelopeSet | null {
  try {
    const values = readExactArray(input);
    if (!values || values.length !== PROGRAM_BINDING_ARTIFACT_CLASSES.length) {
      return null;
    }

    const byClass = new Map<ProgramBindingArtifactClass, ProgramBindingEnvelope>();
    for (const value of values) {
      const envelope = validateCanonicalFrozenEnvelope(value);
      if (!envelope || byClass.has(envelope.artifactClass)) {
        return null;
      }
      byClass.set(envelope.artifactClass, envelope);
    }

    const first = byClass.get(PROGRAM_BINDING_ARTIFACT_CLASSES[0]);
    if (!first) {
      return null;
    }
    const binding = first.binding;
    const envelopes: ProgramBindingEnvelope[] = [];
    for (const artifactClass of PROGRAM_BINDING_ARTIFACT_CLASSES) {
      const envelope = byClass.get(artifactClass);
      if (!envelope || !bindingsEqual(binding, envelope.binding)) {
        return null;
      }
      envelopes.push(
        createEnvelope(
          envelope.artifactClass,
          binding,
          cloneJsonValue(envelope.payload) as ProgramBindingJsonValue,
        ),
      );
    }

    return Object.freeze({
      envelopeSetVersion: PROGRAM_BINDING_ENVELOPE_SET_VERSION,
      binding: freezeBinding(binding),
      envelopes: Object.freeze(envelopes),
      sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT",
      authorityEffect: "NONE",
    });
  } catch {
    return null;
  }
}

/**
 * Validates a complete set produced by this boundary without creating any
 * external, persistence, lifecycle, or authority effect.
 */
export function validateCompleteProgramBindingEnvelopeSet(
  input: unknown,
): ProgramBindingEnvelopeSet | null {
  try {
    if (typeof input !== "object" || input === null || !Object.isFrozen(input)) {
      return null;
    }
    const values = readExactPlainDataObject(input, COMPLETE_SET_KEYS);
    if (
      !values ||
      values.envelopeSetVersion !== PROGRAM_BINDING_ENVELOPE_SET_VERSION ||
      values.sourcePosture !== "SUPPLIED_EXPECTED_SNAPSHOT" ||
      values.authorityEffect !== "NONE" ||
      typeof values.binding !== "object" ||
      values.binding === null ||
      !Object.isFrozen(values.binding) ||
      !Array.isArray(values.envelopes) ||
      !Object.isFrozen(values.envelopes)
    ) {
      return null;
    }
    const binding = parseProgramBindingSnapshot(values.binding);
    const set = createCompleteProgramBindingEnvelopeSet(values.envelopes);
    if (!binding || !set || !bindingsEqual(binding, set.binding)) {
      return null;
    }
    return set;
  } catch {
    return null;
  }
}

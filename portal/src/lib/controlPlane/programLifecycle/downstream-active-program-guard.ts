import { types } from "node:util";

import {
  resolveCanonicalActiveProgram,
  type CanonicalActiveProgramSnapshot,
  type CanonicalActiveProgramResolverResult,
} from "./canonical-active-program-resolver";
import {
  compareProgramBindingSnapshots,
  type ProgramBindingComparisonResult,
  type ProgramBindingComparisonSnapshot,
  type ProgramBindingSnapshot,
} from "./program-binding-propagation-boundary";

const INPUT_KEYS = ["portfolio", "expectedBinding", "candidateBinding"] as const;

export type DownstreamActiveProgramGuardKind =
  | "INVALID_INPUT"
  | "INVALID_EXPECTED_SNAPSHOT"
  | "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT"
  | "CROSS_PROGRAM_SUBSTITUTION"
  | "STALE_LIFECYCLE_VERSION"
  | "LIFECYCLE_VERSION_MISMATCH"
  | "GOVERNING_MOTION_MISMATCH"
  | "CONTRACT_VERSION_MISMATCH"
  | "MULTIPLE_ACTIVE_PROGRAMS"
  | "ZERO_ACTIVE_PROGRAM"
  | "ACTIVE_PROGRAM_MISMATCH"
  | "GUARD_SATISFIED";

type GuardSatisfied<Kind extends DownstreamActiveProgramGuardKind> =
  Kind extends "GUARD_SATISFIED" ? true : false;

type GuardResultFor<Kind extends DownstreamActiveProgramGuardKind> = Readonly<{
  readonly kind: Kind;
  readonly classificationOnly: true;
  readonly sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT";
  readonly authorityEffect: "NONE";
  readonly mutationAuthorized: false;
  readonly mutationPerformed: false;
  readonly guardSatisfied: GuardSatisfied<Kind>;
  readonly activeProgram: CanonicalActiveProgramSnapshot | null;
  readonly bindingComparison: ProgramBindingComparisonResult | null;
}>;

export type DownstreamActiveProgramGuardResult = {
  [Kind in DownstreamActiveProgramGuardKind]: GuardResultFor<Kind>;
}[DownstreamActiveProgramGuardKind];

type GuardInputValues = Readonly<{
  readonly portfolio: unknown;
  readonly expectedBinding: unknown;
  readonly candidateBinding: unknown;
}>;

function readExactGuardInput(input: unknown): GuardInputValues | null {
  try {
    if (typeof input !== "object" || input === null) {
      return null;
    }
    if (types.isProxy(input)) {
      return null;
    }
    if (Array.isArray(input)) {
      return null;
    }

    const prototype = Object.getPrototypeOf(input);
    if (prototype !== Object.prototype && prototype !== null) {
      return null;
    }

    const keys = Reflect.ownKeys(input);
    if (
      keys.length !== INPUT_KEYS.length ||
      keys.some((key) => typeof key !== "string") ||
      !INPUT_KEYS.every((key) => keys.includes(key))
    ) {
      return null;
    }

    const values: Record<string, unknown> = {};
    for (const key of INPUT_KEYS) {
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

    return {
      portfolio: values.portfolio,
      expectedBinding: values.expectedBinding,
      candidateBinding: values.candidateBinding,
    };
  } catch {
    return null;
  }
}

function cloneExpectedBinding(
  binding: ProgramBindingSnapshot,
): ProgramBindingSnapshot {
  return Object.freeze({
    programId: binding.programId,
    lifecycleVersion: binding.lifecycleVersion,
    governingMotionId: binding.governingMotionId,
    contractVersion: binding.contractVersion,
  });
}

function cloneCandidateBinding(
  binding: ProgramBindingComparisonSnapshot,
): ProgramBindingComparisonSnapshot {
  return Object.freeze({
    programId: binding.programId,
    lifecycleVersion: binding.lifecycleVersion,
    governingMotionId: binding.governingMotionId,
    contractVersion: binding.contractVersion,
  });
}

function cloneBindingComparison(
  comparison: ProgramBindingComparisonResult,
): ProgramBindingComparisonResult {
  const expectedBinding = comparison.expectedBinding
    ? cloneExpectedBinding(comparison.expectedBinding)
    : null;
  const candidateBinding = comparison.candidateBinding
    ? cloneCandidateBinding(comparison.candidateBinding)
    : null;

  return Object.freeze({
    kind: comparison.kind,
    structurallyEqual: comparison.structurallyEqual,
    expectedBinding,
    candidateBinding,
    authorityEffect: "NONE",
  }) as ProgramBindingComparisonResult;
}

function cloneActiveProgram(
  result: CanonicalActiveProgramResolverResult,
): CanonicalActiveProgramSnapshot | null {
  if (
    result.kind !== "ONE_ACTIVE" ||
    result.activeProgramIds.length !== 1 ||
    result.activeProgramIds[0] !== result.activeProgramId ||
    result.activeProgram.programId !== result.activeProgramId
  ) {
    return null;
  }

  return Object.freeze({
    programId: result.activeProgram.programId,
    lifecycleState: result.activeProgram.lifecycleState,
  });
}

function createResult<Kind extends DownstreamActiveProgramGuardKind>(
  kind: Kind,
  activeProgram: CanonicalActiveProgramSnapshot | null,
  bindingComparison: ProgramBindingComparisonResult | null,
): GuardResultFor<Kind> {
  return Object.freeze({
    kind,
    classificationOnly: true,
    sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT",
    authorityEffect: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
    guardSatisfied: kind === "GUARD_SATISFIED",
    activeProgram,
    bindingComparison,
  }) as GuardResultFor<Kind>;
}

function liftBindingKind(
  comparison: ProgramBindingComparisonResult,
): Exclude<
  DownstreamActiveProgramGuardKind,
  | "INVALID_INPUT"
  | "MULTIPLE_ACTIVE_PROGRAMS"
  | "ZERO_ACTIVE_PROGRAM"
  | "ACTIVE_PROGRAM_MISMATCH"
  | "GUARD_SATISFIED"
> | null {
  switch (comparison.kind) {
    case "INVALID_EXPECTED_SNAPSHOT":
    case "MISSING_OR_INVALID_CANDIDATE_SNAPSHOT":
    case "CROSS_PROGRAM_SUBSTITUTION":
    case "STALE_LIFECYCLE_VERSION":
    case "LIFECYCLE_VERSION_MISMATCH":
    case "GOVERNING_MOTION_MISMATCH":
    case "CONTRACT_VERSION_MISMATCH":
      return comparison.kind;
    case "EXACT_MATCH":
      return null;
  }
}

/**
 * Classifies a supplied portfolio and pair of binding snapshots without
 * selecting a source, changing lifecycle state, or granting authority.
 */
export function evaluateDownstreamActiveProgramGuard(
  input: unknown,
): DownstreamActiveProgramGuardResult {
  const values = readExactGuardInput(input);
  if (!values) {
    return createResult("INVALID_INPUT", null, null);
  }

  let activeResult: CanonicalActiveProgramResolverResult;
  try {
    activeResult = resolveCanonicalActiveProgram(values.portfolio);
  } catch {
    return createResult("INVALID_INPUT", null, null);
  }

  if (activeResult.kind === "INVALID_INPUT") {
    return createResult("INVALID_INPUT", null, null);
  }

  const activeProgram = cloneActiveProgram(activeResult);
  if (activeResult.kind === "ONE_ACTIVE" && !activeProgram) {
    return createResult("INVALID_INPUT", null, null);
  }

  let comparison: ProgramBindingComparisonResult;
  try {
    comparison = cloneBindingComparison(
      compareProgramBindingSnapshots(
        values.expectedBinding,
        values.candidateBinding,
      ),
    );
  } catch {
    return createResult("INVALID_INPUT", activeProgram, null);
  }

  const bindingKind = liftBindingKind(comparison);
  if (bindingKind) {
    return createResult(bindingKind, activeProgram, comparison);
  }

  switch (activeResult.kind) {
    case "MULTIPLE_ACTIVE":
      return createResult("MULTIPLE_ACTIVE_PROGRAMS", null, comparison);
    case "ZERO_ACTIVE":
      return createResult("ZERO_ACTIVE_PROGRAM", null, comparison);
    case "ONE_ACTIVE":
      if (
        !activeProgram ||
        !comparison.expectedBinding ||
        activeProgram.programId !== comparison.expectedBinding.programId
      ) {
        return createResult("ACTIVE_PROGRAM_MISMATCH", activeProgram, comparison);
      }
      return createResult("GUARD_SATISFIED", activeProgram, comparison);
  }
}

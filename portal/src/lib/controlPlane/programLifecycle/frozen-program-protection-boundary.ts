import { types } from "node:util";

import {
  evaluateDownstreamActiveProgramGuard,
  type DownstreamActiveProgramGuardKind,
  type DownstreamActiveProgramGuardResult,
} from "./downstream-active-program-guard";

const INPUT_KEYS = ["guardInput", "attemptedProgramId", "actionClass"] as const;
const PROGRAM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES = Object.freeze([
  "LIFECYCLE_MUTATION",
  "DOWNSTREAM_MUTATION",
] as const);

export type FrozenProgramProtectionActionClass =
  (typeof FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES)[number];

export type FrozenProgramProtectionKind =
  | Exclude<DownstreamActiveProgramGuardKind, "GUARD_SATISFIED">
  | "NON_ACTIVE_PROGRAM_ACTION_REJECTED"
  | "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED";

type ResultFor<Kind extends FrozenProgramProtectionKind> = Readonly<{
  readonly kind: Kind;
  readonly classificationOnly: true;
  readonly sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT";
  readonly authorityEffect: "NONE";
  readonly mutationCredit: "NONE";
  readonly mutationAuthorized: false;
  readonly mutationPerformed: false;
  readonly attemptedAction: Readonly<{
    readonly programId: string;
    readonly actionClass: FrozenProgramProtectionActionClass;
  }> | null;
  readonly guardResult: DownstreamActiveProgramGuardResult | null;
}>;

export type FrozenProgramProtectionResult = {
  [Kind in FrozenProgramProtectionKind]: ResultFor<Kind>;
}[FrozenProgramProtectionKind];

type InputValues = Readonly<{
  readonly guardInput: unknown;
  readonly attemptedProgramId: unknown;
  readonly actionClass: unknown;
}>;

function readExactInput(input: unknown): InputValues | null {
  try {
    if (typeof input !== "object" || input === null) {
      return null;
    }
    if (types.isProxy(input) || Array.isArray(input)) {
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
      guardInput: values.guardInput,
      attemptedProgramId: values.attemptedProgramId,
      actionClass: values.actionClass,
    };
  } catch {
    return null;
  }
}

function isActionClass(value: unknown): value is FrozenProgramProtectionActionClass {
  return (
    typeof value === "string" &&
    FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES.includes(
      value as FrozenProgramProtectionActionClass,
    )
  );
}

function isCanonicalProgramId(value: unknown): value is string {
  return typeof value === "string" && PROGRAM_ID_PATTERN.test(value);
}

function cloneGuardResult(
  result: DownstreamActiveProgramGuardResult,
): DownstreamActiveProgramGuardResult {
  const activeProgram = result.activeProgram
    ? Object.freeze({
        programId: result.activeProgram.programId,
        lifecycleState: result.activeProgram.lifecycleState,
      })
    : null;
  const bindingComparison = result.bindingComparison
    ? Object.freeze({
        kind: result.bindingComparison.kind,
        structurallyEqual: result.bindingComparison.structurallyEqual,
        expectedBinding: result.bindingComparison.expectedBinding
          ? Object.freeze({ ...result.bindingComparison.expectedBinding })
          : null,
        candidateBinding: result.bindingComparison.candidateBinding
          ? Object.freeze({ ...result.bindingComparison.candidateBinding })
          : null,
        authorityEffect: "NONE" as const,
      })
    : null;

  return Object.freeze({
    kind: result.kind,
    classificationOnly: true,
    sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT" as const,
    authorityEffect: "NONE" as const,
    mutationAuthorized: false,
    mutationPerformed: false,
    guardSatisfied: result.guardSatisfied,
    activeProgram,
    bindingComparison,
  }) as DownstreamActiveProgramGuardResult;
}

function createResult<Kind extends FrozenProgramProtectionKind>(
  kind: Kind,
  attemptedAction: ResultFor<Kind>["attemptedAction"],
  guardResult: DownstreamActiveProgramGuardResult | null,
): ResultFor<Kind> {
  return Object.freeze({
    kind,
    classificationOnly: true,
    sourcePosture: "SUPPLIED_EXPECTED_SNAPSHOT",
    authorityEffect: "NONE",
    mutationCredit: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
    attemptedAction,
    guardResult,
  }) as ResultFor<Kind>;
}

/**
 * Classifies whether a supplied attempted subject is the supplied active
 * Program. It does not invoke or permit an action of either class.
 */
export function evaluateFrozenProgramProtection(
  input: unknown,
): FrozenProgramProtectionResult {
  const values = readExactInput(input);
  if (!values) {
    return createResult("INVALID_INPUT", null, null);
  }

  const guardResult = cloneGuardResult(
    evaluateDownstreamActiveProgramGuard(values.guardInput),
  );
  if (guardResult.kind !== "GUARD_SATISFIED") {
    return createResult(guardResult.kind, null, guardResult);
  }

  if (!isCanonicalProgramId(values.attemptedProgramId) || !isActionClass(values.actionClass)) {
    return createResult("INVALID_INPUT", null, guardResult);
  }

  if (!guardResult.activeProgram) {
    return createResult("INVALID_INPUT", null, guardResult);
  }

  const attemptedAction = Object.freeze({
    programId: values.attemptedProgramId,
    actionClass: values.actionClass,
  });
  if (attemptedAction.programId !== guardResult.activeProgram.programId) {
    return createResult(
      "NON_ACTIVE_PROGRAM_ACTION_REJECTED",
      attemptedAction,
      guardResult,
    );
  }

  return createResult(
    "ACTIVE_PROGRAM_SUBJECT_CLASSIFIED",
    attemptedAction,
    guardResult,
  );
}

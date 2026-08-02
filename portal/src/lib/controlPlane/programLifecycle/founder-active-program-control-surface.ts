import {
  evaluateDownstreamActiveProgramGuard,
  type DownstreamActiveProgramGuardResult,
} from "./downstream-active-program-guard";
import {
  evaluateFrozenProgramProtection,
  FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES,
  type FrozenProgramProtectionResult,
} from "./frozen-program-protection-boundary";

export const FOUNDER_PROGRAM_SNAPSHOT = Object.freeze([
  Object.freeze({ id: "jai-governance-intelligence-main-state-operating-loop-v0", title: "Main-State Reconciliation and Minimum Viable Operating Loop v0", coordinate: "Q3M7Y26-P1", lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY", displayPosture: "ACTIVE — PLANNING ONLY", authority: "NONE" }),
  Object.freeze({ id: "jai-five-slot-compounded-reasoning-shadow-kernel-v0", title: "Five-Slot Compounded Reasoning Shadow Kernel v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" }),
  Object.freeze({ id: "jai-founder-developer-workflow-pilot-v0", title: "Founder Developer Workflow Pilot v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" }),
  Object.freeze({ id: "jai-agent-council-bounded-activation-pilot-v0", title: "Bounded JAI Agent and Council Activation Pilot v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" }),
] as const);

export type FounderActiveProgramControlSurfaceModel = Readonly<{
  readonly sourcePosture: "SUPPLIED_DOCUMENTARY_SNAPSHOT";
  readonly sourceArtifact: "A5 Active and Frozen Program Registry v0";
  readonly sourceRef: "c645be4d27cca2b2a0eb0f81d413f27df3493b00";
  readonly bindingAvailability: "UNAVAILABLE";
  readonly portfolio: typeof FOUNDER_PROGRAM_SNAPSHOT;
  readonly bindingClassification: DownstreamActiveProgramGuardResult;
  readonly actionClassifications: readonly FrozenProgramProtectionResult[];
  readonly eligibilityClassification: "INELIGIBLE";
  readonly classificationOnly: true;
  readonly authorityEffect: "NONE";
  readonly mutationCredit: "NONE";
  readonly mutationAuthorized: false;
  readonly mutationPerformed: false;
  readonly activationAuthorized: false;
  readonly activationPerformed: false;
}>;

function clonePortfolio() {
  return FOUNDER_PROGRAM_SNAPSHOT.map((program) => ({
    programId: program.id,
    lifecycleState: program.lifecycleState,
  }));
}

/** Builds a static A5-derived display model; it does not discover live state. */
export function buildFounderActiveProgramControlSurface(): FounderActiveProgramControlSurfaceModel {
  const portfolio = clonePortfolio();
  const guardInput = { portfolio, expectedBinding: null, candidateBinding: null };
  const bindingClassification = evaluateDownstreamActiveProgramGuard(guardInput);
  const actionClassifications = FROZEN_PROGRAM_PROTECTION_ACTION_CLASSES.map((actionClass) =>
    evaluateFrozenProgramProtection({
      guardInput,
      attemptedProgramId: FOUNDER_PROGRAM_SNAPSHOT[1].id,
      actionClass,
    }),
  );
  return Object.freeze({
    sourcePosture: "SUPPLIED_DOCUMENTARY_SNAPSHOT",
    sourceArtifact: "A5 Active and Frozen Program Registry v0",
    sourceRef: "c645be4d27cca2b2a0eb0f81d413f27df3493b00",
    bindingAvailability: "UNAVAILABLE",
    portfolio: FOUNDER_PROGRAM_SNAPSHOT,
    bindingClassification,
    actionClassifications: Object.freeze(actionClassifications),
    eligibilityClassification: "INELIGIBLE",
    classificationOnly: true,
    authorityEffect: "NONE",
    mutationCredit: "NONE",
    mutationAuthorized: false,
    mutationPerformed: false,
    activationAuthorized: false,
    activationPerformed: false,
  });
}

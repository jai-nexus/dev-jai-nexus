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
  Object.freeze({ id: "jai-governance-intelligence-main-state-operating-loop-v0", title: "Main-State Reconciliation and Minimum Viable Operating Loop v0", coordinate: "Q3M7Y26-P1", lifecycleState: "CLOSED_ACCEPTED", displayPosture: "Closed after ACTIVE — PLANNING ONLY", closeoutMainSha: "2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8", authority: "NONE" }),
  Object.freeze({ id: "jai-five-slot-compounded-reasoning-shadow-kernel-v0", title: "Five-Slot Compounded Reasoning Shadow Kernel v0", coordinate: "Q4M11Y26-P2", governing_motion_id: "motion-0248", activeExecutionLanes: 0, lifecycleState: "OPEN_FOR_BATCH_PLANNING_ONLY", displayPosture: "OPEN_FOR_BATCH_PLANNING_ONLY / ZERO_LANE_EXECUTION_GATES_GRANTED", authority: "NONE" }),
  Object.freeze({ id: "jai-founder-developer-workflow-pilot-v0", title: "Founder Developer Workflow Pilot v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" }),
  Object.freeze({ id: "jai-agent-council-bounded-activation-pilot-v0", title: "Bounded JAI Agent and Council Activation Pilot v0", coordinate: null, lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN", displayPosture: "FROZEN — NOT OPEN", authority: "NONE" }),
] as const);

export type FounderActiveProgramControlSurfaceModel = Readonly<{
  readonly sourcePosture: "SUPPLIED_DOCUMENTARY_SNAPSHOT";
  readonly sourceArtifact: "P1 closeout and accepted P2 Program opening (main documentary snapshot)";
  readonly sourceRef: "c0921ce771adece93c340f64605df77945cc467e";
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

/** Builds a static documentary display model; it does not discover live state. */
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
    sourceArtifact: "P1 closeout and accepted P2 Program opening (main documentary snapshot)",
    sourceRef: "c0921ce771adece93c340f64605df77945cc467e",
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

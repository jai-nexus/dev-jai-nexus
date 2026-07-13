import type { RouteDecisionSnapshot } from "./decisionSnapshot";

export const MOTION_INTAKE_MISSING_DRAFT_ERROR =
  "Missing motion intake draft. No motion was persisted, routed, approved, or executed.";

export const MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS = [
  "Persisted motion is not approved work.",
  "Persisted motion is not routed work.",
  "Persisted motion is not CONTROL_THREAD acceptance.",
  "Persisted motion is not autonomous execution.",
  "Persisted target thread is not route authority.",
  "Persisted repo target is not repo execution authority.",
  "Persisted evidence pointer is not validation approval.",
  "Selected persisted motion basis is not final authority.",
  "CONTROL_THREAD remains authority.",
  "Linear remains a temporary mirror only.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No auto-submit to agents.",
  "No auto-run deliberation.",
  "No auto-route work.",
  "No work-packet execution.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
] as const;

export interface MotionIntakeListBody<RecordValue, MotionBasisValue> {
  ok: true;
  records: RecordValue[];
  motionBases: MotionBasisValue[];
  nonAuthorizations: string[];
}

export interface MotionIntakeMissingDraftBody {
  ok: false;
  error: typeof MOTION_INTAKE_MISSING_DRAFT_ERROR;
  nonAuthorizations: string[];
}

export interface MotionIntakeCreateSuccessBody<
  RecordValue,
  MotionBasisValue,
> {
  ok: true;
  record: RecordValue;
  motionBasis: MotionBasisValue;
  nonAuthorizations: string[];
}

export type MotionIntakeListDecision<RecordValue, MotionBasisValue> =
  RouteDecisionSnapshot<
    200,
    MotionIntakeListBody<RecordValue, MotionBasisValue>
  >;

export type MotionIntakeMissingDraftDecision = RouteDecisionSnapshot<
  400,
  MotionIntakeMissingDraftBody
>;

export type MotionIntakeCreateSuccessDecision<
  RecordValue,
  MotionBasisValue,
> = RouteDecisionSnapshot<
  200,
  MotionIntakeCreateSuccessBody<RecordValue, MotionBasisValue>
>;

export type MotionIntakeCreateDecision<RecordValue, MotionBasisValue> =
  | MotionIntakeMissingDraftDecision
  | MotionIntakeCreateSuccessDecision<RecordValue, MotionBasisValue>;

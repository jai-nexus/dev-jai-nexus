import {
  MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
  routeDecisionNonAuthorizations,
} from "./routeDecisionNonAuthorizations";
import type {
  MotionIntakePersistenceResult,
  RouteDecisionSnapshot,
} from "./routeDecisionTypes";

interface MotionIntakeListBody<RecordValue, MotionBasisValue> {
  ok: true;
  records: RecordValue[];
  motionBases: MotionBasisValue[];
  nonAuthorizations: string[];
}

interface MotionIntakeCreateErrorBody {
  ok: false;
  error: string;
  nonAuthorizations: string[];
}

interface MotionIntakeCreateSuccessBody<RecordValue, MotionBasisValue> {
  ok: true;
  record: RecordValue;
  motionBasis: MotionBasisValue;
  nonAuthorizations: string[];
}

type MotionIntakeCreateBody<RecordValue, MotionBasisValue> =
  | MotionIntakeCreateErrorBody
  | MotionIntakeCreateSuccessBody<RecordValue, MotionBasisValue>;

export function decideMotionIntakeList<RecordValue, MotionBasisValue>(input: {
  records: RecordValue[];
  motionBases: MotionBasisValue[];
}): RouteDecisionSnapshot<MotionIntakeListBody<RecordValue, MotionBasisValue>> {
  return {
    status: 200,
    body: {
      ok: true,
      records: input.records,
      motionBases: input.motionBases,
      nonAuthorizations: routeDecisionNonAuthorizations(
        MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
      ),
    },
  };
}

export function decideMotionIntakeCreate<RecordValue, MotionBasisValue>(input: {
  draftPresent: boolean;
  persistenceResult?: MotionIntakePersistenceResult<RecordValue>;
  motionBasis?: MotionBasisValue;
}): RouteDecisionSnapshot<
  MotionIntakeCreateBody<RecordValue, MotionBasisValue>
> {
  if (!input.draftPresent) {
    return {
      status: 400,
      body: {
        ok: false,
        error:
          "Missing motion intake draft. No motion was persisted, routed, approved, or executed.",
        nonAuthorizations: routeDecisionNonAuthorizations(
          MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
        ),
      },
    };
  }

  const persistenceResult = requirePersistenceResult(input);
  const motionBasis = requireMotionBasis(input);
  return {
    status: 200,
    body: {
      ok: true,
      record: persistenceResult.record,
      motionBasis,
      nonAuthorizations: routeDecisionNonAuthorizations(
        MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
      ),
    },
  };
}

function requireMotionBasis<MotionBasisValue>(input: {
  motionBasis?: MotionBasisValue;
}): MotionBasisValue {
  if (input.motionBasis === undefined) {
    throw new Error("Expected injected motion intake basis.");
  }
  return input.motionBasis;
}

function requirePersistenceResult<RecordValue>(input: {
  persistenceResult?: MotionIntakePersistenceResult<RecordValue>;
}): MotionIntakePersistenceResult<RecordValue> {
  if (!input.persistenceResult) {
    throw new Error("Expected injected motion intake persistence result.");
  }
  return input.persistenceResult;
}

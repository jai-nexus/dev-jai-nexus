import {
  routeDecisionNonAuthorizations,
} from "./routeDecisionNonAuthorizations";
import type {
  MotionIntakePersistenceResult,
  RouteDecisionNonAuthorizations,
  RouteDecisionSnapshot,
} from "./routeDecisionTypes";

interface MotionIntakeListBody<RecordValue, MotionBasisValue> {
  ok: true;
  records: RecordValue[];
  motionBases: MotionBasisValue[];
  nonAuthorizations: string[];
}

interface MotionIntakeCreateBody<RecordValue, MotionBasisValue> {
  ok: boolean;
  record?: RecordValue;
  motionBasis?: MotionBasisValue;
  error?: string;
  persistence?: MotionIntakePersistenceResult<RecordValue>["persistence"];
  nonAuthorizations: string[];
}

export function decideMotionIntakeList<RecordValue, MotionBasisValue>(input: {
  records: RecordValue[];
  motionBases: MotionBasisValue[];
  nonAuthorizations?: RouteDecisionNonAuthorizations;
}): RouteDecisionSnapshot<MotionIntakeListBody<RecordValue, MotionBasisValue>> {
  return {
    status: 200,
    body: {
      ok: true,
      records: input.records,
      motionBases: input.motionBases,
      nonAuthorizations: routeDecisionNonAuthorizations(
        input.nonAuthorizations,
      ),
    },
  };
}

export function decideMotionIntakeCreate<RecordValue, MotionBasisValue>(input: {
  draftPresent: boolean;
  persistenceResult?: MotionIntakePersistenceResult<RecordValue>;
  motionBasis?: MotionBasisValue;
  nonAuthorizations?: RouteDecisionNonAuthorizations;
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
          input.nonAuthorizations,
        ),
      },
    };
  }

  const persistenceResult = requirePersistenceResult(input);
  return {
    status: 200,
    body: {
      ok: true,
      record: persistenceResult.record,
      motionBasis: input.motionBasis,
      persistence: persistenceResult.persistence,
      nonAuthorizations: routeDecisionNonAuthorizations(
        persistenceResult.nonAuthorizations ?? input.nonAuthorizations,
      ),
    },
  };
}

function requirePersistenceResult<RecordValue>(input: {
  persistenceResult?: MotionIntakePersistenceResult<RecordValue>;
}): MotionIntakePersistenceResult<RecordValue> {
  if (!input.persistenceResult) {
    throw new Error("Expected injected motion intake persistence result.");
  }
  return input.persistenceResult;
}

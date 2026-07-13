import type { MotionIntakePersistenceResult } from "../routeContracts/adapters/motionIntake";
import {
  MOTION_INTAKE_MISSING_DRAFT_ERROR,
  MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS,
} from "../routeContracts/motionIntakeResponses";
import type {
  MotionIntakeCreateDecision,
  MotionIntakeListDecision,
} from "../routeContracts/motionIntakeResponses";

export function decideMotionIntakeList<RecordValue, MotionBasisValue>(input: {
  records: RecordValue[];
  motionBases: MotionBasisValue[];
}): MotionIntakeListDecision<RecordValue, MotionBasisValue> {
  return {
    status: 200,
    body: {
      ok: true,
      records: input.records,
      motionBases: input.motionBases,
      nonAuthorizations: motionIntakeNonAuthorizations(),
    },
  };
}

export function decideMotionIntakeCreate<RecordValue, MotionBasisValue>(
  input:
    | { draftPresent: false }
    | {
        draftPresent: true;
        persistenceResult: MotionIntakePersistenceResult<RecordValue>;
        motionBasis: MotionBasisValue;
      },
): MotionIntakeCreateDecision<RecordValue, MotionBasisValue> {
  if (!input.draftPresent) {
    return {
      status: 400,
      body: {
        ok: false,
        error: MOTION_INTAKE_MISSING_DRAFT_ERROR,
        nonAuthorizations: motionIntakeNonAuthorizations(),
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      record: input.persistenceResult.record,
      motionBasis: input.motionBasis,
      nonAuthorizations: motionIntakeNonAuthorizations(),
    },
  };
}

function motionIntakeNonAuthorizations(): string[] {
  return [...MOTION_INTAKE_ROUTE_NON_AUTHORIZATIONS];
}

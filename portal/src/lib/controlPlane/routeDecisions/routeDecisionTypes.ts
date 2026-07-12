export type RouteDecisionNonAuthorizations = readonly string[];

export interface RouteDecisionSnapshot<Body> {
  status: number;
  body: Body;
}

export interface RouteDecisionPersistenceStatus {
  available?: boolean;
  status?: string;
  safeMessage?: string;
  safeAdvisoryMessage?: string;
  id?: string;
  createdAt?: string;
}

export interface PassalongPersistenceResult<RecordValue = unknown> {
  available?: boolean;
  record: RecordValue | null;
  records?: RecordValue[];
  errors: string[];
  safeMessage?: string;
  persistence?: {
    available: boolean;
    safeMessage: string;
  };
  nonAuthorizations: RouteDecisionNonAuthorizations;
}

export interface MotionIntakePersistenceResult<RecordValue = unknown> {
  record: RecordValue;
  persistence?: RouteDecisionPersistenceStatus;
  nonAuthorizations?: RouteDecisionNonAuthorizations;
}

export interface RouteDecisionProviderResult<StatusValue = unknown> {
  status: StatusValue;
  nonAuthorityDisclaimer: string;
  providerDispatchAttempted: boolean;
  networkAccessRequired: boolean;
  nonAuthorizations: RouteDecisionNonAuthorizations;
}

export interface RouteDecisionHistoryPersistenceResult {
  persisted: boolean;
  persistence: RouteDecisionPersistenceStatus;
  nonAuthorizations: RouteDecisionNonAuthorizations;
}

export interface ManualInferenceParticipantOutput {
  roleSlotId: string;
  [key: string]: unknown;
}

export interface ManualInferenceConnectorStatus<StatusValue = unknown> {
  roleSlotId: string;
  status: StatusValue;
  nonAuthorityDisclaimer: string;
}

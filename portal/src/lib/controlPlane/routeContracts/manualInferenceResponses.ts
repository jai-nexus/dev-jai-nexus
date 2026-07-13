import type { RouteDecisionSnapshot } from "./decisionSnapshot";

export const MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS = [
  "JAI vote is not CONTROL_THREAD approval.",
  "JAI ratification is not final authority.",
  "Human / CONTROL_THREAD approval remains required.",
  "No autonomous execution.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No production gate opening.",
  "No source-of-truth transfer.",
  "No hidden background execution.",
  "No automatic route execution.",
  "No work-packet execution.",
  "Provider output is advisory only.",
  "Provider connector is server-side only.",
  "Provider mode is disabled by default.",
  "Mock mode remains default.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
] as const;

export interface ManualInferenceConnectorStatus<StatusValue> {
  roleSlotId: string;
  status: StatusValue;
  nonAuthorityDisclaimer: string;
}

export interface ManualInferencePersistenceBody<PersistenceStatus extends string> {
  id: string;
  status: PersistenceStatus;
  safeAdvisoryMessage: string;
  createdAt: string;
}

export interface ManualInferenceResponseBody<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer,
  PersistenceStatus extends string,
> {
  ok: true;
  persisted: boolean;
  operatorTriggeredOnly: true;
  providerStatus: ProviderStatusValue;
  persistence: ManualInferencePersistenceBody<PersistenceStatus>;
  connectorStatuses: Array<
    ManualInferenceConnectorStatus<ProviderStatusValue>
  >;
  participantOutputs: ParticipantOutput[];
  aggregateRatification: AggregateRatification;
  evidencePointers: EvidencePointer[];
  nonAuthorizations: string[];
}

export type ManualInferenceDecision<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer,
  PersistenceStatus extends string,
> = RouteDecisionSnapshot<
  200,
  ManualInferenceResponseBody<
    ProviderStatusValue,
    ParticipantOutput,
    AggregateRatification,
    EvidencePointer,
    PersistenceStatus
  >
>;

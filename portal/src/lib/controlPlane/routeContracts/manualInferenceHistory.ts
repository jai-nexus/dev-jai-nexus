export const MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS = [
  "Stored deliberation is not CONTROL_THREAD approval.",
  "Stored JAI vote is not route authority.",
  "Stored ratification is not final authority.",
  "Stored provider output is not source-of-truth transfer.",
  "Stored evidence pointer is not validation approval.",
  "Stored work-packet draft is not routed work.",
  "Human / CONTROL_THREAD approval remains required.",
  "Persistence does not create execution authority.",
  "Persistence does not create GitHub mutation authority.",
  "Persistence does not create production gate authority.",
  "Persistence does not create source-of-truth authority.",
  "Persistence does not create route authority.",
  "Persistence does not create acceptance authority.",
  "No provider API key persistence.",
  "No provider API key exposure.",
  "No provider secret storage.",
] as const;

export const MANUAL_INFERENCE_HISTORY_SOURCE_MODES = [
  "mock",
  "provider",
  "provider_disabled",
  "provider_unavailable",
  "persistence_staged",
] as const;

export type ManualInferenceHistorySourceMode =
  (typeof MANUAL_INFERENCE_HISTORY_SOURCE_MODES)[number];

export interface ManualInferenceHistoryInput<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer,
> {
  motionId: string;
  motionTitle: string;
  sourceMode: ManualInferenceHistorySourceMode;
  connectorStatusSummary: ProviderStatusValue;
  participantOutputs: ParticipantOutput[];
  aggregateAdvisoryRatification: AggregateRatification;
  evidencePointers: EvidencePointer[];
  nonAuthorizations: string[];
}

export interface NonDispatchedProviderResult<StatusValue> {
  status: StatusValue;
  nonAuthorityDisclaimer: string;
  dispatchAttempted: false;
  networkAccessRequired: false;
}

export type ManualInferenceProviderResult<StatusValue, ParticipantOutput> =
  | (NonDispatchedProviderResult<StatusValue> & {
      kind: "provider_disabled";
    })
  | (NonDispatchedProviderResult<StatusValue> & {
      kind: "provider_configuration_missing";
    })
  | (NonDispatchedProviderResult<StatusValue> & {
      kind: "provider_not_dispatched_error";
      reason: string;
    })
  | {
      kind: "provider_executed";
      status: StatusValue;
      participantOutput: ParticipantOutput;
      nonAuthorityDisclaimer: string;
      dispatchAttempted: true;
      networkAccessRequired: true;
      outcome: "succeeded" | "failed" | "malformed";
    };

export type ManualInferenceHistoryPersistenceResult =
  | {
      kind: "persisted";
      persisted: true;
      durableId: string;
      status: "persisted";
      safeAdvisoryMessage: string;
      createdAt: string;
    }
  | {
      kind: "blocked";
      persisted: false;
      previewId: string;
      status: "blocked";
      safeAdvisoryMessage: string;
      createdAt: string;
    }
  | {
      kind: "unavailable";
      persisted: false;
      previewId: string;
      status: "blocked";
      safeAdvisoryMessage: string;
      createdAt: string;
      reason: string;
    };

import type {
  ManualInferenceHistoryPersistenceResult,
  ManualInferenceProviderResult,
} from "../routeContracts/adapters/manualInference";
import {
  MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
} from "../routeContracts/manualInferenceHistory";
import type {
  ManualInferenceHistoryInput,
  ManualInferenceHistorySourceMode,
} from "../routeContracts/manualInferenceHistory";
import {
  MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
} from "../routeContracts/manualInferenceResponses";
import type {
  ManualInferenceConnectorStatus,
  ManualInferenceDecision,
} from "../routeContracts/manualInferenceResponses";

export function decideManualInferenceRun<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer,
>(input: {
  provider: ManualInferenceProviderResult<
    ProviderStatusValue,
    ParticipantOutput
  >;
  historyPersistence: ManualInferenceHistoryPersistenceResult;
  participantOutputs: ParticipantOutput[];
  connectorStatuses: Array<
    ManualInferenceConnectorStatus<ProviderStatusValue>
  >;
  aggregateRatification: AggregateRatification;
  evidencePointers: EvidencePointer[];
}): ManualInferenceDecision<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer,
  "persisted" | "blocked"
> {
  return {
    status: 200,
    body: {
      ok: true,
      persisted: input.historyPersistence.persisted,
      operatorTriggeredOnly: true,
      providerStatus: input.provider.status,
      persistence: mapHistoryPersistence(input.historyPersistence),
      connectorStatuses: input.connectorStatuses.map((connectorStatus) => ({
        roleSlotId: connectorStatus.roleSlotId,
        status: connectorStatus.status,
        nonAuthorityDisclaimer: connectorStatus.nonAuthorityDisclaimer,
      })),
      participantOutputs: input.participantOutputs,
      aggregateRatification: input.aggregateRatification,
      evidencePointers: input.evidencePointers,
      nonAuthorizations: [...MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS],
    },
  };
}

export function buildManualInferenceHistoryInput<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer,
>(input: {
  motionId: string;
  motionTitle: string;
  sourceMode: ManualInferenceHistorySourceMode;
  provider: ManualInferenceProviderResult<
    ProviderStatusValue,
    ParticipantOutput
  >;
  participantOutputs: ParticipantOutput[];
  aggregateRatification: AggregateRatification;
  evidencePointers: EvidencePointer[];
}): ManualInferenceHistoryInput<
  ProviderStatusValue,
  ParticipantOutput,
  AggregateRatification,
  EvidencePointer
> {
  return {
    motionId: input.motionId,
    motionTitle: input.motionTitle,
    sourceMode: input.sourceMode,
    connectorStatusSummary: input.provider.status,
    participantOutputs: input.participantOutputs,
    aggregateAdvisoryRatification: input.aggregateRatification,
    evidencePointers: input.evidencePointers,
    nonAuthorizations: [...MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS],
  };
}

function mapHistoryPersistence(
  result: ManualInferenceHistoryPersistenceResult,
) {
  return {
    id: result.kind === "persisted" ? result.durableId : result.previewId,
    status: result.status,
    safeAdvisoryMessage: result.safeAdvisoryMessage,
    createdAt: result.createdAt,
  };
}

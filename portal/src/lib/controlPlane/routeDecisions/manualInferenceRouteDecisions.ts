import {
  MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
  MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
  routeDecisionNonAuthorizations,
} from "./routeDecisionNonAuthorizations";
import type {
  ManualInferenceConnectorStatus,
  ManualInferenceParticipantOutput,
  RouteDecisionHistoryPersistenceResult,
  RouteDecisionNonAuthorizations,
  RouteDecisionProviderResult,
  RouteDecisionSnapshot,
} from "./routeDecisionTypes";

export interface ManualInferenceHistoryInput<ProviderStatusValue = unknown> {
  motionId: string;
  motionTitle: string;
  sourceMode: string;
  connectorStatusSummary: ProviderStatusValue;
  participantOutputs: ManualInferenceParticipantOutput[];
  aggregateAdvisoryRatification: unknown;
  evidencePointers: unknown[];
  nonAuthorizations: string[];
}

interface ManualInferenceDecisionBody<ProviderStatusValue> {
  ok: true;
  persisted: boolean;
  operatorTriggeredOnly: true;
  providerStatus: ProviderStatusValue;
  persistence: RouteDecisionHistoryPersistenceResult["persistence"];
  connectorStatuses: Array<ManualInferenceConnectorStatus<ProviderStatusValue>>;
  participantOutputs: ManualInferenceParticipantOutput[];
  aggregateRatification: unknown;
  evidencePointers: unknown[];
  nonAuthorizations: string[];
}

export function decideManualInferenceRun<ProviderStatusValue>(input: {
  provider: RouteDecisionProviderResult<ProviderStatusValue>;
  historyPersistence: RouteDecisionHistoryPersistenceResult;
  participantOutputs: ManualInferenceParticipantOutput[];
  connectorStatuses: Array<ManualInferenceConnectorStatus<ProviderStatusValue>>;
  aggregateRatification: unknown;
  evidencePointers: unknown[];
  nonAuthorizations?: RouteDecisionNonAuthorizations;
}): RouteDecisionSnapshot<ManualInferenceDecisionBody<ProviderStatusValue>> {
  return {
    status: 200,
    body: {
      ok: true,
      persisted: input.historyPersistence.persisted,
      operatorTriggeredOnly: true,
      providerStatus: input.provider.status,
      persistence: input.historyPersistence.persistence,
      connectorStatuses: input.connectorStatuses.map((connectorStatus) => ({
        roleSlotId: connectorStatus.roleSlotId,
        status: connectorStatus.status,
        nonAuthorityDisclaimer: connectorStatus.nonAuthorityDisclaimer,
      })),
      participantOutputs: input.participantOutputs,
      aggregateRatification: input.aggregateRatification,
      evidencePointers: input.evidencePointers,
      nonAuthorizations: routeDecisionNonAuthorizations(
        input.nonAuthorizations ?? MANUAL_INFERENCE_RESPONSE_NON_AUTHORIZATIONS,
      ),
    },
  };
}

export function buildManualInferenceHistoryInput<ProviderStatusValue>(input: {
  motionId: string;
  motionTitle: string;
  sourceMode: string;
  provider: RouteDecisionProviderResult<ProviderStatusValue>;
  participantOutputs: ManualInferenceParticipantOutput[];
  aggregateRatification: unknown;
  evidencePointers: unknown[];
  nonAuthorizations?: RouteDecisionNonAuthorizations;
}): ManualInferenceHistoryInput<ProviderStatusValue> {
  return {
    motionId: input.motionId,
    motionTitle: input.motionTitle,
    sourceMode: input.sourceMode,
    connectorStatusSummary: input.provider.status,
    participantOutputs: input.participantOutputs,
    aggregateAdvisoryRatification: input.aggregateRatification,
    evidencePointers: input.evidencePointers,
    nonAuthorizations: routeDecisionNonAuthorizations(
      input.nonAuthorizations ?? MANUAL_INFERENCE_HISTORY_NON_AUTHORIZATIONS,
    ),
  };
}

import type { RouteDecisionSnapshot } from "./decisionSnapshot";

export const PASSALONG_INVALID_CREATE_ERROR =
  "Passalong field boundary validation blocked persistence; no record was saved.";

export const PASSALONG_DETAIL_METHOD_NOT_ALLOWED_ERROR =
  "Direct passalong mutation endpoint supports PATCH only. It does not send, route, execute, or approve passalongs.";

export const PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS = [
  "Persisted passalong record is app-local and non-authoritative.",
  "Persisted passalong record is not source of truth.",
  "Persisted passalong record is not CONTROL_THREAD acceptance.",
  "Persisted route status is descriptive metadata only.",
  "Persisted route status is not route authority.",
  "Persisted lifecycle state does not alter CONTROL_THREAD decisions.",
  "Evidence pointer references are not validation approval.",
  "Manual notes are not route authority.",
  "CONTROL_THREAD remains authority.",
  "Linear remains temporary mirror only.",
  "No automatic passalong sending.",
  "No automatic route execution.",
  "No JAI Agent activation.",
  "No Agent PR Factory activation.",
  "No sandbox runtime activation.",
  "No sandbox task execution.",
  "No target-repo import.",
  "No GitHub mutation.",
  "No PR creation.",
  "No branch mutation.",
  "No merge action.",
  "No branch deletion.",
  "No deployment.",
  "No production gate opening.",
  "No source-of-truth transfer.",
] as const;

export interface PassalongPersistenceSummary {
  available: boolean;
  safeMessage: string;
}

export interface PassalongCollectionListBody<RecordValue> {
  ok: boolean;
  records: RecordValue[];
  persistence: PassalongPersistenceSummary;
  nonAuthorizations: string[];
}

export interface PassalongInvalidCreateBody {
  ok: false;
  error: typeof PASSALONG_INVALID_CREATE_ERROR;
  errors: string[];
  nonAuthorizations: string[];
}

export interface PassalongWriteSuccessBody<RecordValue> {
  ok: true;
  record: RecordValue;
  errors: string[];
  persistence: PassalongPersistenceSummary;
  nonAuthorizations: string[];
}

export interface PassalongWriteFailureBody {
  ok: false;
  record: null;
  errors: string[];
  persistence: PassalongPersistenceSummary;
  nonAuthorizations: string[];
}

export interface PassalongDetailMethodNotAllowedBody {
  ok: false;
  error: typeof PASSALONG_DETAIL_METHOD_NOT_ALLOWED_ERROR;
  nonAuthorizations: string[];
}

export type PassalongCollectionListDecision<RecordValue> =
  RouteDecisionSnapshot<200, PassalongCollectionListBody<RecordValue>>;

export type PassalongInvalidCreateDecision = RouteDecisionSnapshot<
  400,
  PassalongInvalidCreateBody
>;

export type PassalongWriteDecision<RecordValue> =
  | RouteDecisionSnapshot<200, PassalongWriteSuccessBody<RecordValue>>
  | RouteDecisionSnapshot<400, PassalongWriteFailureBody>;

export type PassalongCollectionCreateDecision<RecordValue> =
  | PassalongInvalidCreateDecision
  | PassalongWriteDecision<RecordValue>;

export type PassalongDetailMethodNotAllowedDecision = RouteDecisionSnapshot<
  405,
  PassalongDetailMethodNotAllowedBody
>;

export type PassalongDetailPatchDecision<RecordValue> =
  PassalongWriteDecision<RecordValue>;

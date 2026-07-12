import {
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  routeDecisionNonAuthorizations,
} from "./routeDecisionNonAuthorizations";
import type {
  PassalongPersistenceResult,
  RouteDecisionSnapshot,
} from "./routeDecisionTypes";

interface PassalongValidationResult<Value = unknown> {
  ok: boolean;
  value?: Value | null;
  errors: string[];
}

interface PassalongCollectionListBody<RecordValue> {
  ok: boolean;
  records: RecordValue[];
  persistence: {
    available: boolean;
    safeMessage: string;
  };
  nonAuthorizations: string[];
}

interface PassalongValidationErrorBody {
  ok: false;
  error: string;
  errors: string[];
  nonAuthorizations: string[];
}

interface PassalongPersistenceWriteBody<RecordValue> {
  ok: boolean;
  record: RecordValue | null;
  errors: string[];
  persistence: {
    available: boolean;
    safeMessage: string;
  };
  nonAuthorizations: string[];
}

type PassalongCollectionCreateBody<RecordValue> =
  | PassalongValidationErrorBody
  | PassalongPersistenceWriteBody<RecordValue>;

export function decidePassalongCollectionList<RecordValue>(
  result: PassalongPersistenceResult<RecordValue>,
): RouteDecisionSnapshot<PassalongCollectionListBody<RecordValue>> {
  return {
    status: 200,
    body: {
      ok: readPassalongPersistence(result).available,
      records: result.records ?? [],
      persistence: readPassalongPersistence(result),
      nonAuthorizations: routeDecisionNonAuthorizations(
        PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
      ),
    },
  };
}

export function decidePassalongCollectionCreate<RecordValue>(input: {
  candidate: PassalongValidationResult;
  persistenceResult?: PassalongPersistenceResult<RecordValue>;
}): RouteDecisionSnapshot<PassalongCollectionCreateBody<RecordValue>> {
  if (!input.candidate.ok || !input.candidate.value) {
    return {
      status: 400,
      body: {
        ok: false,
        error:
          "Passalong field boundary validation blocked persistence; no record was saved.",
        errors: input.candidate.errors,
        nonAuthorizations: routeDecisionNonAuthorizations(
          PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
        ),
      },
    };
  }

  return mapPassalongWriteResult(requirePersistenceResult(input));
}

export function decidePassalongDetailMethodNotAllowed(
): RouteDecisionSnapshot<{
  ok: false;
  error: string;
  nonAuthorizations: string[];
}> {
  return {
    status: 405,
    body: {
      ok: false,
      error:
        "Direct passalong mutation endpoint supports PATCH only. It does not send, route, execute, or approve passalongs.",
      nonAuthorizations: routeDecisionNonAuthorizations(
        PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
      ),
    },
  };
}

export function decidePassalongDetailPatch<RecordValue>(
  result: PassalongPersistenceResult<RecordValue>,
): RouteDecisionSnapshot<PassalongPersistenceWriteBody<RecordValue>> {
  return mapPassalongWriteResult(result);
}

function mapPassalongWriteResult<RecordValue>(
  result: PassalongPersistenceResult<RecordValue>,
): RouteDecisionSnapshot<PassalongPersistenceWriteBody<RecordValue>> {
  return {
    status: result.record ? 200 : 400,
    body: {
      ok: readPassalongPersistence(result).available && Boolean(result.record),
      record: result.record,
      errors: result.errors,
      persistence: readPassalongPersistence(result),
      nonAuthorizations: routeDecisionNonAuthorizations(
        PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
      ),
    },
  };
}

function readPassalongPersistence(result: PassalongPersistenceResult) {
  return {
    available: result.persistence?.available ?? result.available ?? false,
    safeMessage: result.persistence?.safeMessage ?? result.safeMessage ?? "",
  };
}

function requirePersistenceResult<RecordValue>(input: {
  persistenceResult?: PassalongPersistenceResult<RecordValue>;
}): PassalongPersistenceResult<RecordValue> {
  if (!input.persistenceResult) {
    throw new Error("Expected injected passalong persistence result.");
  }
  return input.persistenceResult;
}

import type {
  PassalongListResult,
  PassalongWriteResult,
} from "../routeContracts/adapters/passalong";
import {
  PASSALONG_DETAIL_METHOD_NOT_ALLOWED_ERROR,
  PASSALONG_INVALID_CREATE_ERROR,
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
} from "../routeContracts/passalongResponses";
import type {
  PassalongCollectionCreateDecision,
  PassalongCollectionListDecision,
  PassalongDetailMethodNotAllowedDecision,
  PassalongDetailPatchDecision,
  PassalongWriteDecision,
} from "../routeContracts/passalongResponses";

interface PassalongValidationResult<Value = unknown> {
  ok: boolean;
  value?: Value | null;
  errors: string[];
}

export function decidePassalongCollectionList<RecordValue>(
  result: PassalongListResult<RecordValue>,
): PassalongCollectionListDecision<RecordValue> {
  return {
    status: 200,
    body: {
      ok: result.kind === "available",
      records: result.records,
      persistence: {
        available: result.kind === "available",
        safeMessage: result.safeMessage,
      },
      nonAuthorizations: passalongNonAuthorizations(),
    },
  };
}

export function decidePassalongCollectionCreate<RecordValue>(input: {
  candidate: PassalongValidationResult;
  persistenceResult?: PassalongWriteResult<RecordValue>;
}): PassalongCollectionCreateDecision<RecordValue> {
  if (!input.candidate.ok || !input.candidate.value) {
    return {
      status: 400,
      body: {
        ok: false,
        error: PASSALONG_INVALID_CREATE_ERROR,
        errors: input.candidate.errors,
        nonAuthorizations: passalongNonAuthorizations(),
      },
    };
  }

  if (!input.persistenceResult) {
    throw new Error("Expected normalized passalong write result.");
  }
  return mapPassalongWriteResult(input.persistenceResult);
}

export function decidePassalongDetailMethodNotAllowed(): PassalongDetailMethodNotAllowedDecision {
  return {
    status: 405,
    body: {
      ok: false,
      error: PASSALONG_DETAIL_METHOD_NOT_ALLOWED_ERROR,
      nonAuthorizations: passalongNonAuthorizations(),
    },
  };
}

export function decidePassalongDetailPatch<RecordValue>(
  result: PassalongWriteResult<RecordValue>,
): PassalongDetailPatchDecision<RecordValue> {
  return mapPassalongWriteResult(result);
}

function mapPassalongWriteResult<RecordValue>(
  result: PassalongWriteResult<RecordValue>,
): PassalongWriteDecision<RecordValue> {
  if (result.kind === "succeeded") {
    return {
      status: 200,
      body: {
        ok: true,
        record: result.record,
        errors: result.errors,
        persistence: {
          available: true,
          safeMessage: result.safeMessage,
        },
        nonAuthorizations: passalongNonAuthorizations(),
      },
    };
  }

  return {
    status: 400,
    body: {
      ok: false,
      record: null,
      errors: result.errors,
      persistence: {
        available: false,
        safeMessage: result.safeMessage,
      },
      nonAuthorizations: passalongNonAuthorizations(),
    },
  };
}

function passalongNonAuthorizations(): string[] {
  return [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS];
}

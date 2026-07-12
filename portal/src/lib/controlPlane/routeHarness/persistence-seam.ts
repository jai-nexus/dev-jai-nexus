import { ROUTE_HARNESS_NON_AUTHORIZATIONS } from "./fixtures";

export interface PersistenceUnavailableStatus {
  available: false;
  safeMessage: string;
}

export interface PersistenceUnavailableResult {
  ok: false;
  record: null;
  records?: unknown[];
  errors: string[];
  persistence: PersistenceUnavailableStatus;
  nonAuthorizations: string[];
}

export function createPassalongPersistenceUnavailableList():
  PersistenceUnavailableResult {
  return {
    ok: false,
    record: null,
    records: [],
    errors: ["Persistence table or database access is unavailable."],
    persistence: {
      available: false,
      safeMessage:
        "Passalong persistence is unavailable; no database read was completed.",
    },
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  };
}

export function createPassalongPersistenceUnavailableWrite():
  PersistenceUnavailableResult {
  return {
    ok: false,
    record: null,
    errors: ["Persistence table or database access is unavailable."],
    persistence: {
      available: false,
      safeMessage:
        "Passalong persistence is unavailable; no database write was completed.",
    },
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  };
}

export function createMotionIntakePersistenceUnavailable() {
  return {
    ok: true,
    record: {
      id: "motion-intake-persistence-blocked-preview",
      intakeState: "draft",
      authorityState: "non_authoritative",
      advisoryOnly: true,
      safeAdvisoryMessage:
        "Motion intake persistence is blocked; table or database access is unavailable. Record remains non-authoritative.",
    },
    persistence: {
      available: false,
      safeMessage:
        "Motion intake persistence is blocked; no deployed database was used.",
    },
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  };
}

export function createDeliberationHistoryPersistenceUnavailable() {
  return {
    ok: true,
    persisted: false,
    persistence: {
      id: "deliberation-run-history-persistence-blocked-preview",
      status: "blocked",
      safeAdvisoryMessage:
        "Deliberation run history persistence is blocked; table or database access is unavailable. Run remains staged and non-authorizing.",
    },
    nonAuthorizations: [...ROUTE_HARNESS_NON_AUTHORIZATIONS],
  };
}

export function assertPersistenceUnavailable(value: {
  persistence?: { available?: boolean; status?: string };
}) {
  const persistence = value.persistence;
  if (!persistence) {
    throw new Error("Expected persistence result to include persistence field.");
  }
  if (persistence.available !== false && persistence.status !== "blocked") {
    throw new Error("Expected persistence seam to remain unavailable/blocked.");
  }
}

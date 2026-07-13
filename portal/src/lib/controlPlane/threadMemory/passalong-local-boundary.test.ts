import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildPersistedPassalongInput,
  PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS,
  validatePersistedPassalongCreateInput,
  validatePersistedPassalongPatchInput,
  type PersistedPassalongCreateInput,
} from "./passalong-persistence-boundary";
import { PASSALONG_RECORDS } from "./sample-data";
import {
  PASSALONG_ARCHIVE_STATES,
  PASSALONG_REDACTION_STATES,
  PASSALONG_ROUTE_STATUSES,
  type PassalongArchiveState,
  type PassalongRedactionState,
  type PassalongRouteStatus,
} from "./types";

const baseInput: PersistedPassalongCreateInput = {
  passalongId: "a28-local-boundary-fixture",
  sourceThreadId: "thread-control-thread",
  targetThreadId: "thread-dev-jai-nexus",
  sourceThreadLabel: "CONTROL_THREAD",
  targetThreadLabel: "dev-jai-nexus",
  scope: "A28 local boundary test fixture",
  mode: "LOCAL_ONLY / MOCKS_AND_FIXTURES",
  summary: "Minimized non-secret passalong summary.",
  evidencePointers: [
    "docs/reference/q3m7-control-thread-passalong-local-boundary-test-plan-v0.md",
  ],
  requestedDecision: "Review local-only passalong persistence boundary tests.",
  routeStatus: "queued",
  authorityBoundary:
    "Persisted passalong record is app-local and non-authoritative.",
  nonAuthorizations: [...PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS],
  sandboxPosture: "sandbox-nexus target option only; not activation",
  importAdoptionPosture: "archive",
  manualOperatorNote: "Minimized non-secret operator note.",
  archiveState: "active",
  redactionState: "not_required",
  archivedAt: null,
  deletedAt: null,
};

function withInput(
  patch: Partial<PersistedPassalongCreateInput>,
): PersistedPassalongCreateInput {
  return { ...baseInput, ...patch };
}

function expectCreateOk(
  input: Partial<PersistedPassalongCreateInput> = {},
): PersistedPassalongCreateInput {
  const result = validatePersistedPassalongCreateInput(withInput(input));
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.ok(result.value, "Expected a validated persistence value.");
  return result.value;
}

function expectCreateBlocked(
  input: Partial<PersistedPassalongCreateInput>,
): string[] {
  const result = validatePersistedPassalongCreateInput(withInput(input));
  assert.equal(result.ok, false, "Expected create validation to block input.");
  assert.ok(result.errors.length > 0, "Expected blocking errors.");
  return result.errors;
}

function expectPatchOk(input: unknown) {
  const result = validatePersistedPassalongPatchInput(input);
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.ok(result.value, "Expected a validated patch value.");
  return result.value;
}

function expectPatchBlocked(input: unknown): string[] {
  const result = validatePersistedPassalongPatchInput(input);
  assert.equal(result.ok, false, "Expected patch validation to block input.");
  assert.ok(result.errors.length > 0, "Expected blocking errors.");
  return result.errors;
}

function assertIncludesAll(source: string, expected: string[]) {
  for (const value of expected) {
    assert.ok(source.includes(value), `Expected source to include: ${value}`);
  }
}

function assertExcludesAll(source: string, forbidden: string[]) {
  for (const value of forbidden) {
    assert.ok(!source.includes(value), `Expected source to exclude: ${value}`);
  }
}

function normalizeWhitespace(source: string): string {
  return source.replace(/\s+/g, " ");
}

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function testBoundedPersistedFields() {
  const value = expectCreateOk();

  assert.equal(value.passalongId, baseInput.passalongId);
  assert.equal(value.sourceThreadId, "thread-control-thread");
  assert.equal(value.targetThreadId, "thread-dev-jai-nexus");
  assert.equal(value.routeStatus, "queued");
  assert.equal(value.archiveState, "active");
  assert.equal(value.redactionState, "not_required");
  assert.deepEqual(value.evidencePointers, baseInput.evidencePointers);
  assert.deepEqual(value.nonAuthorizations, baseInput.nonAuthorizations.slice(0, 24));
  assert.equal(
    value.nonAuthorizations.length,
    24,
    "Persisted non-authorization arrays must remain bounded.",
  );

  const ignoredExcludedField = validatePersistedPassalongCreateInput({
    ...baseInput,
    providerApiKey: "dummy-key",
    targetRepoSource: "not persisted",
    productionTelemetry: "not persisted",
  });
  assert.equal(ignoredExcludedField.ok, true);
  assert.ok(ignoredExcludedField.value);
  assert.equal("providerApiKey" in ignoredExcludedField.value, false);
  assert.equal("targetRepoSource" in ignoredExcludedField.value, false);
  assert.equal("productionTelemetry" in ignoredExcludedField.value, false);

  const builtFromSample = buildPersistedPassalongInput(PASSALONG_RECORDS[0]);
  assert.equal(builtFromSample.ok, true, builtFromSample.errors.join("\n"));
  assert.ok(builtFromSample.value);
  assert.ok(builtFromSample.value.evidencePointers.length > 0);
}

function testVocabularyBoundaries() {
  for (const status of PASSALONG_ROUTE_STATUSES) {
    assert.equal(
      expectCreateOk({ routeStatus: status }).routeStatus,
      status,
      `Expected route status ${status} to validate.`,
    );
    assert.equal(
      expectPatchOk({ routeStatus: status }).routeStatus,
      status,
      `Expected patch route status ${status} to validate.`,
    );
  }

  for (const archiveState of PASSALONG_ARCHIVE_STATES) {
    assert.equal(
      expectCreateOk({ archiveState }).archiveState,
      archiveState,
      `Expected archive state ${archiveState} to validate.`,
    );
    assert.equal(
      expectPatchOk({ archiveState }).archiveState,
      archiveState,
      `Expected patch archive state ${archiveState} to validate.`,
    );
  }

  for (const redactionState of PASSALONG_REDACTION_STATES.filter(
    (state) => state !== "blocked_secret_risk",
  )) {
    assert.equal(
      expectCreateOk({ redactionState }).redactionState,
      redactionState,
      `Expected redaction state ${redactionState} to validate.`,
    );
  }

  expectCreateBlocked({
    routeStatus: "CONTROL_THREAD_accepted" as PassalongRouteStatus,
  });
  expectCreateBlocked({
    archiveState: "hard_deleted" as PassalongArchiveState,
  });
  expectCreateBlocked({
    redactionState: "unreviewed_secret" as PassalongRedactionState,
  });
  expectCreateBlocked({ redactionState: "blocked_secret_risk" });
  expectPatchBlocked({ redactionState: "blocked_secret_risk" });
}

function testFieldLimitsAndRedactionGates() {
  expectCreateOk({
    summary: "A".repeat(1200),
    requestedDecision: "B".repeat(1200),
    manualOperatorNote: "C".repeat(1000),
    evidencePointers: ["D".repeat(300)],
  });

  const oversizedSummaryResult = validatePersistedPassalongCreateInput(
    withInput({ summary: "A".repeat(1201) }),
  );
  assert.equal(oversizedSummaryResult.ok, true);
  assert.equal(
    oversizedSummaryResult.value?.summary,
    "",
    "Oversized summaries must not be retained.",
  );

  const oversizedDecisionResult = validatePersistedPassalongCreateInput(
    withInput({ requestedDecision: "B".repeat(1201) }),
  );
  assert.equal(oversizedDecisionResult.ok, true);
  assert.equal(
    oversizedDecisionResult.value?.requestedDecision,
    "",
    "Oversized requested-decision text must not be retained.",
  );

  const manualNoteResult = validatePersistedPassalongCreateInput(
    withInput({ manualOperatorNote: "C".repeat(1001) }),
  );
  assert.equal(manualNoteResult.ok, true);
  assert.equal(
    manualNoteResult.value?.manualOperatorNote,
    null,
    "Oversized manual notes must not be retained.",
  );

  const evidenceResult = expectCreateOk({ evidencePointers: ["D".repeat(301)] });
  assert.equal(
    evidenceResult.evidencePointers[0]?.length,
    300,
    "Oversized evidence labels must not persist beyond the bounded length.",
  );

  const patchResult = expectPatchOk({
    manualOperatorNote: "E".repeat(1001),
    evidencePointers: ["F".repeat(301)],
  });
  assert.equal(patchResult.manualOperatorNote, null);
  assert.equal(patchResult.evidencePointers?.[0]?.length, 300);
}

function testSecretRiskNegativeCases() {
  const riskyFixtures = [
    ["provider API keys", "provider api_key=dummy-provider-key"],
    ["API keys", "api_key=dummy-api-key"],
    ["platform tokens", "token=dummy-platform-token"],
    ["database credentials", "DATABASE_URL=dummy-database-url"],
    ["connection strings", "connection string: dummy"],
    ["passwords", "password=dummy-password"],
    ["private keys", "-----BEGIN RSA PRIVATE KEY-----"],
    ["OpenSSH private keys", "-----BEGIN OPENSSH PRIVATE KEY-----"],
    ["raw env content", "raw .env DATABASE_URL=dummy"],
    ["unredacted secret logs", "log line contains password=dummy"],
    ["unredacted screenshots", "screenshot label exposes token=dummy"],
    ["external chat transcripts", "full transcript contains api_key=dummy"],
    ["provider prompts", "provider prompt contains secret=dummy"],
    ["chain-of-thought", "chain-of-thought transcript"],
    ["private reasoning", "private reasoning trace"],
    ["operator personal context", "operator personal password=dummy"],
    ["target repo source files", "target repo source file body"],
    ["generated import code", "target repo source generated import code"],
    ["unreviewed runtime outputs", "runtime output includes token=dummy"],
    ["production telemetry", "production telemetry payload"],
    ["credential-bearing evidence pointers", "docs/evidence?token=dummy"],
  ] as const;

  for (const [label, riskyText] of riskyFixtures) {
    const summaryErrors = expectCreateBlocked({ summary: riskyText });
    assert.ok(summaryErrors.length > 0, `${label} should be blocked in summary.`);

    const requestedDecisionErrors = expectCreateBlocked({
      requestedDecision: riskyText,
    });
    assert.ok(
      requestedDecisionErrors.length > 0,
      `${label} should be blocked in requestedDecision.`,
    );

    expectCreateBlocked({ manualOperatorNote: riskyText });
    expectCreateBlocked({ evidencePointers: [riskyText] });
    expectPatchBlocked({ summary: riskyText });
    expectPatchBlocked({ evidencePointers: [riskyText] });
  }
}

function testRouteAndRepositorySourceBoundaries() {
  const listCreateRoute = readSource(
    "../../../app/operator/control-thread/passalongs/route.ts",
  );
  const patchRoute = readSource(
    "../../../app/operator/control-thread/passalongs/[passalongId]/route.ts",
  );
  const repository = readSource("./passalong-persistence.ts");

  assertIncludesAll(listCreateRoute, [
    "export async function GET()",
    "export async function POST(request: Request)",
    "@/lib/controlPlane/routeDecisions/passalongRouteDecisions",
    "decidePassalongCollectionList",
    "decidePassalongCollectionCreate",
    "NextResponse.json(decision.body, { status: decision.status })",
    "listPersistedPassalongRecords(50)",
    "persistPassalongRecord(candidate.value)",
    "parseBody(request)",
  ]);
  assertIncludesAll(patchRoute, [
    "export async function PATCH",
    "export function GET()",
    "@/lib/controlPlane/routeDecisions/passalongRouteDecisions",
    "decidePassalongDetailMethodNotAllowed",
    "decidePassalongDetailPatch",
    "NextResponse.json(decision.body, { status: decision.status })",
    "await context.params",
    "updatePersistedPassalongRecord(passalongId, body)",
    "parseBody(request)",
  ]);
  assertIncludesAll(repository, [
    "App-local passalong persistence is unavailable; static sample records remain visible as fallback only.",
    "Passalong persistence is unavailable; no database write was completed.",
    "Passalong persistence update is unavailable; no database write was completed.",
    'archiveState === "archived"',
    'archiveState === "marked_for_delete"',
  ]);

  const routeSources = `${listCreateRoute}\n${patchRoute}`;
  assertExcludesAll(routeSources, [
    "PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS",
    "Passalong field boundary validation blocked persistence; no record was saved.",
    "Direct passalong mutation endpoint supports PATCH only. It does not send, route, execute, or approve passalongs.",
    "createPullRequest",
    "octokit",
    "migrate deploy",
    "migrate dev",
    "DROP TABLE",
    "DELETE FROM",
  ]);
  assertIncludesAll(repository, ["PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS"]);
  assertExcludesAll(repository, ["DROP TABLE", "DELETE FROM"]);
}

function testUiCopyBoundaries() {
  const uiSource = normalizeWhitespace(
    readSource("../../../app/operator/control-thread/PassalongRouterPrototype.tsx"),
  );

  assertIncludesAll(uiSource, [
    "Persisted records are app-local",
    "non-authoritative",
    "Route status is descriptive metadata only",
    "Archive/delete lifecycle is",
    "app-local only",
    "CONTROL_THREAD remains authority",
    "Linear remains",
    "temporary mirror only",
    "No hard delete",
    "background",
    "automatic deletion",
    "auto-send",
    "auto-route",
    "nonAuthorizations",
    "ZERO GATES GRANTED",
    "thread memory is not source of truth / passalong routing is manual only",
    "promote_to_import_candidate is not target-repo adoption",
  ]);

  assertExcludesAll(uiSource, [
    "Activate JAI Agent",
    "Activate sandbox runtime",
    "Create pull request",
    "Merge branch",
    "Deploy to production",
    "Open production gate",
  ]);
}

function run() {
  testBoundedPersistedFields();
  testVocabularyBoundaries();
  testFieldLimitsAndRedactionGates();
  testSecretRiskNegativeCases();
  testRouteAndRepositorySourceBoundaries();
  testUiCopyBoundaries();
}

run();

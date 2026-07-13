import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

function assertIncludesAll(source: string, expected: string[]) {
  for (const value of expected) {
    assert.ok(source.includes(value), `Expected source to include: ${value}`);
  }
}

function assertExcludesAll(source: string, forbidden: string[]) {
  for (const value of forbidden) {
    assert.equal(
      source.includes(value),
      false,
      `Expected source to exclude: ${value}`,
    );
  }
}

function assertOrdered(source: string, first: string, second: string) {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);
  assert.ok(firstIndex >= 0, `Expected source to include: ${first}`);
  assert.ok(secondIndex >= 0, `Expected source to include: ${second}`);
  assert.ok(firstIndex < secondIndex, `Expected ${first} before ${second}.`);
}

const collectionRoute = readSource(
  "../../app/operator/control-thread/passalongs/route.ts",
);
const detailRoute = readSource(
  "../../app/operator/control-thread/passalongs/[passalongId]/route.ts",
);
const routeSources = `${collectionRoute}\n${detailRoute}`;

function testCollectionRouteAdoption() {
  assertIncludesAll(collectionRoute, [
    'from "@/lib/controlPlane/routeContracts/adapters/passalong"',
    'from "@/lib/controlPlane/routeDecisions/passalongRouteDecisions"',
    'from "@/lib/controlPlane/threadMemory/passalong-persistence-boundary"',
    'from "@/lib/controlPlane/threadMemory/passalong-persistence"',
    'from "@/lib/controlPlane/threadMemory/types"',
    "PassalongListResult",
    "PassalongWriteResult",
    "decidePassalongCollectionList(normalizedListResult)",
    "decidePassalongCollectionCreate({ candidate })",
    "listPersistedPassalongRecords(50)",
    "persistPassalongRecord(candidate.value)",
    'kind: "available"',
    'kind: "unavailable"',
    'kind: "succeeded"',
    'kind: "failed"',
    "errors: []",
    "NextResponse.json(decision.body, { status: decision.status })",
    'export const runtime = "nodejs"',
    'export const dynamic = "force-dynamic"',
  ]);
  assertOrdered(
    collectionRoute,
    "if (!candidate.ok || !candidate.value)",
    "persistPassalongRecord(candidate.value)",
  );
  assertOrdered(
    collectionRoute,
    "if (writeResult.record)",
    "if (writeResult.available)",
  );
}

function testDetailRouteAdoption() {
  assertIncludesAll(detailRoute, [
    'from "@/lib/controlPlane/routeContracts/adapters/passalong"',
    'from "@/lib/controlPlane/routeDecisions/passalongRouteDecisions"',
    'from "@/lib/controlPlane/threadMemory/passalong-persistence"',
    'from "@/lib/controlPlane/threadMemory/types"',
    "PassalongWriteResult",
    "decidePassalongDetailMethodNotAllowed()",
    "decidePassalongDetailPatch(normalizedWriteResult)",
    "await context.params",
    "updatePersistedPassalongRecord(passalongId, body)",
    "NextResponse.json(decision.body, { status: decision.status })",
    "export function GET()",
    'export const runtime = "nodejs"',
    'export const dynamic = "force-dynamic"',
  ]);
  assert.equal(detailRoute.includes("export async function GET()"), false);
  assertOrdered(
    detailRoute,
    "if (writeResult.record)",
    "if (writeResult.available)",
  );
}

function testOwnershipAndDependencyBoundaries() {
  assertExcludesAll(routeSources, [
    "PASSALONG_PERSISTENCE_NON_AUTHORIZATIONS",
    "Passalong field boundary validation blocked persistence; no record was saved.",
    "Direct passalong mutation endpoint supports PATCH only. It does not send, route, execute, or approve passalongs.",
    "routeContractOracles",
    "routeHarness",
    ".test",
    "openai",
    "provider-connector",
    "github",
    "linear",
    "deployment",
    "routeContracts/index",
  ]);
  assert.equal(
    existsSync(new URL("./routeContracts/index.ts", import.meta.url)),
    false,
    "The passalong routes must not gain a route-contract barrel.",
  );
}

testCollectionRouteAdoption();
testDetailRouteAdoption();
testOwnershipAndDependencyBoundaries();

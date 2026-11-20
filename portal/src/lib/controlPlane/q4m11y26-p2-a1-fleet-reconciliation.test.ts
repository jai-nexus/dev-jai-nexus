import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import fixture from "./__fixtures__/q4m11y26-p2-a1-fleet-identity-v0.json";
import { buildFullRepoRegistry, getFullRepoRegistry, loadFullRepoRegistry } from "./repoSurfaceModel";
import { buildFounderActiveProgramControlSurface } from "./programLifecycle/founder-active-program-control-surface";

const root = fileURLToPath(new URL("../../../../", import.meta.url));
const portal = path.join(root, "portal");
const registry: { repos: { repo: string; nh_id: string; status: string }[] } =
  YAML.parse(readFileSync(path.join(portal, "config/repos.yaml"), "utf8"));
const topology: { repos: { org_repo: string }[] } =
  YAML.parse(readFileSync(path.join(root, "config/repos.yaml"), "utf8"));
const rows = registry.repos.filter(row => row.repo.includes("/"));
const { curated_fleet: fleet, retired_unverified_placeholders: retired } = fixture;

test("registry reconciles one-to-one with the offline identities and historical NHIDs", () => {
  assert.equal(fixture.source_sha, "c0921ce771adece93c340f64605df77945cc467e");
  assert.equal(fixture.authority_granted, false);
  assert.deepEqual(registry.repos.filter(row => !row.repo.includes("/")).map(row => row.repo), ["jai-nexus"]);
  assert.equal(fleet.length, 21);
  assert.equal(retired.length, 21);
  const names = [...fleet, ...retired].map(row => row.repository_full_name.toLowerCase());
  assert.equal(new Set(names).size, names.length);
  const nhids = [...registry.repos.map(row => row.nh_id), ...retired.map(row => row.historical_nhid)];
  assert.equal(new Set(nhids).size, nhids.length);
  const live = fleet.filter(row => row.observed_presence === "LIVE_VERIFIED");
  assert.equal(live.length, 20);
  assert.equal(new Set(live.map(row => row.github_repo_id)).size, 20);
  assert.ok(live.every(row => Number.isSafeInteger(row.github_repo_id) && row.observed_archived === false));
  assert.equal(live.filter(row => row.governance_disposition === "KEEP").length, 16);
  assert.equal(live.filter(row => row.governance_disposition === "PARK").length, 4);
  assert.ok(fleet.every(row => row.authority_granted === false && row.repository_alias === row.repository_full_name.split("/")[1]));
  const compatibility = fleet.filter(row => row.observed_presence !== "LIVE_VERIFIED");
  assert.deepEqual(compatibility.map(row => [row.repository_full_name, row.nhid, row.github_repo_id,
    row.observed_archived, row.observed_presence, row.governance_disposition]),
    [["jai-nexus/teacher-copilot", "2.2", null, null, "UNVERIFIED_ACCESS", "DEPRECATED_COMPATIBILITY_RETAINED"]]);
  assert.ok(retired.every(row => row.observed_presence === "UNVERIFIED_ACCESS" &&
    row.governance_disposition === "DROPPED_FROM_ACTIVE_REGISTRY"));
  const statuses = new Map([["KEEP", "active"], ["PARK", "frozen"], ["DEPRECATED_COMPATIBILITY_RETAINED", "deprecated"]]);
  assert.deepEqual(rows.map(row => [row.repo, row.nh_id, row.status]),
    fleet.map(row => [row.repository_full_name, row.nhid, statuses.get(row.governance_disposition)]));
});

test("the five topology repositories are exactly the marked KEEP entries", () => {
  const marked = fleet.filter(row => row.in_root_topology_5);
  assert.equal(marked.length, 5);
  assert.ok(marked.every(row => row.governance_disposition === "KEEP"));
  assert.deepEqual(topology.repos.map(row => row.org_repo).sort(), marked.map(row => row.repository_full_name).sort());
});

test("both working directories resolve the same alphabetically indexed registry", () => {
  const names = rows.map(row => row.repo);
  assert.deepEqual(names, [...names].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase(), "en")));
  for (const result of [loadFullRepoRegistry(root), loadFullRepoRegistry(portal), getFullRepoRegistry()]) {
    assert.deepEqual(result.map(row => [row.fleetDisplayIndex, row.org_repo, row.status]),
      rows.map((row, index) => [index + 1, row.repo, row.status]));
  }
  assert.deepEqual(loadFullRepoRegistry(root), loadFullRepoRegistry(portal));
});

test("inserting and removing a repo recomputes its neighbours' display positions", () => {
  const original = structuredClone(rows);
  const inserted = { repo: "Example/alpha", nh_id: "test", status: "planned" };
  const expanded = [...rows, inserted];
  const indexed = buildFullRepoRegistry(expanded);
  assert.deepEqual(indexed.map(row => [row.org_repo, row.fleetDisplayIndex]),
    [inserted, ...rows].map((row, index) => [row.repo, index + 1]));
  assert.deepEqual(buildFullRepoRegistry(expanded.filter(row => row !== inserted)), getFullRepoRegistry());
  assert.deepEqual(expanded, [...original, inserted]);
});

test("the accepted P2 snapshot opens planning with zero execution lanes", () => {
  const [p1, p2, p3, p4] = buildFounderActiveProgramControlSurface().portfolio;
  assert.equal(p1.lifecycleState, "CLOSED_ACCEPTED");
  assert.equal(p2.coordinate, "Q4M11Y26-P2");
  assert.equal(p2.lifecycleState, "OPEN_FOR_BATCH_PLANNING_ONLY");
  assert.equal(p2.activeExecutionLanes, 0);
  assert.equal(p2.authority, "NONE");
  assert.equal(p3.displayPosture, "FROZEN — NOT OPEN");
  assert.equal(p4.displayPosture, "FROZEN — NOT OPEN");
});

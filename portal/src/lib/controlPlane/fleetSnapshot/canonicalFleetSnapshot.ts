import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { parse } from "yaml";

const VERSION = "JAI-FLEET-SNAPSHOT-v0";
export const fixturePath = "portal/src/lib/controlPlane/__fixtures__/q4m11y26-p2-a1-fleet-identity-v0.json";
export const snapshotPath = "config/fleet/q4m11y26-p2-b2-canonical-fleet-snapshot-v0.json";
export const inputPaths = ["config/repos.yaml", "portal/config/repos.yaml", fixturePath] as const;
export type FleetInputs = Record<typeof inputPaths[number], Buffer>;

type Row = Record<string, unknown>;
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function record(value: unknown): value is Row {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function rows(value: unknown, count: number, label: string): Row[] {
  check(Array.isArray(value) && value.length === count && value.every(record), "Invalid " + label);
  return value;
}
function text(value: unknown, pattern: RegExp, label: string): string {
  check(typeof value === "string" && pattern.test(value), "Invalid " + label);
  return value;
}
const fullName = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const nhidPattern = /^\d+(?:\.\d+)+$/;
function unique<T>(seen: Set<T>, value: T, label: string) {
  check(!seen.has(value), "Duplicate " + label + ": " + value);
  seen.add(value);
}
function index(records: Row[], field: string) {
  const result = new Map<string, Row>();
  for (const row of records) {
    const key = text(row[field], fullName, field);
    check(!result.has(key), "Duplicate " + field + ": " + key);
    result.set(key, row);
  }
  return result;
}
function compare(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function lifecycle(row: Row, status: unknown) {
  const { governance_disposition: disposition, observed_presence: presence, observed_archived: archived } = row;
  check(["KEEP", "PARK", "DEPRECATED_COMPATIBILITY_RETAINED"].some(d => d === disposition) &&
    ["active", "frozen", "deprecated"].some(s => s === status), "Unknown disposition or portal status");
  check((presence === "LIVE_VERIFIED" && typeof archived === "boolean") ||
    (presence === "UNVERIFIED_ACCESS" && archived === null), "Invalid presence/archive tuple");
  if (disposition === "DEPRECATED_COMPATIBILITY_RETAINED" || archived === true || status === "deprecated") return "ARCHIVED";
  if (archived === false && disposition === "KEEP" && status === "active") return "LIVE";
  if (archived === false && disposition === "PARK" && status === "frozen") return "PARKED";
  throw new Error("Unreconciled lifecycle tuple for " + row.repository_full_name);
}

// Digest and parse the same bytes. File and Git access belong to the CLI.
export async function buildCanonicalFleetSnapshot(inputs: FleetInputs) {
  const [rootPath, portalPath] = inputPaths;
  const root = index(rows(parse(inputs[rootPath].toString("utf8"))?.repos, 5, "root topology"), "org_repo");
  const registry = parse(inputs[portalPath].toString("utf8"));
  check(registry?.schema_version === 0.2, "Unknown portal schema version");
  const portalRows = rows(registry.repos, 22, "portal registry");
  const meta = portalRows.find(row => row.repo === "jai-nexus");
  check(meta?.nh_id === "1.1" && meta.role === "meta", "Missing organization meta row");
  const portal = index(portalRows.filter(row => row !== meta), "repo");
  const a1 = JSON.parse(inputs[fixturePath].toString("utf8"));
  check(a1?.authority_granted === false && a1.source_sha === "c0921ce771adece93c340f64605df77945cc467e", "Invalid A1 provenance");
  const curated = rows(a1.curated_fleet, 21, "curated fleet");
  const names = new Set<string>();
  const aliases = new Set<string>();
  const nhids = new Set(["1.1"]);
  const githubIds = new Set<number>();
  const repositories = curated.map(row => {
    const repo_id = text(row.repository_full_name, fullName, "repo_id");
    unique(names, repo_id.toLowerCase(), "repo_id");
    const alias = text(row.repository_alias, /^[A-Za-z0-9._-]+$/, "alias");
    unique(aliases, alias.toLowerCase(), "alias");
    check(alias === repo_id.split("/")[1], "Alias mismatch: " + repo_id);
    const nhid = text(row.nhid, nhidPattern, "nhid");
    unique(nhids, nhid, "nhid");
    const github_repo_id = row.github_repo_id;
    if (github_repo_id !== null) {
      check(typeof github_repo_id === "number" && Number.isSafeInteger(github_repo_id) && github_repo_id > 0, "Invalid GitHub ID");
      unique(githubIds, github_repo_id, "github_repo_id");
    }
    check(github_repo_id !== null || row.observed_presence === "UNVERIFIED_ACCESS", "Missing verified GitHub ID");
    const registryRow = portal.get(repo_id);
    check(registryRow && registryRow.nh_id === nhid, "Portal identity mismatch: " + repo_id);
    const topology = root.get(repo_id);
    check(row.in_root_topology_5 === Boolean(topology), "Topology membership mismatch: " + repo_id);
    check(!topology || topology.status === "active" || topology.status === "planned", "Invalid root topology status");
    check(row.authority_granted === false, "Invalid repository authority");
    return { repo_id, alias, canonical_git_url: "https://github.com/" + repo_id + ".git", nhid, github_repo_id,
      lifecycle_state: lifecycle(row, registryRow.status), governance_disposition: row.governance_disposition,
      observed_presence: row.observed_presence, observed_archived: row.observed_archived, portal_status: registryRow.status,
      in_root_topology_5: Boolean(topology), root_topology_status: topology ? topology.status : null, authority_granted: false };
  }).sort((a, b) => compare(a.repo_id, b.repo_id));
  check(repositories.filter(row => row.in_root_topology_5).length === root.size, "Unknown root topology repository");

  const retired = rows(a1.retired_unverified_placeholders, 21, "retired placeholders").map(row => {
    const repo_id = text(row.repository_full_name, fullName, "retired repository");
    const historical_nhid = text(row.historical_nhid, nhidPattern, "historical NHID");
    unique(names, repo_id.toLowerCase(), "repo_id");
    unique(nhids, historical_nhid, "nhid");
    check(row.governance_disposition === "DROPPED_FROM_ACTIVE_REGISTRY" && row.observed_presence === "UNVERIFIED_ACCESS",
      "Invalid retired placeholder");
    return { repo_id, historical_nhid, governance_disposition: row.governance_disposition, observed_presence: row.observed_presence };
  }).sort((a, b) => compare(a.repo_id, b.repo_id));
  const input_digests = Object.fromEntries(inputPaths.map(path => [path, createHash("sha256").update(inputs[path]).digest("hex")]));
  const payload = { schema_version: VERSION, program_coordinate: "Q4M11Y26-P2:B2", authority_granted: false,
    source_provenance: { source_repository: "jai-nexus/dev-jai-nexus", a1_source_sha: a1.source_sha,
      cutoff_date: "2026-11-20", input_digests },
    organization_meta: { nh_id: meta.nh_id, repo: meta.repo, role: meta.role },
    repositories, retired_unverified_placeholders: retired };
  // B1's validator loads its schema on import. Defer that work until an export is requested.
  const { canonicalJson } = await import("../../../../scripts/validate-package-format-2.mjs");
  const hash = createHash("sha256").update(VERSION + "\0").update(canonicalJson(payload)).digest("hex");
  return { ...payload, snapshot_digest: "sha256:" + hash };
}

export async function verifyCanonicalFleetSnapshot(candidate: unknown, inputs: FleetInputs) {
  check(record(candidate) && candidate.schema_version === VERSION, "Unknown fleet snapshot version");
  check(isDeepStrictEqual(candidate, await buildCanonicalFleetSnapshot(inputs)), "Snapshot differs from bound inputs or digest");
}

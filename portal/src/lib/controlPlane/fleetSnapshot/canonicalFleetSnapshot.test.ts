import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { parse, stringify } from "yaml";
import { canonicalJson } from "../../../../scripts/validate-package-format-2.mjs";
import { buildCanonicalFleetSnapshot, fixturePath, inputPaths, snapshotPath, verifyCanonicalFleetSnapshot,
  type FleetInputs } from "./canonicalFleetSnapshot";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root });
const inputs = Object.fromEntries(inputPaths.map(p => [p, git("cat-file", "blob", "HEAD:" + p)])) as FleetInputs;
const [rootPath, portalPath] = inputPaths;

test("canonical bytes, input hashes, A1 cutoff and domain-separated B1 JCS digest", async () => {
  const snapshot = await buildCanonicalFleetSnapshot(inputs);
  const render = (value: unknown) => Buffer.from(JSON.stringify(value, null, 2) + "\n");
  assert.deepEqual(render(snapshot), render(await buildCanonicalFleetSnapshot(inputs)));
  const committed = git("ls-tree", "--name-only", "HEAD", "--", snapshotPath).length > 0;
  const bytes = committed ? git("cat-file", "blob", "HEAD:" + snapshotPath) : readFileSync(path.join(root, snapshotPath));
  assert.deepEqual(bytes, render(snapshot));
  await verifyCanonicalFleetSnapshot(JSON.parse(bytes.toString()), inputs);
  const { snapshot_digest, ...payload } = snapshot;
  const expected = createHash("sha256").update("JAI-FLEET-SNAPSHOT-v0\0").update(canonicalJson(payload)).digest("hex");
  assert.equal(snapshot_digest, "sha256:" + expected);
  for (const p of inputPaths) assert.equal(snapshot.source_provenance.input_digests[p], createHash("sha256").update(inputs[p]).digest("hex"));
  assert.equal(git("show", "-s", "--format=%cs", snapshot.source_provenance.a1_source_sha).toString().trim(),
    snapshot.source_provenance.cutoff_date);
  execFileSync(process.execPath, [path.join(root, "portal/scripts/export-canonical-fleet-snapshot.mjs"), "--check"], { cwd: root });
});

test("21 curated identities reconcile the portal organization, root subset and retired placeholders", async () => {
  const snapshot = await buildCanonicalFleetSnapshot(inputs);
  const repos = snapshot.repositories;
  assert.deepEqual(snapshot.organization_meta, { nh_id: "1.1", repo: "jai-nexus", role: "meta" });
  assert.equal(repos.length + 1, parse(inputs[portalPath].toString()).repos.length);
  assert.deepEqual(repos.map(r => r.repo_id), repos.map(r => r.repo_id).sort());
  assert.deepEqual(["LIVE", "PARKED", "ARCHIVED"].map(s => repos.filter(r => r.lifecycle_state === s).length), [16, 4, 1]);
  assert.ok(repos.every(r => !r.authority_granted && r.canonical_git_url === "https://github.com/" + r.repo_id + ".git"));
  assert.equal(repos.filter(r => r.in_root_topology_5).length, 5);
  const external = repos.find(r => r.repo_id === "JerryIngram/offbook-ai");
  assert.deepEqual([external?.lifecycle_state, external?.portal_status, external?.root_topology_status], ["LIVE", "active", "planned"]);
  const archived = repos.find(r => r.lifecycle_state === "ARCHIVED");
  assert.deepEqual([archived?.repo_id, archived?.observed_archived, archived?.github_repo_id], ["jai-nexus/teacher-copilot", null, null]);
  assert.equal(snapshot.retired_unverified_placeholders.length, 21);
  assert.ok(snapshot.retired_unverified_placeholders.every(r => r.governance_disposition === "DROPPED_FROM_ACTIVE_REGISTRY"));
});

test("unknown, missing, duplicated and unreconciled input identities fail closed", async () => {
  const fixture = () => JSON.parse(inputs[fixturePath].toString());
  for (const field of ["repository_full_name", "repository_alias", "nhid", "github_repo_id"]) {
    const data = fixture();
    data.curated_fleet[1][field] = data.curated_fleet[0][field];
    await assert.rejects(buildCanonicalFleetSnapshot({ ...inputs, [fixturePath]: Buffer.from(JSON.stringify(data)) }), /Duplicate/);
  }
  for (const [field, value] of [["nhid", "8.8"], ["governance_disposition", "UNKNOWN"], ["governance_disposition", "PARK"],
    ["authority_granted", true], ["in_root_topology_5", true]] as const) {
    const data = fixture();
    data.curated_fleet[0][field] = value;
    await assert.rejects(buildCanonicalFleetSnapshot({ ...inputs, [fixturePath]: Buffer.from(JSON.stringify(data)) }));
  }
  const missing = fixture();
  missing.curated_fleet.pop();
  await assert.rejects(buildCanonicalFleetSnapshot({ ...inputs, [fixturePath]: Buffer.from(JSON.stringify(missing)) }), /curated fleet/);
  for (const [p, field] of [[rootPath, "org_repo"], [portalPath, "repo"]] as const) {
    const data = parse(inputs[p].toString());
    data.repos[1][field] = "jai-nexus/unknown";
    await assert.rejects(buildCanonicalFleetSnapshot({ ...inputs, [p]: Buffer.from(stringify(data)) }), /mismatch/);
  }
});

test("version, tampered payload, digest and authority are checked against source inputs", async () => {
  const snapshot = await buildCanonicalFleetSnapshot(inputs);
  for (const edits of [{ schema_version: "v2" }, { snapshot_digest: "sha256:" + "0".repeat(64) },
    { authority_granted: true }, { repositories: snapshot.repositories.slice(1) }]) {
    await assert.rejects(verifyCanonicalFleetSnapshot({ ...snapshot, ...edits }, inputs));
  }
});

test("import initializes without filesystem, Git, schema reads or output", () => {
  const source = readFileSync(new URL("./canonicalFleetSnapshot.ts", import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const localRequire = createRequire(import.meta.url);
  const sandbox = { exports: {} as Record<string, unknown>, console: undefined, require(name: string) {
    assert.ok(["node:crypto", "node:util", "yaml"].includes(name), "Unexpected import: " + name);
    return localRequire(name);
  } };
  runInNewContext(code, sandbox);
  assert.equal(typeof sandbox.exports.buildCanonicalFleetSnapshot, "function");
});

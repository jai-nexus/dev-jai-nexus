import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_MANIFEST,
  DEFAULT_ROOT,
  MANIFEST_ROOT,
  MANIFEST_SCHEMA,
  MINIMUM_REQUIRED_FLOOR,
  checkManifest,
  discoverTests,
  runTests,
  skippedOrTodo,
} from "./run-required-control-plane-tests.mjs";

const runner = fileURLToPath(new URL("./run-required-control-plane-tests.mjs", import.meta.url));
const PASS = 'console.log("pass");\n';
const byteOrder = (a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b));

// Fixture: `count` passing tests (half nested), plus `extra` files; manifest pins
// `pinned` (default: the passing tests) and can be patched.
function fixture(t, { count = MINIMUM_REQUIRED_FLOOR, extra = {}, pinned, patch = {} } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "required tests "));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const root = path.join(dir, "controlPlane");
  const files = {};
  for (let i = 0; i < count; i += 1) files[`${i % 2 ? "nested/" : ""}case-${String(i).padStart(2, "0")}.test.ts`] = PASS;
  Object.assign(files, extra);
  for (const [name, content] of Object.entries(files)) {
    const full = path.join(root, ...name.split("/"));
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  const tests = (pinned ?? Object.keys(files).filter((name) => files[name] === PASS)).slice().sort(byteOrder);
  const manifest = { schema: MANIFEST_SCHEMA, root: MANIFEST_ROOT, minimum_required: MINIMUM_REQUIRED_FLOOR, tests, ...patch };
  const manifestPath = path.join(dir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return { dir, root, manifest, manifestPath };
}

function cli(args) {
  return spawnSync(process.execPath, [runner, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

// Fixtures run under the default tsx runtime, exactly as production --run does,
// so this suite does not depend on Node's built-in TypeScript stripping
// (absent by default before Node 22.18; Q4M11Y26-P2:A3-C, advisory V-5).
function runFixture(fx, mode) {
  return cli([mode, "--manifest", fx.manifestPath, "--root", fx.root]);
}

test("--check passes a valid 32-test manifest and --run executes every test", (t) => {
  const fx = fixture(t);
  const check = runFixture(fx, "--check");
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /check PASS: required=32 discovered=32 unpinned=0/);
  const run = runFixture(fx, "--run");
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /run PASS: executed=32 required=32/);
  assert.equal((run.stdout.match(/^Running /gm) || []).length, 32);
});

test("--check fails when a manifest entry is missing on disk", (t) => {
  const fx = fixture(t);
  rmSync(path.join(fx.root, "case-00.test.ts"));
  const result = runFixture(fx, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /required test missing on disk: case-00\.test\.ts/);
  assert.equal(runFixture(fx, "--run").status, 1, "--run must fail closed before executing anything");
});

test("--check fails when the manifest pins fewer than 32 tests or lowers its floor", (t) => {
  const short = fixture(t, { count: 31 });
  const result = runFixture(short, "--check");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /pins 31 tests; at least 32 are required/);

  const lowered = fixture(t, { count: 31, patch: { minimum_required: 31 } });
  const loweredResult = runFixture(lowered, "--check");
  assert.equal(loweredResult.status, 1);
  assert.match(loweredResult.stderr, /minimum_required must be an integer >= 32/);

  const raised = fixture(t, { count: 33, patch: { minimum_required: 34 } });
  assert.match(runFixture(raised, "--check").stderr, /pins 33 tests; at least 34 are required/);
});

test("--check rejects duplicate, unsorted, unsafe, directory, schema, and root defects", (t) => {
  const base = fixture(t);
  const cases = [
    [{ tests: [...base.manifest.tests, base.manifest.tests[0]].sort(byteOrder) }, /duplicate manifest entry/],
    [{ tests: [...base.manifest.tests].reverse() }, /sorted in byte order/],
    [{ tests: [...base.manifest.tests, "../escape.test.ts"].sort(byteOrder) }, /unsafe or non-test manifest entry: "\.\.\/escape\.test\.ts"/],
    [{ tests: [...base.manifest.tests, "nested\\win.test.ts"].sort(byteOrder) }, /unsafe or non-test/],
    [{ tests: [...base.manifest.tests, "notes.md"].sort(byteOrder) }, /unsafe or non-test/],
    [{ schema: "other" }, /schema must be/],
    [{ root: "portal/src" }, /root must be/],
  ];
  for (const [patch, expected] of cases) {
    const result = checkManifest({ ...base.manifest, ...patch }, { root: base.root });
    assert.equal(result.ok, false, JSON.stringify(patch).slice(0, 80));
    assert.match(result.errors.join("\n"), expected);
  }
  mkdirSync(path.join(base.root, "dir.test.ts"));
  const dirResult = checkManifest({ ...base.manifest, tests: [...base.manifest.tests, "dir.test.ts"].sort(byteOrder) }, { root: base.root });
  assert.match(dirResult.errors.join("\n"), /required test missing on disk: dir\.test\.ts/);
  assert.deepEqual(checkManifest("nope", { root: base.root }).errors, ["manifest is not a JSON object"]);
});

test("--run fails on a non-zero test exit", (t) => {
  const fx = fixture(t, { extra: { "boom.test.ts": "process.exit(3);\n" } });
  const result = runFixture(fx, "--run");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /FAILED boom\.test\.ts: exit 3/);
});

test("--run fails on skipped or todo node:test results", (t) => {
  for (const [name, body] of [
    ["skipped.test.ts", 'import test from "node:test";\ntest("later", { skip: true }, () => {});\n'],
    ["todo.test.ts", 'import test from "node:test";\ntest("someday", { todo: true }, () => {});\n'],
  ]) {
    const fx = fixture(t, { extra: { [name]: body } });
    const result = runFixture(fx, "--run");
    assert.equal(result.status, 1, `${name}: ${result.stdout}`);
    assert.match(result.stderr, new RegExp(`FAILED ${name.replace(".", "\\.")}: skipped or todo tests reported`));
  }
  assert.equal(skippedOrTodo("# tests 2\n# pass 2\n# skipped 0\n# todo 0\n"), 0);
  assert.equal(skippedOrTodo("ℹ tests 3\nℹ skipped 1\n"), 1);
  assert.equal(skippedOrTodo("ok 1 - later # SKIP\n"), 1);
});

test("--run executes unpinned future tests beyond the manifest floor", (t) => {
  const marker = 'import { writeFileSync } from "node:fs";\nwriteFileSync(new URL("./ran.marker", import.meta.url), "ran");\n';
  const fx = fixture(t, { extra: { "future/new-boundary.test.ts": marker } });
  const result = runFixture(fx, "--run");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /executed=33 required=32 unpinned=1/);
  assert.equal(readFileSync(path.join(fx.root, "future", "ran.marker"), "utf8"), "ran");
});

test("CLI rejects missing, conflicting, and unknown arguments and unreadable manifests", (t) => {
  assert.equal(cli([]).status, 2);
  assert.equal(cli(["--check", "--run"]).status, 2);
  assert.equal(cli(["--check", "--bogus"]).status, 2);
  assert.equal(cli(["--run", "--runtime", "bun"]).status, 2);
  const fx = fixture(t);
  const missing = cli(["--check", "--manifest", path.join(fx.dir, "absent.json"), "--root", fx.root]);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /manifest unreadable/);
  writeFileSync(fx.manifestPath, "{not json");
  assert.match(runFixture(fx, "--check").stderr, /not valid JSON/);
});

test("default tsx runtime executes TypeScript and reports failures", (t) => {
  const fx = fixture(t, { count: 0, extra: { "typed.test.ts": "const n: number = 1;\nif (n !== 1) process.exit(1);\n", "bad.test.ts": "const n: number = 2;\nif (n !== 1) process.exit(4);\n" } });
  const results = runTests(["bad.test.ts", "typed.test.ts"], { root: fx.root, log: () => {} });
  assert.deepEqual(results.map((r) => [r.file, r.ok, r.reason]), [["bad.test.ts", false, "exit 4"], ["typed.test.ts", true, null]]);
});

test("repository manifest is valid and pins the 34-file A3-C baseline", () => {
  const manifest = JSON.parse(readFileSync(DEFAULT_MANIFEST, "utf8"));
  const result = checkManifest(manifest, { root: DEFAULT_ROOT });
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.ok(manifest.tests.length >= 34);
  assert.ok(manifest.tests.includes("motionKernel/a3-inference-gates.test.ts"));
  assert.ok(manifest.tests.every((file) => discoverTests(DEFAULT_ROOT).includes(file)));
  assert.ok(manifest.tests.includes("motionKernel/local-operating-loop.test.ts"));
  assert.ok(existsSync(path.join(DEFAULT_ROOT, "motionKernel", "local-operating-loop.ts")));
});

// Required control-plane test manifest checker and fail-closed runner.
// Q4M11Y26-P2:A3 Packet A3-G.
//
//   node portal/scripts/run-required-control-plane-tests.mjs --check
//   node portal/scripts/run-required-control-plane-tests.mjs --run
//
// --check validates the manifest: schema, >= 32 floor, unique sorted safe
//         paths, and every pinned file exists and is found by discovery.
// --run   runs --check, then executes EVERY discovered *.test.ts under the
//         root (pinned or not). It fails on any non-zero exit, signal,
//         timeout, or skipped/todo node:test result.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const MANIFEST_SCHEMA = "jai.control-plane-required-tests.v0";
export const MANIFEST_ROOT = "portal/src/lib/controlPlane";
export const MINIMUM_REQUIRED_FLOOR = 32;
const TEST_TIMEOUT_MS = 5 * 60 * 1000;

const scriptPath = fileURLToPath(import.meta.url);
const portalDir = path.dirname(path.dirname(scriptPath));
export const DEFAULT_MANIFEST = path.join(portalDir, "scripts", "control-plane-required-tests-v0.json");
export const DEFAULT_ROOT = path.join(portalDir, "src", "lib", "controlPlane");
export const TSX_CLI = path.join(portalDir, "node_modules", "tsx", "dist", "cli.mjs");

const byteOrder = (a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b));

export function discoverTests(root) {
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".test.ts")) found.push(path.relative(root, full).split(path.sep).join("/"));
    }
  };
  walk(root);
  return found.sort(byteOrder);
}

export function readManifest(file) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (error) {
    throw new Error(`manifest unreadable: ${file}: ${error.message}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`manifest is not valid JSON: ${error.message}`);
  }
}

function isSafeRelativeTestPath(entry) {
  return typeof entry === "string"
    && entry.endsWith(".test.ts")
    && !entry.includes("\\")
    && !path.posix.isAbsolute(entry)
    && !/^[A-Za-z]:/.test(entry)
    && entry.split("/").every((segment) => segment !== "" && segment !== "." && segment !== "..");
}

export function checkManifest(manifest, { root }) {
  const errors = [];
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    return { ok: false, errors: ["manifest is not a JSON object"], discovered: [], required: [] };
  }
  if (manifest.schema !== MANIFEST_SCHEMA) errors.push(`schema must be ${MANIFEST_SCHEMA}`);
  if (manifest.root !== MANIFEST_ROOT) errors.push(`root must be ${MANIFEST_ROOT}`);
  const floor = manifest.minimum_required;
  if (!Number.isInteger(floor) || floor < MINIMUM_REQUIRED_FLOOR) {
    errors.push(`minimum_required must be an integer >= ${MINIMUM_REQUIRED_FLOOR}`);
  }

  const tests = Array.isArray(manifest.tests) ? manifest.tests : null;
  if (!tests) {
    errors.push("tests must be an array");
    return { ok: false, errors, discovered: [], required: [] };
  }
  const required = [];
  for (const entry of tests) {
    if (!isSafeRelativeTestPath(entry)) errors.push(`unsafe or non-test manifest entry: ${JSON.stringify(entry)}`);
    else if (required.includes(entry)) errors.push(`duplicate manifest entry: ${entry}`);
    else required.push(entry);
  }
  const effectiveFloor = Math.max(MINIMUM_REQUIRED_FLOOR, Number.isInteger(floor) ? floor : 0);
  if (required.length < effectiveFloor) errors.push(`manifest pins ${required.length} tests; at least ${effectiveFloor} are required`);
  if (JSON.stringify(required) !== JSON.stringify([...required].sort(byteOrder))) errors.push("manifest tests must be sorted in byte order");

  let discovered = [];
  try {
    discovered = discoverTests(root);
  } catch (error) {
    errors.push(`test root unreadable: ${root}: ${error.message}`);
  }
  for (const entry of required) {
    const full = path.join(root, ...entry.split("/"));
    const stats = statSync(full, { throwIfNoEntry: false });
    if (!stats || !stats.isFile()) errors.push(`required test missing on disk: ${entry}`);
    else if (!discovered.includes(entry)) errors.push(`required test not found by discovery: ${entry}`);
  }
  return { ok: errors.length === 0, errors, discovered, required };
}

// Counts skipped/todo results from node:test TAP or spec reporter output.
export function skippedOrTodo(output) {
  let count = 0;
  for (const m of output.matchAll(/^\s*(?:#|ℹ)\s*(?:skipped|todo)\s+(\d+)\s*$/gim)) count += Number(m[1]);
  if (count === 0 && /^\s*ok \d+ .*#\s*(?:SKIP|TODO)\b/im.test(output)) count = 1;
  return count;
}

function commandFor(runtime, file) {
  if (runtime === "node") return [process.execPath, [file]];
  return [process.execPath, [TSX_CLI, file]];
}

export function runTests(files, { root, runtime = "tsx", cwd = portalDir, log = console.log } = {}) {
  if (runtime === "tsx" && !statSync(TSX_CLI, { throwIfNoEntry: false })?.isFile()) {
    return [{ file: "(runner)", ok: false, reason: `local tsx CLI missing: ${TSX_CLI}` }];
  }
  // Without this, a runner started under `node --test` would make child
  // node:test files report over the parent's binary protocol instead of TAP,
  // hiding skipped/todo counts.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const results = [];
  for (const file of files) {
    const [command, args] = commandFor(runtime, path.join(root, ...file.split("/")));
    log(`Running ${JSON.stringify(file)}`);
    const result = spawnSync(command, args, { cwd, env, encoding: "utf8", timeout: TEST_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024 });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    let reason = null;
    if (result.error) reason = result.error.code === "ETIMEDOUT" ? `timed out after ${TEST_TIMEOUT_MS} ms` : result.error.message;
    else if (result.signal) reason = `terminated by ${result.signal}`;
    else if (result.status !== 0) reason = `exit ${result.status}`;
    else if (skippedOrTodo(output) > 0) reason = "skipped or todo tests reported";
    results.push({ file, ok: reason === null, reason });
  }
  return results;
}

function parseArgs(argv) {
  const options = { mode: null, manifest: DEFAULT_MANIFEST, root: DEFAULT_ROOT, runtime: "tsx" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--check" || arg === "--run") {
      if (options.mode) throw new Error("choose exactly one of --check or --run");
      options.mode = arg.slice(2);
    } else if (arg === "--manifest" || arg === "--root" || arg === "--runtime") {
      const value = argv[i + 1];
      if (!value) throw new Error(`${arg} needs a value`);
      options[arg.slice(2)] = value;
      i += 1;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!options.mode) throw new Error("choose exactly one of --check or --run");
  if (!["tsx", "node"].includes(options.runtime)) throw new Error("--runtime must be tsx or node");
  options.manifest = path.resolve(options.manifest);
  options.root = path.resolve(options.root);
  return options;
}

export function main(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`[required-control-plane-tests] ${error.message}`);
    return 2;
  }
  let check;
  try {
    check = checkManifest(readManifest(options.manifest), { root: options.root });
  } catch (error) {
    console.error(`[required-control-plane-tests] FAILED: ${error.message}`);
    return 1;
  }
  if (!check.ok) {
    console.error(`[required-control-plane-tests] FAILED --check:\n- ${check.errors.join("\n- ")}`);
    return 1;
  }
  const unpinned = check.discovered.filter((file) => !check.required.includes(file));
  console.log(`[required-control-plane-tests] check PASS: required=${check.required.length} discovered=${check.discovered.length} unpinned=${unpinned.length}`);
  if (options.mode === "check") return 0;

  const results = runTests(check.discovered, { root: options.root, runtime: options.runtime });
  const failed = results.filter((result) => !result.ok);
  const executed = new Set(results.filter((result) => result.file !== "(runner)").map((result) => result.file));
  const notExecuted = check.required.filter((file) => !executed.has(file));
  if (failed.length || notExecuted.length) {
    for (const result of failed) console.error(`FAILED ${result.file}: ${result.reason}`);
    for (const file of notExecuted) console.error(`FAILED ${file}: required test was not executed`);
    console.error(`[required-control-plane-tests] FAILED --run: ${failed.length} failed, ${notExecuted.length} required not executed`);
    return 1;
  }
  console.log(`[required-control-plane-tests] run PASS: executed=${results.length} required=${check.required.length} unpinned=${unpinned.length}`);
  return 0;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = main(process.argv.slice(2));
}

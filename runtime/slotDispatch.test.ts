// Q4M11Y26-P2:A3-D regression tests for the runtime slot dispatch USD 0.00 lock.
// Run from the repo root: pnpm -C portal exec tsx ../runtime/slotDispatch.test.ts
//
// Fake credentials, an env attempt to raise the ceiling, an instrumented
// process.env, and a fetch/TCP trap (with a positive control) prove that live
// dispatch fails closed before any credential read or request. The real CLI
// is also run end to end in a temp repo to prove it writes no output artifact
// and no run-ledger entry. Every fixture lives under the OS temp dir and is
// removed afterwards.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import net from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const runtimeDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(runtimeDir);
const tsxCli = path.join(repoRoot, "portal", "node_modules", "tsx", "dist", "cli.mjs");
const repoLedger = path.join(repoRoot, "surfaces", "agent-ops", "run-ledger.yaml");

// ---- network trap (in-process) -------------------------------------------
const network = { fetch: 0, connect: 0 };
const realFetch = globalThis.fetch;
const realConnect = net.Socket.prototype.connect;
globalThis.fetch = (async () => {
  network.fetch++;
  throw new Error("network trapped by slotDispatch.test.ts");
}) as typeof fetch;
// Local IPC (socket paths, used by tsx itself) passes through; TCP is refused.
net.Socket.prototype.connect = function trappedConnect(this: net.Socket, ...args: unknown[]) {
  const options = (Array.isArray(args[0]) ? args[0][0] : args[0]) as { path?: unknown } | undefined;
  if (options && typeof options === "object" && typeof options.path === "string") {
    return (realConnect as (...a: unknown[]) => net.Socket).apply(this, args);
  }
  network.connect++;
  throw new Error("socket trapped by slotDispatch.test.ts");
} as typeof net.Socket.prototype.connect;

// ---- fixture repo ----------------------------------------------------------
const SLOTS = [
  "slots:",
  "  JAI_BUILDER_SLOT:",
  "    provider: openai",
  "    model: gpt-test",
  "  JAI_ANTHROPIC_SLOT:",
  "    provider: anthropic",
  "    model: claude-test",
  "  JAI_ROUTER_SELECTOR:",
  "    provider: openai",
  "    model: gpt-test",
  "",
].join("\n");

const tempRoots: string[] = [];
function fixtureRepo(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "slot dispatch "));
  tempRoots.push(dir);
  mkdirSync(path.join(dir, ".nexus"), { recursive: true });
  writeFileSync(path.join(dir, ".nexus", "model-slots.yaml"), SLOTS);
  writeFileSync(path.join(dir, "input.md"), "operator input\n");
  return dir;
}

function listTree(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      out.push(path.relative(root, full));
      if (entry.isDirectory()) walk(full);
    }
  };
  walk(root);
  return out.sort();
}

const hashOrNull = (file: string) => (existsSync(file) ? createHash("sha256").update(readFileSync(file)).digest("hex") : null);
const repoLedgerBefore = hashOrNull(repoLedger);

// SLOT_CONFIG_PATH is bound to process.cwd() at import, so load from the fixture.
// (Files under runtime/ run as CommonJS under tsx, so no top-level await.)
const originalCwd = process.cwd();
type DispatchModule = typeof import("./slotDispatch.ts");
let dispatch: DispatchModule;
before(async () => {
  process.chdir(fixtureRepo());
  try {
    dispatch = await import(pathToFileURL(path.join(runtimeDir, "slotDispatch.ts")).href);
  } finally {
    process.chdir(originalCwd);
  }
});

const originalEnv = process.env;
function withInstrumentedEnv<T>(overrides: Record<string, string>, fn: () => Promise<T>) {
  const reads: string[] = [];
  const base = { ...originalEnv, ...overrides };
  process.env = new Proxy(base, {
    get(target, key) {
      if (typeof key === "string" && /API_KEY|SPEND/.test(key)) reads.push(key);
      return Reflect.get(target, key);
    },
  });
  return fn().finally(() => {
    process.env = originalEnv;
  }).then((value) => ({ value, reads }));
}

after(() => {
  globalThis.fetch = realFetch;
  net.Socket.prototype.connect = realConnect;
  process.env = originalEnv;
  process.chdir(originalCwd);
  for (const dir of tempRoots) rmSync(dir, { recursive: true, force: true });
  for (const dir of tempRoots) assert.equal(existsSync(dir), false, `fixture not removed: ${dir}`);
  assert.equal(hashOrNull(repoLedger), repoLedgerBefore, "the repository run ledger must not change");
});

function contract(overrides: Record<string, unknown> = {}) {
  return {
    run_id: "run-test-0001",
    task_id: "task-a3d",
    slot: "JAI_BUILDER_SLOT",
    provider: "openai",
    model: "gpt-test",
    motion_id: "motion-0248",
    scope: "Verify the spend lock.",
    execution_mode: "review_only",
    input_ref: null,
    output_artifact_path: "surfaces/agent-ops/results/run-test-0001.md",
    human_review_required: true,
    ...overrides,
  };
}

const FAKE_ENV = { OPENAI_API_KEY: "sk-test-fake-openai", JAI_LAYER2_AUTHORIZED_API_SPEND_USD: "1000.00" };

// ---- tests -----------------------------------------------------------------
test("control: the in-process trap records and refuses fetch and TCP attempts", async () => {
  const before = { ...network };
  await assert.rejects(fetch("https://api.openai.com/v1/responses"), /network trapped/);
  assert.throws(() => net.connect({ host: "api.openai.com", port: 443 }), /socket trapped/);
  assert.deepEqual(network, { fetch: before.fetch + 1, connect: before.connect + 1 });
  network.fetch = 0;
  network.connect = 0;
});

test("live dispatch rejects with SlotDispatchSpendLockError before any credential read or request", async () => {
  for (const overrides of [{}, { execution_mode: "bounded_write" }, { input_ref: "input.md" }]) {
    const { reads } = await withInstrumentedEnv(FAKE_ENV, async () => {
      await assert.rejects(dispatch.dispatchSlot(contract(overrides)), (error: Error & { code?: string }) => {
        assert.ok(error instanceof dispatch.SlotDispatchSpendLockError);
        assert.equal(error.name, "SlotDispatchSpendLockError");
        assert.equal(error.code, "PROVIDER_SPEND_NOT_AUTHORIZED");
        assert.match(error.message, /code-locked at USD 0\.00/);
        assert.match(error.message, /No credential was read and no request was sent/);
        return true;
      });
    });
    assert.deepEqual(reads, [], `no API key or spend variable may be read (${JSON.stringify(overrides)})`);
  }
  assert.equal(dispatch.SLOT_DISPATCH_LAYER2_AUTHORIZED_API_SPEND_USD, "0.00");
  assert.deepEqual(network, { fetch: 0, connect: 0 });
});

test("offline surfaces keep working: slot resolution and non-dispatch refusals", async () => {
  assert.deepEqual(dispatch.resolveSlotConfig("JAI_BUILDER_SLOT"), {
    ok: true,
    slot: { slot: "JAI_BUILDER_SLOT", provider: "openai", model: "gpt-test", notes: undefined },
  });
  assert.deepEqual(dispatch.resolveSlotConfig("JAI_ROUTER_SELECTOR"), { ok: false, failure_note: "selector slots excluded from dispatch" });
  assert.deepEqual(dispatch.resolveSlotConfig("JAI_MISSING_SLOT"), { ok: false, failure_note: "slot not found: JAI_MISSING_SLOT" });
  const { value: selector } = await withInstrumentedEnv(FAKE_ENV, () => dispatch.dispatchSlot(contract({ slot: "JAI_ROUTER_SELECTOR" })));
  assert.deepEqual(selector, { ok: false, failure_note: "selector slots excluded from dispatch" });
  const { value: unsupported } = await withInstrumentedEnv(FAKE_ENV, () =>
    dispatch.dispatchSlot(contract({ slot: "JAI_ANTHROPIC_SLOT", provider: "anthropic", model: "claude-test" })));
  assert.deepEqual(unsupported, { ok: false, failure_note: "unsupported provider: anthropic" });
  assert.deepEqual(network, { fetch: 0, connect: 0 });
});

test("run-slot-dispatch CLI fails closed end to end with no output artifact or ledger entry", () => {
  assert.ok(existsSync(tsxCli), `local tsx CLI missing: ${tsxCli}`);
  const cliRepo = fixtureRepo();
  const trapLog = path.join(cliRepo, "..", `${path.basename(cliRepo)}.trap.log`);
  const trap = path.join(cliRepo, "..", `${path.basename(cliRepo)}.trap.mjs`);
  writeFileSync(trap, [
    'import { appendFileSync } from "node:fs";',
    'import net from "node:net";',
    "const log = process.env.SLOT_TRAP_LOG;",
    'globalThis.fetch = async (input) => { appendFileSync(log, "fetch " + String(input) + "\\n"); throw new Error("trapped"); };',
    "const realConnect = net.Socket.prototype.connect;",
    "net.Socket.prototype.connect = function (...args) {",
    "  const o = Array.isArray(args[0]) ? args[0][0] : args[0];",
    '  if (o && typeof o === "object" && typeof o.path === "string") return realConnect.apply(this, args);',
    '  appendFileSync(log, "connect " + JSON.stringify(o && o.host ? o.host : o) + "\\n");',
    '  throw new Error("trapped");',
    "};",
    "",
  ].join("\n"));
  // Control: the same preload records a TCP connect and a fetch from a child process.
  const control = spawnSync(process.execPath, ["--input-type=module", "-e",
    'fetch("https://api.openai.com/v1/responses").catch(() => {}); try { (await import("node:net")).connect({ host: "api.openai.com", port: 443 }); } catch {}'], {
    encoding: "utf8",
    env: { ...originalEnv, SLOT_TRAP_LOG: trapLog, NODE_OPTIONS: `--import=${pathToFileURL(trap).href}` },
  });
  assert.equal(control.status, 0, control.stderr);
  assert.deepEqual(readFileSync(trapLog, "utf8").trim().split("\n"), ["fetch https://api.openai.com/v1/responses", 'connect "api.openai.com"']);
  rmSync(trapLog);

  const before = listTree(cliRepo);
  const result = spawnSync(process.execPath, [
    tsxCli, path.join(runtimeDir, "run-slot-dispatch.ts"),
    "--slot", "JAI_BUILDER_SLOT", "--motion", "motion-0248", "--task", "task-a3d", "--scope", "Verify the spend lock end to end.",
  ], {
    cwd: cliRepo,
    encoding: "utf8",
    env: { ...originalEnv, ...FAKE_ENV, SLOT_TRAP_LOG: trapLog, NODE_OPTIONS: `--import=${pathToFileURL(trap).href}` },
  });
  rmSync(trap, { force: true });
  const attempts = existsSync(trapLog) ? readFileSync(trapLog, "utf8") : "";
  rmSync(trapLog, { force: true });
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, /SlotDispatchSpendLockError/);
  assert.match(result.stderr, /code-locked at USD 0\.00/);
  assert.equal(attempts, "", `network attempts from the CLI: ${attempts}`);
  assert.deepEqual(listTree(cliRepo), before, "no output artifact, ledger or surfaces/ directory may be written");
  assert.equal(existsSync(path.join(cliRepo, "surfaces")), false);
});

test("every live dispatch site is preceded by the lock, and the ceiling is not env-configurable", () => {
  const source = readFileSync(path.join(runtimeDir, "slotDispatch.ts"), "utf8");
  const fetches = [...source.matchAll(/await fetch\(/g)];
  assert.equal(fetches.length, 1, "a new provider request site must be added here and locked deliberately");
  for (const site of fetches) {
    const fnStart = source.lastIndexOf("\nasync function ", site.index);
    const body = source.slice(fnStart, site.index);
    const lockAt = body.indexOf("assertSlotDispatchSpendLock(");
    const keyAt = body.indexOf("process.env[OPENAI_ENV_VAR_NAME]");
    assert.ok(lockAt !== -1, "fetch must be preceded by the lock in its function");
    assert.ok(keyAt === -1 || lockAt < keyAt, "lock before credential read");
  }
  const dispatchSlot = source.slice(source.indexOf("export async function dispatchSlot("), source.indexOf("\nfunction parseModelSlots("));
  const lockAt = dispatchSlot.indexOf("assertSlotDispatchSpendLock(");
  assert.ok(lockAt !== -1 && lockAt < dispatchSlot.indexOf("return dispatchOpenAI("), "dispatchSlot must lock before live dispatch");
  assert.match(source, /export const SLOT_DISPATCH_LAYER2_AUTHORIZED_API_SPEND_USD = "0\.00";/);
  assert.doesNotMatch(source, /process\.env(\.|\[)[^\n]*SPEND/, "the ceiling must not be read from the environment");
});

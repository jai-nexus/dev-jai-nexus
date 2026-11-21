// Q4M11Y26-P2:A3-C regression tests for the Motion Factory Layer 2 spend lock.
// Every child process runs with fake provider keys, an env attempt to raise
// the spend ceiling, and a preloaded trap that records and refuses any fetch
// or raw socket connection. No test can reach OpenAI or Anthropic.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const factory = fileURLToPath(new URL("./motion-factory.mjs", import.meta.url));
const SPEND_LOCK_EXIT_CODE = 3;

const TRAP = `
import { appendFileSync } from "node:fs";
import net from "node:net";
const log = process.env.MF_TRAP_LOG;
const record = (kind, detail) => appendFileSync(log, kind + " " + detail + "\\n");
globalThis.fetch = async (input) => {
  record("fetch", String(input && input.url ? input.url : input));
  throw new Error("network trapped by motion-factory.test.mjs");
};
net.Socket.prototype.connect = function (...args) {
  // net.connect() passes normalized [options, callback]; socket.connect() passes options.
  const options = Array.isArray(args[0]) ? args[0][0] : args[0];
  record("connect", JSON.stringify(options && options.host ? options.host : options));
  throw new Error("socket trapped by motion-factory.test.mjs");
};
`;

function fixture(t) {
  const dir = mkdtempSync(path.join(tmpdir(), "motion factory "));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, "repo");
  const motion = path.join(repo, ".nexus", "motions", "motion-0001");
  mkdirSync(motion, { recursive: true });
  writeFileSync(path.join(motion, "motion.yaml"), 'motion_id: motion-0001\ntitle: "fixture"\nstatus: DRAFT\n');
  for (const file of ["proposal.md", "challenge.md", "execution.md"]) writeFileSync(path.join(motion, file), `# ${file}\n`);
  mkdirSync(path.join(repo, ".nexus", "candidates"), { recursive: true });
  writeFileSync(
    path.join(repo, ".nexus", "candidates", "cm-fixture-offline.json"),
    JSON.stringify({ version: "0.1", candidateId: "cm-fixture-offline", intent: "Offline promote fixture", status: "emitted" }, null, 2),
  );
  writeFileSync(path.join(dir, "evidence.txt"), "tsc --noEmit: exit 0\n");
  const trap = path.join(dir, "trap.mjs");
  writeFileSync(trap, TRAP);
  return { dir, repo, trap, trapLog: path.join(dir, "trap.log"), evidence: path.join(dir, "evidence.txt") };
}

function run(fx, args) {
  return spawnSync(process.execPath, ["--import", pathToFileURL(fx.trap).href, factory, ...args], {
    cwd: fx.repo,
    encoding: "utf8",
    env: {
      ...process.env,
      OPENAI_API_KEY: "sk-test-fake-openai",
      ANTHROPIC_API_KEY: "sk-ant-test-fake",
      JAI_LAYER2_AUTHORIZED_API_SPEND_USD: "1000.00",
      MF_TRAP_LOG: fx.trapLog,
    },
  });
}

function networkAttempts(fx) {
  return existsSync(fx.trapLog) ? readFileSync(fx.trapLog, "utf8").trim().split("\n").filter(Boolean) : [];
}

function listTree(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      out.push(path.relative(root, full));
      if (entry.isDirectory()) walk(full);
    }
  };
  walk(root);
  return out.sort();
}

test("paid modes fail closed with exit 3 before any network call, even with keys and a raised env ceiling", (t) => {
  const fx = fixture(t);
  const before = listTree(fx.repo);
  const paid = [
    ["draft", "--intent", "Paid draft"],
    ["draft", "--intent", "Paid draft", "--provider", "anthropic"],
    ["draft", "--intent", "Paid draft preview", "--preview"],
    ["promote", "--candidate", "cm-fixture-offline"],
    ["promote", "--candidate", "cm-fixture-offline", "--provider", "anthropic", "--preview"],
    ["revise", "--motion", "motion-0001", "--notes", "Tighten scope"],
    ["revise", "--motion", "motion-0001", "--notes", "Tighten scope", "--provider", "anthropic", "--preview"],
    ["evidence", "--motion", "motion-0001", "--evidence-file", fx.evidence],
    ["evidence", "--motion", "motion-0001", "--evidence-file", fx.evidence, "--provider", "anthropic", "--preview"],
  ];
  for (const args of paid) {
    const result = run(fx, args);
    const label = args.join(" ");
    assert.equal(result.status, SPEND_LOCK_EXIT_CODE, `${label}\n${result.stderr}`);
    assert.match(result.stderr, /SPEND LOCK: paid provider API dispatch is disabled/, label);
    assert.match(result.stderr, /code-locked at USD 0\.00; no OpenAI or Anthropic request was sent/, label);
    // The earliest layer (command dispatch, before any credential read) must fire.
    const provider = args.includes("anthropic") ? "anthropic" : "openai";
    assert.match(result.stderr, new RegExp(`dispatch is disabled \\(${args[0]}:${provider}\\)`), label);
    assert.equal(result.stdout.includes("model-generated"), false, label);
  }
  assert.deepEqual(networkAttempts(fx), []);
  assert.deepEqual(listTree(fx.repo), before, "paid modes must not write any file");
});

test("status reports paid dispatch disabled independently of key presence", (t) => {
  const fx = fixture(t);
  const text = run(fx, ["status"]);
  assert.equal(text.status, 0, text.stderr);
  assert.match(text.stdout, /OPENAI_API_KEY:\s+present/);
  assert.match(text.stdout, /ANTHROPIC_API_KEY:\s+present/);
  assert.match(text.stdout, /Paid API dispatch: DISABLED \(Layer 2 spend code-locked at USD 0\.00\)/);

  const json = run(fx, ["status", "--json"]);
  assert.equal(json.status, 0, json.stderr);
  const providers = JSON.parse(json.stdout).providers;
  assert.equal(providers.openai_key_present, true);
  assert.equal(providers.anthropic_key_present, true);
  assert.equal(providers.paid_provider_dispatch_enabled, false);
  assert.equal(providers.layer2_authorized_api_spend_usd, "0.00");
  assert.deepEqual(networkAttempts(fx), []);
});

test("offline commands still work: context, draft/promote --no-api, with and without --preview", (t) => {
  const fx = fixture(t);
  const context = run(fx, ["context", "--intent", "Offline context", "--json"]);
  assert.equal(context.status, 0, context.stderr);
  assert.equal(JSON.parse(context.stdout).next_motion_id, "motion-0002");

  const before = listTree(fx.repo);
  const preview = run(fx, ["draft", "--intent", "Offline preview", "--no-api", "--preview"]);
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /proposal\.md/);
  assert.deepEqual(listTree(fx.repo), before, "--preview must not write files");

  const draft = run(fx, ["draft", "--intent", "Offline draft", "--no-api"]);
  assert.equal(draft.status, 0, draft.stderr);
  assert.ok(existsSync(path.join(fx.repo, ".nexus", "motions", "motion-0002", "motion.yaml")));

  const promotePreview = run(fx, ["promote", "--candidate", "cm-fixture-offline", "--no-api", "--preview"]);
  assert.equal(promotePreview.status, 0, promotePreview.stderr);
  const promote = run(fx, ["promote", "--candidate", "cm-fixture-offline", "--no-api"]);
  assert.equal(promote.status, 0, promote.stderr);
  assert.ok(existsSync(path.join(fx.repo, ".nexus", "motions", "motion-0003", "promotion.json")));
  assert.deepEqual(networkAttempts(fx), []);
});

test("usage documents the lock and invalid invocations still fail without network", (t) => {
  const fx = fixture(t);
  const usage = run(fx, []);
  assert.equal(usage.status, 1);
  assert.match(usage.stdout, /Paid provider API dispatch is disabled/);
  const unknown = run(fx, ["launch"]);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /Unknown command: launch/);
  const missing = run(fx, ["revise", "--notes", "x"]);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /Missing --motion/);
  assert.deepEqual(networkAttempts(fx), []);
});

test("control: the network trap records and refuses fetch and socket attempts", (t) => {
  const fx = fixture(t);
  const probe = 'fetch("https://api.openai.com/v1/responses").catch(() => {}); try { (await import("node:net")).connect({ host: "api.anthropic.com", port: 443 }); } catch {}';
  const result = spawnSync(process.execPath, ["--import", pathToFileURL(fx.trap).href, "--input-type=module", "-e", probe], {
    encoding: "utf8", env: { ...process.env, MF_TRAP_LOG: fx.trapLog },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(networkAttempts(fx), ["fetch https://api.openai.com/v1/responses", 'connect "api.anthropic.com"']);
});

test("every provider dispatch site and credential read is guarded by the spend lock", () => {
  const source = readFileSync(factory, "utf8").replace(/\r\n/g, "\n");
  const sites = [...source.matchAll(/fetch\("https:\/\/api\.(openai|anthropic)\.com/g)];
  assert.equal(sites.length, 4, "a new provider call site must be added here and guarded deliberately");
  for (const site of sites) {
    const functionStart = source.lastIndexOf("\nasync function ", site.index);
    const body = source.slice(functionStart, site.index);
    assert.match(body, /assertPaidProviderDispatchAllowed\("(openai|anthropic):/, `unguarded ${site[0]} in ${body.slice(0, 60)}`);
  }
  const requireApiKey = source.slice(source.indexOf("\nfunction requireApiKey("), source.indexOf("\nfunction utcNow("));
  assert.match(requireApiKey, /^\nfunction requireApiKey\(provider\) \{\n {4}assertPaidProviderDispatchAllowed\(/);
  const openaiNarrative = source.slice(source.indexOf("\nasync function generateNarrativeWithOpenAI("));
  assert.ok(openaiNarrative.indexOf("assertPaidProviderDispatchAllowed(") < openaiNarrative.indexOf("process.env.OPENAI_API_KEY"));
  assert.match(source, /const LAYER2_AUTHORIZED_API_SPEND_USD = "0\.00";/);
  assert.match(source, /const PAID_PROVIDER_DISPATCH_ENABLED = false;/);
  assert.doesNotMatch(source, /process\.env\.JAI_LAYER2_AUTHORIZED_API_SPEND_USD/, "the ceiling must not be configurable by env");
});

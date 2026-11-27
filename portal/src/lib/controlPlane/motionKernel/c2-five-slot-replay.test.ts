import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { canonicalJson, receiptHash } from "../receiptLedger/receiptLedger";
import { slots, type Envelope } from "./c1-five-slot-decision-contract";
import { replayFiveSlots } from "./c2-five-slot-replay";
import {
  blobId, loadLedgerSnapshot, loadRecordedInput, readPinnedBlob, ReplayError, sha256, strictJson,
  verifyReceipt, type ReplayPins, type VerifiedSnapshot,
} from "./c2-ledger-snapshot";

const root = path.resolve(__dirname, "../../../../..");
const pins = strictJson(readFileSync(path.join(__dirname, "c2-replay-pins-v1.json"))) as ReplayPins;
const load = () => loadLedgerSnapshot(root, pins);
function inventory() {
  const files: Record<string, string> = {};
  function visit(file: string) {
    if (!existsSync(file)) return;
    const stat = statSync(file, { bigint: true });
    if (stat.isDirectory()) {
      for (const name of readdirSync(file)) visit(path.join(file, name));
    } else {
      files[file] = stat.mtimeNs + ":" + sha256(readFileSync(file));
    }
  }
  visit(path.join(root, ".nexus/ledger"));
  const marker = path.join(root, ".git");
  const gitDir = statSync(marker).isDirectory() ? marker :
    path.resolve(root, readFileSync(marker, "utf8").trim().replace(/^gitdir: /, ""));
  const commonFile = path.join(gitDir, "commondir");
  const common = existsSync(commonFile) ? path.resolve(gitDir, readFileSync(commonFile, "utf8").trim()) : gitDir;
  visit(path.join(gitDir, "HEAD"));
  visit(path.join(gitDir, "refs"));
  visit(path.join(common, "refs"));
  visit(path.join(common, "packed-refs"));
  return files;
}
const cold = process.argv.includes("--cold-replay");
if (cold) {
  const replay = replayFiveSlots(loadRecordedInput(root, pins), load(), pins);
  assert.ok(replay.ok);
  process.stdout.write(canonicalJson({ payload: replay.payload, digest: replay.digest }));
} else {
  let initial: ReturnType<typeof inventory>;
  let snapshot: VerifiedSnapshot;
  let bytes: Buffer;
  let original: Envelope;
  before(() => {
    initial = inventory();
    snapshot = load();
    bytes = loadRecordedInput(root, pins);
    original = strictJson(bytes) as Envelope;
  });
  after(() => assert.deepEqual(inventory(), initial, "ledger files and Git refs must be untouched"));
  function reject(raw: Buffer, manifest: ReplayPins, code: string, verified = snapshot) {
    assert.deepEqual(replayFiveSlots(raw, verified, manifest), { ok: false, code, payload: null, digest: null });
  }
  function inputPins(raw: Buffer) {
    return { ...pins, input_sha256: sha256(raw), input_blob_sha: blobId(raw) };
  }
  const hasCode = (code: string) => (error: unknown) => error instanceof ReplayError && error.code === code;

  test("ledger is bound to the historical commit even from the later C2 fixture commit", () => {
    assert.equal(snapshot.snapshot_commit_sha, "15e2cc02a4ea3bdbd3c6e1123e822533b9bc5e31");
    assert.equal(snapshot.receipts.length, 23);
    assert.equal(new Set(snapshot.receipts.map(r => path.posix.dirname(r.path))).size, 9);
    assert.equal(snapshot.receipts.find(r => r.blob_sha === "a4dcd8ae37a8966c56a5f49abdce9f5f25c51afd")?.receipt_hash,
      "b45509fb3ff38b20d9dc82e5a301928151c7bd7d95a1f70d494aa4e7ad5c5a26");
    assert.throws(() => loadLedgerSnapshot(root, { ...pins, snapshot_commit_sha: "HEAD" }), hasCode("C2_PIN"));
    assert.throws(() => loadLedgerSnapshot(root, { ...pins, c1_contract_blob_sha: "0".repeat(40) }), hasCode("C2_PIN"));
    assert.throws(() => readPinnedBlob(root, "0".repeat(40)), hasCode("C2_SNAPSHOT"));
  });
  test("three fresh processes produce the exact canonical payload and frozen digest", () => {
    const result = replayFiveSlots(bytes, snapshot, pins);
    assert.ok(result.ok);
    assert.match(result.digest, /^[0-9a-f]{64}$/);
    assert.equal(result.digest, pins.expected_replay_digest);
    const expected = Buffer.from(canonicalJson({ payload: result.payload, digest: result.digest }));
    for (const [TZ, locale] of [["UTC","C"], ["America/Chicago","en_US.UTF-8"], ["Asia/Tokyo","C"]]) {
      const output = execFileSync(process.execPath, [require.resolve("tsx/cli"), __filename, "--cold-replay"], {
        env: { ...process.env, TZ, LANG: locale, LC_ALL: locale, GIT_ALLOW_PROTOCOL: "file", GIT_NO_LAZY_FETCH: "1" },
        timeout: 60_000,
      });
      assert.deepEqual(output, expected, TZ);
    }
  });
  test("slot order is canonical and dissent, risks, evidence, correlation and clock survive verbatim", () => {
    const r = replayFiveSlots(bytes, snapshot, pins);
    assert.ok(r.ok);
    const ordered = slots.map(slot => original.slot_outputs.find(o => o.slot === slot)!);
    assert.notDeepEqual(original.slot_outputs, ordered);
    assert.deepEqual(r.payload.envelope, { ...original, slot_outputs: ordered });
    assert.equal(r.payload.envelope.operator_clock_telemetry.active_founder_minutes, null);
    assert.equal(ordered[2].competing_positions.length, 2);
    assert.ok(ordered[3].competing_positions[0].includes("unknown"));
    assert.deepEqual(r.payload.verified_receipt_bindings, pins.receipts.filter(r => r.path.includes("/builder/")));
  });
  test("separately pinned clean case retains the measured interval and fraction of active minutes", () => {
    const e = structuredClone(original);
    e.slot_outputs.forEach(o => { o.competing_positions = []; });
    e.operator_clock_telemetry = { status: "MEASURED", started_at_iso: "2026-11-26T00:00:00Z",
      completed_at_iso: "2026-11-26T00:05:00Z", active_founder_minutes: 3.5, retries: 1, capture_method: "fixture log" };
    const raw = Buffer.from(JSON.stringify(e));
    const manifest = inputPins(raw);
    const payload = { replay_schema_version: "JAI-C2-REPLAY-v1", input_sha256: manifest.input_sha256,
      snapshot_commit_sha: pins.snapshot_commit_sha, c1_contract_blob_sha: pins.c1_contract_blob_sha,
      verified_receipt_bindings: pins.receipts.filter(r => r.path.includes("/builder/")),
      envelope: { ...e, slot_outputs: slots.map(slot => e.slot_outputs.find(o => o.slot === slot)) } };
    manifest.expected_replay_digest = createHash("sha256").update("JAI-C2-REPLAY-v1\0" + canonicalJson(payload)).digest("hex");
    const r = replayFiveSlots(raw, snapshot, manifest);
    assert.ok(r.ok);
    assert.deepEqual(r.payload.envelope.operator_clock_telemetry, e.operator_clock_telemetry);
  });
  test("malformed bytes, stale pins and forged verification results yield no partial output", () => {
    for (const [raw, code] of [
      [Buffer.from('{"items":[{"a":1,"\\u0061":2}]}'), "C2_DUPLICATE_KEY"],
      [Buffer.concat([Buffer.from([0xef,0xbb,0xbf]), bytes]), "C2_BOM"],
      [Buffer.from([0xff]), "C2_JSON"], [Buffer.from("{"), "C2_JSON"],
    ] as const) reject(raw, inputPins(raw), code);
    const changed = Buffer.from(bytes);
    changed[changed.length - 1] = 32;
    reject(changed, pins, "C2_INPUT_SHA");
    reject(bytes, { ...pins, c1_contract_blob_sha: "0".repeat(40) }, "C2_PIN");
    reject(bytes, { ...pins, input_blob_sha: "0".repeat(40) }, "C2_BLOB");
    reject(bytes, { ...pins, receipts: pins.receipts.slice(1) }, "C2_PIN");
    reject(bytes, { ...pins, expected_replay_digest: "0".repeat(64) }, "C2_DIGEST");
    reject(bytes, pins, "C2_PIN", { ...snapshot });
  });
  test("receipt bytes, predecessor links and frozen principals are independently verified", () => {
    const pin = pins.receipts[0];
    const raw = readPinnedBlob(root, pin.blob_sha);
    assert.throws(() => verifyReceipt(Buffer.concat([raw, Buffer.from(" ")]), pin, null), hasCode("C2_BLOB"));
    const next = pins.receipts.find(r => r.prev_ledger_entry_hash !== null)!;
    assert.throws(() => verifyReceipt(readPinnedBlob(root, next.blob_sha), next, null), hasCode("C2_CHAIN"));
    const event = { ...JSON.parse(raw.toString()), principal_id: "Unverified principal" };
    const changed = Buffer.from(canonicalJson(event) + "\n");
    assert.throws(() => verifyReceipt(changed, { ...pin, blob_sha: blobId(changed), receipt_hash: receiptHash(event) }, null),
      hasCode("C2_WRITER"));
  });
  test("invalid evidence, slot identity, authority and external action fields fail closed", () => {
    const faults: [string, (e: Envelope) => void][] = [
      ["C2_EVIDENCE", e => { e.intelligence_configuration.CONSTRUCTION.provenance[0].receipt_hash = "0".repeat(64); }],
      ["C1_MISSING_EVIDENCE", e => { e.slot_outputs[0].evidence_indices = [999]; }],
      ["C1_ROLE_COLLAPSE", e => { e.slot_outputs.pop(); }],
      ["C1_ROLE_COLLAPSE", e => { e.slot_outputs[1].slot = e.slot_outputs[0].slot; }],
      ["C1_ROLE_COLLAPSE", e => { e.slot_outputs[1].text = e.slot_outputs[0].text.toUpperCase(); }],
      ["C1_AUTHORITY_ESCALATION", e => { Object.assign(e.intelligence_configuration.GOVERNANCE, { authority_granted: true }); }],
      ["C1_MALFORMED_OUTPUT", e => { Object.assign(e, { external_action: { operation: "dispatch" } }); }],
    ];
    for (const [code, mutate] of faults) {
      const e = structuredClone(original);
      mutate(e);
      const raw = Buffer.from(JSON.stringify(e));
      reject(raw, inputPins(raw), code);
    }
  });
}

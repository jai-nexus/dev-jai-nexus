import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validate, receiptHash } from "./validate-package-format-2.mjs";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const baseline = "2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8";
const amendment = ".nexus/amendments/corpus-v1/motion-0248/amendment-01-q4m11y26-p2-scoping-and-format-2.yaml";
const schema = ".nexus/context/package-format-2.schema.json";

test("Package Format 2 compares temporary records to explicit Git history", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "jai-format2-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true, maxRetries: 3 }));
  function git(...args) {
    return execFileSync("git", ["-c", "commit.gpgsign=false", "-c", "core.hooksPath=" + path.join(root, "no-hooks"),
      "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", ...args], {
      cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  }
  const absolute = name => path.join(root, name);
  function write(name, data) {
    fs.mkdirSync(path.dirname(absolute(name)), { recursive: true });
    fs.writeFileSync(absolute(name), typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n");
  }
  git("clone", "--quiet", "--shared", "--no-checkout", repo, ".");
  git("config", "core.autocrlf", "false");
  git("checkout", "--quiet", "--detach", baseline);
  for (const name of [".nexus/corpus.yaml", amendment, schema]) write(name, fs.readFileSync(path.join(repo, name), "utf8"));

  const env = { package_format: 2, corpus_id: "corpus-v1" };
  const mo = { ...env, motion_id: "motion-9999" };
  const identity = { ...mo, program_code: "Q4M11Y26-P1", program_id: "fixture-program", program_slug: "fixture-program" };
  const dir = ".nexus/programs/corpus-v1/motion-9999/fixture-program";
  const parent = ".nexus/motions/motion-0248/motion.yaml";
  const source = { path: parent, source_commit: baseline, source_blob: git("rev-parse", baseline + ":" + parent) };
  const program = { document_kind: "program", ...identity, status: "RESERVED_NOT_OPENED", evidence: [source] };
  const lane = { document_kind: "lane_contract", ...identity, lane_coordinate: "A1", write_repo: "jai-nexus/dev-jai-nexus",
    depends_on: [], writers: { builder: "Fixture builder", verifier: "Fixture reviewer", "control-thread": "Fixture operator" }, evidence: [source] };
  const contract = dir + "/lanes/A1/contract.yaml";
  const ideaFile = ".nexus/conjectures/fixture-hypothesis.yaml";
  const idea = { document_kind: "conjecture", ...env, conjecture_id: "fixture-hypothesis", authority_granted: false,
    epistemic_status: "FALSIFIED_USEFUL", simulation_fidelity: "manual replay", dependency_realism: "synthetic",
    hypothesis: "A second pass catches all seeded defects.", observation: "One seeded defect survived." };
  write(".nexus/motions/motion-9999/motion.yaml", { document_kind: "motion", ...mo, title: "Temporary fixture", program_sequence: [identity.program_id] });
  write(dir + "/program.yaml", program);
  write(dir + "/batches.yaml", { document_kind: "batches", ...identity, batches: [{ batch_id: "A", lanes: ["A1", "A2"] }] });
  write(contract, lane);
  write(dir + "/lanes/A2/contract.yaml", { ...lane, lane_coordinate: "A2", depends_on: ["A1"] });
  write(dir + "/lanes/A1/estimate.yaml", { document_kind: "lane_estimate", ...identity, lane_coordinate: "A1", prior_estimate_founder_minutes: 15 });
  write(ideaFile, idea);
  const check = (base = baseline) => validate(root, base);

  // Each mutation restores its own fixture bytes, including on assertion failure.
  async function rejectChange(label, name, data, error) {
    await t.test(label, async () => {
      const old = fs.existsSync(absolute(name)) ? fs.readFileSync(absolute(name)) : null;
      if (data === null) fs.unlinkSync(absolute(name));
      else write(name, data);
      try { await assert.rejects(check(), error); }
      finally {
        if (old) fs.writeFileSync(absolute(name), old);
        else fs.unlinkSync(absolute(name));
      }
    });
  }
  await t.test("valid substrate with dormant, falsified conjecture", async () => {
    const result = await check();
    assert.equal(result.historical, 247);
    assert.equal(result.documents, 9);
  });
  await rejectChange("invalid schema fails closed", schema, { type: "anything" }, /Invalid Package Format 2 schema/);
  await rejectChange("missing Program identity", dir + "/program.yaml", { ...program, program_code: undefined }, /program_code/);
  await rejectChange("unknown fields", contract, { ...lane, write_repos: [] }, /additional properties/);
  await rejectChange("duplicate Program identity", dir + "-alias/program.yaml", { ...program, program_slug: "fixture-program-alias" }, /Duplicate canonical identity/);
  await rejectChange("duplicate lane coordinate under another path", dir + "/lanes/A3/contract.yaml", lane, /identity\/path mismatch/);
  await rejectChange("Chamber A authority escalation", ideaFile, { ...idea, authority_granted: true }, /authority_granted/);
  await rejectChange("Chamber A dependency", contract, { ...lane, depends_on: [ideaFile] }, /depends_on/);
  await rejectChange("Chamber A authoritative evidence", contract, { ...lane, evidence: [{ ...source, path: ideaFile }] }, /Chamber A cannot/);
  const registry = fs.readFileSync(absolute(".nexus/corpus.yaml"), "utf8");
  await rejectChange("corpus authority cannot derive from a conjecture", ".nexus/corpus.yaml",
    registry.replace(".nexus/canon/corpus/corpus-model-v0.md", ideaFile), /outside the constitutional canon/);
  await rejectChange("ambiguous cross-Program dependency", contract, { ...lane, depends_on: ["other/A1"] }, /depends_on/);
  await rejectChange("dependency cycle", contract, { ...lane, depends_on: ["A2"] }, /DAG cycle/);
  await rejectChange("missing target", contract, { ...lane, depends_on: ["B9"] }, /Missing dependency/);
  await rejectChange("multiple write repositories", contract, { ...lane, write_repo: ["org/a", "org/b"] }, /write_repo/);
  await rejectChange("modified historical Motion", parent, "tamper: true\n", /Immutable historical record changed/);
  await rejectChange("incorrect evidence hash", contract, { ...lane, evidence: [{ ...source, source_blob: "f".repeat(40) }] }, /Unbound source blob/);
  await rejectChange("parallel lane event store", dir + "/lanes/A1/events/event.json", { document_kind: "event" }, /events\/event\.json/);
  await rejectChange("conjecture outside its canonical namespace", ".nexus/context/misplaced.yaml", idea, /Misplaced Package Format 2/);
  await t.test("missing base object", async () => {
    await assert.rejects(check("f".repeat(40)), /Git history or object check failed: git cat-file/);
  });
  await t.test("incomplete comparison ancestry", async () => {
    const orphan = git("commit-tree", git("rev-parse", "HEAD^{tree}"), "-m", "disconnected fixture");
    await assert.rejects(check(orphan), /merge-base --is-ancestor/);
  });
  await t.test("shallow history fails explicitly", async () => {
    const shallow = absolute(".git/shallow");
    fs.writeFileSync(shallow, baseline + "\n");
    try { await assert.rejects(check(), /Incomplete Git comparison history/); }
    finally { fs.unlinkSync(shallow); }
  });

  function commit(message) {
    git("add", "--all");
    git("commit", "--quiet", "-m", message);
    return git("rev-parse", "HEAD");
  }
  const established = commit("fixture execution contracts");
  const event = { document_kind: "ledger_event", ...identity, lane_coordinate: "A1",
    event_id: "00000000010000000000000000", timestamp: "1970-01-01T00:00:00.001Z", writer_role: "builder",
    actor_id: "JAI::DEV::BUILDER::GPT-6.2-ASTRA::EXTRA-HIGH::2026-11-20", principal_id: lane.writers.builder, receipt_class: "B9-CLASS-004 / DELIVERY_RECEIPT",
    authority_granted: false, contract_source: { path: contract, source_commit: established, source_blob: git("rev-parse", established + ":" + contract) },
    evidence: [source], prev_ledger_entry_hash: null, lane_status: "DELIVERED", observed_founder_minutes: 8, rework_count_delta: 0 };
  function eventPath(e) {
    return ".nexus/ledger/corpus-v1/motion-9999/fixture-program/A1/" + e.writer_role + "/" +
      e.timestamp.replace(/[-:.]/g, "") + "-" + e.event_id + ".json";
  }
  const receipt = eventPath(event);
  write(receipt, event);
  await t.test("valid append-only ledger addition", async () => assert.equal((await check(established)).documents, 10));
  await rejectChange("writer namespace belongs to one principal", receipt, { ...event, principal_id: "other" }, /Unbound writer principal/);
  await rejectChange("builder cannot label an event with the verifier seat", receipt,
    { ...event, actor_id: event.actor_id.replace("BUILDER", "VERIFIER") }, /Invalid writer seat/);
  await rejectChange("a role alone is not an actor instance", receipt,
    { ...event, actor_id: "JAI::DEV::BUILDER" }, /Invalid writer seat/);
  await rejectChange("acceptance requires the human control writer", receipt,
    { ...event, receipt_class: "B9-CLASS-007 / CONTROL_ACCEPTANCE_RECEIPT" }, /Human control principal/);
  await rejectChange("ULID encodes timestamp", receipt, { ...event, timestamp: "1970-01-01T00:00:00.002Z" }, /identity\/path mismatch/);
  const wrongTime = { ...event, event_id: "00000000030000000000000001" };
  await rejectChange("canonical filename still requires matching ULID time", eventPath(wrongTime), wrongTime, /ULID timestamp mismatch/);
  await rejectChange("independent receipt class cannot be self-issued", receipt, { ...event, receipt_class: "B9-CLASS-006 / INDEPENDENT_VERIFICATION_RECEIPT" }, /Independent verifier/);
  const delivered = commit("fixture delivery receipt");
  const verify = { ...event, writer_role: "verifier", actor_id: "JAI::DEV::VERIFIER::CLAUDE::HIGH::2026-11-20",
    principal_id: lane.writers.verifier, event_id: "00000000010000000000000001",
    receipt_class: "B9-CLASS-006 / INDEPENDENT_VERIFICATION_RECEIPT" };
  await rejectChange("distinct contract principals cannot verify within the same declared model family",
    eventPath(verify), { ...verify, actor_id: verify.actor_id.replace("CLAUDE", "CODEX") }, /shares builder model family/);
  await t.test("verification and human acceptance use the frozen lane's own principals", async () => {
    const accept = { ...event, writer_role: "control-thread", actor_id: "JAI::OPS::OPERATOR::HUMAN::UNDECLARED::2026-11-20",
      principal_id: lane.writers["control-thread"], event_id: "00000000010000000000000002",
      receipt_class: "B9-CLASS-007 / CONTROL_ACCEPTANCE_RECEIPT" };
    try {
      write(eventPath(verify), verify);
      write(eventPath(accept), accept);
      assert.equal((await check(delivered)).documents, 12);
      write(eventPath(accept), { ...accept, actor_id: accept.actor_id.replace("OPS", "DEV") });
      await assert.rejects(check(delivered), /Invalid writer seat/);
    } finally {
      for (const record of [verify, accept]) fs.rmSync(absolute(eventPath(record)), { force: true });
    }
  });
  await rejectChange("modified established contract", contract, { ...lane, write_repo: "fixture/other" }, /Immutable historical record changed/);
  await rejectChange("deleted established contract", contract, null, /Immutable historical record changed/);
  await rejectChange("modified receipt", receipt, { ...event, rework_count_delta: 4 }, /Immutable historical record changed/);
  await rejectChange("deleted receipt", receipt, null, /Immutable historical record changed/);
  const next = { ...event, lane_status: "HOLD", timestamp: "1970-01-01T00:00:00.002Z", event_id: "00000000020000000000000000", prev_ledger_entry_hash: receiptHash(event) };
  await rejectChange("conflicting ledger predecessor", eventPath(next), { ...next, prev_ledger_entry_hash: null }, /Broken ledger predecessor/);
  write(eventPath(next), next);
  await t.test("append to an established stream and repeat", async () => {
    const first = await check(established);
    assert.equal(first.documents, 11);
    assert.deepEqual(await check(established), first);
  });
  const revised = commit("bounded revision as a new receipt");
  const compensation = { ...next, timestamp: "1970-01-01T00:00:00.003Z", event_id: "00000000030000000000000000",
    lane_status: event.lane_status, rework_count_delta: 1, prev_ledger_entry_hash: receiptHash(next),
    evidence: [{ path: eventPath(next), source_commit: revised, source_blob: git("rev-parse", revised + ":" + eventPath(next)) }] };
  write(eventPath(compensation), compensation);
  const compensated = commit("compensate by append");
  await t.test("compensation binds the superseded blob and preserves both prior blobs", async () => {
    assert.equal((await check(delivered)).documents, 12);
    for (const [name, sha] of [[receipt, delivered], [eventPath(next), revised]])
      assert.equal(git("rev-parse", compensated + ":" + name), git("rev-parse", sha + ":" + name));
  });
  for (const operation of ["edit", "delete"]) {
    await t.test(operation + " followed by restoration cannot hide a receipt rewrite", async () => {
      if (operation === "edit") write(receipt, { ...event, observed_founder_minutes: 100 });
      else fs.unlinkSync(absolute(receipt));
      commit("fixture " + operation);
      write(receipt, event);
      commit("restore receipt bytes");
      assert.equal(git("rev-parse", "HEAD:" + receipt), git("rev-parse", delivered + ":" + receipt));
      await assert.rejects(check(compensated), /Immutable historical record changed: .nexus\/ledger/);
      git("checkout", "--quiet", "--detach", compensated);
    });
  }
  await t.test("a later revert cannot conceal a contract rewrite", async () => {
    write(contract, { ...lane, write_repo: "fixture/other" });
    commit("fixture contract overwrite");
    write(contract, lane);
    commit("restore original contract bytes");
    await assert.rejects(check(established), /Immutable historical record changed/);
  });
});

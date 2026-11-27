import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalJson } from "../receiptLedger/receiptLedger";
import { slots, type Envelope } from "./c1-five-slot-decision-contract";
import { blobId, loadLedgerSnapshot as verifyC2LedgerSnapshot, loadRecordedInput, sha256, strictJson, type ReplayPins, type VerifiedSnapshot } from "./c2-ledger-snapshot";
import { replayFiveSlots as replayFiveSlotDecision } from "./c2-five-slot-replay";
import { anchors, computeCanonicalSpecSectionHash, computeC3AnswerKeySeal, computeC3CorpusSeal, MEASURED_ARMS,
  structured_call_budget_per_case, TASK_COMPLEXITY_TIERS, verifyC3Reveal, type Arm } from "./c3-preregistration-protocol";
import { coldReconstructDecisionEvidencePacket, type C3DecisionEvidencePacketV1 } from "./c3-decision-evidence-packet";
import { scoreC3Study, type ArmRun, type ReconstructionInput } from "./c3-mechanical-scorer";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
const git = (...args: string[]) => execFileSync("git", ["--no-replace-objects", ...args], { cwd: root, encoding: "utf8" }).trim();
const bytes = (value: unknown) => Buffer.from(canonicalJson(value));
const pins = strictJson(readFileSync(new URL("./c2-replay-pins-v1.json", import.meta.url))) as ReplayPins;
let snapshot: VerifiedSnapshot, raw: Buffer, original: Envelope, evidenceBefore: string;
function inventory() {
  const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file + ":" + statSync(file, { bigint: true }).mtimeNs + ":" + sha256(readFileSync(file))];
  });
  return canonicalJson([files(path.join(root, ".nexus/ledger")).sort(), git("show-ref", "--head")]);
}
before(() => {
  evidenceBefore = inventory();
  snapshot = verifyC2LedgerSnapshot(root, pins);
  raw = loadRecordedInput(root, pins);
  original = strictJson(raw) as Envelope;
});
after(() => assert.equal(inventory(), evidenceBefore));

const tiers = TASK_COMPLEXITY_TIERS, [two, free, five] = MEASURED_ARMS;
const syntheticSalt = "ab".repeat(32), syntheticKeySalt = "cd".repeat(32);
const telemetry = { rate_card_pinned_date: "2026-11-19", telemetry_status: "UNOBSERVABLE_SUBSCRIPTION_SURFACE",
  observed_input_tokens: null, observed_output_tokens: null } as const;
const cases = Array.from({ length: 15 }, (_, i) => ({ case_id: "mock-" + i, task_complexity_tier: tiers[i % 4], case_input: "unit-" + i }));
const corpus = { cases, max_case_input_utf8_bytes: 100, max_output_chars_per_pass: 4096, wall_clock_cap_seconds_per_case: 600 };
function mockKey() {
  // Resolve only metadata for the P1 program closeout. The artificial defect below describes no P1 content.
  const p = "docs/reference/q3m7y26-p1-f15-program-closeout-receipt-v0.md";
  const source = { path: p, source_commit: anchors.base, source_blob: git("rev-parse", anchors.base + ":" + p) };
  return cases.map((c, i) => ({ case_id: c.case_id, defects: [{ defect_id: "unit-" + i, severity: "CRITICAL_P1",
    target_clause_id: "mock-clause", defect_class: "mock-class", required_remediation_code: "mock-code", adversarial_trap: true, p1_source: source }] }));
}
function sealed(c: unknown, k: unknown) {
  return { corpus_seal: computeC3CorpusSeal(bytes(c), syntheticSalt), answer_key_seal: computeC3AnswerKeySeal(bytes(k), syntheticKeySalt), spec_hash: anchors.spec };
}
function measured(minutes: number): Envelope["operator_clock_telemetry"] {
  return { status: "MEASURED", started_at_iso: "2026-11-27T00:00:00Z", completed_at_iso: "2026-11-27T00:10:00Z",
    active_founder_minutes: minutes, retries: 0, capture_method: "unit-test clock" };
}
function packet(e: Envelope, p: ReplayPins, index: number): C3DecisionEvidencePacketV1 {
  return { packet_version: "C3-DECISION-EVIDENCE-PACKET-v1", case_id: cases[index].case_id, task_complexity_tier: cases[index].task_complexity_tier,
    intelligence_configuration: e.intelligence_configuration, c2_replay_binding: { recorded_envelope_sha256: p.input_sha256,
      c2_replay_digest: p.expected_replay_digest, snapshot_commit_sha: p.snapshot_commit_sha, c1_contract_blob_sha: p.c1_contract_blob_sha },
    cost_to_verified_execution: { L1_subscription_allocation_note: { allocation_basis: "unit-test subscription allocation", monthly_subscription_usd: 200 },
      L2_metered_api_cash_usd: 0, L3_token_equivalent_non_cash: telemetry, L4_founder_time_non_cash: e.operator_clock_telemetry },
    reusable_capability_delta: { artifact_or_verifier_id: "unit-check", repository_path: "portal/src/lib/controlPlane/motionKernel/c2-five-slot-replay.ts",
      reusable_check_kind: "offline replay", hypothesized_next_loop_cost_reduction: "Repeated checks may take less operator time.",
      claim_status: "HYPOTHESIZED_UNVERIFIED" } };
}
function repin(e: Envelope, index: number) {
  const rawEnvelopeBytes = bytes(e), input_sha256 = sha256(rawEnvelopeBytes);
  const payload = { replay_schema_version: "JAI-C2-REPLAY-v1", snapshot_commit_sha: pins.snapshot_commit_sha,
    c1_contract_blob_sha: pins.c1_contract_blob_sha, input_sha256, verified_receipt_bindings: pins.receipts.filter(r => r.path.includes("/builder/")),
    envelope: { ...e, slot_outputs: slots.map(slot => e.slot_outputs.find(o => o.slot === slot)) } };
  const expected_replay_digest = createHash("sha256").update("JAI-C2-REPLAY-v1\0").update(canonicalJson(payload)).digest("hex");
  const variant = { ...pins, input_blob_sha: blobId(rawEnvelopeBytes), input_sha256, expected_replay_digest };
  return { packet: packet(e, variant, index), rawEnvelopeBytes, pins: variant };
}
function armRun(index: number, arm: Arm): ArmRun {
  const envelope = structuredClone(original), config = envelope.intelligence_configuration;
  const mode = arm === five ? "five-slot" : arm === two ? "two-seat" : "one-model";
  config.COORDINATION.mode = mode;
  const seats = arm === five ? 5 : arm === two ? 2 : 1;
  const construction = config.CONSTRUCTION;
  construction.models = construction.models.slice(0, seats).map(m => ({ ...m, provider_family: "openai", model_id: "unit-model" }));
  const c = cases[index], caseHash = sha256(Buffer.from(c.case_input));
  construction.prompt_versions = ["unit-test", "C3-CASE:" + canonicalJson([c.case_id, c.task_complexity_tier, caseHash])];
  construction.correlation_disclosure.shared_model_or_lineage = seats > 1;
  construction.correlation_disclosure.correlation_groups = seats > 1 ? [construction.models.map(m => m.slot)] : [];
  envelope.slot_outputs = envelope.slot_outputs.filter(o => construction.models.some(m => m.slot === o.slot));
  envelope.operator_clock_telemetry = measured(2);
  const findings = arm === five ? [{ target_clause_id: "mock-clause", defect_class: "mock-class", remediation_code: "mock-code", disposition: "REMEDIATE" }] : [];
  const output = canonicalJson({ disposition: "HOLD", findings });
  envelope.slot_outputs.find(o => o.slot === construction.models[seats - 1].slot)!.text = output;
  return { case_id: cases[index].case_id, arm, session_id: cases[index].case_id + "-" + arm,
    isolation: { fresh_temporary_session: true, web_search: false, repo_connectors: false, drive_connectors: false, file_tools: false, cross_chat_memory: false },
    surface: "OPENAI_SUBSCRIPTION", L2_metered_api_cash_usd: 0,
    case_input_sha256: caseHash, wall_clock_seconds: 600, l3_token_telemetry_status: telemetry.telemetry_status, l3_token_telemetry: telemetry,
    passes: Array.from({ length: structured_call_budget_per_case[arm] }, (_, i) => ({ provider_family: "OpenAI", model_id: "unit-model",
      output: arm === free ? (i === 4 ? output : "unit-pass") :
        envelope.slot_outputs.find(o => o.slot === construction.models[i].slot)!.text })), envelope };
}

test("frozen Git and section anchors", () => {
  const lane = ".nexus/programs/corpus-v1/motion-0248/jai-five-slot-compounded-reasoning-shadow-kernel-v0/lanes/C3/";
  for (const [file, blob] of [["contract.yaml", anchors.contract], ["estimate.yaml", anchors.estimate]])
    assert.equal(git("rev-parse", "HEAD:" + lane + file), blob);
  assert.match(git("cat-file", "blob", anchors.estimate), /^prior_estimate_founder_minutes: 60$/m);
  const amendment = ".nexus/amendments/corpus-v1/motion-0248/amendment-01-q4m11y26-p2-scoping-and-format-2.yaml";
  assert.equal(git("rev-parse", "HEAD:" + amendment), anchors.amendment);
  const section = "## Permitted candidate files\n\nmock\n\n## Non-authorizations\n\nmock";
  assert.equal(computeCanonicalSpecSectionHash("status\n" + section.replace(/\n/g, "\r\n") + "\n\n## History\nmutable"), computeCanonicalSpecSectionHash(section));
  assert.notEqual(computeCanonicalSpecSectionHash(section + "!"), computeCanonicalSpecSectionHash(section));
});
test("independent seals reject tampering, duplicate keys, bad salts, matrix drift and stale provenance", () => {
  const key = mockKey(), commitment = sealed(corpus, key);
  const reveal = (c: unknown, k: unknown, frozen = commitment, salt = syntheticSalt) =>
    verifyC3Reveal(root, bytes(c), bytes(k), salt, syntheticKeySalt, frozen);
  assert.ok(Object.isFrozen(reveal(corpus, key).key));
  assert.throws(() => reveal(corpus, key, commitment, "00".repeat(32)));
  assert.throws(() => reveal(corpus, [], commitment));
  assert.throws(() => reveal({}, key, commitment));
  assert.throws(() => computeC3CorpusSeal({}, "aa"));
  for (const fn of [computeC3CorpusSeal, computeC3AnswerKeySeal]) assert.throws(() => fn('{"a":1,"\\u0061":2}', syntheticSalt));
  assert.notEqual(computeC3CorpusSeal({}, syntheticSalt), computeC3AnswerKeySeal({}, syntheticSalt));
  for (const rows of [cases.slice(1), [...cases, cases[0]], cases.map(c => ({ ...c, task_complexity_tier: tiers[0] }))]) {
    const bad = { ...corpus, cases: rows };
    assert.throws(() => reveal(bad, key, sealed(bad, key)));
  }
  const fewer = key.map((k,i) => i < 4 ? k : { ...k, defects: [] });
  assert.throws(() => reveal(corpus, fewer, sealed(corpus, fewer)));
  key[0].defects[0].p1_source.source_blob = "0".repeat(40);
  assert.throws(() => reveal(corpus, key, sealed(corpus, key)), /C3_P1_BLOB/);
});
test("exact committed C2 fixture fails separation; measured in-memory OpenAI variant cold-replays", () => {
  assert.equal(snapshot.receipts.length, 23);
  assert.equal(snapshot.snapshot_commit_sha, "15e2cc02a4ea3bdbd3c6e1123e822533b9bc5e31");
  assert.ok(replayFiveSlotDecision(raw, snapshot, pins).ok);
  assert.deepEqual(coldReconstructDecisionEvidencePacket(packet(original,pins,0),raw,snapshot,pins), { ok: false, code: "C1_VERIFIER_SELF_GRADING_CONFLICT" });
  const e = armRun(0,five).envelope;
  const data = repin(e,0);
  assert.ok(replayFiveSlotDecision(data.rawEnvelopeBytes,snapshot,data.pins).ok);
  const cold = () => coldReconstructDecisionEvidencePacket(data.packet,data.rawEnvelopeBytes,snapshot,data.pins);
  assert.ok(cold().ok);
  assert.deepEqual(cold(),cold());
  assert.deepEqual(coldReconstructDecisionEvidencePacket({ ...data.packet, case_id: "relabeled" },
    data.rawEnvelopeBytes,snapshot,data.pins), { ok: false, code: "C3_CASE_BINDING" });
  Object.assign(data.packet.cost_to_verified_execution,{ combined_total_usd: 5 });
  assert.equal(cold().ok,false);
});
test("45-cell synthetic matrix produces mechanical positive, negative, suspension, rejection and hold outcomes", () => {
  const key = mockKey(), study = verifyC3Reveal(root, bytes(corpus), bytes(key), syntheticSalt, syntheticKeySalt, sealed(corpus,key));
  const runs = cases.flatMap((_,i) => MEASURED_ARMS.map(a => armRun(i,a)));
  function score(records = runs, packetCount = 15) {
    const evidence = new Map<string, ReconstructionInput>();
    records.filter(r => r.arm === five).slice(0,packetCount).forEach((r,i) => evidence.set(r.case_id,repin(r.envelope,i)));
    return scoreC3Study(study,records,snapshot,evidence);
  }
  assert.equal(score().disposition,"PASS");
  assert.equal(score(runs,13).T3,"PASS");
  assert.equal(score(runs,12).disposition,"REJECT_VERIFICATION_CLAIM");
  const slow = structuredClone(runs);
  slow.filter(r => r.arm === five).forEach(r => { r.envelope.operator_clock_telemetry = measured(3.1); });
  assert.equal(score(slow).T1,"DOWNGRADE_5_TO_3_TO_2_SEATS");
  const missed = structuredClone(runs);
  for (const r of missed.filter(r => r.arm === five)) {
    const output = canonicalJson({ disposition: "HOLD", findings: [] });
    r.passes[4].output = output;
    r.envelope.slot_outputs.find(o => o.slot === "Synthesis")!.text = output;
  }
  assert.equal(score(missed).null_result,"ELIGIBLE_FOR_HUMAN_CLOSED_ACCEPTED");
  assert.equal(score(missed).T1,"DOWNGRADE_5_TO_3_TO_2_SEATS");
  missed.filter(r => r.arm === five).slice(0,3).forEach(r => {
    const output = canonicalJson({ disposition: "CONSENSUS", findings: [] });
    r.passes[4].output = output;
    r.envelope.slot_outputs.find(o => o.slot === "Synthesis")!.text = output;
  });
  assert.equal(score(missed).T2,"SUSPEND_ROLE_COLLAPSED_CONFIGURATION");
  const unknown = structuredClone(runs);
  unknown[0].envelope.operator_clock_telemetry = original.operator_clock_telemetry;
  assert.equal(score(unknown).code,"C3_HOLD_UNMEASURED_FOUNDER_CLOCK");
  assert.equal(score(unknown).disposition,"HOLD_OR_REVISE");
  assert.equal(score(unknown).per_arm[two].active_founder_minutes_total,null);
  unknown.filter(r => r.arm === two).forEach(r => { r.envelope.operator_clock_telemetry = measured(0); });
  assert.equal(score(unknown).T1,"HOLD_ZERO_BASELINE");
  for (const mutate of [
    (r: ArmRun) => { r.envelope.intelligence_configuration.CONSTRUCTION.models[0].provider_family = "Anthropic"; },
    (r: ArmRun) => { Object.assign(r,{ arm: "three-seat" }); },
    (r: ArmRun) => { r.session_id = runs[1].session_id; },
    (r: ArmRun) => { Object.assign(r.isolation,{ web_search: true }); },
    (r: ArmRun) => { r.passes.pop(); },
    (r: ArmRun) => { Object.assign(r.l3_token_telemetry,{ observed_input_tokens: 0 }); },
  ]) {
    const bad = structuredClone(runs);
    mutate(bad[0]);
    assert.throws(() => score(bad));
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendReceipt, canonicalJson, receiptHash } from "./receiptLedger";

test("RFC 8785 sections 3.2.2–3.2.4 and Appendix B match the domain-separated bytes", () => {
  const value = { string: "€$\u000f\nA'B\"\\\\\"/", numbers: [333333333.33333329, 1e30, 4.50, 2e-3, 1e-27],
    literals: [null, true, false] };
  const expected = String.raw`{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27],"string":"€$\u000f\nA'B\"\\\\\"/"}`;
  assert.equal(canonicalJson(value), expected);
  assert.equal(receiptHash(value), createHash("sha256").update("JAI-RECEIPT-v1\0" + expected, "utf8").digest("hex"));
  const keys = ["\r", "1", "\u0080", "ö", "€", "😀", "\ufb33"];
  const reverse = Object.fromEntries([...keys].reverse().map(k => [k, 0]));
  assert.equal(canonicalJson([{ x: reverse }]), '[{"x":{' + keys.map(k => JSON.stringify(k) + ":0").join(",") + '}}]');
  assert.equal(canonicalJson([-0, Number.MIN_VALUE, Number.MAX_VALUE, 1e-6, 1e-7]),
    "[0,5e-324,1.7976931348623157e+308,0.000001,1e-7]");
  for (const invalid of [NaN, Infinity, undefined, "\udfff", { ["\ud800"]: 0 }, Array(2)]) assert.throws(() => canonicalJson(invalid));
});

test("bare Git proposal append, replay, and competing revisions use ref compare-and-swap", async t => {
  const repository = mkdtempSync(path.join(tmpdir(), "b1 ledger "));
  t.after(() => rmSync(repository, { recursive: true, force: true, maxRetries: 3 }));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: repository, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const root = fileURLToPath(new URL("../../../../../", import.meta.url));
  git("clone", "--bare", "--shared", root, ".");
  const base = "710665257d49893ab551372d09e5f51092b9af7b";
  git("update-ref", "refs/heads/main", base);
  git("update-ref", "refs/heads/b1-fixture", base);
  const slug = "jai-five-slot-compounded-reasoning-shadow-kernel-v0";
  const contract = ".nexus/programs/corpus-v1/motion-0248/" + slug + "/lanes/B1/contract.yaml";
  const source = { path: contract, source_commit: base, source_blob: git("rev-parse", base + ":" + contract) };
  const initial = { document_kind: "ledger_event", package_format: 2, corpus_id: "corpus-v1", motion_id: "motion-0248",
    program_code: "Q4M11Y26-P2", program_id: slug, program_slug: slug, lane_coordinate: "B1",
    event_id: "00000000010000000000000000", timestamp: "1970-01-01T00:00:00.001Z", writer_role: "builder",
    actor_id: "JAI::DEV::BUILDER::GPT-6.2-ASTRA::EXTRA-HIGH::2026-11-20", principal_id: "ChatGPT / Codex",
    receipt_class: "B9-CLASS-004 / DELIVERY_RECEIPT", authority_granted: false, contract_source: source,
    evidence: [source], prev_ledger_entry_hash: null, lane_status: "DELIVERED", observed_founder_minutes: 0, rework_count_delta: 0 };
  const request = { repository, branch: "b1-fixture", expectedBaseSha: base, expectedHeadSha: base, event: initial };
  const writer = { role: "builder", principalId: initial.principal_id, actorId: initial.actor_id } as const;
  const append = (proposal: Parameters<typeof appendReceipt>[0]) => appendReceipt(proposal, writer);
  await assert.rejects(appendReceipt(request, { ...writer, role: "verifier" }), /writer context/);
  assert.notEqual(receiptHash(initial), receiptHash({ ...initial, actor_id: initial.actor_id + ".02" }));
  const first = await append(request);
  assert.ok(first.appended);
  assert.equal(git("rev-parse", "b1-fixture"), first.head);
  const next = { ...request, expectedHeadSha: first.head };
  assert.equal((await append(next)).appended, false);
  assert.equal(git("rev-parse", "b1-fixture"), first.head);
  await assert.rejects(append(request), /Stale/);
  await assert.rejects(append({ ...next, expectedBaseSha: first.head }), /Stale/);
  await assert.rejects(append({ ...next, event: { ...initial, lane_status: "HOLD" } }), /Conflicting receipt/);
  await assert.rejects(append({ ...next, event: { ...initial, lane_coordinate: "../../other" } }), /Invalid ledger event/);
  const revision = { ...initial, lane_status: "HOLD", event_id: "00000000020000000000000000",
    timestamp: "1970-01-01T00:00:00.002Z", prev_ledger_entry_hash: first.hash };
  await assert.rejects(append({ ...next, event: { ...revision, prev_ledger_entry_hash: null } }), /Broken ledger predecessor/);
  const outcomes = await Promise.allSettled([append({ ...next, event: revision }),
    append({ ...next, event: { ...revision, event_id: "00000000020000000000000001" } })]);
  assert.equal(outcomes.filter(outcome => outcome.status === "fulfilled").length, 1);
  const loser = outcomes.find(outcome => outcome.status === "rejected");
  assert.match(String(loser?.reason), /lock ref|Stale/);
  assert.equal(git("rev-list", "--count", base + "..b1-fixture"), "2");
  assert.equal(git("rev-parse", "main"), base);
  assert.equal(git("rev-parse", "b1-fixture:" + first.path), git("rev-parse", first.head + ":" + first.path));
  const operator = { role: "control-thread", principalId: "Jerry Ingram", actorId: "Jerry Ingram" } as const;
  const acceptance = { ...initial, event_id: "00000000030000000000000000", timestamp: "1970-01-01T00:00:00.003Z",
    writer_role: operator.role, principal_id: operator.principalId, actor_id: operator.actorId,
    receipt_class: "B9-CLASS-007 / CONTROL_ACCEPTANCE_RECEIPT" };
  const proposal = { ...request, expectedHeadSha: git("rev-parse", "b1-fixture"), event: acceptance };
  const wrongSeat = "JAI::DEV::OPERATOR::GPT::HIGH::2026-11-20";
  await assert.rejects(appendReceipt({ ...proposal, event: { ...acceptance, actor_id: wrongSeat } },
    { ...operator, actorId: wrongSeat }), /exact human principal/);
  await assert.rejects(appendReceipt({ ...proposal, event: { ...acceptance, actor_id: wrongSeat, principal_id: wrongSeat } },
    { ...operator, actorId: wrongSeat, principalId: wrongSeat }), /exact human principal/);
  assert.equal(git("rev-parse", "b1-fixture"), proposal.expectedHeadSha);
  assert.ok((await appendReceipt(proposal, operator)).appended);
});

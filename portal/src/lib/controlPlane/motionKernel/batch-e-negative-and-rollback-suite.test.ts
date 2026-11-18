import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { mock, test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import {
  applyLocalOperatingLoopBrowserLifecycle,
  createAdaptedBoundaryReceipt,
  createLocalOperatingLoopTerminalPresentation,
  createLocalOperatingLoopUiState,
  LOCAL_SHADOW_PROGRAM_SNAPSHOT as snapshot,
  shouldApplyLocalOperatingLoopResponse,
  type LocalOperatingLoopDecision,
  type LocalOperatingLoopInput,
  type LocalOperatingLoopResponse,
} from "./local-operating-loop";
import {
  adaptLocalShadowTerminalToBatchBContract as adapt,
  type BatchBLifecycleContractAdapterInput,
} from "./batch-b-lifecycle-contract-adapter";
import type { createLocalOperatingLoopHandler } from "./local-operating-loop-handler";

type Handler = ReturnType<typeof createLocalOperatingLoopHandler>;
type Dependencies = Parameters<typeof createLocalOperatingLoopHandler>[0];
const input: LocalOperatingLoopInput = {
  motionId: "batch-e-fixture",
  title: "Verify the local decision boundary",
  summary: "Exercise the local shadow with synthetic motion evidence and an explicit decision.",
  targetRepo: "dev-jai-nexus",
  targetThreads: ["JAI_CONTROL_THREAD"],
  evidencePointers: ["private-test-evidence"],
};
const admin = { authenticated: true, role: "ADMIN", email: "admin@example.test" } as const;

async function makeHandler(overrides: Partial<Dependencies> = {}) {
  // Load after installing the adapter mock in the isolated N3 process.
  const { createLocalOperatingLoopHandler: create } = await import("./local-operating-loop-handler");
  return create({ readSecret: () => "batch-e-fixture", authenticate: async () => admin, ...overrides });
}

async function post(handler: Handler, fields: Record<string, unknown>) {
  const response = await handler(new Request("http://local.test/loop", {
    method: "POST",
    body: JSON.stringify({ input, programSnapshot: snapshot, ...fields }),
  }));
  return { status: response.status, body: await response.json() as LocalOperatingLoopResponse };
}

function denied(result: Awaited<ReturnType<typeof post>>, status: number, code: string) {
  assert.equal(result.status, status);
  assert.equal(result.body.ok, false);
  assert.equal(result.body.error.code, code);
  assert.deepEqual(result.body.workPackets, []);
  for (const key of ["workPacket", "artifact", "adaptedReceipt", "boundaryReceipt", "validationProof", "deliberationProof"]) {
    assert.ok(!Object.hasOwn(result.body, key), key);
  }
}

async function validate(handler: Handler, motion = input) {
  const result = await post(handler, { action: "VALIDATE", input: motion });
  assert.equal(result.status, 200);
  assert.ok(result.body.ok && result.body.state === "VALIDATED");
  return result.body.validationProof;
}

async function deliberate(handler: Handler, motion = input) {
  const validationProof = await validate(handler, motion);
  const result = await post(handler, { action: "DELIBERATE", input: motion, validationProof });
  assert.equal(result.status, 200);
  assert.ok(result.body.ok && result.body.state === "AWAITING_DECISION");
  return result.body;
}

async function decide(handler: Handler, decision: LocalOperatingLoopDecision, motion = input) {
  const { deliberationProof } = await deliberate(handler, motion);
  return post(handler, { action: "DECIDE", input: motion, decision, deliberationProof });
}

function editLastDigit(proof: string) {
  return proof.slice(0, -1) + (proof.endsWith("0") ? "1" : "0");
}

async function verifyAdapterBlock() {
  let calls = 0;
  const adapterUrl = new URL("./batch-b-lifecycle-contract-adapter.ts", import.meta.url);
  const replacement = mock.module(adapterUrl.href, {
    namedExports: {
      adaptLocalShadowTerminalToBatchBContract(payload: BatchBLifecycleContractAdapterInput) {
        assert.equal(adapt(payload).kind, "ADAPTED");
        const rejected = adapt({ ...payload, contractVersion: "batch-e-mismatched-version" });
        assert.equal(rejected.kind, "CONTRACT_VERSION_MISMATCH");
        calls++;
        return rejected;
      },
    },
  });
  try {
    const handler = await makeHandler();
    const { deliberationProof } = await deliberate(handler);
    const request = { action: "DECIDE", decision: "ACCEPT", deliberationProof };
    denied(await post(handler, request), 409, "D9_ADAPTER_BLOCKED");
    denied(await post(handler, request), 409, "INVALID_PROOF");
    assert.equal(calls, 1);
    console.log("N3 real adapter mismatch -> handler 409 D9_ADAPTER_BLOCKED");
  } finally {
    replacement.restore();
  }
}

if (process.argv.includes("--batch-e-n3")) {
  await verifyAdapterBlock();
} else {
  test("E1 v0: each invalid transition has a denial signal, zero outputs and a fresh recovery path", async () => {
    const matrix = [
      { request: { action: "VALIDATE", authority_granted: true }, status: 400, code: "INVALID_REQUEST" },
      { request: { action: "VALIDATE", programSnapshot: null }, status: 409, code: "INVALID_EXPECTED_SNAPSHOT" },
      { request: { action: "VALIDATE", programSnapshot: { ...snapshot, portfolio: [] } }, status: 409, code: "INELIGIBLE" },
      { request: { action: "DELIBERATE", validationProof: "unissued" }, status: 409, code: "INVALID_PROOF" },
    ];
    for (const { request, status, code } of matrix) {
      const handler = await makeHandler();
      denied(await post(handler, request), status, code);
      const recovery = await decide(handler, "HOLD");
      assert.ok(recovery.body.ok && recovery.body.state === "HELD");
      assert.equal(recovery.body.workPacket, null);
    }
  });

  test("E-A / N3 / E8: the server blocks a non-adapted D9 result", () => {
    const child = spawnSync(process.execPath, [
      "--experimental-test-module-mocks", "--import", "tsx", fileURLToPath(import.meta.url), "--batch-e-n3",
    ], { encoding: "utf8", timeout: 60_000 });
    assert.ifError(child.error);
    assert.equal(child.status, 0, child.stderr + child.stdout);
    assert.match(child.stdout, /N3 real adapter mismatch -> handler 409 D9_ADAPTER_BLOCKED/);
  });

  test("E2: secret, authentication, role and actor checks precede body access", async () => {
    const cases: Array<[Partial<Dependencies>, number, string]> = [
      [{ readSecret: () => undefined }, 503, "SERVER_SECRET_UNAVAILABLE"],
      [{ authenticate: async () => ({ authenticated: false }) }, 401, "UNAUTHENTICATED"],
      [{ authenticate: async () => { throw new Error("invalid test session"); } }, 401, "UNAUTHENTICATED"],
      [{ authenticate: async () => ({ ...admin, role: "VIEWER" }) }, 403, "ADMIN_REQUIRED"],
      [{ authenticate: async () => ({ ...admin, email: "" }) }, 403, "ACTOR_EMAIL_REQUIRED"],
    ];
    for (const [overrides, status, code] of cases) {
      const handler = await makeHandler(overrides);
      const request = new Request("http://local.test/loop", { method: "POST", body: "invalid json" });
      const response = await handler(request);
      denied({ status: response.status, body: await response.json() }, status, code);
      assert.equal(request.bodyUsed, false);
    }
  });

  test("E3: canonical input is normalized and authority claims and duplicates are rejected", async () => {
    const handler = await makeHandler();
    const valid = await post(handler, { action: "VALIDATE", input: { ...input, title: "  " + input.title + "  " } });
    assert.ok(valid.body.ok && valid.body.state === "VALIDATED");
    assert.equal(valid.body.input.title, input.title);
    for (const extra of [
      { actor: admin.email }, { execution_authority_granted: true },
      { input: { ...input, evidencePointers: ["same", " same "] } },
      { input: { ...input, authority_granted: true } },
    ]) {
      denied(await post(handler, { action: "VALIDATE", ...extra }), 400, "INVALID_REQUEST");
    }
  });

  test("E4: direct decision, cross-stage use and repeated transitions are denied", async () => {
    const handler = await makeHandler();
    const decision = { action: "DECIDE", decision: "ACCEPT" };
    denied(await post(handler, decision), 400, "INVALID_REQUEST");
    const validationProof = await validate(handler);
    denied(await post(handler, { ...decision, deliberationProof: validationProof }), 409, "INVALID_PROOF");
    const request = { action: "DELIBERATE", validationProof };
    assert.equal((await post(handler, request)).status, 200);
    denied(await post(handler, request), 409, "INVALID_PROOF");
  });

  test("E-C / P2 / E5: rejection of an edited proof preserves one genuine redemption", async () => {
    let actor: string = admin.email;
    const handler = await makeHandler({ authenticate: async () => ({ ...admin, email: actor }) });
    const validationProof = await validate(handler);
    const next = { action: "DELIBERATE", validationProof };
    denied(await post(handler, { ...next, validationProof: editLastDigit(validationProof) }), 409, "INVALID_PROOF");
    const genuine = await post(handler, next);
    assert.equal(genuine.status, 200);
    assert.ok(genuine.body.ok && genuine.body.state === "AWAITING_DECISION");
    denied(await post(handler, next), 409, "INVALID_PROOF");

    const { deliberationProof } = genuine.body;
    const finish = { action: "DECIDE", decision: "ACCEPT", deliberationProof };
    actor = "second-admin@example.test";
    denied(await post(handler, finish), 409, "INVALID_PROOF");
    actor = admin.email;
    denied(await post(handler, { ...finish, input: { ...input, motionId: "different" } }), 409, "INVALID_PROOF");
    denied(await post(handler, { ...finish, deliberationProof: editLastDigit(deliberationProof) }), 409, "INVALID_PROOF");
    const accepted = await post(handler, finish);
    assert.equal(accepted.status, 200);
    assert.ok(accepted.body.ok && accepted.body.state === "ACCEPTED" && accepted.body.workPacket);
    denied(await post(handler, finish), 409, "INVALID_PROOF");
  });

  test("E6: only GO and explicit ACCEPT yield one proposed-only packet", async () => {
    const handler = await makeHandler();
    for (const motion of [input, { ...input, title: "Short" }, { ...input, targetRepo: "outside" }]) {
      for (const decision of ["ACCEPT", "HOLD", "REJECT"] as const) {
        const result = await decide(handler, decision, motion);
        if (decision === "ACCEPT" && motion !== input) {
          denied(result, 409, "ACCEPT_REQUIRES_GO");
          continue;
        }
        assert.ok(result.body.ok && "workPacket" in result.body);
        if (decision === "ACCEPT") {
          assert.equal(result.body.workPacket?.status, "PROPOSED_ONLY");
          assert.equal(result.body.workPacket.execution_authority_granted, false);
        } else {
          assert.equal(result.body.workPacket, null);
        }
      }
    }
  });

  test("E-E / P4 / E9: key-swapped, stale and missing snapshots fail closed", async () => {
    const handler = await makeHandler();
    const { base_sha: removed, ...remaining } = snapshot;
    const keySwapped = { ...remaining, unknown_base_sha: removed };
    assert.equal(Object.keys(keySwapped).length, Object.keys(snapshot).length);
    const validationProof = await validate(handler);
    for (const candidate of [keySwapped, undefined, { ...snapshot, base_sha: "f".repeat(40) },
      { ...snapshot, base_sha: snapshot.snapshot_hash, snapshot_hash: snapshot.base_sha },
      { ...snapshot, snapshot_version: snapshot.snapshot_version + 1 },
      { ...snapshot, authority_granted: true },
      { ...snapshot, binding_posture: "LIVE_AUTHORITATIVE" }]) {
      denied(await post(handler, { action: "DELIBERATE", programSnapshot: candidate, validationProof }),
        409, "INVALID_EXPECTED_SNAPSHOT");
    }
    assert.equal((await post(handler, { action: "DELIBERATE", validationProof })).status, 200);
  });

  test("E-F / P5 / E7: an unknown portfolio-entry key and active collisions are rejected", async () => {
    const handler = await makeHandler();
    const { deliberationProof } = await deliberate(handler);
    const finish = { action: "DECIDE", decision: "ACCEPT", deliberationProof };
    const active = snapshot.portfolio[0];
    const candidates = [
      [{ ...active, unknown_entry_property: true }],
      [active, { ...active, programId: "another-program" }], [],
    ];
    const results = await Promise.all(candidates.map(portfolio =>
      post(handler, { ...finish, programSnapshot: { ...snapshot, portfolio } })));
    for (const result of results) denied(result, 409, "INELIGIBLE");
    const restored = await post(handler, finish);
    assert.ok(restored.body.ok && restored.body.state === "ACCEPTED");
  });

  test("E8: forged receipt labels are ineligible for redacted export", async () => {
    const result = await decide(await makeHandler(), "ACCEPT");
    assert.ok(result.body.ok && "adaptedReceipt" in result.body);
    const presentation = createLocalOperatingLoopTerminalPresentation(result.body);
    const fields = result.body.adaptedReceipt;
    const genuine = createAdaptedBoundaryReceipt(presentation, fields);
    assert.ok(genuine);
    assert.equal(genuine.receipt.authority_granted, false);
    assert.equal(genuine.receipt.boundary_receipt_classification, "B9-CLASS-014 / DEMONSTRATION_RECEIPT");
    assert.ok(!genuine.text.includes(input.evidencePointers[0]));
    for (const alteration of [{ kind: "INVALID_INPUT" }, { authority_granted: true },
      { boundary_receipt_classification: "ACCEPTANCE_RECEIPT" }]) {
      assert.equal(createAdaptedBoundaryReceipt(presentation, { ...fields, ...alteration }), null);
    }
  });

  test("E10 / N2: one concurrent redemption succeeds and fresh runs reproduce the terminal output", async () => {
    const handler = await makeHandler();
    const { deliberationProof } = await deliberate(handler);
    const request = { action: "DECIDE", decision: "ACCEPT", deliberationProof };
    const results = await Promise.all([post(handler, request), post(handler, request)]);
    assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
    const rejected = results.find(r => r.status === 409);
    const accepted = results.find(r => r.status === 200);
    assert.ok(rejected && accepted);
    denied(rejected, 409, "INVALID_PROOF");
    assert.deepEqual(await decide(handler, "ACCEPT"), accepted);
    assert.equal(shouldApplyLocalOperatingLoopResponse({
      currentProjectionKey: "same", responseProjectionKey: "same", currentRequestId: 2, responseRequestId: 1,
    }), false);
  });

  test("E11: handler dependencies stay within the local graph and a complete run makes zero fetch calls", async () => {
    const external = new Set(["node:crypto", "node:util", "zod"]);
    const visited = new Set<string>();
    function visit(url: URL) {
      if (visited.has(url.href)) return;
      visited.add(url.href);
      const source = readFileSync(url, "utf8");
      for (const { fileName } of ts.preProcessFile(source, true, true).importedFiles) {
        if (fileName.startsWith(".")) visit(new URL(fileName + ".ts", url));
        else assert.ok(external.has(fileName), fileName);
      }
    }
    visit(new URL("./local-operating-loop-handler.ts", import.meta.url));
    assert.deepEqual([...visited].map(url => basename(fileURLToPath(url))).sort(), [
      "batch-b-lifecycle-contract-adapter.ts", "canonical-active-program-resolver.ts",
      "downstream-active-program-guard.ts", "local-operating-loop-handler.ts", "local-operating-loop.ts",
      "one-active-program-invariant.ts", "program-binding-propagation-boundary.ts",
      "program-lifecycle-persistence-boundary.ts",
    ]);
    const network = mock.method(globalThis, "fetch", () => { throw new Error("unexpected network call"); });
    try {
      assert.equal((await decide(await makeHandler(), "ACCEPT")).status, 200);
      assert.equal(network.mock.callCount(), 0);
    } finally {
      network.mock.restore();
    }
  });

  test("E14: reset the local shadow, invalidate worker proofs and recover from DRAFT", async () => {
    const before = await makeHandler();
    const validationProof = await validate(before);
    const result = await post(before, { action: "DELIBERATE", validationProof });
    assert.ok(result.body.ok && result.body.state === "AWAITING_DECISION");
    const deliberation = result.body;
    const terminal = await post(before, {
      action: "DECIDE", decision: "ACCEPT", deliberationProof: deliberation.deliberationProof,
    });
    assert.ok(terminal.body.ok && terminal.body.state === "ACCEPTED");
    const draft = createLocalOperatingLoopUiState("rehearsal");
    const populated = { ...draft, ...terminal.body, validationProof, deliberationProof: deliberation.deliberationProof };
    assert.deepEqual(applyLocalOperatingLoopBrowserLifecycle(populated, { type: "PAGEHIDE" }), draft);
    assert.deepEqual(applyLocalOperatingLoopBrowserLifecycle(populated, { type: "PAGESHOW", persisted: true }), draft);
    const outstanding = await validate(before);
    const fresh = await makeHandler();
    denied(await post(fresh, { action: "DELIBERATE", validationProof: outstanding }), 409, "INVALID_PROOF");
    assert.deepEqual(await decide(fresh, "ACCEPT"), terminal);
  });
}

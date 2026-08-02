import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import { buildFounderActiveProgramControlSurface } from "@/lib/controlPlane/programLifecycle/founder-active-program-control-surface";
import { createC5ClassificationTransport, createClassificationRequestBoundary, createClassificationReviewDetails, FounderActiveProgramControlSurface, isSafeC5ClassificationResponse, shouldRestoreReviewFocus, type C5TransportResult, type RequestState } from "./FounderActiveProgramControlSurface";

const eligible = { ok: true, kind: "AUTHORIZED_ADMIN_REQUEST", requestAuthorizationClassification: "SERVER_DERIVED_ADMIN", actor: "admin@example.com", role: "ADMIN", eligibility: { kind: "ELIGIBLE", eligible: true, classificationOnly: true, reasonCodes: ["ALL_PREREQUISITES_SATISFIED"], transitionId: "B1-TR-027", activationAuthorized: false, activationPerformed: false }, activationAuthorized: false, activationPerformed: false };
const ineligible = { ...eligible, eligibility: { kind: "INELIGIBLE", eligible: false, classificationOnly: true, reasonCodes: ["ACTIVE_PROGRAM_PRESENT", "RECEIPT_NOT_CURRENT"], transitionId: null, activationAuthorized: false, activationPerformed: false } };
const model = buildFounderActiveProgramControlSurface();
const html = renderToStaticMarkup(<FounderActiveProgramControlSurface model={model} />);
for (const text of ["Program lifecycle", "Supplied program portfolio", "Review eligibility classification", "C11 supplied-snapshot classifications", "LIFECYCLE_MUTATION", "DOWNSTREAM_MUTATION", "Classification only", "ACTIVE — PLANNING ONLY", "FROZEN — NOT OPEN"]) assert.ok(html.includes(text));
assert.ok(!html.includes("Activate"));
assert.ok(!html.includes("admin@example.com"));
for (const text of ["Five-Slot Compounded Reasoning Shadow Kernel v0", "jai-five-slot-compounded-reasoning-shadow-kernel-v0", "Supplied portfolio: 4", "Governing motions: 0", "Receipts: 0", "Binding evidence: unavailable", "cannot activate or mutate"]) assert.ok(createClassificationReviewDetails(model).includes(text));
assert.equal(shouldRestoreReviewFocus(true, { reviewing: true, pending: false, token: 1 }), false);
assert.equal(shouldRestoreReviewFocus(true, { reviewing: false, pending: true, token: 1 }), false);
assert.equal(shouldRestoreReviewFocus(true, { reviewing: false, pending: false, token: 1 }), true);

assert.equal(isSafeC5ClassificationResponse(eligible), true);
assert.equal(isSafeC5ClassificationResponse(ineligible), true);
assert.equal(isSafeC5ClassificationResponse({ ...ineligible, eligibility: { ...ineligible.eligibility, reasonCodes: ["ACTIVE_PROGRAM_PRESENT"] } }), true);
assert.equal(isSafeC5ClassificationResponse({ ...eligible, eligibility: { ...eligible.eligibility, kind: "INVALID_INPUT", eligible: false, transitionId: null } }), false);
for (const reasons of [[], ["ALL_PREREQUISITES_SATISFIED"], ["INVALID_INPUT"], ["UNKNOWN"], ["ACTIVE_PROGRAM_PRESENT", "ACTIVE_PROGRAM_PRESENT"], ["RECEIPT_NOT_CURRENT", "ACTIVE_PROGRAM_PRESENT"]]) assert.equal(isSafeC5ClassificationResponse({ ...ineligible, eligibility: { ...ineligible.eligibility, reasonCodes: reasons } }), false);
const sparse = ["ACTIVE_PROGRAM_PRESENT", "RECEIPT_NOT_CURRENT"]; delete sparse[1];
const extra = ["ACTIVE_PROGRAM_PRESENT"]; Object.assign(extra, { extra: true });
for (const response of [{ ...eligible, actor: " ADMIN@EXAMPLE.COM " }, { ...eligible, ok: false }, { ...eligible, kind: "OTHER" }, { ...eligible, requestAuthorizationClassification: "OTHER" }, { ...eligible, role: "OPERATOR" }, { ...eligible, activationAuthorized: true }, { ...eligible, eligibility: { ...eligible.eligibility, activationPerformed: true } }, { ...eligible, eligibility: { ...eligible.eligibility, extra: true } }, { ...ineligible, eligibility: { ...ineligible.eligibility, reasonCodes: sparse } }, { ...ineligible, eligibility: { ...ineligible.eligibility, reasonCodes: extra } }, null]) assert.equal(isSafeC5ClassificationResponse(response), false);
const revokedRoot = Proxy.revocable(eligible, {}); revokedRoot.revoke();
const hostileReasons = new Proxy(["ACTIVE_PROGRAM_PRESENT"], { getOwnPropertyDescriptor() { throw new Error("hostile"); } });
assert.doesNotThrow(() => isSafeC5ClassificationResponse(revokedRoot.proxy));
assert.equal(isSafeC5ClassificationResponse(revokedRoot.proxy), false);
assert.doesNotThrow(() => isSafeC5ClassificationResponse({ ...ineligible, eligibility: { ...ineligible.eligibility, reasonCodes: hostileReasons } }));
assert.equal(isSafeC5ClassificationResponse({ ...ineligible, eligibility: { ...ineligible.eligibility, reasonCodes: hostileReasons } }), false);

let fetchCalls = 0;
let captured: { input?: RequestInfo | URL; init?: RequestInit } = {};
const payload = { candidateProgramId: "candidate", portfolio: [{ programId: "candidate", lifecycleState: "NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN" }], governingMotions: [], receipts: [] };
const transport = createC5ClassificationTransport(async (input, init) => { fetchCalls += 1; captured = { input, init }; return { ok: true, status: 200, json: async () => ineligible }; }, payload);
assert.equal(fetchCalls, 0);
const signal = new AbortController().signal;
assert.deepEqual(await transport(signal), { ok: true, status: 200, body: ineligible });
assert.equal(fetchCalls, 1);
assert.equal(captured.input, "/api/operator/program-lifecycle/activation-authority");
assert.equal(captured.init?.method, "POST");
assert.equal((captured.init?.headers as Record<string, string>)["Content-Type"], "application/json");
assert.equal(captured.init?.signal, signal);
assert.deepEqual(JSON.parse(captured.init?.body as string), payload);
const invalidJsonTransport = createC5ClassificationTransport(async () => ({ ok: true, status: 200, json: async () => { throw new Error("json"); } }), payload);
assert.deepEqual(await invalidJsonTransport(signal), { ok: true, status: 200, body: null });

const strictStates: RequestState[] = [];
const strictBoundary = createClassificationRequestBoundary(async () => ({ ok: true, status: 200, body: eligible }), (state) => strictStates.push(state));
assert.equal(strictStates.length, 0);
strictBoundary.dispose();
assert.equal(strictStates.length, 0);
assert.equal(strictBoundary.review(), true);
assert.equal(await strictBoundary.confirm(), "SUCCEEDED");

let calls = 0;
let abortCount = 0;
const resolvers: Array<(value: C5TransportResult) => void> = [];
const states: RequestState[] = [];
const boundary = createClassificationRequestBoundary((currentSignal) => {
  calls += 1;
  currentSignal.addEventListener("abort", () => { abortCount += 1; }, { once: true });
  return new Promise((resolve) => { resolvers.push(resolve); });
}, (state) => states.push(state));
assert.equal(await boundary.confirm(), "NOT_STARTED");
assert.equal(boundary.review(), true);
const first = boundary.confirm();
assert.equal(calls, 1);
assert.equal(await boundary.confirm(), "NOT_STARTED");
boundary.cancel();
assert.equal(abortCount, 1);
assert.deepEqual(boundary.state(), { reviewing: false, pending: false, token: 2 });
assert.equal(boundary.review(), true);
const second = boundary.confirm();
resolvers[0]?.({ ok: true, status: 200, body: eligible });
assert.equal(await first, "STALE");
assert.equal(boundary.state().pending, true);
resolvers[1]?.({ ok: true, status: 200, body: eligible });
assert.equal(await second, "SUCCEEDED");
assert.deepEqual(boundary.state(), { reviewing: false, pending: false, token: 3 });
const beforeDisposePublications = states.length;
assert.equal(boundary.review(), true);
const pending = boundary.confirm();
boundary.dispose();
assert.equal(abortCount, 2);
assert.equal(states.length, beforeDisposePublications + 2);
resolvers[2]?.({ ok: true, status: 200, body: eligible });
assert.equal(await pending, "STALE");
assert.equal(states.length, beforeDisposePublications + 2);
assert.equal(boundary.review(), true);
const renewed = boundary.confirm();
resolvers[3]?.({ ok: true, status: 200, body: eligible });
assert.equal(await renewed, "SUCCEEDED");
for (const result of [
  createClassificationRequestBoundary(async () => ({ ok: false, status: 401, body: eligible })),
  createClassificationRequestBoundary(async () => ({ ok: true, status: 200, body: null })),
  createClassificationRequestBoundary(async () => { throw new Error("network"); }),
]) {
  assert.equal(result.review(), true);
  assert.equal(await result.confirm(), "REJECTED");
  assert.deepEqual(result.state(), { reviewing: false, pending: false, token: 1 });
}

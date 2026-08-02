"use client";

import { useEffect, useRef, useState } from "react";

import type { FounderActiveProgramControlSurfaceModel } from "@/lib/controlPlane/programLifecycle/founder-active-program-control-surface";

const ACTION_CLASSES = ["LIFECYCLE_MUTATION", "DOWNSTREAM_MUTATION"] as const;
const C5_ENDPOINT = "/api/operator/program-lifecycle/activation-authority";
const C5_RESPONSE_KEYS = ["ok", "kind", "requestAuthorizationClassification", "actor", "role", "eligibility", "activationAuthorized", "activationPerformed"] as const;
const C5_ELIGIBILITY_KEYS = ["kind", "eligible", "classificationOnly", "reasonCodes", "transitionId", "activationAuthorized", "activationPerformed"] as const;
const INELIGIBLE_REASON_CODES = ["ACTIVE_PROGRAM_PRESENT", "MULTIPLE_ACTIVE_PROGRAMS", "CANDIDATE_NOT_FOUND", "CANDIDATE_TRANSITION_NOT_LISTED", "GOVERNING_MOTION_MISSING", "GOVERNING_MOTION_CONFLICT", "GOVERNING_MOTION_SUBJECT_MISMATCH", "GOVERNING_MOTION_NOT_RATIFIED", "GOVERNING_MOTION_NON_PASS", "GOVERNING_MOTION_NOT_ACCEPTED_ON_MAIN", "GOVERNING_MOTION_NOT_CURRENT", "MAIN_STATE_RECEIPT_MISSING", "MAIN_STATE_RECEIPT_DUPLICATE", "PROGRAM_OPENING_RECEIPT_MISSING", "PROGRAM_OPENING_RECEIPT_DUPLICATE", "RECEIPT_SUBJECT_MISMATCH", "RECEIPT_INSTANCE_ID_MISSING", "RECEIPT_NOT_ISSUED", "RECEIPT_INTEGRITY_NOT_VERIFIED", "RECEIPT_AUTHENTICITY_NOT_VERIFIED", "RECEIPT_ISSUER_AUTHORITY_NOT_ESTABLISHED", "RECEIPT_NOT_CURRENT"] as const;

export type RequestState = Readonly<{ reviewing: boolean; pending: boolean; token: number }>;
type RequestOutcome = "SUCCEEDED" | "REJECTED" | "STALE" | "NOT_STARTED";
export type C5TransportResult = Readonly<{ ok: boolean; status: number; body: unknown }>;
type ClassificationTransport = (signal: AbortSignal) => Promise<C5TransportResult>;
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Pick<Response, "ok" | "status" | "json">>;

function isExactObject(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  try {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) return false;
    const own = Reflect.ownKeys(value);
    return own.length === keys.length && own.every((key) => typeof key === "string") && keys.every((key) => own.includes(key)) && keys.every((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      return !!descriptor && Object.hasOwn(descriptor, "value") && descriptor.enumerable;
    });
  } catch { return false; }
}

function isCanonicalActor(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  const at = normalized.indexOf("@");
  return value === normalized && normalized.length > 0 && normalized.length <= 320 && !/[\s\p{Cc}]/u.test(normalized) && at > 0 && at === normalized.lastIndexOf("@") && at < normalized.length - 1;
}

function isCanonicalIneligibleReasonCodes(value: unknown): boolean {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Reflect.ownKeys(value).length !== value.length + 1) return false;
  let prior = -1;
  for (let index = 0; index < value.length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !Object.hasOwn(descriptor, "value") || !descriptor.enumerable || typeof descriptor.value !== "string") return false;
    const next = INELIGIBLE_REASON_CODES.indexOf(descriptor.value as (typeof INELIGIBLE_REASON_CODES)[number]);
    if (next < 0 || next <= prior) return false;
    prior = next;
  }
  return value.length > 0;
}

function isExactEligibleReasonCodes(value: unknown): boolean {
  if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || value.length !== 1 || Reflect.ownKeys(value).length !== 2) return false;
  const descriptor = Object.getOwnPropertyDescriptor(value, "0");
  return !!descriptor && Object.hasOwn(descriptor, "value") && descriptor.enumerable === true && descriptor.value === "ALL_PREREQUISITES_SATISFIED";
}

export function isSafeC5ClassificationResponse(value: unknown): boolean {
  try {
    if (!isExactObject(value, C5_RESPONSE_KEYS)) return false;
    if (value.ok !== true || value.kind !== "AUTHORIZED_ADMIN_REQUEST" || value.requestAuthorizationClassification !== "SERVER_DERIVED_ADMIN" || value.role !== "ADMIN" || !isCanonicalActor(value.actor) || value.activationAuthorized !== false || value.activationPerformed !== false || !isExactObject(value.eligibility, C5_ELIGIBILITY_KEYS)) return false;
    const eligibility = value.eligibility;
    if (eligibility.classificationOnly !== true || eligibility.activationAuthorized !== false || eligibility.activationPerformed !== false) return false;
    if (eligibility.kind === "ELIGIBLE") return eligibility.eligible === true && eligibility.transitionId === "B1-TR-027" && isExactEligibleReasonCodes(eligibility.reasonCodes);
    return eligibility.kind === "INELIGIBLE" && eligibility.eligible === false && eligibility.transitionId === null && isCanonicalIneligibleReasonCodes(eligibility.reasonCodes);
  } catch { return false; }
}

export function shouldRestoreReviewFocus(intent: boolean, state: RequestState): boolean {
  return intent && !state.reviewing && !state.pending;
}

export function createClassificationReviewDetails(model: FounderActiveProgramControlSurfaceModel): string {
  const candidate = model.portfolio[1];
  return `Candidate: ${candidate.title} (${candidate.id}). Supplied portfolio: ${model.portfolio.length}. Governing motions: 0. Receipts: 0. Binding evidence: unavailable. Classification only; it cannot activate or mutate a Program.`;
}

export function createC5ClassificationTransport(fetchLike: FetchLike, payload: unknown): ClassificationTransport {
  return async (signal) => {
    const response = await fetchLike(C5_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal });
    let body: unknown = null;
    try { body = await response.json(); } catch { body = null; }
    return { ok: response.ok, status: response.status, body };
  };
}

/** Pure request ownership boundary; it only classifies a supplied C5 response. */
export function createClassificationRequestBoundary(transport: ClassificationTransport, onState: (state: RequestState) => void = () => {}) {
  let token = 0;
  let reviewing = false;
  let pending = false;
  let active: Readonly<{ token: number; controller: AbortController }> | null = null;
  const publish = () => onState({ reviewing, pending, token });
  return {
    review() { if (pending) return false; reviewing = true; publish(); return true; },
    cancel() { active?.controller.abort(); active = null; token += 1; pending = false; reviewing = false; publish(); },
    dispose() { active?.controller.abort(); active = null; token += 1; pending = false; reviewing = false; },
    state(): RequestState { return { reviewing, pending, token }; },
    async confirm(): Promise<RequestOutcome> {
      if (!reviewing || pending) return "NOT_STARTED";
      const currentToken = ++token;
      const controller = new AbortController();
      active = Object.freeze({ token: currentToken, controller });
      pending = true;
      publish();
      try {
        const response = await transport(controller.signal);
        const outcome: RequestOutcome = response.ok && response.status === 200 && isSafeC5ClassificationResponse(response.body) ? "SUCCEEDED" : "REJECTED";
        if (currentToken !== token) return "STALE";
        pending = false;
        reviewing = false;
        publish();
        return outcome;
      } catch {
        if (currentToken !== token) return "STALE";
        pending = false;
        reviewing = false;
        publish();
        return "REJECTED";
      } finally {
        if (active?.token === currentToken) active = null;
      }
    },
  };
}

export function FounderActiveProgramControlSurface({ model }: { readonly model: FounderActiveProgramControlSurfaceModel }) {
  const [requestState, setRequestState] = useState<RequestState>({ reviewing: false, pending: false, token: 0 });
  const [status, setStatus] = useState("Classification only - no activation authority.");
  const reviewButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const payload = { candidateProgramId: model.portfolio[1].id, portfolio: model.portfolio.map((row) => ({ programId: row.id, lifecycleState: row.lifecycleState })), governingMotions: [], receipts: [] };
  const [boundary] = useState(() => createClassificationRequestBoundary(createC5ClassificationTransport(fetch, payload), setRequestState));
  useEffect(() => () => boundary.dispose(), [boundary]);
  useEffect(() => {
    if (shouldRestoreReviewFocus(restoreFocus.current, requestState)) {
      reviewButton.current?.focus();
      restoreFocus.current = false;
    }
  }, [requestState]);
  const cancel = () => { restoreFocus.current = true; boundary.cancel(); setStatus("Classification review cancelled."); };
  const review = () => { if (boundary.review()) setStatus("Review the classification request before confirmation."); };
  const confirm = () => { restoreFocus.current = true; void boundary.confirm().then((outcome) => { if (outcome === "SUCCEEDED") setStatus("Classification request authenticated. Classification only - no activation authority."); else if (outcome === "REJECTED") setStatus("Classification request failed closed. No activation authority."); }); };
  return <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-200"><div className="mx-auto max-w-6xl space-y-6"><header><p className="font-mono text-xs text-slate-400">OPERATOR / PROGRAMS / SUPPLIED DOCUMENTARY SNAPSHOT</p><h1 className="mt-2 text-3xl font-semibold">Program lifecycle</h1><p className="mt-2 text-sm text-slate-400">Source: {model.sourceArtifact} at {model.sourceRef}. This is supplied documentary evidence, not live or current observation, durable binding evidence, or standing execution authority.</p></header><dl className="grid gap-3 sm:grid-cols-3"><div><dt>Binding evidence</dt><dd>{model.bindingAvailability}</dd></div><div><dt>Binding classification</dt><dd>{model.bindingClassification.kind}</dd></div><div><dt>Eligibility</dt><dd>{model.eligibilityClassification} - classification only</dd></div></dl><section><h2>Supplied program portfolio</h2><table><caption>A5 documentary Program sequence and lifecycle posture.</caption><thead><tr><th>Program</th><th>Lifecycle</th><th>Posture</th><th>Authority</th></tr></thead><tbody>{model.portfolio.map((row) => <tr key={row.id}><th>{row.title}<span>{row.id}</span></th><td>{row.lifecycleState}</td><td>{row.displayPosture}</td><td>{row.authority}</td></tr>)}</tbody></table></section><section><h2>C11 supplied-snapshot classifications</h2>{model.actionClassifications.map((row, index) => <p key={ACTION_CLASSES[index]}>{ACTION_CLASSES[index]}: {row.kind}. This does not prove a runtime mutation was intercepted.</p>)}</section><section aria-live="polite" aria-busy={requestState.pending} onKeyDown={(event) => { if (event.key === "Escape") cancel(); }}><h2>Review eligibility classification</h2>{requestState.reviewing && <p>{createClassificationReviewDetails(model)}</p>}{requestState.reviewing ? <div><button type="button" onClick={confirm} disabled={requestState.pending}>{requestState.pending ? "Classifying..." : "Run eligibility classification"}</button><button type="button" onClick={cancel}>Cancel</button></div> : <button ref={reviewButton} type="button" onClick={review}>Review eligibility classification</button>}<p role="status">{status}</p></section><p role="alert">Classification only. No activation authority, lifecycle mutation, or durable state change is performed by this surface.</p></div></main>;
}

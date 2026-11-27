export const slotLabel = "Convention-Proposed Functional Slots";
export const slots = ["Proposal", "Evidence", "Challenge", "Risk-Economics", "Synthesis"] as const;
export type CanonicalFunctionalSlot = (typeof slots)[number];
export const slotResponsibilities: Record<CanonicalFunctionalSlot, string> = {
  Proposal: "Candidate framing, scope boundary, and explicit assumptions",
  Evidence: "Committed source provenance refs and evidence sufficiency",
  Challenge: "Contradiction check, dissent surfacing, and missing-evidence challenge",
  "Risk-Economics": "Failure/timeout exposure, authority boundary risk, and L1-L4 cost/effort posture",
  Synthesis: "Confidence-qualified summary preserving unresolved disagreement without inventing consensus or authority",
};
export const citations = {
  decision:
    "This decision does not implement the five-slot shadow kernel, founder workflow pilot, or bounded Agent/Council pilot.",
  objective:
    "Evaluate the Five-Slot Shadow Kernel against pre-registered alternatives using independently verifiable decision evidence and measured founder time.",
  planning: "Each JAI Thread or JAI Agent should use at least five model slots.",
} as const;

type Model = {
  slot: string;
  provider_family: string | null;
  model_id: string | null;
  effort: string | null;
  lineage_ref: string | null;
};
type Source = { path: string; source_commit: string; source_blob: string };
type Provenance = {
  provenance_kind: "COMMITTED_EVIDENCE" | "SYNTHETIC_FIXTURE";
  repository: string;
  source: Source;
  receipt_event_id?: string;
  receipt_ledger_path?: string;
  receipt_hash?: string;
};
const modes = ["one-model", "two-seat", "three-seat", "five-slot", "deterministic"] as const;
export interface IntelligenceConfiguration {
  CONSTRUCTION: {
    models: Model[];
    tools: string[];
    prompt_versions: string[];
    validators: string[];
    provenance: Provenance[];
    correlation_disclosure: {
      shared_model_or_lineage: boolean;
      correlation_groups: string[][];
      independent_consensus_claim: boolean;
      functional_slots_are_not_model_slots: true;
      five_independent_models_claimed: false;
    };
  };
  COORDINATION: { mode: (typeof modes)[number]; adds_c3_benchmark_arms: false };
  GOVERNANCE: {
    authority_granted: false;
    decision_boundary: "HUMAN_OPERATOR_ONLY";
    execution_implied: false;
    live_inference_authorized: false;
    layer_2_spend_usd: 0;
  };
}
/** F1 is a CONTROL_THREAD-approved downstream addition to the frozen C1 scope. */
export type OperatorClock =
  | {
      status: "MEASURED";
      started_at_iso: string;
      completed_at_iso: string;
      active_founder_minutes: number;
      retries: number;
      capture_method: string;
    }
  | {
      status: "UNMEASURED";
      started_at_iso: null;
      completed_at_iso: null;
      active_founder_minutes: null;
      retries: number | null;
      capture_method: null;
    };
export interface Envelope {
  intelligence_configuration: IntelligenceConfiguration;
  operator_clock_telemetry: OperatorClock;
  slot_outputs: {
    slot: string;
    text: string;
    state: "RECORDED" | "TIMEOUT" | "FAILED";
    evidence_indices: number[];
    competing_positions: string[];
  }[];
}
export type Diagnostic =
  | "C1_UNRESOLVED_DISAGREEMENT"
  | "C1_MISSING_EVIDENCE"
  | "C1_MALFORMED_OUTPUT"
  | "C1_FALSE_CONSENSUS"
  | "C1_ROLE_COLLAPSE"
  | "C1_TIMEOUT_OR_FAILURE"
  | "C1_AUTHORITY_ESCALATION"
  | "C1_UNMEASURED_FOUNDER_CLOCK"
  | "C1_VERIFIER_SELF_GRADING_CONFLICT";

export function evaluateC3BenchmarkClockEligibility(clock: unknown) {
  try {
    return validateClock(clock) === "MEASURED" ? null : "C1_UNMEASURED_FOUNDER_CLOCK";
  } catch {
    return "C1_MALFORMED_OUTPUT";
  }
}
/** F2 is a CONTROL_THREAD-approved addition. Only declared models are visible.
 * Omitted upstream lineage and undeclared external tools require independent C4 audit. */
export function evaluateCrossFamilyVerifierSeparation(
  config: unknown,
  verifierProviderFamily: unknown,
): { separated: true; code: null } | { separated: false; code: "C1_VERIFIER_SELF_GRADING_CONFLICT" } {
  try {
    const family = string(verifierProviderFamily).trim().toLowerCase();
    const { models } = inspectConfiguration(config);
    if (models.length && models.every((m) => m.family !== null && m.family !== family))
      return { separated: true, code: null };
  } catch {
    // Separation requires a valid declaration and a named verifier.
  }
  return { separated: false, code: "C1_VERIFIER_SELF_GRADING_CONFLICT" };
}

class Invalid extends Error {
  constructor(readonly code: Diagnostic) {
    super(code);
  }
}
function requireValue(condition: unknown, code: Diagnostic = "C1_MALFORMED_OUTPUT"): asserts condition {
  if (!condition) throw new Invalid(code);
}
function object(value: unknown, fields: string, optional = ""): Record<string, unknown> {
  requireValue(
    value !== null &&
      typeof value === "object" &&
      [Object.prototype, null].includes(Object.getPrototypeOf(value)),
  );
  const required = fields.split(" "),
    allowed = new Set([...required, ...optional.split(" ").filter(Boolean)]);
  for (const k of Reflect.ownKeys(value)) {
    requireValue(
      typeof k === "string" && allowed.has(k),
      typeof k === "string" && /authority|authoriz|spend|council_vote/i.test(k)
        ? "C1_AUTHORITY_ESCALATION"
        : "C1_MALFORMED_OUTPUT",
    );
    requireValue(Object.hasOwn(Object.getOwnPropertyDescriptor(value, k)!, "value"));
  }
  requireValue(required.every((k) => Object.hasOwn(value, k)));
  return value as Record<string, unknown>;
}
function array(v: unknown): unknown[] {
  requireValue(Array.isArray(v) && Reflect.ownKeys(v).length === v.length + 1);
  for (let i = 0; i < v.length; i++)
    requireValue(Object.hasOwn(Object.getOwnPropertyDescriptor(v, i) ?? {}, "value"));
  return v;
}
function string(v: unknown): string {
  requireValue(typeof v === "string" && v.trim());
  return v;
}
function strings(v: unknown) {
  return array(v).map(string);
}
function natural(v: unknown) {
  return typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
}
function iso(v: unknown) {
  const s = string(v);
  requireValue(
    /^\d{4}-\d\d-\d\dT(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(
      s,
    ),
  );
  const date = new Date(s.slice(0, 10) + "T00:00:00Z");
  requireValue(Number.isFinite(date.getTime()) && date.toISOString().startsWith(s.slice(0, 10)));
  return Date.parse(s);
}
function validateClock(v: unknown) {
  const c = object(v, "status started_at_iso completed_at_iso active_founder_minutes retries capture_method");
  if (c.status === "UNMEASURED") {
    requireValue(
      c.started_at_iso === null &&
        c.completed_at_iso === null &&
        c.active_founder_minutes === null &&
        c.capture_method === null &&
        (c.retries === null || natural(c.retries)),
    );
  } else {
    requireValue(c.status === "MEASURED" && natural(c.retries));
    const elapsedMinutes = (iso(c.completed_at_iso) - iso(c.started_at_iso)) / 60_000;
    requireValue(
      typeof c.active_founder_minutes === "number" &&
        Number.isFinite(c.active_founder_minutes) &&
        c.active_founder_minutes >= 0 &&
        elapsedMinutes >= 0 &&
        c.active_founder_minutes <= elapsedMinutes + 1e-6,
    );
    string(c.capture_method);
  }
  return c.status;
}
function path(v: unknown) {
  const s = string(v);
  requireValue(!/[\\:\x00-\x1f]/.test(s) && s.split("/").every((p) => p && p !== "." && p !== ".."));
  return s;
}
function provenance(v: unknown) {
  const p = object(
    v,
    "provenance_kind repository source",
    "receipt_event_id receipt_ledger_path receipt_hash",
  );
  requireValue(p.provenance_kind === "COMMITTED_EVIDENCE" || p.provenance_kind === "SYNTHETIC_FIXTURE");
  string(p.repository);
  const s = object(p.source, "path source_commit source_blob");
  path(s.path);
  requireValue(
    [s.source_commit, s.source_blob].every((x) => typeof x === "string" && /^[0-9a-f]{40}$/.test(x)),
  );
  if (Object.hasOwn(p, "receipt_hash")) requireValue(/^[0-9a-f]{64}$/.test(string(p.receipt_hash)));
  if (Object.hasOwn(p, "receipt_event_id"))
    requireValue(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(string(p.receipt_event_id)));
  if (Object.hasOwn(p, "receipt_ledger_path"))
    requireValue(path(p.receipt_ledger_path).startsWith(".nexus/ledger/"));
}
function uniqueSlots(names: string[], five: boolean) {
  requireValue(
    new Set(names).size === names.length &&
      (!five || (names.length === slots.length && slots.every((s) => names.includes(s)))),
    "C1_ROLE_COLLAPSE",
  );
}
function inspectConfiguration(raw: unknown) {
  requireValue(raw && typeof raw === "object" && Object.hasOwn(raw, "GOVERNANCE"), "C1_AUTHORITY_ESCALATION");
  const config = object(raw, "CONSTRUCTION COORDINATION GOVERNANCE");
  const gov = config.GOVERNANCE;
  requireValue(
    gov && typeof gov === "object" && Object.hasOwn(gov, "authority_granted"),
    "C1_AUTHORITY_ESCALATION",
  );
  const g = object(
    gov,
    "authority_granted decision_boundary execution_implied live_inference_authorized layer_2_spend_usd",
  );
  requireValue(
    g.authority_granted === false &&
      g.decision_boundary === "HUMAN_OPERATOR_ONLY" &&
      g.execution_implied === false &&
      g.live_inference_authorized === false &&
      g.layer_2_spend_usd === 0,
    "C1_AUTHORITY_ESCALATION",
  );
  const coord = object(config.COORDINATION, "mode adds_c3_benchmark_arms");
  requireValue(modes.some((m) => m === coord.mode) && coord.adds_c3_benchmark_arms === false);
  const five = coord.mode === "five-slot";
  const c = object(
    config.CONSTRUCTION,
    "models tools prompt_versions validators provenance correlation_disclosure",
  );
  [c.tools, c.prompt_versions, c.validators].forEach(strings);
  const refs = array(c.provenance);
  refs.forEach(provenance);
  const models = array(c.models).map((v) => {
    const m = object(v, "slot provider_family model_id effort lineage_ref");
    for (const key of ["model_id", "effort", "lineage_ref"])
      if (m[key] !== null) string(m[key]);
    const family = m.provider_family === null ? null : string(m.provider_family).trim().toLowerCase();
    return { slot: string(m.slot), model: m.model_id, lineage: m.lineage_ref, family };
  });
  const names = models.map((m) => m.slot);
  uniqueSlots(names, five);
  const d = object(
    c.correlation_disclosure,
    "shared_model_or_lineage correlation_groups independent_consensus_claim functional_slots_are_not_model_slots five_independent_models_claimed",
  );
  requireValue(d.five_independent_models_claimed === false, "C1_AUTHORITY_ESCALATION");
  requireValue(
    d.functional_slots_are_not_model_slots === true &&
      typeof d.shared_model_or_lineage === "boolean" &&
      typeof d.independent_consensus_claim === "boolean",
  );
  requireValue(!d.independent_consensus_claim, "C1_FALSE_CONSENSUS");
  const groups = array(d.correlation_groups).map(strings);
  requireValue(
    groups.every(
      (group) =>
        group.length >= 2 && new Set(group).size === group.length && group.every((n) => names.includes(n)),
    ),
  );
  requireValue(d.shared_model_or_lineage === groups.length > 0, "C1_FALSE_CONSENSUS");
  for (const [i, m] of models.entries())
    for (const other of models.slice(i + 1)) {
      const same = (a: unknown, b: unknown) =>
        typeof a === "string" && typeof b === "string" && a.trim().toLowerCase() === b.trim().toLowerCase();
      if (same(m.lineage, other.lineage) || same(m.model, other.model))
        requireValue(
          groups.some((group) => group.includes(m.slot) && group.includes(other.slot)),
          "C1_FALSE_CONSENSUS",
        );
    }
  return { five, refs, models };
}
const punctuation = new RegExp("[\\p{P}\\x21-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\x7e]", "gu");
function canonicalText(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(punctuation, "").replace(/\s+/gu, " ").trim();
}
function inspect(input: unknown) {
  const envelope = object(input, "intelligence_configuration operator_clock_telemetry slot_outputs");
  validateClock(envelope.operator_clock_telemetry);
  const { five, refs } = inspectConfiguration(envelope.intelligence_configuration);
  const claims = new Set<string>();
  const outputs = array(envelope.slot_outputs).map((v) => {
    const o = object(v, "slot text state evidence_indices competing_positions");
    const state = o.state;
    requireValue(state === "RECORDED" || state === "TIMEOUT" || state === "FAILED");
    const indices = array(o.evidence_indices);
    requireValue(
      indices.every((i) => natural(i) && Number(i) < refs.length) &&
        (state !== "RECORDED" || indices.length > 0),
      "C1_MISSING_EVIDENCE",
    );
    if (five && state === "RECORDED") {
      requireValue(typeof o.text === "string");
      const claim = canonicalText(o.text);
      requireValue(claim.length > 0 && !claims.has(claim), "C1_ROLE_COLLAPSE");
      claims.add(claim);
    } else {
      string(o.text);
    }
    return { slot: string(o.slot), state, positions: strings(o.competing_positions) };
  });
  uniqueSlots(
    outputs.map((o) => o.slot),
    five,
  );
  requireValue(outputs.length > 0);
  if (outputs.some((o) => o.state !== "RECORDED")) throw new Invalid("C1_TIMEOUT_OR_FAILURE");
  if (outputs.some((o) => o.positions.length > 0)) throw new Invalid("C1_UNRESOLVED_DISAGREEMENT");
}
/** Validation reports readiness only and never rewrites input or confers authority. */
export function validateC1Envelope(input: unknown): Diagnostic | null {
  try {
    inspect(input);
    return null;
  } catch (error) {
    return error instanceof Invalid ? error.code : "C1_MALFORMED_OUTPUT";
  }
}

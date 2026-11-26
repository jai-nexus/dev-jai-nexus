import { slots, type Diagnostic, type Envelope } from "./c1-five-slot-decision-contract";

export const VALID_BASELINE_FIVE_SLOT_ENVELOPE: Envelope = {
  operator_clock_telemetry: {
    status: "MEASURED",
    started_at_iso: "2026-11-22T00:00:00Z",
    completed_at_iso: "2026-11-22T00:05:00Z",
    active_founder_minutes: 5,
    retries: 0,
    capture_method: "synthetic fixture",
  },
  intelligence_configuration: {
    CONSTRUCTION: {
      models: slots.map((slot) => ({
        slot,
        provider_family: "fixture-provider",
        model_id: "fixture-model",
        effort: null,
        lineage_ref: "fixture-lineage",
      })),
      tools: ["fixture reader"],
      prompt_versions: ["fixture-v0"],
      validators: ["validateC1Envelope"],
      correlation_disclosure: {
        shared_model_or_lineage: true,
        correlation_groups: [[...slots]],
        independent_consensus_claim: false,
        functional_slots_are_not_model_slots: true,
        five_independent_models_claimed: false,
      },
      provenance: [
        {
          provenance_kind: "SYNTHETIC_FIXTURE",
          repository: "jai-nexus/dev-jai-nexus",
          source: {
            path: ".nexus/motions/motion-0248/decision.yaml",
            source_commit: "e088cd730a95cd142507ccc0bb651cd2d57c39b9",
            source_blob: "6ecc6e1ad3ef299ca4e0be8e720f5c9676f6acc0",
          },
        },
      ],
    },
    COORDINATION: { mode: "five-slot", adds_c3_benchmark_arms: false },
    GOVERNANCE: {
      authority_granted: false,
      decision_boundary: "HUMAN_OPERATOR_ONLY",
      execution_implied: false,
      live_inference_authorized: false,
      layer_2_spend_usd: 0,
    },
  },
  slot_outputs: slots.map((slot, i) => ({
    slot,
    text: [
      "Evaluate the recorded candidate within the reserved program scope.",
      "The decision records the program boundary.",
      "The record provides no evidence of a live independent session.",
      "Live dispatch would exceed the zero-dollar cap.",
      "The recorded proposal is suitable for shadow review only.",
    ][i],
    state: "RECORDED",
    evidence_indices: [0],
    competing_positions: [],
  })),
};
export const UNMEASURED_BASELINE: Envelope = {
  ...structuredClone(VALID_BASELINE_FIVE_SLOT_ENVELOPE),
  operator_clock_telemetry: {
    status: "UNMEASURED",
    started_at_iso: null,
    completed_at_iso: null,
    active_founder_minutes: null,
    retries: null,
    capture_method: null,
  },
};

function fixture(name: string, diagnostic: Diagnostic, change: (e: Envelope) => void) {
  const envelope = structuredClone(VALID_BASELINE_FIVE_SLOT_ENVELOPE);
  change(envelope);
  return { name, diagnostic, envelope };
}
export const failureFixtures = [
  fixture("disagreement", "C1_UNRESOLVED_DISAGREEMENT", (e) => {
    e.slot_outputs[2].competing_positions = [
      "Proceed with the provisional evidence.",
      "Hold until the missing record arrives.",
    ];
  }),
  fixture("missing_evidence", "C1_MISSING_EVIDENCE", (e) => {
    e.slot_outputs[1].evidence_indices = [42];
  }),
  fixture("malformed_output", "C1_MALFORMED_OUTPUT", (e) => {
    Object.assign(e.slot_outputs[0], { typo: true });
  }),
  fixture("false_consensus", "C1_FALSE_CONSENSUS", (e) => {
    e.intelligence_configuration.CONSTRUCTION.correlation_disclosure.independent_consensus_claim = true;
  }),
  fixture("role_collapse", "C1_ROLE_COLLAPSE", (e) => {
    e.slot_outputs[2].text = e.slot_outputs[0].text;
  }),
  fixture("timeout_or_failure", "C1_TIMEOUT_OR_FAILURE", (e) => {
    e.slot_outputs[1].state = "TIMEOUT";
    e.slot_outputs[1].text = "Evidence slot timed out.";
  }),
  fixture("authority_escalation", "C1_AUTHORITY_ESCALATION", (e) => {
    Object.assign(e.intelligence_configuration.GOVERNANCE, { authority_granted: true });
  }),
];

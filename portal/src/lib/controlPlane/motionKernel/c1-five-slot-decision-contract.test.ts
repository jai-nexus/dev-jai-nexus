import test from "node:test";
import assert from "node:assert/strict";
import {
  validateC1Envelope,
  evaluateC3BenchmarkClockEligibility,
  evaluateCrossFamilyVerifierSeparation,
  citations,
  slots,
  slotLabel,
} from "./c1-five-slot-decision-contract";
import {
  failureFixtures,
  VALID_BASELINE_FIVE_SLOT_ENVELOPE as measured,
  UNMEASURED_BASELINE as unmeasured,
} from "./c1-seven-failure-fixtures";

test("G2 convention and exact source text", () => {
  assert.equal(slotLabel, "Convention-Proposed Functional Slots");
  assert.deepEqual(slots, ["Proposal", "Evidence", "Challenge", "Risk-Economics", "Synthesis"]);
  assert.equal(
    citations.decision,
    "This decision does not implement the five-slot shadow kernel, founder workflow pilot, or bounded Agent/Council pilot.",
  );
  assert.equal(
    citations.objective,
    "Evaluate the Five-Slot Shadow Kernel against pre-registered alternatives using independently verifiable decision evidence and measured founder time.",
  );
  assert.equal(citations.planning, "Each JAI Thread or JAI Agent should use at least five model slots.");
  assert.equal(
    measured.intelligence_configuration.CONSTRUCTION.correlation_disclosure
      .functional_slots_are_not_model_slots,
    true,
  );
  assert.equal(measured.intelligence_configuration.COORDINATION.adds_c3_benchmark_arms, false);
});
test("measured and unmeasured are valid, only measured qualifies for scoring", () => {
  assert.equal(validateC1Envelope(measured), null);
  assert.equal(validateC1Envelope(unmeasured), null);
  assert.equal(unmeasured.operator_clock_telemetry.active_founder_minutes, null);
  assert.equal(
    evaluateC3BenchmarkClockEligibility(unmeasured.operator_clock_telemetry),
    "C1_UNMEASURED_FOUNDER_CLOCK",
  );
  assert.equal(evaluateC3BenchmarkClockEligibility(measured.operator_clock_telemetry), null);
});
test("F2 checks declared model families", () => {
  const config = structuredClone(measured.intelligence_configuration);
  assert.equal(evaluateCrossFamilyVerifierSeparation(config, "other"), null);
  for (const family of ["Anthropic", null, ""]) {
    config.CONSTRUCTION.models[0].provider_family = family;
    assert.equal(
      evaluateCrossFamilyVerifierSeparation(config, "anthropic"),
      "C1_VERIFIER_SELF_GRADING_CONFLICT",
    );
  }
});
for (const { name, diagnostic, envelope } of failureFixtures)
  test(name, () => {
    const original = structuredClone(envelope);
    assert.equal(validateC1Envelope(envelope), diagnostic);
    assert.deepEqual(envelope, original);
    if (name === "disagreement")
      assert.deepEqual(envelope.slot_outputs[2].competing_positions, [
        "Proceed with the provisional evidence.",
        "Hold until the missing record arrives.",
      ]);
  });
test("slot bijections on both sides; free labels in other modes", () => {
  for (const side of ["outputs", "models"])
    for (const fault of ["duplicate", "missing", "spelling"]) {
      const e = structuredClone(measured);
      const rows = side === "outputs" ? e.slot_outputs : e.intelligence_configuration.CONSTRUCTION.models;
      if (fault === "missing") rows.pop();
      else rows[1].slot = fault === "duplicate" ? "Proposal" : "Evidence ";
      assert.equal(validateC1Envelope(e), "C1_ROLE_COLLAPSE");
    }
  const e = structuredClone(measured);
  e.intelligence_configuration.COORDINATION.mode = "one-model";
  const c = e.intelligence_configuration.CONSTRUCTION;
  c.models = [{ ...c.models[0], slot: "Reader" }];
  c.correlation_disclosure.shared_model_or_lineage = false;
  c.correlation_disclosure.correlation_groups = [];
  e.slot_outputs = [{ ...e.slot_outputs[0], slot: "Reader" }];
  assert.equal(validateC1Envelope(e), null);
});
test("undeclared fields and governance overrides fail closed", () => {
  for (const override of [
    { authority_granted: true },
    { execution_implied: true },
    { live_inference_authorized: true },
    { layer_2_spend_usd: 1 },
    { council_vote_authorized: true },
  ]) {
    const e = structuredClone(measured);
    Object.assign(e.intelligence_configuration.GOVERNANCE, override);
    assert.equal(validateC1Envelope(e), "C1_AUTHORITY_ESCALATION");
  }
  const e = structuredClone(measured);
  Reflect.deleteProperty(e.intelligence_configuration, "GOVERNANCE");
  assert.equal(validateC1Envelope(e), "C1_AUTHORITY_ESCALATION");
  const f = structuredClone(measured);
  Object.assign(f.intelligence_configuration.CONSTRUCTION.correlation_disclosure, {
    five_independent_models_claimed: true,
  });
  assert.equal(validateC1Envelope(f), "C1_AUTHORITY_ESCALATION");
  const g = structuredClone(measured);
  Object.assign(g.intelligence_configuration.CONSTRUCTION.provenance[0].source, { extra: true });
  assert.equal(validateC1Envelope(g), "C1_MALFORMED_OUTPUT");
});

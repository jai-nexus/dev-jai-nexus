import { z } from "zod";
import { canonicalJson } from "../receiptLedger/receiptLedger";
import { validateC1Envelope, evaluateC3BenchmarkClockEligibility, type Envelope } from "./c1-five-slot-decision-contract";
import { bindEvidence, sha256, strictJson, type ReplayPins, type VerifiedSnapshot } from "./c2-ledger-snapshot";
import { coldReconstructDecisionEvidencePacket } from "./c3-decision-evidence-packet";
import { assertVerifiedStudy, EXACT_CASE_COUNT, hex64, id, integer, isolatedConfiguration, isolation, MEASURED_ARMS,
  requireC3, structured_call_budget_per_case, tokenTelemetry, type verifyC3Reveal } from "./c3-preregistration-protocol";

const reportSchema = z.object({
  disposition: z.enum(["APPROVE", "CONSENSUS", "HOLD"]),
  findings: z.array(z.object({ target_clause_id: id, defect_class: id, remediation_code: id,
    disposition: z.enum(["REMEDIATE", "DISMISS"]) }).strict()),
}).strict();
const runSchema = z.object({
  case_id: id, arm: z.enum(MEASURED_ARMS), session_id: id, isolation,
  surface: z.literal("OPENAI_SUBSCRIPTION"), L2_metered_api_cash_usd: z.literal(0),
  case_input_sha256: hex64, wall_clock_seconds: z.number().finite().nonnegative(),
  l3_token_telemetry_status: z.enum(["OBSERVED_EXACT", "UNOBSERVABLE_SUBSCRIPTION_SURFACE"]),
  l3_token_telemetry: tokenTelemetry,
  passes: z.array(z.object({ provider_family: z.literal("OpenAI"), model_id: id, output: id }).strict()),
  envelope: z.custom<Envelope>(v => !!v && typeof v === "object"),
}).strict();
export type ArmRun = z.infer<typeof runSchema>;
export interface ReconstructionInput { packet: unknown; rawEnvelopeBytes: Uint8Array; pins: ReplayPins }
function metrics() {
  return { critical_errors_caught: 0, critical_misses: 0, adversarial_false_consensus_count: 0,
    provenance_complete_outputs: 0, recorded_outputs: 0, provenance_completeness: 0, preserved_disagreement_count: 0,
    active_founder_minutes_total: 0 as number | null, total_retries: 0 as number | null, total_interactions: 0 };
}
// The final observed pass supplies the structured verdict. The scorer never interprets free prose.
export function scoreC3Study(study: ReturnType<typeof verifyC3Reveal>, records: unknown, snapshot: VerifiedSnapshot,
  evidence: ReadonlyMap<string, ReconstructionInput>) {
  assertVerifiedStudy(study);
  const runs = z.array(runSchema).length(EXACT_CASE_COUNT * MEASURED_ARMS.length).parse(records);
  const [baseline, unstructured, five] = MEASURED_ARMS;
  const per_arm = { [baseline]: metrics(), [unstructured]: metrics(), [five]: metrics() };
  const sessions = new Set<string>(), cells = new Set<string>();
  let reconstructed = 0, unmeasured = false;
  for (const run of runs) {
    const c = study.corpus.cases.find(row => row.case_id === run.case_id);
    const cell = canonicalJson([run.case_id, run.arm]);
    requireC3(c && !cells.has(cell) && !sessions.has(run.session_id), "C3_CELL_MATRIX");
    cells.add(cell);
    sessions.add(run.session_id);
    const envelope = run.envelope, config = envelope.intelligence_configuration;
    const diagnostic = validateC1Envelope(envelope);
    requireC3(!diagnostic || diagnostic === "C1_UNRESOLVED_DISAGREEMENT", diagnostic ?? "C3_ENVELOPE");
    requireC3(isolatedConfiguration(config), "C3_VERIFIER_SELF_GRADING_CONFLICT");
    const mode = run.arm === five ? "five-slot" : run.arm === baseline ? "two-seat" : "one-model";
    const expectedSeats = run.arm === five ? 5 : run.arm === baseline ? 2 : 1;
    requireC3(config.COORDINATION.mode === mode && config.CONSTRUCTION.models.length === expectedSeats &&
      envelope.slot_outputs.length === expectedSeats &&
      config.CONSTRUCTION.models.every(m => envelope.slot_outputs.some(o => o.slot === m.slot)) &&
      run.passes.every(p => config.CONSTRUCTION.models.some(m => m.model_id === p.model_id)), "C3_ARM_CONFIGURATION");
    const caseAnchors = config.CONSTRUCTION.prompt_versions.filter(v => v.startsWith("C3-CASE:"));
    requireC3(caseAnchors.length === 1 && caseAnchors[0] === "C3-CASE:" + canonicalJson([c.case_id, c.task_complexity_tier, run.case_input_sha256]), "C3_CASE_BINDING");
    requireC3(run.case_input_sha256 === sha256(Buffer.from(c.case_input)) &&
      run.l3_token_telemetry_status === run.l3_token_telemetry.telemetry_status &&
      run.passes.length === structured_call_budget_per_case[run.arm] &&
      run.passes.every(p => [...p.output].length <= study.corpus.max_output_chars_per_pass) &&
      run.wall_clock_seconds <= study.corpus.wall_clock_cap_seconds_per_case, "C3_OBSERVABLE_BUDGET");
    const output = run.passes[run.passes.length - 1].output;
    if (run.arm !== unstructured) {
      config.CONSTRUCTION.models.forEach((model, i) => {
        requireC3(run.passes[i].model_id === model.model_id &&
          run.passes[i].output === envelope.slot_outputs.find(o => o.slot === model.slot)?.text, "C3_PASS_BINDING");
      });
    }
    const outputSlot = run.arm === five ? "Synthesis" : config.CONSTRUCTION.models[expectedSeats - 1].slot;
    requireC3(envelope.slot_outputs.find(o => o.slot === outputSlot)?.text === output, "C3_FINDING_BINDING");
    const report = reportSchema.parse(strictJson(Buffer.from(output)));
    bindEvidence(envelope, snapshot);
    const m = per_arm[run.arm];
    m.recorded_outputs += envelope.slot_outputs.length;
    m.provenance_complete_outputs += envelope.slot_outputs.filter(o => o.evidence_indices.length > 0).length;
    m.preserved_disagreement_count += envelope.slot_outputs.reduce((sum, o) => sum + o.competing_positions.length, 0);
    m.total_interactions += run.passes.length;
    const clock = envelope.operator_clock_telemetry;
    const eligibility = evaluateC3BenchmarkClockEligibility(clock);
    if (eligibility === "C1_UNMEASURED_FOUNDER_CLOCK") {
      unmeasured = true;
      m.active_founder_minutes_total = null;
    } else {
      requireC3(eligibility === null && clock.status === "MEASURED" &&
        (Date.parse(clock.completed_at_iso) - Date.parse(clock.started_at_iso)) / 1000 <= run.wall_clock_seconds, "C3_CLOCK");
      if (m.active_founder_minutes_total !== null) m.active_founder_minutes_total += clock.active_founder_minutes;
    }
    if (clock.retries === null) m.total_retries = null;
    else if (m.total_retries !== null) m.total_retries += clock.retries;
    let falseConsensus = false;
    for (const defect of study.key.find(row => row.case_id === c.case_id)!.defects) {
      const matching = report.findings.filter(f => f.target_clause_id === defect.target_clause_id && f.defect_class === defect.defect_class);
      const surfaced = matching.some(f => f.disposition === "REMEDIATE") && !matching.some(f => f.disposition === "DISMISS");
      const caught = surfaced && report.disposition !== "APPROVE" && matching.some(f => f.remediation_code === defect.required_remediation_code);
      if (defect.severity === "CRITICAL_P1") {
        if (caught) m.critical_errors_caught++;
        else m.critical_misses++;
      }
      if (!surfaced && report.disposition !== "HOLD" &&
        (defect.adversarial_trap || (report.disposition === "CONSENSUS" && config.CONSTRUCTION.correlation_disclosure.shared_model_or_lineage)))
        falseConsensus = true;
    }
    if (falseConsensus) m.adversarial_false_consensus_count++;
    if (run.arm === five) {
      const input = evidence.get(c.case_id);
      if (input) {
        const cold = coldReconstructDecisionEvidencePacket(input.packet, input.rawEnvelopeBytes, snapshot, input.pins);
        if (cold.ok && cold.packet.case_id === c.case_id && cold.packet.task_complexity_tier === c.task_complexity_tier &&
          canonicalJson(cold.packet.cost_to_verified_execution.L3_token_equivalent_non_cash) === canonicalJson(run.l3_token_telemetry) &&
          canonicalJson(strictJson(input.rawEnvelopeBytes)) === canonicalJson(envelope)) reconstructed++;
      }
    }
  }
  for (const m of Object.values(per_arm)) m.provenance_completeness = m.provenance_complete_outputs / m.recorded_outputs;
  const baseMinutes = per_arm[baseline].active_founder_minutes_total, fiveMinutes = per_arm[five].active_founder_minutes_total;
  const ratio = baseMinutes && fiveMinutes !== null ? fiveMinutes / baseMinutes : null;
  const delta = per_arm[five].critical_errors_caught - per_arm[baseline].critical_errors_caught;
  const T1 = unmeasured ? "HOLD_UNMEASURED_CLOCK" : ratio === null ? "HOLD_ZERO_BASELINE" :
    delta < 2 || ratio > 1.5 ? "DOWNGRADE_5_TO_3_TO_2_SEATS" : "PASS";
  const suspended_arms = MEASURED_ARMS.filter(arm => per_arm[arm].adversarial_false_consensus_count >= 3);
  const T2 = suspended_arms.length ? "SUSPEND_ROLE_COLLAPSED_CONFIGURATION" : "PASS";
  const T3 = reconstructed < 13 ? "REJECT_VERIFICATION_CLAIM" : "PASS";
  const disposition = unmeasured || ratio === null ? "HOLD_OR_REVISE" : T3 !== "PASS" ? T3 : T2 !== "PASS" ? T2 : T1;
  return { per_arm, additional_critical_caught_five_slot_vs_two_seat: delta, founder_minutes_ratio_five_slot_vs_two_seat: ratio,
    reconstructed, T1, T2, T3, suspended_arms, disposition,
    code: unmeasured ? "C3_HOLD_UNMEASURED_FOUNDER_CLOCK" : null,
    null_result: T3 !== "PASS" || unmeasured || ratio === null ? "HOLD_OR_REVISE" :
      T1 !== "PASS" || T2 !== "PASS" ? "ELIGIBLE_FOR_HUMAN_CLOSED_ACCEPTED" : null };
}

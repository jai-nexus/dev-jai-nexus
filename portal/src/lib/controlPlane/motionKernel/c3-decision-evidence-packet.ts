import { z } from "zod";
import { canonicalJson } from "../receiptLedger/receiptLedger";
import { evaluateC3BenchmarkClockEligibility, validateC1Envelope, type Envelope, type IntelligenceConfiguration, type OperatorClock } from "./c1-five-slot-decision-contract";
import { replayFiveSlots as replayFiveSlotDecision } from "./c2-five-slot-replay";
import { strictJson, type ReplayPins, type VerifiedSnapshot } from "./c2-ledger-snapshot";
import { hex64, id, isolatedConfiguration, requireC3, TASK_COMPLEXITY_TIERS, tokenTelemetry } from "./c3-preregistration-protocol";

const packetSchema = z.object({
  packet_version: z.literal("C3-DECISION-EVIDENCE-PACKET-v1"), case_id: id, task_complexity_tier: z.enum(TASK_COMPLEXITY_TIERS),
  intelligence_configuration: z.custom<IntelligenceConfiguration>(v => !!v && typeof v === "object"),
  c2_replay_binding: z.object({ recorded_envelope_sha256: hex64, c2_replay_digest: hex64,
    snapshot_commit_sha: z.string().regex(/^[0-9a-f]{40}$/), c1_contract_blob_sha: z.string().regex(/^[0-9a-f]{40}$/) }).strict(),
  cost_to_verified_execution: z.object({
    L1_subscription_allocation_note: z.object({ allocation_basis: id, monthly_subscription_usd: z.number().finite().min(0).max(200) }).strict(),
    L2_metered_api_cash_usd: z.literal(0), L3_token_equivalent_non_cash: tokenTelemetry,
    L4_founder_time_non_cash: z.custom<OperatorClock>(v => evaluateC3BenchmarkClockEligibility(v) !== "C1_MALFORMED_OUTPUT"),
  }).strict(),
  reusable_capability_delta: z.object({ artifact_or_verifier_id: id,
    repository_path: id.refine(p => !/[\\:\x00-\x1f]/.test(p) && p.split("/").every(s => s && s !== "." && s !== "..")),
    reusable_check_kind: id, hypothesized_next_loop_cost_reduction: id, claim_status: z.literal("HYPOTHESIZED_UNVERIFIED") }).strict(),
}).strict();
export type C3DecisionEvidencePacketV1 = z.infer<typeof packetSchema>;
export function coldReconstructDecisionEvidencePacket(packet: unknown, rawEnvelopeBytes: Uint8Array, verifiedC2Snapshot: VerifiedSnapshot, c2Pins: ReplayPins) {
  try {
    const p = packetSchema.parse(packet);
    const replay = replayFiveSlotDecision(rawEnvelopeBytes, verifiedC2Snapshot, c2Pins);
    requireC3(replay.ok, replay.code ?? "C3_REPLAY");
    const envelope: Envelope = replay.payload.envelope;
    const diagnostic = validateC1Envelope(envelope);
    requireC3(!diagnostic || diagnostic === "C1_UNRESOLVED_DISAGREEMENT", "C3_INVALID_ENVELOPE");
    const binding = p.c2_replay_binding;
    requireC3(binding.c2_replay_digest === replay.digest && binding.recorded_envelope_sha256 === replay.payload.input_sha256 &&
      binding.snapshot_commit_sha === replay.payload.snapshot_commit_sha && binding.c1_contract_blob_sha === replay.payload.c1_contract_blob_sha, "C3_REPLAY_BINDING");
    requireC3(canonicalJson(p.intelligence_configuration) === canonicalJson(envelope.intelligence_configuration) &&
      isolatedConfiguration(p.intelligence_configuration), "C1_VERIFIER_SELF_GRADING_CONFLICT");
    const caseMarkers = p.intelligence_configuration.CONSTRUCTION.prompt_versions.filter(v => v.startsWith("C3-CASE:"));
    requireC3(caseMarkers.length === 1, "C3_CASE_BINDING");
    const [caseId, tier] = z.tuple([id, z.enum(TASK_COMPLEXITY_TIERS), hex64]).parse(
      strictJson(Buffer.from(caseMarkers[0].slice("C3-CASE:".length))),
    );
    requireC3(caseId === p.case_id && tier === p.task_complexity_tier, "C3_CASE_BINDING");
    requireC3(canonicalJson(p.cost_to_verified_execution.L4_founder_time_non_cash) === canonicalJson(envelope.operator_clock_telemetry), "C3_CLOCK_BINDING");
    return { ok: true, packet: p, digest: replay.digest } as const;
  } catch (error) {
    return { ok: false, code: error instanceof Error && /^(?:C[123]_)[A-Z_]+$/.test(error.message) ? error.message : "C3_PACKET_INVALID" } as const;
  }
}

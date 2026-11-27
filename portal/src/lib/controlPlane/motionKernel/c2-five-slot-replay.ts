import { createHash } from "node:crypto";
import { canonicalJson } from "../receiptLedger/receiptLedger";
import { slots, validateC1Envelope, type Envelope, type Diagnostic } from "./c1-five-slot-decision-contract";
import {
  bindEvidence, blobId, check, matchesSnapshot, ReplayError, sha256, strictJson,
  type ReplayPins, type VerifiedSnapshot,
} from "./c2-ledger-snapshot";

function failure(code: ReplayError["code"] | Diagnostic) {
  return { ok: false, code, digest: null, payload: null } as const;
}
export function replayFiveSlots(bytes: Uint8Array, snapshot: VerifiedSnapshot, pins: ReplayPins) {
  try {
    check(matchesSnapshot(snapshot, pins), "C2_PIN");
    const input_sha256 = sha256(bytes);
    check(input_sha256 === pins.input_sha256, "C2_INPUT_SHA");
    check(blobId(bytes) === pins.input_blob_sha, "C2_BLOB");
    const input = strictJson(bytes);
    const diagnostic = validateC1Envelope(input);
    if (diagnostic && diagnostic !== "C1_UNRESOLVED_DISAGREEMENT") return failure(diagnostic);
    // C1 issues the disagreement diagnostic only after validating the entire envelope.
    const envelope = input as Envelope;
    check(envelope.intelligence_configuration.COORDINATION.mode === "five-slot", "C2_ENVELOPE");
    const verified_receipt_bindings = bindEvidence(envelope, snapshot);
    const payload = {
      replay_schema_version: "JAI-C2-REPLAY-v1",
      c1_contract_blob_sha: snapshot.c1_contract_blob_sha,
      snapshot_commit_sha: snapshot.snapshot_commit_sha,
      input_sha256, verified_receipt_bindings,
      envelope: { ...envelope, slot_outputs: slots.map(slot => envelope.slot_outputs.find(row => row.slot === slot)!) },
    };
    const digest = createHash("sha256").update("JAI-C2-REPLAY-v1\0").update(canonicalJson(payload)).digest("hex");
    check(digest === pins.expected_replay_digest, "C2_DIGEST");
    return { ok: true, code: null, digest, payload } as const;
  } catch (error) {
    return failure(error instanceof ReplayError ? error.code : "C2_ENVELOPE");
  }
}

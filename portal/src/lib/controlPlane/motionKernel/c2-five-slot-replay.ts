import { createHash } from "node:crypto";
import { canonicalJson } from "../receiptLedger/receiptLedger";
import { slots, validateC1Envelope, type Envelope, type Diagnostic } from "./c1-five-slot-decision-contract";
import {
  blobId, check, contractPath, matchesSnapshot, ReplayError, sha256, strictJson,
  type ReceiptPin, type ReplayPins, type VerifiedSnapshot,
} from "./c2-ledger-snapshot";

function bindEvidence(envelope: Envelope, snapshot: VerifiedSnapshot) {
  const bindings: Readonly<ReceiptPin>[] = [];
  for (const ref of envelope.intelligence_configuration.CONSTRUCTION.provenance) {
    const { source } = ref;
    check(ref.provenance_kind === "COMMITTED_EVIDENCE" && ref.repository === "jai-nexus/dev-jai-nexus" &&
      source.source_commit === snapshot.snapshot_commit_sha, "C2_EVIDENCE");
    if (source.path === contractPath) {
      check(source.source_blob === snapshot.c1_contract_blob_sha && ref.receipt_event_id === undefined &&
        ref.receipt_ledger_path === undefined && ref.receipt_hash === undefined, "C2_EVIDENCE");
      continue;
    }
    const receipt = snapshot.receipts.find(r => r.path === source.path);
    check(receipt && source.source_blob === receipt.blob_sha && ref.receipt_ledger_path === receipt.path &&
      ref.receipt_event_id === receipt.event_id && ref.receipt_hash === receipt.receipt_hash, "C2_EVIDENCE");
    bindings.push(receipt);
  }
  return bindings;
}
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

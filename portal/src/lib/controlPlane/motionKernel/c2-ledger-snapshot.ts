import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { posix } from "node:path";
import { assertWriterIdentity, ledgerEventPath } from "../../../../scripts/validate-package-format-2.mjs";
import { canonicalJson, receiptHash } from "../receiptLedger/receiptLedger";

export const snapshotCommit = "15e2cc02a4ea3bdbd3c6e1123e822533b9bc5e31";
export const contractPath = "portal/src/lib/controlPlane/motionKernel/c1-five-slot-decision-contract.ts";
export interface ReceiptPin {
  path: string;
  blob_sha: string;
  event_id: string;
  prev_ledger_entry_hash: string | null;
  receipt_hash: string;
}
export interface ReplayPins {
  snapshot_commit_sha: string;
  c1_contract_blob_sha: string;
  receipts: ReceiptPin[];
  input_blob_sha: string;
  input_sha256: string;
  expected_replay_digest: string;
}
type Code = "C2_SNAPSHOT" | "C2_PIN" | "C2_BLOB" | "C2_JSON" | "C2_DUPLICATE_KEY" | "C2_BOM"
  | "C2_WRITER" | "C2_CHAIN" | "C2_EVIDENCE" | "C2_INPUT_SHA" | "C2_DIGEST" | "C2_ENVELOPE";
export class ReplayError extends Error {
  constructor(readonly code: Code) { super(code); }
}
export function check(value: unknown, code: Code): asserts value {
  if (!value) throw new ReplayError(code);
}

export function blobId(bytes: Uint8Array): string {
  return createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
}
export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

// Scan string tokens before parsing the document. Only a string followed by a colon
// can be an object member name. Decode its escapes so "\u0061" collides with "a".
export function strictJson(bytes: Uint8Array): unknown {
  check(!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), "C2_BOM");
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const objects: Set<string>[] = [];
    const tokens = /"(?:\\[\s\S]|[^"\\])*"[\x20\t\r\n]*(:)?|[{}]/g;
    let token: RegExpExecArray | null;
    while ((token = tokens.exec(text)) !== null) {
      if (token[0] === "{") objects.push(new Set());
      else if (token[0] === "}") objects.pop();
      else if (token[1]) {
        const key: string = JSON.parse(token[0].slice(0, -1));
        const keys = objects[objects.length - 1];
        check(keys, "C2_JSON");
        check(!keys.has(key), "C2_DUPLICATE_KEY");
        keys.add(key);
      }
    }
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof ReplayError) throw error;
    throw new ReplayError("C2_JSON");
  }
}

function git(root: string, ...args: string[]): Buffer {
  try {
    return execFileSync("git", ["--no-replace-objects", ...args], {
      cwd: root, stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_ALLOW_PROTOCOL: "file", GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0" },
    });
  } catch {
    throw new ReplayError("C2_SNAPSHOT");
  }
}
export function readPinnedBlob(root: string, id: string): Buffer {
  check(typeof id === "string" && /^[0-9a-f]{40}$/.test(id), "C2_PIN");
  const bytes = git(root, "cat-file", "blob", id);
  check(blobId(bytes) === id, "C2_BLOB");
  return bytes;
}

export function loadRecordedInput(root: string, pins: ReplayPins): Buffer {
  const inputPath = "portal/src/lib/controlPlane/motionKernel/c2-recorded-five-slot-input-v1.json";
  const id = git(root, "rev-parse", "HEAD:" + inputPath).toString().trim();
  check(id === pins.input_blob_sha, "C2_PIN");
  const bytes = readPinnedBlob(root, id);
  check(sha256(bytes) === pins.input_sha256, "C2_INPUT_SHA");
  return bytes;
}

// These principals are identical in the frozen B2, B3 and B4 lane contracts.
const principals: Record<string, string> = {
  builder: "ChatGPT / Codex", verifier: "Claude", "control-thread": "Jerry Ingram",
};
export function verifyReceipt(bytes: Buffer, pin: ReceiptPin, predecessor: string | null) {
  check(blobId(bytes) === pin.blob_sha, "C2_BLOB");
  const event = strictJson(bytes);
  let path: string;
  try {
    path = ledgerEventPath(event);
  } catch {
    throw new ReplayError("C2_BLOB");
  }
  // ledgerEventPath has applied B1's strict event schema.
  const e = event as { event_id: string; timestamp: string; authority_granted: false; writer_role: string;
    principal_id: string; prev_ledger_entry_hash: string | null };
  check(path === pin.path && bytes.equals(Buffer.from(canonicalJson(e) + "\n")), "C2_BLOB");
  check(e.authority_granted === false && e.event_id === pin.event_id, "C2_BLOB");
  const timestamp = [...e.event_id.slice(0, 10)].reduce((n, c) => n * 32 + "0123456789ABCDEFGHJKMNPQRSTVWXYZ".indexOf(c), 0);
  check(timestamp === Date.parse(e.timestamp), "C2_BLOB");
  check(Object.hasOwn(principals, e.writer_role) && principals[e.writer_role] === e.principal_id, "C2_WRITER");
  try { assertWriterIdentity(e); } catch { throw new ReplayError("C2_WRITER"); }
  check(e.prev_ledger_entry_hash === predecessor && predecessor === pin.prev_ledger_entry_hash, "C2_CHAIN");
  check(receiptHash(e) === pin.receipt_hash, "C2_BLOB");
}
export interface VerifiedSnapshot {
  readonly snapshot_commit_sha: string;
  readonly c1_contract_blob_sha: string;
  readonly receipts: readonly Readonly<ReceiptPin>[];
}
const verified = new WeakSet<VerifiedSnapshot>();
export function matchesSnapshot(snapshot: VerifiedSnapshot, pins: ReplayPins) {
  return verified.has(snapshot) && pins.snapshot_commit_sha === snapshot.snapshot_commit_sha &&
    pins.c1_contract_blob_sha === snapshot.c1_contract_blob_sha &&
    canonicalJson(pins.receipts) === canonicalJson(snapshot.receipts);
}
export function loadLedgerSnapshot(root: string, pins: ReplayPins): VerifiedSnapshot {
  check(pins?.snapshot_commit_sha === snapshotCommit && Array.isArray(pins.receipts), "C2_PIN");
  const contract = git(root, "rev-parse", snapshotCommit + ":" + contractPath).toString().trim();
  check(contract === pins.c1_contract_blob_sha, "C2_PIN");
  check(git(root, "rev-parse", "HEAD:" + contractPath).toString().trim() === contract, "C2_PIN");
  readPinnedBlob(root, contract);
  const rows = git(root, "ls-tree", "-rz", snapshotCommit, "--", ".nexus/ledger").toString().split("\0");
  rows.pop(); // ls-tree -z terminates each record with NUL.
  check(rows.length === 23 && pins.receipts.length === rows.length, "C2_PIN");
  const streams = new Map<string, string>();
  const ids = new Set<string>();
  const receipts = rows.map((row, i) => {
    const pin = pins.receipts[i];
    check(pin && row === "100644 blob " + pin.blob_sha + "\t" + pin.path, "C2_PIN");
    check(Object.keys(pin).length === 5, "C2_PIN");
    const stream = posix.dirname(pin.path);
    verifyReceipt(readPinnedBlob(root, pin.blob_sha), pin, streams.get(stream) ?? null);
    check(!ids.has(pin.event_id), "C2_CHAIN");
    ids.add(pin.event_id);
    streams.set(stream, pin.receipt_hash);
    return Object.freeze({ ...pin });
  });
  check(streams.size === 9, "C2_CHAIN");
  const snapshot = Object.freeze({ snapshot_commit_sha: snapshotCommit, c1_contract_blob_sha: contract,
    receipts: Object.freeze(receipts) });
  verified.add(snapshot);
  return snapshot;
}

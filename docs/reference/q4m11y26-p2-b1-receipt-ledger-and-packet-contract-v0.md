# B1 Git receipt ledger and packet contract

`Q4M11Y26-P2:B1` (`JAI-278`) uses Package Format 2 at base `710665257d49893ab551372d09e5f51092b9af7b`. The frozen contract names the writers and depends on A1, A2 and A3. It contains no committed-event exit requirement. The examples and regression events live in temporary Git repositories. [B1 contract](../../.nexus/programs/corpus-v1/motion-0248/jai-five-slot-compounded-reasoning-shadow-kernel-v0/lanes/B1/contract.yaml)

## Address and validate a packet

Call `validatePacket(packet, { currentBaseSha, replyTo, attestedRecipient })` with a parsed envelope and independently obtained context. A PING carries a unique application-supplied `packet_id` and a null `in_reply_to`. A PONG carries its own ID and echoes the original PING ID in `in_reply_to`. The recipient compares `expected_base_sha` with the current target main commit. A moved main requires a fresh route. This example uses the normalized input shape. [Packet API](../../portal/src/lib/controlPlane/receiptLedger/packetContract.ts)

```json
{
  "protocol": "JAI::PING:1.1",
  "packet_id": "PING-B1-EXAMPLE",
  "in_reply_to": null,
  "from": "JAI::COUNCIL::ARCHITECT",
  "to": "JAI::DEV::BUILDER",
  "delivery_mode": "ROLE_ANYCAST",
  "expected_base_sha": "710665257d49893ab551372d09e5f51092b9af7b",
  "action_scope": ["inspect the B1 contract"],
  "repo_mutations_authorized": false,
  "authority_from_address": false,
  "layer_2_spend_usd": 0,
  "verifier_authority": false,
  "merge_authorized": false
}
```

| Delivery mode | Destination and check |
| --- | --- |
| `PLANE_BROADCAST` | A plane such as `JAI::DEV`. Mutations must be false. |
| `ROLE_ANYCAST` | A three-part seat such as `JAI::DOCS::ARCHIVIST`. Each plane and role starts with an uppercase letter and may contain uppercase letters, digits and underscores. A packet requesting repository mutations must address a repository role. |
| `INSTANCE_UNICAST` | A six-part session ID matching the recipient attested outside the packet. Model and effort follow the role, then a calendar date with optional two-digit instance suffix. An `UNDECLARED` field prevents attested unicast. |

The addressing layer checks shape, correlation and scope. Callers must authenticate the principal and obtain a separate, repository-specific route before permitting writes. The read-only `importLegacyPing` projection keeps the old envelope ID and protocol and discards legacy action claims. Hashes and addresses grant zero spend, verification, integration or lifecycle authority.

## Append and replay a receipt

The canonical file is `.nexus/ledger/<corpus>/<motion>/<program_slug>/<lane>/<writer_role>/<UTC>-<ULID>.json`. Event IDs are unique across streams. Within one stream, order is UTC then ULID. The ULID encodes the timestamp in milliseconds. The first predecessor is null. Every subsequent predecessor is the SHA-256 of UTF-8 `JAI-RECEIPT-v1`, one NUL byte, and the preceding event's canonical JSON, including its full actor session ID. The writer and validator share the same canonicalizer. Tests cover UTF-16 property order, nested objects in arrays, number serialization and escaped Unicode strings. [JCS, RFC 8785](https://www.rfc-editor.org/rfc/rfc8785.html) · [Writer API](../../portal/src/lib/controlPlane/receiptLedger/receiptLedger.ts)

| Stream | Tier 1 seat | Frozen B1 principal |
| --- | --- | --- |
| builder | `JAI::DEV::BUILDER` | ChatGPT / Codex |
| verifier | `JAI::DEV::VERIFIER` | Claude |
| control-thread | `JAI::DEV::OPERATOR` | Jerry Ingram |

Each lane's frozen `writers` map supplies its own principal IDs. Ledger writers require six-part session IDs. B9-CLASS-006 requires at least one builder session recorded for the lane and a recognized model family for the verifier and every recorded builder. The verifier's family must differ from every builder family. Recognized families are OpenAI (including ASTRA), Anthropic (including CLAUDE, OPUS, SONNET, HAIKU and FABLE), and Google (including GEMINI).

`appendReceipt(request, writer)` takes a local bare Git repository, an existing proposal branch, expected main and proposal SHAs, and a complete Format 2 event. Supply the writer role, actor and principal from the authenticated route context separately. The writer validates the candidate in a private checkout against the frozen contract, source blobs and preceding Git history. A single Git ref transaction verifies main and compares and swaps the proposal head. A stale head or competing update fails. The caller must refresh the trusted main ref before preparing a packet and check the remote base again at publication. There is no cross-host transaction.

With fresh refs, an exact canonical duplicate returns the current head, path, hash and `appended: false`. Conflicting payloads at the same key, reused event IDs, broken predecessors and stale bases fail. A B9-CLASS-006 record requires the verifier stream and a principal distinct from the frozen builder. B9-CLASS-007 requires the human control-thread stream. Recorded attribution still requires independent evidence of who actually acted. An accepted hash chain alone cannot establish human consent.

## Revision and compensation proof

The Format 2 regression commits a synthetic delivery, appends a bounded HOLD revision, then appends a compensating DELIVERED observation. The compensation hashes its predecessor and cites the revision's path, commit and blob as evidence. Both earlier blob IDs are checked against their original commits. Separate histories edit or delete the first receipt and then restore its exact bytes. In each case the validator rejects the intervening Git edge despite the restored final tree. [Git history regression](../../portal/scripts/validate-package-format-2.test.mjs)

## Downstream use

| Lane | Interface |
| --- | --- |
| B2, canonical fleet export | Pin the export's repository, commit, path and blob in evidence. Carry its expected base and action scope in the packet. |
| B3, orchestrator view | Consume the B2 export identified by those immutable coordinates. Refresh the target-repository base before a separately routed write. |
| B4, audit view | Replay the supplied Git history and receipt hashes read-only. A recorded verifier observation requires the independent verifier principal and its own route. |
| B5, packet parent | Reconstruct B2–B5 evidence read-only across the three repositories. Confirm independent verification and human acceptance before crediting a child. A builder delivery by itself supplies neither. |

B1 supplies the contract and local writer. Execution of each downstream lane requires its own CONTROL_THREAD route.

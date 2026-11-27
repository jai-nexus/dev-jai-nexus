# Q4M11Y26-P2 C2 — Deterministic Five-Slot Receipt-Backed Replay Kernel (v0)

## Byte & Digest Preimage Contract

C2 reproduces a recorded five-slot decision from exact input bytes and verified evidence. The caller supplies a trusted pin manifest. The replay verifies the raw input SHA-256 and Git blob ID before decoding strict UTF-8. A BOM, malformed document or duplicate member name, including an escaped equivalent, fails validation.

The digest is lowercase SHA-256 over `UTF8("JAI-C2-REPLAY-v1") || 0x00 || UTF8(canonicalJson(payload))`. B1 supplies the canonical encoder. The preimage ends at the last byte of the payload, with no final LF. The payload contains the replay schema version, C1 contract blob, snapshot commit, raw input SHA-256, verified receipt bindings in provenance order, and the C1 envelope with outputs in canonical slot order. The expected digest lives in the manifest, outside the payload.

| Coordinate | Frozen value |
|---|---|
| Snapshot commit | `15e2cc02a4ea3bdbd3c6e1123e822533b9bc5e31` |
| C1 contract blob | `26fc10e9cee777a53ad490d50bf5356ec650e664` |
| Recorded input blob | `acb4e64e7cbf02f4ecc1816be2c32745128a6d98` |
| Recorded input SHA-256 | `e0871de76b40b8f96091c1ff3aa9ac0820bc76f288694f261f5a9c4bde8aea35` |
| Expected replay digest | `e7070d01538ae80376d85f987063fe2ecd8201b805c0e8c1a491dd953cd89946` |

## Pinned Snapshot Coordinates & Future-Proofing Against Later Ledger Commits

The loader enumerates the ledger tree at the frozen commit and reads blobs directly from local Git object storage. Later commits can add events or streams without affecting membership or ordering. The consuming revision supplies the recorded input and must still bind the pinned input and C1 paths to their expected blobs. A checkout needs the snapshot objects available locally.

The manifest identifies all 23 receipts across nine lane/writer streams. For each canonical path the loader checks Git blob identity, strict JSON, B1 schema and path, exact canonical UTF-8 bytes plus one LF, the frozen writer principal and actor, ULID timestamp and unique ID, and the false authority flag. It computes the B1 receipt hash and checks every predecessor back to genesis. The B2 builder vector has blob `a4dcd8ae37a8966c56a5f49abdce9f5f25c51afd` and receipt hash `b45509fb3ff38b20d9dc82e5a301928151c7bd7d95a1f70d494aa4e7ad5c5a26`.

## Preserved Decision Metadata

The recorded case binds B2, B3 and B4 builder deliveries plus the committed C1 contract. Proposal, Evidence, Challenge, Risk-Economics and Synthesis appear in that order in the output. All internal arrays retain their recorded order. The Challenge preserves both the delivery-evidence position and the objection about independent agreement. Risk-Economics retains the unresolved founder-effort question. Replay preserves the shared-lineage disclosure, provenance, and human-only governance with zero execution authority, live inference and Layer 2 spend.

The fixture carries explicit UNMEASURED nulls. A separately pinned MEASURED test case carries its interval, retries, capture method and 3.5 active minutes through replay. The C2 estimate of 60 founder minutes is a planning prior. Only recorded telemetry enters the payload.

## Fail-Closed Rejection Matrix & Quarantine Boundaries

| Condition | Outcome |
|---|---|
| Missing Git object, stale snapshot/contract, wrong blob or manifest coordinates | Snapshot verification raises a typed C2 error. |
| Invalid receipt identity, writer, canonical bytes or predecessor | Snapshot construction stops before returning a verified snapshot. |
| Raw input hash mismatch, BOM, duplicate key or malformed UTF-8/JSON | Replay returns a diagnostic, null payload and null digest. |
| Missing, duplicate or collapsed slot, malformed clock, authority escalation or external-action field | C1 diagnostic with null payload and digest. |
| Wrong coordination mode, unbound evidence, unverified snapshot or digest mismatch | C2 diagnostic with null payload and digest. |
| Valid envelope with explicitly recorded competing positions | Replay preserves the positions and checks the pinned digest. |

The kernel handles recorded data in memory. Local Git reads belong to the loader. Neither component dispatches tools, contacts a provider or updates the ledger. Cold-process tests compare the canonical bytes across three timezone and locale configurations. This evidence applies to recorded replay only.

CONTROL_THREAD approved this reference file for JAI-285. Builder delivery covers B9-CLASS-004 and integration evidence B9-CLASS-008. The independent VERIFIER owns the blind gate and a separate required-test pin PR. CONTROL_THREAD owns acceptance, and the Auditor owns the Linear mirror.

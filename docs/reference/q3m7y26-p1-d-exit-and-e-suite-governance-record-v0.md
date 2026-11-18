# Program 1 D-exit and E-suite governance record

## Integration and control coordinates

| Coordinate | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` · `jai-governance-intelligence-main-state-operating-loop-v0` |
| Batch and lane | E · `Q3M7Y26-P1:E-suite` (E1–E14) |
| Builder route | `CT-2026-11-17-Q3M7Y26-P1-FINALIZE-AND-PUSH-E-SUITE-ON-MERGED-MAIN-v0` |
| D-impl pull request | `jai-nexus/dev-jai-nexus#440` · `MERGED` |
| Accepted D-impl source | `202be431c4139fb4ff66f898206d482fc598229c` |
| Canonical merged main and E-suite branch base | `463b856f88548966f24206bd7b97d15b3f16a7d4` |
| E-suite feature branch | `feat/q3m7y26-p1-e-suite-negative-and-rollback-tests-v0` |

E-suite branches directly from the merged main commit. The accepted D-impl source is its second parent and remains in main ancestry. The E-suite branch has zero stacked D-impl commits above its base, satisfying motion-0248 Rule 12. Tests exercise the local documentary projection with `authority_granted: false`. [Merged PR #440](https://github.com/jai-nexus/dev-jai-nexus/pull/440) · [Merge commit](https://github.com/jai-nexus/dev-jai-nexus/commit/463b856f88548966f24206bd7b97d15b3f16a7d4)

## Batch D decision and supporting evidence

| Evidence supplied by HUMAN_OPERATOR | Role or classification | Recorded result |
| --- | --- | --- |
| `JAI_NEXUS_D_EXIT_VERIFIER_RECEIPT_V0` | `JAI::DEV::VERIFIER` · `B9-CLASS-004` | Items 1–18 PASS, P1–P6 PASS, local and Vercel typecheck PASS. CONTROL_THREAD acknowledged N1, N2, N3 and N4. |
| `CHATGPT_TO_GEMINI_D_EXIT_UI_OBSERVATION_PACKET` | UI observation | 6/6 PASS on the authenticated Vercel preview for `202be431`. The browser reported a successful clipboard write and focus was preserved. Independent clipboard readback, server-HMAC authenticity and production activation are outside the observation. |
| `ACCEPT_D_IMPL_AND_D_EXIT_AND_BATCH_D_EXIT` | `B9-CLASS-006 / BATCH_EXIT_RECEIPT` | HUMAN_OPERATOR / CONTROL_THREAD accepted D-impl, D-exit and Batch D exit. |

The independent verifier receipt and preview packet predate this E-suite run. The test file produces separate, local behavioral evidence.

**N4 acknowledgment.** The local operating loop's required base identifies the revision required by that loop. The Program 1 documentary snapshot carries its own baseline for the pinned projection. Explaining the distinction remains an evidence and documentation obligation.

| N4 coordinate | Value |
| --- | --- |
| LOCAL_OPERATING_LOOP_REQUIRED_BASE_SHA | `a0e7b76af02899659529355773bf293d58269897` |
| PROGRAM_1_DOCUMENTARY_SNAPSHOT_BASE_SHA | `ab658d65b5bf06331006990f47e7bae872df4c0e` |
| FORMALLY_ROUTED_TO | `Q3M7Y26-P1:F-evidence` |
| STATUS | `PENDING_F_EVIDENCE_EXPLANATION` |

## D10–D15 dispositions

Linear is `MIRROR_ONLY`. Read-only checks confirmed the statuses below after route `CT-2026-11-17-Q3M7Y26-P1-LINEAR-BATCH-D-MIRROR-SYNC-v0`. Under B13, the three Canceled lanes carry zero Program 1 implementation credit for database-backed decisions, durable history or idempotent retry. N2 adopted single-use proof hardening. The outstanding capabilities are deferred to the F13 residual-risk register and Program 2. [B13 planning supersession](q3m7y26-p1-nov-2026-unfreeze-reconciliation-and-control-decision-v0.md)

| Lane | Linear issue | Mirror status | Addendum disposition | Evidence or scope |
| --- | --- | --- | --- | --- |
| D10 | [JAI-235](https://linear.app/jai-nexus/issue/JAI-235) | Done | `DONE_VERIFIED` | The handler checks the pinned Program 1 snapshot. E7 and E9 exercise collision, shape and drift denials. |
| D6 | [JAI-236](https://linear.app/jai-nexus/issue/JAI-236) | Done | Earlier lane | Explainable recommendation and remediation. Included to account for this issue number. |
| D9 | [JAI-237](https://linear.app/jai-nexus/issue/JAI-237) | Done | Earlier lane | The prior B12 decision covers the tested deterministic local-shadow adapter. |
| D11 | [JAI-238](https://linear.app/jai-nexus/issue/JAI-238) | Canceled | `CANCELED_SUPERSEDED_UNDER_B13_DEFERRED_TO_F13_AND_PROGRAM_2` | Durable decision and receipt recording remains subject to the Program 1 persistent-DB refusal hold. |
| D12 | [JAI-239](https://linear.app/jai-nexus/issue/JAI-239) | Canceled | `CANCELED_SUPERSEDED_UNDER_B13_DEFERRED_TO_F13_AND_PROGRAM_2` | Cross-session resume and canonical history depend on durable recording. A fresh worker requires fresh validation. |
| D13 | [JAI-240](https://linear.app/jai-nexus/issue/JAI-240) | Canceled | `CANCELED_SUPERSEDED_UNDER_B13_DEFERRED_TO_F13_AND_PROGRAM_2` | N2 makes each proof single-use. Fresh valid runs reproduce the terminal output. Durable idempotent retry remains deferred. |
| D14 | [JAI-241](https://linear.app/jai-nexus/issue/JAI-241) | Done | `DONE_VERIFIED` | Authenticated preview observation packet, 6/6 UI checks on the accepted source. |
| D15 | [JAI-242](https://linear.app/jai-nexus/issue/JAI-242) | Done | `DONE_VERIFIED` | Independent verifier receipt and CONTROL_THREAD Batch D exit receipt recorded above. |

## E1–E15 verification map

Linear returned Backlog for all fifteen issues. “Direct” identifies an executable assertion in the named test file. It gives credit only for the behavior in that row. [Batch E negative and rollback suite](../../portal/src/lib/controlPlane/motionKernel/batch-e-negative-and-rollback-suite.test.ts)

| Lane | Linear issue | Evidence | Scope |
| --- | --- | --- | --- |
| E1 | [JAI-243](https://linear.app/jai-nexus/issue/JAI-243) | Direct, E1 v0 invariant matrix | Four injected failures assert status, denial code, zero output and successful recovery to a local HOLD. |
| E2 | [JAI-244](https://linear.app/jai-nexus/issue/JAI-244) | Direct, authentication fixture | Missing secret, absent or failed authentication, insufficient role and missing actor produce 503, 401 or 403 before the body is read. |
| E3 | [JAI-247](https://linear.app/jai-nexus/issue/JAI-247) | Direct, request boundary | Whitespace normalizes. Duplicate evidence and authority claims at the body or motion level produce 400. |
| E4 | [JAI-245](https://linear.app/jai-nexus/issue/JAI-245) | Direct, transition order | Direct decisions without proof fail structural validation. A wrong-stage or consumed proof produces 409. |
| E5 | [JAI-246](https://linear.app/jai-nexus/issue/JAI-246) | Direct, E-C / P2 | Editing one digit produces 409 `INVALID_PROOF`. The untouched original succeeds exactly once at both proof stages. DECIDE also rejects a changed actor or motion. |
| E6 | [JAI-248](https://linear.app/jai-nexus/issue/JAI-248) | Direct, recommendation and decision matrix | Nine combinations cover GO, NEEDS_REVISION and BLOCKED against ACCEPT, HOLD and REJECT. Only GO plus ACCEPT yields one proposed-only packet. |
| E7 | [JAI-249](https://linear.app/jai-nexus/issue/JAI-249) | Direct, E-F / P5 | Overlapping DECIDE requests with an unknown entry property, two active entries or an empty portfolio fail closed. The valid projection can still complete. |
| E8 | [JAI-252](https://linear.app/jai-nexus/issue/JAI-252) | Direct, E-A / N3 and export validation | A real D9 mismatch reaches the handler's 409 `D9_ADAPTER_BLOCKED` response. Altered receipt classification and authority fields block export. |
| E9 | [JAI-250](https://linear.app/jai-nexus/issue/JAI-250) | Direct, E-E / P4 | Replacing a required key with an unknown one preserves the key count and fails closed. Missing projection, swapped hash values, wrong base and stale version also fail. |
| E10 | [JAI-251](https://linear.app/jai-nexus/issue/JAI-251) | Direct, N2 concurrency | Concurrent uses of one proof produce one success and one denial. A fresh chain reproduces the terminal result. The UI ownership check rejects a stale response. |
| E11 | [JAI-255](https://linear.app/jai-nexus/issue/JAI-255) | Direct, dependency scan and runtime check | The suite checks the handler's local import graph and allowed external imports. A complete ACCEPT path records zero calls to global fetch. |
| E12 | [JAI-254](https://linear.app/jai-nexus/issue/JAI-254) | `SUPERSEDED_UNDER_B13_DEFERRED_TO_F13` | CI workflow mutation and test-discovery failure drills are outside the authorized file scope. |
| E13 | [JAI-253](https://linear.app/jai-nexus/issue/JAI-253) | Runbook below | Identifies triggers, owner, evidence to retain, reset order and release criteria for the local run. |
| E14 | [JAI-256](https://linear.app/jai-nexus/issue/JAI-256) | Direct, local-shadow reset rehearsal | Page hide and restored-page events return the populated UI state to DRAFT. A new handler rejects an outstanding old-worker proof and reproduces the terminal result on a fresh chain. |
| E15 | [JAI-257](https://linear.app/jai-nexus/issue/JAI-257) | Pending independent verification | The verifier reviews the suite, runbook and evidence limits before CONTROL_THREAD decides Batch E disposition. |

### Verifier P1–P6 coverage

| Invariant | Executable evidence |
| --- | --- |
| P1 · Cross-instance / handler-restart proof replay rejection | E14 submits an outstanding proof to a fresh handler. The fresh instance returns 409 `INVALID_PROOF`. |
| P2 · Single-character tampered proof rejection | E5 changes one character in the proof at each stage and asserts 409 `INVALID_PROOF`. |
| P3 · Genuine proof succeeds once after tamper rejection | E5 redeems the untouched proof after the edited proof is denied. Replaying the redeemed proof returns 409 `INVALID_PROOF`. |
| P4 · Key-swapped snapshot rejection | E9 replaces a required key with an unknown key, asserts that the key count is preserved and checks for 409 `INVALID_EXPECTED_SNAPSHOT`. |
| P5 · Unknown property inside a portfolio entry | E7 adds an unknown property to the active portfolio entry and asserts 409 `INELIGIBLE`. |
| P6 · Cross-motion proof substitution rejection | E5 submits a proof minted for Motion A with the ID of Motion B at DECIDE and asserts 409 `INVALID_PROOF`. |

E10 separately covers concurrent double-spend, E7 covers empty and colliding portfolios, and E3 and E8 cover authority claims. The companion handler regression covers truncated proofs, cross-Program and frozen-Program rejection, explicit active counts and snapshot authority claims. N3 uses the production handler with an isolated fault at its adapter import. [Handler regression](../../portal/src/lib/controlPlane/motionKernel/local-operating-loop-handler.test.ts)

## Rollback triggers and recovery runbook

| Observed trigger | Operator action | Recovery check |
| --- | --- | --- |
| `INVALID_EXPECTED_SNAPSHOT` or `INELIGIBLE` | Stop the transition. Compare the base SHA, snapshot hash and version, posture, and portfolio shape with the pinned documentary projection. | A valid projection reaches VALIDATED. The denied request returned zero packets and no receipt. |
| `INVALID_PROOF`, duplicate submission or lost response | Discard the failed request. After a hand-edited token is denied, the untouched, unspent token can still succeed. If spend status is uncertain, reset to DRAFT and start a fresh chain. | Exactly one concurrent redemption succeeds. A consumed token continues to return 409. |
| `D9_ADAPTER_BLOCKED` or inconsistent export | Stop copying or presenting the result. Record the status and error code. Discard the spent terminal proof and inspect the D9 contract and presentation. | The clean fixture yields ADAPTED, a demonstration receipt and `authority_granted: false`. The N3 fixture yields zero packets and no receipt. |
| Refresh, restored page or worker replacement | Clear the local UI to DRAFT. Discard prior proofs and pending responses. Revalidate and deliberate, then explicitly confirm the terminal decision. | E14 clears the UI fields, rejects the old worker's outstanding proof, and restores the expected terminal output from a fresh chain. |

The operator retains the source SHA, test name, HTTP status, denial code and packet count before reset. Keep raw proofs, session identities and private motion content out of the record. The verifier reruns the suite from `portal/` and checks the denial and recovery assertions. If a denied request yields a packet or receipt, a spent proof succeeds, or an external effect occurs, stop the rehearsal and return the evidence to CONTROL_THREAD.

```sh
node --import tsx --test --test-concurrency=1 src/lib/controlPlane/motionKernel/batch-e-negative-and-rollback-suite.test.ts
```

N3 runs in an isolated Node child with the module-mocking flag. The test first confirms that the unmodified server payload adapts normally. At the adapter import it changes only the contract version, calls the real adapter, then checks the real handler response and rejection of a replay. E14 rehearses recovery in memory. Persistent database recovery, CI mutation and deployment rollback are outside this evidence.

## Builder verification on the merged main baseline

On native Windows, Node 22.14.0 ran the E-suite three consecutive times from `portal/`. Each run passed 13 tests, failed 0, skipped 0 and exited 0. Both `corepack pnpm -C portal lint` and `corepack pnpm -C portal typecheck` exited 0 from the repository root.

The full regression matrix spans 18 files. Run it from `portal/` with the Node 22 major used by portal CI. [Portal CI workflow](../../.github/workflows/portal-ci-guardrails.yml)

```sh
node --import tsx --test --test-concurrency=1 src/lib/controlPlane/motionKernel/*.test.ts src/lib/controlPlane/programLifecycle/*.test.ts
```

Native Windows reported 29 passed, 1 failed and 0 skipped (exit 1). Only the existing C13 mutation seam registry assertion failed when comparing native backslash paths with the stored forward-slash coordinates. Ubuntu/WSL requires a Linux esbuild binary. With that dependency, Ubuntu's default Node 20.19.5 returned 200 in the N3 case that expects 409. The N3 fixture relies on experimental module mocking.

Ubuntu/WSL with Node 22.14.0 and Linux esbuild 0.27.2 passed all 30 tests across the same 18 files, with 0 failures, 0 skips and exit 0. Both N3 and C13 passed in this run. The Node 20.19.5 comparison run finished with 29 passed, 1 failed and 0 skipped (exit 1).

## E-suite-R1 revision

Route `CT-2026-11-18-Q3M7Y26-P1-REVISE-E-SUITE-ITEMS-2-AND-6-v0` addresses Items 2 and 6 of `JAI_NEXUS_E_EXIT_VERIFIER_RECEIPT_V0`. The supplied receipt names Items 1, 3, 4, 5, 7 and 8 as passing and calls for revisions to Items 2 and 6. Its aggregate of 7/8 PASS remains unreconciled with those six named passes. The verifier ruled Item 3 / N3 satisfied and M3 killed.

For Item 2, the P1–P6 table now follows the verifier's definitions and N4 is routed to F-evidence. For Item 6, E9 changes a single field per candidate. M1 sets `authority_granted` to `true`. M4 sets `binding_posture` to `LIVE_AUTHORITATIVE`. Each must return 409 `INVALID_EXPECTED_SNAPSHOT`, an empty packet list and no receipt. The test then redeems the original unspent proof with the accepted snapshot.

| Standalone E9 evidence | M1 | M4 |
| --- | --- | --- |
| Assertion added and passed against the unchanged handler | YES | YES |
| Mutation kill independently confirmed | NO | NO |

The registered mutation harness was unavailable in the builder workspace. Both kills remain for independent verifier adjudication. On Windows Node 22.14.0, the direct Node launcher and the host pnpm/tsx launcher each passed 13/13 on three consecutive runs, with zero failures, zero skips and exit 0 on every run. The sandboxed pnpm attempt exited 1 before test discovery because access to its temporary directory was denied.

The full R1 matrix ran from `portal/` on Ubuntu 24.04.3 LTS under WSL with Node 22.14.0 and Linux esbuild 0.27.2. All 30 tests across 18 files passed, with zero failures, zero skips and exit 0. N3 and C13 both passed. Portal lint and typecheck each exited 0.

## Current Program posture

| Coordinate | Disposition |
| --- | --- |
| BATCH_D_EXIT | `ACCEPTED` |
| E_SUITE | `IMPLEMENTED_PENDING_INDEPENDENT_VERIFICATION` |
| E_EXIT | `NOT_ACCEPTED` |
| PROGRAM_EXIT | `NOT_ACCEPTED` |
| JAI_ACTIVATION | `NOT_AUTHORIZED` |
| AUTHORIZED_LAYER_2_API_SPEND | `USD_0.00` |

CONTROL_THREAD retains E-suite and E-exit acceptance authority. The next review route is `Q3M7Y26-P1:E-exit-R1`.

# Q3M7Y26-P2 — Constitutional Program Opening Receipt Candidate v0

> **RECEIPT STATUS: CANDIDATE_PENDING_INDEPENDENT_VERIFICATION_MERGE_AND_HUMAN_CONTROL_ACCEPTANCE.** This document does **not** issue an effective Program opening, impersonate a signer, assign a fresh acceptance token, or independently transition a live database. Its only present effect is to make a proposed constitutional opening reviewable.

## 1. Identity and proposed B9 classification

| Field | Candidate value |
| --- | --- |
| Receipt subject | Program 2 Opening / B9-CLASS-011 LIFECYCLE_TRANSITION_RECEIPT **candidate** |
| Required future acceptance class | B9-CLASS-007 CONTROL_ACCEPTANCE_RECEIPT by VERIFIED_HUMAN_OPERATOR / CONTROL_THREAD |
| Program code | Q3M7Y26-P2 |
| Canonical Program ID | jai-five-slot-compounded-reasoning-shadow-kernel-v0 |
| Program name | Five-Slot Compounded Reasoning Shadow Kernel v0 |
| Governing motion | motion-0248, as amended by human-ratified motion-0249, pending repository integration |
| Human amendment decision | CT-DECISION-2026-11-19-Q3M7Y26-P2-RATIFY-OPTION-H-AND-AMEND-MOTION-0248-v0 |
| Documentary builder route | CT-2026-11-19-Q3M7Y26-P2-OPENING-PACKAGE-PR-v0 |
| Accepted predecessor | Q3M7Y26-P1 CLOSED_ACCEPTED, F15 PR #443 |
| Fresh required main before PR | 2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8 |
| Pre-open state | RESERVED_NOT_OPENED |
| Candidate post-acceptance state | OPEN_FOR_PROGRAM_COORDINATION_AND_BATCH_PLANNING_ONLY |
| Count invariant | active_program_count <= 1; pre-open governance count 0, candidate post-open count 1 **only after** separate human decision |
| Current authority effect | NONE |

The integration of this candidate PR alone is **not** a human acceptance receipt. A later HUMAN_OPERATOR/CONTROL_THREAD acceptance must expressly name its subject, evidence cutoff, integrated main SHA, life-cycle transition, and scope. If the required gates do not pass, retain RESERVED_NOT_OPENED and HOLD.

## 2. Required opening evidence and present status

| Gate | Evidence basis and status at candidate authoring |
| --- | --- |
| Motion accepted on main | motion-0248 present and ratified; motion-0249 amendment decision supplied and its integration pending |
| P1 predecessor accepted | F15 Git record on pinned main, token ACCEPT_F_EVIDENCE_AND_F_CLOSE_AND_CLOSE_Q3M7Y26_P1 |
| Durable lifecycle prerequisite | G2 human ruling: satisfied at Git/documentary/schema ceiling; live DB and idempotent retry unproven |
| Fresh MAIN_STATE_RECEIPT | Companion q3m7y26-p2-main-state-receipt-v0.md, candidate review only |
| Named opening receipt | This candidate; effective B9-CLASS-011 issuance withheld |
| Independent review | Claude/JAI::DEV::VERIFIER B9-CLASS-006 pending on the eventual PR head |
| Repo integration | PR not merged at candidate authorship; exact integrated SHA pending |
| Final acceptance | CONTROL_THREAD B9-CLASS-007 not yet issued |
| Protected scope/budget/credentials | Below, default-deny |
| Conflicting work | Separate-route checks required again at approval; no automatic inherited authority |

Freshness is evaluated against the integrated main SHA at the eventual human acceptance, not merely the historical base; any changed head, new conflicting active Program or stale gate requires renewed review.

## 3. Ratified Option H: twelve planning lanes, not twelve execution grants

| Coordinate | Single write repo, if subsequently routed | Technical dependencies |
| --- | --- | --- |
| Q3M7Y26-P2:A1 | jai-nexus/dev-jai-nexus | P1 accepted baseline |
| Q3M7Y26-P2:A2 | jai-nexus/dev-jai-nexus | P1 baseline; A1 not prerequisite |
| Q3M7Y26-P2:A3 | jai-nexus/dev-jai-nexus | A1 + A2 |
| Q3M7Y26-P2:B1 | jai-nexus/dev-jai-nexus | A1; P1 durable-prerequisite ruling belongs at Program level |
| Q3M7Y26-P2:B2 | jai-nexus/dev-jai-nexus | A1 + A3 + B1 |
| Q3M7Y26-P2:B3 | jai-nexus/orchestrator-nexus | accepted B2 + B1 + A3 |
| Q3M7Y26-P2:B4 | jai-nexus/audit-nexus | B2 + B3 + B1 + A3; independent **read-only** ledger verification |
| Q3M7Y26-P2:B5 | no parent repository write | A1–A3 + B1–B4 evidence, individually assessed |
| Q3M7Y26-P2:C1 | jai-nexus/dev-jai-nexus | A2 + B1 external technical inputs |
| Q3M7Y26-P2:C2 | jai-nexus/dev-jai-nexus | C1 + A2 + B1 |
| Q3M7Y26-P2:C3 | jai-nexus/dev-jai-nexus | C1 + C2 + A2 + B1 |
| Q3M7Y26-P2:C4 | jai-nexus/dev-jai-nexus **documentary only** | C1–C3 + A2 + B1; B5 status disclosed, not an automatic experiment-start freeze |

B2–B4 are independent peer lanes; B5 can collect their references but cannot issue their acceptance or write to three repositories. An unresolved B2–B5 external HOLD **does not freeze** Batch C's isolated deterministic shadow work, though it may constrain fleet-integration credit and whole-Program closeout.

Every lane needs a fresh exact CONTROL_THREAD route naming one write repository, base/head, branch, allowlisted paths, human actor, tests and commit/push/PR/merge/external-action authorities. This opening candidate contains **no such child routes**.

## 4. Simulation and operational scope

**Permitted after separate effective opening:** Program-level dependency coordination, Batch planning, review of mock/manual/replay five-slot fixtures, and authoring future bounded lane routes.

**Not granted by opening:** source edits, autonomous worktree/Agent spawning, provider dispatch, live model calls, real Council voting, canonical root mutation, signed B10 receipts, production Program switch, database access, production/custodian/customer data, background automation, merge, or deployment.

The five-slot experiment remains provider-neutral and shadow/manual/replay only. Named functional slots (Proposal, Evidence, Challenge, Risk/Economics, Synthesis) are convention proposals with traceability to motion-0248, not claims of five independent model identities. Same-model/correlation disclosure is mandatory. Missing evidence, false consensus, disagreement, role collapse, malformed output, timeout and authority escalation require deterministic fail-closed negative tests.

## 5. Four-layer cost, credentials and founder-clock ceiling

| Layer | Evidence/accounting rule |
| --- | --- |
| L1 — Subscription cash | Allocate actual invoices across active days once; do not charge the full invoice to each issue |
| L2 — Metered API cash | **Authorized USD 0.00** for Q3M7Y26-P2; no provider credentials or network dispatch authorized |
| L3 — Token-equivalent | Dated non-cash model-cost equivalence; not booked as spend |
| L4 — Founder minutes | Measured start/stop, waits/rework and stated exclusions; non-cash |

Monthly cash allocation cap: **USD 200.00**. A potential USD 254.18 treasury injection is a deposit, **not** spending authority. Renewal reserve USD 70.60–94.60 remains planned cash protection. Report the four layers separately; never sum Layer 3/4 with cash.

B5 cold-reconstruction founder time target: **<=45 minutes**, measured from the first founder processing action through a packet ready for verified human close decision. Overrun is reported, never concealed.

Credentials: default-deny, no live provider key use, no new org tokens, no secret publication and no external permission change under this opening document. Repository branch protection, audit-nexus PR disposition, and scheduled workflow edits each need later exact separate routes.

## 6. Frozen C3/C4 scientific acceptance thresholds

Pre-register fifteen blinded cases (including >=5 seeded P1 defects) and exactly three measured arms: 2-Seat Baseline, Compute-Matched Unstructured and 5-Slot Shadow Kernel.

1. **Downgrade trigger:** Fewer than two additional critical errors caught by five-slot versus two-seat **or** >1.5 times baseline founder minutes recommends a 5 to 3 to 2-seat downgrade. Three-seat later work needs a new route, not a fourth C3 arm.
2. **False-consensus trigger:** >=3 adversarial false-consensus convergences suspend the role-collapsed configuration.
3. **Cold-verification trigger:** <13/15 independently cold-reconstructable packets invalidates the claimed verification result.
4. **C4 adjudication:** Independent verifier applies frozen thresholds, seven negative fixtures and the evidence-weighted eight-dimension rubric. HUMAN_OPERATOR decides follow-up acceptance or closure.

A reproducible preregistered null outcome may receive **CLOSED_ACCEPTED** on explicit HUMAN_OPERATOR decision, because honest negative knowledge is a valid research result. Ordinary incomplete evidence is HOLD/REVISE. **CLOSED_NO_GO** is reserved for authority/integrity breach or genuinely unverifiable evidence; it is never automatic or used merely for an unprofitable/null benchmark.

## 7. HOLD, rollback, cancellation and Program exit

**Default HOLD/NO_OPEN:** missing motion-0249 merge, stale main-state receipt, contradictory active-Program record, verifier failure, unauthorized expenditure, unreviewed route expansion, source drift, missing dependency proof, fake independent consensus, or absent CONTROL_THREAD acceptance. No staged candidate document can silently self-promote.

**Rollback of an eventual documentary opening:** a separately signed/ratified CONTROL_THREAD decision and B9-CLASS-011 transition must identify the prior accepted receipt, exact integrated SHA and target lifecycle state. Do not erase previously accepted history, rewrite existing hash-chain entries or auto-activate Program 3. If integrity is breached, fail closed and hold downstream Programs until human disposition.

**Program 2 exit candidates:** C4 independently reconstructs >=13/15 packets for a positive verification claim, checks all C3 thresholds and the seven failure fixtures, discloses B2–B5 evidence/holds and cash/non-cash measurements, and recommends GO/DOWNGRADE/HOLD/KILL. The HUMAN_OPERATOR may accept honest null evidence with the appropriately narrower conclusion, but must separately issue B9-CLASS-007 acceptance and a B9-CLASS-011 lifecycle transition. No PR merge, green CI, model agreement or Linear status confers Program exit credit.

Until then: **Q3M7Y26-P2 RESERVED_NOT_OPENED; ZERO_GATES_GRANTED; JAI_NOT_ACTIVATED; L2 USD 0.00.**

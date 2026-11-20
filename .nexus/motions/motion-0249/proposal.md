# Motion 0248 Amendment 1: Pre-Kernel Fleet Substrate Batches A–B, Non-Freezing Null-Result Rule, and Batch C Dependency Scoping

> **Status:** Ratified policy amendment as supplied by VERIFIED_HUMAN_OPERATOR / CONTROL_THREAD; repository record proposed for independent review. This document is not the Program 2 Opening Receipt and does not grant implementation authority.

## 1. Source, precedence, and fixed Program identity

- Governing motion: motion-0248, the sequential four-Program reservation.
- Amendment: motion-0249, authorized by CT-DECISION-2026-11-19-Q3M7Y26-P2-RATIFY-OPTION-H-AND-AMEND-MOTION-0248-v0.
- Checked-in predecessor: Q3M7Y26-P1, CLOSED_ACCEPTED at dev-jai-nexus main 2a6fbfc7828e20c41fb4fcc8d0ff949b4f62aab8 (PR #442 and PR #443).
- Program 2 code: Q3M7Y26-P2.
- Canonical Program 2 ID: jai-five-slot-compounded-reasoning-shadow-kernel-v0.
- Program 2 before separately accepted opening: RESERVED_NOT_OPENED.
- Recognized active Programs: 0 before opening; invariant active_program_count <= 1 always applies.

The amendment **does not** skip, rename, reorder, or replace Programs 1–4. Program 3 remains the founder developer workflow pilot; Program 4 remains the bounded Agent/Council activation pilot. Neither is routed by this amendment. The existing motion-0248 fresh-main-state, named-opening, and separately routed lane execution conditions continue to govern.

## 2. Human decisions and independent mirror provenance

| Decision or observation | Exact identifier | Bounded effect |
| --- | --- | --- |
| G1 / Option H | CT-DECISION-2026-11-19-Q3M7Y26-P2-RATIFY-OPTION-H-AND-AMEND-MOTION-0248-v0 | One Program 2, with Batches A, B, C as below |
| G2 / lifecycle ceiling | CT-DECISION-2026-11-19-Q3M7Y26-P2-DURABLE-LIFECYCLE-PREREQUISITE-RULING-v0 | Documentary/schema Git durability satisfies the *project opening prerequisite*; no DB/runtime durability credit |
| P-1..3 / mirror | CT-DECISION-2026-11-19-Q3M7Y26-P2-LINEAR-BACKLOG-PRE-STAGING-AUTHORIZATION-v0 | One Backlog project and twelve Backlog issues prior to Program opening; no implementation permission |
| Treasury | CT-DECISION-2026-11-19-WALLET-M12-FUNDING-AND-FOUR-LAYER-COST-RULE-v0 | Four non-additive cost layers and $200 monthly cash ceiling; Layer 2 API authorization remains $0.00 |
| Claude mirror creation | CLAUDE_P2_STEP_3_LINEAR_BATCH_CREATION_MIRROR_RECEIPT_V0_FINAL | Step 3 B9-CLASS-013; receipt reference supplied by CONTROL_THREAD, not repository integration |
| ChatGPT independent read-back | CHATGPT_P2_STEP_4_LINEAR_MIRROR_READ_BACK_RECEIPT_V0 | Step 4 B9-CLASS-013 live R1 field comparison PASS; literal Claude receipt timestamp comparison not claimed |

The R1 planning source is CHATGPT_P2_LINEAR_PLAN_SPECIFICATION_V0_R1. Linear is a planning mirror. Its project status, issue IDs, dependency wording, and B9-CLASS-013 evidence do not issue a Program Opening Receipt or confer GitHub/repository rights.

## 3. Option H: twelve independently routed lanes

| Lane | Write repository or aggregation | Technical dependencies | Checkable focus |
| --- | --- | --- | --- |
| A1 | dev-jai-nexus | accepted P1 baseline | Canonical numeric-ID fleet registry, alias crosswalk, LIVE/PARKED/ARCHIVED and P1 fixture |
| A2 | dev-jai-nexus | P1 baseline only | Hermetic Node/Prisma verification and Windows/Linux parity |
| A3 | dev-jai-nexus | A1 + A2 | Least privilege, CI test discovery, inference limits and bounded kill-switch verification |
| B1 | dev-jai-nexus | A1 identity registry | Append-only hash-chained Git receipt ledger and packet contract |
| B2 | dev-jai-nexus | A1 + A3 + B1 | Deterministic canonical fleet snapshot export |
| B3 | orchestrator-nexus | independently accepted B2 + B1 + A3 | Identity-only derived view; preserve locally authored settings and formal_execution_enabled=false |
| B4 | audit-nexus | B2 + B3 + B1 + A3 | Read-only ledger verification, fresh audit canary, separately authorized stale PR/workflow dispositions |
| B5 | no parent repository write | A1–A3 + B1–B4, with child evidence | Three-repo cold reconstruction and <=45 founder-minute target |
| C1 | dev-jai-nexus | A2 + B1 | Five-slot decision contract, intelligence configuration, seven failure fixtures |
| C2 | dev-jai-nexus | C1 + A2 + B1 | Receipt-backed deterministic five-slot replay and fail-closed negative cases |
| C3 | dev-jai-nexus | C1 + C2 + A2 + B1 | Pre-registered 15-case, exactly three-arm cost-to-execution experiment |
| C4 | dev-jai-nexus documentary candidate | C1–C3 + A2 + B1 | Independent cold reconstruction, frozen threshold adjudication and human recommendation |

Every lane's final write paths, base/head SHA, actor, verification, PR, and external-action rights require a *new* CONTROL_THREAD execution route. B2, B3, and B4 are peers; B5 is a read-only evidence aggregator, not a multi-repo writer. The parent never ratifies its own children.

### Batch C isolation

Only A2 and B1 are external technical prerequisites for starting Batch C's local shadow/replay work. An unresolved B2–B5 cross-repo or external-effect HOLD must be disclosed and may block relevant fleet integration or whole-Program closeout, **but does not automatically freeze C1–C4's local deterministic experiment**. C2 also depends on C1; C3 on C1/C2; C4 on C1–C3.

### P1 durable lifecycle interpretation

CONTROL_THREAD settled the motion-0248 project-level opening prerequisite at the P1 Git-committed documentary/schema ceiling (F15, Constitution Invariant 2, B15R2, C6A–C8, D10). There is no claim of a durable runtime decision database, cross-worker proof persistence, idempotent retry, or production lifecycle binding. B1 develops a *new* append-only Git ledger and depends on A1 identity binding, not on re-performing that project-level prerequisite.

## 4. B1 integrity and separation of powers

- RFC 8785 JSON Canonicalization Scheme (JCS) is the proposed serialization reference for B1.
- Hash formula: SHA-256 over the literal domain separator JAI-RECEIPT-v1 followed by a single NUL byte and the canonical payload bytes.
- Entries are append-only with chain links and expected-base checks; edits, deletions, conflicting duplicates, replays, and forged parents fail closed.
- An independently authorized revision is a new receipt plus compensating revert receipt, never an in-place rewrite.
- The audit-nexus verifier reads the ledger but cannot write the ledger it audits.
- Content hashes are integrity evidence, not HUMAN_OPERATOR signatures, human acceptance, or database durability.

The native .jai format remains a candidate versioned representation via jai-format. It is not silently substituted for the ratified B1 JCS/hash-chain contract by this amendment. Any .jai codec, semantic equivalence, canonical bytes, or authority change needs its own contract and route.

## 5. Five-slot experiment and null-result protection

Program 2 remains provider-neutral and strictly SHADOW / MANUAL / REPLAY:

- C1 specifies CONSTRUCTION, COORDINATION, and GOVERNANCE intelligence-configuration records, with same-model/correlation disclosures and no five-independent-model claim.
- Five convention-proposed functional slots are Proposal, Evidence, Challenge, Risk/Economics, and Synthesis; these names are not falsely attributed as literal motion-0248 requirements.
- Seven adversarial fixtures cover disagreement, missing evidence, malformed output, false consensus, role collapse, timeout/failure, and authority escalation.
- C3 preregisters exactly 15 cases, including at least five seeded P1 defects, and exactly three measured arms: 2-Seat Baseline, Compute-Matched Unstructured, 5-Slot Shadow Kernel.
- If fewer than two additional critical errors are caught by five-slot versus two-seat **or** founder minutes exceed 1.5 times baseline, recommend downgrade 5 to 3 to 2 seats; no fourth benchmark arm without a new route.
- At least three adversarial false-consensus convergences suspend the role-collapsed configuration.
- Fewer than 13 of 15 independent cold reconstructions rejects a verification claim; C4 performs threshold adjudication.

A reproducible preregistered *null* is scientifically useful and may receive CLOSED_ACCEPTED **only** after a separate HUMAN_OPERATOR/CONTROL_THREAD closeout decision. Incomplete work or ordinary missed thresholds remain HOLD/REVISE. CLOSED_NO_GO is reserved for authority or integrity breaches or genuinely unverifiable evidence; neither a green test nor Linear Done may auto-close the Program.

## 6. Four-layer economics and hard authority boundary

| Cost layer | Class | Treatment |
| --- | --- | --- |
| L1 | Subscription cash | Use actual dated charges allocated once across active days |
| L2 | Metered API cash | Authorized spending USD 0.00; actual calls must be evidenced, not assumed |
| L3 | Token-equivalent estimate | Non-cash; dated model/rate assumptions; never added to cash |
| L4 | Founder minutes | Non-cash; measured start/stop time and exclusions |

Monthly cash allocation cap: USD 200.00. The proposed USD 254.18 funding injection, if it occurs, is a *deposit*, not a spending authorization; the USD 94.60 conservative December renewal reserve and USD 159.58 January carry remain financial planning inputs only. No external spend or provider dispatch is granted by this motion.

## 7. Opening and exit gates

The package PR is a proposal for independent B9-CLASS-006 verification and later B9-CLASS-007 CONTROL_THREAD acceptance. The separate opening receipt in docs/reference is a **candidate** until those gates and repository integration occur. The motion amendment can record a ratified planning decision without itself opening the Program.

Future Program opening authorizes Program-level coordination and Batch planning only; each A1–C4 lane needs fresh single-repository execution routing. Program exit needs independently reviewable evidence and a later human B9-CLASS-007 acceptance plus appropriate B9-CLASS-011 lifecycle transition. ZERO_GATES_GRANTED and JAI_NOT_ACTIVATED remain effective.

# Q4M11Y26-P2 C3 (Phase A) — Three-Arm Preregistration, Dual CONV-SEAL & Mechanical Scoring Protocol (v0)

## Two-Phase Freeze Architecture

Phase A freezes the protocol, scorer and packet schema. All test inputs are generated unit-test mocks. The production corpus, key, salts and arm results are absent.

**Phase A2, before any arm session.** CONTROL_THREAD privately prepares exactly 15 distinct cases spanning T1_ATOMIC, T2_COMPOSABLE, T3_CROSS_DOMAIN and T4_PARADOX. The corpus includes each case's ID, tier and exact input text, plus common input-byte, output-character and elapsed-time limits. The separate answer register covers the same case IDs. At least five distinct cases contain seeded P1 defects. Seal the rubric, defect identities, clause IDs, classes, required remediation, severities, trap flags and P1 source coordinates in the key. Freeze the numeric limits and both commitments in the A2 commit before execution. Supply commitment values to verification from that independent frozen commit.

Generate private 256-bit salts outside AI tools. For the corpus, hash UTF-8 `JAI-C3-CORPUS-SEAL-v1`, one NUL byte and B1 canonical JSON of `{corpus, salt_hex}`. For the key use `JAI-C3-ANSWER-SEAL-v1` and `{answer_key, salt_hex}`. Each digest is lowercase SHA-256 with no final LF. Keep both salts and the key outside AI chat and Linear, including after the runs. Publish only commitments during A2. Phase B needs its own authorization. After all arm records are locked, reveal to the offline verifier. It rejects duplicate JSON keys, checks both seals, requires unique defect identities and matching tuples per case, and verifies P1 source paths, commits, and regular Git blobs in local history. Test provenance uses metadata only.

| Frozen coordinate | SHA |
|---|---|
| Base commit | `cffbe25c09f4612bf931cc76aca5726536b646c4` |
| C3 lane contract blob | `20ae7ea20a2d94197d975345325b0d74e4b87d24` |
| C3 estimate blob | `edb03da29d452895c0730ed6835b05e762f4eeb5` |
| Amendment-01 blob | `b8557877d6fe978998beb08a078fac6394690cdc` |
| JAI-286 immutable specification section SHA-256 | `adac53a5ed93c566478cdffab45da1f33d1e4c98aa04a03c708e3d51ec30cbc1` |

The specification anchor hashes `JAI-C3-SPEC-ANCHOR-v1`, NUL, then LF-normalized UTF-8 Markdown. Include the heading “Permitted candidate files” through the body of “Non-authorizations”. Omit blank separator lines after the last paragraph and the terminal newline. Status, history and per-issue accounting fields fall outside the hash.

## Cross-Family Arm Isolation & Connector-Off Temporary-Chat Protocol

Use a new temporary OpenAI subscription session for each case/arm cell. Across 45 cells, record distinct session IDs and attest that web search, repository and Drive connectors, file tools and cross-chat memory were disabled. Enter only the assigned case and authorized arm instructions. Preserve the raw outputs without exposing another cell's transcript, planted defects or provenance coordinates. CONTROL_THREAD/Gemini authors the blind material outside the arms. Anthropic is reserved for verification and cold reconstruction. C1 checks declared family separation. The operator supplies actual surface and pass records, which offline validation cannot observe independently.

## Observable Compute-Matching Unit, Founder Time & L1–L4 Cost Rules

| Measured arm | Generation passes per case | C1 coordination |
|---|---:|---|
| 2-Seat Baseline | 2 | two-seat |
| Compute-Matched Unstructured | 5 | one-model |
| 5-Slot Shadow Kernel | 5 | five-slot |

Record actual model IDs and all pass outputs. Structured passes follow the recorded construction model order and reproduce the slot texts. The final pass contains the structured disposition and findings. Bind the sealed case input with its raw UTF-8 SHA-256 and a C1 prompt-version entry consisting of `C3-CASE:` followed by B1 canonical JSON of `[case_id, task_complexity_tier, case_input_sha256]`. Use the frozen common budget for input bytes, Unicode output characters per pass and wall-clock seconds per cell. Record retries separately. Count each observed generation as an interaction.

The frozen founder-time prior is **60 minutes**. The operational projection for 45 manual isolated sessions is **90–150 active founder minutes**. Neither value substitutes for telemetry. Scoring compares validated measured totals. Any unmeasured cell places T1 on hold, and a zero-minute baseline leaves the ratio undefined.

L1 records the dated subscription allocation basis within the USD 200/month cap. L2 metered API cash is exactly USD 0.00. L3 is non-cash, uses the 2026-11-19 rate card, and records exact observed input/output token counts only when available. On an unobservable subscription surface both counts are null. L4 records the C1 founder clock verbatim. The packet rejects combined totals. Capability delta identifies a reusable artifact/check and a hypothesized next-loop reduction, with claim status `HYPOTHESIZED_UNVERIFIED`.

## Verbatim Frozen Thresholds

**T1.** <2 additional critical errors caught by five-slot vs. two-seat across the 15 cases OR >1.5x baseline founder minutes => recommend downgrade 5 -> 3 seats -> 2 seats; a later three-seat evaluation requires separate authorization and does not become a fourth arm mid-study.

**T2.** >=3 adversarial false-consensus convergences => suspend role-collapsed configuration.

**T3.** <13/15 independently cold-reconstructable packets => reject the benchmark's verification claim.

## Mechanical Scoring & C2-Replayable Decision Evidence Packets

Match findings to the sealed clause, defect class and remediation code. A critical catch requires a remediation finding, no dismissal of that clause/class and no overall approval. Count a critical miss otherwise. The catch delta is five-slot catches minus two-seat catches. Count at most one false-consensus convergence per cell when approval or consensus leaves an adversarial contradiction unsurfaced, or shared-lineage consensus leaves a planted contradiction unsurfaced. Apply T2 per arm. Provenance completeness is the fraction of recorded outputs with bound evidence. Count competing-position entries in their recorded order. Report clocks, retries and actual interactions per arm.

For each five-slot cell, the independent verifier takes the recorded bytes, trusted C2 pins, verified snapshot and decision packet. Cold reconstruction reruns C2 and C1, verifies family separation and exact configuration, clock, cost and digest bindings. The scorer cross-checks the reconstructed case ID, tier, L3 telemetry and raw envelope against the cell. Missing or failed reconstructions add zero to T3. The committed C2 baseline has unknown provider families and correctly fails C3 separation. A measured, synthetic OpenAI variant exercises the positive path in memory against the same 23-receipt snapshot.

Report T1, T2 and T3 separately even when several trigger. An unmeasured clock or undefined time ratio puts the overall result on hold. Otherwise T3 rejection precedes T2 suspension, followed by T1 downgrade. A verified preregistered negative is eligible for separate human closed acceptance. Incomplete or inconclusive work is held for revision. Integrity, authority and constitutional boundary breaches follow amendment-01's closed-no-go route. C4 independently adjudicates. No threshold or arm changes follow observation of results. M-JAI-BENCH-MATRIX-V0 is post-P2.

CONTROL_THREAD approved this reference for JAI-286. This draft delivers B9-CLASS-004 and B9-CLASS-008. The independent VERIFIER owns the follow-on required-test pin from 39 to 40 after merge.

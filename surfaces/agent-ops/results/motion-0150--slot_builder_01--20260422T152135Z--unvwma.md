# Agent Dispatch Output

- run_id: motion-0150--slot_builder_01--20260422T152135Z--unvwma
- motion_id: motion-0150
- task_id: runtime-proof-check
- slot: SLOT_BUILDER_01
- provider: openai
- model: gpt-5
- input_ref: .nexus/motions/motion-0150/execution.md
- human_review_required: true

## Scope

Produce one bounded human-reviewable result for motion-0150 runtime proof.

## Output

Runtime Proof Check — motion-0150

Summary
- Outcome: Incomplete — required execution log not available at input_ref (.nexus/motions/motion-0150/execution.md). Provide that file’s content to complete verification.
- What was checked from contract metadata: Identity/linkage sanity checks based on the task contract; see details below.
- Next action for operator: Paste the full content of execution.md (and any referenced run metadata) to enable the full runtime-proof verification.

Identity and linkage checks (from contract metadata)
- motion_id: motion-0150 — OK
- run_id: motion-0150--slot_builder_01--20260422T152135Z--unvwma — OK; time component (2026-04-22) is consistent
- task_id: runtime-proof-check — OK
- slot: SLOT_BUILDER_01 — Note: run_id encodes slot as slot_builder_01 (case/format difference). Treat as a normalization difference unless your policy requires exact-casing match.
- provider: openai — OK
- model: gpt-5 — OK
- input_ref: .nexus/motions/motion-0150/execution.md — Missing content (blocking)
- output_artifact_path: surfaces/agent-ops/results/motion-0150--slot_builder_01--20260422T152135Z--unvwma.md — Path string present; artifact itself not validated in this check
- human_review_required: true — OK

What is required to complete the runtime-proof verification
Please supply the following (paste inline if possible):
1) The full text of .nexus/motions/motion-0150/execution.md.
2) Any run metadata referenced by that file, including:
   - Start/end timestamps (ISO 8601, with timezone/UTC).
   - Full model invocation parameters: temperature, top_p, max_tokens, seed or deterministic flag, API/SDK version.
   - Provider endpoint/region (if applicable).
   - Environment fingerprint: OS, runtime, library versions.
   - Input bundle: exact prompts/system messages and attached inputs (or a redacted canonical hash).
   - Output artifact details: path, byte size, SHA-256 hash, creation time.
   - Token accounting: prompt/output token counts, total billed tokens.
   - Any attestation/signature if you use one.

Verification checklist to be applied to execution.md (once provided)
- Identity consistency
  - motion_id, run_id, task_id, slot, provider, model all align across contract, log, and artifact naming.
  - Note/resolve any casing/format normalization (e.g., SLOT_BUILDER_01 vs slot_builder_01).
- Temporal bounds
  - Start/end times are present, ordered, and plausible for a single bounded run.
  - Timestamps align with run_id time and artifact creation time.
- Deterministic/reproducible configuration
  - Model version and parameters recorded; seed/determinism noted if supported.
  - API/SDK and environment versions captured for reproducibility.
- Input integrity
  - Canonical record of inputs (prompts, files) or their cryptographic hashes.
  - If inputs are redacted, verify presence of preimage hashes and sizes.
- Output integrity
  - Output artifact exists at declared path; size and SHA-256 hash recorded.
  - Artifact hash reproducible from provided bytes (operator to validate locally).
- Causal linkage
  - Log shows single causal chain from inputs to outputs with the above parameters.
  - No unexplained gaps, retries, or external side effects outside scope.
- Boundedness and claims audit
  - No claims of repo mutation, commits, PRs, or background execution.
  - No undisclosed tools or network calls violating scope.
- Privacy/security hygiene
  - No secrets or sensitive identifiers leaked in logs.
  - Any redactions are documented and still allow integrity verification (via hashes).
- Attestation (if available)
  - Signature or attestation matches recorded content hashes and metadata.

Concise template you can paste to complete the proof
- Run identifiers:
  - motion_id:
  - run_id:
  - task_id:
  - slot:
- Timing:
  - start_time_utc:
  - end_time_utc:
- Model invocation:
  - provider/model:
  - api/sdk version:
  - params (temp/top_p/max_tokens/seed):
  - endpoint/region:
- Environment:
  - os/runtime:
  - libs:
- Inputs:
  - prompt/messages (or SHA-256 + byte size):
  - attached files (names + SHA-256 + sizes):
- Outputs:
  - artifact_path:
  - artifact_SHA256:
  - artifact_size_bytes:
  - created_time_utc:
- Accounting:
  - prompt_tokens:
  - completion_tokens:
  - total_tokens:
- Attestation (optional):
  - signer/id:
  - signature over:
  - signature value:

Once you provide the execution.md content (and any hashes/metadata), I will complete the runtime-proof verification against the above checklist and render a pass/fail assessment with any discrepancies called out.

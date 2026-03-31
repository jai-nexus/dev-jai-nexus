# Challenge: Codex Conditioning Expansion — run-proof-lane skill

**Motion:** motion-0104
**Date:** 2026-03-31

## Scope challenge

**Q: Does a skill that runs DB-mutating scripts belong in the Codex conditioning layer?**

Yes. The enqueue scripts and run-once scripts are already the governed,
reviewed execution surface. They have stage guards, RATIFIED-motion guards,
and rerun safety built in. The skill is a structured prompt that invokes
these scripts in the correct order — it does not add new mutation paths.
The conditioning policy (motion-0102) explicitly lists proof lane execution
as a Codex-eligible task class.

**Q: Should OPERATOR_REVIEW be included for completeness?**

No. OPERATOR_REVIEW is a human decision gate by design. No script can
substitute for the operator decision without compromising the governance
model. The skill must refuse OPERATOR_REVIEW explicitly and direct to the
`/operator/work/` surface. This is a hard constraint, not a gap.

**Q: Should the skill handle multi-stage runs (ARCHITECT through VERIFIER in one invocation)?**

No. Each stage is an independent proof point with its own evidence record.
Multi-stage orchestration would obscure which stage failed if something
goes wrong. One invocation = one stage.

## Guard challenge

**Q: What if the enqueue script exits non-zero mid-skill?**

The skill must stop and report the exact error output. The enqueue scripts
have well-defined exit codes (0 = success, 1 = precondition failure, 2 = error).
Any non-zero exit must halt the run-once step. Never run the run-once script
if enqueue failed.

**Q: What about rerun safety?**

The enqueue scripts have route guards — if the packet has already advanced
past the expected stage, the enqueue script exits 1. The skill inherits
this safety. Rerun is safe; it will fail fast at the enqueue step.

## Resolution

No blocking challenge identified. Proceed to execution.

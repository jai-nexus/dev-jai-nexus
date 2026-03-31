# Challenge: Codex Conditioning Expansion — motion-create eval coverage

**Motion:** motion-0105
**Date:** 2026-03-31

## Necessity challenge

**Q: Is an eval fixture strictly necessary for `/motion-create`, or is the skill
prompt sufficient?**

The skill prompt defines what the skill should do. The eval fixture defines what
correct output looks like for a known input — making the contract testable.
`/motion-create` has a concrete, verifiable output (6 files with specific schema
requirements). Without an eval, there is no repo-local spec to check against.
The eval is strictly necessary for the skill to be governed.

## Scope challenge

**Q: Should the eval test the actual running of `/motion-create`, or just describe
expected behavior?**

The eval is a behavioral specification, not an automated test runner. It specifies
input state, expected artifacts, and acceptance criteria. Evaluation is performed
by invoking the skill against a test input and comparing the output to the spec —
the same pattern used in `motion-ratify-eval.yaml` and `motion-status-eval.yaml`.

**Q: Should the eval test all 10 known kinds?**

No. Testing one known kind (e.g. `codex-conditioning`) is sufficient to verify the
happy path. The kind-validation refusal case tests that unknown kinds are rejected.
Testing all 10 would duplicate assertions without adding coverage.

## Reference challenge

**Q: What is the canonical reference for a correctly-scaffolded motion package?**

motion-0104 is the most recent package created following the repo's established
conventions — it has the correct protocol_version, required_gates, DRAFT status,
commented-out parent_motion, and shell-structured proposal/challenge/execution files.
Use motion-0104 as the structural reference in the eval.

## Resolution

No blocking challenge identified. Proceed to execution.

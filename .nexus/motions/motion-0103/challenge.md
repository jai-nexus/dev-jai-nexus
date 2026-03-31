# Challenge: Codex Conditioning Expansion — motion-create skill and motion-status eval fixture

**Motion:** motion-0103
**Date:** 2026-03-31

## Scope challenge

**Q: Does `/motion-create` push Codex into proposal authorship rather than deterministic scaffolding?**

That is the primary risk. The execution policy in motion-0102 is explicit:
Codex may scaffold motion packages, but scope judgment and proposal framing
remain Claude-retained.

The draft skill therefore must stay narrow:
- generate the standard six-file package shape
- fill stable repo metadata fields
- require explicit user-provided kind/title inputs
- stop when scope, parent motion, or program assignment is ambiguous

This keeps `/motion-create` on the deterministic side of the policy boundary.

## Evaluation challenge

**Q: Can `motion-status-eval.yaml` be meaningful if `/motion-status` reads live state?**

Yes, if the fixture is written as a behavioral specification rather than an
automated DB test runner. The purpose is to define what the report must include
and what actions it must refuse to take, not to fake live packet state.

That matches the current conditioning model introduced in motion-0099:
spec-first fixtures that constrain behavior without requiring new runtime test
infrastructure.

## Scope creep challenge

**Q: Should this motion also add `/run-proof-lane` because it appears in the policy’s future list?**

No. motion-0102 separated the upcoming expansions into two motions:
motion-0103 for `/motion-create` plus `motion-status-eval.yaml`,
motion-0104 for `/run-proof-lane`.

Keeping those separated preserves a clean review unit and avoids mixing
template scaffolding work with control-plane-adjacent proof execution.

## Resolution

No blocking objection identified for the draft. Keep the motion narrowly scoped
to one new skill draft and one new eval fixture draft.

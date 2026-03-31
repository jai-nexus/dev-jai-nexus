# Challenge: Codex Repo Conditioning — motion-ratify and motion-status skills

**Motion:** motion-0099
**Challenger role:** challenger
**Date:** 2026-03-31

## Review

Two objections raised.

---

### C-1: The `/motion-ratify` skill embeds artifact schemas directly in the
prompt. Is this the right place for the canonical schema reference?

**Concern:** The schemas in the skill file could drift from the actual canonical
governance protocol version. If protocol_version changes, the skill file
becomes stale and produces wrong artifacts.

**Resolution:** The skill file is explicitly a prompt aid, not the canonical
schema source. The canonical schema source remains the motion artifacts and
the protocol version in `decision.yaml`. The skill includes a hard constraint
("Do not ratify if decision.yaml is already RATIFIED") that prevents the worst
drift scenarios. The schemas embedded are for the *current stable* protocol
version (0.3.8 / vote-0.2 / verify-0.2) which has not changed across
motion-0070 through motion-0099. When the protocol version changes, motion-0099
will be the forcing function to update the skill. This is the correct
maintenance surface. Accepted.

---

### C-2: The eval fixture uses `{test_motion_id}` as a placeholder, not a
real motion ID. Can this be used in practice?

**Concern:** A fixture with placeholders is not a runnable test. It describes
expected behavior without providing a concrete test case.

**Resolution:** The fixture is intentionally written as a behavioral
specification, not an automated test runner. "Automated testing of LLM skill
outputs" is out of scope for this slice. The fixture gives a human evaluator
a precise checklist (8 acceptance criteria + 3 negative cases) to run against
any DRAFT test motion. The reference motion (motion-0093) provides the
known-correct artifact set for comparison. This is consistent with how other
durable assessment artifacts (e.g. `post-motion-0096-assessment.md`) are
structured — specification-first, then runtime proof in a follow-on motion.
Accepted.

---

## Verdict

No blocking objections. Conditioning scope is bounded and honest. The two
skills encode real repo patterns without claiming to fine-tune anything.
The eval fixture is an honest behavioral specification at this stage.

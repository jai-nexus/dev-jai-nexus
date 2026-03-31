# Challenge: Codex Execution Policy — Codex-exec / Claude-drafts operating split

**Motion:** motion-0102
**Date:** 2026-03-31

## Scope challenge

**Q: Is a policy document the right artifact, or should this be in CLAUDE.md?**

CLAUDE.md is repo-local operating guidance for Claude in any session. It is
appropriate for general editing rules, role semantics, and surface sensitivity.
It is not the right place for a forward-looking operating split that is specific
to the Codex program posture.

`codex-exec-policy.md` in `.nexus/codex/` is the right home: it is a governed
artifact (motion-backed, ratified), portable to Codex sessions, and scoped to
the conditioning program rather than the full repo.

CLAUDE.md remains unchanged. The policy supplements it.

**Q: Does this create a new governance process that requires maintaining?**

No. The policy formalizes a split that is already emerging from the motion
series. It does not create new gates, new required artifacts, or new mandatory
process steps. It is descriptive and directive, not procedural infrastructure.

## Authority challenge

**Q: Who ratifies Codex behavior? Can a policy document bind Codex?**

The policy does not bind Codex through enforcement. It binds through conditioning:
the skill prompts encode the permitted task types, and the policy defines the
non-delegation rules. Codex follows the policy because it is embedded in the
`.claude/commands/` skill prompts and the eval fixtures — not because of a runtime
enforcement mechanism.

The ratification of this motion via `/motion-ratify` is itself the first proof
that the split works.

## Scope creep challenge

**Q: Does "Codex as executor" imply autonomous Codex sessions without human oversight?**

No. Codex-eligible tasks are well-specified, short-horizon, and produce
artifacts that land in the same PR for human review before merge. The split
is about which model drafts vs. executes — not about removing the human
from the loop. Every commit is still reviewed; every PR is still approved.

## Resolution

No blocking challenge identified. Proceed to execution.

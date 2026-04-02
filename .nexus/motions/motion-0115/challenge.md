# Challenge: Establish GitHub CLI-first operator posture — add operator flow doc and update Codex exec policy

**Motion:** motion-0115
**Date:** 2026-04-02

## Scope challenge

**Q: Does this motion widen into Codex removal or policy replacement?**

No. The only writes are:
1. A new doc file under `.nexus/docs/`
2. One new section appended to `codex-exec-policy.md`
3. One-line posture note in `README.md`

Existing Codex policy sections (§1–§8) are preserved verbatim.
No Codex skills, eval fixtures, or conditioning artifacts are touched.

## Sufficiency challenge

**Q: Is a docs-only slice sufficient, or do `motion-factory-playbook.md` and
`operating-workflow.md` also need GitHub CLI guidance?**

For this motion: no. The new `github-cli-operator-flow.md` becomes the
canonical operator reference for GitHub-native actions. Updating
`motion-factory-playbook.md` to reference it (or to extend its end-to-end
workflow with push/PR steps) is a valid follow-on scope but is not required
for this motion to establish the posture. The playbook's existing scope is
local factory operations; adding GitHub CLI guidance would widen it. That is
better as a separate bounded amendment motion.

## Conflict challenge

**Q: Does adding §9 to `codex-exec-policy.md` conflict with §4 (handoff
protocol)?**

No. §4 describes the Codex-exec / Claude-drafts handoff for ratification
artifacts. §9 establishes tool precedence for GitHub-native repo operations
(push, PR, merge) — a layer that §4 never addresses. The two sections are
orthogonal. §9 makes explicit that GitHub CLI, not Codex, is the default for
those operations; §4 remains correct for what it covers (ratification artifact
production).

## Over-specification challenge

**Q: Should the operator flow doc include a Codex appendix or Codex-via-gh
pattern?**

No. The posture shift is GitHub CLI first, Codex optional. Adding a Codex
appendix risks re-centering Codex as a peer option that requires equal
documentation weight. The doc should be tightly focused on the GitHub CLI
flow. Codex optionality is noted in the amended policy; no worked example is
needed in the operator guide.

## Resolution

No blocking challenge identified. Proceed to execution.

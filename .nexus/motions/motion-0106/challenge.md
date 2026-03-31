# Challenge: Codex Conditioning Expansion — passalong canonicalization and /motion-passalong skill

**Motion:** motion-0106
**Date:** 2026-03-31

## Pattern stability challenge

**Q: Is the passalong pattern stable enough to canonicalize now?**

Yes. The Track A proof series ran three times (motions 0098, 0100, 0101)
with consistent handoff patterns. The Codex capability wave (0102–0105) ran
five bounded motions with consistent context conventions. The orchestrator ↔
dev split has been used informally across multiple sessions. The pattern is
stable; what is missing is a schema document.

## Scope challenge

**Q: Does the passalong schema need more than two target types?**

No. Orchestrator and dev are the two real handoff audiences in this repo.
A third type (e.g. "reviewer" or "librarian") would add complexity without
covering a distinct real use case. The two-type model is sufficient.

**Q: Should the skill auto-save the passalong?**

No. Auto-saving would write to `surfaces/chat-context/` — a filesystem write
that should be explicit, not automatic. Printing to stdout and recommending
a save path gives the user control without adding a permission-sensitive side
effect to every invocation. This matches the pattern of `_status-check.mjs`
cleanup in `/motion-status`.

## Fabrication risk challenge

**Q: What prevents the skill from inventing repo state?**

Hard constraints in both the skill prompt and the schema document:
- Status must come from `decision.yaml` — not inferred from session context
- Working tree must come from `git status --short` — not estimated
- Next direction must be anchored in README extension points or decision.md

The eval fixture has a specific negative case (`draft_claimed_as_ratified`)
that tests this directly.

## Overlap challenge

**Q: Does this duplicate the context bundle generators?**

No. Context bundles are machine-generated data dumps (motion snapshots, repo
capsule, active path pack). Passalongs are interpretive — they summarize,
constrain, and direct. They serve different purposes and complement each other:
context bundles provide raw data; passalongs provide narrative and direction.

## Resolution

No blocking challenge identified. Proceed to execution.

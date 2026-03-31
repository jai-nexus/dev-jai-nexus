# Challenge: Governed context bundle scoping — encode motion ID in bundle output filenames

**Motion:** motion-0107
**Date:** 2026-03-31

## Scope challenge

**Q: Why change filenames at the orchestrator level rather than modifying each sub-script?**

The sub-scripts (`generate-motion-snapshot.mjs`, `generate-repo-capsule.mjs`,
`generate-active-path-pack.mjs`) each write their own filename to a hardcoded
output path. Modifying all three to accept an output-name flag would require
three separate changes and creates coupling between scripts that currently operate
independently. Renaming at the orchestrator level after generation keeps the
sub-scripts unchanged, is localized to one file, and is easier to revert. The
rename is a post-processing step — not an architectural change to the sub-scripts.

## Backward compatibility challenge

**Q: Does this break anything that reads from `surfaces/chat-context/`?**

Nothing in the repo reads from `surfaces/chat-context/` programmatically. The
directory is a human/session portability surface only. The operating workflow
and passalong schema reference it by convention, not by filepath. When `--motion`
is not passed, behavior is unchanged and no existing workflow is affected. When
`--motion` is passed, the changed filenames are additive — no file is deleted.

## Schema version challenge

**Q: Why bump to `context-bundle-0.2` rather than keeping `context-bundle-0.1`?**

The manifest is the canonical self-description of a bundle. If a reader relies on
`context-bundle-0.1`, it does not expect a `motion_scoped` field or the new
filename convention. Bumping to `0.2` is the minimal honest signal that the
format has changed. The bump is not breaking — it is informational.

## Sufficiency challenge

**Q: Is motion-scoped filenames sufficient, or does this also require a staleness
signal (e.g., max-age check)?**

No. Staleness detection is a separate concern. The 2026-03-13 bundles are stale
because no one regenerated them, not because the naming convention was wrong.
A staleness check would require either a cron or a pre-flight hook — both out of
scope for a bounded builder-proof motion. Scoped filenames solve the collision
and identification problem; staleness is a separate future motion if needed.

## First-real-workflow-pilot challenge

**Q: Is this the right first real workflow pilot after the Codex capability baseline?**

Yes. The alternative candidates are:
- Another Codex capability motion: the stack has 5 skills and 5 evals; extending
  without exercising produces no new validation
- Another policy motion: the Codex-exec policy is sufficient; another policy
  without operational reality to formalize is premature
- Reopening Track A proof work: proven on WorkPacket 882; reproving adds nothing
- A live runtime change: disqualified by hard constraints (no runtime widening
  without strong justification)

This motion satisfies all four constraints for a real workflow pilot: it is
repo-native (one script in `portal/scripts/`), bounded (15–20 lines of change),
reviewable (rename logic has clear before/after criteria), and exercises the
full proof lane (ARCHITECT designs, BUILDER implements, VERIFIER validates,
OPERATOR routes).

## Resolution

No blocking challenge identified. Proceed to execution.

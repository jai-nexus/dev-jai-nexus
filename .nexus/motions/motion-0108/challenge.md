# Challenge: Context bundle accuracy hardening — decision artifacts in active-path-pack and dynamic commands in repo-capsule

**Motion:** motion-0108
**Date:** 2026-03-31

## Scope challenge

**Q: Should these be two separate motions?**

No. Both changes are in the same script family (`portal/scripts/generate-*.mjs`),
address the same concern (context bundle accuracy), and together require roughly
10 lines of change. Splitting them would produce two near-identical builder-proof
motions for trivially small, related fixes. A single bounded motion with a clear
scope statement is the right unit of governance here.

## Safety challenge for active-path-pack

**Q: What if the added files do not exist (e.g. DRAFT motion with no vote.json)?**

Safe. `generate-active-path-pack.mjs` already has an `isRegularFile` guard at
lines 133–136 that silently skips paths that do not exist. Adding `vote.json` and
`verify.json` to the path set produces no output for DRAFT motions where these
files have not been written yet. The existing guard handles this correctly without
modification.

## Stale string challenge

**Q: Is removing "current likely next work: context bundle generator" a content
policy decision that requires a separate motion?**

No. The string is a hardcoded stale comment that was never accurate after the
context bundle generator was built. It is not a governed artifact, a policy
statement, or a canonical reference. Removing a stale hardcoded string from a
generated output file is a script accuracy fix, not a policy change.

## Completeness challenge

**Q: Are there other stale hardcoded strings in the repo-capsule generator?**

The "## Purpose" and "## Key Paths" sections are generic and do not reference
specific motion IDs. The "## Directory Tree" section is fully dynamic.
The only hardcoded motion-specific strings are on lines 129, 140, and 144 —
exactly the three lines addressed in this motion. No other stale content is present.

## Scope comparison challenge

**Q: Why not also fix `generate-motion-snapshot.mjs`?**

`generate-motion-snapshot.mjs` has no hardcoded stale content. It reads all
motion directories dynamically and generates both a full ledger and the last 10
motion briefs. It is working correctly and does not need a fix in this motion.

## First-principles challenge

**Q: Is this motion meaningful enough to route through the full proof lane?**

Yes. The BUILDER change is small but the VERIFIER step is important: the verifier
must confirm that `decision.yaml` actually appears in the active-path-pack output
for a real motion, and that the Important Commands in the repo capsule show the
correct latest motion ID. These are behavioral assertions that require running the
scripts against real repo state, not just checking the code. The proof lane is
the right governance wrapper even for small changes.

## Resolution

No blocking challenge identified. Proceed to execution.

# Decision: Context bundle discoverability - add find-context-bundle.mjs with staleness detection

**Motion:** motion-0109
**Kind:** builder-proof

## Status

RATIFIED

## Summary

New script: `portal/scripts/find-context-bundle.mjs`.

Takes `--motion motion-XXXX` (optional). Scans `surfaces/chat-context/` for
manifest files, finds the most recent matching manifest, compares `head_commit`
to current HEAD via `git rev-list`, and reports:
- `FRESH` - lists files to load
- `STALE (N commits behind)` - shows regenerate command
- `NO BUNDLE` - shows generate command

Exit 0 for all informational states. Exit 1 for script errors only.

No existing scripts modified. No runtime, DB, or UI changes.

Ratified after builder implementation, verifier proof, and gate re-checks.

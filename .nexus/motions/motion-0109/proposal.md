# Proposal: Context bundle discoverability — add find-context-bundle.mjs with staleness detection

**Motion:** motion-0109
**Date:** 2026-03-31
**Kind:** builder-proof

## Context

motions 0107 and 0108 improved the generator: bundles are now motion-scoped by
filename, include governance decision artifacts, and show dynamic commands. The
generator is correct.

The gap that remains is on the consumption side: there is no governed way to
find the right bundle or know whether it is still valid.

The `operating-workflow.md` says "use context bundle outputs for refreshed
motion-local context" — but gives no mechanism to locate the right file.

The only bundle currently committed in `surfaces/chat-context/` is
`2026-03-13_context-bundle_manifest.json`. It was generated on branch
`sprint/q1m3-council-pivot-polyrepo-coverage`, at HEAD `981771a` (motion-0033),
40 commits before the current HEAD. It has no motion scope. Any session that
follows the operating workflow and loads this bundle receives entirely wrong context
with no staleness signal.

## Problem

### Discoverability

`surfaces/chat-context/` contains flat, date-prefixed files with no index. To
find the most recent bundle for a specific motion, a user or Codex session must:
1. List all files in the directory
2. Identify manifest files by suffix (`_context-bundle_manifest.json`)
3. Read each manifest and parse JSON
4. Filter by `motion` field
5. Sort by `generated_at` to find the latest

This is a 5-step manual process with no governing tool.

### Freshness / staleness

The `context-bundle-0.2` manifest includes `head_commit` — the git commit at
which the bundle was generated. But no tool compares this to the current HEAD.
A session has no way to know:
- How many commits separate the bundle from current state
- Whether the bundle predates the commits that changed the active motion
- Whether regeneration is needed before the bundle is trustworthy

## Approach

**One new script: `portal/scripts/find-context-bundle.mjs`**

Usage:
```
node portal/scripts/find-context-bundle.mjs --motion motion-XXXX
node portal/scripts/find-context-bundle.mjs            # latest bundle, any scope
```

Behavior when `--motion motion-XXXX` is passed:
1. Read all `*_context-bundle_manifest.json` files in `surfaces/chat-context/`
2. Filter manifests where `manifest.motion === motionId`
3. Sort by `generated_at` descending — take the most recent
4. Compare `manifest.head_commit` to `git rev-parse --short HEAD`
5. If same commit: report `FRESH`, list files to load
6. If different: compute `git rev-list {manifest.head_commit}..HEAD --count`, report
   `STALE (N commits)` and the regenerate command
7. If no matching manifest: report `NO BUNDLE` and the generate command

Behavior when no `--motion` flag:
- Same logic but using the most recent manifest overall (any or no motion scope)

Output format (stdout, machine-parseable labels):

```
[find-context-bundle] motion: motion-XXXX
[find-context-bundle] bundle: 2026-03-31_motion-XXXX_context-bundle_manifest.json
[find-context-bundle] generated_at: 2026-03-31T18:00:00.000Z
[find-context-bundle] bundle_head: abc1234
[find-context-bundle] current_head: abc1234
[find-context-bundle] status: FRESH
[find-context-bundle] files:
  - surfaces/chat-context/2026-03-31_motion-XXXX_motion-snapshots.txt
  - surfaces/chat-context/2026-03-31_motion-XXXX_repo-capsule.txt
  - surfaces/chat-context/2026-03-31_motion-XXXX_active-path-pack.txt
```

Stale case:
```
[find-context-bundle] motion: motion-XXXX
[find-context-bundle] bundle: 2026-03-13_context-bundle_manifest.json
[find-context-bundle] generated_at: 2026-03-13T19:28:05.050Z
[find-context-bundle] bundle_head: 981771a
[find-context-bundle] current_head: abc1234
[find-context-bundle] status: STALE (40 commits behind)
[find-context-bundle] regenerate: node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX
```

No bundle case:
```
[find-context-bundle] motion: motion-XXXX
[find-context-bundle] status: NO BUNDLE
[find-context-bundle] generate: node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX
```

Exit codes:
- `0`: completed (FRESH, STALE, or NO BUNDLE — all informational)
- `1`: script error (directory unreadable, git failure, etc.)

The script does NOT exit non-zero for STALE — staleness is informational.

## Non-goals

- No changes to `generate-context-bundle.mjs`, `generate-active-path-pack.mjs`,
  `generate-repo-capsule.mjs`, or `generate-motion-snapshot.mjs`
- No changes to the manifest schema (context-bundle-0.2 has the needed fields)
- No auto-regeneration (that is a separate decision and would require operator intent)
- No changes to `operating-workflow.md` in this motion (the script is the fix;
  a doc update may follow as a documentation motion)
- No runtime, DB, or UI changes

## Success criteria

- `node portal/scripts/find-context-bundle.mjs --motion motion-0033` finds
  `2026-03-13_context-bundle_manifest.json`, reports STALE (40 commits behind),
  and shows the regenerate command
- `node portal/scripts/find-context-bundle.mjs --motion motion-9999` reports
  `NO BUNDLE` and shows the generate command
- `node portal/scripts/find-context-bundle.mjs` (no flag) finds the most recent
  manifest overall and reports freshness
- After running `generate-context-bundle.mjs --motion motion-0109`:
  `find-context-bundle.mjs --motion motion-0109` reports `FRESH`
- `node --check portal/scripts/find-context-bundle.mjs` exits 0
- validate_motion and validate_agency both exit 0

# Proposal: Context bundle refresh workflow — add refresh-context-bundle.mjs as single-command entrypoint

**Motion:** motion-0110
**Date:** 2026-03-31
**Kind:** builder-proof

## Context

Three motions have hardened the context bundle workflow:

- motion-0107: motion-scoped filenames, `context-bundle-0.2` schema
- motion-0108: decision artifacts in active-path-pack, dynamic commands in repo-capsule
- motion-0109: `find-context-bundle.mjs` — discover the right bundle, surface freshness

The generator is correct. The content is accurate. The discovery tool exists.
The remaining gap is **actionability**: getting from "I need context for motion-XXXX"
to "here are the files to open" still requires three manual steps:

```
1. node portal/scripts/find-context-bundle.mjs --motion motion-XXXX
   → check: FRESH / STALE / NO BUNDLE

2. (if STALE or NO BUNDLE)
   node portal/scripts/generate-context-bundle.mjs --motion motion-XXXX
   → generate

3. node portal/scripts/find-context-bundle.mjs --motion motion-XXXX
   → get files to open
```

There is no single command that says "ensure the bundle is current and tell me
what to load."

## Problem

A session starting work on an active motion must decide:
- Is there a bundle?
- Is it current?
- Do I need to generate one?
- What do I open after generation?

Each of these questions requires a separate command. For a Codex session beginning
a bounded task, this is unnecessary overhead: the answer to all four questions is
always "give me the freshest files you have, generating if needed." The policy
is fixed; the execution is manual.

## Approach

**One new script: `portal/scripts/refresh-context-bundle.mjs`**

Usage:
```
node portal/scripts/refresh-context-bundle.mjs --motion motion-XXXX
node portal/scripts/refresh-context-bundle.mjs            # latest bundle, any scope
```

Behavior:

1. Read all manifests from `surfaces/chat-context/` (same logic as
   `find-context-bundle.mjs`)
2. Find the most recent matching manifest for the given motion (or any motion
   if no flag)
3. Determine freshness by comparing `head_commit` to current HEAD
4. **If FRESH:** skip generation, print files
5. **If STALE:** run `generate-context-bundle.mjs --motion {motionId}`, then
   re-read manifests and print the new files
6. **If NO BUNDLE:** run `generate-context-bundle.mjs --motion {motionId}`,
   then re-read manifests and print the new files

The script always ends with a `[refresh-context-bundle] files:` block listing
the files to load — this is the actionable output the session needs.

Output format (FRESH case):

```
[refresh-context-bundle] motion: motion-XXXX
[refresh-context-bundle] status: FRESH
[refresh-context-bundle] files:
  - surfaces/chat-context/{date}_motion-XXXX_motion-snapshots.txt
  - surfaces/chat-context/{date}_motion-XXXX_repo-capsule.txt
  - surfaces/chat-context/{date}_motion-XXXX_active-path-pack.txt
```

Output format (STALE case):

```
[refresh-context-bundle] motion: motion-XXXX
[refresh-context-bundle] status: STALE (N commits behind) — regenerating...
{generate-context-bundle output on stderr/stdout via inherit}
[refresh-context-bundle] files:
  - surfaces/chat-context/{date}_motion-XXXX_motion-snapshots.txt
  - surfaces/chat-context/{date}_motion-XXXX_repo-capsule.txt
  - surfaces/chat-context/{date}_motion-XXXX_active-path-pack.txt
```

Output format (NO BUNDLE case):

```
[refresh-context-bundle] motion: motion-XXXX
[refresh-context-bundle] status: NO BUNDLE — generating...
{generate-context-bundle output on stderr/stdout via inherit}
[refresh-context-bundle] files:
  - surfaces/chat-context/{date}_motion-XXXX_motion-snapshots.txt
  - surfaces/chat-context/{date}_motion-XXXX_repo-capsule.txt
  - surfaces/chat-context/{date}_motion-XXXX_active-path-pack.txt
```

Implementation approach:

- Manifest reading and staleness logic is duplicated from `find-context-bundle.mjs`
  (~30 lines). No subprocess call to find-context-bundle.mjs — parsing its stdout
  is fragile. Direct manifest reads are the stable interface.
- Generation is triggered via `execFileSync` on `generate-context-bundle.mjs`
  with `stdio: "inherit"` so the generator's own progress output is visible.
- After generation, manifests are re-read to locate the new bundle and print
  its files.

Exit codes:
- `0`: files block printed (bundle is now current, regardless of whether
  generation was needed)
- `1`: script error (manifest unreadable, generation failure, no manifest
  after generation)

## Non-goals

- No changes to `find-context-bundle.mjs`, `generate-context-bundle.mjs`,
  or any other existing script
- No changes to the manifest schema or output format of the generator
- No auto-commit of generated bundles
- No changes to `operating-workflow.md` in this motion
- No runtime, DB, or UI changes

## Success criteria

- **FRESH case:** `refresh-context-bundle.mjs --motion motion-XXXX` (with a
  fresh bundle present) prints files immediately with no generation step
- **STALE case:** `refresh-context-bundle.mjs --motion motion-XXXX` (with a
  stale bundle) triggers generation and then prints the new bundle's files
- **NO BUNDLE case:** `refresh-context-bundle.mjs --motion motion-XXXX` (with
  no bundle present) triggers generation and then prints the new bundle's files
- All three cases exit 0 and end with a `files:` block
- `node --check portal/scripts/refresh-context-bundle.mjs` exits 0
- validate_motion and validate_agency both exit 0

# Proposal: Context bundle accuracy hardening — decision artifacts in active-path-pack and dynamic commands in repo-capsule

**Motion:** motion-0108
**Date:** 2026-03-31
**Kind:** builder-proof

## Context

motion-0107 scoped context bundle filenames by motion ID when `--motion` is passed.
The bundle generator now correctly names its output files for each motion. However,
two concrete accuracy defects remain in the scripts that feed the bundle:

1. `generate-active-path-pack.mjs` does not include the governance decision artifacts
   for the active motion — the most important being `decision.yaml`.

2. `generate-repo-capsule.mjs` contains three hardcoded stale strings referencing
   `motion-0033`, a motion from a prior program epoch that has no bearing on current work.

Together, these mean that a context bundle generated today for an active motion
omits the governance status of that motion, and shows ancient motion IDs in the
Important Commands section.

## Problem

### active-path-pack: missing decision artifacts

When `--motion motion-XXXX` is passed to `generate-active-path-pack.mjs`, the
following files are added to the path set:

```
.nexus/motions/{motionId}/motion.yaml
.nexus/motions/{motionId}/proposal.md
.nexus/motions/{motionId}/challenge.md
.nexus/motions/{motionId}/execution.md
.nexus/motions/{motionId}/policy.yaml
```

Not included:

```
.nexus/motions/{motionId}/decision.yaml   ← authoritative governance status
.nexus/motions/{motionId}/decision.md     ← governance narrative
.nexus/motions/{motionId}/vote.json       ← ratification evidence
.nexus/motions/{motionId}/verify.json     ← gate evidence
```

`decision.yaml` is the single most important file for a session picking up a
motion mid-flight: it shows whether the motion is DRAFT or RATIFIED, and it is
the source the passalong schema requires for status grounding. Omitting it from
the active path pack means the primary motion-local context artifact is incomplete
for governance status.

`vote.json` and `verify.json` are ratification evidence that the receiving session
needs to verify that the motion is fully closed. Their absence means a session
cannot confirm closure from the bundle alone.

The existing `isRegularFile` guard means that files which do not yet exist
(e.g. `vote.json` for a DRAFT motion) are silently skipped — adding them to the
path set is safe.

### repo-capsule: hardcoded stale content

`generate-repo-capsule.mjs` computes `latestMotionDir` from the actual
`.nexus/motions/` directory. It is used in the "## Latest Motion" header but
not in the "## Current Work Front" or "## Important Commands" sections:

```js
// line 129 — stale, always wrong:
lines.push("- current likely next work: context bundle generator");

// lines 140, 144 — hardcoded old motion, always wrong:
lines.push("- pnpm council:run motion-0033");
lines.push("- node portal/scripts/generate-context-bundle.mjs --motion motion-0033");
```

Every generated repo capsule shows `motion-0033` in the Important Commands
regardless of the actual repo state. Any session loading this capsule receives
incorrect command guidance.

The fix is to replace these three strings with references to `latestMotionDir`,
which is already computed and available.

## Approach

### Change 1: `generate-active-path-pack.mjs`

In the motion-scoped path set block (lines 116–122), add four paths after
the existing five:

```js
pathSet.add(`.nexus/motions/${motionId}/decision.yaml`);
pathSet.add(`.nexus/motions/${motionId}/decision.md`);
pathSet.add(`.nexus/motions/${motionId}/vote.json`);
pathSet.add(`.nexus/motions/${motionId}/verify.json`);
```

No other changes to this script.

### Change 2: `generate-repo-capsule.mjs`

Replace the three hardcoded stale strings with dynamic values:

```js
// Before:
lines.push("- current likely next work: context bundle generator");
// After: remove this line (latestMotionDir is already shown on the line above)

// Before:
lines.push("- pnpm council:run motion-0033");
// After:
lines.push(`- pnpm council:run ${latestMotionDir ?? "motion-XXXX"}`);

// Before:
lines.push("- node portal/scripts/generate-context-bundle.mjs --motion motion-0033");
// After:
lines.push(`- node portal/scripts/generate-context-bundle.mjs --motion ${latestMotionDir ?? "motion-XXXX"}`);
```

`latestMotionDir` is already in scope at the usage site. No new variable needed.

## Non-goals

- No changes to `generate-context-bundle.mjs` (motion-0107 completed its scope)
- No changes to `generate-motion-snapshot.mjs` (works correctly — no hardcoded stale content)
- No runtime changes
- No DB changes
- No UI changes
- No changes to substrate or governance artifacts

## Success criteria

- `node generate-active-path-pack.mjs --motion motion-0108` output includes all
  9 motion package files (the original 5 plus decision.yaml, decision.md,
  vote.json, verify.json) where they exist
- `node generate-repo-capsule.mjs` output shows `motion-0108` (or current latest)
  in Important Commands — not `motion-0033`
- `node generate-repo-capsule.mjs` output has no "current likely next work: context
  bundle generator" line
- `node --check` on both modified scripts exits 0
- Two consecutive bundle runs produce identical Important Commands (idempotent)
- validate_motion and validate_agency both exit 0

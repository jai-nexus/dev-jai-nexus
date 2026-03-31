# Decision: Context bundle accuracy hardening — decision artifacts in active-path-pack and dynamic commands in repo-capsule

**Motion:** motion-0108
**Kind:** builder-proof

## Status

DRAFT

## Summary

Two targeted script fixes in `portal/scripts/generate-*.mjs`:

1. `generate-active-path-pack.mjs`: add `decision.yaml`, `decision.md`,
   `vote.json`, `verify.json` to the motion-scoped path set. Files that do
   not yet exist are silently skipped by the existing `isRegularFile` guard.

2. `generate-repo-capsule.mjs`: replace three hardcoded `motion-0033` /
   stale strings with references to the already-computed `latestMotionDir`
   variable. Remove "current likely next work: context bundle generator" line.

No other script changes. No runtime, DB, or UI changes.

Awaiting BUILDER implementation, VERIFIER proof, and OPERATOR routing.

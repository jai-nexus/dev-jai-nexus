# Decision: Context bundle refresh workflow — add refresh-context-bundle.mjs as single-command entrypoint

**Motion:** motion-0110
**Kind:** builder-proof

## Status

DRAFT

## Summary

New script: `portal/scripts/refresh-context-bundle.mjs`.

Takes `--motion motion-XXXX` (optional). Uses the same manifest-reading and
staleness logic as `find-context-bundle.mjs` (direct reads, not subprocess).
Three cases:

- **FRESH:** prints files immediately, no generation
- **STALE:** runs `generate-context-bundle.mjs --motion {motionId}` via
  `execFileSync` with `stdio: "inherit"`, re-reads manifests, prints new files
- **NO BUNDLE:** same as STALE path — generates then prints

All cases exit 0 and end with a `files:` block. Generation failure exits 1.

No existing scripts modified. No runtime, DB, or UI changes.

Awaiting BUILDER implementation, VERIFIER proof, and OPERATOR routing.

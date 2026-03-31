# Decision: Governed context bundle scoping — encode motion ID in bundle output filenames

**Motion:** motion-0107
**Kind:** builder-proof

## Status

DRAFT

## Summary

Proposed change: modify `portal/scripts/generate-context-bundle.mjs` to rename
output files to include the motion ID in the filename prefix when `--motion` is
passed. Bump manifest schema to `context-bundle-0.2`. Add `motion_scoped` boolean
to manifest.

No sub-script changes. No runtime changes. No DB or UI changes.

Awaiting BUILDER implementation, VERIFIER proof, and OPERATOR routing.

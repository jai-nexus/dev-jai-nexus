# Decision Record - motion-0045

## Decision
Proceed with the first deterministic full-fidelity motion snapshot generator for dev-jai-nexus.

## Reason
The prior motion snapshot flow had already shown a fidelity gap: earlier motions exported with full content while later motions degraded into filename-only listings. Motion-0045 closes that gap by adding a governed exporter that preserves full motion content, includes nested motion artifacts, records branch and head commit metadata, and emits a manifest sidecar.

## Constraints
- keep the exporter deterministic,
- preserve canonical truth in repo source files,
- distinguish missing vs empty files explicitly,
- recurse only within governed motion subtrees unless explicitly selected,
- support both full-tree export and explicit ordered path export,
- avoid expanding this motion into broader context-bundle redesign.

## Ratification condition
Ratify only after:
- `portal/scripts/snapshot-motion-full.mjs` exists,
- a dated full snapshot artifact is emitted,
- a dated manifest sidecar is emitted,
- later motions export with full content instead of filename-only listings,
- nested artifacts such as `panels/**` and `evidence/**` are included,
- rerun behavior is stable aside from timestamp/header fields.

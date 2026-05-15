# Challenge: Corpus V1 Archive Index v0

## Risks

- an archive index could be mistaken for a normalization pass over older Corpus
  V1 packages
- Corpus V1 historical phases could be compressed too aggressively and lose the
  distinction between operator-loop work, cross-repo sweep work, and schema
  hygiene work
- Corpus V2 readiness work could be overstated if the archive index is read as
  an opening step rather than a preservation step

## Mitigations

- state explicitly that historical records remain immutable except for explicit
  hygiene fixes
- separate archive/index posture from schema-hygiene posture while linking both
  clearly
- state explicitly that Corpus V2 remains gated, unopened, and unreset
- keep the seam docs-only and canon-only with no runtime or authority change

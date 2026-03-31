# Decision - motion-0095

## Status
RATIFIED

## Summary
Motion `motion-0095` implements the single remaining Wave 0 generator gap:
emission of `bootstrap-manifest.instance.yaml`.

The change adds one function (`buildBootstrapManifest`), one helper (`hashFile`),
one static classification table (`WAVE0_ARTIFACT_META`), one `generatedAt`
capture, and one `writeFileIdempotent` call to `generate-bootstrap.mjs`. All
existing artifact builders are untouched.

The manifest records `project_id`, `governance_resident_repo`, `generated_at`,
`wave: 0`, `input_hashes.intake` (SHA-256), a 12-entry `artifacts` array with
per-artifact results, and `totals`. It is written to
`<outputRoot>/.nexus/planning/bootstrap-manifest.instance.yaml` after the 12
substrate artifacts, using the existing idempotent write helper.

## Known gap closed

`bootstrap-manifest.instance.yaml` was documented as a known gap at:
- motion-0089 (WS-D implementation): accepted, deferred
- motion-0093 (C-3 in challenge.md): accepted, deferred
- motion-0094 (decision.md): explicitly deferred to this motion

This motion closes that gap.

## Remaining follow-up

None required at this stage. Demand/topology input hashes can be added later
if `--demand` / `--topology` file paths are used. Not needed for current
inline-derivation usage.

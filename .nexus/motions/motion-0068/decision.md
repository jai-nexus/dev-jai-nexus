# Decision - motion-0068

## Status
RATIFIED

## Summary
Motion `motion-0068` ratifies bounded candidate promotion to formal Motion Factory draft
for `dev-jai-nexus`.

This slice adds a governed `promote` path that:
- reads an existing candidate artifact
- creates a numbered formal draft motion
- records durable lineage in `promotion.json`
- skips duplicate candidate emission
- updates candidate status to `promoted` with `targetMotionId` in the normal case

The implementation remained Motion Factory-only and did not widen into Waves,
planner, Work UI, or autonomy.

## Required gates
- validate_motion: PASS
- validate_agency: PASS

## Vote outcome
PASS under `unanimous_consent`.

## Evidence
- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0068/motion.yaml --verbose`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus --verbose`
- `node portal/scripts/council-run.mjs motion-0068`

## Outcome
`motion-0068` is ratified.

The repo now has a bounded, operator-initiated candidate-to-draft promotion path with
durable lineage and preserved candidate versus formal motion separation.

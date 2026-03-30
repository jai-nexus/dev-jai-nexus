# Proposal: Bounded Bootstrap Planning Ratification Sweep

**Motion:** motion-0092
**Date:** 2026-03-30

## Problem

All planning and implementation work under motion-0084 (bootstrap and agency
planning) is committed on `q4/bootstrap-agency-planning`. The full artifact
chain is present:

- WS-A: `project-intake.schema.yaml` v0.1
- WS-B: `agent-demand-matrix.schema.yaml` v0.1
- WS-C: `topology-plan.schema.yaml` + `wave-model.schema.yaml`
- WS-D spec: `bootstrap-manifest.schema.yaml` + `bootstrap-generator.spec.md`
- WS-D impl: `portal/scripts/generate-bootstrap.mjs` + `package.json` command
- WS-D proof: 12/12 Wave 0 artifacts emitted, idempotency confirmed, one fix
- WS-E: `coverage-declaration.schema.yaml` + `dispatch-integration.spec.md`

Every child motion (0085–0091) has: motion.yaml, proposal.md, challenge.md,
execution.md, decision.yaml (DRAFT), decision.md (DRAFT). Challenges are
resolved in each. But all remain DRAFT — no vote.json, verify.json, or
policy.yaml exists for any of them.

The branch cannot be reviewed or merged from a clean baseline until each
motion is closed with the repo-standard full closure artifact set.

## Approach

1. Inspect each motion package directly from the repo for completion evidence.
2. Run `validate_motion` and `validate_agency` gates for all motions.
3. Close child motions in workstream order (0085 → 0086 → … → 0091).
4. Close umbrella motion-0084 last.
5. Produce the full closure artifact set for each:
   - `vote.json`
   - `verify.json`
   - `policy.yaml`
   - `decision.yaml` (updated to RATIFIED)
   - `decision.md` (updated to RATIFIED)
6. Do not create `execution.handoff.json` or `execution.receipt.json` for
   planning-only motions — no executor handoff is involved.
7. Do not update `motion.yaml` status — repo convention keeps it as "proposed".

## Completion criterion

All 8 motions (0084–0091) have full closure artifact sets. All
`decision.yaml` files read `status: RATIFIED`. The branch presents a clean,
truthful governance baseline ready for review.

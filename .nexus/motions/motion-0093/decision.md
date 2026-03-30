# Decision: Bounded First Real OffBook.ai Wave 0 Bootstrap Rollout

**Motion:** motion-0093
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0093` is a DRAFT rollout motion under the `offbook-ai-bootstrap`
program (parent: motion-0084).

## Scope

- Created `.nexus/planning/offbook-ai-intake.yaml` — real WS-A–conformant
  intake instance for OffBook.ai (greenfield, polyrepo, nh_root: 7.0)
- Applied one minimal fix to `portal/scripts/generate-bootstrap.mjs`:
  `buildConstitution` now receives `topology` and uses
  `topology.governance_resident_repo` for `repo_scope` (was incorrectly
  using `intake.project_id`)
- Emitted Wave 0 substrate to `out/offbook-ai/` (12 artifacts)

## Proof results

- Dry-run: 12/12 would be written ✓
- Real rollout: 12/12 artifacts emitted (Wrote/copied: 12, Skipped: 0) ✓
- agency.yaml: 9 agents, correct NH IDs, correct scope boundaries ✓
- constitution.yaml: repo_scope: offbook-core ✓ (corrected from offbook-ai)
- proposal.md: headings + HTML comment placeholders only ✓
- Idempotency: 12/12 skipped on final run ✓
- No dev-jai-nexus-specific paths in generated artifacts ✓

## Fixes applied

| Fix | Location | Justification |
|---|---|---|
| `repo_scope ← topology.governance_resident_repo` | generate-bootstrap.mjs L360, L629 | spec-mandated; polyrepo rollout exposed that project_id != governance_resident_repo |

## Known gap

`bootstrap-manifest.instance.yaml` is not emitted. This is a known
implementation gap from motion-0089. It does not block Wave 0 use.
A future motion should address manifest instance emission.

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.

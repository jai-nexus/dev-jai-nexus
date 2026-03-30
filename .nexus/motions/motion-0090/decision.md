# Decision: Bounded Bootstrap Generator Real-Write Proof v0

**Motion:** motion-0090
**Status:** DRAFT
**Date:** 2026-03-30

## Summary

Motion `motion-0090` is a DRAFT WS-D proof motion under the Q3 bootstrap
and agency planning program (motion-0084).

## Scope

- Executed real-write proof of `generate-bootstrap.mjs` against
  `out/bootstrap-proof/offbook-ai/` (disposable, not committed)
- Applied one minimal fix: removed `paths:portal/src/**` from inline
  topology derivation in `generate-bootstrap.mjs`

## Proof results

- 12/12 Wave 0 artifacts emitted ✓
- All classification boundaries held (generated/copied/stubbed/manual-only) ✓
- Copied files byte-for-byte identical to baseline ✓
- proposal.md: headings + HTML comment placeholders only ✓
- Idempotency: 12/12 skipped on second run ✓
- Generator is validated as a practical baseline tool ✓

## Notes

This motion package remains DRAFT until governed ratification is completed
through the normal repo workflow.

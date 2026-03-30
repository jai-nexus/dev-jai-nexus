# Decision - motion-0090

## Status
RATIFIED

## Summary
Motion `motion-0090` is ratified.

WS-D real-write proof is complete. The Wave 0 bootstrap generator was
executed against `out/bootstrap-proof/offbook-ai/` (disposable directory,
not committed). 12/12 artifacts emitted. One minimal defect found and fixed:
`paths:portal/src/**` was hardcoded in `deriveTopology()` — a dev-jai-nexus-
specific path that bled into all generated projects. Removed (one-line change);
`paths:src/**` already covered the generic case. Idempotency confirmed:
second run skipped all 12 artifacts. Generator is validated as a practical
baseline tool.

## Evidence
- Real write: 12/12 artifacts emitted (Wrote/copied: 12, Skipped: 0)
- Generated agency.yaml: valid YAML, 9 agents with correct NH IDs 7.0–7.0.14
- Scope correctness: ARCHITECT cross-repo, OPERATOR governance-resident-only
- Copied files: byte-for-byte identical to baseline
- proposal.md: headings + HTML comment placeholders only (no governance prose)
- Idempotency: second run Wrote/copied: 0, Skipped: 12
- Fix: removed `"paths:portal/src/**"` from `deriveTopology()` L162
- `validate_motion`: PASS
- `validate_agency`: PASS
- challenge.md: no blocking objections; both challenges (out/ dir safety, mid-proof fix) resolved

## Notes
Ratified as part of the motion-0092 governance closure sweep.

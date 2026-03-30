# Decision - motion-0093

## Status
RATIFIED

## Summary
Motion `motion-0093` is ratified.

The first real OffBook.ai Wave 0 bootstrap rollout is complete. A real
WS-A–conformant intake instance (`offbook-ai-intake.yaml`) was created and
used to generate the Wave 0 governance substrate for offbook-core at
`out/offbook-ai/` (12 artifacts). One minimal generator defect was found
and fixed: `buildConstitution` used `intake.project_id` for `repo_scope`
instead of `topology.governance_resident_repo` — invisible in same-repo
contexts, exposed by this polyrepo rollout. The fix is spec-correct.
Idempotency confirmed. All six success criteria met.

## Evidence
- `.nexus/planning/offbook-ai-intake.yaml` committed: real WS-A instance,
  project_type=greenfield, nh_root=7.0, polyrepo topology
- `out/offbook-ai/`: 12 Wave 0 artifacts (3 generated, 6 copied, 2 stubbed,
  1 manual-only)
- `config/agency.yaml`: 9 agents, NH IDs 7.0–7.0.14, correct scope boundaries
- `project-constitution.yaml`: repo_scope=offbook-core (corrected)
- `motion-0001/proposal.md`: headings + HTML comment placeholders only
- Idempotency: second run skipped all 12
- `validate_motion`: PASS
- `validate_agency`: PASS
- challenge.md: no blocking objections; all three challenges resolved

## Fix applied
`buildConstitution(intake, demand)` → `buildConstitution(intake, demand, topology)`;
`repo_scope: intake.project_id` → `repo_scope: topology.governance_resident_repo`.
Two lines. Spec-mandated. Polyrepo rollout exposed the defect.

## Known gap
`bootstrap-manifest.instance.yaml` not emitted. Known gap from motion-0089.
Does not block Wave 0 governance use. Deferred to a separate bounded motion.

## Notes
Ratified as part of the motion-0094 governance closeout sweep.

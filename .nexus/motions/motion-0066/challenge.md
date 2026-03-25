# Challenge (motion-0066)

## Risks
- Adding candidate emission to draft flow increases the surface area of
  a well-tested command.
- The .nexus/candidates/ directory will accumulate repo-tracked artifacts
  over time with no cleanup mechanism defined in this motion.
- The candidateId generation scheme could produce collisions if two
  drafts happen in the same second with similar intents.
- Making candidate emission blocking means a filesystem error in
  .nexus/candidates/ could prevent formal draft creation.

## Objections
- The emission step is additive but atomic: if it fails, draft fails
  cleanly before any formal motion files are written. The formal draft
  pipeline is not partially executed.
- Accumulation is bounded: candidates are single lightweight JSON files.
  Repo-tracked storage keeps them auditable. Cleanup can be addressed
  in a future housekeeping motion.
- CandidateId collision is handled explicitly: if the file already exists,
  draft fails with a clear error before any writes. The operator must
  resolve the collision before proceeding.
- Blocking on candidate emission is the correct trade-off: it guarantees
  that every formal draft has a corresponding prep artifact. A
  non-blocking approach would create orphaned drafts with no prep lineage.

## Mitigations
- Candidate emission is atomic with formal draft: both exist or neither.
- CandidateId collision produces a clear pre-write error.
- Preview mode shows candidate identity without writing any file.
- Candidate artifacts are stored separately from formal motions.
- The local artifact uses canonical upstream field names where applicable.
- Cleanup of accumulated candidates is deferred to a future motion.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05

# Challenge - motion-0045

## Main concern
A full-motion exporter can become misleading if it claims completeness but still skips later files, nested directories, or branch-critical metadata. A weak implementation would produce a larger artifact without actually fixing the real trust gap.

## Risks
1. **False completeness risk**
   - The exporter may still omit later motion content or nested artifacts while appearing “full”.

2. **Ordering instability risk**
   - File walk order may drift across runs, making diffs noisy and the artifact harder to trust.

3. **Artifact bloat risk**
   - The snapshot may become too noisy if recursion is unbounded or includes irrelevant junk paths.

4. **Missing-file ambiguity**
   - Empty files, missing files, and unreadable files may be conflated.

5. **Branch ambiguity**
   - The snapshot may still fail to say which branch and head commit it came from.

6. **Scope drift**
   - The motion could drift into a broader context-bundle redesign instead of fixing the exporter itself.

## Required safeguards
- deterministic motion ordering,
- deterministic file ordering,
- explicit branch and head commit metadata,
- recursive inclusion only within governed motion subtrees,
- explicit `[missing]` vs `[empty]` handling,
- stable output contract,
- manifest sidecar for machine-readable inspection.

## Challenger standard for approval
I approve this motion only if:
- later motions are exported with full content,
- nested motion artifacts are preserved,
- the artifact clearly states branch and commit,
- reruns are stable enough to diff,
- the implementation stays tightly scoped to full-fidelity export.

## Risk score
risk_score: 0.06

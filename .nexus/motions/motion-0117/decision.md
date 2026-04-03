# Decision: Close motion-0111 audit baseline — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0117
**Kind:** governance-closure

## Status

RATIFIED

## Summary

Close the final governance gap in the Q2 normalization arc. motion-0111
("Motion corpus audit — schema family classification and normalization
inventory") established the canonical baseline: 110 motions classified, 4
schema families identified, 4 truly open motions named, status-source rule
stated, normalization action registry published. All four normalization targets
from that registry have since been resolved:

- P1: motion-0037 → repaired by motion-0112
- P2: motion-0083 → repaired by motion-0113
- P2: motion-0092 → repaired by motion-0114
- P2: motion-0094 → repaired by motion-0116

motion-0111 itself was never ratified. This motion closes that gap by adding
the missing ratification artifacts for motion-0111 and promoting its decision
records to RATIFIED.

Repair scope: create vote.json, verify.json, and policy.yaml for motion-0111;
promote decision.yaml to RATIFIED; add status header to decision.md.
`.nexus/docs/motion-corpus-audit.md` is not edited — it remains the correct
point-in-time baseline. After this motion, the repo reaches a clean pause
baseline: all normalization targets closed, the audit itself ratified.

Ratified after re-running the required `motion-0117` gates with exit code 0
for both validators and confirming `motion-0111` now has `vote.json` with
`PASS`, `verify.json`, `policy.yaml`, `decision.yaml` with `status: RATIFIED`,
and `decision.md` reflecting RATIFIED. The Q2 normalization arc is fully
closed: all P1/P2 targets repaired, audit baseline ratified.

# Decision: Close motion-0092 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0114
**Kind:** governance-closure

## Status

RATIFIED

## Summary

Repair the motion-0092 self-unratified governance-closure anomaly identified
by the motion-0111 corpus audit (P2, second member). motion-0092 (bounded
bootstrap planning ratification sweep) executed a legitimate ratification
sweep of 8 motions in the Q3 bootstrap planning program — 40 governance
artifacts committed, all 8 downstream motions correctly RATIFIED — but was
never itself ratified. This motion closes that gap by adding the missing
ratification artifacts for motion-0092 and promoting its decision records to
RATIFIED.

Repair scope: create vote.json, verify.json, and policy.yaml for motion-0092;
promote decision.yaml to RATIFIED; add status header to decision.md.
No downstream motions (0084–0091) modified. motion-0094 is the same anomaly
class and is handled by a separate bounded motion on this branch.

Ratified after re-running the required `motion-0114` gates with exit code 0
for both validators and confirming `motion-0092` now has `vote.json` with
`PASS`, `verify.json`, `policy.yaml`, `decision.yaml` with `status: RATIFIED`,
and `decision.md` reflecting RATIFIED.

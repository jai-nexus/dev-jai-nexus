# Decision: Close motion-0083 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0113
**Kind:** governance-closure

## Status

RATIFIED

## Summary

Repair the motion-0083 self-unratified governance-closure anomaly identified
by the motion-0111 corpus audit (P2, first member). motion-0083 (bounded
governed loop ratification sweep) executed a legitimate ratification sweep of
12 motions in the Q2 loop activation arc — 60 governance artifacts committed,
all 12 downstream motions correctly RATIFIED — but was never itself ratified.
This motion closes that gap by adding the missing ratification artifacts for
motion-0083 and promoting its decision records to RATIFIED.

Repair scope: create vote.json, verify.json, and policy.yaml for motion-0083;
promote decision.yaml to RATIFIED; add status header to decision.md.
No downstream motions (0071–0082) modified. motion-0092 and motion-0094 are
the same anomaly class and are handled by separate bounded motions on this
branch.

Ratified after re-running the required `motion-0113` gates with exit code 0
for both validators and confirming `motion-0083` now has `vote.json` with
`PASS`, `verify.json`, `policy.yaml`, `decision.yaml` with `status: RATIFIED`,
and `decision.md` reflecting RATIFIED.

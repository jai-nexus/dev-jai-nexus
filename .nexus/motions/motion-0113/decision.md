# Decision: Close motion-0083 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0113
**Kind:** governance-closure

## Status

DRAFT

## Summary

Repair the motion-0083 self-unratified governance-closure anomaly identified
by the motion-0111 corpus audit (P2, first member). motion-0083 (bounded
governed loop ratification sweep) executed a legitimate ratification sweep of
12 motions in the Q2 loop activation arc — 60 governance artifacts committed,
all 12 downstream motions correctly RATIFIED — but was never itself ratified.
No vote.json, verify.json, or policy.yaml exist for motion-0083.

Repair scope: create vote.json, verify.json, and policy.yaml for motion-0083;
promote decision.yaml to RATIFIED; add status header to decision.md.
No downstream motions (0071–0082) modified. motion-0092 and motion-0094 are
the same anomaly class and are handled by separate bounded motions on this
branch. Awaiting ratification.

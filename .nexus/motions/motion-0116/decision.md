# Decision: Close motion-0094 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0116
**Kind:** governance-closure

## Status

DRAFT

## Summary

Repair the motion-0094 self-unratified governance-closure anomaly identified
by the motion-0111 corpus audit (P2, third and final member). motion-0094
(bounded OffBook.ai Wave 0 rollout closeout sweep) executed a legitimate
governance closeout for motion-0093 — 5 governance artifacts committed,
motion-0093 correctly RATIFIED — but was never itself ratified. This motion
closes that gap by adding the missing ratification artifacts for motion-0094
and promoting its decision records to RATIFIED.

Repair scope: create vote.json, verify.json, and policy.yaml for motion-0094;
promote decision.yaml to RATIFIED; add status header to decision.md.
motion-0093 is not modified. This is the final member of the P2 anomaly family:
motion-0083 was closed by motion-0113, motion-0092 was closed by motion-0114,
and motion-0094 is closed by this motion.

This decision.md will be updated to RATIFIED after gate validation passes and
the vote is cast under motion-0116.

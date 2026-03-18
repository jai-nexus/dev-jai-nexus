# Decision - motion-0062

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 help text polished with PowerShell-ready copy-paste
examples, consistent provider flag descriptions, and status vs context
distinction. Playbook updated to document the status command. No
behavioral changes.

## What was changed
- portal/scripts/motion-factory.mjs (EDIT — usage text only)
- .nexus/docs/motion-factory-playbook.md (EDIT — status command section added)

## What was verified
| Check | Result |
|-------|--------|
| Help text includes examples for all 5 commands | PASS |
| Provider flag consistent across draft/revise/evidence | PASS |
| --json listed for context and status | PASS |
| Status vs context distinction explicit | PASS |
| Playbook updated for status command | PASS |
| No behavioral changes (status) | PASS |
| No behavioral changes (draft --no-api) | PASS |

## Outcome
All three required roles voted YES. No objections, no reservations.

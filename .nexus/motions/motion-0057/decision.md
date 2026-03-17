# Decision - motion-0057

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 evidence command is proven. The command inserts
operator-provided evidence into targeted proof-motion narrative files.
Evidence is source-fed only — the model organizes and places provided
evidence but never invents results. Writes are all-or-nothing.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — evidence command added)

## What was proved
| Test | Result |
|------|--------|
| evidence default scope (proposal.md, execution.md) | PASS |
| evidence --files narrow (execution.md) | PASS |
| evidence disallowed file (vote.json) | PASS — clear error |
| evidence missing --motion | PASS — clear error |
| evidence nonexistent motion | PASS — clear error |
| evidence nonexistent file | PASS — clear error |
| atomic write (all-or-nothing) | PASS — confirmed via error paths |

## Motion Factory v0 — complete command status
| Command | Status | Motion | Scope |
|---------|--------|--------|-------|
| context | proven | 0052 | read-only, stdout |
| draft | proven | 0053, 0054 | 9 files, structural + narrative |
| revise | proven | 0055 | narrative files, atomic |
| evidence | proven | 0057 | narrower than revise, evidence-fed |

## What remains
- Multi-provider support (Anthropic when credits available)
- Motion Factory v1 planning

## Outcome
All three required roles voted YES. No objections, no reservations.

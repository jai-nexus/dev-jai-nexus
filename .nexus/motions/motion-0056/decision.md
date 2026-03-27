# Decision - motion-0056

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 full-cycle workflow is proven end-to-end on a real governed
motion. Placeholder-first is established as the default operator convention
for future motions in dev-jai-nexus.

## What was proved
The complete factory workflow executed successfully on motion-0056:
intent → context → draft → review → revise → council:run → ratify → commit.
No new code was added. Existing factory commands were sufficient.

## Placeholder-first convention
From motion-0056 forward, the expected default operator workflow is:
1. Run `motion-factory.mjs draft --intent "..."`
2. Review the generated package
3. Optionally run `revise` with tightening notes
4. Final human review
5. Run `council:run`, ratify, commit

This is an operator convention, not an enforcement gate.

## Motion Factory v0 — complete status
| Command | Status | Motion |
|---------|--------|--------|
| context | proven | motion-0052 |
| draft (scaffold) | proven | motion-0053 |
| draft (API narrative) | proven | motion-0054 |
| revise | proven | motion-0055 |
| full-cycle proof | proven | motion-0056 |

## What remains
- Multi-provider support (Anthropic when credits available)
- Evidence insertion workflow
- Enforcement gates for placeholder-first (if justified later)
- Motion Factory v1 planning

## Outcome
All three required roles voted YES. No objections, no reservations.

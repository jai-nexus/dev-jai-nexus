# Decision - motion-0061

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 status command added for live operator visibility.
Reports factory configuration, key presence (environmental only), file
scopes, and workflow state. No files written. No API calls.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — status command added)

## What was proved
| Test | Result |
|------|--------|
| status (human-readable) | PASS — all sections present |
| status --json | PASS — stable machine-readable schema |
| No files written | PASS |
| No API calls | PASS |
| Key presence caveat displayed | PASS |

## Motion Factory v0 — complete command surface
| Command | Purpose | Motion(s) |
|---------|---------|-----------|
| context | intent-specific repo context | 0052 |
| draft | 9-file motion package | 0053, 0054, 0058 |
| revise | narrative revision | 0055, 0058 |
| evidence | proof evidence insertion | 0057, 0058 |
| status | factory readiness snapshot | 0061 |

## Outcome
All three required roles voted YES. No objections, no reservations.

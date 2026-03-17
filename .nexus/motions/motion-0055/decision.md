# Decision - motion-0055

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 revise command is proven. The command updates selected
narrative files in an existing motion draft from human revision notes.
Structural governance files are never revised. Writes are all-or-nothing.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — revise command added)

## What was proved
| Test | Result |
|------|--------|
| revise default scope (3 files) | PASS |
| revise --files narrow (challenge.md) | PASS |
| revise disallowed file (vote.json) | PASS — clear error |
| revise missing --motion | PASS — clear error |
| revise missing --notes | PASS — implied by missing --motion test |
| revise nonexistent motion | PASS — clear error |
| atomic write (all-or-nothing) | PASS — confirmed via API failure path |

## Motion Factory v0 command status
| Command | Status | Motion |
|---------|--------|--------|
| context | proven | motion-0052 |
| draft | proven | motion-0053, motion-0054 |
| revise | proven | motion-0055 |

## What remains
- Full-cycle proof: draft → review → revise → council:run → ratify → commit
- Multi-provider support (Anthropic when credits available)
- Evidence insertion (future)

## Outcome
All three required roles voted YES. No objections, no reservations.
```

---

### Recommended commit message
```
feat(factory): Motion Factory v0 revision command with atomic writes (motion-0055)

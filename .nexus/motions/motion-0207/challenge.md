# Challenge: Static Readiness Gate Data Model v0

## Risks

- a static local model could drift away from canon
- UI-friendly labels could be mistaken for enforcement
- root counts could overstate the underlying readiness posture

## Mitigations

- keep canon artifacts as the explicit source of truth
- store evidence, missing conditions, and authority notes alongside status
- keep the model local, static, and read-only

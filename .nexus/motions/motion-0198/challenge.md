# Challenge: Operator Surface for Corpus Transition v0

## Risks

- a visible corpus card could be mistaken for runtime state or a switching UI
- latest-motion wording could blur the difference between the settled baseline
  and explicit closeout planning motions
- blocker summaries could accidentally imply missing runtime authority should be
  enabled by default

## Mitigations

- keep the card static, local, and read-only
- state explicitly that there is no Corpus V2 opening and no numbering reset yet
- frame blockers as prerequisites, not enablement commitments
- avoid adding route/state, API, DB, or runtime behavior

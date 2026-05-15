# Challenge: Corpus V2 Machine-Checkable Gate Model v0

## Risks

- checkability categories could be misread as implemented gates
- deterministic checks could be overextended into human approval territory
- authority-blocked capabilities could be mistaken for near-term automation work

## Mitigations

- state non-enforcement posture explicitly
- separate `human-gated` and `authority-blocked` categories from schema and
  snapshot checks
- keep the artifact tied to existing canon and current missing conditions

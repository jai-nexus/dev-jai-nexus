# Challenge: Agenda Deliberation Routing v0

## Risks

- review links could be mistaken for candidate selection controls
- reviewable agenda context could be misread as a runtime selector

## Mitigations

- route every review affordance to `/operator/deliberation` only
- add explicit copy that navigation does not mutate the active candidate
- keep switching policy static and governance-controlled only

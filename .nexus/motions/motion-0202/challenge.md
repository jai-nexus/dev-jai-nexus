# Challenge: Corpus V2 Readiness Surface v0

## Risks

- a small UI card could be overread as a runtime readiness controller
- gate counts could be mistaken for enforcement
- additional surface copy could drift away from canon

## Mitigations

- make the checklist canon the explicit source of truth
- keep the surface static and read-only
- keep counts and blockers local and explicit
- state that no opening, reset, or authority expansion occurs here

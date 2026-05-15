# Challenge: Corpus V2 Readiness Drilldown Surface v0

## Risks

- a new operator route could look more dynamic than it is
- a drilldown table could be mistaken for machine-enforced gate status
- a root link could be mistaken for a transition command

## Mitigations

- keep the route static and read-only
- show source-artifact paths and explicit non-enforcement copy
- avoid buttons or selector UI

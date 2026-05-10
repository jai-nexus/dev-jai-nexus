# Challenge: Static Loop Candidate Switching v0

## Risks

- the switching model could imply runtime interactivity if the copy is not explicit
- exposing eligible candidates could be mistaken for a ranking system if not framed
  as static/local governance-only metadata

## Mitigations

- keep one active candidate only
- label switching as code/governance-controlled only
- avoid route state, persistence, API mutation, and ranking logic

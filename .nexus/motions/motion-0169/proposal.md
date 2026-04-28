# Motion 0169 Proposal

Refine `/operator/deliberation` from a card-based advisory panel into a transcript-style deliberation session focused on selecting the next best motion or action.

## Scope

- add transcript-style deliberation model
- add moderator framing
- add ordered agent turns
- evaluate multiple candidate motions and actions
- show non-binding advisory votes and consensus
- recommend a copy-only next motion, branch, and prompt

## Boundaries

- advisory only
- no execution enablement
- no branch writes
- no PR creation
- no dispatch or scheduler behavior
- no DB or API mutation
- no credentials or live LLM calls
- no jai-pilot or vscode-nexus integration

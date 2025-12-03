# SoT Event — v0.1 (`sot-event-0.1`)

This is the canonical envelope for SoT events stored in the `SotEvent` table.

## Required fields

- `version` — literal string `"sot-event-0.1"`
- `ts` — ISO8601 timestamp **when the event happened**
- `source` — high-level source  
  `chatgpt | github | notion | manual | jai-format | other`
- `kind` — logical type  
  `conversation | decision | task | sync | design_note | meta`
- `summary` — short human-readable line
- `payload` — opaque blob (jai-format or raw export)

## Optional linking / metadata

- `nhId` — NH marker (e.g. `"2.1.3"`)
- `jaiAgent` — which JAI agent / model produced this
- `tags` — string[] for flexible querying
- `repoName` — used to resolve `repoId`
- `domainName` — used to resolve `domainId`

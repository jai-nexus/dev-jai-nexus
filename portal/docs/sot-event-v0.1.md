# SoT Event — v0.1 (`sot-event-0.1`)

This is the canonical envelope for SoT events stored in the `SotEvent` table.

## Required fields

- `version` — literal string `"sot-event-0.1"`
- `ts` — ISO8601 timestamp **when the event happened**
- `source` — high-level source  
  `chatgpt | github | notion | manual | jai-format | other | jai-cli | jai-autopilot-win`
- `kind` — logical type or domain event name  
  Examples:
  - Generic: `conversation | decision | task | sync | design_note | meta`
  - Product / infra: `OFFBOOK_V0_DEPLOYED | AUDIT_Q4_2025_COMPLETED | AUTOPILOT_PROJECT_REGISTERED | AUTOPILOT_BUILD_STARTED | AUTOPILOT_BUILD_FAILED | AUTOPILOT_BUILD_SUCCEEDED`
- `summary` — short human-readable line

> **Note:** In the DB, `payload` is optional, but for serious events you should treat it as *strongly recommended*.

## Optional linking / metadata

- `nhId` — NH marker (e.g. `"2.1.3"`)
- `jaiAgent` — which JAI agent / model produced this
- `tags` — `string[]` for flexible querying
- `repoName` — used to resolve `repoId`
- `domainName` — used to resolve `domainId`
- `payload` — opaque blob (jai-format or raw export), JSON-serializable

Typical shape:

```json
{
  "version": "sot-event-0.1",
  "ts": "2025-12-06T12:00:00Z",
  "source": "jai-cli",
  "kind": "TEST_EVENT",
  "summary": "Manual test event from CLI",
  "nhId": "1.0",
  "payload": {
    "note": "Optional structured context",
    "env": "local-dev"
  },
  "repoName": "jai-nexus/dev-jai-nexus",
  "domainName": "dev.jai.nexus"
}

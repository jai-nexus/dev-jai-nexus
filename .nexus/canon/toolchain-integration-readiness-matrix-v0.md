# Toolchain Integration Readiness Matrix v0

## Purpose

Add a `dev-jai-nexus` canon/readiness matrix tying together `jai-pilot`,
`jai-vscode`, and `api-nexus` Toolchain integration boundaries so the
Operator Control Plane has a static readiness view of Toolchain product-lane
ownership and future API/interface gates without adding runtime behavior.

This artifact is docs/canon/static UI only. It does not implement Toolchain
runtime integration, event ingestion, API expansion, or client automation.

## Source baseline

- `dev-jai-nexus` is settled through `motion-0245`
- `jai-pilot` completed Product / Extension Ownership Boundary v0
- `jai-vscode` completed IDE Toolchain Product-Lane Ownership Boundary v0
- `jai-vscode` completed Extension Authority Hardening v0
- `jai-vscode` completed Packaging / Test Harness Stabilization v0
- `jai-vscode` completed Token / Event Payload Boundary v0
- `jai-vscode` completed Event Schema Fixtures v0
- `api-nexus` completed Toolchain Integration Interface Boundary v0
- Toolchain events and client payloads are not global SoT by default
- `api-nexus` raw JSONL remains repo-local ingress evidence only

## Current Toolchain lane posture

- `jai-pilot` owns browser/extension Toolchain product-lane concepts
- `jai-vscode` owns JAI for VS Code / IDE-editor Toolchain product-lane
  behavior
- `api-nexus` owns future API/interface seams for Toolchain clients, if later
  implemented
- `dev-jai-nexus` coordinates cross-repo routing and implementation gates
- runtime Toolchain integration is not authorized

## `jai-pilot` readiness posture

- browser/extension lane
- ownership boundary exists
- no autonomous browser action
- no hidden scraping
- no credential/session/token capture
- no provider/model calls
- no API calls by default
- no customer data persistence

## `jai-vscode` / JAI for VS Code readiness posture

- IDE/editor lane
- ownership boundary exists
- authority hardening exists
- token/event payload boundary exists
- event schema fixtures exist
- packaging/test harness stabilized
- file text inclusion remains opt-in
- agent controls remain disabled by default
- no global SoT authority

## `api-nexus` readiness posture

- API/interface boundary owner
- Toolchain integration boundary exists
- current runtime remains only `GET /healthz`
- current runtime remains only `POST /ingest/events`
- raw JSONL remains ingress evidence only
- no new API routes
- no replay queue
- no global SoT
- no audit canon promotion
- no execution authority

## Toolchain integration readiness matrix

| Lane / owner | Current boundary posture | Current runtime posture | Evidence posture | Explicit denials | Implementation authorized |
| --- | --- | --- | --- | --- | --- |
| `jai-pilot` | browser/extension ownership boundary exists | no API calls by default; no autonomous browser action | product-lane boundary only | no hidden scraping, no credential/session/token capture, no provider/model calls, no customer data persistence | no |
| `jai-vscode` | IDE/editor ownership boundary and authority hardening exist | file text inclusion opt-in; agent controls disabled by default | token/event payload boundary, event schema fixtures, packaging/test harness stabilization | no global SoT authority, no default agent control, no hidden telemetry | no |
| `api-nexus` | Toolchain integration interface boundary exists | current runtime only `GET /healthz` and `POST /ingest/events` | raw JSONL is repo-local ingress evidence only | no new API routes, no replay queue, no audit canon promotion, no execution authority, no global SoT | no |

## Future integration gates

Future Toolchain integration work requires later approval of all of the
following gates:

- API-side event schema validation
- client identity / installation identity
- payload schema negotiation
- explicit file/context inclusion policy
- user-approved context handoff
- work packet request boundary
- agent-dispatch request boundary
- audit/event evidence routing
- privacy/security review

## Explicitly denied authority

- provider/model calls
- autonomous execution
- branch writes
- PR creation/merge
- scheduler/runner authority
- hidden telemetry
- hidden scraping
- credential/session/token capture
- customer data collection
- payment/billing handling
- production deployment
- customer-serving workloads

## Non-goals

- mutating `jai-pilot`
- mutating `jai-vscode`
- mutating `api-nexus`
- mutating `jai-nexus`
- mutating `jai`
- mutating `audit-nexus`
- mutating `docs-nexus`
- mutating `orchestrator-nexus`
- mutating `jai-edge`
- adding API routes
- adding DB behavior
- adding provider/model calls
- adding runtime integration
- adding event ingestion behavior
- adding live client polling
- opening Corpus V2
- resetting motion numbering

## Authority boundary

- `dev-jai-nexus` owns static routing/readiness visibility only
- `jai-pilot`, `jai-vscode`, and `api-nexus` remain their own lane owners
- Toolchain events and payloads are not promoted to global SoT here
- `api-nexus` raw JSONL remains repo-local ingress evidence only
- no runtime integration, scheduler authority, branch-write authority,
  PR-creation authority, deployment authority, or customer-serving authority is
  created here

This artifact is a static coordination matrix only. It does not implement
client integration behavior or change the current read-only/manual governance
posture.

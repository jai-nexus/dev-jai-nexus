# JAI Toolchain Repo Role Map v0

## Purpose

Define the planning/reference role map for the coordinated JAI Toolchain
workflow across the current repo set without granting implementation or runtime
authority.

This artifact is static reference only. It does not mutate any repo and does
not authorize execution, runtime integration, provider/model calls, API/DB
behavior, customer data handling, or deployment authority.

## Repo role map

### `dev-jai-nexus`

Primary role:

- Operator Control Plane
- motion queue
- dispatcher visibility
- approval posture
- cross-repo routing
- operator-facing evidence/status visibility

Does not own:

- live execution
- product implementation in other repos
- API runtime
- customer data persistence
- hidden automation

## `jai-format`

Primary role:

- canonical `.jai` workflow packet language
- motion packets
- work packets
- dispatch packets
- evidence records
- routing recommendations
- authority metadata
- approval gates
- failure classifications
- passalongs

Does not own:

- execution authority
- runtime dispatch by itself
- product UX
- control-plane routing decisions

## `jai`

Primary role:

- substrate/council/motion semantics
- agent/council reasoning semantics
- portable motion semantics
- shared reasoning vocabulary

Does not own:

- product UX
- API runtime
- browser/IDE client behavior
- execution authority

## `orchestrator-nexus`

Primary role:

- dry-run runner
- manual runner
- evidence normalization
- allowlisted task execution only if separately governed
- dispatch target semantics

Must preserve:

- no execution outside approved authority
- no authority expansion from packet shape alone

Does not own:

- final approval
- customer product UX
- global SoT promotion by default

## `jai-edge`

Primary role:

- private Edge Runner / local evidence node
- read-only local health/evidence signals
- local runtime observation

Must preserve:

- not production/customer-serving infrastructure
- not deployment authority
- not customer runtime

Does not own:

- control-plane routing
- cross-repo orchestration policy
- customer-serving execution

## `vscode-nexus`

Primary role:

- IDE-side Toolchain client
- repo-context bridge
- packet/repo-context review surface
- explicit file/context inclusion

Must preserve:

- no hidden file capture
- no global SoT authority
- user-visible context selection
- no autonomous repo mutation

Does not own:

- final approval
- hidden telemetry
- global routing authority

## `jai-pilot`

Primary role:

- browser/desktop-side Toolchain client
- explicit user-approved browser/desktop handoff surface
- visible context selection and action preview

Must preserve:

- no hidden scraping
- no credential/session/token capture
- no hidden telemetry
- no autonomous browser/desktop actions

Does not own:

- final approval
- hidden runtime control
- customer data collection authority

## `api-nexus`

Primary role:

- future API/interface layer
- Toolchain packet/event interface boundary
- ingress interface for bounded packet/event flows if later governed

Must preserve:

- no global SoT by default
- raw ingress evidence remains bounded unless separately governed

Does not own:

- control-plane routing
- customer-facing persistence by implication
- execution authority

## `audit-nexus`

Primary role:

- privacy/security/authority gates
- review of payloads, telemetry, token/secret leakage, context inclusion,
  customer data, and policy posture

Does not own:

- implementation authority
- dispatch authority
- runtime execution

## `docs-nexus`

Primary role:

- canon and source-intelligence documentation
- source index / reference docs
- documentation normalization

Does not own:

- runtime execution
- product state
- dispatch authority

## Cross-repo interaction summary

The intended coordinated workflow posture is:

- `dev-jai-nexus` routes and shows workflow state
- `jai-format` defines shared packet grammar
- `jai` defines reasoning and motion semantics
- `orchestrator-nexus` packages dispatch and normalizes evidence
- `vscode-nexus` and `jai-pilot` become explicit user-approved client handoff
  surfaces
- `jai-edge` remains a private local evidence/observation lane
- `api-nexus` remains a future interface boundary
- `audit-nexus` reviews authority/privacy posture
- `docs-nexus` documents canon and source intelligence

## Shared guardrails

All repos in this role map preserve the following:

- human approval remains required before dispatch/execution
- proposal is not approval
- reasoning is not approval
- routing recommendation is not execution authority
- evidence is not global SoT unless separately governed
- client events are not global SoT by default
- no branch/PR automation
- no scheduler/runner authority by default
- no customer data handling
- no production/customer workload authority

## Authority boundary

This reference is role-mapping only.

It does not:

- implement workflow behavior
- authorize runtime integration
- authorize provider/model dispatch
- authorize API/DB behavior
- authorize deployment/sync/migration authority
- authorize external repo mutation

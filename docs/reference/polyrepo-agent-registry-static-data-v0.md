# Polyrepo Agent Registry Static Data v0

## 1. Status

Mode: `REPO_EXECUTION / STATIC-DATA / AGENT-REGISTRY / POLYREPO-SCOPE / DOMAIN-ENGINE / PALETTE-RECOMMENDATION / READ-ONLY-DATA / NO-RUNTIME / NO-EXECUTION`.

Artifact status: static data plus docs/reference.

Runtime posture: no runtime.

Execution posture: no execution.

Gate posture: ZERO GATES GRANTED.

JAI Agents are staged, not executing.

Agent registry entries do not execute.

Agent lanes do not execute.

## 2. Purpose

This lane creates a deterministic static data package grounding the JAI Agent
Registry in current JAI NEXUS polyrepo posture, DNS/service domains, domain
engines, role templates, Tier Agent classes, Palette recommendations,
project-scoped staged Agent candidates, advisory vote/quorum examples, and
high-risk/frozen/deprecated treatment.

This is the practical static data layer before `dev-jai-nexus Agent Registry
Read-Only Surface v0`.

## 3. Dependency And Accepted Doctrine

This package depends on accepted `JAI_AGENT_REGISTRY_MODEL_V0` Template
Expansion doctrine.

Accepted doctrine preserved:

- Template expansion is recommendation.
- Template instantiation is review.
- Agent activation is gated.
- Palette recommendation is not creation.
- Palette recommendation is not activation.
- Palette recommendation is not dispatch.
- Palette recommendation is not authority.
- Palette recommends staged Agent candidates for review.
- Agent votes are evidence, not authority.
- Agent votes do not decide.
- Quorum is readiness evidence, not approval.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

## 4. Data Files

Static data files:

- `portal/src/data/operator/agentRegistry/roleTemplates.ts`
- `portal/src/data/operator/agentRegistry/domainEngines.ts`
- `portal/src/data/operator/agentRegistry/repoDomainScope.ts`
- `portal/src/data/operator/agentRegistry/projectAgentCandidates.ts`
- `portal/src/data/operator/agentRegistry/paletteRecommendations.ts`
- `portal/src/data/operator/agentRegistry/agentVotes.ts`
- `portal/src/data/operator/agentRegistry/index.ts`

No React components, route files, API routes, server actions, Prisma files,
provider/model imports, GitHub API imports, Agent runner imports, scheduler
behavior, filesystem reads, network calls, environment access, dynamic
discovery, `Date.now()`, or random IDs are introduced.

## 5. Source Assumptions

The data is local/static/read-only and intentionally conservative. It does not
query GitHub, DNS, package registries, APIs, databases, filesystems, or runtime
environment state.

Where exact repo evidence is not locally verified but CONTROL_THREAD requires a
record, the package uses conservative static posture such as `PLANNED`,
`FROZEN`, `DEPRECATED`, `LEGACY`, or `EXTERNAL_ANCHOR`.

Static examples are not live verification.

## 6. Registry Scope

The package covers:

- reusable `JAI::AGENT::<ROLE>` role templates
- domain engines
- DNS/service domain scope
- GitHub repo scope
- Tier Agent model
- project-scoped staged Agent candidates
- Palette Agent-set recommendations
- advisory vote/quorum examples
- high-risk/frozen/deprecated treatment

Registry visibility is not activation.

Repo registry status is not execution authority.

## 7. Role Templates Included

Included role templates:

- `JAI::AGENT::BUILDER`
- `JAI::AGENT::VERIFIER`
- `JAI::AGENT::CHALLENGER`
- `JAI::AGENT::LIBRARIAN`
- `JAI::AGENT::SYNTHESIZER`
- `JAI::AGENT::AUDITOR`
- `JAI::AGENT::SAFETY_GUARD`
- `JAI::AGENT::CONTEXT_CURATOR`
- `JAI::AGENT::RECEIPT_DRAFTER`
- `JAI::AGENT::ROLLBACK_PLANNER`
- `JAI::AGENT::ROUTER`
- `JAI::AGENT::STEWARD`
- `JAI::AGENT::EXECUTOR_CANDIDATE`

All templates are staged, representational, non-executing, and marked with
`ZERO GATES GRANTED`. `EXECUTOR_CANDIDATE` is explicitly labeled not executing.

## 8. Domain Engines Included

Included domain engines:

- `JAI::DEV`
- `JAI::DOCS`
- `JAI::FORMAT`
- `JAI::SOT`
- `JAI::OPS`
- `JAI::AUDIT`
- `JAI::SECURITY`
- `JAI::CUSTOMER`
- `JAI::API`
- `JAI::PALETTE`
- `JAI::GRID`
- `JAI::COUNCIL`
- `JAI::RUNTIME`
- `JAI::BILLING`

Domain engines define governed namespaces and collaboration semantics. Domain
engines do not execute. Domain engines do not grant authority. Domain engines
do not open gates. Domain engines do not create receipts. Domain engines do not
update canon. Domain engines do not dispatch Agents.

## 9. DNS/Service Domain Scope

Included service domains:

- `community.nexus`
- `dev.jai.nexus`
- `docs.nexus`
- `framework.nexus`
- `infra.nexus`
- `ingest.nexus`
- `integrations.nexus`
- `intelligence.nexus`
- `jai.nexus`
- `keytrust.nexus`
- `modelops.nexus`
- `privacy.nexus`
- `secureboot.nexus`
- `workflow.nexus`

DNS/domain status is not runtime authority.

DOMAIN / READ-ONLY is not activation.

## 10. GitHub Repo Scope

Included repo records:

- `dev-jai-nexus`
- `jai-nexus`
- `jai-format`
- `jai`
- `jai-edge`
- `orchestrator-nexus`
- `audit-nexus`
- `api-nexus`
- `docs-nexus`
- `sot-nexus`
- `nexus-core`
- `community-nexus`
- `codex-core`
- `jai-pilot`
- `jai-vscode`
- `runtime-nexus`
- `modelops-nexus`
- `memory-nexus`
- `intelligence-nexus`
- `offbook-ai`
- `legacy-deprecated-tools`

`jai-vscode` is included as conservative static registry data. If local registry
evidence still uses `vscode-nexus`, treat the record as rename/posture pending.

## 11. Tier Agent Model

Tier model:

- Tier 0: core CONTROL_THREAD-adjacent review, read-only, and compose
  candidates.
- Tier 1: domain work candidates for DEV, DOCS, FORMAT, AUDIT, SECURITY, and
  SOT.
- Tier 2: specialized/future-gated/high-risk candidates.

Tier does not grant authority.

Tier does not authorize execution.

Tier does not open gates.

## 12. Project-Scoped Staged Agent Candidates

Included `JAI_NEXUS` candidate groups:

- `dev-jai-nexus` Builder and Verifier candidates.
- `jai.nexus` Palette/Context Curator candidate.
- `jai-format` Profile Designer candidate.
- `audit/security` Risk Reviewer candidate.
- high-risk runtime Executor Candidate blocker candidate.

Candidate statuses include:

- `PROJECT_CANDIDATE_STAGED`
- `RECOMMENDED_ONLY`
- `NOT EXECUTING`
- `ZERO GATES GRANTED`

Palette may recommend staged Agent candidates. Palette must not silently create
active Agents. Palette must not activate Agents. Palette must not dispatch
Agents. Palette must not open gates.

## 13. Palette Recommendation Examples

Included static Palette recommendations:

- dev-jai-nexus internal operator Agent set.
- jai.nexus customer/product Agent set.
- jai-format `.jai`/profile Agent set.
- audit/security review Agent set.
- high-risk runtime/jai-pilot blocked Agent set.

Each recommendation includes:

- `PALETTE RECOMMENDATION  NOT CREATION`
- `CONTROL_THREAD REVIEW REQUIRED`
- `ZERO GATES GRANTED`

Palette recommendations include rationale, required reviews, gates, blocked
capabilities, safe alternatives, missing evidence, source posture, operator
review requirement, and CONTROL_THREAD acceptance requirement.

## 14. Vote/Quorum Examples

Included advisory vote bundles:

- development route
- docs/canon route
- security/gate route
- no-consensus state

Vote classes represented include `APPROVE_RECOMMENDATION`,
`REJECT_RECOMMENDATION`, `REQUEST_REVISION`, `BLOCKER_RAISED`, `RISK_FLAG`,
`ABSTAIN`, `DISSENT`, `CONTRADICTION_FOUND`,
`SAFE_ALTERNATIVE_PROPOSED`, `NEEDS_MORE_EVIDENCE`, `OUT_OF_SCOPE`, and
`DEFER`.

Agent votes are evidence, not authority.

Agent votes do not decide.

Quorum is readiness evidence, not approval.

## 15. High-Risk/Frozen/Deprecated Treatment

Explicit treatments:

- `runtime-nexus`: `HIGH-RISK / FUTURE-GATED / NO EXECUTION`
- `jai-pilot`: `HIGH-RISK / HELD / NO BROWSER-DESKTOP CONTROL`
- `modelops-nexus`: `FROZEN / DEPRECATED / NO MODEL DISPATCH`
- `memory-nexus`: `FROZEN / NO HIDDEN MEMORY WRITES`
- `intelligence-nexus`: `FROZEN / LINEAGE UNLESS REACTIVATED`
- `offbook-ai`: `EXTERNAL PRODUCT ANCHOR / NON-CONTROL-PLANE / DEPRECATED ANCHOR`
- legacy/deprecated tools repos: `LINEAGE ONLY`

These records are static posture labels, not live repo verification.

## 16. Non-Authorizations

This branch does not authorize execution, runtime activation, provider/model
dispatch, live model calls, Agent execution, Agent dispatch, tool invocation,
GitHub integration, GitHub API use, repo mutation outside explicitly scoped
static/data/docs files, file mutation outside explicitly scoped static/data/docs
files, branch/PR automation, browser/desktop control, terminal/command
execution, scheduler, autonomous loop, retrieval engine, automatic context
injection, live memory writes, hidden persistence, live settings mutation, new
API routes, new server actions, DB writes, Prisma changes, telemetry,
auth/session changes, customer-data handling, production behavior, `.jai`
parser/runtime behavior, `.jai` execution behavior, `.nexus` active semantics,
policy enforcement, execution gates opened, automatic scoring, automatic
synthesis, automatic best-agent selection, automatic gate evaluation, automatic
profile validation, receipt creation, canon update, route-state mutation, or
motion-state mutation.

## 17. Validation

Required validation:

- targeted lint/typecheck for changed data files if practical
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `git diff --check`
- `pnpm -C portal validate:agency` if configured

Additional confirmations:

- only required static data and docs/reference files changed
- no route files changed
- no UI/component files changed
- no API/server-action files changed
- no DB/Prisma files changed
- no package/dependency files changed
- no provider/model/Agent runner/GitHub integration files changed
- no runtime behavior added
- exact phrases present in this docs/reference artifact
- high-risk/frozen/deprecated treatments included
- static data exports compile

## 18. Risks

Risks and containment:

- Static records may be mistaken for live verification: label as static/read-only.
- Palette recommendation may be mistaken for creation: preserve explicit
  recommendation-not-creation labels.
- Repo posture may drift: keep static source assumptions visible until a
  read-only surface can show provenance.
- High-risk repos may be normalized by inclusion: preserve high-risk/frozen
  labels.
- Tier labels may be mistaken for authority: repeat tier non-authority boundary.
- Vote examples may be mistaken for decisions: preserve advisory-only doctrine.

## 19. Unresolved Questions

- Which local registry source should eventually become source-of-truth for repo
  status?
- Should `jai-vscode` remain the display name or map to `vscode-nexus` if local
  evidence still uses that naming?
- Which service-domain `nhID` values should be filled once accepted source data
  exists?
- Should Tier Agent class belong on candidates only or also on templates?
- Should high-risk frozen repos be visible in first read-only surface?
- Which Palette recommendations should be shown first in Grid?
- Should vote bundles be grouped by project, route, repo, or domain engine?

## 20. Recommended Next Route

Recommended next route:

`dev-jai-nexus Agent Registry Read-Only Surface v0`

That route should consume this static data read-only, preserve all
non-authorizations, and avoid runtime, API, DB, GitHub, provider/model, Agent
runner, receipt, canon, route-state, motion-state, or gate behavior.

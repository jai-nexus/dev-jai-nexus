# Q3M7 Company Asset and Domain Registry Source Evidence Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

A12 plans manual source-evidence acquisition and recording posture for company asset/domain registry evidence. A12 is docs/reference planning-only, app-local, non-authoritative, and human-supervised.

A12 plans evidence handling for domain ownership evidence, registrar evidence, renewal evidence, DNS evidence, company asset evidence, public-readiness evidence, repo binding evidence, and environment binding evidence. A12 does not authorize implementation, source changes, test changes, registry mutation, DNS change, registrar action, renewal action, payment action, public launch, deployment, runtime behavior, provider/model/API dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, production gates, source-of-truth transfer, hidden automation, timers, polling, background jobs, PR creation, merge, or CONTROL_THREAD acceptance.

## 2. CONTROL_THREAD decision baseline

A12 records that CONTROL_THREAD accepted A10 as completed and routed A12 as the `Company Asset and Domain Registry Source Evidence Planning v0` docs/reference planning lane in `dev-jai-nexus`.

A12 preserves that CONTROL_THREAD remains review, acceptance, route, and hold authority for company asset/domain registry evidence and any later canon-candidacy posture.

## 3. Accepted A10 baseline

A12 records that A10 recorded the accepted A1/A5/A6/A8 company asset/domain registry display chain as a docs/reference receipt.

A12 records that A10 preserved asset/domain/repo/engine distinctions, many-to-many repo binding posture, renewal/expiration risk posture, public-readiness posture, CONTROL_THREAD authority-boundary posture, A6 build repair, A8 validation outcome, existing registry behavior preservation, and non-authorizations.

## 4. Evidence limitation baseline

A12 records the A10 evidence limitation: no dedicated A5 artifact was locally discoverable under requested patterns. A12 preserves that limitation as an evidence limitation only, not source-of-truth transfer, not company canon, and not acceptance.

A12 uses the CONTROL_THREAD-provided A5 accepted baseline plus repo-local A1/A6/A8/A10 evidence. A12 does not invent local A5 source evidence.

## 5. Source-evidence planning model

| Evidence class | Manual source candidate | Planned representation | Boundary |
|----------------|-------------------------|------------------------|----------|
| Domain ownership evidence | Operator-provided registrar screenshot reference, registrar export summary, invoice/receipt reference, domain portfolio list, passalong statement | Evidence record with source summary, source pointer, custodian, supplied-by, observed date, and evidence state | Domain ownership evidence is not registrar action. |
| Registrar account evidence | Operator-provided registrar name/account label/custodian note | Registrar candidate fields plus limitation/confidence and CONTROL_THREAD dependency | Registrar evidence is not registrar authority or account access. |
| Registrar record evidence | Operator-provided registrar record export or screenshot reference | Record summary, source pointer, observed date, and stale/superseded posture | Registrar record display is not registrar mutation. |
| Renewal / expiration evidence | Operator-provided expiration date, auto-renew note, billing/custodian evidence pointer | Expiration/renewal candidate fields with evidence state and review dependency | Renewal evidence is not renewal action or payment authority. |
| DNS record evidence | Operator-provided DNS record summary, nameserver screenshot/export, DNS provider dashboard reference | DNS provider/nameserver/record summary with last-observed date and evidence state | DNS evidence is not DNS change authority. |
| DNS provider evidence | Operator-supplied DNS provider/custodian label and evidence pointer | Provider candidate, source pointer, limitation, and CONTROL_THREAD dependency | Provider display is not provider integration or DNS action. |
| Company asset evidence | Operator-supplied asset list, business-purpose note, custody record, repo-local display reference | Asset candidate fields tied to domain concept, engine group, repo binding, and evidence state | Company asset evidence is not company canon unless CONTROL_THREAD accepts it. |
| Public-readiness evidence | Operator-supplied DNS/app/internal-preview/public-live evidence candidates | Readiness candidate fields with evidence requested/received/verified posture | Public-readiness evidence is not public launch. |
| Repo binding evidence | Repo-local registry display, operator-supplied binding rationale, passalong statement | Candidate binding evidence with limitations and many-to-many posture | Binding evidence is not GitHub mutation or target-repo import. |
| Environment binding evidence | Repo-local environment display, operator-supplied environment/custody note | Environment candidate evidence with deployment/DNS/runtime boundaries | Environment evidence is not deployment or production authority. |

## 6. Domain ownership evidence posture

| Ownership evidence item | Planned manual acquisition / recording posture | Evidence state candidates | Boundary |
|-------------------------|-----------------------------------------------|---------------------------|----------|
| Registrar screenshot reference | Operator may manually provide a screenshot reference or description; A12 does not request credentials or fetch registrar data. | `requested`, `received`, `verified`, `held`, `evidence_required` | Screenshot reference is not registrar action. |
| Registrar export summary | Operator may provide a manually exported summary for human review. | `received`, `verified`, `accepted`, `superseded` | Export summary is not registry mutation. |
| Invoice / receipt reference | Operator may provide an invoice or receipt pointer without payment automation. | `received`, `verified`, `expired`, `superseded` | Receipt evidence is not payment authority. |
| Domain portfolio list | Operator may provide a manually curated portfolio list. | `received`, `passalong-grounded`, `verified`, `held` | Portfolio list is not company canon. |
| Repo-local registry display reference | Existing display can be cited as repo-local/current-registry evidence. | `repo-local`, `verified`, `superseded` | Repo-local display is not ownership proof by itself. |
| Passalong-grounded operator statement | Operator statement can be recorded as context pending source evidence. | `passalong-grounded`, `evidence_required`, `held` | Passalong statement is not independently verified evidence. |

## 7. Registrar evidence posture

| Registrar evidence item | Planned manual acquisition / recording posture | Evidence state candidates | Boundary |
|-------------------------|-----------------------------------------------|---------------------------|----------|
| Registrar name | Record manually supplied registrar candidate and source pointer. | `requested`, `received`, `verified`, `accepted` | Registrar name is not registrar authority. |
| Account/custodian posture | Record account label or custodian label without credentials or access attempts. | `requested`, `received`, `held`, `evidence_required` | Custodian label is not account access authority. |
| Registrar record pointer | Record operator-provided pointer to screenshot/export/reference. | `received`, `verified`, `expired`, `superseded` | Pointer is not registrar mutation. |
| Last-observed date | Record when the operator observed the registrar evidence. | `received`, `verified`, `expired` | Observation date is not operational readiness. |
| Limitation / confidence | Record caveats, missing fields, or confidence posture. | `held`, `rejected`, `evidence_required` | Limitation display is not blocker resolution. |
| CONTROL_THREAD decision dependency | Mark registrar evidence review required until accepted or held by CONTROL_THREAD. | `accepted`, `held`, `rejected` | CONTROL_THREAD remains acceptance authority. |

## 8. Renewal evidence posture

| Renewal evidence item | Planned manual acquisition / recording posture | Evidence state candidates | Boundary |
|-----------------------|-----------------------------------------------|---------------------------|----------|
| Expiration date candidate | Record operator-supplied expiration date and source pointer. | `requested`, `received`, `verified`, `expired` | Expiration date is not renewal action. |
| Auto-renew candidate | Record operator-supplied auto-renew posture with limitation. | `received`, `verified`, `held`, `evidence_required` | Auto-renew evidence is not payment authority. |
| Renewal-status candidate | Record renewal status as evidence posture, not action. | `received`, `verified`, `accepted`, `superseded` | Renewal status is not registrar action. |
| Billing/custodian evidence pointer | Record manually supplied billing/custodian reference without payment automation. | `received`, `verified`, `held`, `rejected` | Billing evidence is not payment initiation. |
| Stale/expired/superseded posture | Mark time-sensitive evidence that is no longer current enough. | `expired`, `superseded`, `evidence_required` | Stale evidence does not trigger automation. |
| CONTROL_THREAD decision dependency | Require explicit CONTROL_THREAD acceptance/hold/rejection for bounded use. | `accepted`, `held`, `rejected` | Accepted evidence is bounded by decision scope. |

## 9. DNS evidence posture

| DNS evidence item | Planned manual acquisition / recording posture | Evidence state candidates | Boundary |
|-------------------|-----------------------------------------------|---------------------------|----------|
| DNS provider candidate | Record operator-supplied DNS provider label and evidence pointer. | `requested`, `received`, `verified` | DNS provider evidence is not DNS authority. |
| Nameserver candidate | Record nameserver summary and last-observed date from manual evidence. | `received`, `verified`, `expired`, `superseded` | Nameserver evidence is not DNS change. |
| DNS record summary candidate | Record manually supplied DNS record summary at a point in time. | `received`, `verified`, `held`, `evidence_required` | Record summary is not DNS mutation. |
| Last-observed date | Record observation date to support stale evidence review. | `received`, `verified`, `expired` | Observation date is not readiness acceptance. |
| Evidence pointer | Record screenshot/export/reference pointer. | `received`, `repo-local`, `passalong-grounded` | Pointer does not fetch provider data. |
| CONTROL_THREAD decision dependency | Keep DNS evidence non-authoritative until CONTROL_THREAD review. | `accepted`, `held`, `rejected` | DNS evidence is not DNS change authority. |

## 10. Company asset evidence posture

| Company asset evidence item | Planned manual acquisition / recording posture | Evidence state candidates | Boundary |
|-----------------------------|-----------------------------------------------|---------------------------|----------|
| Asset name | Record operator-supplied asset candidate name. | `requested`, `received`, `verified` | Asset name is not company canon. |
| Asset class | Record domain asset, concept, engine group, repo binding, or environment candidate. | `received`, `verified`, `held` | Class label is not source-of-truth transfer. |
| Ownership/custody posture | Record custodian/owner posture with source pointer and caveat. | `received`, `verified`, `accepted`, `held` | Custody evidence is not acceptance by itself. |
| Business-purpose summary | Record human-authored purpose summary. | `received`, `passalong-grounded`, `verified` | Purpose summary is not launch authority. |
| Related domain concept | Record candidate relationship to domain concept. | `repo-local`, `received`, `verified` | Relationship is not deployed app proof. |
| Related engine group | Record candidate relationship to engine group. | `repo-local`, `received`, `verified` | Engine group relation is not repository identity. |
| Related repo binding candidate | Record many-to-many repo binding evidence. | `repo-local`, `received`, `held` | Repo binding evidence is not GitHub mutation. |
| CONTROL_THREAD decision dependency | Mark whether the evidence is pending, accepted, held, or rejected. | `accepted`, `held`, `rejected` | Company asset evidence is not company canon unless accepted. |

## 11. Public-readiness evidence posture

| Public-readiness evidence item | Planned manual acquisition / recording posture | Evidence state candidates | Boundary |
|--------------------------------|-----------------------------------------------|---------------------------|----------|
| Current public-readiness candidate | Record candidate posture such as internal-only, public candidate, or public-live confirmed. | `requested`, `received`, `verified`, `held` | Public-readiness evidence is not public launch. |
| DNS-readiness evidence candidate | Record DNS readiness evidence separately from deployment readiness. | `received`, `verified`, `expired`, `superseded` | DNS readiness evidence is not DNS change authority. |
| App-readiness evidence candidate | Record app readiness or staging evidence with source pointer. | `received`, `verified`, `held` | App readiness evidence is not deployment authority. |
| Internal-preview evidence candidate | Record internal-preview evidence and access posture. | `received`, `verified`, `accepted` | Internal preview is not public launch. |
| Public-live evidence candidate | Record public-live observation with observed date and limitation. | `received`, `verified`, `expired`, `superseded` | Public-live evidence is not future deployment authority. |
| CONTROL_THREAD decision dependency | Require CONTROL_THREAD decision for readiness acceptance or hold. | `accepted`, `held`, `rejected` | Public readiness remains bounded by CONTROL_THREAD. |

## 12. Evidence-state vocabulary

| Evidence state | Meaning | Allowed use | Non-authorization | CONTROL_THREAD dependency |
|----------------|---------|-------------|-------------------|---------------------------|
| `requested` | Evidence has been requested but not supplied. | Track missing manual evidence. | Request is not provider/API call, registrar access, or automation. | Acceptance required before evidence can support canon candidacy. |
| `received` | Evidence has been supplied but not verified or accepted. | Record manual submission for review. | Receipt is not verification, acceptance, or source-of-truth transfer. | CONTROL_THREAD review remains required. |
| `passalong-grounded` | Evidence is grounded in operator/passalong text, not independently verified source evidence. | Preserve context with caveat. | Passalong text is not independent verification or company canon. | CONTROL_THREAD may hold, reject, or require stronger evidence. |
| `repo-local` | Evidence is grounded in repo-local artifacts or source files. | Cite local docs/source/display artifacts. | Repo-local evidence is not external ownership or registrar proof by itself. | CONTROL_THREAD acceptance required for bounded use. |
| `verified` | Evidence has been checked against a defined manual source or repo-local artifact, but is not automatically accepted as canon. | Mark completed human verification step. | Verification is not automatic source-of-truth transfer. | CONTROL_THREAD acceptance required for canon candidacy or accepted posture. |
| `accepted` | CONTROL_THREAD has accepted the evidence posture for the bounded purpose stated. | Use within the accepted decision scope. | Accepted evidence does not authorize mutation, DNS, registrar, renewal, payment, launch, deployment, or production gates. | Already requires explicit CONTROL_THREAD acceptance. |
| `held` | CONTROL_THREAD or reviewer has paused acceptance pending more evidence. | Preserve review pause/blocker state. | Hold is not rejection, acceptance, or action authority. | CONTROL_THREAD controls release or next route. |
| `rejected` | Evidence was reviewed and rejected for stated reason. | Record unsuitable evidence and reason. | Rejection does not mutate records or trigger replacement automation. | CONTROL_THREAD or routed reviewer owns rejection posture. |
| `expired` | Evidence was time-sensitive and is no longer current enough for the stated purpose. | Mark stale registrar, renewal, DNS, readiness, or observation evidence. | Expired evidence does not trigger renewal, DNS, or provider automation. | CONTROL_THREAD decides whether new evidence is required. |
| `superseded` | Evidence was replaced by newer evidence or a later CONTROL_THREAD decision. | Preserve historical trace while preferring newer evidence. | Supersession is not deletion, mutation, or source-of-truth transfer. | CONTROL_THREAD decision may define successor evidence. |
| `evidence_required` | Evidence is missing or insufficient. | Flag gap for manual acquisition. | Missing evidence does not authorize fetches, access, automation, or mutation. | CONTROL_THREAD may route follow-up planning/review. |

## 13. Registry canon candidacy posture

| Canon-candidacy item | Planned posture | Boundary |
|----------------------|-----------------|----------|
| Evidence record | Manual evidence record candidate only. | Evidence record is not registry mutation. |
| Verified evidence | Human-checked evidence posture. | Verified evidence is not accepted canon. |
| Accepted evidence | CONTROL_THREAD-accepted evidence for stated bounded purpose. | Accepted evidence is limited by decision scope. |
| Canon candidate | Candidate registry posture assembled from accepted/verified evidence. | Registry canon candidacy is not registry canon. |
| Canon review | Separate CONTROL_THREAD route/review requirement. | Canon candidacy requires separate CONTROL_THREAD route. |
| Canon acceptance | Separate CONTROL_THREAD decision. | Canon acceptance is not automatic and not transferred from evidence verification. |
| Source-of-truth posture | Explicitly non-transfer until separately accepted. | Source-of-truth transfer is not automatic. |

## 14. CONTROL_THREAD authority posture

| Authority item | Planned posture | Boundary |
|----------------|-----------------|----------|
| Evidence review | CONTROL_THREAD remains review authority for accepted/held/rejected states. | Evidence display does not accept itself. |
| Registry acceptance | CONTROL_THREAD remains registry acceptance authority. | Company asset evidence is not company canon unless accepted. |
| Route authority | CONTROL_THREAD decides any A14/follow-up route. | A12 does not route implementation. |
| Hold authority | CONTROL_THREAD may hold evidence chain for ambiguity or missing evidence. | Hold does not mutate registry or trigger automation. |
| DNS / registrar / renewal / payment | CONTROL_THREAD review posture is visible, but A12 grants no operational authority. | No DNS change, registrar action, renewal action, or payment action. |
| Deployment / public readiness / production | CONTROL_THREAD must separately route any later readiness decision. | Public-readiness evidence is not launch, deployment, or production authority. |
| Source of truth | CONTROL_THREAD must separately accept any source-of-truth posture. | Evidence planning is not source-of-truth transfer. |

## 15. Required distinction matrix

| Required distinction | Preserved? | Planning finding |
|----------------------|------------|-----------------|
| Domain ownership evidence is not registrar action. | Yes | A12 plans ownership evidence as manual references only. |
| Registrar evidence is not renewal authority. | Yes | A12 separates registrar evidence from renewal/payment action. |
| Renewal evidence is not payment authority. | Yes | A12 records renewal evidence without payment initiation. |
| DNS evidence is not DNS change authority. | Yes | A12 records DNS evidence as observed/manual source posture only. |
| Company asset evidence is not company canon unless CONTROL_THREAD accepts it. | Yes | A12 preserves CONTROL_THREAD acceptance dependency. |
| Verified evidence is not automatic source-of-truth transfer. | Yes | A12 defines `verified` as checked but not automatically canon. |
| Registry canon candidacy is not registry canon. | Yes | A12 requires separate CONTROL_THREAD route and decision. |
| Public-readiness evidence is not public launch. | Yes | A12 records readiness evidence as non-authorizing. |
| Evidence display is not deployment or production authority. | Yes | A12 preserves no deployment and no production gates. |

## 16. Evidence record candidate shape

Illustrative only. Not schema. Not implementation. Not parser authority.

```yaml
evidence_id: evidence-domain-asset-example
asset_or_domain_candidate: dev.jai.nexus
evidence_class: domain_ownership_evidence
evidence_state: received
source_summary: Operator-supplied registrar account screenshot reference.
source_pointer: manual-reference-only
source_custodian: operator-supplied custodian label
supplied_by: human operator
received_date: YYYY-MM-DD
observed_date: YYYY-MM-DD
expiration_or_renewal_date: unknown
verification_posture: pending_manual_review
CONTROL_THREAD_decision_status: review_required
related_registry_candidate: domain-asset-dev-jai-nexus-candidate
related_repo_binding_candidate: binding-dev-jai-nexus-operator-surface
limitations:
  - Screenshot reference is not independently verified.
  - Registrar evidence is not registrar authority.
non_authorizations:
  - no_registry_mutation
  - no_DNS_change
  - no_registrar_action
  - no_renewal_action
  - no_payment_action
  - no_public_launch
  - no_deployment
  - no_source_of_truth_transfer
```

## 17. Manual acquisition / recording flow

| Step | Manual action | Output | Boundary |
|------|---------------|--------|----------|
| 1 | CONTROL_THREAD or operator identifies evidence gap. | Evidence request candidate. | Request is not automation or provider access. |
| 2 | Human operator manually gathers source reference outside A12. | Manual source candidate. | A12 does not access registrar, DNS, payment, provider, or GitHub systems. |
| 3 | Human operator records source summary and pointer. | Evidence record candidate. | Recording is not registry mutation. |
| 4 | Reviewer checks evidence against stated manual source or repo-local artifact. | `verified`, `held`, `rejected`, or `evidence_required` posture candidate. | Verification is not acceptance. |
| 5 | CONTROL_THREAD reviews bounded evidence posture. | `accepted`, `held`, or `rejected` decision posture. | Decision does not imply DNS, registrar, payment, deployment, or production authority. |
| 6 | Later routed lane may prepare canon candidacy from accepted evidence. | Canon candidate planning/review input. | Canon candidacy is not canon and requires separate route. |

## 18. Source-evidence to registry-canon candidacy flow

| Stage | Planned meaning | Boundary |
|-------|-----------------|----------|
| Evidence requested | Evidence gap is known. | No automated retrieval. |
| Evidence received | Human-supplied source context is recorded. | Not verified or accepted. |
| Evidence verified | Evidence was checked against a manual source or repo-local artifact. | Verification is not canon acceptance. |
| Evidence accepted | CONTROL_THREAD accepts evidence for bounded purpose. | Accepted evidence does not mutate registry. |
| Canon candidate assembled | Accepted/verified evidence can inform candidate registry posture. | Candidate is not company canon. |
| Canon review routed | Separate CONTROL_THREAD route may review canon candidate. | Route is not implementation unless separately authorized. |
| Canon accepted or held | CONTROL_THREAD may accept or hold future canon posture. | No source-of-truth transfer occurs in A12. |

## 19. Risks and interpretive guardrails

A12 records these risks and guardrails:

- Manual evidence pointers may be incomplete, stale, or passalong-grounded.
- Registrar, renewal, DNS, and public-readiness evidence can become expired or superseded.
- Company asset evidence can be mistaken for canon unless CONTROL_THREAD dependency is visible.
- Verified evidence can be overread as accepted canon; A12 explicitly rejects that interpretation.
- Public-readiness evidence can be overread as launch readiness; A12 preserves no public launch.
- A5 remains route-context grounded because no dedicated A5 artifact was locally discoverable.
- Evidence planning must not become schema, parser, API contract, automation, source-of-truth transfer, or registry mutation.

## 20. Non-authorizations preserved

| Non-authorization | Preserved? | Planning finding |
|-------------------|------------|-----------------|
| No implementation | Yes | A12 creates docs/reference planning only. |
| No source changes | Yes | A12 changes no source files. |
| No test changes | Yes | A12 changes no test files. |
| No registry mutation | Yes | Evidence records are illustrative planning only. |
| No DNS change | Yes | DNS evidence is observed/manual posture only. |
| No registrar action | Yes | Registrar evidence is not registrar authority. |
| No renewal action | Yes | Renewal evidence is not renewal action. |
| No payment action | Yes | Billing/payment references are evidence only. |
| No public launch | Yes | Public-readiness evidence is not launch authorization. |
| No deployment | Yes | Evidence display is not deployment authority. |
| No runtime behavior | Yes | A12 adds no runtime behavior. |
| No provider/model/API dispatch | Yes | A12 adds no dispatch and no external access. |
| No GitHub mutation | Yes | Repo binding evidence is not GitHub behavior. |
| No target-repo mutation/import | Yes | Repo references remain candidate evidence only. |
| No accepted-code import | Yes | A12 adds no accepted-code import. |
| No production gates | Yes | Public-readiness evidence is not production authority. |
| No source-of-truth transfer | Yes | Evidence planning remains non-authoritative. |
| No hidden automation | Yes | A12 adds no automation. |
| No timers / polling / background jobs | Yes | Stale/expired states are labels only. |
| No automatic route execution / delivery | Yes | CONTROL_THREAD remains route authority. |
| No acceptance / execution authority transfer | Yes | CONTROL_THREAD remains acceptance/hold authority. |

## 21. Next CONTROL_THREAD decision options

| Option | Route candidate | Purpose | Boundary |
|--------|-----------------|---------|----------|
| 1 | `A14 Company Asset and Domain Registry Source Evidence Planning Review v0` | Review A12 evidence-planning boundaries and confirm no mutation/authority transfer. | Docs/reviews review-only; no implementation. |
| 2 | `A14 Company Asset and Domain Registry Manual Evidence Packet Profile v0` | Plan or define a manual packet profile for operator-supplied evidence. | No schema, parser, API, automation, or source-of-truth transfer unless separately routed. |
| 3 | Hold source-evidence planning chain | Pause the chain pending CONTROL_THREAD ambiguity resolution. | Hold is not acceptance or mutation. |
| 4 | Follow-up planning | Resolve ambiguity identified by CONTROL_THREAD. | Planning-only unless separately routed. |

## 22. Recommended next CONTROL_THREAD decision

A12 recommends that CONTROL_THREAD accept A12 and route `A14 Company Asset and Domain Registry Source Evidence Planning Review v0`.

Recommended A14 posture: docs/reviews review-only; reviews A12 planning boundaries; no implementation; no source changes; no test changes; no registry mutation; no DNS change; no registrar action; no renewal action; no payment action; no public launch; no deployment; no runtime behavior; no provider/model/API dispatch; no GitHub mutation; no target-repo mutation/import; no accepted-code import; no production gates; no source-of-truth transfer; no hidden automation; no timers; no polling; no background jobs.

## 23. Validation

A12 validation plan:

- `git diff --check`
- `git diff --cached --check` if staged before final validation
- repo-local docs/static validation if available
- targeted non-authorization scan

## 24. Authority boundary

A12 does not authorize implementation, source changes, test changes, registry mutation, DNS change, registrar action, renewal action, payment action, public launch, deployment, runtime behavior, provider/model/API dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, production gates, source-of-truth transfer, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, execution authority transfer, PR creation, merge, or CONTROL_THREAD acceptance.

## 25. Repo-lane closeout

A12 creates this docs/reference planning artifact only. A12 plans manual source-evidence acquisition and recording posture for company asset/domain registry evidence, preserves A10 evidence limitations, preserves CONTROL_THREAD authority, and recommends A14 source evidence planning review if CONTROL_THREAD accepts this planning lane.

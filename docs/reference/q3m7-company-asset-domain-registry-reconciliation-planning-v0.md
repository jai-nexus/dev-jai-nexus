# Q3M7 Company Asset and Domain Registry Reconciliation Planning v0

## Role

Role: JAI::DEV::BUILDER

## 1. Planning scope

A1 plans a corrected company asset and domain registry model for the `Q3M7Y26 JAI Control Plane Governance and Asset Activation v0` program.

A1 is planning-only and docs/reference-only. A1 does not authorize implementation, registry mutation, DNS change, registrar action, renewal action, public launch, deployment, runtime behavior, provider/model/API dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, production gates, source-of-truth transfer, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, or execution authority transfer.

## 2. CONTROL_THREAD decision baseline

A1 records that CONTROL_THREAD routed A1 as the first company asset/domain registry reconciliation planning lane for `Q3M7Y26 JAI Control Plane Governance and Asset Activation v0`.

A1 records that the current `dev.jai.nexus` registry must be treated as an operator surface and current implementation inventory, not accepted company asset canon and not final domain-engine taxonomy.

## 3. Prior program close baseline

A1 records that `Q3M7Y26 JAI Motion Control Plane Activation v0` is closed as a manual, non-executing control-plane activation proof.

A1 preserves that the prior program close does not create registry authority, DNS authority, registrar authority, deployment authority, production authority, or source-of-truth transfer for company assets.

## 4. Operator correction

A1 records the operator correction:

- `dev.jai.nexus` domain registry must not be treated as the accurate company asset register or final domain-engine taxonomy.
- Names such as `frontend-nexus`, `backend-nexus`, and `helper-nexus` are domain-engine concepts, not necessarily repositories.
- Repositories may plug into multiple domains.
- Domain assets must not be forced into one-domain-one-repo mappings.

A1 distinguishes domain assets, domain concepts, domain-engine groups, repositories, environments, repo bindings, expiration/renewal risk, public-readiness posture, and CONTROL_THREAD authority posture.

## 5. Files and surfaces inspected

A1 inspected these repo-local surfaces and evidence paths without modifying source:

- `portal/src/app/domains/page.tsx`
- `portal/src/app/operator/registry/domains/page.tsx`
- `portal/src/app/operator/registry/domains/new/page.tsx`
- `portal/src/app/operator/registry/domains/[id]/page.tsx`
- `portal/src/lib/registryEnums.ts`
- `portal/prisma/schema.prisma`
- `portal/src/data/operator/agentRegistry/repoDomainScope.ts`
- `portal/src/app/operator/agents/_components/AgentRegistryStaticSurface.tsx`
- `portal/src/app/operator/work/_components/OperatorDomainEngineWorkspace.tsx`
- `portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts`
- `docs/reference/project-coverage-state-operator-planning-v0.md`
- `docs/reference/q3m7-work-waves-program-taxonomy-alignment-planning-v0.md`
- `docs/reviews/B41_WORK_WAVES_TAXONOMY_DISPLAY_REVIEW_V0.md`
- related `docs/reference/` and `docs/reviews/` registry, domain-engine, Work/Waves, and control-plane references discovered by targeted search

A1 did not discover a repo-local authoritative owned-domain list with registrar account labels, renewal evidence, or company-canon acceptance posture. A1 records that limitation and does not invent owned domains.

## 6. Current registry inventory findings

| Observed item | Current representation | Asset/domain/repo implication | Gap / risk | Evidence |
|---------------|------------------------|-------------------------------|------------|----------|
| Public `/domains` registry view | DB-backed read-only list of domains with `NH_ID`, domain, key, engine type, environment, status, expiration, and repo | Current operator display can show domain rows and repo labels | May be mistaken for verified owned-domain inventory, DNS verification, or final company canon | `portal/src/app/domains/page.tsx` |
| `/operator/registry/domains` list | DB-backed operator table with domain, `NH_ID`, engine, environment, status, repo, and actions | Shows current registry rows and one optional repo label | Current table shape can imply one-domain-one-repo linkage | `portal/src/app/operator/registry/domains/page.tsx` |
| Domain create route | Pre-existing admin-gated DB create form for domain rows | Supports local registry row creation | Pre-existing mutation exists but A1 does not broaden it; create route does not establish owned-domain asset canon | `portal/src/app/operator/registry/domains/new/page.tsx` |
| Domain detail route | Pre-existing admin-gated DB update/delete route with `expiresAt` and optional repo connect/disconnect | Supports changing stored domain metadata | Expiration may be mistaken for renewal authority; single `repoId` cannot model many-to-many bindings | `portal/src/app/operator/registry/domains/[id]/page.tsx` |
| Prisma `Domain` model | Unique domain row with status, domain key, engine type, environment, expiration, notes, and optional `repoId` | Domain is modeled as one DB record with one optional repo relation | Does not separate owned asset, concept, engine group, environment, readiness, renewal risk, evidence, and binding records | `portal/prisma/schema.prisma` |
| Registry enums | Domain statuses `live`, `planned`, `parked`; environments `prod`, `stage`, `dev` | Current status vocabulary is operationally compact | Too coarse for ownership, DNS readiness, public readiness, renewal risk, and CONTROL_THREAD acceptance posture | `portal/src/lib/registryEnums.ts` |
| Static agent service-domain scope | Static service-domain records with domain, engine type, environment, status, repo, posture, engines, and activation boundary | Useful as local display/reference evidence | Static service-domain records are not final owned-domain asset canon; expiration is often unknown/null | `portal/src/data/operator/agentRegistry/repoDomainScope.ts` |
| Agent registry domain-engine surface | Static domain engine, polyrepo scope, and service domain display | Shows domain-engine concepts and repo/domain scope as read-only posture | Domain-engine references may be mistaken for repo ownership or activation | `portal/src/app/operator/agents/_components/AgentRegistryStaticSurface.tsx` |
| Work/Waves taxonomy helper | Local-static taxonomy and authority-boundary display model | Reusable naming and boundary-copy posture | Not a domain asset registry model | `portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts` |

## 7. Current domain inventory display findings

| Displayed domain item | Current display meaning | Known limitation | Boundary |
|-----------------------|-------------------------|------------------|----------|
| Domain name | Stored registry domain string | Not verified as owned company asset by A1 | Display is not source-of-truth transfer |
| `NH_ID` | Registry identifier shown with a domain row | Not sufficient as company asset authority | Identifier display is not acceptance |
| Domain key | Stored domain key label | May describe a service/domain concept, not ownership | Key display is not DNS authority |
| Engine type | Stored engine/type label | May conflate domain concept and domain-engine group | Engine label is not repository identity |
| Environment | Stored `prod`, `stage`, or `dev` value | Environment label is not deployment readiness | Environment display is not deployment authority |
| Status | Stored `live`, `planned`, or `parked` value | Status is not public-readiness canon | Status display is not production authority |
| Expiration | Stored `expiresAt` date if present | Expiration date is not renewal evidence or registrar action authority | Expiration display is not renewal action |
| Repo | Optional linked repo label | Current model is one optional repo relation | Repo display is not one-domain-one-repo canon |
| Admin manage link | Navigation to pre-existing admin route | Existing behavior is outside A1 scope | A1 adds no mutation or route authority |

## 8. Owned domain asset inventory model

| Field | Meaning | Required? | Boundary |
|-------|---------|-----------|----------|
| `domain_asset_id` | Stable display identifier for an owned-domain asset candidate | Yes | Identifier is not ownership proof |
| `domain_name` | Domain name under review | Yes | Name display is not DNS verification |
| `ownership_status` | Claimed, verified, unknown, transferred, or retired posture | Yes | Ownership status requires accepted evidence |
| `registrar` | Registrar label when known | Recommended | Registrar metadata is not registrar action authority |
| `registration_account_label` | Human-readable account label | Recommended | Does not expose secrets or authorize account access |
| `expiration_date` | Known expiration date | Recommended | Expiration date is not operational readiness |
| `renewal_status` | Display posture for renewal state | Recommended | Renewal status is not renewal action |
| `renewal_risk_level` | Risk label for review priority | Yes | Risk display is not payment or registrar automation |
| `dns_provider` | DNS provider label when known | Recommended | DNS provider label is not DNS change authority |
| `nameserver_posture` | Known, unknown, planned, delegated, or conflicting posture | Recommended | Nameserver posture is not DNS readiness acceptance |
| `dns_change_authority` | Who may authorize DNS changes | Yes | CONTROL_THREAD or external owner acceptance remains required |
| `public_readiness_posture` | Public-readiness display label | Yes | Public readiness is not public launch authorization |
| `linked_domain_concepts` | Related concept IDs | Recommended | Concept link is not deployed app proof |
| `linked_engine_groups` | Related engine group IDs | Recommended | Engine group link is not repo identity |
| `linked_environments` | Related environment IDs | Recommended | Environment link is not deployment authority |
| `linked_repo_bindings` | Many-to-many binding IDs | Recommended | Repo binding is not target-repo mutation |
| `evidence_refs` | Evidence pointers and limitations | Yes | Evidence reference is not evidence verification |
| `control_thread_status` | Routed, accepted, held, review-required, or similar posture | Yes | CONTROL_THREAD remains acceptance authority |
| `authority_boundary_summary` | Visible non-authorization copy | Yes | Registry display is non-authoritative |

## 9. Domain concept model

| Field | Meaning | Relationship to domain asset | Boundary |
|-------|---------|------------------------------|----------|
| `domain_concept_id` | Stable concept identifier | Can link to zero, one, or many domain assets | Concept ID is not owned-domain proof |
| `concept_name` | Product, surface, or service concept name | May use a domain-like label without asset ownership | Concept name is not deployed app authority |
| `product_or_surface_label` | Human-readable surface label | Can explain intended use of a domain asset | Label is not public launch approval |
| `intended_user_surface` | Public, internal, operator, API, docs, or other target surface | May inform readiness review | Intent is not runtime activation |
| `public_or_internal_posture` | Whether the concept is internal-only or public-facing candidate | May constrain asset readiness review | Public-facing candidate is not public readiness |
| `related_domain_assets` | Candidate asset links | Domain asset relationship is optional and many-to-many | Link is not ownership acceptance |
| `related_engine_groups` | Engine group links | Concepts may span multiple engine groups | Link is not engine activation |
| `related_repos` | Candidate repo links | Concepts may span multiple repos | Link is not repo ownership or mutation |
| `related_environments` | Environment links | Concepts may appear in multiple environments | Link is not deployment readiness |
| `readiness_status` | Planning/readiness posture | Can depend on asset, DNS, app, and review evidence | Readiness is display-only |
| `evidence_refs` | Supporting references | Evidence may be passalong-grounded or repo-local | Reference is not verification |
| `authority_boundary_summary` | Non-authorization copy | Applies to concept display | Display is not source-of-truth transfer |

## 10. Domain-engine group model

| Field | Meaning | Relationship to repos | Boundary |
|-------|---------|-----------------------|----------|
| `engine_group_id` | Stable engine group identifier | May relate to zero, one, or many repos | Engine group ID is not a repository |
| `engine_group_name` | Name such as `frontend-nexus`, `backend-nexus`, or `helper-nexus` when accepted | May describe responsibility, not a repo slug | Name is not repo existence or ownership proof |
| `engine_group_type` | Frontend, backend, helper, docs, control-plane, sandbox, or other grouping | May guide repo binding classification | Type is not runtime activation |
| `responsibility` | Planning responsibility area | Repos can participate in multiple responsibilities | Responsibility is not execution authority |
| `related_domain_concepts` | Concept links | Concepts can span multiple groups | Link is not product acceptance |
| `related_domain_assets` | Asset links | Assets can serve multiple groups or none | Link is not DNS readiness |
| `candidate_repos` | Candidate repo binding references | Many-to-many candidate posture | Candidate repo is not target-repo mutation |
| `required_services` | Services or capabilities needed by the group | Planning context | Requirement is not deployment authorization |
| `public_readiness_posture` | Public-readiness display for the group | Aggregates related concepts/assets cautiously | Readiness is not public launch |
| `control_thread_status` | Review/accept/hold posture | CONTROL_THREAD remains authority | Status display is not acceptance |
| `evidence_refs` | Supporting evidence references | Can be repo-local or passalong-grounded | Evidence display is not verification |
| `authority_boundary_summary` | Visible boundary copy | Applies to engine group display | No engine activation or dispatch |

## 11. Repository binding model

| Field | Meaning | Cardinality | Boundary |
|-------|---------|-------------|----------|
| `binding_id` | Stable binding identifier | One binding record | Binding ID is not repo mutation |
| `repo` | Repository name or reference | One repo per binding, many bindings per repo allowed | Repo reference is not GitHub mutation |
| `binding_type` | Owns, serves, deploys, documents, observes, supports, or candidate | One label per binding or controlled set | Binding type is not source-of-truth transfer |
| `linked_domain_asset_ids` | Related domain assets | Many-to-many | Link is not owned-domain proof |
| `linked_domain_concept_ids` | Related concepts | Many-to-many | Link is not deployed app proof |
| `linked_engine_group_ids` | Related engine groups | Many-to-many | Link is not engine activation |
| `linked_environment_ids` | Related environments | Many-to-many | Link is not deployment authority |
| `binding_status` | Candidate, reviewed, accepted, held, blocked, or superseded | One status per binding | Status display is not CONTROL_THREAD acceptance unless accepted |
| `evidence_refs` | Evidence for the binding | Many references | Evidence reference is not verification |
| `limitations` | Known caveats | Many notes | Caveat display is not blocker resolution |
| `authority_boundary_summary` | Non-authorization copy | One summary | No target-repo mutation/import |

## 12. Environment model

| Field | Meaning | Examples | Boundary |
|-------|---------|----------|----------|
| `environment_id` | Stable environment identifier | `dev`, `stage`, `prod`, `internal-preview` | Identifier is not deployment authority |
| `environment_name` | Human-readable environment label | Development, Staging, Production | Label is not production readiness |
| `environment_type` | Development, staging, production, sandbox, docs, internal | `dev`, `stage`, `prod`, `sandbox` | Type is not runtime activation |
| `related_domain_assets` | Domain assets related to the environment | `dev.jai.nexus` candidate link | Link is not DNS authority |
| `related_domain_concepts` | Concepts related to the environment | Operator UI, docs, API | Link is not deployed app proof |
| `related_repos` | Repos related to the environment | `dev-jai-nexus` candidate link | Link is not repo mutation |
| `deployment_status` | Display posture for deployment evidence | planned, staged, live-confirmed, unknown | Status is not deployment action |
| `public_access_status` | Public/private/internal posture | internal-only, public candidate, public live confirmed | Public access display is not launch authorization |
| `dns_status` | DNS posture | unknown, planned, ready, conflict | DNS status is not DNS change authority |
| `evidence_refs` | Evidence references | docs, reviews, operator records | Evidence reference is not verification |
| `authority_boundary_summary` | Non-authorization copy | No DNS/deploy/runtime authority | Display is non-authoritative |

## 13. Public-readiness posture model

| Readiness field | Meaning | Does not imply | Boundary |
|-----------------|---------|----------------|----------|
| `not_assessed` | No readiness assessment has been made | Ownership, DNS, deployment, or production readiness | Requires evidence before promotion |
| `internal_only` | Intended for internal/operator use only | Public launch | No public-readiness claim |
| `parked_or_reserved` | Domain or concept is reserved/parked | App readiness or deployment | Parking is not launch |
| `DNS_planned` | DNS work is planned | DNS readiness or DNS change authority | No DNS mutation |
| `DNS_ready` | DNS posture appears ready by accepted evidence | Deployment readiness | DNS readiness is not app readiness |
| `app_planned` | App/surface is planned | Deployment or runtime readiness | Planning only |
| `app_staged` | App/surface has staging posture | Public readiness or production gate | Staging is not production |
| `internal_preview` | Preview available for internal review | Public launch | Human review required |
| `public_candidate` | Candidate for public readiness review | Public readiness acceptance | CONTROL_THREAD review required |
| `public_ready_pending_CONTROL_THREAD` | Appears ready pending CONTROL_THREAD decision | Public launch authorization | CONTROL_THREAD remains authority |
| `public_live_confirmed` | Public live state confirmed by accepted evidence | Future deploy authority | Confirmation display is not mutation authority |

## 14. Expiration / renewal risk model

| Risk field | Meaning | Display posture | Non-authorization |
|------------|---------|-----------------|-------------------|
| `expiration_unknown` | No accepted expiration evidence is available | Evidence gap | No registrar lookup or action |
| `no_known_risk` | No current renewal risk is known from accepted evidence | Low display risk | Not renewal proof |
| `watch` | Monitor before next review | Advisory risk | No timer, polling, or automation |
| `renewal_due_soon` | Renewal window needs human review | Elevated risk | No renewal action |
| `urgent_renewal_risk` | Urgent human review needed | High risk | No payment or registrar action |
| `expired_or_unconfirmed` | Expired or expiration status cannot be confirmed | Blocker/risk posture | No registrar mutation |
| `registrar_account_unknown` | Registrar account evidence is missing | Evidence limitation | No account access authority |
| `evidence_required` | Additional evidence is required | Review-required posture | No source-of-truth transfer |

## 15. Current registry gap analysis

| Gap | Current risk | Corrected model requirement | Recommended handling |
|-----|--------------|-----------------------------|----------------------|
| Owned asset and domain concept are not separated | Domain-like concepts may be mistaken for owned domains | Separate `domain_asset_id` from `domain_concept_id` | A2 should add local-static display model fields |
| Engine group and repository are not separated | `frontend-nexus`-style names may be mistaken for repos | Separate `engine_group_id` from repo binding | A2 should show engine groups as concepts |
| Domain row has one optional repo | Current shape implies one-domain-one-repo mapping | Many-to-many repo binding model | A2 should add binding records as display metadata |
| Status vocabulary is too coarse | `live`, `planned`, and `parked` can imply public or production readiness | Add public-readiness posture model | A2 should display readiness as advisory only |
| Expiration display lacks renewal risk model | Date may imply renewal action or operational readiness | Add expiration/renewal risk labels and limitations | A2 should display risk without automation |
| Registrar/account evidence absent | Registry cannot confirm ownership or renewal path | Add evidence and limitation fields | A2 should mark unknowns explicitly |
| DNS posture is not modeled separately | Domain ownership may be mistaken for DNS readiness | Add DNS provider/nameserver/DNS posture fields | A2 should preserve no DNS authority |
| Environment and deployment readiness are conflated | `prod` may imply production readiness | Add environment model and boundary copy | A2 should state environment display is not deployment authority |
| Current registry can be mistaken for canon | Operator surface may be read as final company register | Add source posture and CONTROL_THREAD status | A2 should label current data non-authoritative |

## 16. Proposed corrected registry field model

| Registry field | Field class | Meaning | Required for A2? | Boundary |
|----------------|-------------|---------|------------------|----------|
| `registry_item_id` | Shared identifier | Stable row/card identifier | Yes | Identifier is not acceptance |
| `item_type` | Shared classifier | Domain asset, concept, engine group, repo binding, or environment | Yes | Type is display metadata |
| `display_name` | Shared label | Human-readable name | Yes | Label is not authority |
| `canonical_name` | Shared canonical label | Canonical candidate string when known | Recommended | Canonical candidate is not company canon |
| `ownership_status` | Asset field | Ownership posture | Yes for assets | Requires accepted evidence |
| `domain_asset_id` | Asset link | Domain asset reference | Yes where applicable | Link is not ownership proof |
| `domain_name` | Asset field | Domain name | Yes for assets | Name is not DNS verification |
| `domain_concept_id` | Concept link | Concept reference | Yes where applicable | Concept is not deployed app |
| `engine_group_id` | Engine group link | Engine group reference | Yes where applicable | Engine group is not repository |
| `repo_binding_ids` | Binding links | Many-to-many binding references | Yes | Binding is not repo mutation |
| `environment_ids` | Environment links | Related environments | Yes | Environment is not deployment authority |
| `registrar` | Asset metadata | Registrar label if known | Recommended | No registrar action |
| `expiration_date` | Asset metadata | Expiration date if known | Recommended | Date is not renewal action |
| `renewal_risk` | Asset risk | Renewal risk posture | Yes | Risk display is advisory |
| `dns_provider` | DNS metadata | DNS provider label if known | Recommended | No DNS change |
| `public_readiness_posture` | Readiness field | Public-readiness display posture | Yes | Not public launch authorization |
| `evidence_refs` | Evidence field | Supporting evidence references | Yes | Reference is not verification |
| `source_posture` | Provenance field | Repo-local, passalong-grounded, current registry, unknown | Yes | Source posture is not source-of-truth transfer |
| `limitations` | Caveat field | Known evidence/model caveats | Yes | Caveat display is not resolution |
| `control_thread_decision_status` | Authority field | Routed, review-required, accepted, held, blocked, etc. | Yes | CONTROL_THREAD remains authority |
| `control_thread_review_required` | Authority field | Whether review remains required | Yes | Display does not review itself |
| `authority_boundary_summary` | Boundary field | Non-authorization copy | Yes | No mutation, deployment, or automation |

## 17. Asset / domain / repo / engine distinction

| Concept | Definition | Can map to | Must not be treated as |
|---------|------------|------------|-------------------------|
| Domain asset | Owned or candidate-owned domain name requiring evidence | Concepts, engine groups, environments, repo bindings | Repository, deployed app, DNS readiness, public launch |
| Domain concept | Product, service, or surface idea that may use a domain | Assets, engine groups, repos, environments | Owned domain, deployed app, source of truth |
| Domain-engine group | Responsibility group or engine taxonomy concept | Concepts, assets, candidate repos, services | Repository, runtime engine activation, provider dispatch |
| Repository | Source code repository or repo reference | Many concepts, assets, engine groups, environments | Domain asset, public app, DNS authority |
| Environment | Deployment or access context label | Assets, concepts, repos | Deployment authority, production readiness |
| Repo binding | Relationship record between repo and asset/concept/group/environment | Many-to-many links | Target-repo mutation or source-of-truth transfer |
| Public-readiness posture | Display label for public exposure readiness | Assets, concepts, environments | Public launch authorization or production gate |
| Expiration/renewal risk | Display risk for domain renewal review | Domain assets | Registrar action, renewal payment, automation |

## 18. Repo binding many-to-many posture

A1 plans that repository binding must be modeled as a separate display record rather than a single field on a domain asset.

A1 distinguishes:

- one repository may support many domain assets, concepts, engine groups, and environments;
- one domain asset may relate to many repositories or none;
- one domain concept may span multiple repositories and engine groups;
- one engine group may include multiple candidate repositories;
- a binding display does not mutate GitHub, repositories, DNS, registrar state, deployment targets, or source-of-truth authority.

## 19. CONTROL_THREAD authority posture

A1 plans visible authority posture:

- CONTROL_THREAD remains registry acceptance authority.
- CONTROL_THREAD remains route authority.
- CONTROL_THREAD remains hold authority.
- Registry display is not company canon unless separately accepted.
- Registry display is not DNS authority.
- Registry display is not registrar authority.
- Registry display is not renewal authority.
- Registry display is not deployment authority.
- Registry display is not production authority.
- Registry display is not source-of-truth transfer.

## 20. Registry authority-boundary copy requirements

| Boundary copy item | Where displayed | Reason | Non-authorization preserved |
|--------------------|----------------|--------|----------------------------|
| Non-authoritative registry display | Registry overview and detail cards | Prevents current UI from becoming company canon | No source-of-truth transfer |
| Human-supervised review required | Registry header and item status | Keeps CONTROL_THREAD authority visible | No acceptance authority transfer |
| No registry mutation from display | Registry display surfaces | Separates display from pre-existing admin actions | No registry mutation |
| No DNS change | Domain asset and DNS posture sections | Prevents DNS readiness confusion | No DNS mutation |
| No registrar or renewal action | Registrar/expiration sections | Prevents risk display from becoming action | No registrar or renewal action |
| No public launch | Public-readiness sections | Separates readiness posture from launch | No public launch authorization |
| No deployment or production gates | Environment/readiness sections | Prevents environment status from becoming deploy authority | No deployment or production gates |
| No runtime behavior or dispatch | Engine group and repo binding sections | Prevents engine labels from becoming activation | No runtime/provider/model/API dispatch |
| No GitHub or target-repo mutation | Repo binding sections | Keeps binding display advisory | No GitHub mutation or target-repo mutation/import |
| No hidden automation | Risk/status sections | Prevents watch/risk labels from implying timers | No hidden automation, timers, polling, or background jobs |

## 21. Recommended A2 implementation route

A1 recommends, if CONTROL_THREAD accepts A1 and no blocker is identified:

`A2 Company Asset and Domain Registry Display Model Implementation v0`

Recommended branch:

`feature/q3m7-company-asset-domain-registry-display-model-v0`

Recommended posture:

- app-local source implementation
- local-static display metadata only
- non-authoritative
- human-supervised
- no registry mutation
- no DNS change
- no registrar action
- no renewal action
- no deployment
- no runtime behavior
- no provider/model/API dispatch
- no GitHub mutation
- no target-repo mutation/import
- no accepted-code import
- no production gates

Recommended A2 scope:

- add local-static corrected registry display model;
- separate domain assets, domain concepts, engine groups, repo bindings, environments, readiness posture, and renewal risk;
- show many-to-many repo binding posture;
- show CONTROL_THREAD authority-boundary copy;
- add focused local tests if source helpers/constants are added;
- avoid implementation that mutates registry, DNS, registrar, GitHub, repos, deployment, runtime, or production state.

## 22. Recommended A3 review route

A1 recommends:

`A3 Company Asset and Domain Registry Display Model Boundary Review v0`

Recommended posture:

- review-only;
- confirm A2 remains app-local and local-static;
- confirm no registry mutation;
- confirm no DNS/registrar action;
- confirm no deployment/runtime behavior;
- confirm no provider/model/API dispatch;
- confirm no GitHub mutation;
- confirm no target-repo mutation/import;
- confirm no production gates;
- confirm no source-of-truth transfer;
- confirm one-domain-one-repo mapping is not enforced.

## 23. Rejected implementation paths

| Rejected path | Reason rejected | Risk avoided |
|---------------|-----------------|--------------|
| Implementing in A1 | A1 is planning-only | Scope breach |
| Mutating the registry | A1 is docs/reference-only | Registry mutation |
| Treating current registry as final company canon | Operator correction says current registry is not final | Source-of-truth transfer |
| Treating owned domains as repositories | Domain assets and repos are separate concepts | One-domain-one-repo error |
| Treating domain concepts as deployed apps | Concepts are planning/model entities | Deployment or runtime implication |
| Treating engine groups as repositories | Engine groups are domain-engine concepts | Repo identity confusion |
| Enforcing one-domain-one-repo mapping | Repos may plug into multiple domains | Incorrect binding model |
| Adding live registrar integration | A1 has no registrar authority | Registrar action |
| Adding DNS mutation | A1 has no DNS authority | DNS change |
| Adding renewal action | Renewal risk display is not renewal action | Payment/registrar mutation |
| Adding public launch action | Public readiness is display posture | Public launch authorization |
| Adding deployment action | Deployment is out of scope | Deployment mutation |
| Adding runtime behavior | A1 is non-executing | Runtime activation |
| Adding provider/model/API dispatch | A1 is non-dispatching | Provider/API authority |
| Adding GitHub mutation | A1 is non-mutating | GitHub mutation |
| Adding target-repo mutation/import | A1 is display planning only | Target-repo mutation/import |
| Adding accepted-code import | Not authorized | Accepted-code import |
| Adding production gates | Not authorized | Production authority |
| Adding source-of-truth transfer | Registry display is non-authoritative | Company canon confusion |
| Adding hidden automation, timers, polling, or background jobs | A1 is human-supervised and static | Hidden/background automation |

## 24. Risks and interpretive guardrails

A1 identifies these risks and guardrails:

- Current DB-backed registry surfaces can be useful inventory evidence, but they are not final company asset canon.
- The current `Domain` model supports one optional repo relation; corrected planning requires many-to-many repo bindings.
- Current status labels are too coarse to represent ownership, DNS readiness, deployment readiness, production readiness, public-readiness posture, and renewal risk.
- Repo-local evidence does not include an authoritative owned-domain list with registrar/renewal account evidence; A1 models the inventory shape but does not claim the final owned-domain list.
- Domain-engine names must remain concepts unless separately accepted as repositories.
- Expiration or renewal risk display must not trigger registrar, payment, DNS, timer, polling, or background behavior.
- Public-readiness posture must not be read as public launch authorization or production readiness.

## 25. Validation

A1 requires safe docs-only validation:

- `git diff --check`
- `git diff --cached --check` if the artifact is staged
- repo-local docs/static validation only if available
- targeted non-authorization scan over changed files and relevant docs/source paths

A1 does not run source validation unless source files are accidentally changed. A1 does not run migration tests, apply migrations, run Prisma migration commands, connect to deployed databases, call APIs, call providers/models, mutate DNS, access registrar systems, renew domains, mutate GitHub, mutate target repos, import accepted code, or deploy.

## 26. Authority boundary

A1 preserves:

- planning-only
- docs/reference-only
- app-local
- non-authoritative
- human-supervised
- no implementation
- no registry mutation
- no DNS change
- no registrar action
- no renewal action
- no public launch
- no deployment
- no runtime behavior
- no provider/model/API dispatch
- no GitHub mutation
- no target-repo mutation/import
- no accepted-code import
- no production gates
- no source-of-truth transfer
- no hidden automation
- no timers
- no polling
- no background jobs
- no automatic route execution
- no automatic delivery
- no acceptance authority transfer
- no execution authority transfer

## 27. Repo-lane closeout

A1 records this planning artifact as the only intended lane output:

- Artifact: `docs/reference/q3m7-company-asset-domain-registry-reconciliation-planning-v0.md`
- Branch: `docs/q3m7-company-asset-domain-registry-reconciliation-planning-v0`
- Posture: docs/reference planning-only
- Recommended next route: `A2 Company Asset and Domain Registry Display Model Implementation v0`
- Recommended review route: `A3 Company Asset and Domain Registry Display Model Boundary Review v0`

A1 does not authorize implementation, registry mutation, DNS change, registrar action, renewal action, public launch, deployment, runtime behavior, provider/model/API dispatch, GitHub mutation, target-repo mutation/import, accepted-code import, production gates, source-of-truth transfer, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, acceptance authority transfer, execution authority transfer, PR creation, merge, or CONTROL_THREAD acceptance.

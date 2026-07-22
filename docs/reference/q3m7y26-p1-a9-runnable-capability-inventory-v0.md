# Q3M7Y26-P1 A9 Runnable Capability Inventory v0

Role: JAI::DEV::BUILDER

## 1. Purpose and bounded meaning of runnable

This artifact inventories eleven Program-1-relevant `dev-jai-nexus`
control-plane capability families at an exact repository and evidence cutoff.
It treats `DOCUMENTED`, `IMPLEMENTED`, `BEHAVIORALLY_TESTED`, `LOCAL_SHADOW`,
`DURABLE_RUNTIME`, `DEPLOYED`, and `CUSTOMER_VISIBLE` as independent evidence
dimensions. Runnable is dimensionally evidenced; it is not a global verdict.

The inventory is Program-instance-only. It is not universal capability canon,
an organization-wide repository inventory, or a source-of-truth transfer. It
creates no runtime, persistence, provider, customer, production, external
effect, Agent, Council, activation, acceptance, routing, or ownership effect.

## 2. Control coordinates and evidence cutoff

| Field | Value |
| --- | --- |
| Program | `Q3M7Y26-P1` |
| Batch | `A - Accepted Main-State Reconciliation` |
| Wave | `A-C` |
| Lane | `A9 - Runnable Capability Inventory v0` |
| Coordinate | `Q3M7Y26-P1:A9` |
| Route | `CT-2026-07-22-Q3M7Y26-P1-START-A9-RUNNABLE-CAPABILITY-INVENTORY-v0` |
| Work Packet | `Q3M7Y26-P1-A9-v0` |
| Delivery role | `JAI::DEV::BUILDER` |
| Repository | `jai-nexus/dev-jai-nexus` |
| Required base | `69ee1e0a059189c5014f048e991a4fc781a127b2` |
| Branch | `docs/q3m7y26-p1-a9-runnable-capability-inventory-v0` |
| Allowlist | `docs/reference/q3m7y26-p1-a9-runnable-capability-inventory-v0.md` |
| Mode | `ONE_PATH / DOCUMENTARY / NO_RUNTIME / DRAFT_PR_ONLY` |
| Evidence cutoff | `2026-07-22T23:14:26Z` |
| Open PRs at cutoff | `0` |
| Linear mirror | `JAI-191 / In Progress / MIRROR_ONLY` |
| Evidence ceiling | `DOCUMENTATION_RUNNABLE_CAPABILITY_INVENTORY_ONLY` |

The Builder role and repository are freshly assigned by this A9 route. They
are not inherited from A6. A3 is retained only as accepted
`RECONCILIATION_EVIDENCE_ONLY / WORKFLOW_ONLY` evidence supplied by the A9
packet and corroborated by [A4], [A6], [A7], and [A8]; no A3 repository path or
commit is invented.

## 3. Source precedence and classification contract

| Rank | Evidence | A2 posture | Bounded use |
| ---: | --- | --- | --- |
| 1 | Current A9 Work Packet | `ACCEPTED_CURRENT / WORKFLOW_ONLY` | Exact route, scope, Builder assignment, artifact contract, validation, delivery operations, and non-authorizations. |
| 2 | [A2] | `ACCEPTED_CURRENT` | Controlling precedence, freshness, conflict, supersession, unavailable-evidence, status, and relation rules. |
| 3 | [A4], [A5], [A6], [A7], and [A8] | Exact source-specific `ACCEPTED_CURRENT`, `RATIFIED_PHASE_SPECIFIC`, or `STATIC_CONFIGURATION` posture | Program-instance decisions, current Program state, coordinates, delivery chronology, role/route boundaries, and bounded capability evidence. |
| 4 | Current source and test paths at `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Exact implemented declarations, exported entrypoints, test subjects, and explicit non-effect copy. |
| 5 | GitHub checks, Vercel, and Linear | `MIRROR_ONLY` | Mechanical delivery, configured-check, preview, and coordination corroboration only. |

For every dimension claim, `EVIDENCED` means only that the named evidence
supports that one bounded dimension. `UNAVAILABLE` means the required direct
evidence was not present at the cutoff. Neither result grants authority or
silently supplies another dimension.

## 4. Capability-family registry - exactly eleven records

<!-- A9_CAPABILITY_START -->
| capability_id | family | bounded_scope | exact_source_paths_at_sha | exact_entrypoints_or_UNAVAILABLE | prerequisites | implementation_posture | runtime_mode | explicit_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A9-CAP-001` | Company asset/domain registry model | App-local candidate display data and deterministic summary for owned-domain, concept, engine, repository, and environment bindings. | [CAP001-SOURCE] | `COMPANY_ASSET_DOMAIN_REGISTRY_DISPLAY_MODEL`; `summarizeCompanyAssetDomainRegistryDisplayModel` | Import current module; no external service prerequisite is evidenced. | TypeScript display model with explicit local-static, candidate, non-authoritative posture. | `LOCAL_STATIC_DISPLAY_ONLY` | No final company canon, DNS, deployment, production, provider, persistence, or activation effect. |
| `A9-CAP-002` | Governed route-contract, adoption, boundary, parity, decision, and handler seam | Bounded passalong, motion-intake, and manual-inference response contracts, route decisions, handler seam, and route exports. | [CAP002-PASSALONG-CONTRACT]<br>[CAP002-MOTION-CONTRACT]<br>[CAP002-INFERENCE-CONTRACT]<br>[CAP002-PASSALONG-DECISION]<br>[CAP002-MOTION-DECISION]<br>[CAP002-INFERENCE-DECISION]<br>[CAP002-LOCAL-HANDLER]<br>[CAP002-PASSALONG-COLLECTION-ROUTE]<br>[CAP002-PASSALONG-DETAIL-ROUTE]<br>[CAP002-MOTION-ROUTE]<br>[CAP002-INFERENCE-ROUTE] | Collection `GET`/`POST`; detail `GET`/`PATCH`; motion-intake `GET`/`POST`; manual-inference `POST`; `decidePassalongCollectionList`; `decidePassalongCollectionCreate`; `decidePassalongDetailPatch`; `decideMotionIntakeList`; `decideMotionIntakeCreate`; `decideManualInferenceRun`; `createLocalOperatingLoopHandler` | Existing route dependencies, authenticated handler context where applicable, and configured persistence/provider seams; environment availability is not established here. | Implemented contracts and deterministic decision/handler seams with explicit non-authorizations and fail-closed unavailable paths. | `APP_LOCAL_GOVERNED_ROUTE_SEAM / ENVIRONMENT_EFFECTS_UNOBSERVED` | Route/source presence grants no persistence success, provider dispatch, execution, acceptance, customer, production, or activation authority. |
| `A9-CAP-003` | JAI Control Thread motion-proposal model | Static proposal, operator intake, advisory handoff preview, and Program-planning seed serialization. | [CAP003-SOURCE] | `JAI_CONTROL_THREAD_MOTION_PROPOSAL_SURFACE`; `buildJaiControlThreadMotionProposalJson`; `buildJaiControlThreadMotionProposalMarkdown` | Import current module and use embedded static proposal data. | TypeScript proposal/display model; non-authoritative and future-gated. | `LOCAL_STATIC_PROPOSAL_ONLY` | No JAI Control Thread runtime, Council, Agent, provider, repository, deployment, Program, or gate activation. |
| `A9-CAP-004` | Sandbox Agent draft model | App-local candidate Agent-class draft, compatibility metadata, and deterministic JSON/Markdown rendering. | [CAP004-SOURCE] | `buildJaiPaletteSandboxAgentDraft`; `createDefaultJaiPaletteSandboxAgentDraftInput`; `buildJaiPaletteSandboxAgentDraftJson`; `buildJaiPaletteSandboxAgentDraftMarkdown` | Import current module; manually supplied or default safe draft input. | Candidate metadata with `executableRuntime: not_created` and draft activation status. | `APP_LOCAL_DRAFT_ONLY` | No executable Agent runtime, provider/model/API dispatch, sandbox activation, Council, or JAI Agent activation. |
| `A9-CAP-005` | Founder local operating loop D2-D8 | Authenticated founder-facing local-shadow validation, deliberation, decision confirmation, recovery, proof/explanation presentation, Work Packet preview, and redacted boundary receipt copy. | [CAP005-MODEL]<br>[CAP005-HANDLER]<br>[CAP005-ROUTE]<br>[CAP005-PANEL]<br>[CAP005-COMPOSER] | API `POST`; `createLocalOperatingLoopHandler`; `LocalOperatingLoopPanel`; `NativeMotionIntakeComposer`; exported parsing, normalization, recommendation, recovery, confirmation, receipt, and client-response helpers | ADMIN-authenticated application boundary for the UI/route; valid synthetic motion input; server proof secret for server proofs. | Implemented local-shadow model, handler, route, and UI with server-derived recommendation and explicit demonstration-only receipts. | `LOCAL_SHADOW / NODE_ROUTE / NO_EXTERNAL_EFFECT_CREDIT` | No persistence, filesystem, GitHub, Linear, outbound provider/network, execution, acceptance, or activation authority; external-effect absence remains unverified. |
| `A9-CAP-006` | Supervised route packet model | Deterministic advisory packet construction and JSON/Markdown preview for future manual handoff. | [CAP006-SOURCE] | `buildSupervisedRoutePacket`; `buildSupervisedRoutePacketJson`; `buildSupervisedRoutePacketMarkdown`; `createDefaultSupervisedRoutePacketInput` | Import current module and provide bounded input or use default input. | Structured app-local non-authoritative packet with `manual_handoff_only` output posture. | `LOCAL_MANUAL_HANDOFF_PREVIEW_ONLY` | No automatic send, route, dispatch, import, mutation, runtime activation, provider call, Agent activation, or acceptance. |
| `A9-CAP-007` | Sandbox Nexus surface | Static experimental sandbox.nexus surface, fixture, stress, closeout, relationship, and blocked-gate display data. | [CAP007-SOURCE] | `SANDBOX_NEXUS_SURFACE_POSTURE`; `SANDBOX_NEXUS_SURFACE_MODULES`; `SANDBOX_NEXUS_FIXTURE_INTAKE_DISPLAY`; `SANDBOX_NEXUS_STRESS_TEST_PLAN_DISPLAY`; `SANDBOX_NEXUS_CLOSEOUT_REVIEW_DISPLAY` | Import current module and its static JAI Palette draft dependency. | App-local static display-only, non-authoritative, human-supervised metadata. | `LOCAL_STATIC_SANDBOX_DISPLAY_ONLY` | No live domain, executable runner, sandbox runtime, provider dispatch, mutation, import, deployment, production, Agent, Council, or activation. |
| `A9-CAP-008` | Sandbox packet-control surface | Local draft selection, construction, and deterministic JSON/Markdown export-preview data. | [CAP008-SOURCE] | `createDefaultSandboxPacketDraft`; `buildSandboxPacketDraft`; `buildSandboxPacketDraftJson`; `buildSandboxPacketDraftMarkdown` | Import current module and choose allowlisted motion, fixture, and role-class options. | App-local, local-static, manual-export-only, non-authoritative draft metadata. | `LOCAL_STATIC_MANUAL_EXPORT_PREVIEW_ONLY` | No input persistence, delivery proof, runtime execution, provider dispatch, source-of-truth validation, or activation. |
| `A9-CAP-009` | Sandbox receipt-return display | Static bounded receipt-return display and deterministic Markdown rendering. | [CAP009-SOURCE] | `SANDBOX_RECEIPT_RETURN_DISPLAY`; `buildSandboxReceiptReturnDisplayMarkdown` | Import current module and use embedded fixture-bound display data. | Manual, fixture-bound, test-data-only, sandbox-local, non-authoritative display. | `SANDBOX_LOCAL_STATIC_DISPLAY_ONLY` | No receipt ingestion, runtime behavior, provider dispatch, Agent activation, persistence, acceptance, or source-of-truth effect. |
| `A9-CAP-010` | Passalong/thread-memory local boundary | App-local passalong records, queues, validation, route recommendation, copyable packet, and environment-dependent persistence adapter boundary. | [CAP010-TYPES]<br>[CAP010-SAMPLE]<br>[CAP010-ROUTER]<br>[CAP010-BOUNDARY]<br>[CAP010-PERSISTENCE] | `getThreadMemoryRecords`; `getPassalongRecords`; `buildInboxQueue`; `buildOutboxQueue`; `buildRouteRecommendation`; `buildCopyablePassalongPacket`; `buildPersistedPassalongInput`; `validatePersistedPassalongCreateInput`; `validatePersistedPassalongPatchInput`; persistence adapter functions in [CAP010-PERSISTENCE] | Import current modules; database availability is environment-dependent and not observed by this artifact. | Implemented local boundary and adapter with non-authoritative records, manual routing, validation, and unavailable fallbacks. | `APP_LOCAL_BOUNDARY / DURABLE_PERSISTENCE_UNOBSERVED` | No automatic send, route, execution, import, mutation authority, source-of-truth transfer, customer, provider, production, or activation effect. |
| `A9-CAP-011` | Work Waves/Program taxonomy | Static Work, Waves, closeout, evidence-status, decision-vocabulary, and alignment model plus deterministic formatter. | [CAP011-SOURCE] | `WORK_WAVES_TAXONOMY_FIELDS`; `WORK_REQUIRED_TAXONOMY_FIELDS`; `WAVES_REQUIRED_TAXONOMY_FIELDS`; `CLOSEOUT_REQUIRED_TAXONOMY_FIELDS`; `WORK_TAXONOMY_ALIGNMENT`; `WAVES_TAXONOMY_ALIGNMENT`; `formatTaxonomyValue` | Import current module. | TypeScript static taxonomy/alignment declarations with explicit authority boundaries. | `LOCAL_STATIC_TAXONOMY_ONLY` | No Work/Program creation, database mutation, routing, provider dispatch, execution, acceptance, Batch/Program transition, or activation. |
<!-- A9_CAPABILITY_END -->

## 5. Dimension-claim registry - exactly seventy-seven records

`missing_evidence` is `NONE_WITHIN_THIS_DIMENSION` only when the named
dimension is directly evidenced. Every `UNAVAILABLE` result names the direct
proof that is missing.

<!-- A9_CLAIM_START -->
| claim_id | capability_id | dimension | evidence_result | evidence_kind | exact_evidence | cutoff_or_ref | observed_status | bounded_conclusion | missing_evidence | authority_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A9-CLM-001-DOC` | `A9-CAP-001` | `DOCUMENTED` | `EVIDENCED` | Immutable source declaration | [CAP001-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | The model documents its candidate display fields and boundaries. | `NONE_WITHIN_THIS_DIMENSION` | Documentation is not company canon or authority. |
| `A9-CLM-001-IMP` | `A9-CAP-001` | `IMPLEMENTED` | `EVIDENCED` | Exported TypeScript model and summary | [CAP001-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | The static display model and summary function exist. | `NONE_WITHIN_THIS_DIMENSION` | Source presence is not live registry operation. |
| `A9-CLM-001-BHT` | `A9-CAP-001` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP001-TEST] and `A9-TST-001` | Required A9 validation | `STATIC_CONFIGURATION` | Named display invariants are covered by the joined test. | `NONE_WITHIN_THIS_DIMENSION` | Passing tests grant no runtime or authority. |
| `A9-CLM-001-LSH` | `A9-CAP-001` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit local-static posture | [CAP001-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | The model is usable as app-local static candidate display data. | `NONE_WITHIN_THIS_DIMENSION` | Local display is not durable or deployed canon. |
| `A9-CLM-001-DUR` | `A9-CAP-001` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Boundary declaration | [CAP001-SOURCE] | A9 cutoff | `DEFERRED` | No durable registry runtime is established. | Direct durable-runtime and persistence receipt for this model. | No persistence or runtime grant. |
| `A9-CLM-001-DEP` | `A9-CAP-001` | `DEPLOYED` | `UNAVAILABLE` | Deployment evidence boundary | [A4] and [A7] | A9 cutoff | `UNRESOLVED` | Repository and preview metadata do not identify an exact deployed current-main capability. | Exact deployed SHA plus direct capability observation. | No deployment or production claim. |
| `A9-CLM-001-CUS` | `A9-CAP-001` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] and [A4] | A9 cutoff | `UNRESOLVED` | No customer visibility is established. | Direct customer-surface and effect evidence. | No customer effect or readiness claim. |
| `A9-CLM-002-DOC` | `A9-CAP-002` | `DOCUMENTED` | `EVIDENCED` | Immutable contracts and boundary copy | [CAP002-PASSALONG-CONTRACT], [CAP002-MOTION-CONTRACT], and [CAP002-INFERENCE-CONTRACT] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Response contracts document bounded route outcomes and non-authorizations. | `NONE_WITHIN_THIS_DIMENSION` | Contracts do not grant route or execution authority. |
| `A9-CLM-002-IMP` | `A9-CAP-002` | `IMPLEMENTED` | `EVIDENCED` | Route, decision, and handler source | [CAP002-PASSALONG-DECISION], [CAP002-MOTION-DECISION], [CAP002-INFERENCE-DECISION], and [CAP002-LOCAL-HANDLER] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Governed decision and handler seams exist for the bounded routes. | `NONE_WITHIN_THIS_DIMENSION` | Implemented seams do not prove external effects. |
| `A9-CLM-002-BHT` | `A9-CAP-002` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Five focused bounded tests | [CAP002-ADOPTION-TEST], [CAP002-BOUNDARY-TEST], [CAP002-PARITY-TEST], [CAP002-DECISION-TEST], and [CAP002-HANDLER-TEST] | Required A9 validation | `STATIC_CONFIGURATION` | Adoption, static boundary, response parity, decision seam, and handler boundary have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Tests prove only named local seam behavior. |
| `A9-CLM-002-LSH` | `A9-CAP-002` | `LOCAL_SHADOW` | `EVIDENCED` | App-local contracts and unavailable seams | [CAP002-PASSALONG-CONTRACT] and [CAP002-LOCAL-HANDLER] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Bounded route behavior can be exercised through local contract/handler seams. | `NONE_WITHIN_THIS_DIMENSION` | Local exercise does not establish provider, persistence, or production effects. |
| `A9-CLM-002-DUR` | `A9-CAP-002` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Source/runtime distinction | [CAP002-PASSALONG-COLLECTION-ROUTE] and [A4] | A9 cutoff | `DEFERRED` | Route and adapter presence do not prove durable successful runtime behavior. | Direct authenticated runtime receipts for persistence/provider paths and resulting durable state. | No persistence, provider, or runtime credit. |
| `A9-CLM-002-DEP` | `A9-CAP-002` | `DEPLOYED` | `UNAVAILABLE` | CI/preview boundary | [A7] | A9 cutoff | `UNRESOLVED` | Green checks and Vercel records do not prove the exact current seam is deployed. | Exact deployed SHA and direct route-capability observation. | No production route claim. |
| `A9-CLM-002-CUS` | `A9-CAP-002` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] and [A4] | A9 cutoff | `UNRESOLVED` | No customer access or effect is evidenced. | Direct authorized customer-surface evidence. | No customer effect or readiness claim. |
| `A9-CLM-003-DOC` | `A9-CAP-003` | `DOCUMENTED` | `EVIDENCED` | Static proposal and boundary declarations | [CAP003-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Proposal, intake, advisory, planning-seed, and boundary fields are documented. | `NONE_WITHIN_THIS_DIMENSION` | Proposal text is not a route or decision. |
| `A9-CLM-003-IMP` | `A9-CAP-003` | `IMPLEMENTED` | `EVIDENCED` | Exported builders | [CAP003-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | JSON and Markdown proposal rendering exists. | `NONE_WITHIN_THIS_DIMENSION` | Builders do not activate JAI Control Thread. |
| `A9-CLM-003-BHT` | `A9-CAP-003` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP003-TEST] and `A9-TST-007` | Required A9 validation | `STATIC_CONFIGURATION` | Proposal shape and non-authorization behavior have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Passing tests grant no Council or runtime authority. |
| `A9-CLM-003-LSH` | `A9-CAP-003` | `LOCAL_SHADOW` | `EVIDENCED` | App-local proposal source | [CAP003-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | The proposal can be deterministically rendered app-locally. | `NONE_WITHIN_THIS_DIMENSION` | Local proposal output is non-authoritative. |
| `A9-CLM-003-DUR` | `A9-CAP-003` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit future-gated boundary | [CAP003-SOURCE] | A9 cutoff | `DEFERRED` | No actual JAI Control Thread runtime is established. | Direct runtime-activation and durable execution receipt under fresh authority. | No JAI, Agent, Council, or provider activation. |
| `A9-CLM-003-DEP` | `A9-CAP-003` | `DEPLOYED` | `UNAVAILABLE` | Deployment-evidence boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed proposal capability is observed. | Exact deployed SHA and direct surface observation. | No deployment claim. |
| `A9-CLM-003-CUS` | `A9-CAP-003` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible proposal surface is evidenced. | Direct authorized customer visibility evidence. | No customer effect. |
| `A9-CLM-004-DOC` | `A9-CAP-004` | `DOCUMENTED` | `EVIDENCED` | Candidate draft schema and boundary copy | [CAP004-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Agent classes, draft fields, compatibility, and blocked authorities are documented. | `NONE_WITHIN_THIS_DIMENSION` | Labels do not establish an Agent identity or activation. |
| `A9-CLM-004-IMP` | `A9-CAP-004` | `IMPLEMENTED` | `EVIDENCED` | Exported deterministic builders | [CAP004-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Draft construction and JSON/Markdown rendering exist. | `NONE_WITHIN_THIS_DIMENSION` | Source does not create executable runtime. |
| `A9-CLM-004-BHT` | `A9-CAP-004` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP004-TEST] and `A9-TST-008` | Required A9 validation | `STATIC_CONFIGURATION` | Draft and non-authorization invariants have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Test success is not Agent activation. |
| `A9-CLM-004-LSH` | `A9-CAP-004` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit app-local draft posture | [CAP004-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Candidate Agent metadata can be generated app-locally. | `NONE_WITHIN_THIS_DIMENSION` | Local draft output remains non-authoritative. |
| `A9-CLM-004-DUR` | `A9-CAP-004` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit `executableRuntime: not_created` boundary | [CAP004-SOURCE] | A9 cutoff | `DEFERRED` | No executable Agent runtime exists in this evidence. | Freshly authorized runtime implementation and direct execution receipt. | No Agent, Council, provider, or JAI activation. |
| `A9-CLM-004-DEP` | `A9-CAP-004` | `DEPLOYED` | `UNAVAILABLE` | Deployment-evidence boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed draft capability is observed. | Exact deployed SHA and direct capability observation. | No deployment claim. |
| `A9-CLM-004-CUS` | `A9-CAP-004` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible Agent draft is evidenced. | Direct authorized customer visibility evidence. | No customer or Agent effect. |
| `A9-CLM-005-DOC` | `A9-CAP-005` | `DOCUMENTED` | `EVIDENCED` | Source contracts plus accepted D2-D8 registry | [CAP005-MODEL], [CAP005-HANDLER], and [A4] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | State, request, response, proof, recovery, confirmation, receipt, and non-authorization contracts are documented. | `NONE_WITHIN_THIS_DIMENSION` | Documentation does not accept or activate the loop. |
| `A9-CLM-005-IMP` | `A9-CAP-005` | `IMPLEMENTED` | `EVIDENCED` | Model, handler, route, and UI source | [CAP005-MODEL], [CAP005-HANDLER], [CAP005-ROUTE], [CAP005-PANEL], and [CAP005-COMPOSER] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | The D2-D8 local operating-loop seam exists in current source. | `NONE_WITHIN_THIS_DIMENSION` | Implementation grants no execution or persistence authority. |
| `A9-CLM-005-BHT` | `A9-CAP-005` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP005-TEST] and `A9-TST-009` | Required A9 validation | `STATIC_CONFIGURATION` | Model, handler/client coherence, recovery, explanation, confirmation, and receipt behaviors have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Tests do not prove authenticated browser or external effects. |
| `A9-CLM-005-LSH` | `A9-CAP-005` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit local-shadow contracts and phase-bound observations | [CAP005-MODEL], [CAP005-HANDLER], and [A4] | D2-D8 accepted phase evidence through A9 cutoff | `RATIFIED_PHASE_SPECIFIC` | A bounded local-shadow operating loop was implemented, tested, and observed at named phase ceilings. | `NONE_WITHIN_THIS_DIMENSION` | Local-shadow credit is not production, persistence, customer, or acceptance authority. |
| `A9-CLM-005-DUR` | `A9-CAP-005` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit receipt boundary | [CAP005-MODEL] | A9 cutoff | `DEFERRED` | The loop reports demonstration-only receipt authority and no persistence; external effects are unverified. | Direct durable runtime, persistence, and external-effect receipts under separate authority. | No durable execution or persistence credit. |
| `A9-CLM-005-DEP` | `A9-CAP-005` | `DEPLOYED` | `UNAVAILABLE` | Phase-bound founder preview and Vercel metadata | [A4] and [A7] | A9 cutoff | `UNRESOLVED` | Founder preview evidence and successful Vercel statuses do not expose an exact deployed current-main SHA. | Exact deployed SHA plus current-main founder/runtime observation. | No current production-deployment claim. |
| `A9-CLM-005-CUS` | `A9-CAP-005` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Founder-only observation boundary | [A4] | A9 cutoff | `UNRESOLVED` | Founder-operated ADMIN evidence is not customer visibility. | Direct authorized customer-surface evidence and effect boundary. | No customer readiness or effect. |
| `A9-CLM-006-DOC` | `A9-CAP-006` | `DOCUMENTED` | `EVIDENCED` | Packet schema and boundary declarations | [CAP006-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Packet fields, lifecycle, guardrails, and manual-handoff posture are documented. | `NONE_WITHIN_THIS_DIMENSION` | Packet prose does not route work. |
| `A9-CLM-006-IMP` | `A9-CAP-006` | `IMPLEMENTED` | `EVIDENCED` | Exported packet builders | [CAP006-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Packet construction and JSON/Markdown rendering exist. | `NONE_WITHIN_THIS_DIMENSION` | Builders do not send or execute packets. |
| `A9-CLM-006-BHT` | `A9-CAP-006` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP006-TEST] and `A9-TST-010` | Required A9 validation | `STATIC_CONFIGURATION` | Packet shape, rendering, and non-authorizations have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Passing tests grant no handoff effect. |
| `A9-CLM-006-LSH` | `A9-CAP-006` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit app-local manual-handoff posture | [CAP006-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | A packet preview can be generated locally for manual review. | `NONE_WITHIN_THIS_DIMENSION` | Preview does not send, import, or execute. |
| `A9-CLM-006-DUR` | `A9-CAP-006` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit runtime-not-authorized boundary | [CAP006-SOURCE] | A9 cutoff | `DEFERRED` | No packet runtime or durable handoff is established. | Direct authorized runtime and delivery receipt. | No runtime, provider, or activation grant. |
| `A9-CLM-006-DEP` | `A9-CAP-006` | `DEPLOYED` | `UNAVAILABLE` | Deployment-evidence boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed packet capability is observed. | Exact deployed SHA and direct capability observation. | No deployment claim. |
| `A9-CLM-006-CUS` | `A9-CAP-006` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible packet workflow is evidenced. | Direct authorized customer visibility and effect evidence. | No customer effect. |
| `A9-CLM-007-DOC` | `A9-CAP-007` | `DOCUMENTED` | `EVIDENCED` | Static surface and boundary declarations | [CAP007-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Sandbox modules, relationships, gates, risk, and display postures are documented. | `NONE_WITHIN_THIS_DIMENSION` | Surface labels do not create runtime. |
| `A9-CLM-007-IMP` | `A9-CAP-007` | `IMPLEMENTED` | `EVIDENCED` | Exported static surface objects | [CAP007-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | The sandbox display model exists in current source. | `NONE_WITHIN_THIS_DIMENSION` | Model presence is not sandbox operation. |
| `A9-CLM-007-BHT` | `A9-CAP-007` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP007-TEST] and `A9-TST-011` | Required A9 validation | `STATIC_CONFIGURATION` | Surface shape, wiring, and blocked-gate invariants have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Tests do not activate sandbox.nexus. |
| `A9-CLM-007-LSH` | `A9-CAP-007` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit app-local static posture | [CAP007-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Static sandbox displays can be inspected locally before runtime exists. | `NONE_WITHIN_THIS_DIMENSION` | Local inspection grants no live-domain or execution effect. |
| `A9-CLM-007-DUR` | `A9-CAP-007` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit no-runtime boundary | [CAP007-SOURCE] | A9 cutoff | `DEFERRED` | No live sandbox runtime or executable runner is established. | Freshly authorized runtime implementation and direct execution evidence. | No sandbox, Agent, provider, or JAI activation. |
| `A9-CLM-007-DEP` | `A9-CAP-007` | `DEPLOYED` | `UNAVAILABLE` | Explicit no-live-domain boundary | [CAP007-SOURCE] and [A7] | A9 cutoff | `UNRESOLVED` | Repository/preview evidence does not prove a live sandbox.nexus deployment. | Exact deployed SHA, DNS/environment evidence, and direct observation. | No DNS, deployment, or production claim. |
| `A9-CLM-007-CUS` | `A9-CAP-007` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible sandbox surface is evidenced. | Direct authorized customer visibility evidence. | No customer or activation effect. |
| `A9-CLM-008-DOC` | `A9-CAP-008` | `DOCUMENTED` | `EVIDENCED` | Draft schema, options, and boundary copy | [CAP008-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Input, draft, export, receipt-posture, and blocked-authority fields are documented. | `NONE_WITHIN_THIS_DIMENSION` | Documentation is not packet delivery. |
| `A9-CLM-008-IMP` | `A9-CAP-008` | `IMPLEMENTED` | `EVIDENCED` | Exported draft builders | [CAP008-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Draft construction and JSON/Markdown rendering exist. | `NONE_WITHIN_THIS_DIMENSION` | Source does not persist or transmit input. |
| `A9-CLM-008-BHT` | `A9-CAP-008` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP008-TEST] and `A9-TST-012` | Required A9 validation | `STATIC_CONFIGURATION` | Draft, export, and boundary invariants have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Passing tests are not delivery proof. |
| `A9-CLM-008-LSH` | `A9-CAP-008` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit local-static manual-export posture | [CAP008-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | A draft/export preview can be generated locally. | `NONE_WITHIN_THIS_DIMENSION` | Preview does not write clipboard bytes or transmit externally by itself. |
| `A9-CLM-008-DUR` | `A9-CAP-008` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit no-persistence/no-runtime boundary | [CAP008-SOURCE] | A9 cutoff | `DEFERRED` | No durable packet-control runtime is established. | Direct persistence, runtime, and delivery receipts under fresh authority. | No persistence, execution, or provider grant. |
| `A9-CLM-008-DEP` | `A9-CAP-008` | `DEPLOYED` | `UNAVAILABLE` | Deployment-evidence boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed packet-control capability is observed. | Exact deployed SHA and direct capability observation. | No deployment claim. |
| `A9-CLM-008-CUS` | `A9-CAP-008` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible packet-control surface is evidenced. | Direct authorized customer visibility evidence. | No customer effect. |
| `A9-CLM-009-DOC` | `A9-CAP-009` | `DOCUMENTED` | `EVIDENCED` | Static receipt display contract | [CAP009-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Receipt-return fields, posture, and boundaries are documented. | `NONE_WITHIN_THIS_DIMENSION` | Display text is not an accepted receipt. |
| `A9-CLM-009-IMP` | `A9-CAP-009` | `IMPLEMENTED` | `EVIDENCED` | Exported display and renderer | [CAP009-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Static receipt display and Markdown rendering exist. | `NONE_WITHIN_THIS_DIMENSION` | Source does not ingest or return a live receipt. |
| `A9-CLM-009-BHT` | `A9-CAP-009` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP009-TEST] and `A9-TST-013` | Required A9 validation | `STATIC_CONFIGURATION` | Display and non-authorization invariants have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Test success is not receipt acceptance. |
| `A9-CLM-009-LSH` | `A9-CAP-009` | `LOCAL_SHADOW` | `EVIDENCED` | Explicit sandbox-local static posture | [CAP009-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | A fixture-bound receipt display can be rendered locally. | `NONE_WITHIN_THIS_DIMENSION` | Local rendering is not receipt delivery or source-of-truth transfer. |
| `A9-CLM-009-DUR` | `A9-CAP-009` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Explicit no-runtime boundary | [CAP009-SOURCE] | A9 cutoff | `DEFERRED` | No receipt-ingestion or return runtime is established. | Direct authorized ingestion/runtime receipt. | No runtime, persistence, or activation grant. |
| `A9-CLM-009-DEP` | `A9-CAP-009` | `DEPLOYED` | `UNAVAILABLE` | Deployment-evidence boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed receipt-return capability is observed. | Exact deployed SHA and direct capability observation. | No deployment claim. |
| `A9-CLM-009-CUS` | `A9-CAP-009` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible receipt-return surface is evidenced. | Direct authorized customer visibility evidence. | No customer or acceptance effect. |
| `A9-CLM-010-DOC` | `A9-CAP-010` | `DOCUMENTED` | `EVIDENCED` | Types, boundary, router, and non-authorization source | [CAP010-TYPES], [CAP010-ROUTER], and [CAP010-BOUNDARY] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Thread-memory/passalong records, validation, routing, and manual-boundary behavior are documented. | `NONE_WITHIN_THIS_DIMENSION` | Documentation does not make thread memory authoritative. |
| `A9-CLM-010-IMP` | `A9-CAP-010` | `IMPLEMENTED` | `EVIDENCED` | Router, validation, and persistence-adapter source | [CAP010-ROUTER], [CAP010-BOUNDARY], and [CAP010-PERSISTENCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Local records, queues, packet/recommendation builders, validators, and a persistence adapter exist. | `NONE_WITHIN_THIS_DIMENSION` | Adapter presence does not prove an available database or completed write. |
| `A9-CLM-010-BHT` | `A9-CAP-010` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP010-TEST] and `A9-TST-014` | Required A9 validation | `STATIC_CONFIGURATION` | Validation, minimization, manual routing, and unavailable persistence boundaries have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Tests do not prove live database effects. |
| `A9-CLM-010-LSH` | `A9-CAP-010` | `LOCAL_SHADOW` | `EVIDENCED` | App-local non-authoritative/manual posture | [CAP010-ROUTER], [CAP010-SAMPLE], and [CAP010-PERSISTENCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | App-local passalong queues and manual packet recommendations can be evaluated locally. | `NONE_WITHIN_THIS_DIMENSION` | Local boundary behavior does not automatically send or route. |
| `A9-CLM-010-DUR` | `A9-CAP-010` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Environment-dependent adapter boundary | [CAP010-PERSISTENCE] and [A4] | A9 cutoff | `DEFERRED` | Persistence code exists, but no direct current database availability, read, write, or durable-state receipt is observed. | Authenticated runtime evidence with exact environment and completed durable read/write receipt. | No persistence success or source-of-truth claim. |
| `A9-CLM-010-DEP` | `A9-CAP-010` | `DEPLOYED` | `UNAVAILABLE` | CI/preview boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed thread-memory/passalong capability is observed. | Exact deployed SHA and direct route/database capability observation. | No deployment or production claim. |
| `A9-CLM-010-CUS` | `A9-CAP-010` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible passalong capability is evidenced. | Direct authorized customer visibility and effect evidence. | No customer, disclosure, or routing effect. |
| `A9-CLM-011-DOC` | `A9-CAP-011` | `DOCUMENTED` | `EVIDENCED` | Static taxonomy declarations | [CAP011-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Work/Waves fields, statuses, decisions, alignments, and authority boundaries are documented. | `NONE_WITHIN_THIS_DIMENSION` | Taxonomy does not create Program or Work state. |
| `A9-CLM-011-IMP` | `A9-CAP-011` | `IMPLEMENTED` | `EVIDENCED` | Exported constants and formatter | [CAP011-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Static alignment objects and deterministic formatting exist. | `NONE_WITHIN_THIS_DIMENSION` | Implementation does not mutate Work DB or route work. |
| `A9-CLM-011-BHT` | `A9-CAP-011` | `BEHAVIORALLY_TESTED` | `EVIDENCED` | Focused bounded test | [CAP011-TEST] and `A9-TST-015` | Required A9 validation | `STATIC_CONFIGURATION` | Field, vocabulary, alignment, and boundary invariants have joined test coverage. | `NONE_WITHIN_THIS_DIMENSION` | Passing tests do not authorize Program transition. |
| `A9-CLM-011-LSH` | `A9-CAP-011` | `LOCAL_SHADOW` | `EVIDENCED` | In-process static taxonomy model | [CAP011-SOURCE] | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `STATIC_CONFIGURATION` | Taxonomy values can be evaluated and formatted locally without external effects. | `NONE_WITHIN_THIS_DIMENSION` | Local evaluation is not authoritative state. |
| `A9-CLM-011-DUR` | `A9-CAP-011` | `DURABLE_RUNTIME` | `UNAVAILABLE` | Static-versus-runtime boundary | [CAP011-SOURCE] | A9 cutoff | `DEFERRED` | No durable Work/Waves runtime is established by this taxonomy. | Direct authorized runtime and durable state-transition evidence. | No database, execution, or transition grant. |
| `A9-CLM-011-DEP` | `A9-CAP-011` | `DEPLOYED` | `UNAVAILABLE` | Deployment-evidence boundary | [A7] | A9 cutoff | `UNRESOLVED` | No exact deployed taxonomy capability is observed. | Exact deployed SHA and direct capability observation. | No deployment claim. |
| `A9-CLM-011-CUS` | `A9-CAP-011` | `CUSTOMER_VISIBLE` | `UNAVAILABLE` | Customer-evidence boundary | [A2] | A9 cutoff | `UNRESOLVED` | No customer-visible taxonomy surface is evidenced. | Direct authorized customer visibility evidence. | No customer or Program effect. |
<!-- A9_CLAIM_END -->

## 6. Behavioral-test join - exactly fifteen records

The commands are exact. `local_result` is updated only from the required A9
execution; each pass proves only the named bounded behavior.

<!-- A9_TEST_JOIN_START -->
| test_id | capability_id | exact_test_path | exact_command | local_result | bounded_behavior_proved | source_under_test | explicit_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `A9-TST-001` | `A9-CAP-001` | [CAP001-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/companyAssetDomainRegistry.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Registry display shape, taxonomy, evidence, and non-authoritative boundaries. | [CAP001-SOURCE] | No live registry, DNS, deployment, or authority proof. |
| `A9-TST-002` | `A9-CAP-002` | [CAP002-ADOPTION-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedPassalongRouteContractAdoption.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Passalong production-route adoption of governed contracts. | [CAP002-PASSALONG-COLLECTION-ROUTE] and [CAP002-PASSALONG-DETAIL-ROUTE] | No live persistence or route-authority proof. |
| `A9-TST-003` | `A9-CAP-002` | [CAP002-BOUNDARY-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedRouteBoundary.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Static route boundary and prohibited-import/claim assertions. | Governed route source paths in `A9-CAP-002` | Static source assertions are not runtime evidence. |
| `A9-TST-004` | `A9-CAP-002` | [CAP002-PARITY-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedRouteContractParity.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Independent response-contract parity across governed routes. | Contracts, oracles, decisions, and routes in `A9-CAP-002` | No provider, persistence, acceptance, or execution proof. |
| `A9-TST-005` | `A9-CAP-002` | [CAP002-DECISION-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedRouteDecisionSeam.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Deterministic extracted route-decision mappings. | [CAP002-PASSALONG-DECISION], [CAP002-MOTION-DECISION], and [CAP002-INFERENCE-DECISION] | No live route or external-effect proof. |
| `A9-TST-006` | `A9-CAP-002` | [CAP002-HANDLER-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/governedRouteHandlerBoundary.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Local route-handler request/response and non-authorization boundary. | [CAP002-LOCAL-HANDLER] | No production, customer, persistence, or provider proof. |
| `A9-TST-007` | `A9-CAP-003` | [CAP003-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/jaiControlThreadMotionProposal.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Proposal shape, rendering, and future-gated non-activation. | [CAP003-SOURCE] | No JAI Control Thread, Council, Agent, or provider activation. |
| `A9-TST-008` | `A9-CAP-004` | [CAP004-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/jaiPalette/sandboxAgentDraft.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Agent-class draft, compatibility, rendering, and blocked-authority invariants. | [CAP004-SOURCE] | No executable Agent or sandbox runtime. |
| `A9-TST-009` | `A9-CAP-005` | [CAP005-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/motionKernel/local-operating-loop.test.ts` | `PASS / exit 0 / explicit PASS / 2026-07-22T23:32:18Z` | Local-loop DTO, state, proof, response, recovery, explanation, confirmation, packet, artifact, and receipt contracts. | [CAP005-MODEL] and [CAP005-HANDLER] | No authenticated-browser, persistence, provider, customer, or external-effect proof. |
| `A9-TST-010` | `A9-CAP-006` | [CAP006-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/routePackets/supervisedRoutePacket.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Packet construction, rendering, lifecycle, guardrails, and manual-handoff posture. | [CAP006-SOURCE] | No send, import, dispatch, runtime, or acceptance effect. |
| `A9-TST-011` | `A9-CAP-007` | [CAP007-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Static sandbox surface, relationship, risk, and blocked-gate invariants. | [CAP007-SOURCE] | No live domain, sandbox runtime, provider, or activation. |
| `A9-TST-012` | `A9-CAP-008` | [CAP008-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/sandboxNexus/sandboxPacketControlSurface.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Packet-control draft, deterministic export, and non-effect boundaries. | [CAP008-SOURCE] | No persistence, transmission, delivery proof, or execution. |
| `A9-TST-013` | `A9-CAP-009` | [CAP009-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Receipt display shape, Markdown rendering, and non-authorization boundaries. | [CAP009-SOURCE] | No receipt ingestion, runtime, acceptance, or source-of-truth effect. |
| `A9-TST-014` | `A9-CAP-010` | [CAP010-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/threadMemory/passalong-local-boundary.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Passalong validation, minimization, manual routing, and unavailable-persistence boundary behavior. | [CAP010-TYPES], [CAP010-ROUTER], [CAP010-BOUNDARY], and [CAP010-PERSISTENCE] | No live database write, automatic route, or authority proof. |
| `A9-TST-015` | `A9-CAP-011` | [CAP011-TEST] | `corepack pnpm -C portal exec tsx src/lib/controlPlane/workWavesProgramTaxonomy.test.ts` | `PASS / exit 0 / 2026-07-22T23:32:18Z` | Taxonomy fields, vocabulary, alignment, formatting, and authority boundaries. | [CAP011-SOURCE] | No Work/Program mutation, route, transition, or activation. |
<!-- A9_TEST_JOIN_END -->

## 7. D2-D8 observation and delivery join - exactly seven records

Source heads, squashes, configured checks, founder observations, Control
acceptance, and current-main ancestry remain separate facts. A green check or
merge is never substituted for missing acceptance.

<!-- A9_OBSERVATION_DELIVERY_START -->
| event_id | lane | pr_or_non_pr_evidence | source_head | squash_or_UNAVAILABLE | configured_check_evidence | founder_observation | control_acceptance | current_main_relation | accepted_ceiling | unavailable_boundaries | authority_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A9-OBS-001` | `D2` | [PR382] | [D2-HEAD] | [D2-SQUASH] | role [D2-ROLE] PASS; portal [D2-PORTAL] PASS; [D2-VERCEL] PASS | `UNAVAILABLE / no durable founder observation required or located` | `UNAVAILABLE / merge and checks are not substituted` | `D2-SQUASH is an ancestor of 69ee1e0a059189c5014f048e991a4fc781a127b2` | `TESTED_LOCAL_SHADOW_PROVING_SEAM_ONLY` | Exact route and acceptance tokens; production/provider/persistence/customer effects. | Delivery and checks grant no acceptance, production, or activation. |
| `A9-OBS-002` | `D3` | `NON_PR / WORKFLOW_ONLY` via [A4], [A6], and [A7] | `UNAVAILABLE` | `UNAVAILABLE` | `N/A / observation-only non-PR evidence` | `HUMAN_OPERATOR product disposition REVISE; durable packet and exact founder token UNAVAILABLE` | `CT-2026-07-20-Q3M7Y26-P1-D3-ACCEPT-v0 / WORKFLOW_ONLY` | `NON_PR evidence; no repository head or squash relation asserted` | `FOUNDER_OBSERVATION_EVIDENCE_ONLY` | Durable founder packet, exact deployed SHA, and external-effect evidence. | Observation acceptance grants no implementation, customer, Batch exit, Program exit, or activation. |
| `A9-OBS-003` | `D4` | [PR384] | [D4-HEAD] | [D4-SQUASH] | role [D4-ROLE] PASS; portal [D4-PORTAL] PASS; [D4-VERCEL] PASS | `UNAVAILABLE / authenticated-browser focus and draft-preservation proof not claimed` | `CT-2026-07-21-Q3M7Y26-P1-D4-ACCEPT-v0 / WORKFLOW_ONLY` | `D4-SQUASH is an ancestor of 69ee1e0a059189c5014f048e991a4fc781a127b2` | `TESTED_MODEL_PLUS_STATIC_UI_ONLY` | Durable founder packet; runtime focus; production/customer/external effects. | Acceptance is bounded and grants no D5, runtime, deployment, or activation. |
| `A9-OBS-004` | `D5 initial plus D5R1-D5R3` | [PR385] and [PR386] | Initial [D5-INITIAL-HEAD]; final [D5-FINAL-HEAD] | Initial [D5-INITIAL-SQUASH]; final [D5-FINAL-SQUASH] | PR385 role [D5I-ROLE] PASS, portal [D5I-PORTAL] PASS, [D5I-VERCEL] PASS; PR386 role [D5F-ROLE] PASS, portal [D5F-PORTAL] PASS, [D5F-VERCEL] PASS | `UNAVAILABLE / no durable founder recovery packet located` | `UNAVAILABLE / D5R3 token is MIRROR_ONLY_TEXT and not acceptance` | `Both D5 squashes are ancestors of 69ee1e0a059189c5014f048e991a4fc781a127b2` | `TESTED_CLIENT_RECOVERY_CONTRACT_ONLY` | Durable founder packet and Control acceptance; exact deployed SHA; session/customer/external effects. | Two merged PRs and green checks do not manufacture acceptance or runtime credit. |
| `A9-OBS-005` | `D6 initial through D6R2` | [PR387] | [D6-FINAL-HEAD] | [D6-SQUASH] | role [D6-ROLE] PASS; portal [D6-PORTAL] PASS; [D6-VERCEL] PASS | Initial `REVISE` at `91300aa5e6055d30f28825f776b0e7f2f522d3e5`; PR mirror later reports `PASS / ACCEPT` at final head; durable packets/tokens UNAVAILABLE | `CT-2026-07-21-Q3M7Y26-P1-D6-ACCEPT-v0 / WORKFLOW_ONLY` | `D6-SQUASH is an ancestor of 69ee1e0a059189c5014f048e991a4fc781a127b2` | `TESTED_DETERMINISTIC_EXPLANATION_PLUS_RUNNING_OBSERVED_UI_ONLY` | Durable founder packets/tokens, exact deployed SHA, persistence/provider/customer/external effects. | Founder and Control dispositions are distinct; neither grants production or activation. |
| `A9-OBS-006` | `D7 initial through D7R1` | [PR388] | [D7-FINAL-HEAD] | [D7-SQUASH] | role [D7-ROLE] PASS; portal [D7-PORTAL] PASS; [D7-VERCEL] PASS | `CT-2026-07-21-Q3M7Y26-P1-D7-FOUNDER-OBSERVATION-v0 / occurrence only; durable packet and outcome UNAVAILABLE` | `CT-2026-07-21-Q3M7Y26-P1-D7-ACCEPT-v0 / WORKFLOW_ONLY` | `D7-SQUASH is an ancestor of 69ee1e0a059189c5014f048e991a4fc781a127b2` | `TESTED_DECISION_CONFIRMATION_PLUS_RUNNING_OBSERVED_UI_ONLY` | Durable founder packet/outcome, exact deployed SHA, customer/external effects. | Observation, acceptance, merge, and checks grant no decision execution or activation. |
| `A9-OBS-007` | `D8 initial through D8R2` | [PR389] | [D8-FINAL-HEAD] | [D8-SQUASH] | role [D8-ROLE] PASS; portal [D8-PORTAL] PASS; [D8-VERCEL] PASS | Initial `REVISE` at `8582dd8efdc9adef912a73e675627abec82adf1d`; re-observation `CT-2026-07-22-Q3M7Y26-P1-D8R2-FOUNDER-REOBSERVATION-v0` occurred; durable packet/outcome UNAVAILABLE | `CT-2026-07-22-Q3M7Y26-P1-D8-ACCEPT-v0 / WORKFLOW_ONLY` | `D8-SQUASH is an ancestor of 69ee1e0a059189c5014f048e991a4fc781a127b2`; no production-source changes after D8 through cutoff | `TESTED_RECEIPT_PLUS_RUNNING_OBSERVED_UI` | Durable re-observation packet/outcome, copied bytes, retention, exact deployed SHA, persistence/provider/customer/external effects. | Clipboard/focus observation and acceptance grant no disclosure, deployment, or activation. |
<!-- A9_OBSERVATION_DELIVERY_END -->

## 8. Overclaim and gap ledger - exactly eight records

<!-- A9_GAP_START -->
| gap_id | normalized_claim_pair | controlling_evidence | observed_status | relation | present_disposition | missing_proof | future_owner_or_lane | explicit_current_non_effect |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A9-GAP-001` | Source presence versus executable runtime | Current capability sources, [A2], and [A8] | `UNRESOLVED` | `does-not-supersede` | Source existence establishes only the documented/implemented dimension. | Direct authorized runtime invocation and effect receipt for each capability. | Future CONTROL_THREAD route under the governing Program when known. | No executable runtime or activation is granted. |
| `A9-GAP-002` | Behavioral tests versus live side effects | Fifteen joined tests, [A2], and [A4] | `UNRESOLVED` | `narrows` | Passing tests establish named deterministic behavior only. | Direct environment-bound effect evidence and telemetry. | `A11` only if separately routed for dependency/external-effect mapping; otherwise CONTROL_THREAD. | No persistence, provider, network, customer, or production effect is claimed. |
| `A9-GAP-003` | Route, auth, or Prisma presence versus durable persistence | [CAP002-PASSALONG-COLLECTION-ROUTE], [CAP005-ROUTE], [CAP010-PERSISTENCE], and [A4] | `DEFERRED` | `does-not-supersede` | Code paths and schemas/adapters do not prove database availability or completed durable writes. | Exact environment, authenticated request, completed write/read, and durable-state receipt. | `A11` only if separately routed; persistence owner otherwise `UNRESOLVED`. | No durable persistence or source-of-truth effect. |
| `A9-GAP-004` | CI/Vercel success versus exact deployed or customer capability | [A7] and D2-D8 join | `UNRESOLVED` | `phase-bounds` | Checks and preview statuses remain head/PR specific and mechanical. | Exact deployed SHA, environment identity, direct capability observation, and customer boundary. | Deployment owner `UNRESOLVED`; future CONTROL_THREAD route required. | No production deployment, customer visibility, or readiness claim. |
| `A9-GAP-005` | Founder preview observation versus current-main production behavior | [A4], [A7], and D3-D8 join | `RATIFIED_PHASE_SPECIFIC` | `phase-bounds` | Founder evidence remains bound to its preview/session/head and stated ceiling. | Exact current deployed SHA plus a separately routed current-main observation. | `A10` only if later routed for founder workflow/surface mapping; otherwise CONTROL_THREAD. | No inference from preview to current production or customers. |
| `A9-GAP-006` | Local-shadow or clipboard behavior versus external execution or disclosure | [CAP005-MODEL], D8 observation evidence, and [A4] | `UNRESOLVED` | `narrows` | Static exclusion and observed focus/copy-control behavior do not verify copied bytes, retention, paste, or external effects. | Direct separately authorized clipboard/external-effect evidence without secret exposure. | `A11` only if separately routed; privacy/security owner otherwise `UNRESOLVED`. | No disclosure, transmission, persistence, provider, or execution claim. |
| `A9-GAP-007` | `live`, Agent, or Council labels versus activation | [CAP003-SOURCE], [CAP004-SOURCE], [CAP007-SOURCE], and [A8] | `DEFERRED` | `does-not-supersede` | Labels and candidate metadata remain static/future-gated declarations. | Fresh HUMAN_OPERATOR authority, governing Program, implementation, safety evidence, and activation receipt. | HUMAN_OPERATOR and future governing CONTROL_THREAD route. | No Agent, Council, provider, runtime, or JAI activation. |
| `A9-GAP-008` | Documentation, mirror, PR, check, or merge evidence versus acceptance or authority | [A2], [A4], [A7], and [A8] | `ACCEPTED_CURRENT` | `records-later-event` | Repository and mirror events record bounded facts; missing decisions remain missing and later delivery does not replace authority evidence. | Exact independent verification and CONTROL_THREAD acceptance for the exact head when required. | Separately routed `JAI::DEV::VERIFIER`, then CONTROL_THREAD. | No self-verification, self-acceptance, merge authority, downstream route, or activation. |
<!-- A9_GAP_END -->

## 9. Current A9 envelope - exactly one record

<!-- A9_CURRENT_ENVELOPE_START -->
| envelope_id | exact_route | work_packet | coordinate | role | repository | exact_base | branch | allowlist | mode | evidence_ceiling | state | commit_sha | pr_number | checks | independent_verification | acceptance | merge | capability_credit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A9-ENV-001` | `CT-2026-07-22-Q3M7Y26-P1-START-A9-RUNNABLE-CAPABILITY-INVENTORY-v0` | `Q3M7Y26-P1-A9-v0` | `Q3M7Y26-P1:A9` | `JAI::DEV::BUILDER` | `jai-nexus/dev-jai-nexus` | `69ee1e0a059189c5014f048e991a4fc781a127b2` | `docs/q3m7y26-p1-a9-runnable-capability-inventory-v0` | `docs/reference/q3m7y26-p1-a9-runnable-capability-inventory-v0.md` | `ONE_PATH / DOCUMENTARY / NO_RUNTIME / DRAFT_PR_ONLY` | `DOCUMENTATION_RUNNABLE_CAPABILITY_INVENTORY_ONLY` | `ROUTED_CURRENT / NOT_DELIVERED / NOT_VERIFIED / NOT_ACCEPTED` | `NOT_RECORDED` | `NOT_RECORDED` | `NOT_RECORDED` | `NOT_RECORDED` | `NOT_RECORDED` | `NOT_RECORDED` | `NONE` |
<!-- A9_CURRENT_ENVELOPE_END -->

The envelope intentionally excludes A9's future commit, PR, configured checks,
independent verification, acceptance, merge, and capability credit. Those
events cannot become recursive evidence inside the artifact they evaluate.

## 10. Mechanical invariants and evidence limitations

| Invariant | Required result |
| --- | --- |
| Capability-family records | `11 unique` |
| Dimension claims | `77 unique / complete 11 x 7 matrix` |
| Behavioral-test joins | `15 unique / every required test exactly once` |
| D2-D8 observation/delivery records | `7 unique` |
| Overclaim/gap records | `8 unique` |
| Current route envelopes | `1 unique` |
| Duplicate IDs | `0` |
| Orphan claims or joins | `0` |
| Unknown A2 statuses or relations | `0` |
| Unavailable dimensions without named missing evidence | `0` |
| Flat global runnable verdicts | `0` |
| Positive persistence, provider, customer, Agent, Council, runtime, or activation grants | `0` |
| Immutable SHA/path resolution | `PASS / 50 pinned blobs and 14 pinned commits resolved` |
| Fifteen local focused tests | `PASS / 15 of 15 exit 0 at 2026-07-22T23:32:18Z; local operating-loop test explicitly printed PASS` |

The inventory does not inspect browser/live runtime, organization-wide or
external-repository capability, A10 founder workflow/navigation/terminology,
A11 dependency/external effects, or A12 Linear drift. Missing evidence is not
filled by inference. Vercel status is not treated as an exact deployed SHA,
and founder preview evidence remains phase-bound.

## 11. Risks, rollback, and explicit non-authorizations

Risk is limited to documentary misclassification, incomplete or stale joins,
incorrect immutable provenance, and overclaiming runtime, deployment,
customer, persistence, provider, or external-effect evidence. Rollback is a
normal revert of the eventual single documentary commit. No runtime, data,
provider, workflow, package, schema, authentication, deployment, or external
system rollback is required.

This artifact does not authorize or perform:

- acceptance, independent verification, ready conversion, merge, deployment,
  branch deletion, Linear mutation, source-of-truth transfer, or ownership;
- A10, A11, A12, D9, Batch B, Batch C, Batch A exit, Batch D exit, Program
  transition, or Program exit;
- source, test, UI, route, auth, middleware, workflow, package, dependency,
  schema, Prisma, persistence, provider/model/API, customer, or runtime change;
- GitHub/Linear side effects beyond the separately authorized A9 Draft-PR
  delivery envelope;
- Agent, Council, provider, runtime, production, customer, external-effect, or
  JAI activation.

`A9_MAXIMUM_CURRENT_CREDIT: DOCUMENTATION_RUNNABLE_CAPABILITY_INVENTORY_ONLY`

`A9_ACCEPTANCE: NOT_ACCEPTED / PENDING_INDEPENDENT_VERIFICATION`

`A9_MERGE_AUTHORITY: NOT_GRANTED`

`A10_EXECUTION_AUTHORITY: NOT_GRANTED`

`BATCH_A_EXIT_CREDIT: NONE`

`BATCH_B_EXECUTION_AUTHORITY: NOT_GRANTED`

`D9_EXECUTION_AUTHORITY: HELD_PENDING_ACCEPTED_BATCH_B`

`BATCH_D_EXIT_CREDIT: NONE`

`PROGRAM_EXIT_CREDIT: NONE`

`JAI_ACTIVATION_CREDIT: NONE`

`NEXT_REQUIRED_DECISION: ACCEPT_A9_BUILDER_PR_FOR_INDEPENDENT_VERIFICATION`

[A2]: https://github.com/jai-nexus/dev-jai-nexus/blob/c7eb9fcda25e9606dd552c63d82f08dc6a8df6eb/docs/reference/q3m7y26-p1-a2-authority-evidence-precedence-contradiction-ledger-v0.md
[A4]: https://github.com/jai-nexus/dev-jai-nexus/blob/2160fc4e3feaa1d5d4bc110e6f9f5498a9a4545e/docs/reference/q3m7y26-p1-a4-ratified-motion-decision-registry-v0.md
[A5]: https://github.com/jai-nexus/dev-jai-nexus/blob/933108807587e3cdd03fb439edbc6755a7dd6b97/docs/reference/q3m7y26-p1-a5-active-frozen-program-registry-v0.md
[A6]: https://github.com/jai-nexus/dev-jai-nexus/blob/6c4e69adfdb9cbf2a6ce3138dd3fe9ddeaf1c24e/docs/reference/q3m7y26-p1-a6-control-coordinate-registry-v0.md
[A7]: https://github.com/jai-nexus/dev-jai-nexus/blob/945d27f8857e14afda7780e1442dc8b277f94dca/docs/reference/q3m7y26-p1-a7-pr-commit-evidence-ledger-v0.md
[A8]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/docs/reference/q3m7y26-p1-a8-governance-role-route-reconciliation-v0.md
[CAP001-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/companyAssetDomainRegistry.ts
[CAP001-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/companyAssetDomainRegistry.test.ts
[CAP002-PASSALONG-CONTRACT]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routeContracts/passalongResponses.ts
[CAP002-MOTION-CONTRACT]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routeContracts/motionIntakeResponses.ts
[CAP002-INFERENCE-CONTRACT]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routeContracts/manualInferenceResponses.ts
[CAP002-PASSALONG-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routeDecisions/passalongRouteDecisions.ts
[CAP002-MOTION-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routeDecisions/motionIntakeRouteDecisions.ts
[CAP002-INFERENCE-DECISION]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routeDecisions/manualInferenceRouteDecisions.ts
[CAP002-LOCAL-HANDLER]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/motionKernel/local-operating-loop-handler.ts
[CAP002-PASSALONG-COLLECTION-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/operator/control-thread/passalongs/route.ts
[CAP002-PASSALONG-DETAIL-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/operator/control-thread/passalongs/%5BpassalongId%5D/route.ts
[CAP002-MOTION-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/operator/motion-control/motion-intake/route.ts
[CAP002-INFERENCE-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/operator/motion-control/manual-inference/route.ts
[CAP002-ADOPTION-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/governedPassalongRouteContractAdoption.test.ts
[CAP002-BOUNDARY-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/governedRouteBoundary.test.ts
[CAP002-PARITY-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/governedRouteContractParity.test.ts
[CAP002-DECISION-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/governedRouteDecisionSeam.test.ts
[CAP002-HANDLER-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/governedRouteHandlerBoundary.test.ts
[CAP003-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/jaiControlThreadMotionProposal.ts
[CAP003-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/jaiControlThreadMotionProposal.test.ts
[CAP004-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.ts
[CAP004-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.test.ts
[CAP005-MODEL]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/motionKernel/local-operating-loop.ts
[CAP005-HANDLER]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/motionKernel/local-operating-loop-handler.ts
[CAP005-ROUTE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/api/operator/motion-control/local-operating-loop/route.ts
[CAP005-PANEL]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/operator/motion-control/LocalOperatingLoopPanel.tsx
[CAP005-COMPOSER]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx
[CAP005-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/motionKernel/local-operating-loop.test.ts
[CAP006-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routePackets/supervisedRoutePacket.ts
[CAP006-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/routePackets/supervisedRoutePacket.test.ts
[CAP007-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts
[CAP007-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts
[CAP008-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/sandboxNexus/sandboxPacketControlSurface.ts
[CAP008-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/sandboxNexus/sandboxPacketControlSurface.test.ts
[CAP009-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.ts
[CAP009-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.test.ts
[CAP010-TYPES]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/threadMemory/types.ts
[CAP010-SAMPLE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/threadMemory/sample-data.ts
[CAP010-ROUTER]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/threadMemory/passalong-router.ts
[CAP010-BOUNDARY]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/threadMemory/passalong-persistence-boundary.ts
[CAP010-PERSISTENCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/threadMemory/passalong-persistence.ts
[CAP010-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/threadMemory/passalong-local-boundary.test.ts
[CAP011-SOURCE]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts
[CAP011-TEST]: https://github.com/jai-nexus/dev-jai-nexus/blob/69ee1e0a059189c5014f048e991a4fc781a127b2/portal/src/lib/controlPlane/workWavesProgramTaxonomy.test.ts
[PR382]: https://github.com/jai-nexus/dev-jai-nexus/pull/382
[PR384]: https://github.com/jai-nexus/dev-jai-nexus/pull/384
[PR385]: https://github.com/jai-nexus/dev-jai-nexus/pull/385
[PR386]: https://github.com/jai-nexus/dev-jai-nexus/pull/386
[PR387]: https://github.com/jai-nexus/dev-jai-nexus/pull/387
[PR388]: https://github.com/jai-nexus/dev-jai-nexus/pull/388
[PR389]: https://github.com/jai-nexus/dev-jai-nexus/pull/389
[D2-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/12a50e8c2502bf771005ddebbbc9f6b3dc2fdc74
[D2-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/1b1dcd3251092f193440d92406a09c2294f81701
[D2-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29703990408
[D2-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29703990388
[D2-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/AQnRYRsHeCM6HHmgtFg2LmPEpAJg
[D4-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/b07b9368694d315344f2089f2299cf04bccf1d3e
[D4-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/3417f02e000fec3a995e871dd8ad20f157cdbdd7
[D4-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29792750572
[D4-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29792750556
[D4-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/2UBKHqWF8JWCMiDVJQJoWs7KzBXe
[D5-INITIAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/1f1949eec2fd66e5967444ec6d56d76dddc98638
[D5-FINAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/e1582f0450bb7bb3a398c2332749b815ec80face
[D5-INITIAL-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/d186596f285334b6184b3a185c1acda841ab294a
[D5-FINAL-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/f7f848a5a7bf97abd969e709832d5c1e0df77ba5
[D5I-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29800956871
[D5I-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29800687524
[D5I-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/6RcP8ckdYCvEs7JRY6VPwdSL2Nxn
[D5F-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29825149597
[D5F-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29825002666
[D5F-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/4ZVF6j6cLigWqKCBAB9BVGtFHZ35
[D6-FINAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/d980fec50fd8ede7d6057f68b21d80ac0313ac85
[D6-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/e41d0f3308c493953662ce9a76737a191f6d1baa
[D6-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29871977183
[D6-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29870661171
[D6-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/3kEzw1uxDcYfg4G53BidD4bsrVvp
[D7-FINAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/cd689fea19c7ef47a9e2eea40bcc4d4835b27e6d
[D7-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/8bb41ab7e83beb36196df08275976afacca620ef
[D7-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29876294115
[D7-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29876156496
[D7-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/8UP7iDif5Wt4wfcHmAsS9DPKNjhA
[D8-FINAL-HEAD]: https://github.com/jai-nexus/dev-jai-nexus/commit/4b2915677fdaf7d4990cba4a351384820002bc7e
[D8-SQUASH]: https://github.com/jai-nexus/dev-jai-nexus/commit/a1194b820a126b23bc1ac992f8d4271acfbfde08
[D8-ROLE]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29887663386
[D8-PORTAL]: https://github.com/jai-nexus/dev-jai-nexus/actions/runs/29887538382
[D8-VERCEL]: https://vercel.com/jai-nexus/dev-jai-nexus/B1gx4BGbuFFUqvuunyLKJa2Qe5Zz

# A43 Governed Control Plane Shared Response-Contract / Parity Mechanism Design v0

## Role

Role: `JAI::DEV::BUILDER`

## 1. Design scope

A43 selects the canonical ownership architecture for import-safe route-response contracts and designs independent parity enforcement, normalized provider/persistence adapter results, route-specific status/body unions, and the sequence for later production adoption. It is docs/reference design-only. It does not implement contracts, tests, decisions, adapters, route wiring, runtime behavior, providers, persistence, or model-slot governance.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A42 and routed A43 because current A41 helper parity is exact by source inspection but not independently drift-controlled. A43 must choose one architecture before direct route wiring can be considered. CONTROL_THREAD remains the only acceptance and routing authority; A43 grants no implementation or activation authority.

## 3. A42 GitHub and artifact basis

| Artifact / source | Grounding | Role in A43 | Boundary |
|-------------------|-----------|-------------|----------|
| PR 367 | CONTROL_THREAD-provided GitHub record | Accepted A42 review baseline | No GitHub API or `gh` use in A43. |
| A42 initial commit `2c85c63b92b342d071c54c54ffa155cdc5351314` | CONTROL_THREAD-provided | Original post-implementation review | Evidence only. |
| A42 evidence-finalization commit `0e55ef22eb5e11cd9e85d1c7937a3c94070511f4` | CONTROL_THREAD-provided | Durable validation wording | Evidence only. |
| A42 squash `b5e145f7b45e262bf4a24c1ff7132744f3103616` | Present on local `main` | Actual accepted artifact basis | Source-grounded. |
| A42 review artifact | Inspected locally | Findings, risks, and A43 recommendation | Review evidence, not implementation authority. |
| A41 source/test set | Inspected locally | Current helper, type, and test topology | No source/test mutation in A43. |

## 4. Problem statement

Four route-specific non-authorization contracts currently have more than one owner: passalong has thread-memory and route-decision copies, while motion-intake and both manual-inference contracts are inline in routes and copied into route decisions. A41 tests import the same helper-owned constants they expect, so those assertions cannot independently detect contract drift. Broad optional adapter/result types also permit contradictory states and untie status codes from body variants. Production route adoption must not proceed until one import-safe production owner, an independent oracle, normalized discriminated results, and explicit route-adoption evidence are designed.

## 5. Accepted findings from A42

- A41 matches A39/A40 as isolated helper/test evidence.
- Current passalong, motion-intake, and manual-inference response parity is confirmed by source inspection.
- A41 remains free of route, Next, server-only, Prisma, environment, provider, and network imports.
- Per-participant connector statuses remain distinct.
- Four route-specific non-authorization contracts have duplicated ownership.
- Current helper tests do not independently detect route-contract drift.
- Adapter/result types are import-safe but too broad for production adoption.
- Several exact-key, success, and persistence paths remain untested.
- Direct route-file wiring is premature.
- A shared response-contract/parity mechanism must precede route adoption.

## 6. Files inspected

| Area | Files / paths | Design relevance |
|------|---------------|------------------|
| Accepted A42 | `docs/reviews/A42_GOVERNED_CONTROL_PLANE_EXTRACTED_ROUTE_DECISION_SEAM_POST_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md` | Accepted findings, drift risk, validation grounding. |
| A39/A40 basis | Extracted-seam design and implementation-boundary review | Import-safe and route/server boundaries. |
| A41 implementation | `governedRouteDecisionSeam.test.ts`; `routeDecisions/**` | Current contract copies, behavior, broad types, and tests. |
| Production routes | Passalong collection/detail, motion-intake, manual-inference routes | Current transport contracts and server wiring. |
| Passalong domain | `threadMemory/index.ts`, persistence boundary, persistence implementation, types, tests | Current passalong constant, records, status, barrel, Prisma boundary. |
| Motion/manual domain | Relevant `motionKernel/**` types, intake builders/persistence, history builder/persistence, provider config/connector, barrel | Domain records, server-only reachability, current result semantics. |
| A35/A31 static basis | Route harness, local seam test, `governedRouteBoundary.test.ts` | Existing local adapters, assertions, and source-reading adoption pattern. |
| Import topology | `portal/tsconfig.json`, `portal/package.json`, control-plane barrels | Alias resolution, scripts, broad-barrel risk. |

## 7. Current contract ownership map

| Contract family | Current owner | Current consumers | Current risk |
|-----------------|---------------|-------------------|--------------|
| Passalong persistence non-authorizations | Thread-memory persistence boundary plus copied route-decision constant | Persistence implementation, routes, domain tests, decision helpers/tests | Two production-looking owners can diverge. |
| Passalong statuses/bodies/errors | Inline routes plus decision-helper types/string | Routes and decision helper | No canonical transport type; status/body relation is implicit. |
| Motion-intake non-authorizations | Inline route function plus copied route-decision constant | Route and decision helper/test | Silent drift possible. |
| Motion-intake statuses/bodies/error | Inline route plus decision-helper types/string | Route and decision helper | No independently owned response contract. |
| Manual response non-authorizations | Inline route plus copied route-decision constant | Route and helper/test | Silent drift possible. |
| Manual history non-authorizations | Inline route history input plus copied route-decision constant | Route and helper/test | Silent drift possible. |
| Manual statuses/bodies | Inline route plus helper-local generic body | Route and helper | Broad generic fields; no canonical key-set owner. |
| Adapter results | Domain/server types, A35 seam shapes, and broad A41 structural types | Routes, helpers, tests | Optional fields permit incompatible states. |

## 8. Design objectives

- Establish one import-safe production owner for every contract-significant response value and type.
- Preserve current status, body, key, error, and non-authorization behavior unless separately routed.
- Keep domain records and persistence/provider implementations in their existing domain/server layers.
- Prevent route contracts from importing routes, Next, domain barrels, server-only modules, Prisma, environment, providers, or network clients.
- Use route-specific discriminated unions to make contradictory status/body/result states unrepresentable.
- Preserve a literal independent test oracle that intentionally does not derive expected values from production constants.
- Separate contract extraction from route adoption and from future runtime evidence.
- Make static evidence precise without overstating it as route execution.

## 9. Non-objectives

A43 does not implement files, move constants, modify routes, update tests, change response semantics, expose persistence metadata, activate providers, redesign motion/model-slot governance, add packages or generators, execute route exports, or prove Next/deployed runtime behavior.

## 10. Architecture options evaluated

| Option | Description | Advantages | Risks | Decision |
|--------|-------------|------------|-------|----------|
| A | Dedicated import-safe `routeContracts/**` leaf layer | Clear transport ownership; independent of behavior and domains; safe explicit imports; supports routes/helpers/tests | Requires staged migration and temporary reviewed aliases/copies | `canonical-owner-selected` |
| B | `routeDecisions/**` owns contracts and behavior | Fewer directories; helpers already consume values | Couples contract validity to helper implementation; encourages self-referential tests; name obscures canonical role | `canonical-owner-rejected` |
| C | Domain modules retain/receive transport contracts | Domain proximity; passalong has an existing constant | Fragmented HTTP ownership; motion/manual lack natural owners; broad motion barrel reaches server-only modules | `canonical-owner-rejected` |
| D | Generated manifests/build extraction | Could mechanically synchronize sources | Adds generators, mutation, package/build complexity, and hidden failure modes without need | `canonical-owner-rejected`; `out-of-scope` |
| E | Duplicated production contracts plus scanner | Minimal initial movement | Scanner is brittle; multiple production owners remain; values can drift semantically | `canonical-owner-rejected`; fallback test-oracle concept only |

## 11. Selected canonical ownership architecture

Select Option A: `portal/src/lib/controlPlane/routeContracts/**` becomes the sole production owner of route-facing status/body types, exact route errors, route-specific non-authorization arrays, decision snapshot unions, and normalized adapter boundary types.

This is `canonical-owner-selected`, `single-source-production-contract`, and `import-safe-leaf-module-required`.

Route contracts remain generic over domain payloads and do not import thread-memory or motion-kernel types. Domain modules continue to own records, validation, transformations, persistence repositories, provider connectors, and safe provider status implementation. Decision helpers import contract leaves and own pure mapping behavior. Routes later import explicit contract/helper leaves while retaining parsing, `NextResponse`, runtime declarations, dynamic params, and server-only adapter calls.

## 12. Rejected architecture options

- Option B is rejected because response contracts must remain meaningful even if decision-helper implementation is replaced; helper-owned expectations preserve the current self-reference problem.
- Option C is rejected because HTTP transport semantics cross passalong, motion, and manual inference, while motion-kernel's barrel currently re-exports server-only persistence/history modules.
- Option D is rejected because no scale or schema complexity justifies code generation, build mutation, scripts, or dependencies.
- Option E is rejected for production ownership. Literal duplication is retained only in a separately reviewed test oracle where divergence is intentional and detectable.

## 13. Proposed import-safe module topology

| Proposed module | Owned contract | Permitted imports | Prohibited imports |
|-----------------|----------------|-------------------|--------------------|
| `routeContracts/decisionSnapshot.ts` | Generic `{ status, body }` structural base | Type-only local contract leaves | Routes, Next, domains, server-only modules |
| `routeContracts/passalongResponses.ts` | Passalong status/body unions, errors, non-authorizations | `decisionSnapshot.ts` type-only | Thread-memory, persistence, route decisions, routes |
| `routeContracts/motionIntakeResponses.ts` | Motion-intake status/body unions, error, non-authorizations | `decisionSnapshot.ts` type-only | Motion-kernel, routes, server-only modules |
| `routeContracts/manualInferenceResponses.ts` | Manual response body/status and response non-authorizations | `decisionSnapshot.ts` type-only | Provider config/connector, motion-kernel barrel, routes |
| `routeContracts/manualInferenceHistory.ts` | History-input contract and history non-authorizations | Local pure types only | Persistence/history implementation, Prisma |
| `routeContracts/adapters/passalong.ts` | Normalized list/write result unions | Local pure types only | Passalong persistence implementation |
| `routeContracts/adapters/motionIntake.ts` | Persisted/blocked-preview result unions | Local pure types only | Motion persistence implementation |
| `routeContracts/adapters/manualInference.ts` | Provider and history result unions | Local pure types only | Provider connector/config, history persistence |
| `routeContractOracles/*.ts` | Test-only literal statuses, keys, errors, arrays | No production contract value imports | Production use, routes, server-only modules |

## 14. Leaf-import and barrel policy

No `routeContracts/index.ts` barrel is permitted initially. Routes, decision helpers, adapters, and tests use explicit leaf imports. This prevents accidental family coupling and makes import scans legible. A future barrel requires separate review, must export only pure leaves, and must not become the recommended import path until transitive safety is proven. Type-only imports use `import type`; value constants use direct leaf imports. `routeContracts/**` must never import `routeDecisions/**`, a route, thread-memory, motion-kernel, or any control-plane barrel. These rules prevent circular imports and classify current broad domain barrels as `barrel-import-risk`.

## 15. Contract taxonomy

| Contract class | Purpose | Canonical owner | Must not contain |
|----------------|---------|-----------------|------------------|
| Transport response contract | Exact HTTP-facing body/status relationship | Route-contract response leaf | Request parsing, Next objects, DB/provider calls |
| Domain record | Business/domain data | Thread-memory or motion-kernel | HTTP status or Next response semantics |
| Persistence adapter result | Normalized outcome supplied to decisions | Route-contract adapter leaf | Prisma client, ambient DB access |
| Provider adapter result | Explicit dispatch/config outcome | Manual adapter leaf | Credentials, client instances, environment reads |
| Decision snapshot | Pure mapped status/body value | Response leaf using common structural type | Side effects or authority claims |
| Route error contract | Contract-significant exact error value | Relevant response leaf | Internal exceptions or secret-bearing diagnostics |
| Non-authorization contract | Exact route-family negative authority array | Relevant response/history leaf | Positive grants or mutable global state |
| Test oracle | Independent expected literals/key lists | `routeContractOracles/**` | Imports of production contract values |
| Route-adoption assertion | Static proof of approved imports/calls | Dedicated static test | Route execution or server-only mocking |
| Runtime integration evidence | Executed route/runtime behavior | Separately routed future lane | Claims based only on static/type evidence |

## 16. Passalong response-contract design

| Path | Status union | Body contract | Adapter input | Non-authorization owner |
|------|--------------|---------------|---------------|-------------------------|
| Collection list | `200` | `{ ok, records, persistence, nonAuthorizations }` | `PassalongListResult<Record>` available/unavailable union | `passalongResponses.ts` |
| Invalid create | `400` | `{ ok: false, error, errors, nonAuthorizations }` | Validation failure value; no persistence input | `passalongResponses.ts` |
| Persistence create | `200 | 400` | Success has record/ok true; failed/unavailable has record null/ok false; both retain exact key set | `PassalongWriteResult<Record>` union | `passalongResponses.ts` |
| Detail method not allowed | `405` | `{ ok: false, error, nonAuthorizations }` | None | `passalongResponses.ts` |
| Detail patch | `200 | 400` | Same normalized write-body variants as persistence create | `PassalongWriteResult<Record>` union | `passalongResponses.ts` |

The exact validation-blocked and method-not-allowed strings become constants in `passalongResponses.ts`. The union ties `record`, `ok`, and status together. Failed and unavailable writes remain distinct adapter variants even if both map to HTTP 400.

## 17. Motion-intake response-contract design

| Path | Status union | Body contract | Adapter input | Non-authorization owner |
|------|--------------|---------------|---------------|-------------------------|
| List | `200` | `{ ok: true, records, motionBases, nonAuthorizations }` | Explicit records and bases | `motionIntakeResponses.ts` |
| Missing draft | `400` | `{ ok: false, error, nonAuthorizations }` | Missing-draft decision | `motionIntakeResponses.ts` |
| Successful create | `200` | `{ ok: true, record, motionBasis, nonAuthorizations }` | Persisted or explicitly blocked-preview record result plus basis | `motionIntakeResponses.ts` |

Record construction and `buildMotionFromMotionIntakeRecord` remain motion-kernel domain responsibilities. Persistence remains a server-adapter responsibility. The normalized adapter distinguishes durable persistence from blocked/unavailable preview records, while the current transport contract continues to exclude persistence metadata. Changing that response would require a separate contract-change lane.

## 18. Manual-inference response-contract design

| Contract item | Proposed type/owner | Input boundary | Evidence requirement |
|---------------|---------------------|----------------|----------------------|
| HTTP status/body | `ManualInferenceDecision<...>` in `manualInferenceResponses.ts`, status `200` | Pure mapped values | Exact literal oracle and typecheck |
| Global provider status | Generic safe status field in response contract | Normalized provider summary | Oracle checks key/value preservation |
| Connector statuses | Array of `{ roleSlotId, status, nonAuthorityDisclaimer }` | Per-participant normalized connector results | At least two distinct synthetic variants |
| Participant outputs | Generic output array | Domain/provider adapter output | Identity/deep-equality checks |
| Aggregate ratification | Generic aggregate value | Motion-kernel output | Exact preservation check |
| Evidence pointers | Generic pointer array | Selected motion | Exact preservation check |
| Persistence field | Exact `{ id, status, safeAdvisoryMessage, createdAt? }` contract | Normalized history result | Persisted and blocked/unavailable variants |
| Response non-authorizations | Canonical constant in response leaf | No caller override in normal production path | Oracle literal equality |

Provider summary and participant connector outcomes remain separate. A global status must never be expanded into participant statuses. Non-dispatch and executed production values use separate discriminants; provider execution remains outside the contract and decision layers.

## 19. Manual-inference history contract design

`manualInferenceHistory.ts` owns the exact history-input fields and history-specific non-authorization array. The type remains generic over provider status, participant output, aggregate ratification, and evidence pointer values so it does not import motion-kernel. The history builder/decision maps normalized values into this contract. The server-only history repository receives the resulting value. Persistence implementation types remain in motion-kernel; HTTP response types remain in `manualInferenceResponses.ts`.

History input is not an HTTP response and must not be collapsed into the manual response body. Its source mode should be a literal union matching currently supported values. Its non-authorizations are canonical and not caller-selected in the normal production constructor.

## 20. Route-specific non-authorization ownership

| Contract family | Current owner | Proposed owner | Migration posture |
|-----------------|---------------|----------------|-------------------|
| Passalong persistence response | Thread-memory plus route-decision copy | `routeContracts/passalongResponses.ts` | A44 establishes constant; thread-memory may temporarily re-export the exact value, then consumers migrate. |
| Motion-intake response | Inline route plus route-decision copy | `routeContracts/motionIntakeResponses.ts` | A44 moves helper ownership; A47 removes route-local function. |
| Manual-inference response | Inline route plus route-decision copy | `routeContracts/manualInferenceResponses.ts` | A44 moves helper ownership; A47 removes inline route array. |
| Manual-inference history | Inline route plus route-decision copy | `routeContracts/manualInferenceHistory.ts` | A44 moves builder ownership; A47 removes inline route array. |

A compatibility re-export is acceptable only when it references the canonical value and is marked temporary in the reviewed migration; copied literals are `uncontrolled-production-duplication` and prohibited after adoption.

## 21. Error-string ownership

Contract-significant error strings are canonical constants in their route-family response leaves. This includes passalong invalid-create, passalong detail method-not-allowed, and motion-intake missing-draft messages. Internal validation/persistence/provider diagnostics remain domain/server concerns and must not be promoted into transport constants. Independent oracles duplicate exact public strings deliberately.

## 22. Status and response-body union design

| Route family | Status type | Body union | Invalid states prevented |
|--------------|-------------|------------|--------------------------|
| Passalong list | `200` | Available/unavailable body mapping under one exact key set | Non-200 list snapshot; missing persistence summary |
| Passalong create | `200 | 400` | Invalid-input, write-success, write-failure/unavailable | 200 with null record; invalid body with record/persistence; 400 success |
| Passalong detail | `405` GET; `200 | 400` PATCH | Method error or normalized write union | GET success; PATCH 200 with null record |
| Motion intake | `200` GET; `400 | 200` POST | List, missing-draft, create-success | Missing draft 200; success body with persistence metadata |
| Manual inference | `200` | One exact generic response body | Missing required connector/output/persistence fields; alternate status without design |

Each route family receives `route-specific-status-union-required` and `route-specific-body-union-required`. Decision functions return the concrete family union, not unrestricted `RouteDecisionSnapshot<Body>` with arbitrary `number`.

## 23. Provider adapter normalization

| Result variant | Required fields | Prohibited contradictions | Boundary |
|----------------|-----------------|---------------------------|----------|
| `provider_disabled` | `dispatchAttempted: false`, `networkAccessRequired: false`, disabled safe status, disclaimer | Configured/executed status; provider result marked dispatched | Local or production safe fallback value |
| `provider_configuration_missing` | False/false flags, config-missing safe status, disclaimer | Credential exposure; executed participant result | Local or production safe fallback value |
| `provider_not_dispatched_error` | False/false flags, unsupported/call-time-missing safe status, fallback output, disclaimer | Network/execution claim | Server adapter value only |
| `provider_executed` | `dispatchAttempted: true`, `networkAccessRequired: true`, explicit `outcome: succeeded | failed | malformed`, status, participant output, disclaimer | Disabled/config-missing mode; absent output/fallback semantics | Future production type only; no A43 execution |

Participant connector results retain their own discriminant and role slot. The provider summary is derived explicitly, not used to synthesize every participant status. Credentials and raw environment data never appear in normalized values. This is `normalized-adapter-required` and `discriminated-union-required`.

## 24. Persistence adapter normalization

| Result variant | Required fields | Prohibited contradictions | Boundary |
|----------------|-----------------|---------------------------|----------|
| Passalong list `available` | records, safe message | unavailable flag or unavailable-only error state | Server adapter output |
| Passalong list `unavailable` | empty records, safe message, reason | available true | Server/local seam output |
| Passalong write `succeeded` | record, empty errors, safe message | null record or unavailable kind | Server adapter output |
| Passalong write `failed` | null record, errors, safe message | success status/record | Validation/persistence failure |
| Passalong write `unavailable` | null record, errors, safe message | available record | Server/local seam output |
| Motion intake `persisted` | durable record | blocked/unavailable advisory kind | Server adapter output |
| Motion intake `blocked_preview` | non-authoritative preview record, safe message | durable claim | Explicit current fallback mapping |
| Motion intake `unavailable_preview` | non-authoritative preview record, safe message | durable claim | Explicit list/create fallback if retained |
| History `persisted` | `persisted: true`, durable id, status persisted, message/time | preview id or false persisted flag | Server adapter output |
| History `blocked` | `persisted: false`, preview id, blocked status, safe message | durable id claim or persisted status | Explicit staged/blocked fallback |
| History `unavailable` | `persisted: false`, preview id, response status mapped to blocked, reason/message | durable claim | Local/server adapter output |

Preview identifiers are explicitly named in adapter variants so they cannot be confused with durable identifiers. The decision mapper may place either into the existing response `persistence.id`, but the source variant remains visible and testable. These unions prohibit broad optional-field combinations.

## 25. Independent parity mechanism design

| Evidence layer | Mechanism | Independence property | Limitation |
|----------------|-----------|-----------------------|------------|
| Canonical ownership | One production value/type source in `routeContracts/**`; helpers and later routes import leaves | No duplicated production literals | Import use alone does not prove runtime behavior |
| Helper-contract evidence | Literal test oracles plus exact status/key/error/array/deep-object assertions against helper outputs | Oracle does not import production values under test | Deliberate literals require synchronized reviewed changes |
| Compile-time contract evidence | `satisfies`, explicit return unions, typecheck, impossible-state fixtures marked as compile failures where repo tooling permits | Compiler checks status/body/result relations | Type evidence does not execute behavior |
| Static route-adoption evidence | Source-reading assertions check approved leaf imports/helper calls and absence of inline duplicates | Does not import route modules or touch server-only | Text/source evidence is not route execution |
| Future route integration evidence | Separately routed route export or Next runtime test | Exercises adopted route behavior | Requires separate import/runtime safety review |

All three first layers are required before route wiring can be judged ready. Runtime evidence remains later and separately authorized.

## 26. Controlled test-oracle duplication policy

Literal duplication is permitted only under a clearly test-only `routeContractOracles/**` path. Oracles must:

- contain exact statuses, body-key lists, public errors, and non-authorization arrays;
- avoid importing production contract values or helper-generated data;
- be consumed only by tests;
- require an intentional reviewed change when a production contract changes;
- be scanned to prevent production imports from the oracle path;
- remain small, route-family-specific, and human-readable.

This is `controlled-test-oracle-duplication`. Copied literals in routes, domains, decisions, or multiple production contract leaves are `uncontrolled-production-duplication` and prohibited after migration.

## 27. Static route-adoption evidence

A future `governedRouteContractAdoption.test.ts` should follow the existing source-reading pattern in `governedRouteBoundary.test.ts` without importing route modules. It should assert, per route:

- the exact approved `routeContracts` leaf and decision-helper imports;
- expected decision-helper calls and `NextResponse.json(decision.body, { status: decision.status })`-equivalent wiring;
- continued server-only adapter imports only in route/server files;
- absence of inline canonical errors/non-authorization arrays after adoption;
- absence of broad motion-kernel/thread-memory barrels where explicit server-safe leaves are required;
- no route import from tests or contract/helper modules.

This is `static-adoption-evidence`, not runtime proof.

## 28. Future runtime/integration evidence

Exact helper tests, lint, typecheck, compile-time unions, import scans, and static route-source assertions establish design/adoption evidence only. Route-export integration requires a separately routed lane because importing current routes reaches `next/server` and server-only provider/persistence paths. Next runtime tests, configured-provider calls, durable database tests, and deployed behavior are progressively stronger and separately governed evidence. None is required or authorized by A43 or A44.

## 29. Server-only and side-effect boundary

| Responsibility | Contract layer | Decision layer | Route/server adapter |
|----------------|----------------|----------------|----------------------|
| Exact statuses/bodies/errors/non-authorizations | Owns | Consumes | Consumes |
| Domain records/builders | Generic payload only | Receives mapped values | Calls concrete domain builders |
| Request parsing/params/NextResponse | Prohibited | Prohibited | Owns |
| Prisma/persistence | Prohibited | Prohibited | Owns through server-only modules |
| Environment/provider credentials | Prohibited | Prohibited | Owns through server-only config |
| Provider dispatch/network | Prohibited | Prohibited | Owns through connector |
| Authority/acceptance | Never owns | Never owns | Never owns; CONTROL_THREAD remains authority |

## 30. Proposed future file map

| Candidate file | Future purpose | Earliest authorized lane | Route-file change? |
|----------------|----------------|--------------------------|--------------------|
| `routeContracts/decisionSnapshot.ts` | Pure structural base | A44 | No |
| `routeContracts/passalongResponses.ts` | Canonical passalong transport contracts | A44 | No |
| `routeContracts/motionIntakeResponses.ts` | Canonical motion transport contracts | A44 | No |
| `routeContracts/manualInferenceResponses.ts` | Canonical manual response contracts | A44 | No |
| `routeContracts/manualInferenceHistory.ts` | Canonical history input contract | A44 | No |
| `routeContracts/adapters/{passalong,motionIntake,manualInference}.ts` | Normalized discriminated adapter results | A44 | No |
| `routeContractOracles/{passalong,motionIntake,manualInference}.ts` | Independent literal test data | A44 | No |
| `governedRouteContractParity.test.ts` | Canonical/oracle/helper exact checks | A44 | No |
| Existing `routeDecisions/**` | Consume canonical contracts; remove copies/broad types | A44 | No |
| Passalong compatibility export | Reference canonical passalong value during migration | A44 if explicitly authorized | No route change; domain source change |
| `governedRouteContractAdoption.test.ts` | Static route-source adoption proof | A47 or separately routed test lane | No production route change itself |
| Four production routes | Consume canonical contracts/helpers while retaining server wiring | A47 after A45/A46 | Yes |

## 31. Migration and de-duplication sequence

1. A44 adds pure contract leaves, normalized adapter unions, literal oracles, and parity tests.
2. A44 migrates route decisions to canonical leaves and removes helper-owned duplicate contracts/broad response types.
3. If explicitly authorized, A44 changes the passalong domain constant to a direct compatibility re-export/reference of the canonical value; no copied literal remains there.
4. A45 reviews import topology, union exactness, oracle independence, and A44 changed files.
5. A46 specifies route-by-route adoption diffs, explicit imports, adapter mapping, validation, and stop conditions.
6. A47 migrates routes, removes motion/manual inline contracts and temporary passalong aliases, and adds static adoption evidence.
7. A post-A47 review decides whether route-export/runtime integration can be separately routed.

Contract extraction and route wiring remain separate. Temporary duplication is accepted only between A44 and A47 when explicitly listed, source-inspected, oracle-checked, and removed by the planned adoption lane.

## 32. Route-file wiring prerequisites

| Prerequisite | Required evidence | Current posture | Blocking? |
|--------------|-------------------|-----------------|-----------|
| Canonical owner implemented | Pure leaf modules and no production duplicates in migrated helper layer | Design only | Yes |
| Independent oracle | Literal statuses/keys/errors/arrays with no production-value imports | Not implemented | Yes |
| Normalized adapter unions | Impossible combinations rejected by typecheck/tests | Not implemented | Yes |
| A44 boundary review | A45 acceptance of source/test implementation | Not present | Yes |
| Exact route diff plan | Route-specific imports, mappings, validations, stop conditions | Not present | Yes |
| Server-only topology preserved | Import scan and explicit route/server responsibility map | Designed, not implemented | Yes |
| Package/schema/runtime expansion unnecessary | Confirmed by implementation plan | Currently expected | Stop if false |
| Route-level evidence route | Separately reviewed after adoption | Out of scope now | Not required for static adoption, required for runtime claim |

## 33. Future lane sequencing

| Lane candidate | Scope | Authorized class | Dependency |
|----------------|-------|------------------|------------|
| A44 | Shared contract leaves, normalized adapter types, independent oracle/parity tests, decision-helper migration; no routes | Source/test implementation | A43 acceptance |
| A45 | Post-implementation boundary review of A44 | Docs/reviews only | A44 merged evidence |
| A46 | Narrow route-file adoption/wiring planning | Docs/reference only | A45 acceptance |
| A47 | Narrow route adoption and static adoption test | Source/test/route implementation only if explicitly routed | A46 review/acceptance |
| Later review/integration | Review A47, then consider route-export/runtime evidence | Separately routed | A47 merged evidence |

The recommended immediate next lane is A44. Direct route wiring in A44 is rejected.

## 34. Risks and tradeoffs

- A dedicated layer adds files, but makes ownership and import safety explicit.
- Generic response payload types preserve independence but require concrete instantiation at helpers/routes.
- Literal oracles intentionally duplicate values and add maintenance friction; that friction is the drift signal.
- Static source assertions are somewhat brittle but avoid unsafe route imports and clearly prove adoption text.
- Motion-intake currently returns a 200 response with a blocked preview record; normalized variants expose that distinction internally without changing the transport contract.
- Provider connector code does not currently expose an explicit dispatch discriminant; future normalization may require an adapter change and separate review.
- Temporary compatibility aliases can overstay; A46/A47 must list and remove them explicitly.

## 35. Security and authority implications

The selected layer contains no secrets, credentials, environment reads, provider clients, Prisma, network calls, timers, jobs, or route imports. It cannot dispatch, persist, approve, route, accept, deploy, activate, or transfer authority. Normalized provider values expose safe status metadata only. Literal oracles contain synthetic/public contract text only. Server-only protections remain intact and exclusive to route/server adapters.

## 36. Validation and evidence posture

A43 uses source inspection, import-topology searches, lint, typecheck, diff checks, and non-authorization scans. A42's accepted focused A41 and A35 test exits are prior operator-validation-grounded evidence and are not rerun. A43 produces architectural evidence only; it does not produce compile-time contract implementation, helper parity, route adoption, route execution, provider, persistence, or deployed evidence.

## 37. Recommendation for CONTROL_THREAD

Accept A43 if CONTROL_THREAD agrees, select Option A as the canonical architecture, and route:

`A44 Governed Control Plane Shared Response-Contract Ownership and Independent Parity Implementation v0`

A44 should be source/test-only with no route-file changes. It should implement explicit route-contract leaves, normalized discriminated adapter results, independent literal oracles, exact parity tests, and decision-helper migration. It may change a passalong compatibility export only if explicitly authorized and implemented as a reference to the canonical value rather than another literal.

Then route A45 review-only, A46 route-adoption planning, and A47 narrow route wiring only after each prior lane is accepted. No direct route wiring is authorized by A43.

## 38. Non-authorizations preserved

| Non-authorization | Preserved? | Design finding |
|-------------------|------------|----------------|
| No source/test implementation | Yes | A43 changes one docs/reference artifact. |
| No route-file wiring/change | Yes | Routes are inspected only. |
| No package/lock/schema/migration change | Yes | No such file changes. |
| No route handler/export/integration execution | Yes | No route module is invoked. |
| No build/dev server/browser/e2e | Yes | None runs. |
| No provider/model/API dispatch | Yes | Provider paths are inspected only. |
| No deployed DB access | Yes | Persistence paths are inspected only. |
| No runtime/JAI Agent/model-slot activation | Yes | A43 is unrelated design evidence only. |
| No GitHub API/`gh` or Linear mutation | Yes | Only authorized branch Git operations may occur. |
| No target-repo mutation/import | Yes | No target repo is touched. |
| No deployment/production gate | Yes | No deployment action occurs. |
| No source-of-truth/acceptance/execution authority transfer | Yes | CONTROL_THREAD remains authority. |
| No hidden automation | Yes | No generators, jobs, timers, polling, webhooks, or cron. |
| ZERO GATES GRANTED | Yes | Architecture selection grants no implementation or activation gate. |

## 39. Evidence limitations

- No proposed module or union exists yet.
- No independent oracle or parity test is implemented.
- No route or decision helper consumes the selected canonical layer.
- Static source evidence cannot prove route execution or Next runtime behavior.
- Provider-executed normalization may need connector metadata not currently exposed.
- Motion preview semantics are preserved conceptually but not changed or runtime-tested.
- A42 test results are accepted prior evidence, not rerun A43 evidence.
- GitHub metadata is CONTROL_THREAD-provided; A43 uses no GitHub API.

## 40. Validation

| Validation | Result |
|------------|--------|
| `corepack pnpm -C portal lint` | Passed after the required pre-push update. |
| `corepack pnpm -C portal typecheck` | Passed after the required pre-push update. |
| `git diff --check` | Passed after the required pre-push update. |
| `git diff --cached --check` | Passed after staging the A43 reference artifact. |
| Import-topology scan | Rerun after the required pre-push update; findings unchanged and no blocker. |
| Non-authorization scan | Rerun after the required pre-push update; no positive authority grant or blocker. |

The A41/A35 `tsx` tests are not rerun. No general tests, build, server, route, browser, provider, persistence, external service, or deployment command is authorized.

## 41. Evidence

- Local history contains accepted A42 squash `b5e145f7b45e262bf4a24c1ff7132744f3103616`.
- The A42 artifact and all A41 helper/test files exist and were inspected.
- Four current route files and directly relevant thread-memory/motion-kernel sources were inspected.
- Current constant definitions/uses, barrels, server-only modules, Prisma imports, environment reads, provider connector, and OpenAI reachability were mapped with grep.
- Existing `governedRouteBoundary.test.ts` demonstrates a repository-local source-reading pattern suitable for future static adoption evidence.

## 42. Import-topology scan

The current scan found:

- passalong's constant is defined in thread-memory and copied in route decisions; routes and persistence consume the thread-memory value;
- motion-intake and manual-inference constants are defined only in route decisions while equivalent production literals remain inline in routes;
- A41 tests and decision helpers consume route-decision constants;
- thread-memory's barrel exports the passalong persistence boundary but not its server-only persistence implementation;
- motion-kernel's barrel exports server-only motion persistence and deliberation history modules alongside safe domain modules;
- passalong persistence, motion-intake persistence, deliberation history, provider connector, and provider config are guarded by `server-only`;
- persistence reaches Prisma; provider config reaches `process.env`; provider connector can dynamically import `openai`;
- route-decision helpers contain none of those imports.

These findings confirm `barrel-import-risk`, `import-safe-leaf-module-required`, and the selection of Option A. Negative contract strings are not classified as executable imports.

## 43. Non-authorization scan

The required scan was run after authoring and rerun after the required pre-push update. Hits in A43/A42 are design-boundary statements; positive-looking phrases in A35 are forbidden-claim literals used as negative assertions. No positive authority grant or blocker was found.

## 44. Authority boundary

A43 selects a proposed architecture and recommends future lanes only. It does not accept A42 or A43, authorize A44, create canonical production ownership, alter provider/persistence behavior, authorize route wiring, activate runtime/model-slot/JAI systems, open production gates, or transfer source-of-truth, acceptance, execution, or CONTROL_THREAD authority.

## 45. Repo-lane closeout

- Suggested model posture: Sol 5.6 Ultra, appropriate for the cross-subsystem ownership and sequencing decision.
- Selected owner: dedicated import-safe `routeContracts/**` leaf layer.
- Rejected: decision-owned contracts, fragmented domain ownership, generation, and duplicated production ownership.
- Independent parity: controlled literal test oracles plus exact helper assertions and static route-adoption evidence.
- Adapter posture: route-family discriminated unions with impossible combinations excluded.
- Route wiring: not authorized and intentionally separated.
- Final validation: lint, typecheck, and both diff checks passed; import-topology and non-authorization scans had no blocker.
- Recommended next route: A44 shared contract ownership and independent parity implementation, source/test only.
- Later sequence: A45 review, A46 adoption planning, A47 narrow wiring if separately accepted/routed.
- Changed file: this A43 reference artifact only.
- No PR is created by this lane.
- ZERO GATES GRANTED.

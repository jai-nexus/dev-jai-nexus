# A29 Governed Control Plane Code Test and Optimization Review v0

## Role

Role: JAI::DEV::BUILDER

## 1. Review scope

A29 inspected governed control-plane source, focused tests, package scripts, validation behavior, optimization risk, stale documentation risk, and hidden mutation / activation risk before any company-ready closeout handoff or activation-readiness route.

A29 is review-test-only and code-inspection-only. A29 does not authorize implementation, source changes, test changes, runtime activation, JAI_control_thread runtime activation, JAI Council activation, JAI Agent activation, provider/model/API dispatch, GitHub mutation, GitHub API mutation, Linear mutation, target-repo mutation/import, accepted-code import, deployment, production gates, source-of-truth transfer, public launch, DNS change, registrar action, renewal/payment action, billing action, funding commitment, hidden automation, timers, polling, background jobs, automatic route execution, automatic delivery, activation, checklist execution, acceptance authority transfer, execution authority transfer, or CONTROL_THREAD acceptance transfer.

## 2. CONTROL_THREAD decision baseline

CONTROL_THREAD accepted A28 as completed and held the previously recommended closeout handoff. CONTROL_THREAD routed A29 as `Governed Control Plane Code Test and Optimization Review v0` because source/code must be inspected and tested before activation planning.

A29 records that A29 itself is not activation planning, not a source-changing lane, not a test-changing lane, and not authority to implement fixes.

## 3. Accepted A28 baseline

A28 reviewed the A27 governed control-plane readiness checklist profile and found no blockers.

A28 confirmed that A27 categories, item fields, status vocabulary, evidence source labels, governance posture, CONTROL_THREAD posture, motion proposal posture, Council/advisory posture, JAI::AGENTS posture, asset/domain evidence posture, Work/Waves taxonomy posture, GitHub/Linear evidence-use posture, ZERO GATES posture, public-readiness posture, resource/cost posture, direct-artifact posture, and evidence/caveat handling remain profile-only and non-authorizing.

## 4. Inspection methodology

A29 inspected repo-local source and tests with read-only shell commands, package script inspection, focused TypeScript test execution, lint/typecheck execution, git whitespace validation, and static hidden mutation / activation scans.

A29 did not run a dev server, browser/e2e tests, database-backed integration tests, migrations, deployment commands, provider/model/API calls, GitHub API commands, Linear commands, DNS/registrar/payment/billing/funding commands, or checklist execution.

## 5. Files inspected

| Area | Files / paths inspected | Notes |
|------|-------------------------|-------|
| Package scripts | `portal/package.json` | A29 inspected available scripts before validation. |
| Company asset/domain registry | `portal/src/lib/controlPlane/companyAssetDomainRegistry.ts`, `portal/src/lib/controlPlane/companyAssetDomainRegistry.test.ts`, `portal/src/app/domains/page.tsx`, `portal/src/app/operator/registry/domains/page.tsx`, `portal/src/app/operator/registry/domains/[id]/page.tsx`, `portal/src/app/operator/registry/domains/new/page.tsx` | Static display model has focused tests; operator/domain pages include pre-existing Prisma-backed registry behavior. |
| JAI_control_thread motion proposal | `portal/src/lib/controlPlane/jaiControlThreadMotionProposal.ts`, `portal/src/lib/controlPlane/jaiControlThreadMotionProposal.test.ts` | Focused source and tests inspected and executed. |
| Work/Waves taxonomy | `portal/src/lib/controlPlane/workWavesProgramTaxonomy.ts`, `portal/src/lib/controlPlane/workWavesProgramTaxonomy.test.ts`, `portal/src/app/operator/work/**`, `portal/src/app/operator/waves/**` | Focused taxonomy helper has tests; operator work/waves pages include broader pre-existing Prisma behavior. |
| Sandbox receipt return display | `portal/src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.ts`, `portal/src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.test.ts` | Focused source and tests inspected and executed. |
| Sandbox packet control surface | `portal/src/lib/controlPlane/sandboxNexus/sandboxPacketControlSurface.ts`, `portal/src/lib/controlPlane/sandboxNexus/sandboxPacketControlSurface.test.ts` | Focused source and tests inspected and executed. |
| sandbox.nexus surface relationship | `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.ts`, `portal/src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts` | Focused source and tests inspected and executed. |
| JAI Palette sandbox agent draft | `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.ts`, `portal/src/lib/controlPlane/jaiPalette/sandboxAgentDraft.test.ts` | Focused source and tests inspected and executed. |
| Operator control-thread integration | `portal/src/app/operator/control-thread/page.tsx`, `portal/src/app/operator/control-thread/PassalongRouterPrototype.tsx`, `portal/src/app/operator/control-thread/passalongs/route.ts`, `portal/src/app/operator/control-thread/passalongs/[passalongId]/route.ts`, `portal/src/lib/controlPlane/threadMemory/**` | Pre-existing app-local passalong persistence routes are present and bounded by non-authorization copy. |
| Operator control-plane integration | `portal/src/app/operator/control-plane/page.tsx`, `portal/src/app/operator/control-plane/_components/**` | Page presents fixture/canonical read-only posture and non-authorizing badges. |
| Operator motion-control integration | `portal/src/app/operator/motion-control/page.tsx`, `portal/src/app/operator/motion-control/manual-inference/route.ts`, `portal/src/app/operator/motion-control/motion-intake/route.ts`, `portal/src/app/operator/motion-control/ManualDeliberationAction.tsx`, `portal/src/app/operator/motion-control/NativeMotionIntakeComposer.tsx`, `portal/src/lib/controlPlane/motionKernel/**` | Pre-existing manual inference and motion intake persistence paths exist; provider mode is env-gated and mock is default. |
| Accepted review/reference docs | `docs/reviews/A28_GOVERNED_CONTROL_PLANE_READINESS_CHECKLIST_REVIEW_V0.md`, related `docs/reference/**`, related `docs/reviews/**` found by static scan | Used for stale documentation and duplicate boundary-copy risk inspection. |

## 6. Files changed

| File | Change type | Boundary |
|------|-------------|----------|
| `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md` | Added A29 review artifact | Docs/review only; not source, test, schema, package, lockfile, runtime, deployment, provider, GitHub API, Linear, DNS, registrar, payment, billing, or funding change. |

## 7. Package scripts inspected

| Script / package area | Present? | A29 use | Notes |
|-----------------------|----------|---------|-------|
| `lint` | Yes | Run | Passed. |
| `typecheck` | Yes | Run | Passed. |
| `test` | Yes | Not used as suite runner | Script is placeholder: `echo "Error: no test specified" && exit 1`; classified as unavailable as a useful test runner. |
| Focused control-plane tests through `pnpm -C portal exec tsx ...` | Yes | Run | Matching focused test files existed and passed. |
| `build`, `build:local`, `start`, `start:local`, `dev` | Yes | Not run | Not required for A29; dev/server/build behavior was outside safe review-test scope. |
| Prisma scripts | Yes | Not run | Migration, generate, push, status, studio, and seed scripts were not run. |
| Snapshot scripts | Yes | Not run | Snapshot write/check behavior was outside the A29 focused validation scope. |
| Provider / repo / wave operational scripts | Yes | Not run | Scripts such as `jai:agent:repos`, `jai:wave:apply`, and `sync:repos` were not run because A29 does not authorize operational mutation. |
| Repo-local docs/review/static validation script | Not found | Unavailable-script | A29 found no dedicated docs/review static validation script in inspected package scripts. |

## 8. Validation command matrix

| Command | Purpose | Result classification | Evidence / notes |
|---------|---------|-----------------------|------------------|
| `pnpm -C portal lint` | Safe package lint validation | `passed` | Completed with exit code 0. |
| `pnpm -C portal typecheck` | Safe TypeScript validation | `passed` | Completed with exit code 0. |
| `pnpm -C portal test` | General test script assessment | `unavailable-script` | Script exists but is a placeholder that exits with `Error: no test specified`; A29 did not use it as a meaningful validation suite. |
| `pnpm -C portal exec tsx src/lib/controlPlane/companyAssetDomainRegistry.test.ts` | Focused company asset/domain registry test | `passed` | Completed with exit code 0. |
| `pnpm -C portal exec tsx src/lib/controlPlane/jaiControlThreadMotionProposal.test.ts` | Focused JAI_control_thread motion proposal test | `passed` | Completed with exit code 0. |
| `pnpm -C portal exec tsx src/lib/controlPlane/workWavesProgramTaxonomy.test.ts` | Focused Work/Waves taxonomy test | `passed` | Completed with exit code 0. |
| `pnpm -C portal exec tsx src/lib/controlPlane/sandboxNexus/sandboxReceiptReturnDisplay.test.ts` | Focused sandbox receipt return display test | `passed` | Completed with exit code 0. |
| `pnpm -C portal exec tsx src/lib/controlPlane/sandboxNexus/sandboxPacketControlSurface.test.ts` | Focused sandbox packet control surface test | `passed` | Completed with exit code 0. |
| `pnpm -C portal exec tsx src/lib/controlPlane/sandboxNexus/sandboxNexusSurface.test.ts` | Focused sandbox.nexus surface relationship test | `passed` | Completed with exit code 0. |
| `pnpm -C portal exec tsx src/lib/controlPlane/jaiPalette/sandboxAgentDraft.test.ts` | Focused JAI Palette sandbox agent draft test | `passed` | Completed with exit code 0. |
| Operator route integration tests | Inspect safe availability | `not-run-with-reason` | No matching safe focused route integration test files were found for operator passalong persistence, manual inference, or motion intake routes. |
| Browser/e2e validation | Inspect safe availability | `not-run-with-reason` | Not run because A29 forbids dev server, runtime activation, provider/API calls, and browser/e2e tests requiring runtime behavior. |
| `git diff --check` | Whitespace validation | `passed` | Passed before final staging and after A29 artifact authoring. |
| `git diff --cached --check` | Staged whitespace validation | `passed` | Required staged whitespace validation for the A29 artifact before commit. |

## 9. Validation result classification vocabulary

| Classification | Meaning | A29 handling |
|----------------|---------|--------------|
| `passed` | Command completed successfully within safe A29 scope. | Record as positive validation evidence. |
| `failed-current-lane` | Command failed because of the A29 artifact. | Fix A29 artifact and rerun before commit. |
| `failed-pre-existing` | Command failed in pre-existing source/test/package state while A29 changed only docs/reviews. | Record evidence and do not fix source in A29. |
| `unavailable-script` | Script or usable package command was absent or placeholder-only. | Record limitation and avoid inventing scripts. |
| `not-run-with-reason` | Command was unsafe, not applicable, or lacked matching focused test files. | Record reason and preserve non-authorization. |

## 10. Code inspection findings

| Area | Finding | Classification | Evidence | Recommendation |
|------|---------|----------------|----------|----------------|
| Focused static control-plane helpers | Company asset/domain, motion proposal, Work/Waves taxonomy, sandbox receipt, sandbox packet, sandbox.nexus, and JAI Palette draft helpers have explicit non-authorizing posture and focused tests. | `acceptable-as-is` | Focused source inspection and seven focused tests passed. | No source fix required before next planning decision. |
| Operator persistence surfaces | Passalong and motion intake routes include pre-existing app-local persistence paths using Prisma/raw SQL and bounded non-authorization copy. | `should-improve` | `passalongs/route.ts`, `passalongs/[passalongId]/route.ts`, `motion-intake/route.ts`, `motion-intake-persistence.ts`. | Add a later focused route-boundary test plan before any activation-readiness route. |
| Manual inference provider connector | Manual inference route can request `env_gated_provider`; provider connector falls back safely when disabled or unconfigured, and mock mode is default. | `should-improve` | `manual-inference/route.ts`, `provider-connector.ts`, `server-provider-config.ts`. | A narrower activation-readiness test plan should verify provider-disabled, provider-config-missing, and mock-default behavior without live calls. |
| Operator control-plane page | The control-plane page states nothing executes, dispatches, persists, or mutates system state while reading canonical posture. | `acceptable-as-is` | `portal/src/app/operator/control-plane/page.tsx`. | Keep current boundary copy; include in future route-boundary tests. |
| Operator work/waves pages | Work/waves surfaces include existing Prisma-backed operational pages outside the static helper profile. | `defer` | `portal/src/app/operator/work/**`, `portal/src/app/operator/waves/**`. | Defer broad operator workflow review to a dedicated route if CONTROL_THREAD needs activation-readiness coverage. |

## 11. Specific governed control-plane source area findings

| Source area | Files inspected | Finding | Classification | Recommendation |
|-------------|-----------------|---------|----------------|----------------|
| Company asset/domain registry display code | `companyAssetDomainRegistry.ts`, `companyAssetDomainRegistry.test.ts`, domain registry pages | Static display model preserves evidence/state wording, many-to-many repo binding posture, and DNS/registrar/renewal/payment/public-readiness boundaries; focused tests passed. Operator/domain pages have separate Prisma registry behavior. | `acceptable-as-is` for helper; `defer` for full registry operations | Keep helper as-is; test operational registry mutation boundaries in a separate route if activation planning approaches. |
| JAI_control_thread motion proposal surface code | `jaiControlThreadMotionProposal.ts`, `jaiControlThreadMotionProposal.test.ts` | Motion proposal draft, advisory preview, planning seed, and CONTROL_THREAD handoff postures are explicit and tested as non-authorizing. | `acceptable-as-is` | No immediate change. |
| Work/Waves taxonomy alignment code | `workWavesProgramTaxonomy.ts`, `workWavesProgramTaxonomy.test.ts` | Program / Batch / Wave / Lane vocabulary and route planning vs execution boundaries are tested. Some historical wording such as `SOURCE_IMPLEMENTATION / LOCAL_STATIC_DISPLAY_METADATA` can be misread without boundary context. | `safe-but-inefficient` | Consider wording cleanup in a later optimization lane if CONTROL_THREAD wants lower stale-copy risk. |
| Sandbox receipt return display code | `sandboxReceiptReturnDisplay.ts`, `sandboxReceiptReturnDisplay.test.ts` | Receipt return display is static and bounded against ingestion, import, execution, runtime behavior, API routes, migrations, and provider dispatch; focused test passed. | `acceptable-as-is` | No immediate change. |
| Sandbox packet control surface code | `sandboxPacketControlSurface.ts`, `sandboxPacketControlSurface.test.ts` | Packet control surface remains preview/profile display and excludes parser/schema/API/runtime/checklist automation posture; focused test passed. | `acceptable-as-is` | No immediate change. |
| sandbox.nexus surface relationship code | `sandboxNexusSurface.ts`, `sandboxNexusSurface.test.ts` | Surface relationship model distinguishes future blocked activation vocabulary from current non-activation posture; focused test passed. | `safe-but-inefficient` | Future docs/UI should keep current vs future blocked status visually distinct. |
| JAI Palette sandbox agent draft code | `jaiPalette/sandboxAgentDraft.ts`, `jaiPalette/sandboxAgentDraft.test.ts` | Agent draft classes remain candidate metadata with `executableRuntime: "not_created"` and blocked authorities; focused test passed. | `acceptable-as-is` | No immediate change. |
| Operator control-thread integration points | `control-thread/page.tsx`, `PassalongRouterPrototype.tsx`, passalong route handlers, threadMemory helpers | UI and routes preserve non-authorizations, but persistence routes are actual app-local writes when DB/table is available. | `should-improve` | Plan focused route tests for persistence-available and persistence-blocked cases before activation-readiness planning. |
| Operator control-plane integration points | `control-plane/page.tsx`, control-plane components | Main control-plane page presents local static / read-only / non-authorizing posture and no execution badges. | `acceptable-as-is` | No immediate change. |
| Operator motion-control integration points | `motion-control/page.tsx`, `manual-inference/route.ts`, `motion-intake/route.ts`, motionKernel helpers | Motion intake persists advisory metadata when DB exists; manual inference can call provider only under env-gated mode and server config. | `should-improve` | A narrower activation-readiness test plan should cover mock default, env gate, no secret exposure, persistence fallback, and non-authority response fields. |

## 12. Test coverage findings

| Area | Test files inspected / searched | Coverage finding | Classification | Recommendation |
|------|---------------------------------|------------------|----------------|----------------|
| Company asset/domain registry | `companyAssetDomainRegistry.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| JAI_control_thread motion proposal | `jaiControlThreadMotionProposal.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| Work/Waves taxonomy | `workWavesProgramTaxonomy.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| Sandbox receipt return | `sandboxReceiptReturnDisplay.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| Sandbox packet control | `sandboxPacketControlSurface.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| sandbox.nexus | `sandboxNexusSurface.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| JAI Palette sandbox agent draft | `sandboxAgentDraft.test.ts` | Focused helper coverage exists and passed. | `acceptable-as-is` | No immediate change. |
| Operator passalong persistence routes | Search under `portal/src/app/operator/control-thread/**` and `portal/src/lib/controlPlane/threadMemory/**` | No focused route integration test was found in the inspected target set. | `should-improve` | Add a future route-boundary test plan before activation-readiness planning. |
| Operator motion intake / manual inference routes | Search under `portal/src/app/operator/motion-control/**` and `portal/src/lib/controlPlane/motionKernel/**` | No focused route integration test was found for provider-disabled/provider-config-missing/mock-default behavior. | `should-improve` | Add a future route-boundary test plan before activation-readiness planning. |
| Package-level test runner | `portal/package.json` | `test` script is placeholder-only and not a usable suite runner. | `safe-but-inefficient` | Later optimization may add a safe focused control-plane test script if CONTROL_THREAD routes source/test changes. |

## 13. Package / validation behavior findings

| Area | Finding | Classification | Recommendation |
|------|---------|----------------|----------------|
| Lint/typecheck | Safe scripts are present and passed. | `acceptable-as-is` | Continue using for docs/code review lanes when safe. |
| Focused tests | Focused tests exist but require manual `pnpm -C portal exec tsx ...` invocation. | `safe-but-inefficient` | Consider a dedicated safe focused test script in a future optimization lane. |
| General test script | `pnpm -C portal test` is a placeholder failing script. | `should-improve` | Decide whether to add a real safe test runner or document focused test invocation. |
| Migration/build/dev scripts | Scripts exist but were not run under A29. | `acceptable-as-is` | Keep out of review-only lanes unless separately authorized. |

## 14. Hidden mutation / activation scan results

| Risk class | Evidence reviewed | Finding | Classification |
|------------|-------------------|---------|----------------|
| Provider/model/API dispatch | Static scan found provider connector code and UI fetch to manual inference; source inspection shows mock default and env-gated provider mode. | Pre-existing provider-gated advisory path exists; not exercised by A29 and not hidden in static helpers. | `should-improve` |
| GitHub API mutation | Static scan found boundary copy and operational repo/sync surfaces, but no A29 GitHub API mutation. | A29 did not use `gh` or GitHub APIs. | `acceptable-as-is` |
| Linear mutation | Static scan found Linear mirror boundary copy only in A29 targets. | No Linear mutation path was executed by A29. | `acceptable-as-is` |
| DB writes | Static scan found Prisma/raw SQL in operator passalong, motion intake, work, waves, registry, sync, and domain pages. | Pre-existing app-local operational DB behavior exists outside static helper profiles; A29 did not execute route handlers or migrations. | `should-improve` |
| Migrations | Static scan found docs references and package Prisma scripts. | A29 did not run migrations or modify schema/migration files. | `acceptable-as-is` |
| Route execution / automatic delivery | Static scan found mostly boundary copy and operator UI language. | No automatic route execution path was found in focused static helper modules; operator route surfaces need dedicated route-boundary tests before activation-readiness planning. | `should-improve` |
| Timers / polling / background jobs | Static scan found UI-only `setTimeout` usage in broader operator grid and test forbidden-string checks. | No hidden background job, polling loop, or scheduled automation was found in focused governed control-plane helpers. | `acceptable-as-is` |
| Deployment / production gates | Static scan found boundary copy and operator language. | No deployment behavior or production gate opening was added or executed by A29. | `acceptable-as-is` |
| DNS / registrar / renewal / payment / billing / funding | Static scan found registry boundary language and docs copy. | No operational DNS, registrar, renewal, payment, billing, or funding behavior was added or executed by A29. | `acceptable-as-is` |

## 15. Duplicate boundary-copy concentration findings

| Area | Duplication / concentration finding | Classification | Recommendation |
|------|------------------------------------|----------------|----------------|
| Docs/reference and docs/reviews chain | Repeated non-authorization copy is intentionally defensive but creates stale-copy risk across many artifacts. | `safe-but-inefficient` | Consider a docs lifecycle/archive policy lane after immediate test-plan concerns are handled. |
| Static helper modules | Boundary arrays are repeated across helper modules and tests. | `safe-but-inefficient` | Consider helper consolidation only if routed; avoid refactor in review-only lanes. |
| UI surfaces | Operator pages repeat status and blocked-authority language in hardcoded arrays. | `safe-but-inefficient` | Consider shared display constants in a future optimization lane if repetition becomes maintenance risk. |

## 16. Stale docs/reference risk findings

| Docs/reference area | Stale-risk finding | Classification | Recommendation |
|---------------------|--------------------|----------------|----------------|
| Company-ready planning chain | A23/A24/A26-style reference receipts are useful evidence but can become stale if not lifecycle-indexed. | `safe-but-inefficient` | A later docs lifecycle/archive policy lane should classify current / evidence / superseded / archive posture. |
| Checklist profile | A27 profile remains profile-only; future checklist execution or scoring must not be inferred from it. | `acceptable-as-is` | Keep review receipts attached to profile references. |
| Historical implementation planning docs | Static scan found older implementation and migration planning docs that may be confused with current authority if read out of sequence. | `safe-but-inefficient` | Lifecycle labels would reduce stale-route interpretation risk. |

## 17. Stale docs/reviews risk findings

| Docs/reviews area | Stale-risk finding | Classification | Recommendation |
|-------------------|--------------------|----------------|----------------|
| A20/A25/A28 review chain | Reviews are accurate for their lane scope but repeated boundary copy may obscure which review is current. | `safe-but-inefficient` | Consider lifecycle/index metadata for review artifacts. |
| Older B-series reviews in scan scope | Historical review artifacts contain valid non-authorization copy but may not represent current source state. | `defer` | Preserve as evidence history; lifecycle/archive policy can clarify status. |
| A29 review artifact | A29 records current code/test inspection as of this branch only. | `acceptable-as-is` | Future code changes require fresh review. |

## 18. Source / helper consolidation opportunities

| Area | Opportunity | Classification | Future lane type |
|------|-------------|----------------|------------------|
| Focused test invocation | Add a safe script for the governed control-plane focused tests. | `should-improve` | Targeted optimization/fix lane, if CONTROL_THREAD authorizes source/package/test changes. |
| Boundary copy constants | Consolidate repeated blocked-authority language for static helper surfaces. | `safe-but-inefficient` | Targeted optimization/fix lane, only after review of source blast radius. |
| Operator route-boundary tests | Add tests around passalong persistence, motion intake persistence, manual inference mock default, and provider-disabled fallback. | `should-improve` | Narrower activation-readiness test plan first; targeted test implementation later if routed. |
| Docs lifecycle labels | Define current/evidence/superseded/archive policy for docs/reference and docs/reviews. | `safe-but-inefficient` | Docs lifecycle/archive policy lane. |

## 19. UI repeated or hardcoded status language findings

| UI area | Finding | Classification | Recommendation |
|---------|---------|----------------|----------------|
| Operator control-plane | Badges and safety rails clearly repeat non-authorizing posture. | `acceptable-as-is` | Keep copy unless shared constants are routed. |
| Operator work/domain engine workspace | Many hardcoded labels preserve boundary posture but are repeated. | `safe-but-inefficient` | Consider shared display vocabulary in a later optimization lane. |
| Operator motion-control | Provider status and non-authorizations are visible, but route behavior needs focused test evidence. | `should-improve` | Include UI-to-route behavior in a narrow test plan. |
| Passalong router prototype | UI contains explicit manual, non-authorizing copy and persistence controls. | `should-improve` | Add route-boundary tests for persistence controls before activation-readiness planning. |

## 20. Docs lifecycle / archive policy opportunities

| Docs area | Lifecycle risk | Classification | Recommendation |
|-----------|----------------|----------------|----------------|
| `docs/reference` | Many planning/profile/receipt artifacts remain useful but can become stale without lifecycle status. | `safe-but-inefficient` | Route a docs lifecycle/archive policy lane after immediate test-plan needs or in parallel if CONTROL_THREAD wants documentation hygiene first. |
| `docs/reviews` | Reviews are lane-scoped and should not be treated as permanent current-state authority. | `safe-but-inefficient` | Add lifecycle guidance for current review vs historical evidence. |
| Cross-repo evidence references | Some review chains rely on CONTROL_THREAD-supplied GitHub verification. | `defer` | Keep caveats attached; use direct repo-local artifacts when present. |

## 21. Finding classification summary

| Classification | Count | Highest-risk examples | Recommended action |
|----------------|-------|-----------------------|--------------------|
| `must-fix` | 0 | None found in A29 scope. | No hold required solely from A29 findings. |
| `should-improve` | 8 | Missing focused route tests for persistence/provider-gated paths; placeholder `test` script; pre-existing operator DB/provider surfaces need bounded test evidence. | Prefer a narrower activation-readiness test plan before closeout or activation-readiness routing. |
| `safe-but-inefficient` | 9 | Duplicated boundary copy, manual focused-test invocation, stale docs lifecycle risk, repeated UI language. | Consider targeted optimization or docs lifecycle lane after test-plan decision. |
| `acceptable-as-is` | 18 | Focused static helper modules and tests, lint/typecheck, non-authorizing display posture. | No immediate fix required. |
| `defer` | 3 | Broad operator workflow review, older historical docs status, cross-repo evidence caveats. | Defer unless CONTROL_THREAD routes a broader review. |

## 22. Next necessary lane decision analysis

| Option | Evidence basis | Fit | Boundary |
|--------|----------------|-----|----------|
| Targeted optimization/fix lane | Placeholder `test` script, repeated boundary copy, missing route-boundary tests, hardcoded UI language. | Useful, but A29 found no `must-fix`; implementation/test changes should follow a narrower plan. | Would require separate CONTROL_THREAD route; A29 does not authorize implementation or tests. |
| Docs lifecycle/archive policy lane | Stale docs/reference and docs/reviews risk is real and repeated. | Useful, but not the highest-risk next step before activation-readiness planning. | Docs-only policy lane; no source/test changes. |
| Narrower activation-readiness test plan | Static helper tests passed, but operator persistence/provider-gated routes need explicit safe test design before activation planning. | Best fit. A29 recommends a narrow test-plan lane, not activation. | Planning/test-plan only; no runtime activation, provider calls, DB mutation, source changes, or test changes unless later routed. |
| Hold | No `must-fix` blocker found; lint/typecheck/focused tests passed. | Not necessary from A29 evidence. | CONTROL_THREAD may still hold if it wants more artifact evidence. |

## 23. Required conclusion

A29 concludes that the current governed control-plane codebase is not ready for activation planning or a broad activation-readiness route.

A29 finds the static governed control-plane helper surfaces are adequate for this phase and passed focused tests. A29 also finds that pre-existing operator persistence and provider-gated manual inference paths require a narrower activation-readiness test plan before any company-ready closeout handoff or activation-readiness route.

A29 recommends the current codebase is ready for a narrower activation-readiness test plan. A29 does not recommend activation. A29 does not recommend implementation in this lane. A29 does not recommend a broad activation-readiness route while route-handler coverage remains insufficient.

## 24. Recommended next CONTROL_THREAD decision

A29 recommends routing `A30 Governed Control Plane Narrow Activation-Readiness Test Plan v0`.

Recommended posture:

- docs/reference test-plan-only
- no implementation
- no source changes
- no test changes
- no runtime activation
- no JAI_control_thread runtime activation
- no JAI Council activation
- no JAI Agent activation
- no provider/model/API dispatch
- no GitHub mutation
- no GitHub API mutation
- no Linear mutation
- no target-repo mutation/import
- no accepted-code import
- no deployment
- no production gates
- no source-of-truth transfer
- no public launch
- no DNS change
- no registrar action
- no renewal/payment action
- no billing action
- no funding commitment
- no hidden automation
- no timers
- no polling
- no background jobs
- no automatic route execution
- no automatic delivery
- no activation
- no checklist execution
- no acceptance authority transfer
- no execution authority transfer
- no CONTROL_THREAD acceptance transfer

Recommended A30 focus:

- passalong persistence route boundary test plan
- motion intake persistence route boundary test plan
- manual inference mock-default and provider-disabled/provider-config-missing test plan
- no secret exposure assertions
- no route execution / no authority-transfer assertions
- safe focused test script decision
- criteria for when a later targeted test implementation lane is necessary

## 25. Non-authorizations preserved

| Non-authorization | Preserved? | Review finding |
|-------------------|------------|----------------|
| No implementation | Yes | A29 changed only the review artifact. |
| No source changes | Yes | No source files were changed. |
| No test changes | Yes | No test files were changed. |
| No runtime activation | Yes | No runtime was activated. |
| No JAI_control_thread runtime activation | Yes | No JAI_control_thread runtime was activated. |
| No JAI Council activation | Yes | No Council behavior was activated. |
| No JAI Agent activation | Yes | No Agent behavior was activated. |
| No provider/model/API dispatch | Yes | A29 inspected provider-gated source but did not call providers/models/APIs. |
| No GitHub mutation beyond routed branch push | Yes | No GitHub mutation occurred other than the intended branch push after commit. |
| No GitHub API mutation | Yes | A29 did not use `gh` or GitHub APIs. |
| No Linear mutation | Yes | A29 did not use Linear. |
| No target-repo mutation/import | Yes | No target repo was mutated or imported. |
| No accepted-code import | Yes | No accepted-code import occurred. |
| No deployment | Yes | No deployment commands were run. |
| No production gates | Yes | No production gates were opened. |
| No source-of-truth transfer | Yes | Review artifact is non-authoritative. |
| No public launch | Yes | No public launch behavior occurred. |
| No DNS change | Yes | No DNS changes occurred. |
| No registrar action | Yes | No registrar action occurred. |
| No renewal/payment action | Yes | No renewal or payment action occurred. |
| No billing action | Yes | No billing action occurred. |
| No funding commitment | Yes | No funding commitment occurred. |
| No hidden automation | Yes | Static scan found no hidden automation added by A29. |
| No timers, polling, or background jobs added | Yes | A29 added no code and no automation. |
| No automatic route execution | Yes | A29 did not execute routes. |
| No automatic delivery | Yes | A29 did not create delivery automation. |
| No activation | Yes | A29 did not activate any system. |
| No checklist execution | Yes | A29 did not execute the readiness checklist. |
| No acceptance authority transfer | Yes | CONTROL_THREAD retains authority. |
| No execution authority transfer | Yes | A29 transferred no execution authority. |
| No CONTROL_THREAD acceptance transfer | Yes | A29 does not accept itself. |

## 26. Evidence limitations

- A29 did not run route handlers because that would require runtime behavior and could touch persistence or provider-gated paths.
- A29 did not run browser/e2e tests because dev server and runtime activation are outside A29 scope.
- A29 did not run migrations, database-backed integration tests, or Prisma commands.
- A29 did not inspect every operator page line-by-line; A29 focused on governed control-plane targets and used static scan over broader relevant paths.
- A29 did not call providers/models/APIs and did not verify live provider behavior.
- A29 did not use GitHub APIs, Linear, DNS, registrar, payment, billing, funding, or deployment systems.

## 27. Risks and blockers

No `must-fix` blocker was found in A29 scope.

Primary remaining risks:

- Pre-existing operator persistence routes lack focused route-boundary tests in the inspected target set.
- Pre-existing manual inference provider-gated path lacks focused no-live-call / provider-disabled / provider-config-missing route tests in the inspected target set.
- General package `test` script is placeholder-only, so focused tests require manual command selection.
- Duplicate boundary copy across source, tests, docs/reference, and docs/reviews creates stale-copy risk.

## 28. Validation

A29 validation passed for lint, typecheck, git diff whitespace, and all matching focused governed control-plane tests listed in the validation command matrix.

A29 classified package-level `pnpm -C portal test` as unavailable for meaningful suite validation because it is placeholder-only. A29 classified operator route integration tests as not run with reason because matching safe focused tests were not found and route execution is outside A29 scope.

## 29. Authority boundary

A29 is a docs/reviews code-test and optimization review artifact only. A29 records source/test/package inspection and validation results, but does not authorize or perform implementation, source changes, test changes, runtime activation, provider/model/API dispatch, persistence mutation, GitHub API mutation, Linear mutation, target-repo mutation/import, deployment, production gates, public launch, DNS/registrar/renewal/payment/billing/funding action, hidden automation, route execution, delivery, activation, checklist execution, or authority transfer.

CONTROL_THREAD remains the review, accept, hold, reject, route, and acceptance authority.

## 30. Repo-lane closeout

Branch: `review/q3m7-governed-control-plane-code-test-optimization-review-v0`

Files changed:

- `docs/reviews/A29_GOVERNED_CONTROL_PLANE_CODE_TEST_OPTIMIZATION_REVIEW_V0.md`

Recommended next necessary lane:

- `A30 Governed Control Plane Narrow Activation-Readiness Test Plan v0`

A29 does not create a PR, does not merge, and does not authorize CONTROL_THREAD acceptance.

# Q3M7 Control Plane Sandbox Stress-Test Pivot Decision v0

## Role

Role: JAI::DEV::BUILDER

## 1. Decision scope

B4 records the CONTROL_THREAD pivot decision for Batch B / Wave B-A.

B4 holds the migration-readiness subtrack and pivots the active Wave B-A path toward a supervised `sandbox-nexus` stress-test proof path for `dev-jai-nexus` as an internal Control Plane.

B4 is a reference decision artifact only. B4 does not authorize implementation changes, runtime activation, provider/model/API dispatch, autonomous JAI Agent activation, sandbox-nexus runtime activation, sandbox task execution, target-repo mutation, target-repo import, accepted-code import, deployed database migration, deployed database mutation, migration application, GitHub automation, PR automation, deployment, production gates, source-of-truth transfer, or hidden/background automation.

## 2. Accepted baseline

B4 reviewed the accepted B3 baseline:

- Environment evidence package requirements are defined.
- Required human-supplied environment evidence package is absent.
- No repo-local human-supplied package confirms target identity.
- No repo-local human-supplied package confirms owner/account/project/workspace.
- No repo-local human-supplied package confirms database target.
- No repo-local human-supplied package confirms backup evidence.
- No repo-local human-supplied package confirms rollback evidence.
- No repo-local human-supplied package confirms restore verification.
- No repo-local human-supplied package confirms migration command authority.
- No repo-local human-supplied package confirms migration operator / approver.
- No repo-local human-supplied package confirms downtime / availability posture.
- No repo-local human-supplied package confirms monitoring / logging boundary.
- No repo-local human-supplied package confirms post-migration validation plan.
- Local/app-local database classes remain candidate-only.
- Deployed development, staging, production, and unknown environments remain unconfirmed.
- No mutation target was confirmed.
- Migration-application readiness remains blocked.

B4 also reviewed the preserved A25-B3 chain and relevant repo-local control-plane/operator source surfaces:

- `docs/reviews/B3_CONTROL_THREAD_PASSALONG_ENVIRONMENT_EVIDENCE_PACKAGE_REVIEW_V0.md`
- `docs/reviews/B2_CONTROL_THREAD_PASSALONG_ADDITIONAL_ENVIRONMENT_BOUNDARY_REVIEW_V0.md`
- `docs/reviews/B1_CONTROL_THREAD_PASSALONG_TARGET_ENVIRONMENT_CONFIRMATION_REVIEW_V0.md`
- `docs/reviews/A30_CONTROL_THREAD_PASSALONG_MIGRATION_READINESS_REVIEW_V0.md`
- `docs/reviews/A29_CONTROL_THREAD_PASSALONG_LOCAL_BOUNDARY_TEST_REVIEW_V0.md`
- `portal/src/lib/controlPlane/threadMemory/passalong-local-boundary.test.ts`
- `docs/reference/q3m7-control-thread-passalong-local-boundary-test-plan-v0.md`
- `docs/reviews/A26_CONTROL_THREAD_PASSALONG_SOURCE_IMPLEMENTATION_BOUNDARY_REVIEW_V0.md`
- `portal/prisma/schema.prisma`
- `portal/prisma/migrations/20260704120000_add_control_thread_passalong_records/migration.sql`
- `portal/src/app/operator/control-thread/`
- `portal/src/lib/controlPlane/`
- `portal/src/app/operator/`

B4 found no evidence limitation for the requested baseline artifacts on current `main`.

## 3. Migration-readiness subtrack hold finding

B4 holds the migration-readiness subtrack.

B4 preserves:

- A25-B3 remains useful future evidence.
- Migration application remains blocked.
- Deployed database mutation remains blocked.
- Mutation target confirmation remains blocked.
- Environment evidence package remains absent.
- No migration-evidence lane continues as the active path.

B4 does not discard the A25-B3 chain. B4 marks that chain as deferred future migration evidence only.

## 4. A25-B3 evidence preservation finding

B4 preserves this evidence chain:

- A25 app-local passalong persistence implementation.
- A26 source boundary review.
- A27 local boundary test plan.
- A28 local boundary test implementation.
- A29 local boundary test review.
- A30 migration-readiness review.
- B1 target-environment confirmation boundary review.
- B2 additional environment boundary review.
- B3 environment evidence package review.

This chain remains future migration evidence only. It is not the active Wave B-A route and does not authorize migration application, deployed database mutation, mutation target confirmation, provider/model/API dispatch, sandbox activation, JAI Agent activation, target-repo mutation, accepted-code import, deployment, production gates, or source-of-truth transfer.

## 5. Reason for pivot

B4 records that the migration-readiness path is safe but no longer the fastest active path toward the larger goal.

The larger goal is that `dev-jai-nexus` should become a legitimate internal Control Plane that can route supervised work for JAI Control Thread / repo workflows toward JAI Agents and `sandbox-nexus` scenarios.

B4 pivots Wave B-A toward a supervised sandbox stress-test path that proves manual work-packet composition, display, app-local export/persistence posture, manual handoff, simulated or received sandbox intake, structured closeout return, and CONTROL_THREAD manual review.

## 6. Revised Wave B-A route map

| Lane | Scope | Primary repo | Purpose | Boundary |
|------|-------|--------------|---------|----------|
| B4 | Control Plane Sandbox Stress-Test Pivot Decision v0 | `dev-jai-nexus` | Hold migration-readiness subtrack, preserve A25-B3 evidence, and define supervised sandbox stress-test route map. | Decision artifact only; no runtime activation or mutation. |
| B5 | dev-jai-nexus Supervised Route-Packet Composer Export Implementation v0 | `dev-jai-nexus` | Implement app-local route-packet composer, preview/display, export/copy/manual handoff structure for sandbox-nexus fixtures. | Manual export/handoff only; no automatic send, provider/model/API dispatch, sandbox runtime activation, JAI Agent activation, GitHub automation, target-repo mutation, accepted-code import, deployment, or gates. |
| B6 | sandbox-nexus Supervised Intake Contract and Fixture Scenario v0 | `sandbox-nexus` | Define a supervised intake contract and fixture scenario compatible with B5 route-packet export. | Contract/fixture lane only unless separately routed; no autonomous agents, target-repo mutation, accepted-code import, deployment, or gates. |
| B7 | dev-jai-nexus Manual Sandbox Stress-Test Runner Controls v0 | `dev-jai-nexus` | Define or implement manual runner controls for supervised dry-run orchestration posture. | Manual controls only; no hidden/background automation, provider/model/API dispatch, autonomous agent activation, or sandbox runtime activation unless separately authorized. |
| B8 | First Supervised Sandbox Stress-Test Dry Run v0 | `dev-jai-nexus` / `sandbox-nexus` | Run or simulate the first supervised stress-test dry run and collect structured closeout evidence. | Supervised dry run only; no autonomous JAI Agent activation, target-repo mutation, accepted-code import, deployment, production gates, or source-of-truth transfer. |
| B9 | Sandbox Stress-Test Closeout and Batch B-B Route Decision v0 | `dev-jai-nexus` | Review dry-run evidence, record closeout, and decide Batch B-B route. | Advisory closeout only until CONTROL_THREAD acceptance. |

## 7. dev.jai.nexus control-plane proof target

B4 defines the `dev-jai-nexus` control-plane proof target:

- `dev-jai-nexus` can create a structured route/work packet.
- `dev-jai-nexus` can display the structured packet.
- `dev-jai-nexus` can persist/export the structured packet in app-local/non-authoritative form.
- `dev-jai-nexus` can support a manual route handoff toward `sandbox-nexus`.
- CONTROL_THREAD remains the acceptance authority.
- All route outputs are advisory until CONTROL_THREAD acceptance.

## 8. sandbox-nexus stress-test proof target

B4 defines the `sandbox-nexus` stress-test proof target:

- `sandbox-nexus` can receive or simulate intake.
- `sandbox-nexus` can process a fixture or manually supplied route packet.
- `sandbox-nexus` can return a structured closeout.
- The dry run is supervised.
- The dry run does not activate autonomous agents.
- The dry run does not mutate target repos.
- The dry run does not import accepted code.
- The dry run does not deploy or open production gates.

## 9. Supervised/manual routing boundary

B4 defines these boundaries for B5-B9:

- Manual export / handoff only unless separately authorized.
- No provider/model/API dispatch.
- No autonomous JAI Agent activation.
- No sandbox runtime activation until separately routed.
- No GitHub automation.
- No target-repo mutation.
- No accepted-code import.
- No source-of-truth transfer.
- No hidden/background automation.

Route-packet composition, display, export, and copy posture may be implemented only as app-local, non-authoritative support unless a future CONTROL_THREAD route grants additional authority.

## 10. B5 implementation recommendation

B4 recommends B5 as:

Scope:

`dev-jai-nexus Supervised Route-Packet Composer Export Implementation v0`

Recommended branch:

`feature/q3m7-supervised-route-packet-composer-export-v0`

Recommended source areas:

- `portal/src/app/operator/control-thread/`
- `portal/src/lib/controlPlane/`
- `portal/src/app/operator/`

Recommended output posture:

- app-local route-packet composer
- route-packet preview/display
- route-packet export/copy/manual handoff
- fixture-compatible structure for `sandbox-nexus`
- no automatic send
- no provider/model/API dispatch
- no sandbox runtime activation
- no JAI Agent activation
- no target-repo mutation
- no accepted-code import
- no GitHub automation
- no production gates

B4 recommends that B5 preserve clear UI/source copy that packet creation, preview, export, and copy actions are manual, app-local, non-authoritative, and advisory until CONTROL_THREAD acceptance.

## 11. Non-authorization matrix

| Boundary | B4 status | Future route required? |
|----------|-----------|------------------------|
| autonomous JAI Agent activation | Blocked; not authorized by B4 | Yes |
| provider/model/API dispatch | Blocked; not authorized by B4 | Yes |
| sandbox-nexus runtime activation | Blocked; not authorized by B4 | Yes |
| sandbox task execution | Blocked; not authorized by B4 | Yes |
| accepted-code import | Blocked; not authorized by B4 | Yes |
| target-repo mutation | Blocked; not authorized by B4 | Yes |
| target-repo import | Blocked; not authorized by B4 | Yes |
| deployed database migration | Blocked; not authorized by B4 | Yes |
| deployed database mutation | Blocked; not authorized by B4 | Yes |
| migration application | Blocked; not authorized by B4 | Yes |
| GitHub automation | Blocked; not authorized by B4 | Yes |
| PR automation | Blocked; not authorized by B4 | Yes |
| deployment | Blocked; not authorized by B4 | Yes |
| production gates | Blocked; not authorized by B4 | Yes |
| source-of-truth transfer | Blocked; not authorized by B4 | Yes |
| hidden/background automation | Blocked; not authorized by B4 | Yes |

## 12. Risks and blockers

B4 records these risks and blockers:

- Migration-readiness remains held because the required environment evidence package is absent.
- Sandbox stress-test proof can be misread as sandbox runtime activation; B5-B9 must preserve supervised/manual boundaries.
- Route-packet export can be misread as automatic route execution; B5 must keep manual export/handoff only.
- Structured closeouts can be misread as CONTROL_THREAD acceptance; CONTROL_THREAD remains authority.
- `sandbox-nexus` intake can be simulated or fixture-based until a separate route authorizes runtime behavior.
- JAI Agent activation remains blocked until separately routed.
- Provider/model/API dispatch remains blocked until separately routed.
- Target-repo mutation, accepted-code import, GitHub automation, deployment, production gates, and source-of-truth transfer remain blocked.

## 13. Validation

B4 validation:

- `git diff --check`: pass.
- `git diff --cached --check`: pass after staging.
- Targeted non-authorization `rg` scan: pass with expected decision boundary, negated/non-authorization, existing source/test assertion, and prior docs hits only.

No runtime validation was run. No migration tests were run. No Prisma migration commands were run. No migrations were applied. No database connection was attempted. No APIs, providers, or models were called. No sandbox-nexus execution occurred. No JAI Agent action occurred. No target-repo mutation occurred. No accepted-code import occurred. No deployment or production-gate action occurred.

## 14. Authority boundary

B4 is a pivot decision artifact only. B4 does not authorize implementation changes, source changes, test changes, schema changes, migration changes, environment configuration changes, runtime configuration changes, migration application, deployed database mutation, provider/model/API dispatch, autonomous JAI Agent activation, sandbox-nexus runtime activation, sandbox task execution, accepted-code import, target-repo mutation, target-repo import, GitHub automation, PR automation, deployment, production gates, source-of-truth transfer, or hidden/background automation.

CONTROL_THREAD remains authority. B4 findings, B5-B9 route map, B5 recommendation, future route packets, exported packets, sandbox fixture packets, dry-run outputs, structured closeouts, app-local records, and validation results are advisory outputs only until CONTROL_THREAD acceptance.

## 15. Repo-lane closeout

Files changed:

- `docs/reference/q3m7-control-plane-sandbox-stress-test-pivot-decision-v0.md`

Migration subtrack hold finding:

- B4 holds the migration-readiness subtrack.
- A25-B3 remains useful future evidence.
- Migration application, deployed database mutation, mutation target confirmation, and active migration-evidence routing remain blocked.

A25-B3 evidence preservation finding:

- B4 preserves A25 implementation, A26 review, A27 plan, A28 tests, A29 review, A30 readiness review, B1 target-environment boundary review, B2 additional environment boundary review, and B3 evidence package review as deferred future migration evidence.

Revised Wave B-A route map:

- B4: pivot decision.
- B5: `dev-jai-nexus` supervised route-packet composer/export implementation.
- B6: `sandbox-nexus` supervised intake contract and fixture scenario.
- B7: `dev-jai-nexus` manual sandbox stress-test runner controls.
- B8: first supervised sandbox stress-test dry run.
- B9: sandbox stress-test closeout and Batch B-B route decision.

`dev-jai-nexus` control-plane proof target:

- Create, display, persist/export, and manually hand off structured route/work packets in app-local, non-authoritative form.

`sandbox-nexus` stress-test proof target:

- Receive or simulate intake, process a fixture/manual route packet, and return a structured closeout under supervision.

B5 implementation recommendation:

- Implement an app-local route-packet composer, preview/display, export/copy/manual handoff posture, and fixture-compatible structure for `sandbox-nexus`.
- Preserve no automatic send, no provider/model/API dispatch, no sandbox runtime activation, no JAI Agent activation, no target-repo mutation, no accepted-code import, no GitHub automation, and no production gates.

Validation:

- `git diff --check`: pass.
- `git diff --cached --check`: pass after staging.
- Targeted non-authorization scan: pass with expected boundary/negated/prior-source hits only.

Non-authorizations preserved:

- No PR was created.
- No implementation source/test/schema/migration/config/runtime changes were made outside this reference artifact.
- No migration was applied.
- No deployed database was mutated.
- No provider/model/API call was performed.
- No sandbox execution occurred.
- No JAI Agent action occurred.
- No target-repo mutation occurred.
- No accepted-code import occurred.
- No deployment or production-gate action occurred.

Recommended next CONTROL_THREAD route:

- `B5 dev-jai-nexus Supervised Route-Packet Composer Export Implementation v0`

PR description draft:

```md
## Role

Role: JAI::DEV::BUILDER

## Summary

Adds the B4 pivot decision artifact that holds the migration-readiness subtrack and pivots Wave B-A toward a supervised sandbox-nexus stress-test proof path.

## Files changed

- `docs/reference/q3m7-control-plane-sandbox-stress-test-pivot-decision-v0.md`

## Migration subtrack hold finding

B4 holds the migration-readiness subtrack. A25-B3 remains useful future evidence, while migration application, deployed database mutation, mutation target confirmation, and active migration-evidence routing remain blocked.

## A25-B3 evidence preservation finding

B4 preserves A25 implementation, A26 review, A27 plan, A28 tests, A29 review, A30 readiness review, B1 target-environment review, B2 additional environment review, and B3 evidence package review as deferred future migration evidence.

## Revised Wave B-A route map

B4 defines B4-B9: pivot decision, B5 route-packet composer/export implementation, B6 sandbox intake contract/fixture, B7 manual runner controls, B8 first supervised dry run, and B9 closeout / Batch B-B route decision.

## dev.jai.nexus control-plane proof target

`dev-jai-nexus` should create, display, persist/export, and manually hand off structured route/work packets in app-local, non-authoritative form.

## sandbox-nexus stress-test proof target

`sandbox-nexus` should receive or simulate intake, process a fixture/manual route packet, and return a structured closeout under supervision.

## B5 implementation recommendation

Recommend `dev-jai-nexus Supervised Route-Packet Composer Export Implementation v0` on `feature/q3m7-supervised-route-packet-composer-export-v0`, scoped to app-local composer, preview/display, export/copy/manual handoff, and sandbox-nexus fixture-compatible structure.

## Non-authorization scan

Targeted scan passed with expected decision boundary, negated/non-authorization, existing source/test assertion, and prior docs hits only.

## Validation

- `git diff --check`: pass
- `git diff --cached --check`: pass
- targeted non-authorization scan: pass

## Risks / remaining blockers

Sandbox runtime activation, JAI Agent activation, provider/model dispatch, accepted-code import, target-repo mutation, deployment, production gates, source-of-truth transfer, hidden/background automation, migration application, and deployed DB mutation remain blocked.

## Recommended next route

Recommend `B5 dev-jai-nexus Supervised Route-Packet Composer Export Implementation v0`.
```

# Control Thread Slot Architecture Planning v0

## 1. Purpose

This docs/reference artifact defines staged control-thread slot architecture and naming conventions for JAI NEXUS.

It defines the staged relationship among `ChatGPT_Control_Thread`, `Codex_Control_Thread`, future `JAI_Control_Thread`, future `JAI_<repo>` agents or repo-scoped agent surfaces, `JAI::AGENT::<role>` specialized role slots, Codex CLI as repo-scoped execution worker, repo lanes, NHID, project coverage state, `.nexus` directories, JAI Grid presets, and packet/closeout/acceptance flow.

This is docs/reference planning only. It does not add runtime activation, app automation, API/DB-backed state, persistence, Agent activation, Agent dispatch, provider/model dispatch, GitHub automation, browser/desktop control, `.jai` parser/runtime behavior, `.nexus` active runtime semantics, `JAI_Control_Thread` authority activation, `JAI_<repo>` runtime-agent activation, or gate behavior.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Strategic context

The current manual workflow uses ChatGPT as the high-context CONTROL_THREAD and Codex CLI as repo execution worker.

The desired direction is to introduce a `Codex_Control_Thread` for maximum Codex-side coordination capability while preserving Codex CLI as repo-scoped execution worker.

Eventually, JAI NEXUS should have its own native `JAI_Control_Thread` and repo-scoped `JAI_<repo>` agents or agent surfaces.

This architecture is staged. It does not activate native JAI control authority, repo agents, app-controlled Codex automation, or autonomous execution.

## 3. Accepted naming baseline

Accepted naming baseline:

- `ChatGPT_Control_Thread` = current external high-context controller.
- `Codex_Control_Thread` = Codex-side control mirror/coordinator for Codex CLI workflows.
- `JAI_Control_Thread` = future native JAI NEXUS control engine.
- `JAI_<repo>` = future repo-scoped JAI agent or agent surface.
- `JAI::AGENT::<role>` = specialized role slot.
- `NHID` = Numerical Hierarchy ID.
- NHID means Numerical Hierarchy ID.

| Name | Meaning | v0 posture |
| --- | --- | --- |
| `ChatGPT_Control_Thread` | current external high-context controller | current acceptance authority unless explicitly superseded |
| `Codex_Control_Thread` | Codex-side control mirror/coordinator for Codex CLI workflows | coordination mirror, not final acceptance authority |
| `JAI_Control_Thread` | future native JAI NEXUS control engine | future architecture, not active authority yet |
| `JAI_<repo>` | future repo-scoped JAI agent or agent surface | future/staged, not activated yet |
| `JAI::AGENT::<role>` | specialized role slot | staged role specialization, not runtime activation |
| `NHID` | Numerical Hierarchy ID | hierarchy identifier, not authority |

NHID = Numerical Hierarchy ID.

## 4. `ChatGPT_Control_Thread` role

`ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.

Current role:

- high-context external controller
- route and scope author
- acceptance boundary holder
- passalong and closeout evaluator
- authority source for human-approved repo work

`ChatGPT_Control_Thread` may issue instructions, accept or reject outputs, and define next routes through explicit user/CONTROL_THREAD decisions.

`ChatGPT_Control_Thread` does not make app runtime active, does not open gates by implication, and does not activate JAI repo agents through naming alone.

## 5. `Codex_Control_Thread` role

`Codex_Control_Thread` is a coordination mirror; it is not final acceptance authority.

Codex-side role:

- mirrors CONTROL_THREAD context for Codex workflows
- helps structure repo-scoped execution packets
- tracks validation, risks, and passalong expectations
- coordinates Codex CLI task execution boundaries
- preserves evidence for ChatGPT/CONTROL_THREAD review

`Codex_Control_Thread` must not be treated as autonomous app authority, repo self-acceptance, or final acceptance authority.

## 6. `JAI_Control_Thread` future role

`JAI_Control_Thread` is future native control architecture; it is not active authority yet.

Future role may include:

- native JAI NEXUS control engine posture
- project coverage state awareness
- NHID-aware work hierarchy representation
- domain-engine coordination
- JAI Grid preset awareness
- human approval checkpoints
- acceptance receipt lineage

`JAI_Control_Thread` authority activation is not authorized by this artifact.

## 7. `JAI_<repo>` future role

`JAI_<repo>` identifies future repo-scoped JAI agents or agent surfaces.

Examples:

- `JAI_dev-jai-nexus`
- `JAI_orchestrator-nexus`
- `JAI_jai-format`

`JAI_<repo>` agents are future/staged repo-scoped agents; they are not activated yet.

`JAI_<repo>` must not imply repo self-acceptance, automatic repo mutation, GitHub automation, branch/PR automation, Agent execution, or gate authority.

## 8. `JAI::AGENT::<role>` naming convention

`JAI::AGENT::<role>` identifies specialized role slots.

Examples:

- `JAI::AGENT::ARCHITECT`
- `JAI::AGENT::BUILDER`
- `JAI::AGENT::VERIFIER`
- `JAI::AGENT::LIBRARIAN`
- `JAI::AGENT::OPERATOR`

These role slots are staged role specialization labels. They do not imply activated runtime agents, provider/model dispatch, tool authority, repo mutation, or acceptance authority.

## 9. Relationship to Codex CLI

Codex CLI remains repo-scoped execution worker.

Codex CLI may operate within an explicitly scoped repo lane and branch instruction. It should report changes, validation, risks, and closeout details back to the controlling thread.

Codex CLI is not a native JAI runtime agent, not a JAI Grid runtime worker, not an autonomous app-controlled executor, and not final acceptance authority.

Codex automation by app is not authorized.

## 10. Relationship to repo lanes

Repo lanes identify scoped repo work boundaries.

Repo lane relationships:

- `ChatGPT_Control_Thread` defines or accepts the lane.
- `Codex_Control_Thread` may mirror and structure lane work.
- Codex CLI performs repo-scoped execution when explicitly instructed.
- future `JAI_<repo>` may represent staged repo-scoped surfaces.
- repo-generated artifacts report evidence; they do not self-accept.

Repo lanes do not grant repo self-acceptance, automatic branch/PR automation, or gate authority.

## 11. Relationship to NHID

NHID = Numerical Hierarchy ID.

NHID is a hierarchical coordination identifier for broad objectives, batches, lanes, work waves, work packets, route packets, closeouts, acceptance receipts, and related planning artifacts.

NHID identifies position, nesting, sequence, and relationship inside a work hierarchy.

NHID identifies hierarchy; it does not execute work.

NHID does not execute work, route work, mutate state, approve work, accept work, activate Agents, open gates, or grant authority.

Control-thread slots may use NHID to preserve context and hierarchy. NHID must not become workflow execution control or authority.

## 12. Relationship to project coverage state

Project coverage state helps represent whether projects, domains, Agents, artifacts, gates, risks, NHID hierarchy, and JAI Grid presets have readiness coverage.

Control-thread slot relationships:

- `ChatGPT_Control_Thread` may accept coverage posture.
- `Codex_Control_Thread` may mirror coverage gaps and evidence.
- future `JAI_Control_Thread` may eventually represent coverage natively after separate acceptance.
- future `JAI_<repo>` surfaces may expose repo-scoped coverage posture after separate acceptance.

Coverage state measures readiness; it does not approve readiness.

Coverage display is not activation.

## 13. Relationship to `.nexus` directories

`.nexus` directories are coordination substrate, not runtime authority.

Potential `.nexus` uses:

- domain-engine planning references
- NHID hierarchy references
- work-wave and packet references
- route packet and closeout references
- acceptance receipt references
- project coverage state references
- JAI Grid preset references

`.nexus` directories do not create runtime semantics, dispatch Agents, mutate route state, mutate motion state, create receipts, update canon, or open gates.

## 14. Relationship to JAI Grid presets

JAI Grid presets are planning concepts only unless separately authorized.

Control-thread slot relationship:

- `ChatGPT_Control_Thread` may use Grid preset plans as review context.
- `Codex_Control_Thread` may mirror Grid preset planning for repo execution context.
- future `JAI_Control_Thread` may eventually use Grid presets as native control views after separate acceptance.
- future `JAI_<repo>` surfaces may eventually show repo-scoped Grid posture after separate acceptance.

JAI Grid presets do not activate runtime behavior, dispatch Agents, run workflows, enforce policy, open gates, or grant authority.

## 15. Packet and closeout flow

Packet and closeout flow:

1. `ChatGPT_Control_Thread` defines broad objective, NHID context, scope, branch, and authority boundaries.
2. `Codex_Control_Thread` mirrors and structures Codex-side coordination context where useful.
3. Codex CLI performs explicitly scoped repo work.
4. Repo-generated artifacts report evidence; they do not self-accept.
5. Work packets define task scope.
6. Route packets recommend route/file/work boundaries; they do not route themselves.
7. Validation reports verify checks; they do not approve.
8. Closeout packets report results; they do not accept themselves.
9. Acceptance receipts record explicit CONTROL_THREAD decisions.
10. CONTROL_THREAD decides.

Packet flow is evidence and coordination flow, not autonomous execution flow.

## 16. Acceptance and authority model

Acceptance and authority model:

- `ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.
- `Codex_Control_Thread` is a coordination mirror; it is not final acceptance authority.
- `JAI_Control_Thread` is future native control architecture; it is not active authority yet.
- `JAI_<repo>` agents are future/staged repo-scoped agents; they are not activated yet.
- `JAI::AGENT::<role>` slots are specialized role labels; they are not runtime authority.
- Codex CLI remains repo-scoped execution worker.
- Repo-generated artifacts report evidence; they do not self-accept.
- Acceptance receipts record explicit CONTROL_THREAD decisions.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

No control-thread slot transition is authorized by this artifact.

## 17. Names to avoid

Avoid ambiguous or unsafe names:

- `CONTROL_THREAD` without source context when multiple control-thread slots exist.
- `Codex Agent` if it implies autonomous app-controlled Codex execution.
- `JAI Agent` if it implies activated runtime authority before gates.
- `JAI Repo Controller` if it implies repo self-acceptance.
- `Active Control Thread` for any future staged slot before explicit activation.
- Any NHID expansion other than `Numerical Hierarchy ID`.

Prefer explicit staged names: `ChatGPT_Control_Thread`, `Codex_Control_Thread`, `JAI_Control_Thread`, `JAI_<repo>`, and `JAI::AGENT::<role>`.

## 18. Non-authorized behaviors

This planning artifact does not authorize:

- runtime activation
- Codex automation by app
- autonomous execution
- repo self-acceptance
- API/DB-backed state
- persistence
- Agent activation
- Agent dispatch
- Agent execution
- Agent creation
- automatic Agent assignment
- provider/model dispatch
- live model calls
- GitHub/API automation
- browser/desktop control
- terminal execution by the app
- scheduler
- autonomous loop
- telemetry
- customer-data handling
- `.jai` parser/runtime behavior
- `.nexus` active runtime semantics
- `JAI_Control_Thread` authority activation
- `JAI_<repo>` runtime-agent activation
- policy enforcement
- gate opening
- automatic receipt creation
- canon mutation by the app
- route-state mutation
- motion-state mutation

ZERO GATES GRANTED.

## 19. Risks

- Risk: `Codex_Control_Thread` may be mistaken for final authority. Mitigation: preserve that it is a coordination mirror and not final acceptance authority.
- Risk: `JAI_Control_Thread` may be mistaken for active native authority. Mitigation: preserve that it is future architecture and not active authority yet.
- Risk: `JAI_<repo>` may imply runtime repo agents. Mitigation: preserve future/staged posture and no activation.
- Risk: `JAI::AGENT::<role>` may imply activated runtime Agents. Mitigation: preserve slot naming as staged role specialization.
- Risk: Codex CLI may be mistaken for app-automated Codex execution. Mitigation: preserve repo-scoped execution worker posture and no app automation.
- Risk: NHID may be mistaken for workflow execution control. Mitigation: preserve that NHID identifies hierarchy and does not execute work.
- Risk: `.nexus` directories or JAI Grid presets may imply runtime authority. Mitigation: preserve planning/substrate posture.

## 20. Recommended follow-up routes

Recommended next route:

- `Q3M7 Control Thread Slot Naming Review v0`

Alternative follow-up routes:

- `Q3M7 Codex Control Thread Packet Mirror Planning v0`
- `Q3M7 JAI Control Thread Future Authority Boundary Review v0`
- `Q3M7 JAI Repo Surface Naming Planning v0`
- `Q3M7 NHID Control Thread Context Review v0`

Future implementation routes require separate CONTROL_THREAD acceptance.

## 21. Verification notes

Verification notes:

- All required control-thread slot names are defined.
- Accepted naming baseline is preserved.
- NHID uses the corrected definition: Numerical Hierarchy ID.
- The incorrect legacy NHID expansion is not used.
- Codex CLI remains repo-scoped execution worker.
- `ChatGPT_Control_Thread` remains current acceptance authority unless explicitly superseded.
- `Codex_Control_Thread` is a coordination mirror and not final acceptance authority.
- `JAI_Control_Thread` and `JAI_<repo>` remain future/staged and inactive.
- Repo-generated artifacts report evidence and do not self-accept.
- Acceptance receipts record explicit CONTROL_THREAD decisions.
- Non-authorized behaviors remain blocked.

This artifact is docs/reference only.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

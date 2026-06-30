# Q3M7 Supervised Execution Control Surface Plan v0

## 1. Purpose

This artifact statically plans a future supervised execution control surface for `dev.jai.nexus` after accepted Batches A-D.

It plans how `dev.jai.nexus` could eventually display supervised execution status, route visibility, Program / Batch / Wave / Lane context, repo lane context, PR lifecycle context, validation / evidence summaries, human-confirmation checkpoints, closeout / passalong status, Linear mirror posture, JAI Agent candidate surfaces, Agent PR Factory candidate surfaces, CONTROL_THREAD decision separation, and failure / abort states.

Path decision: `docs/app` does not exist in this repository, so this artifact uses the requested fallback path `docs/reference/q3m7-supervised-execution-control-surface-plan-v0.md`.

Static planning only.

No UI implementation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Accepted baseline

Accepted baseline:

- Batch A accepted as planning-boundary foundation.
- Batch B accepted as planning-boundary / candidate-mapping foundation.
- Batch C accepted as planning-boundary / compatibility foundation.
- Batch D accepted as planning-boundary / compatibility foundation.
- Linear mirror is not source of truth.
- CONTROL_THREAD remains routing and acceptance authority.
- Closeout/passalong is not CONTROL_THREAD acceptance.
- Evidence summaries are not validation by themselves.
- Human-confirmation markers do not replace human confirmation.
- JAI Agent candidates are not activation, assignment, dispatch, or execution.
- Agent PR Factory candidates are not input authorization or activation.
- ZERO GATES GRANTED.

This baseline does not authorize UI implementation, component implementation, API/DB behavior, persistence, runtime activation, automation activation, GitHub/API automation, PR automation, scripting, JAI Agent activation, JAI Agent assignment, JAI Agent dispatch, JAI Agent execution, Agent PR Factory input authorization, Agent PR Factory activation, readiness approval, production authority, or gate opening.

## 3. Static planning scope

This static planning covers future display treatment for:

- Program / Batch / Wave / Lane display
- route status display
- repo lane display
- PR lifecycle display
- evidence summary display
- human-confirmation checkpoint display
- closeout / passalong display
- Linear mirror display
- CONTROL_THREAD acceptance display
- JAI Agent candidate display
- Agent PR Factory candidate display
- failure / abort display

Display only.

Static planning only.

No UI implementation.

No component implementation.

No API/DB behavior.

No persistence.

No runtime activation.

No automation activation.

No GitHub/API automation.

No PR automation.

No scripting.

No JAI Agent activation, assignment, dispatch, or execution.

No Agent PR Factory input authorization or activation.

## 4. Operator control-surface problem

Batches A-D produced planning-boundary, candidate-mapping, compatibility, PR lifecycle, drafting-surface, review-surface, and Agent supervision surface foundations.

Operators need a future consolidated control surface to see route status, lane context, repo state, PR lifecycle state, evidence summaries, human confirmation checkpoints, closeout/passalong status, Linear mirror posture, JAI Agent candidates, Agent PR Factory candidates, and CONTROL_THREAD decision separation.

The surface can reduce ambiguity across supervised execution work, but cannot implement UI, mutate state, automate GitHub/API actions, automate PR lifecycle actions, replace human confirmation, activate Agents, activate Agent PR Factory, or accept work.

CONTROL_THREAD remains routing and acceptance authority.

This artifact does not implement the control surface.

This artifact does not automate supervised execution.

This artifact does not mutate route state, repo state, PR state, Linear state, evidence state, canon, receipts, or gates.

This artifact does not replace CONTROL_THREAD.

This artifact does not remove human confirmation.

## 5. Target control-surface overview

Possible future control-surface regions:

| Region | Static display purpose | Boundary |
| --- | --- | --- |
| Program / Batch / Wave / Lane display | Show route structure and lane context | Not route authority. |
| route status display | Show supervised execution status labels | Does not mutate route state. |
| repo lane display | Show repo-local lane context | Does not mutate repo state. |
| PR lifecycle display | Show PR lifecycle context | Not PR automation. |
| evidence summary display | Show validation/evidence summaries | Not validation approval. |
| human-confirmation checkpoint display | Show required manual checkpoints | Does not replace confirmation. |
| closeout / passalong display | Show closeout/passalong status | Not CONTROL_THREAD acceptance. |
| Linear mirror display | Show optional mirror posture | Not source of truth. |
| CONTROL_THREAD acceptance display | Show acceptance posture | Does not accept work. |
| JAI Agent candidate display | Show Agent candidate posture | Not activation, assignment, dispatch, or execution. |
| Agent PR Factory candidate display | Show PR Factory candidate posture | Not input authorization or activation. |
| failure / abort display | Show blocked and incomplete states | Does not auto-recover. |

Display only.

Static planning only.

No UI implementation.

No API/DB behavior.

No persistence.

No runtime activation.

No automation activation.

No GitHub/API automation.

No PR automation.

No scripting.

No JAI Agent activation, assignment, dispatch, or execution.

No Agent PR Factory input authorization or activation.

## 6. Program / Batch / Wave / Lane display

Possible Program / Batch / Wave / Lane fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| program name | program context | Does not create route authority. |
| batch ID | batch context | Does not reorder work. |
| wave ID | wave context | Does not route work. |
| lane ID | lane context | Does not mutate lane state. |
| repo | repo context | Does not mutate repo. |
| thread | thread context | Reference only. |
| scope | route scope | Does not expand scope. |
| mode | route mode | Does not authorize behavior. |
| lane status | status label | Does not self-mutate. |
| accepted baseline pointer | context pointer | Does not create acceptance. |
| next route candidate | recommendation label | Does not route itself. |
| boundary marker | warning marker | Does not enforce boundary. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Program / Batch / Wave / Lane display is not route authority.

Display does not create, update, reorder, accept, or supersede routes.

Display does not mutate canon.

CONTROL_THREAD decides.

## 7. Route status display

Possible route status labels:

| Status | Display posture | Boundary |
| --- | --- | --- |
| route drafted | planning label | Does not send route. |
| route sent | evidence label if manually recorded | Does not self-validate route. |
| branch planned | planning label | Does not create branch. |
| branch pushed | evidence label if manually recorded | Does not push. |
| PR candidate | candidate label | Does not create PR. |
| PR opened manually | evidence label if manually recorded | Does not update PR. |
| PR review pending | status label | Does not submit review. |
| merge candidate | candidate label | Does not merge. |
| merged manually | evidence label if manually recorded | Not CONTROL_THREAD acceptance. |
| branch deletion candidate | candidate label | Does not delete branch. |
| branch deleted manually | evidence label if manually recorded | Not CONTROL_THREAD acceptance. |
| closeout drafted | draft label | Does not accept work. |
| passalong sent | evidence label if manually recorded | Does not accept work. |
| CONTROL_THREAD acceptance pending | pending label | Does not accept work. |
| accepted | accepted context if explicitly recorded | Requires CONTROL_THREAD acceptance. |
| held | status label | Does not resume work. |
| blocked | status label | Does not resolve blocker. |
| failed | status label | Does not auto-recover. |
| aborted | status label | Does not mutate route state. |
| superseded | status label | Does not mutate canon. |

Route status display is not routing authority.

Route status display does not mutate route state.

Route status display does not accept work.

CONTROL_THREAD remains routing and acceptance authority.

## 8. Repo lane display

Possible repo lane fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| repo | repo context | Does not mutate repo. |
| lane | lane context | Does not route work. |
| branch | branch pointer | Does not create branch. |
| artifact path | artifact pointer | Does not write file. |
| fallback path decision | path note | Does not create implementation authority. |
| commit hash | commit pointer | Does not create commit. |
| PR URL | PR pointer | Does not fetch or mutate PR. |
| files changed | evidence summary | Does not mutate files. |
| validation status | evidence label | Does not approve validation. |
| closeout status | closeout label | Does not accept work. |
| blocked authority marker | warning marker | Does not unblock authority. |
| stale assumption marker | stale marker | Does not mutate state. |

Repo lane display does not perform Git operations.

Repo lane display does not perform GitHub/API operations.

Repo lane display does not mutate repo state.

Repo lane display does not authorize implementation, automation, or acceptance.

## 9. PR lifecycle display

Possible PR lifecycle fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| branch | branch pointer | Does not create branch. |
| commit | commit pointer | Does not commit. |
| PR URL | PR pointer | Does not create/update PR. |
| PR description status | draft/evidence label | Does not update PR. |
| validation evidence status | evidence label | Does not approve work. |
| review state | review label | Does not submit review. |
| merge candidate marker | candidate marker | Does not merge. |
| branch deletion candidate marker | candidate marker | Does not delete branch. |
| merge status | evidence label if manually recorded | Not acceptance. |
| branch deletion status | evidence label if manually recorded | Not acceptance. |
| human confirmation marker | checkpoint marker | Does not confirm. |
| closeout required marker | reminder marker | Does not create closeout. |

PR lifecycle display is not PR automation.

PR lifecycle display does not create PRs.

PR lifecycle display does not update PRs.

PR lifecycle display does not review PRs.

PR lifecycle display does not merge.

PR lifecycle display does not delete branches.

Human confirmation remains required for irreversible steps.

CONTROL_THREAD decides.

## 10. Evidence summary display

Possible evidence summary fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| evidence type | evidence class | Does not create evidence. |
| command | command text | Does not run validation. |
| result | recorded result | Does not approve work. |
| status | evidence label | Does not approve validation. |
| skipped / N/A reason | evidence note | Does not waive review. |
| warning marker | warning label | Does not block/unblock. |
| missing evidence marker | missing label | Does not fetch evidence. |
| stale evidence marker | stale label | Does not mutate state. |
| human review marker | review reminder | Does not replace review. |
| source reference | source pointer | Does not replace source. |
| confidence / limitation note | limitation note | Does not create authority. |

Evidence summaries are not validation by themselves.

Evidence summary display is evidence summary only.

Evidence summary display does not run validation.

Evidence summary display does not approve validation.

Evidence summary display does not create readiness approval.

CONTROL_THREAD decides.

## 11. Human-confirmation checkpoint display

Possible human-confirmation checkpoints:

| Checkpoint | Display posture | Boundary |
| --- | --- | --- |
| route review | review marker | Does not route work. |
| branch creation | confirmation marker | Does not create branch. |
| Work Packet review | review marker | Does not execute work. |
| prompt submission | submission marker | Does not submit prompt. |
| commit | confirmation marker | Does not commit. |
| push | confirmation marker | Does not push. |
| PR open | confirmation marker | Does not open PR. |
| PR review | confirmation marker | Does not submit review. |
| merge | confirmation marker | Does not merge. |
| branch deletion | confirmation marker | Does not delete branch. |
| closeout passalong | confirmation marker | Does not send passalong. |
| CONTROL_THREAD acceptance request | request marker | Does not accept work. |
| JAI Agent candidate escalation | escalation marker | Does not activate, assign, dispatch, or execute Agent. |
| Agent PR Factory candidate escalation | escalation marker | Does not authorize input or activation. |

Human-confirmation markers do not replace human confirmation.

Human-confirmation checkpoint display does not perform irreversible steps.

Human judgment remains required.

CONTROL_THREAD decides.

## 12. Closeout / passalong display

Closeout / passalong display may use the accepted repo-lane closeout template:

1. Repo
2. Thread
3. Scope
4. Mode
5. Status
6. Branch
7. Commit hash
8. Merge commit, if available
9. Files changed
10. Baseline
11. Settled items
12. Active work completed
13. Validation commands and results
14. Conflicts
15. Dependencies
16. Merge-order constraints
17. Blocked routes
18. Stale assumptions
19. Open CONTROL_THREAD questions
20. Risks / follow-ups
21. Recommended next route
22. Boundary confirmation
23. ZERO GATES GRANTED

Closeout/passalong is not CONTROL_THREAD acceptance.

Closeout / passalong display is not CONTROL_THREAD acceptance.

Closeout drafts do not accept work.

Passalong drafts do not accept work.

Display does not mutate route state or canon.

CONTROL_THREAD decides.

## 13. Linear mirror display

Possible Linear mirror fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| Linear issue ID | mirror pointer | Does not mutate Linear. |
| Linear status | mirrored status | Not source of truth. |
| mirrored program / batch / wave / lane summary | mirror copy | Does not replace route. |
| mirrored route summary | mirror copy | Does not route work. |
| mirrored PR lifecycle summary | mirror copy | Does not automate PR lifecycle. |
| mirrored evidence summary | mirror copy | Not validation approval. |
| mirrored closeout summary | mirror copy | Not CONTROL_THREAD acceptance. |
| mirror freshness marker | freshness label | Does not fetch updates. |
| missing mirror marker | visibility label | Does not create mirror. |
| source-of-truth disclaimer | boundary copy | Does not enforce authority. |

Linear mirror is not source of truth.

Linear mirror display does not replace CONTROL_THREAD.

Linear mirror display does not authorize Linear mutation.

Linear mirror display does not authorize API behavior.

CONTROL_THREAD decides.

## 14. CONTROL_THREAD acceptance display

Possible CONTROL_THREAD acceptance statuses:

| Status | Display posture | Boundary |
| --- | --- | --- |
| not sent | status label | Does not send passalong. |
| passalong drafted | draft label | Does not accept work. |
| passalong sent | evidence label if manually recorded | Does not self-validate acceptance. |
| acceptance pending | pending label | Does not accept work. |
| accepted | accepted context | Requires explicit CONTROL_THREAD acceptance. |
| rejected | accepted context if present | Does not mutate route state. |
| held | status label | Does not resume work. |
| blocked | status label | Does not resolve blocker. |
| superseded | status label | Does not mutate canon. |

CONTROL_THREAD remains routing and acceptance authority.

CONTROL_THREAD acceptance display does not accept work.

`dev.jai.nexus` display is not CONTROL_THREAD acceptance.

Accepted status requires explicit CONTROL_THREAD acceptance.

Display does not self-validate acceptance.

Display does not mutate route state or canon.

CONTROL_THREAD decides.

## 15. JAI Agent candidate display

Possible JAI Agent candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| candidate role | candidate label | Not activation. |
| candidate participation area | planning area | Not execution authority. |
| candidate assignment area | planning area | Not assignment authority. |
| candidate dispatch area | planning area | Not dispatch authority. |
| candidate execution area | planning area | Not execution authority. |
| required route / review marker | review marker | Does not approve. |
| blocked authority marker | warning marker | Does not unblock authority. |
| human confirmation marker | confirmation marker | Does not confirm. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

JAI Agent candidates are not activation, assignment, dispatch, or execution.

JAI Agent candidate display is not JAI Agent activation.

JAI Agent candidate display is not assignment authority.

JAI Agent candidate display is not dispatch authority.

JAI Agent candidate display is not execution authority.

No JAI Agent activation, assignment, dispatch, or execution.

CONTROL_THREAD decides.

## 16. Agent PR Factory candidate display

Possible Agent PR Factory candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| candidate input type | candidate label | Not input authorization. |
| candidate activation type | candidate label | Not activation. |
| route packet reference | route pointer | Does not route itself. |
| Work Packet reference | packet pointer | Does not execute work. |
| PR lifecycle dependency | dependency marker | Does not automate PRs. |
| evidence dependency | evidence marker | Does not collect evidence. |
| required boundary review marker | review marker | Does not approve. |
| blocked authority marker | warning marker | Does not unblock authority. |
| human confirmation marker | confirmation marker | Does not confirm. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Agent PR Factory candidates are not input authorization or activation.

Agent PR Factory candidate display is not input authorization.

Agent PR Factory candidate display is not activation.

Agent PR Factory candidates require separate CONTROL_THREAD route and authority-boundary review.

No Agent PR Factory input authorization.

No Agent PR Factory activation.

No autonomous PR creation.

No autonomous PR review.

No autonomous merge.

No autonomous branch deletion.

No GitHub/API automation.

CONTROL_THREAD decides.

## 17. Failure / abort display

Possible failure / abort states:

| State | Display posture | Boundary |
| --- | --- | --- |
| missing route packet | missing marker | Does not fetch route. |
| incomplete lane context | incomplete marker | Does not mutate lane. |
| missing PR lifecycle context | missing marker | Does not fetch PR. |
| missing validation evidence | missing marker | Does not run validation. |
| stale evidence summary | stale marker | Does not mutate state. |
| unconfirmed human checkpoint | confirmation warning | Does not confirm. |
| Linear mirror stale or missing | visibility warning | Does not fetch Linear. |
| JAI Agent candidate blocked | blocker label | Does not activate, assign, dispatch, or execute Agent. |
| Agent PR Factory candidate blocked | blocker label | Does not authorize input or activation. |
| closeout incomplete | incomplete marker | Does not accept work. |
| passalong incomplete | incomplete marker | Does not send passalong. |
| CONTROL_THREAD acceptance pending | pending label | Does not accept work. |
| aborted route | abort label | Does not mutate route state. |
| manual intervention required | intervention marker | Does not perform intervention. |

Failure / abort display does not auto-recover.

Failure / abort display does not run scripts.

Failure / abort display does not mutate state.

Failure / abort display does not route work.

Failure / abort display does not activate Agents.

Failure / abort display does not activate Agent PR Factory.

Human review remains required.

## 18. What this surface can support

This surface planning can support:

- future supervised execution control-surface discussion
- future route visibility planning
- future Program / Batch / Wave / Lane display planning
- future repo lane display planning
- future PR lifecycle display planning
- future evidence summary display planning
- future human-confirmation checkpoint planning
- future closeout/passalong display planning
- future Linear mirror boundary planning
- future JAI Agent candidate display planning
- future Agent PR Factory candidate boundary review
- future CONTROL_THREAD acceptance separation planning
- future failure / abort state planning

Support does not create implementation authority, automation authority, activation authority, readiness approval, production authority, or gate opening.

## 19. What this surface cannot decide

This surface planning cannot decide:

- UI implementation approval
- component behavior
- API route behavior
- DB/Prisma/persistence behavior
- runtime activation
- automation activation
- GitHub/API integration
- GitHub/API mutation
- GitHub/API automation
- PR automation
- PR creation
- PR update
- PR review automation
- merge
- branch deletion
- scripting approval
- validation approval
- evidence approval
- CONTROL_THREAD acceptance
- Linear source-of-truth status
- JAI Agent activation
- JAI Agent assignment
- JAI Agent dispatch
- JAI Agent execution
- Agent PR Factory input authorization
- Agent PR Factory activation
- readiness approval
- production authority
- gate opening

CONTROL_THREAD decides.

## 20. Non-authorized behaviors

This artifact does not authorize:

- UI implementation.
- Component implementation.
- API route implementation.
- DB changes.
- Prisma changes.
- Persistence changes.
- Runtime activation.
- Automation activation.
- GitHub/API integration.
- GitHub/API mutation.
- GitHub/API automation.
- PR automation.
- PR creation automation.
- PR review automation.
- Merge automation.
- Branch deletion automation.
- Script implementation.
- Template-generator implementation.
- JAI Agent activation.
- JAI Agent creation.
- JAI Agent assignment.
- JAI Agent dispatch.
- JAI Agent execution.
- Agent PR Factory input authorization.
- Agent PR Factory activation.
- Autonomous routing.
- Autonomous Codex submission.
- Autonomous PR creation.
- Autonomous PR review.
- Autonomous merge.
- Autonomous branch deletion.
- Readiness approval.
- Production authority.
- Gate opening.

ZERO GATES is a non-authorization marker.

ZERO GATES GRANTED.

## 21. Risks

Risks:

- Control-surface display could be mistaken for control authority.
- Program / Batch / Wave / Lane display could be mistaken for route authority.
- Route status display could be mistaken for routing authority.
- Repo lane display could be mistaken for repo mutation authority.
- PR lifecycle display could be mistaken for PR automation.
- Evidence summary display could be mistaken for validation approval.
- Human-confirmation markers could be mistaken for human confirmation itself.
- Closeout/passalong display could be mistaken for CONTROL_THREAD acceptance.
- Linear mirror could be mistaken for source of truth.
- CONTROL_THREAD acceptance display could be mistaken for accepting work.
- JAI Agent candidate display could be mistaken for activation, assignment, dispatch, or execution.
- Agent PR Factory candidate display could be mistaken for input authorization or activation.
- ZERO GATES could be mistaken for readiness approval.

Mitigation:

- Keep all control-surface regions marked as display-only planning.
- Keep CONTROL_THREAD routing and acceptance separation visible in future routes.
- Keep human confirmation markers separate from human confirmation evidence.
- Route any future implementation, automation, Agent, or Agent PR Factory work through separate CONTROL_THREAD authority-boundary review.

## 22. Recommended follow-up routes

Recommended follow-up routes:

- `Q3M7 Supervised Execution Control Surface Boundary Review v0`
- `Q3M7 Program / Batch / Wave / Lane Display Vocabulary Planning v0`
- `Q3M7 Route Status Display Boundary Review v0`
- `Q3M7 Evidence Summary Display Boundary Review v0`
- `Q3M7 Human Confirmation Checkpoint Boundary Review v0`
- `Q3M7 Linear Mirror Source-of-Truth Boundary Review v0`
- `Q3M7 Agent PR Factory Candidate Boundary Review v0`

## 23. Verification notes

Planned verification:

- Confirm the artifact exists at `docs/reference/q3m7-supervised-execution-control-surface-plan-v0.md`.
- Confirm the fallback path decision is recorded because `docs/app` does not exist.
- Confirm all 24 required sections are present.
- Confirm accepted Batch A-D baseline wording is present.
- Confirm static planning only wording is present.
- Confirm no UI implementation wording is present.
- Confirm no API/DB behavior wording is present.
- Confirm no persistence wording is present.
- Confirm no runtime activation wording is present.
- Confirm no automation activation wording is present.
- Confirm no GitHub/API automation wording is present.
- Confirm no PR automation wording is present.
- Confirm no scripting wording is present.
- Confirm no JAI Agent activation / assignment / dispatch / execution wording is present.
- Confirm no Agent PR Factory input authorization / activation wording is present.
- Confirm closeout/passalong not acceptance wording is present.
- Confirm evidence summary not validation wording is present.
- Confirm human-confirmation wording is present.
- Confirm Linear mirror not source-of-truth wording is present.
- Confirm CONTROL_THREAD authority wording is present.
- Confirm ZERO GATES non-authorization wording is present.
- Run `git diff --check`.
- Stage docs and run `git diff --cached --check`.

Repo static/lint checks are not required for this docs-only static planning change unless repository policy requires them.

## 24. ZERO GATES GRANTED

ZERO GATES GRANTED.

No gates are opened.

No readiness approval is granted.

No production authority is granted.

CONTROL_THREAD decides.

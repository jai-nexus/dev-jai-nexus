# Q3M7 Pilot Operator Surface Static Plan v0

## 1. Purpose

This artifact statically plans a future pilot operator surface for `dev.jai.nexus` after accepted F1-F3 outputs.

It plans how `dev.jai.nexus` could eventually display a future pilot operator surface using accepted F1 pilot readiness map context, F2 pilot readiness / automation safety boundary review context, and F3 pilot readiness vocabulary context.

Path decision: `docs/app` does not exist in this repository, so this artifact uses the requested fallback path `docs/reference/q3m7-pilot-operator-surface-static-plan-v0.md`.

Static planning only.

No UI implementation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Accepted baseline

Accepted baseline:

- Batch A accepted.
- Batch B accepted.
- Batch C accepted.
- Batch D accepted.
- Batch E accepted.
- F1 Supervised Execution Pilot Readiness Map v0 accepted.
- F2 Pilot Readiness / Automation Safety Boundary Review v0 accepted.
- F3 Pilot Readiness Vocabulary v0 accepted.
- Pilot readiness is not readiness approval.
- Pilot candidate is not pilot authorization.
- Readiness candidates are not readiness approval.
- Production candidate is not production authority.
- Supervised execution planning is not execution authority.
- Control-surface planning is not implementation.
- Operator confirmation planning is not UI implementation.
- Linear mirror is not source of truth.
- Evidence summaries are not validation by themselves.
- Human-confirmation markers do not replace human confirmation.
- Closeout/passalong is not CONTROL_THREAD acceptance.
- JAI Agent candidate language is not JAI Agent activation, assignment, dispatch, or execution.
- Agent PR Factory candidate language is not Agent PR Factory activation or input authorization.
- Automation activation is not authorized.
- GitHub/API automation is not authorized.
- Scripting is not authorized.
- UI/API/DB/persistence remains unauthorized.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

This baseline does not authorize UI implementation, component implementation, API/DB behavior, DB/Prisma behavior, persistence, readiness approval, pilot authorization, production authority, source-of-truth transfer, route authority, acceptance authority, execution authority, runtime activation, automation activation, GitHub/API automation, PR automation, scripting, JAI Agent activation, Agent PR Factory activation, Agent PR Factory input authorization, or gate opening.

## 3. Static planning scope

This static planning covers future display treatment for:

- pilot readiness display
- pilot candidate display
- readiness candidate display
- safety review required display
- blocked readiness display
- operator-supervised-only display
- human-confirmation-required display
- evidence summary display
- closeout / passalong display
- Linear mirror display
- CONTROL_THREAD acceptance display
- automation / GitHub API / scripting blocker display
- UI / API / DB / persistence blocker display
- JAI Agent pilot candidate display
- Agent PR Factory pilot candidate display
- production / gate blocker display
- failure / abort display

Static planning only.

Display only.

No UI implementation.

No component implementation.

No API/DB behavior.

No persistence.

No readiness approval.

No pilot authorization.

No production authority.

No source-of-truth transfer.

No route authority.

No acceptance authority.

No execution authority.

No runtime activation.

No automation activation.

No GitHub/API automation.

No scripting.

No JAI Agent activation.

No Agent PR Factory activation.

No Agent PR Factory input authorization.

No gate opening.

## 4. Pilot operator surface problem

Accepted Batches A-E and F1-F3 provide planning, compatibility, confirmation, readiness, safety review, and pilot readiness vocabulary foundations.

Operators may eventually need a single pilot-facing surface to see pilot readiness status, pilot candidate status, readiness candidate status, safety review requirements, blocked readiness markers, supervised-only markers, human-confirmation requirements, evidence summaries, closeout/passalong status, Linear mirror posture, CONTROL_THREAD acceptance separation, automation blockers, implementation blockers, JAI Agent pilot candidates, Agent PR Factory pilot candidates, and production/gate blockers.

This surface can reduce ambiguity, but cannot grant readiness approval, authorize a pilot, authorize production, transfer source of truth, route work, accept work, execute work, activate automation, automate GitHub/API behavior, run scripts, activate JAI Agents, activate Agent PR Factory, authorize Agent PR Factory inputs, or open gates.

CONTROL_THREAD remains the routing and acceptance authority.

This artifact does not implement the pilot operator surface.

This artifact does not approve readiness.

This artifact does not authorize a pilot.

This artifact does not authorize production.

This artifact does not open gates.

This artifact does not mutate route state, repo state, PR state, Linear state, evidence state, canon, receipts, or gates.

This artifact does not replace CONTROL_THREAD.

This artifact does not remove human confirmation.

## 5. Target pilot operator surface overview

Possible future pilot operator surface regions:

| Region | Static display purpose | Boundary |
| --- | --- | --- |
| pilot readiness display | Show readiness posture | Not readiness approval. |
| pilot candidate display | Show pilot candidate context | Not pilot authorization. |
| readiness candidate display | Show readiness candidate context | Not readiness approval. |
| safety review required display | Show safety review requirement | Not approval. |
| blocked readiness display | Show blocked readiness reasons | Does not unblock work. |
| operator-supervised-only display | Show supervised-only posture | Not autonomous execution. |
| human-confirmation-required display | Show manual checkpoints | Does not replace confirmation. |
| evidence summary display | Show evidence summaries | Not validation by itself. |
| closeout / passalong display | Show closeout/passalong posture | Not CONTROL_THREAD acceptance. |
| Linear mirror display | Show mirror posture | Not source of truth. |
| CONTROL_THREAD acceptance display | Show acceptance posture | Not acceptance authority. |
| automation / GitHub API / scripting blocker display | Show blocked automation classes | Does not authorize automation. |
| UI / API / DB / persistence blocker display | Show blocked implementation classes | Does not authorize implementation. |
| JAI Agent pilot candidate display | Show Agent candidate posture | Not activation, assignment, dispatch, or execution. |
| Agent PR Factory pilot candidate display | Show PR Factory candidate posture | Not activation or input authorization. |
| production / gate blocker display | Show production and gate blockers | Not production authority or gate opening. |
| failure / abort display | Show incomplete and blocked states | Does not auto-recover. |

Static planning only.

Display only.

No UI implementation.

No component implementation.

No API/DB behavior.

No persistence.

No readiness approval.

No pilot authorization.

No production authority.

No source-of-truth transfer.

No route authority.

No acceptance authority.

No execution authority.

No runtime activation.

No automation activation.

No GitHub/API automation.

No scripting.

No JAI Agent activation.

No Agent PR Factory activation.

No Agent PR Factory input authorization.

No gate opening.

## 6. Pilot readiness display

Possible pilot readiness fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| pilot readiness status | readiness label | Not readiness approval. |
| readiness source | source pointer | Does not replace source. |
| readiness vocabulary marker | vocabulary context | Does not enforce vocabulary. |
| safety review requirement | review marker | Does not approve safety. |
| evidence summary marker | evidence marker | Not validation approval. |
| blocked readiness marker | blocker marker | Does not unblock work. |
| human confirmation marker | checkpoint marker | Does not confirm. |
| CONTROL_THREAD review marker | review marker | Does not approve. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Pilot readiness is not readiness approval.

Pilot readiness display is not readiness approval.

Readiness display does not approve readiness.

Readiness display does not authorize a pilot.

Readiness display does not authorize production.

CONTROL_THREAD decides.

## 7. Pilot candidate display

Possible pilot candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| pilot candidate name | candidate label | Not pilot authorization. |
| candidate scope | scope context | Does not expand authority. |
| candidate repo / lane | route context | Does not route work. |
| candidate readiness status | readiness label | Not readiness approval. |
| safety review status | review label | Not approval. |
| evidence requirement | evidence marker | Does not validate. |
| human-confirmation requirement | checkpoint marker | Does not confirm. |
| blocker marker | blocker label | Does not unblock work. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Pilot candidate is not pilot authorization.

Pilot candidate display is not pilot authorization.

Pilot candidate display does not authorize a pilot.

Pilot candidate display does not start a pilot.

Pilot candidate display does not authorize production.

CONTROL_THREAD decides.

## 8. Readiness candidate display

Possible readiness candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| readiness candidate type | candidate label | Not readiness approval. |
| readiness criterion | criterion context | Does not approve readiness. |
| evidence requirement | evidence marker | Does not collect evidence. |
| safety review requirement | review marker | Does not approve safety. |
| blocker marker | blocker label | Does not unblock work. |
| stale assumption marker | stale label | Does not mutate state. |
| human confirmation marker | checkpoint marker | Does not confirm. |
| CONTROL_THREAD review marker | review marker | Does not approve. |

Readiness candidates are not readiness approval.

Readiness candidate display is not readiness approval.

Readiness candidate display does not approve readiness.

Readiness candidate display does not unblock work.

CONTROL_THREAD decides.

## 9. Safety review required display

Possible safety review required fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| review type | review label | Not approval. |
| review target | target context | Does not authorize target. |
| required authority-boundary review | review requirement | Does not approve. |
| missing review marker | missing label | Does not fetch review. |
| completed review marker | evidence label if manually recorded | Does not self-approve readiness. |
| limitation marker | limitation label | Does not waive review. |
| blocked authority marker | warning marker | Does not unblock authority. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Safety review required display is not approval.

Safety review display does not approve readiness.

Safety review display does not authorize a pilot.

Safety review display does not authorize automation.

Safety review display does not open gates.

CONTROL_THREAD decides.

## 10. Blocked readiness display

Possible blocked readiness fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| blocked readiness reason | blocker label | Does not unblock work. |
| blocked authority class | authority label | Does not grant authority. |
| missing dependency | missing label | Does not fetch dependency. |
| missing evidence | missing label | Does not collect evidence. |
| missing safety review | missing label | Does not approve safety. |
| human confirmation required | checkpoint marker | Does not confirm. |
| required CONTROL_THREAD route | route marker | Does not route itself. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Blocked readiness display does not unblock work.

Blocked readiness display does not approve readiness.

Blocked readiness display does not authorize pilot execution.

Blocked readiness display does not mutate route state.

CONTROL_THREAD decides.

## 11. Operator-supervised-only display

Possible operator-supervised-only fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| supervision requirement | requirement marker | Does not supervise runtime. |
| human operator checkpoint | checkpoint marker | Does not confirm. |
| manual action marker | manual marker | Does not perform action. |
| autonomous execution blocker | blocker label | Does not authorize autonomy. |
| automation blocker | blocker label | Does not activate automation. |
| Agent blocker | blocker label | Does not activate Agent. |
| Agent PR Factory blocker | blocker label | Does not activate factory. |
| CONTROL_THREAD review marker | review marker | Does not approve. |

Operator-supervised-only display is not autonomous execution.

Supervised execution planning is not execution authority.

Operator supervision display does not execute work.

Operator supervision display does not activate automation.

Operator supervision display does not activate Agents.

Human supervision remains required.

CONTROL_THREAD decides.

## 12. Human-confirmation-required display

Possible human-confirmation checkpoints:

| Checkpoint | Display posture | Boundary |
| --- | --- | --- |
| readiness review | checkpoint marker | Does not approve readiness. |
| pilot candidate review | checkpoint marker | Does not authorize pilot. |
| safety review requirement review | checkpoint marker | Does not approve safety. |
| branch creation | checkpoint marker | Does not create branch. |
| prompt submission | checkpoint marker | Does not submit prompt. |
| commit | checkpoint marker | Does not commit. |
| push | checkpoint marker | Does not push. |
| PR open | checkpoint marker | Does not open PR. |
| PR review | checkpoint marker | Does not submit review. |
| merge | checkpoint marker | Does not merge. |
| branch deletion | checkpoint marker | Does not delete branch. |
| closeout passalong | checkpoint marker | Does not send passalong. |
| CONTROL_THREAD acceptance request | checkpoint marker | Does not accept work. |
| readiness approval candidate escalation | checkpoint marker | Does not approve readiness. |
| pilot authorization candidate escalation | checkpoint marker | Does not authorize pilot. |
| production authority candidate escalation | checkpoint marker | Does not authorize production. |
| gate candidate escalation | checkpoint marker | Does not open gate. |
| JAI Agent candidate escalation | checkpoint marker | Does not activate Agent. |
| Agent PR Factory candidate escalation | checkpoint marker | Does not activate factory. |

Human-confirmation markers do not replace human confirmation.

Human-confirmation-required display does not replace human confirmation.

Human-confirmation-required display does not perform irreversible steps.

Human judgment remains required.

CONTROL_THREAD decides.

## 13. Evidence summary display

Possible evidence summary fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| evidence type | evidence class | Does not create evidence. |
| command | command text | Does not run validation. |
| result | recorded result | Does not approve validation. |
| status | evidence label | Not readiness approval. |
| skipped / N/A reason | evidence note | Does not waive review. |
| warning marker | warning label | Does not block/unblock. |
| missing evidence marker | missing label | Does not fetch evidence. |
| stale evidence marker | stale label | Does not mutate state. |
| human review marker | review marker | Does not replace review. |
| source reference | source pointer | Does not replace source of truth. |
| limitation note | limitation label | Does not create authority. |
| readiness relation | relation label | Does not approve readiness. |

Evidence summaries are not validation by themselves.

Evidence summary display is not validation by itself.

Evidence summary display does not run validation.

Evidence summary display does not approve validation.

Evidence summary display does not create readiness approval.

Evidence summary display does not authorize a pilot.

CONTROL_THREAD decides.

## 14. Closeout / passalong display

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

Closeout/passalong display is not CONTROL_THREAD acceptance.

Closeout drafts do not accept work.

Passalong drafts do not accept work.

Display does not mutate route state or canon.

CONTROL_THREAD decides.

## 15. Linear mirror display

Possible Linear mirror fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| Linear issue ID | mirror pointer | Does not mutate Linear. |
| Linear status | mirrored status | Not source of truth. |
| mirrored pilot readiness summary | mirror copy | Not readiness approval. |
| mirrored pilot candidate summary | mirror copy | Not pilot authorization. |
| mirrored evidence summary | mirror copy | Not validation approval. |
| mirrored closeout summary | mirror copy | Not CONTROL_THREAD acceptance. |
| mirror freshness marker | freshness label | Does not fetch updates. |
| missing mirror marker | missing label | Does not create mirror. |
| source-of-truth disclaimer | boundary copy | Does not transfer source of truth. |
| limitation note | limitation label | Does not create authority. |

Linear mirror is not source of truth.

Linear mirror display is not source of truth.

Linear mirror display does not transfer source of truth.

Linear mirror display does not replace CONTROL_THREAD.

Linear mirror display does not authorize Linear mutation.

Linear mirror display does not authorize API behavior.

CONTROL_THREAD decides.

## 16. CONTROL_THREAD acceptance display

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

CONTROL_THREAD acceptance display is not acceptance authority.

CONTROL_THREAD acceptance display does not accept work.

`dev.jai.nexus` display is not CONTROL_THREAD acceptance.

Accepted status requires explicit CONTROL_THREAD acceptance.

Display does not self-validate acceptance.

Display does not mutate route state or canon.

CONTROL_THREAD decides.

## 17. Automation / GitHub API / scripting blocker display

Possible automation / GitHub API / scripting blocker fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| blocked automation type | blocker label | Does not activate automation. |
| blocked GitHub/API action | blocker label | Does not authorize GitHub/API. |
| blocked script or template-generator candidate | blocker label | Does not implement scripts or generators. |
| required review marker | review marker | Does not approve. |
| human confirmation marker | checkpoint marker | Does not confirm. |
| missing authority marker | warning marker | Does not grant authority. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Automation activation is not authorized.

Automation activation display does not activate automation.

GitHub/API automation is not authorized.

GitHub/API automation display does not authorize GitHub/API automation.

Scripting is not authorized.

No automation activation.

No GitHub/API automation.

No PR automation.

No script implementation.

No template-generator implementation.

CONTROL_THREAD decides.

## 18. UI / API / DB / persistence blocker display

Possible UI / API / DB / persistence blocker fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| blocked implementation class | blocker label | Does not authorize implementation. |
| blocked UI region | blocker label | Does not implement UI. |
| blocked API route | blocker label | Does not add API route. |
| blocked DB/Prisma behavior | blocker label | Does not change DB/Prisma. |
| blocked persistence behavior | blocker label | Does not persist state. |
| required implementation route | route marker | Does not route itself. |
| required boundary review | review marker | Does not approve. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

UI/API/DB/persistence remains unauthorized.

UI/API/DB/persistence display does not authorize implementation.

No UI implementation.

No component implementation.

No API route implementation.

No API/DB behavior.

No DB changes.

No Prisma changes.

No persistence changes.

CONTROL_THREAD decides.

## 19. JAI Agent pilot candidate display

Possible JAI Agent pilot candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| candidate role | candidate label | Not activation. |
| candidate pilot participation area | planning area | Not execution authority. |
| assignment candidate marker | candidate marker | Not assignment authority. |
| dispatch candidate marker | candidate marker | Not dispatch authority. |
| execution candidate marker | candidate marker | Not execution authority. |
| required route / review marker | review marker | Does not approve. |
| blocked authority marker | warning marker | Does not unblock authority. |
| human confirmation marker | checkpoint marker | Does not confirm. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

JAI Agent candidate language is not JAI Agent activation, assignment, dispatch, or execution.

JAI Agent pilot candidate display is not JAI Agent activation, assignment, dispatch, or execution.

No JAI Agent activation.

No JAI Agent assignment.

No JAI Agent dispatch.

No JAI Agent execution.

No execution authority.

CONTROL_THREAD decides.

## 20. Agent PR Factory pilot candidate display

Possible Agent PR Factory pilot candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| candidate input type | candidate label | Not input authorization. |
| candidate activation type | candidate label | Not activation. |
| route packet reference | route pointer | Does not route itself. |
| Work Packet reference | packet pointer | Does not execute work. |
| PR lifecycle dependency | dependency marker | Does not automate PRs. |
| evidence dependency | evidence marker | Does not validate. |
| required boundary review marker | review marker | Does not approve. |
| blocked authority marker | warning marker | Does not unblock authority. |
| human confirmation marker | checkpoint marker | Does not confirm. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Agent PR Factory candidate language is not Agent PR Factory activation or input authorization.

Agent PR Factory pilot candidate display is not Agent PR Factory activation or input authorization.

No Agent PR Factory activation.

No Agent PR Factory input authorization.

No autonomous PR creation.

No autonomous PR review.

No autonomous merge.

No autonomous branch deletion.

No GitHub/API automation.

CONTROL_THREAD decides.

## 21. Production / gate blocker display

Possible production / gate blocker fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| production candidate marker | candidate label | Not production authority. |
| production blocker | blocker label | Does not authorize production. |
| gate candidate marker | candidate label | Not gate opening. |
| gate blocker | blocker label | Does not open gates. |
| readiness approval blocker | blocker label | Does not approve readiness. |
| pilot authorization blocker | blocker label | Does not authorize pilot. |
| required CONTROL_THREAD review | review marker | Does not approve. |
| required safety review | review marker | Does not approve safety. |
| ZERO GATES marker | non-authorization marker | Does not open gates. |

Production candidate is not production authority.

Production candidate display is not production authority.

Gate candidate display is not gate opening.

No readiness approval.

No pilot authorization.

No production authority.

No gate opening.

ZERO GATES is a non-authorization marker.

CONTROL_THREAD decides.

## 22. Failure / abort display

Possible failure / abort states:

| State | Display posture | Boundary |
| --- | --- | --- |
| missing F1 readiness map context | missing marker | Does not fetch source. |
| missing F2 safety boundary review context | missing marker | Does not approve safety. |
| missing F3 vocabulary context | missing marker | Does not create vocabulary. |
| missing pilot candidate context | missing marker | Does not authorize pilot. |
| missing readiness evidence | missing marker | Does not collect evidence. |
| missing safety review | missing marker | Does not approve safety. |
| stale evidence summary | stale marker | Does not mutate evidence. |
| unconfirmed human checkpoint | checkpoint warning | Does not confirm. |
| blocked readiness state | blocker label | Does not unblock readiness. |
| blocked pilot authorization candidate | blocker label | Does not authorize pilot. |
| blocked production candidate | blocker label | Does not authorize production. |
| blocked gate candidate | blocker label | Does not open gate. |
| blocked automation candidate | blocker label | Does not activate automation. |
| blocked GitHub/API candidate | blocker label | Does not authorize GitHub/API. |
| blocked scripting candidate | blocker label | Does not implement scripts. |
| blocked UI/API/DB/persistence candidate | blocker label | Does not implement. |
| blocked JAI Agent pilot candidate | blocker label | Does not activate Agent. |
| blocked Agent PR Factory pilot candidate | blocker label | Does not activate factory. |
| closeout incomplete | incomplete marker | Does not accept work. |
| passalong incomplete | incomplete marker | Does not send passalong. |
| CONTROL_THREAD acceptance pending | pending label | Does not accept work. |
| aborted route | abort label | Does not mutate route state. |
| manual intervention required | intervention marker | Does not perform intervention. |

Failure / abort display does not auto-recover.

Failure / abort display does not run scripts.

Failure / abort display does not mutate state.

Failure / abort display does not route work.

Failure / abort display does not accept work.

Failure / abort display does not approve readiness.

Failure / abort display does not authorize pilot execution.

Failure / abort display does not authorize production.

Failure / abort display does not open gates.

Failure / abort display does not activate automation.

Failure / abort display does not activate Agents.

Failure / abort display does not activate Agent PR Factory.

Human review remains required.

## 23. What this surface can support

This surface planning can support:

- future pilot operator surface discussion
- future pilot readiness display planning
- future pilot candidate display planning
- future readiness candidate display planning
- future safety review required display planning
- future blocked readiness display planning
- future operator-supervised-only display planning
- future human-confirmation-required display planning
- future evidence summary display planning
- future closeout/passalong display planning
- future Linear mirror boundary planning
- future CONTROL_THREAD acceptance separation planning
- future automation / GitHub API / scripting blocker planning
- future UI / API / DB / persistence blocker planning
- future JAI Agent pilot candidate boundary review
- future Agent PR Factory pilot candidate boundary review
- future production / gate blocker planning
- future failure / abort vocabulary planning

Support does not create readiness approval, pilot authorization, production authority, source-of-truth transfer, route authority, acceptance authority, execution authority, implementation authority, automation activation, Agent activation, Agent PR Factory activation, or gate opening.

## 24. What this surface cannot decide

This surface planning cannot decide:

- UI implementation approval
- component behavior
- API route behavior
- API/DB behavior
- DB/Prisma/persistence behavior
- readiness approval
- pilot authorization
- production authority
- source-of-truth transfer
- route authority
- acceptance authority
- execution authority
- runtime activation
- automation activation
- GitHub/API automation
- PR automation
- scripting approval
- template-generator approval
- evidence validation approval
- CONTROL_THREAD acceptance
- Linear source-of-truth status
- JAI Agent activation
- JAI Agent assignment
- JAI Agent dispatch
- JAI Agent execution
- Agent PR Factory activation
- Agent PR Factory input authorization
- gate opening

CONTROL_THREAD decides.

## 25. Non-authorized behaviors

This artifact does not authorize:

- UI implementation.
- Component implementation.
- API route implementation.
- API/DB behavior.
- DB changes.
- Prisma changes.
- Persistence changes.
- Readiness approval.
- Pilot authorization.
- Production authority.
- Source-of-truth transfer.
- Route authority.
- Acceptance authority.
- Execution authority.
- Runtime activation.
- Automation activation.
- GitHub/API automation.
- PR automation.
- Script implementation.
- Template-generator implementation.
- JAI Agent activation.
- JAI Agent assignment.
- JAI Agent dispatch.
- JAI Agent execution.
- Agent PR Factory activation.
- Agent PR Factory input authorization.
- Gate opening.

ZERO GATES is a non-authorization marker.

ZERO GATES GRANTED.

## 26. Risks

Risks:

- Pilot readiness display could be mistaken for readiness approval.
- Pilot candidate display could be mistaken for pilot authorization.
- Readiness candidate display could be mistaken for readiness approval.
- Safety review required display could be mistaken for approval.
- Blocked readiness display could be mistaken for unblocking work.
- Operator-supervised-only display could be mistaken for execution authority.
- Human-confirmation-required display could be mistaken for human confirmation itself.
- Evidence summary display could be mistaken for validation approval.
- Closeout/passalong display could be mistaken for CONTROL_THREAD acceptance.
- Linear mirror display could be mistaken for source of truth.
- CONTROL_THREAD acceptance display could be mistaken for acceptance authority.
- Automation / GitHub API / scripting blocker display could be mistaken for automation authority.
- UI / API / DB / persistence blocker display could be mistaken for implementation authority.
- JAI Agent pilot candidate display could be mistaken for JAI Agent activation, assignment, dispatch, or execution.
- Agent PR Factory pilot candidate display could be mistaken for Agent PR Factory activation or input authorization.
- Production / gate blocker display could be mistaken for production authority or gate opening.
- ZERO GATES could be mistaken for readiness approval.

Mitigation:

- Keep pilot, readiness, safety, production, gate, Agent, PR Factory, implementation, and automation regions marked as display-only planning.
- Keep ZERO GATES and CONTROL_THREAD decision boundaries visible in any future pilot operator surface route.
- Route future implementation, readiness approval, pilot authorization, production authority, Agent, Agent PR Factory, automation, or gate work through separate CONTROL_THREAD authority-boundary review.

## 27. Recommended follow-up routes

Recommended follow-up routes:

- `Q3M7 Pilot Operator Surface Boundary Review v0`
- `Q3M7 Pilot Readiness Display Boundary Review v0`
- `Q3M7 Pilot Candidate Authorization Boundary Review v0`
- `Q3M7 Safety Review Required Display Boundary Review v0`
- `Q3M7 Blocked Readiness Display Boundary Review v0`
- `Q3M7 Production / Gate Blocker Display Boundary Review v0`
- `Q3M7 JAI Agent Pilot Candidate Boundary Review v0`
- `Q3M7 Agent PR Factory Pilot Candidate Boundary Review v0`

## 28. Verification notes

Planned verification:

- Confirm the artifact exists at `docs/reference/q3m7-pilot-operator-surface-static-plan-v0.md`.
- Confirm the fallback path decision is recorded because `docs/app` does not exist.
- Confirm all 29 required sections are present.
- Confirm accepted F1-F3 baseline wording is present.
- Confirm no UI/component implementation wording is present.
- Confirm no API/DB/persistence wording is present.
- Confirm no readiness approval wording is present.
- Confirm no pilot authorization wording is present.
- Confirm no production authority wording is present.
- Confirm source-of-truth non-transfer wording is present.
- Confirm route authority non-authorization wording is present.
- Confirm acceptance authority non-authorization wording is present.
- Confirm execution authority non-authorization wording is present.
- Confirm evidence summary not validation wording is present.
- Confirm human-confirmation wording is present.
- Confirm closeout/passalong not acceptance wording is present.
- Confirm Linear mirror not source-of-truth wording is present.
- Confirm no automation activation wording is present.
- Confirm no GitHub/API automation wording is present.
- Confirm no scripting wording is present.
- Confirm no JAI Agent activation wording is present.
- Confirm no Agent PR Factory activation/input authorization wording is present.
- Confirm CONTROL_THREAD authority wording is present.
- Confirm ZERO GATES non-authorization wording is present.
- Run `git diff --check`.
- Stage docs and run `git diff --cached --check`.

Repo static/lint checks are not required for this docs-only static planning change unless repository policy requires them.

## 29. ZERO GATES GRANTED

ZERO GATES GRANTED.

No gates are opened.

No readiness approval is granted.

No pilot authorization is granted.

No production authority is granted.

CONTROL_THREAD decides.

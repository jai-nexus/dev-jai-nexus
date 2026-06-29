# Q3M7 Prompt / Closeout Drafting Surface Plan v0

## 1. Purpose

This artifact statically plans a future operator-facing drafting surface for PR descriptions, repo closeouts, passalongs, validation evidence summaries, and human-confirmation markers in `dev.jai.nexus`.

Path decision: `docs/app` does not exist in this repository, so this artifact uses the requested fallback path `docs/reference/q3m7-prompt-closeout-drafting-surface-plan-v0.md`.

Static planning only.

No UI implementation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Accepted baseline

Accepted baseline:

- Batch A accepted as planning-boundary foundation.
- B1 PR Description / Closeout Template Planning v0 accepted.
- B2 PR Description / Closeout Vocabulary v0 accepted.
- B3 PR Description / Closeout Authority Boundary Review v0 accepted.
- PR description drafts are not PR creation authority.
- Closeout packets are not CONTROL_THREAD acceptance.
- Passalong packets are not CONTROL_THREAD acceptance.
- Validation evidence summaries are evidence summaries only.
- Human-confirmation markers do not replace human confirmation.
- Merge and branch deletion markers require human confirmation.
- Linear mirror is not source of truth.
- Work Packet coordination notes do not require route-facing NHIDs.
- Script-helper candidates are not script implementation.
- Template-generator candidates are not generator implementation.
- JAI Agent participation candidates are not JAI Agent activation.
- Agent PR Factory candidates require separate CONTROL_THREAD route and review.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

This baseline does not authorize implementation, generation, GitHub/API automation, Codex automation, JAI Agent activation, Agent PR Factory activation, readiness approval, production authority, or gate opening.

## 3. Static planning scope

This static planning covers future display treatment for:

- PR description draft display
- closeout draft display
- passalong draft display
- validation evidence summary display
- human-confirmation marker display
- merge confirmation marker display
- branch deletion confirmation marker display
- CONTROL_THREAD acceptance display
- Linear mirror display
- Work Packet coordination display
- script-helper candidate display
- template-generator candidate display
- JAI Agent participation candidate display
- Agent PR Factory candidate display
- failure / abort display

Display only.

Static planning only.

No UI implementation.

No API/DB behavior.

No persistence.

No scripting.

No template generator.

No GitHub/API automation.

No autonomous execution.

## 4. Operator drafting problem

Current manual drafting problem:

1. Operator receives a CONTROL_THREAD route.
2. Repo execution produces branch, commit, PR URL, changed files, and validation evidence.
3. PR description must be drafted from route context and closeout evidence.
4. Closeout packet must be drafted after merge / branch deletion.
5. Passalong to CONTROL_THREAD must preserve baseline, settled items, validation, dependencies, risks, blocked routes, and recommended next route.
6. Human confirmation is required before irreversible steps.
7. Drafting surfaces could reduce friction, but cannot replace human confirmation, CONTROL_THREAD acceptance, or source-of-truth authority.

This artifact does not automate drafting.

This artifact does not implement a template generator.

This artifact does not create PRs.

This artifact does not accept work.

This artifact does not replace CONTROL_THREAD.

## 5. Target drafting surface overview

Possible future drafting surface regions:

| Region | Static display purpose | Boundary |
| --- | --- | --- |
| PR description draft display | Show PR body draft fields | Not PR creation authority. |
| closeout draft display | Show accepted closeout template fields | Not CONTROL_THREAD acceptance. |
| passalong draft display | Show handoff packet fields | Not CONTROL_THREAD acceptance. |
| validation evidence summary display | Show validation evidence summary | Not validation approval. |
| human-confirmation marker display | Show required human checks | Does not replace confirmation. |
| merge confirmation marker display | Show merge marker | Does not merge. |
| branch deletion confirmation marker display | Show deletion marker | Does not delete branch. |
| CONTROL_THREAD acceptance display | Show acceptance posture | Display is not acceptance. |
| Linear mirror display | Show optional mirror context | Not source of truth. |
| Work Packet coordination display | Show coordination notes | Does not require route-facing NHIDs. |
| script-helper candidate display | Show candidate helper posture | Not script implementation. |
| template-generator candidate display | Show candidate generator posture | Not generator implementation. |
| JAI Agent participation candidate display | Show candidate Agent role | Not JAI Agent activation. |
| Agent PR Factory candidate display | Show candidate PR Factory posture | Requires separate route and review. |
| failure / abort display | Show incomplete/blocked states | Does not auto-recover. |

No component implementation.

No runtime activation.

No automation activation.

## 6. PR description draft display

Possible PR description draft fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| role | route role text | Does not assign Agent. |
| summary | draft copy | Does not create PR. |
| files changed | evidence summary | Does not mutate files. |
| scope | route scope summary | Does not route work. |
| artifact path | docs/code path pointer | Does not write files. |
| branch | branch ref | Does not create branch. |
| commit | commit ref | Does not create commit. |
| PR URL | PR reference | Does not open PR. |
| validation | evidence summary | Not validation approval. |
| authority boundary | boundary copy | Does not enforce authority. |
| risks / follow-ups | review notes | Does not route follow-up. |
| ZERO GATES marker | non-authorization marker | Not readiness approval. |

PR description display is not PR creation authority.

PR description display does not open, update, approve, or merge PRs.

PR description display does not perform GitHub/API automation.

Human review remains required.

## 7. Closeout draft display

Closeout draft display may use the accepted repo-lane closeout template:

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

Closeout display is not CONTROL_THREAD acceptance.

Closeout packets are not CONTROL_THREAD acceptance.

Closeout drafts do not mutate route state.

Closeout drafts do not mutate canon.

CONTROL_THREAD decides.

## 8. Passalong draft display

Possible passalong draft fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| sender / target | handoff context | Does not route itself. |
| repo | repo context | Does not mutate repo. |
| thread | thread context | Reference only. |
| scope | scope summary | Does not expand authority. |
| status | draft status | Does not accept work. |
| branch | branch ref | Does not create branch. |
| commit | commit ref | Does not create commit. |
| PR URL if relevant | PR ref | Does not mutate PR. |
| merge status | human-recorded marker | Not acceptance. |
| validation summary | evidence summary | Not validation approval. |
| boundary confirmation | boundary copy | Does not enforce authority. |
| next route recommendation | recommendation | Does not route itself. |
| ZERO GATES marker | non-authorization marker | Not readiness approval. |

Passalong display is not CONTROL_THREAD acceptance.

Passalong packets are not CONTROL_THREAD acceptance.

Passalong drafts do not route by themselves.

Passalong drafts do not mutate canon.

CONTROL_THREAD decides.

## 9. Validation evidence summary display

Possible validation evidence summary fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| command | command text | Does not run validation. |
| result | result text | Does not approve work. |
| status | pass/fail/N/A marker | Not readiness approval. |
| skipped / N/A reason | explanation | Does not waive review. |
| warning | evidence warning | Does not mutate state. |
| recurring non-blocking warning | warning note | Does not hide failures. |
| evidence missing marker | missing evidence marker | Does not fetch evidence. |
| human review marker | review reminder | Does not replace review. |
| stale evidence marker | stale warning | Does not refresh evidence. |

Validation evidence summaries are evidence summaries only.

Validation evidence summary display is not validation approval.

Validation evidence summary display is not readiness approval.

Validation evidence summary display does not run validation.

CONTROL_THREAD decides.

## 10. Human-confirmation marker display

Human-confirmation markers may cover:

| Marker | Confirmation required | Boundary |
| --- | --- | --- |
| branch creation | before creating branch | Marker does not create branch. |
| commit | before committing | Marker does not commit. |
| push | before pushing | Marker does not push. |
| PR open | before opening PR | Marker does not open PR. |
| PR description review | before using PR copy | Marker does not update PR. |
| merge | before merge | Marker does not merge. |
| branch deletion | before deletion | Marker does not delete branch. |
| closeout passalong | before sending closeout | Marker does not send. |
| CONTROL_THREAD acceptance request | before requesting acceptance | Marker does not accept. |

Human-confirmation markers do not replace human confirmation.

Human-confirmation marker display does not perform irreversible steps.

Human judgment remains required.

## 11. Merge confirmation marker display

Possible merge confirmation marker fields:

- merge method
- merge status
- PR URL
- original implementation commit
- merge commit, if available
- unresolved risks
- closeout required marker

Merge confirmation marker display does not merge.

Merge marker does not mean CONTROL_THREAD acceptance.

Merge requires human confirmation.

CONTROL_THREAD decides.

## 12. Branch deletion confirmation marker display

Possible branch deletion marker fields:

- branch name
- deletion status
- deletion timestamp if manually recorded
- PR merge status
- closeout required marker
- stale branch warning

Branch deletion marker display does not delete branches.

Branch deletion requires human confirmation.

Deleted branch does not mean CONTROL_THREAD acceptance.

CONTROL_THREAD decides.

## 13. CONTROL_THREAD acceptance display

Possible CONTROL_THREAD acceptance statuses:

- not sent
- passalong drafted
- passalong sent
- acceptance pending
- accepted
- rejected
- held
- blocked
- superseded

`dev.jai.nexus` display is not CONTROL_THREAD acceptance.

Accepted status requires explicit CONTROL_THREAD acceptance.

Display does not self-validate acceptance.

Display does not mutate route state or canon.

CONTROL_THREAD decides.

## 14. Linear mirror display

Possible Linear mirror fields:

- Linear issue ID
- Linear status
- mirrored route summary
- mirrored closeout summary
- freshness marker
- source-of-truth disclaimer
- missing mirror marker

Linear mirror is not source of truth.

Linear mirror does not replace CONTROL_THREAD.

Linear mirror display does not authorize Linear mutation.

Linear mirror display does not authorize API behavior.

CONTROL_THREAD decides.

## 15. Work Packet coordination display

Work Packet coordination display may show:

- Work Packet note
- route relationship summary
- closeout relationship summary
- passalong relationship summary
- operator coordination note
- unresolved handoff note

Work Packet coordination notes do not require route-facing NHIDs.

Work Packet display does not execute work.

Work Packet display does not route work by itself.

Work Packet display does not mutate route state.

CONTROL_THREAD decides.

## 16. Script-helper candidate display

Script-helper candidate display may show candidate helper names, candidate inputs, blocked actions, required confirmations, and required boundary review.

Script-helper candidates are not script implementation.

No script implementation.

No runtime activation.

No automation activation.

No filesystem walking.

No GitHub/API automation.

Script helpers require separate CONTROL_THREAD route and authority-boundary review.

## 17. Template-generator candidate display

Template-generator candidate display may show candidate template families, source field needs, output posture, blocked actions, and required boundary review.

Template-generator candidates are not generator implementation.

No template-generator implementation.

No API/DB behavior.

No persistence.

No automation activation.

Template generators require separate CONTROL_THREAD route and authority-boundary review.

## 18. JAI Agent participation candidate display

JAI Agent participation candidate display may show candidate roles, proposed assistance boundaries, human-confirmation needs, and blocked authority classes.

JAI Agent participation candidates are not JAI Agent activation.

No JAI Agent activation.

No JAI Agent creation.

No JAI Agent assignment.

No JAI Agent dispatch.

No JAI Agent execution.

No autonomous execution.

Human confirmation remains required.

CONTROL_THREAD decides.

## 19. Agent PR Factory candidate display

Agent PR Factory candidate display may show candidate PR Factory posture, required inputs, human-confirmation blockers, GitHub/API blockers, merge blockers, branch deletion blockers, and required review.

Agent PR Factory candidates require separate CONTROL_THREAD route and review.

Agent PR Factory candidates are not Agent PR Factory activation.

No Agent PR Factory activation.

No Agent PR Factory input authorization.

No GitHub/API automation.

No PR automation.

No merge automation.

No branch deletion automation.

No readiness approval.

CONTROL_THREAD decides.

## 20. Failure / abort display

Possible failure and abort states:

| State | Display posture | Boundary |
| --- | --- | --- |
| missing route packet | missing input marker | Does not fetch route. |
| incomplete PR description evidence | warning | Does not generate automatically. |
| missing validation evidence | warning | Does not run validation. |
| failed validation | failure marker | Does not approve. |
| unconfirmed human step | confirmation warning | Does not confirm. |
| merge not confirmed | merge warning | Does not merge. |
| branch deletion not confirmed | deletion warning | Does not delete. |
| closeout incomplete | incomplete marker | Does not accept. |
| passalong incomplete | incomplete marker | Does not route. |
| CONTROL_THREAD acceptance pending | pending marker | Does not accept. |
| aborted route | abort marker | Does not mutate route state. |
| manual intervention required | intervention marker | Does not auto-recover. |

Failure / abort display does not auto-recover.

Failure / abort display does not run scripts.

Failure / abort display does not mutate state.

Failure / abort display does not route work.

Human review remains required.

## 21. What this surface can support

This surface planning can support:

- future drafting-surface discussion
- future PR description drafting flow planning
- future closeout drafting flow planning
- future passalong drafting flow planning
- future validation evidence summary display planning
- future human-confirmation marker planning
- future Linear mirror boundary planning
- future Work Packet coordination display planning
- future script-helper candidate review
- future template-generator candidate review
- future JAI Agent participation boundary review
- future Agent PR Factory boundary review

This support is planning support only, not implementation approval.

## 22. What this surface cannot decide

This surface planning cannot decide:

- UI implementation approval
- component behavior
- API route behavior
- DB/Prisma/persistence behavior
- runtime behavior
- scripting approval
- template-generator approval
- GitHub/API integration
- Codex execution
- autonomous execution
- PR creation authority
- PR update authority
- PR merge authority
- branch deletion authority
- CONTROL_THREAD acceptance
- Linear source-of-truth status
- JAI Agent activation
- Agent PR Factory activation
- Agent PR Factory input authorization
- readiness approval
- production authority
- gate opening

CONTROL_THREAD decides.

## 23. Non-authorized behaviors

This artifact does not authorize:

- UI implementation
- component implementation
- API route implementation
- DB changes
- Prisma changes
- persistence changes
- script implementation
- template-generator implementation
- GitHub/API integration
- GitHub/API mutation
- Codex execution
- Codex automation
- autonomous execution
- JAI Agent activation
- JAI Agent creation
- JAI Agent assignment
- JAI Agent dispatch
- JAI Agent execution
- Agent PR Factory activation
- Agent PR Factory input authorization
- readiness approval
- production authority
- gate opening

ZERO GATES GRANTED.

## 24. Risks

Risks and mitigations:

| Risk | Mitigation |
| --- | --- |
| Draft display could be mistaken for generation or automation. | Preserve static planning and no template-generator implementation wording. |
| PR description display could be mistaken for PR creation authority. | Preserve PR description display is not PR creation authority. |
| Closeout display could be mistaken for CONTROL_THREAD acceptance. | Preserve closeout display is not CONTROL_THREAD acceptance. |
| Passalong display could be mistaken for CONTROL_THREAD acceptance. | Preserve passalong display is not CONTROL_THREAD acceptance. |
| Validation evidence summary display could be mistaken for validation approval. | Preserve evidence-summary-only wording. |
| Human-confirmation markers could be mistaken for human confirmation itself. | Preserve markers do not replace confirmation. |
| Merge / branch deletion markers could be mistaken for authority to merge or delete. | Preserve human confirmation requirement. |
| Linear mirror could be mistaken for source of truth. | Preserve Linear mirror is not source of truth. |
| Work Packet coordination notes could be over-specified with route-facing NHIDs. | Preserve no route-facing NHID requirement. |
| Script-helper candidates could be mistaken for script implementation. | Preserve candidate-only posture. |
| Template-generator candidates could be mistaken for generator implementation. | Preserve candidate-only posture. |
| JAI Agent participation candidates could be mistaken for JAI Agent activation. | Preserve no Agent activation wording. |
| Agent PR Factory candidates could be mistaken for Agent PR Factory activation. | Preserve separate route/review and no activation wording. |
| ZERO GATES could be mistaken for readiness approval. | Preserve ZERO GATES is a non-authorization marker. |

## 25. Recommended follow-up routes

Recommended follow-up routes:

- `Q3M7 Prompt / Closeout Drafting Surface Boundary Review v0`
- `Q3M7 Human Confirmation Marker Vocabulary Planning v0`
- `Q3M7 Validation Evidence Summary Display Boundary Review v0`
- `Q3M7 Template Generator Candidate Authority Boundary Review v0`
- `Q3M7 Agent PR Factory Candidate Boundary Review v0`
- `Q3M7 Linear Mirror Source-of-Truth Boundary Review v0`

Future implementation, scripting, template-generator, GitHub/API, Codex, JAI Agent, Agent PR Factory, readiness, production, or gate routes require separate CONTROL_THREAD acceptance.

## 26. Verification notes

Verification notes:

- All 27 required sections are present.
- Fallback path decision is recorded because `docs/app` does not exist.
- Accepted B1-B3 baseline is preserved.
- Static planning only is stated.
- No UI implementation and no component implementation are stated.
- No API/DB behavior is stated.
- No persistence is stated.
- No runtime activation and no automation activation are stated.
- No script implementation is stated.
- No template-generator implementation is stated.
- No GitHub/API automation is stated.
- No autonomous Codex submission is stated.
- PR description display is not PR creation authority.
- Closeout display is not CONTROL_THREAD acceptance.
- Passalong display is not CONTROL_THREAD acceptance.
- Validation evidence summary display is not validation approval.
- Human-confirmation markers do not replace human confirmation.
- Merge and branch deletion markers require human confirmation.
- Linear mirror is not source of truth.
- Work Packet coordination notes do not require route-facing NHIDs.
- JAI Agent participation candidates are not JAI Agent activation.
- Agent PR Factory candidates require separate CONTROL_THREAD route and review.
- CONTROL_THREAD decides.
- ZERO GATES is a non-authorization marker.
- ZERO GATES GRANTED remains explicit.

## 27. ZERO GATES GRANTED

ZERO GATES is a non-authorization marker.

ZERO GATES GRANTED.

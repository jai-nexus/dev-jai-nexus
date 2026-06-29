# Q3M7 PR Review Surface Static Plan v0

## 1. Purpose

This artifact statically plans a future PR review surface for `dev.jai.nexus` after accepted C1-C3 outputs.

It plans how `dev.jai.nexus` could eventually display PR lifecycle states, PR review support, validation evidence, human-confirmation markers, merge candidates, branch deletion candidates, closeout/passalong separation, and CONTROL_THREAD acceptance separation.

Path decision: `docs/app` does not exist in this repository, so this artifact uses the requested fallback path `docs/reference/q3m7-pr-review-surface-static-plan-v0.md`.

Static planning only.

No UI implementation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Accepted baseline

Accepted baseline:

- Batch A accepted as planning-boundary foundation.
- Batch B accepted as planning-boundary / candidate-mapping foundation.
- C1 PR Lifecycle Supervision Boundary v0 accepted.
- C2 GitHub PR Lifecycle / Mutation Authority Review v0 accepted.
- C3 PR State / Human Confirmation Vocabulary v0 accepted.
- PR lifecycle supervision planning is not PR automation authority.
- PR lifecycle states are planning/status labels only.
- PR description drafts are not PR creation authority.
- PR creation candidates are not PR creation.
- PR review support is not merge authority.
- GitHub/API language is not GitHub/API automation authority.
- Validation evidence is evidence only.
- Human-confirmation markers do not replace human confirmation.
- Squash merge and branch deletion require human confirmation.
- Closeout/passalong is not CONTROL_THREAD acceptance.
- Linear mirror is not source of truth.
- Work Packet coordination notes do not create execution authority.
- Script-helper candidates are not script implementation.
- Template-generator candidates are not generator implementation.
- JAI Agent participation candidates are not JAI Agent activation.
- Agent PR Factory candidates require separate CONTROL_THREAD route and review.
- CONTROL_THREAD decides.
- ZERO GATES GRANTED.

This baseline does not authorize PR automation, GitHub/API automation, merge automation, branch deletion automation, scripting, JAI Agent activation, Agent PR Factory activation, readiness approval, production authority, or gate opening.

## 3. Static planning scope

This static planning covers future display treatment for:

- PR lifecycle state display
- PR description draft display
- PR creation candidate display
- PR review support display
- validation evidence display
- human-confirmation marker display
- squash merge candidate display
- branch deletion candidate display
- closeout / passalong display
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

No GitHub/API integration.

No GitHub/API mutation.

No PR automation.

No scripting.

No autonomous execution.

## 4. Operator PR review problem

Current manual PR review problem:

1. CONTROL_THREAD routes work to a repo.
2. Repo work produces a branch, commit, PR URL, changed files, and validation evidence.
3. Operator must review PR state, PR description, validation evidence, and authority boundaries.
4. Human must decide whether to squash merge and delete the branch.
5. Closeout/passalong must remain distinct from CONTROL_THREAD acceptance.
6. `dev.jai.nexus` could eventually help display review state, but cannot create PRs, update PRs, review PRs automatically, merge, delete branches, or accept work.

This artifact does not automate PR review.

This artifact does not create PRs.

This artifact does not merge.

This artifact does not delete branches.

This artifact does not replace CONTROL_THREAD.

This artifact does not remove human confirmation.

## 5. Target PR review surface overview

Possible future PR review surface regions:

| Region | Static display purpose | Boundary |
| --- | --- | --- |
| PR lifecycle state display | Show planning/status labels | Not authority. |
| PR description draft display | Show PR body draft fields | Not PR creation authority. |
| PR creation candidate display | Show PR candidate fields | Does not create PRs. |
| PR review support display | Show evidence and risk context | Not merge authority. |
| validation evidence display | Show command/result evidence | Evidence only. |
| human-confirmation marker display | Show required human checks | Does not replace confirmation. |
| squash merge candidate display | Show merge candidate posture | Does not merge. |
| branch deletion candidate display | Show deletion candidate posture | Does not delete branch. |
| closeout / passalong display | Show closeout/passalong fields | Not CONTROL_THREAD acceptance. |
| CONTROL_THREAD acceptance display | Show acceptance posture | Does not accept work. |
| Linear mirror display | Show optional mirror context | Not source of truth. |
| Work Packet coordination display | Show coordination notes | Does not create execution authority. |
| script-helper candidate display | Show candidate helper posture | Not script implementation. |
| template-generator candidate display | Show candidate generator posture | Not generator implementation. |
| JAI Agent participation candidate display | Show candidate Agent role | Not JAI Agent activation. |
| Agent PR Factory candidate display | Show candidate PR Factory posture | Requires separate route and review. |
| failure / abort display | Show incomplete/blocked states | Does not auto-recover. |

No component implementation.

No GitHub/API automation.

No PR creation automation.

No PR review automation.

No merge automation.

No branch deletion automation.

## 6. PR lifecycle state display

Possible PR lifecycle states:

| State | Display posture | Boundary |
| --- | --- | --- |
| route received | route context | Does not route work. |
| branch planned | planning label | Does not create branch. |
| branch pushed | evidence label if manually recorded | Does not push. |
| PR candidate | candidate label | Does not create PR. |
| PR opened manually | evidence label if manually recorded | Does not update PR. |
| PR description drafted | draft label | Does not create/update PR. |
| validation evidence available | evidence label | Does not approve work. |
| review pending | review label | Does not submit review. |
| merge candidate | candidate label | Does not merge. |
| squash merged manually | evidence label if manually recorded | Not acceptance. |
| branch deletion candidate | candidate label | Does not delete branch. |
| branch deleted manually | evidence label if manually recorded | Not acceptance. |
| closeout drafted | draft label | Does not accept work. |
| passalong sent | evidence label if manually recorded | Not acceptance. |
| CONTROL_THREAD acceptance pending | pending label | Does not accept work. |
| accepted by CONTROL_THREAD | accepted context | Requires explicit CONTROL_THREAD acceptance. |
| held | status label | Does not resume work. |
| blocked | status label | Does not resolve blocker. |
| failed | status label | Does not auto-recover. |
| aborted | status label | Does not mutate route state. |

PR lifecycle states are planning/status labels only.

PR lifecycle state display is not authority.

PR lifecycle supervision planning is not PR automation authority.

State display does not mutate route state, PR state, repo state, canon, receipts, or gates.

CONTROL_THREAD decides.

## 7. PR description draft display

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

PR description drafts are not PR creation authority.

PR description display does not create PRs.

PR description display does not update PRs.

PR description display does not approve PRs.

PR description display does not merge PRs.

PR description display does not perform GitHub/API automation.

Human review remains required.

## 8. PR creation candidate display

Possible PR creation candidate fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| target branch | branch candidate | Does not create PR. |
| base branch | base candidate | Does not open PR. |
| title candidate | draft title | Does not mutate GitHub. |
| body candidate | draft body | Does not update PR. |
| commit hash | evidence pointer | Does not commit. |
| files changed | evidence summary | Does not mutate files. |
| validation evidence marker | evidence marker | Does not approve. |
| human confirmation required marker | confirmation reminder | Does not confirm. |

PR creation candidates are not PR creation.

PR creation candidate display does not create PRs.

PR creation candidate display does not authorize PR creation.

No GitHub/API automation.

Human confirmation remains required.

CONTROL_THREAD decides.

## 9. PR review support display

Possible PR review support fields:

- PR URL
- branch
- commit
- changed files
- validation evidence summary
- risk summary
- boundary confirmation
- unresolved questions
- merge candidate marker
- branch deletion candidate marker
- closeout readiness marker

PR review support is not merge authority.

PR review support display does not submit GitHub reviews.

PR review support display does not approve PRs.

PR review support display does not request changes.

PR review support display does not merge.

Human confirmation remains required.

CONTROL_THREAD decides.

## 10. Validation evidence display

Possible validation evidence fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| command | command text | Does not run validation. |
| result | result text | Does not approve work. |
| status | pass/fail/N/A marker | Not readiness approval. |
| skipped / N/A reason | explanation | Does not waive review. |
| warning | evidence warning | Does not mutate state. |
| recurring non-blocking warning | warning note | Does not hide failures. |
| evidence missing marker | missing evidence marker | Does not fetch evidence. |
| stale evidence marker | stale warning | Does not refresh evidence. |
| human review marker | review reminder | Does not replace review. |

Validation evidence is evidence only.

Validation evidence display does not run validation.

Validation evidence display does not approve work.

Validation evidence display does not create readiness approval.

CONTROL_THREAD decides.

## 11. Human-confirmation marker display

Human-confirmation markers may cover:

| Marker | Confirmation required | Boundary |
| --- | --- | --- |
| branch creation | before creating branch | Marker does not create branch. |
| commit | before committing | Marker does not commit. |
| push | before pushing | Marker does not push. |
| PR open | before opening PR | Marker does not open PR. |
| PR review | before submitting any human review | Marker does not review. |
| squash merge | before merge | Marker does not merge. |
| branch deletion | before deletion | Marker does not delete branch. |
| closeout passalong | before sending closeout | Marker does not send. |
| CONTROL_THREAD acceptance request | before requesting acceptance | Marker does not accept. |

Human-confirmation markers do not replace human confirmation.

Human-confirmation marker display does not perform irreversible steps.

Human judgment remains required.

CONTROL_THREAD decides.

## 12. Squash merge candidate display

Possible squash merge candidate fields:

- PR URL
- merge method candidate
- validation status
- unresolved risk marker
- human confirmation marker
- closeout required marker
- branch deletion candidate marker
- original implementation commit
- merge commit if available

Squash merge candidate display does not merge.

Merge candidates require human confirmation.

Merge candidate does not mean merge authority.

Merge candidate does not mean CONTROL_THREAD acceptance.

CONTROL_THREAD decides.

## 13. Branch deletion candidate display

Possible branch deletion candidate fields:

- branch name
- PR merge status
- deletion candidate marker
- stale branch warning
- human confirmation marker
- closeout required marker

Branch deletion candidate display does not delete branches.

Branch deletion candidates require human confirmation.

Branch deletion candidate does not mean branch deletion authority.

Deleted branch does not mean CONTROL_THREAD acceptance.

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

Closeout/passalong display is not CONTROL_THREAD acceptance.

Closeout drafts do not accept work.

Passalong drafts do not accept work.

Closeout/passalong display does not mutate route state.

Closeout/passalong display does not mutate canon.

CONTROL_THREAD decides.

## 15. CONTROL_THREAD acceptance display

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

CONTROL_THREAD acceptance display does not accept work.

`dev.jai.nexus` display is not CONTROL_THREAD acceptance.

Accepted status requires explicit CONTROL_THREAD acceptance.

Display does not self-validate acceptance.

Display does not mutate route state or canon.

CONTROL_THREAD decides.

## 16. Linear mirror display

Possible Linear mirror fields:

- Linear issue ID
- Linear status
- mirrored route summary
- mirrored PR state summary
- mirrored closeout summary
- freshness marker
- source-of-truth disclaimer
- missing mirror marker

Linear mirror is not source of truth.

Linear mirror does not replace CONTROL_THREAD.

Linear mirror display does not authorize Linear mutation.

Linear mirror display does not authorize API behavior.

CONTROL_THREAD decides.

## 17. Work Packet coordination display

Work Packet coordination display may show:

- Work Packet note
- route relationship summary
- PR review relationship summary
- closeout relationship summary
- passalong relationship summary
- operator coordination note
- unresolved handoff note

Work Packet coordination notes do not create execution authority.

Work Packet display does not execute work.

Work Packet display does not route work by itself.

Work Packet display does not mutate route state.

CONTROL_THREAD decides.

## 18. Script-helper candidate display

Script-helper candidate display may show candidate helper names, candidate inputs, blocked actions, required confirmations, and required boundary review.

Script-helper candidates are not script implementation.

No script implementation.

No runtime activation.

No automation activation.

No filesystem walking.

No GitHub/API automation.

Script helpers require separate CONTROL_THREAD route and authority-boundary review.

## 19. Template-generator candidate display

Template-generator candidate display may show candidate template families, source field needs, output posture, blocked actions, and required boundary review.

Template-generator candidates are not generator implementation.

No template-generator implementation.

No API/DB behavior.

No persistence.

No automation activation.

Template generators require separate CONTROL_THREAD route and authority-boundary review.

## 20. JAI Agent participation candidate display

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

## 21. Agent PR Factory candidate display

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

## 22. Failure / abort display

Possible failure and abort states:

| State | Display posture | Boundary |
| --- | --- | --- |
| missing route packet | missing input marker | Does not fetch route. |
| incomplete PR description evidence | warning | Does not generate automatically. |
| missing validation evidence | warning | Does not run validation. |
| failed validation | failure marker | Does not approve. |
| PR candidate incomplete | warning | Does not create PR. |
| PR not opened | warning | Does not open PR. |
| PR review blocked | warning | Does not review. |
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

## 23. What this surface can support

This surface planning can support:

- future PR review surface discussion
- future PR lifecycle display planning
- future PR review support display planning
- future validation evidence display planning
- future human-confirmation marker planning
- future merge candidate vocabulary planning
- future branch deletion candidate vocabulary planning
- future closeout/passalong separation planning
- future Linear mirror boundary planning
- future Work Packet coordination display planning
- future script-helper candidate review
- future template-generator candidate review
- future JAI Agent participation boundary review
- future Agent PR Factory boundary review

This support is planning support only, not implementation approval.

## 24. What this surface cannot decide

This surface planning cannot decide:

- UI implementation approval
- component behavior
- API route behavior
- DB/Prisma/persistence behavior
- GitHub/API integration
- GitHub/API mutation
- PR creation
- PR update
- PR review automation
- merge
- branch deletion
- Codex execution
- autonomous execution
- scripting approval
- template-generator approval
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

## 25. Non-authorized behaviors

This artifact does not authorize:

- UI implementation
- component implementation
- API route implementation
- DB changes
- Prisma changes
- persistence changes
- GitHub/API integration
- GitHub/API mutation
- PR creation
- PR update
- PR review automation
- merge
- branch deletion
- Codex execution
- Codex automation
- autonomous execution
- script implementation
- template-generator implementation
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

## 26. Risks

Risks and mitigations:

| Risk | Mitigation |
| --- | --- |
| PR lifecycle state display could be mistaken for authority. | Preserve state labels are planning/status only. |
| PR creation candidate display could be mistaken for PR creation. | Preserve candidate display does not create PRs. |
| PR description display could be mistaken for PR creation or PR update authority. | Preserve no PR creation/update authority wording. |
| PR review support display could be mistaken for merge authority. | Preserve PR review support is not merge authority. |
| GitHub/API wording could be mistaken for GitHub/API automation authority. | Preserve no GitHub/API integration or mutation wording. |
| Validation evidence display could be mistaken for approval. | Preserve evidence-only wording. |
| Human-confirmation markers could be mistaken for human confirmation itself. | Preserve markers do not replace confirmation. |
| Squash merge candidate display could be mistaken for merge authority. | Preserve human confirmation and no merge wording. |
| Branch deletion candidate display could be mistaken for branch deletion authority. | Preserve human confirmation and no deletion wording. |
| Closeout/passalong display could be mistaken for CONTROL_THREAD acceptance. | Preserve closeout/passalong is not acceptance. |
| CONTROL_THREAD acceptance display could be mistaken for accepting work. | Preserve display does not accept work. |
| Linear mirror could be mistaken for source of truth. | Preserve Linear mirror is not source of truth. |
| Work Packet coordination notes could be mistaken for execution authority. | Preserve no execution authority wording. |
| Script-helper candidates could be mistaken for script implementation. | Preserve candidate-only posture. |
| Template-generator candidates could be mistaken for generator implementation. | Preserve candidate-only posture. |
| JAI Agent participation candidates could be mistaken for JAI Agent activation. | Preserve no Agent activation wording. |
| Agent PR Factory candidates could be mistaken for Agent PR Factory activation. | Preserve separate route/review and no activation wording. |
| ZERO GATES could be mistaken for readiness approval. | Preserve ZERO GATES is a non-authorization marker. |

## 27. Recommended follow-up routes

Recommended follow-up routes:

- `Q3M7 PR Review Surface Boundary Review v0`
- `Q3M7 PR Lifecycle State Display Vocabulary Planning v0`
- `Q3M7 Merge / Branch Deletion Human Confirmation Boundary Review v0`
- `Q3M7 Validation Evidence Display Boundary Review v0`
- `Q3M7 Agent PR Factory Candidate Boundary Review v0`
- `Q3M7 Linear Mirror Source-of-Truth Boundary Review v0`

Future implementation, GitHub/API, PR automation, scripting, template-generator, Codex, JAI Agent, Agent PR Factory, readiness, production, or gate routes require separate CONTROL_THREAD acceptance.

## 28. Verification notes

Verification notes:

- All 29 required sections are present.
- Fallback path decision is recorded because `docs/app` does not exist.
- Accepted C1-C3 baseline is preserved.
- Static planning only is stated.
- No UI implementation and no component implementation are stated.
- No API/DB behavior and no persistence are stated.
- No GitHub/API integration and no GitHub/API mutation are stated.
- No PR creation automation, no PR review automation, no merge automation, and no branch deletion automation are stated.
- No autonomous Codex submission is stated.
- No script implementation is stated.
- PR lifecycle state display is not authority.
- PR creation candidate display does not create PRs.
- PR review support display is not merge authority.
- Validation evidence display is evidence only.
- Human-confirmation markers do not replace human confirmation.
- Squash merge and branch deletion candidates require human confirmation.
- Closeout/passalong display is not CONTROL_THREAD acceptance.
- CONTROL_THREAD acceptance display does not accept work.
- Linear mirror is not source of truth.
- Work Packet coordination notes do not create execution authority.
- JAI Agent participation candidates are not JAI Agent activation.
- Agent PR Factory candidates require separate CONTROL_THREAD route and review.
- CONTROL_THREAD decides.
- ZERO GATES is a non-authorization marker.
- ZERO GATES GRANTED remains explicit.

## 29. ZERO GATES GRANTED

ZERO GATES is a non-authorization marker.

ZERO GATES GRANTED.

# Q3M7 Operator Loop Surface Static Planning v0

## 1. Purpose

This artifact statically plans an operator-facing surface that could eventually support supervised repo execution, PR automation, closeout drafting, and human confirmation in `dev.jai.nexus`.

Path decision: `docs/app` does not exist in this repository, so this artifact uses the required fallback path `docs/reference/q3m7-operator-loop-surface-static-planning-v0.md`.

Static planning only.

No UI implementation.

CONTROL_THREAD decides.

ZERO GATES GRANTED.

## 2. Program baseline

| Field | Value |
| --- | --- |
| Program name | `Q3M7Y26 Supervised JAI Agent Execution Loop and PR Automation v0` |
| Batch | `A` |
| Wave | `A-A` |
| Lane | `A4` |
| Thread | `2026-06-21_dev-jai-nexus` |
| Scope | `Q3M7 Operator Loop Surface Static Planning v0` |
| Role | `JAI::DEV::BUILDER` |
| Boundary | static planning only |
| Authority | CONTROL_THREAD decides |
| Gates | ZERO GATES GRANTED |

This baseline does not authorize implementation, automation, runtime activation, GitHub/API integration, Codex execution, JAI Agent activation, Agent PR Factory activation, readiness approval, production authority, or gate opening.

## 3. Static planning scope

This static planning covers what an operator could eventually see and confirm for a supervised execution loop:

- CONTROL_THREAD route display
- repo target display
- branch / PR planning display
- Codex prompt draft display
- validation evidence display
- PR description draft display
- human confirmation display
- merge / branch deletion confirmation display
- closeout draft display
- CONTROL_THREAD acceptance display
- Linear mirror display
- failure / abort display
- future scripting candidate display
- future JAI Agent participation display
- future Agent PR Factory display

This artifact does not automate that loop.

This artifact does not replace CONTROL_THREAD.

This artifact does not remove human confirmation.

## 4. Operator workflow problem

Current manual pattern:

1. CONTROL_THREAD routes a lane.
2. Operator copies a route packet into a repo chat or Codex workflow.
3. Repo work is performed externally.
4. Human reviews branch, commit, and PR URL.
5. PR description is drafted.
6. Human squashes / merges / deletes.
7. Closeout passalong is drafted.
8. CONTROL_THREAD accepts or routes next work.

The future surface could make this pattern visible as supervised evidence and confirmation planning.

It must not turn the pattern into autonomous execution, Codex automation, GitHub/API automation, scripting, JAI Agent activation, or Agent PR Factory activation.

## 5. Target supervised loop surface

Possible future regions:

| Region | Static display purpose | Boundary |
| --- | --- | --- |
| CONTROL_THREAD route display | Show routed lane context and guardrails | Display is not acceptance. |
| repo target display | Show repo, branch, artifact, and path expectations | Does not mutate repo state. |
| branch / PR planning display | Show branch and PR planning placeholders | Does not create, push, merge, or delete. |
| Codex prompt draft display | Show draft prompt packet | Does not execute Codex. |
| validation evidence display | Show validation evidence and skipped reasons | Does not run validation or approve work. |
| PR description draft display | Show PR body draft | Does not open or update PRs. |
| human confirmation display | Show required checkpoints | Does not perform irreversible steps. |
| merge / branch deletion confirmation display | Show post-human-action confirmations | Does not infer acceptance. |
| closeout draft display | Show repo-lane closeout template | Does not accept work. |
| CONTROL_THREAD acceptance display | Show acceptance posture | `dev.jai.nexus` display is not CONTROL_THREAD acceptance. |
| Linear mirror display | Show possible mirror context | Linear mirror is not source of truth. |
| failure / abort display | Show blocked/manual intervention states | Does not auto-recover. |
| future scripting candidate display | Show candidate-only scripting posture | Not script implementation. |
| future JAI Agent participation display | Show candidate-only Agent posture | Not JAI Agent activation. |
| future Agent PR Factory display | Show candidate-only PR factory posture | Not Agent PR Factory activation. |

This is not UI implementation.

This is not live state.

This is not API/DB behavior.

This is not persistence.

This is not automation.

This is not GitHub/API automation.

## 6. CONTROL_THREAD route display

Possible CONTROL_THREAD route display fields:

| Field | Display posture |
| --- | --- |
| program | route context |
| batch | route context |
| wave | route context |
| lane | route context |
| thread | route context |
| scope | route context |
| mode | route context |
| CONTROL_THREAD decision | locked/read-only decision context |
| purpose | route summary |
| recommended branch | planning text only |
| recommended artifact | planning text only |
| required sections | checklist text only |
| required guardrails | boundary text only |
| explicit prohibitions | boundary text only |
| validation expectations | evidence expectation only |
| closeout expectations | draft expectation only |

Displaying CONTROL_THREAD route content is not CONTROL_THREAD acceptance.

Displaying route content does not route work by itself.

CONTROL_THREAD decides.

## 7. Repo target display

Possible repo target display fields:

- repo name
- repo role
- target branch
- target artifact path
- fallback artifact path
- commit message suggestion
- touched path expectation
- docs path decision
- current route status candidate

Repo target display does not mutate repo state.

Repo target display does not perform Git operations.

Repo target display does not perform GitHub/API automation.

## 8. Branch / PR planning display

Possible branch / PR planning fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| recommended branch | text draft | Does not create branch. |
| branch creation command draft | copy/reference draft | Does not run command. |
| commit message draft | text draft | Does not commit. |
| PR URL placeholder | placeholder | Does not open PR. |
| pushed commit placeholder | placeholder | Does not push. |
| merge status placeholder | placeholder | Does not merge. |
| branch deletion confirmation placeholder | placeholder | Does not delete branch. |

Branch / PR planning display does not create branches.

Branch / PR planning display does not open PRs.

Branch / PR planning display does not merge PRs.

Branch / PR planning display does not delete branches.

Human confirmation remains required for irreversible steps.

## 9. Codex prompt draft display

Possible Codex prompt draft fields:

- role
- route packet summary
- objective
- required sections
- guardrails
- explicit prohibitions
- validation
- commit / push instructions
- PR description template
- closeout template

Codex prompt draft display does not execute Codex.

No Codex automation.

No autonomous execution.

Human confirmation remains required.

## 10. Validation evidence display

Possible validation evidence fields:

| Field | Display posture | Boundary |
| --- | --- | --- |
| command | evidence text | Does not run command. |
| result | evidence text | Does not approve work. |
| evidence status | pass/fail/N/A display | Not readiness approval. |
| skipped / N/A reason | explanation | Does not waive validation. |
| warnings | evidence note | Does not mutate state. |
| recurring non-blocking warnings | evidence note | Does not hide failures. |
| missing evidence marker | warning | Does not fetch evidence. |
| human review marker | review reminder | Does not replace review. |

Validation evidence display does not run validation.

Validation evidence display does not approve work.

Validation evidence display does not create readiness approval.

CONTROL_THREAD decides.

## 11. PR description draft display

Possible PR description draft fields:

- role
- summary
- files changed
- scope
- outputs
- authority boundary
- validation
- risks / follow-ups
- ZERO GATES marker

PR description draft display does not open or update PRs.

PR description draft display does not approve merge.

Human review remains required.

## 12. Human confirmation display

Human confirmation checkpoints:

| Checkpoint | Why confirmation is required | Boundary |
| --- | --- | --- |
| before branch creation | branch changes repo workflow posture | Display does not create branch. |
| before commit | commit records a repo change | Display does not commit. |
| before push | push publishes branch state | Display does not push. |
| before PR open | PR changes GitHub review surface | Display does not open PR. |
| before merge | merge is irreversible in normal flow | Display does not merge. |
| before branch deletion | deletion removes branch ref | Display does not delete. |
| before closeout passalong | closeout affects CONTROL_THREAD review | Display does not send closeout. |
| before CONTROL_THREAD acceptance request | acceptance is external authority | Display does not accept. |

Human confirmation remains required for irreversible steps.

Confirmation display does not perform the irreversible step.

Confirmation display does not replace operator judgment.

CONTROL_THREAD decides.

## 13. Merge / branch deletion confirmation display

Possible merge / branch deletion confirmation fields:

- PR merged confirmation
- squash merge marker
- branch deleted marker
- merge commit if available
- original implementation commit
- unresolved risk marker
- closeout required marker

Display does not merge.

Display does not delete branches.

Display does not infer acceptance.

Squashed / merged / deleted is not CONTROL_THREAD acceptance by itself.

CONTROL_THREAD decides.

## 14. Closeout draft display

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

Closeout draft display does not accept work.

Closeout draft display does not mutate route state.

Closeout draft display does not mutate canon.

CONTROL_THREAD decides.

## 15. CONTROL_THREAD acceptance display

Possible CONTROL_THREAD acceptance statuses:

- route drafted
- route sent
- branch pushed
- PR opened
- PR merged
- closeout drafted
- closeout sent to CONTROL_THREAD
- accepted by CONTROL_THREAD
- not accepted
- held
- blocked
- needs follow-up

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
- mirrored closeout summary
- mirror freshness
- source-of-truth disclaimer

Linear mirror is not source of truth.

Linear mirror does not replace CONTROL_THREAD.

Linear mirror display does not authorize Linear mutation.

Linear mirror display does not authorize API behavior.

CONTROL_THREAD decides.

## 17. Failure / abort display

Possible failure and abort states:

- dirty working tree
- branch creation blocked
- validation failed
- push failed
- PR not opened
- merge blocked
- branch deletion skipped
- closeout incomplete
- acceptance blocked
- route aborted
- manual intervention required

Failure display does not auto-recover.

Failure display does not run scripts.

Failure display does not mutate state.

Failure display does not route work.

Human review remains required.

## 18. Future scripting candidate display

Future scripting candidate display may show candidate script concepts, prerequisites, blocked authority classes, required human confirmations, and required boundary review.

Future scripting candidate display is not script implementation.

Future scripting candidate display is not automation activation.

Future scripting requires separate CONTROL_THREAD route and authority-boundary review.

No filesystem walking.

No GitHub/API automation.

No runtime activation.

## 19. Future JAI Agent participation display

Future JAI Agent participation display may show candidate roles, expected human confirmations, blocked authority classes, and required CONTROL_THREAD route dependencies.

JAI Agent display candidates are not JAI Agent activation.

No JAI Agent creation.

No JAI Agent assignment.

No JAI Agent dispatch.

No JAI Agent execution.

No autonomous execution.

Human confirmation remains required.

CONTROL_THREAD decides.

## 20. Future Agent PR Factory display

Future Agent PR Factory display may show candidate PR factory participation, required inputs, human-confirmation blockers, GitHub/API blockers, merge blockers, and boundary-review needs.

Agent PR Factory display candidates are not Agent PR Factory activation.

No Agent PR Factory input authorization.

No GitHub/API automation.

No PR automation.

No merge automation.

No branch deletion automation.

No readiness approval.

CONTROL_THREAD decides.

## 21. What this surface can support

This surface planning can support:

- future operator workflow discussion
- future static UI design planning
- future display-boundary review
- future human-confirmation flow planning
- future PR description drafting flow planning
- future closeout drafting flow planning
- future Linear mirror boundary planning
- future scripting candidate review
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
- GitHub/API integration
- Codex execution
- browser/desktop control
- JAI Agent activation
- Agent PR Factory activation
- readiness approval
- production authority
- gate opening
- CONTROL_THREAD acceptance
- Linear source-of-truth status
- autonomous execution

CONTROL_THREAD decides.

## 23. Non-authorized behaviors

This artifact does not authorize:

- UI implementation
- component implementation
- API route implementation
- DB changes
- Prisma changes
- persistence changes
- GitHub/API integration
- Codex execution
- script implementation
- browser control
- desktop control
- JAI Agent activation
- Agent PR Factory activation
- readiness approval
- production authority
- gate opening
- runtime activation
- automation activation
- autonomous execution
- PR automation
- merge automation
- branch deletion automation
- Linear mutation
- CONTROL_THREAD acceptance

ZERO GATES GRANTED.

## 24. Risks

Risks and mitigations:

| Risk | Mitigation |
| --- | --- |
| Operator display could be mistaken for automation. | Preserve static planning and no automation activation wording. |
| Draft prompts could be mistaken for Codex execution. | Preserve no Codex automation and no autonomous execution wording. |
| Branch / PR planning could be mistaken for GitHub automation. | Preserve no GitHub/API automation and human confirmation wording. |
| PR description draft could be mistaken for PR mutation. | Preserve no PR open/update behavior wording. |
| Closeout draft could be mistaken for CONTROL_THREAD acceptance. | Preserve closeout draft does not accept work. |
| Linear mirror could be mistaken for source of truth. | Preserve Linear mirror is not source of truth. |
| Future JAI Agent participation could be mistaken for JAI Agent activation. | Preserve candidate-only Agent posture. |
| Future Agent PR Factory display could be mistaken for Agent PR Factory activation. | Preserve candidate-only PR Factory posture. |
| ZERO GATES could be mistaken for readiness approval. | Preserve ZERO GATES is a non-authorization marker. |

## 25. Recommended follow-up routes

Recommended follow-up routes:

- `Q3M7 Operator Loop Surface Static Planning Boundary Review v0`
- `Q3M7 Human Confirmation Surface Vocabulary Planning v0`
- `Q3M7 PR Automation Candidate Authority Boundary Review v0`
- `Q3M7 Agent PR Factory Display Candidate Boundary Review v0`
- `Q3M7 Linear Mirror Source-of-Truth Boundary Review v0`

Future implementation, scripting, API/DB, GitHub/API, Codex, JAI Agent, Agent PR Factory, readiness, production, or gate routes require separate CONTROL_THREAD acceptance.

## 26. Verification notes

Verification notes:

- All 27 required sections are present.
- Fallback path decision is recorded because `docs/app` does not exist.
- Static planning only is stated.
- No UI implementation is stated.
- No API/DB behavior is stated.
- No persistence is stated.
- No runtime activation is stated.
- No automation activation is stated.
- No GitHub/API automation is stated.
- No Codex automation is stated.
- No autonomous execution is stated.
- Human confirmation remains required for irreversible steps.
- `dev.jai.nexus` display is not CONTROL_THREAD acceptance.
- Linear mirror is not source of truth.
- JAI Agent display candidates are not JAI Agent activation.
- Agent PR Factory display candidates are not Agent PR Factory activation.
- CONTROL_THREAD decides.
- ZERO GATES is a non-authorization marker.
- ZERO GATES GRANTED remains explicit.

## 27. ZERO GATES GRANTED

ZERO GATES is a non-authorization marker.

ZERO GATES GRANTED.

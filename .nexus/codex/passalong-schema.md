# Passalong Schema - dev-jai-nexus

**Version:** 1.1
**Established:** motion-0106
**Updated:** motion-0140
**Date:** 2026-04-20

---

## 1. What a passalong is

A passalong is a continuity artifact authored by the current session for the next
receiving session.

Its purpose is to reduce recontextualization cost while preserving the boundary
between:

- the `CONTROL_THREAD` coordination surface
- the receiving routing target (`ORCHESTRATOR`, `REPO_EXECUTION`, or `EXPLORATION`)
- the canonical governance artifacts that remain authoritative

A passalong does the following:

- carries forward the current baseline
- distinguishes what is settled from what remains open
- records tasks, risks, routing targets, and exact prompt starters
- clarifies the next bounded direction without performing that direction

A passalong does not do the following:

- it does not execute work
- it does not mutate repo state
- it does not mutate runtime state
- it does not replace repo-local judgment
- it does not replace motion packages, `decision.yaml`, or other canonical artifacts
- it does not sync a thread by itself

A passalong is a documentary continuity layer, not an execution mechanism.

---

## 2. Scope and routing model

### `CONTROL_THREAD`

`CONTROL_THREAD` is the top-level coordination scope. A passalong written from this
scope preserves canon, tracks active work, and names the next bounded routing target.

### `ORCHESTRATOR`

`ORCHESTRATOR` is the routing target that receives continuity state for control-thread
level coordination and next-direction decisions.

### `REPO_EXECUTION`

`REPO_EXECUTION` is the routing target that receives a bounded repo-local work item
and is expected to interpret the active motion locally.

### `EXPLORATION`

`EXPLORATION` is the routing target used when framing or research is still needed
before bounded execution can resume.

---

## 3. Audience kinds

### `orchestrator`

The `orchestrator` document kind is used when the receiving session is expected to
operate in the `CONTROL_THREAD` scope or as the `ORCHESTRATOR` routing target.

It should emphasize:

- current baseline and settled canon
- active work, open items, and deferred scope
- routing choices and next bounded direction

It should not include:

- working-tree detail
- implementation commands
- repo-local patch narrative unless it changes routing

### `dev`

The `dev` document kind is used when the receiving session is expected to operate as
the `REPO_EXECUTION` routing target.

It should emphasize:

- current repo-thread baseline
- what is settled vs. still open in the bounded work item
- concrete tasks, risks, and next step
- how the repo thread will sync back to the control thread when finished

It should not include:

- broad program-arc narrative beyond what the receiving repo thread needs
- claims that sync-back already occurred unless the required conditions are true

---

## 4. Required frontmatter

All passalong v1.1 documents should include the following frontmatter fields:

| Field | Required | Notes |
|---|---|---|
| `passalong_kind` | yes | `orchestrator` or `dev` |
| `schema_version` | yes | `passalong-1.1` for new documents; v1.0 remains valid by compatibility rule |
| `date` | yes | ISO date |
| `repo` | yes | repo identity |
| `branch` | yes | active branch |
| `scope` | yes | `CONTROL_THREAD` or `REPO_EXECUTION`; `EXPLORATION` allowed when applicable |
| `current_motion` | yes | active motion id when one exists |
| `program` or `motion_status` | yes | `program` for orchestrator, `motion_status` for dev |
| `generated_by` | recommended | provenance label such as `manual`, `manual-example`, or `/motion-passalong` |

---

## 5. Required structure

### Orchestrator passalong

| Section | Required | Content |
|---|---|---|
| `## Current baseline` | yes | Current control-thread state, motion, branch, and governing boundary. |
| `## What is settled` | yes | Facts that are already stable and should not be re-decided in the next session. |
| `## Active work` | yes | Work currently in progress inside the program arc. |
| `## What remains open` | yes | Open items that still block closure or next routing. |
| `## Deferred` | recommended | Explicit out-of-scope items preserved for later motions. |
| `## Tasks` | yes | Discrete next actions for the receiving session, formatted as a checklist. |
| `## Risks` | yes | Open risks and mitigations relevant to the receiving session. |
| `## Routing targets` | yes | Named targets such as `ORCHESTRATOR`, `REPO_EXECUTION`, `EXPLORATION`, with why each may be used. |
| `## Next direction` | yes | One bounded routing decision or next objective. One paragraph. |
| `## Next chat prompts` | yes | Exact prompt starters for the receiving session. |
| `## Reference layers` | yes | Canonical files and motions the next session should anchor to. |
| `## Handoff note` | optional | Remaining context that does not fit the sections above. |

### Dev passalong

| Section | Required | Content |
|---|---|---|
| `## Current baseline` | yes | Current repo-thread state, branch, motion, and boundary. |
| `## What is settled` | yes | Facts that are already stable inside the bounded work item. |
| `## What remains open` | yes | Work still required before closure or sync-back. |
| `## Tasks` | yes | Discrete next actions for the receiving session, formatted as a checklist. |
| `## Risks` | yes | Open risks and mitigations relevant to the receiving session. |
| `## Routing targets` | yes | Named targets for subsequent routing, including when to return to `ORCHESTRATOR`. |
| `## Next step` | yes | One concrete next action. One paragraph only. |
| `## Next chat prompts` | yes | Exact prompt starters for the receiving session. |
| `## Reference layers` | yes | Canonical files and motions the next session should anchor to. |
| `## Handoff note` | optional | Remaining context that does not fit the sections above. |

---

## 6. Document templates

### Orchestrator

```markdown
---
passalong_kind: orchestrator
schema_version: "passalong-1.1"
date: YYYY-MM-DD
repo: dev-jai-nexus
branch: {branch}
scope: CONTROL_THREAD
current_motion: {motionId}
program: {programName}
generated_by: {manual | /motion-passalong}
---

## Current baseline

{State the active control-thread baseline, motion, branch, and scope boundary.}

## What is settled

- {settled fact}
- {settled fact}

## Active work

- {active item}
- {active item}

## What remains open

- {open item}
- {open item}

## Deferred

- {out-of-scope item}
- {out-of-scope item}

## Tasks

- [ ] {task}
- [ ] {task}

## Risks

- Risk: {risk}
  Mitigation: {mitigation}

## Routing targets

- `ORCHESTRATOR` - {why}
- `REPO_EXECUTION` - {why}
- `EXPLORATION` - {why, if needed}

## Next direction

{One bounded routing decision only. Do not list multiple competing directions.}

## Next chat prompts

- `{prompt starter}`
- `{prompt starter}`

## Reference layers

- Motion: {motionId} (`.nexus/motions/{motionId}/`)
- Canon: {path}
- Branch: {branch}

## Handoff note

{Optional. Only add if the receiving session would lose important context without it.}
```

### Dev

```markdown
---
passalong_kind: dev
schema_version: "passalong-1.1"
date: YYYY-MM-DD
repo: dev-jai-nexus
branch: {branch}
scope: REPO_EXECUTION
current_motion: {motionId}
motion_status: {DRAFT | RATIFIED}
generated_by: {manual | /motion-passalong}
---

## Current baseline

{State the active repo-thread baseline, motion, branch, and scope boundary.}

## What is settled

- {settled fact}
- {settled fact}

## What remains open

- {open item}
- {open item}

## Tasks

- [ ] {task}
- [ ] {task}

## Risks

- Risk: {risk}
  Mitigation: {mitigation}

## Routing targets

- `ORCHESTRATOR` - {when to route back}
- `REPO_EXECUTION` - {when work remains local}
- `EXPLORATION` - {when more framing is needed}

## Next step

{One concrete next action only. It must match the current repo-thread state.}

## Next chat prompts

- `{prompt starter}`
- `{prompt starter}`

## Reference layers

- Motion: {motionId} (`.nexus/motions/{motionId}/`)
- Canon: {path}
- Branch: {branch}

## Handoff note

{Optional. Only add if the receiving session would lose important context without it.}
```

---

## 7. Compatibility

Passalong v1.1 is additive.

Compatibility rules are:

- all `passalong-1.0` documents remain valid
- v1.0 documents are not required to add `repo`, `scope`, `tasks`, `risks`,
  `routing_targets`, or `next_chat_prompts`
- new v1.1 documents should use the expanded frontmatter and section set above
- the schema upgrade does not, by itself, require changes to existing passalong files

The following surfaces remain intentionally unchanged in motion-0140:

- `.claude/commands/motion-passalong.md`
- `.nexus/codex/evals/motion-passalong-eval.yaml`

Those surfaces may be upgraded in a later motion once the v1.1 canon is in use.

---

## 8. Output convention

When a passalong is produced for cross-session continuity, the recommended save path is:

```text
surfaces/chat-context/{date}_passalong_{kind}_{motionId}.md
```

The continuity file may be saved manually. The schema does not require any automatic
write behavior.

---

## 9. Hard constraints

- Do NOT claim a motion is RATIFIED if `decision.yaml status` is `DRAFT`.
- Do NOT describe work as synced back unless ratification and recorded passalong both exist.
- Do NOT invent a next direction or next step that is not grounded in current governance state.
- Do NOT include fabricated events, packet states, or agent outputs.
- Do NOT replace the motion package, `decision.yaml`, or ratification artifacts with passalong text.
- Do NOT use passalong content as a trigger for repo mutation, runtime mutation, routing automation, or task creation.
- Do NOT commit or ratify anything as part of generating a passalong.

# Passalong Schema — dev-jai-nexus

**Version:** 1.0
**Established:** motion-0106
**Date:** 2026-03-31

---

## 1. What a passalong is

A passalong is an **interpretive handoff document** — authored by the current
session, structured for a specific audience, and designed to reduce
recontextualization cost for the receiving session.

A passalong is NOT:
- A machine-generated context bundle (`generate-context-bundle.mjs` does that)
- A motion status report (`/motion-status` does that)
- A ratification artifact (`/motion-ratify` does that)
- A full motion history dump

A passalong is:
- A narrative state summary anchored in real governance artifacts
- A single, concrete next direction
- Audience-scoped (orchestrator vs. dev)
- Short enough to load in one message

---

## 2. Audience types

### `orchestrator`

The receiving session manages the **program arc**. It needs to know:
- What motions/milestones closed in the outgoing session
- What arc or objective was completed
- What program constraints remain active
- What the next motion class or program objective should be

The orchestrator passalong does NOT include working tree detail or specific commands.

### `dev`

The receiving session implements a **bounded task** — a single motion slice,
a specific file change, a proof run. It needs to know:
- Current branch and motion identity
- Exact working tree state
- The one concrete next step (command or file)
- Any session-specific gotchas the next session must not rediscover

The dev passalong does NOT include program-level arc narrative.

---

## 3. Required sections

### Orchestrator passalong

| Section | Required | Content |
|---|---|---|
| Frontmatter | yes | kind, schema_version, date, branch, current_motion, program |
| `## State summary` | yes | What closed. Which motions ratified. What arc completed. Anchored in real governance state. |
| `## Active constraints` | yes | Bulleted list of hard limits still in effect. |
| `## Next direction` | yes | ONE next motion class or program objective. One paragraph. |
| `## Reference layers` | yes | Ratified motions, last commit hash + subject, branch. |
| `## Handoff note` | optional | Anything the next orchestrator session needs that is not in the above. |

### Dev passalong

| Section | Required | Content |
|---|---|---|
| Frontmatter | yes | kind, schema_version, date, branch, current_motion, motion_status |
| `## State summary` | yes | Current motion, its governance status, what was just done this session. |
| `## Working tree` | yes | `git status --short` output or equivalent summary. |
| `## Next step` | yes | ONE concrete action: a command to run or a file to write. One paragraph. |
| `## Reference layers` | yes | Motion files consulted, last commit hash + subject, branch. |
| `## Handoff note` | optional | Session-specific context the next dev session needs. |

---

## 4. Document template

### Orchestrator

```markdown
---
passalong_kind: orchestrator
schema_version: "passalong-1.0"
date: YYYY-MM-DD
branch: {branch}
current_motion: {motionId}
program: {programName}
generated_by: /motion-passalong
---

## State summary

{What closed in this session. Which motions are RATIFIED. What arc is complete.
Must be anchored in decision.yaml status — do not claim RATIFIED for DRAFT motions.}

## Active constraints

- {constraint}
- {constraint}

## Next direction

{One paragraph. One motion class or objective. Grounded in what is actually
pending — do not invent next steps not implied by current governance state.}

## Reference layers

- Motions ratified: {motionId}, {motionId}, ...
- Last commit: {hash} {subject}
- Branch: {branch}

## Handoff note

{Optional. Session-specific context only. Omit if nothing material to add.}
```

### Dev

```markdown
---
passalong_kind: dev
schema_version: "passalong-1.0"
date: YYYY-MM-DD
branch: {branch}
current_motion: {motionId}
motion_status: {DRAFT | RATIFIED}
generated_by: /motion-passalong
---

## State summary

{Current motion, its governance status from decision.yaml, what the session
accomplished. Must reflect actual status — do not invent completion.}

## Working tree

{git status --short output. If clean, say "Working tree: clean."}

## Next step

{One concrete action: exact command or file to write. One paragraph only.
Must be grounded in current working tree and motion state.}

## Reference layers

- Motion: {motionId} (.nexus/motions/{motionId}/)
- Last commit: {hash} {subject}
- Branch: {branch}

## Handoff note

{Optional. Only if there is session-specific gotcha the next session needs.}
```

---

## 5. Output convention

The `/motion-passalong` skill prints the passalong to stdout and recommends:

```
Save as: surfaces/chat-context/{date}_passalong_{kind}_{motionId}.md
```

The skill does NOT write the file automatically. The user or Codex saves it.

---

## 6. Hard constraints

- **Do NOT** claim a motion is RATIFIED if `decision.yaml status` is `DRAFT`.
- **Do NOT** describe work as complete if there are unstaged or uncommitted changes.
- **Do NOT** invent a next direction not grounded in current governance state.
- **Do NOT** include fabricated SoT events, packet states, or agent outputs.
- **Do NOT** summarize more than the current motion and its immediate parent context.
- **Do NOT** replace the context bundle or motion package — those are authoritative.
- **Do NOT** commit or ratify anything as part of generating a passalong.

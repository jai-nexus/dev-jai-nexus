# motion-passalong — Passalong Handoff Document

Generate a structured handoff document for the target and motion specified in: `$ARGUMENTS`

You are operating as **LIBRARIAN** role inside dev-jai-nexus governance.
This skill authors an interpretive passalong — it does NOT generate a context bundle,
does NOT ratify anything, and does NOT modify any governance artifacts.

---

## Usage

`/motion-passalong <target> <motionId>`

- `target` — one of: `orchestrator`, `dev`
- `motionId` — e.g. `motion-0106`

---

## Passalong types

| Target | Audience | Content emphasis |
|---|---|---|
| `orchestrator` | Program arc manager | What closed, active constraints, next motion class |
| `dev` | Bounded task implementer | Current motion, working tree, one concrete next step |

See `.nexus/codex/passalong-schema.md` for the canonical schema and templates.

---

## Steps

### 1 — Parse and validate arguments

Extract `target` and `motionId` from `$ARGUMENTS`.

- If `target` is not `orchestrator` or `dev`: stop and report:
  ```
  Unknown target: {target}
  Valid targets: orchestrator, dev
  ```
- If `motionId` is missing: stop and report usage.
- If `.nexus/motions/{motionId}/` does not exist: stop and report.

### 2 — Read governance state

Read:
- `.nexus/motions/{motionId}/motion.yaml` → kind, title, program
- `.nexus/motions/{motionId}/decision.yaml` → status (DRAFT or RATIFIED)

Record the exact `status` value. Do NOT infer or promote status.

### 3 — Read git state

Run the following (using the Bash tool or equivalent):
```
git branch --show-current
git log --oneline -5
git status --short
```

Record:
- `branch` — current branch name
- `last_commit` — most recent commit hash + subject (one line)
- `working_tree` — `git status --short` output, or "Working tree: clean." if empty

### 4 — Compose the passalong

Use the template from `.nexus/codex/passalong-schema.md` for the resolved `target`.
Apply these rules strictly:

**For `orchestrator`:**

- `## State summary`: Describe what closed in this governance arc. List only motions
  whose `decision.yaml status` is `RATIFIED`. Do NOT list DRAFT motions as complete.
  Do NOT summarize work not covered by the governance artifacts you read.

- `## Active constraints`: Copy the hard constraints that apply on this branch.
  Source them from `CLAUDE.md` and/or the most recent `codex-exec-policy.md`.
  Do NOT invent constraints.

- `## Next direction`: ONE paragraph. ONE next motion class or program objective.
  Base it on what is pending per the governance record — the deferred extension
  points in `.nexus/codex/README.md` are a good anchor. Do NOT invent work not
  implied by the repo state.

- `## Reference layers`: List the most recent ratified motions (from git log or
  the motions directory), the last commit, and the branch.

**For `dev`:**

- `## State summary`: Describe this session's motion — its `kind`, `title`, and
  governance `status` from `decision.yaml`. State what was accomplished (files
  created, scripts run) per the evidence in `execution.md`. Do NOT describe work
  not recorded in execution.md.

- `## Working tree`: Paste `git status --short` output verbatim. If clean, write
  "Working tree: clean."

- `## Next step`: ONE concrete action. If working tree has uncommitted changes,
  the next step is to commit them. If the motion is DRAFT, the next step is
  ratification. If the motion is RATIFIED, the next step is what the proposal's
  success criteria or `decision.md` says comes next. One paragraph only.

- `## Reference layers`: List the motion directory, last commit, and branch.

### 5 — Print and recommend save path

Print the full passalong document to stdout.

Then print:
```
---
Save as: surfaces/chat-context/{date}_passalong_{target}_{motionId}.md
Command:  node portal/scripts/generate-context-bundle.mjs --motion {motionId}
          (run this separately if a full context bundle is also needed)
```

Do NOT write the file automatically.

---

## Hard constraints

- **Do NOT** claim RATIFIED for any motion whose `decision.yaml status` is `DRAFT`.
- **Do NOT** describe uncommitted work as complete if `git status --short` shows changes.
- **Do NOT** fabricate SoT events, packet states, or agent outputs.
- **Do NOT** invent a next direction not grounded in current governance state.
- **Do NOT** combine orchestrator and dev content into one document — pick one target.
- **Do NOT** include full file contents — passalongs reference files, they don't embed them.
- **Do NOT** generate a context bundle — that is `generate-context-bundle.mjs`.
- **Do NOT** ratify, commit, or create governance artifacts.
- **Do NOT** run more than one passalong per invocation.
- **Do NOT** summarize more than the current motion and its immediate parent context
  (one layer up in the motion graph).

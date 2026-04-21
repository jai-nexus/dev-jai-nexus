# Execution: JAI Control Thread Canon v0

**Motion:** motion-0140
**Role:** BUILDER
**Date:** 2026-04-20

---

## Cost estimate

Category: standard
Basis: two new static documentary artifacts under `.nexus/docs/`, one new examples
directory under `.nexus/docs/examples/`, and one updated schema doc in existing
`.nexus/codex/`. No portal runtime changes. No governance runner modifications.
No database changes. No cross-repo changes.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Implementation-ready plan

### Exact implementation touch list

The implementation should touch exactly these five files:

1. `.nexus/docs/control-thread-model.md` (new)
2. `.nexus/codex/passalong-schema.md` (modify)
3. `.nexus/docs/examples/passalong-orchestrator-example.md` (new)
4. `.nexus/docs/examples/passalong-dev-example.md` (new)
5. `.nexus/motions/motion-0140/execution.md` (modify after content lands to replace
   planning placeholders with observed evidence and validation results only)

No other file should change in the implementation branch.

### Exact deliverables per path

#### 1. `.nexus/docs/control-thread-model.md`

Create a new canon doc with the following concrete structure:

- `# Control Thread Model - dev-jai-nexus`
- `## Purpose`
  - State that the file defines the coordination surface above repo-local execution.
- `## Control thread definition`
  - Define the control thread as the top-level coordination surface for a program arc.
  - State that it preserves canon, tracks active work, synchronizes repo threads,
    and routes the next bounded work item.
  - State that it does not execute work, mutate repo state, mutate runtime state,
    or introduce controller behavior.
- `## Coordination modes`
  - Define `CONTROL_THREAD`
  - Define `OPERATOR`
  - Define `REPO_EXECUTION`
  - Define `EXPLORATION`
  - For each mode, include: primary responsibility, allowed outputs, and forbidden
    behavior.
- `## Relationship to execution roles`
  - State explicitly that coordination modes are orthogonal to the execution-role
    taxonomy in `CLAUDE.md` (`ARCHITECT`, `BUILDER`, `VERIFIER`, `OPERATOR`,
    `LIBRARIAN`).
  - State that one session may have one execution role while operating in one
    coordination mode.
- `## Sync-back rule`
  - Define sync-back as satisfied only when:
    1. the active motion is ratified, and
    2. a passalong has been authored and recorded under `surfaces/chat-context/`.
- `## Passalong boundaries`
  - State that passalongs are continuity artifacts only.
  - State that passalongs do not execute work, do not mutate repo/runtime state,
    do not replace repo-local judgment, and do not replace canonical governance
    artifacts.
- `## Non-goals`
  - Explicitly rule out automation, background orchestration, task runners,
    GitHub workflow integration, and any authority model over repo threads.

#### 2. `.nexus/codex/passalong-schema.md`

Update the existing schema doc to v1.1 with these exact changes:

- Header:
  - `Version: 1.1`
  - Preserve `Established: motion-0106`
  - Add `Updated: motion-0140`
- Section 1 ("What a passalong is"):
  - Add control-thread framing language tying passalongs to continuity between the
    control thread and repo-execution threads.
  - Add an explicit statement that authoring a passalong does not itself sync or
    govern a thread.
- Audience section:
  - Keep `orchestrator` and `dev` as the only target types.
  - Do not add new target types in this motion.
- Required-sections tables:
  - Preserve all existing required sections.
  - Add optional `## Tasks`
  - Add optional `## Risks`
  - Add optional `## Next chat prompts`
  - Define the exact intent of each optional section for both target types.
- Templates:
  - Update both templates to show the optional sections in-place.
  - Use `schema_version: "passalong-1.1"` in the template examples.
  - Add a compatibility note stating that `passalong-1.0` artifacts remain valid.
- Compatibility section:
  - State that v1.1 is additive only.
  - State that `/motion-passalong`, `.claude/commands/motion-passalong.md`, and
    `.nexus/codex/evals/motion-passalong-eval.yaml` are intentionally unchanged in
    this motion.
- Hard constraints:
  - Preserve the existing no-fabrication and no-auto-save constraints.
  - Add a boundary note that passalongs do not replace motion packages or
    ratification artifacts.

#### 3. `.nexus/docs/examples/passalong-orchestrator-example.md`

Create a filled example document with these exact properties:

- Begins with an explicit note that the file is illustrative only and not a live
  governance artifact.
- Uses orchestrator frontmatter with `schema_version: "passalong-1.1"`.
- Includes:
  - `## State summary`
  - `## Active constraints`
  - `## Tasks`
  - `## Risks`
  - `## Next direction`
  - `## Next chat prompts`
  - `## Reference layers`
  - `## Handoff note`
- Shows one clear next direction only.
- Does not include working-tree detail or shell commands.

#### 4. `.nexus/docs/examples/passalong-dev-example.md`

Create a filled example document with these exact properties:

- Begins with an explicit note that the file is illustrative only and not a live
  governance artifact.
- Uses dev frontmatter with `schema_version: "passalong-1.1"`.
- Includes:
  - `## State summary`
  - `## Working tree`
  - `## Tasks`
  - `## Risks`
  - `## Next step`
  - `## Next chat prompts`
  - `## Reference layers`
  - `## Handoff note`
- Shows one concrete next step only.
- Does not include program-arc narrative outside what is needed for the dev audience.

#### 5. `.nexus/motions/motion-0140/execution.md`

After the four canon/doc artifacts are written and validated:

- Replace the planned file list with the observed file list.
- Record the exact validation commands run and their observed results.
- Record boundary confirmation that no runtime, automation, skill, eval, or portal
  files were changed.
- Keep the motion in DRAFT state.
- Do not modify `decision.yaml`, `policy.yaml`, `verify.json`, `vote.json`, or
  `motion.yaml` as part of this implementation slice.

### Explicit no-touch list

The implementation must not modify any of the following:

- `.claude/commands/motion-passalong.md`
- `.nexus/codex/evals/motion-passalong-eval.yaml`
- `.nexus/codex/README.md`
- `portal/scripts/**`
- `portal/src/**`
- `package.json`
- `.nexus/motions/motion-0140/decision.yaml`
- `.nexus/motions/motion-0140/policy.yaml`
- `.nexus/motions/motion-0140/verify.json`
- `.nexus/motions/motion-0140/vote.json`
- `.nexus/motions/motion-0140/motion.yaml`
- `.nexus/motions/motion-0140/proposal.md`
- `.nexus/motions/motion-0140/challenge.md`

### Acceptance-test / verification matrix

| ID | Artifact / boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | `control-thread-model.md` | Manual content review | File exists and defines the control thread, all 4 coordination modes, orthogonality to execution roles, sync-back rule, passalong boundaries, and non-goals. |
| V-2 | `passalong-schema.md` | Manual content review | Version is 1.1; both target tables and both templates include optional `Tasks`, `Risks`, and `Next chat prompts`; compatibility note states `passalong-1.0` remains valid. |
| V-3 | Orchestrator example | Manual content review | File is explicitly marked illustrative, uses `passalong-1.1`, and includes all required orchestrator sections plus the 3 new optional sections. |
| V-4 | Dev example | Manual content review | File is explicitly marked illustrative, uses `passalong-1.1`, and includes all required dev sections plus the 3 new optional sections. |
| V-5 | No-touch boundary | `git status --short -- .nexus/docs .nexus/codex .nexus/motions/motion-0140 .claude portal package.json` | Only the 5 planned paths show changes; no `.claude`, `portal`, or `package.json` entries appear. |
| V-6 | DRAFT preservation | Manual review of `motion.yaml` and `decision.yaml` | `motion.yaml` remains `status: open`; `decision.yaml` remains `status: DRAFT`; no vote/policy/verify edits are introduced. |
| V-7 | Motion gate | `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0140/motion.yaml` | Command exits 0 / PASS. |
| V-8 | Agency gate | `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` | Command exits 0 / PASS. |
| V-9 | Repo sentinel gate | `pnpm -C portal typecheck` | Command exits 0 / PASS. |

### Commit-by-commit plan

1. `docs(canon): add control thread model v0`
   - Touches only `.nexus/docs/control-thread-model.md`
   - Purpose: land the canonical definition and boundary rules first

2. `docs(passalong): document schema v1.1 compatibility`
   - Touches only `.nexus/codex/passalong-schema.md`
   - Purpose: make the additive schema upgrade explicit before examples depend on it

3. `docs(examples): add passalong schema v1.1 examples`
   - Touches only `.nexus/docs/examples/passalong-orchestrator-example.md`
   - Touches only `.nexus/docs/examples/passalong-dev-example.md`
   - Purpose: provide concrete examples after the canon and schema are settled

4. `docs(motion-0140): record implementation evidence`
   - Touches only `.nexus/motions/motion-0140/execution.md`
   - Purpose: capture observed results after V-1 through V-9 pass

### PR title and body draft

**PR title**

`docs(canon): add control thread model and passalong schema v1.1 examples`

**PR body**

```markdown
## Summary

- add `.nexus/docs/control-thread-model.md` as the canonical control-thread definition
- upgrade `.nexus/codex/passalong-schema.md` to additive v1.1 documentation
- add illustrative orchestrator and dev passalong examples under `.nexus/docs/examples/`
- record motion-0140 implementation evidence without ratifying the motion

## Validation

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0140/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

## Not included

- no portal runtime changes
- no portal script changes
- no `.claude/commands/` changes
- no passalong skill or eval upgrade
- no automation, controller behavior, or GitHub workflow integration
- no ratification
```

### Rollback steps

If implementation is abandoned before any commit:

```text
git restore --staged --worktree .nexus/docs/control-thread-model.md .nexus/codex/passalong-schema.md .nexus/docs/examples/passalong-orchestrator-example.md .nexus/docs/examples/passalong-dev-example.md .nexus/motions/motion-0140/execution.md
```

If one or more commits have been created:

1. Revert in reverse order of the isolated commits above.
2. Revert only the affected commit if the fault is limited to one path group.
3. Do not use `git reset --hard`.
4. Do not modify ratification artifacts as part of rollback.

---

## Evidence log

### 1. Implementation file changes (observed)

Five files changed from the working tree, matching the planned touch list exactly:

- `.nexus/docs/control-thread-model.md` — new canonical doc; defines control thread,
  four coordination modes (CONTROL_THREAD, OPERATOR, REPO_EXECUTION, EXPLORATION),
  orthogonality to execution roles, sync-back rule, passalong boundaries, non-goals
- `.nexus/codex/passalong-schema.md` — updated to v1.1; added optional `tasks`,
  `risks`, and `next chat prompts` sections to both orchestrator and dev templates;
  added control-thread framing and compatibility note; preserved all v1.0 sections
- `.nexus/docs/examples/passalong-orchestrator-example.md` — new illustrative example
  using passalong-1.1 schema; includes all orchestrator sections plus the three
  new optional sections; marked as illustrative only
- `.nexus/docs/examples/passalong-dev-example.md` — new illustrative example using
  passalong-1.1 schema; includes all dev sections plus the three new optional
  sections; marked as illustrative only
- `.nexus/motions/motion-0140/execution.md` — this file; planned sections replaced
  with observed evidence

No portal runtime files, no governance runner files, no skill prompts, no eval
fixtures, and no database paths were modified.

---

### 2. Boundary confirmation

- All four implementation files are static documentary artifacts with no side effects
- `.claude/commands/motion-passalong.md` — untouched
- `.nexus/codex/evals/motion-passalong-eval.yaml` — untouched
- `.nexus/codex/README.md` — untouched
- `portal/scripts/**` — untouched
- `portal/src/**` — untouched
- `package.json` — untouched
- No automation, background orchestration, task runner, or GitHub workflow
  integration was introduced
- No controller behavior over repo threads was introduced

---

### 3. Validation and status verification

Commands run:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0140/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

Observed results:

- `validate-motion` → pass
- `validate-agency` → pass
- `typecheck` → pass

---

### 4. Content verification

- `control-thread-model.md` — covers all SC-1 items: control thread definition, all
  four coordination modes with primary responsibility / allowed outputs / forbidden
  behavior, orthogonality to ARCHITECT/BUILDER/VERIFIER/OPERATOR/LIBRARIAN,
  sync-back rule (ratified + passalong recorded), passalong boundaries, non-goals
- `passalong-schema.md` v1.1 — covers all SC-2 items: optional `tasks`, `risks`,
  `next chat prompts` sections in both required-sections tables and both templates;
  compatibility note; hard constraints preserved
- Boundary rules explicitly state passalongs do not execute work, mutate runtime
  state, or replace repo-local judgment (SC-3)
- Both example files exist under `.nexus/docs/examples/` and reflect v1.1 schema
  (SC-4)

---

### 5. Ratification closeout

Ratification of motion-0140 followed the manual governance pattern established by
motions 0138 and 0139:

Required gates passed:
- `validate_motion` → pass
- `validate_agency` → pass
- `typecheck` → pass

Governance artifacts updated to ratified state:
- `decision.yaml` → `status: RATIFIED`, `ratified_by: voter`,
  `notes: "RATIFIED: vote_mode=unanimous_consent"`
- `verify.json` → all required gates recorded as passing
- `policy.yaml` → `required_ok: true`, `eligible_to_vote: true`, `recommended_vote: "yes"`
- `vote.json` → all three required roles cast yes, `outcome.result: PASS`
- `motion.yaml` → `status: ratified`

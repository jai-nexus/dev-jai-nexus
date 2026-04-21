# Execution: JAI Repo Execution Canon v0

**Motion:** motion-0141
**Role:** BUILDER
**Date:** 2026-04-20

---

## Cost estimate

Category: standard
Basis: one new canon doc under `.nexus/docs/`, five new template files under
`.nexus/docs/templates/` (new subdirectory), and one new example under
`.nexus/docs/examples/`. No portal runtime changes. No governance runner
modifications. No database changes. No cross-repo changes.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Implementation-ready plan

### Exact implementation touch list

The implementation should touch exactly these eight files:

1. `.nexus/docs/repo-execution-model.md` (new)
2. `.nexus/docs/templates/motion-package-template.md` (new — creates subdirectory)
3. `.nexus/docs/templates/implementation-ready-plan-template.md` (new)
4. `.nexus/docs/templates/verification-pack-template.md` (new)
5. `.nexus/docs/templates/pr-package-template.md` (new)
6. `.nexus/docs/templates/sync-back-template.md` (new)
7. `.nexus/docs/examples/repo-execution-example.md` (new)
8. `.nexus/motions/motion-0141/execution.md` (modify after content lands)

No other file should change in the implementation branch.

---

### Exact deliverables per path

#### 1. `.nexus/docs/repo-execution-model.md`

```
# Repo Execution Model — dev-jai-nexus

## Purpose
## REPO_EXECUTION definition
  - One repo, one bounded seam, one active change line
  - Execution-oriented but artifact-first
  - Does not widen scope, initiate new motions unilaterally, or mutate cross-repo state
## Coordination mode comparison
  - Table: REPO_EXECUTION vs CONTROL_THREAD vs OPERATOR vs EXPLORATION
  - Columns: primary focus | input artifacts | output artifacts | scope authority | forbidden behavior
## Operating principles
  - Motion-first (no implementation without a governed package)
  - Bounded seam (one change line active at a time)
  - Evidence-falsifiable (output is checkable against the motion's acceptance criteria)
  - Artifact-first (artifacts are produced before ratification, not after)
## Artifact outputs
  - Changed/new repo files
  - Governance package updates (execution.md evidence log)
  - Ratification artifacts (verify.json, vote.json, policy.yaml, decision.yaml)
  - Passalong (sync-back document to control thread or next session)
## Relationship to execution roles
  - Orthogonal to ARCHITECT / BUILDER / VERIFIER / OPERATOR / LIBRARIAN
  - One session holds one execution role within REPO_EXECUTION mode
## Non-goals
  - Automation, enforcement infrastructure, runtime gates
```

#### 2. `.nexus/docs/templates/motion-package-template.md`

```
# Motion Package Template

## Frontmatter block
  - motion_id, kind, title, program, basis, date
## Problem section
  - Current baseline
  - Gap 1 (title + description)
  - Gap N...
## Solution section
  - Sub-line A — [name]
    - Deliverable paths
    - Change description per path
  - Sub-line N...
  - Boundary preservation block
## Success criteria
  - SC-N format: artifact/check + pass condition
## Non-goals list
```

Required vs. optional guidance per section must be explicit.

#### 3. `.nexus/docs/templates/implementation-ready-plan-template.md`

```
# Implementation-Ready Plan Template

## Exact implementation touch list
  - Numbered list: path (new|modify|delete), one-line purpose
## Exact deliverables per path
  - Per-file structure spec
  - Internal data model or section headings
## Explicit no-touch list
  - Paths that must not change
## Acceptance-test / verification matrix
  - Table: ID | artifact or boundary | verification method | pass condition
## Commit-by-commit plan
  - Commit N: message | files touched | purpose
## PR title and body draft
  - Title (≤70 chars)
  - Body: Summary bullets, validation commands, not-included list
## Rollback steps
  - Pre-commit rollback command
  - Post-commit rollback approach
## Defect traps to avoid
  - Known failure modes for this class of motion
```

#### 4. `.nexus/docs/templates/verification-pack-template.md`

```
# Verification Pack Template

## Validation commands
  - Required gate commands with expected exit codes
## Expected evidence per deliverable
  - Per-file: file exists | content check | schema check
## No-touch boundary check
  - git status command to confirm only planned paths changed
## Regression checks
  - Commands to confirm unchanged files are unmodified
## No-mutation checks
  - Confirm governance artifacts (decision.yaml, motion.yaml) retain DRAFT state
    until explicit ratification
```

#### 5. `.nexus/docs/templates/pr-package-template.md`

```
# PR Package Template

## Role
  - Coordination mode + execution role for this PR
## Goal
  - One sentence: what this PR accomplishes
## Scope
  - Exact files changed (new / modified / deleted)
## Outputs
  - What was produced (artifacts, docs, examples)
## Evidence
  - Validation results (validate-motion, validate-agency, typecheck)
  - Observed command output summary
## Risk
  - Residual risk after implementation
## Notes / handoff
  - Anything the reviewer or next session needs that is not in the above
```

#### 6. `.nexus/docs/templates/sync-back-template.md`

```
# Sync-Back Template

## Current baseline
  - Repo, branch, last commit
  - Active motion and its governance status
## What is settled
  - Motions ratified this session
  - Artifacts landed
## What remains open
  - Deferred decisions
  - Pending motions or seams
## Tasks
  - Discrete next steps for the receiving session (bulleted checklist)
## Risks
  - Open risks with mitigations
## Routing targets
  - Which coordination mode should receive next (CONTROL_THREAD | OPERATOR | REPO_EXECUTION | EXPLORATION)
  - Why
## Next chat prompts
  - Exact prompt starters for the next session
```

#### 7. `.nexus/docs/examples/repo-execution-example.md`

- Begins with an explicit note that the file is illustrative only.
- Shows a complete fictional repo-execution session referencing motion-XXXX.
- Includes a filled motion-package frontmatter, an abbreviated implementation-ready
  plan, a filled verification pack, a filled PR package, and a filled sync-back.
- Does not use real motion IDs or live governance artifacts.

#### 8. `.nexus/motions/motion-0141/execution.md`

After the seven canon/template/example artifacts are written and validated:

- Replace the planned file list with the observed file list.
- Record the exact validation commands run and their observed results.
- Record boundary confirmation.
- Keep the motion in DRAFT state until explicit ratification.

---

### Explicit no-touch list

The implementation must not modify any of the following:

- `.claude/commands/motion-passalong.md`
- `.nexus/codex/evals/motion-passalong-eval.yaml`
- `.nexus/codex/README.md`
- `.nexus/codex/passalong-schema.md`
- `.nexus/docs/control-thread-model.md`
- `portal/scripts/**`
- `portal/src/**`
- `package.json`
- `.nexus/motions/motion-0141/decision.yaml`
- `.nexus/motions/motion-0141/policy.yaml`
- `.nexus/motions/motion-0141/verify.json`
- `.nexus/motions/motion-0141/vote.json`
- `.nexus/motions/motion-0141/motion.yaml`
- `.nexus/motions/motion-0141/proposal.md`
- `.nexus/motions/motion-0141/challenge.md`

---

### Acceptance-test / verification matrix

| ID | Artifact / boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | `repo-execution-model.md` | Manual content review | File exists; defines REPO_EXECUTION, coordination mode comparison table, operating principles, artifact outputs, execution-role orthogonality, non-goals |
| V-2 | `motion-package-template.md` | Manual content review | File exists; covers frontmatter, problem, solution, boundary preservation, SC-N criteria, non-goals |
| V-3 | `implementation-ready-plan-template.md` | Manual content review | File exists; covers touch list, deliverables-per-path, no-touch list, acceptance matrix, commit plan, PR draft, rollback, defect traps |
| V-4 | `verification-pack-template.md` | Manual content review | File exists; covers validation commands, expected evidence, no-touch check, regression checks, no-mutation checks |
| V-5 | `pr-package-template.md` | Manual content review | File exists; covers role, goal, scope, outputs, evidence, risk, notes/handoff |
| V-6 | `sync-back-template.md` | Manual content review | File exists; covers baseline, settled, open, tasks, risks, routing targets, next chat prompts |
| V-7 | `repo-execution-example.md` | Manual content review | File is explicitly marked illustrative; includes abbreviated forms of all six artifact types |
| V-8 | No-touch boundary | `git status --short -- .nexus/docs .nexus/codex .nexus/motions/motion-0141 .claude portal package.json` | Only the 8 planned paths show changes; no `.claude`, `portal`, `package.json`, or existing `.nexus/docs/*.md` entries appear |
| V-9 | Motion gate | `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0141/motion.yaml` | Exit 0 / PASS |
| V-10 | Agency gate | `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` | Exit 0 / PASS |
| V-11 | Repo sentinel gate | `pnpm -C portal typecheck` | Exit 0 / PASS |

---

### Commit-by-commit plan

1. `docs(canon): add repo execution model v0`
   - Touches only `.nexus/docs/repo-execution-model.md`
   - Purpose: land the canonical mode definition and operating principles first

2. `docs(templates): add repo execution artifact templates`
   - Touches `.nexus/docs/templates/motion-package-template.md`
   - Touches `.nexus/docs/templates/implementation-ready-plan-template.md`
   - Touches `.nexus/docs/templates/verification-pack-template.md`
   - Touches `.nexus/docs/templates/pr-package-template.md`
   - Touches `.nexus/docs/templates/sync-back-template.md`
   - Purpose: add all five templates after the canon doc is settled

3. `docs(examples): add repo execution example`
   - Touches `.nexus/docs/examples/repo-execution-example.md`
   - Purpose: provide a concrete example after templates are settled

4. `docs(motion-0141): record implementation evidence`
   - Touches `.nexus/motions/motion-0141/execution.md`
   - Purpose: capture observed results after V-1 through V-11 pass

### PR title and body draft

**PR title**

`docs(canon): add repo execution model, artifact templates, and example`

**PR body**

```markdown
## Summary

- add `.nexus/docs/repo-execution-model.md` as the canonical REPO_EXECUTION mode definition
- add five artifact templates under `.nexus/docs/templates/` (motion-package,
  implementation-ready-plan, verification-pack, pr-package, sync-back)
- add illustrative repo-execution example under `.nexus/docs/examples/`
- record motion-0141 implementation evidence

## Validation

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0141/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

## Not included

- no portal runtime changes
- no `.claude/commands/` or `.nexus/codex/evals/` changes
- no passalong skill or eval upgrade
- no automation, controller behavior, or GitHub workflow integration
- no ratification
```

### Rollback steps

If implementation is abandoned before any commit:

```text
git restore --staged --worktree \
  .nexus/docs/repo-execution-model.md \
  .nexus/docs/templates/ \
  .nexus/docs/examples/repo-execution-example.md \
  .nexus/motions/motion-0141/execution.md
```

If one or more commits exist: revert in reverse commit order; do not use
`git reset --hard`; do not modify ratification artifacts as part of rollback.

### Defect traps to avoid

- **Trap 1:** Creating `.nexus/docs/templates/` by writing any file there will
  succeed on Windows even if the directory does not exist beforehand — verify the
  directory was created as intended rather than assuming it failed silently.
- **Trap 2:** The example file must not reference real motion IDs, real commit
  hashes, or live governance artifact content — use placeholder values throughout.
- **Trap 3:** Do not modify decision.yaml, policy.yaml, verify.json, vote.json,
  or motion.yaml during the implementation slice. Those are ratification artifacts.

---

## Evidence log

### 1. Implementation file changes (observed)

Eight files changed from the working tree. Planned touch list matched with one
naming delta:

- `.nexus/docs/repo-execution-model.md` — new canonical REPO_EXECUTION mode
  definition; covers all SC-1 items
- `.nexus/docs/templates/motion-package-template.md` — new; covers SC-3
- `.nexus/docs/templates/implementation-plan-template.md` — new; covers SC-3
  Note: planned name was `implementation-ready-plan-template.md`; implemented
  as `implementation-plan-template.md` (shorter name, equivalent scope)
- `.nexus/docs/templates/verification-pack-template.md` — new; covers SC-3
- `.nexus/docs/templates/pr-package-template.md` — new; covers SC-3
- `.nexus/docs/templates/sync-back-template.md` — new; covers SC-3
- `.nexus/docs/examples/repo-execution-example.md` — new illustrative example;
  covers SC-4; marked as illustrative only
- `.nexus/motions/motion-0141/execution.md` — this file; planned sections
  replaced with observed evidence

No portal runtime files, no governance runner files, no skill prompts, no eval
fixtures, no codex files, and no database paths were modified.

---

### 2. Boundary confirmation

- `.claude/commands/motion-passalong.md` — untouched
- `.nexus/codex/evals/motion-passalong-eval.yaml` — untouched
- `.nexus/codex/passalong-schema.md` — untouched
- `.nexus/docs/control-thread-model.md` — untouched
- `portal/scripts/**` — untouched
- `portal/src/**` — untouched
- `package.json` — untouched
- No automation, background execution, controller behavior, or GitHub workflow
  integration was introduced
- No runtime or cross-repo mutation

---

### 3. Validation and status verification

Commands run:

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0141/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

Observed results:

- `validate-motion` → pass
- `validate-agency` → pass
- `typecheck` → pass

---

### 4. Content verification

All V-1 through V-11 checks passed:
- `repo-execution-model.md` — defines REPO_EXECUTION, coordination mode
  comparison, operating principles, artifact outputs, execution-role
  orthogonality, non-goals (V-1)
- All five templates exist under `.nexus/docs/templates/` and cover required
  sections per proposal Sub-line B (V-2 through V-6)
- `repo-execution-example.md` — marked illustrative, includes abbreviated forms
  of all six artifact types (V-7)
- No-touch boundary check confirmed only planned paths changed (V-8)
- Gate commands all exit 0 (V-9 through V-11)

---

### 5. Ratification closeout

Ratification of motion-0141 followed the manual governance pattern established
by motions 0138–0140:

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

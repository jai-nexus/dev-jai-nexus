# Execution: JAI Orchestrator Canon v0

**Motion:** motion-0142
**Role:** BUILDER
**Date:** 2026-04-20

---

## Cost estimate

Category: standard
Basis: one new canon doc under `.nexus/docs/`, three new template files under
`.nexus/docs/templates/` (subdirectory already exists), and one new example under
`.nexus/docs/examples/`. No portal runtime changes. No governance runner
modifications. No database changes. No cross-repo changes.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Implementation-ready plan

### Exact implementation touch list

The implementation should touch exactly these six files:

1. `.nexus/docs/orchestrator-model.md` (new)
2. `.nexus/docs/templates/candidate-seam-template.md` (new)
3. `.nexus/docs/templates/next-motion-recommendation-template.md` (new)
4. `.nexus/docs/templates/repo-init-routing-template.md` (new)
5. `.nexus/docs/examples/orchestrator-example.md` (new)
6. `.nexus/motions/motion-0142/execution.md` (modify after content lands)

No other file should change in the implementation branch.

---

### Exact deliverables per path

#### 1. `.nexus/docs/orchestrator-model.md`

```
# Orchestrator Model — dev-jai-nexus

## Purpose
## ORCHESTRATOR definition
  - Meta-coordination layer: seam selection, motion packaging, routing
  - Decision-packaging surface, not an execution surface
  - Does not execute work, mutate repo or runtime state, or automate workflow
## Coordination mode comparison
  - Table: ORCHESTRATOR vs CONTROL_THREAD vs REPO_EXECUTION vs EXPLORATION
  - Columns: primary focus | input artifacts | output artifacts | scope authority
    | forbidden behavior
## Operating constraints
  - Seam-selection bounded: reviews candidate seams, recommends one at a time
  - Recommendation-packaging: produces a next-motion recommendation, not a ratified motion
  - Routing: produces a routing recommendation for CONTROL_THREAD (arc decisions)
    or REPO_EXECUTION (bounded implementation)
  - No direct execution authority
  - No repo mutation, no automated branching, no workflow trigger
## Artifact outputs
  - Candidate-seam review
  - Next-motion recommendation
  - Repo-init routing package
  - Passalong / sync-back to receiving session
## Relationship to execution roles
  - Orthogonal to ARCHITECT / BUILDER / VERIFIER / OPERATOR / LIBRARIAN
  - One session holds one execution role within ORCHESTRATOR mode
## Non-goals
  - Automation engine, enforcement infrastructure, runtime gates
  - Direct code or governance mutation
```

#### 2. `.nexus/docs/templates/candidate-seam-template.md`

```
# Candidate Seam Review Template

## Current repo framing
  - Active program / workstream
  - Settled canon as of this review (list ratified motions relevant to context)
## Candidate seams
  - Seam N: [name]
    - Description
    - Why it's viable now
    - What it unblocks
    - Risk if deferred
## Recommendation
  - Recommended next seam
  - Ranked rationale (why this seam before others)
  - Explicitly deferred seams (with deferral reason per seam)
## Routing
  - Which coordination mode should receive this recommendation
  - Why
```

Required vs. optional guidance per section must be explicit.

#### 3. `.nexus/docs/templates/next-motion-recommendation-template.md`

```
# Next-Motion Recommendation Template

## Recommended motion
  - Recommended title
  - Motion id (next available)
  - Kind (builder-proof | librarian-proof | operator-proof | ...)
  - Program
  - Basis (which settled motion enables this)
## Scope
  - Exact bounded scope (one sentence)
  - Non-goals
  - Risks
## Likely touched paths
  - New files (list with purpose)
  - Modified files (list with change description)
  - Explicitly excluded paths
## Branch
  - Recommended branch name
## Next step
  - What the receiving session should do first (one concrete action)
```

Required vs. optional guidance per section must be explicit.

#### 4. `.nexus/docs/templates/repo-init-routing-template.md`

```
# Repo-Init Routing Template

## Input: repo baseline
  - Repo name and domain
  - Current branch
  - Last commit (hash + subject)
  - Working tree state
## Input: settled canon
  - Ratified motions relevant to this session
  - Active template or schema versions
## Input: active seam
  - Current motion or intended next motion
  - Coordination mode for this session
## Request
  - One sentence: what this session is asked to do
## Return shape
  - Expected outputs / artifacts
  - Expected governance state change (if any)
## Keep-out-of-scope constraints
  - Paths that must not change
  - Governance artifacts that must not be mutated
  - Actions that are not authorized for this session
```

Required vs. optional guidance per section must be explicit.

#### 5. `.nexus/docs/examples/orchestrator-example.md`

- Begins with an explicit note that the file is illustrative only.
- Shows a complete fictional ORCHESTRATOR session referencing motion-XXXX.
- Includes a filled candidate-seam review, a filled next-motion recommendation,
  and a filled repo-init routing package.
- Does not use real motion IDs, real branch names, or live governance artifact
  content.

#### 6. `.nexus/motions/motion-0142/execution.md`

After the five canon/template/example artifacts are written and validated:

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
- `.nexus/docs/repo-execution-model.md`
- `.nexus/docs/templates/motion-package-template.md`
- `.nexus/docs/templates/implementation-plan-template.md`
- `.nexus/docs/templates/verification-pack-template.md`
- `.nexus/docs/templates/pr-package-template.md`
- `.nexus/docs/templates/sync-back-template.md`
- `portal/scripts/**`
- `portal/src/**`
- `package.json`
- `.nexus/motions/motion-0142/decision.yaml`
- `.nexus/motions/motion-0142/policy.yaml`
- `.nexus/motions/motion-0142/verify.json`
- `.nexus/motions/motion-0142/vote.json`
- `.nexus/motions/motion-0142/motion.yaml`
- `.nexus/motions/motion-0142/proposal.md`
- `.nexus/motions/motion-0142/challenge.md`

---

### Acceptance-test / verification matrix

| ID | Artifact / boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | `orchestrator-model.md` | Manual content review | File exists; defines ORCHESTRATOR, coordination mode comparison table, operating constraints, artifact outputs, execution-role orthogonality, non-goals |
| V-2 | `candidate-seam-template.md` | Manual content review | File exists; covers current repo framing, candidate seams, recommendation, explicitly deferred seams, routing |
| V-3 | `next-motion-recommendation-template.md` | Manual content review | File exists; covers recommended motion, exact scope, non-goals, risks, touched paths, branch, next step |
| V-4 | `repo-init-routing-template.md` | Manual content review | File exists; covers input (repo baseline, settled canon, active seam), request, return shape, keep-out-of-scope constraints |
| V-5 | `orchestrator-example.md` | Manual content review | File is explicitly marked illustrative; includes abbreviated forms of all three artifact types |
| V-6 | No-touch boundary | `git status --short -- .nexus/docs .nexus/codex .nexus/motions/motion-0142 .claude portal package.json` | Only the 6 planned paths show changes; no `.claude`, `portal`, `package.json`, or existing `.nexus/docs/*.md` entries appear |
| V-7 | Motion gate | `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0142/motion.yaml` | Exit 0 / PASS |
| V-8 | Agency gate | `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` | Exit 0 / PASS |
| V-9 | Repo sentinel gate | `pnpm -C portal typecheck` | Exit 0 / PASS |

---

### Commit-by-commit plan

1. `docs(canon): add orchestrator model v0`
   - Touches only `.nexus/docs/orchestrator-model.md`
   - Purpose: land the canonical mode definition and operating constraints first

2. `docs(templates): add orchestrator artifact templates`
   - Touches `.nexus/docs/templates/candidate-seam-template.md`
   - Touches `.nexus/docs/templates/next-motion-recommendation-template.md`
   - Touches `.nexus/docs/templates/repo-init-routing-template.md`
   - Purpose: add all three templates after the canon doc is settled

3. `docs(examples): add orchestrator example`
   - Touches `.nexus/docs/examples/orchestrator-example.md`
   - Purpose: provide a concrete example after templates are settled

4. `docs(motion-0142): record implementation evidence`
   - Touches `.nexus/motions/motion-0142/execution.md`
   - Purpose: capture observed results after V-1 through V-9 pass

### PR title and body draft

**PR title**

`docs(canon): add orchestrator model, artifact templates, and example`

**PR body**

```markdown
## Summary

- add `.nexus/docs/orchestrator-model.md` as the canonical ORCHESTRATOR mode
  definition
- add three artifact templates under `.nexus/docs/templates/` (candidate-seam,
  next-motion-recommendation, repo-init-routing)
- add illustrative orchestrator example under `.nexus/docs/examples/`
- record motion-0142 implementation evidence

## Validation

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0142/motion.yaml`
- `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus`
- `pnpm -C portal typecheck`

## Not included

- no portal runtime changes
- no `.claude/commands/` or `.nexus/codex/evals/` changes
- no automation, controller behavior, or GitHub workflow integration
- no ratification
```

### Rollback steps

If implementation is abandoned before any commit:

```text
git restore --staged --worktree \
  .nexus/docs/orchestrator-model.md \
  .nexus/docs/templates/candidate-seam-template.md \
  .nexus/docs/templates/next-motion-recommendation-template.md \
  .nexus/docs/templates/repo-init-routing-template.md \
  .nexus/docs/examples/orchestrator-example.md \
  .nexus/motions/motion-0142/execution.md
```

If one or more commits exist: revert in reverse commit order; do not use
`git reset --hard`; do not modify ratification artifacts as part of rollback.

### Defect traps to avoid

- **Trap 1:** The `repo-init-routing-template.md` field names (request, return
  shape, constraints) must not suggest an API or runtime contract — the template
  header must explicitly state it is a session-documentation structure.
- **Trap 2:** The example file must not reference real motion IDs, real commit
  hashes, or live governance artifact content — use placeholder values throughout.
- **Trap 3:** Do not modify `control-thread-model.md` or `repo-execution-model.md`
  to add back-references to ORCHESTRATOR — both are settled canon; cross-references
  belong only in `orchestrator-model.md`.
- **Trap 4:** Do not modify decision.yaml, policy.yaml, verify.json, vote.json,
  or motion.yaml during the implementation slice. Those are ratification artifacts.

---

## Evidence log

### 1. Implementation file changes (observed)

Six files changed from the working tree. Planned touch list matched exactly:

- `.nexus/docs/orchestrator-model.md` — new canonical ORCHESTRATOR mode
  definition; covers all SC-1 items
- `.nexus/docs/templates/candidate-seam-template.md` — new; covers SC-2
- `.nexus/docs/templates/next-motion-recommendation-template.md` — new; covers SC-3
- `.nexus/docs/templates/repo-init-routing-template.md` — new; covers SC-4
- `.nexus/docs/examples/orchestrator-example.md` — new illustrative example;
  covers SC-5; marked as illustrative only
- `.nexus/motions/motion-0142/execution.md` — this file; planned sections
  replaced with observed evidence

No portal runtime files, no governance runner files, no skill prompts, no eval
fixtures, no codex files, and no database paths were modified.

---

### 2. Boundary confirmation

- `.claude/commands/motion-passalong.md` — untouched
- `.nexus/codex/evals/motion-passalong-eval.yaml` — untouched
- `.nexus/codex/passalong-schema.md` — untouched
- `.nexus/docs/control-thread-model.md` — untouched
- `.nexus/docs/repo-execution-model.md` — untouched
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
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0142/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

Observed results:

- `validate-motion` → pass
- `validate-agency` → pass
- `typecheck` → pass

---

### 4. Content verification

All V-1 through V-9 checks passed:
- `orchestrator-model.md` — defines ORCHESTRATOR, coordination mode comparison,
  operating constraints, artifact outputs, execution-role orthogonality, non-goals
  (V-1)
- All three templates exist under `.nexus/docs/templates/` and cover required
  sections per proposal Sub-line B (V-2 through V-4)
- `orchestrator-example.md` — marked illustrative, includes abbreviated forms
  of all three artifact types (V-5)
- No-touch boundary check confirmed only planned paths changed (V-6)
- Gate commands all exit 0 (V-7 through V-9)

---

### 5. Ratification closeout

Ratification of motion-0142 followed the manual governance pattern established
by motions 0138–0141:

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

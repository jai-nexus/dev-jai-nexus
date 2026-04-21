# Execution: JAI Workflow Composition Canon v0

**Motion:** motion-0144
**Role:** BUILDER
**Date:** 2026-04-20

---

## Cost estimate

Category: standard
Basis: one new canon doc under `.nexus/docs/`, one new template file under
`.nexus/docs/templates/` (subdirectory already exists), and one new example under
`.nexus/docs/examples/`. No portal runtime changes. No governance runner
modifications. No database changes. No cross-repo changes.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Implementation-ready plan

### Exact implementation touch list

The implementation should touch exactly these four files:

1. `.nexus/docs/workflow-composition-model.md` (new)
2. `.nexus/docs/templates/transition-matrix-template.md` (new)
3. `.nexus/docs/examples/workflow-composition-example.md` (new)
4. `.nexus/motions/motion-0144/execution.md` (modify after content lands)

No other file should change in the implementation branch.

---

### Exact deliverables per path

#### 1. `.nexus/docs/workflow-composition-model.md`

```
# Workflow Composition Model — dev-jai-nexus

## Purpose
## Workflow composition definition
  - The cross-layer session sequence: how CONTROL_THREAD, ORCHESTRATOR,
    REPO_EXECUTION, and EXPLORATION compose into a governed workflow
  - Documentation artifact, not an execution mechanism
  - Describes how sessions relate in sequence; does not dispatch them
## Normal operating loop
  - Standard chain: CONTROL_THREAD → ORCHESTRATOR → REPO_EXECUTION
    → CONTROL_THREAD (sync-back)
  - Per-step: what each step receives (input state), what it produces (output
    artifact), what the next step expects to receive
## Transition matrix
  - Normal transitions (expected; required for the standard loop)
    - CONTROL_THREAD → ORCHESTRATOR
    - ORCHESTRATOR → REPO_EXECUTION
    - REPO_EXECUTION → CONTROL_THREAD (sync-back)
  - Optional transitions (valid insertions; not required)
    - CONTROL_THREAD → EXPLORATION (when problem space needs investigation)
    - ORCHESTRATOR → EXPLORATION (when seam selection is unclear)
    - EXPLORATION → ORCHESTRATOR (default EXPLORATION exit)
    - EXPLORATION → REPO_EXECUTION (exception path; requires explicit
      justification)
    - EXPLORATION → CONTROL_THREAD (when outcome is arc-level)
  - Discouraged transitions (recognized problems in practice)
    - REPO_EXECUTION → REPO_EXECUTION without closing the current seam
    - EXPLORATION → EXPLORATION without a new bounded target
    - ORCHESTRATOR → ORCHESTRATOR without routing back through CONTROL_THREAD
  - Prohibited transitions (explicitly forbidden mode-to-mode transitions)
    - EXPLORATION → REPO_EXECUTION without the required explicit justification
      (see optional transitions for the valid exception path)
## Governance constraints (apply at all transitions regardless of class)
  - No ratification without evidence artifacts
  - No scope widening without a new governed motion
## State-carrying contract
  - Required state buckets at each transition boundary
  - Current baseline (repo, branch, last commit, working tree state)
  - What is settled (ratified motions, active canon versions)
  - What remains open (deferred items, pending seams)
  - Tasks (discrete next steps for the receiving session)
  - Risks (open risks with mitigations)
  - Routing targets (which mode receives next, and why)
  - Next prompts (exact prompt starters for the receiving session)
  - Mechanism: passalong-schema.md v1.1 (motion-0140)
  - Constraint: state may be compressed but must not be silently dropped
## Failure-state and guidance rules
  - Missing required state: request state-bucket fill; do not infer or assume
  - Silently dropped state: treat as baseline recovery event; route to
    CONTROL_THREAD for context reconstruction
  - Attempted prohibited transition: route to CONTROL_THREAD for arc-level
    decision before proceeding
  - Recursive mode entry without new bounded target: reject; route to
    ORCHESTRATOR to re-frame the problem
## Boundary rules
  - Composition artifacts do not execute work
  - Composition artifacts do not mutate repo or runtime state
  - Composition artifacts do not erase role boundaries
  - Composition artifacts do not turn the workflow chain into a controller
  - Governance constraints from above apply regardless of which transition is
    active; they are not part of the transition classification
## Relationship to execution roles
  - Orthogonal to ARCHITECT / BUILDER / VERIFIER / OPERATOR / LIBRARIAN
  - Workflow composition applies regardless of which execution role is active
## Non-goals
  - Automation engine, enforcement infrastructure, runtime graph
  - Session dispatching or automated transition triggering
  - Defining new coordination modes or execution roles
```

#### 2. `.nexus/docs/templates/transition-matrix-template.md`

```
# Transition Matrix Template

## Purpose
  - Document for a session documenting its own composition context, or for
    a canon doc documenting a workflow pattern. Not an enforcement artifact.

## Transition entries
  - Source mode: [CONTROL_THREAD | ORCHESTRATOR | REPO_EXECUTION | EXPLORATION]
  - Target mode: [CONTROL_THREAD | ORCHESTRATOR | REPO_EXECUTION | EXPLORATION]
  - Transition class: [normal | optional | discouraged | prohibited]
  - Required state at boundary:
    - Current baseline: [required | optional | N/A]
    - What is settled: [required | optional | N/A]
    - What remains open: [required | optional | N/A]
    - Tasks: [required | optional | N/A]
    - Risks: [required | optional | N/A]
    - Routing targets: [required | optional | N/A]
    - Next prompts: [required | optional | N/A]
  - Notes / rationale (one sentence per entry)
```

Required vs. optional guidance per field must be explicit.

#### 3. `.nexus/docs/examples/workflow-composition-example.md`

- Begins with an explicit note that the file is illustrative only.
- Shows a complete fictional multi-layer workflow referencing placeholder motions.
- Covers at minimum:
  - A normal loop (CONTROL_THREAD → ORCHESTRATOR → REPO_EXECUTION → CONTROL_THREAD)
  - An optional EXPLORATION insertion (CONTROL_THREAD → EXPLORATION → ORCHESTRATOR
    → REPO_EXECUTION)
  - A deferred path (ORCHESTRATOR → deferred to future CONTROL_THREAD cycle)
- Includes a filled transition matrix for the example scenario.
- Does not use real motion IDs, real branch names, or live governance artifact
  content.

#### 4. `.nexus/motions/motion-0144/execution.md`

After the three canon/template/example artifacts are written and validated:

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
- `.nexus/docs/orchestrator-model.md`
- `.nexus/docs/exploration-model.md`
- `.nexus/docs/templates/motion-package-template.md`
- `.nexus/docs/templates/implementation-plan-template.md`
- `.nexus/docs/templates/verification-pack-template.md`
- `.nexus/docs/templates/pr-package-template.md`
- `.nexus/docs/templates/sync-back-template.md`
- `.nexus/docs/templates/candidate-seam-template.md`
- `.nexus/docs/templates/next-motion-recommendation-template.md`
- `.nexus/docs/templates/repo-init-routing-template.md`
- `.nexus/docs/templates/exploration-template.md`
- `.nexus/docs/templates/exploration-outcome-template.md`
- `portal/scripts/**`
- `portal/src/**`
- `package.json`
- `.nexus/motions/motion-0144/decision.yaml`
- `.nexus/motions/motion-0144/policy.yaml`
- `.nexus/motions/motion-0144/verify.json`
- `.nexus/motions/motion-0144/vote.json`
- `.nexus/motions/motion-0144/motion.yaml`
- `.nexus/motions/motion-0144/proposal.md`
- `.nexus/motions/motion-0144/challenge.md`

---

### Acceptance-test / verification matrix

| ID | Artifact / boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | `workflow-composition-model.md` | Manual content review | File exists; defines workflow composition, normal loop, transition matrix (all four classes), state-carrying contract (all seven buckets), failure-state guidance, boundary rules, non-goals |
| V-2 | `transition-matrix-template.md` | Manual content review | File exists; covers source/target mode, transition class, required state per bucket, notes |
| V-3 | `workflow-composition-example.md` | Manual content review | File is explicitly marked illustrative; covers normal loop, EXPLORATION insertion, deferred path, and a filled transition matrix |
| V-4 | No-touch boundary | `git status --short -- .nexus/docs .nexus/codex .nexus/motions/motion-0144 .claude portal package.json` | Only the 4 planned paths show changes; no `.claude`, `portal`, `package.json`, or existing `.nexus/docs/*.md` entries appear |
| V-5 | Motion gate | `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0144/motion.yaml` | Exit 0 / PASS |
| V-6 | Agency gate | `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` | Exit 0 / PASS |
| V-7 | Repo sentinel gate | `pnpm -C portal typecheck` | Exit 0 / PASS |

---

### Commit-by-commit plan

1. `docs(canon): add workflow composition model v0`
   - Touches only `.nexus/docs/workflow-composition-model.md`
   - Purpose: land the canonical composition definition, transition matrix, and
     state-carrying contract first

2. `docs(templates): add transition matrix template`
   - Touches `.nexus/docs/templates/transition-matrix-template.md`
   - Purpose: add the template after the canon doc is settled

3. `docs(examples): add workflow composition example`
   - Touches `.nexus/docs/examples/workflow-composition-example.md`
   - Purpose: provide a multi-layer example after template is settled

4. `docs(motion-0144): record implementation evidence`
   - Touches `.nexus/motions/motion-0144/execution.md`
   - Purpose: capture observed results after V-1 through V-7 pass

### PR title and body draft

**PR title**

`docs(canon): add workflow composition model, transition matrix template, and example`

**PR body**

```markdown
## Summary

- add `.nexus/docs/workflow-composition-model.md` as the canonical workflow
  composition definition (transition matrix, state-carrying contract,
  failure-state guidance)
- add `.nexus/docs/templates/transition-matrix-template.md`
- add illustrative workflow composition example under `.nexus/docs/examples/`
- record motion-0144 implementation evidence

## Validation

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0144/motion.yaml`
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
  .nexus/docs/workflow-composition-model.md \
  .nexus/docs/templates/transition-matrix-template.md \
  .nexus/docs/examples/workflow-composition-example.md \
  .nexus/motions/motion-0144/execution.md
```

If one or more commits exist: revert in reverse commit order; do not use
`git reset --hard`; do not modify ratification artifacts as part of rollback.

### Defect traps to avoid

- **Trap 1:** The `workflow-composition-model.md` must not use language that
  implies automated session dispatch or runtime transition triggering. Every
  statement describing a transition must be framed as documentation or guidance,
  not as a system behavior. Phrases like "the system routes to" or "transitions
  automatically to" are prohibited.
- **Trap 2:** The transition matrix must not claim to be exhaustive. The
  `transition-matrix-template.md` documents known patterns; it is not an
  enforcement schema. The implementation must include a note to this effect.
- **Trap 3:** The state-carrying contract must reference passalong-schema.md v1.1
  (`.nexus/codex/passalong-schema.md`) as the mechanism — it does not invent a
  new state-transfer protocol.
- **Trap 4:** The example file must not reference real motion IDs, real branch
  names, or live governance artifact content — use placeholder values throughout.
- **Trap 5:** Do not modify any of the four mode model docs (`control-thread-model.md`,
  `repo-execution-model.md`, `orchestrator-model.md`, `exploration-model.md`) to
  add cross-references to the composition doc — all are settled canon; references
  belong only in `workflow-composition-model.md`.
- **Trap 6:** Do not modify decision.yaml, policy.yaml, verify.json, vote.json,
  or motion.yaml during the implementation slice. Those are ratification artifacts.

---

## Evidence log

### 1. Implementation file changes (observed)

Four files changed from the working tree. Planned touch list matched exactly:

- `.nexus/docs/workflow-composition-model.md` — new canonical workflow composition
  definition; covers all SC-1 items including cross-layer session sequence,
  transition matrix (all four classes), governance constraints section, state-carrying
  contract (all seven buckets), failure-state guidance with reconstructability test,
  and boundary rules
- `.nexus/docs/templates/transition-matrix-template.md` — new; covers SC-2;
  includes purpose note that the template is not an enforcement artifact
- `.nexus/docs/examples/workflow-composition-example.md` — new illustrative
  example; covers SC-3; marked as illustrative only; covers normal loop,
  EXPLORATION insertion, and deferred path with a filled transition matrix
- `.nexus/motions/motion-0144/execution.md` — this file; planned sections
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
- `.nexus/docs/orchestrator-model.md` — untouched
- `.nexus/docs/exploration-model.md` — untouched
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
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0144/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

Observed results:

- `validate-motion` → pass
- `validate-agency` → pass
- `typecheck` → pass

---

### 4. Content verification

All V-1 through V-7 checks passed:
- `workflow-composition-model.md` — defines cross-layer session sequence, normal
  loop, transition matrix (all four classes), governance constraints section
  (separated from transition classification), state-carrying contract (all seven
  buckets with reconstructability-test silent-drop framing), failure-state guidance,
  boundary rules (V-1)
- `transition-matrix-template.md` — covers all required fields per SC-2; includes
  purpose note (not an enforcement artifact); template instantiates the canonical
  framework defined in the model doc (V-2)
- `workflow-composition-example.md` — marked illustrative; covers normal loop,
  EXPLORATION insertion, deferred path, filled transition matrix (V-3)
- No-touch boundary check confirmed only planned paths changed (V-4)
- Gate commands all exit 0 (V-5 through V-7)

---

### 5. Ratification closeout

Ratification of motion-0144 followed the manual governance pattern established
by motions 0138–0143:

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

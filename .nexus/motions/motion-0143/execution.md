# Execution: JAI Exploration Canon v0

**Motion:** motion-0143
**Role:** BUILDER
**Date:** 2026-04-20

---

## Cost estimate

Category: standard
Basis: one new canon doc under `.nexus/docs/`, two new template files under
`.nexus/docs/templates/` (subdirectory already exists), and one new example under
`.nexus/docs/examples/`. No portal runtime changes. No governance runner
modifications. No database changes. No cross-repo changes.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard -> evidence-falsifiability mandatory.

---

## Implementation-ready plan

### Exact implementation touch list

The implementation should touch exactly these five files:

1. `.nexus/docs/exploration-model.md` (new)
2. `.nexus/docs/templates/exploration-template.md` (new)
3. `.nexus/docs/templates/exploration-outcome-template.md` (new)
4. `.nexus/docs/examples/exploration-example.md` (new)
5. `.nexus/motions/motion-0143/execution.md` (modify after content lands)

No other file should change in the implementation branch.

---

### Exact deliverables per path

#### 1. `.nexus/docs/exploration-model.md`

```
# Exploration Model — dev-jai-nexus

## Purpose
## EXPLORATION definition
  - Bounded ideation and option-shaping layer
  - Thinking/structuring surface, not an execution surface
  - Investigates a problem space, evaluates options, produces a structured outcome
  - Does not select seams (ORCHESTRATOR), govern the arc (CONTROL_THREAD),
    or implement (REPO_EXECUTION)
## Coordination mode comparison
  - Table: EXPLORATION vs CONTROL_THREAD vs ORCHESTRATOR vs REPO_EXECUTION
  - Columns: primary focus | input artifacts | output artifacts | scope authority
    | forbidden behavior
## Exploration appropriateness
  - EXPLORATION requires a stated bounded target before the session begins;
    a session without an explicit bounded target is not a valid EXPLORATION session
  - When to use EXPLORATION (problem not yet well-defined; options unclear;
    speculative or hypothetical work to be contained; new area needs investigation
    before a seam can be identified)
  - When to route directly to ORCHESTRATOR instead (seam already identifiable;
    this is the default routing target for most EXPLORATION outcomes)
  - When to route directly to REPO_EXECUTION instead (exception path: exploration
    produces a single unambiguous implementation scope requiring no seam-selection
    decision; requires explicit justification in the outcome artifact)
  - Explicit: EXPLORATION does not recur into itself without a new bounded target
## Artifact outputs
  - Exploration artifact (structured ideation record)
  - Exploration outcome (structured routing decision)
  - Passalong to receiving mode
## Boundary rules
  - Artifacts do not execute work
  - Artifacts do not mutate repo or runtime state
  - Artifacts do not silently become active canon
  - Outcomes do not replace orchestrator recommendations or repo execution planning
  - Sessions do not initiate motions directly
## Relationship to execution roles
  - Orthogonal to ARCHITECT / BUILDER / VERIFIER / OPERATOR / LIBRARIAN
## Non-goals
  - Automation engine, enforcement infrastructure, runtime gates
  - Open-ended ideation without a bounded target
  - Direct code or governance mutation
```

#### 2. `.nexus/docs/templates/exploration-template.md`

```
# Exploration Template

## Current framing
  - What is settled (relevant ratified canon)
  - What triggered this exploration (the problem or gap)
## Exploration target [REQUIRED]
  - The bounded question or problem being explored (one sentence)
  - Sessions without an explicit bounded target are not valid
## Constraints
  - What cannot change during this exploration
  - What is explicitly out of scope
## Evaluation lens
  - Criteria for assessing options (explicit, not implied)
## Candidate ideas / options
  - Option N: [name]
    - Brief description
    - Key assumption
## Tradeoffs
  - Per-option or cross-option analysis against evaluation lens
## Risks
  - What could go wrong with each option, or with the exploration itself
## Open questions
  - What remains unresolved at session close (to be carried into outcome or deferred)
```

Required vs. optional guidance per section must be explicit.

#### 3. `.nexus/docs/templates/exploration-outcome-template.md`

```
# Exploration Outcome Template

## Recommended direction
  - One recommended option
  - Rationale (why this option over others)
## Deferred ideas
  - Option N: [name] — deferral reason
## What becomes active work
  - Concrete description of what the recommendation translates to
  - If routing to ORCHESTRATOR: candidate seam description
  - If routing to REPO_EXECUTION: motion scope description
  - If routing to CONTROL_THREAD: arc-level decision description
## Routing target
  - ORCHESTRATOR | REPO_EXECUTION | CONTROL_THREAD
  - Why this mode (one sentence)
  - Note: ORCHESTRATOR is the default target; routing to REPO_EXECUTION requires
    an explicit justification stating why no seam-selection decision remains
## Next prompt
  - Exact prompt starter for the receiving session
```

Required vs. optional guidance per section must be explicit.

#### 4. `.nexus/docs/examples/exploration-example.md`

- Begins with an explicit note that the file is illustrative only.
- Shows a complete fictional EXPLORATION session referencing a placeholder problem.
- Includes a filled exploration artifact and a filled exploration outcome.
- Does not use real motion IDs, real branch names, or live governance artifact
  content.

#### 5. `.nexus/motions/motion-0143/execution.md`

After the four canon/template/example artifacts are written and validated:

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
- `.nexus/docs/templates/motion-package-template.md`
- `.nexus/docs/templates/implementation-plan-template.md`
- `.nexus/docs/templates/verification-pack-template.md`
- `.nexus/docs/templates/pr-package-template.md`
- `.nexus/docs/templates/sync-back-template.md`
- `.nexus/docs/templates/candidate-seam-template.md`
- `.nexus/docs/templates/next-motion-recommendation-template.md`
- `.nexus/docs/templates/repo-init-routing-template.md`
- `portal/scripts/**`
- `portal/src/**`
- `package.json`
- `.nexus/motions/motion-0143/decision.yaml`
- `.nexus/motions/motion-0143/policy.yaml`
- `.nexus/motions/motion-0143/verify.json`
- `.nexus/motions/motion-0143/vote.json`
- `.nexus/motions/motion-0143/motion.yaml`
- `.nexus/motions/motion-0143/proposal.md`
- `.nexus/motions/motion-0143/challenge.md`

---

### Acceptance-test / verification matrix

| ID | Artifact / boundary | Verification method | Pass condition |
|---|---|---|---|
| V-1 | `exploration-model.md` | Manual content review | File exists; defines EXPLORATION, coordination mode comparison table, appropriateness guidance, artifact outputs, boundary rules, non-goals |
| V-2 | `exploration-template.md` | Manual content review | File exists; covers current framing, exploration target, constraints, evaluation lens, candidate ideas/options, tradeoffs, risks, open questions |
| V-3 | `exploration-outcome-template.md` | Manual content review | File exists; covers recommended direction, deferred ideas, what becomes active work, routing target, next prompt |
| V-4 | `exploration-example.md` | Manual content review | File is explicitly marked illustrative; includes abbreviated forms of both artifact types |
| V-5 | No-touch boundary | `git status --short -- .nexus/docs .nexus/codex .nexus/motions/motion-0143 .claude portal package.json` | Only the 5 planned paths show changes; no `.claude`, `portal`, `package.json`, or existing `.nexus/docs/*.md` entries appear |
| V-6 | Motion gate | `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0143/motion.yaml` | Exit 0 / PASS |
| V-7 | Agency gate | `node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus` | Exit 0 / PASS |
| V-8 | Repo sentinel gate | `pnpm -C portal typecheck` | Exit 0 / PASS |

---

### Commit-by-commit plan

1. `docs(canon): add exploration model v0`
   - Touches only `.nexus/docs/exploration-model.md`
   - Purpose: land the canonical mode definition and appropriateness guidance first

2. `docs(templates): add exploration artifact templates`
   - Touches `.nexus/docs/templates/exploration-template.md`
   - Touches `.nexus/docs/templates/exploration-outcome-template.md`
   - Purpose: add both templates after the canon doc is settled

3. `docs(examples): add exploration example`
   - Touches `.nexus/docs/examples/exploration-example.md`
   - Purpose: provide a concrete example after templates are settled

4. `docs(motion-0143): record implementation evidence`
   - Touches `.nexus/motions/motion-0143/execution.md`
   - Purpose: capture observed results after V-1 through V-8 pass

### PR title and body draft

**PR title**

`docs(canon): add exploration model, artifact templates, and example`

**PR body**

```markdown
## Summary

- add `.nexus/docs/exploration-model.md` as the canonical EXPLORATION mode
  definition
- add two artifact templates under `.nexus/docs/templates/` (exploration,
  exploration-outcome)
- add illustrative exploration example under `.nexus/docs/examples/`
- record motion-0143 implementation evidence

## Validation

- `node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0143/motion.yaml`
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
  .nexus/docs/exploration-model.md \
  .nexus/docs/templates/exploration-template.md \
  .nexus/docs/templates/exploration-outcome-template.md \
  .nexus/docs/examples/exploration-example.md \
  .nexus/motions/motion-0143/execution.md
```

If one or more commits exist: revert in reverse commit order; do not use
`git reset --hard`; do not modify ratification artifacts as part of rollback.

### Defect traps to avoid

- **Trap 1:** The `exploration-outcome-template.md` routing target field must not
  suggest that EXPLORATION can route to another EXPLORATION session — the only
  valid targets are ORCHESTRATOR, REPO_EXECUTION, and CONTROL_THREAD.
- **Trap 2:** The example file must not reference real motion IDs, real branch
  names, or live governance artifact content — use placeholder values throughout.
- **Trap 3:** Do not modify `control-thread-model.md`, `repo-execution-model.md`,
  or `orchestrator-model.md` to add back-references to EXPLORATION — all are
  settled canon; cross-references belong only in `exploration-model.md`.
- **Trap 4:** Do not modify decision.yaml, policy.yaml, verify.json, vote.json,
  or motion.yaml during the implementation slice. Those are ratification artifacts.
- **Trap 5:** The `exploration-template.md` must mark "Exploration target" as
  required and state that sessions without an explicit bounded target are not valid
  EXPLORATION sessions. The `exploration-model.md` appropriateness section must
  state this explicitly as well. This is a hard requirement, not soft guidance.

---

## Evidence log

### 1. Implementation file changes (observed)

Five files changed from the working tree. Planned touch list matched exactly:

- `.nexus/docs/exploration-model.md` — new canonical EXPLORATION mode definition;
  covers all SC-1 items including bounded-target hard requirement and direct
  REPO_EXECUTION exception-path language
- `.nexus/docs/templates/exploration-template.md` — new; covers SC-2; Exploration
  target section marked required
- `.nexus/docs/templates/exploration-outcome-template.md` — new; covers SC-3;
  routing target note includes ORCHESTRATOR-as-default and REPO_EXECUTION
  justification requirement
- `.nexus/docs/examples/exploration-example.md` — new illustrative example;
  covers SC-4; marked as illustrative only; includes both artifact types
- `.nexus/motions/motion-0143/execution.md` — this file; planned sections
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
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0143/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
```

Observed results:

- `validate-motion` → pass
- `validate-agency` → pass
- `typecheck` → pass

---

### 4. Content verification

All V-1 through V-8 checks passed:
- `exploration-model.md` — defines EXPLORATION, coordination mode comparison,
  appropriateness guidance (including bounded-target hard requirement and
  REPO_EXECUTION exception path), artifact outputs, boundary rules, non-goals
  (V-1)
- `exploration-template.md` — covers all required sections per SC-2; Exploration
  target marked as required (V-2)
- `exploration-outcome-template.md` — covers all required sections per SC-3;
  routing target includes ORCHESTRATOR-default and REPO_EXECUTION justification
  note (V-3)
- `exploration-example.md` — marked illustrative, includes both artifact types
  (V-4)
- No-touch boundary check confirmed only planned paths changed (V-5)
- Gate commands all exit 0 (V-6 through V-8)

---

### 5. Ratification closeout

Ratification of motion-0143 followed the manual governance pattern established
by motions 0138–0142:

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

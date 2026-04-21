# Proposal: JAI Repo Execution Canon v0

**Motion:** motion-0141
**Kind:** builder-proof
**Program:** q2-corpus-v2-live-value-loop
**Date:** 2026-04-20
**Basis:** motion-0140 (JAI Control Thread Canon v0)

---

## Problem

Motion-0140 defined the control thread model and passalong schema v1.1. The
coordination layer is now documented. What is not yet documented is how a
REPO_EXECUTION session is structured — what it is, what it produces, and what
the minimum artifact shape looks like at each stage.

Four gaps remain:

**1. No canonical definition of REPO_EXECUTION as a mode.**
The control-thread-model.md (motion-0140) names REPO_EXECUTION as one of four
coordination modes, but does not expand its structure. There is no definition of
what distinguishes a REPO_EXECUTION session from CONTROL_THREAD, OPERATOR, or
EXPLORATION — concretely, in terms of constraints, allowed outputs, and boundaries.

**2. No canonical motion package structure.**
Motions 0134–0140 demonstrate a consistent 8-file motion package pattern, but the
pattern has never been canonically documented. Each session reconstructs it from
prior examples. There is no authoritative reference for the minimum structure of
a motion package including: problem statement, exact scope, non-goals, acceptance
criteria, likely touched paths, and risks.

**3. No canonical templates for execution artifacts.**
Implementation-ready plans, verification packs, PR packages, and sync-back
documents have emerged as recurring artifacts across motions 0134–0140. Each
session invents them partially from memory. There is no authoritative template
for any of them, and their required/optional fields are not formally specified.

**4. No examples of a complete repo-execution session.**
The examples added in motion-0140 cover passalong documents. There is no example
demonstrating a complete repo-execution session — from motion package through
implementation-ready plan, verification pack, and sync-back.

---

## Solution

### Sub-line A — Repo-execution model doc

Add `.nexus/docs/repo-execution-model.md` defining:

1. **REPO_EXECUTION definition** — A REPO_EXECUTION session operates on one repo,
   one bounded seam, and one active change line. It is execution-oriented but
   artifact-first: implementation always follows a governed motion package. It does
   not widen scope, initiate new motions unilaterally, or mutate cross-repo or
   runtime state.

2. **Distinction from other coordination modes** — Explicit table distinguishing
   REPO_EXECUTION from CONTROL_THREAD, OPERATOR, and EXPLORATION across: primary
   focus, input artifacts, output artifacts, scope authority, and forbidden behavior.

3. **Operating principles** — The core constraints that define a valid
   REPO_EXECUTION: motion-first, bounded seam, one active change line,
   evidence-falsifiable output.

4. **Artifact outputs** — What a REPO_EXECUTION session produces:
   changed/new repo files, governance package updates, evidence artifacts
   (verify.json, execution.md evidence log, passalong).

### Sub-line B — Execution artifact templates

Add `.nexus/docs/templates/` with five canonical template files:

**`motion-package-template.md`** — minimum motion package structure:
- Frontmatter: motion_id, kind, title, program, basis, date
- Problem section: current baseline, gap description
- Solution section: sub-lines with exact file paths and change descriptions
- Boundary preservation block
- Success criteria (SC-N format)
- Non-goals list

**`implementation-ready-plan-template.md`** — minimum implementation plan:
- Exact implementation touch list (numbered, with new/modify/delete labels)
- Exact deliverables per path (structure spec per file)
- Explicit no-touch list
- Acceptance-test/verification matrix (ID, artifact, method, pass condition)
- Commit-by-commit plan (message, files touched, purpose)
- PR title and body draft
- Rollback steps

**`verification-pack-template.md`** — verification evidence structure:
- Validation commands (validate-motion, validate-agency, typecheck)
- Expected evidence per deliverable
- No-touch boundary checks
- Regression checks for unchanged files
- No-mutation checks for governance artifacts

**`pr-package-template.md`** — PR documentation structure:
- Role: which coordination mode and execution role
- Goal: what the PR accomplishes in one sentence
- Scope: exact files changed
- Outputs: what was produced
- Evidence: validation results and observed command output
- Risk: residual risk after implementation
- Notes / handoff: anything the reviewer or next session needs

**`sync-back-template.md`** — session-internal completion record:
- Current baseline: what is settled as of this session
- What is settled: motions ratified, artifacts landed
- What remains open: deferred decisions, pending motions
- Tasks: discrete next steps for the receiving session
- Risks: open risks with mitigations
- Routing targets: which coordination mode should receive next
- Next chat prompts: exact prompt starters for the next session

  Note: this template captures the session-internal state record — what a
  REPO_EXECUTION session fills in before deciding a passalong is needed.
  It is distinct from the passalong itself. The passalong is the handoff
  document authored after sync-back, following passalong-schema.md v1.1.

### Sub-line C — Repo-execution example

Add `.nexus/docs/examples/repo-execution-example.md` — an illustrative example
of a complete repo-execution session artifact set, referencing the templates.
Marked as example only, not a live governance artifact.

### Boundary preservation

This motion does not authorize:
- Automation engine or background execution
- Passalong skill or eval fixture upgrade
- Any changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0140
- Pi/runtime, Live Ops, telemetry, notifications, or collaboration systems
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration

---

## Success criteria

- **SC-1** `.nexus/docs/repo-execution-model.md` exists and defines: REPO_EXECUTION
  mode, distinction from CONTROL_THREAD/OPERATOR/EXPLORATION, operating principles,
  artifact outputs
- **SC-2** `.nexus/docs/templates/` contains all five template files:
  motion-package, implementation-ready-plan, verification-pack, pr-package,
  sync-back
- **SC-3** Each template covers the required sections per Sub-line B
- **SC-4** `.nexus/docs/examples/repo-execution-example.md` exists and is marked
  as illustrative only
- **SC-5** `validate-motion` passes for motion-0141
- **SC-6** `validate-agency` passes for dev.jai.nexus / dev-jai-nexus
- **SC-7** `pnpm typecheck` passes
- **SC-8** No portal runtime, governance runner, skill prompt, eval fixture,
  or grid script files modified

---

## Non-goals

- Automation engine or background execution
- Passalong skill or eval fixture upgrade
- Changes to `.claude/commands/` or `.nexus/codex/evals/`
- Portal runtime, database, or cross-repo state mutation
- Grid governance script changes
- package.json changes
- Reopening or amending motions 0134–0140
- Widening into Pi/runtime, Live Ops, telemetry, notifications, or collaboration
- Automatic commit, PR generation, or branch creation
- GitHub workflow integration
- Any changes to existing `.nexus/docs/` docs (control-thread-model.md,
  passalong-schema.md, etc.) beyond what motion-0141 explicitly introduces

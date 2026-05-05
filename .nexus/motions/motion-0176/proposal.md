# Proposal: Docs Operations Level 2 Patch Plan v0

**Motion:** motion-0176
**Kind:** builder-proof
**Program:** q2m5-docs-ops-level-2-patch-plan-v0
**Basis:** motion-0175

---

## Problem statement

Motion-0175 proved Level 0 and Level 1 read/recommend behavior only. The next
bounded seam is to exercise Level 2 planning artifacts without mutating docs-nexus
or producing any executable patch, diff, branch, or PR action.

Motion-0176 provides that non-mutating Level 2 proof.

---

## Scope

In scope:

- add `.nexus/canon/docs-ops-level-2-patch-plan.yaml`
- add draft motion artifacts under `.nexus/motions/motion-0176/`
- define a Level 2 non-mutating patch-plan model
- identify participating docs-agent roles
- produce a docs-nexus patch-plan dry run as text only
- produce PR title and body draft text as text only
- produce proposed file list as recommendations only
- produce validation plan as recommendations only
- produce reviewer handoff as recommendations only
- preserve Level 3 through Level 5 as disabled

Out of scope:

- docs-nexus edits
- docs-nexus branch creation
- docs-nexus PR creation
- files generated for docs-nexus
- patch or diff output that can be applied directly
- automation
- scheduler behavior
- hidden persistence
- credentials
- live capture
- API or DB mutation
- execution authority
- Level 3 activation
- Level 4 activation
- Level 5 activation
- Agent Assets Library implementation
- raw source promotion to canon
- direct main writes
- autonomous merge

---

## Deliverables

### 1. Level 2 patch-plan canon

`.nexus/canon/docs-ops-level-2-patch-plan.yaml` must define:

- active Level 2 planning posture only
- supporting Level 0 and Level 1 roles
- a non-mutating patch-plan target
- recommended docs-nexus file targets
- PR title and PR body draft text
- validation plan recommendations
- reviewer handoff recommendations
- blocked outputs that preserve the non-mutating boundary

### 2. Participating roles

The motion must actively include:

- `docs_patch_planner`
- `docs_verifier`
- `docs_librarian`
- `source_curator`
- `context_packager`
- `operator`

The motion must explicitly keep:

- `docs_arbiter` inactive unless a dispute is modeled

---

## Acceptance criteria

- L2P-01 Level 2 non-mutating patch-plan model documented
- L2P-02 participating docs-agent roles identified
- L2P-03 docs_patch_planner active only for planning output
- L2P-04 proposed docs-nexus file list is recommendations-only
- L2P-05 PR title/body draft text is included as non-mutating draft text
- L2P-06 validation plan is included
- L2P-07 reviewer handoff is included
- L2P-08 no docs-nexus files are edited
- L2P-09 no docs-nexus branch or PR is created
- L2P-10 no direct patch/diff output is produced
- L2P-11 Level 3 through Level 5 remain disabled
- L2P-12 no automation, scheduler, DB/API, hidden persistence, credentials, or execution authority is added
- L2P-13 validate-motion passes
- L2P-14 validate-agency passes
- L2P-15 portal typecheck passes

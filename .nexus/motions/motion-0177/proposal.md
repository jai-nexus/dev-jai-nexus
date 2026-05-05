# Proposal: JAI Agent Assets Library v0

**Motion:** motion-0177
**Kind:** builder-proof
**Program:** q2m5-agent-assets-library-v0
**Basis:** motion-0176

---

## Problem statement

The repo now has settled workflow-role canon and settled docs-ops authority canon,
but reusable static operating assets are still scattered or reconstructed ad hoc
per seam. A repo-native library of static role cards, templates, and checklists
would standardize future agent work without changing policy or authority.

Motion-0177 provides that static library only.

---

## Scope

In scope:

- add `.nexus/agent-assets/README.md`
- add role cards under `.nexus/agent-assets/role-cards/`
- add templates under `.nexus/agent-assets/templates/`
- add checklists under `.nexus/agent-assets/checklists/`
- add draft motion artifacts under `.nexus/motions/motion-0177/`
- document relationship to motions 0173 through 0176
- state clearly that assets do not grant authority

Out of scope:

- docs-nexus edits
- jai-nexus edits
- Level 3 activation
- Level 4 activation
- Level 5 activation
- branch-write authority
- PR-creation authority
- execution authority
- automation
- scheduler behavior
- hidden persistence
- credentials
- API or DB mutation
- live capture
- provider dispatch
- autonomous merge
- docs-nexus source artifact mutation
- Source Intelligence Library follow-on implementation

---

## Deliverables

### 1. Agent Assets Library taxonomy

The library must explicitly document:

1. role cards
2. prompt templates
3. passalong templates
4. repo-routing templates
5. verification checklists
6. docs-ops recommendation template
7. Level 2 patch-plan template
8. operator review checklist
9. risk register template
10. acceptance criteria template

### 2. Initial role cards

The library must add role cards for:

- `CONTROL_THREAD`
- `ORCHESTRATOR`
- `REPO_EXECUTION`
- `EXPLORATION`
- `docs_librarian`
- `source_curator`
- `context_packager`
- `docs_patch_planner`
- `docs_verifier`
- `operator`

### 3. Initial templates and checklists

The library must add the reusable templates and checklists listed in the task
statement with explicit purpose, usage conditions, required inputs, expected
outputs, boundaries, and related canon.

---

## Acceptance criteria

- AAL-01 Agent Assets Library v0 is defined
- AAL-02 Asset taxonomy is documented
- AAL-03 Initial role cards are added
- AAL-04 Initial prompt/passalong/repo-routing templates are added
- AAL-05 Initial verification/operator/risk/acceptance checklists are added
- AAL-06 Relationship to motion-0173 workflow-role taxonomy is documented
- AAL-07 Relationship to motion-0174 docs-ops authority ladder is documented
- AAL-08 Relationship to motion-0175 Level 0/1 dry run is documented
- AAL-09 Relationship to motion-0176 Level 2 patch-plan dry run is documented
- AAL-10 Assets explicitly state they do not grant authority
- AAL-11 No Level 3/4/5 authority is activated
- AAL-12 No docs-nexus or jai-nexus files are touched
- AAL-13 No automation/scheduler/API/DB/provider/credential changes are added
- AAL-14 validate-motion passes
- AAL-15 validate-agency passes
- AAL-16 portal typecheck passes

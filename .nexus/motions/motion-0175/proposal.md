# Proposal: Docs Operations Level 0/1 Dry Run v0

**Motion:** motion-0175
**Kind:** builder-proof
**Program:** q2m5-docs-ops-level-0-1-dry-run-v0
**Basis:** motion-0174

---

## Problem statement

Motion-0174 defined the agentic docs operations control plane and authority ladder,
but there is not yet a concrete dry-run record proving that Level 0 and Level 1
behavior can be exercised cleanly without drifting into Level 2 patch planning,
PR drafting, docs-nexus mutation, or any write-adjacent authority.

Motion-0175 provides that proof as canon and motion record only.

---

## Scope

In scope:

- add `.nexus/canon/docs-ops-level-0-1-dry-run.yaml`
- add draft motion artifacts under `.nexus/motions/motion-0175/`
- document Level 0 read-only context use
- document Level 1 recommendations only
- produce docs-operation recommendations
- produce curation notes
- produce relevance scores or relevance observations
- produce docs update proposals as recommendations only
- produce a dry-run record in dev-jai-nexus
- include one model-only DocsAgentOperationEvent example when clearly bounded and non-emitted

Out of scope:

- docs-nexus edits
- docs-nexus branch creation
- docs-nexus PR creation
- patch plans
- PR drafts
- automation
- scheduler behavior
- hidden persistence
- credentials
- live capture
- API or DB mutation
- execution authority
- Level 2 activation
- Level 3 activation
- Level 4 activation
- Level 5 activation
- Agent Assets Library implementation
- raw source promotion to canon

---

## Deliverables

### 1. Level 0 and Level 1 dry-run canon

`.nexus/canon/docs-ops-level-0-1-dry-run.yaml` must define:

- active authority as Level 0 and Level 1 only
- explicit inactive status for Levels 2 through 5
- participating docs-agent roles
- dry-run recommendations
- curation notes and relevance observations
- recommendations-only docs update proposals
- blocked outputs and no-write boundaries

### 2. Role participation

The dry run must actively include:

- `docs_librarian`
- `source_curator`
- `context_packager`
- `docs_verifier`
- `operator`

The dry run must explicitly keep:

- `docs_patch_planner` inactive or out of scope because Level 2 is not activated
- `docs_arbiter` inactive or not needed because no dispute is present

### 3. Optional event example

If included, the event example must be explicitly model-only, non-emitted, and
must not imply an enabled event stream or mutation path.

---

## Acceptance criteria

- DOD-01 Level 0/1 dry-run model documented
- DOD-02 participating docs-agent roles identified
- DOD-03 dry-run recommendations produced
- DOD-04 curation notes or relevance observations produced
- DOD-05 no patch plans produced
- DOD-06 no PR drafts produced
- DOD-07 no docs-nexus mutation path introduced
- DOD-08 no authority guardrails weakened
- DOD-09 optional event sample, if present, is explicitly model-only and non-emitted
- DOD-10 docs_patch_planner remains inactive or out of scope
- DOD-11 Level 2 remains disabled for this dry run
- DOD-12 Levels 3 through 5 remain modeled disabled
- DOD-13 validate-motion passes
- DOD-14 validate-agency passes
- DOD-15 portal typecheck passes

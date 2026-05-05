# Challenge: Q2M5 Control Thread Role Taxonomy v0

**Motion:** motion-0173

---

## Key risks

- **R-1: `ORCHESTRATOR` could be mistaken for a reactivated JAI agent role.**
  The workflow role is valid, but the canonical JAI agent role remains deferred
  and not active. The canon must state this directly.

- **R-2: Schema canon could be read as execution enablement.**
  If routing targets or passalongs read like commands, the taxonomy would weaken
  existing authority guardrails. The files must state documentary-only posture.

- **R-3: `REPO_EXECUTION` could be read as authority expansion.**
  The taxonomy must describe expected outputs without granting branch writes, PR
  creation, runtime mutation, or cross-repo mutation.

- **R-4: Motion-0174 scope could leak into motion-0173.**
  Future operational routing work must be noted only as a deferred dependency and
  must not be implemented here.

---

## Required protections

- keep all schema files documentary-only
- keep workflow-role and JAI-agent-role taxonomies explicitly separate
- state that active JAI agent roles remain unchanged
- keep all execution/write authority disabled unless separately authorized
- keep motion-0174 referenced as future dependency only
- avoid edits outside `.nexus/canon/**` and `.nexus/motions/motion-0173/**`

---

## Out of scope

- activation of Orchestrator as a JAI agent role
- branch-write or PR authority changes
- automation, scheduling, or hidden persistence
- DB/API mutation
- docs-nexus or jai-nexus changes

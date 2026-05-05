# Challenge: Agentic Docs Operations Control Plane v0

**Motion:** motion-0174

---

## Key risks

- **R-1: The ladder could be misread as current activation.**
  Levels 3 through 5 must be modeled only and explicitly disabled in v0.

- **R-2: Role ceilings could be mistaken for authority grants.**
  `default_max_level` must be described as a ceiling that could be considered
  only after explicit future approval.

- **R-3: The package could accidentally widen docs-nexus authority.**
  No write, branch, PR, merge, automation, scheduler, API, DB, or credential
  behavior may be added.

- **R-4: Raw source promotion and canon-bearing ambiguity could leak in.**
  The guardrails must block raw source promotion to canon and autonomous merge.

---

## Required protections

- keep the entire motion canon-only and planning-only
- keep Levels 0 through 2 designable now only
- keep Levels 3 through 5 modeled but disabled
- state that docs-nexus remains unedited by this motion
- state that no cross-repo execution authority is granted
- define the audit event shape without emitting events

---

## Out of scope

- docs-nexus repo mutation
- docs-nexus branch or PR creation
- autonomous merge
- raw source canon promotion
- live capture, hidden persistence, or scheduler behavior

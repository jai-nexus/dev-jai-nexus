# Challenge: Control Plane Authority Visibility v0

**Motion:** motion-0178

---

## Key risks

- **R-1: Visibility copy could be mistaken for new authority.**
  The surfaces must clearly state that the view is read-only and that assets do
  not grant authority.

- **R-2: Docs-ops levels could be displayed ambiguously.**
  Levels 0 through 2 must be shown as exercised/planning-safe only, while
  Levels 3 through 5 remain explicitly modeled disabled.

- **R-3: A new model could drift into persistence or automation.**
  The implementation must stay static and local to existing operator pages.

- **R-4: Existing operator pages could become less usable.**
  The added visibility sections must be additive, concise, and compatible with
  the current read-only operator layout.

---

## Required protections

- use static local model data only
- reuse existing operator routes
- avoid new API routes and persistence
- preserve all existing blocked-capability boundaries

---

## Out of scope

- docs-nexus or jai-nexus edits
- any authority activation
- persistence or automation wiring
- provider, credential, DB, or API changes

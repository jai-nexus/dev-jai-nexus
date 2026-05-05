# Challenge: JAI Agent Assets Library v0

**Motion:** motion-0177

---

## Key risks

- **R-1: Static assets could be misread as active authority.**
  Every asset must state that it is reusable material only and does not grant authority.

- **R-2: Asset content could drift into replacement policy.**
  The library must support canon, not replace the workflow-role taxonomy or docs-ops ladder.

- **R-3: Docs-ops asset wording could imply Level 3+ activation.**
  The library must preserve Level 3, Level 4, and Level 5 as disabled.

- **R-4: Asset creation could widen system scope.**
  No docs-nexus, jai-nexus, portal runtime, DB/API, scheduler, provider, or credential surfaces may change.

---

## Required protections

- mark the entire library as static and non-authoritative
- link workflow assets to motion-0173
- link docs-ops assets to motions 0174, 0175, and 0176
- preserve all authority and automation guardrails
- keep the touched surface inside `.nexus/agent-assets/**` and `motion-0177/**`

---

## Out of scope

- repo mutation outside `.nexus/agent-assets/**` and `motion-0177/**`
- authority activation
- provider or automation implementation
- docs-nexus or jai-nexus edits

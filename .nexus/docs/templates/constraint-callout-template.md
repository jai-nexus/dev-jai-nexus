# Constraint Callout Template

Use this template when a future canon artifact needs to restate one governance
constraint from `governance-constraint-stack.md`.

This is a reusable expression template.

It does not enforce anything at runtime.
It does not redefine the governance constraint stack.

A filled artifact using this template is called a `constraint callout`.

---

## Constraint callout: `{short label}`

- `constraint class`
  - `{global workflow constraints | Class 1: Governance execution-boundary | Class 2: Non-mutation | Class 3: Non-automation / non-controller | Class 4: Continuity / state-carrying | Class 5: Scope / non-goal preservation}`

- `binding rule`
  - `{the rule being asserted here}`

- `affected layers / artifact domains`
  - `{control-thread artifacts | orchestrator artifacts | repo-execution artifacts | exploration artifacts | workflow kits | governance read-only surfaces}`

- `prohibited drift`
  - `{what weakening, reinterpretation, or adjacent misuse is not allowed}`

- `required callout location`
  - `{boundary preservation | keep-out-of-scope constraints | non-goals | continuity notes | other explicit location}`

- `recovery guidance if omitted or weakened`
  - `{how a receiving or reviewing session should recover if the callout is absent, blurred, or contradicted}`

Use one filled callout per distinct constraint being expressed.

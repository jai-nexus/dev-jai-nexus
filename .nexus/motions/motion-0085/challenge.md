# Challenge: Bounded Project Intake Canon v0

**Motion:** motion-0085
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The proposal is well-scoped. Three specific objections are raised for the
record; all are resolved below.

---

### C-1: Removing `bootstrap_wave` loses future extensibility

**Concern:** Future migration or extension projects may enter at Wave 2 or
Wave 3. If `bootstrap_wave` is not in the intake schema, how is entry wave
communicated?

**Resolution:** `project_type: "extension" | "migration"` signals that the
project is not greenfield. WS-C (Topology and Wave Planner) is the correct
workstream to compute the entry wave from `project_type` and the existing
governance state. The intake object does not need to store a computed output.
If WS-C later determines that an override is needed, it can add an optional
`entry_wave_override` field in its own child motion. Removing `bootstrap_wave`
now is correct.

---

### C-2: `project_type` values are under-defined

**Concern:** `greenfield | migration | extension` are named but not defined.
A planner reading the schema cannot determine which value applies.

**Resolution:** The schema will include definitions for each value. The
distinctions are:
- `greenfield`: net-new project, no existing repos or NH root.
- `migration`: existing project being brought under JAI NEXUS governance.
  May have existing repos, code, and NH roots.
- `extension`: new project that extends an existing JAI NEXUS project;
  may share governance-resident infrastructure.

These definitions are sufficient for WS-C wave planning and WS-B NH root
assignment decisions.

---

### C-3: Removing `execution_profile.scope` leaves no explicit cross-repo signal in intake

**Concern:** Downstream tooling (WS-D generator) may need to know whether
cross-repo scope entries are required. If `execution_profile.scope` is removed,
the only signal is `topology.shape`.

**Resolution:** `topology.shape: "polyrepo"` is the correct and unambiguous
signal. `execution_profile.scope` was a restatement of that signal. The WS-D
generator reads `topology.shape` directly. No information is lost.

---

## Verdict

No blocking objections. Motion-0085 may proceed.

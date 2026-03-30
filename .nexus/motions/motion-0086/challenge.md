# Challenge: Bounded Agent Demand Planner v0

**Motion:** motion-0086
**Challenger role:** challenger
**Date:** 2026-03-30

## Review

The proposal is well-grounded in the agency.yaml baseline. Four objections
are raised for the record.

---

### C-1: OPERATOR governance_resident_only=true may be wrong for some projects

**Concern:** The proposal defaults OPERATOR to governance-resident repo only.
But a polyrepo project with a distributed operator surface (e.g., one operator
per repo) would need OPERATOR scoped cross-repo. Hardcoding the default as
`true` bakes in a constraint that may not hold.

**Resolution:** The flag is a *default*, not an invariant. The schema allows
override. The minimum-viable staffing model uses one OPERATOR scoped to the
governance-resident repo because operator approval happens at the governance
surface, not inside each execution repo. Projects that need cross-repo operator
placement should override the flag explicitly — that override is a WS-C wave
planning decision, not a WS-B default. Default `true` is correct for the
minimum viable case. Accepted.

---

### C-2: "Panel = 5 candidates + 1 selector = 6 slots" is not stated in slot-policy.yaml

**Concern:** `slot-policy.yaml` defines `minimum_slot_intent` per role but
does not explicitly state that panel = 5 candidates + 1 selector. This appears
to be derived from `model-slots.yaml` (which has 5 SLOT_<ROLE>_0N variables +
1 SLOT_<ROLE>_SELECTOR per role). If model-slots.yaml changes, the panel count
would silently diverge.

**Resolution:** The schema will note that panel slot count is derived from
`model-slots.yaml` convention (5 candidates + 1 selector per role) and is not
hardcoded. The schema records the convention as-observed, not as a fixed
invariant. If model-slots.yaml changes, the demand matrix should be
re-evaluated. This is an acceptable dependency; it does not block WS-B. Accepted.

---

### C-3: The schema should not embed role-to-scope_actions defaults inside the planner schema

**Concern:** The proposed `scope_actions` defaults (read, plan, design, etc.)
are already implicitly defined by the execution roles in project-constitution.yaml
and expressed in agency.yaml. Duplicating them in the demand matrix schema
creates a second place to maintain these mappings and a potential divergence
source.

**Resolution:** The demand matrix schema will define `scope_actions` as a field
in the item schema but will *reference* agency.yaml as the canonical baseline
rather than embedding the values as schema-level defaults. The planner uses the
observed agency.yaml pattern as a starting point and documents it. The schema
does not attempt to own the canonical scope_actions definition. Accepted with
this clarification incorporated into the execution.md.

---

### C-4: The NH-suffix fix is correct but should be validated against the offbook example

**Concern:** The proposal asserts the NH-suffix convention based on agency.yaml
inspection. It should be confirmed that the corrected convention is consistent
with the OffBook.ai example already in the planning directory.

**Resolution:** Confirmed. The OffBook.ai example in `offbook-ai-intake-example.yaml`
already uses the correct flat convention: council=7.0, proposer=7.0.1,
architect=7.0.10, etc. The fix aligns the schema with both the agency.yaml
baseline and the existing example. No example changes required. Accepted.

---

## Verdict

No blocking objections. All four resolved. Motion-0086 may proceed.

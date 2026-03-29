# Challenge (motion-0072)

## Risks

### Risk 1 — Tag format collision
The `motion:` prefix could collide with future tags using the same
namespace for different purposes. If another subsystem later adds
`motion:` tags with different semantics, `getMotionFromTags` would
return incorrect results.

### Risk 2 — Tag stripped by future routing changes
`stripManagedTags` in `workPacketActions.ts` currently strips only
`assignee:` and `route:` prefixes. If a future routing change adds
`motion:` to the strip list by mistake, packets would silently lose
their motion identity mid-execution.

### Risk 3 — Script diverges from live creation logic
The dry-run output defines an "activation intent." If the live work
packet creation (WS-1 phase 2) diverges from this intent — different
tags, different title format, different route — the dry-run output
would be misleading rather than predictive.

### Risk 4 — Activatability checks are too strict or too loose
Requiring `execution.handoff.json` with status `ISSUED` means a motion
that was ratified but whose handoff was not explicitly issued cannot be
activated. This is intentional but may be surprising in practice.
Conversely, not requiring `verify.json` or `vote.json` to exist means
a partially-governed motion could appear activatable.

---

## Objections

- Tag collision risk is low given the namespaced prefix and the
  specificity of `motion-XXXX` format. The `assignee:` pattern has
  been stable. Adding `motion:` follows the same convention.
- Tag strip risk is mitigated by the fact that `stripManagedTags`
  is a local function with an explicit filter list. A future change
  would need to deliberately add `motion:` to the strip list.
- Dry-run divergence risk is the strongest objection. Mitigation:
  the live creation slice (WS-1 phase 2) must use the same helper
  functions (`buildMotionTag`, `getMotionFromTags`) and must accept
  a review that the output matches the dry-run intent.
- Requiring `execution.handoff.json` with `ISSUED` status is correct
  governance behavior. Ratification alone is not sufficient — the
  operator must have explicitly issued the handoff before activation.
  This enforces the governance boundary.

---

## Mitigations

- `buildMotionTag` and `getMotionFromTags` are pure functions with no
  side effects. Their behavior is deterministic and testable from their
  type signatures alone.
- The dry-run script is read-only. Any mistake in its logic has no
  operational consequence.
- The `motion:` tag format is documented in the proposal and in code
  comments, making future accidental stripping detectably wrong.

---

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05

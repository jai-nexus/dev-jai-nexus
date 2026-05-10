# Challenge: Motion Snapshot Gate v0

**Motion:** motion-0182

---

## Risks

### Risk 1: Writing a policy that this PR itself does not follow

If motion-0182 introduces the gate but leaves the bundled snapshot ending at
`motion-0181`, the policy lands as theory rather than proof.

### Risk 2: Command-name collision

Root `package.json` already has a `snapshot:motions` script for a different flow.
Reusing that name at the wrong layer would make the gate ambiguous.

### Risk 3: Over-scoping into automation

The obvious next step is CI enforcement, but that would broaden the seam and add
operational coupling that has not been explicitly routed.

### Risk 4: Applying the gate too broadly

Non-motion PRs should not pay unnecessary closeout cost unless they touch motion
snapshot logic itself.

---

## Challenger standard

Approve only if:

- the bundled snapshot is refreshed through the final PR state
- the gate is explicit for future motion-bearing PRs
- command collisions are handled cleanly
- any repo-guidance updates stay small and appropriate
- no automation or authority expansion is introduced

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.05

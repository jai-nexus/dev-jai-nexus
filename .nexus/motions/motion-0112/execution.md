# Execution: Close motion-0037 stale promotion — promote decision.yaml to RATIFIED

**Motion:** motion-0112
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Files to edit (motion-0037 only):

```
.nexus/motions/motion-0037/decision.yaml    (status promotion + ratified_by + notes + last_updated)
.nexus/motions/motion-0037/decision.md      (add ## Status: RATIFIED section)
```

Files NOT changed:
- motion-0037/vote.json — complete and correct, no changes
- motion-0037/verify.json — complete and correct, no changes
- motion-0037/policy.yaml — complete and correct, no changes
- motion-0037/motion.yaml — no changes
- motion-0037/proposal.md — no changes
- motion-0037/challenge.md — no changes
- motion-0037/execution.md — no changes
- No other motions edited
- No scripts, runtime, UI, or DB changes

## Steps

### Step 1 — Confirm current state of motion-0037 anomaly

Verify anomaly is as described in the audit:

```bash
# Confirm decision.yaml is still DRAFT
grep "^status:" .nexus/motions/motion-0037/decision.yaml

# Confirm vote.json passed
node -e "const v=require('./.nexus/motions/motion-0037/vote.json'); console.log(v.outcome.result, v.outcome.yes+'y', v.outcome.no+'n')"
```

Expected:
- decision.yaml: `status: DRAFT`
- vote.json: `PASS 3y 0n`

### Step 2 — Edit decision.yaml for motion-0037

Apply the following changes to `.nexus/motions/motion-0037/decision.yaml`:

```yaml
# Before
status: DRAFT
ratified_by: null
notes: "PENDING: awaiting vote"
last_updated: "2026-03-13T21:06:03.581Z"

# After
status: RATIFIED
ratified_by: "manual:proposer"
notes: "RATIFIED: Claude Bootstrap Generator v0 — unanimous consent, 3 yes votes."
last_updated: "<execution-timestamp>"
```

### Step 3 — Update decision.md for motion-0037

Add a `## Status: RATIFIED` section at the top of the document body in
`.nexus/motions/motion-0037/decision.md` to reflect ratification.

The existing Family C era content (Decision, Reason, Constraints, Ratification
condition) is preserved. The ratification condition section is updated to note
that all conditions were met as of vote.json (2026-03-13T21:55:00.000Z).

### Step 4 — Gate validation (for this motion, motion-0112)

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0112/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Expected: both EXIT 0.

### Step 5 — Confirm promotion

```bash
grep "^status:" .nexus/motions/motion-0037/decision.yaml
grep "^ratified_by:" .nexus/motions/motion-0037/decision.yaml
```

Expected:
- `status: RATIFIED`
- `ratified_by: "manual:proposer"`

## Evidence checklist

- [ ] decision.yaml status: RATIFIED ✓
- [ ] decision.yaml ratified_by: manual:proposer ✓
- [ ] decision.yaml notes: RATIFIED text ✓
- [ ] decision.md status section added ✓
- [ ] vote.json unchanged, outcome still PASS ✓
- [ ] verify.json unchanged, all_required_ok still true ✓
- [ ] policy.yaml unchanged, required_ok still true ✓
- [ ] validate_motion EXIT 0 ✓
- [ ] validate_agency EXIT 0 ✓
- [ ] No other motions edited ✓

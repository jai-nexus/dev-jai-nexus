# Execution: Close motion-0083 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0113
**Role:** LIBRARIAN
**Date:** 2026-04-01

## Scope

Files created (this motion package):

```
.nexus/motions/motion-0113/motion.yaml
.nexus/motions/motion-0113/proposal.md
.nexus/motions/motion-0113/challenge.md
.nexus/motions/motion-0113/execution.md
.nexus/motions/motion-0113/decision.yaml
.nexus/motions/motion-0113/decision.md
```

Files to create/edit (motion-0083 only):

```
.nexus/motions/motion-0083/vote.json        (create)
.nexus/motions/motion-0083/verify.json      (create)
.nexus/motions/motion-0083/policy.yaml      (create)
.nexus/motions/motion-0083/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0083/decision.md      (edit: add status header)
```

Files NOT changed:
- motion-0083/motion.yaml — no changes
- motion-0083/proposal.md — no changes
- motion-0083/challenge.md — no changes
- motion-0083/execution.md — no changes
- Motions 0071–0082 — already RATIFIED, no changes
- motion-0092, motion-0094 — separate bounded motions, not touched here
- No scripts, runtime, UI, or DB changes

## Steps

### Step 1 — Confirm current anomaly state

```bash
# Confirm motion-0083 decision.yaml is still DRAFT
grep "^status:" .nexus/motions/motion-0083/decision.yaml

# Confirm vote.json, verify.json, policy.yaml are absent
ls .nexus/motions/motion-0083/
```

Expected:
- `status: DRAFT`
- No vote.json, verify.json, or policy.yaml in the listing

### Step 2 — Run gate validators against motion-0083

Run to capture actual results for verify.json:

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0083/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Record exit codes and timestamps. Family C motion.yaml (no protocol_version)
may emit warnings — record actual output. Exit code is what matters for `ok` field.

### Step 3 — Create vote.json for motion-0083

```json
{
  "version": "0.2",
  "motion_id": "motion-0083",
  "votes": [
    {
      "voter_id": "manual:proposer",
      "role": "proposer",
      "vote": "yes",
      "rationale": "motion-0083 executed a ratification sweep of 12 motions in the Q2 governed loop activation arc (motion-0071 through motion-0082). All 60 governance artifact files are committed in the repository. All 12 downstream motions show status: RATIFIED in their decision.yaml. The sweep was correct and complete. This vote closes the motion-0083 governance record."
    },
    {
      "voter_id": "manual:challenger",
      "role": "challenger",
      "vote": "yes",
      "rationale": "The downstream evidence is inspectable: 12 motions with RATIFIED decision.yaml, each with vote.json, verify.json, policy.yaml, and updated decision.md. The sweep stayed within its declared scope — no application code was changed. The only gap was the absence of ratification artifacts for motion-0083 itself, which this closure corrects."
    },
    {
      "voter_id": "manual:arbiter",
      "role": "arbiter",
      "vote": "yes",
      "rationale": "The Q2 governed loop activation arc is verifiably closed. packet 880 / motion-0070 remains the canonical completed reference path. Ratifying motion-0083 completes the governance record for the sweep that established this closure. No downstream motion is re-opened or modified by this ratification."
    }
  ],
  "protocol_version": "0.3.8",
  "vote_mode": "unanimous_consent",
  "required_roles": ["proposer", "challenger", "arbiter"],
  "outcome": {
    "yes": 3,
    "no": 0,
    "abstain": 0,
    "yes_with_reservations": 0,
    "result": "PASS",
    "reasons": [],
    "missing_required_roles": []
  },
  "last_updated": "<execution-timestamp>"
}
```

### Step 4 — Create verify.json for motion-0083

Populate with the actual gate results from Step 2:

```json
{
  "version": "0.2",
  "motion_id": "motion-0083",
  "latest": {
    "validate_motion": {
      "gate": "validate_motion",
      "ok": true,
      "status": 0,
      "ts": "<execution-timestamp>",
      "command": "node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0083/motion.yaml",
      "cwd": ".",
      "required": true
    },
    "validate_agency": {
      "gate": "validate_agency",
      "ok": true,
      "status": 0,
      "ts": "<execution-timestamp>",
      "command": "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus",
      "cwd": ".",
      "required": true
    }
  },
  "summary": {
    "required_ok": true,
    "last_updated": "<execution-timestamp>"
  }
}
```

Note: if validate-motion emits warnings for the Family C motion.yaml schema,
record the actual exit code (0 = ok: true). Warnings do not change the ok field.

### Step 5 — Create policy.yaml for motion-0083

```yaml
protocol_version: "0.3.8"
motion_id: motion-0083
evaluated_at: "<execution-timestamp>"
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_voters: [proposer, challenger, arbiter]
risk_score: 0.05
max_risk_score: 0.20
required_gates: [validate_motion, validate_agency]
optional_gates: []
failed_required_gates: []
failed_optional_gates: []
required_ok: true
eligible_to_vote: true
recommended_vote: "yes"
blocking_reasons: []
warnings: []
```

risk_score: 0.05 — documentation/governance-closure artifact writes only;
no application code, no schema migration, no runtime changes.

### Step 6 — Edit decision.yaml for motion-0083

```yaml
# Before
status: DRAFT
ratified_by: null
notes: "DRAFT: ratification sweep implemented locally; 12 motions ratified."
last_updated: "2026-03-30T00:00:00.000Z"

# After
status: RATIFIED
ratified_by: "manual:proposer"
notes: "RATIFIED: bounded governed loop ratification sweep — 12 motions (0071–0082) closed, 60 governance artifacts committed."
last_updated: "<execution-timestamp>"
```

### Step 7 — Edit decision.md for motion-0083

Add `## Status: RATIFIED` at the top of the document body. Preserve all
existing content (Summary, Outcome, Evidence, Notes). Update the Notes
section to record that ratification was completed under motion-0113.

### Step 8 — Gate validation (for this motion, motion-0113)

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0113/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Expected: both EXIT 0.

### Step 9 — Confirm closure

```bash
grep "^status:" .nexus/motions/motion-0083/decision.yaml
grep "^ratified_by:" .nexus/motions/motion-0083/decision.yaml
ls .nexus/motions/motion-0083/
```

Expected:
- `status: RATIFIED`
- `ratified_by: "manual:proposer"`
- vote.json, verify.json, policy.yaml all present

## Evidence checklist

- [ ] motion-0083/vote.json created — outcome PASS, 3 yes / 0 no ✓
- [ ] motion-0083/verify.json created — all_required_ok: true ✓
- [ ] motion-0083/policy.yaml created — required_ok: true ✓
- [ ] motion-0083/decision.yaml: status RATIFIED ✓
- [ ] motion-0083/decision.yaml: ratified_by: manual:proposer ✓
- [ ] motion-0083/decision.md: status header added ✓
- [ ] motion-0083 now has full 9-artifact canonical set ✓
- [ ] No downstream motions (0071–0082) modified ✓
- [ ] motion-0092 and motion-0094 not touched ✓
- [ ] validate_motion EXIT 0 on motion-0113 ✓
- [ ] validate_agency EXIT 0 ✓

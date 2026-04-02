# Execution: Close motion-0092 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0114
**Role:** LIBRARIAN
**Date:** 2026-04-02

## Scope

Files created (this motion package):

```
.nexus/motions/motion-0114/motion.yaml
.nexus/motions/motion-0114/proposal.md
.nexus/motions/motion-0114/challenge.md
.nexus/motions/motion-0114/execution.md
.nexus/motions/motion-0114/decision.yaml
.nexus/motions/motion-0114/decision.md
```

Files to create/edit (motion-0092 only — at execution time):

```
.nexus/motions/motion-0092/vote.json        (create)
.nexus/motions/motion-0092/verify.json      (create)
.nexus/motions/motion-0092/policy.yaml      (create)
.nexus/motions/motion-0092/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0092/decision.md      (edit: add status header)
```

Files NOT changed:
- motion-0092/motion.yaml — no changes
- motion-0092/proposal.md — no changes
- motion-0092/challenge.md — no changes
- motion-0092/execution.md — no changes
- Motions 0084–0091 — already RATIFIED, no changes
- motion-0094 — separate bounded motion, not touched here
- No scripts, runtime, UI, or DB changes

## Steps

### Step 1 — Confirm current anomaly state

```bash
grep "^status:" .nexus/motions/motion-0092/decision.yaml
ls .nexus/motions/motion-0092/
```

Expected:
- `status: DRAFT`
- No vote.json, verify.json, or policy.yaml in the listing

### Step 2 — Run gate validators against motion-0092

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0092/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Record exit codes and timestamps. Populate verify.json with actual results.
Family C/D boundary motion.yaml may emit warnings — record actual output.
Exit code 0 = ok: true regardless of warnings.

### Step 3 — Create vote.json for motion-0092

```json
{
  "schema_version": "vote-0.2",
  "motion_id": "motion-0092",
  "vote_mode": "unanimous_consent",
  "votes": [
    {
      "role": "proposer",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "motion-0092 executed a ratification sweep of 8 motions in the Q3 bootstrap planning program (motion-0084 through motion-0091). All 40 governance artifact files are committed in the repository. All 8 downstream motions show status: RATIFIED in their decision.yaml. The sweep was correct and complete. This vote closes the motion-0092 governance record."
    },
    {
      "role": "challenger",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "The downstream evidence is inspectable: 8 motions with RATIFIED decision.yaml, each with vote.json, verify.json, policy.yaml, and updated decision.md. The sweep stayed within its declared scope — no application code was changed, no handoff/receipt artifacts created (correct for planning-only motions). The only gap was the absence of ratification artifacts for motion-0092 itself, which this closure corrects."
    },
    {
      "role": "arbiter",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "The motion-0084 bootstrap planning arc is verifiably closed. All 8 planning program motions have complete ratification artifact sets. Ratifying motion-0092 completes the governance record for the sweep that established this closure. No downstream motion is re-opened or modified by this ratification."
    }
  ],
  "outcome": "PASS",
  "resolved_at": "<execution-timestamp>"
}
```

### Step 4 — Create verify.json for motion-0092

Populate with actual gate results from Step 2:

```json
{
  "schema_version": "verify-0.2",
  "motion_id": "motion-0092",
  "evaluated_at": "<execution-timestamp>",
  "gates": [
    {
      "gate": "validate_motion",
      "ok": true,
      "detail": "node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0092/motion.yaml -> EXIT 0"
    },
    {
      "gate": "validate_agency",
      "ok": true,
      "detail": "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus -> EXIT 0"
    }
  ],
  "all_required_ok": true
}
```

### Step 5 — Create policy.yaml for motion-0092

```yaml
protocol_version: "0.3.8"
motion_id: motion-0092
evaluated_at: "<execution-timestamp>"
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_voters: [proposer, challenger, arbiter]
risk_score: 0.02
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

risk_score: 0.02 — documentation/governance-closure artifact writes only;
no application code, no schema migration, no runtime changes.

### Step 6 — Edit decision.yaml for motion-0092

```yaml
# Before
status: DRAFT
ratified_by: null
notes: "DRAFT: governance closure sweep for motion-0084 planning program. Ratifies motion-0085 through motion-0091 and motion-0084."
last_updated: "2026-03-30T06:40:00.000Z"

# After
status: RATIFIED
ratified_by: "unanimous_consent"
notes: "RATIFIED: bounded bootstrap planning ratification sweep — 8 motions (0084–0091) closed, 40 governance artifacts committed."
last_updated: "<execution-timestamp>"
```

### Step 7 — Edit decision.md for motion-0092

Add `## Status: RATIFIED` at the top of the document body (below the header block).
Preserve all existing content. Add a note that ratification was completed under motion-0114.

### Step 8 — Gate validation (for this motion, motion-0114)

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0114/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Expected: both EXIT 0.

### Step 9 — Confirm closure

```bash
grep "^status:" .nexus/motions/motion-0092/decision.yaml
grep "^ratified_by:" .nexus/motions/motion-0092/decision.yaml
ls .nexus/motions/motion-0092/
```

Expected:
- `status: RATIFIED`
- `ratified_by: "unanimous_consent"`
- vote.json, verify.json, policy.yaml all present

## Evidence checklist

- [ ] motion-0092/vote.json created — outcome PASS, 3 yes / 0 no
- [ ] motion-0092/verify.json created — all_required_ok: true
- [ ] motion-0092/policy.yaml created — required_ok: true
- [ ] motion-0092/decision.yaml: status RATIFIED
- [ ] motion-0092/decision.yaml: ratified_by: unanimous_consent
- [ ] motion-0092/decision.md: status header added
- [ ] motion-0092 now has full 9-artifact canonical set
- [ ] No downstream motions (0084–0091) modified
- [ ] motion-0094 not touched
- [ ] validate_motion EXIT 0 on motion-0114
- [ ] validate_agency EXIT 0

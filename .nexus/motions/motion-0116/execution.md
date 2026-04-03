# Execution: Close motion-0094 self-unratified sweep — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0116
**Role:** LIBRARIAN
**Date:** 2026-04-02

## Scope

Files created (this motion package):

```
.nexus/motions/motion-0116/motion.yaml
.nexus/motions/motion-0116/proposal.md
.nexus/motions/motion-0116/challenge.md
.nexus/motions/motion-0116/execution.md
.nexus/motions/motion-0116/decision.yaml
.nexus/motions/motion-0116/decision.md
```

Files to create/edit (motion-0094 only — at execution time):

```
.nexus/motions/motion-0094/vote.json        (create)
.nexus/motions/motion-0094/verify.json      (create)
.nexus/motions/motion-0094/policy.yaml      (create)
.nexus/motions/motion-0094/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0094/decision.md      (edit: add status header)
```

Files NOT changed:
- motion-0094/motion.yaml — no changes
- motion-0094/proposal.md — no changes
- motion-0094/challenge.md — no changes
- motion-0094/execution.md — no changes
- motion-0093 — already RATIFIED, no changes
- No scripts, runtime, UI, or DB changes

## Steps

### Step 1 — Confirm current anomaly state

```bash
grep "^status:" .nexus/motions/motion-0094/decision.yaml
ls .nexus/motions/motion-0094/
```

Expected:
- `status: DRAFT`
- No vote.json, verify.json, or policy.yaml in the listing

### Step 2 — Run gate validators against motion-0094

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0094/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Record exit codes and timestamps. Populate verify.json with actual results.
Family C motion.yaml may emit warnings — record actual output. Exit code 0 =
ok: true regardless of warnings.

### Step 3 — Create vote.json for motion-0094

```json
{
  "schema_version": "vote-0.2",
  "motion_id": "motion-0094",
  "vote_mode": "unanimous_consent",
  "votes": [
    {
      "role": "proposer",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "motion-0094 executed a governance closeout sweep for motion-0093 (OffBook.ai Wave 0 rollout). All 5 downstream governance artifacts are committed in the repository. motion-0093 shows status: RATIFIED in its decision.yaml. The sweep confirmed all 6 success criteria met, 12 Wave 0 substrate artifacts present, and bootstrap-manifest.instance.yaml correctly deferred. This vote closes the motion-0094 governance record."
    },
    {
      "role": "challenger",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "The downstream evidence is inspectable: motion-0093 has RATIFIED decision.yaml, vote.json, verify.json, policy.yaml, and updated decision.md. The sweep stayed within its declared scope — no rollout artifacts changed, no code changed beyond what was already committed. The challenge.md resolved the only objection (C-1 on bootstrap-manifest.instance.yaml) with an Accepted verdict. The only gap was the absence of ratification artifacts for motion-0094 itself, which this closure corrects."
    },
    {
      "role": "arbiter",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "The OffBook.ai Wave 0 rollout governance arc is verifiably closed. motion-0093 has a complete ratification artifact set. Ratifying motion-0094 completes the governance record for the sweep that established this closure. This is the third and final member of the self-unratified closure anomaly family identified by motion-0111. No downstream motion is re-opened or modified by this ratification."
    }
  ],
  "outcome": "PASS",
  "resolved_at": "<execution-timestamp>"
}
```

### Step 4 — Create verify.json for motion-0094

Populate with actual gate results from Step 2:

```json
{
  "schema_version": "verify-0.2",
  "motion_id": "motion-0094",
  "evaluated_at": "<execution-timestamp>",
  "gates": [
    {
      "gate": "validate_motion",
      "ok": true,
      "detail": "node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0094/motion.yaml -> EXIT 0"
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

### Step 5 — Create policy.yaml for motion-0094

```yaml
protocol_version: "0.3.8"
motion_id: motion-0094
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

### Step 6 — Edit decision.yaml for motion-0094

```yaml
# Before
status: DRAFT
ratified_by: null
notes: "DRAFT: OffBook.ai Wave 0 rollout closeout sweep. Ratifies motion-0093."
last_updated: "2026-03-30T00:00:00.000Z"

# After
status: RATIFIED
ratified_by: "unanimous_consent"
notes: "RATIFIED: OffBook.ai Wave 0 rollout closeout sweep — motion-0093 closed, 5 governance artifacts committed."
last_updated: "<execution-timestamp>"
```

### Step 7 — Edit decision.md for motion-0094

Add `## Status: RATIFIED` at the top of the document body (below the heading).
Preserve all existing content. Add a note that ratification was completed under
motion-0116.

### Step 8 — Gate validation (for this motion, motion-0116)

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0116/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Expected: both EXIT 0.

### Step 9 — Confirm closure

```bash
grep "^status:" .nexus/motions/motion-0094/decision.yaml
grep "^ratified_by:" .nexus/motions/motion-0094/decision.yaml
ls .nexus/motions/motion-0094/
```

Expected:
- `status: RATIFIED`
- `ratified_by: "unanimous_consent"`
- vote.json, verify.json, policy.yaml all present

## Evidence checklist

- [ ] motion-0094/vote.json created — outcome PASS, 3 yes / 0 no
- [ ] motion-0094/verify.json created — all_required_ok: true
- [ ] motion-0094/policy.yaml created — required_ok: true
- [ ] motion-0094/decision.yaml: status RATIFIED
- [ ] motion-0094/decision.yaml: ratified_by: unanimous_consent
- [ ] motion-0094/decision.md: status header added
- [ ] motion-0094 now has full 9-artifact canonical set
- [ ] motion-0093 not modified
- [ ] validate_motion EXIT 0 on motion-0116
- [ ] validate_agency EXIT 0
- [ ] Self-unratified closure anomaly family (0083, 0092, 0094) fully closed

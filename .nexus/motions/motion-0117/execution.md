# Execution: Close motion-0111 audit baseline — write ratification artifacts and promote decision.yaml to RATIFIED

**Motion:** motion-0117
**Role:** LIBRARIAN
**Date:** 2026-04-02

## Scope

Files created (this motion package):

```
.nexus/motions/motion-0117/motion.yaml
.nexus/motions/motion-0117/proposal.md
.nexus/motions/motion-0117/challenge.md
.nexus/motions/motion-0117/execution.md
.nexus/motions/motion-0117/decision.yaml
.nexus/motions/motion-0117/decision.md
```

Files to create/edit (motion-0111 only — at execution time):

```
.nexus/motions/motion-0111/vote.json        (create)
.nexus/motions/motion-0111/verify.json      (create)
.nexus/motions/motion-0111/policy.yaml      (create)
.nexus/motions/motion-0111/decision.yaml    (edit: RATIFIED promotion)
.nexus/motions/motion-0111/decision.md      (edit: add status header)
```

Files NOT changed:
- motion-0111/motion.yaml — no changes
- motion-0111/proposal.md — no changes
- motion-0111/challenge.md — no changes
- motion-0111/execution.md — no changes
- `.nexus/docs/motion-corpus-audit.md` — the canonical audit artifact; not edited
- All repair motions (0112–0114, 0116) — already RATIFIED, not touched
- No scripts, runtime, UI, or DB changes

## Steps

### Step 1 — Confirm current anomaly state

```bash
grep "^status:" .nexus/motions/motion-0111/decision.yaml
ls .nexus/motions/motion-0111/
```

Expected:
- `status: DRAFT`
- No vote.json, verify.json, or policy.yaml in the listing

### Step 2 — Read challenge.md for motion-0111

Confirm no blocking challenge exists before proceeding.

### Step 3 — Run gate validators against motion-0111

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0111/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Record exit codes and timestamps for verify.json.

### Step 4 — Create vote.json for motion-0111

```json
{
  "schema_version": "vote-0.2",
  "motion_id": "motion-0111",
  "vote_mode": "unanimous_consent",
  "votes": [
    {
      "role": "proposer",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "motion-0111 produced the canonical motion corpus audit document covering 110 motions (0001–0110), classifying 4 schema families, identifying 4 truly open motions, stating the status-source rule, and publishing the normalization action registry. The audit document is committed and inspectable. All four normalization targets it identified have since been resolved: motion-0037 by motion-0112, motion-0083 by motion-0113, motion-0092 by motion-0114, motion-0094 by motion-0116. The audit findings were accurate and the action registry was complete. This vote closes the motion-0111 governance record."
    },
    {
      "role": "challenger",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "The audit document is present and accurate as a 2026-03-31 point-in-time baseline. No downstream motion disputed its classifications or action registry. All four P1/P2 anomalies it identified have been independently confirmed and repaired with inspectable evidence. The audit established the status-source rule (decision.yaml over motion.yaml) which was correctly applied across all subsequent normalization work. No blocking challenge identified."
    },
    {
      "role": "arbiter",
      "vote": "yes",
      "cast_at": "<execution-timestamp>",
      "rationale": "motion-0111 is the governance baseline that enabled the entire Q2 normalization arc. Its findings were sound, its action registry was complete, and the downstream repair motions validated every identified anomaly. Ratifying motion-0111 closes the final governance gap in this arc and brings the repo to a clean pause baseline. All normalization targets are closed; the audit itself is now ratified."
    }
  ],
  "outcome": {
    "yes": 3,
    "no": 0,
    "abstain": 0,
    "yes_with_reservations": 0,
    "result": "PASS",
    "reasons": [],
    "missing_required_roles": []
  },
  "resolved_at": "<execution-timestamp>"
}
```

### Step 5 — Create verify.json for motion-0111

Populate with actual gate results from Step 3:

```json
{
  "schema_version": "verify-0.2",
  "motion_id": "motion-0111",
  "evaluated_at": "<execution-timestamp>",
  "gates": [
    {
      "gate": "validate_motion",
      "ok": true,
      "detail": "node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0111/motion.yaml -> EXIT 0"
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

### Step 6 — Create policy.yaml for motion-0111

```yaml
protocol_version: "0.3.8"
motion_id: motion-0111
evaluated_at: "<execution-timestamp>"
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_voters: [proposer, challenger, arbiter]
risk_score: 0.01
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

risk_score: 0.01 — read-only audit document already committed; closing
artifacts only; no application code, no schema migration, no runtime changes.

### Step 7 — Edit decision.yaml for motion-0111

```yaml
# Before
status: DRAFT
ratified_by: null
notes: "DRAFT: motion corpus audit — 110 motions (0001–0110), 4 schema families, 4 open motions, canonical forward contract."
last_updated: "2026-03-31T22:00:00.000Z"

# After
status: RATIFIED
ratified_by: "unanimous_consent"
notes: "RATIFIED: motion corpus audit — 110 motions classified, 4 schema families, normalization action registry (P1/P2) fully resolved by motions 0112–0114 and 0116."
last_updated: "<execution-timestamp>"
```

### Step 8 — Edit decision.md for motion-0111

Add `## Status: RATIFIED` at the top of the document body (below the header
block). Preserve all existing content. Add a ratification note recording that
all four normalization targets from the action registry have been resolved and
that ratification was completed under motion-0117.

### Step 9 — Gate validation (for this motion, motion-0117)

```bash
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0117/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

Expected: both EXIT 0.

### Step 10 — Confirm closure

```bash
grep "^status:" .nexus/motions/motion-0111/decision.yaml
grep "^ratified_by:" .nexus/motions/motion-0111/decision.yaml
ls .nexus/motions/motion-0111/
```

Expected:
- `status: RATIFIED`
- `ratified_by: "unanimous_consent"`
- vote.json, verify.json, policy.yaml all present

## Evidence checklist

- [ ] motion-0111/vote.json created — outcome PASS, 3 yes / 0 no
- [ ] motion-0111/verify.json created — all_required_ok: true
- [ ] motion-0111/policy.yaml created — required_ok: true
- [ ] motion-0111/decision.yaml: status RATIFIED
- [ ] motion-0111/decision.yaml: ratified_by: unanimous_consent
- [ ] motion-0111/decision.md: status header added
- [ ] motion-0111 now has full 9-artifact canonical set
- [ ] `.nexus/docs/motion-corpus-audit.md` not modified
- [ ] No repair motions (0112–0114, 0116) modified
- [ ] validate_motion EXIT 0 on motion-0117
- [ ] validate_agency EXIT 0
- [ ] Repo at clean pause baseline: all P1/P2 targets closed, audit ratified

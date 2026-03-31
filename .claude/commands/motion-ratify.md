# motion-ratify — Governed Motion Ratification Sweep

Perform a complete ratification sweep for the motion specified in: `$ARGUMENTS`

You are operating as **LIBRARIAN** role inside dev-jai-nexus governance.

---

## Important distinction

This is **not** model fine-tuning. This skill provides a repo-scoped prompt that
guides Claude through the ratification workflow using the exact artifact set,
schema versions, and gate commands established by this repo's governance program.

---

## Steps

### 1 — Parse the motion ID

Extract the motion ID from `$ARGUMENTS` (e.g. `motion-0099`).
If none provided, look for the most recent DRAFT motion in `.nexus/motions/`.

### 2 — Read the motion package

Read all of these files before doing anything else:

- `.nexus/motions/{motionId}/motion.yaml`
- `.nexus/motions/{motionId}/decision.yaml`
- `.nexus/motions/{motionId}/execution.md`
- `.nexus/motions/{motionId}/challenge.md`

### 3 — Confirm ratifiability

Verify all of the following before creating any artifacts:

- `decision.yaml status` is `DRAFT` (if already RATIFIED, stop and report — do not re-ratify)
- `challenge.md` verdict contains no unresolved blocking objections
- `execution.md` evidence section is present and complete
- No pending runtime mutations remain undone per execution.md

If any check fails, stop and report the specific failure. Do not proceed.

### 4 — Run required gate validation

Run both gates. Both must exit 0. If either fails, stop and report before
creating any artifacts.

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/{motionId}/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
```

### 5 — Determine risk score

Use the motion kind to pick the appropriate risk score:

| Motion kind | Risk score |
|---|---|
| documentation / planning | 0.03 |
| governance-closure / assessment | 0.05 |
| staged-activation / builder-proof / verifier-proof | 0.05 |
| generator-extension / code change (isolated) | 0.10 |
| runtime / dispatch changes | 0.15 |

### 6 — Create the three ratification artifacts

Use the ISO 8601 timestamp for `evaluated_at`. Use base+5s / +10s for vote cast times.

**`.nexus/motions/{motionId}/vote.json`**
```json
{
  "schema_version": "vote-0.2",
  "motion_id": "{motionId}",
  "vote_mode": "unanimous_consent",
  "votes": [
    { "role": "proposer",   "vote": "yes", "cast_at": "{ts}" },
    { "role": "challenger", "vote": "yes", "cast_at": "{ts+5s}" },
    { "role": "arbiter",    "vote": "yes", "cast_at": "{ts+10s}" }
  ],
  "outcome": "PASS",
  "resolved_at": "{ts+10s}"
}
```

**`.nexus/motions/{motionId}/verify.json`**
```json
{
  "schema_version": "verify-0.2",
  "motion_id": "{motionId}",
  "evaluated_at": "{ts}",
  "gates": [
    {
      "gate": "validate_motion",
      "ok": true,
      "detail": "node portal/scripts/validate-motion.mjs --motion .nexus/motions/{motionId}/motion.yaml → EXIT 0"
    },
    {
      "gate": "validate_agency",
      "ok": true,
      "detail": "node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus → EXIT 0"
    }
  ],
  "all_required_ok": true
}
```

**`.nexus/motions/{motionId}/policy.yaml`**
```yaml
protocol_version: "0.3.8"
motion_id: {motionId}
evaluated_at: "{ts}"
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_voters: [proposer, challenger, arbiter]
risk_score: {see Step 5}
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

### 7 — Update decision artifacts

**`decision.yaml`**: Read the file first, then update:
- `status`: `DRAFT` → `RATIFIED`
- `ratified_by`: `manual:proposer`
- `last_updated`: current ISO timestamp
- `notes`: replace DRAFT note with a brief ratification summary

**`decision.md`**: Read the file first, then update the `## Status` section:
- `DRAFT` → `RATIFIED`

### 8 — Report evidence

Print a summary of:
- All 5 artifacts created/updated (vote.json, verify.json, policy.yaml, decision.yaml, decision.md)
- Gate results (both EXIT 0)
- No blocking objections
- Final decision.yaml status

---

## Hard constraints

- **Do NOT** ratify if challenge.md has unresolved blocking objections.
- **Do NOT** ratify if either gate exits non-zero.
- **Do NOT** set `motion.yaml status` to RATIFIED — it stays `proposed` by convention.
- **Do NOT** create `execution.handoff.json` for planning/documentation/governance motions.
- **Do NOT** commit unless explicitly asked.
- **Do NOT** create these artifacts if the motion is already RATIFIED.

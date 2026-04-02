# Motion Corpus Audit — dev-jai-nexus

**Established:** motion-0111
**Audit date:** 2026-03-31
**Branch:** sprint/q2-motion-normalization-audit
**Head commit at audit:** 5afacb1
**Corpus size:** 110 motions (motion-0001 through motion-0110)

> **Note on corpus range:** motions 0001–0108 are present on this branch.
> motions 0109 and 0110 exist on `sprint/q2-context-workflow-hardening` (not yet
> merged). Their decision.yaml files were read from git history at commits
> d744582 (motion-0109) and fa2be2a (motion-0110) to ensure this audit covers
> the full current program corpus.

---

## 1. Methodology

All classifications are derived from actual artifact reads on the branch at
audit time. No family boundary is assumed. Survey commands used:

```bash
# motion.yaml protocol_version presence
grep "^protocol_version:" .nexus/motions/*/motion.yaml

# motion.yaml status field presence
grep "^status:" .nexus/motions/*/motion.yaml

# decision.yaml protocol_version (sub-family detection)
grep "^protocol_version:" .nexus/motions/*/decision.yaml

# decision.yaml status (open motion detection)
grep "^status:" .nexus/motions/*/decision.yaml

# artifact presence check
ls .nexus/motions/*/vote.json .nexus/motions/*/verify.json
ls .nexus/motions/*/policy.yaml .nexus/motions/*/decision.md
ls .nexus/motions/*/trace.json
```

---

## 2. Status-source rule

**`decision.yaml` is the authoritative governance status for every motion.**

`motion.yaml` always contains `status: proposed` regardless of ratification state.
This field declares the motion's *intent* when submitted — it is not updated after
ratification. All motions across all schema families (including all RATIFIED motions)
will show `status: proposed` in motion.yaml.

The governance-open determination in this audit is derived exclusively from
`decision.yaml status`:
- `status: RATIFIED` → governance-closed
- `status: DRAFT` → governance-open (requires investigation of why)

A motion with `motion.yaml status: proposed` and `decision.yaml status: RATIFIED`
is **ratified**. `motion.yaml status: proposed` alone does not indicate an open motion.

---

## 3. Schema families

### Family A — Pilot (motion-0001)

| Criterion | Value |
|---|---|
| motion.yaml schema | v0.1: uses `scope`, `roles_required`, `checks_required`, `artifacts` map |
| motion.yaml status field | absent |
| motion.yaml protocol_version | absent |
| decision.yaml schema | v0.1: `version: 0.1`, `outcome: ratified_human` |
| decision.yaml protocol_version | absent |
| Artifact set | motion.yaml, proposal.md, challenge.md, execution.md, decision.yaml, verify.json, trace.json |
| Missing vs. modern | vote.json, policy.yaml, decision.md |
| Governance status | Complete by own schema (ratified_human) |

**Classification: Legacy special case. Different protocol, not a gap. No action needed.**

---

### Family B — Legacy (motion-0002 through motion-0024)

| Criterion | Value |
|---|---|
| motion.yaml schema | Pre-status: no `protocol_version`, no `status` field |
| decision.yaml schema | 0002: no protocol_version; 0003–0008: `protocol_version: "0.3.7"`; 0009–0024: `protocol_version: "0.3.8"` |
| Artifact set | motion.yaml, proposal.md, challenge.md, execution.md, decision.yaml, vote.json, verify.json, policy.yaml |
| Missing vs. modern | decision.md |
| Governance status | All RATIFIED |

Sub-families within B:
- **B1** (0002): no protocol_version in decision.yaml, auto-ratified by council-run
- **B2** (0003–0008): `protocol_version: "0.3.7"` in decision.yaml
- **B3** (0009–0024): `protocol_version: "0.3.8"` in decision.yaml

**Classification: Pre-decision.md era. Artifact-complete by their schema era.
Missing decision.md is a known era artifact, not a governance gap.
Low-priority normalization only.**

---

### Family C — Transitional (motion-0025 through motion-0097, excluding open motions)

| Criterion | Value |
|---|---|
| motion.yaml schema | Has `status: proposed` (from ~0031); still NO `protocol_version` |
| decision.yaml schema | `protocol_version: "0.3.8"`, full RATIFIED |
| Artifact set | All 9: motion.yaml, proposal.md, challenge.md, execution.md, decision.yaml, vote.json, verify.json, policy.yaml, decision.md |
| Missing vs. modern | motion.yaml lacks `protocol_version`, `kind`, `program`, `target` as top-level structured fields; `proposer_nh_id`/`council_nh_id` absent |
| Governance status | RATIFIED (excluding 0037, 0083, 0092, 0094 — see open motion register) |

Sub-boundary within C:
- **C1** (0025–0030): no `status` field in motion.yaml
- **C2** (0031–0097): has `status: proposed` in motion.yaml

**Classification: Transitional era. Governance-complete. motion.yaml predates the
modern protocol_version and kind fields. Schema normalization is low-priority —
these are ratified historical records.**

---

### Family D — Modern canonical (motion-0098 through motion-0110)

| Criterion | Value |
|---|---|
| motion.yaml schema | `protocol_version: "0.3.8"` + `status: proposed` + `kind` + `target` (domain + repo) + `required_gates` array |
| decision.yaml schema | `protocol_version: "0.3.8"`, `status: RATIFIED`, `ratified_by`, `target_domain`, `target_repo`, `vote_mode`, `required_gates`, `last_updated`, `notes` |
| Artifact set | All 9: motion.yaml, proposal.md, challenge.md, execution.md, decision.yaml, vote.json, verify.json, policy.yaml, decision.md |
| Governance status | All RATIFIED |

**Classification: Canonical. No action needed. This is the forward contract.**

---

## 4. Artifact completeness by family

| Family | Range | vote.json | verify.json | policy.yaml | decision.md | trace.json |
|---|---|---|---|---|---|---|
| A | 0001 | ✗ | ✓ | ✗ | ✗ | ✓ |
| B | 0002–0024 | ✓ | ✓ | ✓ | ✗ | 0002 only |
| C | 0025–0097† | ✓ | ✓ | ✓ | ✓ | 0046 only |
| D | 0098–0110 | ✓ | ✓ | ✓ | ✓ | ✗ |

† Excluding open motions 0037, 0083, 0092, 0094. motion-0046 has a legacy
trace.json from council-run era; it is not part of the modern artifact set.

---

## 5. Open motion register

These four motions have `decision.yaml status: DRAFT` and represent genuine
governance-open state, not just schema evolution artifacts.

### motion-0037

| Field | Value |
|---|---|
| Title | Claude Bootstrap Generator v0 |
| Anomaly type | **Stale draft promotion** |
| decision.yaml status | DRAFT, notes: "PENDING: awaiting vote" |
| vote.json | Present — outcome: PASS, unanimous (3 yes, 0 no) |
| verify.json | Present |
| policy.yaml | Present |
| Root cause | vote.json was written with a passing vote; decision.yaml was never updated from DRAFT to RATIFIED |
| Remediation | Update decision.yaml to RATIFIED; no other artifacts needed |
| Priority | High — vote already passed; this is a one-file closure |

### motion-0083

| Field | Value |
|---|---|
| Title | Bounded governed loop ratification sweep |
| Anomaly type | **Self-unratified governance closure** |
| decision.yaml status | DRAFT, notes: "ratification sweep implemented locally; 12 motions ratified" |
| vote.json | Absent |
| verify.json | Absent |
| policy.yaml | Absent |
| Root cause | This motion closed other motions but was never itself ratified (no vote.json/verify.json/policy.yaml written) |
| Remediation | Requires a new governance-closure motion OR direct ratification artifacts written under a separate bounded motion |
| Priority | Medium — governance-open but its effects (closing other motions) are already reflected in the corpus |

### motion-0092

| Field | Value |
|---|---|
| Title | Bounded Bootstrap Planning Ratification Sweep |
| Anomaly type | **Self-unratified governance closure** |
| decision.yaml status | DRAFT, notes: closes motions 0084–0091 and 0084 |
| vote.json | Absent |
| verify.json | Absent |
| policy.yaml | Absent |
| Root cause | Same pattern as motion-0083 |
| Priority | Medium |

### motion-0094

| Field | Value |
|---|---|
| Title | Bounded OffBook.ai Wave 0 Rollout Closeout Sweep |
| Anomaly type | **Self-unratified governance closure** |
| decision.yaml status | DRAFT, notes: "Ratifies motion-0093" |
| vote.json | Absent |
| verify.json | Absent |
| policy.yaml | Absent |
| Root cause | Same pattern as motion-0083 |
| Priority | Medium |

---

## 6. Canonical forward contract

A fully normalized motion package (Family D, motion-0098+) contains:

### motion.yaml (required fields)

```yaml
protocol_version: "0.3.8"
motion_id: motion-XXXX
kind: <see known kinds below>
status: proposed           # always "proposed" — decision.yaml carries current status
title: "<descriptive title>"
program: <program name>
proposer_nh_id: "<nh_id>"
council_nh_id: "<nh_id>"
target:
  repo: dev-jai-nexus
  domain: dev.jai.nexus
required_gates: [validate_motion, validate_agency]
created_at: "<iso8601>"
```

Known kinds (from `/motion-create` skill):
`documentation`, `governance-closure`, `post-proof-assessment`, `builder-proof`,
`verifier-proof`, `operator-closeout`, `staged-activation-proof`,
`codex-conditioning`, `codex-exec-policy`, `bootstrap-manifest`

### decision.yaml (DRAFT state)

```yaml
protocol_version: "0.3.8"
motion_id: motion-XXXX
status: DRAFT
ratified_by: null
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_gates: [validate_motion, validate_agency]
last_updated: "<iso8601>"
notes: "DRAFT: <one-line summary>"
```

### decision.yaml (RATIFIED state)

```yaml
protocol_version: "0.3.8"
motion_id: motion-XXXX
status: RATIFIED
ratified_by: manual:proposer
target_domain: "dev.jai.nexus"
target_repo: "dev-jai-nexus"
vote_mode: "unanimous_consent"
required_gates: [validate_motion, validate_agency]
last_updated: "<iso8601>"
notes: "RATIFIED: <one-line summary>"
```

### Full canonical artifact set (9 files)

```
motion.yaml
proposal.md
challenge.md
execution.md
decision.yaml
vote.json          (version: "0.2", unanimous_consent, 3 voters)
verify.json        (version: "0.2", gates array, all_required_ok: true)
policy.yaml        (protocol_version: "0.3.8", risk_score: <float>)
decision.md        (## Status: RATIFIED, ## Summary)
```

---

## 7. Normalization action registry

Actions are ordered by governance impact (highest first), not by volume.

### P1 — Close motion-0037 (stale draft promotion)

- **What:** Update `decision.yaml` status from DRAFT to RATIFIED
- **Why:** Vote passed unanimously; this is a one-file fix
- **Risk:** Very low — all ratification artifacts already exist and pass
- **Scope:** 1 file in 1 motion
- **Suggested motion kind:** `governance-closure`

### P2 — Close motions 0083, 0092, 0094 (self-unratified governance closures)

- **What:** Write vote.json, verify.json, policy.yaml; update decision.yaml to RATIFIED
- **Why:** These motions are governance-open; their effects on other motions are valid but their own records are incomplete
- **Risk:** Low — their downstream effects are already in the corpus
- **Scope:** 3 files × 3 motions = 9 files
- **Suggested motion kind:** `governance-closure`
- **Can be one sweep motion or three individual motions**

### P3 — Backfill decision.md for Family B (0002–0024)

- **What:** Add `decision.md` to each motion in the 0002–0024 range
- **Why:** These motions pre-date decision.md; adding it makes them consistent
- **Risk:** Very low — documentation-only addition, does not change ratification status
- **Scope:** 23 files (one per motion)
- **Suggested motion kind:** `documentation`
- **Note:** Lower priority — these motions are complete by their era's standard

### P4 — Add `protocol_version` to motion.yaml for Family C (0025–0097)

- **What:** Add `protocol_version: "0.3.8"` to motion.yaml for Family C motions
- **Why:** Consistency with canonical contract; enables `validate-motion.mjs` to
  treat all motions uniformly
- **Risk:** Very low — additive only, does not change ratification status
- **Scope:** 73 files
- **Suggested approach:** A single normalization script, not 73 individual commits
- **Priority:** Lowest — these are historical records, not active work

### Not recommended

- Retroactively adding `kind`, `program`, `proposer_nh_id` to Family C motions:
  these values are not derivable from existing artifacts without re-interpreting
  historical intent. Skip.
- Re-running validate-motion.mjs against Family A or B: the schema is intentionally
  permissive; old format motions will pass or emit only warnings. No action needed.

---

## 8. Summary table

| Motion range | Family | Status source | Truly open | Schema action needed |
|---|---|---|---|---|
| 0001 | A (Pilot) | `outcome: ratified_human` | No | None |
| 0002–0024 | B (Legacy) | `decision.yaml status: RATIFIED` | No | Low: add decision.md (P3) |
| 0025–0097† | C (Transitional) | `decision.yaml status: RATIFIED` | No | Low: add protocol_version to motion.yaml (P4) |
| 0037 | C (anomaly) | `decision.yaml status: DRAFT` | **Yes** | P1: promote decision.yaml to RATIFIED |
| 0083, 0092, 0094 | C (anomaly) | `decision.yaml status: DRAFT` | **Yes** | P2: write ratification artifacts |
| 0098–0110 | D (Modern) | `decision.yaml status: RATIFIED` | No | None |

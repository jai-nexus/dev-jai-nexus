# Execution: Codex Conditioning Expansion — run-proof-lane skill

**Motion:** motion-0104
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Conditioning artifacts only. No runtime changes. No portal/ code changes.

Files created:

```
.claude/commands/run-proof-lane.md              (created — primary deliverable)
.nexus/codex/evals/run-proof-lane-eval.yaml     (created — eval fixture)
.nexus/codex/README.md                          (updated — inventory)
.nexus/motions/motion-0104/                     (6 files — this motion package)
```

## Steps

### Step 1 — Repo state inspection

Branch: `sprint/q2-codex-execution-pivot`. Clean from main.

Confirmed pre-existing scripts (no new scripts needed):

| Stage | Enqueue script | Run script | Guard |
|---|---|---|---|
| ARCHITECT | `enqueue-motion-packet.mjs` | `run-architect-once.ts` | `route:ARCHITECT`, RATIFIED |
| BUILDER | `enqueue-builder-packet.mjs` | `run-builder-once.ts` | `route:BUILDER`, RATIFIED |
| VERIFIER | `enqueue-verifier-packet.mjs` | `run-verifier-once.ts` | `route:VERIFIER`, RATIFIED |

Pattern proven across motions 0098 (builder), 0100 (verifier), and 0096 (architect).
OPERATOR_REVIEW excluded: human gate by design.

### Step 2 — Draft run-proof-lane.md

Primary deliverable. Sections:
- Stage reference table (3 rows: ARCHITECT, BUILDER, VERIFIER)
- Pre-flight: governance state check + route check via bounded script
- Enqueue + run-once execution with exit-code gates
- Post-run verification via second bounded script
- Structured evidence block format
- Hard constraints (OPERATOR_REVIEW refusal is load-bearing)

### Step 3 — Draft run-proof-lane-eval.yaml

Eval fixture covering:
- 3 valid stage cases (ARCHITECT→BUILDER, BUILDER→VERIFIER, VERIFIER→OPERATOR_REVIEW)
- 5 refusal cases (OPERATOR_REVIEW, DRAFT motion, wrong stage, enqueue failure, unknown stage)
- Cleanup requirements (_proof-preflight.mjs and _proof-postcheck.mjs must be deleted)
- 8 acceptance criteria

### Step 4 — Update README

Moved `/run-proof-lane` from extension points into the skills table.
Updated eval fixtures table with new fixture.
Pruned extension points to remaining deferred items.

### Step 5 — Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0104/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `run-proof-lane.md`: stage table, pre-flight, enqueue gate, run-once gate, post-check, evidence block ✓
- `run-proof-lane-eval.yaml`: 3 valid cases, 5 refusal cases, 2 cleanup requirements, 8 AC ✓
- README: skills table updated, eval fixtures table updated, extension points pruned ✓
- validate_motion (0104): EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- No portal/ changes, no runtime mutations ✓

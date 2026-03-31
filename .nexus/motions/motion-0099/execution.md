# Execution: Codex Repo Conditioning — motion-ratify and motion-status skills

**Motion:** motion-0099
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Governance and configuration artifacts only. No runtime changes. No portal/
code changes.

Files created:

```
.claude/commands/motion-ratify.md      (created)
.claude/commands/motion-status.md      (created)
.nexus/codex/README.md                 (created)
.nexus/codex/evals/motion-ratify-eval.yaml  (created)
.nexus/motions/motion-0099/            (6 files — this motion package)
```

## Steps

### Step 1 — Repo state inspection

Branch: `q2/codex-repo-conditioning`. Clean from main.

No existing `.claude/` directory in repo root. No existing `.nexus/codex/`.
No existing Codex/MCP configuration. Clean start confirmed.

Next motion: motion-0099 (confirmed via existing motion-0098 directory).

### Step 2 — Identify conditioning targets

Three candidate workflows:
1. Motion ratification sweep — most repetitive, most precisely specified
2. Activation lane analysis — useful at every handoff stage
3. Passalong generation — useful but patterns not yet stable enough

Decision: implement motions 1 and 2. Skip passalong (C-2 resolution: not stable
enough for one canonical form).

### Step 3 — Create `.claude/commands/motion-ratify.md`

Skill content:
- Role: LIBRARIAN
- 8-step workflow with hard constraints
- Embeds vote-0.2, verify-0.2, policy.yaml schemas
- Risk score guidance table (5 motion kinds)
- Explicit DRAFT → RATIFIED update steps for decision.yaml and decision.md
- Hard constraints: no re-ratify, no gate-fail ratify, no handoff.json for governance motions

### Step 4 — Create `.claude/commands/motion-status.md`

Skill content:
- Role: OPERATOR/LIBRARIAN
- Read-only status check
- Bounded DB check script pattern (write, run, delete)
- 5-row lane-state → next-action reference table
- Hard constraint: no `--create` during status check, no enqueue/run unless asked

### Step 5 — Create `.nexus/codex/README.md`

Explains: conditioning vs fine-tuning, current skill inventory, eval fixture
inventory, extension points.

### Step 6 — Create `.nexus/codex/evals/motion-ratify-eval.yaml`

Eval fixture:
- eval_id: motion-ratify-eval-001
- Reference: motion-0093 (canonical first real rollout, known-correct artifacts)
- 5 expected artifact assertions (vote.json, verify.json, policy.yaml, decision.yaml, decision.md)
- 3 forbidden artifacts (no handoff.json)
- 3 negative test cases (already ratified, gate failure, blocking objection)
- 8 acceptance criteria (AC-1 through AC-8)

### Step 7 — Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0099/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `.claude/commands/motion-ratify.md`: 8-step ratification workflow ✓
- `.claude/commands/motion-status.md`: read-only lane analysis with 5-row reference table ✓
- `.nexus/codex/README.md`: conditioning vs fine-tuning explained ✓
- `.nexus/codex/evals/motion-ratify-eval.yaml`: 8 AC, 3 negative cases ✓
- validate_motion (0099): EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- No runtime changes, no portal/ changes ✓

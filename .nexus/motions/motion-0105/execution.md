# Execution: Codex Conditioning Expansion — motion-create eval coverage

**Motion:** motion-0105
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Conditioning artifacts only. No runtime changes. No portal/ code changes.
No changes to the `/motion-create` skill prompt itself.

Files created:

```
.nexus/codex/evals/motion-create-eval.yaml     (created — primary deliverable)
.nexus/codex/README.md                         (updated — eval moved into inventory)
.nexus/motions/motion-0105/                    (6 files — this motion package)
```

## Steps

### Step 1 — Repo state inspection

Branch: `sprint/q2-codex-capability-wave-2`. Clean from main (6a44539).

Confirmed:
- Last motion: motion-0104 (RATIFIED)
- `/motion-create` skill: `.claude/commands/motion-create.md` exists, no eval coverage
- Existing eval fixtures: motion-ratify-eval.yaml, motion-status-eval.yaml, run-proof-lane-eval.yaml
- README extension points listed `evals/motion-create-eval.yaml` as deferred
- Next motion number: 0105

### Step 2 — Draft motion-create-eval.yaml

Primary deliverable. Sections:

- Reference motion: motion-0104 (structural reference for correct scaffold shape)
- 5 test cases:
  - happy path (known kind, file count, correct directory name)
  - motion.yaml schema (protocol_version, kind, status: proposed, parent_motion commented)
  - decision.yaml schema (DRAFT, null ratified_by)
  - decision.md status (## Status section = DRAFT)
  - validate-motion runs after scaffold (must exit 0; validate-agency NOT run)
  - number selection with gap (max + 1, not gap-filling)
- 4 refusal cases:
  - unknown kind → no files created
  - empty title → stop and ask
  - no arguments → stop and report usage
  - ambiguous kind token → stop and report
- Forbidden artifacts: vote.json, verify.json, policy.yaml, resolved parent_motion
- Known kinds table (10 items — matches skill prompt exactly)
- 9 acceptance criteria

### Step 3 — Update README

Moved `evals/motion-create-eval.yaml` from extension points into the eval
fixtures table. Extension points section now contains only passalong and MCP.

### Step 4 — Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0105/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `motion-create-eval.yaml`: 5 test cases, 4 refusal cases, 9 AC, known-kinds table ✓
- README: eval moved from extension points to fixtures table ✓
- validate_motion (0105): EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- No portal/ changes, no runtime mutations ✓
- No changes to motion-create skill prompt ✓

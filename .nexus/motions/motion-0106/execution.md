# Execution: Codex Conditioning Expansion — passalong canonicalization and /motion-passalong skill

**Motion:** motion-0106
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Conditioning artifacts only. No runtime changes. No portal/ code changes.
No changes to existing skills or generators.

Files created:

```
.nexus/codex/passalong-schema.md                    (created — canonical schema)
.claude/commands/motion-passalong.md                (created — skill prompt)
.nexus/codex/evals/motion-passalong-eval.yaml       (created — eval fixture)
.nexus/codex/README.md                              (updated — inventory)
.nexus/motions/motion-0106/                         (6 files — this motion package)
```

## Steps

### Step 1 — Repo state inspection

Branch: `sprint/q2-codex-capability-wave-2`. Clean from main (d8c4865).

Confirmed:
- Last motion: motion-0105 (RATIFIED)
- `/motion-passalong` was in README extension points as deferred since motion-0099
- Context bundle generators exist: `generate-context-bundle.mjs` + 3 sub-scripts
- No existing passalong schema or skill
- Next motion number: 0106

### Step 2 — Draft passalong-schema.md

Canonical schema document. Defines:
- What a passalong is vs. context bundle vs. status report
- Two target types: `orchestrator` (program arc) and `dev` (bounded task)
- Required sections per type
- Document templates for both types (Markdown with YAML frontmatter)
- Output convention: stdout + save path recommendation
- Six hard constraints (no status fabrication, no invented directions, etc.)

### Step 3 — Draft motion-passalong.md skill

Skill prompt. Steps:
- Parse and validate target + motionId
- Read governance state from decision.yaml (exact status only)
- Read git state via Bash (branch, log, status)
- Compose passalong using schema templates
- Print to stdout with save path recommendation
- Hard constraints mirror schema document

### Step 4 — Draft motion-passalong-eval.yaml

Eval fixture:
- 3 test cases: orchestrator happy path, dev DRAFT with uncommitted changes,
  dev RATIFIED with clean tree
- 4 refusal cases: unknown target, missing motionId, nonexistent motion,
  DRAFT claimed as RATIFIED
- Schema compliance assertions per target type
- 9 acceptance criteria

### Step 5 — Update README

Added `/motion-passalong` to skills table.
Added `motion-passalong-eval.yaml` to eval fixtures table.
Removed passalong from extension points — now shipped.
Extension points section reduced to MCP reference only.

### Step 6 — Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0106/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `passalong-schema.md`: 2 target types, templates, 6 hard constraints ✓
- `motion-passalong.md`: parses target + motionId, reads real state, composes from schema ✓
- `motion-passalong-eval.yaml`: 3 cases, 4 refusals, schema compliance, 9 AC ✓
- README: skills table updated, eval table updated, extension points reduced to MCP ✓
- validate_motion (0106): EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- No portal/ changes, no runtime mutations ✓

# Execution: Codex Execution Policy — Codex-exec / Claude-drafts operating split

**Motion:** motion-0102
**Role:** LIBRARIAN
**Date:** 2026-03-31

## Scope

Governance and configuration artifacts only. No runtime changes. No portal/ code changes.

Files created:

```
.nexus/codex/codex-exec-policy.md      (created — primary deliverable)
.nexus/codex/README.md                 (updated — reference to policy)
.nexus/motions/motion-0102/            (6 files — this motion package)
```

## Steps

### Step 1 — Repo state inspection

Branch: `sprint/q2-codex-execution-pivot`. Clean from main.

Confirmed:
- Last motion: motion-0101 (RATIFIED)
- Existing conditioning: `.claude/commands/motion-ratify.md`, `.claude/commands/motion-status.md`
- Existing evals: `.nexus/codex/evals/motion-ratify-eval.yaml`
- No existing policy document in `.nexus/codex/`
- Track A proof chain governance-coherent end-to-end (motions 0095–0101)

### Step 2 — Draft codex-exec-policy.md

Primary deliverable. Sections:

1. Purpose — defines the Codex-exec / Claude-drafts split
2. Codex-eligible motion classes — table of task classes + skills + conditions
3. Claude-retained responsibilities — table of judgment-requiring tasks
4. Handoff protocol — two-step sequences for ratification and proof execution
5. Non-delegation rules — what Codex must not attempt
6. dev-jai-nexus boundary commitments — what stays in this repo
7. Conditioning interface — `.claude/commands/` as the Codex/Claude boundary
8. Current program context — state as of motion-0102 + upcoming expansions

### Step 3 — Update .nexus/codex/README.md

Added policy reference to the README:
- `codex-exec-policy.md` listed in conditioning inventory
- Extension points updated to reflect motion-0103/0104 pipeline

### Step 4 — Gate validation

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0102/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `codex-exec-policy.md`: 8 sections, covers split, handoff, non-delegation, boundary ✓
- README updated: policy listed, extension points current ✓
- validate_motion (0102): EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- No runtime changes, no portal/ changes ✓

## Program note

This motion is itself Claude-drafted and will be Codex-ratified — making it
the first concrete instance of the split it defines. The ratification of
motion-0102 via `/motion-ratify` is the proof of concept for the handoff protocol.

# Execution: Bounded Staged Workstream Dispatch Activation v0 — OffBook.ai

**Motion:** motion-0096
**Role:** BUILDER
**Date:** 2026-03-30

## Scope

Files created:

```
out/offbook-ai/coverage-declaration.yaml         (new — operator Wave 0 declaration)
portal/scripts/activate-staged-project.mjs       (new — staged project activation script)
.nexus/motions/motion-0096/                      (6 files — this motion package)
```

Files NOT changed:
- No existing scripts modified
- No runtime changed
- No UI changed
- No other out/offbook-ai/ artifacts changed

## Steps

### Step 1 — Repo state inspection

Branch: `q2/workstream-dispatch-activation-v0`. Diff from main: one modified file
(`out/offbook-ai/.nexus/motions/motion-0001/motion.yaml` — timestamp from prior
force-rerun). Confirmed:
- Dev-jai-nexus architect agent: `6.0.10` (JAI::DEV::ARCHITECT)
- `config/agency.yaml`: execution_roles=[ARCHITECT] confirmed for 6.0.10
- Operator detail page renders `inboxTags` at line 914–915 — no UI change needed
- `activate-motion.mjs` + `enqueue-motion-packet.mjs` + `run-architect-once.ts`
  are the proven 3-step execution lane

Staged artifacts confirmed:
- `out/offbook-ai/` has 12 Wave 0 substrate artifacts + bootstrap-manifest.instance.yaml
- `.nexus/planning/offbook-ai-intake.yaml` — real WS-A instance
- `.nexus/planning/dispatch-integration.spec.md` — WS-E dispatch handle spec
- `.nexus/planning/coverage-declaration.schema.yaml` — WS-E operator schema
- No `coverage-declaration.yaml` exists yet for OffBook.ai

### Step 2 — coverage-declaration.yaml

Created `out/offbook-ai/coverage-declaration.yaml`. Sourced from:
- intake: `project_id=offbook-ai`, `domain=offbook.ai`, `execution_scope=cross_repo` (polyrepo)
- agency: 9 agents (5 governance + 4 execution), nh_root=7.0
- bootstrap manifest defaults: `agency_config=config/agency.yaml`, `council_config=.nexus/council.config.yaml`
- Wave 0 proof gates: validate_motion + validate_agency + wave_0_substrate_12_artifacts + bootstrap_manifest_instance

### Step 3 — activate-staged-project.mjs

Implemented new script. Key design decisions:
- Reads coverage-declaration, derives 10 dispatch handle fields in two validation stages:
  - Check 3: `wave_state.current_wave` (separate early check)
  - Check 4: remaining 9 fields via `REQUIRED_HANDLE_FIELDS` array
- Tags: `["motion:<id>", "project:<project_id>", "route:ARCHITECT"]`
- Idempotency: same guard as activate-motion.mjs (refuses if live tagged packet exists)
- Does NOT require RATIFIED at packet-creation time; `enqueue-motion-packet.mjs` enforces RATIFIED

### Step 4 — Syntax check

```
node --check portal/scripts/activate-staged-project.mjs
→ SYNTAX OK
```

### Step 5 — Dry-run proof

```
node portal/scripts/activate-staged-project.mjs \
  --coverage out/offbook-ai/coverage-declaration.yaml \
  --motion motion-0096

→ PASS  coverage_file
→ PASS  coverage_fields: project_id=offbook-ai  domain=offbook.ai
→ PASS  wave_state: current_wave=0
→ PASS  dispatch_handle: all 9 required fields satisfied
→ PASS  motion_yaml: title="Bounded Staged Workstream Dispatch Activation v0 — OffBook.ai"

Dry-run output:
  nhId:    motion-0096
  title:   Bounded Staged Workstream Dispatch Activation v0 — OffBook.ai [offbook-ai]
  tags:    ["motion:motion-0096","project:offbook-ai","route:ARCHITECT"]
  plan:    (full dispatch handle summary — all 10 fields)
  ac:      (5-item architect checklist)
```

### Step 6 — Idempotency check

```
node portal/scripts/activate-staged-project.mjs ... | diff - <(same command)
→ IDEMPOTENT: identical output
```

### Step 7 — Validation gates

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0096/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Full activation command chain

After motion-0096 is RATIFIED:

```bash
# Step A — Create the work packet
node portal/scripts/activate-staged-project.mjs \
  --coverage out/offbook-ai/coverage-declaration.yaml \
  --motion motion-0096 --create

# Step B — Bridge to architect queue
# (requires decision.yaml status=RATIFIED)
node portal/scripts/enqueue-motion-packet.mjs --motion motion-0096

# Step C — Architect execution proof
pnpm -C portal exec tsx scripts/run-architect-once.ts 6.0.10
```

## Evidence

- `node --check`: SYNTAX OK ✓
- Dry-run: all 5 PASS checks, correct tags + dispatch handle output ✓
- Two consecutive dry-runs: identical output (idempotent) ✓
- validate_motion: EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- challenge.md: no blocking objections ✓
- No existing scripts or runtime changed ✓

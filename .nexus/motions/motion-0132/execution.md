# Execution: JAI Grid Repo Ingest Workflow v0

**Motion:** motion-0132
**Role:** BUILDER
**Date:** 2026-04-14

---

## Cost estimate

Category: standard
Basis: one new standalone Node.js ESM script + one root package.json script entry. No
TypeScript changes. No portal runtime changes. No database changes. No governance script
changes. Scope is confined to one new file and one package.json line.

---

## Deliberation protocol tier

**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.

---

## Scope

### New files (actual)

- `portal/scripts/grid-ingest-bundle.mjs` — commit 85fe862 (309 lines, +2 for package.json):
  - CLI: `--bundle <path>`, `--stdin`, `--force`, `--dry-run`, `--help`
  - Imports: `fs`, `path`, `process`, `child_process` (stdlib only) +
    `parseMotionText` from `../src/lib/motion/motionLib.mjs`
  - `parseBundle(text)` — splits on `/^=== ([\w.-]+) ===/m`; returns `Map<name, content>`
  - `extractMotionId(motionYamlText)` — matches `motion_id:` line via regex
  - `validateBundle(sections)` — 6 pre-write checks (see evidence log)
  - Write path: `fs.mkdirSync({ recursive: true })` then 4 `fs.writeFileSync` calls
  - Post-write: `spawnSync` `validate-motion.mjs --motion <path>`
  - Exit 0 on success; exit 1 on any pre-write failure; warns but exits via validate-motion
    exit code if post-write check fails

### Modified files (actual)

- `package.json` — commit 85fe862:
  - Added: `"grid:ingest": "node portal/scripts/grid-ingest-bundle.mjs"`

### Unchanged

- `portal/src/lib/grid/gridMotionDraft.ts` — untouched
- `portal/src/lib/grid/gridDiff.ts` — untouched
- `portal/src/app/operator/grid/GridView.tsx` — untouched
- `portal/src/lib/motion/motionLib.mjs` — read-only import, not modified
- `portal/scripts/validate-motion.mjs` — spawned as subprocess, not modified
- `portal/scripts/council-run.mjs` — untouched
- All other `.nexus/` governance scripts — untouched

### Commits

- `85fe862` — `portal/scripts/grid-ingest-bundle.mjs` (new) + `package.json` (grid:ingest entry)

---

## Evidence log

### 1. validate-motion exits 0

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0132/motion.yaml
→ ✅ motion schema OK
```

---

### 2. validate-agency exits 0

```
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK (202 agents)
```

---

### 3. pnpm -C portal typecheck exits 0

```
pnpm -C portal typecheck
→ exit 0 (clean)
```

No TypeScript files changed. `grid-ingest-bundle.mjs` is `.mjs` only.

---

### 4. --help prints usage without error

```
node portal/scripts/grid-ingest-bundle.mjs --help
→ exit 0, usage printed
```

---

### 5. Missing bundle file → exit 1, no writes

```
node portal/scripts/grid-ingest-bundle.mjs --bundle nonexistent.txt
→ ❌ Bundle file not found: <path>
→ exit 1
```

---

### 6. No delimiters → exit 1, no writes

```
echo "no delimiters here" | node portal/scripts/grid-ingest-bundle.mjs --stdin
→ ❌ Bundle does not contain "=== <filename> ===" section delimiters.
→ exit 1
```

---

### 7. Missing section → exit 1, names missing section, no writes

```
[bundle with motion.yaml, proposal.md, execution.md but no challenge.md]
→ ❌ Missing required sections: challenge.md
→ exit 1
```

---

### 8. motion-XXXX placeholder → exit 1, no writes

```
[bundle with motion_id: motion-XXXX]
→ ❌ "motion-XXXX" placeholder found in section "motion.yaml".
→ exit 1
```

---

### 9. Invalid motion ID format → exit 1, no writes

```
[bundle with motion_id: motion-12345]
→ ❌ Invalid motion ID format: "motion-12345"
→ exit 1
```

---

### 10. --dry-run → prints plan, no writes, exit 0

```
node portal/scripts/grid-ingest-bundle.mjs --bundle /tmp/bundle-valid.txt --dry-run
→ Dry run: no files written
→ Motion ID, target dir, sections printed
→ exit 0; ls .nexus/motions/motion-0199/ → not found
```

---

### 11. Valid bundle → 4 files written, validate-motion passes, exit 0

```
node portal/scripts/grid-ingest-bundle.mjs --bundle /tmp/bundle-valid.txt
→ Written: .nexus/motions/motion-0199/motion.yaml
→ Written: .nexus/motions/motion-0199/proposal.md
→ Written: .nexus/motions/motion-0199/execution.md
→ Written: .nexus/motions/motion-0199/challenge.md
→ ✅ motion schema OK
→ ✅ motion-0199 package materialized at .nexus/motions/motion-0199/
→ exit 0
```

No vote.json, policy.yaml, decision.yaml, verify.json written. No commit created.

---

### 12. Existing directory without --force → exit 1, no overwrites

```
node portal/scripts/grid-ingest-bundle.mjs --bundle /tmp/bundle-valid.txt  (run twice)
→ ❌ Target directory already exists. Use --force to overwrite.
→ exit 1
```

---

### 13. No .nexus/ writes from portal interaction

`GridView.tsx` and `gridMotionDraft.ts` are unchanged in this motion. Portal still uses
`navigator.clipboard` only. `git status` remains clean after any modal interaction.
Verifiable by running the portal dev server and opening `MotionDraftModal`.

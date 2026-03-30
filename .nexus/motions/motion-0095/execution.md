# Execution: Bounded bootstrap-manifest.instance.yaml Emission

**Motion:** motion-0095
**Role:** BUILDER
**Date:** 2026-03-30

## Scope

One file changed: `portal/scripts/generate-bootstrap.mjs`
One new file emitted: `out/offbook-ai/.nexus/planning/bootstrap-manifest.instance.yaml`

Files created or updated:

```
portal/scripts/generate-bootstrap.mjs       (modified: +1 import, +1 helper,
                                              +1 static table, +1 builder fn,
                                              +1 generatedAt capture, +1 write call)
out/offbook-ai/.nexus/planning/
  bootstrap-manifest.instance.yaml          (emitted by generator)
.nexus/motions/motion-0095/                 (6 files — this motion package)
```

Files NOT changed:
- All 12 Wave 0 substrate artifact builders — untouched
- `out/offbook-ai/` existing 12 files — overwritten only by `--force --yes` rerun
- No other scripts, schemas, or governance artifacts

## Steps

### Step 1 — Repo state inspection

Confirmed branch: `q2/bootstrap-manifest-instance-emission` (no diff from main).
Confirmed `out/offbook-ai/` has 12 files, no manifest present.
Confirmed next motion ID: motion-0095.
Read `bootstrap-generator.spec.md` and `bootstrap-manifest.schema.yaml` for
exact manifest contract.

### Step 2 — Code changes to generate-bootstrap.mjs

Four additions, zero changes to existing logic:

1. **Import:** `import { createHash } from "node:crypto";`

2. **Helper:**
   ```javascript
   function hashFile(filePath) {
     const abs = path.resolve(process.cwd(), filePath);
     if (!fs.existsSync(abs)) return null;
     return createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
   }
   ```

3. **Static table + builder:**
   ```javascript
   const WAVE0_ARTIFACT_META = [ /* 12 entries: id, path, classification */ ];

   function buildBootstrapManifest(intake, topology, substrateResults, generatedAt, intakeHash) {
     // maps results, builds artifacts array, returns yaml.stringify({...})
   }
   ```

4. **In main():**
   - `const generatedAt = new Date().toISOString();` — captured before artifact writes
   - After artifact #12 (CLAUDE.md):
     ```javascript
     rec("bootstrap-manifest", writeFileIdempotent(
       path.join(outputRoot, ".nexus", "planning", "bootstrap-manifest.instance.yaml"),
       buildBootstrapManifest(intake, topology, results, generatedAt, hashFile(args.intake)),
       { ...opts, label: "manifest" }
     ));
     ```

### Step 3 — Syntax check

```
node --check portal/scripts/generate-bootstrap.mjs
→ SYNTAX OK
```

### Step 4 — Generation run

```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake.yaml \
  --output out/offbook-ai \
  --force --yes
→ Wrote/copied: 13   Skipped: 0
→ out/offbook-ai/.nexus/planning/bootstrap-manifest.instance.yaml  WROTE [manifest]
```

### Step 5 — Idempotency check

```
node portal/scripts/generate-bootstrap.mjs \
  --intake .nexus/planning/offbook-ai-intake.yaml \
  --output out/offbook-ai
→ Wrote/copied: 0   Skipped: 13
→ All 13 artifacts skipped including manifest
```

### Step 6 — Validation gates

```
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0095/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence

- `node --check`: SYNTAX OK ✓
- Manifest emitted at correct path ✓
- Manifest content: project_id=offbook-ai, governance_resident_repo=offbook-core,
  wave=0, input_hashes.intake=741db2ff..., artifacts 12 entries, totals.total=12 ✓
- Idempotency: all 13 skipped on second run ✓
- validate_motion: EXIT 0 ✓
- validate_agency: EXIT 0 ✓
- No unrelated files changed ✓
- challenge.md: no blocking objections ✓

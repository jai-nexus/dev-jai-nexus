# Execution: Context bundle accuracy hardening — decision artifacts in active-path-pack and dynamic commands in repo-capsule

**Motion:** motion-0108
**Role:** BUILDER
**Date:** 2026-03-31

## Scope

Files changed:

```
portal/scripts/generate-active-path-pack.mjs   (modified — add 4 paths to motion path set)
portal/scripts/generate-repo-capsule.mjs       (modified — replace 3 stale hardcoded strings)
.nexus/motions/motion-0108/                    (6 files — this motion package)
```

Files NOT changed:
- `generate-context-bundle.mjs` — motion-0107 completed its scope
- `generate-motion-snapshot.mjs` — no stale content, no change needed
- No runtime, DB, or UI changes

## Implementation plan

### Change 1 — `generate-active-path-pack.mjs`

**Location:** lines 116–122 (the motion-scoped path set block)

**Current block:**

```js
if (motionId) {
    pathSet.add(`.nexus/motions/${motionId}/motion.yaml`);
    pathSet.add(`.nexus/motions/${motionId}/proposal.md`);
    pathSet.add(`.nexus/motions/${motionId}/challenge.md`);
    pathSet.add(`.nexus/motions/${motionId}/execution.md`);
    pathSet.add(`.nexus/motions/${motionId}/policy.yaml`);
}
```

**After change:**

```js
if (motionId) {
    pathSet.add(`.nexus/motions/${motionId}/motion.yaml`);
    pathSet.add(`.nexus/motions/${motionId}/proposal.md`);
    pathSet.add(`.nexus/motions/${motionId}/challenge.md`);
    pathSet.add(`.nexus/motions/${motionId}/execution.md`);
    pathSet.add(`.nexus/motions/${motionId}/policy.yaml`);
    pathSet.add(`.nexus/motions/${motionId}/decision.yaml`);
    pathSet.add(`.nexus/motions/${motionId}/decision.md`);
    pathSet.add(`.nexus/motions/${motionId}/vote.json`);
    pathSet.add(`.nexus/motions/${motionId}/verify.json`);
}
```

No other changes to this script.

### Change 2 — `generate-repo-capsule.mjs`

**Location:** lines 126–145 (Current Work Front and Important Commands sections)

**Current block:**

```js
lines.push("## Current Work Front");
lines.push(`- latest_motion_dir: ${latestMotionDir ?? "n/a"}`);
lines.push("- recent proven runtime strip: ARCHITECT -> BUILDER -> VERIFIER");
lines.push("- current likely next work: context bundle generator");
lines.push("");

lines.push("## Key Paths");
...

lines.push("## Important Commands");
lines.push("- pnpm council:run motion-0033");
lines.push("- pnpm -C portal typecheck");
lines.push("- pnpm -C portal build");
lines.push(
    "- node portal/scripts/generate-context-bundle.mjs --motion motion-0033",
);
lines.push("");
```

**After change:**

```js
lines.push("## Current Work Front");
lines.push(`- latest_motion_dir: ${latestMotionDir ?? "n/a"}`);
lines.push("- recent proven runtime strip: ARCHITECT -> BUILDER -> VERIFIER");
lines.push("");

lines.push("## Key Paths");
...

lines.push("## Important Commands");
lines.push(`- pnpm council:run ${latestMotionDir ?? "motion-XXXX"}`);
lines.push("- pnpm -C portal typecheck");
lines.push("- pnpm -C portal build");
lines.push(
    `- node portal/scripts/generate-context-bundle.mjs --motion ${latestMotionDir ?? "motion-XXXX"}`,
);
lines.push("");
```

`latestMotionDir` is already in scope (computed at line 94). No new variable or
import needed.

### Gate validation

```
node --check portal/scripts/generate-active-path-pack.mjs
→ (no output)   EXIT: 0

node --check portal/scripts/generate-repo-capsule.mjs
→ (no output)   EXIT: 0

node portal/scripts/generate-active-path-pack.mjs --motion motion-0108
→ surfaces/chat-context/{date}_active-path-pack.txt

node portal/scripts/generate-repo-capsule.mjs
→ surfaces/chat-context/{date}_repo-capsule.txt

node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0108/motion.yaml
→ ✅ motion schema OK    EXIT: 0

node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
→ ✅ registry-backed agency OK    EXIT: 0
```

## Evidence checklist

- [ ] `node --check` on both modified scripts exits 0
- [ ] Active-path-pack with `--motion motion-0108` includes `decision.yaml` in
  "## Selected Paths" section
- [ ] Active-path-pack with `--motion motion-0108` includes `decision.md`, `vote.json`,
  `verify.json` where files exist
- [ ] Active-path-pack without `--motion` flag is unchanged (no decision.yaml)
- [ ] Repo-capsule Important Commands show `motion-0108` (current latest), not `motion-0033`
- [ ] Repo-capsule has no "current likely next work: context bundle generator" line
- [ ] Two consecutive repo-capsule runs produce identical Important Commands
- [ ] validate_motion: EXIT 0
- [ ] validate_agency: EXIT 0

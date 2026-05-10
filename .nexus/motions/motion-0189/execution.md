# Execution: Loop Candidate Selection Criteria v0

**Motion:** motion-0189
**Role:** BUILDER
**Date:** 2026-05-10
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one helper extension, small consumer copy updates, one motion packet,
and one bundled snapshot refresh. No provider calls, runtime execution,
persistence, or cross-repo mutation.

---

## Boundary confirmation

This motion must not:

- add live provider/model calls
- add backend runtime execution
- add branch-write or PR authority
- add scheduler or automation
- add API or DB mutation
- add hidden persistence
- add passalong indexing
- change `/operator/jai`, canonical agent registry, or JAI Palette behavior

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-10T22:32:13.8294954Z`

### 2. Implementation shape

- added explicit future-selection criteria to `operatorLoopCandidate.ts`
- preserved `wp-agent-registry-follow-up` as the current selected candidate
- exposed criteria compactly across root, work, deliberation, and passalong
- refreshed the bundled motion snapshot through motion-0189

### 3. Files changed

- `portal/src/lib/controlPlane/operatorLoopCandidate.ts`
- `portal/src/lib/controlPlane/rootOperatorOverview.ts`
- `portal/src/lib/controlPlane/deliberationPassalong.ts`
- `portal/src/app/page.tsx`
- `portal/src/app/operator/work/page.tsx`
- `portal/src/app/operator/deliberation/page.tsx`
- `.nexus/motions/motion-0189/**`
- `portal/src/lib/motion/motionSnapshot.json`

No `docs-nexus` files were changed. No `jai-nexus` files were changed.

### 4. Selection criteria model

The selected-candidate helper now exposes:

- selected candidate metadata
- `selection_criteria`
- `criteria_summary`
- `current_candidate_criteria_result`

Modeled criteria include:

- repo-local preferred before cross-repo
- governance-safe preferred before implementation-heavy
- draft/review-only action preferred
- validation gate required
- human decision gate required
- no unauthorized `docs-nexus` or `jai-nexus` mutation
- no authority expansion
- full deterministic chain required

### 5. Preserved selected candidate

- selected work packet id: `wp-agent-registry-follow-up`
- assigned agent: `JAI Governance Agent`
- role posture: `palette draft only: JAI Governance Agent`
- repo: `jai-nexus/dev-jai-nexus`
- surface: `Operator agents`
- requested action: `draft_plan`
- routing target: `ORCHESTRATOR`

### 6. Cross-surface criteria visibility

- root `/` keeps the selected candidate card visible and now shows criteria summary and required-criteria satisfaction count
- `/operator/work` keeps marking the selected candidate and now shows criteria summary in the header
- `/operator/deliberation` keeps the selected candidate visible and now shows criteria summary beside the selected-candidate rationale
- the passalong block keeps copy-only behavior and now includes one criteria-summary line in the handoff text

### 7. Authority posture preserved

- no live provider/model calls
- no backend runtime execution
- no branch-write or PR authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no passalong indexing
- no changes to `/operator/jai`, canonical agent registry, or JAI Palette behavior

### 8. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0189/motion.yaml
node portal/scripts/validate-agency.mjs --domain dev.jai.nexus --repo dev-jai-nexus
pnpm -C portal typecheck
node portal/scripts/build-motion-snapshot.mjs --write
node portal/scripts/build-motion-snapshot.mjs --check
pnpm -C portal build
```

Results recorded after final ratification and final snapshot refresh:

- `validate_motion` -> pass
- `validate_agency` -> pass
- `typecheck` -> pass
- `snapshot_write` -> pass
- `snapshot_check` -> pass
- `build` -> pass

### 9. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `187`
  - latest bundled motion: `motion-0188`
- bundled snapshot after refresh:
  - motion count: `188`
  - latest bundled motion: `motion-0189`
- `node portal/scripts/build-motion-snapshot.mjs --check` returned
  `status: current`

### 10. Acceptance checks

- acceptance-01 pass: `wp-agent-registry-follow-up` remains the current selected loop-through candidate
- acceptance-02 pass: future loop-candidate selection criteria are explicitly modeled
- acceptance-03 pass: criteria include repo-local preference, governance-safe preference, draft/review-only preference, validation gate requirement, human decision gate requirement, no unauthorized docs/jai mutation, and no authority expansion
- acceptance-04 pass: root `/`, `/operator/work`, `/operator/deliberation`, and passalong block continue representing the selected candidate consistently
- acceptance-05 pass: criteria are surfaced where low-risk without adding route/state complexity
- acceptance-06 pass: representation remains deterministic, static/local, read-only, copy-only, and human-gated
- acceptance-07 pass: no provider/model/backend/execution/write authority was introduced
- acceptance-08 pass: no API/DB mutation, passalong index, persistence layer, scheduler, automation, or live producer was introduced
- acceptance-09 pass: motion snapshot gate passed
- acceptance-10 pass: validation passed

### 11. Ratification closeout

Motion-0189 is ratified as a deterministic loop-candidate criteria-definition seam only.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- final bundled snapshot includes `motion-0189`
- no provider call, runtime execution, write authority, persistence path, or mutation path was added

# Execution: Static Loop Candidate Switching v0

**Motion:** motion-0191
**Role:** BUILDER
**Date:** 2026-05-10
**Status:** RATIFIED

---

## Cost estimate

Category: small
Basis: one selected-candidate helper extension, small read-only surface updates,
one motion packet, and one bundled snapshot refresh. No runtime controls,
persistence, ranking, or authority changes.

---

## Boundary confirmation

This motion must not:

- add runtime operator controls
- add query or route state
- add persistence or passalong indexing
- add provider/model calls
- add backend runtime execution
- add branch-write or PR authority
- add scheduler or automation
- add API or DB mutation
- change `/operator/jai`, canonical agent registry, or JAI Palette behavior

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-10T23:16:37.1497240Z`

### 2. Implementation shape

- extended `operatorLoopCandidate.ts` with a static switching model
- preserved `wp-agent-registry-follow-up` as the active candidate
- exposed eligible candidate ids, switching status, rationale, criteria result,
  and switching policy summary
- surfaced the switching policy compactly on root overview, deterministic agenda,
  deliberation, and the copy-only passalong text
- refreshed the bundled motion snapshot through `motion-0191`

### 3. Files changed

- `portal/src/lib/controlPlane/operatorLoopCandidate.ts`
- `portal/src/lib/controlPlane/rootOperatorOverview.ts`
- `portal/src/lib/controlPlane/deliberationPassalong.ts`
- `portal/src/app/page.tsx`
- `portal/src/app/operator/work/page.tsx`
- `portal/src/app/operator/deliberation/page.tsx`
- `.nexus/motions/motion-0191/**`
- `portal/src/lib/motion/motionSnapshot.json`

No `docs-nexus` files were changed. No `jai-nexus` files were changed.

### 4. Static switching model added

Added a static/local switching model that represents:

- active candidate id
- eligible candidate ids
- per-candidate selection status
- per-candidate selection rationale
- per-candidate metadata criteria result
- per-candidate switching note
- switching policy mode and disallowed mechanisms

### 5. Active candidate preserved

- `wp-agent-registry-follow-up` remains the active loop-through candidate
- assigned agent remains `JAI Governance Agent`
- role posture remains palette-draft governance identity
- target repo remains `jai-nexus/dev-jai-nexus`
- target surface remains `Operator agents`
- requested action remains `draft_plan`
- routing target remains `ORCHESTRATOR`

### 6. Surface impact

- root `/` now shows eligible alternative ids and the static switching policy summary
- `/operator/work` now states the static switching policy in the agenda header and on the active candidate card
- `/operator/deliberation` now states the switching policy in the header and passalong posture section
- the passalong copy text now includes the switching policy line

### 7. Authority posture preserved

- no provider/model calls
- no backend runtime execution
- no branch-write or PR authority
- no scheduler or automation
- no API or DB mutation
- no hidden persistence
- no passalong indexing
- no runtime switching controls
- no route-state or query-state switching

### 8. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0191/motion.yaml
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
  - motion count: `189`
  - latest bundled motion: `motion-0190`
- bundled snapshot after refresh:
  - motion count: `190`
  - latest bundled motion: `motion-0191`
- `node portal/scripts/build-motion-snapshot.mjs --check` returned
  `status: current`

### 10. Acceptance checks

- acceptance-01 pass: `wp-agent-registry-follow-up` remains the current selected loop-through candidate
- acceptance-02 pass: static switching model explicitly represents active candidate, eligible ids, status, rationale, criteria result, and governance-only switching note
- acceptance-03 pass: cross-surface representation remains consistent across root overview, agenda, deliberation, and passalong
- acceptance-04 pass: representation remains static/local, deterministic, read-only, copy-only, and human-gated
- acceptance-05 pass: no provider/model/backend/execution/write authority was introduced
- acceptance-06 pass: no API/DB mutation, passalong index, persistence layer, scheduler, automation, or ranking/scoring engine was introduced
- acceptance-07 pass: motion snapshot gate passed
- acceptance-08 pass: validation passed

### 11. Ratification closeout

Motion-0191 is ratified as a static loop-candidate switching seam only.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- final bundled snapshot includes `motion-0191`
- no runtime control, persistence path, ranking logic, provider call, runtime execution, or write authority was added

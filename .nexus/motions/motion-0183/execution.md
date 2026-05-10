# Execution: Deterministic Agent Activation Agenda v0

**Motion:** motion-0183
**Role:** BUILDER
**Date:** 2026-05-10
**Status:** RATIFIED

---

## Cost estimate

Category: medium
Basis: one operator surface reframe, additive work-packet metadata, one
composition-layer agenda model, one motion packet, and one bundled snapshot
refresh. No runtime behavior, no new persistence, and no cross-repo changes.

---

## Boundary confirmation

This motion must not:

- add provider/model calls
- add live agent runtime
- add execution capability
- add branch-write authority
- add PR-creation authority
- add schedulers or automation
- add hidden persistence
- add credentials
- add API or DB mutation
- change `/operator/jai`, canonical agent registry, or JAI Palette behavior

---

## Evidence log

### 1. Final ratification timestamp

Shared UTC timestamp used across ratification artifacts:

- `2026-05-10T19:59:55.3558866Z`

### 2. Implementation shape

- extended draft work packet types with agenda status, source seam, and next
  prompt/passalong metadata
- added `portal/src/lib/controlPlane/agendaModel.ts` as a composition layer over
  existing draft work packets
- reframed `/operator/work` into the deterministic agent activation agenda
- preserved prompt previews and branch suggestions as copy-only operator aids

### 3. Files changed

- `portal/src/app/operator/work/page.tsx`
- `portal/src/lib/agents/workPackets.ts`
- `portal/src/lib/agents/workPacketTypes.ts`
- `portal/src/lib/agents/workPacketTaskPrompts.ts`
- `portal/src/lib/controlPlane/agendaModel.ts`
- `.nexus/motions/motion-0183/**`
- `portal/src/lib/motion/motionSnapshot.json`

No `docs-nexus` files were changed. No `jai-nexus` files were changed.

### 4. Deterministic agenda coverage

- `/operator/work` now reads as a deterministic agent activation agenda rather
  than a loose draft packet list
- each agenda item resolves assigned agent, canonical role, repo, surface,
  source seam, allowed output, validation gates, human gates, evidence
  expectations, agenda status, and next passalong target
- requested action coverage now explicitly includes:
  - `view_only`
  - `draft_plan`
  - `draft_files_preview`
  - `verify`
- agenda status remains bounded to:
  - `draft`
  - `ready_for_review`
  - `blocked`
  - `deferred`
  - `settled`

### 5. Authority posture preserved

- execution blocked
- branch_write disabled
- propose_pr disabled
- execute_runtime disabled
- no provider/model calls
- no live agent runtime
- no scheduler or automation
- no API or DB mutation

### 6. Validation commands

```text
node portal/scripts/validate-motion.mjs --motion .nexus/motions/motion-0183/motion.yaml
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

### 7. Snapshot gate result

- bundled snapshot before refresh:
  - motion count: `181`
  - latest bundled motion: `motion-0182`
- bundled snapshot after refresh:
  - motion count: `182`
  - latest bundled motion: `motion-0183`
- `node portal/scripts/build-motion-snapshot.mjs --check` returned
  `status: current`

### 8. Acceptance checks

- acceptance-01 pass: `/operator/work` reads as the deterministic agent
  activation agenda
- acceptance-02 pass: every agenda item resolves agent, role, repo, surface,
  source seam, allowed output, validation gate, and human decision
- acceptance-03 pass: requested actions include `view_only`, `draft_plan`,
  `draft_files_preview`, and `verify`
- acceptance-04 pass: visible agenda statuses are limited to `draft`,
  `ready_for_review`, `blocked`, `deferred`, and `settled`
- acceptance-05 pass: authority-disabled posture is explicit and repeated
- acceptance-06 pass: allowed paths, blocked paths, verification gates, human
  gates, and evidence expectations remain visible
- acceptance-07 pass: next prompt/passalong target is visible per item
- acceptance-08 pass: no runtime, mutation, scheduler, provider, or PR workflow
  path was introduced
- acceptance-09 pass: motion snapshot gate ran and passed
- acceptance-10 pass: typecheck and build passed

### 9. Ratification closeout

Motion-0183 is ratified as a deterministic planning/review agenda seam only.

- `motion.yaml` status -> `ratified`
- `decision.yaml` status -> `RATIFIED`
- `vote.json` result -> `PASS`
- final bundled snapshot includes `motion-0183`
- no execution, mutation, runtime, provider, or authority expansion was added

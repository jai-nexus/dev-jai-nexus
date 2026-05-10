# Challenge: Root Operator Status Overview v0

**Motion:** motion-0184

---

## Risks

### Risk 1: Root overview could accidentally imply live telemetry health

If Events or Sync Runs are presented too positively, operators may mistake
partial/stale data for a full live heartbeat.

### Risk 2: The seam could duplicate operator logic instead of composing it

The root page should derive from existing read-only models and avoid introducing
another persistence or status system.

### Risk 3: Sync Runs could remain visually dominant

The landing surface must stop being SyncRun-first, while still preserving the
legacy/review semantics that remain useful.

### Risk 4: Authority-disabled posture could become less explicit

A more polished front door must still repeat that execution, branch write, PR
proposal, provider dispatch, and mutation paths remain disabled.

---

## Challenger standard

Approve only if:

- root `/` clearly reads as a control-plane overview rather than a SyncRun table
- required operator links are present
- Sync Runs remain visibly legacy/review-only
- Events and Decisions notes stay honest about freshness and automation limits
- no new telemetry production, authority, or mutation path is introduced

---

## Required gates

- validate_motion
- validate_agency
- typecheck

Optional supporting gate:

- build

---

## Risk score

risk_score: 0.08

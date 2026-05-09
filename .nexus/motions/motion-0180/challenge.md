# Challenge: Event and Sync Gap Assessment v0

**Motion:** motion-0180

---

## Risks

### Risk 1: Mistaking stale data for broken routes

The Events and Sync Runs pages are backed by real database reads. If the
assessment calls them dead without checking write paths and stored rows, the
result will be inaccurate and over-prescriptive.

### Risk 2: Treating partial telemetry as a complete control-plane stream

Current wording on Events and Sync Runs can read as if they represent the
whole operator heartbeat. If motion ratification and other governance activity
do not actually emit into those tables, that expectation is misleading.

### Risk 3: Scope drift into implementation

The obvious temptation is to repair freshness by wiring emitters, jobs, or
automation. That is explicitly out of scope for this seam.

### Risk 4: Pulling Decisions into a larger data-quality project

Decisions are adjacent, but they are populated by extraction, not by live
telemetry. This motion should include them only to document freshness posture,
not to reopen extraction architecture.

---

## Challenger standard

Approve only if:

- the assessment distinguishes route existence from feed freshness
- latest available timestamps are named or explicitly unavailable
- governance-event expectations are stated plainly
- Sync Runs receives a concrete recommendation
- any product change stays copy-only
- no runtime authority or automation is introduced

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

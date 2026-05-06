# Dev Site Repo Parity Gap Assessment

Date: 2026-05-06
Repo: dev-jai-nexus
Branch: fix/q2-dev-site-parity-reapply-v1

## Scope of this seam

- Refresh the bundled motion snapshot used by the operator motions browser fallback.
- Restore `/repos` parity with the canonical repo registry in `portal/config/repos.yaml`.
- Reconcile configured agent scope references so `/repos` remains the superset.
- Reapply the stale top-nav wording fix without creating a new `/runs` product surface.

## Explicitly not solved here

- motion-0179 / JAI Chat surface work
- any new chat route
- authority expansion, execution enablement, branch-write, or PR workflow activation
- scheduler, hidden persistence, credentials, or provider/model wiring

## Remaining gaps

### Event stream governance gap

The events surfaces remain read-oriented and stream visibility exists, but governance posture over event ingestion, retention, and operator review is still not closed by this seam. No new event governance policy, review lane, or ratification path was introduced here.

### Sync run staleness gap

`/` still renders the sync-run table directly from the database and there is still no dedicated `/runs` route. The top-nav wording drift is fixed by pointing the user at the existing sync-run home surface, but freshness and historical workflow review posture remain unchanged.

### Capability matrix posture gap

`/operator/agents` still shows configuration-only posture. Write, PR proposal, and runtime execution capabilities remain disabled, and this seam does not alter that boundary.

### Agent PR workflow Layer 1

Layer 1 agent PR workflow remains deferred. No branch-write authority, PR creation authority, or review automation was enabled in this seam.

### Motion-0179 routing status

Motion-0179 remains blocked until deployed parity is reverified from a production build that includes this reapplied source fix.

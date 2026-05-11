# Proposal: Eligible Candidate Review Panel v0

## Purpose

Add a compact read-only eligible-candidate review panel.

## Scope

- preserve `wp-agent-registry-follow-up` as the active selected candidate
- add a compact panel summarizing active, eligible, deferred, and blocked candidate ids
- show selection-criteria summary, switching policy, and no-selection-mutation note
- keep all agenda items visible and review links read-only
- refresh the bundled motion snapshot through `motion-0193`

## Non-goals

- no selector UI
- no runtime switching
- no route/query/local/session state
- no persistence or API/DB mutation
- no ranking/scoring
- no provider/model calls or execution authority

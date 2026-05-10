# Proposal: Agenda Deliberation Routing v0

## Purpose

Add read-only agenda-to-deliberation routing/context affordances for multiple
agenda items.

## Scope

- preserve `wp-agent-registry-follow-up` as the active selected candidate
- add static `/operator/deliberation` review affordances to agenda items
- expose current selection status and no-mutation routing notes
- reinforce that agenda-to-deliberation movement is navigation/context only
- refresh the bundled motion snapshot through `motion-0192`

## Non-goals

- no query params or route params for selected-candidate state
- no runtime switching controls
- no persistence, API mutation, or DB mutation
- no ranking or scoring
- no provider/model calls or execution authority

# Motion 0170 Proposal

Add the narrowest continuity layer so JAI conversations, deliberation transcripts, and waves use consistent repo-native naming, indexing, and portal presentation.

## Scope

- define conversation transcript naming convention
- define wave naming convention
- add bundled/static continuity model
- seed a captured deliberation transcript record from the current motion-0169 output
- seed a wave plan with nh_id hierarchy from the current next-action direction
- update `/operator/chats` and `/operator/waves` to surface that continuity

## Boundaries

- no live automatic capture
- no hidden persistence
- no DB writes or API mutation
- no execution enablement
- no branch writes or PR creation
- no dispatch or scheduler behavior
- no credentials or cross-repo mutation

# Motion 0171 Proposal

Export the seeded continuity model into committed repo-native chat and wave artifacts, and add a deterministic exporter/checker.

## Scope

- create committed `.nexus/chats/**` and `.nexus/waves/**` artifacts from the bundled continuity model
- add `node portal/scripts/export-continuity-artifacts.mjs --write`
- add `node portal/scripts/export-continuity-artifacts.mjs --check`
- update `/operator/chats` and `/operator/waves` to show artifact presence

## Boundaries

- no live automatic capture
- no hidden persistence
- no DB writes or API mutation
- no execution enablement
- no branch writes or PR creation
- no dispatch or scheduler behavior
- no credentials or toolchain integration

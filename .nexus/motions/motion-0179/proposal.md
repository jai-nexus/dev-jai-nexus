# Proposal: JAI Chat Surface v0

## Summary

Add a bounded `/operator/jai` surface for `dev.jai.nexus` that makes the
control-plane domain feel usable without introducing any live provider/model
integration, persistence, execution capability, or mutation authority.

## Scope

- add `/operator/jai` as an operator-facing, draft-only, read-only shell
- show `dev.jai.nexus` domain scope and `jai-nexus/dev-jai-nexus` repo scope
- show baseline canon alignment through `motion-0178`
- show repo registry count and authority posture from existing control-plane models
- show prompt chips and placeholder assistant copy for manual operator drafting
- link to existing operator surfaces:
  - `/operator/chats`
  - `/operator/waves`
  - `/operator/work`
  - `/operator/agents`
  - `/operator/motions`

## Non-scope

- no provider or model calls
- no chat backend
- no API routes
- no DB-backed message persistence
- no event stream integration
- no sync-run pipeline change
- no execution authority
- no branch-write authority
- no PR-creation authority
- no scheduler
- no hidden persistence
- no credentials
- no cross-repo mutation

## Expected outcome

The operator gets a coherent JAI shell that reads as a real control-plane
surface while keeping the current read-only and authority-disabled posture
explicit.

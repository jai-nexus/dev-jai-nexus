# Execution Plan (motion-0009)

## Intended changes (high level)
1) Unanimous consent voting
- Update Council Runner vote evaluation:
  - RATIFY only if all required voters are YES or YES_WITH_RESERVATIONS
  - Any NO blocks

2) Vote schema enforcement
- Update vote.json contract to support:
  - YES
  - YES_WITH_RESERVATIONS (requires reservations[])
  - NO (requires blocker_packet)
- Enforce validity rules during council-run.

3) Reservations + objections logging
- Append reservations and blocker packets into motion trace artifacts:
  - verify.json / trace.json (or existing trace pipeline)
- Ensure objections are durable and queryable.

4) Deadlock protocol
- Add detection of repeated NO after 2 amendment rounds.
- Write DEADLOCK state and require arbiter resolution output:
  - split motion / add evidence / request intel / escalate to human override

5) Intel Packet stage (v0)
- Add optional intel artifact:
  - .nexus/motions/<id>/intel.md (or intel.json)
- Council-run can proceed without intel, but for high-risk domains it must warn if missing.

6) Model slots
- Extend .nexus/model-routing.yaml (or compatible) to support:
  - slots: { SLOT_PROPOSER_FAST: ..., SLOT_CHALLENGER_STRICT: ..., ... }
  - role_to_slot mapping by role (proposer/executor/challenger/arbiter/librarian/meta_analyst)

## Expected touched paths
- portal/scripts/council-run.mjs
- portal/src/lib/motion/motionLib.mjs (vote/decision logic if present there)
- .nexus/model-routing.yaml
- .nexus/motions/* (new intel artifact conventions)

## Evidence required
- pnpm -C portal typecheck: PASS
- Run a synthetic motion through council-run demonstrating:
  - NO vote rejected without blocker packet
  - YES_WITH_RESERVATIONS accepted and logged
  - unanimous consent required for ratification
- Show resulting vote.json + decision.yaml + verify.json reflect new semantics

## Rollback plan
- Keep previous vote evaluation behind a feature flag (e.g., COUNCIL_VOTE_MODE=majority|unanimous)
- If failure, revert to majority mode and preserve reservations/objections logging as additive.

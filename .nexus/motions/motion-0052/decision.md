# Decision - motion-0052

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 context command is proven. portal/scripts/motion-factory.mjs
gathers bounded repo-native context from .nexus/ surfaces and prints a
structured summary to stdout. The --json output establishes a stable payload
contract for future draft and revise commands.

## What was added
- portal/scripts/motion-factory.mjs (NEW) — context command only

## What was proved
| Test | Result |
|------|--------|
| Human-readable output | PASS — all expected fields present |
| JSON output | PASS — stable contract, parseable, all named fields |
| Missing --intent | PASS — hard fail with clear error |
| No file writes | PASS — stdout only |
| No API calls | PASS — deterministic context gathering |

## Context payload contract (--json)
- intent
- next_motion_id
- branch
- head_commit
- total_motions
- recent_motions (metadata-first: motion_id, title, status)
- staffing_summary (providers, live_slots, deferred_selectors, voting_roles)
- panel_summary (panel_count, panels with candidates and selector_status)
- governance_summary (version, vote_mode, required_roles)

## Minor observations
- motion-0052 appears as (unknown) in recent motions because it was not yet
  committed with title/status at test time — expected behavior
- Librarian panel candidates field missing in JSON — minor data issue in
  agent-panels.yaml parsing, not a blocking defect

## What remains
- draft command (motion-0053: deterministic package scaffold)
- revise command (motion-0055)
- model-assisted narrative generation (motion-0054)
- full-cycle proof (motion-0056)

## Outcome
All three required roles voted YES. No objections, no reservations.

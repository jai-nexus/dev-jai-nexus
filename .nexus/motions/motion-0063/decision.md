# Decision - motion-0063

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 preview mode added for revise and evidence commands.
Preview generates proposed content via the same pipeline as apply mode
but prints to stdout instead of writing files. Clear per-file markers
and proposed-only labeling. Apply mode remains atomic and unchanged.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — --preview flag for revise and evidence)

## What was proved
| Test | Result |
|------|--------|
| revise --preview | PASS — proposed content printed, no files written |
| revise apply mode | PASS — atomic write, unchanged behavior |
| Preview labeling | PASS — "PREVIEW ONLY — no files were written" |
| Per-file markers | PASS — BEGIN/END PREVIEW FILE markers |

## Motion Factory v0 — updated command surface
| Command | Flags | Motion(s) |
|---------|-------|-----------|
| context | --intent, --json | 0052 |
| draft | --intent, --no-api, --provider | 0053, 0054, 0058 |
| revise | --motion, --notes, --files, --provider, --preview | 0055, 0058, 0063 |
| evidence | --motion, --evidence-file, --notes, --files, --provider, --preview | 0057, 0058, 0063 |
| status | --json | 0061 |

## Outcome
All three required roles voted YES. No objections, no reservations.

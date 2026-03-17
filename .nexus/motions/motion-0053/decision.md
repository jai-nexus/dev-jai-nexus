# Decision - motion-0053

## Status
RATIFIED — unanimous consent.

## Summary
Motion Factory v0 draft command is proven. The command creates a structurally
correct 9-file motion package in DRAFT state using deterministic scaffolding.
Structural files are populated from governance config. Narrative files are
placeholder scaffolds clearly marked as pending. No API calls are made.

## What was added
- portal/scripts/motion-factory.mjs (EDIT — draft command added)

## What was proved
| Test | Result |
|------|--------|
| Draft creates 9 files | PASS — all files in .nexus/motions/motion-NNNN/ |
| Structural files from governance config | PASS — protocol version, vote mode, required roles |
| Narrative files as placeholders | PASS — "Draft scaffold — pending" markers |
| Scaffold-only reminder on stdout | PASS — printed after file list |
| Missing --intent fails hard | PASS — clear error message |
| No API calls | PASS — deterministic only |
| No writes outside motion directory | PASS |

## Motion Factory v0 command status
| Command | Status | Motion |
|---------|--------|--------|
| context | proven | motion-0052 |
| draft | proven | motion-0053 |
| revise | not yet implemented | planned |

## What remains
- Model-assisted narrative generation (motion-0054)
- Revision command (motion-0055)
- Full-cycle proof (motion-0056)

## Outcome
All three required roles voted YES. No objections, no reservations.

# Proposal - motion-0065

## Title
status parity and motion inventory hardening

## Intent
Improve Motion Factory v0 trustworthiness by making `status` and `status --json` derive from the same snapshot logic and by reporting motion inventory explicitly when gaps are present.

## Why this motion exists
Current local evidence showed that Motion Factory status reporting needed stronger parity and clearer inventory semantics:

- Human `status` output and `status --json` needed to be driven from the same underlying snapshot logic.
- Status reporting previously relied on a single motion total, which could be misread as complete inventory rather than explicit local inventory facts.
- Motion Factory is now strong enough in preview behavior that the next priority should be trust hardening for local status and governance visibility.
- Local validation after implementation confirmed aligned status output and explicit inventory reporting.

## What this motion changes
- Refactors status generation so human and JSON output are rendered from the same underlying snapshot object.
- Distinguishes motion inventory facts more clearly, including:
  - highest discovered motion id
  - next motion id
  - existing motion directory count
  - missing motion ids, when present
- Preserves current command semantics for `context`, `draft`, `revise`, `evidence`, and `status`.
- Makes status output more explicit without changing Motion Factory workflow boundaries.

## What this motion does not change
- No change to draft preview behavior.
- No change to revise preview behavior.
- No change to evidence preview behavior.
- No change to structural-file trust boundaries.
- No change to ratification requirements or governance review requirements.
- No attempt to recreate historical motion directories as part of this motion.

## Design stance
Status output is governance surface area, not cosmetic text. Human-readable and machine-readable status must reflect the same local truth. Inventory reporting should prefer explicitness over implied completeness.

## Why now
Motion Factory v0 already supports preview across `draft`, `revise`, and `evidence`. The next bounded improvement should tighten trust in the factory’s local reporting before additional usability or polish work is layered on top.

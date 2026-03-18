# Execution Plan - motion-0065

## Goal
Harden Motion Factory v0 status reporting so human-readable and JSON-readable output reflect the same local truth, and so motion inventory is reported explicitly rather than implied through a single motion count.

## Plan
1. Add a shared motion inventory helper that derives:
   - existing motion directory count
   - highest discovered motion number/id
   - next motion id
   - missing motion ids when present
2. Refactor `buildContext()` to use the shared inventory helper for motion counting and next-id derivation.
3. Add a shared status snapshot builder so `status` and `status --json` are rendered from the same snapshot object.
4. Preserve all existing `draft`, `revise`, and `evidence` command semantics.
5. Validate syntax and compare terminal status output to JSON status output.

## Files touched
- `portal/scripts/motion-factory.mjs`

## Files explicitly not touched
- `draft` command semantics
- `revise` command semantics
- `evidence` command semantics
- motion package structural-file trust boundaries
- ratification workflow semantics

## Rollback plan
Revert the `motion-factory.mjs` status/inventory refactor if status output becomes misleading or incompatible. Because the change is local to status/context inventory reporting, rollback does not require modifying existing motion packages.

## Acceptance criteria
- `node --check portal/scripts/motion-factory.mjs` passes.
- `status` and `status --json` are both emitted from the same shared snapshot logic.
- `status --json` includes a `motion_inventory` object.
- `status` human output explicitly shows motion directory count and highest motion id.
- Missing motion ids are surfaced when present.
- Existing command behavior outside status/context remains unchanged.

## Done means
Motion Factory v0 status reporting is more explicit, more internally consistent, and easier to trust during local governance workflow review.

## Implementation evidence
- `node --check portal/scripts/motion-factory.mjs` passed.
- `node portal/scripts/motion-factory.mjs status` returned:
  - `Next motion ID: motion-0066`
  - `Motion dirs: 65`
  - `Highest motion ID: motion-0065`
  - `Missing motions: (none)`
- `node portal/scripts/motion-factory.mjs status --json` returned:
  - `next_motion_id: "motion-0066"`
  - `total_motions: 65`
  - `motion_inventory.existing_motion_directory_count: 65`
  - `motion_inventory.highest_discovered_motion_id: "motion-0065"`
  - `motion_inventory.missing_motion_ids: []`
  - `file_scopes.evidence_default: ["proposal.md", "execution.md"]`

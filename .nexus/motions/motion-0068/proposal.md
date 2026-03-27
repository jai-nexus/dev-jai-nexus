# Proposal - motion-0068

## Title
bounded candidate promotion to Motion Factory draft

## Why this motion exists
motion-0066 added candidate prep artifact emission. motion-0067 added
candidate discovery. But there is no governed path to turn a discovered
candidate into a numbered formal motion. The operator must manually read
the candidate's intent and type it into `draft --intent`, losing the
lineage between prep artifact and formal motion.

This motion closes the loop by adding an operator-driven promote command
that reads a candidate artifact and creates a formal draft with explicit
lineage.

## Three-artifact boundary (preserved)
- **WaveTask** — operator work unit in Waves. Not modified.
- **Candidate Motion** — prep-layer artifact in `.nexus/candidates/`.
  Status updated from `emitted` to `promoted` on promotion. Not deleted.
  Not moved into `.nexus/motions/`.
- **Formal Motion** — governed 9-file package in `.nexus/motions/`.
  Created by promote via the existing draft pipeline. Subject to council
  gates and ratification.

Promotion creates lineage between these artifacts. It does not collapse
them.

## What this motion adds

### promote command
```
node portal/scripts/motion-factory.mjs promote --candidate <candidateId> [--no-api] [--provider openai|anthropic] [--preview]
```

### What promote does
1. Reads `.nexus/candidates/<candidateId>.json`
2. Validates the candidate exists and is parseable
3. Validates the candidate status is `emitted` (not already promoted)
4. Validates the candidate has an `intent` field
5. Uses the candidate's `intent` field as the draft intent
6. Runs the existing draft pipeline (context → narrative → 9-file package)
7. **Skips candidate emission** — the candidate already exists, so no new
   candidate artifact is created
8. Creates the formal motion directory and writes 9 files
9. Creates `promotion.json` in the formal motion directory
10. Updates the candidate artifact: sets `status` to `promoted` and
    `targetMotionId` to the new motion ID

### promotion.json (durable lineage record)
**Path:** `.nexus/motions/motion-NNNN/promotion.json`
```json
{
  "version": "0.1",
  "candidateId": "cm-20260326-013248-test-discovery-target",
  "promotedTo": "motion-0069",
  "promotedAt": "2026-03-26T02:00:00.000Z",
  "promotedBy": "operator",
  "candidateIntent": "Test discovery target"
}
```

**Key properties:**
- Created only by promote, never by draft
- Lives inside the formal motion directory alongside the 9-file package
- Not a governance file — not validated by council gates
- **Source of truth for completed promotion** — if this file exists, the
  promotion happened regardless of candidate artifact state

### Candidate artifact update on promotion
After successful creation of the formal draft and promotion.json, the
source candidate artifact is updated in place with two field changes:
- `status`: `"emitted"` → `"promoted"`
- `targetMotionId`: updated to the new motion ID

No other fields are modified. This is a single bounded mutation, not
a lifecycle engine.

### Atomicity and source of truth
Promotion follows this write order:
1. Create formal motion directory + 9 files
2. Write promotion.json inside the formal motion directory
3. Update candidate artifact (status → promoted, targetMotionId)

**promotion.json is the durable source of truth.** The system guarantees:
- If promotion.json does not exist, no promotion happened
- If promotion.json exists, promotion is considered complete

**Candidate write-back is intended but not guaranteed.** In the normal
case, the candidate artifact is updated after promotion.json is written.
If candidate write-back fails:
- The formal motion and promotion.json still exist (promotion is complete)
- The candidate artifact may still show `status: emitted`
- The promote command surfaces a clear reconciliation warning:
  "Promotion complete but candidate artifact update failed. Manual
  reconciliation may be needed."
- The operator can manually update the candidate or re-run a future
  reconciliation tool

This is not full atomicity across both artifacts. It is ordered writes
with a clear source of truth and explicit reconciliation surface.

### Failure before promotion.json
If any step fails before promotion.json is written:
- No formal motion directory is created (or it is cleaned up)
- No promotion.json exists
- Candidate artifact is not updated
- Promotion did not happen

### Preview mode
`promote --preview` shows:
- The candidate being promoted
- The provisional motion ID
- The proposed 9-file package (same as draft --preview)
- The proposed promotion.json content
- Writes nothing, updates nothing

### Error cases (all fail before any writes)
- Missing candidate file → clear error
- Malformed candidate JSON → clear error
- Candidate status is not `emitted` → clear error
- Missing `intent` field in candidate → clear error

### --no-api and --provider support
Same as draft:
- `--no-api` creates a placeholder scaffold draft from the candidate
- `--provider anthropic` uses Anthropic for narrative generation
- Default provider is OpenAI

## What this motion does not change
- draft command (unchanged — still emits its own candidate)
- revise command (unchanged)
- evidence command (unchanged)
- context command (unchanged)
- status command (unchanged)
- Council gates and vote semantics (unchanged)
- Candidate artifact shape (only status and targetMotionId updated)

## What this motion does not add
- No automatic promotion
- No candidate lifecycle beyond emitted → promoted
- No Waves UI rendering
- No planner mapping
- No transport dependencies
- No deletion or archival of promoted candidates
- No full cross-artifact atomicity guarantee

## Design stance
Promotion is the third step in the emit → discover → promote sequence.
It connects prep artifacts to formal governance while preserving the
boundary between them. The promote command reuses the existing draft
pipeline and adds lineage. promotion.json is the source of truth. It
does not invent new governance machinery.

## Why now
The emission/discovery loop is proven. Promotion is the smallest useful
step that makes candidate artifacts actionable without adding automation,
lifecycle complexity, or UI dependencies.

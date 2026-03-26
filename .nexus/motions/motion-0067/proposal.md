# Proposal - motion-0067

## Title
candidate artifact discovery in Motion Factory status and context

## Why this motion exists
motion-0066 gave Motion Factory a write path for candidate prep artifacts.
Draft flow now emits `candidate.motion.json` files under `.nexus/candidates/`.
But the factory's read commands — status and context — have no awareness
of these artifacts. The operator must manually inspect the candidates
directory to see what has been emitted.

This motion adds the complementary read path: discovery and reporting of
already-emitted candidate artifacts.

## What this motion adds

### enumerateCandidates helper
A new helper function that discovers candidate artifacts:
```javascript
async function enumerateCandidates(repoRoot) {
    // reads .nexus/candidates/*.json
    // returns { candidates: [...], skipped_malformed: number }
    // each candidate: { candidateId, intent, status, createdAt, targetMotionId }
    // sorted by createdAt descending (most recent first)
    // malformed files are skipped and counted
}
```

This reads only fields already present in the emitted artifact shape.
It does not anticipate promotion fields or lifecycle states not yet
emitted.

**Fields read from each candidate artifact:**
- `candidateId` — displayed as identifier
- `intent` — displayed as human-readable summary
- `status` — displayed as lifecycle state
- `createdAt` — used for sorting and recency
- `targetMotionId` — displayed as linkage to formal motion

**Fields available in --json but not displayed by default:**
- `version`, `source`, `provider`, `noApi`

**Fields not anticipated:**
- No promotion fields
- No lifecycle transitions beyond what is already emitted

### status command changes
New section in status output:
```
[MOTION-FACTORY] Candidates:
[MOTION-FACTORY]   Directory:       .nexus/candidates/
[MOTION-FACTORY]   Count:           3
[MOTION-FACTORY]   Skipped:         0 malformed
[MOTION-FACTORY]   Most recent:     cm-20260325-154732-test-candidate-emission
```

In `--json` output, a new `candidates` field:
```json
{
  "candidates": {
    "directory": ".nexus/candidates/",
    "count": 3,
    "skipped_malformed": 0,
    "most_recent": {
      "candidateId": "cm-20260325-154732-test-candidate-emission",
      "intent": "Test candidate emission",
      "status": "emitted",
      "createdAt": "2026-03-25T15:47:32.000Z",
      "targetMotionId": "motion-0067"
    }
  }
}
```

`status --json` reports `most_recent` only — it does **not** include an
unbounded full candidate list. The full windowed list is available in
`context --json` where it parallels `recent_motions`.

If no candidates exist, status reports count 0, skipped_malformed 0, and
most_recent null.

### context command changes
New section in context output, after recent motions:
```
[MOTION-FACTORY] Recent candidates:
[MOTION-FACTORY]   cm-20260325-154732-test-candidate-emission: Test candidate emission [emitted] → motion-0067
```

In `--json` output, a new `recent_candidates` field alongside
`recent_motions`:
```json
{
  "recent_candidates": [
    {
      "candidateId": "cm-20260325-154732-test-candidate-emission",
      "intent": "Test candidate emission",
      "status": "emitted",
      "createdAt": "2026-03-25T15:47:32.000Z",
      "targetMotionId": "motion-0067"
    }
  ]
}
```

Context shows the most recent N candidates (same window as recent
motions, defaulting to RECENT_MOTION_WINDOW = 5).

### Storage posture
`.nexus/candidates/` is treated as a **durable governance-prep surface**.
It is not a temp cache, not gitignored, and not subject to automatic
cleanup. Candidate artifacts persist and are discoverable across sessions.

### Error handling and malformed file reporting
- If `.nexus/candidates/` does not exist → count 0, skipped_malformed 0, no error
- If a candidate JSON file is malformed → skip it, increment skipped_malformed count,
  log a warning to stderr, continue discovering remaining candidates
- Discovery never fails fatally — it degrades gracefully
- `skipped_malformed` is reported in both human-readable and --json output
  so the operator can see if any candidate files need attention

## What this motion does not change
- draft command (unchanged — emission behavior from motion-0066 preserved)
- revise command (unchanged)
- evidence command (unchanged)
- Candidate artifact shape (unchanged)
- .nexus/motions/ directory (unchanged)
- Council gates and vote semantics (unchanged)

## What this motion does not add
- No candidate promotion
- No lifecycle transitions
- No Waves UI rendering
- No planner mapping
- No transport dependencies
- No new candidate fields

## Design stance
This is the read complement to motion-0066's write path. Discovery
validates that the emitted candidate shape is usable for real consumption.
It surfaces any naming or shape issues before promotion or Waves
integration builds on top.

## Why now
Emission without discovery is half the loop. Adding the read path before
promotion means promotion can build on proven discovery rather than
inventing its own candidate enumeration.

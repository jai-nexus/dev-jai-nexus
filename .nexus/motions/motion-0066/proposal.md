# Proposal - motion-0066

## Title
candidate.motion prep artifact emission in Motion Factory draft flow

## Why this motion exists
Candidate Motion is canonically representable upstream in jai-format.
But Motion Factory draft flow goes straight from operator intent to formal
9-file motion package with no durable local prep artifact in between.
There is no record of the prep-layer state that preceded the formal draft,
and no identity linking prep intent to the resulting motion.

This motion closes that gap by emitting a local `candidate.motion.json`
prep artifact during draft flow, aligned with the upstream canonical
direction but without claiming local schema authority.

## Upstream alignment, not local authority
The canonical `candidate.motion` contract is defined upstream in jai-format.
This motion does not redefine, extend, or claim authority over that contract.
It emits a bounded local prep artifact whose field names match the canonical
upstream contract where applicable, with clearly distinguished local
emission metadata. If the upstream contract evolves, the local emission
shape should be updated in a future motion.

## Three-artifact boundary (preserved)
- **WaveTask** — operator work unit in Waves. Not a governance artifact.
  Not modified by this motion.
- **Candidate Motion** — prep-layer artifact representing a potential future
  motion. Has a `candidateId` and lifecycle status. Emitted locally during
  draft flow. Not a formal motion.
- **Formal Motion** — governed 9-file package in `.nexus/motions/`. Created
  by Motion Factory. Subject to council gates and ratification. Unchanged.

## What this motion adds

### candidateId generation
During draft flow, a `candidateId` is generated before any files are
written. The ID is deterministic and human-readable:
```
cm-<YYYYMMDD>-<HHmmss>-<short-intent-slug>
```

Example: `cm-20260319-174500-legacy-cleanup`

The slug is lowercase, hyphenated, and truncated to ~40 characters.

### Collision handling
If `.nexus/candidates/<candidateId>.json` already exists, draft fails
with a clear error before writing anything. No candidate file is
overwritten and no motion directory is created. This is the same
fail-before-write posture used for motion directory collision.

### candidate.motion.json emission
**Path:** `.nexus/candidates/<candidateId>.json`
```json
{
  "version": "0.1",
  "candidateId": "cm-20260319-174500-legacy-cleanup",
  "title": "Legacy cleanup motion",
  "status": "emitted",
  "source": "motion-factory:draft",
  "createdAt": "2026-03-19T17:45:00.000Z",
  "targetMotionId": "motion-0067",
  "provider": "openai",
  "noApi": false
}
```

**Field semantics — canonical upstream fields:**
- `candidateId` — unique identifier (canonical upstream field)
- `title` — human-readable intent, unmodified (canonical upstream field)
- `status` — lifecycle status (canonical upstream field; always "emitted" at creation)
- `source` — origin identifier (canonical upstream field; always "motion-factory:draft" here)
- `createdAt` — ISO 8601 timestamp (canonical upstream field)

**Field semantics — local emission metadata:**
- `version` — local artifact version, "0.1" in this motion
- `targetMotionId` — the motion ID that draft will create (local; not in upstream contract)
- `provider` — which provider was selected: openai, anthropic, or placeholder (local)
- `noApi` — whether --no-api was used (local)

Canonical field names match the upstream jai-format `candidate.motion`
contract exactly. Local emission metadata fields are additions specific
to Motion Factory draft flow and are clearly distinguished above.

**Key properties:**
- Emitted as a local prep artifact, not as an upstream schema authority
- Canonical field names preserved without rename
- Stored under `.nexus/candidates/`, never under `.nexus/motions/`
- Not a governance artifact — not validated by council gates
- Not part of the formal 9-file motion package

### Repo-tracked storage
`.nexus/candidates/` and its contents are **repo-tracked** — they are
committed to git alongside formal motion artifacts. This ensures candidate
prep artifacts are durable, auditable, and visible to all operators.
They are not gitignored or treated as ephemeral local state.

### Atomicity: candidate + formal draft
Candidate emission is **atomic with draft apply**:
- Both `.nexus/candidates/<candidateId>.json` and `.nexus/motions/<motionId>/`
  must be created successfully, or neither is written.
- If candidate emission fails, draft apply fails. No motion directory is created.
- If formal draft generation fails after candidate emission, the candidate
  file is cleaned up.
- If candidateId collides with an existing file, draft fails before any writes.

In preview mode, neither artifact is written. The provisional candidateId
is shown in stdout for inspection only.

### Storage separation
```
.nexus/
  candidates/           ← local prep artifacts, repo-tracked (new)
    cm-20260319-174500-legacy-cleanup.json
  motions/              ← formal motions (unchanged)
    motion-0067/
      motion.yaml
      proposal.md
      ...
```

### Draft output changes

**Apply mode — new lines added to existing output:**
```
[MOTION-FACTORY] Candidate ID:  cm-20260319-174500-legacy-cleanup
[MOTION-FACTORY] Candidate:     .nexus/candidates/cm-20260319-174500-legacy-cleanup.json
```

**Preview mode — new lines added to existing output:**
```
[MOTION-FACTORY] Candidate ID:  cm-20260319-174500-legacy-cleanup (provisional)
[MOTION-FACTORY] Candidate:     (preview only — no candidate artifact written)
```

### --no-api behavior
When `--no-api` is used, a candidate artifact is still emitted. The
`provider` field is set to `"placeholder"` and `noApi` is `true`.
The candidate represents the intent regardless of narrative generation.

## What this motion does not change
- Formal motion 9-file package generation (unchanged)
- revise command (unchanged)
- evidence command (unchanged)
- context command (unchanged)
- status command (unchanged)
- Council gates and vote semantics (unchanged)
- .nexus/motions/ directory structure (unchanged)

## What this motion does not add
- No promotion path from candidate to formal motion (future motion)
- No Waves UI rendering of candidates
- No planner-output mapping
- No jai-format validation of emitted artifact
- No automated lifecycle transitions
- No transport or bridge dependencies

## Design stance
This is the smallest useful step toward making prep state explicit in
dev-jai-nexus. It emits a durable, repo-tracked local artifact with
identity during the draft flow that already exists. It does not add
consumption, promotion, UI, or automation. It does not claim upstream
schema authority. Canonical field names are preserved exactly.

## Why now
The upstream canonical contract direction is settled. Motion Factory is
complete and preview-proven. Emitting the local prep artifact is the
narrowest step that connects the factory to the prep layer.

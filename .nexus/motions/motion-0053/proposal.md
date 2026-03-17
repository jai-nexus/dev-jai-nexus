# Proposal - motion-0053

## Title
Motion Factory v0 — deterministic package scaffold

## Why this motion exists
motion-0052 proved that the factory can gather and display inspectable context.
But the factory still cannot create files. Every motion package requires 9
files with correct IDs, protocol versions, vote structures, and directory
layout. That structural scaffolding is deterministic — it does not require a
model. Building it now means:
- the human gets immediate scaffolding relief,
- future model-assisted narrative generation (motion-0054) has a proven
  structural foundation to fill in,
- and the scaffold itself can be tested independently of any API call.

## What this motion adds

### draft command in portal/scripts/motion-factory.mjs

**Invocation:**
```
node portal/scripts/motion-factory.mjs draft --intent "Reconcile model-routing.yaml with Phase 1 canon"
```

**What it does:**
1. Runs context gathering (reuses motion-0052 logic)
2. Determines next motion ID from `.nexus/motions/`
3. Checks that `.nexus/motions/motion-NNNN/` does not already exist — if it
   does, stops with a clear error
4. Creates `.nexus/motions/motion-NNNN/` and writes 9 files
5. Prints a summary of created files and a reminder that narrative completion
   is required before ratification

**Deterministic structural files:**
- `policy.yaml` — protocol_version, vote_mode, required_voters, risk defaults,
  all derived from `.nexus/council.config.yaml`
- `decision.yaml` — DRAFT, ratified_by null
- `vote.json` — PENDING, empty votes, all required roles listed as missing
- `verify.json` — required_ok false, gates not yet executed

**Intent-seeded structural file:**
- `motion.yaml` — motion_id, title (from --intent), status proposed,
  created_at (current timestamp), owner, target domain/repo, placeholder
  sections with explicit markers:
  - `Draft scaffold — summary pending`
  - `Draft scaffold — problem statement pending`
  - `Draft scaffold — proposal pending`
  - `Draft scaffold — non-goals pending`
  - `Draft scaffold — success criteria pending`

**Placeholder narrative files:**
- `proposal.md` — title header, original intent, and explicit marker:
  "Draft scaffold — narrative content pending"
- `challenge.md` — section headers with explicit marker:
  "Draft scaffold — risks and objections pending"
- `execution.md` — section headers with explicit marker:
  "Draft scaffold — execution plan pending"
- `decision.md` — "DRAFT — awaiting vote"

## Scaffold-only design
Generated packages are **structurally complete but narratively incomplete**
by design. They are not expected to be immediately ratifiable. Before
council:run, a human or a later factory generation step must fill in
narrative content in motion.yaml, proposal.md, challenge.md, and
execution.md. The explicit "Draft scaffold" markers make incomplete
sections visually obvious.

## Safety
- Refuses to create if the target motion directory already exists
- No overwrite or force behavior in this motion
- Writes only to the motion directory
- No API calls
- No git commands

## What this motion does not add
- No model API call
- No narrative generation
- No revision command
- No overwrite behavior
- No evidence tables or PASS/FAIL claims

## What existing surfaces are reused
- Context-gathering logic from motion-0052 (same script)
- Governance defaults from `.nexus/council.config.yaml`
- Motion directory enumeration from the context command

## Design stance
This is deterministic infrastructure. It separates structural scaffolding
from model-generated narrative. The scaffold is independently testable and
useful even without an API call — a human can fill in the placeholder
narrative files manually, which is already faster than creating all 9 files
from scratch.

## Why now
The factory context substrate is proven. The next relief step is eliminating
the manual creation of 9 correctly structured files per motion. This is
the highest-leverage deterministic step before adding model assistance.

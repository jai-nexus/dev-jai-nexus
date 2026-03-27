# Proposal - motion-0052

## Title
Motion Factory v0 — context gathering scaffold

## Why this motion exists
Motions 0046 through 0051 proved the Phase 1 executor substrate but were all
authored manually. Each motion package took 20–40 minutes of structured
drafting. The stated priority is now reducing that overhead through governed
motion automation.

Motion Factory v0 will eventually draft and revise motion packages, but the
first bounded step is inspectable context gathering. Before any model can
generate useful motion content, it needs structured context about the current
repo state, recent motions, governance config, and human intent.

This motion adds the first user-facing surface: a `context` command that
gathers and prints that context for human inspection.

## Why context gathering first
- It is deterministic — no model call, no generation, no writes
- It is independently inspectable — the human can verify the context before
  any generation step uses it
- It establishes the input contract for future `draft` and `revise` commands
- It is the smallest useful step toward the factory

## What this motion adds

### portal/scripts/motion-factory.mjs

A new script with one command: `context`.

**Invocation:**
```
node portal/scripts/motion-factory.mjs context --intent "Reconcile model-routing.yaml with Phase 1 canon"
```

**What it reads:**
- `.nexus/motions/` — enumerates motion directories, determines the last
  motion ID and next motion ID, reads the last 3–5 motion.yaml files for
  recent context
- `.nexus/model-slots-phase1.yaml` — reads Phase 1 staffing summary
  (provider count, live slot count, deferred selector count, voting roles)
- `.nexus/agent-panels.yaml` — reads panel count and candidate counts
- `.nexus/council.config.yaml` — reads protocol version, vote mode,
  required roles
- Git state — current branch and head commit via `git rev-parse`

**What it prints:**
A structured summary to stdout containing:
- repo, branch, head commit
- next motion ID
- recent motions (last 3–5 with title and status)
- governance config summary (vote mode, required roles, protocol version)
- staffing summary (providers, live slots, deferred selectors, voting roles)
- panel summary (panel count, candidates per panel)
- human intent (from --intent flag)

**Optional --json flag:** prints the same context as a JSON object instead
of human-readable text.

**What it does not do:**
- no file writes
- no model API calls
- no motion generation
- no revision

## What existing surfaces are reused
The script reuses patterns from `generate-repo-capsule.mjs` and
`generate-context-bundle.mjs`:
- repo root discovery via `.nexus/` directory walk
- git helper for branch and commit
- fs helpers for reading YAML files

It does not import from or depend on those scripts directly. It is a
standalone script with its own focused scope.

## What this motion does not change
- No existing scripts are modified
- No governance config files are modified
- No motion files are generated

## Design stance
This is the first bootstrap step toward Motion Factory v0. It proves the
context-gathering surface works and produces inspectable output before any
generation logic is added.

## Why now
The manual drafting bottleneck is the current pain point. Building the factory
context step now means the next motion (deterministic package scaffold) can
build on proven context assembly rather than inventing it inline.

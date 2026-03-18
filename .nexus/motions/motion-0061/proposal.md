# Proposal - motion-0061

## Title
Motion Factory v0 — status command for operator visibility

## Why this motion exists
The operator playbook (motion-0060) documents the factory workflow as static
markdown. But when an operator opens a new session or switches branches, they
need a quick way to check live factory configuration: are API keys present
in the environment, what is the next motion ID, what branch am I on, what
are the file scopes.

This motion adds a single status command that answers those questions.

## status vs context
These two commands serve different purposes:

- **status** = factory configuration and readiness snapshot. Reports what
  the factory is, what commands are available, what providers and keys are
  configured, and what the file scopes are. No intent required. No API calls.
- **context** = motion-specific repo context for a given intent. Reports
  recent motions, staffing state, governance config, and the next motion ID
  in the context of a specific operator intent. Requires --intent.

Status tells the operator the factory is ready to use. Context tells the
operator what the factory sees for a specific motion.

## What this motion adds

### status command in portal/scripts/motion-factory.mjs

**Invocation:**
```
node portal/scripts/motion-factory.mjs status
```

**Machine-readable:**
```
node portal/scripts/motion-factory.mjs status --json
```

**What it prints:**
```
[MOTION-FACTORY] Motion Factory v0 — Status
[MOTION-FACTORY] ─────────────────────────────────────────
[MOTION-FACTORY] Script version:    motion-factory.v0
[MOTION-FACTORY] Repo root:         C:\Users\...\dev-jai-nexus
[MOTION-FACTORY] Branch:            sprint/q1m3-council-pivot-polyrepo-coverage
[MOTION-FACTORY] Next motion ID:    motion-0062
[MOTION-FACTORY]
[MOTION-FACTORY] Commands:
[MOTION-FACTORY]   context   — inspect repo context (no files, no API)
[MOTION-FACTORY]   draft     — create 9-file motion package
[MOTION-FACTORY]   revise    — update narrative files from notes
[MOTION-FACTORY]   evidence  — insert proof evidence into narrative files
[MOTION-FACTORY]   status    — this command
[MOTION-FACTORY]
[MOTION-FACTORY] Providers:
[MOTION-FACTORY]   Default:    openai
[MOTION-FACTORY]   Supported:  openai, anthropic
[MOTION-FACTORY]   OPENAI_API_KEY:    present
[MOTION-FACTORY]   ANTHROPIC_API_KEY: present
[MOTION-FACTORY]   (Key presence is environmental only; does not validate
[MOTION-FACTORY]    correctness, funding, or provider reachability.)
[MOTION-FACTORY]
[MOTION-FACTORY] File scopes:
[MOTION-FACTORY]   Revise default:    proposal.md, challenge.md, execution.md
[MOTION-FACTORY]   Revise allowed:    proposal.md, challenge.md, execution.md, motion.yaml
[MOTION-FACTORY]   Evidence default:  proposal.md, execution.md
[MOTION-FACTORY]   Evidence allowed:  proposal.md, execution.md, challenge.md
[MOTION-FACTORY]   Protected:         policy.yaml, decision.yaml, decision.md, vote.json, verify.json
[MOTION-FACTORY]
[MOTION-FACTORY] Workflow:
[MOTION-FACTORY]   Placeholder-first: every motion starts with draft
[MOTION-FACTORY]   Structural files:  deterministic, never model-generated
[MOTION-FACTORY]   Human review:      required before ratification
[MOTION-FACTORY] ─────────────────────────────────────────
```

**Key properties:**
- No files written
- No API calls
- No arguments required (--json is optional)
- Safe to run anytime with no side effects
- Reuses existing helpers (findRepoRoot, git, enumerateMotions, nextMotionId)
- Key presence is reported as "present" or "missing" — the actual key value
  is never printed
- Key presence is environmental only: it confirms the environment variable
  exists, not that the key is valid, funded, or that the provider is reachable

## What this motion does not change
- No changes to existing commands (context, draft, revise, evidence)
- No governance config changes
- No staffing canon changes
- No new generation features

## What this motion does not validate
- Key correctness (a key could be present but invalid)
- Provider funding or credit balance
- Provider reachability or live API readiness
- Provider health

## Design stance
This is a minimal operator visibility command. It gives the operator a
single entry point for checking live factory configuration. It complements
the static playbook from motion-0060: the playbook explains how to use the
factory, the status command confirms the factory's configuration state.

## Why now
The factory is complete and documented. A live status command is the
smallest useful addition before any future expansion.

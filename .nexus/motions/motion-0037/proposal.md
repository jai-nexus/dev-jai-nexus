# Proposal - motion-0037

## Title
Claude Bootstrap Generator v0: substrate-aware setup pack + dated project handoff

## Why this motion exists
Motion-0033 added generated context bundles.
Motion-0035 added the formal context substrate.
Motion-0036 added the governed Claude-facing setup artifacts.

The next practical gap is packaging.

Right now, starting Claude project work still requires manual assembly of:
- `CLAUDE.md`
- Claude project artifacts
- substrate artifacts
- generated repo context

That means the setup is governed, but not yet machine-compiled.

## What this motion changes
This motion adds a Claude bootstrap generator that compiles the relevant setup artifacts into a dated output pack.

The goal is to make Claude setup begin from:
- one generated bootstrap handoff,
- stable ordering,
- compact reusable content,
- governed repo context rather than manual gathering.

## Expected output
A first v0 should generate artifacts such as:

- `YYYY-MM-DD_claude-bootstrap.md`
- `YYYY-MM-DD_claude-bootstrap_manifest.json`

Suggested output location:
- `surfaces/claude/`

If the repo prefers another governed generated location, preserve the same concept.

## What the bootstrap pack should include
At minimum:
- repo identity
- purpose summary
- role/governance summary
- references to formal substrate artifacts
- current recommended bootstrap set
- latest generated repo context references
- clear guidance for using Claude in a repo-centric way

## Why this matters
The goal is not merely to document Claude usage.
The goal is to make Claude setup reproducible, governed, and low-friction.

This motion turns the new Claude-facing operating layer into something that can be regenerated and reused consistently.

## Design stance
The pack should be:
- deterministic
- compact
- repo-specific
- governance-aware
- immediately useful

It should not be:
- a whole repo dump
- a generic AI instruction sheet
- a replacement for canonical motion or substrate artifacts

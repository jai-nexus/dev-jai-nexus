# Proposal: Corpus V2 governed activation proof v0 — proceed path

**Motion:** motion-0126
**Kind:** staged-activation-proof
**Parent motion:** motion-0125
**Date:** 2026-04-09

## Problem

motion-0125 implemented the first real Corpus V2 governed activation slice:
cost category declaration, `PROCEED` / `ESCALATE` / `BLOCK` activation outcome,
durable activation artifact, and propagation into handoff and receipt artifacts.

That slice now needs a bounded live proof. Without an actual motion proving the
`PROCEED` path, the branch still lacks a concrete post-opening example showing:
- declared cost category
- derived tier hint
- `PROCEED` outcome
- motion-linked work packet creation
- downstream persistence into handoff and receipt artifacts

## Proposal

Use motion-0126 itself as the first live Corpus V2 proof motion.

The proof will:
1. Declare a `standard` cost estimate in `execution.md`
2. Ratify motion-0126 with the normal modern artifact set
3. Issue `execution.handoff.json`
4. Run `activate-motion.mjs` in dry-run mode to confirm `PROCEED`
5. Run `activate-motion.mjs --create` to create a real motion-linked work packet
6. Record `execution.receipt.json` as `ACKNOWLEDGED` to prove receipt persistence
   honestly, without faking execution completion

## Scope

Bounded to `.nexus/motions/motion-0126/` and live invocation of the existing
governed scripts. No new implementation slice. No OffBook.ai work. No runtime
or schema expansion beyond what motion-0125 already introduced.

## Success criteria

- `motion-0126` validates and is ratified
- `execution.handoff.json` contains Corpus V2 cost metadata
- `execution.activation.json` records `PROCEED`
- a real work packet is created with `motion:`, `cost:`, and `activation:` tags
- `execution.receipt.json` preserves the same Corpus V2 metadata
- the proof remains honest: receipt status is not overstated beyond what was run

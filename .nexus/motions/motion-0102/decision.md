# Decision: Codex Execution Policy — Codex-exec / Claude-drafts operating split

**Motion:** motion-0102
**Kind:** codex-exec-policy

## Status

DRAFT

## Summary

Motion `motion-0102` establishes the formal operating split between Codex
(executor of repo-native workflows) and Claude (drafter of capabilities,
policies, and motion proposals).

Primary artifact: `.nexus/codex/codex-exec-policy.md`

## What was established

1. **Codex-eligible task classes** — ratification sweeps, status checks,
   motion scaffolding, proof lane execution, context bundle generation.

2. **Claude-retained responsibilities** — skill authoring, eval fixture design,
   new motion proposals, architecture decisions, gate script authorship.

3. **Handoff protocol** — Claude drafts → Codex executes `/motion-ratify` →
   ratification artifacts committed → PR merged.

4. **Non-delegation rules** — Codex must not propose new motions, edit substrate
   artifacts, or modify gate scripts without explicit Claude review.

5. **dev-jai-nexus boundary** — all governance surfaces, gate scripts, and
   DB-adjacent control plane remain in this repo.

## Program context

This motion is itself Claude-drafted and Codex-ratified — the first concrete
proof of the handoff protocol it defines.

Upcoming motions on this branch:
- motion-0103: Expand conditioning (`/motion-create`, `motion-status-eval.yaml`)
- motion-0104: Proof lane skill (`/run-proof-lane`)
